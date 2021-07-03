---
title: Monitor virtual machines with Azure Monitor - Configure monitoring
description: Describes how to configure virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with Azure Monitor scenario.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021

---

# Monitor virtual machines with Azure Monitor - Configure monitoring
This article is part of the [Monitoring virtual machines and their workloads in Azure Monitor scenario](monitor-virtual-machine.md). It describes how to configure monitoring of your Azure and hybrid virtual machines in Azure Monitor. 

These are the most common Azure Monitor features to monitor the virtual machine host and its guest operating system. Depending on your particular environment and business requirements, you may not want to implement all features enabled by this configuration. Each section will describe what features are enabled by that configuration and whether it will potentially result in additional cost. This will help you to assess whether to perform each step of the configuration. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.

A general description of each feature enabled by this configuration is provided in the [overview for scenario](monitor-virtual-machine.md). That article also includes links to content providing a detailed description of each feature to further help you assess your requirements.


> [!NOTE]
> The features enabled by the configuration support monitoring workloads running on your virtual machine, but you'll typically require additional configuration depending your particular workloads. See [Workload monitoring](monitor-virtual-machine-workloads.md) for details on this additional configuration.

## Configuration overview
The following table lists the steps that must be performed for this configuration. Each one links to the section with the detailed description of that configuration step.

