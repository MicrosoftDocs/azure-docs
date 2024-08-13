---
description: Learn how to rotate Azure Fluid Relay access keys
title: Rotate Azure Fluid Relay access keys
ms.date: 08/13/2024
ms.service: azure-fluid
ms.topic: reference
---

# How to rotate Fluid Relay Server access keys
This article provides an overview of managing access keys (tenant keys) in Azure Fluid Relay. 

## Primary / Secondary keys
Customers use the access keys to sign access tokens used to access Azure Fluid Relay resources, and Azure Fluid Relay uses the keys to validate the tokens. 

Two keys are associated with each AFR resource: a primary key and secondary key. The purpose of dual keys is to let you regenerate, or roll, keys, providing continuous access to your account and data. 

## View your access keys

### [Azure Portal](#tab/azure-portal)
To see your access keys, on the left menu select **Settings**. Then, select **Access Keys**. Select the **Copy** button to copy the selected key.

    :::image type="content" source="../images/rotate-tenant-keys.png" alt-text="A screenshot of the access keys page on the Azure portal.":::

### [PowerShell](#tab/azure-powershell)
To retrieve your access keys with PowerShell, call the [Get-AzFluidRelayServerKey](/powershell/module/az.fluidrelay/get-azfluidrelayserverkey) command. 


```azurepowershell
Get-AzFluidRelayServerKey -FluidRelayServerName <Fluid Relay resource name> -ResourceGroup <resource group> -SubscriptionId <subscription id> 
```

### [Azure CLI](#tab/azure-cli)
To retrieve your access keys with Azure CLI, use [az fluid-relay server list-key command](/cli/azure/fluid-relay/server?view=azure-cli-latest#az-fluid-relay-server-list-key).

```azurecli
az fluid-relay server list-key --resource-group <resource group> --server-name <Fluid Relay resource name> 
```

## Rotate your access keys
Two access keys are assigned so that you can rotate your keys. Having two keys ensures that your application maintains access to Azure Fluid Relay throughout the process. You should rotate one of two keys at one time to avoid service interruptions. 

The process of rotating primary and secondary keys is the same. The following steps are for primary keys.

### [Azure Portal](#tab/azure-portal)
To rotate your Azure Fluid Relay primary key in the Azure portal: 

1. Update the access keys in your application code to use the secondary access key for the Azure Fluid Relay. 

2. Navigate to your Fluid Relay resource in the Azure portal. 

3. Under **Settings**, select **Access key**.

4. To regenerate the primary access key for your Azure Fluid Relay resource, select the **Regenerate Primary Key** button above the Access Information. 

5. Update the primary key in your code to reference the new primary access key. 

### [PowerShell](#tab/azure-powershell)
To rotate your Fluid Relay primary key with PowerShell: 

1. Update the access keys in your application code to use the secondary access key for the Azure Fluid Relay. 

2. Call the [New-AzFluidRelayServerKey](/powershell/module/az.fluidrelay/new-azfluidrelayserverkey) command to regenerate the primary access key, as shown in the following example:

 
```azurepowershell
New-AzFluidRelayServerKey -FluidRelayServerName <Fluid Relay resource name> -ResourceGroup <resource group> -KeyName <key name> 
```

3. Update the primary key in your code to reference the new primary access key. 

### [Azure CLI](#tab/azure-cli)
To rotate your Fluid Relay primary key with Azure CLI: 

1. Update the access keys in your application code to use the secondary access key for the Azure Fluid Relay. 

2. Call the [az fluid-relay server regenerate-key](/cli/azure/fluid-relay/server?view=azure-cli-latest#az-fluid-relay-server-regenerate-key) command to regenerate the primary access key, as shown in the following example: 

```azurecli
az fluid-relay server regenerate-key --resource-group <resource group>--server-name <Fluid Relay resource name>--key-name <key name> 
```

3. Update the primary key in your code to reference the new primary access key. 
