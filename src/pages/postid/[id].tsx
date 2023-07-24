import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

type ComProps = {
    
};

const Com:React.FC<ComProps> = () => {
    const router = useRouter();
    console.log(router.query.comment)
    return <div></div>
}




export default Com;