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

Azure Communication Services (ACS) integrates [Copilot in Azure)](../../../copilot/overview.md) with your call quality analytics and visualizations in the **Voice and Video Insights** blade. You will find the **Insights** blade in the monitoring section of your of your ACS resource when you are in your Azure Portal. You can interact with Copilot to quickly understand the high level summary of the calling health of your ACS calling resource and learn how to improve the call quality for your call participants. We recommend using the **Voice and Video Insights** sections described in this article first to understand and improve your overall call quality, and as needed, use Call Diagnostics to troubleshoot individual calls in granular detail. 

## Overview
The **Insights** blade is run with  powered by [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) so you can modify and save edits to the template we provided to better suite your needs. By editing the workbook you can also explore the logic behind each visual. To learn more see, [build workbook reports on top of your data](/azure/azure-monitor/logs/data-platform-logs#built-in-insights-and-custom-dashboards-workbooks-and-reports). 

**Voice and Video Insights** consists of four main sections. 
- **Volume:** Provides general statistics
- **Reliability:** Aggregates all API functionality and error codes to focus your analysis 
- **User Facing Diagnostics (UFD):** Highlights trends that can impact users call experince
- **Quality:** Analyzes single calls for quality 

:::image type="content" source="..\media\workbooks\insights-overview-2.png" alt-text="Screenshot of Communication Services Insights dashboard.":::

## How to enable Voice and Video Insights

### Collect Call Logs
Azure Communication Services generates call logs that you can capture. For Voice and Video Insights to show anything, you must enable a diagnostic setting in Azure Monitor to store these call logs for each calling resource that you want to monitor. Azure Monitor will start sending this data to a Log Analytics workspace for Voice and Video Insights to view.

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../analytics/enable-logging.md). We recommend that you initially collect all logs. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../analytics/enable-logging.md#adding-a-diagnostic-setting). To collect all logs, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID and query call details for participants within their respective resource IDs.

> [!IMPORTANT]
> Voice and Video Insights only works if there's data that's sent to a Log Analytics workspace. Diagnostic settings begin collecting data for a single Azure Communications Services resource ID after you enable the diagnostic setting. Keep in mind data collection is not retroactive. 

### Enable Copilot in Azure
Your organization manages access to [Microsoft Copilot in Azure (preview)](../../../copilot/overview.md). After your organization has access to Copilot in Azure, the Voice and Video Insights sections will display multiple Copilot icons you can interact with.

Interact with Copilot in Azure for quality improvement guidance and explanations of common terms. Giving Copilot in Azure detailed information will help it enhance analysis, identify problems, and identify fixes.

## Accessing Insights

Inside your Azure Communication Services resource, scroll down on the left nav bar to the **Monitor** category and click on the **Insights** tab:

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

The **Details** tab offers a quick way to navigate through the **Voice and video** calls made in a time range by grouping calls by dates, and showing the details of every call made in terms of the participants in that call and the outgoing streams per participant, together with duration and telemetry values for these:

:::image type="content" source="..\media\workbooks\voice-and-video-details.png" alt-text="Screenshot of voice and video details.":::

The details of a call are initially hidden. A list of the participants is displayed after clicking on a call:

:::image type="content" source="..\media\workbooks\voice-and-video-details-participants.png" alt-text="Screenshot of voice and video participant details.":::

And clicking on a participant displays a list of the outgoing streams for that participant, together with their duration (proportional to the full call duration) and telemetry values, where unhealthy values are displayed in red:

:::image type="content" source="..\media\workbooks\voice-and-video-details-streams.png" alt-text="Screenshot of voice and video stream details.":::

## Authentication insights

The **Authentication** tab shows authentication logs, which are created through operations such as issuing an access token or creating an identity. The data displayed includes the types of operations performed and the results of those operations:

:::image type="content" source="..\media\workbooks\auth.png" alt-text="Screenshot of the authentication overview.":::

## More information about workbooks

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) documentation.

## Editing dashboards

The **Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="..\media\workbooks\dashboard-editing.png" alt-text="Screenshot of dashboard editing process.":::

Editing these dashboards doesn't modify the **Insights** tab, but rather creates a separate workbook that can be accessed on your resource’s Workbooks tab:

:::image type="content" source="..\media\workbooks\workbooks-tab.png" alt-text="Screenshot of the workbooks tab.":::

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) documentation.


## Next steps

- Learn about Call Diagnostics: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
- Learn how to manage call quality: [Improve and manage call quality](../../manage-call-quality.md).
- Explore troubleshooting guidance: [Overview of audio issues](../../../../../resources/troubleshooting/voice-video-calling/audio-issues/overview.md).
- Learn about other quality best practices: [Best practices: Azure Communication Services calling SDKs](../best-practices.md).
- Learn how to use the Log Analytics workspace: [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).
- Create your own queries in Log Analytics: [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).
- Explore known call issues: [Known issues in the SDKs and APIs](../known-issues.md).