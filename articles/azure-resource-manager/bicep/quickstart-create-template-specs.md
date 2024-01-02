---
title: Create and deploy a template spec with Bicep
description: Learn how to use Bicep to create and deploy a template spec to a resource group in your Azure subscription. Then, use a template spec to deploy Azure resources.
ms.date: 06/23/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
# Customer intent: As a developer I want to use Bicep to create and share deployment templates so that other people in my organization can deploy Microsoft Azure resources.
---

# Quickstart: Create and deploy a template spec with Bicep

This quickstart describes how to create and deploy a [template spec](template-specs.md) with a Bicep file. A template spec is deployed to a resource group so that people in your organization can deploy resources in Microsoft Azure. Template specs let you share deployment templates without needing to give users access to change the Bicep file. This template spec example uses a Bicep file to deploy a storage account.

When you create a template spec, the Bicep file is transpiled into JavaScript Object Notation (JSON). The template spec uses JSON to deploy Azure resources. Currently, you can't use the Microsoft Azure portal to import a Bicep file and create a template spec resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell [version 6.3.0 or later](/powershell/azure/install-azure-powershell) or Azure CLI [version 2.27.0 or later](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

## Create Bicep file

You create a template spec from a local Bicep file. Copy the following sample and save it to your computer as _main.bicep_. The examples use the path _C:\templates\main.bicep_. You can use a different path, but you'll need to change the commands.

The following Bicep file is used in the **PowerShell** and **CLI** tabs. The **Bicep file** tab uses a different template that combines Bicep and JSON to create and deploy a template spec.

```bicep
@allowed([
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GRS'
  'Standard_GZRS'
  'Standard_LRS'
  'Standard_RAGRS'
  'Standard_RAGZRS'
  'Standard_ZRS'
])
@description('Storage account type.')
param storageAccountType string = 'Standard_LRS'

@description('Location for all resources.')
param location string = resourceGroup().location

var storageAccountName = 'storage${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'StorageV2'
  properties: {}
}

output storageAccountNameOutput string = storageAccount.name
```

## Create template spec

The template spec is a resource type named [Microsoft.Resources/templateSpecs](/azure/templates/microsoft.resources/templatespecs). To create a template spec, use Azure CLI, Azure PowerShell, or a Bicep file.

This example uses the resource group name `templateSpecRG`. You can use a different name, but you'll need to change the commands.

# [PowerShell](#tab/azure-powershell)

1. Create a new resource group to contain the template spec.

    ```azurepowershell
    New-AzResourceGroup `
      -Name templateSpecRG `
      -Location westus2
    ```

