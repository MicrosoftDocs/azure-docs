---
title: Monitor Azure virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/05/2020

---

# Monitoring Azure virtual machines with Azure Monitor - Onboard
This article describes how to configure virtual machine monitoring in Azure Monitor. 

## Configuration overview
The following table lists the steps that must be performed for this configuration. 



| Step | Description |
|:---|:---|
| No configuration | Activity log and platform metrics for the Azure virtual machine hosts are automatically collected with no configuration. You can view the Activity log in the Azure portal and use Metrics explorer to analyze host metrics. |
| Create and prepare Log Analytics workspace | Create a Log Analytics workspace and configure it for VM insights. You can also use an existing Log Analytics workspace or create multiple workspaces depending on your particular requirements. |


| Step | Description |
|:---|:---|
| Prepare hybrid machines| |
| [Enable VM insights](#enable-vm-insights) | - Log Analytics agent installed.<br>- Dependency agent installed.<br>- Guest performance data sent to Logs.<br>- Process and dependency details sent to Logs | - Performance charts and workbooks for guest performance data<br>- Log queries for guest performance data<br>- Dependency map |

| Configuration step | Description |
|:---|:---|
| [Configure additional data collection](#configure-log-analytics-workspace) | - Events collected from guest. | - Log queries for guest events.<br>- Log alerts for guest events. |
| [Create diagnostic setting for virtual machine](#collect-platform-metrics-and-activity-log) | - Platform metrics collected to Logs.<br>- Activity log collected to Logs. | - Log queries for host metrics.<br>- Log alerts for host metrics.<br>- Log queries for Activity log.


### Optional

| Configuration step | Actions completed | Features enabled |
|:---|:---|:---|
| [Install the diagnostics extension and telegraf agent](#enable-diagnostics-extension-and-telegraf-agent) | - Guest performance data collected to Metrics. | - Metrics explorer for guest.<br>- Metrics alerts for guest.  |

## Network requirements

See [Log Analytics gateway] for details on configuring and using the Log Analytics gateway.
See [Use Azure Private Link to securely connect networks to Azure Monitor](private-link-security.md) for details on private link.

## Create and prepare Log Analytics workspace
At least one Log Analytics workspace is required to support VM insights and to collect telemetry from the Log Analytics agent. You can use an existing workspace or create a new one. A typical strategy is to start with a single workspace supporting all of your virtual machines and create additional workspaces as required. Criteria to consider for creating multiple workspaces include the following:

- Segregation of availability and performance telemetry from security data. This would use a separate workspace for Azure Monitor and Azure Security Center or Azure Sentinel.
- Separate data sovereignty. Each workspace resides in a particular region. You may require data from different machines.
- Data ownership. The boundaries of data ownership, for example by subsidiaries or affiliated companies, are better delineated using separate workspaces.

See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for further details on logic for creating multiple workspaces.

### Multihoming agents
Multihoming refers to a virtual machine that connects to multiple workspaces. There typically is little reason to multihome agents for Azure Monitor alone. Having an agent send data to multiple workspaces will most likely create duplicate data in each workspace, increasing your overall cost. If you need to provide access to the data for a particular machine across workspaces, you can leverage [cross workspace queries]() and [workbooks](../visualize/workbooks-overview.md).

One reason for multihoming is an environment with Azure Security Center or Azure Sentinel stored in a separate workspace than Azure Monitor. A machine being monitored by each service would need to send data to each workspace. The Windows agent can send to up to four workspaces, so that’s not a problem. The Linux agent though can only send to a single workspace. So that would mean that if you wanted to use both Azure Monitor and Azure Security Center or Azure Sentinel with a single Linux VM, the services would need to share the same workspace.


### Prepare the workspace for VM insights
You must prepare each workspace for VM insights. This only needs to be performed once for each workspace and installs required solutions that support data collection. 

Enable VM insights from the **Insights** option in the virtual machine menu of the Azure portal. See [Enable VM insights overview](vminsights-enable-overview.md) for details and other configuration methods including Resource Manager templates.


## Collect Activity log
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Send this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. There is no ingestion or retention cost for the Activity log.

See [Create diagnostic settings](../essentials/diagnostic-settings.md) for details on creating a diagnostic setting to send the Activity log to your Log Analytics workspace.

## Prepare hybrid machines
A hybrid machine is a virtual machine running in another cloud or a virtual or physical machine running on-premises in your data center. The recommended configuration for hybrid machines is to use Azure Arc which will allow you to manage the machine similar to Azure virtual machines, including enabling the machine for VM insights. If you can't use Azure Arc,then you must manually install the agents on your hybrid machines. Reasons that you may not be able to use Azure Arc include the following:

- The operating system of the machine is not supported by Azure Arc enabled servers agent. See [Supported operating systems](../azure-arc/servers/agent-overview.md#prerequisites).
- Your security policy does not allow machines to connect directly to Azure. The Log Analytics agent can use the [Log Analytics gateway](../agents/gateway.md) whether or not Azure Arc is installed. The Azure Arc agent though must connect directly to Azure.

See [Plan and deploy Arc enabled servers](../../azure-arc/servers/plan-at-scale-deployment.md#phase-2-deploy-arc-enabled-servers) for details on installing the Connected Machine agent. For machines that can't use Azure Arc, see the next section for information on manually installing their agents.

## Onboard machines to VM insights
When you enable VM insights on a machine, it installs the Log Analytics agent and Dependency agent, connects it to a workspace, and starts collecting performance data. You can enable VM insights on individual machines using the Azure portal, Resource Manager templates, or Azure Policy for the following. 

- Azure virtual machines
- Hybrid machines with Azure Arc agent installed

See [Enable VM insights overview](vminsights-enable-overview.md) for different options to enable VM insights for your machines. See [Enable VM insights by using Azure Policy](vminsights-enable-policy.md) to create a policy that will automatically enable VM insights on any new machines as they're created.

See [Enable VM insights for a hybrid virtual machine](vminsights-enable-hybrid.md) to manually install the Log Analytics agent and Dependency agent on those hybrid machines that can't use Azure Arc. 

## Collect platform metrics
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Collect this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. This collection is configured with a [diagnostic setting](../essentials/diagnostic-settings.md). Collect the Activity log with a [diagnostic setting for the subscription](../essentials/diagnostic-settings.md#create-in-azure-portal).

Collect platform metrics with a diagnostic setting for the virtual machine. Unlike other Azure resources, you cannot create a diagnostic setting for a virtual machine in the Azure portal but must use [another method](../essentials/diagnostic-settings.md#create-using-powershell). The following examples show how to collect metrics for a virtual machine using both PowerShell and CLI.

```powershell
Set-AzDiagnosticSetting -Name vm-diagnostics -ResourceId "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm" -Enabled $true -MetricCategory AllMetrics -workspaceId "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
```

```azurecli
az monitor diagnostic-settings create \
--name VM-Diagnostics 
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm \
--metrics '[{"category": "AllMetrics","enabled": true}]' \
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace
```

## Configure additional data collection
VM insights collects only performance data from the guest operating system of enabled machines. You can enable the collection of additional performance data, events, and other monitoring data from the agent by configuring the Log Analytics workspace. It only needs to be configured once, since any agent connecting to the workspace will automatically download the configuration and immediately start collecting the defined data. 

> [!NOTE]
> You cannot selectively configure data collection for different machines. All machines connected to the workspace will use the configuration for that workspace.

> [!NOTE]
> You can configure performance counters to be collected from the workspace configuration, but this may be redundant with the performance counters collected by VM insights. VM insights collects the most common set of counters at a frequency of once per minute. Only configure performance counters to be collected by the workspace if you want to collect counters not already collected by VM insights or if you have existing queries using performance data.

> [!IMPORTANT]
> Be careful about only collecting the data that you require since there are costs associated with any data collected in your workspace. The data that you collect should only support particular analysis and alerting scenarios 

See [Agent data sources in Azure Monitor](../agents/agent-data-sources.md) for a list of the data sources available and details on configuring them. 


## Enable change tracking solution (optional)
The Change Tracking solution in Azure Automation is required to alert when a Windows service or Linux daemon on your virtual machine stops.

To enable the Change Tracking solution, you must [Create an Azure Automation account](../../automation/automation-quickstart-create-account.md).

See [Enable Change Tracking and Inventory](../../automation/change-tracking/overview.md#enable-change-tracking-and-inventory) for different options to enable the Change Tracking solution on your virtual machines. This includes methods to configure virtual machines at scale.


## Send performance data to Metrics (optional)
VM insights is based on the Log Analytics agent that sends data to a Log Analytics workspace. This supports multiple features of Azure Monitor such as [log queries](../logs/log-query-overview.md), [log alerts](../alerts/alerts-log.md), and [workbooks](../visualize/workbooks-overview.md). The [diagnostics extension](../agents/diagnostics-extension-overview.md) collects performance data from the guest operating system of Windows virtual machines to Azure Storage and optionally sends performance data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md). For Linux virtual machines, the [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) is required to send data to Azure Metrics.  This enables other features of Azure Monitor such as [metrics explorer](../essentials/metrics-getting-started.md) and [metrics alerts](../alerts/alerts-metric.md). You can also configure the diagnostics extension to send events and performance data outside of Azure Monitor using Azure Event Hubs.

Install the diagnostics extension for a single Windows virtual machine in the Azure portal from the **Diagnostics setting** option in the VM menu. Select the option to enable **Azure Monitor** in the **Sinks** tab. To enable the extension from a template or command line for multiple virtual machines, see [Installation and configuration](../agents/diagnostics-extension-overview.md#installation-and-configuration). Unlike the Log Analytics agent, the data to collect is defined in the configuration for the extension on each virtual machine.

![Diagnostic setting](media/monitor-vm-azure/diagnostic-setting.png)

See [Install and configure Telegraf](../essentials/collect-custom-metrics-linux-telegraf.md#install-and-configure-telegraf) for details on configuring the Telegraf agents on Linux virtual machines. The **Diagnostic setting** menu option is available for Linux, but it will only allow you to send data to Azure storage.




## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)