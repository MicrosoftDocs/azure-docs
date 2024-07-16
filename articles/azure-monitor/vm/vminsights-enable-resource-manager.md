---
title: Enable VM insights using Resource Manager templates
description: This article describes how you enable VM insights for one or more Azure virtual machines or Virtual Machine Scale Sets by using Azure PowerShell or Azure Resource Manager templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template, devx-track-azurepowershell
author: guywi-ms
ms.author: guywild
ms.date: 05/20/2024
---

# Enable VM insights using Resource Manager templates
This article describes how to enable VM insights for a virtual machine or Virtual Machine Scale Set using Resource Manager templates. This procedure can be used for:

- Azure virtual machines
- Azure Virtual Machine Scale Sets
- Hybrid virtual machines connected with Azure Arc

If you aren't familiar with how to deploy a Resource Manager template, see [Deploy templates](#deploy-templates).

## Prerequisites

- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or Virtual Machine Scale Set you're enabling is supported. 
- See [Manage the Azure Monitor agent](../agents/azure-monitor-agent-manage.md#prerequisites) for prerequisites related to Azure Monitor agent.
- To enable network isolation for Azure Monitor Agent, see [Enable network isolation for Azure Monitor Agent by using Private Link](../agents/azure-monitor-agent-private-link.md).

## Resource Manager templates
Use the Azure Resource Manager templates provided in this article to onboard virtual machines and Virtual Machine Scale Sets using Azure Monitor agent. The templates install the required agents and perform the configuration required to onboard to machine to VM insights.

>[!NOTE]
> Deploy the template in the same resource group as the virtual machine or virtual machine scale set being enabled.

## Enable VM insights using Azure Monitor Agent
First deploy the data collection rule, and then install agents to use that data collection rule. 

###  Deploy data collection rule

This step installs a data collection rule, named `MSVMI-{WorkspaceName}`, in the same resource group as your Log Analytics workspace:

1. Download the [VM insights data collection rule templates](https://github.com/Azure/AzureMonitorForVMs-ArmTemplates/releases/download/vmi_ama_ga/DeployDcr.zip).
1. [Deploy a template](#deploy-templates) from the downloaded zip file. The following table describes the templates available:

   | Folder | File | Description |
   |:---|:---|
   | DeployDcr\\<br>PerfAndMapDcr | DeployDcrTemplate<br>DeployDcrParameters | Enable both Performance and Map experience of VM Insights. |
   | DeployDcr\\<br>PerfOnlyDcr | DeployDcrTemplate<br>DeployDcrParameters | Enable only Performance experience of VM Insights. |

### Deploy agents to machines

After you create the data collection rule, deploy:

- [Azure Monitor Agent for Linux or Windows](../agents/resource-manager-agent.md#azure-monitor-agent).
- [Dependency agent for Linux](../../virtual-machines/extensions/agent-dependency-linux.md) or [Dependency agent or Windows](../../virtual-machines/extensions/agent-dependency-windows.md) if you want to enable the Map feature. 
  
> [!NOTE]
> If your virtual machines scale sets have an upgrade policy set to manual, VM insights will not be enabled for instances by default after installing the template. You must manually upgrade the instances.

## Deploy templates
Each folder in the download has a template and a parameters file. Modify the parameters file with required details such as Virtual Machine Resource ID, Workspace resource ID, data collection rule resource ID, Location, and OS Type. Don't modify the template file unless you need to customize it for your particular scenario.

### Deploy with the Azure portal
See  [Quickstart: Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal.md) for details on deploying a template from the Azure portal.

### Deploy with PowerShell
Use the following command to deploy the template with PowerShell.

```PowerShell
New-AzResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <ResourceGroupName> -TemplateFile <Template.json> -TemplateParameterFile <Parameters.json>
```

### Azure CLI
Use the following command to deploy the template with Azure CLI.

```sh
az login
az account set --subscription "Subscription Name"
az deployment group create --resource-group <ResourceGroupName> --template-file <Template.json> --parameters <Parameters.json>
```

## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with VM insights.

- To view discovered application dependencies, see [View VM insights Map](vminsights-maps.md).

- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM Performance](vminsights-performance.md).