1. Create the template spec in that resource group. Give the new template spec the name _storageSpec_.

    ```azurepowershell
    New-AzTemplateSpec `
      -Name storageSpec `
      -Version "1.0" `
      -ResourceGroupName templateSpecRG `
      -Location westus2 `
      -TemplateFile "C:\templates\main.bicep"
    ```

# [CLI](#tab/azure-cli)

1. Create a new resource group to contain the template spec.

    ```azurecli
    az group create \
      --name templateSpecRG \
      --location westus2
    ```

1. Create the template spec in that resource group. Give the new template spec the name _storageSpec_.

    ```azurecli
    az ts create \
      --name storageSpec \
      --version "1.0" \
      --resource-group templateSpecRG \
      --location westus2 \
      --template-file "C:\templates\main.bicep"
    ```

# [Bicep file](#tab/bicep)

You can create a template spec with a Bicep file but the `mainTemplate` must be in JSON. The JSON template doesn't use standard JSON syntax. For example, there are no end-of-line commas, double quotes are replaced with single quotes, and backslashes (`\`) are used to escape single quotes within expressions.

1. Copy the following template and save it to your computer as _main.bicep_.

    ```bicep
    param templateSpecName string = 'storageSpec'

    param templateSpecVersionName string = '1.0'

    @description('Location for all resources.')
    param location string = resourceGroup().location

    resource createTemplateSpec 'Microsoft.Resources/templateSpecs@2022-02-01' = {
      name: templateSpecName
      location: location
    }

    resource createTemplateSpecVersion 'Microsoft.Resources/templateSpecs/versions@2022-02-01' = {
      parent: createTemplateSpec
      name: templateSpecVersionName
      location: location
      properties: {
        mainTemplate: {
          '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
          'contentVersion': '1.0.0.0'
          'metadata': {}
          'parameters': {
            'storageAccountType': {
              'type': 'string'
              'defaultValue': 'Standard_LRS'
              'metadata': {
                'description': 'Storage account type.'
              }
              'allowedValues': [
                'Premium_LRS'
                'Premium_ZRS'
                'Standard_GRS'
                'Standard_GZRS'
                'Standard_LRS'
                'Standard_RAGRS'
                'Standard_RAGZRS'
                'Standard_ZRS'
              ]
            }
            'location': {
              'type': 'string'
              'defaultValue': '[resourceGroup().location]'
              'metadata': {
                'description': 'Location for all resources.'
              }
            }
          }
          'variables': {
            'storageAccountName': '[format(\'{0}{1}\', \'storage\', uniqueString(resourceGroup().id))]'
          }
          'resources': [
            {
              'type': 'Microsoft.Storage/storageAccounts'
              'apiVersion': '2022-09-01'
              'name': '[variables(\'storageAccountName\')]'
              'location': '[parameters(\'location\')]'
              'sku': {
                'name': '[parameters(\'storageAccountType\')]'
              }
              'kind': 'StorageV2'
              'properties': {}
            }
          ]
          'outputs': {
            'storageAccountNameOutput': {
              'type': 'string'
              'value': '[variables(\'storageAccountName\')]'
            }
          }
        }
      }
    }
    ```

1. Use Azure PowerShell or Azure CLI to create a new resource group.

    ```azurepowershell
    New-AzResourceGroup `
      -Name templateSpecRG `
      -Location westus2
    ```

    ```azurecli
    az group create \
      --name templateSpecRG \
      --location westus2
    ```

1. Create the template spec in that resource group. The template spec name _storageSpec_ and version number `1.0` are parameters in the Bicep file.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "C:\templates\main.bicep"
    ```

    ```azurecli
    az deployment group create \
      --resource-group templateSpecRG \
      --template-file "C:\templates\main.bicep"
    ```

---

## Deploy template spec

Use the template spec to deploy a storage account. This example uses the resource group name `storageRG`. You can use a different name, but you'll need to change the commands.

# [PowerShell](#tab/azure-powershell)

1. Create a resource group to contain the new storage account.

    ```azurepowershell
    New-AzResourceGroup `
      -Name storageRG `
      -Location westus2
    ```

1. Get the resource ID of the template spec.

    ```azurepowershell
    $id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name storageSpec -Version "1.0").Versions.Id
    ```

1. Deploy the template spec.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -TemplateSpecId $id `
      -ResourceGroupName storageRG
    ```

1. You provide parameters exactly as you would for a Bicep file deployment. Redeploy the template spec with a parameter for the storage account type.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -TemplateSpecId $id `
      -ResourceGroupName storageRG `
      -storageAccountType Standard_GRS
    ```

# [CLI](#tab/azure-cli)

1. Create a resource group to contain the new storage account.

    ```azurecli
    az group create \
      --name storageRG \
      --location westus2
    ```

1. Get the resource ID of the template spec.

    ```azurecli
    id=$(az ts show --name storageSpec --resource-group templateSpecRG --version "1.0" --query "id")
    ```

    > [!NOTE]
    > There is a known issue with getting a template spec ID and assigning it to a variable in Windows PowerShell.

1. Deploy the template spec.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id
    ```

