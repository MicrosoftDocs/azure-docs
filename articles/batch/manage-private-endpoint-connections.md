---
title: Manage private endpoint connections with Azure Batch accounts
description: Learn how to manage private endpoint connections with Azure Batch accounts, including list, approve, reject and remove.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 05/26/2022
---

# Manage private endpoint connections with Azure Batch accounts

You can query and manage all existing private endpoint connections for your Batch account. Supported management operations include:

- Approve a pending connection.
- Reject a connection (either in pending or approved state).
- Remove a connection, which will remove the connection from Batch account and mark the associated private endpoint resource as Disconnected state.

## Azure portal

1. Go to your Batch account in Azure portal.
1. In **Settings**, select **Networking** and go to tab **Private Access**.
1. Select the private connection, then perform the Approve/Reject/Remove operation.

   :::image type="content" source="media/private-connectivity/manage-private-connections.png" alt-text="Screenshot of managing private endpoint connections.":::

## Az PowerShell module

Examples using Az PowerShell module [`Az.Network`](/powershell/module/az.network#networking):

```PowerShell
$accountResourceId = "/subscriptions/<subscription>/resourceGroups/<rg>/providers/Microsoft.Batch/batchAccounts/<account>"
$pecResourceId = "$accountResourceId/privateEndpointConnections/<pe-connection-name>"

# List all private endpoint connections for Batch account
Get-AzPrivateEndpointConnection -PrivateLinkResourceId $accountResourceId

# Show the specified private endpoint connection
Get-AzPrivateEndpointConnection -ResourceId $pecResourceId

# Approve connection
Approve-AzPrivateEndpointConnection -Description "Approved!" -ResourceId $pecResourceId

# Reject connection
Deny-AzPrivateEndpointConnection -Description "Rejected!" -ResourceId $pecResourceId

# Remove connection
Remove-AzPrivateEndpointConnection -ResourceId $pecResourceId
```

## Azure CLI

Examples using Azure CLI ([`az network private-endpoint`](/cli/azure/network/private-endpoint)):

```sh
accountResourceId="/subscriptions/<subscription>/resourceGroups/<rg>/providers/Microsoft.Batch/batchAccounts/<account>"
pecResourceId="$accountResourceId/privateEndpointConnections/<pe-connection-name>"

# List all private endpoint connections for Batch account
az network private-endpoint-connection list --id $accountResourceId

# Show the specified private endpoint connection
az network private-endpoint-connection show --id $pecResourceId

# Approve connection
az network private-endpoint-connection approve --description "Approved!" --id $pecResourceId

# Reject connection
az network private-endpoint-connection reject --description "Rejected!" --id $pecResourceId

# Remove connection
az network private-endpoint-connection delete --id $pecResourceId
```
