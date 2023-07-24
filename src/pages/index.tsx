import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { app, db, getData } from '../firebase/clientApp'
import { Divider, Flex, Image, Text } from '@chakra-ui/react'
import { ref, getDatabase } from 'firebase/database';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { homeNavigation } from '../atoms/authModalAtom'
import { Route, Routes } from 'react-router-dom'
import Diendan from '../components/Layout/Diendan'
import Test from '../components/Layout/Test'
import Link from 'next/link'

const database = getDatabase();
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [value, loading, error] = useCollection(collection(db, 'post'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  const home = useRecoilValue(homeNavigation)
  // const dat = JSON.stringify(value?.docs[0].data())
  
  return (
    <div style={{
      border: '1px solid green', width: '100%',
      height: '100%', top: 50, bottom: 0,
      position: 'fixed'


    }}>
      {home.view == 'diendan' ? (
        <div style={{ marginTop: '70px', border: '1px solid red', height: '100%', display: 'flex', flexDirection: 'row' }} >
          {value && (
            <Flex style={{ border: "1px solid red", flex: 3, display: 'flex', flexDirection: 'column' }}>

              {value.docs.map((doc, id) => {
                console.log(doc.data().comment[0])                
                return (

                <Flex key={id}
                  bg='white'
                  mt={10}
                  justify='flex-start'
                  display='flex'
                  flexDirection='row'
                  mr={100}
                  ml={100}
                  borderRadius={10}
                >
                  <Image src='https://th.bing.com/th/id/OIP.HkxDftcu901JEpHbQHXpiQHaH-?pid=ImgDet&rs=1'
                    height='40px'
                    marginLeft='10px'
                    marginTop='5px'
                    borderRadius='20'
                  />
                  <Flex flexDirection='column'
                    border='1px solid red'
                    width='100%'
                    ml={5}
                    >
                    <Link
                    href={{
                      pathname:`/postid/${doc.data().id}`,
                      query:
                      {comment:doc.data().comment[0].user,}
                        // author:doc.data().author,
                        
                        // content:doc.data().content,
                        // date:doc.data().date,
                        // like:doc.data().like,
                        // title:doc.data().title,
                        // id:doc.data().id,



                      
                    }}
                      style={{display:'flex',
                      
                      
                      flexDirection:'column',
                      cursor:'pointer'}}
                    
                  
                    >
                      <div style={{ fontSize: 14 }} > Đăng bởi {doc.data().author} vào ngày {doc.data().date}</div>
                      <div style={{
                        fontWeight: '700',
                        marginTop: 10

                      }}>{doc.data().title}</div>

                      <div>{doc.data().content}</div>
                    </Link>

                    <Flex
                      display='flex'
                      flexDirection='row'
                      justify='flex-end'
                      alignItems='center'
                      mr={10}

                    >
                      <Text>{doc.data().comment.length}</Text>
                      <Image src='/images/comment.png' height='25px' marginRight='15px' marginLeft='5px'
                      cursor='pointer'
                      onClick={()=>{

                      }}
                      />
                      <Text>{doc.data().like}</Text>

                      <Image src='/images/like.png' height='25px' marginBottom='5px' marginLeft='5px'
                      cursor='pointer'
                        onClick={()=>{
                        
                        }}
                      />


                    </Flex>

                  </Flex>
                </Flex>

              )})}
            </Flex>
          )}
          <Flex style={{ border: '1px solid green', flex: 1 }}
            display={{ base: 'none', md: 'flex' }}
          >

          </Flex>

        </div>
      ) : (
        <div>khoa hoc</div>)}

    </div>

  )
}
