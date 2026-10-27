FROM alpine:3.20
# Pick the version from https://github.com/pocketbase/pocketbase/releases (must be 0.23 or newer)
ARG PB_VERSION=0.23.12
RUN apk add --no-cache ca-certificates unzip
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb && rm /tmp/pb.zip && chmod +x /pb/pocketbase
COPY pb_migrations /pb/pb_migrations
COPY entrypoint.sh /pb/entrypoint.sh
# Mount a Railway volume at /pb/pb_data so your data and pictures survive redeploys
CMD ["sh", "/pb/entrypoint.sh"]
