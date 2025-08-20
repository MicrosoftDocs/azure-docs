---
title: Set up call monitoring
titleSuffix: An Azure Communication Services concept document
description: Configure Communications Services call monitoring and alerting
author: mkhribech
services: azure-communication-services

ms.author: aakanmu
ms.date: 3/26/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---

# Set up call monitoring and alerting

This article describes how Azure Communication Services Calling customers set-up monitoring and alerting for their calls. Follow these steps to ensure a smooth and effective setup process.

## Prerequisite: enable call logging and diagnostics

Before configuring monitoring, ensure that call logging and diagnostics are enabled for your Direct Routing setup. This process involves configuring Azure Communication Services to collect call data. For detailed instructions, see [Enable Azure Monitor](enable-logging.md).

## Step-by-step instructions

### Access the monitoring dashboard

1.  In the Azure portal, navigate to your Azure Communication Service Resource group.
2.  On the navigation blade, click **Monitoring** and then click **Logs**.
3.  In the query editor, enter a Kusto Query Language (KQL) for what you want to monitor. The following sample query checks for call failure rates aggregated per hour and filters the results to show only where the failure rate exceeds 10%: 

   <pre>
   ACSCallSummary 
   | summarize UnsuccessfulCalls = countif(ParticipantEndReason != 0), TotalCalls = count() by bin(TimeGenerated, 1h) 
   | extend FailureRate = (UnsuccessfulCalls * 100.0) / TotalCalls 
   | where FailureRate > 10</pre>

:::image type="content" source="media\set-up-call-monitoring\sample-query.png" alt-text="Screen capture of an example Kusto query for call failure rates.":::

### Configure alerts

1. On the navigation blade, click **Monitoring** and then click **Alerts**.
2. Click **Create alert rule**.
3. For **Signal name**, select **Custom log search**.
4. For **Search query**, provide the query you ran in the previous section.
5. Provide measurement criteria, for example:
   *   Measure: FailureRate
   *   Aggregation Type: Total
   *   Aggregation granularity: 1 hour 

   :::image type="content" source="media\set-up-call-monitoring\create-alert-rule.png" alt-text="Screen capture of the create an alert rule showing signal name, search query, and measurement criteria.":::

6.  Adjust the alert logic to suit your requirements. When complete, click **Next: Actions** when done. 

:::image type="content" source="media\set-up-call-monitoring\split-by-dimensions.png" alt-text="Screen capture of split by dimensions including alert logic.":::

### Create action group

1.  From the Actions screen, click **Create Action Group**.
2.  Select your **Subscription**, **Resource group**, and **Region**.
3.  Provide an Action group name and Display name, then click **Next: Notifications**.

:::image type="content" source="media\set-up-call-monitoring\create-action-group.png" alt-text="Screen capture of create action group showing project details of subscription, resource group, and region.":::

### Set up notifications

1. Choose how you want to be notified. When complete, click **Review + create**, and wait for your alert rule to be created.

   :::image type="content" source="media\set-up-call-monitoring\set-up-notifications.png" alt-text="Screen capture of how to set up notifications and review + create the notification.":::

2.  When complete, click **Next: Details**.
3.  Provide more details as shown in the following screen.
4.  Click **Review + create**.

   :::image type="content" source="media\set-up-call-monitoring\alert-rule-details.png" alt-text="Screen capture showing set up alert rule details.":::

   Congratulations, you can now monitor your Azure Communication Services calling!

A sample email alert looks like this when triggered: Email Alert.

:::image type="content" source="media\set-up-call-monitoring\sample-email-alert.png" alt-text="Screen capture of a sample email alert showing the reason and affected resource hierarchy.":::

## Related articles

[Enable logs via Diagnostic Settings in Azure Monitor](./enable-logging.md)