'use client';

import { useState } from 'react';
import { FaSearch, FaCopy } from 'react-icons/fa';

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
    const [toast, setToast] = useState<string | null>(null);

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

    cons copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setToast('クリップボードにコピーしました！');
            setTimeout(() => setToast(null), 3000); // トーストを3秒後に非表示
        } catch (error) {
            console.error('コピーに失敗しました:', error);
            setToast('コピーに失敗しました。');
            setTimeout(() => setToast(null), 3000);
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
                        backgroundColor: '#FF6B5E',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    disabled={loading}
                >
                    <FaSearch size={20} />
                </button>
            </div>

            {result && (
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
                        <h2><strong>チャンネル名：{result.title}</strong></h2>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <strong>チャンネルID:</strong>{' '}
                            <span style={{ marginLeft: '10px' }}>{result.id}</span>
                            <button
                                onClick={() => copyToClipboard(result.id)}
                                style={{
                                    marginLeft: '10px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    padding: '5px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <FaCopy size={14} />
                                <span style={{ marginLeft: '5px' }}></span>
                            </button>
                        </p>
                        <p>
                            <strong>開設日（JST）:</strong> {result.publishedAt}
                        </p>
                        <p>
                            <strong>チャンネル登録者数:</strong>{' '}
                            {Number(result?.subscriberCount?.replace(/,/g, '') || 0).toLocaleString()}
                        </p>
                        <p>
                            <strong>視聴回数:</strong>{' '}
                            {Number(result?.viewCount?.replace(/,/g, '') || 0).toLocaleString()}
                        </p>
                        <p>
                            <strong>コンテンツ数:</strong>{' '}
                            {Number(result?.videoCount?.replace(/,/g, '') || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#333',
                        color: '#FFF',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                >
                    {toast}
                </div>
            )}
        </div>
    );
}
