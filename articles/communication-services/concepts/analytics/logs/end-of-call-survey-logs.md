---
title: End of call survey logs 
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for End of Call Survey.
author: Mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 04/25/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# End of call survey 

> 
> End of Call Survey is currently supported only for our JavaScript / Web SDK.

## Prerequisites

Azure Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](../../../../azure-monitor/logs/data-platform-logs.md) and [Azure Monitor Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). Each Azure resource requires its own diagnostic setting, which defines the following criteria:
  * Categories of logs and metric data sent to the destinations defined in the setting. The available categories will vary for different resource types.
  * One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
  * A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.


> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored and will be lost
The following are instructions for configuring your Azure Monitor resource to start creating logs and metrics for your Communications Services. For detailed documentation about using Diagnostic Settings across all Azure resources, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

> [!NOTE]
> Under diagnostic setting name please select “Call Survey” to enable the logs for end of call survey.

 :::image type="content" source="..\logs\diagnostic-settings-call-survey-log.png" alt-text="Screenshot of diagnostic settings for call survey.":::
### Overview 


The implementation of end-of-call survey logs represents an augmented functionality within Azure Communication Services (Azure Communication Services), enabling Contoso to submit surveys to gather customers' subjective feedback on their calling experience. This approach aims to supplement the assessment of call quality beyond objective metrics such as audio and video bitrate, jitter, and latency, which may not fully capture whether a customer had a satisfactory or unsatisfactory experience. By leveraging Azure logs to publish and examine survey data, Contoso gains insights for analysis and identification of areas that require improvement. These survey results serve as a valuable resource for Azure Communication Services to continuously monitor and enhance quality and reliability. For more details about [End of call survey](../../../concepts/voice-video-calling/end-of-call-survey-concept.md)


The End of Call Survey is a valuable tool that allows you to gather insights into how end-users perceive the quality and reliability of your JavaScript/Web SDK calling solution. The accompanying logs contain crucial data that helps assess end-users' experience, including:

Overall Call: Responses indicate how a call participant perceived their overall call quality.
  * Audio: Responses indicate if the user perceived any audio issues.
  * Video: Responses indicate if the user perceived any video issues.
  * Screen Share: Responses indicate if the user perceived any screen share issues.
In addition to the above, the optional tags in the responses offer further insights into specific types of issues related to audio, video, or screen share.

By analyzing the data captured in the End of Call Survey logs, you can pinpoint areas that require improvement, thereby enhancing the overall user experience. 

## Resource log categories

Communication Services offers the following types of logs that you can enable:
* **End of Call Survey logs** - provides basic information related to the survey at the end of the call

## **Properties** ##

| Property | Description |
| -------- | ---------------|
|`Timegenerated` |	This field represents the timestamp (UTC) of when the log was generated|
|`CorrelationId` |	The ID for correlated events can be used to identify correlated events between multiple tables|
|`Category` |	The log category of the event. Logs with the same log category and resource type will have the same properties fields|
|`ResourceId`|	The full-length identifier of the user’s resource|
|`OperationName` |	The operation associated with log record|
|`OperationVersion`|	The API-version is associated with the operation or version of the operation if the operationName was performed using an API|
|`CallId`| The identifier of the call used to correlate. Can be used to identify correlated events between multiple tables |
|`ParticipantId`|  	The ID of the participant|
|`SurveyId` | The identifier of a survey submitted by a participant. Can be used to identify correlated events between multiple tables |
|`OverallCallIssues`| This field indicates any issue related to the overall call, and its values are a comma-separated list of descriptions|
|`AudioIssues` |This field indicates any issue related to the audio experience, and its values are a comma-separated list of descriptions|
|`VideoIssues`| This field indicates any issue related to the video experience, and its values are a comma-separated list of descriptions|
|`ScreenshareIssues`|This field indicates any issue related to the screenshare experience, and its values are a comma-separated list of descriptions|
|`OverallRatingScore`|This field represents the overall call experience rated by the participant|
|`OverallRatingScoreLowerBound`|This field represents the minimum value of the OverallRatingScore scale|
|`OverallRatingScoreUpperBound`|This field represents the maximum value of the OverallRatingScore scale|
|`OverallRatingScoreThreshold`|This field indicates the value above which the OverallRatingScore indicates better quality|
|`AudioRatingScore`|This field represents the audio experience rated by the participant|
|`AudioRatingScoreLowerBound`|This field represents the minimum value of the AudioRatingScore scale|
|`AudioRatingScoreUpperBound`|This field represents the maximum value of the AudioRatingScore scale|
|`AudioRatingScoreThreshold`|This field indicates the value above which the AudioRatingScore indicates better quality|
|`VideoRatingScore`|This field represents the video experience rated by the participant|
|`VideoRatingScoreLowerBound`|This field represents the minimum value of the VideoRatingScore scale|
|`VideoRatingScoreUpperBound`|This field represents the maximum value of the VideoRatingScore scale|
|`VideoRatingScoreThreshold`|This field indicates the value above which the VideoRatingScore indicates better quality|
|`ScreenshareRatingScore`| This field represents the screenshare experience rated by the participant|
|`ScreenshareLowerBound`| This field represents the minimum value of the ScreenshareRatingScore scale|
|`ScreenshareUpperBound`|This field represents the maximum value of the ScreenshareRatingScore scale |
|`ScreenshareRatingThreshold`|This field indicates the value above which the ScreenshareRatingScore indicates better quality|

