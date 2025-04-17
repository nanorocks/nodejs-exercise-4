class ResourceDTO<T> {
    constructor(public status: string, public message: string, public data: T) {}
}

export default ResourceDTO;
