import { finishModalState, postModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

type FinishModalProps = {
    currentCourse: DocumentData | undefined
    userAnswer: []
};

const FinishModal: React.FC<FinishModalProps> = (props) => {
    const { currentCourse, userAnswer } = props
    console.log('userAnswer', userAnswer)
    const [modalState, setModalState] = useRecoilState(finishModalState)
    const [renderWrongAnswer,setRenderWrongAnswer] = useState(false)
    var correctAnswer = [];
    var wrongAnswer = [];
    for (var i = 1; i <= currentCourse?.question; i++) {
        if (currentCourse?.answer[i - 1] == userAnswer[i]) {
            correctAnswer?.push(userAnswer[i])
        } else {
            wrongAnswer.push(userAnswer[i])
        }
        console.log('correctAnswer:', correctAnswer)
        console.log('wrongAnswer:', wrongAnswer)
    }

    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false
        }))
    }
    return (
        <Modal isOpen={modalState.open} onClose={handleClose} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'


                >
                    <Text>Chúc mừng bạn đã hoàn thành bài {currentCourse?.title}</Text>
               
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    pb={6}

                >
                    <Text>Bạn đã đúng {correctAnswer.length} / {currentCourse?.question} câu </Text>

                    <div>
                        {wrongAnswer.length > 0 ? 
                        (
                            <Flex display='flex' flexDirection='column'>
                                {wrongAnswer.map((wrong,index)=>{
                                    var convertWrong
                                    var convertCorrect

                                    switch (wrong) {
                                        case 1:
                                            convertWrong = "A"
                                            break;
                                        case 2:
                                            convertWrong = "B"
                                            break;
                                        case 3:
                                            convertWrong = "C"
                                            break;
                                        case 4:
                                            convertWrong = "D"
                                            break;
                                    
                                        default:
                                            break;
                                    }
                                    switch (currentCourse.answer[index]) {
                                        case 1:
                                            convertCorrect = "A"
                                            break;
                                        case 2:
                                            convertCorrect = "B"
                                            break;
                                        case 3:
                                            convertCorrect = "C"
                                            break;
                                        case 4:
                                            convertCorrect = "D"
                                            break;
                                    
                                        default:
                                            break;
                                    }

                                   return (
                                    <Flex
                                    display='flex'
                                    flexDirection='row'
                                    >
                                        <Text>Câu {index+1}: Bạn chọn đáp án {convertWrong}, Đáp án đúng là {convertCorrect}</Text>
                                    </Flex>
                                )}
                                )}
                               
                                
                                <Button
                                mt={10}
                              
                                > <Link
                                onClick={()=>{
                                    setModalState({open:false})
                                }}
                                href={'/'}
                                >Về trang chủ</Link></Button>
                                

                            </Flex>
                        )
                        
                         : (
                            <Button
                            mt={10}
                          
                            > <Link
                            onClick={()=>{
                                setModalState({open:false})
                            }}
                            href={'/'}
                            >Về trang chủ</Link></Button>
                        )
                        }
                        
                    </div>

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export default FinishModal;