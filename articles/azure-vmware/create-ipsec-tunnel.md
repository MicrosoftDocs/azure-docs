---
title: Create an IPSec tunnel into Azure VMware Solution
description: Learn how to establish a VPN (IPsec IKEv1 and IKEv2) site-to-site tunnel into Azure VMware Solutions.
ms.topic: how-to
ms.date: 03/23/2021
---

# Create an IPSec tunnel into Azure VMware Solution

In this article, we'll go through the steps to establish a VPN (IPsec IKEv1 and IKEv2) site-to-site tunnel terminating in the Microsoft Azure Virtual WAN hub. The hub contains the Azure VMware Solution ExpressRoute gateway and the site-to-site VPN gateway. It connects an on-premise VPN device with an Azure VMware Solution endpoint.

:::image type="content" source="media/create-ipsec-tunnel/vpn-s2s-tunnel-architecture.png" alt-text="Diagram showing VPN site-to-site tunnel architecture." border="false":::

In this how to, you'll:
- Create an Azure Virtual WAN hub and a VPN gateway with a public IP address attached to it. 
- Create an Azure ExpressRoute gateway and establish an Azure VMware Solution endpoint. 
- Enable a policy-based VPN on-premises setup. 

## Prerequisites
You must have a public-facing IP address terminating on an on-premises VPN device.

## Step 1. Create an Azure Virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## Step 2. Create a Virtual WAN hub and gateway

