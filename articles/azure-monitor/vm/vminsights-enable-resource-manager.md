---
title: Enable VM insights using Resource Manager templates
description: This article describes how you enable VM insights for one or more Azure virtual machines or virtual machine scale sets by using Azure PowerShell or Azure Resource Manager templates.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/08/2022

---

# Enable VM insights using Resource Manager templates
This article describes how to enable VM insights for a virtual machine or virtual machine scale set using Resource Manager templates. This procedure can be used for the following:

- Azure virtual machine
- Azure virtual machine scale set
- Hybrid virtual machine connected with Azure Arc

## Prerequisites

- [Create and configure a Log Analytics workspace](./vminsights-configure-workspace.md). 
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported. 

## Resource Manager templates
Azure Resource Manager templates for onboarding virtual machines and virtual machine scale sets are available for both Azure Monitor agent and Log Analytics agent. If you aren't familiar how to deploy a Resource Manager template, see [Deploy templates](#deploy-templates) for different options.

>[!NOTE]
>The template needs to be deployed in the same resource group as the virtual machine or virtual machine scale set being enabled.

## Azure Monitor agent
Download the [Azure Monitor agent templates](https://aka.ms/vminsights/downloadAMADaVmiArmTemplates). You must first install the data collection rule and can then install agents to use that DCR.

###  Deploy data collection rule
You only need to perform this step once for each resource. This will install the DCR that's used by each agent. The DCR will be created in the same resource group as the workspace and the name will be in the format "MSVMI-{WorkspaceName}". 

Install the template **DeployDcrTemplate** with the parameter file **DeployDcrParameters** from one of the following folders depending on your requirements:

| Folder | File | Description |
|:---|:---|
| DeployDcr\PerfAndMapDcr | DeployDcrTemplate<br>DeployDcrParameters | Enable both Performance and Map experience of VM Insights. |
| DeployDcr\PerfOnlyDcr | DeployDcrTemplate<br>DeployDcrParameters | Enable only Performance experience of VM Insights. |


## Deploy agents to machines
Once the data collection rule has been created, deploy the agents using one of the templates in the following table. You specify the resource ID of the DCR that you created in the first step in the parameters file.

| Folder | File | Description |
|:---|:---|
| ExistingVmOnboarding\PerfAndMapOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmOnboardingParameters.json  | Enable both Performance and Map experience for virtual machine. Use with PerfAndMapDcr. |
| ExistingVmOnboarding\PerfOnlyOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmOnboardingParameters.json  | Enable only Performance experience for virtual machine. Use with PerfOnlyDCR. |
| ExistingVmssOnboarding\PerfAndMapOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmssOnboardingParameters.json  | Enable both Performance and Map experience for virtual machine scale set. Use with PerfAndMapDcr. |
| ExistingVmssOnboarding\PerfOnlyOnboarding | ExistingVmOnboardingTemplate.json<br>ExistingVmssOnboardingParameters.json  | Enable only Performance experience for virtual machine scale set. Use with PerfOnlyDCR. |



Install either the template **ExistingVmssOnboardingParameters** with the parameter file **DeployDcrParameters** from one of the following folders depending on your requirements:



Use one of the following templates from either the **ExistingVmOnboarding** or **ExistingVmssOnboarding** folder depending on whether you're enabling a virtual machine or virtual machine scale set:

- **PerfAndMapOnboarding**: Use with **PerfOnlyDcr** to enable both Performance and Map experience of VM Insights.
- **PerfOnlyOnboarding**: Use with **PerfOnlyDcr** to enable only Performance experience of VM Insights.

> [!NOTE]
> If Virtual Machines Scale Sets are already present and the upgrade policy is set to manual, AMA VMInsights will not be enabled for instances by default after running **ExistingVmssOnboarding** template. You have Manually upgrade the instances.

## Log Analytics agent
Download the [Logs Analytics agent templates](https://aka.ms/VmInsightsARMTemplates)

Contents of the file include folders that represent each deployment scenario with a template and parameter file. Before you run them, modify the parameters file and specify the values required. 

The download file contains the following templates for different scenarios:

- **ExistingVmOnboarding** template enables VM insights if the virtual machine already exists.
- **NewVmOnboarding** template creates a virtual machine and enables VM insights to monitor it.
- **ExistingVmssOnboarding** template enables VM insights if the virtual machine scale set already exists.
- **NewVmssOnboarding** template creates virtual machine scale sets and enables VM insights to monitor them.
- **ConfigureWorkspace** template configures your Log Analytics workspace to support VM insights by enabling the solutions and collection of Linux and Windows operating system performance counters.

>[!NOTE]
>If virtual machine scale sets were already present and the upgrade policy is set to **Manual**, VM insights won't be enabled for instances by default after running the **ExistingVmssOnboarding** Azure Resource Manager template. You have to manually upgrade the instances.

## Deploy templates
The templates can be deployed using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md) including the following examples using PowerShell and CLI.

```powershell
New-AzResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <ResourceGroupName> -TemplateFile <Template.json> -TemplateParameterFile <Parameters.json>
```


```azurecli
az deployment group create --resource-group <ResourceGroupName> --template-file <Template.json> --parameters <Parameters.json>
```

## To deploy a resource manager template
Each folder in the download has a template and a parameters file. Modify the parameters file with required detail details such as Virtual Machine Resource Id, Workspace resource Id, data collection rule resource Id, Location, and OS Type. Do not modify the template file unless you need to customize it for you particular scenario.

### Deploy with the Azure portal
See  [Quickstart: Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal.md) for details on deploying a template from the Azure portal.

### Deploy with Powershell
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