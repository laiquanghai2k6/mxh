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
    const [modalState, setModalState] = useRecoilState(finishModalState)
    const [renderWrongAnswer,setRenderWrongAnswer] = useState(false)
    // @ts-ignore: Object is possibly 'null'.
    var correctAnswer = [];
    // @ts-ignore: Object is possibly 'null'.
    var wrongAnswer = [];
    for (var i = 1; i <= currentCourse?.question; i++) {
        if (currentCourse?.answer[i - 1] == userAnswer[i]) {
            correctAnswer?.push(userAnswer[i])
        } else {
            wrongAnswer.push(userAnswer[i])
        }
    
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
                              
                                {// @ts-ignore: Object is possibly 'null'.
                                wrongAnswer.map((wrong,index)=>{
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
                                    // @ts-ignore: Object is possibly 'null'.
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
                                    flexDirection='row' key={index}
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