# Notify

A notification service.  This application creates a publish and subscribe notification service.

## Features

* Simple http/json API
* Basic Authentication
* Notification Types
  - Email
  - http POST
  - SMS (????)
  - Voice (callfire)

## Install

```
npm install notify -g
```

## Usage

start on port 8000 in debug mode
```
notify -P 8000 --debug
```

## API

Subscribe to Channel

### POST /subscribe/:channel

```
{
  "name": "unique-name",
  "type": (http|email|sms|phone),
  "src": "value here"
}
```

Publish to Channel

### POST /publish/:channel

```
{ "title": "", "msg": ""}
```
