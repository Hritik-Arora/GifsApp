export const getUpdatedGifsForLandscape = (gifs) => {
    const updatedGifs = [];
    let i = 0;
    while(i<gifs.length) {
        const arr = [gifs[i]];
        if (i+1 < gifs.length) {
            arr.push(gifs[i+1]);
            i+=2;
        } else {
            i+=1;
        }
        updatedGifs.push(arr);
    }
    return updatedGifs;
};
