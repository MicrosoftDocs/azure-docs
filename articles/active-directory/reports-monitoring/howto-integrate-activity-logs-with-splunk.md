---
title: Integrate Azure Active Directory logs with Splunk using Azure Monitor | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with SumoLogic using Azure Monitor
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 2c3db9a8-50fa-475a-97d8-f31082af6593
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 05/13/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---

# How to: Integrate Azure Active Directory logs with Splunk using Azure Monitor

In this article, you learn how to integrate Azure Active Directory (Azure AD) logs with Splunk by using Azure Monitor. You first route the logs to an Azure event hub, and then you integrate the event hub with Splunk.

## Prerequisites

To use this feature, you need:
* An Azure event hub that contains Azure AD activity logs. Learn how to [stream your activity logs to an event hub](quickstart-azure-monitor-stream-logs-to-event-hub.md). 
* The Azure Monitor Add-on for Splunk. [Download and configure your Splunk instance](https://github.com/Microsoft/AzureMonitorAddonForSplunk/blob/master/README.md).

## Integrate Azure Active Directory logs 

1. Open your Splunk instance, and select **Data Summary**.

    ![The "Data Summary" button](./media/howto-integrate-activity-logs-with-splunk/DataSummary.png)

2. Select the **Sourcetypes** tab, and then select **amal: aadal:audit**

    ![The Data Summary Sourcetypes tab](./media/howto-integrate-activity-logs-with-splunk/sourcetypeaadal.png)

    The Azure AD activity logs are shown in the following figure:

    ![Activity logs](./media/howto-integrate-activity-logs-with-splunk/activitylogs.png)

> [!NOTE]
> If you cannot install an add-on in your Splunk instance (for example, if you're using a proxy or running on Splunk Cloud), you can forward these events to the Splunk HTTP Event Collector. To do so, use this [Azure function](https://github.com/Microsoft/AzureFunctionforSplunkVS), which is triggered by new messages in the event hub. 
>

## Next steps

* [Interpret audit logs schema in Azure Monitor](reference-azure-monitor-audit-log-schema.md)
* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)
* [Frequently asked questions and known issues](concept-activity-logs-azure-monitor.md#frequently-asked-questions)