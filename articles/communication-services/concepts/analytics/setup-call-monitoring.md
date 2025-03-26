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

# Setting up ACS Call Monitoring and Alerting


## Overview

This guide will help ACS Calling customers set up monitoring and alerting for their calls. Follow the steps below to ensure a smooth and effective setup process.

## Prerequisite: Enable Call Logging and Diagnostics

Before configuring monitoring, ensure that call logging and diagnostics are enabled for your Direct Routing setup. This process involves configuring Azure Communication Services (ACS) to collect call data. Detailed instructions can be found here: [Azure Communication Services-Enable Azure Monitor - An Azure Communication Services concept document | Microsoft Learn](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/enable-logging).

## Step-by-Step Instructions

### Access the Monitoring Dashboard

1.  In the Azure portal, navigate to your Azure Communication Service Resource group.
2.  On the navigation blade, click on **Monitoring** and then click on **Logs**.
3.  In the query editor, enter a Kusto Query Language (KQL) for what you would like to monitor. The sample query below checks for call failure rates aggregated per hour and filters the results to only show where the failure rate exceeds 10%: 
<pre>ACSCallSummary 
| summarize UnsuccessfulCalls = countif(ParticipantEndReason != 0), TotalCalls = count() by bin(TimeGenerated, 1h) 
| extend FailureRate = (UnsuccessfulCalls * 100.0) / TotalCalls 
| where FailureRate > 10</pre>

![image.png](/.attachments/image-aa25f1b3-b948-48e6-a340-e187300af171.png)

### Configure Alerts

1.  On the navigation blade, click on **Monitoring** and then click on **Alerts**.
2.  Click on the **Create alert rule** button.
3.  For **Signal name**, select **Custom log search**.
4.  For **Search query**, provide the query you ran in Step 1 above.
5.  Provide measurement criteria, e.g.:
    *   Measure: FailureRate
    *   Aggregation Type: Total
    *   Aggregation granularity: 1 hour 

![image.png](/.attachments/image-a050090d-9eb0-4b9e-895a-4831647fa6e0.png)

6.  Adjust the alerting logic to suit your requirements and click on **Next: Actions** when done. 

![image.png](/.attachments/image-c20f1a73-4f00-483f-9672-3eea6ddaf3a0.png)

### Create Action Group

1.  On the next screen, click on **Create Action Group**.
2.  Select your Subscription, Resource group & Region.
3.  Provide an Action group name and Display name, and then click on **Next: Notifications**. 

![image.png](/.attachments/image-edeb7d8f-626f-4213-b827-4099d89deb6a.png)

### Set Up Notifications

1.  Choose how you want to get notified and once done, click on **Review + create**, and wait for your alert rule to get created. 

![image.png](/.attachments/image-3d15df0c-4f48-4166-a884-859069777e27.png)

2.  Once completed, click on **Next: Details**.
3.  Provide the additional requested details as shown in the screen below.
4.  Click on **Review + create**.
5.  Congratulations, you can now monitor your ACS calling setup! 

![image.png](/.attachments/image-63ead467-68dd-449f-8ad6-f814c7f576ac.png)

* * * 
Here’s what a sample email alert looks like when triggered: Email Alert

![image.png](/.attachments/image-378eb46c-80c1-4578-a577-e4395974fd44.png)

