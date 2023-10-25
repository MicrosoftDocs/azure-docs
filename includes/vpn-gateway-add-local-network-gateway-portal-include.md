---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/23/2023
 ms.author: cherylmc
 ms.custom: include file
---
1. From the [Azure portal](https://portal.azure.com), in **Search resources, services, and docs (G+/)** type **local network gateway**. Locate **local network gateway** under **Marketplace** in the search results and select it. This opens the **Create local network gateway** page.
1. On the **Create local network gateway page**, on the **Basics** tab, specifiy the values for your local network gateway.

   :::image type="content" source="./media/vpn-gateway-add-local-network-gateway-portal-include/basics.png" alt-text="Create a local network gateway with IP address." lightbox ="./media/vpn-gateway-add-local-network-gateway-portal-include/basics.png" :::

   * **Subscription:** Verify that the correct subscription is showing.
   * **Resource Group:** Select the resource group that you want to use. You can either create a new resource group, or select one that you've already created.
   * **Region:** Select the region that this object will be created in. You may want to select the same location that your VNet resides in, but you aren't required to do so.
   * **Name:** Specify a name for your local network gateway object.
   * **Endpoint:** Select the endpoint type for the on-premises VPN device - **IP address** or **FQDN (Fully Qualified Domain Name)**.
      * **IP address**: If you have a static public IP address allocated from your Internet service provider for your VPN device, select the IP address option and fill in the IP address as shown in the example. This is the public IP address of the VPN device that you want Azure VPN gateway to connect to. If you don't have the IP address right now, you can use the values shown in the example, but you'll need to go back and replace your placeholder IP address with the public IP address of your VPN device. Otherwise, Azure won't be able to connect.
      * **FQDN**: If you have a dynamic public IP address that could change after certain period of time, often determined by your Internet service provider, you can use a constant DNS name with a Dynamic DNS service to point to your current public IP address of your VPN device. Your Azure VPN gateway resolves the FQDN to determine the public IP address to connect to. 
   * **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here don't overlap with ranges of other networks that you want to connect to. Azure routes the address range that you specify to the on-premises VPN device IP address. *Use your own values here if you want to connect to your on-premises site, not the values shown in the example*.

   > [!NOTE]
   >
   > * Azure VPN supports only one IPv4 address for each FQDN. If the domain name resolves to multiple IP addresses, Azure VPN Gateway will use the first IP address returned by the DNS servers. To eliminate the uncertainty, we recommend that your FQDN always resolve to a single IPv4 address. IPv6 is not supported.
   > * Azure VPN Gateway maintains a DNS cache refreshed every 5 minutes. The gateway tries to resolve the FQDNs for disconnected tunnels only. Resetting the gateway will also trigger FQDN resolution.
   >

1. On the **Advanced** tab, you can configure BGP settings if needed.
1. When you have finished specifying the values, select **Review + create** at the bottom of the page to validate the page.
1. Select **Create** to create the local network gateway object.
