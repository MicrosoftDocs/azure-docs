---
title: 'Monitor virtual machines with Azure Monitor: Configure monitoring'
description: Learn how to configure virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with an Azure Monitor scenario.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Deploy agent
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to configure monitoring of your Azure and hybrid virtual machines in Azure Monitor.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).

This article discusses configuration of the most common Azure Monitor features to monitor the virtual machine host and its guest operating system. Depending on your particular environment and business requirements, you might not want to implement all features enabled by this configuration. Each section describes what features are enabled by that configuration and whether it potentially results in additional cost. This information will help you assess whether to perform each step of the configuration. For detailed pricing information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

A general description of each feature enabled by this configuration is provided in the [overview for the scenario](monitor-virtual-machine.md). That article also includes links to content that provides a detailed description of each feature to further help you assess your requirements.


## Prerequisites

### Create a Log Analytics workspace
You require at least one Log Analytics workspace to collect telemetry from the Azure Monitor agent. There's no cost for the workspace, but you do incur ingestion and retention costs when you collect data. For more information, see [Azure Monitor Logs pricing details](../logs/cost-logs.md).

Many environments use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by [Microsoft Defender for Cloud and Microsoft Sentinel](monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. If you're getting started with Azure Monitor, start with a single workspace and consider creating more workspaces as your requirements evolve. [VM insights]() will create a default workspace which you can use to get started quickly.

For complete details on logic that you should consider for designing a workspace configuration, see [Design a Log Analytics workspace configuration](../logs/workspace-design.md).

### Workspace permissions
The access mode of the workspace defines which users can access different sets of data. For details on how to define your access mode and configure permissions, see [Manage access to log data and workspaces in Azure Monitor](../logs/manage-access.md). If you're just getting started with Azure Monitor, consider accepting the defaults when you create your workspace and configure its permissions later.

## Multihoming agents
Multihoming refers to a virtual machine that connects to multiple workspaces. There's typically little reason to multihome agents for Azure Monitor alone. Having an agent send data to multiple workspaces most likely creates duplicate data in each workspace, which increases your overall cost. You can combine data from multiple workspaces by using [cross-workspace queries](../logs/cross-workspace-query.md) and [workbooks](../visualizations/../visualize/workbooks-overview.md).

One reason you might consider multihoming, though, is if you have an environment with Microsoft Defender for Cloud or Microsoft Sentinel stored in a workspace that's separate from Azure Monitor. A machine being monitored by each service needs to send data to each workspace. 

## Prepare hybrid machines
A hybrid machine is any machine not running in Azure. It's a virtual machine running in another cloud or hosted provider or a virtual or physical machine running on-premises in your datacenter. Use [Azure Arc-enabled servers](../../azure-arc/servers/overview.md) on hybrid machines so you can manage them similarly to your Azure virtual machines. You can use VM insights in Azure Monitor to use the same process to enable monitoring for Azure Arc-enabled servers as you do for Azure virtual machines. For a complete guide on preparing your hybrid machines for Azure, see [Plan and deploy Azure Arc-enabled servers](../../azure-arc/servers/plan-at-scale-deployment.md). This task includes enabling individual machines and using [Azure Policy](../../governance/policy/overview.md) to enable your entire hybrid environment at scale.

There's no additional cost for Azure Arc-enabled servers, but there might be some cost for different options that you enable. For details, see [Azure Arc pricing](https://azure.microsoft.com/pricing/details/azure-arc/). There is a cost for the data collected in the workspace after your hybrid machines are onboarded, but this is the same as for an Azure virtual machine.

### Network requirements
The Azure Monitor agent for both Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443. The Dependency agent uses the Azure Monitor agent for all communication, so it doesn't require any another ports. For details on how to configure your firewall and proxy, see [Network requirements](../agents/log-analytics-agent.md#network-requirements).

:::image type="content" source="media/monitor-virtual-machines/network-diagram.png" alt-text="Diagram that shows the network." lightbox="media/monitor-virtual-machines/network-diagram.png":::

### Gateway
With the Log Analytics gateway, you can channel communications from your on-premises machines through a single gateway. You can't use the Azure Arc-enabled server agents with the Log Analytics gateway though. If your security policy requires a gateway, you'll need to manually install the agents for your on-premises machines. For details on how to configure and use the Log Analytics gateway, see [Log Analytics gateway](../agents/gateway.md).

### Azure Private Link
By using Azure Private Link, you can create a private endpoint for your Log Analytics workspace. After it's configured, any connections to the workspace must be made through this private endpoint. Private Link works by using DNS overrides, so there's no configuration requirement on individual agents. For details on Private Link, see [Use Azure Private Link to securely connect networks to Azure Monitor](../logs/private-link-security.md). For specific guidance on configuring private link for you virtual machines, see [Enable network isolation for the Azure Monitor agent](../agents/azure-monitor-agent-data-collection-endpoint.md).
### Machines that can't use Azure Arc-enabled servers
If you have any hybrid machines that match the following criteria, they won't be able to use Azure Arc-enabled servers:

- The operating system of the machine isn't supported by the server agents enabled by Azure Arc. For more information, see [Supported operating systems](../../azure-arc/servers/prerequisites.md#supported-operating-systems).
- Your security policy doesn't allow machines to connect directly to Azure. The Azure Monitor agent can use the [Log Analytics gateway](../agents/gateway.md) whether or not Azure Arc-enabled servers are installed. The server agents enabled by Azure Arc though must connect directly to Azure.

You still can monitor these machines with Azure Monitor, but you need to manually install their agents. To manually install the Log Analytics agent and Dependency agent on those hybrid machines, see [Enable VM insights for a hybrid virtual machine](vminsights-enable-hybrid.md).

> [!NOTE]
> The private endpoint for Azure Arc-enabled servers is currently in public preview. The endpoint allows your hybrid machines to securely connect to Azure by using a private IP address from your virtual network.

## Deploy Azure Monitor agent
There are multiple methods for deploying the Azure Monitor agent to your virtual machines depending on whether you use the [agent extension](../agents/azure-monitor-agent-manage.md) or the [client installer](../agents/azure-monitor-agent-windows-client.md). The client installer is only required for machines outside of Azure that don't use Azure Arc. For different options deploying the agent on a single machine or as part of a script, see [Manage Azure Monitor Agent](../agents/azure-monitor-agent-manage?tabs=azure-portal.md#install).


### VM insights
VM insights provides simplified onboarding of agents in the Azure portal. With a single click for a particular machine, it installs the Azure Monitor agent, connects to a workspace, and starts collecting performance data. You can optionally have it install the dependency agent and collect processes and dependency data to enable the map feature of VM insights. The dependency agent uses the Azure Monitor agent to deliver the data that it collects, so there are no additional network or firewall considerations.

There's no direct cost for VM insights, but there is a cost for the ingestion and retention of data collected in the Log Analytics workspace.

You can enable VM insights on individual machines by using the same methods for Azure virtual machines and Azure Arc-enabled servers. These methods include onboarding individual machines with the Azure portal or Azure Resource Manager templates or enabling machines at scale by using Azure Policy. For different options to enable VM insights for your machines, see [Enable VM insights overview](vminsights-enable-overview.md). To create a policy that automatically enables VM insights on any new machines as they're created, see [Enable VM insights by using Azure Policy](vminsights-enable-policy.md).

> [!NOTE]
> VM insights gives you an option to install either the Azure Monitor agent or Log Analytics agent, but the Azure Monitor agent is recommended. It only installs the Dependency agent if you choose to enable the Map feature.
### Azure Policy
If you have a significant number of virtual machines, you should deploy the agent using Azure Policy as described in [Use Azure Policy](../agents/azure-monitor-agent-manage?tabs=azure-portal.md#use-azure-policy). This will ensure that the agent is automatically added to existing virtual machines and any new ones that you deploy.



## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines](monitor-virtual-machine-workloads.md)

