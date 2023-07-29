import { authModalState } from '@/src/atoms/authModalAtom';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';


const AuthButton:React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    return (
        
        <>
            <Button 
            variant='outline' 
            height='28px'
             display={{base:'none' , sm:'flex'}}
             width={{base:'70px',md:'110px'}}
             mr={2}
             onClick={()=>
                setAuthModalState({open:true,view:'login'})}
             >Đăng nhập</Button>
            <Button
               height='28px'
                display={{base:'none' , sm:'flex'}}
                width={{base:'70px',md:'110px'}}
                mr={2}
                onClick={()=>setAuthModalState({open:true,view:'signup'})}
            
            >Đăng ký</Button>

        </>
    )
}
export default AuthButton;