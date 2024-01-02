---
title: Azure Communication Services Email Insights Dashboard
titleSuffix: An Azure Communication Services concept document
description: Descriptions of data visualizations available for Email Communications Services via Workbooks
author:  mkhribech
services: azure-communication-services

ms.author: mkhribech
ms.date: 07/10/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Email Insights

In this document, we outline the available insights dashboard to monitor Email logs and metrics.

## Overview
Within your Communications Resource, we've provided an **Insights Preview** feature that displays many data visualizations conveying insights from the Azure Monitor logs and metrics monitored for your Communications Services. The visualizations within Insights are made possible via [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md). In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). To enable Workbooks, you need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

:::image type="content" source="..\media\workbooks\insights-overview-2.png" alt-text="Screenshot of Communication Services Insights dashboard.":::

## Prerequisites

- In order to take advantage of Workbooks, follow the instructions outlined in [Enable Azure Monitor in Diagnostic Settings](../enable-logging.md). You need to enable `Email Service Send Mail Logs`, `Email Service Delivery Status Update Logs` , `Email Service User Engagement Logs.`
- To use Workbooks, you need to send your logs to a [Log Analytics workspace](../../../../azure-monitor/logs/log-analytics-overview.md) destination. 

## Accessing Azure Insights for Communication Services

Inside your Azure Communication Services resource, scroll down on the left nav bar to the **Monitor** category and click on the **Insights** tab:

:::image type="content" source="..\media\workbooks\acs-insights-nav.png" alt-text="Screenshot of the Insights navigation blade.":::

## Email Insights

The Email Insights dashboards give users an intuitive and clear way to navigate their Email usage data. The dashboard is broken into two subsections overview and email performance.

Filters: Filters help you focus on the data that is most relevant to your needs by narrowing down your report to specific criteria such as specific date range, recipient info or location.
  
:::image type="content" source="../media/workbooks/email-insights/email-overview.png" alt-text="Screenshot of email dashboard overview.":::

### Overview:
This section provides insights into the effectiveness of email notifications and message performance to enable identification of patterns impacting message delivery. This graph measures the Total messages sent, messages delivered, messages failed, and messages blocked, message viewed, and message clicked, and the size of the message sent & delivered. 

#### Overall email health

Overall email insight measures email delivery that assesses effectiveness and efficiency of the email company. This metric enables you to optimize their marketing campaign efforts and improve customer engagement and conversion rate.

:::image type="content" source="../media/workbooks/email-insights/email-health.png" alt-text="Screenshot of overall email health campaign.":::


#### Email size
Email size represents the storage space your emails are taking up, this information will help optimize your mailbox and prevent it from reaching the max size and impact performance.

:::image type="content" source="../media/workbooks/email-insights/email-size.png" alt-text="Screenshot of email size.":::

### Email performance:
 This section provides insights into the email delivery rate, delivery log indicating information about      delivered emailed, bounced, blocked, suppression, failed etc. Analyzing the delivery log will help identify any issues or patterns and enable you to troubleshoot delivery problems and improved customer engagement.
   

#### Email delivery rates 
Email delivery rates are pivotal to the success of the email marketing campaign, it provides insights into email performance over time. Measuring and monitoring the message delivery performance over extended periods by week or month or specified period.

:::image type="content" source="../media/workbooks/email-insights/email-delivery-rate.png" alt-text="Screenshot of email delivery rate .":::

#### Failure rate 

Email failure rate represents the different types of unsuccessful email deliveries including failed, bounced, blocked, and suppressed. It helps measure the following:

** Failed rate: it represents the number of emails that didn’t get delivered to the recipient for various reasons.
** Suppression rate: It represents the number of recipients who expressed interest and agreed to receive email messages from you but has no valid mailbox with that address anymore or opt-out of receiving emails from you.  
** Bounce rate: It represents the number of emails that couldn’t be delivered due to recipient’s email address is invalid, email server blocked the delivery or invalid domain name. 
** Blocked rate: It represents the number of emails that were not delivered through the recipient’s email server or were blocked by spam filter

:::image type="content" source="../media/workbooks/email-insights/email-failure-rate.png" alt-text="Screenshot of email failure rate.":::


## More information about workbooks

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.

## Editing dashboards

The **Insights** dashboards provided with your **Communication Service** resource can be customized by clicking on the **Edit** button on the top navigation bar:

:::image type="content" source="../media/workbooks/dashboard-editing.png" alt-text="Screenshot of dashboard editing process.":::

Editing these dashboards doesn't modify the **Insights** tab, but rather creates a separate workbook that can be accessed on your resource’s Workbooks tab:

:::image type="content" source="../media/workbooks/workbooks-tab.png" alt-text="Screenshot of the workbooks tab.":::

For an in-depth description of workbooks, refer to the [Azure Monitor Workbooks](../../../../azure-monitor/visualize/workbooks-overview.md) documentation.
