---
title: Azure Communication Services - Call Recording summary logs
titleSuffix: An Azure Communication Services conceptual article
description: Learn about logging for Azure Communication Services Recording.
author: Mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 10/27/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Azure Communication Services Call Recording logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. You configure these capabilities through the Azure portal.

The content in this article refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for Communication Services, see [Enable logging in diagnostic settings](../enable-logging.md).

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs**: Provide usage data associated with each billed service offering.
* **Call Recording summary logs**: Provide summary information for call recordings, like:
  * Call duration.
  * Media content (for example, audio/video, unmixed, or transcription).
  * Format types used for the recording (for example, WAV or MP4).
  * The reason why the recording ended.
* **Recording incoming operations logs**: Provide information about incoming requests for Call Recording operations. Every entry corresponds to the result of a call to the Call Recording APIs, such as StartRecording, StopRecording, PauseRecording, and ResumeRecording.

A recording file is generated at the end of a call or meeting. Either a user or an app (bot) can start and stop the recording. The recording can also end because of a system failure.

Summary logs are published after a recording is ready to be downloaded. The logs are published within the standard latency time for Azure Monitor resource logs. See [Log data ingestion time in Azure Monitor](../../../../azure-monitor/logs/data-ingestion-time.md#azure-metrics-resource-logs-activity-log).

### Usage log schema

| Property | Description |
| -------- | ---------------|
| `timestamp` | The timestamp (UTC) of when the log was generated. |
| `operationName` | The operation associated with the log record. |
| `operationVersion` | The `api-version` value associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `category` | The log category of the event. The category is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `correlationID` | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `Properties` | Other data that's applicable to various modes of Communication Services. |
| `recordID` | The unique ID for a usage record. |
| `usageType` | The mode of usage (for example, Chat, PSTN, or NAT). |
| `unitType` | The type of unit that usage is based on for a mode of usage (for example, minutes, megabytes, or messages). |
| `quantity` | The number of units used or consumed for this record. |

### Call Recording summary log schema

| Property name |	Data type |	Description |
|----------  |-----------|--------------|
| `timeGenerated` | DateTime | The time stamp (UTC) of when the log was generated. |
| `operationName` | String | The operation associated with a log record. |
| `correlationId` | String | The ID that's used to correlate events between tables. |
| `recordingID` | String | The ID for the recording that this log refers to. |
| `category` | String | The log category of the event. Logs with the same log category and resource type have the same property fields. |
| `resultType` | String | The status of the operation. |
| `level` |String| The severity level of the operation. |
| `chunkCount` | Integer | The total number of chunks created for the recording. |
| `channelType` | String | The channel type of the recording, such as mixed or unmixed. |
| `recordingStartTime` | DateTime| The time that the recording started.|
| `contentType` | String | The content of the recording, such as audio only, audio/video, or transcription. |
| `formatType` | String | The file format of the recording. |
| `recordingLength` | Double | The duration of the recording in seconds.|
| `audioChannelsCount` | Integer | The total number of audio channels in the recording. |
| `recordingEndReason` | String | The reason why the recording ended. |

### Call Recording and example data

```json
"operationName":            "Call Recording Summary",
"operationVersion":         "1.0",
"category":                 "RecordingSummary",

```

A call can have one recording or many recordings, depending on how many times a recording event is triggered.

For example, if an agent starts an outbound call on a recorded line and the call drops because of a poor network signal, `callID` will have one `recordingID` value. If the agent calls back the customer, the system generates a new `callID` instance and a new `recordingID` value.

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

If the agent starts a recording and then stops and restarts the recording multiple times while the call is still on, `callID` will have many `recordingID` values. The number of values depends on how many times the recording events were triggered.

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

### ACSCallRecordingIncomingOperations logs

Here are the properties:

| Property | Description |
| -------- | ---------------|
| `timeGenerated` | The time stamp (UTC) of when the log was generated. |
| `callConnectionId` | The ID of the call connection or leg, if available. |
| `callerIpAddress` | The caller IP address, if the operation corresponds to an API call that comes from an entity with a publicly available IP address. |
| `correlationId` | The ID for correlated events. You can use it to identify correlated events between multiple tables. |
| `durationMs` | The duration of the operation in milliseconds. |
| `level` | The severity level of the operation. |
| `operationName` | The operation associated with log records. |
| `operationVersion` | The API version associated with the operation or version of the operation (if there is no API version). |
| `resourceId` | A unique identifier for the resource that the record is associated with. |
| `resultSignature` | The substatus of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `resultType` | The status of the operation. |
| `sdkType` | The SDK type used in the request. |
| `sdkVersion` | The SDK version. |
| `serverCallId` | The server call ID. |
| `URI` | The URI of the request. |

Here's an example:

```json
"properties"
{  "TimeGenerated": "2023-05-09T15:58:30.100Z",
    "Level": "Informational",
    "CorrelationId": "a999f996-b4e1-xxxx-ac04-a59test87d97",
    "OperationName": "ResumeCallRecording",
    "OperationVersion": "2023-03-06",
    "URI": "https://acsresouce.communication.azure.com/calling/recordings/   eyJQbGF0Zm9ybUVuZHBviI0MjFmMTIwMC04MjhiLTRmZGItOTZjYi0...:resume?api-version=2023-03-06",
    "ResultType": "Succeeded",
    "ResultSignature": 202,
    "DurationMs": 130,
    "CallerIpAddress": "127.0.0.1",
    "CallConnectionId": "d5596715-ab0b-test-8eee-575c250e4234",
    "ServerCallId": "aHR0cHM6Ly9hcGk0vjCCCCCCQd2pRP2k9OTMmZT02Mzc5OTQ3xMDAzNDUwMzg...",
    "SdkVersion": "1.0.0-alpha.20220829.1",
    "SdkType": "dotnet"
}
```

## Next steps

- Get [Call Recording insights](../insights/call-recording-insights.md).
- Learn more about [Call Recording](../../voice-video-calling/call-recording.md).
