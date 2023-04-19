---
title: 'Monitor virtual machines with Azure Monitor: Deploy agent'
description: Learn how to deploy the Azure Monitor agent to your virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with an Azure Monitor guide.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/05/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Deploy agent
This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to deploy the Azure Monitor agent to your Azure and hybrid virtual machines in Azure Monitor.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).

Any monitoring tool like Azure Monitor, requires an agent installed on a machine to collect data from its guest operating system. Azure Monitor uses the [Azure Monitor agent](../agents/agents-overview.md), which supports virtual machines in Azure, other cloud environments, and on-premises. 

## Prerequisites
### Create a Log Analytics workspace
You don't need a Log Analytics workspace to deploy the Azure Monitor agent, but you will need one to collect the data that it sends. There's no cost for the workspace, but you do incur ingestion and retention costs when you collect data. 

Many environments use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by [Microsoft Defender for Cloud and Microsoft Sentinel](monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. If you're getting started with Azure Monitor, start with a single workspace and consider creating more workspaces as your requirements evolve. [VM insights]() will create a default workspace which you can use to get started quickly.

For complete details on logic that you should consider for designing a workspace configuration, see [Design a Log Analytics workspace configuration](../logs/workspace-design.md).

### Workspace permissions
The access mode of the workspace defines which users can access different sets of data. For details on how to define your access mode and configure permissions, see [Manage access to log data and workspaces in Azure Monitor](../logs/manage-access.md). If you're just getting started with Azure Monitor, consider accepting the defaults when you create your workspace and configure its permissions later.

> [!TIP]
> Multihoming refers to a virtual machine that connects to multiple workspaces. There's typically little reason to multihome agents for Azure Monitor alone. Having an agent send data to multiple workspaces most likely creates duplicate data in each workspace, which increases your overall cost. You can combine data from multiple workspaces by using [cross-workspace queries](../logs/cross-workspace-query.md) and [workbooks](../visualizations/../visualize/workbooks-overview.md). One reason you might consider multihoming is if you have an environment with Microsoft Defender for Cloud or Microsoft Sentinel stored in a workspace that's separate from Azure Monitor. A machine being monitored by each service needs to send data to each workspace. 

## Prepare hybrid machines
A hybrid machine is any machine not running in Azure. It's a virtual machine running in another cloud or hosted provider or a virtual or physical machine running on-premises in your datacenter. Use [Azure Arc-enabled servers](../../azure-arc/servers/overview.md) on hybrid machines so you can manage them similarly to your Azure virtual machines. You can use VM insights in Azure Monitor to use the same process to enable monitoring for Azure Arc-enabled servers as you do for Azure virtual machines. For a complete guide on preparing your hybrid machines for Azure, see [Plan and deploy Azure Arc-enabled servers](../../azure-arc/servers/plan-at-scale-deployment.md). This task includes enabling individual machines and using [Azure Policy](../../governance/policy/overview.md) to enable your entire hybrid environment at scale.

There's no additional cost for Azure Arc-enabled servers, but there might be some cost for different options that you enable. For details, see [Azure Arc pricing](https://azure.microsoft.com/pricing/details/azure-arc/). There is a cost for the data collected in the workspace after your hybrid machines are onboarded, but this is the same as for an Azure virtual machine.

### Network requirements
The Azure Monitor agent for both Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443. The Dependency agent uses the Azure Monitor agent for all communication, so it doesn't require any another ports. For details on how to configure your firewall and proxy, see [Network requirements](../agents/azure-monitor-agent-data-collection-endpoint.md).

There are three different options for connect your hybrid virtual machines to Azure Monitor:

- **Public internet**. If your hybrid servers are allowed to communicate with the public internet, then they can connect to a global Azure Monitor endpoint. This is the simplest configuration but also the least secure. 
 
- **Log Analytics gateway**. With the Log Analytics gateway, you can channel communications from your on-premises machines through a single gateway. Azure Arc doesn't use the gateway, but its Connected Machine agent is required to install Azure Monitor agent. For details on how to configure and use the Log Analytics gateway, see [Log Analytics gateway](../agents/gateway.md).

- **Azure Private Link**. By using Azure Private Link, you can create a private endpoint for your Log Analytics workspace. After it's configured, any connections to the workspace must be made through this private endpoint. Private Link works by using DNS overrides, so there's no configuration requirement on individual agents. For details on Private Link, see [Use Azure Private Link to securely connect networks to Azure Monitor](../logs/private-link-security.md). For specific guidance on configuring private link for your virtual machines, see [Enable network isolation for the Azure Monitor agent](../agents/azure-monitor-agent-data-collection-endpoint.md).


:::image type="content" source="media/monitor-virtual-machines/network-diagram.png" alt-text="Diagram that shows the network." lightbox="media/monitor-virtual-machines/network-diagram.png":::

## Agent deployment options
The Azure Monitor agent is implemented as a [virtual machine extension](../../virtual-machines/extensions/overview.md), so you can install it using a variety of standard methods including PowerShell, CLI, and Resource Manager templates. See [Manage Azure Monitor Agent](../agents/azure-monitor-agent-manage.md) for details on each. Other notable methods for installation are described below.

| Method | Scenarios | Details |
|:---|:---|:---|
| Azure Policy | Production deployment at scale | If you have a significant number of virtual machines, you should deploy the agent using Azure Policy as described in [Manage Azure Monitor Agent](../agents/azure-monitor-agent-manage.md?tabs=azure-portal#use-azure-policy) or [Enable VM insights by using Azure Policy](vminsights-enable-policy.md). This will ensure that the agent is automatically added to existing virtual machines and any new ones that you deploy. |
| Data collection rule in Azure portal | Testing and simple deployments | When you create a data collection rule in the Azure portal as described in [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md), you have the option of specifying virtual machines to receive it. The Azure Monitor agent will be automatically installed on any machines that don't already have it. |
| VM insights in Azure portal | Testing and simple deployments with preconfigured monitoring | VM insights provides [simplified onboarding of agents in the Azure portal](vminsights-enable-portal.md). With a single click for a particular machine, it installs the Azure Monitor agent, connects to a workspace, and starts collecting performance data. You can optionally have it install the dependency agent and collect processes and dependency data to enable the map feature of VM insights. |
| Windows client installer | Client machines | Use the [Windows client installer](../agents/azure-monitor-agent-windows-client.md) to install the agent on Windows clients such as Windows 11. For different options deploying the agent on a single machine or as part of a script, see [Manage Azure Monitor Agent](../agents/azure-monitor-agent-manage.md?tabs=azure-portal#install). |


## Legacy agents
The Azure Monitor agent replaces legacy agents that are still available but should only be used if you require particular functionality not yet available with Azure Monitor agent. Most users will be able to use Azure Monitor without the legacy agents.

The legacy agents include the following:

- [Log Analytics agent](../agents/log-analytics-agent.md): Supports virtual machines in Azure, other cloud environments, and on-premises. Sends data to Azure Monitor Logs. This agent is the same agent used for System Center Operations Manager.
- [Azure Diagnostic extension](../agents/diagnostics-extension-overview.md): Supports Azure Monitor virtual machines only. Sends data to Azure Monitor Metrics, Azure Event Hubs, and Azure Storage.

See [Supported services and features](../agents/agents-overview.md#supported-services-and-features) for the current features supported by Azure Monitor agent. See [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for details on migrating to the Azure Monitor agent if you already have the Log Analytics agent deployed.

## Next steps

* [Configure data collection for machines with the Azure Monitor agent](monitor-virtual-machine-data-collection.md).