| Step | Description |
|:---|:---|
| [No configuration](#no-configuration) | Activity log and platform metrics for the Azure virtual machine hosts are automatically collected with no configuration.  |
| [Create and prepare Log Analytics workspace](#create-and-prepare-log-analytics-workspace) | Create a Log Analytics workspace and configure it for VM insights. Depending on your particular requirements, you may configure multiple workspaces. |
| [Send Activity log to Log Analytics workspace](#send-activity-log-to-log-analytics-workspace) | Send the Activity log to the workspace to analyze it with other log data. |
| [Prepare hybrid machines](#prepare-hybrid-machines) | Hybrid machines either need the Arc-enabled servers agent installed so they can be managed like Azure virtual machines or have their agents installed manually. |
| [Enable VM insights on machines](#enable-vm-insights-on-machines) | Onboard machines to VM insights, which deploys required agents and begins collecting data from guest operating system. |
| [Send guest performance data to Metrics](#send-guest-performance-data-to-metrics) |Install the Azure Monitor agent to send performance data to Azure Monitor Metrics. |



## No configuration
Azure Monitor provides a basic level of monitoring for Azure virtual machines at no cost and with no configuration. Platform metrics for Azure virtual machines include important metrics such as CPU, network, and disk utilization and can be viewed on the [Overview page](monitor-virtual-machine-analyze.md#single-machine-experience) for the machine in the Azure portal. The Activity log is also collected automatically and includes the recent activity of the machine such as any configuration changers and when it's been stopped and started. 

## Create and prepare Log Analytics workspace
You require at least one Log Analytics workspace to support VM insights and to collect telemetry from the Log Analytics agent. There is no cost for the workspace, but you do incur ingestion and retention costs when you collect data. See [Manage usage and costs with Azure Monitor Logs](../logs/manage-cost-storage.md) for details.

Many environments will use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by [Azure Security Center and Azure Sentinel](monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. If you're just getting started with Azure Monitor, then start with a single workspace and consider creating additional workspaces as your requirements evolve.

See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for complete details on logic that you should consider for designing a workspace configuration.

### Multihoming agents
Multihoming refers to a virtual machine that connects to multiple workspaces. There typically is little reason to multihome agents for Azure Monitor alone. Having an agent send data to multiple workspaces will most likely create duplicate data in each workspace, increasing your overall cost. You can combine data from multiple workspaces using [cross workspace queries](../logs/cross-workspace-query.md) and [workbooks](../visualizations/../visualize/workbooks-overview.md).

One reason you may consider multihoming though is an environment with Azure Security Center or Azure Sentinel stored in a separate workspace than Azure Monitor. A machine being monitored by each service would need to send data to each workspace. The Windows agent supports this scenario since it can send to up to four workspaces. The Linux agent though can currently only send to a single workspace. If you want to use have Azure Monitor and Azure Security Center or Azure Sentinel monitor a common set of Linux machines, then the services would need to share the same workspace.

Another other reason you may multihome your agents is in a [hybrid monitoring model](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) where you use Azure Monitor and Operations Manager together to monitor the same machines. The Log Analytics agent and the Microsoft Management Agent for Operations Manager are the same agent, just sometimes referred to with different names.

### Workspace permissions
The access mode of the workspace defines which users are able to access different sets of data. See [Manage access to log data and workspaces in Azure Monitor](../logs/manage-access.md) for details on defining your access mode and configuring permissions. If you're just getting started with Azure Monitor, then consider accepting the defaults when you create your workspace and configure its permissions later.


### Prepare the workspace for VM insights
You must prepare each workspace for VM insights before enabling monitoring for any virtual machines. This installs required solutions that support data collection from the Log Analytics agent. This configuration only needs to be completed once for each workspace. See [Enable VM insights overview](vminsights-enable-overview.md) for details on this configuration using the Azure portal in addition to other methods.


## Send Activity log to Log Analytics workspace
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Send this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. You may have already done this when configuring monitoring for other Azure resources since there is a single Activity log for all resources in an Azure subscription.

There is no cost for  ingestion or retention of Activity log data. See [Create diagnostic settings](../essentials/diagnostic-settings.md) for details on creating a diagnostic setting to send the Activity log to your Log Analytics workspace.

### Network requirements
The Log Analytics agent for both Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443. The Dependency agent uses the Log Analytics agent for all communication, so it doesn't require any additional ports. See [Network requirements](../agents/log-analytics-agent.md#network-requirements) for details on configuring your firewall and proxy.

:::image type="content" source="media/monitor-virtual-machines/network-diagram.png" alt-text="Network diagram" lightbox="media/monitor-virtual-machines/network-diagram.png":::

### Gateway
The Log Analytics gateway allows you to channel communications from your on-premises machines through a single gateway. You can't use Azure Arc-enabled servers agent with the Log Analytics gateway though, so if your security policy requires a gateway, then you'll need to manually install the agents for your on-premises machines. See [Log Analytics gateway](../agents/gateway.md) for details on configuring and using the Log Analytics gateway.

### Azure Private link
Azure Private Link allows you to create a private endpoint for your Log Analytics workspace. Once configured, any connections to the workspace must be made through this private endpoint. Private link works using DNS overrides, so there’s no configuration requirement on individual agents. See [Use Azure Private Link to securely connect networks to Azure Monitor](../logs/private-link-security.md) for details on Azure private link.

## Prepare hybrid machines
A hybrid machine is ay machine not running in Azure. This is a virtual machine running in another cloud or hosted provide or a virtual or physical machine running on-premises in your data center. Use [Azure Arc enabled servers](../../azure-arc/servers/overview.md) on hybrid machines so you can manage them similar to your Azure virtual machines. VM insights in Azure Monitor allows you to use the same process to enable monitoring for Azure Arc enabled servers as you do for Azure virtual machines. See [Plan and deploy Arc-enabled servers](../../azure-arc/servers/plan-at-scale-deployment.md) for a complete guide on preparing your hybrid machines for Azure. This includes enabling individual machines and using [Azure Policy](../../governance/policy/overview.md) to enable your entire hybrid environment at scale.

There is no additional cost for Azure Arc-enabled servers, but there may be some cost for different options that you enable. See [Azure Arc pricing](https://azure.microsoft.com/pricing/details/azure-arc/) for details. There will be a cost for the data collected in the workspace once the hybrid machines are enabled for VM insights. 

### Machines that can't use Azure Arc-enabled servers
If you have any hybrid machines that match the following criteria, they won't be able to use Azure Arc-enabled servers. You still can monitor these machines with Azure Monitor, but you need to manually install their agents. See [Enable VM insights for a hybrid virtual machine](vminsights-enable-hybrid.md) to manually install the Log Analytics agent and Dependency agent on those hybrid machines. 

- The operating system of the machine is not supported by Azure Arc-enabled servers agent. See [Supported operating systems](../../azure-arc/servers/agent-overview.md#prerequisites).
- Your security policy does not allow machines to connect directly to Azure. The Log Analytics agent can use the [Log Analytics gateway](../agents/gateway.md) whether or not Azure Arc-enabled servers is installed. The Arc-enabled servers agent though must connect directly to Azure.

> [!NOTE]
> Private endpoint for Arc-enabled servers is currently in public preview. This allows your hybrid machines to securely connect to Azure using a private IP address from your VNet.

## Enable VM insights on machines
When you enable VM insights on a machine, it installs the Log Analytics agent and Dependency agent, connects it to a workspace, and starts collecting performance data. This allows you to start using performance views and workbooks to analyze trends for a variety of guest operating system metrics, enables the map feature of VM insights for analyzing running processes and dependencies between machines, and collects data required for you to create a variety of alert rules.

You can enable VM insights on individual machines using the same methods for Azure virtual machines and Azure Arc-enabled servers. This includes onboarding individual machines with the Azure portal or Resource Manager templates, or enabling machines at scale using Azure Policy. There is no direct cost for VM insights, but there is a cost for the ingestion and retention of data collected in the Log Analytics workspace.

See [Enable VM insights overview](vminsights-enable-overview.md) for different options to enable VM insights for your machines. See [Enable VM insights by using Azure Policy](vminsights-enable-policy.md) to create a policy that will automatically enable VM insights on any new machines as they're created.




## Send guest performance data to Metrics
The [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) will replace the Log Analytics agent when it fully supports Azure Monitor, Azure Security Center, and Azure Sentinel. Until that time, it can be installed with the Log Analytics agent to send performance data from the guest operating of machines to Azure Monitor Metrics. This allows you to evaluate this data with metrics explorer and use metric alerts.

Azure Monitor agent requires at least one Data Collection Rule (DCR) that defines which data it should collect and where it should send that data. A single DCR can be used by any machines in the same resource group.

Create a single DCR for each resource group with machines to monitor using the following data source. Be careful to not send data to Logs since this would be redundant with the data already being collected by Log Analytics agent. 

Data source type: Performance Counters
Destination: Azure Monitor Metrics

You can install Azure Monitor agent on individual machines using the same methods for Azure virtual machines and Azure Arc-enabled servers. This includes onboarding individual machines with the Azure portal or Resource Manager templates, or enabling machines at scale using Azure Policy. For hybrid machines that can't use Arc-enabled servers, you will need to install the agent manually.

See [Create rule and association in Azure portal](../agents/data-collection-rule-azure-monitor-agent.md) to create a DCR and deploy the Azure Monitor agent to one or more agents using the Azure portal. Other installation methods are described at [Install the Azure Monitor agent](../agents/azure-monitor-agent-install.md). See [Deploy Azure Monitor at scale using Azure Policy](../deploy-scale.md#azure-monitor-agent) to create a policy that will automatically deploy the agent and DCR to any new machines as they're created.


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data.](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines.](monitor-virtual-machine-workloads.md)