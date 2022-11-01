---
title: Azure Communication Services - Recording Analytics Preview
titleSuffix: An Azure Communication Services concept document
description: About using Log a Analytics for recording logs
author:  Mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 10/27/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---


# Call Recording Summary Log
Call recording summary logs provide details about the call duration, media content (e.g., Audio-Video, Unmixed, Transcription, etc.), the format types used for the recording (e.g., WAV, MP4, etc.), as well as the reason of why the recording ended.

Recording file is generated at the end of a call or meeting. The recording can be initiated and stopped by either a user or an app (bot) or ended  due to a system failure.

[!IMPORTANT]

Please note the call recording logs will be published once the call recording is ready to be downloaded. The log will be published within the standard latency time for Azure Monitor Resource logs see [Log data ingestion time in Azure Monitor](../../../azure-monitor/logs/data-ingestion-time#azure-metrics-resource-logs-activity-log.md)


### Properties Description

| Field Name |	DataType |	Description |
|----------  |-----------|--------------|
|TimeGenerated|DateTime|The timestamp (UTC) of when the log was generated|
|OperationName| String | The operation associated with log record|
|CorrelationId	|String |The ID for correlated events. Can be used to identify correlated events between multiple tables (`CallID`)|
|RecordingID| String | The ID given to the recording this log refers to|
|Category| String | The log category of the event. Logs with the same log category and resource type will have the same properties fields|        
|ResultType|	String| The status of the operation|
|Level	|String	|The severity level of the operation|
|ChunkCount	|Integer|The total number of chunks created for the recording|
|ChannelType|	String |The recording's channel type, i.e., mixed, unmixed|
|RecordingStartTime|	DateTime|The time that the recording started |
|ContentType|	String | The recording's content, i.e., Audio Only, Audio - Video, Transcription, etc.|
|FormatType|	String | The recording's file format|
|RecordingLength|	Double | 	Duration of the recording in seconds|
|AudioChannelsCount|	Integer | Total number of audio channels in the recording|
|RecordingEndReason|	String | The reason why the recording ended |   


### Call recording and sample data
```json
"operationName":            "Call Recording Summary",
"operationVersion":         "1.0",
"category":                 "RecordingSummaryPRIVATEPREVIEW",

```
A call can have one recording or many recordings depending on how many times a recording events are triggered.

For example, if an agent initiates an outbound call in a recorded line and the call drops due to poor network signal, the `callid` will have one `recordingid`. If the agent calls back the customer, the system will generate a new `callid` as well as a new `recordingid`. 


#### Example 1: Call recording for " One call to one recording"
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

If the agent initiated a recording and stopped and restarted the recording  multiple times while the call is still on, the `callid` will have many `recordingid` depending on how many times the recording events were triggered.

#### Example 2: Call recording for " One call to many recordings"
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
Refer to call recording for more info 
[Azure Communication Services Call Recording overview](../../../communication-services/concepts/voice-video-calling/call-recording.md) 

