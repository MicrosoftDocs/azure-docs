---
title: Azure PowerShell Script Sample - Deploy template | Microsoft Docs
description: Sample script for deploying an Azure Resource Manager template.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/19/2017
ms.author: tomfitz

---
# Azure Resource Manager template deployment - PowerShell script

This script deploys a Resource Manager template to a resource group in your subscription.

[!INCLUDE [sample-powershell-install](../../includes/sample-powershell-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sample script

```powershell
<#
 .SYNOPSIS
    Deploys a template to Azure

 .DESCRIPTION
    Deploys an Azure Resource Manager template
#>

param (
    [Parameter(Mandatory)]
    #The subscription id where the template will be deployed.
    [string]$SubscriptionId,  

    [Parameter(Mandatory)]
    #The resource group where the template will be deployed. Can be the name of an existing or a new resource group.
    [string]$ResourceGroupName, 

    #Optional, a resource group location. If specified, will try to create a new resource group in this location. If not specified, assumes resource group is existing.
    [string]$ResourceGroupLocation, 

    #The deployment name.
    [Parameter(Mandatory)]
    [string]$DeploymentName,    

    #Path to the template file. Defaults to template.json.
    [string]$TemplateFilePath = "template.json",  

    #Path to the parameters file. Defaults to parameters.json. If file is not found, will prompt for parameter values based on template.
    [string]$ParametersFilePath = "parameters.json"
)

$ErrorActionPreference = "Stop"

# Login to Azure and select subscription
Write-Output "Logging in"
Login-AzureRmAccount
Write-Output "Selecting subscription '$SubscriptionId'"
Select-AzureRmSubscription -SubscriptionID $SubscriptionId

# Create or check for existing resource group
$resourceGroup = Get-AzureRmResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if ( -not $ResourceGroup ) {
    Write-Output "Could not find resource group '$ResourceGroupName' - will create it"
    if ( -not $ResourceGroupLocation ) {
        $ResourceGroupLocation = Read-Host -Prompt 'Enter location for resource group'
    }
    Write-Output "Creating resource group '$ResourceGroupName' in location '$ResourceGroupLocation'"
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
}
else {
    Write-Output "Using existing resource group '$ResourceGroupName'"
}

# Start the deployment
Write-Output "Starting deployment"
if ( Test-Path $ParametersFilePath ) {
    New-AzureRmResourceGroupDeployment -ResourceGroupName $ResourceGroupName -TemplateFile $TemplateFilePath -TemplateParameterFile $ParametersFilePath
}
else {
    New-AzureRmResourceGroupDeployment -ResourceGroupName $ResourceGroupName -TemplateFile $TemplateFilePath
}
``` 

## Clean up deployment 

Run the following command to remove the resource group and all its resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Register-AzureRmResourceProvider](/powershell/module/azurerm.resources/register-azurermresourceprovider) | Registers a resource provider so its resource types can be deployed to your subscription.  |
| [Get-AzureRmResourceGroup](/powershell/module/azurerm.resources/get-azurermresourcegroup) | Gets resource groups.  |
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmResourceGroupDeployment](/powershell/module/azurerm.resources/new-azurermresourcegroupdeployment) | Adds an Azure deployment to a resource group.  |
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |



## Next steps
* For an introduction to deploying templates, see [Deploy resources with Resource Manager templates and Azure PowerShell](resource-group-template-deploy.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

