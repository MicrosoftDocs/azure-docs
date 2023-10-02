---
title: 'Connect a virtual network gateway to an Azure Virtual WAN'
description: Learn how to connect an Azure VPN gateway (virtual network gateway) to an Azure Virtual WAN VPN gateway.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc

---

# Connect a VPN Gateway (virtual network gateway) to Virtual WAN

This article helps you set up connectivity from an Azure VPN Gateway (virtual network gateway) to an Azure Virtual WAN (VPN gateway). Creating a connection from a VPN Gateway (virtual network gateway) to a Virtual WAN (VPN gateway) is similar to setting up connectivity to a virtual WAN from branch VPN sites.

In order to minimize possible confusion between two features, we'll preface the gateway with the name of the feature that we're referring to. For example, VPN Gateway virtual network gateway, and  Virtual WAN VPN gateway.

## Before you begin

Before you begin, create the following resources:

Azure Virtual WAN

* [Create a virtual WAN](virtual-wan-site-to-site-portal.md#openvwan).
* [Create a hub](virtual-wan-site-to-site-portal.md#hub).
* [Create an S2S VPN gateway](virtual-wan-site-to-site-portal.md#gateway) configured in the hub.

Virtual Network (for virtual network gateway)

* [Create a virtual network](../virtual-network/quick-create-portal.md) without any virtual network gateways. This virtual network will be configured with an active/active virtual network gateway in later steps. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to.


## <a name="vnetgw"></a>1. Configure VPN Gateway virtual network gateway

In this section you create a VPN Gateway virtual network gateway in active-active mode for your virtual network. When you create the gateway, you can either use existing public IP addresses for the two instances of the gateway, or you can create new public IPs. You'll use these public IPs when setting up the Virtual WAN sites. 

1. Create a **VPN Gateway** virtual network gateway in active-active mode for your virtual network. For more information about active-active VPN gateways and configuration steps, see [Configure active-active VPN gateways](../vpn-gateway/vpn-gateway-activeactive-rm-powershell.md#aagateway).

1. The following sections show example settings for your virtual network gateway.

   * **Active-active mode setting** - On the virtual network gateway **Configuration** page, make sure **active-active** mode is enabled.

     :::image type="content" source="./media/connect-virtual-network-gateway-vwan/active.png" alt-text="Screenshot showing a virtual network gateway with active-active mode enabled." lightbox="./media/connect-virtual-network-gateway-vwan/active.png":::

   * **BGP setting** - On the virtual network gateway **Configuration** page, you can (optionally) select **Configure BGP ASN**. If you configure BGP, change the ASN from the default value shown in the portal. For this configuration, the BGP ASN can't be 65515. 65515 will be used by Azure Virtual WAN.

     :::image type="content" source="./media/connect-virtual-network-gateway-vwan/bgp.png" alt-text="Screenshot shows a virtual network gateway Configuration page with Configure BGP ASN selected." lightbox="./media/connect-virtual-network-gateway-vwan/bgp.png":::

   * **Public IP addresses** - Once the gateway is created, go to the **Properties** page. The properties and configuration settings will be similar to the following example. Notice the two public IP addresses that are used for the gateway.

     :::image type="content" source="./media/connect-virtual-network-gateway-vwan/public-ip.png" alt-text="Screenshot shows a virtual network gateway Properties page with properties selected." lightbox="./media/connect-virtual-network-gateway-vwan/public-ip.png":::

## <a name="vwansite"></a>2. Create Virtual WAN VPN sites

In this section, you'll create two Virtual WAN VPN sites that correspond to the virtual network gateways you created in the previous section.

1. On your **Virtual WAN** page, go to **VPN sites**.
1. On the **VPN sites** page, select **+Create site**.
1. On the **Create VPN Site** page, on the **Basics** tab, complete the following fields:

   * **Region**: The same region as the Azure VPN Gateway virtual network gateway.
   * **Name**: Example: Site1
   * **Device vendor**: The name of the VPN device vendor (for example: Citrix, Cisco, Barracuda). Adding the device vendor can help the Azure Team better understand your environment in order to add additional optimization possibilities in the future, or to help you troubleshoot.
   * **Private address space**: Enter a value, or leave blank when BGP is enabled.
1. Select **Next: Links>** to advance to the **Links** page.
1. On the **Links** page, complete the following fields:

   * **Link Name**: A name you want to provide for the physical link at the VPN Site. Example: Link1.
   * **Link speed**: This is the speed of the VPN device at the branch location. Example: 50, which means 50 Mbps is the speed of the VPN device at the branch site.
   * **Link provider name**: The name of the physical link at the VPN Site. Example: ATT, Verizon.
   * **Link IP Address** - Enter the IP address. For this configuration, it's the same as the first public IP address shown under the (VPN Gateway) virtual network gateway properties.
   * **BGP Address** and **ASN** - These must be the same as one of the BGP peer IP addresses, and ASN from the VPN Gateway virtual network gateway that you configured in [Step 1](#vnetgw).

1. Once you have finished filling out the fields, select **Review + create** to verify. Select **Create** to create the site.
1. Repeat the previous steps to create the second site to match with the second instance of the VPN Gateway virtual network gateway. You'll keep the same settings, except using second public IP address and second BGP peer IP address from VPN Gateway configuration.
1. You now have two sites successfully provisioned.

## <a name="connect-sites"></a>3. Connect sites to the virtual hub

Next, connect both sites to your virtual hub using the following steps. For more information about connecting sites, see [Connect VPN sites to a virtual hub](virtual-wan-site-to-site-portal.md#connectsites).

1. On your Virtual WAN page, go to **Hubs**.

1. On the **Hubs** page, click the hub that you created.

1. On the page for the hub that you created, in  the left pane, select **VPN (Site to site)**.

1. On the **VPN (Site to site)** page, you should see your sites. If you don't, you may need to click the **Hub association:x** bubble to clear the filters and view your site.

1. Select the checkbox next to the name of both sites (don't click the site name directly), then click **Connect VPN sites**.

1. On the **Connect sites** page, configure the settings. Make sure to note the **Pre-shared key** value that you use. It will be used again later in the exercise when you create your connections.
1. At the bottom of the page, select **Connect**. It takes a short while for the hub to update with the site settings.

## <a name="downloadconfig"></a>4. Download the VPN configuration files

In this section, you download the VPN configuration file for the sites that you created in the previous section.

1. On your Virtual WAN page, go to **VPN sites**.
1. On the **VPN sites** page, at the top of the page, select **Download Site-to-Site VPN configuration** and download the file. Azure creates a configuration file with the necessary values that are used to configure your local network gateways in the next section.

   :::image type="content" source="./media/connect-virtual-network-gateway-vwan/download.png" alt-text="Screenshot of VPN sites page with the Download Site-to-Site VPN configuration action selected." lightbox="./media/connect-virtual-network-gateway-vwan/download.png":::

## <a name="createlocalgateways"></a>5. Create the local network gateways

In this section, you create two Azure VPN Gateway local network gateways. The configuration files from the previous step contain the gateway configuration settings. Use these settings to create and configure the Azure VPN Gateway local network gateways.

1. Create the local network gateway using these settings. For information about how to create a VPN Gateway local network gateway, see the VPN Gateway article [Create a local network gateway](../vpn-gateway/tutorial-site-to-site-portal.md#LocalNetworkGateway).

   * **IP address** - Use the Instance0 IP Address shown for *gatewayconfiguration* from the configuration file.
   * **BGP** - If the connection is over BGP, select **Configure BGP settings** and enter the ASN '65515'. Enter the BGP peer IP address. Use 'Instance0 BgpPeeringAddresses' for *gatewayconfiguration* from the configuration file.
   * **Address Space** - If the connection isn't over BGP, make sure **Configure BGP settings** remains unchecked. Enter the address spaces that you're going to advertise from the virtual network gateway side. You can add multiple address space ranges. Make sure that the ranges you specify here don't overlap with ranges of other networks that you want to connect to.
   * **Subscription, Resource Group, and Location** - These are same as for the Virtual WAN hub.
1. Review and create the local network gateway. Your local network gateway should look similar to this example.

   :::image type="content" source="./media/connect-virtual-network-gateway-vwan/local-1.png" alt-text="Screenshot that shows the Configuration page with an IP address highlighted for local network gateway 1." lightbox="./media/connect-virtual-network-gateway-vwan/local-1.png":::
1. Repeat these steps to create another local network gateway, but this time, use the 'Instance1' values instead of 'Instance0' values from the configuration file.

   :::image type="content" source="./media/connect-virtual-network-gateway-vwan/local-2.png" alt-text="Screenshot that shows the Configuration page with an IP address highlighted for local network gateway 2." lightbox="./media/connect-virtual-network-gateway-vwan/local-2.png":::
   
> [!IMPORTANT] 
> 
> Please be aware that when configuring a BGP Over IPsec connection to a Public IP that is NOT a vWAN Gateway Public IP address with the remote ASN '65515', the Local Network Gateway deployment will fail as the ASN '65515' is a documented reserved ASN as depicted in [What Autonomous Systems Can I use](../vpn-gateway/vpn-gateway-vpn-faq.md#bgp). However, when the Local Network Gateway reads the vWAN Public address with the remote ASN '65515', this restriction is lifted by the platform.
> 
   

## <a name="createlocalgateways"></a>6. Create connections

In this section, you create a connection between the VPN Gateway local network gateways and virtual network gateway. For steps on how to create a VPN Gateway connection, see [Configure a connection](../vpn-gateway/tutorial-site-to-site-portal.md#CreateConnection).

1. In the portal, go to your virtual network gateway and select **Connections**. At the top of the Connections page, select **+Add** to open the **Add connection** page.
1. On the **Add connection** page, configure the following values for your connection:

   * **Name:** Name your connection.
   * **Connection type:** Select **Site-to-site(IPSec)**
   * **Virtual network gateway:** The value is fixed because you're connecting from this gateway.
   * **Local network gateway:** This connection will connect the virtual network gateway to the local network gateway. Choose one of the local network gateways that you created earlier.
   * **Shared Key:** Enter the shared key from earlier.
   * **IKE Protocol:** Choose the IKE protocol.
1. Select **OK** to create your connection.
1. You can view the connection in the **Connections** page of the virtual network gateway.
1. Repeat the preceding steps to create a second connection. For the second connection, select the other local network gateway that you created.
1. If the connections are over BGP, after you've created your connections, go to a connection and select **Configuration**. On the **Configuration** page, for **BGP**, select **Enabled**. Then, select **Save**.
1. Repeat for the second connection.

## <a name="test"></a>7. Test connections

You can test the connectivity by creating two virtual machines, one on the side of the VPN Gateway virtual network gateway, and one in a virtual network for the Virtual WAN, and then ping the two virtual machines.

1. Create a virtual machine in the virtual network (Test1-VNet) for Azure VPN Gateway (Test1-VNG). Don't create the virtual machine in the GatewaySubnet.
1. Create another virtual network to connect to the virtual WAN. Create a virtual machine in a subnet of this virtual network. This virtual network can't contain any virtual network gateways. You can quickly create a virtual network using the PowerShell steps in the [site-to-site connection](virtual-wan-site-to-site-portal.md#vnet) article. Be sure to change the values before running the cmdlets.
1. Connect the VNet to the Virtual WAN hub. On the page for your virtual WAN, select **Virtual network connections**, then **+Add connection**. On the **Add connection** page, fill in the following fields:

    * **Connection name** - Name your connection.
    * **Hubs** - Select the hub you want to associate with this connection.
    * **Subscription** - Verify the subscription.
    * **Virtual network** - Select the virtual network you want to connect to this hub. The virtual network can't have an already existing virtual network gateway.
1. Select **OK** to create the virtual network connection.
1. Connectivity is now set between the VMs. You should be able to ping one VM from the other, unless there are any firewalls or other policies blocking the communication.

## Next steps

* For more information about Virtual WAN site-to-site VPN, see [Tutorial: Virtual WAN Site-to-site VPN](virtual-wan-site-to-site-portal.md).
* For more information about VPN Gateway active-active gateway settings, see [VPN Gateway active-active configurations](../vpn-gateway/active-active-portal.md).
