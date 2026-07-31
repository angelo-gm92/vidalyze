export async function getYoutubeMetadata(url) {
    const response = await fetch(
        `http://localhost:3000/api/youtube?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
        throw new Error("Error fetching YouTube metadata");
    }

    return await response.json();
}
