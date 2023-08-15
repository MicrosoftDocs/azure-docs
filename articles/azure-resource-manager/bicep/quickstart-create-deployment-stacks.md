---
title: Create and deploy a deployment stack with Bicep (Preview)
description: Learn how to use Bicep to create and deploy a deployment stack in your Azure subscription.
ms.date: 07/06/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
# Customer intent: As a developer I want to use Bicep to create a deployment stack.
---

# Quickstart: Create and deploy a deployment stack with Bicep

This quickstart describes how to create a [deployment stack](deployment-stacks.md).

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

## Create a deployment stack

In this quickstart, you create the deployment stack at the resource group scope.  You can also create the deployment stack at the subscription scope or the management group scope.  For more information, see [Create deployment stacks](./deployment-stacks.md#create-deployment-stacks).

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name 'demoRg' \
  --location 'centralus'

az stack group create \
  --name demoStack \
  --resource-group 'demoRg' \
  --template-file './main.bicep' \
  --deny-settings-mode 'none'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name "demoRg" `
  -Location "eastus"

New-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

## Verify the deployment

To list the deployed deployment stacks at the resource group level:

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
Get-AzResourceGroupDeploymentStack `
  -ResourceGroupName "demoRg" `
  -Name "demoStack"
```

The output shows two managed resources - one storage account and one virtual network:

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

Once a stack is created, you can access and view both the stack itself and the managed resources associated with it through the Azure portal. Navigate to the resource group where the stack has been deployed, and you can access all the relevant information and settings.

:::image type="content" source="./media/quickstart-create-deployment-stacks/deployment-stack-portal.png" alt-text="Screenshot of a deployment stack in the Azure portal.":::

## Update the deployment stack

To update a deployment stack, you can modify the underlying Bicep file and rerunning the create deployment stack command.

Edit **main.bicep** to change the sku name to `Standard_GRS` from `Standard_LRS`:

Run the following command:

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --template-file './main.bicep' \
  --deny-settings-mode 'none'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupname "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

From the Azure portal, check the properties of the storage account to confirm the change.

Using the same method, you can add a resource to the deployment stack or remove a managed resource from the deployment stack.  For more information, see [Add resources to a deployment stack](./deployment-stacks.md#add-resources-to-deployment-stack) and [Delete managed resources from a deployment stack](./deployment-stacks.md#delete-managed-resources-from-deployment-stack).

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
- `--delete-resource-groups`: Delete the resource groups only. It's invalid to use `delete-resource-groups` by itself. `delete-resource-groups` must be used together with `delete-resources`.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
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
- `DeleteResourceGroups`: delete the resource groups only. It's invalid to use `DeleteResourceGroups` by itself. `DeleteResourceGroups` must be used together with `DeleteResources`.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

---

The remove command exclusively removes managed resources and managed resource groups. You are still responsible for deleting the resource groups that are not managed by the deployment stack.

## Clean up resources

Delete the unmanaged resource group.

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
