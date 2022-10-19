---
title: Azure Communication Services Insights Preview
titleSuffix: An Azure Communication Services concept document
description: Descriptions of data visualizations available for Communications Services via Workbooks
author:  timmitchell
services: azure-communication-services

ms.author: timmitchell
ms.date: 10/25/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Communications Services Insights Preview

## Overview
Within your Communications Resource, we have provided an **Insights Preview** feature that displays a number of  data visualizations conveying insights from the Azure Monitor logs and metrics monitored for your Communications Services. The visualizations within Insights are made possible via [Azure Monitor Workbooks](../../../azure-monitor/visualize/workbooks-overview.md). In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](enable-logging.md), and to enable Workbooks, you will need to send your logs to a [Log Analytics workspace](../../../azure-monitor/logs/log-analytics-overview.md) destination. 

:::image type="content" source="media\workbooks\insights-overview-2.png" alt-text="Communication Services Insights":::

## Accessing Azure Insights for Communication Services

1. From the **Azure Portal** homepage, select your **Communication Service** resource:

    :::image type="content" source="media\workbooks\azure-portal-home-browser.png" alt-text="Azure Portal Home":::

2. Once you are inside your resource, scroll down on the left nav bar to the **Monitor** category and click on the **Insights** tab:

    :::image type="content" source="media\workbooks\acs-insights-nav.png" alt-text="Insights navigation":::

3. This should display the **Insights** dashboard for your Communication Service resource:

    :::image type="content" source="media\workbooks\acs-insights-tab.png" alt-text="Communication Services Insights tab":::

## Insights dashboard navigation

The Communication Service Insights dashboards give users an intuitive and clear way to navigate their resource’s log data. The **Overview** section provides a view across all modalities, so the user can see the different ways in which their resource has been used in a specific time range:

:::image type="content" source="media\workbooks\overview.png" alt-text="Insights overview":::

Users can control the time range and time granularity to display with the parameters displayed at the top:

:::image type="content" source="media\workbooks\time-range-param.png" alt-text="Time range parameter":::

These parameters are global, meaning that they will update the data displayed across the entire dashboard.

The **Overview** section contains an additional parameter to control the type of visualization that is displayed:

:::image type="content" source="media\workbooks\plot-type-param.png" alt-text="Plot type parameter":::

This parameter is local, meaning it only affects the plots in this section.

The rest of the tabs display log data that is related to a specific modality.

:::image type="content" source="media\workbooks\main-nav.png" alt-text="Main navigation":::

Since **Voice and video** logs are the most complex in nature, this modality is broken down into four subsections:

:::image type="content" source="media\workbooks\voice-and-video-nav.png" alt-text="Voice and video navigation":::

The **Summary** tab contains general information about Voice and video usage, including the types of media streams shared, the types of endpoints participating in a call (e.g. VoIP, Bot, Application, PSTN, or Server), the OS usage, and participant end reasons:

:::image type="content" source="media\workbooks\voice-and-video-summary.png" alt-text="Voice and video summary":::

The **Volume** tab under the **Voice and video** modality displays the number of calls and the number of participants in a specific period of time (**Time range** parameter), subdivided into time bins (**Time granularity** parameter):

:::image type="content" source="media\workbooks\voice-and-video-volume.png" alt-text="Voice and video volume":::

The **Volume** tab contains a **Grouping** parameter, which helps visualize the number of calls and participants segmented by either Call type (P2P vs. Group calls) and Interop Calls (pure Azure Communication Services vs. Teams Interop):

:::image type="content" source="media\workbooks\voice-and-video-volume-grouping.png" alt-text="Voice and video volume grouping":::

The **Quality** tab under **Voice and video** allows users to inspect the quality distribution of calls, where quality is defined at three levels for this dashboard:

- The proportion of poor-quality media streams (**Stream quality** plot), where a stream’s quality is classified as Poor when it has at least one unhealthy telemetry value, where unhealthy ranges are defined as:
  - Jitter > 30 milliseconds
  - Packet loss rate > 10%
  - Round trip time > 500 milliseconds

- The proportion of **Impacted calls**, where an impacted call is defined as a call that has at least one poor quality stream

- **Participant end reasons**, which keep track of the reason why a participant left a call. End reasons are [SIP codes](https://en.wikipedia.org/wiki/List_of_SIP_response_codes), which are numeric codes that describe the specific status of a signaling request. SIP codes can be grouped into six categories: *Success*, *Client Failure*, *Server Failure*, *Global Failure*, *Redirection*, and *Provisional*. The distribution of SIP code categories are shown in the pie chart on the left hand side, while a list of the specific SIP codes for participant end reasons is provided on the right hand side

:::image type="content" source="media\workbooks\voice-and-video-quality.png" alt-text="Voice and video quality":::

Quality can also be filtered by the types of media streams (**Media Type** parameter) used in the call, e.g. to only get the impacted calls in terms of video stream quality:

:::image type="content" source="media\workbooks\voice-and-video-quality-params.png" alt-text="Voice and video quality media type parameter":::

And can also be filtered by endpoint types (**Endpoint Type** parameter), e.g. getting the participant end reasons for PSTN participants. These filters allow for multiple selections:

:::image type="content" source="media\workbooks\voice-and-video-params-2.png" alt-text="Voice and video quality endpoint type parameter":::

The **Details** tab offers a quick way to navigate through the **Voice and video** calls made in a time range by grouping calls by dates, and showing the details of every call made in terms of the participants in that call and the outgoing streams per participant, together with duration and telemetry values for these:

:::image type="content" source="media\workbooks\voice-and-video-details.png" alt-text="Voice and video details":::

The details of a call are initially hidden. A list of the participants is displayed after clicking on a call:

:::image type="content" source="media\workbooks\voice-and-video-details-participants.png" alt-text="Voice and video participant details":::

And clicking on a participant displays a list of the outgoing streams for that participant, together with their duration (proportional to the full call duration) and telemetry values, where unhealthy values are displayed in red:

:::image type="content" source="media\workbooks\voice-and-video-details-streams.png" alt-text="Voice and video stream details":::

The **Authentication** tab shows authentication logs, which are created through operations such as issuing an access token or creating an identity. The data displayed includes the types of operations performed and the results of those operations:

:::image type="content" source="media\workbooks\auth.png" alt-text="Authentication tab":::

The **Chat** tab displays the data for all chat-related operations and their result types:

:::image type="content" source="media\workbooks\chat.png" alt-text="Chat tab":::

The **SMS** tab displays the operations and results for SMS usage through an Azure Communication Services resource (we currently don’t have any data for this modality):

:::image type="content" source="media\workbooks\sms.png" alt-text="SMS tab":::

The **Email** tab displays delivery status, email size, and email count:
:::image type="content" source="media\workbooks\azure-communication-services-insights-email.png" alt-text="Email tab":::
[Screenshot displays email count, size and email delivery status level that illustrate email insights]

## Editing dashboards

The **Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="media\workbooks\dashboard-editing.png" alt-text="Dashboard editing":::

Editing these dashboards does not modify the **Insights** tab, but rather creates a separate workbook which can be accessed on your resource’s Workbooks tab:

:::image type="content" source="media\workbooks\workbooks-tab.png" alt-text="Workbooks tab":::

For an in-depth description of workbooks, please refer to the [Azure Monitor Workbooks](../../../azure-monitor/visualize/workbooks-overview.md) documentation.
