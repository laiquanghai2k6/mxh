import { Button, Divider, Flex, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { getDatabase } from 'firebase/database'
import { useCollection, } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase/clientApp'

import { collection, orderBy, query, updateDoc, doc as Docs } from 'firebase/firestore'
import Link from 'next/link'
import { useRecoilState, useRecoilValue } from 'recoil'
import { PostState, courseCreateModalState, homeNavigation, listModalState, postModalState, profileModalState } from '../atoms/authModalAtom'
import PostModal from '../components/Modal/Post/PostModal'
import CourseModal from '../components/Modal/Course/CourseModal'
import { useAuthState } from 'react-firebase-hooks/auth'
import ProfileModal from '../components/Modal/Profile/ProfileModal'
import ListModal from '../components/Modal/List/ListModal'
import { useState } from 'react'
import { SearchIcon } from '@chakra-ui/icons'

const database = getDatabase();
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const queryref = collection(db, "post")
  const q = query(queryref, orderBy("id", "desc"))
  const queryCourseRef = collection(db, 'course')
  const qCourse = query(queryCourseRef, orderBy("id", "desc"))
  const [courseValues] = useCollection(qCourse, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })
  const [user] = useAuthState(auth)

  const [value] = useCollection(q,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  const [courseFilter, setCourseFilter] = useState({
    text: ''
  })
  const [postModalStates, setPostModalState] = useRecoilState(postModalState);
  const [courseCreateModalstates, setCourseCreateState] = useRecoilState(courseCreateModalState)
  const [valueUser] = useCollection(collection(db, 'user'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  const [listIndex, setListIndex] = useState(0)
  const home = useRecoilValue(homeNavigation)
  const [listModalStates, setListModalState] = useState(false)

  const [post, setPost] = useRecoilState(PostState)
  // @ts-ignore: Object is possibly 'null'.
  const courseValue = courseValues?.docs.filter(course => 
   ( course.data().title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').includes(courseFilter.text.toLowerCase())
  || course.data().title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').includes(courseFilter.text.toLowerCase())
    ||  course.data().title.toLowerCase().includes(courseFilter.text.toLowerCase()) 
    || course.data().title.includes(courseFilter.text.toLowerCase()) 
    ||course.data().title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(courseFilter.text.toLowerCase())
    ||course.data().title.toLowerCase().normalize('NFD').replace(/[đĐ]/g, 'd').includes(courseFilter.text.toLowerCase())
    // ||course.data().title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(courseFilter.text.toLowerCase())
    // ||course.data().title.normalize('NFD').replace(/[đĐ]/g, 'd').includes(courseFilter.text.toLowerCase())


    )
  )
    // @ts-ignore: Object is possibly 'null'.
  const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseFilter(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  // @ts-ignore: Object is possibly 'null'.
    
    // console.log('courseValues',courseValue[1].data())


  }





  return (
    <div style={{
      width: '100%',
      height: '90%', top: 40, bottom: 0,
      position: 'fixed',
      overflowY: 'scroll'


    }}>

      {home.view == 'diendan' ? (
        <>
          <div style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            display: 'flex',
            // overflow: 'scroll',

          }}>

            <Button mt={10}
              onClick={() => {
                if (user) {
                  setPostModalState({ open: true })
                } else {
                  alert('Vui lòng đăng nhập')
                }
              }}
            >
              <PostModal />
              <Image
                height='20px'
                src='images/plus.png'
                paddingRight='10px'
              />
              Tạo câu hỏi</Button>
          </div>

          <div style={{ marginTop: '20px', height: '100%', display: 'flex', flexDirection: 'row' }} >
            {value && (
              <Flex style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>

                {value.docs.map((doc, id) => {
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
                      _hover={{
                        bg: 'gray.100'
                      }}
                    >
                      <Image src='https://th.bing.com/th/id/OIP.HkxDftcu901JEpHbQHXpiQHaH-?pid=ImgDet&rs=1'
                        height='40px'
                        marginLeft='10px'
                        marginTop='5px'
                        borderRadius='20'
                      />
                      <Flex flexDirection='column'

                        width='100%'
                        ml={5}
                      >
                        <Link
                          href={{
                            pathname: `/postid/${doc.data().id}`,






                          }}
                          style={{
                            display: 'flex',


                            flexDirection: 'column',
                            cursor: 'pointer'
                          }}

                          onClick={() => {
                            setPost({
                              author: doc.data().author,
                              comment: doc.data().comment,
                              content: doc.data().content,
                              date: doc.data().date,
                              id: doc.data().id,
                              like: doc.data().like,
                              title: doc.data().title,
                              imagePost: doc.data().imagePost

                            })
                          }}


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
                            onClick={() => {

                            }}
                          />
                          <Text>{doc.data().like}</Text>

                          <Image src='/images/like.png' height='25px' marginBottom='5px' marginLeft='5px'
                            cursor='pointer'
                            onClick={() => {
                              if (user) {
                                const postRef = Docs(db, 'post', 'postid' + doc.data().id);

                                updateDoc(postRef, { like: doc.data().like + 1 });

                              } else {
                                alert('Vui lòng đăng nhập')
                              }
                            }}

                          />


                        </Flex>

                      </Flex>
                    </Flex>

                  )
                })}
              </Flex>
            )}
            <Flex style={{
              border: '1px solid black',
              flex: 1, overflowY: 'scroll', display: 'flex',
              flexDirection: 'column'
            }}
              display={{ base: 'none', md: 'flex' }}

            >
              <Text
                align='center'
                fontWeight={800}
              >Những người đang online</Text>
              {valueUser?.docs.map((user, id) => {

                return (
                  <Flex key={id} display='flex' flexDirection='row' bg='white'
                    mt={3} mb={1} borderRadius='10px' padding='5px'
                    cursor='pointer' align='center'
                    ml={2}
                    mr={2}
                    _hover={{
                      bg: 'gray.100'
                    }}
                    onClick={() => {
                      setListModalState(true)
                      setListIndex(id)
                    }}
                  >
                    <div>
                      {listModalState && (
                        <Modal isOpen={listModalStates} onClose={() => { setListModalState(false) }} >
                          <ModalContent>
                            <ModalHeader textAlign='center'


                            >

                              <Flex display='flex' flexDirection='column' >
                                <Flex justify='center'>
                                  <Image
                                    src={valueUser.docs[listIndex]?.data().image ? valueUser.docs[listIndex]?.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                                    boxSize='15vh'
                                    borderRadius={50}
                                  />
                                </Flex>
                                <Flex fontWeight='700' justify='center' mt={5} display='flex' flexDirection='row' fontSize={16}>

                                  <Text >Tên: {valueUser.docs[listIndex]?.data().name ? valueUser.docs[listIndex]?.data().name : '(Chưa có)'} </Text>

                                </Flex>
                                <Flex fontWeight='700' justify='center' mt={5} fontSize={16}>


                                  <Text>Năm sinh: {valueUser.docs[listIndex]?.data().born ? valueUser.docs[listIndex]?.data().born : '(Chưa có)'} </Text>

                                </Flex>
                                <Flex fontWeight='700' justify='center' mt={5} fontSize={16}>

                                  <Text>Nơi ở: {valueUser.docs[listIndex]?.data().live ? valueUser.docs[listIndex]?.data().live : '(Chưa có)'} </Text>

                                </Flex>


                              </Flex>

                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody
                              display='flex'
                              flexDirection='column'
                              alignItems='center'
                              justifyContent='center'
                              pb={6}
                            >





                            </ModalBody>
                          </ModalContent>
                        </Modal>
                      )}
                    </div>

                    <Image height='35px' width='35px' src={user.data().image ? user.data().image : 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png'}
                      borderRadius='100px'

                    />
                    <Flex ml={3}>{user.data().email.split("@")[0]}</Flex>
                    <Image
                      src='https://th.bing.com/th/id/R.13284e9be62bd8ff1ad9afac1f1fbe60?rik=5wa7bTdun3cFXQ&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f1%2ff%2fa%2f787954-green-background-wallpaper-2560x1440-cell-phone.jpg&ehk=NlHlCXUgO4xLEvkAsU9G7E4%2fgSbdaaasgeToXQGiNhI%3d&risl=&pid=ImgRaw&r=0'
                      height='10px'
                      width='10px'
                      marginLeft='50px'
                      borderRadius='100px'
                    />
                  </Flex>
                )
              })}

            </Flex>

          </div>
        </>
      ) : (
        <Flex
          display='flex' flexDirection='column'
          width='100%'
          height='90%'
          top={36}
          bottom={0}
        // position='fixed'
        // overflowY='scroll'


        >
          <Flex
            ml='40vh'
            mr='40vh'
            mt={10}
          >
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.400' mb={1} />
              </InputLeftElement>
              <Input
                placeholder='Tìm kiếm khóa học'
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                  bg: 'white',
                  border: '1px solid',
                  borderColor: 'blue.500',
                }}
                _focus={{
                  outline: 'none',
                  border: '1px solid',
                  borderColor: 'blue.500',
                }}
                height='34px'
                bg='gray.50'
                name='text'
                onChange={onChangeFilter}
              />
            </InputGroup>
          </Flex>
          <div
          
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            display: 'flex',
          }}
          >
            <Button
              mt={10}
              style={{

                alignSelf: 'center',
                marginBottom: '10px'
              }}
              onClick={() => {
                if (user) {
                  setCourseCreateState({ open: true })
                } else {
                  alert('Vui lòng đăng nhập')


                }
              }}
            >
              {/* <modal */}
              <Image

                height='20px'
                src='images/plus.png'
                paddingRight='10px'
              />
              Tạo khóa học
            </Button>
          </div>
          <CourseModal />

          {courseValue?.map((course, id) => {
            var idCourse = `/courseid/${course.data().id}`

            return (

              <Flex key={id} ml={15} bg='green' mb={10}
                // mt={20}
                borderRadius='100px'
                marginLeft={20}
                marginRight={20}
                // pt={2}
                // pb={2}
                color='white'
                cursor='pointer'
                justify='space-between'
                _hover={{
                  bg: 'green.500',
                  border: '1px solid',
                  borderColor: 'blue.500'
                }}
                onClick={() => {
                  if (!user) {
                    idCourse = '/'
                  }
                }}
              >

                <Link
                  href={{


                    pathname: user ? `/courseid/${course.data().id}` : '/'

                  }}
                  onClick={() => {
                    if (!user) {
                      alert('Vui lòng đăng nhập')
                    }
                  }}
                  style={{
                    // justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    // flexDirection: 'row',
                    
                    justifyItems: 'center',
                    paddingTop: 5,
                    paddingBottom: 5
                  }}
                >

                  <Flex ml={5} width='500px'  >ID: {course.data().id} Tên:  {course.data().title}</Flex>

                  <Flex ml={15} width='200px' >Số lượt làm: {course.data().view}</Flex>
                  <Flex ml={5} width='40%'>Tạo bởi {course.data().author} vào ngày {course.data().date}</Flex>


                </Link>

              </Flex>


            )
          }

          )}

        </Flex>

      )


      }

    </div>

  )
}
