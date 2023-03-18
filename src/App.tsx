import { Container } from '@chakra-ui/react';
import { useState } from 'react';
import Body from './Body/Body';
import Header from './Header/Header';
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
