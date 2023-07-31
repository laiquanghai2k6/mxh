import { courseCreateAnswer, courseCreateImage, courseCreateModalState } from '@/src/atoms/authModalAtom';
import { auth, db, storage } from '@/src/firebase/clientApp';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Image, ModalBody, Text, Flex, Button, Input } from '@chakra-ui/react';
import { collection, query, orderBy, doc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { useCollection } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { forEachChild } from 'typescript';
import { useAuthState } from 'react-firebase-hooks/auth';

type CourseModalProps = {

};

const CourseModal: React.FC<CourseModalProps> = () => {

    const [courseCreateModalstates, setCourseCreateState] = useRecoilState(courseCreateModalState)
    const [courseImageCreate, setCourseImageCreate] = useState([])
    const [courseAnswerCreate, setCourseAnswerCreate] = useState([])
    const [inputTitle, setInputTitle] = useState({
        text: '',
    })
    const [user] = useAuthState(auth)

    const queryCourseRef = collection(db, 'course')
    const qCourse = query(queryCourseRef, orderBy("id", "asc"))

    const [courseValue] = useCollection(qCourse, {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    const [fakeArray, setFakeArray] = useState([])
    const [fakeArrayQuestion, setFakeArrayQuestion] = useState([])
    const [nImage, setNImage] = useState(0)
    const [nQuestion, setNQuestion] = useState(0)
    const [isSubmit, setIsSubmit] = useState(false)

    const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
       // @ts-ignore: Object is possibly 'null'.
        setNImage(event.target.value)
    }
    const onChangeQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
     // @ts-ignore: Object is possibly 'null'.
        setNQuestion(event.target.value)
    }
    const handleClose = () => {
        setCourseCreateState((prev) => ({
            ...prev,
            open: false
        }))
        setIsSubmit(false)
        setFakeArray([])
        setFakeArrayQuestion([])
        setCourseImageCreate([])
        setCourseAnswerCreate([])
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputTitle(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }


    return (
        <Modal isOpen={courseCreateModalstates.open} onClose={handleClose} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'

                >
                    <Text>Tạo khóa học</Text>


                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    pb={6}

                >

                    {!isSubmit ? (
                        <form style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Input
                                title='title'
                                name='text'
                                placeholder='Nhập tiêu đề khóa học'
                                onChange={onChange}
                                required

                            />
                            <Input
                                mt={10}
                                title='numberImage'
                                placeholder='Chọn số ảnh muốn tạo'
                                onChange={onChangeImage}
                                required
                                type='number'
                            />
                            <Input
                                mt={10}
                                title='numberQuestion'
                                onChange={onChangeQuestion}
                                required
                                placeholder='Chọn số câu hỏi muốn tạo'

                            />
                            <Button
                                mt={10}
                                type='submit'
                                width='100%'
                                onClick={() => {
                                    setIsSubmit(true)

                                    for (var i = 0; i < nImage; i++) {
                                        // @ts-ignore: Object is possibly 'null'.
                                        fakeArray[i] = i

                                    }
                                    for (var i = 0; i < nQuestion; i++) {
                                        // @ts-ignore: Object is possibly 'null'.
                                        fakeArrayQuestion[i] = i
                                    }

                                }}
                            >
                                Đồng ý
                            </Button>

                        </form>
                    ) : (
                        <Flex display='flex' flexDirection='column'>

                            {fakeArray.map((fakeArray, idx) => {
                                return (
                                    <Flex key={idx} mt={4}>
                                        <Text>Chọn ảnh thứ {idx + 1}: </Text>
                                        <label htmlFor={`filePicker${idx}`} style={{ fontSize: '20px', width: '100px' }}>
                                            <Image
                                                height='25px' src='/images/camera.png'
                                                ml={5}
                                                
                                            />

                                        </label>
                                        <input id={`filePicker${idx}`} style={{ visibility: "hidden", width: '1px' }} type={"file"}

                                            onChange={({ target }) => {
                                                if (target.files) {
                                                    // @ts-ignore: Object is possibly 'null'.
                                                    const imageCourseRef = ref(storage, `images/courseImageid${courseValue?.docs.length + 1}-${idx}`)

                                                    const file = target.files[0];
                                                    const currentImage = (URL.createObjectURL(file))
                                                    uploadBytes(imageCourseRef, file).then((snapshot) => {
                                                        console.log('uploaded')
                                                    }).then(() => {
                                                        getDownloadURL(imageCourseRef).then((url) => {
                                                            const updateImage = [...courseImageCreate]
                                                            // @ts-ignore: Object is possibly 'null'.
                                                            updateImage[idx] = url

                                                            
                                                            setCourseImageCreate(updateImage)

                                                        })
                                                    })




                                                }



                                            }

                                            }
                                        ></input>

                                        <Image
                                            src={courseImageCreate[idx]}
                                            boxSize='35vh'
                                        />
                                    </Flex>
                                )
                            })}
                            <Text mt={5} fontWeight={799}>Chọn đáp án cho {nQuestion} câu</Text>
                            {fakeArrayQuestion.map((fakeArray, idx) => {
                                var s = ""
                                return (
                                    <Flex key={idx} mt={4} flexDirection='row' display='flex'>
                                        <Text fontSize={15}>Câu</Text>
                                        <Text fontSize={15}>{`${s} ${idx + 1}`}</Text>
                                        <form id={`choices${idx}`} style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginLeft: '10px'
                                        }}><label >

                                                A <input type="radio" id="A" name="fav" value={1}
                                                /></label>
                                            <label >
                                                B <input type="radio" id="B" name="fav" value={2}
                                                />
                                            </label>
                                            <label >
                                                C <input type="radio" id="C" name="fav" value={3}
                                                />
                                            </label>
                                            <label >
                                                D <input type="radio" id="D" name="fav" value={4}
                                                />
                                            </label>
                                        </form>
                                    </Flex>

                                )
                            })}
                            <Button mt={7}
                                onClick={async () => {
                                    var s
                                    let newDate = new Date()
                                    let date = newDate.getDate();
                                    let month = newDate.getMonth() + 1;
                                    let year = newDate.getFullYear();
                                    let day = date+"/"+month+"/"+year
                                    for (var i = 0; i < fakeArrayQuestion.length; i++) {
                                        var choices = document.getElementById(`choices${i}`)
                                        // @ts-ignore: Object is possibly 'null'.
                                        for (s = 0; s < choices.length; s++) {
                                            // @ts-ignore: Object is possibly 'null'.
                                            if (choices[s].checked) {
                                                // @ts-ignore: Object is possibly 'null'.
                                                courseAnswerCreate[i] = parseInt(choices[s].value)
                                            }
                                        }

                                    }
                                    // @ts-ignore: Object is possibly 'null'.
                                    await setDoc(doc(db,'course',`courseid${courseValue?.docs.length + 1}`),{
                                        author:user?.email?.split("@")[0],
                                        date:day,
                                        // @ts-ignore: Object is possibly 'null'.
                                        id:courseValue?.docs.length + 1,
                                        // @ts-ignore: Object is possibly 'null'.
                                        question:parseInt(nQuestion,10),
                                        title:inputTitle.text,
                                        view:0,
                                        image: arrayUnion(courseImageCreate[0]),
                                        answer:arrayUnion(courseAnswerCreate[0])

                                    })
                                    for(var d = 1 ; d < courseImageCreate.length;d++){
                                        // @ts-ignore: Object is possibly 'null'.
                                         updateDoc(doc(db,'course',`courseid${courseValue?.docs.length + 1}`),{
                                            image: arrayUnion(courseImageCreate[d])
                                        })
                                    }
                                    for(var f = 1 ; f < courseAnswerCreate.length;f++){
                                        // @ts-ignore: Object is possibly 'null'.
                                         updateDoc(doc(db,'course',`courseid${courseValue?.docs.length + 1}`),{
                                            answer: arrayUnion(courseAnswerCreate[f])
                                        })
                                    }
                                    setCourseCreateState((prev) => ({
                                        ...prev,
                                        open: false
                                    }))
                                    setIsSubmit(false)
                                    setFakeArray([])
                                    setFakeArrayQuestion([])
                                    setCourseImageCreate([])
                                    setCourseAnswerCreate([])


                                }

                                }

                            >Tạo</Button>

                        </Flex>
                    )
                    }




                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export default CourseModal;