>[!TIP]
>You can also [create a gateway in an existing hub](../virtual-wan/virtual-wan-expressroute-portal.md#existinghub).

1. Select the Virtual WAN you created in the previous step.

1. Select **Create virtual hub**, enter the required fields, and then select **Next: Site to site**. 

   Enter the subnet using a `/24` (minimum).

   :::image type="content" source="media/create-ipsec-tunnel/create-virtual-hub.png" alt-text="Screenshot showing the Create virtual hub page.":::

4. Select the **Site-to-site** tab, define the site-to-site gateway by setting the aggregate throughput from the **Gateway scale units** drop-down. 

   >[!TIP]
   >The scale units are in pairs for redundancy, each supporting 500 Mbps (one scale unit = 500 Mbps). 
  
   :::image type="content" source="../../includes/media/virtual-wan-tutorial-hub-include/site-to-site.png" alt-text="Screenshot showing the Site-to-site details.":::

5. Select the **ExpressRoute** tab, create an ExpressRoute gateway. 

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-er-hub-include/hub2.png" alt-text="Screenshot of the ExpressRoute settings.":::

   >[!TIP]
   >A scale unit value is 2 Gbps. 

    It takes approximately 30 minutes to create each hub. 

## Step 3. Create a site-to-site VPN

1. In the Azure portal, select the virtual WAN you created earlier.

2. In the **Overview** of the virtual hub, select **Connectivity** > **VPN (Site-to-site)** > **Create new VPN site**.

   :::image type="content" source="media/create-ipsec-tunnel/create-vpn-site-basics.png" alt-text="Screenshot of the Overview page for the virtual hub, with VPN (site-to-site) and Create new VPN site selected.":::  
 
3. On the **Basics** tab, enter the required fields. 

   :::image type="content" source="media/create-ipsec-tunnel/create-vpn-site-basics2.png" alt-text="Screenshot of the Basics tab for the new VPN site.":::  

   1. Set the **Border Gateway Protocol** to **Enable**.  When enabled, it ensures that both Azure VMware Solution and the on-premises servers advertise their routes across the tunnel. If disabled, the subnets that need to be advertised must be manually maintained. If subnets are missed, HCX will fail to form the service mesh. For more information, see  [About BGP with Azure VPN Gateway](../vpn-gateway/vpn-gateway-bgp-overview.md).
   
   1. For the **Private address space**, enter the on-premises CIDR block. It's used to route all traffic bound for on-premises across the tunnel.  The CIDR block is only required if you don't enable BGP.

1. Select **Next : Links** and fill in the required fields. Specifying link and provider names allow you to distinguish between any number of gateways that may eventually be created as part of the hub. BGP and autonomous system number (ASN) must be unique inside your organization.

   :::image type="content" source="media/create-ipsec-tunnel/create-vpn-site-links.png" alt-text="Screenshot that shows link details.":::

1. Select **Review + create**. 

1. Navigate to the virtual hub that you want, and deselect **Hub association** to connect your VPN site to the hub.
 
   :::image type="content" source="../../includes/media/virtual-wan-tutorial-site-include/connect.png" alt-text="Screenshot that shows the Connected Sites pane for Virtual HUB ready for Pre-shared key and associated settings.":::   

## Step 4. (Optional) Create policy-based VPN site-to-site tunnels

>[!IMPORTANT]
>This is an optional step and applies only to policy-based VPNs. 

Policy-based VPN setups require on-premise and Azure VMware Solution networks to be specified, including the hub ranges.  These hub ranges specify the encryption domain of the policy-based VPN tunnel on-premise endpoint.  The Azure VMware Solution side only requires the policy-based traffic selector indicator to be enabled. 

1. In the Azure portal, go to your Virtual WAN hub site. Under **Connectivity**, select **VPN (Site to site)**.

2. Select your VPN site name, the ellipsis (...) at the far right, and then **edit VPN connection to this hub**.
 
   :::image type="content" source="media/create-ipsec-tunnel/edit-vpn-section-to-this-hub.png" alt-text="Screenshot of the page in Azure for the Virtual WAN hub site showing an ellipsis selected to access Edit VPN connection to this hub." lightbox="media/create-ipsec-tunnel/edit-vpn-section-to-this-hub.png":::

3. Edit the connection between the VPN site and the hub, and then select **Save**.
   - Internet Protocol Security (IPSec), select **Custom**.
   - Use policy-based traffic selector, select **Enable**
   - Specify the details for **IKE Phase 1** and **IKE Phase 2(ipsec)**. 
 
   :::image type="content" source="media/create-ipsec-tunnel/edit-vpn-connection.png" alt-text="Screenshot of Edit VPN connection page."::: 
 
   Your traffic selectors or subnets that are part of the policy-based encryption domain should be:
    
   - Virtual WAN hub `/24`
   - Azure VMware Solution private cloud `/22`
   - Connected Azure virtual network (if present)

## Step 5. Connect your VPN site to the hub

1. Select your VPN site name and then select **Connect VPN sites**. 

1. In the **Pre-shared key** field, enter the key previously defined for the on-premise endpoint. 

   >[!TIP]
   >If you don't have a previously defined key, you can leave this field blank. A key is generated for you automatically. 

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-connect-vpn-site-include/connect.png" alt-text="Screenshot that shows the Connected Sites pane for Virtual HUB ready for a Pre-shared key and associated settings. "::: 

1. If you're deploying a firewall in the hub and it's the next hop, set the **Propagate Default Route** option to **Enable**. 

   When enabled, the Virtual WAN hub propagates to a connection only if the hub already learned the default route when deploying a firewall in the hub or if another connected site has forced tunneling enabled. The default route does not originate in the Virtual WAN hub.  

1. Select **Connect**. After a few minutes, the site shows the connection and connectivity status.

   :::image type="content" source="../../includes/media/virtual-wan-tutorial-connect-vpn-site-include/status.png" alt-text="Screenshot that shows a site-to-site connection and connectivity status." lightbox="../../includes/media/virtual-wan-tutorial-connect-vpn-site-include/status.png":::

1. [Download the VPN configuration file](../virtual-wan/virtual-wan-site-to-site-portal.md#device) for the on-premises endpoint.  

3. Patch the Azure VMware Solution ExpressRoute in the Virtual WAN hub. 

   >[!IMPORTANT]
   >You must first have a private cloud created before you can patch the platform. 

   [!INCLUDE [request-authorization-key](includes/request-authorization-key.md)]

4. Link Azure VMware Solution and the VPN gateway together in the Virtual WAN hub. You'll use the authorization key and ExpressRoute ID (peer circuit URI) from the previous step.

   1. Select your ExpressRoute gateway and then select **Redeem authorization key**.

      :::image type="content" source="media/create-ipsec-tunnel/redeem-authorization-key.png" alt-text="Screenshot of the ExpressRoute page for the private cloud, with Redeem authorization key selected.":::

   1. Paste the authorization key in the **Authorization Key** field.
   1. Paste the ExpressRoute ID into the **Peer circuit URI** field. 
   1. Select **Automatically associate this ExpressRoute circuit with the hub** check box. 
   1. Select **Add** to establish the link. 

5. Test your connection by [creating an NSX-T segment](./tutorial-nsx-t-network-segment.md) and provisioning a VM on the network. Ping both the on-premise and Azure VMware Solution endpoints.
