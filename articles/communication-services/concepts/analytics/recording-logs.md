---
title: Azure Communication Services - Call Recording summary logs
titleSuffix: An Azure Communication Services conceptual article
description: Learn about the properties of summary logs for the Call Recording feature.
author: Mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 10/27/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Call Recording summary logs
In Azure Communication Services, summary logs for the Call Recording feature provide details about:

- Call duration.
- Media content (for example, audio/video, unmixed, or transcription).
- Format types used for the recording (for example, WAV or MP4).
- The reason why the recording ended.

A recording file is generated at the end of a call or meeting. The recording can be initiated and stopped by either a user or an app (bot). It can also end because of a system failure.

Summary logs are published after a recording is ready to be downloaded. The logs are published within the standard latency time for Azure Monitor resource logs. See [Log data ingestion time in Azure Monitor](../../../azure-monitor/logs/data-ingestion-time.md#azure-metrics-resource-logs-activity-log).

## Properties

| Property name |	Data type |	Description |
|----------  |-----------|--------------|
|`timeGenerated`|DateTime|Time stamp (UTC) of when the log was generated.|
|`operationName`|String|Operation associated with a log record.|
|`correlationId`|String|ID that's used to correlate events between tables.|
|`recordingID`|String|ID for the recording that this log refers to.|
|`category`|String|Log category of the event. Logs with the same log category and resource type have the same property fields.|        
|`resultType`|String| Status of the operation.|
|`level`|String	|Severity level of the operation.| 
|`chunkCount`|Integer|Total number of chunks created for the recording.|
|`channelType`|String|Channel type of the recording, such as mixed or unmixed.|
|`recordingStartTime`|DateTime|Time that the recording started.|
|`contentType`|String|Content of the recording, such as audio only, audio/video, or transcription.|
|`formatType`|String|File format of the recording.|
|`recordingLength`|Double|Duration of the recording in seconds.|                                                               
|`audioChannelsCount`|Integer|Total number of audio channels in the recording.|
|`recordingEndReason`|String|Reason why the recording ended.|   

## Call Recording and example data

```json
"operationName":            "Call Recording Summary",
"operationVersion":         "1.0",
"category":                 "RecordingSummaryPUBLICPREVIEW",

```
A call can have one recording or many recordings, depending on how many times a recording event is triggered.

For example, if an agent initiates an outbound call on a recorded line and the call drops because of a poor network signal, `callid` will have one `recordingid` value. If the agent calls back the customer, the system generates a new `callid` instance and a new `recordingid` value. 


#### Example: Call Recording for one call to one recording

```json
"properties"
{  
  "TimeGenerated":"2022-08-17T23:18:26.4332392Z",
    "OperationName": "RecordingSummary",
    "Category": "CallRecordingSummary",
    "CorrelationId": "zzzzzz-cada-4164-be10-0000000000",
    "ResultType": "Succeeded",
    "Level": "Informational",
    "RecordingId": "eyJQbGF0Zm9ybUVuZHBvaW5xxxxxxxxFmNjkwxxxxxxxxxxxxSZXNvdXJjZVNwZWNpZmljSWQiOiJiZGU5YzE3Ni05M2Q3LTRkMWYtYmYwNS0yMTMwZTRiNWNlOTgifQ",
    "RecordingEndReason": "CallEnded",
    "RecordingStartTime": "2022-08-16T09:07:54.0000000Z",
    "RecordingLength": "73872.94",
    "ChunkCount": 6,
   "ContentType": "Audio - Video",
    "ChannelType": "mixed",
    "FormatType": "mp4",
    "AudioChannelsCount": 1
}
```

If the agent initiates a recording and then stops and restarts the recording multiple times while the call is still on, `callid` will have many `recordingid` values, depending on how many times the recording events were triggered.

#### Example: Call Recording for one call to many recordings

```json 

{   
 "TimeGenerated": "2022-08-17T23:55:46.6304762Z",
    "OperationName": "RecordingSummary",
    "Category": "CallRecordingSummary",
    "CorrelationId": "xxxxxxx-cf78-4156-zzzz-0000000fa29cc",
    "ResultType": "Succeeded",
    "Level": "Informational",
    "RecordingId": "eyJQbGF0Zm9ybUVuZHBxxxxxxxxxxxxjkwMC05MmEwLTRlZDYtOTcxYS1kYzZlZTkzNjU0NzciLCJSxxxxxNwZWNpZmljSWQiOiI5ZmY2ZTY2Ny04YmQyLTQ0NzAtYmRkYy00ZTVhMmUwYmNmOTYifQ",
    "RecordingEndReason": "CallEnded",
    "RecordingStartTime": "2022-08-17T23:55:43.3304762Z",
    "RecordingLength": 3.34,
    "ChunkCount": 1,
    "ContentType": "Audio - Video",
    "ChannelType": "mixed",
    "FormatType": "mp4",
    "AudioChannelsCount": 1
}
{
    "TimeGenerated": "2022-08-17T23:55:56.7664976Z",
    "OperationName": "RecordingSummary",
    "Category": "CallRecordingSummary",
    "CorrelationId": "xxxxxxx-cf78-4156-zzzz-0000000fa29cc",
    "ResultType": "Succeeded",
    "Level": "Informational",
    "RecordingId": "eyJQbGF0Zm9ybUVuxxxxxxiOiI4NDFmNjkwMC1mMjBiLTQzNmQtYTg0Mi1hODY2YzE4M2Y0YTEiLCJSZXNvdXJjZVNwZWNpZmljSWQiOiI2YzRlZDI4NC0wOGQ1LTQxNjEtOTExMy1jYWIxNTc3YjM1ODYifQ",
    "RecordingEndReason": "CallEnded",
    "RecordingStartTime": "2022-08-17T23:55:54.0664976Z",
    "RecordingLength": 2.7,
    "ChunkCount": 1,
    "ContentType": "Audio - Video",
    "ChannelType": "mixed",
    "FormatType": "mp4",
    "AudioChannelsCount": 1
}
```

## Next steps

For more information about Call Recording, see [Call Recording overview](../../../communication-services/concepts/voice-video-calling/call-recording.md). 

