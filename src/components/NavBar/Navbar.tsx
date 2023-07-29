import { Flex ,Image} from '@chakra-ui/react';

import React from 'react';
import Searchinput from './Searchinput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';
import Directory from './Directory/Directory';
import Link from 'next/link';

const Navbar:React.FC = () => {
    const [user,loading,error] = useAuthState(auth)
    
    return (
        <Flex bg="white" height='44px' padding='6px 12px' display='flex' flexDirection='row'>
            <Link style={{
                alignItems:'center',
                 width:40,
                 marginRight:2,
                 display:'flex',
                 justifyContent:'flex-start'
                 
            }} 
            href={'/'}
            
            
            >
                <Image src='https://i.ibb.co/tK2fWdd/298621035-1009173336430413-6387477454526633423-n.jpg" alt="298621035-1009173336430413-6387477454526633423-n' height='30px'/>

            </Link>
        <Flex justify='flex-start'>
        <Directory /> 
        </Flex>
        {/* <Searchinput user={user}/> */}
        <Flex justify='flex-end' width='100%'>
        <RightContent user={user}/>
        </Flex>
        </Flex>
    )
}
export default Navbar;