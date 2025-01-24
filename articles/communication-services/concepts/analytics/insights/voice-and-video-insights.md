---
title: Azure Communication Services Voice and Video Insights
titleSuffix: An Azure Communication Services concept document
description: Descriptions of data visualizations available for Voice and Video Communications Services via Workbooks
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 03/08/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Voice and video Insights

This document introduces the Voice and Video section of your Insights dashboard and how to use Copilot in Azure to monitor and improve your call quality. 

## Overview
In each Communications Resource, we've provided an Insights feature that 
acts as a dashboard for all your calls in that resource. The Voice and Video 
section of the dashboard gives high level summaries of your call usage, 
reliability, and quality for that calling resource. Since the dashboard 
is integrated with [Copilot in Azure](../../../copilot/overview.md) you 
can chat with Copilot to quickly understand  better understand what you are looking at and 
what actions you can take to improve users call experiences. 

Insert example prompts and images:
1
2
3

There are two main tools you can use to monitor your calls and improve call quality. 
1. Voice and Video Insights dashboards
1. [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)

We recommend using Copilot in the **Voice and Video Insights** dashboards to start 
any quality investigations, and use Copilot in [Call Diagnostics](../../voice-video-calling/call-diagnostics.md) 
as needed to explore individual calls when you need granular detail. 

**Voice and Video Insights** consists of four main sections. 
- **Volume:** Provides general statistics
- **Reliability:** Aggregates all API functionality and error codes to focus your analysis 
- **User Facing Diagnostics (UFD):** Highlights trends that can impact users call experince
- **Quality:** Analyzes single calls for quality 

:::image type="content" source="..\media\workbooks\insights-overview-2.png" alt-text="Screenshot of Communication Services Insights dashboard.":::

## Enable Voice and Video Insights

You need to start storing call data and confirm you've enabled [Copilot in Azure](../../../copilot/overview.md) to start using the Voice and Video Insights dashboards. 

### Collect Call Logs

The Insights Dashboards are powered by [Azure Monitor Workbooks](../../../../../azure/azure-monitor/visualize/workbooks-overview.md) which rely on data stored in your Azure account. Azure Communication Services generates call data in the form of metrics and events as you make calls. You must store these data in a Log Analytics workspace that is in the same resource group as your calling resource in order for any of the Insights Dashboard visuals to work. To store these data, you must enable a diagnostic setting in Azure Monitor that directs these call data to be stored in a Log Analytics workspace as they're created. These call data aren't retroactively available from Azure Communication Services, but once you set up your diagnostic setting you control the data retention periods for your Log Analytics resource.


