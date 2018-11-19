---
title: VPN gateway settings for Azure Stack | Microsoft Docs
description: Learn about settings for VPN gateways you use with Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: fa8d3adc-8f5a-4b4f-8227-4381cf952c56
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/14/2018
ms.author: sethm
---

# VPN gateway configuration settings for Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

A VPN gateway is a type of virtual network gateway that sends encrypted traffic between your virtual network in Azure Stack and a remote VPN gateway. The remote VPN gateway can be in Azure, a device in your datacenter or a device in another site.  If there is network connectivity between the two endpoints, you can establish a secure Site-to-Site (S2S) VPN connection between the two networks.

A VPN gateway connection relies on the configuration of multiple resources, each of which contains configurable settings. This article discusses the resources and settings that relate to a VPN gateway for a virtual network that you create in the Resource Manager deployment model. You can find descriptions and topology diagrams for each connection solution in [About VPN Gateway for Azure Stack](azure-stack-vpn-gateway-about-vpn-gateways.md).

## VPN gateway settings

### Gateway types

Each Azure Stack virtual network supports a single virtual network gateway, which must be of the type **Vpn**.  This support differs from Azure, which supports additional types.  

When you're creating a virtual network gateway, you must make sure that the gateway type is correct for your configuration. A VPN gateway requires the `-GatewayType Vpn`, for example:

```PowerShell
New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
-Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn
-VpnType RouteBased
```

### Gateway SKUs

When you create a virtual network gateway, you need to specify the gateway SKU that you want to use. Select the SKUs that satisfy your requirements based on the types of workloads, throughputs, features, and SLAs.

Azure Stack offers the VPN gateway SKUs shown in the following table.

|	| VPN Gateway throughput |VPN Gateway max IPsec tunnels |
|-------|-------|-------|
|**Basic SKU** 	| 100 Mbps	| 10	|
|**Standard SKU** 		    | 100 Mbps 	| 10	|
|**High Performance SKU** | 200 Mbps	| 5	|

### Resizing gateway SKUs

Azure Stack doesn't support a resize of SKUs between the supported legacy SKUs.

Similarly, Azure Stack doesn't support a resize from a supported legacy SKU (Basic, Standard, and HighPerformance) to a newer SKU supported by Azure (VpnGw1, VpnGw2, and VpnGw3.)

### Configure the gateway SKU

#### Azure Stack portal

If you use the Azure Stack portal to create a Resource Manager virtual network gateway, you can select the gateway SKU by using the dropdown list. The options you're presented with correspond to the Gateway type and VPN type that you select.

#### PowerShell

The following PowerShell example specifies the **-GatewaySku** as VpnGw1.

```PowerShell
New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
-Location 'West US' -IpConfigurations $gwipconfig -GatewaySku VpnGw1
-GatewayType Vpn -VpnType RouteBased
```

### Connection types

In the Resource Manager deployment model, each configuration requires a specific virtual network gateway connection type. The available Resource Manager PowerShell values for **-ConnectionType** are:

* IPsec

In the following PowerShell example, a S2S connection is created that requires the IPsec connection type.

```PowerShell
New-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg
-Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local
-ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
```

### VPN types

When you create the virtual network gateway for a VPN gateway configuration, you must specify a VPN type. The VPN type that you choose depends on the connection topology that you want to create.  A VPN type can also depend on the hardware that you're using. S2S configurations require a VPN device. Some VPN devices only support a certain VPN type.

> [!IMPORTANT]  
> Currently, Azure Stack only supports the Route Based VPN type. If your device only supports Policy Based VPNs, then connections to those devices from Azure Stack aren't supported.  
>
> In addition, Azure Stack doesn't support using Policy Based Traffic Selectors for Route Based Gateways at this time, because custom IPSec/IKE policy configurations aren't supported.

* **PolicyBased**: Policy-based VPNs encrypt and direct packets through IPsec tunnels based on the IPsec policies that are configured with the combinations of address prefixes between your on-premises network and the Azure Stack VNet. The policy, or traffic selector, is usually an access list in the VPN device configuration.

  >[!NOTE]
  >PolicyBased is supported in Azure, but not in Azure Stack.

* **RouteBased**: RouteBased VPNs use routes that are configured in the IP forwarding or routing table to direct packets to their corresponding tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy, or traffic selector, for RouteBased VPNs are configured as any-to-any (or use wild cards.) By default, they can't be changed. The value for a RouteBased VPN type is RouteBased.

The following PowerShell example specifies the **-VpnType** as RouteBased. When you're creating a gateway, you must make sure that the **-VpnType** is correct for your configuration.

