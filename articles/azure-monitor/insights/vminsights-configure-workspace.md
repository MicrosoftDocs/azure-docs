---
title: Configure Log Analytics workspace for Azure Monitor for VMs
description: 
ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/22/2020

---

# Configure Log Analytics workspace for Azure Monitor for VMs
Azure Monitor for VMs collects its data from one or more Log Analytics workspaces in Azure Monitor. A single subscription can use any number of workspaces depending on your requirements The only requirement of the workspace is that it be located in a supported location and be configured with the *VMInsights* solution. To enable monitoring for a VM or VMSS, you use any of the available options to install the required agents and specify a workspace for them to send their data. Azure Monitor for VMs will collect data from any configured workspace in its subscription.

> [!NOTE]
> When you enabled Azure Monitor for VMs on a single VM or VMMS using the Azure portal, you're given the option to select an existing workspace or create a new one. The *VMInsights* solution will be installed in this workspace if it isn't already. You can then use this workspace for other agents.


## Create Log Analytics workspace

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

### Enable a single VM using the Azure portal
When you enable Azure Monitor for VMs on a single VM or VMMS using the Azure portal, you're given the option to select an existing workspace or create a new one. The *VMInsights* solution will be installed in this workspace if it isn't already. You can then use this workspace for other agents.

### Azure portal
There are two options for configuring a workspace from the Azure portal.

Select the **Workspace configuration** tab in the **Virtual Machines** menu in the **Monitor** menu in the Azure portal. Set the filter values to display a list of existing workspaces. Select the box next to each workspace to enable and then click **Configure selected** .

![Workspace configuration](media/vminsights-enable-at-scale-policy/workspace-configuration.png)

To configure a single workspace, select the **Other onboarding options** and then **Configure a workspace**. Select a subscription and a workspace and then click **Configure**.

![Configure workspace](media/vminsights-enable-at-scale-policy/configure-workspace.png)

This same option is available by choosing **Enable using policy** and then selecting the **Configure workspace** toolbar button.  

![Enable using policy](media/vminsights-enable-at-scale-policy/enable-using-policy.png)


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



## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with Azure Monitor for VMs.

- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).

- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM Performance](vminsights-performance.md).
