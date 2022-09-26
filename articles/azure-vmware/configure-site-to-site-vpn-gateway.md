---
title: Configure a site-to-site VPN in vWAN for Azure VMware Solution 
description: Learn how to establish a VPN (IPsec IKEv1 and IKEv2) site-to-site tunnel into Azure VMware Solutions.
ms.topic: how-to
ms.custom: contperf-fy22q1
ms.service: azure-vmware
ms.date: 04/11/2022
---

# Configure a site-to-site VPN in vWAN for Azure VMware Solution

In this article, you'll establish a VPN (IPsec IKEv1 and IKEv2) site-to-site tunnel terminating in the Microsoft Azure Virtual WAN hub. The hub contains the Azure VMware Solution ExpressRoute gateway and the site-to-site VPN gateway. It connects an on-premises VPN device with an Azure VMware Solution endpoint.

:::image type="content" source="media/create-ipsec-tunnel/vpn-s2s-tunnel-architecture.png" alt-text="Diagram showing VPN site-to-site tunnel architecture." border="false":::

## Prerequisites
You must have a public-facing IP address terminating on an on-premises VPN device.

## Create an Azure Virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## Create a virtual hub

A virtual hub is a virtual network that is created and used by Virtual WAN. It's the core of your Virtual WAN network in a region.  It can contain gateways for site-to-site and ExpressRoute. 

