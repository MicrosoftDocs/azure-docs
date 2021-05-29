---
title: Enable VM insights using Resource Manager templates
description: This article describes how you enable VM insights for one or more Azure virtual machines or virtual machine scale sets by using Azure PowerShell or Azure Resource Manager templates.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

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

We have created example Azure Resource Manager templates for onboarding your virtual machines and virtual machine scale sets. These templates include scenarios you can use to enable monitoring on an existing resource and create a new resource that has monitoring enabled.

>[!NOTE]
>The template needs to be deployed in the same resource group as the virtual machine or virtual machine scale set being enabled.


The Azure Resource Manager templates are provided in an archive file (.zip) that you can [download](https://aka.ms/VmInsightsARMTemplates) from our GitHub repo. Contents of the file include folders that represent each deployment scenario with a template and parameter file. Before you run them, modify the parameters file and specify the values required. 

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



## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with VM insights.

- To view discovered application dependencies, see [View VM insights Map](vminsights-maps.md).

- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM Performance](vminsights-performance.md).