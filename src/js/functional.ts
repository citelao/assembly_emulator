export function times<T>(n: number, func: (index: number) => T): T[] {
    const ret: T[] = [];
    for (let i = 0; i < n; i++) {
        ret.push(func(i));
    }
    return ret;
}
