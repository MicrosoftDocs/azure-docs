---
title: Manage Azure private endpoints
titleSuffix: Azure Private Link
description: Learn how to manage private endpoints in Azure.
services: private-link
author: abell
ms.service: private-link
ms.topic: how-to
ms.date: 03/28/2024
ms.author: abell 
ms.custom: devx-track-azurepowershell, template-how-to, devx-track-azurecli
---

# Manage Azure private endpoints

Azure private endpoints have several options for managing their configuration and deployment.

You can determine `GroupId` and `MemberName` values by querying the Azure Private Link resource. You need the `GroupId` and `MemberName` values to configure a static IP address for a private endpoint during creation.

A private endpoint has two custom properties: static IP address and network interface name. These properties must be set when the private endpoint is created.

With a service provider and consumer deployment of Private Link, an approval process is in place to make the connection.

## Determine GroupID and MemberName

During the creation of a private endpoint with Azure PowerShell and the Azure CLI, the `GroupId` and `MemberName` values of the private endpoint resource might be needed.

* `GroupId` is the subresource of the private endpoint.
* `MemberName` is the unique stamp for the private IP address of the endpoint.

For more information about private endpoint subresources and their values, see [Private Link resource](private-endpoint-overview.md#private-link-resource).

To determine the values of `GroupId` and `MemberName` for your private endpoint resource, use the following commands. `MemberName` is contained within the `RequiredMembers` property.

# [**PowerShell**](#tab/manage-private-link-powershell)

An Azure web app is used as the example private endpoint resource. Use [Get-AzPrivateLinkResource](/powershell/module/az.network/get-azprivatelinkresource) to determine the values for `GroupId` and `MemberName`.

```azurepowershell
## Place the previously created webapp into a variable. ##
$webapp = 
Get-AzWebApp -ResourceGroupName myResourceGroup -Name myWebApp1979

$resource = 
Get-AzPrivateLinkResource -PrivateLinkResourceId $webapp.ID
```

You should receive an output similar to the following example.

:::image type="content" source="./media/manage-private-endpoint/powershell-output.png" alt-text="Screenshot that shows the PowerShell output of the command.":::

# [**Azure CLI**](#tab/manage-private-link-cli)

An Azure web app is used as the example private endpoint resource. Use [az network private-link-resource list](/cli/azure/network/private-link-resource#az-network-private-link-resource-list) to determine `GroupId` and `MemberName`. The parameter `--type` requires the namespace for the Private Link resource. For the web app used in this example, the namespace is `Microsoft.Web/sites`. To determine the namespace for your Private Link resource, see [Azure services DNS zone configuration](private-endpoint-dns.md#azure-services-dns-zone-configuration).

```azurecli
az network private-link-resource list \
    --resource-group MyResourceGroup \
    --name myWebApp1979 \
    --type Microsoft.Web/sites
```

You should receive an output similar to the following example.

:::image type="content" source="./media/manage-private-endpoint/cli-output.png" alt-text="Screenshot that shows the PowerShell output of command.":::

---

## Custom properties

Network interface rename and static IP address assignment are custom properties that you can set on a private endpoint during creation.

### Network interface rename

By default, when a private endpoint is created the network interface associated with the private endpoint is given a random name for its network interface. The network interface must be named when the private endpoint is created. The renaming of the network interface of an existing private endpoint is unsupported.

Use the following commands when you create a private endpoint to rename the network interface.

# [**PowerShell**](#tab/manage-private-link-powershell)

To rename the network interface when the private endpoint is created, use the `-CustomNetworkInterfaceName` parameter. The following example uses an Azure PowerShell command to create a private endpoint to an Azure web app. For more information, see [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint).

```azurepowershell
## Place the previously created webapp into a variable. ##
$webapp = Get-AzWebApp -ResourceGroupName myResourceGroup -Name myWebApp1979

## Create the private endpoint connection. ## 
$pec = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec

## Place the virtual network you created previously into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'myResourceGroup' -Name 'myVNet'

## Create the private endpoint. ##
$pe = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPrivateEndpoint'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    PrivateLinkServiceConnection = $privateEndpointConnection
    CustomNetworkInterfaceName = 'myPrivateEndpointNIC'
}
New-AzPrivateEndpoint @pe

```

# [**Azure CLI**](#tab/manage-private-link-cli)

To rename the network interface when the private endpoint is created, use the `--nic-name` parameter. The following example uses an Azure PowerShell command to create a private endpoint to an Azure web app. For more information, see [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create).

```azurecli
id=$(az webapp list \
    --resource-group myResourceGroup \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --connection-name myConnection \
    --name myPrivateEndpoint \
    --private-connection-resource-id $id \
    --resource-group myResourceGroup \
    --subnet myBackendSubnet \
    --group-id sites \
    --nic-name myPrivateEndpointNIC \
    --vnet-name myVNet
```

---

### Static IP address

By default, when a private endpoint is created, the IP address for the endpoint is automatically assigned. The IP is assigned from the IP range of the virtual network configured for the private endpoint. A situation can arise when a static IP address for the private endpoint is required. The static IP address must be assigned when the private endpoint is created. The configuration of a static IP address for an existing private endpoint is currently unsupported.

For procedures to configure a static IP address when you create a private endpoint, see [Create a private endpoint using Azure PowerShell](create-private-endpoint-powershell.md) and [Create a private endpoint using the Azure CLI](create-private-endpoint-cli.md).

## Private endpoint connections

Private Link works on an approval model where the Private Link consumer can request a connection to the service provider for consuming the service.

The service provider can then decide whether to allow the consumer to connect or not. Private Link enables service providers to manage the private endpoint connection on their resources.

:::image type="content" source="./media/manage-private-endpoint/manage-private-endpoint.png" alt-text="Diagram that shows Private Link approval methods.":::

There are two connection approval methods that a Private Link consumer can choose from:

- **Automatic**: If the service consumer has Azure role-based access control (RBAC) permissions on the service provider resource, the consumer can choose the automatic approval method. When the request reaches the service provider resource, no action is required from the service provider and the connection is automatically approved.
- **Manual**: If the service consumer doesn't have RBAC permissions on the service provider resource, the consumer can choose the manual approval method. The connection request appears on the service resources as **Pending**. The service provider has to manually approve the request before connections can be established.

   In manual cases, the service consumer can also specify a message with the request to provide more context to the service provider. The service provider has the following options to choose from for all private endpoint connections: **Approve**, **Reject**, and **Remove**.

> [!IMPORTANT]
> To approve connections with a private endpoint that's in a separate subscription or tenant, ensure that the provider subscription or tenant has registered `Microsoft.Network`. The consumer subscription or tenant should also have the resource provider of the destination resource registered.

The following table shows the various service provider actions and the resulting connection states for private endpoints. The service provider can change the connection state at a later time without consumer intervention. The action updates the state of the endpoint on the consumer side.

| Service provider action  | Service consumer private endpoint state | Description |
|---------|---------|---------|
| None    |    Pending     |    Connection is created manually and is pending for approval by the Private Link resource owner.       |
| Approve    |  Approved       |  Connection is automatically or manually approved and is ready to be used.     |
| Reject     | Rejected        | The Private Link resource owner rejects the connection.     |
| Remove    |  Disconnected       | The Private Link resource owner removes the connection, causing the private endpoint to become disconnected and it should be deleted for cleanup.        |

## Manage private endpoint connections on Azure PaaS resources

Use the following steps to manage a private endpoint connection in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Private Link**. In the search results, select **Private link**.

1. In the **Private Link Center**, select **Private endpoints** or **Private link services**.

1. For each of your endpoints, you can view the number of private endpoint connections associated with it. You can filter the resources as needed.

1. Select the private endpoint. Under the connections listed, select the connection that you want to manage.

1. You can change the state of the connection by selecting from the options at the top.

## Manage private endpoint connections on a customer- or partner-owned Private Link service

Use the following PowerShell and Azure CLI commands to manage private endpoint connections on Microsoft partner services or customer-owned services.

# [**PowerShell**](#tab/manage-private-link-powershell)

Use the following PowerShell commands to manage private endpoint connections.

## Get Private Link connection states

Use [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to get the private endpoint connections and their states.

```azurepowershell
$get = @{
    Name = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Get-AzPrivateEndpointConnection @get
```

## Approve a private endpoint connection

Use [Approve-AzPrivateEndpointConnection](/powershell/module/az.network/approve-azprivateendpointconnection) to approve a private endpoint connection.

```azurepowershell
$approve = @{
    Name = 'myPrivateEndpointConnection'
    ServiceName = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Approve-AzPrivateEndpointConnection @approve
```

## Deny a private endpoint connection

Use [Deny-AzPrivateEndpointConnection](/powershell/module/az.network/deny-azprivateendpointconnection) to reject a private endpoint connection.

```azurepowershell
$deny = @{
    Name = 'myPrivateEndpointConnection'
    ServiceName = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Deny-AzPrivateEndpointConnection  @deny
```

## Remove a private endpoint connection

Use [Remove-AzPrivateEndpointConnection](/powershell/module/az.network/remove-azprivateendpointconnection) to remove a private endpoint connection.

```azurepowershell
$remove = @{
    Name = 'myPrivateEndpointConnection'
    ServiceName = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Remove-AzPrivateEndpointConnection @remove
```

# [**Azure CLI**](#tab/manage-private-link-cli)

Use the following Azure CLI commands to manage private endpoint connections.

## Get Private Link connection states

Use [az network private-endpoint-connection show](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-show) to get the private endpoint connections and their states.

```azurecli
  az network private-endpoint-connection show \
    --name myPrivateEndpointConnection \
    --resource-group myResourceGroup
```

## Approve a private endpoint connection

Use [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve a private endpoint connection.

```azurecli
  az network private-endpoint-connection approve \
    --name myPrivateEndpointConnection  \
    --resource-group myResourceGroup
```

## Deny a private endpoint connection

Use [az network private-endpoint-connection reject](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-reject) to reject a private endpoint connection.

```azurecli
  az network private-endpoint-connection reject \
    --name myPrivateEndpointConnection  \
    --resource-group myResourceGroup
```

## Remove a private endpoint connection

Use [az network private-endpoint-connection delete](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-delete) to remove a private endpoint connection.

```azurecli
  az network private-endpoint-connection delete \
    --name myPrivateEndpointConnection \
    --resource-group myResourceGroup
```

---

> [!NOTE]
> Connections previously denied can't be approved. You must remove the connection and create a new one.

## Next steps

- [Learn about private endpoints](private-endpoint-overview.md)
