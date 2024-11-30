export const days = ['월', '화', '수', '목', '금', '토', '일'] as const
export type Days = (typeof days)[number]