1. You provide parameters exactly as you would for a Bicep file deployment. Redeploy the template spec with a parameter for the storage account type.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id \
      --parameters storageAccountType="Standard_GRS"
    ```

# [Bicep file](#tab/bicep)

To deploy a template spec using a Bicep file, use a module. The module links to an existing template spec. For more information, see [file in template spec](modules.md#file-in-template-spec).

1. Copy the following Bicep module and save it to your computer as _storage.bicep_.

    ```bicep
    module deployTemplateSpec 'ts:<subscriptionId>/templateSpecRG/storageSpec:1.0' = {
      name: 'deployVersion1'
    }
    ```

1. Replace `<subscriptionId>` in the module. Use Azure PowerShell or Azure CLI to get your subscription ID.

   ```azurepowershell
   (Get-AzContext).Subscription.Id
   ```

   ```azurecli
   az account show --query "id" --output tsv
   ```

1. Use Azure PowerShell or Azure CLI to create a new resource group for the storage account.

    ```azurepowershell
    New-AzResourceGroup `
      -Name storageRG `
      -Location westus2
    ```

    ```azurecli
    az group create \
      --name storageRG \
      --location westus2
    ```

1. Deploy the template spec with Azure PowerShell or Azure CLI.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "C:\templates\storage.bicep"
    ```

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-file "C:\templates\storage.bicep"
    ```

1. You can add a parameter and redeploy the template spec with a different storage account type. Copy the sample and replace your _storage.bicep_ file. Then, redeploy the template spec deployment.

    ```bicep
    module deployTemplateSpec 'ts:<subscriptionId>/templateSpecRG/storageSpec:1.0' = {
      name: 'deployVersion1'
      params: {
        storageAccountType: 'Standard_GRS'
      }
    }
    ```

---

## Grant access

If you want to let other users in your organization deploy your template spec, you need to grant them read access. You can assign the Reader role to a Microsoft Entra group for the resource group that contains template specs you want to share. For more information, see [Tutorial: Grant a group access to Azure resources using Azure PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md).

## Update Bicep file

After the template spec was created, you decided to update the Bicep file. To continue with the examples in the **PowerShell** or **CLI** tabs, copy the sample and replace your _main.bicep_ file.

The parameter `storageNamePrefix` specifies a prefix value for the storage account name. The `storageAccountName` variable concatenates the prefix with a unique string.

```bicep
@allowed([
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GRS'
  'Standard_GZRS'
  'Standard_LRS'
  'Standard_RAGRS'
  'Standard_RAGZRS'
  'Standard_ZRS'
])
@description('Storage account type.')
param storageAccountType string = 'Standard_LRS'

@description('Location for all resources.')
param location string = resourceGroup().location

@maxLength(11)
@description('The storage account name prefix.')
param storageNamePrefix string = 'storage'

var storageAccountName = '${toLower(storageNamePrefix)}${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'StorageV2'
  properties: {}
}

output storageAccountNameOutput string = storageAccount.name
```

## Update template spec version

Rather than create a new template spec for the revised template, add a new version named `2.0` to the existing template spec. Users can choose to deploy either version.

# [PowerShell](#tab/azure-powershell)

1. Create a new version of the template spec.

   ```azurepowershell
   New-AzTemplateSpec `
     -Name storageSpec `
     -Version "2.0" `
     -ResourceGroupName templateSpecRG `
     -Location westus2 `
     -TemplateFile "C:\templates\main.bicep"
   ```

1. To deploy the new version, get the resource ID for the `2.0` version.

   ```azurepowershell
   $id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name storageSpec -Version "2.0").Versions.Id
   ```

1. Deploy the new version and use the `storageNamePrefix` to specify a prefix for the storage account name.

   ```azurepowershell
   New-AzResourceGroupDeployment `
     -TemplateSpecId $id `
     -ResourceGroupName storageRG `
     -storageNamePrefix "demo"
   ```

# [CLI](#tab/azure-cli)

1. Create a new version of the template spec.

   ```azurecli
   az ts create \
     --name storageSpec \
     --version "2.0" \
     --resource-group templateSpecRG \
     --location westus2 \
     --template-file "C:\templates\main.bicep"
   ```

1. To deploy the new version, get the resource ID for the `2.0` version.

   ```azurecli
   id=$(az ts show --name storageSpec --resource-group templateSpecRG --version "2.0" --query "id")
   ```

1. Deploy the new version and use the `storageNamePrefix` to specify a prefix for the storage account name.

   ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id \
      --parameters storageNamePrefix="demo"
    ```

