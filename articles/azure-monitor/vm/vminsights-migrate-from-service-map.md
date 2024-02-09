---
title: Migrate from Service Map to Azure Monitor VM insights
description: Migrate from Service Map to Azure Monitor VM insights to monitor the performance and health of virtual machines and scale sets, including their running processes and dependencies on other resources.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023
ms.reviewer: xpathak

---

# Migrate from Service Map to Azure Monitor VM insights

[Azure Monitor VM insights](../vm/vminsights-overview.md) monitors the performance and health of your virtual machines and virtual machine scale sets, including their running processes and dependencies on other resources. This article explains how to migrate from [Service Map](../vm/service-map.md) to Azure Monitor VM insights, which provides a map feature similar to Service Map, along with other benefits. 

> [!NOTE]
> Service Map will be retired on 30 September 2025. Be sure to migrate to VM insights before this date to continue monitoring processes and dependencies for your virtual machines.

The map feature of VM insights visualizes virtual machine dependencies by discovering running processes that have active network connection between servers, inbound and outbound connection latency, or ports across any TCP-connected architecture over a specified time range.

## Enable VM insights using Azure Monitor Agent

VM insights uses [Azure Monitor Agent](../agents/agents-overview.md), which replaces the Log Analytics agent used by Service map. For more information about how to enable VM insights for Azure virtual machines and on-premises machines, see [How to enable VM insights using Azure Monitor Agent for Azure virtual machines](../vm/vminsights-enable-overview.md#agents).

If you have on-premises machines, we recommend enabling [Azure Arc for servers](../../azure-arc/servers/overview.md) so that you enable the virtual machines for VM insights using processes similar to Azure virtual machines.

VM insights also collects per-machine performance counters, which provide visibility into the health of your virtual machines. Azure Monitor Log ingests these performance counters every minute, which slightly increases monitoring costs per machine. [Learn more about the pricing](../vm/vminsights-overview.md#pricing).


## Remove the Service Map solution from the workspace

Once you migrate to VM insights, remove the Service Map solution from the workspace to avoid data duplication and incurring extra costs:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search bar, type *Log Analytics workspaces*. As you begin typing, the list filters suggestions based on your input. 
1. Select **Log Analytics workspaces**.
1. From your list of Log Analytics workspaces, select the workspace you chose when you enabled Service Map.
1. On the left, select **Legacy solutions**.
1. From the list of solutions, select **ServiceMap(workspace name)**. 
1. On the **Overview** page for the solution, select **Delete**. 
1. When prompted to confirm, select **Yes**.

> [!IMPORTANT]
> You won't be able to onboard new subscriptions to service map after 31 August 2024. The Service Map UI won't be available after 30 September 2025.
