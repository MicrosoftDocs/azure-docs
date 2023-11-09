---
title: Manage Azure Private Endpoints
titleSuffix: Azure Private Link
description: Learn how to manage private endpoints in Azure
services: private-link
author: asudbring
ms.service: private-link
ms.topic: how-to
ms.date: 05/17/2022
ms.author: allensu 
ms.custom: devx-track-azurepowershell, template-how-to, devx-track-azurecli
---

# Manage Azure Private Endpoints

Azure Private Endpoints have several options when managing the configuration and their deployment. 

**GroupId** and **MemberName** can be determined by querying the Private Link resource. The **GroupID** and **MemberName** values are needed to configure a static IP address for a private endpoint during creation. 

A private endpoint has two custom properties, static IP address and the network interface name. These properties must be set when the private endpoint is created.

With a service provider and consumer deployment of a Private Link Service, an approval process is in place to make the connection.

## Determine GroupID and MemberName

During the creation of a private endpoint with Azure PowerShell and Azure CLI, the **GroupId** and **MemberName** of the private endpoint resource might be needed. 

* **GroupId** is the subresource of the private endpoint.

* **MemberName** is the unique stamp for the private IP address of the endpoint.

For more information about Private Endpoint subresources and their values, see [Private-link resource](private-endpoint-overview.md#private-link-resource).

To determine the values of **GroupID** and **MemberName** for your private endpoint resource, use the following commands.  **MemberName** is contained within the **RequiredMembers** property.

# [**PowerShell**](#tab/manage-private-link-powershell)

An Azure WebApp is used as the example private endpoint resource. Use **[Get-AzPrivateLinkResource](/powershell/module/az.network/get-azprivatelinkresource)** to determine **GroupId** and **MemberName**.

```azurepowershell
## Place the previously created webapp into a variable. ##
$webapp = 
Get-AzWebApp -ResourceGroupName myResourceGroup -Name myWebApp1979

$resource = 
Get-AzPrivateLinkResource -PrivateLinkResourceId $webapp.ID
```

You should receive an output similar to the below example.

:::image type="content" source="./media/manage-private-endpoint/powershell-output.png" alt-text="Screenshot of the PowerShell output of command.":::

# [**Azure CLI**](#tab/manage-private-link-cli)

An Azure WebApp is used as the example private endpoint resource. Use **[az network private-link-resource list](/cli/azure/network/private-link-resource#az-network-private-link-resource-list)** to determine **GroupId** and **MemberName**. The parameter `--type` requires the namespace for the private link resource. For the webapp used in this example, the namespace is **Microsoft.Web/sites**. To determine the namespace for your private link resource, see **[Azure services DNS zone configuration](private-endpoint-dns.md#azure-services-dns-zone-configuration)**.

```azurecli
az network private-link-resource list \
    --resource-group MyResourceGroup \
    --name myWebApp1979 \
    --type Microsoft.Web/sites
```

You should receive an output similar to the below example.

:::image type="content" source="./media/manage-private-endpoint/cli-output.png" alt-text="Screenshot of the PowerShell output of command.":::

---

## Custom properties

Network interface rename and static IP address assignment are custom properties that can be set on a private endpoint when it's created. 

### Network interface rename

By default, when a private endpoint is created the network interface associated with the private endpoint is given a random name for its network interface. The network interface must be named when the private endpoint is created. The renaming of the network interface of an existing private endpoint is unsupported.

Use the following commands when creating a private endpoint to rename the network interface.

# [**PowerShell**](#tab/manage-private-link-powershell)

To rename the network interface when the private endpoint is created, use the `-CustomNetworkInterfaceName` parameter. The following example uses an Azure PowerShell command to create a private endpoint to an Azure WebApp. For more information, see **[New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint)**.

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

To rename the network interface when the private endpoint is created, use the `--nic-name` parameter. The following example uses an Azure PowerShell command to create a private endpoint to an Azure WebApp. For more information, see **[az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create)**.

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

By default, when a private endpoint is created the IP address for the endpoint is automatically assigned. The IP is assigned from the IP range of the virtual network configured for the private endpoint. A situation may arise when a static IP address for the private endpoint is required. The static IP address must be assigned when the private endpoint is created. The configuration of a static IP address for an existing private endpoint is currently unsupported.

For procedures to configure a static IP address when creating a private endpoint, see [Create a private endpoint using Azure PowerShell](create-private-endpoint-powershell.md) and [Create a private endpoint using the Azure CLI](create-private-endpoint-cli.md).

## Private endpoint connections

Azure Private Link works on an approval model where the Private Link service consumer can request a connection to the service provider for consuming the service. 

The service provider can then decide whether to allow the consumer to connect or not. Azure Private Link enables service providers to manage the private endpoint connection on their resources. 

:::image type="content" source="./media/manage-private-endpoint/manage-private-endpoint.png" alt-text="Diagram of Private Link approval methods.":::

There are two connection approval methods that a Private Link service consumer can choose from:

- **Automatic**: If the service consumer has Azure Role Based Access Control permissions on the service provider resource, the consumer can choose the automatic approval method. When the request reaches the service provider resource, no action is required from the service provider and the connection is automatically approved. 

- **Manual**: If the service consumer doesn’t have Azure Role Based Access Control permissions on the service provider resource, the consumer can choose the manual approval method. The connection request appears on the service resources as **Pending**. The service provider has to manually approve the request before connections can be established. 
In manual cases, service consumer can also specify a message with the request to provide more context to the service provider. The service provider has following options to choose from for all private endpoint connections: **Approve**, **Reject**, **Remove**.

The below table shows the various service provider actions and the resulting connection states for private endpoints. The service provider can change the connection state at a later time without consumer intervention. The action will update the state of the endpoint on the consumer side. 

| Service provider action  | Service consumer private endpoint state | Description |
|---------|---------|---------|
| None    |    Pending     |    Connection is created manually and is pending for approval by the Private Link resource owner.       |
| Approve    |  Approved       |  Connection was automatically or manually approved and is ready to be used.     |
| Reject     | Rejected        | Connection was rejected by the private link resource owner.        |
| Remove    |  Disconnected       | Connection was removed by the private link resource owner, the private endpoint becomes informative and should be deleted for clean-up.        |

## Manage private endpoint connections on Azure PaaS resources

Use the following steps to manage a private endpoint connection in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Private link**. In the search results, select **Private link**.

3. In the **Private link center**, select **Private endpoints** or **Private link services**.

4. For each of your endpoints, you can view the number of private endpoint connections associated with it. You can filter the resources as needed.

5. Select the private endpoint. Under the connections listed, select the connection that you want to manage. 

6. You can change the state of the connection by selecting from the options at the top.

## Manage Private Endpoint connections on a customer/partner owned Private Link service

Use the following PowerShell and Azure CLI commands to manage private endpoint connections on Microsoft Partner Services or customer owned services. 
 
# [**PowerShell**](#tab/manage-private-link-powershell)

Use the following PowerShell commands to manage private endpoint connections.  

## Get Private Link connection states

Use **[Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection)** to get the Private Endpoint connections and their states.  

```azurepowershell
$get = @{
    Name = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Get-AzPrivateEndpointConnection @get
```

## Approve a Private Endpoint connection 

Use **[Approve-AzPrivateEndpointConnection](/powershell/module/az.network/approve-azprivateendpointconnection)** cmdlet to approve a Private Endpoint connection. 

```azurepowershell
$approve = @{
    Name = 'myPrivateEndpointConnection'
    ServiceName = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Approve-AzPrivateEndpointConnection @approve
```

## Deny Private Endpoint connection

Use **[Deny-AzPrivateEndpointConnection](/powershell/module/az.network/deny-azprivateendpointconnection)** cmdlet to reject a Private Endpoint connection. 

```azurepowershell
$deny = @{
    Name = 'myPrivateEndpointConnection'
    ServiceName = 'myPrivateLinkService'
    ResourceGroupName = 'myResourceGroup'
}
Deny-AzPrivateEndpointConnection  @deny
```

## Remove Private Endpoint connection 

Use **[Remove-AzPrivateEndpointConnection](/powershell/module/az.network/remove-azprivateendpointconnection)** cmdlet to remove a Private Endpoint connection. 

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

Use **[az network private-endpoint-connection show](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-show)** to get the Private Endpoint connections and their states.  

```azurecli
  az network private-endpoint-connection show \
    --name myPrivateEndpointConnection \
    --resource-group myResourceGroup
```

## Approve a Private Endpoint connection 
 
Use **[az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve)** cmdlet to approve a Private Endpoint connection. 
 
```azurecli
  az network private-endpoint-connection approve \
    --name myPrivateEndpointConnection  \
    --resource-group myResourceGroup
```
 
## Deny Private Endpoint connection 
 
Use **[az network private-endpoint-connection reject](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-reject)** cmdlet to reject a Private Endpoint connection. 

```azurecli
  az network private-endpoint-connection reject \
    --name myPrivateEndpointConnection  \
    --resource-group myResourceGroup
```

## Remove Private Endpoint connection 
 
Use **[az network private-endpoint-connection delete](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-delete)** cmdlet to remove a Private Endpoint connection. 

```azurecli
  az network private-endpoint-connection delete \
    --name myPrivateEndpointConnection \
    --resource-group myResourceGroup
```

---

> [!NOTE]
> Connections that have been previously denied can't be approved. You must remove the connection and create a new one.


## Next steps
- [Learn about Private Endpoints](private-endpoint-overview.md)
 
