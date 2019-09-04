---
title: Deploy an Azure Resource Manager template in an Azure Automation runbook
description: How to deploy an Azure Resource Manager template stored in Azure Storage from a runbook
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 03/16/2018
ms.topic: conceptual
manager: carmonm
keywords: powershell,  runbook, json, azure automation
---

# Deploy an Azure Resource Manager template in an Azure Automation PowerShell runbook

You can write an [Azure Automation PowerShell runbook](automation-first-runbook-textual-powershell.md)
that deploys an Azure resource by using an 
[Azure Resource Management template](../azure-resource-manager/resource-manager-create-first-template.md).

By doing this, you can automate deployment of Azure resources. You can maintain your Resource Manager
templates in a central, secure location such as Azure Storage.

In this article, we create a PowerShell runbook that uses a Resource Manager template stored in
[Azure Storage](../storage/common/storage-introduction.md) to deploy a new Azure Storage account.

## Prerequisites

To complete this tutorial, you need the following items:

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or [sign up for a free account](https://azure.microsoft.com/free/).
* [Automation account](automation-sec-configure-azure-runas-account.md) to hold the runbook and authenticate to Azure resources.  This account must have permission to start and stop the virtual machine.
* [Azure Storage account](../storage/common/storage-create-storage-account.md) in which to store the Resource Manager template
* Azure Powershell installed on a local machine. See [Install and configure Azure Powershell](https://docs.microsoft.com/powershell/azure/azurerm/install-azurerm-ps) for information about how to get Azure PowerShell.

## Create the Resource Manager template

For this example, we use a Resource Manager template that deploys a new Azure Storage account.

In a text editor, copy the following text:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ],
      "metadata": {
        "description": "Storage Account type"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'standardsa')]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageAccountName')]",
      "apiVersion": "2018-02-01",
      "location": "[parameters('location')]",
      "sku": {
          "name": "[parameters('storageAccountType')]"
      },
      "kind": "Storage", 
      "properties": {
      }
    }
  ],
  "outputs": {
      "storageAccountName": {
          "type": "string",
          "value": "[variables('storageAccountName')]"
      }
  }
}
```

Save the file locally as `TemplateTest.json`.

## Save the Resource Manager template in Azure Storage

Now we use PowerShell to create an Azure Storage file share and upload the `TemplateTest.json` file.
For instructions on how to create a file share and upload a file in the Azure portal, see
[Get started with Azure File storage on Windows](../storage/files/storage-dotnet-how-to-use-files.md).

Launch PowerShell on your local machine, and run the following commands to create a file share
and upload the Resource Manager template to that file share.

```powershell
# Login to Azure
Connect-AzureRmAccount

# Get the access key for your storage account
$key = Get-AzureRmStorageAccountKey -ResourceGroupName 'MyAzureAccount' -Name 'MyStorageAccount'

# Create an Azure Storage context using the first access key
$context = New-AzureStorageContext -StorageAccountName 'MyStorageAccount' -StorageAccountKey $key[0].value

# Create a file share named 'resource-templates' in your Azure Storage account
$fileShare = New-AzureStorageShare -Name 'resource-templates' -Context $context

# Add the TemplateTest.json file to the new file share
# "TemplatePath" is the path where you saved the TemplateTest.json file
$templateFile = 'C:\TemplatePath'
Set-AzureStorageFileContent -ShareName $fileShare.Name -Context $context -Source $templateFile
```

## Create the PowerShell runbook script

Now we create a PowerShell script that gets the `TemplateTest.json` file from Azure Storage
and deploys the template to create a new Azure Storage account.

In a text editor, paste the following text:

```powershell
param (
    [Parameter(Mandatory=$true)]
    [string]
    $ResourceGroupName,

    [Parameter(Mandatory=$true)]
    [string]
    $StorageAccountName,

    [Parameter(Mandatory=$true)]
    [string]
    $StorageAccountKey,

    [Parameter(Mandatory=$true)]
    [string]
    $StorageFileName
)



# Authenticate to Azure if running from Azure Automation
$ServicePrincipalConnection = Get-AutomationConnection -Name "AzureRunAsConnection"
Connect-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint | Write-Verbose

#Set the parameter values for the Resource Manager template
$Parameters = @{
    "storageAccountType"="Standard_LRS"
    }

# Create a new context
$Context = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey

Get-AzureStorageFileContent -ShareName 'resource-templates' -Context $Context -path 'TemplateTest.json' -Destination 'C:\Temp'

$TemplateFile = Join-Path -Path 'C:\Temp' -ChildPath $StorageFileName

# Deploy the storage account
New-AzureRmResourceGroupDeployment -ResourceGroupName $ResourceGroupName -TemplateFile $TemplateFile -TemplateParameterObject $Parameters 
``` 

Save the file locally as `DeployTemplate.ps1`.

## Import and publish the runbook into your Azure Automation account

Now we use PowerShell to import the runbook into your Azure Automation account,
and then publish the runbook.
For information about how to import and publish a runbook in the Azure portal, see 
[Manage runbooks in Azure Automation](manage-runbooks.md).

To import `DeployTemplate.ps1` into your Automation account as a PowerShell runbook,
run the following PowerShell commands:

```powershell
# MyPath is the path where you saved DeployTemplate.ps1
# MyResourceGroup is the name of the Azure ResourceGroup that contains your Azure Automation account
# MyAutomationAccount is the name of your Automation account
$importParams = @{
    Path = 'C:\MyPath\DeployTemplate.ps1'
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'MyAutomationAccount'
    Type = 'PowerShell'
}
Import-AzureRmAutomationRunbook @importParams

# Publish the runbook
$publishParams = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'MyAutomationAccount'
    Name = 'DeployTemplate'
}
Publish-AzureRmAutomationRunbook @publishParams
```

## Start the runbook

Now we start the runbook by calling the 
[Start-AzureRmAutomationRunbook](https://docs.microsoft.com/powershell/module/azurerm.automation/start-azurermautomationrunbook)
cmdlet.

For information about how to start a runbook in the Azure portal, see
[Starting a runbook in Azure Automation](automation-starting-a-runbook.md).

Run the following commands in the PowerShell console:

```powershell
# Set up the parameters for the runbook
$runbookParams = @{
    ResourceGroupName = 'MyResourceGroup'
    StorageAccountName = 'MyStorageAccount'
    StorageAccountKey = $key[0].Value # We got this key earlier
    StorageFileName = 'TemplateTest.json' 
}

# Set up parameters for the Start-AzureRmAutomationRunbook cmdlet
$startParams = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'MyAutomationAccount'
    Name = 'DeployTemplate'
    Parameters = $runbookParams
}

# Start the runbook
$job = Start-AzureRmAutomationRunbook @startParams
```

The runbook runs, and you can check its status by running `$job.Status`.

The runbook gets the Resource Manager template and uses it to deploy a new Azure Storage account.
You can see that the new storage account was created by running the following command:
```powershell
Get-AzureRmStorageAccount
```

## Summary

That's it! Now you can use Azure Automation and Azure Storage,
and Resource Manager templates to deploy all your Azure resources.

## Next steps

* To learn more about Resource Manager templates, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md)
* To get started with Azure Storage, see [Introduction to Azure Storage](../storage/common/storage-introduction.md).
* To find other useful Azure Automation runbooks, see
[Runbook and module galleries for Azure Automation](automation-runbook-gallery.md).
* To find other useful Resource Manager templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/)


