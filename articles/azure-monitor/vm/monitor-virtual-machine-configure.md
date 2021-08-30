---
title: 'Monitor virtual machines with Azure Monitor: Configure monitoring'
description: Learn how to configure virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with an Azure Monitor scenario.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021

---

# Monitor virtual machines with Azure Monitor: Configure monitoring
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to configure monitoring of your Azure and hybrid virtual machines in Azure Monitor.

This article discusses the most common Azure Monitor features to monitor the virtual machine host and its guest operating system. Depending on your particular environment and business requirements, you might not want to implement all features enabled by this configuration. Each section describes what features are enabled by that configuration and whether it potentially results in additional cost. This information will help you assess whether to perform each step of the configuration. For detailed pricing information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

A general description of each feature enabled by this configuration is provided in the [overview for the scenario](monitor-virtual-machine.md). That article also includes links to content that provides a detailed description of each feature to further help you assess your requirements.

> [!NOTE]
> The features enabled by the configuration support monitoring workloads running on your virtual machine. But depending on your particular workloads, you'll typically require additional configuration. For details on this additional configuration, see [Workload monitoring](monitor-virtual-machine-workloads.md).

## Configuration overview
The following table lists the steps that must be performed for this configuration. Each one links to the section with the detailed description of that configuration step.

