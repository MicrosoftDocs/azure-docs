---
title: Create and deploy a deployment stack with Bicep from template specs
description: Learn how to use Bicep to create and deploy a deployment stack from template specs.
ms.date: 05/22/2024
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
# Customer intent: As a developer I want to use Bicep to create a deployment stack from a template spec.
---

# Quickstart: Create and deploy a deployment stack with Bicep from template specs

This quickstart describes how to create a [deployment stack](deployment-stacks.md) from a template spec.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell [version 12.0.0 or later](/powershell/azure/install-az-ps) or Azure CLI [version 2.61.0 or later](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

## Create a Bicep file

Create a Bicep file to create a storage account and a virtual network.

```bicep
param resourceGroupLocation string = resourceGroup().location
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
param vnetName string = 'vnet${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: storageAccountName
  location: resourceGroupLocation
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: vnetName
  location: resourceGroupLocation
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'Subnet-1'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
      {
        name: 'Subnet-2'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}
```

Save the Bicep file as _main.bicep_.

## Create template spec

Create a template spec with the following command.

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name 'templateSpecRG' \
  --location 'centralus'

az ts create \
  --name 'stackSpec' \
  --version '1.0' \
  --resource-group 'templateSpecRG' \
  --location 'centralus' \
  --template-file 'main.bicep'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name "templateSpecRG" `
  -Location "centralus"

New-AzTemplateSpec `
  -Name "stackSpec" `
  -Version "1.0" `
  -ResourceGroupName "templateSpecRG" `
  -Location "centralus" `
  -TemplateFile "main.bicep"
```

---

The format of the template spec ID is `/subscriptions/<subscription-id>/resourceGroups/templateSpecRG/providers/Microsoft.Resources/templateSpecs/stackSpec/versions/1.0`.

## Create a deployment stack

Create a deployment stack from the template spec.

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name 'demoRg' \
  --location 'centralus'

id=$(az ts show --name 'stackSpec' --resource-group 'templateSpecRG' --version '1.0' --query 'id')

az stack group create \
  --name demoStack \
  --resource-group 'demoRg' \
  --template-spec $id \
  --action-on-unmanage 'detachAll' \
  --deny-settings-mode 'none'
```

For more information about `action-on-unmanage` and `deny-setting-mode`, see [Deployment stacks](./deployment-stacks.md).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name "demoRg" `
  -Location "eastus"

$id = (Get-AzTemplateSpec -ResourceGroupName "templateSpecRG" -Name "stackSpec" -Version "1.0").Versions.Id

New-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -TemplateSpecId $id `
  -ActionOnUnmanage "detachAll" `
  -DenySettingsMode "none"
```

For more information about `ActionOnUnmanage` and `DenySettingMode`, see [Deployment stacks](./deployment-stacks.md).

---

## Verify the deployment

To list the deployed deployment stacks at the subscription level:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --resource-group 'demoRg' \
  --name 'demoStack'
```

The output shows two managed resources - one storage account and one virtual network:

```output
{
  "actionOnUnmanage": {
    "managementGroups": "detach",
    "resourceGroups": "detach",
    "resources": "detach"
  },
  "debugSetting": null,
  "deletedResources": [],
  "denySettings": {
    "applyToChildScopes": false,
    "excludedActions": null,
    "excludedPrincipals": null,
    "mode": "none"
  },
  "deploymentId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deployments/demoStack-240517162aqmf",
  "deploymentScope": null,
  "description": null,
  "detachedResources": [],
  "duration": "PT30.5642429S",
  "error": null,
  "failedResources": [],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack",
  "location": null,
  "name": "demoStack",
  "outputs": null,
  "parameters": {},
  "parametersLink": null,
  "provisioningState": "succeeded",
  "resourceGroup": "demoRg",
  "resources": [
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk",
      "resourceGroup": "demoRg",
      "status": "managed"
    },
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk",
      "resourceGroup": "demoRg",
      "status": "managed"
    }
  ],
  "systemData": {
    "createdAt": "2024-05-17T16:07:51.172012+00:00",
    "createdBy": "johndoe@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2024-05-17T16:07:51.172012+00:00",
    "lastModifiedBy": "johndoe@contoso.com",
    "lastModifiedByType": "User"
  },
  "tags": {},
  "template": null,
  "templateLink": {
    "contentVersion": null,
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/templateSpecRG/providers/Microsoft.Resources/templateSpecs/stackSpec/versions/1.0",
    "queryString": null,
    "relativePath": null,
    "resourceGroup": "templateSpecRG",
    "uri": null
  },
  "type": "Microsoft.Resources/deploymentStacks"
}
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack `
  -ResourceGroupName "demoRg" `
  -Name "demoStack"
