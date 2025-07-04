---
title: 'Site-to-Site High Bandwidth tunnels in the Azure portal'
description: In this article, you learn how to create a VPN Gateway site-to-site IPsec with High Bandwidth tunnels to establish connection between your on-premises network and a virtual network through the ExpressRoute private peering.
titleSuffix: Azure VPN Gateway
author: fabferri
ms.author: fabferri
ms.service: azure-vpn-gateway
ms.topic: tutorial
ms.date: 06/02/2025

#customer intent: As a network engineer, I want to create a site-to-site VPN connection between my on-premises location and my Azure virtual network with High Bandwidth tunnels with transit through ExpressRoute private peering.
---

# Create a Site-to-Site High Bandwidth tunnels in the Azure portal (Preview)
The Azure VPN Gateway High Bandwidth tunnels introduce significant improvements, enabling high-performance IPsec connections between the on-premises network and the Azure VNet. These High Bandwidth tunnels are established between a VPN device on-premises and the Azure VPN Gateway deployed in the Azure VNet, transiting through an ExpressRoute private peering. Utilizing private IP address networks on-premises, these tunnels create a secure overlay network between the on-premises infrastructure and the Azure VNet.

The High Bandwidth tunnels meet customer security compliance requirements by providing end-to-end encryption, effectively overcoming encryption bottlenecks. It allows for the establishment of four tunnels between the Azure VPN Gateway and the on-premises VPN device. The High Bandwidth tunnels allow to create two Connections with two IPsec tunnels for each Connection. Each IPsec tunnel can deliver a throughput of 5Gbps, achieving a total encrypted aggregate throughput of 20Gbps. The network diagram clarifies the configuration:

![1]

## Prerequisites
To deploy the site-to-site High Bandwidth tunnels, your Azure subscription needs to be enabled. To enable this feature, please send an email to [email address]. <br>
The VPN High Bandwidth tunnels require the presence of FastPath in ExpressRoute Connection. Currently FastPath is supported only in ExpressRoute Direct Port Pair. Therefore, the ExpressRoute circuit required to be deployed on ExpressRoute Direct port pair for the correct setting of the solution.

This article assumes the presence in the Azure subscription of an ExpressRoute circuit configured on Direct port pair with private peering, along with a Virtual Network (VNet). In the article the Azure VNet is created with address space 10.1.0.0./16 and Gateway subnet 10.1.0.0/26 <br>


## <a name="VNetGateway"></a>Create an ExpressRoute Gateway 
The ExpressRoute Gateway can be only deployed in the GatewaySubnet. The ExpressRoute Gateway needs to be deployed with one of the following SKUs:
- UltraPerformance
- ErGw3AZ
- ERGwScale with a minimum of 20 scale units

![2]

## <a name="VNetGateway"></a>Create an ExpressRoute Connection
The ExpressRoute connection establishes a link between the  ExpressRoute Gateway and the ExpressRoute circuit. The FastPath feature can be enabled in the ExpressRoute Connection by the following powershell command:

```powershell
Connect-AzAccount
Set-AzContext -SubscriptionId <Subscription id here>

$connection = Get-AzVirtualNetworkGatewayConnection -Name '_ER_CONNECTION_NAME_' -ResourceGroupName '_RG_NAME_'
$connection.ExpressRouteGatewayBypass = $true
Set-AzVirtualNetworkGatewayConnection  -VirtualNetworkGatewayConnection $connection
```
After enabling FastPath, the value of **$connection.ExpressRouteGatewayBypass** should have the value **$true**.

In the Azure management portal navigate to the Connections blade of your ExpressRoute circuit. Under Settings-Configuration, verified the FastPath setting to Enable

![3]

The ExpressRoute connection requires the activation of the attribute **EnablePrivateLinkFastPath**
```powershell
$connection.EnablePrivateLinkFastPath = $true
Set-AzVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection
```