| Step | Description |
|:---|:---|
| [No configuration](#no-configuration) | Activity log and platform metrics for the Azure virtual machine hosts are automatically collected with no configuration. |
| [Create and prepare Log Analytics workspace](#create-and-prepare-a-log-analytics-workspace) | Create a Log Analytics workspace and configure it for VM insights. Depending on your particular requirements, you might configure multiple workspaces. |
| [Send Activity log to Log Analytics workspace](#send-an-activity-log-to-a-log-analytics-workspace) | Send the Activity log to the workspace to analyze it with other log data. |
| [Prepare hybrid machines](#prepare-hybrid-machines) | Hybrid machines either need the server agents enabled by Azure Arc installed so they can be managed like Azure virtual machines or must have their agents installed manually. |
| [Enable VM insights on machines](#enable-vm-insights-on-machines) | Onboard machines to VM insights, which deploys required agents and begins collecting data from the guest operating system. |
| [Send guest performance data to Metrics](#send-guest-performance-data-to-metrics) |Install the Azure Monitor agent to send performance data to Azure Monitor Metrics. |

## No configuration
Azure Monitor provides a basic level of monitoring for Azure virtual machines at no cost and with no configuration. Platform metrics for Azure virtual machines include important metrics such as CPU, network, and disk utilization. They can be viewed on the [Overview page](monitor-virtual-machine-analyze.md#single-machine-experience) for the machine in the Azure portal. The Activity log is also collected automatically and includes the recent activity of the machine, such as any configuration changes and when it was stopped and started.

## Create and prepare a Log Analytics workspace
You require at least one Log Analytics workspace to support VM insights and to collect telemetry from the Log Analytics agent. There's no cost for the workspace, but you do incur ingestion and retention costs when you collect data. For more information, see [Manage usage and costs with Azure Monitor Logs](../logs/manage-cost-storage.md).

Many environments use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by [Azure Security Center and Azure Sentinel](monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. If you're getting started with Azure Monitor, start with a single workspace and consider creating more workspaces as your requirements evolve.

For complete details on logic that you should consider for designing a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).

### Multihoming agents
Multihoming refers to a virtual machine that connects to multiple workspaces. Typically, there's little reason to multihome agents for Azure Monitor alone. Having an agent send data to multiple workspaces most likely creates duplicate data in each workspace, which increases your overall cost. You can combine data from multiple workspaces by using [cross-workspace queries](../logs/cross-workspace-query.md) and [workbooks](../visualizations/../visualize/workbooks-overview.md).

One reason you might consider multihoming, though, is if you have an environment with Azure Security Center or Azure Sentinel stored in a workspace that's separate from Azure Monitor. A machine being monitored by each service needs to send data to each workspace. The Windows agent supports this scenario because it can send to up to four workspaces. The Linux agent can currently send to only a single workspace. If you want to have Azure Monitor and Azure Security Center or Azure Sentinel monitor a common set of Linux machines, the services need to share the same workspace.

Another reason you might multihome your agents is if you're using a [hybrid monitoring model](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring). In this model, you use Azure Monitor and Operations Manager together to monitor the same machines. The Log Analytics agent and the Microsoft Management Agent for Operations Manager are the same agent. Sometimes they're referred to with different names.

### Workspace permissions
The access mode of the workspace defines which users can access different sets of data. For details on how to define your access mode and configure permissions, see [Manage access to log data and workspaces in Azure Monitor](../logs/manage-access.md). If you're just getting started with Azure Monitor, consider accepting the defaults when you create your workspace and configure its permissions later.

### Prepare the workspace for VM insights
Prepare each workspace for VM insights before you enable monitoring for any virtual machines. This step installs required solutions that support data collection from the Log Analytics agent. You complete this configuration only once for each workspace. For details on this configuration by using the Azure portal in addition to other methods, see [Enable VM insights overview](vminsights-enable-overview.md).

## Send an Activity log to a Log Analytics workspace
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Send this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. You might have already done this task when you configured monitoring for other Azure resources because there's a single Activity log for all resources in an Azure subscription.

There's no cost for ingestion or retention of Activity log data. For details on how to create a diagnostic setting to send the Activity log to your Log Analytics workspace, see [Create diagnostic settings](../essentials/diagnostic-settings.md).

### Network requirements
The Log Analytics agent for both Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443. The Dependency agent uses the Log Analytics agent for all communication, so it doesn't require any another ports. For details on how to configure your firewall and proxy, see [Network requirements](../agents/log-analytics-agent.md#network-requirements).

:::image type="content" source="media/monitor-virtual-machines/network-diagram.png" alt-text="Diagram that shows the network." lightbox="media/monitor-virtual-machines/network-diagram.png":::

### Gateway
With the Log Analytics gateway, you can channel communications from your on-premises machines through a single gateway. You can't use the Azure Arc–enabled server agents with the Log Analytics gateway though. If your security policy requires a gateway, you'll need to manually install the agents for your on-premises machines. For details on how to configure and use the Log Analytics gateway, see [Log Analytics gateway](../agents/gateway.md).

### Azure Private Link
By using Azure Private Link, you can create a private endpoint for your Log Analytics workspace. After it's configured, any connections to the workspace must be made through this private endpoint. Private Link works by using DNS overrides, so there's no configuration requirement on individual agents. For details on Private Link, see [Use Azure Private Link to securely connect networks to Azure Monitor](../logs/private-link-security.md).

## Prepare hybrid machines
A hybrid machine is any machine not running in Azure. It's a virtual machine running in another cloud or hosted provide or a virtual or physical machine running on-premises in your datacenter. Use [Azure Arc–enabled servers](../../azure-arc/servers/overview.md) on hybrid machines so you can manage them similarly to your Azure virtual machines. You can use VM insights in Azure Monitor to use the same process to enable monitoring for Azure Arc–enabled servers as you do for Azure virtual machines. For a complete guide on preparing your hybrid machines for Azure, see [Plan and deploy Azure Arc–enabled servers](../../azure-arc/servers/plan-at-scale-deployment.md). This task includes enabling individual machines and using [Azure Policy](../../governance/policy/overview.md) to enable your entire hybrid environment at scale.

There's no more cost for Azure Arc–enabled servers, but there might be some cost for different options that you enable. For details, see [Azure Arc pricing](https://azure.microsoft.com/pricing/details/azure-arc/). There is a cost for the data collected in the workspace after the hybrid machines are enabled for VM insights.

### Machines that can't use Azure Arc–enabled servers
If you have any hybrid machines that match the following criteria, they won't be able to use Azure Arc–enabled servers: 

- The operating system of the machine isn't supported by the server agents enabled by Azure Arc. For more information, see [Supported operating systems](../../azure-arc/servers/agent-overview.md#prerequisites).
- Your security policy doesn't allow machines to connect directly to Azure. The Log Analytics agent can use the [Log Analytics gateway](../agents/gateway.md) whether or not Azure Arc–enabled servers are installed. The server agents enabled by Azure Arc must connect directly to Azure.

You still can monitor these machines with Azure Monitor, but you need to manually install their agents. To manually install the Log Analytics agent and Dependency agent on those hybrid machines, see [Enable VM insights for a hybrid virtual machine](vminsights-enable-hybrid.md).

> [!NOTE]
> The private endpoint for Azure Arc–enabled servers is currently in public preview. The endpoint allows your hybrid machines to securely connect to Azure by using a private IP address from your virtual network.

## Enable VM insights on machines
After you enable VM insights on a machine, it installs the Log Analytics agent and Dependency agent, connects to a workspace, and starts collecting performance data. You can start using performance views and workbooks to analyze trends for a variety of guest operating system metrics, enable the map feature of VM insights for analyzing running processes and dependencies between machines, and collect the data required for you to create a variety of alert rules.

You can enable VM insights on individual machines by using the same methods for Azure virtual machines and Azure Arc–enabled servers. These methods include onboarding individual machines with the Azure portal or Azure Resource Manager templates or enabling machines at scale by using Azure Policy. There's no direct cost for VM insights, but there is a cost for the ingestion and retention of data collected in the Log Analytics workspace.

For different options to enable VM insights for your machines, see [Enable VM insights overview](vminsights-enable-overview.md). To create a policy that automatically enables VM insights on any new machines as they're created, see [Enable VM insights by using Azure Policy](vminsights-enable-policy.md).


## Send guest performance data to Metrics
The [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) replaces the Log Analytics agent when it fully supports Azure Monitor, Azure Security Center, and Azure Sentinel. Until that time, it can be installed with the Log Analytics agent to send performance data from the guest operating system of machines to Azure Monitor Metrics. This configuration allows you to evaluate this data with metrics explorer and use metric alerts.

The Azure Monitor agent requires at least one data collection rule (DCR) that defines which data it should collect and where it should send that data. A single DCR can be used by any machines in the same resource group.

Create a single DCR for each resource group with machines to monitor by using the following data source: 

- **Data source type**: Performance Counters
- **Destination**: Azure Monitor Metrics

Be careful to not send data to Logs because it would be redundant with the data already being collected by the Log Analytics agent.

You can install an Azure Monitor agent on individual machines by using the same methods for Azure virtual machines and Azure Arc–enabled servers. These methods include onboarding individual machines with the Azure portal or Resource Manager templates or enabling machines at scale by using Azure Policy. For hybrid machines that can't use Azure Arc–enabled servers, install the agent manually.

To create a DCR and deploy the Azure Monitor agent to one or more agents by using the Azure portal, see [Create rule and association in the Azure portal](../agents/data-collection-rule-azure-monitor-agent.md). Other installation methods are described at [Install the Azure Monitor agent](../agents/azure-monitor-agent-install.md). To create a policy that automatically deploys the agent and DCR to any new machines as they're created, see [Deploy Azure Monitor at scale using Azure Policy](../deploy-scale.md#azure-monitor-agent).

## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines](monitor-virtual-machine-workloads.md)