```

The output shows two managed resources - one virtual network, and one storage account:

```output
Id                            : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack
Name                          : demoStack
ProvisioningState             : succeeded
resourcesCleanupAction        : detach
resourceGroupsCleanupAction   : detach
managementGroupsCleanupAction : detach
CorrelationId                 : e91d07b8-90f0-48f4-b876-07fcadcc4c66
DenySettingsMode              : none
CreationTime(UTC)             : 5/17/2024 3:53:52 PM
DeploymentId                  : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deployments/demoStack-24051715frp6o
Resources                     : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk
                                /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk
```

---

You can also verify the deployment by list the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --output 'json'
```

The output is similar to:

```output
{
  "actionOnUnmanage": {
    "managementGroups": "detach",
    "resourceGroups": "detach",
    "resources": "detach"
  },
  "debugSetting": null,
  "deletedResources": [],
  "denySettings": {
    "applyToChildScopes": false,
    "excludedActions": null,
    "excludedPrincipals": null,
    "mode": "none"
  },
  "deploymentId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deployments/demoStack-240517162aqmf",
  "deploymentScope": null,
  "description": null,
  "detachedResources": [],
  "duration": "PT30.5642429S",
  "error": null,
  "failedResources": [],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack",
  "location": null,
  "name": "demoStack",
  "outputs": null,
  "parameters": {},
  "parametersLink": null,
  "provisioningState": "succeeded",
  "resourceGroup": "demoRg",
  "resources": [
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk",
      "resourceGroup": "demoRg",
      "status": "managed"
    },
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk",
      "resourceGroup": "demoRg",
      "status": "managed"
    }
  ],
  "systemData": {
    "createdAt": "2024-05-17T16:07:51.172012+00:00",
    "createdBy": "johndoe@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2024-05-17T16:07:51.172012+00:00",
    "lastModifiedBy": "johndoe@contoso.com",
    "lastModifiedByType": "User"
  },
  "tags": {},
  "template": null,
  "templateLink": {
    "contentVersion": null,
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/templateSpecRG/providers/Microsoft.Resources/templateSpecs/stackSpec/versions/1.0",
    "queryString": null,
    "relativePath": null,
    "resourceGroup": "templateSpecRG",
    "uri": null
  },
  "type": "Microsoft.Resources/deploymentStacks"
}
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "demoStack" -ResourceGroupName "demoRg").Resources
```

The output is similar to:

```output
Status  DenyStatus Id
------  ---------- --
managed none       /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk
managed none       /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk
```

---

## Delete the deployment stack

To delete the deployment stack, and the managed resources:

# [CLI](#tab/azure-cli)

```azurecli
az stack group delete \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --action-on-unmanage 'deleteAll' 
```

To delete the deployment stack, but detach the managed resources. For example:

```azurecli
az stack group delete \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --action-on-unmanage 'detachAll' 
```

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -ActionOnUnmanage "deleteAll"
```

To delete the deployment stack, but detach the managed resources. For example:

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -ActionOnUnmanage "detachAll"
```

The following parameters can be used to control between detach and delete.

- `DeleteAll`: delete both resource groups and the managed resources.
- `DeleteResources`: delete the managed resources only.
- `DeleteResourceGroups`: delete the resource groups only.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

---

## Clean up resources

The remove command only remove the managed resources and managed resource groups. You still need to delete the resource group.

# [CLI](#tab/azure-cli)

```azurecli
az group delete \
  --name 'demoRg'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup `
  -Name "demoRg"
```

---

To delete the template spec and the resource group:

# [CLI](#tab/azure-cli)

```azurecli
az group delete \
  --name 'templateSpecRG'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name "templateSpecRG"
```

---

## Next steps

> [!div class="nextstepaction"]
> [Deployment stacks](./deployment-stacks.md)
