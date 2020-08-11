---
title: 'Configure ExpressRoute encryption: IPsec over ExpressRoute for Azure Virtual WAN'
description: In this tutorial, learn how to use Azure Virtual WAN to create a site-to-site VPN connection over ExpressRoute private peering.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 03/19/2020
ms.author: cherylmc

---
# ExpressRoute encryption: IPsec over ExpressRoute for Virtual WAN

This article shows you how to use Azure Virtual WAN to establish an IPsec/IKE VPN connection from your on-premises network to Azure over the private peering of an Azure ExpressRoute circuit. This technique can provide an encrypted transit between the on-premises networks and Azure virtual networks over ExpressRoute, without going over the public internet or using public IP addresses.

## Topology and routing

The following diagram shows an example of VPN connectivity over ExpressRoute private peering:

![VPN over ExpressRoute](./media/vpn-over-expressroute/vwan-vpn-over-er.png)

The diagram shows a network within the on-premises network connected to the Azure hub VPN gateway over ExpressRoute private peering. The connectivity establishment is straightforward:

1. Establish ExpressRoute connectivity with an ExpressRoute circuit and private peering.
2. Establish the VPN connectivity as described in this article.

An important aspect of this configuration is routing between the on-premises networks and Azure over both the ExpressRoute and VPN paths.

### Traffic from on-premises networks to Azure

For traffic from on-premises networks to Azure, the Azure prefixes (including the virtual hub and all the spoke virtual networks connected to the hub) are advertised via both the ExpressRoute private peering BGP and the VPN BGP. This results in two network routes (paths) toward Azure from the on-premises networks:

- One over the IPsec-protected path
- One directly over ExpressRoute *without* IPsec protection 

To apply encryption to the communication, you must make sure that for the VPN-connected network in the diagram, the Azure routes via on-premises VPN gateway are preferred over the direct ExpressRoute path.

### Traffic from Azure to on-premises networks

The same requirement applies to the traffic from Azure to on-premises networks. To ensure that the IPsec path is preferred over the direct ExpressRoute path (without IPsec), you have two options:

- Advertise more specific prefixes on the VPN BGP session for the VPN-connected network. You can advertise a larger range that encompasses the VPN-connected network over ExpressRoute private peering, then more specific ranges in the VPN BGP session. For example, advertise 10.0.0.0/16 over ExpressRoute, and 10.0.1.0/24 over VPN.

- Advertise disjoint prefixes for VPN and ExpressRoute. If the VPN-connected network ranges are disjoint from other ExpressRoute connected networks, you can advertise the prefixes in the VPN and ExpressRoute BGP sessions respectively. For example, advertise 10.0.0.0/24 over ExpressRoute, and 10.0.1.0/24 over VPN.

In both of these examples, Azure will send traffic to 10.0.1.0/24 over the VPN connection rather than directly over ExpressRoute without VPN protection.

> [!WARNING]
> If you advertise the *same* prefixes over both ExpressRoute and VPN connections, Azure will use the ExpressRoute path directly without VPN protection.
>

## Before you begin

[!INCLUDE [Before you begin](../../includes/virtual-wan-tutorial-vwan-before-include.md)]

## <a name="openvwan"></a>1. Create a virtual WAN and hub with gateways

The following Azure resources and the corresponding on-premises configurations must be in place before you proceed:

- An Azure virtual WAN
- A virtual WAN hub with an [ExpressRoute gateway](virtual-wan-expressroute-portal.md) and a [VPN gateway](virtual-wan-site-to-site-portal.md)

For the steps to create an Azure virtual WAN and a hub with an ExpressRoute association, see [Create an ExpressRoute association using Azure Virtual WAN](virtual-wan-expressroute-portal.md). For the steps to create a VPN gateway in the virtual WAN, see [Create a site-to-site connection using Azure Virtual WAN](virtual-wan-site-to-site-portal.md).

## <a name="site"></a>2. Create a site for the on-premises network

The site resource is the same as the non-ExpressRoute VPN sites for a virtual WAN. The IP address of the on-premises VPN device can now be either a private IP address, or a public IP address in the on-premises network reachable via ExpressRoute private peering created in step 1.

> [!NOTE]
> The IP address for the on-premises VPN device *must* be part of the address prefixes advertised to the virtual WAN hub via Azure ExpressRoute private peering.
>

