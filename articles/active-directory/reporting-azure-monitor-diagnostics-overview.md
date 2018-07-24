---
title: Azure Active Directory activity logs in Azure Monitor (preview) | Microsoft Docs
description: Overview of Azure Active Directory activity logs in Azure Monitor (preview)
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 4b18127b-d1d0-4bdc-8f9c-6a4c991c5f75
ms.service: active-directory
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: compliance-reports
ms.date: 07/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Azure Active Directory activity logs in Azure Monitor (preview)

You can now route Azure AD activity logs using Azure Monitor to your own storage account or Event Hub. With the public preview of Azure Active Directory logs in Azur Monitor, you can:

* Archive your audit logs for an Azure storage account, enabling you to retain the data for a long time
* Stream your audit logs to an Azure event hub for analytics using popular SIEM tools like Splunk and QRadar
* Integrate your audit logs with your own custom log solutions by streaming them to an event hub

> [!VIDEO https://www.youtube.com/embed/syT-9KNfug8]

## Supported reports

You can route audit activity logs and sign-ins activity logs to your Azure storage account, Event Hub or custom solution using this feature. 

* **Audit logs**: The [audit logs activity report](active-directory-reporting-activity-audit-logs.md) provides you with access to the history of every task performed in your tenant.
* **Sign-ins**: With the [sign-ins activity report](active-directory-reporting-activity-sign-ins.md), you can determine who performed the tasks reported by the audit logs report.

> [!NOTE]
> B2C related audit and sign-ins activity logs are not supported at this time.
>

## Prerequisites

To use this feature, you need:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* Azure AD Free, Basic, Premium 1, or Premium 2 [license](https://azure.microsoft.com/pricing/details/active-directory/) to access the Azure AD logs in the Azure portal. 

Depending on where you want to route the audit log data, you need either:

* An Azure storage account, that you have *ListKeys* permissions on. We recommend you use a general storage account and not a blob storage account. For pricing information on storage, check out the [Azure Storage pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=storage). 
* Azure event hubs namespace, in order to integrate with third-party solutions.

> [!NOTE]
> You need to be a *Global Administrator* or *Security Administrator* in the Azure AD tenant to access the Azure AD activity logs.
>

## Cost considerations

If you already have an Azure AD license, you need an Azure subscription to set up the storage account and event hub. The Azure subscription comes at no cost, but you have to pay to utilize Azure resources, including the storage account you use for archival and the event hub you use for streaming. The amount of data, and thus the cost incurred, will vary significantly depending on the tenant size. 

### Storage size for activity logs

Every audit log event uses up about 2 KB of data storage. So, for a tenant with 100,000 users, which would incur about 1.5 million events per day, you would need about 3 GB of data storage per day. Since writes occur in approximately 5-min batches, you can anticipate approximately 9000 write operations per month. The following table contains an approximate estimate for the cost, depending on the size of the tenant, for a general-purpose v2 storage account in West US for at least one year of retention. Use the [Azure storage pricing calculator](https://azure.microsoft.com/pricing/details/storage/blobs/) to create a more accurate estimate for the data volume you anticipate for your application. 
Every audit log event uses up about 2 KB of data storage. So, for a tenant with 100,000 users, which would incur about 1.5 million events per day, you would need about 3 GB of data storage per day. Since writes occur in approximately 5-min batches, you can anticipate approximately 9000 write operations per month. The following table contains an approximate estimate for the cost, depending on the size of the tenant, for a general-purpose v2 storage account in West US for at least one year of retention. Use the [Azure storage pricing calculator](https://azure.microsoft.com/pricing/details/storage/blobs/) to create a more accurate estimate for the data volume you anticipate for your application. 

| Log category | Number of users | Number of events/day | Approximate volume of data per month | Approximate cost per month | Approximate cost per year |
|--------------|-----------------|----------------------|--------------------------------------|----------------------------|---------------------------|
| Audit | 100,000 | 1.5 million | 90 GB | $1.93 | $23.12 |
| Audit | 1000 | 15000 | 900 MB | $0.02 | $0.24 |
| Sign-ins | 1000 | 34800 | 4 GB | $0.13 | $1.56 |
| Sign-ins | 100,000 | 15 million | 1.7 TB | $35.41 | $424.92 | 


### Event hub messages for activity logs

Events are batched into approximately five-minute intervals and sent as a single message containing all the events within that timeframe. A message in the event hub has a maximum size of 256 kB, and if the size of all the messages within the timeframe exceeds that volume, multiple messages are sent. 

For example, there are typically about 18 events per second for a large tenant of more than 100,000 users, equating to 5400 events every 5 minutes. Since audit logs are about 2 KB per event, this equates to 10.8 MB of data, therefore 43 messages will be sent to the event hub in that 5-minute interval. The following table contains an approximate cost for a basic event hub in West US, depending on the volume of event data. Use the [Event Hub pricing calculator](https://azure.microsoft.com/pricing/details/event-hubs/) to calculate an accurate estimate for the data volume that you anticipate for your application.

| Log category | Number of users | Number of events/second | Number of events per 5-minute interval | Volume per interval | Number of messages per interval | Number of messages per month | Approximate cost per month |
|--------------|-----------------|-------------------------|----------------------------------------|---------------------|---------------------------------|------------------------------|----------------------------|
| Audit | 100,000 | 18 | 5400 | 10.8 MB | 43 | 371,520 | $10.83 |
| Audit | 1000 | 0.1 | 52 | 104 KB | 1 | 8640 | $10.8 |
| Sign-ins | 1000 | 178 | 53400 | 106.8 MB | 418 | 3,611,520 | $11.06 |  


## Frequently asked questions

This section contains the frequently asked questions and known issues with Azure Active Directory logs in Azure Monitor.

**Q: Where should I start?** 

**A:** Start with the [Overview](reporting-azure-monitor-diagnostics-overview.md) to get an idea about what you need to deploy this feature. Once you're familiar with the pre-requisites, check out the tutorials to help you configure and route your logs to Event Hubs.

---

**Q: Which logs are included?**

**A:** Both sign-ins and audit logs are available for routing through this feature, although B2C related audit events are currently not included. Read the [Audit log schema](reporting-azure-monitor-diagnostics-audit-log-schema.md) and [Sign-in log schema](reporting-azure-monitor-diagnostics-sign-in-log-schema.md) to find out which types of logs and which feature-based logs are currently supported. 

---

**Q: How soon after an action will the corresponding logs show up in Event Hubs?**

**A:** The logs should show up in Event Hubs anywhere between two and five minutes of performing the action. For more information about event hubs, see [What is event hubs?](/azure/event-hubs/event-hubs-what-is-event-hubs.md)

---

**Q: How soon after an action will the corresponding logs show up in storage accounts?**

**A:** For Azure storage accounts, the latency is anywhere between 5 and 15 minutes of performing the action.

---

**Q: How much will it cost to store my data?**

**A:** The storage cost depends on the size of your logs as well as the retention period you choose. For an approximate estimate of the costs for tenants depending on the volume of logs generated, check out the [Overview](reporting-azure-monitor-diagnostics-overview.md).

---

**Q: How much will it cost to stream my data to Event Hubs?**

**A:** The streaming cost depends on the number of messages you receive per minute. Read the [Overview](reporting-azure-monitor-diagnostics-overview.md) to learn more about how the cost is calculated as well as find an approximate estimate based on the number of messages. 

---

**Q: What SIEM tools are currently supported?** 

**A:** Currently, Azure Monitor is supported by Splunk, QRadar and Sumologic. However, Splunk is the only SIEM tools that is supported for Azure Active Directory logs. For more information on how the connectors work, see [Stream Azure monitoring data to an event hub for consumption by an external tool](/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs).

---

**Q: Can I access the data from Event Hub without using an external SIEM tool?** 

**A:** Yes, you can use the [Event Hub API](/azure/event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph) to access the logs from your custom application. 

---


## Next steps

* [Archive activity logs to storage account](reporting-azure-monitor-diagnostics-azure-storage-account.md)
* [Route activity logs to Event Hub](reporting-azure-monitor-diagnostics-azure-event-hub.md)
* [Read more about Azure Diagnostic Logs](/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md)