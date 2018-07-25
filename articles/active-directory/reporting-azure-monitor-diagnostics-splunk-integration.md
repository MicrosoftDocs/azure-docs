---
title: How to integrate Azure Active Directory logs with Splunk using Azure Monitor (preview)  | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with Splunk using Azure Monitor (preview)
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

# Integrate Azure Active Directory logs with Splunk using Azure Monitor (preview)

In this article, you'll learn how to integrate Azure Active Directory logs with Splunk using Azure Monitor. First, you'd need to route the logs to an Azure event hub, then integrate it with Splunk.

## Prerequisites

1. Azure Event Hub containing Azure AD activity logs. Learn how to [stream your activity logs to Event Hub](reporting-azure-monitor-diagnostics-azure-event-hub.md). 
2. Use the following [instructions](https://github.com/Microsoft/AzureMonitorAddonForSplunk/blob/master/README.md) to download the Azure monitor add-on for Splunk and configure your Splunk instance.

## Tutorial 

1. Open your Splunk instance and click **Data Summary**.
    ![Data summary](./media/reporting-azure-monitor-diagnostics-splunk-integration/DataSummary.png "Data summary")

2. Navigate to the **Sourcetypes** tab and select **amal: aadal:audit**
    ![Sourcetypes tab](./media/reporting-azure-monitor-diagnostics-splunk-integration/sourcetypeaadal.png "Sourcetypes tab")

3. You'll see the Azure AD activity logs as shown in the following figure.
    ![Activity logs](./media/reporting-azure-monitor-diagnostics-splunk-integration/activitylogs.png "Activity Logs")

> [!NOTE]
> If you cannot install an add-on in your Splunk instance (for example, if you're using a proxy or running on Splunk Cloud), you can forward these events to the Splunk HTTP Event Collector using this [Azure Function which is triggered by new messages in the event hub](https://github.com/Microsoft/AzureFunctionforSplunkVS)." 
>

## Next steps

* [Interpret audit logs schema in Azure monitor](reporting-azure-monitor-diagnostics-audit-log-schema.md)
* [Interpret sign-in logs schema in Azure monitor](reporting-azure-monitor-diagnostics-sign-in-log-schema.md)
* [Frequently asked questions and known issues](reporting-azure-monitor-diagnostics-overview.md#frequently-asked-questions)