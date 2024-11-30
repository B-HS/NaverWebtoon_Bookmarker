import { cn } from '@src/utils'
import { Button } from '@ui/button'
import { Check } from 'lucide-react'

export const PopupContent = ({
    keyword,
    webtoons,
    bookmarks,
    toggleBookmark,
}: {
    keyword: string
    webtoons: string[]
    bookmarks: string[]
    toggleBookmark: Function
}) => {
    return (
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
    )
}