>[!TIP]
>You can also [create a gateway in an existing hub](../virtual-wan/virtual-wan-expressroute-portal.md#existinghub).


[!INCLUDE [Create a hub](../../includes/virtual-wan-hub-basics.md)]

## Create a VPN gateway 

[!INCLUDE [Create a gateway](../../includes/virtual-wan-tutorial-s2s-gateway-include.md)]


## Create a site-to-site VPN

1. In the Azure portal, select the virtual WAN you created earlier.

2. In the **Overview** of the virtual hub, select **Connectivity** > **VPN (Site-to-site)** > **Create new VPN site**.

   :::image type="content" source="media/create-ipsec-tunnel/create-vpn-site-basics.png" alt-text="Screenshot of the Overview page for the virtual hub, with VPN (site-to-site) and Create new VPN site selected.":::  
 
3. On the **Basics** tab, enter the required fields. 

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-site-include/site-basics.png" alt-text="Screenshot showing the Create VPN site page with the Basics tab open." lightbox="../../includes/media/virtual-wan-tutorial-site-include/site-basics.png":::

   * **Region** - Previously referred to as location. It's the location you want to create this site resource in.
   
   * **Name** - The name by which you want to refer to your on-premises site.
   
   * **Device vendor** - The name of the VPN device vendor, for example, Citrix, Cisco, or Barracuda. It helps the Azure Team better understand your environment to add more optimization possibilities in the future or help you troubleshoot.

   * **Private address space** - The CIDR IP address space located on your on-premises site. Traffic destined for this address space is routed to your local site. The CIDR block is only required if you [BGP](../vpn-gateway/bgp-howto.md) isn't enabled for the site.
    
   >[!NOTE]
   >If you edit the address space after creating the site (for example, add an additional address space) it can take 8-10 minutes to update the effective routes while the components are recreated.


1. Select **Links** to add information about the physical links at the branch. If you have a Virtual WAN partner CPE device, check with them to see if this information gets exchanged with Azure as a part of the branch information upload set up from their systems.

   Specifying link and provider names allow you to distinguish between any number of gateways that may eventually be created as part of the hub.  [BGP](../vpn-gateway/vpn-gateway-bgp-overview.md) and autonomous system number (ASN) must be unique inside your organization. BGP ensures that both Azure VMware Solution and the on-premises servers advertise their routes across the tunnel. If disabled, the subnets that need to be advertised must be manually maintained. If subnets are missed, HCX fails to form the service mesh. 
 
   >[!IMPORTANT]
   >By default, Azure assigns a private IP address from the GatewaySubnet prefix range automatically as the Azure BGP IP address on the Azure VPN gateway. The custom Azure APIPA BGP address is needed when your on premises VPN devices use an APIPA address (169.254.0.1 to 169.254.255.254) as the BGP IP. Azure VPN Gateway will choose the custom APIPA address if the corresponding local network gateway resource (on-premises network) has an APIPA address as the BGP peer IP. If the local network gateway uses a regular IP address (not APIPA), Azure VPN Gateway will revert to the private IP address from the GatewaySubnet range.

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-site-include/site-links.png" alt-text="Screenshot showing the Create VPN site page with the Links tab open." lightbox="../../includes/media/virtual-wan-tutorial-site-include/site-links.png":::

1. Select **Review + create**. 

1. Navigate to the virtual hub you want, and deselect **Hub association** to connect your VPN site to the hub.
 
   :::image type="content" source="../../includes/media/virtual-wan-tutorial-site-include/connect.png" alt-text="Screenshot shows Connect to this hub." lightbox="../../includes/media/virtual-wan-tutorial-site-include/connect.png":::   

## (Optional) Create policy-based VPN site-to-site tunnels

>[!IMPORTANT]
>This is an optional step and applies only to policy-based VPNs. 

[Policy-based VPN setups](../virtual-wan/virtual-wan-custom-ipsec-portal.md) require on-premises and Azure VMware Solution networks to be specified, including the hub ranges.  These ranges specify the encryption domain of the policy-based VPN tunnel on-premises endpoint.  The Azure VMware Solution side only requires the policy-based traffic selector indicator to be enabled. 

1. In the Azure portal, go to your Virtual WAN hub site and, under **Connectivity**, select **VPN (Site to site)**.

2. Select the VPN Site for which you want to set up a custom IPsec policy.

   :::image type="content" source="../virtual-wan/media/virtual-wan-custom-ipsec-portal/locate.png" alt-text="Screenshot showing the existing VPN sites to set up customer IPsec policies." lightbox="../virtual-wan/media/virtual-wan-custom-ipsec-portal/locate.png":::

3. Select your VPN site name, select **More** (...) at the far right, and then select **Edit VPN Connection**.

   :::image type="content" source="../virtual-wan/media/virtual-wan-custom-ipsec-portal/contextmenu.png" alt-text="Screenshot showing the context menu for an existing VPN site." lightbox="../virtual-wan/media/virtual-wan-custom-ipsec-portal/contextmenu.png":::

   - Internet Protocol Security (IPSec), select **Custom**.

   - Use policy-based traffic selector, select **Enable**

   - Specify the details for **IKE Phase 1** and **IKE Phase 2(ipsec)**. 

4. Change the IPsec setting from default to custom and customize the IPsec policy. Then select **Save**.

   :::image type="content" source="../virtual-wan/media/virtual-wan-custom-ipsec-portal/edit.png" alt-text="Screenshot showing the existing VPN sites." lightbox="../virtual-wan/media/virtual-wan-custom-ipsec-portal/edit.png":::

   Your traffic selectors or subnets that are part of the policy-based encryption domain should be:
    
   - Virtual WAN hub `/24`

   - Azure VMware Solution private cloud `/22`

   - Connected Azure virtual network (if present)

## Connect your VPN site to the hub

1. Select your VPN site name and then select **Connect VPN sites**. 

1. In the **Pre-shared key** field, enter the key previously defined for the on-premises endpoint. 

   >[!TIP]
   >If you don't have a previously defined key, you can leave this field blank. A key is generated for you automatically. 

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-connect-vpn-site-include/connect.png" alt-text="Screenshot that shows the Connected Sites pane for Virtual HUB ready for a Pre-shared key and associated settings. "::: 

1. If you're deploying a firewall in the hub and it's the next hop, set the **Propagate Default Route** option to **Enable**. 

   When enabled, the Virtual WAN hub propagates to a connection only if the hub already learned the default route when deploying a firewall in the hub or if another connected site has forced tunneling enabled. The default route does not originate in the Virtual WAN hub.  

1. Select **Connect**. After a few minutes, the site shows the connection and connectivity status.

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-connect-vpn-site-include/status.png" alt-text="Screenshot that shows a site-to-site connection and connectivity status." lightbox="../../includes/media/virtual-wan-tutorial-connect-vpn-site-include/status.png":::

   **Connection Status:** Status of the Azure resource for the connection that connects the VPN site to the Azure hub’s VPN gateway. Once this control plane operation is successful, the Azure VPN gateway and the on-premises VPN device establish connectivity.

   **Connectivity Status:** Actual connectivity (data path) status between Azure’s VPN gateway in the hub and VPN site. It can show any of the following states:

    * **Unknown**: Typically seen if the backend systems are working to transition to another status.
    * **Connecting**: Azure VPN gateway is trying to reach out to the actual on-premises VPN site.
    * **Connected**: Connectivity established between Azure VPN gateway and on-premises VPN site.
    * **Disconnected**: Typically seen if disconnected for any reason (on-premises or in Azure)



1. Download the VPN configuration file and apply it to the on-premises endpoint.  
   
   1. On the VPN (Site to site) page, near the top, select **Download VPN Config**.  Azure creates a storage account in the resource group 'microsoft-network-\[location\]', where location is the location of the WAN. After you have applied the configuration to your VPN devices, you can delete this storage account.

   1. Once created, select the link to download it. 

   1. Apply the configuration to your on-premises VPN device.

   For more information about the configuration file, see [About the VPN device configuration file](../virtual-wan/virtual-wan-site-to-site-portal.md#config-file).

1. Patch the Azure VMware Solution ExpressRoute in the Virtual WAN hub. 

   >[!IMPORTANT]
   >You must first have a private cloud created before you can patch the platform. 


   [!INCLUDE [request-authorization-key](includes/request-authorization-key.md)]

1. Link Azure VMware Solution and the VPN gateway together in the Virtual WAN hub. You'll use the authorization key and ExpressRoute ID (peer circuit URI) from the previous step.

   1. Select your ExpressRoute gateway and then select **Redeem authorization key**.

      :::image type="content" source="media/create-ipsec-tunnel/redeem-authorization-key.png" alt-text="Screenshot of the ExpressRoute page for the private cloud, with Redeem authorization key selected.":::

   1. Paste the authorization key in the **Authorization Key** field.

   1. Paste the ExpressRoute ID into the **Peer circuit URI** field. 

   1. Select **Automatically associate this ExpressRoute circuit with the hub** check box. 

   1. Select **Add** to establish the link. 

1. Test your connection by [creating an NSX-T Data Center segment](./tutorial-nsx-t-network-segment.md) and provisioning a VM on the network. Ping both the on-premises and Azure VMware Solution endpoints.

   >[!NOTE]
   >Wait approximately 5 minutes before you test connectivity from a client behind your ExpressRoute circuit, for example, a VM in the VNet that you created earlier.