At this stage of deployment, the Azure VNet is connected to the on-premises networks, and ExpressRoute is properly configured to support High Bandwidth tunnels.

## <a name="on-premises network"></a>Advertisement of the on-premises network to the ExpressRoute circuit
IPsec tunnels are established via transit through ExpressRoute private peering. To enable these tunnels, the private IP addresses of the on-premises VPN device must be advertised from the customer’s edge routers to the Microsoft Enterprise Edge (MSEE) routers.
The customer has two configuration options:
- Advertise to the MSEE routers a major on-premises private network that includes the IPs of the VPN devices. In this case, to ensure traffic from Azure to on-premises flows through the VPN Gateway, a User Defined Route (UDR) must be configured in the Azure subnets with next-hop the Virtual Network Gateway. Without a UDR, Azure traffic will bypass the VPN Gateway and traverse the ExpressRoute circuit directly not encrypted, but not through the intended VPN path.
- Advertise to the MSEE routers only the on-premises VPN device IPs. The edge routers advertise only the specific private IPs assigned to the on-premises VPN device. This ensures that all traffic between Azure and on-premises is routed through the site-to-site VPN tunnel. In this case, the UDRs in the Azure subnets are not required.



## <a name="VNetGateway"></a>Create a VPN gateway High Bandwidth tunnel (preview)
In this step, you create a virtual network gateway (VPN gateway) High Bandwidth tunnels for your virtual network. The High Bandwidth tunnel is supported only on VpnGw5AZ SKU.
To create a High Bandwidth VPN Gateway via the Azure portal, use the following link: https://aka.ms/highBandwidthVpnGateway  <br>
Once in the Azure portal:
1. Search for "Virtual network gateway" in the top search bar.
1. Select Create and configure the VPN gateway using the specified values for High Bandwidth setup.

* **Name**: vpnHB
* **Gateway type**: VPN
* **SKU**: VpnGw5AZ
* **Generation**: Generation 2
* **Enable Advanced Connectivity**: Enabled 
* **Virtual network**: VNet1
* **Gateway subnet address range**: 10.1.0.0/26
* **Public IP address**: Create new
* **Public IP address name:** vpnHBT-pip1
* **Public IP address SKU:** Standard
* **Assignment:** Static
* **Second Public IP address**: Create new
* **Second Public IP address name:** vpnHBT-pip2
* **Public IP address SKU:** Standard
* **Assignment:** Static
* **Configure BGP**: Disabled

![4]

![5]

> [!NOTE]
> To select the High Bandwidth VPN Gateway in the Azure portal, enable the **Enable Advanced Connectivity** property during gateway creation. When this option is selected, Azure automatically configures the gateway in active-active mode.
>  High Banwidth tunnels can be deployed with static routing or BGP. The High Bandwidth tunnels is supported only in VPN Gateway route-based.

A gateway can take 45 minutes or more to fully create and deploy. You can see the deployment status on the **Overview** page for your gateway.

In a High Bandwidth VPN Gateway setup, traffic is routed through the private IP addresses of the VPN Gateway instance. Although two public IP addresses are still assigned during deployment, their exclusive function is to facilitate communication with the Azure control plane. These public IPs are not involved in establishing IPsec tunnels.

## <a name="LocalNetworkGateway"></a>Create a local network gateway

The local network gateway is an Azure resource that represents your on-premises site for routing purposes. You assign it a name for Azure to reference, specify the IP address of your on-premises VPN device, and define the IP address prefixes that should be routed through the VPN gateway to that device. These prefixes correspond to your on-premises network.

If your VPN device has two IP addresses you want to connect to, you must create a separate local network gateway for each one. <br>
You can create the Local Network Gateways only when you know the IP addresses assigned to the outbound interfaces of the on-premises VPN device.

![6]

Create two local network gateways by using the following values:

* **Name**: vpnLocalNetGw1
* **Location**: West US 2
* **IP Address**: 192.168.1.1
* **Address Space(s)**: 10.10.0.0/16
* **Configure BGP settings**: NO

