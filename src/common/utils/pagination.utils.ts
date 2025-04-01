export function getPagination(page: number = 1, pageSize: number = 10) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return { limit, offset };
}

export function getSortOrder(sortBy: string, order: 'asc' | 'desc' = 'asc') {
    return { [sortBy]: order };
}
