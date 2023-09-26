---
title: Create and deploy a deployment stack with Bicep from template specs
description: Learn how to use Bicep to create and deploy a deployment stack from template specs.
ms.date: 07/06/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
# Customer intent: As a developer I want to use Bicep to create a deployment stack from a template spec.
---

# Quickstart: Create and deploy a deployment stack with Bicep from template specs (Preview)

This quickstart describes how to create a [deployment stack](deployment-stacks.md) from a template spec.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell [version 10.1.0 or later](/powershell/azure/install-az-ps) or Azure CLI [version 2.50.0 or later](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

## Create a Bicep file

Create a Bicep file to create a storage account and a virtual network.

```bicep
param resourceGroupLocation string = resourceGroup().location
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
param vnetName string = 'vnet${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: resourceGroupLocation
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2022-11-01' = {
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

id=$(az ts show --name stackSpec --resource-group templateSpecRG --version "1.0" --query "id")

az stack group create \
  --name demoStack \
  --resource-group 'demoRg' \
  --template-spec $id \
  --deny-settings-mode 'none'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name "demoRg" `
  -Location "eastus"

$id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name stackSpec -Version "1.0").Versions.Id

New-AzResourceGroupDeploymentStack `
  -Name 'demoStack' `
  -ResourceGroupName 'demoRg' `
  -TemplateSpecId $id `
  -DenySettingsMode none
```

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
  "deploymentId": "/subscriptions/00000000-0000-0000-0000-000000000000/demoRg/providers/Microsoft.Resources/deployments/demoStack-2023-06-08-14-58-28-fd6bb",
  "deploymentScope": null,
  "description": null,
  "detachedResources": [],
  "duration": "PT30.1685405S",
  "error": null,
  "failedResources": [],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack",
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
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/demoRg/providers/Microsoft.Network/virtualNetworks/vnetthmimleef5fwk",
      "resourceGroup": "demoRg",
      "status": "managed"
    },
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/demoRg/providers/Microsoft.Storage/storageAccounts/storethmimleef5fwk",
      "resourceGroup": "demoRg",
      "status": "managed"
    }
  ],
  "systemData": {
    "createdAt": "2023-06-08T14:58:28.377564+00:00",
    "createdBy": "johndole@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-06-08T14:58:28.377564+00:00",
    "lastModifiedBy": "johndole@contoso.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "template": null,
  "templateLink": null,
  "type": "Microsoft.Resources/deploymentStacks"
}
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack -ResourceGroupName demoRg -Name demoStack
```

The output shows two managed resources - one virtual network, and one storage account:

```output
Id                          : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack
Name                        : demoStack
ProvisioningState           : succeeded
ResourcesCleanupAction      : detach
ResourceGroupsCleanupAction : detach
DenySettingsMode            : none
CreationTime(UTC)           : 6/5/2023 8:55:48 PM
DeploymentId                : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deployments/demoStack-2023-06-05-20-55-48-38d09
Resources                   : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetzu6pnx54hqubm
                              /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storezu6pnx54hqubm
```

---

You can also verify the deployment by list the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name 'demoStack'
  --resource-group 'demoRg'
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
  "deploymentId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Resources/deployments/demoStack-2023-06-05-20-55-48-38d09",
  "deploymentScope": null,
  "description": null,
  "detachedResources": [],
  "duration": "PT29.006353S",
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
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetzu6pnx54hqubm",
      "resourceGroup": "demoRg",
      "status": "managed"
    },
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storezu6pnx54hqubm",
      "resourceGroup": "demoRg",
      "status": "managed"
    }
  ],
  "systemData": {
    "createdAt": "2023-06-05T20:55:48.006789+00:00",
    "createdBy": "johndole@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-06-05T20:55:48.006789+00:00",
    "lastModifiedBy": "johndole@contoso.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "template": null,
  "templateLink": null,
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
managed none       /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetzu6pnx54hqubm
managed none       /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storezu6pnx54hqubm
```

---

## Delete the deployment stack

To delete the deployment stack, and the managed resources:

# [CLI](#tab/azure-cli)

```azurecli
az stack group delete \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --delete-all
```

If you run the delete commands without the **delete all** parameters, the managed resources are detached but not deleted. For example:

```azurecli
az stack group delete \
  --name 'demoStack' \
  --resource-group 'demoRg'
```

The following parameters can be used to control between detach and delete.

- `--delete-all`: Delete both the resources and the resource groups.
- `--delete-resources`: Delete the resources only.
- `--delete-resource-groups`: Delete the resource groups only.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name demoStack `
  -ResourceGroupName demoRg `
  -DeleteAll
```

If you run the delete commands without the **delete all** parameters, the managed resources are detached but not deleted. For example:

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg"
```

The following parameters can be used to control between detach and delete.

- `DeleteAll`: delete both resource groups and the managed resources.
- `DeleteResources`: delete the managed resources only.
- `DeleteResourceGroups`: delete the resource groups only.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

---

## Clean up resources

The remove command only remove the managed resources and managed resource groups. You still need to delete the resource group.

# [CLI](#tab/CLI)

```azurecli
az group delete --name 'demoRg'
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name "demoRg"
```

---

## Next steps

> [!div class="nextstepaction"]
> [Deployment stacks](./deployment-stacks.md)
