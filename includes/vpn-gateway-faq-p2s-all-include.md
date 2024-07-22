---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/19/2024
 ms.author: cherylmc
---
### How many VPN client endpoints can I have in my point-to-site configuration?

It depends on the gateway SKU. For more information on the supported number of connections, see [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).

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
* macOS version 10.11 or later
* Linux (strongSwan)
* iOS

### Can I traverse proxies and firewalls by using point-to-site capability?

Azure supports three types of point-to-site VPN options:

* **Secure Socket Tunneling Protocol (SSTP)**: A Microsoft proprietary SSL-based solution that can penetrate firewalls because most firewalls open the outbound TCP port that 443 SSL uses.

* **OpenVPN**: A SSL-based solution that can penetrate firewalls because most firewalls open the outbound TCP port that 443 SSL uses.

* **IKEv2 VPN**: A standards-based IPsec VPN solution that uses outbound UDP ports 500 and 4500, along with IP protocol number 50. Firewalls don't always open these ports, so there's a possibility that IKEv2 VPN can't traverse proxies and firewalls.

### If I restart a client computer that I configured for point-to-site, will the VPN automatically reconnect?

Automatic reconnection is a function of the client that you use. Windows supports automatic reconnection through the **Always On VPN** client feature.

### Does point-to-site support DDNS on the VPN clients?

Dynamic DNS (DDNS) is currently not supported in point-to-site VPNs.

### Can site-to-site and point-to-site configurations coexist for the same virtual network?

Yes. For the Resource Manager deployment model, you must have a route-based VPN type for your gateway. For the classic deployment model, you need a dynamic gateway. We don't support point-to-site for static routing VPN gateways or policy-based VPN gateways.

### Can I configure a point-to-site client to connect to multiple virtual network gateways at the same time?

Depending on the VPN client software that you use, you might be able to connect to multiple virtual network gateways. But that's the case only if the virtual networks that you're connecting to don't have conflicting address spaces between them or with the network that the client is connecting from. Although the Azure VPN client supports many VPN connections, you can have only one connection at any time.

### Can I configure a point-to-site client to connect to multiple virtual networks at the same time?

Yes. Point-to-site client connections to a VPN gateway deployed in a VNet that's peered with other VNets can have access to the other peered VNets, as long as they meet certain configuration criteria. For a point-to-site client to have access to a peered VNet, the peered VNet (the VNet without the gateway) must be configured with the **Use remote gateways** attribute. The VNet with the VPN gateway must be configured with **Allow gateway transit**. For more information, see [About point-to-site VPN routing](../articles/vpn-gateway/vpn-gateway-about-point-to-site-routing.md).

### How much throughput can I expect through site-to-site or point-to-site connections?

It's difficult to maintain the exact throughput of the VPN tunnels. IPsec and SSTP are crypto-heavy VPN protocols. The latency and bandwidth between your premises and the internet can also limit throughput.

For a VPN gateway with only IKEv2 point-to-site VPN connections, the total throughput that you can expect depends on the gateway SKU. For more information on throughput, see [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).

### Can I use any software VPN client for point-to-site that supports SSTP or IKEv2?

 No. You can use only the native VPN client on Windows for SSTP, and the native VPN client on Mac for IKEv2. However, you can use the OpenVPN client on all platforms to connect over the OpenVPN protocol. Refer to the [list of supported client operating systems](#supportedclientos).

### Can I change the authentication type for a point-to-site connection?

Yes. In the portal, go to **VPN gateway** > **Point-to-site configuration**. For **Authentication type**, select the authentication type that you want to use.

After you change the authentication type, current clients might not be able to connect until you generate a new VPN client configuration profile, download it, and apply it to each VPN client.

### When do I need to generate a new configuration package for the VPN client profile?

When you make changes to the configuration settings for the P2S VPN gateway, such as adding a tunnel type or changing an authentication type, you need to generate a new configuration package for the VPN client profile. The new package includes the updated settings that VPN clients need for connecting to the P2S gateway. After you generate the package, use the settings in the files to update the VPN clients.

### Does Azure support IKEv2 VPN with Windows?

IKEv2 is supported on Windows 10 and Windows Server 2016. However, to use IKEv2 in certain OS versions, you must install updates and set a registry key value locally. OS versions earlier than Windows 10 aren't supported and can use only SSTP or the OpenVPN protocol.

> [!NOTE]
> Windows OS builds newer than Windows 10 Version 1709 and Windows Server 2016 Version 1607 don't require these steps.

To prepare Windows 10 or Windows Server 2016 for IKEv2:

1. Install the update based on your OS version:

   | OS version | Date | Number/Link |
   |---|---|---|
   | Windows Server 2016<br>Windows 10 Version 1607 | January 17, 2018 | [KB4057142](https://support.microsoft.com/help/4057142/windows-10-update-kb4057142) |
   | Windows 10 Version 1703 | January 17, 2018 | [KB4057144](https://support.microsoft.com/help/4057144/windows-10-update-kb4057144) |
   | Windows 10 Version 1709 | March 22, 2018 | [KB4089848](https://www.catalog.update.microsoft.com/search.aspx?q=kb4089848) |
   |  |  |  |

2. Set the registry key value. Create or set the `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\RasMan\ IKEv2\DisableCertReqPayload` `REG_DWORD` key in the registry to `1`.

### What is the IKEv2 traffic selector limit for point-to-site connections?

Windows 10 version 2004 (released September 2021) increased the traffic selector limit to 255. Earlier versions of Windows have a traffic selector limit of 25.

The traffic selector limit in Windows determines the maximum number of address spaces in your virtual network and the maximum sum of your local networks, VNet-to-VNet connections, and peered VNets connected to the gateway. Windows-based point-to-site clients fail to connect via IKEv2 if they surpass this limit.

### What is the OpenVPN traffic selector limit for point-to-site connections?

The traffic selector limit for OpenVPN is 1,000 routes.

### What happens when I configure both SSTP and IKEv2 for P2S VPN connections?

When you configure both SSTP and IKEv2 in a mixed environment that consists of Windows and Mac devices, the Windows VPN client always tries the IKEv2 tunnel first. The client falls back to SSTP if the IKEv2 connection isn't successful. MacOS connects only via IKEv2.

When you have both SSTP and IKEv2 enabled on the gateway, the point-to-site address pool is statically split between the two, so clients that use different protocols are IP addresses from either subrange. The maximum number of SSTP clients is always 128, even if the address range is larger than /24. The result is a larger number of addresses available for IKEv2 clients. For smaller ranges, the pool is equally halved. Traffic selectors that the gateway uses might not include the Classless Inter-Domain Routing (CIDR) block for the point-to-site address range but include the CIDR block for the two subranges.

### Which platforms does Azure support for P2S VPN?

Azure supports Windows, Mac, and Linux for P2S VPN.

### I already have a VPN gateway deployed. Can I enable RADIUS or IKEv2 VPN on it?

Yes. If the gateway SKU that you're using supports RADIUS or IKEv2, you can enable these features on gateways that you already deployed by using Azure PowerShell or the Azure portal. The Basic SKU doesn't support RADIUS or IKEv2.

### <a name="removeconfig"></a>How do I remove the configuration of a P2S connection?

You can remove a P2S configuration by using the following Azure PowerShell or Azure CLI commands:

```azurepowershell-interactive
$gw=Get-AzVirtualNetworkGateway -name <gateway-name>`  
$gw.VPNClientConfiguration = $null`  
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw`
```

```azurecli-interactive
az network vnet-gateway update --name <gateway-name> --resource-group <resource-group name> --remove "vpnClientConfiguration"
```
