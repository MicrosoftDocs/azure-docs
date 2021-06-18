---
title: Configure Log Analytics workspace for VM insights
description: Describes how to create and configure the Log Analytics workspace used by VM insights.
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurepowershell
author: bwren
ms.author: bwren
ms.date: 12/22/2020

---

# Configure Log Analytics workspace for VM insights
VM insights collects its data from one or more Log Analytics workspaces in Azure Monitor. Prior to onboarding agents, you must create and configure a workspace. This article describes the requirements of the workspace and to configure it for VM insights.

## Overview
A single subscription can use any number of workspaces depending on your requirements. The only requirement of the workspace is that it be located in a supported location and be configured with the *VMInsights* solution.

Once the workspace has been configured, you can use any of the available options to install the required agents on virtual machine and virtual machine scale set and specify a workspace for them to send their data. VM insights will collect data from any configured workspace in its subscription.

> [!NOTE]
> When you enable VM insights on a single virtual machine or virtual machine scale set using the Azure portal, you're given the option to select an existing workspace or create a new one. The *VMInsights* solution will be installed in this workspace if it isn't already. You can then use this workspace for other agents.


## Create Log Analytics workspace

>[!NOTE]
>The information described in this section is also applicable to the [Service Map solution](service-map.md). 

Access Log Analytics workspaces in the Azure portal from the **Log Analytics workspaces** menu.

[![Log Anlytics workspaces](media/vminsights-configure-workspace/log-analytics-workspaces.png)](media/vminsights-configure-workspace/log-analytics-workspaces.png#lightbox)

You can create a new Log Analytics workspace using any of the following methods. See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for guidance on determining the number of workspaces you should use in your environment and how to design their access strategy.


* [Azure portal](../logs/quick-create-workspace.md)
* [Azure CLI](../logs/quick-create-workspace-cli.md)
* [PowerShell](../logs/powershell-workspace-configuration.md)
* [Azure Resource Manager](../logs/resource-manager-workspace.md)

## Supported regions
VM insights supports a Log Analytics workspace in any of the [regions supported by Log Analytics](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&regions=all) except for the following:

- Germany West Central
- Korea Central

>[!NOTE]
>You can monitor Azure VMs in any region. The VMs themselves aren't limited to the regions supported by the Log Analytics workspace.

## Azure role-based access control
To enable and access the features in VM insights, you must have the [Log Analytics contributor role](../logs/manage-access.md#manage-access-using-azure-permissions) in the workspace. To view performance, health, and map data, you must have the [monitoring reader role](../roles-permissions-security.md#built-in-monitoring-roles) for the Azure VM. For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../logs/manage-access.md).

## Add VMInsights solution to workspace
Before a Log Analytics workspace can be used with VM insights, it must have the *VMInsights* solution installed. The methods for configuring the workspace are described in the following sections.

> [!NOTE]
> When you add the *VMInsights* solution to the workspace, all existing virtual machines connected to the workspace will start to send data to InsightsMetrics. Data for the other data types won't be collected until you add the Dependency Agent to those existing virtual machines connected to the workspace.

### Azure portal
There are three options for configuring an existing workspace using the Azure portal. Each is described below.

To configure a single workspace, go the **Virtual Machines** option in the **Azure Monitor** menu, select the **Other onboarding options**, and then **Configure a workspace**. Select a subscription and a workspace and then click **Configure**.

[![Configure workspace](../vm/media/vminsights-enable-policy/configure-workspace.png)](../vm/media/vminsights-enable-policy/configure-workspace.png#lightbox)

To configure multiple workspaces, select the **Workspace configuration** tab in the **Virtual Machines** menu in the **Monitor** menu in the Azure portal. Set the filter values to display a list of existing workspaces. Select the box next to each workspace to enable and then click **Configure selected**.

[![Workspace configuration](../vm/media/vminsights-enable-policy/workspace-configuration.png)](../vm/media/vminsights-enable-policy/workspace-configuration.png#lightbox)


When you enable VM insights on a single virtual machine or virtual machine scale set using the Azure portal, you're given the option to select an existing workspace or create a new one. The *VMInsights* solution will be installed in this workspace if it isn't already. You can then use this workspace for other agents.

[![Enable single VM in portal](../vm/media/vminsights-enable-portal/enable-vminsights-vm-portal.png)](../vm/media/vminsights-enable-portal/enable-vminsights-vm-portal.png#lightbox)


### Resource Manager template
The Azure Resource Manager templates for VM insights are provided in an archive file (.zip) that you can [download from our GitHub repo](https://aka.ms/VmInsightsARMTemplates). This includes a template called **ConfigureWorkspace** that configures a Log Analytics workspace for VM insights. You deploy this template using any of the standard methods including the sample PowerShell and CLI commands below: 

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
- See [Onboard agents to VM insights](vminsights-enable-overview.md) to connect agents to VM insights.
- See [Targeting monitoring solutions in Azure Monitor (Preview)](../insights/solution-targeting.md) to limit the amount of data sent from a solution to the workspace.
