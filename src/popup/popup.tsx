import { PopupContent, PopupHeader } from '@widgets/popup'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { days, type Days } from '../constant'

export const Popup = () => {
    const [keyword, setKeyword] = useState<string>('')
    const [selectedDay, setSelectedDay] = useState<Days>(days[dayjs().day()])
    const [webtoons, setWebtoons] = useState<string[]>([])
    const [bookmarks, setBookmarks] = useState<string[]>([])

    const toggleBookmark = (webtoon: string) => {
        const newBookmarks = bookmarks.includes(webtoon) ? bookmarks.filter((bookmark) => bookmark !== webtoon) : [...bookmarks, webtoon]
        setBookmarks(newBookmarks)
        chrome.storage.local.set({ bookmark: JSON.stringify(newBookmarks) })
    }

    useEffect(() => {
        chrome.storage.local.get(selectedDay, (result) => {
            setWebtoons(JSON.parse(result[selectedDay]))
        })
    }, [selectedDay])

    useEffect(() => {
        chrome.storage.local.get('bookmark', (result) => {
            setBookmarks(JSON.parse(result['bookmark']))
        })
    }, [])

    return (
        <section className='w-[500px] prose-sm flex flex-col items-start relative h-fit'>
            <PopupHeader keyword={keyword} selectedDay={selectedDay} setKeyword={setKeyword} setSelectedDay={setSelectedDay} />
            <PopupContent webtoons={webtoons} bookmarks={bookmarks} keyword={keyword} toggleBookmark={toggleBookmark} />
        </section>
    )
}
