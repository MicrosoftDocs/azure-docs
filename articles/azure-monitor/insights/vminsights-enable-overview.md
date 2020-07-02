---
title: Enable Azure Monitor for VMs overview
description: Learn how to deploy and configure Azure Monitor for VMs. Find out the system requirements.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/25/2020

---

# Enable Azure Monitor for VMs
To use Azure Monitor for VMs, you must first enable it and then onboard your virtual machines and virtual machine scale sets. This article provides the details for enabling Azure Monitor for VMs in your Azure subscription and gives an overview of the different options available for enabling different kinds of agents.

## Overview
Azure Monitor for VMs collects its data from one or more Log Analytics workspaces in Azure Monitor. A single subscription can use any number of workspaces depending on your requirements The only requirement of the workspace is that it be located in a supported location and be configured with the *VMInsights* solution. To enable monitoring for a VM or VMSS, you use any of the available options to install the required agents and specify a workspace for them to send their data. Azure Monitor for VMs will collect data from any configured workspace in its subscription.

> [!NOTE]
> When you enabled Azure Monitor for VMs on a single VM or VMMS using the Azure portal, you're given the option to select an existing workspace or create a new one. The *VMInsights* solution will be installed in this workspace if it isn't already. You can then use this workspace for other agents.

## Create and configure Log Analytics workspace

>[!NOTE]
>The information described in this section is also applicable to the [Service Map solution](service-map.md). 

Azure Monitor for VMs requires a Log Analytics workspace to store the data it collects.You can use an existing workspace or create a new one before onboarding VMs. You also have the opportunity to create a new workspace when you onboard a single VM or VMSS using the Azure portal. You can continue to use that workspace for other agents. See [Designing your Azure Monitor Logs deployment](../platform/design-logs-deployment.md) for guidance on determining the number of workspaces you should use and how to design their access strategy.

You can create a Log Analytics workspace using any of the following methods:

* [Azure CLI](../../azure-monitor/learn/quick-create-workspace-cli.md)
* [PowerShell](../../azure-monitor/learn/quick-create-workspace-posh.md)
* [Azure portal](../../azure-monitor/learn/quick-create-workspace.md)
* [Azure Resource Manager](../../azure-monitor/platform/template-workspace-configuration.md)

Azure Monitor for VMs supports Log Analytics workspaces in the following regions, although you can monitor VMs in any region. The VMs themselves aren't limited to the regions supported by the Log Analytics workspace.

- West Central US
- West US
- West US 2
- South Central US
- East US
- East US2
- Central US
- North Central US
- US Gov Az
- US Gov Va
- Canada Central
- UK South
- North Europe
- West Europe
- East Asia
- Southeast Asia
- Central India
- Japan East
- Australia East
- Australia Southeast


## Add VMInsights solution to workspace
Before a Log Analytics workspace can be used with Azure Monitor for VMs, it must have the *VMInsights* solution installed. You can configure a workspace using any of the following methods.


### Azure portal
There are two options for configuring a workspace from the Azure portal.

Select the **Workspace configuration** tab in the **Virtual Machines** menu in the **Monitor** menu in the Azure portal. Set the filter values to display a list of existing workspaces. Select the box next to each workspace to enable and then click **Configure selected** .

![Workspace configuration](media/vminsights-enable-at-scale-policy/workspace-configuration.png)

To configure a single workspace, select the **Other onboarding options** and then **Configure a workspace**. Select a subscription and a workspace and then click **Configure**.

![Configure workspace](media/vminsights-enable-at-scale-policy/configure-workspace.png)

This same option is available by choosing **Enable using policy** and then selecting the **Configure workspace** toolbar button.  

![Enable using policy](media/vminsights-enable-at-scale-policy/enable-using-policy.png)

### Enable a single VM using the Azure portal
When you enable Azure Monitor for VMs on a single VM or VMMS using the Azure portal, you're given the option to select an existing workspace or create a new one. The *VMInsights* solution will be installed in this workspace if it isn't already. You can then use this workspace for other agents.

