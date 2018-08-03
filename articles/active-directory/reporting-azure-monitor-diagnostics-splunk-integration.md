---
title: How to integrate Azure Active Directory logs with Splunk by using Azure Monitor (preview)  | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with Splunk by using Azure Monitor (preview)
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: c4b605b6-6fc0-40dc-bd49-101d03f34665
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: compliance-reports
ms.date: 07/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Integrate Azure AD logs with Splunk by using Azure Monitor (preview)

In this article, you learn how to integrate Azure Active Directory (Azure AD) logs with Splunk by using Azure Monitor. You first route the logs to an Azure event hub, and then you integrate the event hub with Splunk.

## Prerequisites

To use this feature, you need:
* An Azure event hub that contains Azure AD activity logs. Learn how to [stream your activity logs to an event hub](reporting-azure-monitor-diagnostics-azure-event-hub.md). 
* The Azure Monitor Add-on for Splunk. [Download and configure your Splunk instance](https://github.com/Microsoft/AzureMonitorAddonForSplunk/blob/master/README.md).

## Tutorial 

1. Open your Splunk instance, and select **Data Summary**.

    ![The "Data Summary" button](./media/reporting-azure-monitor-diagnostics-splunk-integration/DataSummary.png)

2. Select the **Sourcetypes** tab, and then select **amal: aadal:audit**

    ![The Data Summary Sourcetypes tab](./media/reporting-azure-monitor-diagnostics-splunk-integration/sourcetypeaadal.png)

    The Azure AD activity logs are shown in the following figure:

    ![Activity logs](./media/reporting-azure-monitor-diagnostics-splunk-integration/activitylogs.png)

> [!NOTE]
> If you cannot install an add-on in your Splunk instance (for example, if you're using a proxy or running on Splunk Cloud), you can forward these events to the Splunk HTTP Event Collector. To do so, use this [Azure function](https://github.com/Microsoft/AzureFunctionforSplunkVS), which is triggered by new messages in the event hub. 
>

## Next steps

* [Interpret audit logs schema in Azure Monitor](reporting-azure-monitor-diagnostics-audit-log-schema.md)
* [Interpret sign-in logs schema in Azure Monitor](reporting-azure-monitor-diagnostics-sign-in-log-schema.md)
* [Frequently asked questions and known issues](reporting-azure-monitor-diagnostics-overview.md#frequently-asked-questions)
