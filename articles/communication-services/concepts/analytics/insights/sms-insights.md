---
title: Azure Communication Services Insights Preview
titleSuffix: An Azure Communication Services concept document
description: Descriptions of data visualizations available for Communications Services via Workbooks
author:  timmitchell
services: azure-communication-services

ms.author: timmitchell
ms.date: 03/08/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# SMS Insights

## Overview
Within your Communications Resource, we have provided an **Insights** feature that displays a number of  data visualizations conveying insights from the Azure Monitor logs and metrics monitored for your Communications Services. The visualizations within Insights are made possible via [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md).

:::image type="content" source="..\media\workbooks\insights-overview-2.png" alt-text="Communication Services Insights":::

Within it, we provide the `SMS Insights Dashboard` which displays the operations and results for SMS usage through an Azure Communication Services resource. It helps you gain valuable insights into your SMS campaigns, analyze user engagement and optimize your SMS communication strategies. 

The `SMS Insights Dashboard` is made out of three sections:

- **Overview**: This section shows general patterns for SMS usage and performance.

- **Message Delivery rates**: This section provides insights into message delivery metrics such as the number of messages sent, the number of messages delivered, and the number of messages failed.

- **Response patterns**: This section provides insights into response patterns of recipients such as the times they are most likely to respond to SMS messages and to optimize future SMS campaigns 

These sections can be filtered by time range, and number type.

## Pre-requisites

- In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). You will need to enable `SMS Operational Logs`
- To use Workbooks, you will need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

## Accessing Azure Insights for Communication Services

1. From the **Azure Portal** homepage, select your **Communication Service** resource:

    :::image type="content" source="..\media\workbooks\azure-portal-home-browser.png" alt-text="Azure Portal Home":::

2. Once you are inside your resource, scroll down on the left nav bar to the **Monitor** category and click on the **Insights** tab:

    :::image type="content" source="..\media\workbooks\acs-insights-nav.png" alt-text="Insights navigation":::

3. This should display the **Insights** dashboard for your Communication Service resource:

    :::image type="content" source="..\media\workbooks\acs-insights-tab.png" alt-text="Communication Services Insights tab":::

## SMS Insights

The **SMS** tab displays the operations and results for SMS usage through an Azure Communication Services resource (we currently don’t have any data for this modality):

:::image type="content" source="..\media\workbooks\sms.png" alt-text="SMS tab":::

## More information about workbooks

For an in-depth description of workbooks, please refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.

## Editing dashboards

The **Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="..\media\workbooks\dashboard-editing.png" alt-text="Dashboard editing":::

Editing these dashboards does not modify the **Insights** tab, but rather creates a separate workbook which can be accessed on your resource’s Workbooks tab:

:::image type="content" source="..\media\workbooks\workbooks-tab.png" alt-text="Workbooks tab":::

For an in-depth description of workbooks, please refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.