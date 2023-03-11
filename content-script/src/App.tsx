/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, { useEffect, useState } from 'react';

const App = () => {
    const [bookmark, setBookmark] = useState<string[]>();
    const [isBookmark, setIsBookmark] = useState<boolean>(false);
    const addButtonToTabList = (dayOfWebtoons: Element) => {
        let dayOfWebtoonsCategory = dayOfWebtoons.childNodes[0].childNodes[0];
        let clonedTab = dayOfWebtoonsCategory.childNodes[2].childNodes[0].cloneNode() as HTMLButtonElement;
        clonedTab.textContent = '북마크만 보기';
        clonedTab.ariaSelected = 'false';
        clonedTab.addEventListener('click', () => {
            if (clonedTab.textContent === '북마크만 보기') {
                clonedTab.ariaSelected = 'true';
                clonedTab.textContent = '북마크 해제';
                setIsBookmark(true);
            } else {
                clonedTab.ariaSelected = 'false';
                clonedTab.textContent = '북마크만 보기';
                setIsBookmark(false);
            }
        });
        if (dayOfWebtoonsCategory.childNodes[2].textContent?.split('순')[4] !== '북마크만 보기') {
            dayOfWebtoonsCategory.childNodes[2].appendChild(clonedTab);
        }
    };

    const removeStatusText = (target: string) => {
        return target.replace('UP', '').replace('청유물', '').replace('휴재', '').replace('신작', '');
    };

    const setWebtoonList = (webtoonSection: Element) => {
        const days = ['월', '화', '수', '목', '금', '토', '일'];
        let webtoons = webtoonSection.childNodes[1];
        let nameOfWebtoons: string[][] = [];
        webtoons.childNodes.forEach((v, i) => {
            let tmp: string[] = [];
            v.childNodes[1].childNodes.forEach((li) => {
                tmp.push(removeStatusText(li.textContent!) as string);
            });
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
        chrome.storage.onChanged.addListener(() => {
            chrome.storage.local.get('bookmark').then((res) => {
                setBookmark(() => [...JSON.parse(res['bookmark'])]);
            });
        });
    }, []);

    useEffect(() => {
        let webtoonSection = document.getElementsByClassName('component_wrap') as HTMLCollectionOf<Element>;
        let dayOfWebtoons = webtoonSection[1];
    }, [bookmark]);

    return <></>;
};

export default App;
