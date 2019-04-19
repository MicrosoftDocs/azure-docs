---
title: Stream Azure Active Directory logs to Splunk using Azure Monitor  | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with Splunk by using Azure Monitor
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: c4b605b6-6fc0-40dc-bd49-101d03f34665
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/18/2019
ms.author: markvi
ms.reviewer: dhanyahk

# Customer intent: As an IT administrator, I want to learn how to integrate Azure AD logs with my Splunk instance so I can visualize Azure AD logs in the context of all other data collected in my environment.
ms.collection: M365-identity-device-management
---

# Integrate Azure AD logs with Splunk using Azure Monitor

In this article, you learn how to integrate Azure Active Directory (Azure AD) logs with Splunk by using Azure Monitor. You first route the logs to an Azure event hub, and then you integrate the event hub with Splunk.

## Prerequisites

To use this feature, you need:
* An Azure event hub that contains Azure AD activity logs. Learn how to [stream your activity logs to an event hub](quickstart-azure-monitor-stream-logs-to-event-hub.md). 
* The Azure Monitor Add-on for Splunk. [Download and configure your Splunk instance](https://github.com/Microsoft/AzureMonitorAddonForSplunk/blob/master/README.md).

## Tutorial 

1. Open your Splunk instance, and select **Data Summary**.

    ![The "Data Summary" button](./media/tutorial-integrate-activity-logs-with-splunk/DataSummary.png)

2. Select the **Sourcetypes** tab, and then select **amal: aadal:audit**

    ![The Data Summary Sourcetypes tab](./media/tutorial-integrate-activity-logs-with-splunk/sourcetypeaadal.png)

    The Azure AD activity logs are shown in the following figure:

    ![Activity logs](./media/tutorial-integrate-activity-logs-with-splunk/activitylogs.png)

> [!NOTE]
> If you cannot install an add-on in your Splunk instance (for example, if you're using a proxy or running on Splunk Cloud), you can forward these events to the Splunk HTTP Event Collector. To do so, use this [Azure function](https://github.com/Microsoft/AzureFunctionforSplunkVS), which is triggered by new messages in the event hub. 
>

## Next steps

* [Interpret audit logs schema in Azure Monitor](reference-azure-monitor-audit-log-schema.md)
* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)
* [Frequently asked questions and known issues](concept-activity-logs-azure-monitor.md#frequently-asked-questions)