---
title: AckId and Ack Response
description: This article presents an overview of the client protocols for Azure Web PubSub.
author: chenyl
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/16/2021
---

# AckId and Ack Response

The PubSub WebSocket Client supports `ackId` property for `joinGroup`, `leaveGroup`, `sendToGroup` and `event` messages. Although `ackId` is optional, when enabled, you can receive an ack response message when your request is finished. In the article, we describe the behavior differences between specifying `ackId` or not.

## Behavior when No `ackId` specified

If `ackId` is not specified, you can't get the result of each request. As the result, connection will be closed with disconnected message if any errors happen.

## Behavior when `ackId` specified

### Idempotent publish

`ackId` is a int32 number and should be unique with in a client with the same connection id. Web PubSub Service recodes the `ackId` and messages with same `ackId` will be treat as the same message. The service refuses to broker the same message more than once, which is useful in retry to avoid duplicated messages. For example, if a client sends a message with `ackId=5` and fails to receive ack response with `ackId=5`, then client retries and sends the same message again. In some cases, the message is already brokered and the ack response is lost for some reason, the service will reject the retry and response an ack response with `Duplicate` reason.

## Ack Response

Web PubSub Service send ack response for each request with `ackId`.

Format:
```json
{
    "type": "ack",
    "ackId": 1, // The ack id for the request to ack
    "success": false, // true or false
    "error": {
        "name": "Forbidden|InternalServerError|Duplicate|InvocationFailed",
        "message": "<error_detail>"
    }
}
```

* The `ackId` associates the request.

* `success` is a bool and indicate whether the request is successfully processed by the service. If it's `false`, clients need to check the `error`.

* `error` only exists when `success` is `false` and clients should have different logic for different `name`
    - `Forbidden`: The client don't have the permission to the request. The client needs to be added relevant roles.
    - `InternalServerError`: Some internal error happened in the service. Retry is required.
    - `Duplicate`: The message with the same `ackId` has been already processed by the service.
    - `InvocationFailed`: Event handler is not registered or response is not a success status code.
