import { profileModalState } from '@/src/atoms/authModalAtom';
import { auth, db, storage } from '@/src/firebase/clientApp';
import { Modal, ModalOverlay, Input, Text, Image, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Button } from '@chakra-ui/react';
import { DocumentData, QueryDocumentSnapshot, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRecoilState } from 'recoil';
import { text } from 'stream/consumers';

type ProfileModalProps = {

};

const ProfileModal: React.FC<ProfileModalProps> = () => {
    const [modalState, setModalState] = useRecoilState(profileModalState)

    const [isChinhSua, setIsChinhSua] = useState(false)
    const [user] = useAuthState(auth)
    const [valueUser] = useCollection(collection(db, 'user'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        });
    const currentUserDoc = valueUser?.docs.find((doc) => doc.data().email == user?.email)
    const [textProfile, setTextProfile] = useState({
        name: '',
        born: '',
        live: '',
        image: '',
    })
    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false
        }))
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextProfile(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))


    }


    return (
        <Modal isOpen={modalState.open} onClose={handleClose} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'


                >
                    {/* {modalState.view == 'user' && ( */}
                        <Flex display='flex' flexDirection='column'
                        >
                            <Flex justify='center'>

                                {isChinhSua ?
                                    (
                                        <div>
                                            <label htmlFor="filePicker" style={{ fontSize: '10px', width: '100px' }}>
                                                <Image
                                                    src={currentUserDoc?.data().image ? currentUserDoc?.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                                                    boxSize='15vh'
                                                    borderRadius={50}

                                                />
                                            </label>
                                            <input id="filePicker" style={{ visibility: "hidden", width: '1px' }} type={"file"}

                                                onChange={({ target }) => {
                                                    if (target.files && user) {
                                                        const file = target.files[0];

                                                        const imageUserRef = ref(storage, `images/userid${currentUserDoc?.data().id}`)
                                                        uploadBytes(imageUserRef, file).then((snapshot) => {
                                                            console.log('uploaded')
                                                        }).then(() => {
                                                            getDownloadURL(imageUserRef).then((url) => {
                                                                setTextProfile(prev => ({
                                                                    ...prev,
                                                                    image: url
                                                                }))
                                                                updateDoc(doc(db, 'user', `userid${currentUserDoc?.data().id}`), {
                                                                     image: url,
                                                                    // born: textProfile.born,
                                                                    // name: textProfile.name,
                                                                    // live: textProfile.live
                                                                })




                                                            })
                                                        })
                                                    }
                                                }}
                                            ></input>
                                        </div>
                                    ) : (
                                        <Image
                                            src={currentUserDoc?.data().image ? currentUserDoc?.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                                            boxSize='15vh'
                                            borderRadius={50}

                                        />
                                    )
                                }

                            </Flex>
                            <Flex justify='center' mt={5} display='flex' flexDirection='row' fontSize={16}>
                                {isChinhSua ? (
                                    <div style={{ display: 'flex', flexDirection: 'row', }}>
                                        <Text>Tên: </Text>
                                        <Input
                                            placeholder={currentUserDoc?.data().name}
                                            ml={5}
                                            name='name'
                                            onChange={onChange}
                                        // value={currentUserDoc?.data().name ? currentUserDoc?.data().name : textProfile.name}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <Text>Tên: {currentUserDoc?.data().name ? currentUserDoc?.data().name : '(Chưa có)'} </Text>
                                    </div>
                                )
                                }
                            </Flex>
                            <Flex justify='center' mt={5} fontSize={16}>
                                {isChinhSua ? (
                                    <div style={{ display: 'flex', flexDirection: 'row', }}>
                                        <Text width='20vh'>Năm sinh: </Text>
                                        <Input
                                            placeholder={currentUserDoc?.data().born}
                                            ml={5}
                                            name='born'
                                            onChange={onChange}
                                        // value={currentUserDoc?.data().name ? currentUserDoc?.data().name : textProfile.name}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <Text>Năm sinh: {currentUserDoc?.data().born ? currentUserDoc?.data().born : '(Chưa có)'} </Text>
                                    </div>
                                )
                                }
                            </Flex>
                            <Flex justify='center' mt={5} fontSize={16}>
                                {isChinhSua ? (
                                    <div style={{ display: 'flex', flexDirection: 'row', }}>
                                        <Text
                                            width='10vh'
                                        >Nơi ở: </Text>
                                        <Input
                                            placeholder={currentUserDoc?.data().live}
                                            ml={5}
                                            name='live'
                                            onChange={onChange}
                                        // value={currentUserDoc?.data().name ? currentUserDoc?.data().name : textProfile.name}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <Text>Nơi ở: {currentUserDoc?.data().live ? currentUserDoc?.data().live : '(Chưa có)'} </Text>
                                    </div>
                                )
                                }
                            </Flex>
                            <Flex justify='center' mt={5}>
                                {isChinhSua ? (
                                    <Button onClick={() => {
                                        updateDoc(doc(db, 'user', `userid${currentUserDoc?.data().id}`), {
                                            // image: textProfile.image,
                                            born: textProfile.born,
                                            name: textProfile.name,
                                            live: textProfile.live
                                        })
                                        // setTextProfile({
                                        //     name: '',
                                        //     born: '',
                                        //     live: '',
                                        //     image: currentUserDoc?.data().image,
                                        // })
                                        setModalState((prev) => ({
                                            ...prev,
                                            open: false
                                        }))
                                        setIsChinhSua(false)
                                    }}>Cập nhật</Button>

                                ) : (
                                    <Button onClick={() => { setIsChinhSua(true) }}>Chỉnh sửa</Button>

                                )}
                            </Flex>

                        </Flex>
                    
                    {/* 
                    {modalState.view == 'other' && (
                        <Flex display='flex' flexDirection='column'
                        >
                             <Flex justify='center'>
                                <Image
                                    src={modalState.otherData?.data().image ? modalState.otherData?.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                                    boxSize='15vh'
                                    borderRadius={50}
                                />



                            </Flex>
                            <Flex justify='center' mt={5} display='flex' flexDirection='row' fontSize={16}>
                             
                                        <Text>Tên: {modalState.otherData?.data().name ? modalState.otherData?.data().name : '(Chưa có)'} </Text>
                                 
                            </Flex>
                            <Flex justify='center' mt={5} fontSize={16}>
                              
                                  
                                        <Text>Năm sinh: {modalState.otherData?.data().born ? modalState.otherData?.data().born : '(Chưa có)'} </Text>
                               
                            </Flex>
                            <Flex justify='center' mt={5} fontSize={16}>
                         
                                        <Text>Nơi ở: {modalState.otherData?.data().live ? modalState.otherData?.data().live : '(Chưa có)'} </Text>
                                
                            </Flex> 
                       

                        </Flex>


                        */}
                   


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
        </Modal >
    )
}
export default ProfileModal;