### Resource Manager template
The Azure Resource Manager templates for Azure Monitor for VMs are provided in an archive file (.zip) that you can [download from our GitHub repo](https://aka.ms/VmInsightsARMTemplates). This includes a template called **ConfigureWorkspace** that configures a Log Analytics workspace for Azure Monitor for VMs. You deploy this template using any of the standard methods including the sample PowerShell and CLI commands below: 

# [CLI](#tab/CLI)

```azurecli
az deployment group create --name ConfigureWorkspace --resource-group my-resource-group --template-file CreateWorkspace.json  --parameters workspaceResourceId='/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace' workspaceLocation='eastus'

```

# [PowerShell](#tab/PowerShell)

```powershell
New-AzResourceGroupDeployment -Name ConfigureWorkspace -ResourceGroupName my-resource-group -TemplateFile ConfigureWorkspace.json -workspaceResourceId /subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace -location eastus
```

---




## Agents
Azure Monitor for VMs requires two agents to be installed on each VM or VMSS to be monitored. Once these two agents are installed and attached to the appropriate workspace, they will be enabled for Azure Monitor for VMs. 



### Dependency agent
The Dependency agent collects discovered data about processes running on the virtual machine and external process dependencies, which is used by the [Map feature in Azure Monitor for VMs](vminsights-maps.md). The Dependency agent relies on the Log Analytics agent to deliver its data to Azure Monitor. 

>[!NOTE]
>The following information described in this section is also applicable to the [Service Map solution](service-map.md).  



In a hybrid environment, you can download and install the Dependency agent manually or using an automated method.

The following table describes the connected sources that the Map feature supports in a hybrid environment.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | Along with the [Log Analytics agent for Windows](../../azure-monitor/platform/log-analytics-agent.md), Windows agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| Linux agents | Yes | Along with the [Log Analytics agent for Linux](../../azure-monitor/platform/log-analytics-agent.md), Linux agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| System Center Operations Manager management group | No | |

You can download the Dependency agent from these locations:

| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.10.4.10090 | B4E1FF9C1E5CD254AA709AEF9723A81F04EC0763C327567C582CE99C0C5A0BAE  |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.10.4.10090 | A56E310D297CE3B343AE8F4A6F72980F1C3173862D6169F1C713C2CA09660A9F |




## Onboarding

Once Azure Monitor for VMs is enabled, you can use any of the f for onboarding agents to Azure Monitor for VMs include the following:

* Install the Log Analytics and agent 
* Enable a single Azure VM, Azure VMSS, or Azure Arc machine by selecting **Insights** directly from their menu in the Azure portal.
* Enable multiple Azure VMs, Azure VMSS, or Azure Arc machines by using Azure Policy. This method ensures that on existing and new VMs and scale sets, the required dependencies are installed and properly configured. Noncompliant VMs and scale sets are reported, so you can decide whether to enable them and to remediate them.
* Enable multiple Azure VMs, Azure Arc VMs, Azure VMSS, or Azure Arc machines across a specified subscription or resource group by using PowerShell.
* Enable Azure Monitor for VMs to monitor VMs or physical computers hosted in your corporate network or other cloud environment.



| Deployment state | Method | Description |
|------------------|--------|-------------|
| Single Azure VM, Azure VMSS, or Azure Arc machine | [Enable from the portal](vminsights-enable-single-vm.md) | Select **Insights** directly from the menu in the Azure portal. |
| Multiple Azure VM, Azure VMSS, or Azure Arc machine | [Enable through Azure Policy](vminsights-enable-at-scale-policy.md) | Use Azure Policy to automatically enable when a VM or VMSS is created. |
| | [Enable through Azure PowerShell or Azure Resource Manager templates](vminsights-enable-at-scale-powershell.md) | Use Azure PowerShell or Azure Resource Manager templates to enable multiple Azure VM, Azure Arc VM, or Azure VMSS across a specified subscription or resource group by . |
| Hybrid cloud | [Enable for the hybrid environment](vminsights-enable-hybrid-cloud.md) | Deploy to VMs or physical computers that are hosted in your datacenter or other cloud environments. |


## Management packs

When Azure Monitor for VMs is enabled and configured with a Log Analytics workspace, a management pack is forwarded to all the Windows computers reporting to that workspace. If you have [integrated your System Center Operations Manager management group](../../azure-monitor/platform/om-agents.md) with the Log Analytics workspace, the Service Map management pack is deployed from the management group to the Windows computers reporting to the management group.  

The management pack is named *Microsoft.IntelligencePacks.ApplicationDependencyMonitor*. Its written to `%Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs\` folder. The data source that the management pack uses is `%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll`.

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of the Azure Monitor service. Microsoft uses this data to improve the quality, security, and integrity of the service. 

To provide accurate and efficient troubleshooting capabilities, the Map feature includes data about the configuration of your software. The data provides information such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

Now that you've enabled monitoring for your VM, monitoring information is available for analysis in Azure Monitor for VMs.

## Next steps

To learn how to use the Performance monitoring feature, see [View Azure Monitor for VMs Performance](vminsights-performance.md). To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).



To set up an at-scale scenario that uses Azure Policy, Azure PowerShell, or Azure Resource Manager templates, you must install the *VMInsights* solution. You can do this with one of the following methods:

* Use [Azure PowerShell](vminsights-enable-at-scale-powershell.md#set-up-a-log-analytics-workspace).
* On the Azure Monitor for VMs [**Policy Coverage**](vminsights-enable-at-scale-policy.md#manage-policy-coverage-feature-overview) page, select **Configure Workspace**. 

Whether you enable Azure Monitor for VMs for a single Azure VM or you use the at-scale deployment method, use the Azure VM Dependency agent extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) or [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) to install the agent as part of the experience.