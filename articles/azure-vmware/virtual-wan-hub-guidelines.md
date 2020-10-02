---
title: Azure Virtual WAN hub guidelines for Azure VMware Solution
description: Learn how to establish a VPN (IPSEC IKEv1 and IKEv2) S2S tunnel terminating the Microsoft Azure Virtual WAN hub.
ms.topic: how-to
ms.date: 10/02/2020
---

# Azure Virtual WAN hub guidelines for Azure VMware Solution

In this article, we'll go through the steps to establish a VPN (IPsec IKEv1 and IKEv2) site-to-site tunnel terminating in the Microsoft Azure Virtual WAN hub. We'll create an Azure Virtual WAN hub and a VPN gateway with a public IP address attached to it. Then we'll create an Azure ExpressRoute gateway and establish an Azure VMware Solution endpoint. In addition, we'll go over the details of enabling a policy-based VPN on-premises setup. 

We'll walk you through the necessary procedures to:

1. Create an Azure Virtual WAN hub.
 
2. Create a VPN site.

3. Set up an on-premises, policy-based VPN site.

4. Connect your VPN site to the hub.

## Topology

:::image type="content" source="media/virtual-wan-hub-guidelines/vpn-s2s-tunnel-architecture.png" alt-text="VPN site-to-site tunnel architecture.":::

The Azure Virtual hub contains the Azure VMware Solution ExpressRoute gateway as well as the site-to-site VPN gateway. It connects an on-premise VPN device with an Azure VMware Solution endpoint.

## Before you begin

To create the site-to-site VPN tunnel, you'll need to create a public-facing IP address terminating on an on-premises VPN device.

## Create a Virtual WAN hub

1. In the Azure portal, search on **Virtual WANS**. Select **+Add**. The Create WAN page opens.  

2. Enter the required fields on the **Create WAN** page and then select **Review + Create**.
   
   | Field | Value |
   | --- | --- |
   | **Subscription** | Value is pre-populated with the Subscription belonging to the Resource Group. |
   | **Resource group** | The Virtual WAN is a global resource and is not confined to a specific region.  |
   | **Resource group location** | To create the Virtual WAN hub, you need to set a location for the resource group.  |
   | **Name** |   |
   | **Type** | Select **Standard**, which will allow more than just the VPN gateway traffic.  |


    :::image type="content" source="media/virtual-wan-hub-guidelines/create-wan.png" alt-text="Create WAN.":::

3. In the Azure portal, select the Virtual WAN you created in the previous step. Select **Create virtual hub**. Now create your virtual hub, which is a subnet (/24 minimum). Fill in the required fields on the **Basics** tab. Select **Next: Site to site**.

    :::image type="content" source="media/virtual-wan-hub-guidelines/create-virtual-hub.png" alt-text="Create Virtual hub.":::

4. On the **Site-to-site** tab, define the site-to-site gateway by setting the aggregate throughput from the **Gateway scale units** drop-down. 

   >[!TIP]
   >One scale unit = 500 Mbps. The scale units are set up in pairs for redundancy, each supporting 500 Mbps.
  
5. Follow the same procedure on the **ExpressRoute** tab to create an ExpressRoute gateway. A scale unit value here is 2 Gbps. 

    It takes approximately 30 minutes to create each hub. 

## Create a VPN site 

1. In **Recent resources** in the Azure portal, select the virtual WAN you created earlier. In the **Connectivity** section, select **VPN (Site to site)** and then **Create new VPN site**.

    :::image type="content" source="media/virtual-wan-hub-guidelines/create-vpn-site-basics.png" alt-text="Create VPN site.":::  
 
2. On the **Basics** tab, fill in the required fields. Make **Region** the same region you specified earlier. **Enable** Border Gateway Protocol (BGP) to ensure both Azure VMware Solution as well as on-premises servers advertize their routes across the tunnel. If BGP  is disabled, the subnets that need to be advertized must be manually maintained. If subnets are missed, HCX will fail to form the service mesh. For more information, see  [About BGP with Azure VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-bgp-overview). 

    **Private address space** is the classless inter-domain routing (CIDR) block located on-premises. It will be used to route all traffic bound for on-premises across the tunnel. The CIDR block is only required if BGP is NOT enabled.

