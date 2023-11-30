---
title: Use deployment stack with Bicep
description: Learn how to use Bicep to create and deploy a deployment stack.
ms.date: 07/06/2023
ms.topic: tutorial
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
---

# Tutorial: use deployment stack with Bicep (Preview)

In this tutorial, you learn the process of creating and managing a deployment stack. The tutorial focuses on creating the deployment stack at the resource group scope. However, you can also create deployment stacks at either the subscription scope. To gain further insights into creating deployment stacks, see [Create deployment stacks](./deployment-stacks.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell [version 10.1.0 or later](/powershell/azure/install-az-ps) or Azure CLI [version 2.50.0 or later](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

## Create a Bicep file

Create a Bicep file in Visual Studio Code to create a storage account and a virtual network. This file is used to create your deployment stack.

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

To create a resource group and a deployment stack, execute the following commands, ensuring you provide the appropriate Bicep file path based on your execution location.

# [CLI](#tab/azure-cli)

```azurecli
az group create \
  --name 'demoRg' \
  --location 'centralus'

az stack group create \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --template-file './main.bicep' \
  --deny-settings-mode 'none'
```

The `deny-settings-mode` switch assigns a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals. For more information, see [Protect managed resources against deletion](./deployment-stacks.md#protect-managed-resources-against-deletion).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name "demoRg" `
  -Location "centralus"

New-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

The `DenySettingsMode` switch assigns a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals. For more information, see [Protect managed resources against deletion](./deployment-stacks.md#protect-managed-resources-against-deletion).

---

## List the deployment stack and the managed resources

To verify the deployment, you can list the deployment stack and list the managed resources of the deployment stack.

To list the deployed deployment stack:

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

You can also verify the deployment by listing the managed resources in the deployment stack:

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

## Update the deployment stack

To update a deployment stack, make the necessary modifications to the underlying Bicep file, and then rerun the command for creating the deployment stack or use the set command in Azure PowerShell.

In this tutorial, you perform the following activities:

- Update a property of a managed resource.
- Add a resource to the stack.
- Detach a managed resource.
- Attach an existing resource to the stack.
- Delete a managed resource.

### Update a managed resource

At the end of the previous step, you have one stack with two managed resources. You will update a property of the storage account resource.

Edit the **main.bicep** file to change the sku name from `Standard_LRS` to `Standard_GRS`:

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_GRS'
  }
}
```

Update the managed resource by running the following command:

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --template-file './main.bicep' \
  --deny-settings-mode 'none'
```

# [PowerShell](#tab/azure-powershell)

The following sample shows the set command. You can also use the `Create-AzResourceGroupDeploymentStack` commandlet.

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

You can verify the SKU property by running the following command:

# [CLI](#tab/azure-cli)

az resource list --resource-group 'demoRg'

# [PowerShell](#tab/azure-powershell)

Get-azStorageAccount -ResourceGroupName "demoRg"

---

### Add a managed resource

At the end of the previous step, you have one stack with two managed resources. You will add one more storage account resource to the stack.

Edit the **main.bicep** file to include another storage account definition:

```bicep
resource storageAccount1 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '1${storageAccountName}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

Update the deployment stack by running the following command:

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
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

You can verify the deployment by listing the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --output 'json'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "demoStack" -ResourceGroupName "demoRg").Resources
```

---

You shall see the new storage account in addition to the two existing resources.

### Detach a managed resource

At the end of the previous step, you have one stack with three managed resources. You will detach one of the managed resources. After the resource is detached, it will remain in the resource group.

Edit the **main.bicep** file to remove the following storage account definition from the previous step:

```bicep
resource storageAccount1 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '1${storageAccountName}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

Update the deployment stack by running the following command:

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
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

You can verify the deployment by listing the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --output 'json'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "demoStack" -ResourceGroupName "demoRg").Resources
```

---

You shall see two managed resources in the stack. However, the detached the resource is still listed in the resource group. You can list the resources in the resource group by running the following command:

# [CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group 'demoRg'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-azResource -ResourceGroupName "demoRg"
```

There are three resources in the resource group, even though the stack only contains two resources.

---

### Attach an existing resource to the stack

At the end of the previous step, you have one stack with two managed resources. There is an unmanaged resource in the same resource group as the managed resources. You will attach this unmanaged resource to the stack.

Edit the **main.bicep** file to include the storage account definition of the unmanaged resource:

```bicep
resource storageAccount1 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '1${storageAccountName}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

Update the deployment stack by running the following command:

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
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

You can verify the deployment by listing the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --output 'json'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "demoStack" -ResourceGroupName "demoRg").Resources
```

---

You shall see three managed resources.

### Delete a managed resource

At the end of the previous step, you have one stack with three managed resources. In one of the previous steps, you detached a managed resource. Sometimes, you might want to delete a resource instead of detaching one. To delete a resource, you use a delete-resources switch with the create/set command.

Edit the **main.bicep** file to remove the following storage account definition:

```bicep
resource storageAccount1 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '1${storageAccountName}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

Run the following command with the delete-resources switch:

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --template-file './main.bicep' \
  --deny-settings-mode 'none' \
  --delete-resources
```

In addition to the `delete-resources` switch, there are two other switches available: `delete-all` and `delete-resource-groups`. For more information, see [Control detachment and deletion](./deployment-stacks.md#control-detachment-and-deletion).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none" `
  -DeleteResources
```

In addition to the `DeleteResources` switch, there are two other switches available: `DeleteAll` and `DeleteResourceGroups`. For more information, see [Control detachment and deletion](./deployment-stacks.md#control-detachment-and-deletion).

---

You can verify the deployment by listing the managed resources in the deployment stack:

# [CLI](#tab/azure-cli)

```azurecli
az stack group show \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --output 'json'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzResourceGroupDeploymentStack -Name "demoStack" -ResourceGroupName "demoRg").Resources
```

---

You shall see two managed resources in the stack. The resource is also removed from the resource group. You can verify the resource group by running the following command:

# [CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group 'demoRg'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-azResource -ResourceGroupName "demoRg"
```

