---
title: Reference - CloudEvents extension for Azure Web PubSub event handler with HTTP protocol
description: The reference describes CloudEvents extensions for Azure Web PubSub event handler with HTTP protocol.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 11/08/2021
---

#  CloudEvents extension for Azure Web PubSub event handler with HTTP protocol

The Web PubSub service delivers client events to the upstream webhook using the [CloudEvents HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.1/http-protocol-binding.md).

The data sent from the Web PubSub service to the server is always in CloudEvents `binary` format.

- [Webhook Validation](#protection)
- [Web PubSub CloudEvents Attribute Extension](#extension)
- [Events](#events)
    - Blocking events
        - [System `connect` event](#connect)
        - [User events](#message)
    - Unblocking events
        - [System `connected` event](#connected)
        - [System `disconnected` event](#disconnected)

## Webhook validation

<a name="protection"></a>

The Webhook validation follows [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). The request always contains `WebHook-Request-Origin: xxx.webpubsub.azure.com` in the header.

If and only if the delivery target does allow delivery of the events, it MUST reply to the request by including `WebHook-Allowed-Origin` header, for example:

`WebHook-Allowed-Origin: *`

Or:

`WebHook-Allowed-Origin: xxx.webpubsub.azure.com`

For now, [WebHook-Request-Rate](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#414-webhook-request-rate) and [WebHook-Request-Callback](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#413-webhook-request-callback) are not supported.


## Web PubSub CloudEvents attribute extension
<a name="extension"></a>

> It was also noted that the HTTP specification is now following a similar pattern by no longer suggesting that extension HTTP headers be prefixed with X-.

This extension defines attributes used by Web PubSub for every event it produces.

### Attributes

| Name | Type | Description | Example|
|--|--|--|--|
| `userId` | `string` | The user the connection authed | |
| `hub` | `string` | The hub the connection belongs to | |
| `connectionId` | `string` | The connectionId is unique for the client connection | |
| `eventName` | `string` | The name of the event without prefix | |
| `subprotocol` | `string` | The subprotocol the client is using if any | |
| `connectionState` | `string` | Defines the state for the connection. You can use the same response header to reset the value of the state. Multiple `connectionState` headers are not allowed. Do base64 encode the string value if it contains complex characters inside, for example, you can `base64(jsonString)` to pass complex object using this attribute.| |
| `signature` | `string` | The signature for the upstream webhook to validate if the incoming request is from the expected origin. The service calculates the value using both primary access key and secondary access key as the HMAC key: `Hex_encoded(HMAC_SHA256(accessKey, connectionId))`. The upstream should check if the request is valid before processing it. | |

## Events

There are two types of events, one is *blocking* events that the service waits for the response of the event to continue. One is *unblocking* events that the service doesn't wait for the response of such event before processing the next message.

- Blocking events
    - [System `connect` event](#connect)
    - [User events](#message)
- Unblocking events
    - [System `connected` event](#connected)
    - [System `disconnected` event](#disconnected)

### System `connect` event
<a name="connect"></a>

* `ce-type`: `azure.webpubsub.sys.connect`
* `Content-Type`: `application/json`

#### Request format:

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json; charset=utf-8
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.sys.connect
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: connect

{
    "claims": {},
    "query": {},
    "headers": {},
    "subprotocols": [],
    "clientCertificates": [
        {
            "thumbprint": "ABC"
        }
    ]
}

```

#### Success response format:
* Status code:
    * `204`: Success, with no content.
    * `200`: Success, the content SHOULD be a JSON format, with following properties allowed:
* Header `ce-connectionState`: If this header exists, the connection state of this connection will be updated to the value of the header. Please note that only *blocking* events can update the connection state. The below sample uses base64 encoded JSON string to store the complex state for the connection.
*
```HTTP
HTTP/1.1 200 OK
ce-connectionState: eyJrZXkiOiJhIn0=

{
    "groups": [],
    "userId": "",
    "roles": [],
    "subprotocol": ""
}

```

* `subprotocols`

    The `connect` event forwards the subprotocol and authentication information to Upstream from the client. Web PubSub service uses the status code to determine if the request will be upgraded to WebSocket protocol.

    If the request contains the `subprotocols` property, the server should return one subprotocol it supports. If the server doesn't want to use any subprotocols, it should **not** send the `subprotocol` property in response. [Sending a blank header is invalid](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#Subprotocols).

* `userId`: `{auth-ed user ID}`

    As the service allows anonymous connections, it's the `connect` event's responsibility to tell the service the user ID of the client connection. The service will read the user ID from the response payload `userId` if it exists. The connection will be dropped if the user ID cannot be read from the request claims nor the `connect` event's response payload.

<a name="connect_response_header_group"></a>

* `groups`: `{groups to join}`

    The property provides a convenient way for user to add this connection to one or multiple groups. In this way, there's no need to have another call to add this connection to some group.

* `roles`: `{roles the client has}`

    The property provides a way for the upstream Webhook to authorize the client.   There are different roles to grant initial permissions for PubSub WebSocket clients. Details about the permissions are described in [Client permissions](./concept-client-protocols.md#permissions).

#### Error response format:

* `4xx`: Error, the response from Upstream will be returned as the response for the client request.

```HTTP
HTTP/1.1 401 Unauthorized
```

### System `connected` event
<a name="connected"></a>
The service calls the Upstream when the client completes WebSocket handshake and is successfully connected.

* `ce-type`: `azure.webpubsub.sys.connected`
* `Content-Type`: `application/json`
* `ce-connectionState`: `eyJrZXkiOiJhIn0=`

Request body is empty JSON.

#### Request format:

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json; charset=utf-8
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.sys.connected
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: connect
ce-subprotocol: abc
ce-connectionState: eyJrZXkiOiJhIn0=

{}

```

#### Response format:

`2xx`: success response.

`connected` is an asynchronous event, when the response status code is not success, the service logs an error.

```HTTP
HTTP/1.1 200 OK
```


### System `disconnected` event
<a name="disconnected"></a>
`disconnected` event is **always** triggered when the client request completes if the **connect** event returns `2xx` status code.

* `ce-type`: `azure.webpubsub.sys.disconnected`
* `Content-Type`: `application/json`

#### Request format:

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json; charset=utf-8
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.sys.disconnected
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: disconnect
ce-subprotocol: abc
ce-connectionState: eyJrZXkiOiJhIn0=

{
    "reason": "{Reason}"
}

```

* `reason`

    The `reason` describes the reason the client disconnects.


#### Response format:

`2xx`: success response.

`disconnected` is an asynchronous event, when the response status code is not success, the service logs an error.

```HTTP
HTTP/1.1 200 OK
```


### User event `message` for the simple WebSocket clients
<a name="message"></a>
The service invokes the event handler upstream for every WebSocket message frame.

* `ce-type`: `azure.webpubsub.user.message`
* `Content-Type`: `application/octet-stream` for binary frame; `text/plain` for text frame;

UserPayload is what the client sends.

#### Request format:

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/octet-stream | text/plain | application/json
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.message
ce-source: /hubs/{hub}/client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub}
ce-eventName: message
ce-connectionState: eyJrZXkiOiJhIn0=

UserPayload

```

#### Success response format

* Status code
    * `204`: Success, with no content.
    * `200`: Success, the format of the `UserResponsePayload` depends on the `Content-Type` of the response.
* `Content-Type`: `application/octet-stream` for binary frame; `text/plain` for text frame;
* Header `Content-Type`: `application/octet-stream` for binary frame; `text/plain` for text frame;
* Header `ce-connectionState`: If this header exists, the connection state of this connection will be updated to the value of the header. Please note that only *blocking* events can update the connection state. The below sample uses base64 encoded JSON string to store complex state for the connection.

When the `Content-Type` is `application/octet-stream`, the service sends `UserResponsePayload` to the client using `binary` WebSocket frame. When the `Content-Type` is `text/plain`, the service sends `UserResponsePayload` to the client using `text` WebSocket frame.

```HTTP
HTTP/1.1 200 OK
Content-Type: application/octet-stream (for binary frame) or text/plain (for text frame)
Content-Length: nnnn
ce-connectionState: eyJrZXkiOiJhIn0=

UserResponsePayload
```

#### Error response format
When the status code is not success, it is considered to be error response. The connection would be **dropped** if the `message` response status code is not success.

### User custom event `{custom_event}` for PubSub WebSocket clients
<a name="custom_event"></a>

The service calls the event handler webhook for every valid custom event message.

#### Case 1: send event with text data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "text",
    "data": "text data"
}
```

What the upstream event handler receives like below, the `Content-Type` for the CloudEvents HTTP request is `text/plain` for `dataType`=`text`

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: text/plain
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.<event_name>
ce-source: /client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub_name}
ce-eventName: <event_name>
ce-subprotocol: json.webpubsub.azure.v1
ce-connectionState: eyJrZXkiOiJhIn0=

text data

```

#### Case 2: send event with JSON data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "json",
    "data": {
        "hello": "world"
    },
}
```

What the upstream event handler receives like below, the `Content-Type` for the CloudEvents HTTP request is `application/json` for `dataType`=`json`

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/json
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.<event_name>
ce-source: /client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub_name}
ce-eventName: <event_name>
ce-subprotocol: json.webpubsub.azure.v1
ce-connectionState: eyJrZXkiOiJhIn0=

{
    "hello": "world"
}

```

#### Case 3: send event with binary data:
```json
{
    "type": "event",
    "event": "<event_name>",
    "dataType" : "binary",
    "data": "aGVsbG8gd29ybGQ=" // base64 encoded binary
}
```

What the upstream event handler receives like below, the `Content-Type` for the CloudEvents HTTP request is `application/octet-stream` for `dataType`=`binary`

```HTTP
POST /upstream HTTP/1.1
Host: xxxxxx
WebHook-Request-Origin: xxx.webpubsub.azure.com
Content-Type: application/octet-stream
Content-Length: nnnn
ce-specversion: 1.0
ce-type: azure.webpubsub.user.<event_name>
ce-source: /client/{connectionId}
ce-id: {eventId}
ce-time: 2021-01-01T00:00:00Z
ce-signature: sha256={connection-id-hash-primary},sha256={connection-id-hash-secondary}
ce-userId: {userId}
ce-connectionId: {connectionId}
ce-hub: {hub_name}
ce-eventName: <event_name>
ce-subprotocol: json.webpubsub.azure.v1

<binary data>

```

#### Success response format

```HTTP
HTTP/1.1 200 OK
Content-Type: application/octet-stream | text/plain | application/json
Content-Length: nnnn

UserResponsePayload
```
* Status code
    * `204`: Success, with no content.
    * `200`: Success, data sending to the PubSub WebSocket client depends on the `Content-Type`;
* Header `ce-connectionState`: If this header exists, the connection state of this connection will be updated to the value of the header. Please note that only *blocking* events can update the connection state. The below sample uses base64 encoded JSON string to store the complex state for the connection.
* When Header `Content-Type` is `application/octet-stream`, the service sends `UserResponsePayload` back to the client using `dataType` as `binary` with payload base64 encoded. A sample response:
    ```json
    {
        "type": "message",
        "from": "server",
        "dataType": "binary",
        "data" : "aGVsbG8gd29ybGQ="
    }
    ```
* When the `Content-Type` is `text/plain`, the service sends `UserResponsePayload` to the client using `dataType` as  `text` with payload string.
* When the `Content-Type` is `application/json`, the service sends `UserResponsePayload` to the client using `dataType`=`json` with `data` value token as the response payload body.


#### Error response format
When the status code is not success, it is considered to be error response. The connection would be **dropped** if the `{custom_event}` response status code is not success.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