* **Name**: vpnLocalNetGw2
* **Location**: West US 2
* **IP Address**: 192.168.1.5
* **Address Space(s)**: 10.10.0.0/16
* **Configure BGP settings**: NO

![7]

![8]

After the deployment of the two Local Network Gateways you are ready to proceed with VPN Connections.

## <a name="CreateConnection"></a>Create VPN Connections
The VPN High Bandwidth Gateway supports a maximum of two VPN Connections. 
A single VPN Connection can establish two tunnels with your on-premises VPN device. <br>
Create two Connections by using the following values:

* **Connection type**: Site-to-site
* **Name**: vpnConn1
* **Virtual network gateway**: vpnHB
* **Local network gateway name**: vpnConn1
* **Shared key**: For this example, you use **abc123**. But you can use whatever is compatible with your VPN hardware. The important thing is that the values match on both sides of the connection.

* **Connection type**: Site-to-site
* **Name**: vpnConn2
* **Virtual network gateway**: vpnHB
* **Local network gateway name**: vpnConn2
* **Shared Key (PSK)**: For this example, you use **abc123**.

![9]

![10]

![11]

![12]

![13]

![14]

> [!NOTE]
> Only after the deployment of two VPN Connections, through the Azure portal you can discover the private IP addresses assigned to the VPN Gateway instances.

In Azure portal select the Azure VPN Gateway and then **Settings** and **Connections**

![15]

The Connection view displays the tunnel IP addresses associated with the VPN Gateway instance and their corresponding peers—represented by Local Network Gateways. In our High Bandwidth VPN Gateway setup, the tunnel IPs are mapped as follows:

tunnel IP: 10.1.6 peered with Local Network Gateway vpnLocalGw1
tunnel IP: 10.1.8 peered with Local Network Gateway vpnLocalGw1
tunnel IP: 10.1.7 peered with Local Network Gateway vpnLocalGw2
tunnel IP: 10.1.9 peered with Local Network Gateway vpnLocalGw2

This mapping reflects how each tunnel IP is paired with a specific local network gateway to establish site-to-site VPN connections.



## <a name="VPNDevice"></a>Configure your VPN device on-premises
Configuring the on-premises VPN device is the final step. The information gathered up to this point is sufficient to complete the device configuration.  

![16]

When you configure your VPN device, you need the following values:

* **Shared key**: This shared key is the same one that you specify when you create your site-to-site VPN connection. In our examples, we use a simple shared key. We recommend that you generate a more complex key to use.
* **private IP addresses of tunnels in VPN Gateway**: each VPN gateway instance has two tunnel IPs. The High Bandwidth tunnels expect to have four IPsec tunnels. In some VPN devices, the configuration can be implemented through Virtual Tunnel Interfaces (VTIs). Each private IP address on the outbound interface of the on-premises VPN device can be associated with up to two virtual tunnel interfaces.

* **IP address space assigned to the Azure VNet**

![17]

The pseudo configuration of VPN device on-premises looks like:

```console
interface 1
  ip address 192.168.1.1/32

interface 2
  ip address 192.168.1.5/32

interface tunnel  0
  ip address 192.168.10.1/32
  tunnel source 192.168.1.1
  tunnel destination 10.1.1.6

interface tunnel 1
  ip address 192.168.10.2/32
  source address 192.168.1.1
  destination address 10.1.1.8

interface tunnel 2
  ip address 192.168.10.5/32
  source address 192.168.1.5
  destination address 10.1.1.7

interface tunnel 3
  ip address 192.168.10.6/32
  source address 192.168.1.5
  destination address 10.1.1.9

static routing:
    10.1.0.0/24 next-hop: tunnel 0
    10.1.0.0/24 next-hop: tunnel 1
    10.1.0.0/24 next-hop: tunnel 2
    10.1.0.0/24 next-hop: tunnel 3
```

