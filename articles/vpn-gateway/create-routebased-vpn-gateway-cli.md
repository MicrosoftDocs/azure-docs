---
title: 'Create a route-based Azure VPN gateway: CLI | Microsoft Docs'
description: Quickly learn how to create a VPN Gateway using CLI
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 10/04/2018
ms.author: cherylmc
---

# Create a route-based VPN gateway using CLI

This article helps you quickly create a route-based Azure VPN gateway using the Azure CLI. A VPN gateway is used when creating a VPN connection to your on-premises network. You can also use a VPN gateway to connect VNets.

The steps in this article will create a VNet, a subnet, a gateway subnet, and a route-based VPN gateway (virtual network gateway). A virtual network gateway can take 45 minutes or more to create. Once the gateway creation has completed, you can then create connections. These steps require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.4 or later. To find the installed version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group using the [az group create](/cli/azure/group) command. A resource group is a logical container into which Azure resources are deployed and managed. 


```azurecli-interactive 
az group create --name TestRG1 --location eastus
```

## <a name="vnet"></a>Create a virtual network

Create a virtual network using the [az network vnet create](/cli/azure/network/vnet) command. The following example creates a virtual network named **VNet1** in the **EastUS** location:

```azurecli-interactive 
az network vnet create \
  -n VNet1 \
  -g TestRG1 \
  -l eastus \
  --address-prefix 10.1.0.0/16 \
  --subnet-name Frontend \
  --subnet-prefix 10.1.0.0/24
```

## <a name="gwsubnet"></a>Add a gateway subnet

The gateway subnet contains the reserved IP addresses that the virtual network gateway services use. Use the following examples to add a gateway subnet:

```azurepowershell-interactive
az network vnet subnet create \
  --vnet-name VNet1 \
  -n GatewaySubnet \
  -g TestRG1 \
  --address-prefix 10.1.255.0/27 
```

## <a name="PublicIP"></a>Request a public IP address

A VPN gateway must have a dynamically allocated public IP address. The public IP address will be allocated to the VPN gateway that you create for your virtual network. Use the following example to request a public IP address:

```azurecli-interactive
az network public-ip create \
  -n VNet1GWIP \
  -g TestRG1 \
  --allocation-method Dynamic 
```

## <a name="CreateGateway"></a>Create the VPN gateway

Create the VPN gateway using the [az network vnet-gateway create](/cli/azure/group) command.

If you run this command by using the `--no-wait` parameter, you don't see any feedback or output. The `--no-wait` parameter allows the gateway to be created in the background. It does not mean that the VPN gateway is created immediately.

```azurecli-interactive
az network vnet-gateway create \
  -n VNet1GW \
  -l eastus \
  --public-ip-address VNet1GWIP \
  -g TestRG1 \
  --vnet VNet1 \
  --gateway-type Vpn \
  --sku VpnGw1 \
  --vpn-type RouteBased \
  --no-wait
```

A VPN gateway can take 45 minutes or more to create.

## <a name="viewgw"></a>View the VPN gateway

```azurecli-interactive
az network vnet-gateway show \
  -n VNet1GW \
  -g TestRG1
```

The response looks similar to this:

```
{
  "activeActive": false,
  "bgpSettings": null,
  "enableBgp": false,
  "etag": "W/\"6c61f8cb-d90f-4796-8697\"",
  "gatewayDefaultSite": null,
  "gatewayType": "Vpn",
  "id": "/subscriptions/<subscription ID>/resourceGroups/TestRG11/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW",
  "ipConfigurations": [
    {
      "etag": "W/\"6c61f8cb-d90f-4796-8697\"",
      "id": "/subscriptions/<subscription ID>/resourceGroups/TestRG11/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW/ipConfigurations/vnetGatewayConfig0",
      "name": "vnetGatewayConfig0",
      "privateIpAllocationMethod": "Dynamic",
      "provisioningState": "Updating",
      "publicIpAddress": {
        "id": "/subscriptions/<subscription ID>/resourceGroups/TestRG11/providers/Microsoft.Network/publicIPAddresses/VNet1GWIP",
        "resourceGroup": "TestRG1"
      },
      "resourceGroup": "TestRG1",
      "subnet": {
        "id": "/subscriptions/<subscription ID>/resourceGroups/TestRG11/providers/Microsoft.Network/virtualNetworks/VNet1/subnets/GatewaySubnet",
        "resourceGroup": "TestRG1"
      }
    }
  ],
  "location": "eastus",
  "name": "VNet1GW",
  "provisioningState": "Updating",
  "resourceGroup": "TestRG1",
  "resourceGuid": "69c269e3-622c-4123-9231",
  "sku": {
    "capacity": 2,
    "name": "VpnGw1",
    "tier": "VpnGw1"
  },
  "tags": null,
  "type": "Microsoft.Network/virtualNetworkGateways",
  "vpnClientConfiguration": null,
  "vpnType": "RouteBased"
}
```

### View the public IP address

To view the public IP address assigned to your gateway, use the following example:

```azurecli-interactive
az network public-ip show \
  --name VNet1GWIP \
  --resource-group TestRG11
```

The value associated with the **ipAddress** field is the public IP address of your VPN gateway.

Example response:

```
{
  "dnsSettings": null,
  "etag": "W/\"a12d4d03-b27a-46cc-b222-8d9364b8166a\"",
  "id": "/subscriptions/<subscription ID>/resourceGroups/TestRG1/providers/Microsoft.Network/publicIPAddresses/VNet1GWIP",
  "idleTimeoutInMinutes": 4,
  "ipAddress": "13.90.195.184",
  "ipConfiguration": {
    "etag": null,
    "id": "/subscriptions/<subscription ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW/ipConfigurations/vnetGatewayConfig0",
```
## Clean up resources

When you no longer need the resources you created, use [az group delete](/cli/azure/group) to delete the resource group. This will delete the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete --name TestRG1 --yes
```

## Next steps

Once the gateway has finished creating, you can create a connection between your virtual network and another VNet. Or, create a connection between your virtual network and an on-premises location.

> [!div class="nextstepaction"]
> [Create a site-to-site connection](vpn-gateway-create-site-to-site-rm-powershell.md)<br><br>
> [Create a point-to-site connection](vpn-gateway-howto-point-to-site-rm-ps.md)<br><br>
> [Create a connection to another VNet](vpn-gateway-vnet-vnet-rm-ps.md)
