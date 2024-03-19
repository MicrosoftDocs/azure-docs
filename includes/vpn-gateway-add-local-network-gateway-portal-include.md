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
1. In the [Azure portal](https://portal.azure.com), in **Search resources, services, and docs (G+/)**, enter **local network gateway**. Locate **local network gateway** under **Marketplace** in the search results and select it to open the **Create local network gateway** page.
1. On the **Create local network gateway page**, on the **Basics** tab, specify the values for your local network gateway.

   :::image type="content" source="./media/vpn-gateway-add-local-network-gateway-portal-include/basics.png" alt-text="Screenshot that shows creating a local network gateway with IP address." lightbox ="./media/vpn-gateway-add-local-network-gateway-portal-include/basics.png" :::

   * **Subscription**: Verify that the correct subscription is showing.
   * **Resource group**: Select the resource group that you want to use. You can either create a new resource group or select one that you've already created.
   * **Region**: Select the region where this object will be created. You might want to select the same location where your virtual network resides, but you aren't required to do so.
   * **Name**: Specify a name for your local network gateway object.
   * **Endpoint**: Select the endpoint type for the on-premises VPN device as **IP address** or **FQDN (Fully Qualified Domain Name)**.
      * **IP address**: If you have a static public IP address allocated from your internet service provider (ISP) for your VPN device, select the IP address option. Fill in the IP address as shown in the example. This address is the public IP address of the VPN device that you want Azure VPN Gateway to connect to. If you don't have the IP address right now, you can use the values shown in the example. Later, you must go back and replace your placeholder IP address with the public IP address of your VPN device. Otherwise, Azure can't connect.
      * **FQDN**: If you have a dynamic public IP address that could change after a certain period of time, often determined by your ISP, you can use a constant DNS name with a Dynamic DNS service to point to your current public IP address of your VPN device. Your Azure VPN gateway resolves the FQDN to determine the public IP address to connect to.
   * **Address space**: The address space refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here don't overlap with ranges of other networks that you want to connect to. Azure routes the address range that you specify to the on-premises VPN device IP address. *Use your own values here if you want to connect to your on-premises site, not the values shown in the example*.

   > [!NOTE]
   >
   > * Azure VPN Gateway supports only one IPv4 address for each FQDN. If the domain name resolves to multiple IP addresses, VPN Gateway uses the first IP address returned by the DNS servers. To eliminate the uncertainty, we recommend that your FQDN always resolve to a single IPv4 address. IPv6 isn't supported.
   > * VPN Gateway maintains a DNS cache that's refreshed every 5 minutes. The gateway tries to resolve the FQDNs for disconnected tunnels only. Resetting the gateway also triggers FQDN resolution.
   > * Although the Azure VPN Gateway supports multiple connections to different Local Network Gateways with different FQDNs, all FQDNs must resolve to different IP addresses.
   >  

1. On the **Advanced** tab, you can configure BGP settings, if needed.
1. After you specify the values, select **Review + create** at the bottom of the page to validate the page.
1. Select **Create** to create the local network gateway object.
