import { authModalState } from '@/src/atoms/authModalAtom';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth, db } from '../../../firebase/clientApp'
import { FIREBASE_ERRORS } from '../../../firebase/errors'
import { collection, doc, setDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
const SignUp: React.FC = () => {

    const setAuthModalState = useSetRecoilState(authModalState);
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState('')
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        userError,

    ] = useCreateUserWithEmailAndPassword(auth)
    const [valueUser] = useCollection(collection(db, 'user'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    });
    console.log('valueUser?.docs.length')

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (error) setError('')
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return;
        }


        console.log(auth)
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
        setDoc(doc(db,'user',`userid${valueUser?.docs.length+1}`),{
            born:"",
            email:signUpForm.email,
            id:valueUser?.docs.length+1,
            image:"",
            live:"",
            name:"",
            password:signUpForm.password
        })
    }




    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))


    }

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name='email'
                placeholder='Email'
                type='email'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                bg='gray.50'

            />
            <Input
                name='password'
                placeholder='Mật khẩu'
                type='password'
                mb={2}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                bg='gray.50'
                onChange={onChange} />
            <Input
                name='confirmPassword'
                placeholder='Xác nhận mật khẩu'
                type='password'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                bg='gray.50'
            />
            {/* {(error || userError)  && ( */}
            <Text textAlign='center' color='red' fontSize='10pt'>
                {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>

            {/* )} */}
            <Button type='submit' width='100%'
                height='36px' mt={2} mb={2} isLoading={loading}
            >
                Đăng ký
            </Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={1}>Có tài khoản rồi?</Text>
                <Text color='blue.500' fontWeight={700}
                    cursor='pointer'
                    onClick={() => setAuthModalState((prev) => ({
                        ...prev,
                        view: 'login'
                    }))}
                >Đăng nhập</Text>
            </Flex>
        </form>
    )
}

export default SignUp;
