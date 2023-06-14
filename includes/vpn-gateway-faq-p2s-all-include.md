---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/10/2022
 ms.author: cherylmc
---
### How many VPN client endpoints can I have in my point-to-site configuration?

It depends on the gateway SKU. For more information on the number of connections supported, see [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).

### <a name="supportedclientos"></a>What client operating systems can I use with point-to-site?

The following client operating systems are supported:

* Windows Server 2008 R2 (64-bit only)
* Windows 8.1 (32-bit and 64-bit)
* Windows Server 2012 (64-bit only)
* Windows Server 2012 R2 (64-bit only)
* Windows Server 2016 (64-bit only)
* Windows Server 2019 (64-bit only)
* Windows Server 2022 (64-bit only)
* Windows 10
* Windows 11
* macOS version 10.11 or above
* Linux (StrongSwan)
* iOS

### Can I traverse proxies and firewalls using point-to-site capability?

Azure supports three types of Point-to-site VPN options:

* Secure Socket Tunneling Protocol (SSTP). SSTP is a Microsoft proprietary SSL-based solution that can penetrate firewalls since most firewalls open the outbound TCP port that 443 SSL uses.

* OpenVPN. OpenVPN is a SSL-based solution that can penetrate firewalls since most firewalls open the outbound TCP port that 443 SSL uses.

* IKEv2 VPN. IKEv2 VPN is a standards-based IPsec VPN solution that uses outbound UDP ports 500 and 4500 and IP protocol no. 50. Firewalls don't always open these ports, so there's a possibility of IKEv2 VPN not being able to traverse proxies and firewalls.

### If I restart a client computer configured for point-to-site, will the VPN automatically reconnect?

Auto-reconnect is a function of the client being used. Windows supports auto-reconnect by configuring the **Always On VPN** client feature.

### Does point-to-site support DDNS on the VPN clients?

DDNS is currently not supported in point-to-site VPNs.

### Can I have Site-to-Site and point-to-site configurations coexist for the same virtual network?

Yes. For the Resource Manager deployment model, you must have a RouteBased VPN type for your gateway. For the classic deployment model, you need a dynamic gateway. We don't support point-to-site for static routing VPN gateways or PolicyBased VPN gateways.

### Can I configure a point-to-site client to connect to multiple virtual network gateways at the same time?

Depending on the VPN Client software used, you may be able to connect to multiple Virtual Network Gateways provided the virtual networks being connected to don't have conflicting address spaces between them or the network from with the client is connecting from. While the Azure VPN Client supports many VPN connections, only one connection can be Connected at any given time.

### Can I configure a point-to-site client to connect to multiple virtual networks at the same time?

Yes, point-to-site client connections to a virtual network gateway that is deployed in a VNet that is peered with other VNets may have access to other peered VNets. point-to-site clients will be able to connect to peered VNets as long as the peered VNets are using the UseRemoteGateway / AllowGatewayTransit features. For more information, see [About point-to-site routing](../articles/vpn-gateway/vpn-gateway-about-point-to-site-routing.md).

### How much throughput can I expect through Site-to-Site or point-to-site connections?

It's difficult to maintain the exact throughput of the VPN tunnels. IPsec and SSTP are crypto-heavy VPN protocols. Throughput is also limited by the latency and bandwidth between your premises and the Internet. For a VPN Gateway with only IKEv2 point-to-site VPN connections, the total throughput that you can expect depends on the Gateway SKU. For more information on throughput, see [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).

### Can I use any software VPN client for point-to-site that supports SSTP and/or IKEv2?

No. You can only use the native VPN client on Windows for SSTP, and the native VPN client on Mac for IKEv2. However, you can use the OpenVPN client on all platforms to connect over OpenVPN protocol. Refer to the list of [supported client operating systems](#supportedclientos).

### Can I change the authentication type for a point-to-site connection?

Yes. In the portal, navigate to the **VPN gateway -> Point-to-site configuration** page. For **Authentication type**, select the authentication types that you want to use. Note that after you make a change to an authentication type, current clients may not be able to connect until a new VPN client configuration profile has been generated, downloaded, and applied to each VPN client.

### Does Azure support IKEv2 VPN with Windows?

IKEv2 is supported on Windows 10 and Server 2016. However, in order to use IKEv2 in certain OS versions, you must install updates and set a registry key value locally. OS versions prior to Windows 10 aren't supported and can only use SSTP or **OpenVPN® Protocol**.

> [!NOTE]
> Windows OS builds newer than Windows 10 Version 1709 and Windows Server 2016 Version 1607 do not require these steps.

To prepare Windows 10 or Server 2016 for IKEv2:

1. Install the update based on your OS version:

   | OS version | Date | Number/Link |
   |---|---|---|
   | Windows Server 2016<br>Windows 10 Version 1607 | January 17, 2018 | [KB4057142](https://support.microsoft.com/help/4057142/windows-10-update-kb4057142) |
   | Windows 10 Version 1703 | January 17, 2018 | [KB4057144](https://support.microsoft.com/help/4057144/windows-10-update-kb4057144) |
   | Windows 10 Version 1709 | March 22, 2018 | [KB4089848](https://www.catalog.update.microsoft.com/search.aspx?q=kb4089848) |
   |  |  |  |

2. Set the registry key value. Create or set “HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\RasMan\ IKEv2\DisableCertReqPayload” REG_DWORD key in the registry to 1.

### What is the IKEv2 traffic selector limit for point-to-site connections?
Windows 10 version 2004 (released September 2021) increased the traffic selector limit to 255. Versions of Windows earlier than this have a traffic selector limit of 25.

The traffic selectors limit in Windows determines the maximum number of address spaces in your virtual network and the maximum sum of your local networks, VNet-to-VNet connections, and peered VNets connected to the gateway. Windows based point-to-site clients will fail to connect via IKEv2 if they surpass this limit.

### What happens when I configure both SSTP and IKEv2 for P2S VPN connections?

When you configure both SSTP and IKEv2 in a mixed environment (consisting of Windows and Mac devices), the Windows VPN client will always try IKEv2 tunnel first, but will fall back to SSTP if the IKEv2 connection isn't successful. MacOSX will only connect via IKEv2.

When you have both SSTP and IKEv2 enabled on the Gateway, the point-to-site address pool will be statically split between the two, so clients using different protocols will be assigned IP addresses from either sub-range. Note that the maximum amount of SSTP clients is always 128 even if the address range is larger than /24 resulting in a bigger amount of addresses available for IKEv2 clients. For smaller ranges, the pool will be equally halved. Traffic Selectors used by the gateway may not include the Point to Site address range CIDR, but the two sub-range CIDRs.

### Other than Windows and Mac, which other platforms does Azure support for P2S VPN?

Azure supports Windows, Mac, and Linux for P2S VPN.

### I already have an Azure VPN Gateway deployed. Can I enable RADIUS and/or IKEv2 VPN on it?

Yes, if the gateway SKU that you're using supports RADIUS and/or IKEv2, you can enable these features on gateways that you've already deployed by using PowerShell or the Azure portal. The Basic SKU doesn't support RADIUS or IKEv2.

### <a name="removeconfig"></a>How do I remove the configuration of a P2S connection?

A P2S configuration can be removed using Azure CLI and PowerShell using the following commands:

#### Azure PowerShell

```azurepowershell-interactive
$gw=Get-AzVirtualNetworkGateway -name <gateway-name>`  
$gw.VPNClientConfiguration = $null`  
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw`
```

#### Azure CLI

```azurecli-interactive
az network vnet-gateway update --name <gateway-name> --resource-group <resource-group name> --remove "vpnClientConfiguration"
```
