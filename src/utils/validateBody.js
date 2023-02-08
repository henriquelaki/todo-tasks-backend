export const validateBody = (body) => {
    const { title, description } = { ...body }
    if (!title || !description) {
        return false
    }
    return true
}