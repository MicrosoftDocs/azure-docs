---
title: Deploy an Azure Resource Manager template in an Azure Automation PowerShell runbook
description: This article describes how to deploy an Azure Resource Manager template stored in Azure Storage from a PowerShell runbook.
services: automation
ms.subservice: process-automation
ms.date: 09/22/2020
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
keywords: powershell,  runbook, json, azure automation
---

# Deploy an Azure Resource Manager template in a PowerShell runbook

You can write an [Azure Automation PowerShell runbook](./learn/automation-tutorial-runbook-textual-powershell.md)
that deploys an Azure resource by using an [Azure Resource Management template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). The templates allow you to use Azure Automation to automate deployment of your Azure resources. You can maintain your Resource Manager templates in a central, secure location, such as Azure Storage.

In this article, we create a PowerShell runbook that uses a Resource Manager template stored in [Azure Storage](../storage/common/storage-introduction.md) to deploy a new Azure Storage account.

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or [sign up for a free account](https://azure.microsoft.com/free/).
* [Automation account](./automation-security-overview.md) to hold the runbook and authenticate to Azure resources. This account must have permission to start and stop the virtual machine.
* [Azure Storage account](../storage/common/storage-account-create.md) in which to store the Resource Manager template.
* Azure PowerShell installed on a local machine. See [Install the Azure PowerShell Module](/powershell/azure/install-az-ps) for information about how to get Azure PowerShell.

## Create the Resource Manager template

In this example, we use a Resource Manager template that deploys a new Azure Storage account.

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

Save the file locally as **TemplateTest.json**.

## Save the Resource Manager template in Azure Storage

Now we use PowerShell to create an Azure Storage file share and upload the **TemplateTest.json** file. For instructions on how to create a file share and upload a file in the Azure portal, see [Get started with Azure File storage on Windows](../storage/files/storage-dotnet-how-to-use-files.md).

Launch PowerShell on your local machine, and run the following commands to create a file share and upload the Resource Manager template to that file share.

```powershell
# Log into Azure
Connect-AzAccount

# Get the access key for your storage account
$key = Get-AzStorageAccountKey -ResourceGroupName 'MyAzureAccount' -Name 'MyStorageAccount'

# Create an Azure Storage context using the first access key
$context = New-AzStorageContext -StorageAccountName 'MyStorageAccount' -StorageAccountKey $key[0].value

# Create a file share named 'resource-templates' in your Azure Storage account
$fileShare = New-AzStorageShare -Name 'resource-templates' -Context $context

# Add the TemplateTest.json file to the new file share
# "TemplatePath" is the path where you saved the TemplateTest.json file
$templateFile = 'C:\TemplatePath'
Set-AzStorageFileContent -ShareName $fileShare.Name -Context $context -Source $templateFile
```

## Create the PowerShell runbook script

Now we create a PowerShell script that gets the **TemplateTest.json** file from Azure Storage and deploy the template to create a new Azure Storage account.

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
Connect-AzAccount `
    -ServicePrincipal `
    -Tenant $ServicePrincipalConnection.TenantId `
    -ApplicationId $ServicePrincipalConnection.ApplicationId `
    -CertificateThumbprint $ServicePrincipalConnection.CertificateThumbprint | Write-Verbose

#Set the parameter values for the Resource Manager template
$Parameters = @{
    "storageAccountType"="Standard_LRS"
    }

# Create a new context
$Context = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey

Get-AzStorageFileContent -ShareName 'resource-templates' -Context $Context -path 'TemplateTest.json' -Destination 'C:\Temp'

$TemplateFile = Join-Path -Path 'C:\Temp' -ChildPath $StorageFileName

# Deploy the storage account
New-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName -TemplateFile $TemplateFile -TemplateParameterObject $Parameters 
```

Save the file locally as **DeployTemplate.ps1**.

## Import and publish the runbook into your Azure Automation account

Now we use PowerShell to import the runbook into your Azure Automation account, and then publish the runbook. For information about how to import and publish a runbook in the Azure portal, see [Manage runbooks in Azure Automation](manage-runbooks.md).

To import **DeployTemplate.ps1** into your Automation account as a PowerShell runbook, run the following PowerShell commands:

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
Import-AzAutomationRunbook @importParams

# Publish the runbook
$publishParams = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'MyAutomationAccount'
    Name = 'DeployTemplate'
}
Publish-AzAutomationRunbook @publishParams
```

## Start the runbook

Now we start the runbook by calling the [Start-AzAutomationRunbook](/powershell/module/Az.Automation/Start-AzAutomationRunbook) cmdlet. For information about how to start a runbook in the Azure portal, see [Starting a runbook in Azure Automation](./start-runbooks.md).

Run the following commands in the PowerShell console:

```powershell
# Set up the parameters for the runbook
$runbookParams = @{
    ResourceGroupName = 'MyResourceGroup'
    StorageAccountName = 'MyStorageAccount'
    StorageAccountKey = $key[0].Value # We got this key earlier
    StorageFileName = 'TemplateTest.json'
}

# Set up parameters for the Start-AzAutomationRunbook cmdlet
$startParams = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'MyAutomationAccount'
    Name = 'DeployTemplate'
    Parameters = $runbookParams
}

# Start the runbook
$job = Start-AzAutomationRunbook @startParams
```

After the runbook runs, you can check its status by retrieving the property value of the job object `$job.Status`.

The runbook gets the Resource Manager template and uses it to deploy a new Azure Storage account. You can see the new storage account was created by running the following command:

```powershell
Get-AzStorageAccount
```

## Next steps

* To learn more about Resource Manager templates, see [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).
* To get started with Azure Storage, see [Introduction to Azure Storage](../storage/common/storage-introduction.md).
* To find other useful Azure Automation runbooks, see [Use runbooks and modules in Azure Automation](automation-runbook-gallery.md).
* For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation#automation).
