FROM golang:alpine AS builder

RUN mkdir /go/src/api
COPY ./api.go /go/src/api/api.go
WORKDIR /go/src/api/

RUN go mod init && \
    go mod tidy && \
    go build api.go

FROM alpine:latest

COPY --from=builder /go/src/api/api /bin/api
