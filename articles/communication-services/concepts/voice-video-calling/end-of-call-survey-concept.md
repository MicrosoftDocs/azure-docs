---
title: Azure Communication Services End of Call Survey overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the End of Call Survey.
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 4/03/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---



# End of Call Survey overview


> [!NOTE] 
> End of Call Survey is currently supported only for our JavaScript / Web SDK.

The End of Call Survey provides you with a tool to understand how your end users perceive the overall quality and reliability of your JavaScript / Web SDK calling solution.


## Purpose of the End of Call Survey
It’s difficult to determine a customer’s perceived calling experience and determine how well your calling solution is performing without gathering subjective feedback from customers. You can use the End of Call Survey to collect and analyze customers **subjective** opinions on their calling experience as opposed to relying only on **objective** measurements such as audio and video bitrate, jitter, and latency, which may not indicate if a customer had a poor calling experience.

After publishing survey data, you can view the survey results through Azure for analysis and improvements. Azure Communication Services uses these survey results to monitor and improve quality and reliability.


## Survey structure

The survey is designed to answer two questions from a user’s point of view. 

-	**Question 1:** How did the users perceive their overall call quality experience?

-	**Question 2:** Did the user perceive any Audio, Video, or Screen Share issues in the call?

The API allows applications to gather data points that describe user perceived ratings of their Overall Call, Audio, Video, and Screen Share experiences. Microsoft analyzes survey API results according to the following goals.



### End of Call Survey API goals


| API Rating Categories | Question Goal |
| ----------- | ----------- |
|  Overall Call  |   Responses indicate how a call participant perceived their overall call quality.    |
| Audio   |    Responses indicate if the user perceived any Audio issues.   |
|   Video |   Responses indicate if the user perceived any Video issues.   |
| Screenshare   |    Responses indicate if the user perceived any Screen Share issues.   |



## Survey capabilities



### Default survey API configuration

| API Rating Categories | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
| Overall Call | 2 | 1 - 5 | Surveys a calling participant’s overall quality experience on a scale of 1-5. A response of 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience.  |
| Audio |   2 | 1 - 5  | A response of 1 indicates an imperfect audio experience and 5 indicates no audio issues were experienced.  |
| Video |   2 | 1 - 5 |  A response of 1 indicates an imperfect video experience and 5 indicates no video issues were experienced. |
| Screenshare | 2 | 1 - 5   |  A response of 1 indicates an imperfect screen share experience and 5 indicates no screen share issues were experienced. |



> [!NOTE] 
>A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

### More survey tags
| Rating Categories | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |    `CallCannotJoin` `CallCannotInvite` `HadToRejoin` `CallEndedUnexpectedly`  `OtherIssues`    |
| Audio   |  `NoLocalAudio` `NoRemoteAudio` `Echo` `AudioNoise`  `LowVolume`  `AudioStoppedUnexpectedly` `DistortedSpeech` `AudioInterruption`  `OtherIssues`   |
|   Video |    `NoVideoReceived` `NoVideoSent` `LowQuality` `Freezes` `StoppedUnexpectedly` `DarkVideoReceived` `AudioVideoOutOfSync` `OtherIssues`   |
| Screenshare   |  `NoContentLocal` `NoContentRemote` `CannotPresent` `LowQuality` `Freezes` `StoppedUnexpectedly` `LargeDelay` `OtherIssues`     |



### End of Call Survey customization


You can choose to collect each of the four API values or only the ones you find most important. For example, you can choose to only ask customers about their overall call experience instead of asking them about their audio, video, and screen share experience. You can also
customize input ranges to suit your needs. The default input range is 1
to 5 for Overall Call, Audio, Video, and Screenshare. However, each API value can be customized from a minimum of 0 to maximum of 100. 

### Customization options


| API Rating Categories | Cutoff Value* | Input Range |
| ----------- | ----------- | -------- |  
| Overall Call   |   0 - 100    |  0 - 100     |     
|  Audio  |   0 - 100    |   0 - 100    |     
|  Video  |    0 - 100   |   0 - 100    |     
|  Screenshare  |   0 - 100    |   0 - 100    |     

   > [!NOTE]
   > A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

## Store and view survey data:

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored and will be lost. To enable these logs for your Communications Services see our guidance:  [End of Call Survey Logs](../analytics/logs/end-of-call-survey-logs.md).

You cannot access your survey and it will not be stored unless you have enabled a Diagnostic Setting to capture your survey data.

## Next Steps

- Learn how to use the End of Call Survey, see our tutorial: [Use the End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md)

- Analyze your survey data, see: [End of Call Survey Logs](../analytics/logs/end-of-call-survey-logs.md)

-	Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../azure-monitor/logs/log-analytics-tutorial.md)

-	Create your own queries in Log Analytics, see: [Get Started Queries](../../../azure-monitor/logs/get-started-queries.md)


