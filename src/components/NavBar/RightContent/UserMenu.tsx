import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, Button,Text, Flex, MenuList,Image, MenuItem, Icon, MenuDivider } from '@chakra-ui/react';
import React from 'react';
import { FaRedditSquare } from 'react-icons/fa'
import { VscAccount } from 'react-icons/vsc'
import { IoSparkles } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineLogin } from 'react-icons/md'
import { User, signOut } from 'firebase/auth';
import { auth, db } from '@/src/firebase/clientApp';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState, profileModalState } from '@/src/atoms/authModalAtom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProfileModal from '../../Modal/Profile/ProfileModal';

type UserMenuProps = {
    user?: User | null
};

const UserMenu: React.FC<UserMenuProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const [valueUser] = useCollection(collection(db, 'user'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    });
    const [user] = useAuthState(auth)
    const [profileModalStates, setProfileModalState] = useRecoilState(profileModalState)
    const currentUserDoc = valueUser?.docs.find((doc)=>doc.data().email == user?.email)
    console.log('currentUserDoc:',currentUserDoc?.data().image)


    return (
        <Menu>
            <MenuButton cursor='pointer' padding='0px 6p'
                borderRadius={4} _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
            >
                <Flex align='center'>
                    <Flex align='center'>
                        {user ? (

                            <>
                              <Image
                              src={currentUserDoc?.data().image == "" ? 'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png' : currentUserDoc?.data().image}
                              boxSize={25}
                              />
                                <Flex
                                direction='column'
                                display={{base:'none',lg:'flex'}}
                                fontSize='8pt'
                                align='flex-start'
                                mr={8}
                                ml={5}
                                >
                                    <Text fontWeight={700}>
                                        {user?.displayName || user.email?.split("@")[0]}
                                    </Text>
                                    {/* <Flex>
                                        <Icon as={IoSparkles} color='brand.100' mr={1} />
                                        <Text color='gray.400'>1 karma</Text>
                                    </Flex> */}

                                </Flex>

                            </>

                        ) : (
                            <Icon
                                fontSize={24} color='gray.400' mr={1} as={VscAccount}

                            />
                           


                        )}
                    </Flex>
                    <ChevronDownIcon />

                </Flex>
            </MenuButton>
            <MenuList>
                {user?(
                    <>
                       <MenuItem fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={()=>{
                        setProfileModalState({
                            open:true,
                           // otherData:''
                        })
                    }}
                >
                  <ProfileModal />

                    <Flex
                        align='center'
                    >
                        <Icon as={CgProfile}
                            fontSize={20} mr={2}
                        />
                        Trang cá nhân
                    </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={() => signOut(auth)}
                >
                    <Flex
                        align='center'
                    >
                        <Icon as={MdOutlineLogin}
                            fontSize={20} mr={2}
                        />
                        Đăng xuất
                    </Flex>
                </MenuItem>
                </>
                ): (

                    <>
                      <MenuItem fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={() => setAuthModalState({open:true,view:'login'})}
                >
                    <Flex
                        align='center'
                    >
                        <Icon as={MdOutlineLogin}
                            fontSize={20} mr={2}
                        />
                        Đăng ký / Đăng nhập
                    </Flex>
                </MenuItem>
                    </>
                )}
             
            </MenuList>
        </Menu>
    )
}
export default UserMenu;