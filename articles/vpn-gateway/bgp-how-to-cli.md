---
title: 'Configure BGP on Azure VPN Gateways: Resource Manager: CLI | Microsoft Docs'
description: This article walks you through configuring BGP with Azure VPN Gateways using Azure Resource Manager and CLI.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: cherylmc

---
# How to configure BGP on Azure VPN Gateways using CLI

This article helps you enable BGP on a cross-premises Site-to-Site (S2S) VPN connection and a VNet-to-VNet connection using the Resource Manager deployment model and CLI.

## About BGP

BGP is the standard routing protocol commonly used in the Internet to exchange routing and reachability information between two or more networks. BGP enables the VPN Gateways and your on-premises VPN devices, called BGP peers or neighbors, to exchange "routes". The routes inform both gateways about the availability and reachability for prefixes to go through the gateways or routers involved. BGP can also enable transit routing among multiple networks by propagating the routes a BGP gateway learns from one BGP peer, to all other BGP peers.

For more information on the benefits of BGP, and to understand the technical requirements and considerations of using BGP, see [Overview of BGP with Azure VPN Gateways](vpn-gateway-bgp-overview.md).

This article helps you with the following tasks:

* [Enable BGP for your VPN gateway](#enablebgp) (Required)

  You can then configure either of the following sections, or both:

* [Establish a cross-premises connection with BGP](#crossprembgp)
* [Establish a VNet-to-VNet connection with BGP](#v2vbgp)

Each of these three sections forms a basic building block for enabling BGP in your network connectivity. If you complete all three sections, you build the topology as shown in the following diagram:

![BGP topology](./media/vpn-gateway-bgp-resource-manager-ps/bgp-crosspremv2v.png)

You can combine these sections together to build a more complex multi-hop transit network that meets your needs.

## <a name ="enablebgp"></a>Enable BGP for your VPN Gateway

This section is required before you perform any of the steps in the other two configuration sections. The following configuration steps set up the BGP parameters of the Azure VPN gateway as shown in the following diagram:

![BGP Gateway](./media/vpn-gateway-bgp-resource-manager-ps/bgp-gateway.png)

### Before you begin

Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli) and [Get Started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli).

### Step 1 - Create and configure TestVNet1

#### <a name="Login"></a>1. Connect to your subscription

[!INCLUDE [CLI login](../../includes/vpn-gateway-cli-login-include.md)]

#### 2. Create a resource group

The following example creates a resource group named 'TestRG1' in the 'eastus' location. If you already have a resource group in the region that you want to create your VNet, you can use that one instead.

```azurecli
az group create --name TestBGPRG1 --location eastus
```

#### 3. Create TestVNet1

The following example creates a virtual network named TestVNet1 and three subnets, one called GatewaySubnet, one called FrontEnd, and one called Backend. When substituting values, it's important that you always name your gateway subnet specifically GatewaySubnet. If you name it something else, your gateway creation fails.

The first command creates the frontend address space and the FrontEnd subnet. The second command creates an additional address space for the backend subnet. The third and fourth commands create the BackEnd subnet and GatewaySubnet.

```azurecli
az network vnet create -n TestVNet1 -g TestBGPRG1 --address-prefix 10.11.0.0/16 -l eastus --subnet-name FrontEnd --subnet-prefix 10.11.0.0/24 
 
az network vnet update -n TestVNet1 --address-prefixes 10.11.0.0/16 10.12.0.0/16 -g TestBGPRG1 
 
az network vnet subnet create --vnet-name TestVNet1 -n BackEnd -g TestBGPRG1 --address-prefix 10.12.0.0/24 
 
az network vnet subnet create --vnet-name TestVNet1 -n GatewaySubnet -g TestBGPRG1 --address-prefix 10.12.255.0/27 
```

### Step 2 - Create the VPN Gateway for TestVNet1 with BGP parameters

#### 1. Create the public IP address

Request a public IP address. The public IP address will be allocated to the VPN gateway that you create for your VNet.

```azurecli
az network public-ip create -n GWPubIP -g TestBGPRG1 --allocation-method Dynamic 
```

#### 2. Create the VPN gateway with the AS number

Create the virtual network gateway for TestVNet1. BGP requires a Route-Based VPN gateway. You also need the additional parameter '-Asn' to set the ASN (AS Number) for TestVNet1. Creating a gateway can take a while (45 minutes or more to complete). 

If you run this command using the '--no-wait' parameter, you don't see any feedback or output. The '--no-wait' parameter allows the gateway to create in the background. It does not mean that the VPN gateway finishes creating immediately.

```azurecli
az network vnet-gateway create -n VNet1GW -l eastus --public-ip-address GWPubIP -g TestBGPRG1 --vnet TestVNet1 --gateway-type Vpn --sku HighPerformance --vpn-type RouteBased --asn 65010 --no-wait
```

#### 3. Obtain the Azure BGP Peer IP address

Once the gateway is created, you need to obtain the BGP Peer IP address on the Azure VPN Gateway. This address is needed to configure the VPN Gateway as a BGP Peer for your on-premises VPN devices.

Run the following command and check the bgpSettings section at the top of the output

```azurecli
az network vnet-gateway list -g TestBGPRG1 
 
  
"bgpSettings": { 
      "asn": 65010, 
      "bgpPeeringAddress": "10.12.255.30", 
      "peerWeight": 0 
    }
```

Once the gateway is created, you can use this gateway to establish a cross-premises connection or a VNet-to-VNet connection with BGP.

## <a name ="crossprembgp"></a>Establish a cross-premises connection with BGP

To establish a cross-premises connection, you need to create a local network gateway to represent your on-premises VPN device, and a Connection to connect the Azure VPN gateway with the local network gateway. While these steps are similar to creating other connections, they include the additional properties required to specify the BGP configuration parameters.

![BGP for Cross-Premises](./media/vpn-gateway-bgp-resource-manager-ps/bgp-crossprem.png)


### Step 1 - Create and configure the local network gateway

This exercise continues to build the configuration shown in the diagram. Be sure to replace the values with the ones that you want to use for your configuration. When working with local network gateways, keep in mind the following things:

* The local network gateway can be in the same or different location and resource group as the VPN gateway. This example shows them in different resource groups in different locations.
* The minimum prefix you need to declare for the local network gateway is the host address of your BGP Peer IP address on your VPN device. In this case, it's a /32 prefix of "10.52.255.254/32".
* As a reminder, you must use different BGP ASNs between your on-premises networks and Azure VNet. If they are the same, you need to change your VNet ASN if your on-premises VPN devices already use the ASN to peer with other BGP neighbors.

Before proceeding, make sure you have completed the [Enable BGP for your VPN Gateway](#enablebgp) section of this exercise and that you are still connected to Subscription 1. Notice that in this example, you create a new resource group. Also, notice the two additional parameters for the local network gateway: Asn and BgpPeerAddress.

```azurecli
az group create -n TestBGPRG5 -l eastus2 
 
az network local-gateway create --gateway-ip-address 23.99.221.164 -n Site5 -g TestBGPRG5 --local-address-prefixes 10.51.255.254/32 --asn 65050 --bgp-peering-address 10.51.255.254
```

### Step 2 - Connect the VNet gateway and local network gateway

In this step, you create the connection from TestVNet1 to Site5. You must specify the '--enable-bgp' parameter to enable BGP for this connection. 

In this example, the virtual network gateway and local network gateway are present in different resource groups. When the gateways are in different resource groups, you must specify the entire resource ID of the two gateways to set up a connection between the VNets.

#### 1. Get the resource ID of VNet1GW

Use the output from the following command to get the resource ID for VNet1GW:

```azurecli
az network vnet-gateway show -n VNet1GW -g TestBGPRG1
```

In the output, find the "id:" line. The values within the quotes are needed to create the connection in the next section. Copy these values to a text editor, such as Notepad, so that you can easily paste them when creating your connection.

Example output:

```
{ 
  "activeActive": false, 
  "bgpSettings": { 
    "asn": 65010, 
    "bgpPeeringAddress": "10.12.255.30", 
    "peerWeight": 0 
  }, 
  "enableBgp": true, 
  "etag": "W/\"<your etag number>\"", 
  "gatewayDefaultSite": null, 
  "gatewayType": "Vpn", 
  "id": "/subscriptions/<subscription ID>/resourceGroups/TestBGPRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW",
```

Copy the values after **"id":** within the quotes. 

```
"id": "/subscriptions/<subscription ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW"
```

#### 2. Get the resource ID of Site5

Use the following command to get the resource ID of Site5 from the output:

```azurecli
az network local-gateway show -n Site5 -g TestBGPRG5
```

#### 3. Create the TestVNet1 to Site5 connection

In this step, you create the connection from TestVNet1 to Site5. As discussed earlier, it is possible to have both BGP and non-BGP connections for the same Azure VPN gateway. Unless BGP is enabled in the connection property, Azure will not enable BGP for this connection, even though BGP parameters are already configured on both gateways. Make sure to replace the subscription IDs with your own.

```azurecli
az network vpn-connection create -n VNet1ToSite5 -g TestBGPRG1 --vnet-gateway1 /subscriptions/<subscription ID>/resourceGroups/TestBGPRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW --enable-bgp -l eastus --shared-key "abc123" --local-gateway2 /subscriptions/<subscription ID>/resourceGroups/TestBGPRG5/providers/Microsoft.Network/localNetworkGateways/Site5 --no-wait
```

For this exercise, the following example lists the parameters to enter into the BGP configuration section of your on-premises VPN device:

```
Site5 ASN            : 65050
Site5 BGP IP         : 10.52.255.254
Prefixes to announce : (for example) 10.51.0.0/16 and 10.52.0.0/16
Azure VNet ASN       : 65010
Azure VNet BGP IP    : 10.12.255.30
Static route         : Add a route for 10.12.255.30/32, with nexthop being the VPN tunnel interface on your device
eBGP Multihop        : Ensure the "multihop" option for eBGP is enabled on your device if needed
```

The connection should be established after a few minutes. The BGP peering session starts once the IPsec connection is established.

## <a name ="v2vbgp"></a>Establish a VNet-to-VNet connection with BGP

This section adds a VNet-to-VNet connection with BGP, as shown in the following diagram: 

![BGP for VNet-to-VNet](./media/vpn-gateway-bgp-resource-manager-ps/bgp-vnet2vnet.png)

The following instructions continue from the previous steps in the preceding sections. You must complete the [Enable BGP for your VPN gateway](#enablebgp) section to create and configure TestVNet1 and the VPN gateway with BGP.

### Step 1 - Create TestVNet2 and the VPN gateway

It is important to make sure that the IP address space of the new virtual network, TestVNet2, does not overlap with any of your VNet ranges.

In this example, the virtual networks belong to the same subscription. You can set up VNet-to-VNet connections between different subscriptions; refer to [Configure a VNet-to-VNet connection](vpn-gateway-howto-vnet-vnet-cli.md) to learn more details. Make sure you add the "-EnableBgp $True" when creating the connections to enable BGP.

#### 1. Create a new resource group

```azurecli
az group create -n TestBGPRG2 -l westus
```

#### 2. Create TestVNet2 in the new resource group

The first command creates the front end address space and the FrontEnd subnet. The second command creates an additional address space for the back end subnet. The third and fourth commands create the BackEnd subnet and GatewaySubnet.

```azurecli
az network vnet create -n TestVNet2 -g TestBGPRG2 --address-prefix 10.21.0.0/16 -l westus --subnet-name FrontEnd --subnet-prefix 10.21.0.0/24 
 
az network vnet update -n TestVNet2 --address-prefixes 10.21.0.0/16 10.22.0.0/16 -g TestBGPRG2 
 
az network vnet subnet create --vnet-name TestVNet2 -n BackEnd -g TestBGPRG2 --address-prefix 10.22.0.0/24 
 
az network vnet subnet create --vnet-name TestVNet2 -n GatewaySubnet -g TestBGPRG2 --address-prefix 10.22.255.0/27
```

#### 3. Create the public IP address

Request a public IP address. The public IP address will be allocated to the VPN gateway that you create for your VNet.

```azurecli
az network public-ip create -n GWPubIP2 -g TestBGPRG2 --allocation-method Dynamic
```

#### 4. Create the VPN gateway with the AS number

Create the virtual network gateway for TestVNet2. You must override the default ASN on your Azure VPN gateways. The ASNs for the connected VNets must be different to enable BGP and transit routing.
 
```azurecli
az network vnet-gateway create -n VNet2GW -l westus --public-ip-address GWPubIP2 -g TestBGPRG2 --vnet TestVNet2 --gateway-type Vpn --sku Standard --vpn-type RouteBased --asn 65020 --no-wait
```

### Step 2 - Connect the TestVNet1 and TestVNet2 gateways

In this step, you create the connection from TestVNet1 to Site5. To enable BGP for this connection, you must specify the '--enable-bgp' parameter.

In the following example, the virtual network gateway and local network gateway are present in different resource groups. When the gateways are in different resource groups, you must specify the entire resource ID of the two gateways to set up a connection between the VNets. 

#### 1. Get the resource ID of VNet1GW 

Get the resource ID of VNet1GW from the output of the following command:

```azurecli
az network vnet-gateway show -n VNet1GW -g TestBGPRG1
```

#### 2. Get the resource ID of VNet2GW

Get the resource ID of VNet2GW from the output of the following command:

```azurecli
az network vnet-gateway show -n VNet2GW -g TestBGPRG2
```

#### 3. Create the connections

Create the connection from TestVNet1 to TestVNet2, and the connection from TestVNet2 to TestVNet1. Make sure to replace the subscription IDs with your own.

```azurecli
az network vpn-connection create -n VNet1ToVNet2 -g TestBGPRG1 --vnet-gateway1 /subscriptions/<subscription ID>/resourceGroups/TestBGPRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW --enable-bgp -l eastus --shared-key "efg456" --vnet-gateway2 /subscriptions/<subscription ID>/resourceGroups/TestBGPRG2/providers/Microsoft.Network/virtualNetworkGateways/VNet2GW
```

```azurecli
az network vpn-connection create -n VNet2ToVNet1 -g TestBGPRG2 --vnet-gateway1 /subscriptions/<subscription ID>/resourceGroups/TestBGPRG2/providers/Microsoft.Network/virtualNetworkGateways/VNet2GW --enable-bgp -l westus --shared-key "efg456" --vnet-gateway2 /subscriptions/<subscription ID>/resourceGroups/TestBGPRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW
```

> [!IMPORTANT]
> Be sure to enable BGP for BOTH connections.
> 
> 

After completing these steps, the connection will be established in a few minutes. The BGP peering session will be up once the VNet-to-VNet connection is completed.

If you complete all three sections of this exercise, you establish the network topology shown in the following example:

![BGP for VNet-to-VNet](./media/vpn-gateway-bgp-resource-manager-ps/bgp-crosspremv2v.png)

## Next Steps

Once your connection is complete, you can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for steps.