1. Go to the Azure portal in your browser. 
1. Select the WAN that you created. On the WAN page, under **Connectivity**, select **VPN sites**.
1. On the **VPN sites** page, select **+Create site**.
1. On the **Create site** page, fill in the following fields:
   * **Subscription**: Verify the subscription.
   * **Resource Group**: Select or create the resource group that you want to use.
   * **Region**: Enter the Azure region for the VPN site resource.
   * **Name**: Enter the name by which you want to refer to your on-premises site.
   * **Device vendor**: Enter the vendor of the on-premises VPN device.
   * **Border Gateway Protocol**: Select "Enable" if your on-premises network uses BGP.
   * **Private address space**: Enter the IP address space that's located on your on-premises site. Traffic destined for this address space is routed to the on-premises network via the VPN gateway.
   * **Hubs**: Select one or more hubs to connect this VPN site. The selected hubs must have VPN gateways already created.
1. Select **Next: Links >** for the VPN link settings:
   * **Link Name**: The name by which you want to refer to this connection.
   * **Provider Name**: The name of the internet service provider for this site. For an ExpressRoute on-premises network, it's the name of the ExpressRoute service provider.
   * **Speed**: The speed of the internet service link or ExpressRoute circuit.
   * **IP address**: The public IP address of the VPN device that resides on your on-premises site. Or, for ExpressRoute on-premises, it's the private IP address of the VPN device via ExpressRoute.

   If BGP is enabled, it will apply to all connections created for this site in Azure. Configuring BGP on a virtual WAN is equivalent to configuring BGP on an Azure VPN gateway. 
   
   Your on-premises BGP peer address *must not* be the same as the IP address of your VPN to the device or the virtual network address space of the VPN site. Use a different IP address on the VPN device for your BGP peer IP. It can be an address assigned to the loopback interface on the device. However, it *can't* be an APIPA (169.254.*x*.*x*) address. Specify this address in the corresponding local network gateway that represents the location. For BGP prerequisites, see [About BGP with Azure VPN Gateway](../vpn-gateway/vpn-gateway-bgp-overview.md).

1. Select **Next: Review + create >** to check the setting values and create the VPN site. If you selected **Hubs** to connect, the connection will be established between the on-premises network and the hub VPN gateway.

## <a name="hub"></a>3. Update the VPN connection setting to use ExpressRoute

After you create the VPN site and connect to the hub, use the following steps to configure the connection to use ExpressRoute private peering:

1. Go back to the virtual WAN resource page, and select the hub resource. Or navigate from the VPN site to the connected hub.
1. Under **Connectivity**, select **VPN (Site-to-Site)**.
1. Select the ellipsis (**...**) on the VPN site over ExpressRoute, and select **Edit VPN connection to this hub**.
1. For **Use Azure Private IP Address**, select **Yes**. The setting configures the hub VPN gateway to use private IP addresses within the hub address range on the gateway for this connection, instead of the public IP addresses. This will ensure that the traffic from the on-premises network traverses the ExpressRoute private peering paths rather than using the public internet for this VPN connection. The following screenshot shows the setting.

   ![Setting for using a private IP address for the VPN connection](./media/vpn-over-expressroute/vpn-link-configuration.png)
   
1. Select **Save**.

After you save your changes, the hub VPN gateway will use the private IP addresses on the VPN gateway to establish the IPsec/IKE connections with the on-premises VPN device over ExpressRoute.

## <a name="associate"></a>4. Get the private IP addresses for the hub VPN gateway

Download the VPN device configuration to get the private IP addresses of the hub VPN gateway. You need these addresses to configure the on-premises VPN device.

1. On the page for your hub, select **VPN (Site-to-Site)** under **Connectivity**.
1. At the top of the **Overview** page, select **Download VPN Config**. 

   Azure creates a storage account in the resource group "microsoft-network-[location]," where *location* is the location of the WAN. After you apply the configuration to your VPN devices, you can delete this storage account.
1. After the file is created, select the link to download it.
1. Apply the configuration to your VPN device.

### VPN device configuration file

The device configuration file contains the settings to use when you're configuring your on-premises VPN device. When you view this file, notice the following information:

