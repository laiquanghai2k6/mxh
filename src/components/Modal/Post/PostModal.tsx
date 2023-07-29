import { postModalState } from '@/src/atoms/authModalAtom';
import { Flex, Modal, ModalBody, Text, Image, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Input, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import AuthInput from '../Auth/AuthInput';
import OAuthButton from '../Auth/OAuthButton';
import ResetPassword from '../Auth/ResetPassword';
import { addDoc, collection, doc, setDoc ,orderBy, query, limit} from 'firebase/firestore';
import { auth, db, storage } from '@/src/firebase/clientApp';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDownloadURL, ref, uploadBytes} from 'firebase/storage';

type PostModalProps = {

};

const PostModal: React.FC<PostModalProps> = () => {
    const queryref = collection(db,"post")
    const q = query(queryref)
  

    const [value, loading, error] = useCollection(q,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      
    }
    )
   
 
       
    const [modalState, setModalState] = useRecoilState(postModalState)
    const [inputPost, setInputPost] = useState({
        text: '',
    })
    const [titlePost, setTitlePost] = useState({
        title: '',
    })
    const [imagePostUpload, setImagePostUpload] = useState<File>()
    const [imagePost, setImagePost] = useState('')
    const [user] = useAuthState(auth)
    const [imagePostRes,setImagePostRes] = useState('')


    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false
        }))
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputPost(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitlePost(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    const postUploadRefs = ref(storage,`images/postid${value?.docs.length + 1}.png`)
    // console.log('value?.docs[value.docs.length -1].id:',value?.docs[value.docs.length -1].data().id)
    // console.log(value?.docs)
    return (
        <Modal isOpen={modalState.open} onClose={handleClose} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'


                >


                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    pb={6}

                >
                    <Text color='black' fontWeight={700}>Tiêu đề</Text>

                    <Flex

                        direction='column'
                        align='center'
                        justify='center'
                        width='100%'
                    >

                        <Input
                            height='50px'
                            maxHeight='300px'
                            gridAutoColumns='2'
                            resize='both'
                            onChange={onChangeTitle}
                            value={titlePost.title}
                            placeholder='Nhập Tiêu đề'
                            name='title'
                        />
                        <Input
                        mt={10}
                            height='100px'
                            maxHeight='300px'
                            gridAutoColumns='2'
                            resize='both'
                            onChange={onChange}
                            value={inputPost.text}
                            placeholder='Nhập bình luận'
                            name='text'
                        />
                        {imagePost && <Image
                        mt={10}
                            boxSize='300px'
                            src={imagePost}
                        />}
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                           
                            <Button height='25px'
                                ml={3}
                                mt={2}
                                cursor='pointer'
                                onClick={async () => {
                                    let newDate = new Date()
                                    let date = newDate.getDate();
                                    let month = newDate.getMonth() + 1;
                                    let year = newDate.getFullYear();
                                    let day = date+"/"+month+"/"+year
                                    if(imagePost){
                                       await uploadBytes(postUploadRefs, imagePostUpload).then((snapshot) => {
                                            console.log('uploaded')
                                            // updateDoc(postRef, { comment: arrayUnion({ user: user?.email?.split("@")[0], text: inputComment.text, image: imageComment }) })
                                          
                                        })
                                        await getDownloadURL(postUploadRefs).then(async (url) => {
                                            // console.log(value?.docs[value.docs.length -1].data())
                                            console.log(value?.docs.length)
                                            console.log('url',url)
                                            await setDoc(doc(db, "post", `postid${value?.docs.length +1}`), {
                                                author: user?.email?.split("@")[0],
                                                comment:[],
                                                content:inputPost.text,
                                                date:day,
                                                id:value?.docs.length +1,
                                                like:0,
                                                title:titlePost.title,
                                                imagePost:url
                                             })

                                             
                                        })
                                    }else{
                                      
                                            await setDoc(doc(db, "post", `postid${value?.docs.length +1}`), {
                                                author: user?.email?.split("@")[0],
                                                comment:[],
                                                content:inputPost.text,
                                                date:day,
                                                id:value?.docs.length +1,
                                                like:0,
                                                title:titlePost.title,
                                                imagePost:''
                                             })

                                             
                                        
                                    }
                                        
                                    setModalState((prev) => ({
                                        ...prev,
                                        open: false
                                    }))
                                    console.log('added Doc')

                                

                                }}

                            >Gửi</Button>
                             <label htmlFor="filePicker" style={{ fontSize: '10px', width: '100px',marginLeft:'30px'  }}>
                             <Image
                                height='25px' src='/images/camera.png'
                                ml={3}
                                mt={2}
                            />
                            </label>
                            <input id="filePicker" style={{  visibility: "hidden", width: '1px'  }} type={"file"}

                                onChange={({ target }) => {
                                    if (target.files) {
                                        const file = target.files[0];
                                        setImagePost(URL.createObjectURL(file))
                                        setImagePostUpload(file)

                                    }
                                }}
                            ></input>


                        </div>


                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export default PostModal;