export interface LiveProps {
}

const live = (props: LiveProps) => (
    <shared
        title="Live"
        body={
            <div>
                <h1>Hello!</h1>
            </div>
        }
    />
);

const shared = (title: string, body: any) => (
    <html>
        <head>
            <title>{title}</title>
        </head>
        <body>

        </body>
    </html>
);

export const liveTemplates = {
    live,
};