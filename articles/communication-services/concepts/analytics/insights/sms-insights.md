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


The **SMS** tab displays the operations and results for SMS usage through an Azure Communication Services resource (we currently don’t have any data for this modality):

:::image type="content" source="media\workbooks\sms.png" alt-text="SMS tab":::

## More information about workbooks

For an in-depth description of workbooks, please refer to the [Azure Monitor Workbooks](../../../azure-monitor/visualize/workbooks-overview.md) documentation.
