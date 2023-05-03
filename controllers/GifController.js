export class GifController {
    static processGifData(gifData) {
        return {
            url: gifData.images.original.url,
            staticImage: {
                url: gifData.images.fixed_height_still.url,
                width: gifData.images.fixed_height_still.width,
                height: gifData.images.fixed_height_still.height,
            },
        };
    }

    static async getTrendingGif(limit) {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=Y1yxydw13CJUxHkOBHZm6NrAuO0e6JRi&limit=${limit}&rating=g`);
            const data = await response.json();
            return data?.data?.map((gifData) => {
                return this.processGifData(gifData);
            });
        } catch (error) {
            console.log('Error when fetching trending gif', error);
            throw error;
        }
    }

    static async getSearchedGif(searchString, limit) {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=Y1yxydw13CJUxHkOBHZm6NrAuO0e6JRi&q=${searchString}&limit=${limit}&offset=0&rating=g&lang=en`);
            const data = await response.json();
            return data?.data?.map((gifData) => {
                return this.processGifData(gifData);
            });
        } catch (error) {
            console.log('Error when fetching trending gif', error);
            throw error;
        }
    }
}