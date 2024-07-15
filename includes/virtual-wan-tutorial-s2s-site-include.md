---
ms.author: cherylmc
author: cherylmc
ms.date: 07/28/2023
ms.service: virtual-wan
ms.topic: include
---

1. Navigate to your **Virtual WAN -> VPN sites** to open the **VPN sites** page.
1. On the **VPN sites** page, click **+Create site**.
1. On the **Create VPN Site** page, on the **Basics** tab, complete the following fields:

   :::image type="content" source="./media/virtual-wan-tutorial-site-include/site-basics.png" alt-text="Screenshot shows Create VPN site page with the Basics tab open." lightbox="./media/virtual-wan-tutorial-site-include/site-basics.png":::

    * **Region**: Previously referred to as location. This is the location you want to create this site resource in.
    * **Name**: The name by which you want to refer to your on-premises site.
    * **Device vendor**: The name of the VPN device vendor (for example: Citrix, Cisco, Barracuda). Adding the device vendor can help the Azure Team better understand your environment in order to add additional optimization possibilities in the future, or to help you troubleshoot.
    * **Private address space**: The IP address space that is located on your on-premises site. Traffic destined for this address space is routed to your local site. This is required when BGP isn't enabled for the site.
    
      >[!NOTE]
      >If you edit the address space after creating the site (for example, add an additional address space) it can take 8-10 minutes to update the effective routes while the components are recreated.
      >
1. Select **Links** to add information about the physical links at the branch. If you have a Virtual WAN partner CPE device, check with them to see if this information is exchanged with Azure as a part of the branch information upload set up from their systems.

   :::image type="content" source="./media/virtual-wan-tutorial-site-include/links.png" alt-text="Screenshot shows Create VPN site page with the Links tab open." lightbox="./media/virtual-wan-tutorial-site-include/links.png":::

   * **Link Name**: A name you want to provide for the physical link at the VPN Site. Example: mylink1.
   * **Link speed**: This is the speed of the VPN device at the branch location. Example: 50, which means 50 Mbps is the speed of the VPN device at the branch site.
   * **Link provider name**: The name of the physical link at the VPN Site. Example: ATT, Verizon.
   * **Link IP address/FQDN**: Public IP address of the on-premises device using this link. Optionally, you can provide the private IP address of your on-premises VPN device that is behind ExpressRoute. You can also include a fully qualified domain name. For example, *something.contoso.com*. The FQDN should be resolvable from the VPN gateway. This is possible if the DNS server hosting this FQDN is reachable over internet. IP address takes precedence when both IP address and FQDN are specified.

     >[!NOTE]
     >
     >* Supports one IPv4 address per FQDN. If the FQDN were to be resolved to multiple IP addresses, then the VPN gateway picks up the first IP4 address from the list. IPv6 addresses are not supported at this time.
     >
     >* VPN gateway maintains a DNS cache which is refreshed every 5 minutes. The gateway tries to resolve FQDNs for disconnected tunnels only. A gateway reset or configuration change can also trigger FQDN resolution.
     >
   * **Link Border Gateway Protocol**: Configuring BGP on a virtual WAN link is equivalent to configuring BGP on an Azure virtual network gateway VPN. Your on-premises BGP peer address must not be the same as the public IP address of your VPN to device or the VNet address space of the VPN site. Use a different IP address on the VPN device for your BGP peer IP. It can be an address assigned to the loopback interface on the device. Specify this address in the corresponding VPN site representing the location. For BGP prerequisites, see [About BGP with Azure VPN Gateway](../articles/vpn-gateway/vpn-gateway-bgp-overview.md). You can always edit a VPN link connection to update its BGP parameters (Peering IP on the link and the AS #).
1. You can add or delete more links. Four links per VPN Site are supported. For example, if you have four ISPs (Internet service provider) at the branch location, you can create four links, one per each ISP, and provide the information for each link.
1. Once you have finished filling out the fields, select **Review + create** to verify. Click **Create** to create the site.
1. Go to your **Virtual WAN**. On the **VPN sites** page, you should be able to see the site you created. If you can't see the site, you need to adjust the filter. Click the **X** in the **Hub association:** bubble to clear the filter.

   :::image type="content" source="./media/virtual-wan-tutorial-site-include/connect.png" alt-text="Screenshot shows Connect to this hub." lightbox="./media/virtual-wan-tutorial-site-include/connect.png":::
1. Once the filter has cleared, you can view your site.

   :::image type="content" source="./media/virtual-wan-tutorial-site-include/sites.png" alt-text="Screenshot shows site.":::
