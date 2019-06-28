---
title: Azure Active Directory activity logs in Azure Monitor | Microsoft Docs
description: Introduction to Azure Active Directory activity logs in Azure Monitor
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 4b18127b-d1d0-4bdc-8f9c-6a4c991c5f75
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/22/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---

# Azure AD activity logs in Azure Monitor

You can route Azure Active Directory (Azure AD) activity logs to several endpoints for long term retention and data insights. This feature allows you to:

* Archive Azure AD activity logs to an Azure storage account, to retain the data for a long time.
* Stream Azure AD activity logs to an Azure event hub for analytics, using popular Security Information and Event Management (SIEM) tools, such as Splunk and QRadar.
* Integrate Azure AD activity logs with your own custom log solutions by streaming them to an event hub.
* Send Azure AD activity logs to Azure Monitor logs to enable rich visualizations, monitoring and alerting on the connected data.

> [!VIDEO https://www.youtube.com/embed/syT-9KNfug8]

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## Supported reports

You can route Azure AD audit logs and sign-in logs to your Azure storage account, event hub, Azure Monitor logs or custom solution by using this feature. 

* **Audit logs**: The [audit logs activity report](concept-audit-logs.md) gives you access to the history of every task that's performed in your tenant.
* **Sign-in logs**: With the [sign-in activity report](concept-sign-ins.md), you can determine who performed the tasks that are reported in the audit logs.

> [!NOTE]
> B2C-related audit and sign-in activity logs are not supported at this time.
>

## Prerequisites

To use this feature, you need:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* Azure AD Free, Basic, Premium 1, or Premium 2 [license](https://azure.microsoft.com/pricing/details/active-directory/), to access the Azure AD audit logs in the Azure portal. 
* An Azure AD tenant.
* A user who's a **global administrator** or **security administrator** for the Azure AD tenant.
* Azure AD Premium 1, or Premium 2 [license](https://azure.microsoft.com/pricing/details/active-directory/), to access the Azure AD sign-in logs in the Azure portal. 

Depending on where you want to route the audit log data, you need either of the following:

* An Azure storage account that you have *ListKeys* permissions for. We recommend that you use a general storage account and not a Blob storage account. For storage pricing information, see the [Azure Storage pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=storage). 
* An Azure Event Hubs namespace to integrate with third-party solutions.
* An Azure Log Analytics workspace to send logs to Azure Monitor logs.

## Cost considerations

If you already have an Azure AD license, you need an Azure subscription to set up the storage account and event hub. The Azure subscription comes at no cost, but you have to pay to utilize Azure resources, including the storage account that you use for archival and the event hub that you use for streaming. The amount of data and, thus, the cost incurred, can vary significantly depending on the tenant size. 

### Storage size for activity logs

Every audit log event uses about 2 KB of data storage. For a tenant with 100,000 users, which would incur about 1.5 million events per day, you would need about 3 GB of data storage per day. Because writes occur in approximately five-minute batches, you can anticipate approximately 9,000 write operations per month. 


The following table contains a cost estimate of, depending on the size of the tenant, a general-purpose v2 storage account in West US for at least one year of retention. To create a more accurate estimate for the data volume that you anticipate for your application, use the [Azure storage pricing calculator](https://azure.microsoft.com/pricing/details/storage/blobs/).


| Log category | Number of users | Events per day | Volume of data per month (est.) | Cost per month (est.) | Cost per year (est.) |
|--------------|-----------------|----------------------|--------------------------------------|----------------------------|---------------------------|
| Audit | 100,000 | 1.5&nbsp;million | 90 GB | $1.93 | $23.12 |
| Audit | 1,000 | 15,000 | 900 MB | $0.02 | $0.24 |
| Sign-ins | 1,000 | 34,800 | 4 GB | $0.13 | $1.56 |
| Sign-ins | 100,000 | 15&nbsp;million | 1.7 TB | $35.41 | $424.92 |
 









### Event hub messages for activity logs

Events are batched into approximately five-minute intervals and sent as a single message that contains all the events within that timeframe. A message in the event hub has a maximum size of 256 KB, and if the total size of all the messages within the timeframe exceeds that volume, multiple messages are sent. 

For example, about 18 events per second ordinarily occur for a large tenant of more than 100,000 users, a rate that equates to 5,400 events every five minutes. Because audit logs are about 2 KB per event, this equates to 10.8 MB of data. Therefore, 43 messages are sent to the event hub in that five-minute interval. 

The following table contains estimated costs per month for a basic event hub in West US, depending on the volume of event data. To calculate an accurate estimate of the data volume that you anticipate for your application, use the [Event Hubs pricing calculator](https://azure.microsoft.com/pricing/details/event-hubs/).

| Log category | Number of users | Events per second | Events per five-minute interval | Volume per interval | Messages per interval | Messages per month | Cost per month (est.) |
|--------------|-----------------|-------------------------|----------------------------------------|---------------------|---------------------------------|------------------------------|----------------------------|
| Audit | 100,000 | 18 | 5,400 | 10.8 MB | 43 | 371,520 | $10.83 |
| Audit | 1,000 | 0.1 | 52 | 104 KB | 1 | 8,640 | $10.80 |
| Sign-ins | 1,000 | 178 | 53,400 | 106.8&nbsp;MB | 418 | 3,611,520 | $11.06 |  

### Azure Monitor logs cost considerations



| Log category       | Number of users | Events per day | Events per month (30 days) | Cost per month in USD (est.) |
| :--                | ---             | ---            | ---                        | --:                          |
| Audit and Sign-ins | 100,000	       | 16,500,000     | 495,000,000	             |  $1093.00                       |
| Audit	             | 100,000         | 1,500,000      | 45,000,000                 |  $246.66                     |
| Sign-ins           | 100,000         | 15,000,000     | 450,000,000                |	$847.28                     |










To review costs related to managing the Azure Monitor logs, see [Manage cost by controlling data volume and retention in Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-manage-cost-storage).

## Frequently asked questions

This section answers frequently asked questions and discusses known issues with Azure AD logs in Azure Monitor.

**Q: Which logs are included?**

**A**: The sign-in activity logs and audit logs are both available for routing through this feature, although B2C-related audit events are currently not included. To find out which types of logs and which feature-based logs are currently supported, see [Audit log schema](reference-azure-monitor-audit-log-schema.md) and [Sign-in log schema](reference-azure-monitor-sign-ins-log-schema.md). 

---

**Q: How soon after an action will the corresponding logs show up in my event hub?**

**A**: The logs should show up in your event hub within two to five minutes after the action is performed. For more information about Event Hubs, see [What is Azure Event Hubs?](../../event-hubs/event-hubs-about.md).

---

**Q: How soon after an action will the corresponding logs show up in my storage account?**

**A**: For Azure storage accounts, the latency is anywhere from 5 to 15 minutes after the action is performed.

---

**Q: What happens if an Administrator changes the retention period of a diagnostic setting?**

**A**: The new retention policy will be applied to logs collected after the change. Logs collected before the policy change will be unaffected.

---

**Q: How much will it cost to store my data?**

**A**: The storage costs depend on both the size of your logs and the retention period you choose. For a list of the estimated costs for tenants, which depend on the volume of logs generated, see the [Storage size for activity logs](#storage-size-for-activity-logs) section.

---

**Q: How much will it cost to stream my data to an event hub?**

**A**: The streaming costs depend on the number of messages you receive per minute. This article discusses how the costs are calculated and lists cost estimates, which are based on the number of messages. 

---

**Q: How do I integrate Azure AD activity logs with my SIEM system?**

**A**: You can do this in two ways:

- Use Azure Monitor with Event Hubs to stream logs to your SIEM system. First, [stream the logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md) and then [set up your SIEM tool](tutorial-azure-monitor-stream-logs-to-event-hub.md#access-data-from-your-event-hub) with the configured event hub. 

- Use the [Reporting Graph API](concept-reporting-api.md) to access the data, and push it into the SIEM system using your own scripts.

---

**Q: What SIEM tools are currently supported?** 

**A**: Currently, Azure Monitor is supported by [Splunk](tutorial-integrate-activity-logs-with-splunk.md), QRadar, and [Sumo Logic](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure_Active_Directory). For more information about how the connectors work, see [Stream Azure monitoring data to an event hub for consumption by an external tool](../../azure-monitor/platform/stream-monitoring-data-event-hubs.md).

---

**Q: How do I integrate Azure AD activity logs with my Splunk instance?**

**A**: First, [route the Azure AD activity logs to an event hub](quickstart-azure-monitor-stream-logs-to-event-hub.md), then follow the steps to [Integrate activity logs with Splunk](tutorial-integrate-activity-logs-with-splunk.md).

---

**Q: How do I integrate Azure AD activity logs with Sumo Logic?** 

**A**: First, [route the Azure AD activity logs to an event hub](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure_Active_Directory/Collect_Logs_for_Azure_Active_Directory), then follow the steps to [Install the Azure AD application and view the dashboards in SumoLogic](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure_Active_Directory/Install_the_Azure_Active_Directory_App_and_View_the_Dashboards).

---

**Q: Can I access the data from an event hub without using an external SIEM tool?** 

**A**: Yes. To access the logs from your custom application, you can use the [Event Hubs API](../../event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph.md). 

---


## Next steps

* [Archive activity logs to a storage account](quickstart-azure-monitor-route-logs-to-storage-account.md)
* [Route activity logs to an event hub](quickstart-azure-monitor-stream-logs-to-event-hub.md)
* [Integrate activity logs with Azure Monitor](howto-integrate-activity-logs-with-log-analytics.md)