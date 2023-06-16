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

# Azure Communication Services Call Recording Logs

Azure Communication Services offers logging capabilities that you can use to monitor and debug your Communication Services solution. These capabilities can be configured through the Azure portal.

> [!IMPORTANT]
> The following refers to logs enabled through [Azure Monitor](../../../../azure-monitor/overview.md) (see also [FAQ](../../../../azure-monitor/faq.yml)). To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

## Resource log categories

Communication Services offers the following types of logs that you can enable:

* **Usage logs** - provides usage data associated with each billed service offering
* **Call Recording Summary Logs** - provides summary information for call recordings like:
  - Call duration.
  - Media content (for example, audio/video, unmixed, or transcription).
  - Format types used for the recording (for example, WAV or MP4).
  - The reason why the recording ended.
* **Recording incoming operations logs** - provides information regarding incoming requests for Call Recording operations. Every entry corresponds to the result of a call to the Call Recording APIs, e.g. StartRecording, StopRecording, PauseRecording, ResumeRecording, etc.



A recording file is generated at the end of a call or meeting. The recording can be initiated and stopped by either a user or an app (bot). It can also end because of a system failure.

Summary logs are published after a recording is ready to be downloaded. The logs are published within the standard latency time for Azure Monitor resource logs. See [Log data ingestion time in Azure Monitor](../../../../azure-monitor/logs/data-ingestion-time.md#azure-metrics-resource-logs-activity-log).

### Usage logs schema

| Property | Description |
| -------- | ---------------|
| `timestamp` | The timestamp (UTC) of when the log was generated. |
| `operationName` | The operation associated with log record. |
| `operationVersion` | The `api-version` associated with the operation, if the operationName was performed using an API. If there's no API that corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `category` | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. |
| `correlationID` | The ID for correlated events. Can be used to identify correlated events between multiple tables. |
| `Properties` | Other data applicable to various modes of Communication Services. |
| `recordID` | The unique ID for a given usage record. |
| `usageType` | The mode of usage. (for example, Chat, PSTN, NAT, etc.) |
| `unitType` | The type of unit that usage is based off for a given mode of usage. (for example, minutes, megabytes, messages, etc.). |
| `quantity` | The number of units used or consumed for this record. |

### Call Recording summary logs schema

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

### Call Recording and example data

```json
"operationName":            "Call Recording Summary",
"operationVersion":         "1.0",
"category":                 "RecordingSummary",

```
A call can have one recording or many recordings, depending on how many times a recording event is triggered.

For example, if an agent initiates an outbound call on a recorded line and the call drops because of a poor network signal, `callID` will have one `recordingID` value. If the agent calls back the customer, the system generates a new `callID` instance and a new `recordingID` value. 


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

If the agent initiates a recording and then stops and restarts the recording multiple times while the call is still on, `callID` will have many `recordingID` values, depending on how many times the recording events were triggered.

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

Properties

| Property | Description |
| -------- | ---------------|
|` timeGenerated`| Represents the timestamp (UTC) of when the log was generated. |
|` callConnectionId`| Represents the ID of the call connection/leg, if available. |
|` callerIpAddress`| Represents the caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
|` correlationId`| Represents the ID for correlated events. Can be used to identify correlated events between multiple tables. |
|` durationMs`|Represents the duration of the operation in milliseconds. |
|` level`| Represents the severity level of the operation. |
|` operationName`| Represents the operation associated with log records. |
|` operationVersion`| Represents the API version associated with the operation or version of the operation (if there is no API version). |
|` resourceId`| Represents a unique identifier for the resource that the record is associated with. |
|` resultSignature`| Represents the sub status of the operation. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
|` resultType`| Represents the status of the operation. |
|` sdkType`| Represents the SDK type used in the request. |
|` sdkVersion`| Represents the SDK version. |
|` serverCallId`| Represents the server Call ID. |
|` URI`| Represents the URI of the request. |

 Sample

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

- Get [Call Recording insights](../insights/call-recording-insights.md)
- Learn more about [Call Recording](../../voice-video-calling/call-recording.md). 

