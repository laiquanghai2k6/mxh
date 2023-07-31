import { finishModalState } from '@/src/atoms/authModalAtom';
import FinishModal from '@/src/components/Modal/Finish/FinishModal';
import { auth, db } from '@/src/firebase/clientApp';
import { Button, Flex, Image, Input, Select, Stack, Text } from '@chakra-ui/react';
import { collection, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRecoilState } from 'recoil';

type CourseIdProps = {

};



const CourseId: React.FC<CourseIdProps> = () => {
    const route = useRouter()
    const [modalState, setModalState] = useRecoilState(finishModalState)
    // @ts-ignore: Object is possibly 'null'.
    const [answer, setAnswer] = useState<Array>([])
    const [indexAnswer, setIndexAnswer] = useState(0)
    const [indexImage, setIndexImage] = useState(0)
    const [user] = useAuthState(auth)

    const queryCourseRef = collection(db, 'course')
    const qCourse = query(queryCourseRef, orderBy("id", "asc"))
    const [courseValue] = useCollection(qCourse, {
        snapshotListenOptions: { includeMetadataChanges: true },
    })
    const currentCourse = courseValue?.docs.find(course => course.data().id == route.query.id)?.data()


    return (
        <Flex display='flex' justify='center' mt={10}>
            <Flex display='flex' flexDirection='column'>
                <Flex justify='center' >
                    {indexImage > 0 && (<Image
                        alignSelf='center'
                        src='https://cdn-icons-png.flaticon.com/128/271/271220.png'
                        boxSize={30}
                        cursor='pointer'
                        _hover={{
                            bg: 'gray.300'
                        }}
                        onClick={() => {
                            setIndexImage(indexImage - 1)
                        }}
                        mr={5}
                    />
                    )}

                    <Image
                        // boxSize='auto'
                        height='80vh'



                        src={currentCourse?.image[indexImage]}
                    />
                    {indexImage <= currentCourse?.image.length - 2 && (<Image
                        alignSelf='center'
                        cursor='pointer'
                        ml={5}
                        _hover={{
                            bg: 'gray.300'
                        }}
                        onClick={() => {
                            setIndexImage(indexImage + 1)
                        }}
                        boxSize={30}
                        src='https://cdn-icons-png.flaticon.com/128/271/271228.png'
                    />
                    )}
                </Flex>
                <FinishModal currentCourse={currentCourse} userAnswer={answer} />
                <Text ml={12}>Câu {indexAnswer + 1}</Text>
                <Flex


                >
                    <Image
                        cursor='pointer'
                        alignSelf='center'
                        justifyContent='flex-start'


                        _hover={{
                            bg: 'gray.300'
                        }}
                        onClick={() => {
                            if (indexAnswer > 0) {
                                setIndexAnswer(indexAnswer - 1)
                            }
                        }}
                        src='https://cdn-icons-png.flaticon.com/128/271/271220.png'
                        boxSize={30}
                        mr={5}
                    />




                    <form id='choices' style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
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
                    <Image
                        alignSelf='center'
                        ml={5}
                        boxSize={30}
                        _hover={{
                            bg: 'gray.300'
                        }}
                        onClick={() => {
                            if (indexAnswer <= currentCourse?.question - 2) {
                                var s
                                var choices = document.getElementById('choices')
                                // @ts-ignore: Object is possibly 'null'.
                                for (s = 0; s < choices.length; s++) {
                                    // @ts-ignore: Object is possibly 'null'.
                                    if (choices[s].checked) {



                                        const updateAnswer = [...answer]
                                        // @ts-ignore: Object is possibly 'null'.
                                        updateAnswer[indexAnswer + 1] = parseInt(choices[s]?.value, 10)

                                        setAnswer(updateAnswer)
                                        // @ts-ignore: Object is possibly 'null'.
                                        choices[s].checked = false
                                    }


                                }


                                setIndexAnswer(indexAnswer + 1)
                            }
                        }}
                        cursor='pointer'
                        src='https://cdn-icons-png.flaticon.com/128/271/271228.png'
                    />

                    {/* <Button onClick={() => {
                    
                        var i
                        var choices = document.getElementById('choices')
                        for (i = 0; i < choices.length; i++){
                   
                             if (choices[i].checked) console.log(choices[i].value)
                        }
                        
                    }}>Check</Button> */}
                    {indexAnswer == currentCourse?.question - 1 && (
                        <Button
                            onClick={() => {
                               
                                var b

                                var choices = document.getElementById('choices')
                                // @ts-ignore: Object is possibly 'null'.
                                for (b = 0; b < choices.length; b++) {
                                    // @ts-ignore: Object is possibly 'null'.
                                    if (choices[b].checked) {




                                        const updateAnswer = [...answer]
                                        // @ts-ignore: Object is possibly 'null'.
                                        updateAnswer[indexAnswer + 1] = parseInt(choices[b]?.value, 10)

                                        setAnswer(updateAnswer)
                                        // @ts-ignore: Object is possibly 'null'.
                                        choices[b].checked = false
                                    }


                                }


                                // setIndexAnswer(indexAnswer+1)
                                updateDoc(doc(db,'course',`courseid${currentCourse?.id }`),{
                                        // @ts-ignore: Object is possibly 'null'.

                                    view:currentCourse.view+1
                                })
                                setModalState({ open: true })

                            }}
                        >Nộp bài</Button>
                    )}
                </Flex>
            </Flex>

        </Flex>
    )
}
export default CourseId;