# [Bicep file](#tab/bicep)

1. Create a new version of the template spec. Copy the sample and replace your _main.bicep_ file.

   The parameter `storageNamePrefix` specifies a prefix value for the storage account name. The `storageAccountName` variable concatenates the prefix with a unique string.

    ```bicep
    param templateSpecName string = 'storageSpec'

    param templateSpecVersionName string = '2.0'

    @description('Location for all resources.')
    param location string = resourceGroup().location

    resource createTemplateSpec 'Microsoft.Resources/templateSpecs@2022-02-01' = {
      name: templateSpecName
      location: location
    }

    resource createTemplateSpecVersion 'Microsoft.Resources/templateSpecs/versions@2022-02-01' = {
      parent: createTemplateSpec
      name: templateSpecVersionName
      location: location
      properties: {
        mainTemplate: {
          '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
          'contentVersion': '1.0.0.0'
          'metadata': {}
          'parameters': {
            'storageAccountType': {
              'type': 'string'
              'defaultValue': 'Standard_LRS'
              'metadata': {
                'description': 'Storage account type.'
              }
              'allowedValues': [
                'Premium_LRS'
                'Premium_ZRS'
                'Standard_GRS'
                'Standard_GZRS'
                'Standard_LRS'
                'Standard_RAGRS'
                'Standard_RAGZRS'
                'Standard_ZRS'
              ]
            }
            'location': {
              'type': 'string'
              'defaultValue': '[resourceGroup().location]'
              'metadata': {
                'description': 'Location for all resources.'
              }
            }
            'storageNamePrefix': {
              'type': 'string'
              'defaultValue': 'storage'
              'metadata': {
                'description': 'The storage account name prefix.'
              }
              'maxLength': 11
            }
          }
          'variables': {
            'storageAccountName': '[format(\'{0}{1}\', toLower(parameters(\'storageNamePrefix\')), uniqueString(resourceGroup().id))]'
          }
          'resources': [
            {
              'type': 'Microsoft.Storage/storageAccounts'
              'apiVersion': '2022-09-01'
              'name': '[variables(\'storageAccountName\')]'
              'location': '[parameters(\'location\')]'
              'sku': {
                'name': '[parameters(\'storageAccountType\')]'
              }
              'kind': 'StorageV2'
              'properties': {}
            }
          ]
          'outputs': {
            'storageAccountNameOutput': {
              'type': 'string'
              'value': '[variables(\'storageAccountName\')]'
            }
          }
        }
      }
    }
    ```

1. To add the new version to your template spec, deploy your template with Azure PowerShell or Azure CLI.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "C:\templates\main.bicep"
    ```

    ```azurecli
    az deployment group create \
      --resource-group templateSpecRG \
      --template-file "C:\templates\main.bicep"
    ```

1. Copy the following Bicep module and save it to your computer as _storage.bicep_.

    ```bicep
    module deployTemplateSpec 'ts:<subscriptionId>/templateSpecRG/storageSpec:2.0' = {
      name: 'deployVersion2'
      params: {
        storageNamePrefix: 'demo'
      }
    }
    ```

1. Replace `<subscriptionId>` in the module. Use Azure PowerShell or Azure CLI to get your subscription ID.

   ```azurepowershell
   (Get-AzContext).Subscription.Id
   ```

   ```azurecli
   az account show --query "id" --output tsv
   ```

1. Deploy the template spec with Azure PowerShell or Azure CLI.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "C:\templates\storage.bicep"
    ```

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-file "C:\templates\storage.bicep"
    ```

---

## Clean up resources

To clean up the resources you deployed in this quickstart, delete both resource groups. The resource group, template specs, and storage accounts will be deleted.

Use Azure PowerShell or Azure CLI to delete the resource groups.

```azurepowershell
Remove-AzResourceGroup -Name "templateSpecRG"

Remove-AzResourceGroup -Name "storageRG"
```

```azurecli
az group delete --name templateSpecRG

az group delete --name storageRG
```

## Next steps

> [!div class="nextstepaction"]
> [Azure Resource Manager template specs in Bicep](template-specs.md)
