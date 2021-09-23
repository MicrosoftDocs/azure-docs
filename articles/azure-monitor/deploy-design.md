---
title: Deploy Azure Monitor
description: Describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Deploy Azure Monitor - Design monitoring environment
This article provides guidance on design decisions that you



### Log Analytics workspace
You require at least one Log Analytics workspace to enable [Azure Monitor Logs](logs/data-platform-logs.md), which is required for collecting such data as logs from Azure resources, collecting data from the guest operating system of Azure virtual machines, and for most Azure Monitor insights. Other services such as Azure Sentinel and Azure Security Center also use a Log Analytics workspace and can share the same one that you use for Azure Monitor. You can start with a single workspace to support this monitoring, but see  [Designing your Azure Monitor Logs deployment](logs/design-logs-deployment.md) for guidance on when to use multiple workspaces.

As described in [Monitor virtual machines with Azure Monitor: Configure monitoring](monitor-virtual-machine-configure.md#create-and-prepare-a-log-analytics-workspace), Azure Monitor and the security services require a Log Analytics workspace. Depending on your particular requirements, you might choose to share a common workspace or separate your availability and performance data from your security data. For complete details on logic that you should consider for designing a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).

There is no cost for creating a Log Analytics workspace, but there is a potential charge once you configure data to be collected into it. See [Manage usage and costs with Azure Monitor Logs](logs/manage-cost-storage.md) for details.  

See [Create a Log Analytics workspace in the Azure portal](logs/quick-create-workspace.md) to create an initial Log Analytics workspace. See [Manage access to log data and workspaces in Azure Monitor](logs/manage-access.md) to configure access. 


## Separate or single Application Insights Resource 


## Network configuration for hybrid resources

