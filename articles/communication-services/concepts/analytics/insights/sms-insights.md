---
title: SMS Insights Dashboard
titleSuffix: An Azure Communication Services carticle
description: This article describes the data visualizations available for SMS Communications Services via Workbooks
author:  mkhribech
services: azure-communication-services
ms.author: mkhribech
ms.date: 03/16/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# SMS Insights Dashboard

This article describes the available insights dashboard to monitor SMS logs and metrics.

## Overview

The SMS Insights dashboard in your communication resource shows data visualizations based on the logs and metrics for your SMS usage. It's powered by Azure Monitor logs and metrics that are collected and stored.

Use [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) to create the data visualization. To enable Azure Monitor collection to populate the SMS Insights dashboard, see [Enable Azure Monitor in Diagnostic Settings](/azure/communication-services/concepts/analytics/enable-logging). Ensure that logs are sent to a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview).

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-overview-full.png" alt-text="Screenshot of SMS insights overview page.":::

## Prerequisites

- In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). You need to enable `SMS Operational Logs`
- To use Workbooks, you need to send your logs to a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview) destination. 

## Accessing Azure Insights for Communication Services

Inside your Azure Communication Services resource, scroll down on the left nav bar to the **Monitor** category and click on the **Insights** tab:

:::image type="content" source="..\media\workbooks\acs-insights-nav.png" alt-text="Screenshot of the Insights navigation blade.":::

## Dashboard structure

The `SMS Insights Dashboard` is made out of four sections:

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-nav.png" alt-text="Screenshot of SMS insights navigation tabs.":::

### Overview section

The Overview section provides an overall performance of sent messages along with SMS failure breakdown. The user can filter the SMS performance data by time specific time range, number type, sender number, and destination. The data is presented in interactive graphs that the user can click on to further drill down into logs. 

Great to help answer general questions like:
- How many SMS messages did I send through my resource?
- Are my messages being blocked or failing at a glance?
- What is my message distribution by country/region?

#### Top metrics

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-overview.png" alt-text="Screenshot of SMS insights overview graphs.":::


#### SMS by country/region

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-overview-country.png" alt-text="Screenshot of SMS insights overview by country/region.":::

### Message delivery rates section

The Message Delivery Rates section provides insights into SMS performance and delivery rate per day. You can select a specific date in the graph to drill into logs.

Can help answer questions like:
- Are there particular days where I'm seeing fewer deliveries?
- Are there any geographies where delivery suffers most?

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-message-rates.png" alt-text="Screenshot of SMS insights message rates.":::

### Opt-in & opt-out rates

The Opt-in & opt-out rates section provides insights into end user responses for opt-ins/outs and help.

Answer questions like:
- What percentage of my users are opt-in vs opt-out?

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-opt-in-out.png" alt-text="Screenshot of SMS insights opt in and out.":::

### Response patterns

The Response patterns section provides insights into the total SMS usage in a day across messages delivered, received, failed, and blocked.

This section helps you understand how the solution performs over time.

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-response-patterns.png" alt-text="Screenshot of SMS insights response patterns.":::

## Exporting logs

To export SMS logs, click the Download button on the top right corner of the logs table:

:::image type="content" source="..\media\workbooks\sms-insights\sms-insights-export.png" alt-text="Screenshot of SMS insights export.":::

## Editing dashboards

To customize the **SMS insights** dashboards provided with your **Communication Service** resource, click the **Edit** button on the top navigation bar:

:::image type="content" source="..\media\workbooks\dashboard-editing.png" alt-text="Screenshot of dashboard editing process.":::

Editing these dashboards doesn't modify the **Insights** tab, but rather creates a separate workbook, which you can access on your resource Workbooks tab:

:::image type="content" source="..\media\workbooks\workbooks-tab.png" alt-text="Screenshot of the workbooks tab.":::

For an in-depth description of workbooks, see [Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview) documentation.
