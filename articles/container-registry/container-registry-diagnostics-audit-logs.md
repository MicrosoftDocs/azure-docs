---
title: Diagnostic and audit logs - Azure Container Registry | Microsoft Docs
description: Record and analyze diagnostic log events for Azure Container Registry such as authentication, image push, and image pull.
services: batch
documentationcenter: ''
author: dlepow
manager: gwallace
editor: ''

ms.assetid: 
ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: big-compute
ms.date: 08/12/2019
ms.author: danlep

---
# Azure Container Registry logs for diagnostic evaluation and auditing

This article explains how to monitor an Azure container registry using features of [Azure Monitor](../azure-monitor/overview.md). Azure Monitor collects [diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md) for user-driven events in your registry. Collect and consume this data in a variety of ways to:

* Audit configuration changes to a registry to ensure security and compliance 

* Provide a complete activity trail of operations like pull, push, and delete so you can diagnose any issues with operation of your registry. 


## Registry diagnostic logs

Diagnostic logs contain information emitted by Azure resources that describe the operation of each resource. For an Azure container registry, the logs include the following kinds of events and data. Log data is stored in the **RegistryEvents** table.

* **User operations** on registry artifacts or ACR tasks. Examples include push, pull, delete, untag, quarantine, content trust, and related operations for container images. For these operations, log data includes:
  * Success and failure events
  * Start and end time stamps
  * Registry login account and account type, including assignment of roles and permissions
* **Registry network configuration** 

Custom views prefixed with **ACR** show data scoped to subsets of registry events. For example, the **ACRDelete** view shows events to delete tags, manifests, or repositories. 

### Enable collection of diagnostic logs

Collection of diagnostic logs for a container registry is not enabled by default. Explicitly enable diagnostic settings for each registry you want to monitor. Following are steps to enable diagnostic logs using Azure Monitor in the [Azure portal](https://portal.azure.com).

1. In the portal, navigate to **Monitor**. Under **Settings**, select **Diagnostic settings**. 
1. Use the dropdowns to select an Azure Container Registry resource.
1. If no settings exist on the resource you selected, you are prompted to create a setting. Select **Turn on diagnostics**. 
1. In **Diagnostic settings**, enter a name for the setting, and choose a [log destination](#log-destinations) (existing Storage account, Event Hub, or Log Analytics Workspace). 
1. Click **Save**.

// screenshot



You can quickly view and analyze diagnostic logs in Azure Monitor, where the data is written immediately with no need to first write the data to storage. After you enable diagnostic logs for a registry, view the logs in Azure Monitor under the **Logs** tab.

//add screenshot


Several default queries are enabled. To create your own log queries, see [Get started with log queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md).
 
### Log destinations

A common scenario is to select an Azure Storage account as a log destination. To archive logs in Azure Storage, create the account before enabling collection of logs. 

Other destination options for diagnostic logs:

* Stream diagnostic log events to an [Azure Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md). Event Hubs can ingest millions of events per second, which you can then transform and store using any real-time analytics provider. 

* Send diagnostic logs to a [Log Analytics Workspace](../log-analytics/log-analytics-overview.md), where you can analyze them or export them for analysis in Power BI or Excel.

> [!NOTE]
> You may incur additional costs to store or process diagnostic log data with Azure services. 
>

## Next steps

* Learn about ...
