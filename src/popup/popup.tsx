import { Github } from '@src/icon'
import { cn } from '@src/utils'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { Separator } from '@ui/separator'
import dayjs from 'dayjs'
import { Check, Search } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { days, type Days } from '../constant'

const PopupHeader = ({ days, selectedDay, setSelectedDay }: { days: Days[]; selectedDay: Days; setSelectedDay: Dispatch<SetStateAction<Days>> }) => {
    const redirectToGithub = () => window.open('https://github.com/B-HS', '_blank')

    return (
        <section className='flex items-center justify-between w-full'>
            <section className='flex items-baseline gap-2'>
                <h2 className='m-0 p-0'>네이버 웹툰 북마커</h2>
                <section className='flex items-center gap-1'>
                    {days.map((day, idx) => (
                        <Button
                            size={'sm'}
                            className={cn(`size-2.5 p-2 border-b border-transparent`, selectedDay === day && 'border-b-primary')}
                            variant={'ghost'}
                            key={idx}
                            onClick={() => setSelectedDay(day)}>
                            {day}
                        </Button>
                    ))}
                </section>
            </section>
            <section onClick={redirectToGithub} className='flex gap-2 items-center cursor-pointer'>
                <Github width={20} height={(20 * 96) / 98} />
                <button className='m-0 p-0'>B-HS</button>
            </section>
        </section>
    )
}

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
            <section className='w-full flex flex-col sticky top-0 bg-background z-50 [&>section]:p-3'>
                <PopupHeader selectedDay={selectedDay} setSelectedDay={setSelectedDay} days={[...days]} />
                <Separator />
                <section className='flex gap-2 items-baseline !py-2'>
                    <h3 className='m-0 p-0'>{selectedDay}요일 북마크 목록</h3>
                    <span className='text-xs text-secondary-foreground'>웹툰명을 클릭하여 북마크를 설정할 수 있습니다.</span>
                </section>
                <section className='w-full relative !py-2'>
                    <Search className='absolute left-[18px] top-1/2 -translate-y-1/2 size-5 p-0.5' />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className='w-full pl-7 text-sm'
                        placeholder='웹툰명을 입력하세요'
                    />
                </section>
                <Separator className='mt-1' />
            </section>
            <section className='grid grid-cols-2 w-full gap-1 gap-y-0 p-3'>
                {webtoons
                    .filter((webtoon) => (keyword ? webtoon.includes(keyword) : true))
                    ?.map((webtoon) => (
                        <Button
                            onClick={() => toggleBookmark(webtoon)}
                            className={cn(
                                'justify-start w-full items-center !gap-x-1 !py-0.5 hover:text-blue-700',
                                bookmarks?.includes(webtoon) && 'font-bold text-blue-700',
                            )}
                            variant={'ghost'}
                            size={'sm'}
                            key={webtoon}>
                            {bookmarks?.includes(webtoon) && <Check />}
                            {webtoon}
                        </Button>
                    ))}
            </section>
        </section>
    )
}
