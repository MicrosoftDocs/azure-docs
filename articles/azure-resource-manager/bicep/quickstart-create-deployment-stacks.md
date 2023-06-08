---
title: Create and deploy a deployment stack with Bicep
description: Learn how to use Bicep to create and deploy a deployment stack in your Azure subscription.
ms.date: 06/06/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
# Customer intent: As a developer I want to use Bicep to create a deployment stack.
---

# Quickstart: Create and deploy a deployment stack with Bicep

This quickstart describes how to create a [deployment stack](deployment-stacks.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell [version xxx or later](/powershell/azure/install-az-ps) or Azure CLI [version xxx or later](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

## Create Bicep files

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

## Create a deployment stack

In this quickstart, you'll create the deployment stack at the resource group scope.  You can also create the deployment stack at the subscription scope or the management group scope.  For more information, see [Create deployment stacks](./deployment-stacks.md#create-deployment-stacks).

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name myRgStackRg \
  --location centralus

az stack group create \
  --name myRgStackRgStack \
  --resource-group 'myRgStackRg' \
  --template-file ./main.bicep \
  --deny-settings-mode none
```

jgao: test --deny-settings-mode none when it is available.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name myRgStackRg `
  -Location eastus

New-AzResourceGroupDeploymentStack `
  -Name 'myRgStackRgStack' `
  -ResourceGroupName 'myRgStackRg' `
  -TemplateFile './main.bicep' `
  -DenySettingsMode none
```

---

## Verify the deployment

To list the deployed deployment stacks at the subscription level:

# [CLI](#tab/azure-cli)

```azurecli
az stack group list --resource-group myRgStackRg
```

The output shows four managed resource - two resource groups and two public IPs:

```output
jgao: fill this part
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceGroupDeploymentStack -ResourceGroupName myRgStackRg
```

The output shows four managed resource - two resource groups and two public IPs:

```output
Id                          : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRgStackRg/providers/Microsoft.Resources/deploymentStacks/myRgStackRgStack
Name                        : myRgStackRgStack
ProvisioningState           : succeeded
ResourcesCleanupAction      : detach
ResourceGroupsCleanupAction : detach
DenySettingsMode            : none
CreationTime(UTC)           : 6/5/2023 8:55:48 PM
DeploymentId                : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRgStackRg/providers/Microsoft.Resources/deployments/myRgStackRgStack-2023-06-05-20-55-48-38d09
Resources                   : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRgStackRg/providers/Microsoft.Network/virtualNetworks/vnetzu6pnx54hqubm
                              /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRgStackRg/providers/Microsoft.Storage/storageAccounts/storezu6pnx54hqubm
```

---

You can also verify the deployment by list the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show --name myRgStackRgStack --resource-group myStackRg --output json
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
  "deploymentId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myStackRg/providers/Microsoft.Resources/deployments/myRgStackRgStack-2023-06-05-20-55-48-38d09",
  "deploymentScope": null,
  "description": null,
  "detachedResources": [],
  "duration": "PT29.006353S",
  "error": null,
  "failedResources": [],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myStackRg/providers/Microsoft.Resources/deploymentStacks/myRgStackRgStack",
  "location": null,
  "name": "myRgStackRgStack",
  "outputs": null,
  "parameters": {},
  "parametersLink": null,
  "provisioningState": "succeeded",
  "resourceGroup": "myStackRg",
  "resources": [
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myStackRg/providers/Microsoft.Network/virtualNetworks/vnetzu6pnx54hqubm",
      "resourceGroup": "myStackRg",
      "status": "managed"
    },
    {
      "denyStatus": "none",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myStackRg/providers/Microsoft.Storage/storageAccounts/storezu6pnx54hqubm",
      "resourceGroup": "myStackRg",
      "status": "managed"
    }
  ],
  "systemData": {
    "createdAt": "2023-06-05T20:55:48.006789+00:00",
    "createdBy": "jgao@microsoft.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-06-05T20:55:48.006789+00:00",
    "lastModifiedBy": "jgao@microsoft.com",
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
(Get-AzResourceGroupDeploymentStack -Name myRgStackRgStack -ResourceGroupName myRgStackRg).Resources
```

The output is similar to:

```output
Status  DenyStatus Id
------  ---------- --
managed none       /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myStackRg/providers/Microsoft.Network/virtualNetworks/vnetzu6pnx54hqubm
managed none       /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myStackRg/providers/Microsoft.Storage/storageAccounts/storezu6pnx54hqubm
```

---

## Update the deployment stack

To update a deployment stack, you can modify the underlying Bicep file and re-running the create deployment stack command.

Edit **main.bicep** to set the sku name to `Standard_GRS` from `Standard_LRS`:

Run the following command:

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name mySubStack \
  --resource-group myRgStackRg \
  --template-file ./main.bicep \
  --deny-settings-mode none
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name 'mySubStack' `
  -ResourceGroupname 'myRgStackRg' `
  -TemplateFile './main.bicep' `
  -DenySettingsMode none
```

---

From the Azure portal, check the properties of the storage account to confirm the change.

Using the same method, you can add a resource to the deployment stack or remove a managed resource from the deployment stack.  For more information, see [Add resources to a deployment stack](./deployment-stacks.md#add-resources-to-deployment-stack) and [Delete managed resources from a deployment stack](./deployment-stacks.md#delete-managed-resources-from-deployment-stack).

## Delete the deployment stack

To delete the deployment stack, and the managed resources:

# [CLI](#tab/azure-cli)

```azurecli
az stack group delete \
  --name mySubStack \
  --resource-group myRgStackRg \
  --delete-all
```

If you run the delete commands without the **delete all** parameters, the managed resources will be detached but not deleted. For example:

```azurecli
az stack group delete \
  --name mySubStack \
  --resource-group myRgStackRg
```

The following parameters can be used to control between detach and delete.

- `--delete-all`: Delete both the resources and the resource groups.
- `--delete-resources`: Delete the resources only.
- `--delete-resource-groups`: Delete the resource groups only.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name mySubStack `
  -ResourceGroupName myRgStackRg `
  -DeleteAll
```

If you run the delete commands without the **delete all** parameters, the managed resources will be detached but not deleted. For example:

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name mySubStack `
  -ResourceGroupName myRgStackRg
```

The following parameters can be used to control between detach and delete.

- `DeleteAll`: delete both resource groups and the managed resources.
- `DeleteResources`: delete the managed resources only.
- `DeleteResourceGroups`: delete the resource groups only.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

---

## Next steps

> [!div class="nextstepaction"]
> [Deployment stacks](./deployment-stacks.md)
