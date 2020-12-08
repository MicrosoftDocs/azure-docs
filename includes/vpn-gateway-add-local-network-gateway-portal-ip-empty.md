---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/22/2020
 ms.author: cherylmc
 ms.custom: include file
---
1. From the [Azure portal](https://portal.azure.com), in **Search resources, services, and docs (G+/)** type **local network gateway**. Locate **local network gateway** under **Marketplace** in the search results and select it. This opens the **Create local network gateway** page.
1. On the **Create local network gateway page**, specify the values for your local network gateway.

   :::image type="content" source="./media/vpn-gateway-add-local-network-gateway-portal-ip-empty/create-ip.png" alt-text="Create a local network gateway with IP address":::

   * **Name:** Specify a name for your local network gateway object.
   * **Endpoint:** Select the endpoint type for the on-premises VPN device - **IP address** or **FQDN (Fully Qualified Domain Name)**.
      * **IP address**: If you have a static public IP address allocated from your Internet service provider for your VPN device, select the IP address option and fill in the IP address as shown in the example. This is the public IP address of the VPN device that you want Azure VPN gateway to connect to. If you don't have the IP address right now, you can use the values shown in the example, but you'll need to go back and replace your placeholder IP address with the public IP address of your VPN device. Otherwise, Azure will not be able to connect.
   * **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks that you want to connect to. Azure will route the address range that you specify to the on-premises VPN device IP address. *Use your own values here if you want to connect to your on-premises site, not the values shown in the example*.
   * **Configure BGP settings:** Use only when configuring BGP. Otherwise, don't select this.
   * **Subscription:** Verify that the correct subscription is showing.
   * **Resource Group:** Select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.
   * **Location:** The location is the same as **Region** in other settings. Select the location that this object will be created in. You may want to select the same location that your VNet resides in, but you are not required to do so.

1. When you have finished specifying the values, select the **Create** button at the bottom of the page to create the local network gateway.
