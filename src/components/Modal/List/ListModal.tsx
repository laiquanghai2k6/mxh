import { listModalState } from '@/src/atoms/authModalAtom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody ,Text} from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';

type ListModalProps = {
    
};

const ListModal:React.FC<ListModalProps> = () => {
    const [modalState, setModalState] = useRecoilState(listModalState)

    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false
        }))
    }
    return(
       <></>
    )
}
export default ListModal;