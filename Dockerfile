FROM docker.io/debian:12 AS prep
RUN apt update -y && apt install curl unzip -y
WORKDIR /downloads
RUN curl -sSL "https://github.com/oven-sh/bun/releases/download/bun-v1.1.38/bun-linux-aarch64.zip" -o bun-linux-aarch64.zip
RUN curl -sSL "https://github.com/oven-sh/bun/releases/download/bun-v1.1.38/bun-linux-x64.zip" -o bun-linux-x64.zip
RUN unzip "bun-linux-aarch64.zip"
RUN unzip "bun-linux-x64.zip"
RUN mv bun-linux-x64/bun /usr/bin/bun
WORKDIR /src

FROM prep AS build
COPY . .
WORKDIR /src/clients/live
RUN bun install && bun run build
WORKDIR /src/src
RUN bun install && rm -rf clients

FROM --platform=arm64 gcr.io/distroless/base-nossl-debian12 AS base
WORKDIR /app

FROM base AS final
COPY --from=build /src /app
COPY --from=build /downloads/bun-linux-aarch64/bun /usr/bin/bun
ENV APP_PORT=3000
ENV YPERSISTENCE=/data
ENTRYPOINT ["/usr/bin/bun"]
CMD ["./src/app.ts"]
