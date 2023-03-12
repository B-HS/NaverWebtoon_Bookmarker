/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, { useEffect, useState } from 'react';

const App = () => {
    const [bookmark, setBookmark] = useState<string[]>();
    const [isBookmark, setIsBookmark] = useState<boolean>(false);

    const addButtonToTabList = (dayOfWebtoons: HTMLElement) => {
        let dayOfWebtoonsCategory = dayOfWebtoons.childNodes[0].childNodes[0];
        let clonedTab = dayOfWebtoonsCategory.childNodes[2].childNodes[0].cloneNode() as HTMLButtonElement;
        clonedTab.textContent = '북마크만 보기';
        clonedTab.ariaSelected = `${isBookmark}`;
        clonedTab.addEventListener('click', () => {
            if (clonedTab.textContent === '북마크만 보기') {
                getBookmark();
                hideWebtoons(dayOfWebtoons);
                clonedTab.ariaSelected = 'true';
                clonedTab.textContent = '북마크 해제';
                setIsBookmark(true);
            } else {
                hideWebtoons(dayOfWebtoons);
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

    const hideWebtoons = (webtoonSection: HTMLElement) => {
        let webtoons = webtoonSection.childNodes[1];
        webtoons.childNodes.forEach((v, i) => {
            // 아니 이 멍청한 TS가 node에 무조건 style있는데 없다함, 일단 any로 처리

            v.childNodes[1].childNodes.forEach((li: any) => {
                if (!bookmark?.includes(removeStatusText(li.textContent)) && isBookmark) {
                    console.log(li.style!.display);
                    li.style.display = 'none';
                } else {
                    li.style.display = 'list-item';
                    li.style.marginBottom = '25px';
                    li.style.marginTop = '0';
                }
            });
        });
    };

    const setWebtoonList = (webtoonSection: HTMLElement) => {
        const days = ['월', '화', '수', '목', '금', '토', '일'];
        let webtoons = webtoonSection.childNodes[1];
        let nameOfWebtoons: string[][] = [];
        webtoons.childNodes.forEach((v, i) => {
            let tmp: string[] = [];
            v.childNodes[1].childNodes.forEach((li) => {
                tmp.push(removeStatusText(li.textContent!));
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

    const getBookmark = () => {
        chrome.storage.local.get('bookmark').then((res) => {
            if (res['bookmark']) {
                setIsBookmark(true);
                setBookmark(() => [...JSON.parse(res['bookmark'])]);
            }
        });
    };

    useEffect(() => {
        let webtoonSection = document.getElementsByClassName('component_wrap') as HTMLCollectionOf<HTMLElement>;
        let dayOfWebtoons = webtoonSection[1];
        addButtonToTabList(dayOfWebtoons);
        setWebtoonList(dayOfWebtoons);
        chrome.storage.onChanged.addListener(() => {
            getBookmark();
        });
    }, []);

    useEffect(() => {
        let webtoonSection = document.querySelectorAll<HTMLElement>('.component_wrap');
        let dayOfWebtoons = webtoonSection[1];
        hideWebtoons(dayOfWebtoons);
    }, [isBookmark, bookmark]);

    return <></>;
};

export default App;
