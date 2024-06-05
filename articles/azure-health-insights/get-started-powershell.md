---
title: "Quickstart: Create and deploy an Azure AI Health Insights resource using PowerShell"
description: "This document explains how to create and deploy an Azure AI Health Insights resource using PowerShell"
author: hvanhoe
ms.author: henkvanhoe
ms.service: azure-health-insights
ms.topic: quickstart  #Don't change
ms.date: 04/09/2024
---

# Quickstart: Create and deploy an Azure AI Health Insights resource (PowerShell)

This quickstart provides step-by-step instructions to create a resource and deploy a model. You can create resources in Azure in several different ways:

- The [Azure portal](https://portal.azure.com/)
- The REST APIs, the Azure CLI, PowerShell, or client libraries
- Azure Resource Manager (ARM) templates

In this article, you review examples for creating and deploying resources with PowerShell.

## Prerequisites

- An Azure subscription.
- The Azure CLI. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Sign in to the Azure PowerShell

[Sign in](/powershell/azure/authenticate-azureps) to the Azure CLI or select **Open Cloud Shell** in the following steps.

## Create an Azure resource group

To create an Azure Health Insights resource, you need an Azure resource group. When you create a new resource through Azure PowerShell, you can also create a new resource group or instruct Azure to use an existing group. The following example shows how to create a new resource group named _HealthInsightsResourceGroup_ with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. The resource group is created in the East US location. 

```azurepowershell-interactive
New-AzResourceGroup -Name HealthInsightsResourceGroup -Location eastus
```

## Create a resource

Use the [New-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount) command to create an Azure Health Insights resource in the resource group. In the following example, you create a resource named _HealthInsightsResource_ in the _HealthInsightsResourceGroup_ resource group. When you try the example, update the code to use your desired values for the resource group and resource name, along with your Azure subscription ID.

```azurepowershell-interactive
New-AzCognitiveServicesAccount -ResourceGroupName HealthInsightsResourceGroup -Name HealthInsightsResource -Type HealthInsights -SkuName F0 -Location eastus -CustomSubdomainName healthinsightsresource
```

## Retrieve information about the resource

After you create the resource, you can use different commands to find useful information about your Azure Health Insights Service instance. The following examples demonstrate how to retrieve the REST API endpoint base URL and the access keys for the new resource.

### Get the endpoint URL

Use the [Get-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount) command to retrieve the REST API endpoint base URL for the resource. In this example, we direct the command output through the [Select-Object](/powershell/module/microsoft.powershell.utility/select-object) cmdlet to locate the `endpoint` value.

When you try the example, update the code to use your values for the resource group and resource.

```azurepowershell-interactive
Get-AzCognitiveServicesAccount -ResourceGroupName HealthInsightsResourceGroup -Name HealthInsightsResource | 
  Select-Object -Property endpoint
```

### Get the primary API key

To retrieve the access keys for the resource, use the [Get-AzCognitiveServicesAccountKey](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccountkey) command. In this example, we direct the command output through the [Select-Object](/powershell/module/microsoft.powershell.utility/select-object) cmdlet to locate the `Key1` value.

When you try the example, update the code to use your values for the resource group and resource.

```azurepowershell-interactive
Get-AzCognitiveServicesAccountKey -Name HealthInsightsResource -ResourceGroupName HealthInsightsResourceGroup | 
  Select-Object -Property Key1
```

## Delete a resource

If you want to clean up after these exercises, you can remove your Azure Health Insights resource by deleting the resource through the Azure PowerShell. 

To remove the resource, use the [Remove-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/remove-azcognitiveservicesaccount) command. When you run this command, be sure to update the example code to use your values for the resource group and resource.

```azurepowershell-interactive
Remove-AzCognitiveServicesAccount -Name HealthInsightsResource -ResourceGroupName HealthInsightsResourceGroup
```

You can also delete the resource group. If you choose to delete the resource group, all resources contained in the group are also deleted. When you run this command, be sure to update the example code to use your values for the resource group.

```azurepowershell-interactive
Remove-AzResourceGroup -Name HealthInsightsResourceGroup
```


## Next steps

<!--- - Access Radiology Insights with the [REST API](get-started.md). --->