### <a name="configure-connect"></a>Configure custom encryption algoriths (optional)

In each VPN Connection you can define a custom IKEv2 and IPsec policy to match the encryption requirements. For more information, see [Configure custom IPsec/IKE connection policies](ipsec-ike-policy-howto.md).

[!INCLUDE [Configure additional connection settings with screenshot](../../includes/vpn-gateway-connection-settings-portal-include.md)]

## <a name="VerifyConnection"></a>Verify the VPN connection

[!INCLUDE [Verify the connection](../../includes/vpn-gateway-verify-connection-portal-include.md)]



### <a name="additional"></a>More configuration considerations

You can customize site-to-site configurations in various ways. For more information, see the following articles:

* For information about BGP, see the [BGP overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
* For information about how to limit network traffic to resources in a virtual network, see [Network security](../virtual-network/network-security-groups-overview.md).
* For information about how Azure routes traffic between Azure, on-premises, and internet resources, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).

## Clean up resources

If you're not going to continue to use this application, delete these resources.

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.
1. Select **Delete resource group**.
1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

### <a name="additional"></a>Limitations

<!--Link References-->

<!--Image References-->
[1]: ./media/site-to-site-high-bandwidth-tunnel/transit-hb-tunnels.png "transit High Bandwidth IPsec tunnels"
[2]: ./media/site-to-site-high-bandwidth-tunnel/er-gateway.png "ExpressRoute gateway"
[3]: ./media/site-to-site-high-bandwidth-tunnel/expressroute-connection-fastpath.png "ExpressRoute Connection with FastPath enabled"
[4]: ./media/site-to-site-high-bandwidth-tunnel/vpn-gw-hb.png "VPN Gateway High Bandwidth tunnels"
[5]: ./media/site-to-site-high-bandwidth-tunnel/vpn-gw-hb2.png "VPN Gateway High Bandwidth tunnels"
[6]: ./media/site-to-site-high-bandwidth-tunnel/vpn-onprem-ip-addresses.png "IP addreses VPN device on-premises"
[7]: ./media/site-to-site-high-bandwidth-tunnel/local-net-gw1.png "Local Network Gateway1"
[8]: ./media/site-to-site-high-bandwidth-tunnel/local-net-gw2.png "Local Network Gateway2"
[9]: ./media/site-to-site-high-bandwidth-tunnel/vpn-conn1a.png "VPN Connection1"
[10]: ./media/site-to-site-high-bandwidth-tunnel/vpn-conn1b.png "VPN Connection1"
[11]: ./media/site-to-site-high-bandwidth-tunnel/vpn-conn1c.png "VPN Connection1"
[12]: ./media/site-to-site-high-bandwidth-tunnel/vpn-conn2a.png "VPN Connection2"
[13]: ./media/site-to-site-high-bandwidth-tunnel/vpn-conn2b.png "VPN Connection2"
[14]: ./media/site-to-site-high-bandwidth-tunnel/vpn-conn2c.png "VPN Connection2"
[15]: ./media/site-to-site-high-bandwidth-tunnel/list-connections.png "VPN Connection List"
[16]: ./media/site-to-site-high-bandwidth-tunnel/tunnel-ips.png "Tunnel IPs"
[17]: ./media/site-to-site-high-bandwidth-tunnel/s2s-tunnels-azure-onprem.png "IPsec tunnels between on-premises device and Azure VPN Gateway"
[18]: 
[19]: 
 
[1]: ./media/site-to-site-high-bandwidth-tunnel/advertisement-net-onprem.png
[1]: ./media/site-to-site-high-bandwidth-tunnel/er-circuit.png
[1]: ./media/site-to-site-high-bandwidth-tunnel/er-connection-validation.png
[1]: ./media/site-to-site-high-bandwidth-tunnel/er-connection.png
[1]: ./media/site-to-site-high-bandwidth-tunnel/list-resources.png




