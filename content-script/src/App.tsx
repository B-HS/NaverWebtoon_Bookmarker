/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, { useEffect } from 'react';

const App = () => {
    const addButtonToTabList = (dayOfWebtoons: Element) => {
        let dayOfWebtoonsCategory = dayOfWebtoons.childNodes[0].childNodes[0];
        let clonedTab = dayOfWebtoonsCategory.childNodes[2].childNodes[0].cloneNode() as HTMLButtonElement;
        clonedTab.textContent = '북마크만 보기';
        clonedTab.ariaSelected = 'false';
        clonedTab.addEventListener('click', () => {
            if (clonedTab.textContent === '북마크만 보기') {
                clonedTab.ariaSelected = 'true';
                clonedTab.textContent = '북마크 해제';
            } else {
                clonedTab.ariaSelected = 'false';
                clonedTab.textContent = '북마크만 보기';
            }
        });
        if (dayOfWebtoonsCategory.childNodes[2].textContent?.split('순')[4] !== '북마크만 보기') {
            dayOfWebtoonsCategory.childNodes[2].appendChild(clonedTab);
        }
    };

    const setWebtoonList = (webtoonSection: Element) => {
        const days = ['월', '화', '수', '목', '금', '토', '일'];
        let webtoons = webtoonSection.childNodes[1];
        let nameOfWebtoons: string[][] = [];
        webtoons.childNodes.forEach((v, i) => {
            let tmp: string[] = [];
            console.log('===================================');
            v.childNodes[1].childNodes.forEach((li) => {
                tmp.push(li.textContent as string);
            });
            console.log('===================================');
            nameOfWebtoons.push(tmp);
            localStorage.setItem(days[i], JSON.stringify(tmp));
        });
        chrome.storage.local.set({ 월: JSON.stringify(nameOfWebtoons[0]) });
        chrome.storage.local.set({ 화: JSON.stringify(nameOfWebtoons[1]) });
        chrome.storage.local.set({ 수: JSON.stringify(nameOfWebtoons[2]) });
        chrome.storage.local.set({ 목: JSON.stringify(nameOfWebtoons[3]) });
        chrome.storage.local.set({ 금: JSON.stringify(nameOfWebtoons[4]) });
        chrome.storage.local.set({ 토: JSON.stringify(nameOfWebtoons[5]) });
        chrome.storage.local.set({ 일: JSON.stringify(nameOfWebtoons[6]) });
    };

    useEffect(() => {
        let webtoonSection = document.getElementsByClassName('component_wrap') as HTMLCollectionOf<Element>;
        let dayOfWebtoons = webtoonSection[1];
        addButtonToTabList(dayOfWebtoons);
        setWebtoonList(dayOfWebtoons);
    }, []);
    return <></>;
};

export default App;
