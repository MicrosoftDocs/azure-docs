---
title: Enable Azure Monitor for a hybrid environment
description: This article describes how you enable VM insights for a hybrid cloud environment that contains one or more virtual machines.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 12/11/2023
# Customer-intent: As a cloud administrator, I want to enable VM insights on Windows virtual machines in a hybrid cloud environment without using Azure Arc, so that I can monitor the performance and dependencies of my virtual machines.

---

# Enable VM insights for a hybrid virtual machine

For Linux hybrid machines, use [Azure Arc for servers](../../azure-arc/servers/overview.md) and onboard your virtual machines in the same way you [enable VM insights on Azure VMs](vminsights-enable-portal.md). Azure Arc doesn't currently support Windows hybrid machines. This article describes how to enable VM insights on a Widows virtual machine outside of Azure, including on-premises and other cloud environments, without using Azure Arc, which doesn't currently support Windows.

## Prerequisites

- [Log Analytics workspace](../logs/quick-create-workspace.md).
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported.

## Firewall requirements

- For Azure Monitor Agent firewall requirements, see [Define Azure Monitor Agent network settings](../agents/azure-monitor-agent-data-collection-endpoint.md#firewall-requirements). 
- The VM insights Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports.

Azure Monitor Agent transmits data to the Azure Monitor service directly or through the [Operations Management Suite gateway](../../azure-monitor/agents/gateway.md) if your IT security policies don't allow computers on the network to connect to the internet.

## Install Azure Monitor Agent and Dependency agent

To enable VM insights on Windows virtual machines outside of Azure: 

1. If you don't have an existing VM insights data collection rule, [Deploy a VM insights data collection rule using ARM templates](vminsights-enable-resource-manager.md#deploy-data-collection-rule). The data collection rule must be in the same region as your Log Analytics workspace.
1. Install Azure Monitor Agent on your machine using the client installer, create a monitored object, and associate the monitored object to your VM insights data collection rule, as described in [Azure Monitor Agent on Windows client devices](../agents/azure-monitor-agent-windows-client.md). 
1. Optionally, to use the [Map feature of VM insights](vminsights-maps.md), install Dependency Agent on your machine manually.
        
## Troubleshooting

This section offers troubleshooting tips for common issues.

### VM doesn't appear on the map

If your Dependency agent installation succeeded but you don't see your computer on the map, diagnose the problem by following these steps:

1. Is the Dependency agent installed successfully? Check to see if the service is installed and running. Look for the service named "Microsoft Dependency agent."

1. Are you on the [Free pricing tier of Log Analytics](/previous-versions/azure/azure-monitor/insights/solutions)? The Free plan allows for up to five unique computers. Any subsequent computers won't show up on the map, even if the prior five are no longer sending data.

1. Is the computer sending log and performance data to Azure Monitor Logs? Run this query for your computer:

    ```Kusto
    Usage | where Computer == "computer-name" | summarize sum(Quantity), any(QuantityUnit) by DataType
    ```

    Did it return one or more results? Is the data recent? If so, your the agent is operating correctly and communicating with the service. If not, check the agent on your server. See [Troubleshooting Azure Monitor Agent on Windows virtual machines and scale sets](../agents/azure-monitor-agent-troubleshoot-windows-vm.md) or [Log Analytics agent for Linux troubleshooting](../agents/agent-linux-troubleshoot.md).

#### Computer appears on the map but has no processes

You see your server on the map, but it has no process or connection data. In this case, the Dependency agent is installed and running, but the kernel driver didn't load.

Check the *C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log* file . The last lines of the file should indicate why the kernel didn't load. 

## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with VM insights.

- To view discovered application dependencies, see [View VM insights Map](vminsights-maps.md).
- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).
