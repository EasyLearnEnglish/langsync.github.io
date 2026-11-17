import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { videoId, lang = 'en' } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'Missing required parameter: videoId' });
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

        return res.status(200).json(formattedSubtitles);
    } catch (error) {
        return res.status(404).json({ error: 'Subtitles unavailable for this YouTube video ID' });
    }
}
