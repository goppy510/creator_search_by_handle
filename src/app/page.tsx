'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // スピナーアイコン

export default function Home() {
    const [handle, setHandle] = useState('');
    interface ChannelResult {
        id: string;
        title: string;
        thumbnail: string;
        publishedAt: string;
        subscriberCount: string;
        viewCount: string;
        videoCount: string;
    }

    const [result, setResult] = useState<ChannelResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!handle) return alert('ハンドルは必要です');
        setLoading(true);

        try {
            const response = await fetch(
                `https://vhahamm0pb.execute-api.ap-northeast-1.amazonaws.com/v1/youtube_data_api_channel_list?forHandle=${encodeURIComponent(
                    handle
                )}`
            );

            const data = await response.json();
            const body = JSON.parse(data['body']);

            if (body.length > 0) {
                const channel = body[0];
                setResult({
                    id: channel.id,
                    title: channel.snippet.title,
                    thumbnail: channel.snippet.thumbnails.default.url,
                    publishedAt: new Date(channel.snippet.publishedAt).toLocaleString(),
                    subscriberCount: channel.statistics?.subscriberCount || '不明',
                    viewCount: channel.statistics?.viewCount || '不明',
                    videoCount: channel.statistics?.videoCount || '不明',
                });
            } else {
                alert('該当するチャンネルが見つかりません。');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('何か問題が発生しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <h1 style={{ marginBottom: '20px', fontSize: '2rem' }}>ゆーちゅーぶチャンネルID</h1>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@handle"
                    style={{
                        padding: '15px',
                        fontSize: '18px',
                        width: '400px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginRight: '10px',
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '20px',
                        backgroundColor: loading ? '#ccc' : '#FF6B5E',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    disabled={loading}
                >
                    {loading ? <AiOutlineLoading3Quarters size={20} className="spin" /> : <FaSearch size={20} />}
                </button>
            </div>

            {loading && (
                <p style={{ fontSize: '1rem', color: '#555', marginTop: '20px' }}>
                    検索中です。お待ちください...
                </p>
            )}

            {result && !loading && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '20px',
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        width: '80%',
                        maxWidth: '800px',
                    }}
                >
                    <img
                        src={result.thumbnail}
                        alt="Thumbnail"
                        style={{
                            width: '100px',
                            height: '100px',
                            marginRight: '20px',
                            borderRadius: '8px',
                        }}
                    />
                    <div style={{ textAlign: 'left' }}>
                        <h2>{result.title}</h2>
                        <p>
                            <strong>チャンネルID:</strong> {result.id}
                        </p>
                        <p>
                            <strong>開設日:</strong> {result.publishedAt}
                        </p>
                        <p>
                            <strong>チャンネル登録者数:</strong> {result?.subscriberCount || '不明'}
                        </p>
                        <p>
                            <strong>視聴回数:</strong> {result?.viewCount || '不明'}
                        </p>
                        <p>
                            <strong>コンテンツ数:</strong> {result?.videoCount || '不明'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