* **vpnSiteConfiguration**: This section denotes the device details set up as a site that's connecting to the virtual WAN. It includes the name and public IP address of the branch device.
* **vpnSiteConnections**: This section provides information about the following settings:

    * Address space of the virtual hub's virtual network.<br/>Example:
           ```
           "AddressSpace":"10.51.230.0/24"
           ```
    * Address space of the virtual networks that are connected to the hub.<br>Example:
           ```
           "ConnectedSubnets":["10.51.231.0/24"]
            ```
    * IP addresses of the virtual hub's VPN gateway. Because each connection of the VPN gateway is composed of two tunnels in active-active configuration, you'll see both IP addresses listed in this file. In this example, you see `Instance0` and `Instance1` for each site, and they're private IP addresses instead of public IP addresses.<br>Example:
           ``` 
           "Instance0":"10.51.230.4"
           "Instance1":"10.51.230.5"
           ```
    * Configuration details for the VPN gateway connection, such as BGP and pre-shared key. The pre-shared key is automatically generated for you. You can always edit the connection on the **Overview** page for a custom pre-shared key.
  
### Example device configuration file

```
[{
      "configurationVersion":{
        "LastUpdatedTime":"2019-10-11T05:57:35.1803187Z",
        "Version":"5b096293-edc3-42f1-8f73-68c14a7c4db3"
      },
      "vpnSiteConfiguration":{
        "Name":"VPN-over-ER-site",
        "IPAddress":"172.24.127.211",
        "LinkName":"VPN-over-ER"
      },
      "vpnSiteConnections":[{
        "hubConfiguration":{
          "AddressSpace":"10.51.230.0/24",
          "Region":"West US 2",
          "ConnectedSubnets":["10.51.231.0/24"]
        },
        "gatewayConfiguration":{
          "IpAddresses":{
            "Instance0":"10.51.230.4",
            "Instance1":"10.51.230.5"
          }
        },
        "connectionConfiguration":{
          "IsBgpEnabled":false,
          "PSK":"abc123",
          "IPsecParameters":{"SADataSizeInKilobytes":102400000,"SALifeTimeInSeconds":3600}
        }
      }]
    },
    {
      "configurationVersion":{
        "LastUpdatedTime":"2019-10-11T05:57:35.1803187Z",
        "Version":"fbdb34ea-45f8-425b-9bc2-4751c2c4fee0"
      },
      "vpnSiteConfiguration":{
        "Name":"VPN-over-INet-site",
        "IPAddress":"13.75.195.234",
        "LinkName":"VPN-over-INet"
      },
      "vpnSiteConnections":[{
        "hubConfiguration":{
          "AddressSpace":"10.51.230.0/24",
          "Region":"West US 2",
          "ConnectedSubnets":["10.51.231.0/24"]
        },
        "gatewayConfiguration":{
          "IpAddresses":{
            "Instance0":"51.143.63.104",
            "Instance1":"52.137.90.89"
          }
        },
        "connectionConfiguration":{
          "IsBgpEnabled":false,
          "PSK":"abc123",
          "IPsecParameters":{"SADataSizeInKilobytes":102400000,"SALifeTimeInSeconds":3600}
        }
      }]
}]
```

### Configuring your VPN device

If you need instructions to configure your device, you can use the instructions on the [VPN device configuration scripts page](~/articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#configscripts) with the following caveats:

* The instructions on the VPN device page are not written for a virtual WAN. But you can use the virtual WAN values from the configuration file to manually configure your VPN device. 
* The downloadable device configuration scripts that are for the VPN gateway don't work for the virtual WAN, because the configuration is different.
* A new virtual WAN can support both IKEv1 and IKEv2.
* A virtual WAN can use only route-based VPN devices and device instructions.

## <a name="viewwan"></a>5. View your virtual WAN

1. Go to the virtual WAN.
1. On the **Overview** page, each point on the map represents a hub.
1. In the **Hubs and connections** section, you can view hub, site, region, and VPN connection status. You can also view bytes in and out.

## <a name="connectmon"></a>7. Monitor a connection

Create a connection to monitor communication between an Azure virtual machine (VM) and a remote site. For information about how to set up a connection monitor, see [Monitor network communication](~/articles/network-watcher/connection-monitor.md). The source field is the VM IP in Azure, and the destination IP is the site IP.

## <a name="cleanup"></a>8. Clean up resources

When you no longer need these resources, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources that it contains. Run the following PowerShell command, and replace `myResourceGroup` with the name of your resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

This article helps you create a VPN connection over ExpressRoute private peering by using Virtual WAN. To learn more about Virtual WAN and related features, see the [Virtual WAN overview](virtual-wan-about.md).
