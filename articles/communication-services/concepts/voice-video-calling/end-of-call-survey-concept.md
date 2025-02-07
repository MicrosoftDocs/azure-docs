---
title: Azure Communication Services End of Call Survey overview
titleSuffix: An Azure Communication Services concept article
description: Learn about the End of Call Survey.
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 12/12/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# End of Call Survey overview

The End of Call Survey is a tool that helps you understand how your users perceive the overall quality and reliability of your Calling SDK solution.

## Purpose of the End of Call Survey

It's difficult to determine a customer's perceived calling experience and understand how well your calling solution is performing unless you gather feedback. You can use the End of Call Survey to collect and analyze customers' *subjective* opinions on their calling experience. Relying only on *objective* measurements, such as audio and video bitrate, jitter, and latency, might not indicate if a customer had a poor calling experience.

After you publish survey data, you can view the survey results through Azure for analysis and improvements. Azure Communication Services uses these survey results to monitor and improve quality and reliability.

## Survey structure

The survey is designed to answer two questions:

- How did the user perceive the overall experience of call quality?
- Did the user perceive any problems with audio, video, or screen sharing in the call?

The API enables applications to gather data points that describe user-perceived ratings of their overall call, audio, video, and screen-sharing experiences. Microsoft analyzes survey API results according to the following goals.

| API rating category | Question goal |
| ----------- | ----------- |
| Overall call | Responses indicate how a call participant perceived overall call quality. |
| Audio | Responses indicate if the user perceived any audio problems. |
| Video | Responses indicate if the user perceived any video problems. |
| Screen sharing | Responses indicate if the user perceived any screen-sharing problems. |

## Survey capabilities

### Default survey API configuration

| API rating category | Cutoff value | Input range | Comments |
| ----------- | ----------- | -------- | -------- |
| Overall call | 2 | 1 - 5 | Surveys a calling participant's overall quality experience on a scale of 1 to 5. A response of 1 indicates an imperfect call experience. A response of 5 indicates a perfect call. The cutoff value of 2 means that a response of 1 or 2 indicates a less-than-perfect call experience.  |
| Audio | 2 | 1 - 5  | A response of 1 indicates an imperfect audio experience. A response of 5 indicates that the customer experienced no audio problems.  |
| Video | 2 | 1 - 5 | A response of 1 indicates an imperfect video experience. A response of 5 indicates that the customer experienced no video problems. |
| Screen sharing | 2 | 1 - 5 | A response of 1 indicates an imperfect screen-sharing experience. A response of 5 indicates that the customer experienced no screen-sharing problems. |

> [!NOTE]
> A question's indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or input range, Microsoft analyzes your survey data according to your customizations.

### More survey tags

| Rating category | Optional tags |
| ----------- | ----------- |
|  Overall call  |    `CallCannotJoin` `CallCannotInvite` `HadToRejoin` `CallEndedUnexpectedly`  `OtherIssues`    |
| Audio   |  `NoLocalAudio` `NoRemoteAudio` `Echo` `AudioNoise`  `LowVolume`  `AudioStoppedUnexpectedly` `DistortedSpeech` `AudioInterruption`  `OtherIssues`   |
|   Video |    `NoVideoReceived` `NoVideoSent` `LowQuality` `Freezes` `StoppedUnexpectedly` `DarkVideoReceived` `AudioVideoOutOfSync` `OtherIssues`   |
| Screen sharing   |  `NoContentLocal` `NoContentRemote` `CannotPresent` `LowQuality` `Freezes` `StoppedUnexpectedly` `LargeDelay` `OtherIssues`     |

### End of Call Survey customization options

You can choose to collect all of the four API values or only the ones that you find most important. For example, you can choose to ask customers about only their overall call experience and not ask about their audio, video, and screen-sharing experience.

You can also customize input ranges to suit your needs. The default input range is 1 to 5 for overall call, audio, video, and screen sharing. However, you can customize each API value from a minimum of 0 to maximum of 100.

| API rating category | Cutoff value | Input range |
| ----------- | ----------- | -------- |  
| Overall call | 0 - 100 | 0 - 100 |
| Audio | 0 - 100 | 0 - 100 |
| Video | 0 - 100 | 0 - 100 |
| Screen sharing | 0 - 100 | 0 - 100 |

## Storage of survey data for viewing

To send the log data of your surveys to a Log Analytics workspace, an Azure Event Hubs instance, or an Azure storage account for analysis, you must enable a diagnostic setting in Azure Monitor. If you don't enable a diagnostic setting to send survey data to one of these options, your survey data won't be stored and will be lost.

To enable logs for Communications Services, see [End of Call Survey logs](../analytics/logs/end-of-call-survey-logs.md).

### View survey data as a Teams administrator
When your Azure Communication Services SDKs submits a survey as part of any [Teams interop meeting scenarios](../../how-tos/calling-sdk/teams-interoperability.md), the survey data will be accessible through the Teams meeting organizer's supportability tools, including Call Analytics, PowerBI, and Graph API. Any administrator of the Teams meeting organizer can access the call survey data. The values `CallSurvey.audioRating.score`, `CallSurvey.videoRating.score`, and `CallSurvey.screenshareRating.score` are specific to Azure Communication Services and will not be available in Teams supportability tools.

To send the survey data to Teams supportability tools, the `CallSurvey.overallRating.score` value must be present. Teams supportability tools expect a rating scale from 0 to 4, so the overall rating score will be converted accordingly.

## Related content

- Learn how to use the End of Call Survey: [Use the End of Call Survey to collect user feedback](../../tutorials/end-of-call-survey-tutorial.md).
- Analyze your survey data: [End of Call Survey logs](../analytics/logs/end-of-call-survey-logs.md).
- Learn how to use the Log Analytics workspace: [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).
- Create your own queries in Log Analytics: [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).
