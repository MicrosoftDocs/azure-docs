---
title: Azure VPN Gateway FAQ
description: Get answers to frequently asked questions about VPN Gateway connections and configuration settings.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: conceptual
ms.date: 07/10/2024
ms.author: cherylmc
---

# VPN Gateway FAQ

This article answers frequently asked questions about Azure VPN Gateway cross-premises connections, hybrid configuration connections, and virtual network (VNet) gateways. It contains comprehensive information about point-to-site (P2S), site-to-site (S2S), and VNet-to-VNet configuration settings, including the Internet Protocol Security (IPsec) and Internet Key Exchange (IKE) protocols.

## <a name="connecting"></a>Connecting to virtual networks

### Can I connect virtual networks in different Azure regions?

Yes. There's no region constraint. One virtual network can connect to another virtual network in the same Azure region or in a different region.

### Can I connect virtual networks in different subscriptions?

Yes.

### Can I specify private DNS servers in my VNet when configuring a VPN gateway?

If you specify a Domain Name System (DNS) server or servers when you create your virtual network, the virtual private network (VPN) gateway uses those DNS servers. Verify that your specified DNS servers can resolve the domain names needed for Azure.

### Can I connect to multiple sites from a single virtual network?

You can connect to multiple sites by using Windows PowerShell and the Azure REST APIs. See the [Multi-site and VNet-to-VNet connectivity](#V2VMulti) FAQ section.

### Is there an additional cost for setting up a VPN gateway as active-active?

No. However, costs for any additional public IPs are charged accordingly. See [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

### What are my cross-premises connection options?

Azure VPN Gateway supports the following cross-premises gateway connections:

* **Site-to-site**: VPN connection over IPsec (IKEv1 and IKEv2). This type of connection requires a VPN device or Windows Server Routing and Remote Access. For more information, see [Create a site-to-site VPN connection in the Azure portal](./tutorial-site-to-site-portal.md).
* **Point-to-site**: VPN connection over Secure Socket Tunneling Protocol (SSTP) or IKEv2. This connection doesn't require a VPN device. For more information, see [Configure server settings for point-to-site VPN Gateway certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* **VNet-to-VNet**: This type of connection is the same as a site-to-site configuration. VNet-to-VNet is a VPN connection over IPsec (IKEv1 and IKEv2). It doesn't require a VPN device. For more information, see [Configure a VNet-to-VNet VPN gateway connection](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md).
* **Azure ExpressRoute**: ExpressRoute is a private connection to Azure from your wide area network (WAN), not a VPN connection over the public internet. For more information, see the [ExpressRoute technical overview](../expressroute/expressroute-introduction.md) and the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md).

For more information about VPN gateway connections, see [What is Azure VPN Gateway?](vpn-gateway-about-vpngateways.md).

### What is the difference between site-to-site and point-to-site connections?

* *Site-to-site* (IPsec/IKE VPN tunnel) configurations are between your on-premises location and Azure. You can connect from any of your computers located on your premises to any virtual machine (VM) or role instance within your virtual network, depending on how you choose to configure routing and permissions. It's a great option for an always-available cross-premises connection and is well suited for hybrid configurations.

  This type of connection relies on an IPsec VPN appliance (hardware device or soft appliance). The appliance must be deployed at the edge of your network. To create this type of connection, you must have an externally facing IPv4 address.

* *Point-to-site* (VPN over SSTP) configurations let you connect from a single computer from anywhere to anything located in your virtual network. It uses the Windows built-in VPN client.

  As part of the point-to-site configuration, you install a certificate and a VPN client configuration package. The package contains the settings that allow your computer to connect to any virtual machine or role instance within the virtual network.
  
  This configuration is useful when you want to connect to a virtual network but aren't located on-premises. It's also a good option when you don't have access to VPN hardware or an externally facing IPv4 address, both of which are required for a site-to-site connection.

You can configure your virtual network to use both site-to-site and point-to-site concurrently, as long as you create your site-to-site connection by using a route-based VPN type for your gateway. Route-based VPN types are called *dynamic gateways* in the classic deployment model.

### Does a misconfiguration of custom DNS break the normal operation of a VPN gateway?

For normal functioning, the VPN gateway must establish a secure connection with the Azure control plane, facilitated through public IP addresses. This connection relies on resolving communication endpoints via public URLs. By default, Azure VNets use the built-in Azure DNS service (168.63.129.16) to resolve these public URLs. This default behavior helps ensure seamless communication between the VPN gateway and the Azure control plane.

When you're implementing a custom DNS within a VNet, it's crucial to configure a DNS forwarder that points to Azure DNS (168.63.129.16). This configuration helps maintain uninterrupted communication between the VPN gateway and the control plane. Failure to set up a DNS forwarder to Azure DNS can prevent Microsoft from performing operations and maintenance on the VPN gateway, which poses a security risk.

To help ensure proper functionality and healthy state for your VPN gateway, consider one of the following DNS configurations in the VNet:

* Revert to the Azure DNS default by removing the custom DNS within the VNet settings (recommended configuration).
* Add in your custom DNS configuration a DNS forwarder that points to Azure DNS (168.63.129.16). Depending on the specific rules and nature of your custom DNS, this setup might not resolve the issue as expected.

### Can two VPN clients connected in point-to-site to the same VPN gateway communicate?

No. VPN clients connected in point-to-site to the same VPN gateway can't communicate with each other.

When two VPN clients are connected to the same point-to-site VPN gateway, the gateway can automatically route traffic between them by determining the IP address that each client is assigned from the address pool. However, if the VPN clients are connected to different VPN gateways, routing between the VPN clients isn't possible because each VPN gateway is unaware of the IP address that the other gateway assigned to the client.

### Could a potential vulnerability known as "tunnel vision" affect point-to-site VPN connections?

Microsoft is aware of reports about a network technique that bypasses VPN encapsulation. This is an industry-wide issue. It affects any operating system that implements a Dynamic Host Configuration Protocol (DHCP) client according to its RFC specification and has support for DHCP option 121 routes, including Windows.

As the research notes, mitigations include running the VPN inside a VM that obtains a lease from a virtualized DHCP server to prevent the local network's DHCP server from installing routes altogether. You can find more information about this vulnerability in the [NIST National Vulnerability Database](https://nvd.nist.gov/vuln/detail/CVE-2024-3661).

## <a name="privacy"></a>Privacy

### Does the VPN service store or process customer data?

No.

## <a name="gateways"></a>Virtual network gateways

### Is a VPN gateway a virtual network gateway?

A VPN gateway is a type of virtual network gateway. A VPN gateway sends encrypted traffic between your virtual network and your on-premises location across a public connection. You can also use a VPN gateway to send traffic between virtual networks. When you create a VPN gateway, you use the `-GatewayType` value `Vpn`. For more information, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

### Why can't I specify policy-based and route-based VPN types?

As of October 1, 2023, you can't create a policy-based VPN gateway through the Azure portal. All new VPN gateways are automatically created as route-based. If you already have a policy-based gateway, you don't need to upgrade your gateway to route-based. You can use Azure PowerShell or the Azure CLI to create the policy-based gateways.

Previously, the older gateway product tiers (SKUs) didn't support IKEv1 for route-based gateways. Now, most of the current gateway SKUs support both IKEv1 and IKEv2.

[!INCLUDE [Route-based and policy-based table](../../includes/vpn-gateway-vpn-type-table.md)]

### Can I update my policy-based VPN gateway to route-based?

No. A gateway type can't be changed from policy-based to route-based, or from route-based to policy-based. To change a gateway type, you must delete and re-create the gateway by taking the following steps. This process takes about 60 minutes. When you create the new gateway, you can't retain the IP address of the original gateway.

1. Delete any connections associated with the gateway.
1. Delete the gateway by using one of the following articles:

   * [Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
   * [Azure PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
   * [Azure PowerShell - classic](vpn-gateway-delete-vnet-gateway-classic-powershell.md)
1. Create a new gateway by using the gateway type that you want, and then complete the VPN setup. For steps, see the [site-to-site tutorial](./tutorial-site-to-site-portal.md#VNetGateway).

### Can I specify my own policy-based traffic selectors?

Yes, you can define traffic selectors by using the `trafficSelectorPolicies` attribute on a connection via the [New-AzIpsecTrafficSelectorPolicy](/powershell/module/az.network/new-azipsectrafficselectorpolicy) Azure PowerShell command. For the specified traffic selector to take effect, be sure to [enable policy-based traffic selectors](vpn-gateway-connect-multiple-policybased-rm-ps.md#enablepolicybased).

The custom-configured traffic selectors are proposed only when a VPN gateway initiates the connection. A VPN gateway accepts any traffic selectors proposed by a remote gateway (on-premises VPN device). This behavior is consistent among all connection modes (`Default`, `InitiatorOnly`, and `ResponderOnly`).

### Do I need a gateway subnet?

Yes. The gateway subnet contains the IP addresses that the virtual network gateway services use. You need to create a gateway subnet for your virtual network in order to configure a virtual network gateway.

All gateway subnets must be named `GatewaySubnet` to work properly. Don't name your gateway subnet something else. And don't deploy VMs or anything else to the gateway subnet.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway service.

Some configurations require more IP addresses to be allocated to the gateway services than do others. Make sure that your gateway subnet contains enough IP addresses to accommodate future growth and possible new connection configurations.

Although you can create a gateway subnet as small as /29, we recommend that you create a gateway subnet of /27 or larger (/27, /26, /25, and so on). Verify that your existing gateway subnet meets the requirements for the configuration that you want to create.

### Can I deploy virtual machines or role instances to my gateway subnet?

No.

### Can I get my VPN gateway IP address before I create it?

Azure Standard SKU public IP resources must use a static allocation method. You'll have the public IP address for your VPN gateway as soon as you create the Standard SKU public IP resource that you intend to use for it.

### Can I request a static public IP address for my VPN gateway?

Standard SKU public IP address resources use a static allocation method. Going forward, you must use a Standard SKU public IP address when you create a new VPN gateway. This requirement applies to all gateway SKUs except the Basic SKU. The Basic SKU currently supports only Basic SKU public IP addresses. We're working on adding support for Standard SKU public IP addresses for the Basic SKU.

For non-zone-redundant and non-zonal gateways that were previously created (gateway SKUs that don't have *AZ* in the name), dynamic IP address assignment is supported but is being phased out. When you use a dynamic IP address, the IP address doesn't change after it's assigned to your VPN gateway. The only time that the VPN gateway IP address changes is when the gateway is deleted and then re-created. The public IP address doesn't change when you resize, reset, or complete other internal maintenance and upgrades of your VPN gateway.

### How does the retirement of Basic SKU public IP addresses affect my VPN gateways?

We're taking action to ensure the continued operation of deployed VPN gateways that use Basic SKU public IP addresses until the retirement of Basic IP in September 2025. Before this retirement, we will provide customers with a migration path from Basic to Standard IP. 

However, Basic SKU public IP addresses are being phased out. Going forward, when you create a VPN gateway, you must use the Standard SKU public IP address. You can find details on the retirement of Basic SKU public IP addresses in the [Azure Updates announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).

### How is my VPN tunnel authenticated?

Azure VPN Gateway uses preshared key (PSK) authentication. We generate a PSK when we create the VPN tunnel. You can change the automatically generated PSK to your own by using the Set Pre-Shared Key REST API or PowerShell cmdlet.

### Can I use the Set Pre-Shared Key REST API to configure my policy-based (static routing) gateway VPN?

Yes. You can use the Set Pre-Shared Key REST API and PowerShell cmdlet to configure both Azure policy-based (static) VPNs and route-based (dynamic) routing VPNs.

### Can I use other authentication options?

You're limited to using preshared keys for authentication.

### How do I specify which traffic goes through the VPN gateway?

For the Azure Resource Manager deployment model:

* Azure PowerShell: Use `AddressPrefix` to specify traffic for the local network gateway.
* Azure portal: Go to *local network gateway* > **Configuration** > **Address space**.

For the classic deployment model:

* Azure portal: Go to the classic virtual network, and then go to **VPN connections** > **Site-to-site VPN connections** > *local site name* > *local site* > **Client address space**.

### Can I use NAT-T on my VPN connections?

Yes, network address translation traversal (NAT-T) is supported. Azure VPN Gateway does *not* perform any NAT-like functionality on the inner packets to or from the IPsec tunnels. In this configuration, ensure that the on-premises device initiates the IPSec tunnel.

### Can I set up my own VPN server in Azure and use it to connect to my on-premises network?

Yes. You can deploy your own VPN gateways or servers in Azure from Azure Marketplace or by creating your own VPN routers. You must configure user-defined routes in your virtual network to ensure that traffic is routed properly between your on-premises networks and your virtual network subnets.

### <a name="gatewayports"></a>Why are certain ports opened on my virtual network gateway?

They're required for Azure infrastructure communication. Azure certificates help protect them by locking them down. Without proper certificates, external entities, including the customers of those gateways, can't cause any effect on those endpoints.

A virtual network gateway is fundamentally a multihomed device. One network adapter taps into the customer private network, and one network adapter faces the public network. Azure infrastructure entities can't tap into customer private networks for compliance reasons, so they need to use public endpoints for infrastructure communication. An Azure security audit periodically scans the public endpoints.

### <a name="vpn-basic"></a>Can I create a VPN gateway by using the Basic SKU in the portal?

No. The Basic SKU isn't available in the portal. You can create a Basic SKU VPN gateway by using the Azure CLI or the [Azure PowerShell](create-gateway-basic-sku-powershell.md) steps.

### Where can I find information about gateway types, requirements, and throughput?

See the following articles:

* [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md)
* [About gateway SKUs](about-gateway-skus.md)

## <a name="sku-deprecate"></a>Deprecation of older SKUs

The Standard and High Performance SKUs will be deprecated on September 30, 2025. You can view the announcement on the [Azure Updates site](https://go.microsoft.com/fwlink/?linkid=2255127). The product team will make a migration path available for these SKUs by November 30, 2024. For more information, see the [VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md#sku-deprecation) article.

*At this time, there's no action that you need to take.*

[!INCLUDE [legacy SKU deprecation](../../includes/vpn-gateway-deprecate-sku-faq.md)]

## <a name="s2s"></a>Site-to-site connections and VPN devices

### What should I consider when selecting a VPN device?

We've validated a set of standard site-to-site VPN devices in partnership with device vendors. You can find a list of known compatible VPN devices, their corresponding configuration instructions or samples, and device specifications in the [About VPN devices](vpn-gateway-about-vpn-devices.md) article.

All devices in the device families listed as known compatible should work with virtual networks. To help configure your VPN device, refer to the device configuration sample or link that corresponds to the appropriate device family.

### Where can I find VPN device configuration settings?

[!INCLUDE [vpn devices](../../includes/vpn-gateway-configure-vpn-device-rm-include.md)]

### How do I edit VPN device configuration samples?

See [Editing device configuration samples](vpn-gateway-about-vpn-devices.md#editing).

### Where do I find IPsec and IKE parameters?

See [Default IPsec/IKE parameters](vpn-gateway-about-vpn-devices.md#ipsec).

### Why does my policy-based VPN tunnel go down when traffic is idle?

This behavior is expected for policy-based (also known as *static routing*) VPN gateways. When the traffic over the tunnel is idle for more than five minutes, the tunnel is torn down. When traffic starts flowing in either direction, the tunnel is reestablished immediately.

### Can I use software VPNs to connect to Azure?

We support Windows Server 2012 Routing and Remote Access servers for site-to-site cross-premises configuration.

Other software VPN solutions should work with the gateway, as long as they conform to industry-standard IPsec implementations. For configuration and support instructions, contact the vendor of the software.

### Can I connect to a VPN gateway via point-to-site when located at a site that has an active site-to-site connection?

Yes, but the public IP addresses of the point-to-site client must be different from the public IP addresses that the site-to-site VPN device uses, or else the point-to-site connection won't work. Point-to-site connections with IKEv2 can't be initiated from the same public IP addresses where a site-to-site VPN connection is configured on the same VPN gateway.

## <a name="P2S"></a>Point-to-site connections

[!INCLUDE [P2S FAQ All](../../includes/vpn-gateway-faq-p2s-all-include.md)]

## <a name="P2S-cert"></a>Point-to-site connections with certificate authentication

[!INCLUDE [P2S Azure cert](../../includes/vpn-gateway-faq-p2s-azurecert-include.md)]

## <a name="P2SRADIUS"></a>Point-to-site connections with RADIUS authentication

### Is RADIUS authentication supported on all Azure VPN Gateway SKUs?

RADIUS authentication is supported for all SKUs except the Basic SKU.

For earlier SKUs, RADIUS authentication is supported on Standard and High Performance SKUs.

### Is RADIUS authentication supported for the classic deployment model?

No.

### What is the timeout period for RADIUS requests sent to the RADIUS server?

RADIUS requests are set to time out after 30 seconds. User-defined timeout values aren't currently supported.

### Are third-party RADIUS servers supported?

Yes.

### What are the connectivity requirements to ensure that the Azure gateway can reach an on-premises RADIUS server?

You need a site-to-site VPN connection to the on-premises site, with the proper routes configured.

### Can traffic to an on-premises RADIUS server (from the VPN gateway) be routed over an ExpressRoute connection?

No. It can be routed only over a site-to-site connection.

### Is there a change in the number of supported SSTP connections with RADIUS authentication? What is the maximum number of supported SSTP and IKEv2 connections?

There's no change in the maximum number of supported SSTP connections on a gateway with RADIUS authentication. It remains 128 for SSTP, but it depends on the gateway SKU for IKEv2. For more information on the number of supported connections, see [About gateway SKUs](about-gateway-skus.md).

### What is the difference between certificate authentication through a RADIUS server and Azure native certificate authentication through the upload of a trusted certificate?

In RADIUS certificate authentication, the authentication request is forwarded to a RADIUS server that handles the certificate validation. This option is useful if you want to integrate with a certificate authentication infrastructure that you already have through RADIUS.

When you use Azure for certificate authentication, the VPN gateway performs the validation of the certificate. You need to upload your certificate public key to the gateway. You can also specify list of revoked certificates that shouldn't be allowed to connect.

### Does RADIUS authentication support Network Policy Server integration for multifactor authentication?

If your multifactor authentication is text based (for example, SMS or a mobile app verification code) and requires the user to enter a code or text in the VPN client UI, the authentication won't succeed and isn't a supported scenario. See [Integrate Azure VPN gateway RADIUS authentication with NPS server for multifactor authentication](vpn-gateway-radius-mfa-nsp.md).

### Does RADIUS authentication work with both IKEv2 and SSTP VPN?

Yes, RADIUS authentication is supported for both IKEv2 and SSTP VPN.

### Does RADIUS authentication work with the OpenVPN client?

RADIUS authentication is supported for the OpenVPN protocol.

## <a name="V2VMulti"></a>VNet-to-VNet and multi-site connections

[!INCLUDE [vpn-gateway-vnet-vnet-faq-include](../../includes/vpn-gateway-faq-vnet-vnet-include.md)]

### How do I enable routing between my site-to-site VPN connection and ExpressRoute?

If you want to enable routing between your branch connected to ExpressRoute and your branch connected to a site-to-site VPN, you need to set up [Azure Route Server](../route-server/expressroute-vpn-support.md).

### Can I use a VPN gateway to transit traffic between my on-premises sites or to another virtual network?

* **Resource Manager deployment model**

  Yes. See the [BGP and routing](#bgp) section for more information.

* **Classic deployment model**

  Transiting traffic via a VPN gateway is possible when you use the classic deployment model, but it relies on statically defined address spaces in the network configuration file. Border Gateway Protocol (BGP) isn't currently supported with Azure virtual networks and VPN gateways via the classic deployment model. Without BGP, manually defining transit address spaces is error prone and not recommended.

### Does Azure generate the same IPsec/IKE preshared key for all my VPN connections for the same virtual network?

No. By default, Azure generates different preshared keys for different VPN connections. However, you can use the Set VPN Gateway Key REST API or PowerShell cmdlet to set the key value that you prefer. The key must contain only printable ASCII characters, except space, hyphen (-), or tilde (~).

### Do I get more bandwidth with more site-to-site VPNs than for a single virtual network?

No. All VPN tunnels, including point-to-site VPNs, share the same VPN gateway and the available bandwidth.

### Can I configure multiple tunnels between my virtual network and my on-premises site by using multi-site VPN?

Yes, but you must configure BGP on both tunnels to the same location.

### Does Azure VPN Gateway honor AS path prepending to influence routing decisions between multiple connections to my on-premises sites?

Yes, Azure VPN Gateway honors autonomous system (AS) path prepending to help make routing decisions when BGP is enabled. A shorter AS path is preferred in BGP path selection.

### Can I use the RoutingWeight property when creating a new VPN VirtualNetworkGateway connection?

No. Such a setting is reserved for ExpressRoute gateway connections. If you want to influence routing decisions between multiple connections, you need to use AS path prepending.

### Can I use point-to-site VPNs with my virtual network with multiple VPN tunnels?

Yes. You can use point-to-site VPNs with the VPN gateways connecting to multiple on-premises sites and other virtual networks.

### Can I connect a virtual network with IPsec VPNs to my ExpressRoute circuit?

Yes, this is supported. For more information, see [Configure ExpressRoute and site-to-site coexisting connections](../expressroute/expressroute-howto-coexist-classic.md).

## <a name="ipsecike"></a>IPsec/IKE policy

[!INCLUDE [vpn-gateway-ipsecikepolicy-faq-include](../../includes/vpn-gateway-faq-ipsecikepolicy-include.md)]

## <a name="bgp"></a>BGP and routing

[!INCLUDE [vpn-gateway-faq-bgp-include](../../includes/vpn-gateway-faq-bgp-include.md)]

### Can I configure forced tunneling?

Yes. See [Configure forced tunneling](vpn-gateway-about-forced-tunneling.md).

## <a name="nat"></a>NAT

[!INCLUDE [vpn-gateway-faq-nat-include](../../includes/vpn-gateway-faq-nat-include.md)]

## <a name="vms"></a>Cross-premises connectivity and VMs

### If my virtual machine is in a virtual network and I have a cross-premises connection, how should I connect to the VM?

If you have RDP enabled for your VM, you can connect to your virtual machine by using the private IP address. In that case, you specify the private IP address and the port that you want to connect to (typically 3389). You need to configure the port on your virtual machine for the traffic.

You can also connect to your virtual machine by private IP address from another virtual machine that's located on the same virtual network. You can't RDP to your virtual machine by using the private IP address if you're connecting from a location outside your virtual network. For example, if you have a point-to-site virtual network configured and you don't establish a connection from your computer, you can't connect to the virtual machine by private IP address.

### If my virtual machine is in a virtual network with cross-premises connectivity, does all the traffic from my VM go through that connection?

No. Only the traffic that has a destination IP that's contained in the virtual network's local network IP address ranges that you specified goes through the virtual network gateway.

Traffic that has a destination IP located within the virtual network stays within the virtual network. Other traffic is sent through the load balancer to the public networks. Or if you use forced tunneling, the traffic is sent through the VPN gateway.

### How do I troubleshoot an RDP connection to a VM

[!INCLUDE [Troubleshoot VM connection](../../includes/vpn-gateway-connect-vm-troubleshoot-include.md)]

## <a name="customer-controlled"></a>Customer-controlled gateway maintenance

[!INCLUDE [customer-controlled network gateway maintenance](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-faq.md)]

### How do I find out more about customer-controlled gateway maintenance?

For more information, see the [Configure customer-controlled gateway maintenance for VPN Gateway](customer-controlled-gateway-maintenance.md) article.

## Related content

* For more information about VPN Gateway, see [What is Azure VPN Gateway?](vpn-gateway-about-vpngateways.md).
* For more information about VPN Gateway configuration settings, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

**"OpenVPN" is a trademark of OpenVPN Inc.**
