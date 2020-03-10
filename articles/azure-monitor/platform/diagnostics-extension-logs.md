---
title: Use blob storage for IIS and table storage for events in Azure Monitor | Microsoft Docs
description: Azure Monitor can read the logs for Azure services that write diagnostics to table storage or IIS logs written to blob storage.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/14/2020

---

# Collect data from Azure diagnostics extension to Azure Monitor Logs
Azure diagnostics extension is an [agent in Azure Monitor](agents-overview.md) that collects monitoring data from the guest operating system of Azure compute resources including virtual machines. This article describes how to collect data collected by the diagnostics extension from Azure Storage to Azure Monitor Logs.

> [!NOTE]
> The Log Analytics agent in Azure Monitor is typically the preferred method to collect data from the guest operating system into Azure Monitor Logs. See [Overview of the Azure Monitor agents](agents-overview.md) for a detailed comparison of the agents.

## Supported data types
Azure diagnostics extension stores data in an Azure Storage account. For Azure Monitor Logs to collect this data, it must be in the following locations:

| Log Type | Resource Type | Location |
| --- | --- | --- |
| IIS logs |Virtual Machines <br> Web roles <br> Worker roles |wad-iis-logfiles (Blob Storage) |
| Syslog |Virtual Machines |LinuxsyslogVer2v0 (Table Storage) |
| Service Fabric Operational Events |Service Fabric nodes |WADServiceFabricSystemEventTable |
| Service Fabric Reliable Actor Events |Service Fabric nodes |WADServiceFabricReliableActorEventTable |
| Service Fabric Reliable Service Events |Service Fabric nodes |WADServiceFabricReliableServiceEventTable |
| Windows Event logs |Service Fabric nodes <br> Virtual Machines <br> Web roles <br> Worker roles |WADWindowsEventLogsTable (Table Storage) |
| Windows ETW logs |Service Fabric nodes <br> Virtual Machines <br> Web roles <br> Worker roles |WADETWEventTable (Table Storage) |

## Data types not supported

- Performance data from the guest operating system
- IIS logs from Azure websites


## Enable Azure diagnostics extension
See [Install and configure Windows Azure diagnostics extension (WAD)](diagnostics-extension-windows-install.md) or [Use Linux Diagnostic Extension to monitor metrics and logs](../../virtual-machines/extensions/diagnostics-linux.md) for details on installing and configuring the diagnostics extension. This will alow you to specify the storage account and to configure collection of the data that you want to forward to Azure Monitor Logs.


## Collect logs from Azure Storage
Use the following procedure to enable collection of diagnostics extension data from an Azure Storage account:

1. In the Azure portal, go to **Log Analytics Workspaces** and select your workspace.
1. Click **Storage accounts logs** in the **Workspace Data Sources** section of the menu.
2. Click  **Add**.
3. Select the **Storage account** that contains the data to collect.
4. Select the **Data Type** you want to collect.
5. The value for Source is automatically populated based on the data type.
6. Click **OK** to save the configuration.
7. Repeat for additional data types.

In approximately 30 minutes, you are able to see data from the storage account in the Log Analytics workspace. You will only see data that is written to storage after the configuration is applied. The workspace does not read the pre-existing data from the storage account.

> [!NOTE]
> The portal does not validate that the source exists in the storage account or if new data is being written.



## Next steps

* [Collect logs and metrics for Azure services](collect-azure-metrics-logs.md) for supported Azure services.
* [Enable Solutions](../../azure-monitor/insights/solutions.md) to provide insight into the data.
* [Use search queries](../../azure-monitor/log-query/log-query-overview.md) to analyze the data.
