---
title: Azure Communication Services Rooms Insights Dashboard
titleSuffix: An Azure Communication Services concept document
description: Descriptions of data visualizations available for Rooms Communications Services via Workbooks
author:  shwali
services: azure-communication-services

ms.author: shwali
ms.date: 05/25/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Rooms Insights

In this document, we outline the available insights dashboard to monitor Rooms logs and metrics.

## Overview
Within your Communications Resource, we've provided a Rooms insights feature that displays many data visualizations conveying insights from the Azure Monitor logs and metrics monitored for Rooms. The visualizations within Insights are made possible via [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md). In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). To enable Workbooks, you need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

:::image type="content" source="..\media\workbooks\rooms-insights\rooms-insights-overview.png" alt-text="Screenshot of Rooms Communication Services Insights dashboard.":::

## Prerequisites

- In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). You need to enable `Operational Rooms Logs`
- To use Workbooks, you need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

## Accessing Rooms Insights for Communication Services

Inside your Azure Communication Services resource, scroll down on the left nav bar to the **Monitor** category and click on the **Workbooks** tab:

:::image type="content" source="..\media\workbooks\rooms-insights\rooms-insights-overview.png" alt-text="Screenshot of Rooms Communication Services Insights dashboard.":::

## Rooms Insights

The **Rooms Insights** tab displays Rooms API success Rate, Rooms API Volume by Operation Type/ Response Code, and Rooms Operation Drill-Down:

:::image type="content" source="..\media\workbooks\rooms-insights\rooms-insights-detail1.png" alt-text="Screenshot displays Rooms API success Rate, Rooms API Volume by Operation Type/ Response Code.":::

:::image type="content" source="..\media\workbooks\rooms-insights\rooms-insights-detail2.png" alt-text="Screenshot displays Rooms Operation Drill-Down.":::


## More information about workbooks

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.

## Editing dashboards

The **Rooms Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="..\media\workbooks\rooms-insights\rooms-insights-edit.png" alt-text="Screenshot of Rooms insights editing process.":::

Editing these dashboards doesn't modify the **Insights** tab, but rather creates a separate workbook that can be accessed on your resource’s Workbooks tab:

:::image type="content" source="..\media\workbooks\workbooks-tab.png" alt-text="Screenshot of the workbooks tab.":::

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.
