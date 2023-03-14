chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url === 'https://comic.naver.com/webtoon') {
        chrome.tabs.sendMessage(details.tabId, { message: 'webtoon', url: details.url });
    }
});