---

## Configure deny settings

When creating a deployment stack, it is possible to assign a specific type of permissions to the managed resources, which prevents their deletion by unauthorized security principals. These settings are refereed as deny settings.

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell includes these parameters to customize the deny assignment:

- `DenySettingsMode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `None`, `DenyDelete`, and `DenyWriteAndDelete`.
- `DenySettingsApplyToChildScopes`: Deny settings are applied to child Azure management scopes.
- `DenySettingsExcludedActions`: List of role-based management operations that are excluded from the deny settings. Up to 200 actions are permitted.
- `DenySettingsExcludedPrincipals`: List of Microsoft Entra principal IDs excluded from the lock. Up to five principals are permitted.

# [CLI](#tab/azure-cli)

The Azure CLI includes these parameters to customize the deny assignment:

- `deny-settings-mode`: Defines the operations that are prohibited on the managed resources to safeguard against unauthorized security principals attempting to delete or update them. This restriction applies to everyone unless explicitly granted access. The values include: `none`, `denyDelete`, and `denyWriteAndDelete`.
- `deny-settings-apply-to-child-scopes`: Deny settings are applied to child Azure management scopes.
- `deny-settings-excluded-actions`: List of role-based access control (RBAC) management operations excluded from the deny settings. Up to 200 actions are allowed.
- `deny-settings-excluded-principals`: List of Microsoft Entra principal IDs excluded from the lock. Up to five principals are allowed.

---

In this tutorial, you configure the deny settings mode. For more information about other deny settings, see [Protect managed resources against deletion](./deployment-stacks.md#protect-managed-resources-against-deletion).

At the end of the previous step, you have one stack with two managed resources.

Run the following command with the deny settings mode switch set to deny-delete:

# [CLI](#tab/azure-cli)

```azurecli
az stack group create \
  --name 'demoStack' \
  --resource-group 'demoRg' \
  --template-file './main.bicep' \
  --deny-settings-mode 'denyDelete'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "DenyDelete"
```

---

The following delete command shall fail because the deny settings mode is set to deny-delete:

# [CLI](#tab/azure-cli)

```azurecli
az resource delete \
  --resource-group 'demoRg' \
  --name '<storage-account-name>' \
  --resource-type 'Microsoft.Storage/storageAccounts'
```

# [PowerShell](#tab/azure-powershell)

Remove-AzResource `
  -ResourceGroupName "demoRg" `
  -ResourceName "\<storage-account-name\>" `
  -ResourceType "Microsoft.Storage/storageAccounts"

---

Update the stack with the deny settings mode to none, so you can complete the rest of the tutorial:

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
  -ResourceGroupName "demoRg" `
  -TemplateFile "./main.bicep" `
  -DenySettingsMode "none"
```

---

## Export template from the stack

By exporting a deployment stack, you can generate a Bicep file. This Bicep file serves as a resource for future development and subsequent deployments.

# [CLI](#tab/azure-cli)

```azurecli
az stack group export \
  --name 'demoStack' \
  --resource-group 'demoRg'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzResourceGroupDeploymentStack `
  -Name "demoStack" `
  -ResourceGroupName "demoRg" `
```

---

You can pipe the output to a file.

## Delete the deployment stack

To delete the deployment stack, and the managed resources, run the following command:

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
- `DeleteResourceGroups`: delete the resource groups only.

For more information, see [Delete deployment stacks](./deployment-stacks.md#delete-deployment-stacks).

---

## Next steps

> [!div class="nextstepaction"]
> [Deployment stacks](./deployment-stacks.md)
