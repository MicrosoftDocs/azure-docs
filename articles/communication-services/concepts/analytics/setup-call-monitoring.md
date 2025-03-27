---
title: Azure Communication Services-Setup Call Monitoring
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

# Setting up Call Monitoring and Alerting


## Overview

This guide will help ACS Calling customers set up monitoring and alerting for their calls. Follow the steps below to ensure a smooth and effective setup process.

## Prerequisite: Enable Call Logging and Diagnostics

Before configuring monitoring, ensure that call logging and diagnostics are enabled for your Direct Routing setup. This process involves configuring Azure Communication Services (ACS) to collect call data. Detailed instructions can be found here: [Enable Azure Monitor](enable-logging.md).

## Step-by-Step Instructions

### Access the Monitoring Dashboard

1.  In the Azure portal, navigate to your Azure Communication Service Resource group.
2.  On the navigation blade, click on **Monitoring** and then click on **Logs**.
3.  In the query editor, enter a Kusto Query Language (KQL) for what you would like to monitor. The sample query below checks for call failure rates aggregated per hour and filters the results to only show where the failure rate exceeds 10%: 
<pre>ACSCallSummary 
| summarize UnsuccessfulCalls = countif(ParticipantEndReason != 0), TotalCalls = count() by bin(TimeGenerated, 1h) 
| extend FailureRate = (UnsuccessfulCalls * 100.0) / TotalCalls 
| where FailureRate > 10</pre>

:::image type="content" source="media\setup-call-monitoring\sample-query.png" alt-text="Example Query for Call Failure Rates":::

### Configure Alerts

1.  On the navigation blade, click on **Monitoring** and then click on **Alerts**.
2.  Click on the **Create alert rule** button.
3.  For **Signal name**, select **Custom log search**.
4.  For **Search query**, provide the query you ran in Step 1 above.
5.  Provide measurement criteria, e.g.:
    *   Measure: FailureRate
    *   Aggregation Type: Total
    *   Aggregation granularity: 1 hour 

:::image type="content" source="media\setup-call-monitoring\create-alert-rule.png" alt-text="Create Alert Rule":::

6.  Adjust the alerting logic to suit your requirements and click on **Next: Actions** when done. 

:::image type="content" source="media\setup-call-monitoring\split-by-dimensions.png" alt-text="Split Alert by DImensions":::

### Create Action Group

1.  On the next screen, click on **Create Action Group**.
2.  Select your Subscription, Resource group & Region.
3.  Provide an Action group name and Display name, and then click on **Next: Notifications**. 

:::image type="content" source="media\setup-call-monitoring\create-action-group.png" alt-text="Create Action Group":::

### Set Up Notifications

1.  Choose how you want to get notified and once done, click on **Review + create**, and wait for your alert rule to get created. 

:::image type="content" source="media\setup-call-monitoring\setup-notifications.png" alt-text="Set Up Notifications":::

2.  Once completed, click on **Next: Details**.
3.  Provide the additional requested details as shown in the screen below.
4.  Click on **Review + create**.
5.  Congratulations, you can now monitor your ACS calling setup! 

:::image type="content" source="media\setup-call-monitoring\alert-rule-details.png" alt-text="Set Up Alert Rule Details":::

* * * 
Here’s what a sample email alert looks like when triggered: Email Alert

:::image type="content" source="media\setup-call-monitoring\sample-email-alert.png" alt-text="Sample Email Alert":::

