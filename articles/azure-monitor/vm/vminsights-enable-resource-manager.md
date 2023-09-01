---
title: Enable VM insights using Resource Manager templates
description: This article describes how you enable VM insights for one or more Azure virtual machines or Virtual Machine Scale Sets by using Azure PowerShell or Azure Resource Manager templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template, devx-track-azurepowershell
author: guywi-ms
ms.author: guywild
ms.date: 06/08/2022
---

# Enable VM insights using Resource Manager templates
This article describes how to enable VM insights for a virtual machine or Virtual Machine Scale Set using Resource Manager templates. This procedure can be used for:

- Azure virtual machines
- Azure Virtual Machine Scale Sets
- Hybrid virtual machines connected with Azure Arc

## Prerequisites

- [Log Analytics workspace](./vminsights-configure-workspace.md).
- To enable VM insights for Log Analytics agent, [configure your Log Analytics workspace for VM insights](../vm/vminsights-configure-workspace.md). This prerequisite isn't relevant if you're using Azure Monitor Agent.  
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or Virtual Machine Scale Set you're enabling is supported. 
- See [Manage the Azure Monitor agent](../agents/azure-monitor-agent-manage.md#prerequisites) for prerequisites related to Azure Monitor agent.

## Resource Manager templates
Azure Resource Manager templates are available for download that onboard virtual machines and Virtual Machine Scale Sets. A different set of templates is used for Azure Monitor agent and Log Analytics agent. The templates install the required agents and perform the configuration required to onboard to machine to VM insights.


If you aren't familiar how to deploy a Resource Manager template, see [Deploy templates](#deploy-templates) for different options.

>[!NOTE]
>The template needs to be deployed in the same resource group as the virtual machine or virtual machine scale set being enabled.

## Azure Monitor agent
Download the [Azure Monitor agent templates](https://github.com/Azure/AzureMonitorForVMs-ArmTemplates/releases/download/vmi_ama_ga/DeployDcr.zip). You must first install the data collection rule and can then install agents to use that DCR. 

###  Deploy data collection rule
You only need to perform this step once. This will install the DCR that's used by each agent. The DCR will be created in the same resource group as the workspace with a name in the format "MSVMI-{WorkspaceName}".

Use on of the following sets of template and parameter files folders depending on your requirements:

| Folder | File | Description |
|:---|:---|
| DeployDcr\\<br>PerfAndMapDcr | DeployDcrTemplate<br>DeployDcrParameters | Enable both Performance and Map experience of VM Insights. |
| DeployDcr\\<br>PerfOnlyDcr | DeployDcrTemplate<br>DeployDcrParameters | Enable only Performance experience of VM Insights. |


### Deploy agents to machines
Once the data collection rule has been created, deploy the agents using one of the templates in the following table. You specify the resource ID of the DCR that you created in the first step in the parameters file. Each of the templates requires that the virtual machine or Virtual Machine Scale Set is already created.

| Folder | File | Description |
|:---|:---|
| ExistingVmOnboarding\\<br>PerfAndMapOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmOnboardingParameters.json  | Enable both Performance and Map experience for virtual machine. Use with PerfAndMapDcr. |
| ExistingVmOnboarding\\<br>PerfOnlyOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmOnboardingParameters.json  | Enable only Performance experience for virtual machine. Use with PerfOnlyDCR. |
| ExistingVmssOnboarding\\<br>PerfAndMapOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmssOnboardingParameters.json  | Enable both Performance and Map experience for Virtual Machine Scale Set. Use with PerfAndMapDcr. |
| ExistingVmssOnboarding\\<br>PerfOnlyOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmssOnboardingParameters.json  | Enable only Performance experience for Virtual Machine Scale Set. Use with PerfOnlyDCR. |

> [!NOTE]
> If your virtual machines scale sets have an upgrade policy set to manual, VM insights will not be enabled for instances by default after installing the template. You must manually upgrade the instances.

## Log Analytics agent
Download the [Logs Analytics agent templates](https://aka.ms/VmInsightsARMTemplates). You must first configure the workspace and can then install agents to use that DCR.

### Configure workspace
You only need to perform this step once for each workspace that will use VM insights.


| Folder | File | Description |
|:---|:---|
| ConfigureWorkspace | ConfigureWorkspaceTemplate.json<br>ConfigureWorkspaceParameters | Install *VMInsights* solution required for the workspace. |

### Deploy agents to machines
Once the workspace has been configured, deploy the agents using one of the templates in the following table. Templates are available that apply to an existing machine or create a new machine enabled for VM insights.


| Folder | File | Description |
|:---|:---|
| NewVmOnboarding | NewVmOnboardingTemplate.json<br>NewVmOnboardingParameters.json | Creates a virtual machine and enables it to be monitored with VM insights. |
| ExistingVmOnboarding | ExistingVmOnboarding.json<br>ExistingVmOnboarding.json | Enables VM insights on existing virtual machine. |
| NewVmssOnboarding | NewVmssOnboarding.json<br>NewVmssOnboarding.json | Creates a Virtual Machine Scale Set and enables it to be monitored with VM insights. |
| ExistingVmssOnboarding | ExistingVmssOnboarding.json<br>ExistingVmssOnboarding.json | Enables VM insights on existing Virtual Machine Scale Set. |
| ExistingArcVmOnboarding | ExistingArcVmOnboarding.json<br>ExistingArcVmOnboarding.json | Enables VM insights on existing Arc-enabled server. |


## Deploy templates
The templates can be deployed using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md) including the following examples using PowerShell and CLI.

```powershell
New-AzResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <ResourceGroupName> -TemplateFile <Template.json> -TemplateParameterFile <Parameters.json>
```


```azurecli
az deployment group create --resource-group <ResourceGroupName> --template-file <Template.json> --parameters <Parameters.json>
```

## To deploy a Resource Manager template
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
