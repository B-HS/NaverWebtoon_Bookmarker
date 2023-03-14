import { Flex, Image, Text } from '@chakra-ui/react';

const Header = ({ setMenu, days }: { setMenu: Function; days: string[] }) => {
    return (
        <Flex width={'100%'} borderWidth={0} borderColor={'black'} padding={3} justifyContent={'space-between'} alignItems={'baseline'}>
            <Flex alignItems={'baseline'} gap={2}>
                <a href="https://comic.naver.com/webtoon" target="_newtab">
                    <Text fontSize={'2xl'}>네이버웹툰 북마커</Text>
                </a>
                <Flex gap={1}>
                    {days.map((v, i) => (
                        <Text key={i} fontSize={'sm'} onClick={() => setMenu(v)} style={{ cursor: 'pointer' }}>
                            {v}
                        </Text>
                    ))}
                </Flex>
            </Flex>
            <a href="https://github.com/B-HS" target="_newtab">
                <Flex gap={2}>
                    <Image src={'https://github.githubassets.com/favicons/favicon.png'} width={'20px'} />
                    <Text className="setting" style={{ cursor: 'pointer' }}>
                        B-HS
                    </Text>
                </Flex>
            </a>
        </Flex>
    );
};

export default Header;
