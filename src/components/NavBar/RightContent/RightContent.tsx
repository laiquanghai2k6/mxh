import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import AuthButton from './AuthButton';
import AuthModal from '../../Modal/Auth/AuthModal';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/clientApp';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user?:User | null
};

const RightContent: React.FC<RightContentProps> = ({user}) => {

    return (
        <>
                <AuthModal />
            <Flex justify='center' align='center'>
                { user ? ( 
                <></>
                ) : (
                <AuthButton />
                
                )}
                <UserMenu user={user}/>
            </Flex>
        </>
    )
}
export default RightContent;