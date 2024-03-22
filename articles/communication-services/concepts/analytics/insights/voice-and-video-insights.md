---
title: Azure Communication Services Voice and Video Insights Preview
titleSuffix: An Azure Communication Services concept document
description: Descriptions of data visualizations available for Voice and Video Communications Services via Workbooks
author:  mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 03/08/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Voice and video Insights

In this document, we outline the available insights dashboard to monitor Voice and Video logs and metrics.

## Overview
Within your Communications Resource, we've provided an **Insights Preview** feature that displays many  data visualizations conveying insights from the Azure Monitor logs and metrics monitored for your Communications Services. The visualizations within Insights are made possible via [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md). In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). To enable Workbooks, you need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

:::image type="content" source="..\media\workbooks\insights-overview-2.png" alt-text="Screenshot of Communication Services Insights dashboard.":::

## Prerequisites

- In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). You need to enable `Operational Authentication Logs`, `Call Summary Logs`, `Call Diagnostic Logs`.
- To use Workbooks, you need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

## Accessing Azure Insights for Communication Services

Inside your Azure Communication Services resource, scroll down on the left nav bar to the **Monitor** category and click on the **Insights** tab:

:::image type="content" source="..\media\workbooks\acs-insights-nav.png" alt-text="Screenshot of the Insights navigation blade.":::

## Authentication insights

The **Authentication** tab shows authentication logs, which are created through operations such as issuing an access token or creating an identity. The data displayed includes the types of operations performed and the results of those operations:

:::image type="content" source="..\media\workbooks\auth.png" alt-text="Screenshot of the authentication overview.":::

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

## More information about workbooks

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.

## Editing dashboards

The **Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="..\media\workbooks\dashboard-editing.png" alt-text="Screenshot of dashboard editing process.":::

Editing these dashboards doesn't modify the **Insights** tab, but rather creates a separate workbook that can be accessed on your resource’s Workbooks tab:

:::image type="content" source="..\media\workbooks\workbooks-tab.png" alt-text="Screenshot of the workbooks tab.":::

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.
