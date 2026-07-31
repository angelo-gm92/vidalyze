export async function getVideoMetadata(url) {
    const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    if (!res.ok) {
        throw new Error("Error analizando el video");
    }

    return await res.json();
}
