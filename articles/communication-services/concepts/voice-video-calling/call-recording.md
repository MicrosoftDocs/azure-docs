---
title: Azure Communication Services Call Recording overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Recording feature and APIs.
author: joseys
manager: anvalent
services: azure-communication-services

ms.author: joseys
ms.date: 04/13/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Calling Recording overview

> \* Many countries and states have laws and regulations that apply to the recording of PSTN, voice, and video calls, which often require that users consent to the recording of their communications. It is your responsibility to use the call recording capabilities in compliance with the law. You must obtain consent from the parties of recorded communications in a manner that complies with the laws applicable to each participant.

Call Recording provides a set of server APIs to start, stop, pause and resume recording, which can be triggered from server-side business logic or events received from user actions. Recorded media output is in MP4 Audio+Video format (same as Teams recordings). Notifications that a recording media and meta-data files are ready for retrieval are provided via Event Grid. Recordings are stored for 48 hours on built-in temporary storage, for retrieval and movement to a long-term storage solution of choice. 

**Key Features of Call Recording**
- **Run-time Control APIs** - Server-side control APIs for Start, Stop, Pause, and Resume Recording. 
- **Media Output Types** - Recorded media output is MP4 Audio+Video format (same as Teams recordings), with more formats planned in future releases.
- **Event Grid Notifications** - Notifications are sent via an event grid configured in your ACS resource when a recording file is ready for retrieval. 
- **File Download** - Recordings are stored for 48 hours on built-in transitory storage, for retrieval and movement to a long-term storage solution of choice.

## Run-time Control APIs
### Start Recording
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "start-recording"
}-->
```http
POST /calling/conversations/{conversationId}/Recordings
Content-Type: application/json

{
  "operationContext": "string",
  "recordingStateCallbackUri": "string"
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "request",
  "name": "start-recording"
}-->
```C#
string connectionString = "YOUR_CONNECTION_STRING";
ConversationClient conversationClient = new ConversationClient(connectionString);

/// start call recording
StartRecordingResponse startRecordingResponse = await conversationClient.StartRecordingAsync(
    conversationId: "<conversation-id>"
    operationContext: "<operation-context>",
    recordingStateCallbackUri: "<recording-state-callback-uri>").ConfigureAwait(false);

string recordingId = startRecordingResponse.RecordingId;
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
  "recordingInstanceId": "string"
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 404 Not found
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```C#
CONTENT NEEDED
```
### Get Call Recording State
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "get-recording-state"
}-->
```http
GET /calling/conversations/{conversationId}/recordings/{recordingId}
Content-Type: application/json

{
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "request",
  "name": "start-recording"
}-->
```C#
string connectionString = "YOUR_CONNECTION_STRING";
ConversationClient conversationClient = new ConversationClient(connectionString);

/// get recording state
GetCallRecordingStateResponse recordingState = await conversationClient.GetRecordingStateAsync(
    conversationId: "<conversation-id>",
    recordingId: <recordingId>).ConfigureAwait(false);
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
  "recordingState": "active"
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```C#
CONTENT NEEDED
```

### Stop Recording
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "stop-recording"
}-->
```http
DELETE /calling/conversations/{conversationId}/recordings/{recordingId}
Content-Type: application/json

{
  "operationContext": "string" //WHAT IS THIS FOR?
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "request",
  "name": "start-recording"
}-->
```C#
string connectionString = "YOUR_CONNECTION_STRING";
ConversationClient conversationClient = new ConversationClient(connectionString);

/// stop recording
StopRecordingResponse response = conversationClient.StopRecordingAsync(
    conversationId: "<conversation-id>",
    recordingId: <recordingId>,
    operationContext: "<operation-context>").ConfigureAwait(false);
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
//No Content?
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```C#
CONTENT NEEDED
```
### Pause Recording
Pausing and Resuming call recording enables you to skip recording a portion of a call or meeting, and resume recording to a single file. 
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "pause-recording"
}-->
```http
POST /calling/conversations/{conversationId}/recordings/{recordingId}/Pause
Content-Type: application/json

{
  "operationContext": "string" //WHAT IS THIS FOR?
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "request",
  "name": "start-recording"
}-->
```C#
string connectionString = "YOUR_CONNECTION_STRING";
ConversationClient conversationClient = new ConversationClient(connectionString);

/// pause recording
PauseRecordingResponse response = conversationClient.PauseRecordingAsync(
    conversationId: "<conversation-id>",
    recordingId: <recordingId>,
    operationContext: "<operation-context>").ConfigureAwait(false);
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
//No Content?
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```C#
CONTENT NEEDED
```
### Resume Recording
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "resume-recording"
}-->
```http
POST /calling/conversations/{conversationId}/recordings/{recordingId}/Resume
Content-Type: application/json

{
  "operationContext": "string" //WHAT IS THIS FOR?
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "request",
  "name": "start-recording"
}-->
```C#
string connectionString = "YOUR_CONNECTION_STRING";
ConversationClient conversationClient = new ConversationClient(connectionString);

