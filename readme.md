# Notify

A notification service.  This application creates a publish and subscribe notification service.  It is simple to use, when you have the service up and running, you post your subscribers with their contact info into the channel that you want them to be notified for.  Then you add the notification publish post to your application.  When you application publishes a json object with a title and msg for a particular channel, Notify will contact each subscriber of that channel.

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

## Configure

```
notify init
# answer the config questions
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
  "value": "value here"
}
```

Publish to Channel

### POST /publish/:channel

```
{ "title": "", "msg": ""}
```

## LICENSE

MIT

## DESIGN GOALS

* Simple API
* Simple DataStore
* Durable and efficient notifications
* Basic Authentication

## Contributions

* Welcome but should stay true to the design goals

## Thanks


