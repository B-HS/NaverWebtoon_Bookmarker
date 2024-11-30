import { days } from './constant'

const state = new Proxy(
    {
        isBookmark: false,
        bookmarks: [] as string[],
    },
    {
        set(target, key, value) {
            target[key as keyof typeof target] = value
            if (key === 'isBookmark') {
                toggleWebtoonList()
            }
            return true
        },
    },
)

const getWebtoonSection = () => document.getElementsByClassName('component_wrap') as HTMLCollectionOf<HTMLElement>
const removeStatusText = (target: string) => target.replace('UP', '').replace('청유물', '').replace('휴재', '').replace('신작', '')

const toggleWebtoonList = () => {
    try {
        const webtoonSection = getWebtoonSection()
        let webtoons = webtoonSection[1].childNodes[1]
        webtoons.childNodes.forEach((v: HTMLLIElement | Node) => {
            v.childNodes[1].childNodes.forEach((li: any) => {
                if (!state.bookmarks?.includes(removeStatusText(li.textContent)) && state.isBookmark) {
                    li.style.display = 'none'
                } else {
                    li.style.display = 'list-item'
                    li.style.marginBottom = '25px'
                    li.style.marginTop = '0'
                }
            })
        })
    } catch (error) {
        console.log('[Naver Webtoon Bookmarker] List not exist')
    }
}

const setWebtoonList = async () => {
    try {
        const webtoonSection = getWebtoonSection()
        let webtoons = webtoonSection[1].childNodes[1]
        let nameOfWebtoons: string[][] = []
        webtoons.childNodes.forEach((v, i) => {
            let tmp: string[] = []
            v.childNodes[1].childNodes.forEach((li) => {
                tmp.push(removeStatusText(li.textContent!))
            })
            nameOfWebtoons.push(tmp)
        })
        chrome.storage.local && days.forEach((day, i) => chrome.storage.local.set({ [day]: JSON.stringify(nameOfWebtoons[i]) }))
    } catch (error) {
        console.log('[Naver Webtoon Bookmarker] List not exist')
    }
}

const getBookmark = async () => {
    const bookmark = await chrome.storage.local.get('bookmark').then((res) => res['bookmark'])
    bookmark && (state.bookmarks = [...JSON.parse(bookmark)])
    toggleWebtoonList()
}

const toggleBookmark = (button: HTMLElement) => {
    button.setAttribute('aria-selected', String((state.isBookmark = !state.isBookmark)))
}

const setBookmarkToggleButton = (container: HTMLElement) => {
    const tablist = container.querySelector('[role="tablist"]')
    const lastChild = tablist?.lastElementChild

    if (!lastChild || lastChild.textContent === '북마크') return

    const bookmarkButton = lastChild.cloneNode(true) as HTMLElement
    bookmarkButton.onclick = () => toggleBookmark(bookmarkButton)
    bookmarkButton.innerText = '북마크'
    tablist.appendChild(bookmarkButton)
}

const sendDOMData = async () => {
    const execute = window.location.pathname === '/webtoon' && !window.location.search
    const container = document.getElementById('container')
    if (!container || !execute) return
    await setWebtoonList()
    setBookmarkToggleButton(container)
    chrome.storage.onChanged.addListener((res) => {
        getBookmark()
    })
}

const observeBody = () => {
    const body = document.body
    if (!body) return

    let observer: MutationObserver
    const observe = () => {
        observer = new MutationObserver(() => {
            if (document.getElementById('container')) {
                sendDOMData()
                observer.disconnect()
                setTimeout(observe)
            }
        })
        observer.observe(body, { childList: true, subtree: true })
    }
    observe()
}

document.onreadystatechange = () => document.readyState === 'complete' && observeBody()
document.addEventListener('DOMContentLoaded', () => observeBody())