> [!IMPORTANT]
>To enable Call Diagnostics in your calling resource see: [How do I setup Voice and Video Insights?](#how-do-i-setup-voice-and-video-insights)
>
>
> You need to start collecting the log data for Call Diagnostics to visualize. Call Diagnostics can only query data sent to a Log Analytics workspace that is located in the same resource group as your calling resource. Keep in mind, call data isn't stored anywhere until you set up a Diagnostic Setting to store it in a Log Analytics workspace. You need to enable a Diagonstic Setting for each Azure Communications Services resource ID you want to monitor.


### Enable Copilot in Azure
Your organization manages access to [Copilot in Azure](../../../copilot/overview.md). After your organization has access to Copilot in Azure, the Voice and Video Insights sections will display multiple Copilot icons you can interact with.

Interact with Copilot in Azure for quality improvement guidance and explanations of common terms. Giving Copilot in Azure detailed information will help it identify fixes.

## Accessing Voice and Video Insights

Inside your Azure Communication Services resource, scroll down on the left navigation bar to the **Monitor** category and click on the **Insights** tab:

:::image type="content" source="..\media\workbooks\acs-insights-nav.png" alt-text="Screenshot of the Insights navigation blade.":::


## Voice and Video Insights

Since **Voice and video** logs are the most complex in nature, this modality is broken down into four subsections:

:::image type="content" source="..\media\workbooks\voice-and-video-nav.png" alt-text="Screenshot of voice and video navigation.":::

The **Summary** tab contains general information about Voice and video usage, including the types of media streams shared, the types of endpoints participating in a call (e.g. VoIP, Bot, Application, PSTN, or Server), the OS usage, and participant end reasons:

:::image type="content" source="..\media\workbooks\voice-and-video-summary.png" alt-text="Screenshot of voice and video summary.":::

The **Volume** tab under the **Voice and video** modality displays the number of calls and the number of participants in a specific period of time (**Time range** parameter), subdivided into time bins (**Time granularity** parameter):

:::image type="content" source="..\media\workbooks\voice-and-video-volume.png" alt-text="Screenshot of voice and video volume.":::

The **Volume** tab contains a **Grouping** parameter, which helps visualize the number of calls and participants segmented by either Call type (P2P vs. Group calls) and Interop Calls (pure Azure Communication Services vs. Teams Interop):

:::image type="content" source="..\media\workbooks\voice-and-video-volume-grouping.png" alt-text="Screenshot of voice and video volume grouping.":::

The **Quality** tab under **Voice and video** allows users to inspect the quality distribution of calls, where quality is defined at three levels for this dashboard:

- The proportion of poor-quality media streams (**Stream quality** plot), where a stream’s quality is classified as Poor when it has at least one unhealthy telemetry value, where unhealthy ranges are defined as:
  - Jitter > 30 milliseconds
  - Packet loss rate > 10%
  - Round trip time > 500 milliseconds

- The proportion of **Impacted calls**, where an impacted call is defined as a call that has at least one poor quality stream

- **Participant end reasons**, which keep track of the reason why a participant left a call. End reasons are [SIP codes](https://en.wikipedia.org/wiki/List_of_SIP_response_codes), which are numeric codes that describe the specific status of a signaling request. SIP codes can be grouped into six categories: *Success*, *Client Failure*, *Server Failure*, *Global Failure*, *Redirection*, and *Provisional*. The distribution of SIP code categories is shown in the pie chart on the left hand side, while a list of the specific SIP codes for participant end reasons is provided on the right hand side

:::image type="content" source="..\media\workbooks\voice-and-video-quality.png" alt-text="Screenshot of voice and video quality.":::

Quality can also be filtered by the types of media streams (**Media Type** parameter) used in the call, e.g. to only get the impacted calls in terms of video stream quality:

:::image type="content" source="..\media\workbooks\voice-and-video-quality-params.png" alt-text="Screenshot voice and video quality media type parameter.":::

And can also be filtered by endpoint types (**Endpoint Type** parameter), e.g. getting the participant end reasons for PSTN participants. These filters allow for multiple selections:

:::image type="content" source="..\media\workbooks\voice-and-video-params-2.png" alt-text="Screenshot voice and video quality endpoint type parameter.":::

## More information about workbooks

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) documentation.

## Editing dashboards

The **Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="..\media\workbooks\dashboard-editing.png" alt-text="Screenshot of dashboard editing process.":::

Editing these dashboards doesn't modify the **Insights** tab, but rather creates a separate workbook that can be accessed on your resource’s Workbooks tab:

:::image type="content" source="..\media\workbooks\workbooks-tab.png" alt-text="Screenshot of the workbooks tab.":::

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) documentation.


## Frequently asked questions

### How do I setup Voice and Video Insights?

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially collect all logs. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](../../../../../azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID. When you view Voice and Video Insights it shows you details for the resourceID you are viewing. 

## Next steps

- Learn about Call Diagnostics: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
- Learn how to manage call quality: [Improve and manage call quality](../../manage-call-quality.md).
- Explore troubleshooting guidance: [Overview of audio issues](../../../../../resources/troubleshooting/voice-video-calling/audio-issues/overview.md).
- Learn about other quality best practices: [Best practices: Azure Communication Services calling SDKs](../best-practices.md).
- Learn how to use the Log Analytics workspace: [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).
- Create your own queries in Log Analytics: [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).
- Explore known call issues: [Known issues in the SDKs and APIs](../known-issues.md).
- 
- 
- 
- 
- NOTES
- 
- The **Insights Dashboard** is powered by 
[Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) 
so you can modify and save edits to the template we provided to better suite your needs. To learn more see, [build workbook reports on top of your data](/azure/azure-monitor/logs/data-platform-logs#built-in-insights-and-custom-dashboards-workbooks-and-reports). 


Azure Communication Services (ACS) integrates [Copilot in Azure](../../../copilot/overview.md) 
with your call quality analytics and visualizations in the **Voice and Video Insights** dashboard. 
You will find the **Insights** dashboard in the monitoring section of your of your ACS resource when you 
are in your Azure Portal. You can interact with Copilot to quickly understand the high level 
summary of the calling health of your ACS calling resource and learn how to improve the call 
quality for your call participants. 


In order to take advantage of Workbooks, follow the instructions outlined 
in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). 
To enable Workbooks, you need to send your logs to a 
[Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview) destination. 
