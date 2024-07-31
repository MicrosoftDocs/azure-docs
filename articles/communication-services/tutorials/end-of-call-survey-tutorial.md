---
title: Azure Communication Services End of Call Survey
titleSuffix: An Azure Communication Services tutorial document
description: Learn how to use the End of Call Survey to collect user feedback.
author: amagginetti
ms.author: amagginetti
manager: mvivion
services: azure-communication-services
ms.date: 4/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Use the End of Call Survey to collect user feedback

This tutorial shows you how to use the Azure Communication Services End of Call Survey.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](../quickstarts/create-communication-resource.md). Survey results are tied to single Communication Services resources.
- An active Log Analytics Workspace, also known as Azure Monitor Logs. See [End of Call Survey Logs](../concepts/analytics/logs/end-of-call-survey-logs.md).
- To conduct a survey with custom questions using free form text, you need an [App Insight resource](../../azure-monitor/app/create-workspace-resource.md#create-a-workspace-based-resource).

::: zone pivot="platform-web"
[!INCLUDE [End of Call Survey for Web](./includes/end-of-call-survey-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [End of Call Survey for Android](./includes/end-of-call-survey-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [End of Call Survey for iOS](./includes/end-of-call-survey-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [End of Call Survey for Windows](./includes/end-of-call-survey-windows.md)]
::: zone-end

## Collect survey data

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored and will be lost. To enable these logs for your Communications Services, see: [End of Call Survey Logs](../concepts/analytics/logs/end-of-call-survey-logs.md)

### View survey data with a Log Analytics workspace

You need to enable a Log Analytics Workspace to both store the log data of your surveys and access survey results. To enable these logs for your Communications Service, see: [End of Call Survey Logs](../concepts/analytics/logs/end-of-call-survey-logs.md).

- You can also integrate your Log Analytics workspace with Power BI, see: [Integrate Log Analytics with Power BI](../../../articles/azure-monitor/logs/log-powerbi.md).

## Best practices
Here are our recommended survey flows and suggested question prompts for consideration. Your development can use our recommendation or use customized question prompts and flows for your visual interface.

**Question 1:** How did the users perceive their overall call quality experience?
We recommend you start the survey by only asking about the participants’ overall quality. If you separate the first and second questions, it helps to only collect responses to Audio, Video, and Screen Share issues if a survey participant indicates they experienced call quality issues.


- Suggested prompt: “How was the call quality?”
- API Question Values: Overall Call

**Question 2:** Did the user perceive any Audio, Video, or Screen Sharing issues in the call?
If a survey participant responded to Question 1 with a score at or below the cutoff value for the overall call, then present the second question.

- Suggested prompt: “What could have been better?”
- API Question Values: Audio, Video, and Screenshare

### Surveying Guidelines
- Avoid survey burnout, don’t survey all call participants.
- The order of your questions matters. We recommend you randomize the sequence of optional tags in Question 2 in case respondents focus most of their feedback on the first prompt they visually see.
- Consider using surveys for separate Azure Communication Services Resources in controlled experiments to identify release impacts.


## Next steps

- Analyze your survey data, see: [End of Call Survey Logs](../concepts/analytics/logs/end-of-call-survey-logs.md)

- Learn more about the End of Call Survey, see: [End of Call Survey overview](../concepts/voice-video-calling/end-of-call-survey-concept.md)

- Learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

- Create your own queries in Log Analytics, see: [Get Started Queries](../../../articles/azure-monitor/logs/get-started-queries.md)
