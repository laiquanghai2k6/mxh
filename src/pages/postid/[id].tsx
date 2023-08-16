import { listModalState } from '@/src/atoms/authModalAtom';
import { auth, db, storage } from '@/src/firebase/clientApp';
import { Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text } from '@chakra-ui/react';
import { arrayUnion, collection, doc, orderBy, query, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useCollection } from 'react-firebase-hooks/firestore';

type ComProps = {

};

const PostId: React.FC<ComProps> = () => {
    const [valueUser] = useCollection(collection(db, 'user'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        });
    const queryref = collection(db, "post")
    const q = query(queryref, orderBy("id", "desc"))
    const [value, loading, error] = useCollection(q,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        });
    // const currentPost = useRecoilValue(PostState)
    const [user] = useAuthState(auth)
    const route = useRouter()
    const currentPost = value?.docs.find(doc => doc.data().id == route.query.id)?.data()
    const postRef = doc(db, 'post', 'postid' + currentPost?.id);
    const [listModalStates, setListModalState] = useState(false)
    const [listIndex,setListIndex] = useState(0)


    const [imageCommentUpload, setImageCommentUpload] = useState<File>()
    const [imageComment, setImageComment] = useState('')


    const [inputComment, setInputComment] = useState({
        text: ''
    })
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputComment(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))


    }

    const commentRefs = ref(storage, `images/commentid${currentPost?.comment.length}.png`)

    // getDownloadURL(postRefs).then((url) => {
    //     // saveAs(url,'tesasd.png')
    //     setImage(url)

    // })
    const currentIdPostUser = valueUser?.docs.find(userPost => userPost.data().email.split("@")[0] == currentPost?.author)




    return (

        <div style={{
            overflowY: 'scroll',
            width: '100%',
            height: '90%', top: 30, bottom: 0,
            position: 'fixed',

        }}>
            {/* <Input type='file' 
            style={{marginTop:'50px'}}
            onChange={({target})=>{
                if(target.files){
                    const file = target.files[0];
                     setImage(URL.createObjectURL(file))
                    setUrl(file)
                   
                }
            }}
            
            /> */}
            {/* <Image height='30px' className='myimg' src={image} />
            <div onClick={()=>uploadBytes(postRefs,url).then((snapshot)=>{
            console.log('uploaded')
            }) 
        
        }>upload</div> */}



            <div style={{ marginTop: '70px', height: '100%', display: 'flex', flexDirection: 'row' }} >

                <Flex style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                    <Flex
                        bg='white'
                        mt={10}
                        justify='flex-start'
                        display='flex'
                        flexDirection='row'
                        mr={100}
                        ml={100}
                        borderRadius={10}
                    >
                        <Image src={currentIdPostUser?.data().image ?currentIdPostUser?.data().image: 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                            height='40px'
                            marginLeft='10px'
                            marginTop='5px'
                            borderRadius='20'
                        />
                        <Flex flexDirection='column'

                            width='100%'
                            ml={5}
                        >
                            <Flex
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}


                            >
                                <div style={{ fontSize: 14 }} > Đăng bởi {currentPost?.author} vào ngày {currentPost?.date}</div>
                                <div style={{
                                    fontWeight: '700',
                                    marginTop: 10

                                }}>{currentPost?.title}</div>

                                <div>{currentPost?.content}</div>
                                {currentPost?.imagePost != '' ? (
                                    <Image src={currentPost?.imagePost} boxSize='300px'
                                    />

                                ) : (
                                    <></>
                                )}

                            </Flex>

                            <Flex
                                display='flex'
                                flexDirection='row'
                                justify='flex-end'
                                alignItems='center'
                                mr={10}

                            >
                                <Text>{currentPost?.comment.length}</Text>
                                <Image src='/images/comment.png' height='25px' marginRight='15px' marginLeft='5px'
                                    cursor='pointer'

                                />
                                <Text>{currentPost?.like}</Text>

                                <Image src='/images/like.png' height='25px' marginBottom='5px' marginLeft='5px'
                                    cursor='pointer'
                                    onClick={() => {
                                        if (user) {
                                            updateDoc(postRef, { like: currentPost?.like + 1 });
                                        }else{
                                            alert('Vui lòng đăng nhập')
                                        }
                                    }}
                                />


                            </Flex>

                        </Flex>

                    </Flex>
                    <Flex
                        bg='white'
                        alignSelf='center'
                        mt={5}
                        width='70%'
                        borderRadius='70px'
                        paddingRight='10px'
                    >
                        <Input
                            onChange={onChange}
                            value={inputComment.text}
                            placeholder='Nhập bình luận'
                            name='text'
                        ></Input>
                        <Image height='25px' src='/images/send.png'
                            ml={3}
                            mt={2}
                            cursor='pointer'
                            onClick={() => {

                                if (!user) {
                                    alert('Vui lòng đăng nhập')
                                } else if(!imageComment && user){
                                    updateDoc(postRef, { comment: arrayUnion({ user: user?.email?.split("@")[0], text: inputComment.text, image: '' }) })

                                }
                                else{
                                    // @ts-ignore: Object is possibly 'null'.
                                    uploadBytes(commentRefs, imageCommentUpload).then((snapshot) => {
                                        console.log('uploaded')
                                        // updateDoc(postRef, { comment: arrayUnion({ user: user?.email?.split("@")[0], text: inputComment.text, image: imageComment }) })

                                    }).then(() => {
                                        getDownloadURL(commentRefs).then((url) => {
                                            //  saveAs(url,'tesasd.png')
                                            // setImage(url)
                                            updateDoc(postRef, { comment: arrayUnion({ user: user?.email?.split("@")[0], text: inputComment.text, image: url }) })

                                            setInputComment(prev => ({
                                                ...prev,
                                                text: ''
                                            }))
                                            setImageComment('')

                                        })
                                    })


                                }

                            }

                            }

                        />

                        <label htmlFor="filePicker" style={{ fontSize: '10px', width: '100px' }}>
                            <Image
                                height='25px' src='/images/camera.png'
                                ml={3}
                                mt={2}
                            />
                        </label>
                        <input id="filePicker" style={{ visibility: "hidden", width: '1px' }} type={"file"}

                            onChange={({ target }) => {
                                if (target.files && user) {
                                    const file = target.files[0];
                                    setImageComment(URL.createObjectURL(file))
                                    setImageCommentUpload(file)
                                }else{
                                    alert('Vui lòng đăng nhập')
                                }
                            }}
                        ></input>
                       

                    </Flex>
                    {imageComment && (
                        <Image
                            mt={5}
                            align='center'
                            alignSelf='center'
                            boxSize='300px'
                            src={imageComment}
                        />
                    )}
                    <Flex flexDirection='column-reverse'
                        justify='center'
                        align='center'
                        width='100%'

                        mt={5}
                    >
                        {// @ts-ignore: Object is possibly 'null'.
                        currentPost?.comment.map((cmt, id) => {
                            const currentUserCmt = valueUser?.docs.find(userCmt => userCmt.data().email.split("@")[0] == cmt?.user)
                            return (
                            <Flex
                                key={id}
                                bg='white'
                                mt={5}
                                borderRadius='20px'
                                width='70%'
                                padding='10px 15px'
                                display='flex'
                            >
                                <Flex
                                    flexDirection='column'
                                >
                                    <Flex display='flex'
                                        flexDirection='row'
                                    >
                                        <Image src={currentUserCmt?.data().image ? currentUserCmt?.data().image  :'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'  }height='30px'
                                            borderRadius='500px'

                                        />
                                        <Flex
                                            ml={3}
                                            fontWeight={600}
                                        >
                                            {cmt.user}
                                        </Flex>
                                    </Flex>
                                    <Flex
                                        ml={35}
                                    >{cmt.text}</Flex>
                                    {cmt?.image?.length > 5 ? (
                                        <Image
                                            boxSize='300px'
                                            src={cmt.image}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </Flex>

                            </Flex>

                        )})}
                    </Flex>


                </Flex>

                <Flex style={{ border: '1px solid green', flex: 1, overflowY: 'scroll', display: 'flex', flexDirection: 'column' }}
                    display={{ base: 'none', md: 'flex' }}

                >
                    {valueUser?.docs.map((user, id) => (
                     <Flex key={id} display='flex' flexDirection='row' bg='white'
                     mt={3} mb={1} borderRadius='10px' padding='5px'
                     cursor='pointer' align='center'
                     ml={2}
                     mr={2}
                     _hover={{
                       bg: 'gray.100'
                     }}
                     onClick={() => {
                       setListModalState(true)
                       setListIndex(id)
                     }}
                   >
                     <div>
                     {listModalState && (
                       <Modal isOpen={listModalStates} onClose={() => { setListModalState(false) }} >
                         <ModalContent>
                           <ModalHeader textAlign='center'
   
   
                           >
                             
                             <Flex display='flex' flexDirection='column' >
                                 <Flex justify='center'>
                                 <Image
                                   src={valueUser.docs[listIndex]?.data().image ? valueUser.docs[listIndex]?.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                                   boxSize='15vh'
                                   borderRadius={50}
                                 />
                                 </Flex>
                                 <Flex fontWeight='700' justify='center' mt={5} display='flex' flexDirection='row' fontSize={16}>
   
                                   <Text >Tên: {valueUser.docs[listIndex]?.data().name ? valueUser.docs[listIndex]?.data().name : '(Chưa có)'} </Text>
   
                                 </Flex>
                                 <Flex fontWeight='700' justify='center' mt={5} fontSize={16}>
   
   
                                   <Text>Năm sinh: {valueUser.docs[listIndex]?.data().born ? valueUser.docs[listIndex]?.data().born : '(Chưa có)'} </Text>
   
                                 </Flex>
                                 <Flex fontWeight='700' justify='center' mt={5} fontSize={16}>
   
                                   <Text>Nơi ở: {valueUser.docs[listIndex]?.data().live ? valueUser.docs[listIndex]?.data().live : '(Chưa có)'} </Text>
   
                                 </Flex>
   
   
                               </Flex>
   
                           </ModalHeader>
                           <ModalCloseButton />
                           <ModalBody
                               display='flex'
                               flexDirection='column'
                               alignItems='center'
                               justifyContent='center'
                               pb={6}
                           >
                             
   
   
                             
   
                           </ModalBody>
                         </ModalContent>
                       </Modal>
                     )}
                     </div>
   
                     <Image height='35px' width='35px' src={user.data().image ? user.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                       borderRadius='100px'
   
                     />
                     <Flex ml={3}>{user.data().email.split("@")[0]}</Flex>
                     <Image
                       src='https://th.bing.com/th/id/R.13284e9be62bd8ff1ad9afac1f1fbe60?rik=5wa7bTdun3cFXQ&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f1%2ff%2fa%2f787954-green-background-wallpaper-2560x1440-cell-phone.jpg&ehk=NlHlCXUgO4xLEvkAsU9G7E4%2fgSbdaaasgeToXQGiNhI%3d&risl=&pid=ImgRaw&r=0'
                       height='10px'
                       width='10px'
                       marginLeft='50px'
                       borderRadius='100px'
                     />
                   </Flex>
                    ))}

                </Flex>
            </div>



        </div>
    )
}




export default PostId;