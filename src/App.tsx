/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import Header from './Header/Header';
import { Container } from '@chakra-ui/react';
import Body from './Body/Body';
import { useState } from 'react';
function App() {
    const [menu, setMenu] = useState<string>('월');
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    let list = [];
    days.forEach((day) => {
        list.push(JSON.parse(localStorage.getItem(day)!));
    });
    return (
        <>
            <Container minW={'30rem'} padding={0}>
                <Header setMenu={setMenu} days={days}></Header>
                <hr />
                <Body currentMenu={menu}></Body>
            </Container>
        </>
    );
}

export default App;
