FROM golang

RUN mkdir /go/src/api
COPY ./api.go /go/src/api/api.go
WORKDIR /go/src/api/
RUN go get ./...
RUN go build api.go

EXPOSE 3001
