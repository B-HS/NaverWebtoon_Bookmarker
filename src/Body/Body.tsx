import { Box, Center, Container, Divider, Flex, Grid, GridItem, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import useInput from '../Hooks/useInput';

const Body = ({ currentMenu }: { currentMenu: string }) => {
    const [webtoonsOfDay, setWebtoonsOfDay] = useState<string[]>([]);
    const [bookmark, setBookmark] = useState<string[]>();
    const [filteredList, setFilteredList] = useState<string[]>([]);
    const [keyword, onKey] = useInput();

    const bookmarkManaging = (target: string) => {
        console.log(bookmark);
        if (bookmark) {
            if (target === 'clear') {
                setBookmark(() => []);
                return;
            }
            if (bookmark.includes(target)) {
                setBookmark(() => bookmark.filter((v) => v != target));
            } else {
                setBookmark(() => [...bookmark, target]);
            }
        }
    };

    const keywordFilter = () => {
        if (!keyword || keyword.length === 0) {
            setFilteredList(() => webtoonsOfDay);
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
            if (res[currentMenu]) {
                setWebtoonsOfDay(() => [...JSON.parse(res[currentMenu])]);
                setFilteredList(() => [...JSON.parse(res[currentMenu])]);
            }
        });

        chrome.storage.local.get(['bookmark']).then((res) => {
            if (res['bookmark']) {
                setBookmark(() => [...JSON.parse(res['bookmark'])]);
            }
        });
    }, [currentMenu]);

    useEffect(() => {
        keywordFilter();
    }, [keyword]);

    useEffect(() => {
        chrome.storage.local.set({ bookmark: JSON.stringify(bookmark) });
    }, [bookmark]);
    return (
        <Flex padding={5} flexDirection={'column'} gap={2}>
            <Flex gap={3} align={'baseline'}>
                <Text
                    fontSize={'lg'}
                    paddingLeft={1}
                    onClick={() => {
                        bookmarkManaging('clear');
                    }}
                >
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
                {filteredList.map((v, i) => (
                    <GridItem key={(i + 1) * (i + 1) + i + 1 + i + 1} cursor={'pointer'} w="100%" onClick={() => bookmarkManaging(v)} style={bookmark?.includes(v) ? { color: "blue" } : {}}>
                        <Flex gap={1}>
                            {bookmark?.includes(v) && <Text key={(i + 1) * -1}>✓ </Text>}
                            <Text key={i + 1}>{v}</Text>
                        </Flex>
                    </GridItem>
                ))}
            </Grid>
        </Flex>
    );
};

export default Body;
