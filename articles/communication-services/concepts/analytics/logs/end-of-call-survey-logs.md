---
title: End of call survey logs 
titleSuffix: An Azure Communication Services concept document
description: Learn about logging for end of call survey.
author: Mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 04/25/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# End of call survey 

> [!NOTE]
> End of Call Survey is currently supported only for our JavaScript / Web SDK.

## How to use call logs
We recommend you collect all available call logs in a log analytics resource so you can monitor your call usage and improve your call quality and receive new logs from Azure Communication Services as we release them.  

There are two main tools you can use to monitor your calls and improve call quality. 
- [Voice and video insights dashboard](../insights/voice-and-video-insights.md)
- [Call diagnostics](../../voice-video-calling/call-diagnostics.md)

We recommend using the **[voice and video insights dashboard](../insights/voice-and-video-insights.md)** dashboards to start 
any quality investigations, and using **[call diagnostics](../../voice-video-calling/call-diagnostics.md)** as needed to explore individual calls when you need granular detail.


## Prerequisites

Azure Communications Services provides monitoring and analytics features via [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs) and [Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics). Each Azure resource requires its own diagnostic setting, which defines the following criteria:
  * Categories of logs and metric data sent to the destinations defined in the setting. The available categories vary for different resource types.
  * One or more destinations to send the logs. Current destinations include Log Analytics workspace, Event Hubs, and Azure Storage.
  * A single diagnostic setting can define no more than one of each of the destinations. If you want to send data to more than one of a particular destination type (for example, two different Log Analytics workspaces), then create multiple settings. Each resource can have up to five diagnostic settings.


> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you don't send survey data to one of these options your survey data won't be stored and will be lost.
The following are instructions for configuring your Azure Monitor resource to start creating logs and metrics for your Communications Services. For detailed documentation about using Diagnostic Settings across all Azure resources, see: [Enable logging in Diagnostic Settings](../enable-logging.md)

> [!NOTE]
> Under diagnostic setting name, select “Call Survey” to enable the logs for end of call survey.

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

This table describes each property.


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
"CorrelationId":"aaaa0000-bb11-2222-33cc-444444dddddd",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"CallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"fcc1234f-ce69-ZZZZ-b73f-b036051test4",
        "SurveyId":"a6dd61c4-b924-4885-96a4-a991d4c09e8b",
        "ParticipantId":"aaaa0000-bb11-2222-33cc-444444dddddd",
        "OverallCallIssues":"CallCannotJoin",
        "OverallRatingScore":7,
        "OverallRatingScoreLowerBound":0,
        "OverallRatingScoreUpperBound":10,
        "OverallRatingScoreThreshold":5        
    }

}
]
```
### Example for the audio quality 
```json
[
{
"TimeGenerated":"2023-04-12T14:21:35.0700920Z", 
"CorrelationId":"aaaa0000-bb11-2222-33cc-444444dddddd",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"EndOfCallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"fcc1234f-ce69-ZZZZ-b73f-b036051test4",
        "SurveyId":"a6dd61c4-xxxx-4885-96a4-a991d4c09e8b",
        "ParticipantId":"aaaa0000-bb11-2222-33cc-444444dddddd",
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
"CorrelationId":"aaaa0000-bb11-2222-33cc-444444dddddd",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"CallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"fcc87f7f-ce69-eeed-7777-b036051faea4",
        "SurveyId":"a6dd61c4-zzzz-4885-tttt-a991d4c09e8b",
        "ParticipantId":"aaaa0000-bb11-2222-33cc-444444dddddd",
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
"CorrelationId":"aaaa0000-bb11-2222-33cc-444444dddddd",
"Category":"CallSurvey", 
"ResourceId":"/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/ACS-DATALYTICS-SPGW-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-DATALYTICS-ALLTELEMETRY", 
"OperationName":"EndOfCallSurvey", 
"OperationVersion":"0.0"

"properties": 
    {
        "CallId":"1237f7f-ce69-ffff-b73f-b036051f6666",
        "SurveyId":"a6dd6bbb-b924-zzzz-96a4-a991d4c01000",
        "ParticipantId":"aaaa0000-bb11-2222-33cc-444444dddddd",
        "ScreenshareIssues":"StoppedUnexpectedly,CannotPresent",
        "ScreenshareRatingScore":2,
        "ScreenshareRatingScoreLowerBound":0,
        "ScreenshareRatingScoreUpperBound":10,
        "ScreenshareRatingScoreThreshold":3
    }
}
]
```

## Frequently asked questions

### How do I store logs?
The following section explains this requirement.

Azure Communication Services logs aren't stored in your Azure account by default so you need to begin storing them in order for tools like [voice and video insights dashboard](../insights/voice-and-video-insights.md) and [call diagnostics](../../voice-video-calling/call-diagnostics.md) to work. To collect these call logs, you need to enable a diagnostic setting that directs the call data to a Log Analytics workspace. 

**Data isn’t stored retroactively, so you begin capturing call logs only after configuring the diagnostic setting.**

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID.   

## Next steps

- Review the overview of all voice and video logs, see: [Overview of Azure Communication Services call logs](voice-and-video-logs.md)

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)