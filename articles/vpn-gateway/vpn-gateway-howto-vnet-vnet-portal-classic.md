---
title: 'Create a connection between VNets: classic: Azure portal'
description: Learn how to connect classic Azure virtual networks together using PowerShell and the Azure portal.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.custom:
ms.topic: how-to
ms.date: 10/31/2023
ms.author: cherylmc
---
# Configure a VNet-to-VNet connection (classic)

This article helps you create a VPN gateway connection between virtual networks. The virtual networks can be in the same or different regions, and from the same or different subscriptions.

The steps in this article apply to the classic (legacy) deployment model and don't apply to the current deployment model, Resource Manager. You can no longer create a gateway using the classic deployment model. See the [Resource Manager version of this article](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) instead.

> [!IMPORTANT]
> [!INCLUDE [classic gateway restrictions](../../includes/vpn-gateway-classic-gateway-restrict-create.md)]

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-portal-classic/classic-diagram.png" alt-text="Diagram showing classic VNet-to-VNet architecture.":::

[!INCLUDE [deployment models](../../includes/vpn-gateway-classic-deployment-model-include.md)]

## About VNet-to-VNet connections

Connecting a virtual network to another virtual network (VNet-to-VNet) in the classic deployment model using a VPN gateway is similar to connecting a virtual network to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE.

The VNets you connect can be in different subscriptions and different regions. You can combine VNet to VNet communication with multi-site configurations. This lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity.

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-portal-classic/about-connections.png" alt-text="Diagram showing VNet-VNet connections.":::

### <a name="why"></a>Why connect virtual networks?

You might want to connect virtual networks for the following reasons:

* **Cross region geo-redundancy and geo-presence**

  * You can set up your own geo-replication or synchronization with secure connectivity without going over Internet-facing endpoints.
  * With Azure Load Balancer and Microsoft or third-party clustering technology, you can set up highly available workload with geo-redundancy across multiple Azure regions. One important example is to set up SQL Always On with Availability Groups spreading across multiple Azure regions.
* **Regional multi-tier applications with strong isolation boundary**

  * Within the same region, you can set up multi-tier applications with multiple VNets connected together with strong isolation and secure inter-tier communication.
* **Cross subscription, inter-organization communication in Azure**

  * If you have multiple Azure subscriptions, you can connect workloads from different subscriptions together securely between virtual networks.
  * For enterprises or service providers, you can enable cross-organization communication with secure VPN technology within Azure.

