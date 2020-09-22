---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/17/2020
 ms.author: cherylmc
 ms.custom: include file
---
1. In the portal, click **+Create a resource**.
2. In the search box, type **Local network gateway**, then press **Enter** to search. This will return a list of results. Click **Local network gateway**, then click the **Create** button to open the **Create local network gateway** page.

   :::image type="content" source="./media/vpn-gateway-add-lng-rm-portal-include/create-local-gateway-ip.png" alt-text="Create the local network gateway":::

3. On the **Create local network gateway page**, specify the values for your local network gateway.

   - **Name:** Specify a name for your local network gateway object.
   - **Endpoint:** Select the endpoint type for the on-premises VPN device - **IP address** or **FQDN (Fully Qualified Domain Name)**.
      - **IP address**: If you have a static public IP address allocated from your Internet service provider for your VPN device, select the IP address option and fill in the IP address as shown in the example. This is the public IP address of the VPN device that you want Azure VPN gateway to connect to. If you don't have the IP address right now, you can use the values shown in the example, but you'll need to go back and replace your placeholder IP address with the public IP address of your VPN device. Otherwise, Azure will not be able to connect.
      - **FQDN**: If you have a dynamic public IP address that could change after certain period of time, usually determined by your Internet service provider, you can use a constant DNS name with a Dynamic DNS service to point to your current public IP address of your VPN device. Your Azure VPN gateway will resolve the FQDN to determine the public IP address to connect to. A screenshot below shows an example of using FQDN instead of IP address.
   - **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks that you want to connect to. Azure will route the address range that you specify to the on-premises VPN device IP address. *Use your own values here if you want to connect to your on-premises site, not the values shown in the example*.
   - **Configure BGP settings:** Use only when configuring BGP. Otherwise, don't select this.
   - **Subscription:** Verify that the correct subscription is showing.
   - **Resource Group:** Select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.
   - **Location:** Select the location that this object will be created in. You may want to select the same location that your VNet resides in, but you are not required to do so.

    This is the same page, but with FQDN highlighted:
   
   :::image type="content" source="./media/vpn-gateway-add-lng-rm-portal-include/create-local-gateway-fqdn.png" alt-text="Create the local network gateway - FQDN":::
   
   > [!NOTE]
   >
   > * Azure VPN supports only one IPv4 address for each FQDN. If the domain name resolves to multiple IP addresses, Azure VPN Gateway will use the first IP address returned by the DNS servers. To eliminate the uncertainty, it is recommended your FQDN always resolve to a single IPv4 address. IPv6 is not supported.
   > * Azure VPN Gateway maintains a DNS cache refreshed every 5 minutes. The gateway tries to resolve the FQDNs for disconnected tunnels only. Resetting the gateway will also trigger FQDN resolution.
   >

4. When you have finished specifying the values, select the **Create** button to create the gateway.
