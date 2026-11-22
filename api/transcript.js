import { YoutubeTranscript } from 'youtube-transcript';

export async function handler(event, context) {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }

    const videoId = event.queryStringParameters?.videoId;
    const lang = event.queryStringParameters?.lang || 'en';

    if (!videoId) {
        return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Missing required parameter: videoId' })
        };
    }

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang });
        
        const formattedSubtitles = transcript.map(item => {
            const startSec = item.offset / 1000;
            const durSec = item.duration / 1000;
            return {
                start: parseFloat(startSec.toFixed(2)),
                end: parseFloat((startSec + durSec).toFixed(2)),
                text: item.text
            };
        });

        return {
            statusCode: 200,
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedSubtitles)
        };
    } catch (error) {
        return {
            statusCode: 404,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Subtitles unavailable for this YouTube video ID' })
        };
    }
}
