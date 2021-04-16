---
title: Azure Communication Services Call Automation API overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Automation feature and APIs.
author: joseys
manager: anvalent
services: azure-communication-services

ms.author: joseys
ms.date: 04/16/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Call Automation APIs Overview

Call Automation APIs enable organizations to connect with their customers or employees at scale through automated business logic running on server applications. With these APIs you can use Azure Communication Services to create automated outbound reminder calls for appointments or to provide pro-active notifications for events like power outages or wildfires. These capabilities also enable companies to use IVR applications to answer incoming calls to ACS phone numbers, and then route calls to the correct agent based on customer inputs. Applications added to a call can also monitor updates as participants join or leave for added reporting and/or logging. 

## In-Call APIs
> **Note:** In-Call applications are billed as an ACS participant at standard PSTN and VoIP rates.
                                                        

### Create call
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "create-call"
}-->
```
POST /calls
Content-Type: application/json

{
  "targets": [
    null
  ],
  "subject": "string",
  "callbackUri": "string",
  "requestedModalities": [
    "audio"
  ],
  "requestedCallEvents": [
    "participantsUpdated"
  ]
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
  "callLegId": "string"
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
```
### Hangup a call
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "hangup-call"
}-->
```
POST /calls/{callId}/Hangup
Content-Type: application/json

{
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
```
### Delete a call
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "delete-call"
}-->
```
DELETE /calls/{callId}
Content-Type: application/json

{
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 Internal server error
Content-Type: application/json

{
}
```
### Play audio in call
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "play-audio"
}-->
```
POST /calls/{callId}/PlayAudio
Content-Type: application/json

{
  "audioFileUri": "string",
  "loop": true,
  "operationContext": "string",
  "resourceId": "string"
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
  "id": "string",
  "status": "notStarted",
  "operationContext": "string",
  "resultInfo": {
    "code": 0,
    "subcode": 0,
    "message": "string"
  }
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
```
### Invite participant
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "invite-participant "
}-->
```
POST /calls/{callId}/participants
Content-Type: application/json

{
  "participants": [
    null
  ],
  "operationContext": "string"
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
### Cancel media processing
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "cancel-media-processing"
}-->
```
POST /calls/{callId}/CancelMediaProcessing
Content-Type: application/json

{
  "operationContext": "string"
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
  "id": "string",
  "status": "notStarted",
  "operationContext": "string",
  "resultInfo": {
    "code": 0,
    "subcode": 0,
    "message": "string"
  }
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
```
### Remove participant
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "remove-participant "
}-->
```
DELETE /calls/{callId}/participants/{participantId}
Content-Type: application/json

{
  "participants": [
    null
  ],
  "operationContext": "string"
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
### Cancel media processing
#### Request
**HTTP**
<!-- {
  "blockType": "request",
  "name": "cancel-media-processing"
}-->
```
POST /calls/{callId}/CancelMediaProcessing
Content-Type: application/json

{
  "operationContext": "string"
}
```
**C# SDK**

```C#
// Need example from SDK
```
#### Response
**HTTP**
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 202 Success
Content-Type: application/json

{
  "id": "string",
  "status": "notStarted",
  "operationContext": "string",
  "resultInfo": {
    "code": 0,
    "subcode": 0,
    "message": "string"
  }
}
```
```
HTTP/1.1 400 Bad request
Content-Type: application/json

{
}
```
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
}
```
```
HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
}
```
