import { authModalState } from '@/src/atoms/authModalAtom';
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import AuthInput from './AuthInput';
import OAuthButton from './OAuthButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';
import ResetPassword from '../../Modal/Auth/ResetPassword'
const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState)
  const [user,loading,error] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false
    }))
  }

  useEffect(()=>{
    if(user) handleClose();
  },[user])
  return (
    <>

      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>
            {modalState.view === 'login' && 'Login'}
            {modalState.view === 'signup' && 'Signup'}
            {modalState.view === 'resetPassword' && 'Reset Password'}

          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            pb={6}
          >
            <Flex
              direction='column'
              align='center'
              justify='center'
              width='70%'
            >
              {modalState.view === 'login' || modalState.view === 'signup' ? (
                  <>
                  <OAuthButton />
                  <Text color='gray.500' fontWeight={700}>OR</Text>
                  <AuthInput />
                  </>
              ) : ( <ResetPassword/> )}
            
              <Text color='gray.500' fontWeight={700}>OR</Text>
             
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AuthModal;