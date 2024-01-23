---
title: Enable VM Insights on a Windows client machine
description: This article describes how you enable VM Insights on a Windows client machine that's not always online.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 12/11/2023
# Customer-intent: As a cloud administrator, I want to enable VM Insights on a Windows client machine that's not always online, so that I can collect performance and dependency data when the machine comes online.

---

# Enable VM Insights on a Windows client machine

For Windows 10 and 11 client machines that are always powered on and connected to the internet, use [Azure Arc for servers](../../azure-arc/servers/overview.md) and follow the same process as [enabling VM insights on Azure VMs](vminsights-enable-portal.md). 

This article describes how to enable VM Insights on a [Windows client machine that's online intermittently and not managed using Azure Arc](/azure/azure-arc/servers/prerequisites#client-operating-system-guidance).

## Prerequisites

- [Log Analytics workspace](../logs/quick-create-workspace.md).
- A Windows device that's domain joined to your Microsoft Entra tenant. The device must be able to connect to the internet.
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported.

### Firewall requirements

- For Azure Monitor Agent firewall requirements, see [Define Azure Monitor Agent network settings](../agents/azure-monitor-agent-data-collection-endpoint.md#firewall-requirements). 
- The VM Insights Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports.

Azure Monitor Agent transmits data to Azure Monitor directly or through the [Log Analytics gateway](../../azure-monitor/agents/gateway.md) if your IT security policies don't allow computers on the network to connect to the internet.

## Limitations

[!INCLUDE [azure-monitor-agent-client-installer-limitations](../includes/azure-monitor-agent-client-installer-limitations.md)]

## Deploy VM Insights data collection rule and install agents

To enable VM Insights on a Windows client machine: 

1. If you don't have an existing VM Insights data collection rule, [deploy a VM Insights data collection rule using ARM templates](vminsights-enable-resource-manager.md#deploy-data-collection-rule). The data collection rule must be in the same region as your Log Analytics workspace.
1. Follow the steps described in [Install Azure Monitor Agent on Windows client devices](../agents/azure-monitor-agent-windows-client.md) to:

    - Install Azure Monitor Agent on your machine using the client installer.
    - Create a monitored object. 
    - Associate the monitored object to your VM Insights data collection rule. 
    
    The monitored object automatically associates your VM Insights data collection rule to all Windows devices in your tenant on which you install the Azure Monitor Agent using the client installer.
    
1. To use the [Map feature of VM Insights](vminsights-maps.md), install [Dependency Agent on your machine manually](vminsights-dependency-agent-maintenance.md#install-or-upgrade-dependency-agent).
        
## Troubleshooting

This section offers troubleshooting tips for common issues.

### Machine doesn't appear on the map

If your Dependency agent installation succeeded but you don't see your computer on the map, diagnose the problem by following these steps:

1. Is the Dependency agent installed successfully? Check to see if the service is installed and running. Look for the service named "Microsoft Dependency agent."

1. Are you on the [Free pricing tier of Log Analytics](/previous-versions/azure/azure-monitor/insights/solutions)? The Free plan allows for up to five unique computers. Any subsequent computers won't show up on the map, even if the prior five are no longer sending data.

1. Is the computer sending log and performance data to Azure Monitor Logs? Run this query for your computer:

    ```Kusto
    Usage | where Computer == "computer-name" | summarize sum(Quantity), any(QuantityUnit) by DataType
    ```

    Did it return one or more results? Is the data recent? If so, the agent is operating correctly and communicating with the service. If not, check the agent on your server. See [Troubleshooting Azure Monitor Agent on Windows virtual machines and scale sets](../agents/azure-monitor-agent-troubleshoot-windows-vm.md) or [Log Analytics agent for Linux troubleshooting](../agents/agent-linux-troubleshoot.md).

#### Machine appears on the map but has no processes

You see your server on the map, but it has no process or connection data. In this case, the Dependency agent is installed and running, but the kernel driver didn't load.

Check the *C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log* file . The last lines of the file should indicate why the kernel didn't load. 

## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with VM Insights.

- To view discovered application dependencies, see [View VM Insights Map](vminsights-maps.md).
- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).