3. Select the **Links** tab and fill in the required fields. Specifying link and provider names allow you to distinguish between any number of gateways that may eventually be created as part of the hub. BGP and autonomous system number (ASN) are critical, as these must be unique inside your organization.
 
## (Optional) Defining a virtual hub for policy-based VPNs

This section applies only to policy-based VPNs. Policy-based (or static, route-based) VPN setups are driven by on-premise VPN device capabilities in most cases. They require on-premise and Azure VMware Solution networks to be specified. In the case of Azure VMware Solution with an Azure Virtual WAN hub, you can't simply select *any* network. Instead, you have to specify all relevant on-premise and Azure VMware Solution Virtual WAN hub ranges. These hub ranges are used to specify the encryption domain of the policy base VPN tunnel on-premise endpoint. The Azure VMware Solution side only requires the policy-based traffic selector indicator to be enabled. 

1. In the Azure portal, go to your Virtual WAN hub site. In the **Connectivity** section of the virtual hub definition, select **VPN (Site to site)**.

2. Select the name of your Virtual WAN hub. Select the three dots at the far right of the VPN site, and select **edit VPN section to this hub**.
 
    :::image type="content" source="media/virtual-wan-hub-guidelines/edit-vpn-section-to-this-hub.png" alt-text="Edit VPN section to this hub.":::

3. For Internet Protocol Security (IPSec), select **Custom** and then **Use policy-based traffic selector**. Specify **IKE Phase 1 and 2**. Select **Save**.
 
    :::image type="content" source="media/virtual-wan-hub-guidelines/edit-vpn-connection.png" alt-text="Edit VPN section"::: 
 
    Your traffic selectors or subnets that are part of the policy-based encryption domain should be:
    
    - The virtual WAN hub /24
    - The Azure VMware Solution private cloud /22
    - The connected Azure virtual network (if present)

## Connect your VPN site to the hub

1. Check the box next to your VPN site name (see preceding screenshot) and then select **Connect VPN sites**. In the **Pre-shared key** field, enter the key previously defined for the on-premise endpoint. If you don't have a previously defined key, you can leave this field blank and a key will be automatically generated for you. 
 
    Only enable **Propagate Default Route** if you're deploying a firewall in the hub and it is the next hop for connections through that tunnel. Select **Connect**. A connection status screen will show the status of the tunnel creation.

2. Go to the Virtual WAN overview. Open the VPN site page and download the VPN configuration file to apply it to the on-premises endpoint.  

3. Now we'll patch the Azure VMware Solution ExpressRoute into the Virtual WAN hub. (This step requires first creating your private cloud.)

    Go to the **Connectivity** section of Azure VMware Solution private cloud. On the **ExpressRoute** tab, select **+ Request an authorization key**. Name it and select **Create**. (It may take about 30 seconds to create the key.) Copy the ExpressRoute ID and the authorization key. 

    :::image type="content" source="media/virtual-wan-hub-guidelines/express-route-connectivity.png" alt-text="Copy Express Route ID and authorization key.":::

    > [!NOTE]
    > The authorization key will disappear after some time, so copy it as soon as it appears.

4. Next, we'll link Azure VMware Solution and the VPN gateway together in the Virtual WAN hub. In the Azure portal, open the Virtual WAN you created earlier. Select the created Virtual WAN hub and then select **ExpressRoute** in the left pane. Select **+ Redeem authorization key**.

    :::image type="content" source="media/virtual-wan-hub-guidelines/redeem-authorization-key.png" alt-text="Redeem authorization key.":::

Paste the authorization key into the Authorization key field and the ExpressRoute ID into the **Peer circuit URI** field. Make sure to select **Automatically associate this ExpressRoute circuit with the hub.** Select **Add** to establish the link. 

5. To test your connection, [Create an NSX-T segment](https://docs.microsoft.com/azure/azure-vmware/tutorial-nsx-t-network-segment) and provision a VM on the network. Test end-to-end by pinging both the on-premise and Azure VMware Solution endpoints. 
