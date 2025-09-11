interface Props {
    path?: string;
    url?: string;
}

export function EmbedPage({ url }: Props) {
    function isSafeUrl(url: string): boolean {
        try {
            const parsed = new URL(url);
            const allowedHosts = ["itemsadder.github.io", "youtube.com"];
            return (
                ["https:"].includes(parsed.protocol) &&
                allowedHosts.some(host => parsed.hostname.endsWith(host))
            );
        } catch {
            return false;
        }
    }

    if (!isSafeUrl(url)) {
        return <main>
            <div className="legacy-container">
                <h1 style={{ textAlign: "center", fontSize: "1.8em" }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        Invalid or untrusted embed URL
                    </a>
                </h1>
            </div>
        </main>;
    }

    return (
        <main>
            <div className="legacy-container">
                <h1 style={{ textAlign: "center", fontSize: "1.8em" }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        Link ↗
                    </a>
                </h1>

                <iframe
                    src={url}
                    title="Embedded Page"
                    style={{ width: "100%", height: "800px", border: "none" }}
                    allowFullScreen
                />
            </div>
        </main>
    );
}
