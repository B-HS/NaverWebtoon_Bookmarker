import { Box, Center, Container, Divider, Flex, Grid, GridItem, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import useInput from '../Hooks/useInput';

const Body = ({ currentMenu }: { currentMenu: string }) => {
    const [webtoonsOfDay, setWebtoonsOfDay] = useState<string[]>([]);
    const [bookmark, setBookmark] = useState<string[]>([]);
    const [filteredList, setFilteredList] = useState<string[]>([]);
    const [keyword, onKey, setKey] = useInput();


    const keywordFilter = () => {
        console.log(keyword);
        if (!keyword || keyword.length === 0) {
            setFilteredList(() => webtoonsOfDay);
            console.log('빔');

            return;
        }
        setFilteredList(() => [
            ...webtoonsOfDay.filter((v) => {
                if (v === keyword || v.indexOf(keyword) !== -1) {
                    return true;
                } else {
                    return false;
                }
            })
        ]);
    };
    useEffect(() => {
        chrome.storage.local.get([currentMenu]).then((res) => {
            if (res) {
                setWebtoonsOfDay(() => [...JSON.parse(res[currentMenu])]);
                setFilteredList(() => [...JSON.parse(res[currentMenu])]);
            }
        });

        chrome.storage.local.get(['bookmark']).then((res) => {
            if (res) {
                setBookmark(res['bookmark']);
            }
        });
    }, [currentMenu]);

    useEffect(() => {
        keywordFilter();
    }, [keyword]);
    return (
        <Flex padding={5} flexDirection={'column'} gap={2}>
            <Flex gap={3} align={'baseline'}>
                <Text fontSize={'lg'} paddingLeft={1}>
                    {currentMenu + '요일'} 북마크 목록
                </Text>
                <Text fontSize={'xs'}> 클릭으로 북마크가 설정가능합니다 (✓표시)</Text>
            </Flex>
            <hr />
            <InputGroup>
                <InputLeftElement pointerEvents="none" children={<Text>🔍</Text>} />
                <Input borderRadius={0} marginBottom={1} type="text" placeholder="검색" value={keyword} onChange={onKey} />
            </InputGroup>

            <Grid templateColumns="repeat(2, 1fr)" gap={3} paddingX={2}>
                {filteredList.map((v) => (
                    <GridItem cursor={'pointer'} w="100%">
                        <Flex>
                            {bookmark?.includes(v)&&<Text>✓ </Text>}
                            <Text>{v}</Text>
                        </Flex>
                    </GridItem>
                ))}
            </Grid>
        </Flex>
    );
};

export default Body;
