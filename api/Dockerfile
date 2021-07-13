FROM golang:alpine

RUN mkdir /go/src/api
COPY ./api.go /go/src/api/api.go
WORKDIR /go/src/api/

RUN go mod init && \
    go mod tidy && \
    go build api.go

RUN mv /go/src/api/api /bin/api
