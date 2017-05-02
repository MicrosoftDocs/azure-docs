---
title: 'Connect your on-premises network to an Azure virtual network: Site-to-Site VPN: CLI | Microsoft Docs'
description: Steps to create an IPsec connection from your on-premises network to an Azure virtual network over the public Internet. These steps will help you create a cross-premises Site-to-Site VPN Gateway connection using CLI.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: vpn-gateway
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/21/2017
ms.author: cherylmc

---
# Create a virtual network with a Site-to-Site VPN connection using CLI

This article shows you how to use the Azure CLI to create a Site-to-Site VPN gateway connection from your on-premises network to the VNet. The steps in this article apply to the Resource Manager deployment model. You can also create this configuration using a different deployment tool or deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](vpn-gateway-howto-site-to-site-resource-manager-portal.md)
> * [Resource Manager - PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md)
> * [Resource Manager - CLI](vpn-gateway-howto-site-to-site-resource-manager-cli.md)
> * [Classic - Azure portal](vpn-gateway-howto-site-to-site-classic-portal.md)
> * [Classic - classic portal](vpn-gateway-site-to-site-create.md)
> 
>


![Site-to-Site VPN Gateway cross-premises connection diagram](./media/vpn-gateway-howto-site-to-site-resource-manager-cli/site-to-site-connection-diagram.png)

A Site-to-Site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about VPN gateways, see [About VPN gateway](vpn-gateway-about-vpngateways.md).

## Before you begin

Verify that you have met the following criteria before beginning configuration:

* Verify that you want to work with the Resource Manager deployment model. [!INCLUDE [deployment models](../../includes/vpn-gateway-deployment-models-include.md)] 
* A compatible VPN device and someone who is able to configure it. For more information about compatible VPN devices and device configuration, see [About VPN Devices](vpn-gateway-about-vpn-devices.md).
* An externally facing public IPv4 address for your VPN device. This IP address cannot be located behind a NAT.
* If you are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure will route to your on-premises location. None of the subnets of your on-premises network can over lap with the virtual network subnets that you want to connect to. 
* The latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Example values

You can use the following values to create a test environment, or refer to these values to better understand the examples in this article:

```
#Example values

VnetName                = TestVNet1 
ResourceGroup           = TestRG1 
Location                = eastus 
AddressSpace            = 10.12.0.0/16 
SubnetName              = Subnet1 
Subnet                  = 10.12.0.0/24 
GatewaySubnet           = 10.12.255.0/27 
LocalNetworkGatewayName = Site2 
LNG Public IP           = <VPN device IP address>
LocalAddrPrefix1        = 10.0.0.0/24 
LocalAddrPrefix2        = 20.0.0.0/24   
GatewayName             = VNet1GW 
PublicIP                = VNet1GWIP 
VPNType                 = RouteBased 
GatewayType             = Vpn 
ConnectionName          = VNet1toSite2
```

## <a name="Login"></a>1. Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

If you have more than one Azure subscription, list the subscriptions for the account.

```azurecli
Az account list --all
```

Specify the subscription that you want to use.

```azurecli
Az account set --subscription <replace_with_your_subscription_id>
```

## 2. Create a resource group

The following example creates a resource group named 'TestRG1' in the 'eastus' location. If you already have a resource group in the region that you want to create your VNet, you can use that one instead.

```azurecli
az group create -n TestRG1 -l eastus
```

## <a name="VNet"></a>3. Create a virtual network

If you don't already have a virtual network, create one. When creating a virtual network, make sure that the address spaces you specify don't overlap any of the address spaces that you have on your on-premises network. 

The following example creates a virtual network named 'TestVNet1' and a subnet, 'Subnet1'.

```azurecli
az network vnet create -n TestVNet1 -g TestRG1 --address-prefix 10.12.0.0/16 -l eastus --subnet-name Subnet1 --subnet-prefix 10.12.0.0/24
```

## 4. <a name="gwsub"></a>Create the gateway subnet

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

For this configuration, you also need a gateway subnet. The virtual network gateway uses a gateway subnet that contains the IP addresses that are used by the VPN gateway services. When you create a gateway subnet, it must be named 'GatewaySubnet'. If you name it something else, you create a subnet, but Azure won't treat it as a gateway subnet.

The size of the gateway subnet that you specify depends on the VPN gateway configuration that you want to create. While it is possible to create a gateway subnet as small as /29, we recommend that you create a larger subnet that includes more addresses by selecting /27 or /28. Using a larger gateway subnet allows for enough IP addresses to accommodate possible future configurations.


```azurecli
az network vnet subnet create --address-prefix 10.12.255.0/27 -n GatewaySubnet -g TestRG1 --vnet-name TestVNet1
```

## <a name="localnet"></a>5. Create the local network gateway

The local network gateway typically refers to your on-premises location. You give the site a name by which Azure can refer to it, then specify the IP address of the on-premises VPN device to which you will create a connection. You also specify the IP address prefixes that will be routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes, you can easily update the prefixes.

Use the following values:

* The *--gateway-ip-address* is the IP address of your on-premises VPN device. Your VPN device cannot be located behind a NAT.
* The *--local-address-prefixes* are your on-premises address spaces.

The following example shows how to add a local network gateway with multiple address prefixes:

```azurecli
az network local-gateway create --gateway-ip-address 23.99.221.164 -n Site2 -g TestRG1 --local-address-prefixes 10.0.0.0/24 20.0.0.0/24
```

## <a name="PublicIP"></a>6. Request a public IP address

Request a public IP address that will be allocated to your virtual network VPN gateway. This is the IP address that you configure your VPN device to connect to.

The virtual network gateway for the Resource Manager deployment model currently only supports public IP addresses by using the Dynamic Allocation method. However, this does not mean the IP address changes. The only time the VPN gateway IP address changes is when the gateway is deleted and re-created. The virtual network gateway public IP address doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway. 