/// resume recording
ResumeRecordingResponse response = conversationClient.ResumeRecordingAsync(
    conversationId: "<conversation-id>",
    recordingId: <recordingId>,
    operationContext: "<operation-context>").ConfigureAwait(false);
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
//No Content?
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
# [C#](#tab/csharp)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```C#
CONTENT NEEDED
```

## Media Output Types
Call Recording currently supports mixed audio+video MP4 output format. The output media matches meeting recordings produced via Microsoft Teams recording. Additional output formats, such as audio only MP3, are planned for future releases and will be specified as an input parameter to the Start Recording call.
|Channel Type|Content Format|Video|Audio|Notes|
|:---------|:--|:----------------------------------------------------------------------|:-------------------------------------------|:---------------------------------|
|audioVideo|mp4|1080p 15 FPS video feed of all participants in default tile arrangement|14.4kHz mp4a mixed audio of all participants|**NEED TO VERIFY AUDI/VIDEO SPEC**|

## Event Grid Notifications
An Event Grid notification `Call Recording File Status Updated` is published when a recording is ready for retrieval, typically 1-2 minutes after the recording process has completed (i.e. meeting ended, recording stopped). Recording event notifications include a document ID, which can be used to retrieve both recorded media and a recording meta-data file:
- <Azure_Communication_Service_Endpoint>/recording/download/{documentId}
- <Azure_Communication_Service_Endpoint>/recording/download/{documentId}/metadata

Sample code for handling event grid notifications and downloading recording and meta-data files can be found [here](https://github.com/microsoft/botframework-telephony/tree/main/samples/csharp_dotnetcore/05a.telephony-recording-download-function). **Link to our own sample**

### Meta-data Files
> \* Regulations such as GDPR require the ability to export user data. In order to enable to support these requirements, recording meta data files include the participantId for each call participant in the participants[] array. You can cross-reference the MRIs in the participants[] array with your internal user identities to identify participants in a call. An example of an recording meta-data file is provided below for reference:

```json
{
  "resourceId": "29bd5ea9-e0fc-4d00-8f6f-339b1f0ee2e2",
  "callId": "43563209-4ec6-4119-be5b-88398cda2caf",
  "chunkDocumentId": "0-eus-d11-05bf22b166dfb2119e3ff85d98906121",
  "chunkIndex": 0,
  "chunkStartTime": "2021-03-24T18:52:14.1321393Z",
  "chunkDuration": 15000.0,
  "pauseResumeIntervals": [],
  "recordingInfo": {
    "contentType": "mixed",
    "channelType": "audioVideo",
    "format": "mp4",
    "audioConfiguration": {
        "sampleRate": "16000",
        "bitRate": 128000,
        "channels": 1
        },
     "videoConfiguration": {
        "longerSideLength": 1920,
        "shorterSideLength": 1080,
        "framerate": 8,
        "bitRate": 1000000
        }
    },
  "participants": [
    {
    "participantId": "8:acs:29bd5ea9-e0fc-4d00-8f6f-339b1f0ee2e2_00000008-6ad3-6540-99c6-593a0d00c367"
    },
    {
    "participantId": "8:acs:29bd5ea9-e0fc-4d00-8f6f-339b1f0ee2e2_31d5c120-90a9-409d-8f48-a3463c35f58e"
    }
  ]
}
```
## File Download
> \* Azure Communication Services provides short term media storage for recordings. **Export any recorded content you wish to preserve within 48 hours.** After 48 hours, recordings will no longer be available.

### Download Recording
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "download-recording"
}-->
```http
GET /recording/download/{documentId}
Content-Type: application/json

{
}
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: video/mp4

{
string
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
### Download Recording Meta-data
#### Request
# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "download-recording-meta-data"
}-->
```http
GET /recording/download/{documentId}/metadata
Content-Type: application/json

{
}
```
#### Response
>**Note:** The response object shown here might be shortened for readability. 
# [HTTP](#tab/http)
<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 200 Success
Content-Type: application/json

{
  "resourceId": "string",
  "callId": "string",
  "chunkDocumentId": "string",
  "chunkIndex": 0,
  "chunkStartTime": "string",
  "chunkDuration": 0,
  "pauseResumeIntervals": [
    {
      "startTime": "string",
      "duration": 0
    }
  ],
  "recordingInfo": {
    "contentType": "string",
    "channelType": "string",
    "format": "string",
    "audioConfiguration": {
      "sampleRate": "string",
      "bitRate": 0,
      "channels": 0
    },
    "videoConfiguration": {
      "longerSideLength": 0,
      "shorterSideLength": 0,
      "framerate": 0,
      "bitRate": 0
    }
  },
  "participants": [
    {
      "participantId": "string"
    }
  ]
}

HTTP/1.1 400 Bad request
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}

HTTP/1.1 500 	Internal server error
Content-Type: application/json

{
  "code": "string",
  "message": "string",
  "target": "string",
  "details": [
    null
  ]
}
```
