---
title: Diagnostic and audit logs - Azure Container Registry | Microsoft Docs
description: Record and analyze diagnostic log events for Azure Container Registry such as authentication, image push, and image pull.
services: container-registry
documentationcenter: ''
author: dlepow
manager: gwallace
editor: ''

ms.assetid: 
ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: 
ms.date: 10/10/2019
ms.author: danlep

---
# Azure Container Registry logs for diagnostic evaluation and auditing

This article explains how to monitor an Azure container registry using features of [Azure Monitor](../azure-monitor/overview.md). Azure Monitor collects [diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md) for user-driven events in your registry. Collect and consume this data in a variety of ways to:

* Audit configuration changes to a registry to ensure security and compliance 

* Provide a complete activity trail on registry artifacts such as pull, push, and delete events so you can diagnose any issues with operation of your registry. 

You may incur additional costs to store or process diagnostic log data.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Registry diagnostic logs

Diagnostic logs contain information emitted by Azure resources that describe the operation of each resource. For an Azure container registry, the logs include the following kinds of events and data. Log data is stored in the **RegistryEvents** table.

* Container registry repository events - Examples include push, pull, delete, untag, quarantine, content trust, and related operations for container images and other supported artifacts
* Container registry login events - Registry login account and account type, including assignment of roles and permissions
* Container registry metrics

For these operations, log data includes:
  * Success and failure events
  * Start and end time stamps
  
Custom views prefixed with **ACR** show data scoped to subsets of registry events. For example, the **ACRDelete** view shows events related to deleting tags, manifests, or repositories. 

## Enable collection of diagnostic logs

Collection of diagnostic logs for a container registry is not enabled by default. Explicitly enable diagnostic settings for each registry you want to monitor. For options and steps to enable diagnostic settings, see [Create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/platform/diagnostic-settings.md).

For example, to view logs and metrics for a container registry in near real-time in Azure Monitor, enable *streaming* of diagnostic logs to a Log Analytics workspace. To enable this diagnostic setting using the Azure portal:

1. If you don't already have a workspace, first create a workspace using the [Azure portal](../azure-monitor/learn/quick-create-workspace.md). 
1. In the portal, select the registry, and select **Monitoring > Diagnostic settings > Add diagnostic setting**.
1. Enter a name for the setting, and select **Send to Log Analytics**.
1. Select the workspace for the registry diagnostic logs.
1. Select the log data you want to stream, and click **Save**.

The following image shows creation of a diagnostic setting for a registry using the portal.

:::image type="content" source="media/container-registry-diagnostics-audit-logs/diagnostic-settings.png" alt-text="Enable diagnostic settings":::

After you enable streaming of diagnostic logs to Log Analytics, view the logs in Azure Monitor under the **Logs** tab.

//add screenshot


Several default queries are enabled. To create your own log queries, see [Get started with log queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md).
 
### Additional log destinations

In addition to streaming the logs to Log Analytics, or as an alternative, a common scenario is to select an Azure Storage account as a destination to archive logs. To archive logs in Azure Storage, create the account before enabling archiving through the diagnostic settings.

You can also stream diagnostic log events to an [Azure Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md). Event Hubs can ingest millions of events per second, which you can then transform and store using any real-time analytics provider. 

## Next steps

* Learn more about using [Log Analytics](../azure-monitor/log-query/get-started-portal.md) and creating [log queries](../azure-monitor/log-query/get-started-queries.md)

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
