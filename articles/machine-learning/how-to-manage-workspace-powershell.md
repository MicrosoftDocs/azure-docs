---
title: Create workspaces with Azure PowerShell
titleSuffix: Azure Machine Learning
description: Learn how to use the Azure PowerShell module to create and manage a new Azure Machine Learning workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: deeikele
ms.reviewer: larryfr
ms.date: 01/26/2023
ms.topic: how-to
ms.custom: powershell
---

# Manage Azure Machine Learning workspaces using Azure PowerShell

Use the Azure PowerShell module for Azure Machine Learning to create and manage your Azure Machine Learning workspaces.

## Prerequisites

- An **Azure subscription**. If you don't have one, try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- The [Azure PowerShell module](https://www.powershellgallery.com/packages/Az). To make sure you have the latest version, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps).

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```azurepowershell
Connect-AzAccount
```

If you don't know which location you want to use, you can list the available locations. Display the list of locations by using the following code example and find the one you want to use. This example uses **eastus**. Store the location in a variable and use the variable so you can change it in one place.

```azurepowershell-interactive
Get-AzLocation | Select-Object -Property Location
$Location = 'eastus'
```

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
$ResourceGroup = 'MyResourceGroup'
New-AzResourceGroup -Name $ResourceGroup -Location $Location
```

## Create dependency resources

An Azure Machine Learning workspace depends on the following Azure resources:

* Application Insights
* Azure Key Vault
* Azure Storage Account

Use the following commands to create these resources and retrieve the Azure Resource Manager ID of each:

```azurepowershell-interactive
$AppInsights = 'MyAppInsights'
New-AzApplicationInsights -Name $AppInsights -ResourceGroupName $ResourceGroup -Location $Location
$appid = (Get-AzResource -Name $AppInsights -ResourceGroupName $ResourceGroup).ResourceId
```

```azurepowershell-interactive
$KeyVault = 'MyKeyVault'
New-AzKeyVault -Name $KeyVault -ResourceGroupName $ResourceGroup -Location $Location
$kvid = (Get-AzResource -Name $KeyVault -ResourceGroupName $ResourceGroup).ResourceId
```

```azurepowershell-interactive
$Storage = 'MyStorage'
New-AzStorageAccount -Name $Storage -ResourceGroupName $ResourceGroup -Location $Location `
                     -SkuName Standard_LRS -Kind StorageV2
$storeid = (Get-AzResource -Name $Storage -ResourceGroupName $ResourceGroup).ResourceId
```
## Create a workspace

```azurepowershell-interactive
New-AzMLWorkspace -Name larryml -ResourceGroupName $ResourceGroup -Location $Location `
                  -
```

> [!TIP]
> If you receive a message that the term `New-AzMLWorkspace` isn't recognized, use the following command to install the Azure Machine Learning Services module:
>
> ```azurepowershell-interactive
> Install-Module Az.MachineLearningServices
> ```