```PowerShell
New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
-Location 'West US' -IpConfigurations $gwipconfig
-GatewayType Vpn -VpnType RouteBased
```

### Gateway requirements

The following table lists the requirements for VPN gateways.

| |PolicyBased Basic VPN Gateway | RouteBased Basic VPN Gateway | RouteBased Standard VPN Gateway | RouteBased High Performance VPN Gateway|
|--|--|--|--|--|
| **Site-to-Site connectivity (S2S connectivity)** | Not Supported | RouteBased VPN configuration | RouteBased VPN configuration | RouteBased VPN configuration |
| **Authentication method**  | Not Supported | Pre-shared key for S2S connectivity  | Pre-shared key for S2S connectivity  | Pre-shared key for S2S connectivity  |   
| **Maximum number of S2S connections**  | Not Supported | 10 | 10| 5|
|**Active routing support (BGP)** | Not supported | Not supported | Supported | Supported |

### Gateway subnet

Before you create a VPN gateway, you must create a gateway subnet. The gateway subnet has the IP addresses that the virtual network gateway VMs and services use. When you create your virtual network gateway, gateway VMs are deployed to the gateway subnet and configured with the required VPN gateway settings. **Don't** deploy anything else (for example, additional VMs) to the gateway subnet.

>[!IMPORTANT]
>The gateway subnet must be named **GatewaySubnet** to work properly. Azure Stack uses this name to identify the subnet to deploy the virtual network gateway VMs and services to.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway VMs and gateway services. Some configurations require more IP addresses than others. Look at the instructions for the configuration that you want to create and verify that the gateway subnet you want to create meets those requirements.

Additionally, you should make sure your gateway subnet has enough IP addresses to handle additional future configurations. Although you can create a gateway subnet as small as /29, we recommend you create a gateway subnet of /28 or larger (/28, /27, /26, and so on.) That way, if you add functionality in the future, you don't have to tear down your gateway, then delete and recreate the gateway subnet to allow for more IP addresses.

The following Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

```PowerShell
Add-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27
```

> [!IMPORTANT]
> When working with gateway subnets, avoid associating a network security group (NSG) to the gateway subnet. Associating a network security group to this subnet may cause your VPN gateway to stop functioning as expected. For more information about network security groups, see [What is a network security group?](/azure/virtual-network/virtual-networks-nsg).

### Local network gateways

When creating a VPN gateway configuration in Azure, the local network gateway often represents your on-premises location. In Azure Stack, it represents any remote VPN Device that sits outside Azure Stack. This could be a VPN device in your datacenter (or a remote datacenter), or a VPN Gateway in Azure.

You give the local network gateway a name, the public IP address of the VPN device, and specify the address prefixes that are on the on-premises location. Azure looks at the destination address prefixes for network traffic, consults the configuration that you have specified for your local network gateway, and routes packets accordingly.

The next PowerShell example creates a new local network gateway:

```PowerShell
New-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
-Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'
```

Sometimes you need to modify the local network gateway settings. For example, when you add or modify the address range, or if the IP address of the VPN device changes. See [Modify local network gateway settings using PowerShell](/azure/vpn-gateway/vpn-gateway-modify-local-network-gateway).

## IPsec/IKE parameters

When you set up a VPN Connection in Azure Stack, you need to configure the connection at both ends.  If you are configuring a VPN Connection between Azure Stack and a hardware device like a switch or router that is acting as a VPN Gateway, that device might ask you for additional settings.

Unlike Azure, which supports multiple offers as both an initiator and a responder, Azure Stack supports only one offer.

### IKE Phase 1 (Main Mode) parameters

| Property              | Value|
|-|-|
| IKE Version           | IKEv2 |
|Diffie-Hellman Group   | Group 2 (1024 bit) |
| Authentication Method | Pre-Shared Key |
|Encryption & Hashing Algorithms | AES256, SHA256 |
|SA Lifetime (Time)     | 28,800 seconds|

### IKE Phase 2 (Quick Mode) parameters

| Property| Value|
|-|-|
|IKE Version |IKEv2 |
|Encryption & Hashing Algorithms (Encryption)     | GCMAES256|
|Encryption & Hashing Algorithms (Authentication) | GCMAES256|
|SA Lifetime (Time)  | 27,000 seconds  |
|SA Lifetime (Bytes) | 33,553,408     |
|Perfect Forward Secrecy (PFS) |None<sup>See note 1</sup> |
|Dead Peer Detection | Supported|  

* *Note 1:*  Prior to version 1807, Azure Stack uses a value of PFS2048 for the Perfect Forward Secrecy (PFS).

## Next steps

[Connect using ExpressRoute](azure-stack-connect-expressroute.md)