```azurecli
az network public-ip create -n VNet1GWIP -g TestRG1 --allocation-method Dynamic
```

## <a name="CreateGateway"></a>7. Create the VPN gateway

Create the virtual network VPN gateway. Creating a VPN gateway can take up to 45 minutes or more to complete.

Use the following values:

* The *--gateway-type* for a Site-to-Site configuration is *Vpn*. The gateway type is always specific to the configuration that you are implementing. For more information, see [Gateway types](vpn-gateway-about-vpn-gateway-settings.md#gwtype)
* The *--vpn-type* can be *RouteBased* (referred to as a Dynamic Gateway in some documentation), or *PolicyBased* (referred to as a Static Gateway in some documentation). The setting is specific to requirements of the device that you are connecting to. For more information about VPN gateway types, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md#vpntype).
* The *--sku* can be Basic, Standard, or HighPerformance. There are configuration limitations for certain SKUs. For more information, see [Gateway SKUs](vpn-gateway-about-vpngateways.md#gateway-skus).

After running this command, you won't see any feedback or output. It takes around 45 minutes to create a gateway.

```azurecli
az network vnet-gateway create -n VNet1GW --public-ip-address VNet1GWIP -g TestRG1 --vnet TestVNet1 --gateway-type Vpn --vpn-type RouteBased --sku Standard --no-wait 
```

## <a name="VPNDevice"></a>8. Configure your VPN device

[!INCLUDE [vpn-gateway-configure-vpn-device-rm](../../includes/vpn-gateway-configure-vpn-device-rm-include.md)]
  To find the public IP address of your virtual network gateway, use the following example, replacing the values with your own. For easy reading, the output is formatted to display the list of public IPs in table format.

  ```azurecli
  az network public-ip list -g TestRG1 -o table
  ```

## <a name="CreateConnection"></a>9. Create the VPN connection

Create the Site-to-Site VPN connection between your virtual network gateway and your on-premises VPN device. Pay particular attention to the shared key value, which must match the configured shared key value for your VPN device.

```azurecli
az network vpn-connection create -n VNet1toSite2 -g TestRG1 --vnet-gateway1 VNet1GW -l eastus --shared-key abc123 --local-gateway2 Site2
```

After a short while, the connection will be established.

## <a name="toverify"></a>10. Verify the VPN connection

[!INCLUDE [verify connection](../../includes/vpn-gateway-verify-connection-cli-rm-include.md)] 

If you want to use another method to verify your connection, see [Verify a VPN Gateway connection](vpn-gateway-verify-connection-resource-manager.md).

## Common tasks

### To view local network gateways

```azurecli
az network local-gateway list --resource-group TestRG1
```

### <a name="modify"></a>To modify IP address prefixes for a local network gateway
If you need to change the prefixes for your local network gateway, use the following instructions. Each time you make a change, the entire list of prefixes must be specified, not just the prefixes that you want to change.

- **If you have a connection specified**, use the example below. Specify the entire list of prefixes consisting of existing prefixes and the ones you want to add. In this example, 10.0.0.0/24 and 20.0.0.0/24 are already present. We add the prefixes 30.0.0.0/24 and 40.0.0.0/24.

  ```azurecli
  az network local-gateway update --local-address-prefixes 10.0.0.0/24 20.0.0.0/24 30.0.0.0/24 40.0.0.0/24 -n VNet1toSite2 -g TestRG1
  ```

- **If you don't have a connection specified**, use the same command that you use to create a local network gateway. You can also use this command to update the gateway ip address for the VPN device. Only use this command when you do not already have a connection. In this example, 10.0.0.0/24, 20.0.0.0/24, 30.0.0.0/24, and 40.0.0.0/24 are present. We specify only the prefixes that we want to keep. In this case, 10.0.0.0/24 and 20.0.0.0/24.

  ```azurecli
  az network local-gateway create --gateway-ip-address 23.99.221.164 -n Site2 -g TestRG1 --local-address-prefixes 10.0.0.0/24 20.0.0.0/24
  ```

### <a name="modifygwipaddress"></a>To modify the gateway IP address for a local network gateway

The IP address in this configuration is the IP address of the VPN device that you are creating a connection to. If the VPN device IP address changes, you can modify the value. The IP address can be changed even if there is a gateway connection.

```azurecli
az network local-gateway update --gateway-ip-address 23.99.222.170 -n Site2 -g TestRG1
```

When viewing the result, verify that the IP address prefixes are included.

  ```azurecli
  "localNetworkAddressSpace": { 
    "addressPrefixes": [ 
      "10.0.0.0/24", 
      "20.0.0.0/24", 
      "30.0.0.0/24" 
    ] 
  }, 
  "location": "eastus", 
  "name": "Site2", 
  "provisioningState": "Succeeded",  
  ```

### To view the virtual network gateway public IP address

To find the public IP address of your virtual network gateway, use the following example. For easy reading, the output is formatted to display the list of public IPs in table format.

```azurecli
az network public-ip list -g TestRG1 -o table
```

### To verify the shared key values

Verify that the shared key value is the same value that you used for your VPN device configuration. If it is not, either run the connection again using the value from the device, or update the device with the value from the return. The values must match.

```azurecli
az network vpn-connection shared-key show --connection-name VNet1toSite2 -g TestRG1
```

## Next steps

*  Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](https://docs.microsoft.com/azure/#pivot=services&panel=Compute).
* For information about BGP, see the [BGP Overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
* For information about forced tunneling, see [Configure forced tunneling](vpn-gateway-forced-tunneling-rm.md).
* For a list of networking Azure CLI commands, see [Azure CLI](https://docs.microsoft.com/cli/azure/network).