## Examples logs
### Example for the overall call 
```json
[
{
"TimeGenerated":"2023-04-12T14:21:35.0700920Z", 
"CorrelationId":"91c3369f-test-40b0-a4ba-0000003419f9",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/ED463725-1C38-43FC-BD8B-CAC509B41E96/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"CallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"fcc1234f-ce69-ZZZZ-b73f-b036051test4",
        "SurveyId":"a6dd61c4-b924-4885-96a4-a991d4c09e8b",
        "ParticipantId":"91c3369f-test-40b0-a4ba-0000003419f9",
        "OverallCallIssues":"CallCannotJoin",
        "OverallRatingScore":7,
        "OverallRatingScoreLowerBound":0,
        "OverallRatingScoreUpperBound":10,
        "OverallRatingScoreThreshold":5        
    }

}
]
```
### Example for the Audio quality 
```json
[
{
"TimeGenerated":"2023-04-12T14:21:35.0700920Z", 
"CorrelationId":"91c3369f-test-40b0-a4ba-0000003419f9",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/ED463725-1C38-43FC-BD8B-CAC509B41E96/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"EndOfCallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"fcc1234f-ce69-ZZZZ-b73f-b036051test4",
        "SurveyId":"a6dd61c4-xxxx-4885-96a4-a991d4c09e8b",
        "ParticipantId":"91c3369f-test-40b0-a4ba-0000003419f9",
        "AudioIssues":"NoRemoteAudio",      
        "AudioRatingScore":6,
        "AudioRatingScoreLowerBound":0,
        "AudioRatingScoreUpperBound":10,
        "AudioRatingScoreThreshold":4        	
    }
]
```
### Example for the video quality
```json
[
{
"TimeGenerated":"2023-04-12T14:21:35.0700920Z", 
"CorrelationId":"91c3369f-test-40b0-a4ba-0000003419f9",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/ED463725-1C38-43FC-BD8B-CAC509B41E96/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"CallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"fcc87f7f-ce69-eeed-7777-b036051faea4",
        "SurveyId":"a6dd61c4-zzzz-4885-tttt-a991d4c09e8b",
        "ParticipantId":"91c3369f-test-40b0-a4ba-0000003419f9",
        "VideoIssues":"NoVideoReceived",
        "VideoRatingScore":9,
        "VideoRatingScoreLowerBound":0,
        "VideoRatingScoreUpperBound":10,
        "VideoRatingScoreThreshold":7
    }
}
]
```
### Example for the screen share
```json
[
{
"TimeGenerated":"2023-04-12T14:21:35.0700920Z", 
"TimeGenerated":"2023-04-12T14:21:35.0700920Z", 
"CorrelationId":"91c3369f-test-40b0-a4ba-0000003419f9",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/ED463725-1C38-43FC-BD8B-CAC509B41E96/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"EndOfCallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"1237f7f-ce69-ffff-b73f-b036051f6666",
        "SurveyId":"a6dd6bbb-b924-zzzz-96a4-a991d4c01000",
        "ParticipantId":"91c3369f-test-40b0-a4ba-0000003419f9",
        "ScreenshareIssues":"StoppedUnexpectedly,CannotPresent",
        "ScreenshareRatingScore":2,
        "ScreenshareRatingScoreLowerBound":0,
        "ScreenshareRatingScoreUpperBound":10,
        "ScreenshareRatingScoreThreshold":3
    }
}
]
```



