import { homeNavigation } from '@/src/atoms/authModalAtom';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import Link from 'next/link';
import React from 'react';
import { MdOutlineLogin } from 'react-icons/md'

import { TiHome } from 'react-icons/ti'
import { useSetRecoilState } from 'recoil';

type UserMenuProps = {
    user?: User | null
};

const Directory: React.FC<UserMenuProps> = ({ user }) => {
    const setHomeNavigation = useSetRecoilState(homeNavigation)

    return (
        <Menu>
            <MenuButton cursor='pointer' padding='0px 6p'
                borderRadius={4} _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
            >
                <Flex align='center'
                    justify='space-between'
                    width={{ base: 'auto', lg: '200px' }}

                >
                    <Flex align='center'>
                        <Icon
                            fontSize={24} mr={{ base: 1, md: 2 }} as={TiHome}
                        />
                        <Flex
                            display={{ base: 'none', lg: 'flex' }}
                        >
                            <Text fontWeight={600}>
                                Đi đến
                            </Text>
                        </Flex>

                    </Flex>
                    <ChevronDownIcon />

                </Flex>
            </MenuButton>
            <MenuList>

                <MenuItem fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={() =>
                        setHomeNavigation({
                            view: 'diendan'

                        })}


                >
                    <Link
                        style={{ alignItems: 'center' }}
                        href={'/'}
                    >
                        <Icon as={MdOutlineLogin}
                            fontSize={20} mr={2}
                        />
                        Diễn đàn
                    </Link>
                </MenuItem>

                <MenuItem fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={() => { setHomeNavigation({ view: 'khoahoc' }) }}
                >
                    <Link
                        style={{ alignItems: 'center' }}
                        href={'/'}
                    >
                        <Icon as={MdOutlineLogin}
                            fontSize={20} mr={2}
                        />
                        Khóa học
                    </Link>
                </MenuItem>


            </MenuList>
        </Menu>
    )
}
export default Directory;