For more information about VNet-to-VNet connections, see [VNet-to-VNet considerations](#faq) at the end of this article.

## Prerequisites

We use the portal for most of the steps, but you must use PowerShell to create the connections between the VNets. You can't create the connections using the Azure portal because there's no way to specify the shared key in the portal. [!INCLUDE [vpn-gateway-classic-powershell](../../includes/vpn-gateway-powershell-classic-locally.md)]

## <a name="planning"></a>Planning

It’s important to decide the ranges that you’ll use to configure your virtual networks. For this configuration, you must make sure that none of your VNet ranges overlap with each other, or with any of the local networks that they connect to.

### <a name="vnet"></a>VNets

For this exercise, we use the following example values:

**Values for TestVNet1**

Name: TestVNet1<br>
Address space: 10.11.0.0/16, 10.12.0.0/16 (optional)<br>
Subnet name: default<br>
Subnet address range: 10.11.0.0/24<br>
Resource group: ClassicRG<br>
Location: East US<br>
GatewaySubnet: 10.11.1.0/27

**Values for TestVNet4**

Name: TestVNet4<br>
Address space: 10.41.0.0/16, 10.42.0.0/16 (optional)<br>
Subnet name: default<br>
Subnet address range: 10.41.0.0/24<br>
Resource group: ClassicRG<br>
Location: West US<br>
GatewaySubnet: 10.41.1.0/27

### <a name="plan"></a>Connections

The following table shows an example of how you connect your VNets. Use the ranges as a guideline only. Write down the ranges for your virtual networks. You need this information for later steps.

In this example, TestVNet1 connects to a local network site that you create named 'VNet4Local'. The settings for VNet4Local contain the address prefixes for TestVNet4.
The local site for each VNet is the other VNet. The following example values are used for our configuration:

**Example**

| Virtual Network | Address Space | Location | Connects to local network site |
|:--- |:--- |:--- |:--- |
| TestVNet1 |TestVNet1<br>(10.11.0.0/16)<br>(10.12.0.0/16) |East US |SiteVNet4<br>(10.41.0.0/16)<br>(10.42.0.0/16) |
| TestVNet4 |TestVNet4<br>(10.41.0.0/16)<br>(10.42.0.0/16) |West US |SiteVNet1<br>(10.11.0.0/16)<br>(10.12.0.0/16) |

## <a name="vnetvalues"></a>Create virtual networks

In this step, you create two classic virtual networks, TestVNet1 and TestVNet4. If you're using this article as an exercise, use the [example values](#vnet).

**When creating your VNets, keep in mind the following settings:**

* **Virtual Network Address Spaces** – On the Virtual Network Address Spaces page, specify the address range that you want to use for your virtual network. These are the dynamic IP addresses that will be assigned to the VMs and other role instances that you deploy to this virtual network.<br>The address spaces you select can't overlap with the address spaces for any of the other VNets or on-premises locations that this VNet will connect to.

* **Location** – When you create a virtual network, you associate it with an Azure location (region). For example, if you want your VMs that are deployed to your virtual network to be physically located in West US, select that location. You can’t change the location associated with your virtual network after you create it.

**After creating your VNets, you can add the following settings:**

* **Address space** – Additional address space isn't required for this configuration, but you can add additional address space after creating the VNet.

* **Subnets** – Additional subnets aren't required for this configuration, but you might want to have your VMs in a subnet that is separate from your other role instances.

* **DNS servers** – Enter the DNS server name and IP address. This setting doesn't create a DNS server. It allows you to specify the DNS servers that you want to use for name resolution for this virtual network.

### To create a classic virtual network

[!INCLUDE [basic classic vnet](../../includes/vpn-gateway-vnet-classic.md)]

[!INCLUDE [basic classic DNS](../../includes/vpn-gateway-dns-classic.md)]

## <a name="localsite"></a>Configure sites and gateways

Azure uses the settings specified in each local network site to determine how to route traffic between the VNets. Each VNet must point to the respective local network that you want to route traffic to. You determine the name you want to use to refer to each local network site. It's best to use something descriptive.

For example, TestVNet1 connects to a local network site that you create named 'VNet4Local'. The settings for VNet4Local contain the address prefixes for TestVNet4.

Keep in mind, the local site for each VNet is the other VNet.

| Virtual Network | Address Space | Location | Connects to local network site |
|:--- |:--- |:--- |:--- |
| TestVNet1 |TestVNet1<br>(10.11.0.0/16)<br>(10.12.0.0/16) |East US |SiteVNet4<br>(10.41.0.0/16)<br>(10.42.0.0/16) |
| TestVNet4 |TestVNet4<br>(10.41.0.0/16)<br>(10.42.0.0/16) |West US |SiteVNet1<br>(10.11.0.0/16)<br>(10.12.0.0/16) |

### <a name="site"></a>To configure a site

The local site typically refers to your on-premises location. It contains the IP address of the VPN device to which you'll create a connection, and the IP address ranges that are routed through the VPN gateway to the VPN device.

1. On the page for your VNet, under **Settings**, select **Site-to-site connections**.
1. On the Site-to-site connections page, select **+ Add**.
1. On the **Configure a VPN connection and gateway** page, for **Connection type**, leave **Site-to-site** selected.

   * **VPN gateway IP address:** This is the public IP address of the VPN device for your on-premises network. For this exercise, you can put in a dummy address because you don't yet have the IP address for the VPN gateway for the other site. For example, 5.4.3.2. Later, once you have configured the gateway for the other VNet, you can adjust this value.

   * **Client Address space:** List the IP address ranges that you want routed to the other VNet through this gateway. You can add multiple address space ranges. Make sure that the ranges you specify here don't overlap with ranges of other networks your virtual network connects to, or with the address ranges of the virtual network itself.
1. At the bottom of the page, DO NOT select Review + create. Instead, select **Next: Gateway>**.

### <a name="sku"></a>To configure a virtual network gateway

1. On the **Gateway** page, select the following values:

   * **Size:** This is the gateway SKU that you use to create your virtual network gateway. Classic VPN gateways use the old (legacy) gateway SKUs. For more information about the legacy gateway SKUs, see [Working with virtual network gateway SKUs (old SKUs)](vpn-gateway-about-skus-legacy.md). You can select **Standard** for this exercise.

   * **Gateway subnet:** The size of the gateway subnet that you specify depends on the VPN gateway configuration that you want to create. While it's possible to create a gateway subnet as small as /29, we recommend that you use /27 or /28. This creates a larger subnet that includes more addresses. Using a larger gateway subnet allows for enough IP addresses to accommodate possible future configurations.

1. Select **Review + create** at the bottom of the page to validate your settings. Select **Create** to deploy. It can take up to 45 minutes to create a virtual network gateway, depending on the gateway SKU that you selected.
1. You can start proceed to the next step while this gateway is creating.

### Configure TestVNet4 settings

Repeat the steps for [Create a site and gateway](#localsite) to configure TestVNet4, substituting the values when necessary. If you're doing this as an exercise, use the [example values](#planning).

## <a name="updatelocal"></a>Update local sites

After your virtual network gateways have been created for both VNets, you must adjust the local site properties for **VPN gateway IP address**.

|VNet name|Connected site|Gateway IP address|
|:--- |:--- |:--- |
|TestVNet1|VNet4Local|VPN gateway IP address for TestVNet4|
|TestVNet4|VNet1Local|VPN gateway IP address for TestVNet1|

### Part 1 - Get the virtual network gateway public IP address

1. Navigate to your VNet by going to the **Resource group** and selecting the virtual network.
1. On the page for your virtual network, in the **Essentials** pane on the right, locate the **Gateway IP address** and copy to clipboard.

### Part 2 - Modify the local site properties

1. Under Site-to-site connections, select the connection. For example, SiteVNet4.
1. On the **Properties** page for the Site-to-site connection, select **Edit local site**.
1. In the **VPN gateway IP address** field, paste the VPN gateway IP address you copied in the previous section.
1. Select **OK**.
1. The field is updated in the system. You can also use this method to add additional IP address that you want to route to this site.

### Part 3 - Repeat steps for the other VNet

Repeat the steps for TestVNet4.

## <a name="getvalues"></a>Retrieve configuration values

[!INCLUDE [retrieve values](../../includes/vpn-gateway-values-classic.md)]

## <a name="createconnections"></a>Create connections

When all the previous steps have been completed, you can set the IPsec/IKE preshared keys and create the connection. This set of steps uses PowerShell. VNet-to-VNet connections for the classic deployment model can't be configured in the Azure portal because the shared key can't be specified in the portal.

In the examples, notice that the shared key is exactly the same. The shared key must always match. Be sure to replace the values in these examples with the exact names for your VNets and Local Network Sites.

1. Create the TestVNet1 to TestVNet4 connection. Make sure to change the values.

   ```powershell
   Set-AzureVNetGatewayKey -VNetName 'Group ClassicRG TestVNet1' `
   -LocalNetworkSiteName 'value for _VNet4Local' -SharedKey A1b2C3D4
   ```
2. Create the TestVNet4 to TestVNet1 connection.

   ```powershell
   Set-AzureVNetGatewayKey -VNetName 'Group ClassicRG TestVNet4' `
   -LocalNetworkSiteName 'value for _VNet1Local' -SharedKey A1b2C3D4
   ```
3. Wait for the connections to initialize. Once the gateway has initialized, the Status is 'Successful'.

   ```
   Error          :
   HttpStatusCode : OK
   Id             :
   Status         : Successful
   RequestId      :
   StatusCode     : OK
   ```

## <a name="faq"></a>FAQ and considerations

These considerations apply to classic virtual networks and classic virtual network gateways.

* The virtual networks can be in the same or different subscriptions.
* The virtual networks can be in the same or different Azure regions (locations).
* A cloud service or a load-balancing endpoint can't span across virtual networks, even if they're connected together.
* Connecting multiple virtual networks together doesn't require any VPN devices.
* VNet-to-VNet supports connecting Azure Virtual Networks. It doesn't support connecting virtual machines or cloud services that aren't deployed to a virtual network.
* VNet-to-VNet requires dynamic routing gateways. Azure static routing gateways aren't supported.
* Virtual network connectivity can be used simultaneously with multi-site VPNs. There is a maximum of 10 VPN tunnels for a virtual network VPN gateway connecting to either other virtual networks, or on-premises sites.
* The address spaces of the virtual networks and on-premises local network sites must not overlap. Overlapping address spaces cause the creation of virtual networks or uploading netcfg configuration files to fail.
* Redundant tunnels between a pair of virtual networks aren't supported.
* All VPN tunnels for the VNet, including P2S VPNs, share the available bandwidth for the VPN gateway, and the same VPN gateway uptime SLA in Azure.
* VNet-to-VNet traffic travels across the Azure backbone.

## Next steps

Verify your connections. See [Verify a VPN Gateway connection](vpn-gateway-verify-connection-resource-manager.md).
