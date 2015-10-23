<properties 
   pageTitle="Virtual Network VPN Gateway FAQ | Microsoft Azure"
   description="The VPN Gateway FAQ. FAQ for Microsoft Azure Virtual Network cross-premises connections, hybrid configuration connections, and VPN Gateways"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor="" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/20/2015"
   ms.author="cherylmc" />

# VPN Gateway FAQ

## Connecting to virtual networks

### Can I connect virtual networks in different Azure regions?

Yes. In fact, there is no region constraint. One virtual network can connect to another virtual network in the same region, or in a different Azure region.

### Can I connect virtual networks in different subscriptions?

Yes.
### Can I connect to multiple sites from a single virtual network?

You can connect to multiple sites by using Windows PowerShell and the Azure REST APIs. See the [Multi-Site and VNet-to-VNet Connectivity](#multi-site-and-vnet-to-vnet-connectivity) FAQ section.
## What are my cross-premises connection options?

The following cross-premises connections are supported:

- [Site-to-Site](vpn-gateway-site-to-site-create.md) – VPN connection over IPsec (IKE v1 and IKE v2). This type of connection requires a VPN device or RRAS.

- [Point-to-Site](vpn-gateway-point-to-site-create.md) – VPN connection over SSTP (Secure Socket Tunneling Protocol). This connection does not require a VPN device.

- [VNet-to-VNet](virtual-networks-configure-vnet-to-vnet-connection.md) - This type of connection is the same as a site-to-site configuration. VNet to VNet is a VPN connection over IPsec (IKE v1 and IKE v2). It does not require a VPN device.

- [Multi-Site](vpn-gateway-multi-site.md) - This is a variation of a site-to-site configuration that allows you to connect multiple on-premises sites to a virtual network.

- [ExpressRoute](../expressroute/expressroute-introduction.md) - ExpressRoute is a direct connection to Azure from your WAN, not over the public Internet. See the [ExpressRoute Technical Overview](../expressroute/expressroute-introduction.md) and the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) for more information.

### What is the difference between a site-to-site connection and point-to-site?

**Site-to-site** connections let you connect between any of the computers located on your premises to any virtual machine or role instance within your virtual network, depending on how you choose to configure routing. It's a great option for an always-available cross-premises connection and is well-suited for hybrid configurations. This type of connection relies on an IPsec VPN appliance (hardware or soft appliance), which must be deployed at the edge of your network. In order to create this type of connection, you'll have to have the required VPN hardware and an externally facing IPv4 address.

**Point-to-site** connections let you connect from a single computer from anywhere to anything located in your virtual network. It uses the Windows in-box VPN client. As part of the point-to-site configuration, you install a certificate and a VPN client configuration package, which contains the settings that allow your computer to connect to any virtual machine or role instance within the virtual network. It's great when you want to connect to a virtual network, but aren't located on-premises. It's also a good option when you don't have access to VPN hardware or an externally facing IPv4 address, both of which are required for a site-to-site connection. 

Note: You can configure your virtual network to use both site-to-site and point-to-site concurrently, provided that you create your site-to-site connection using a dynamic routing gateway. 

For more information, see [About secure cross-premises connectivity for virtual networks](vpn-gateway-cross-premises-options.md).

### What is ExpressRoute?

ExpressRoute lets you create private connections between Microsoft datacenters and infrastructure that’s on your premises or in a co-location environment. With ExpressRoute, you can establish connections to Microsoft cloud services such as Microsoft Azure and Office 365 at an ExpressRoute partner co-location facility, or directly connect from your existing WAN network (such as a MPLS VPN provided by a network service provider).

ExpressRoute connections offer better security, more reliability, higher bandwidth, and lower latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between your on-premises network and Azure can also yield significant cost benefits. If you already have created a cross-premises connection from your on-premises network to Azure, you can migrate to an ExpressRoute connection while keeping your virtual network intact.

See the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) for more details.

## Site-to-site connections and VPN devices

### What should I consider when selecting a VPN device?

We have validated a set of standard site-to-site VPN devices in partnership with device vendors. A list of known compatible VPN devices, their corresponding configuration instructions or samples, and device specs can be found [here](vpn-gateway-about-vpn-devices.md). All devices in the device families listed as known compatible should work with Virtual Network. To help configure your VPN device, refer to the device configuration sample or link that corresponds to appropriate device family.

### What do I do if I have a VPN device that isn't in the known compatible device list?

If you do not see your device listed as a known compatible VPN device and want to use it for your VPN connection, you'll need to verify that it meets the supported IPsec/IKE configuration options and parameters listed [here](vpn-gateway-about-vpn-devices.md#devices-not-on-the-compatible-list). Devices meeting the minimum requirements should work well with VPN gateways. Please contact your device manufacturer for additional support and configuration instructions.

### Can I use software VPNs to connect to Azure?

We support Windows Server 2012 Routing and Remote Access (RRAS) servers for site-to-site cross-premises configuration.

Other software VPN solutions should work with our gateway as long as they conform to industry standard IPsec implementations. Contact the vendor of the software for configuration and support instructions.

## Point-to-site connections

### What operating systems can I use with point-to-site?

The following operating systems are supported:

- Windows 7 (64-bit version only)

- Windows Server 2008 R2

- Windows 8 (64-bit version only)

- Windows Server 2012

### Can I use any software VPN client for point-to-site that supports SSTP?

No. Support is limited only to the Windows operating system versions listed above.

### How many VPN client endpoints can I have in my point-to-site configuration?

We support up to 128 VPN clients to be able to connect to a virtual network at the same time.

### Can I use my own internal PKI root CA for point-to-site connectivity?

At this time, only self-signed root certificates are supported.

### Can I traverse proxies and firewalls using point-to-site capability?

Yes. We use SSTP (Secure Socket Tunneling Protocol) to tunnel through firewalls. This tunnel will appear as an HTTPs connection.

### If I restart a client computer configured for point-to-site, will the VPN automatically reconnect?

By default, the client computer will not reestablish the VPN connection automatically.

### Does point-to-site support auto-reconnect and DDNS on the VPN clients?

Auto-reconnect and DDNS are currently not supported in point-to-site VPNs.

### Can I have site-to-site and point-to-site configurations coexist for the same virtual network?

Yes. Both these solutions will work if you have a dynamic routing VPN gateway for your virtual network. We do not support point-to-site in static routing VPN gateways.

### Can I configure a point-to-site client to connect to multiple virtual networks at the same time?

Yes, it is possible. But the virtual networks cannot have overlapping IP prefixes and the point-to-site address spaces must not overlap between the virtual networks.

### How much throughput can I expect through site-to-site or point-to-site connections?

It's difficult to maintain the exact throughput of the VPN tunnels. IPsec and SSTP are crypto-heavy VPN protocols. Throughput is also limited by the latency and bandwidth between your premises and the Internet.

## Gateways

### What is a static-routing gateway?

Static routing gateways implement policy-based VPNs. Policy-based VPNs encrypt and direct packets through IPsec tunnels based on the combinations of address prefixes between your on premises network and the Azure VNet. The policy (or Traffic Selector) is usually defined as an access list in the VPN configuration.

### What is a dynamic-routing gateway?

Dynamic routing gateways implement the route-based VPNs. Route-based VPNs use "routes" in the IP forwarding or routing table to direct packets into their corresponding tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy or traffic selector for route based VPNs are configured as any-to-any (or wild cards).

### Can I get my VPN gateway IP address before I create it?

No. You have to create your gateway first to get the IP address. The IP address will change if you delete and re-create your VPN gateway.

### How does my VPN tunnel get authenticated?

Azure VPN uses PSK (Pre-Shared Key) authentication. We generate a pre-shared key (PSK) when we create the VPN tunnel. You can change the auto-generated PSK to your own with the Set Pre-Shared Key PowerShell cmdlet or REST API.

### Can I use the Set Pre-Shared Key API to configure my static routing gateway VPN?

Yes, the Set Pre-Shared Key API and PowerShell cmdlet can be used to configure both Azure static routing VPN and dynamic routing VPNs.

### Can I use other authentication options?

We are limited to using pre-shared keys (PSK) for authentication.

### What is the "gateway subnet" and why is it needed?

We have a gateway service that we run to enable cross-premises connectivity. We need 2 IP addresses from your routing domain for us to enable routing between your premises and the cloud. We require you to specify at least a /29 subnet from which we can pick IP addresses for setting up routes. Even though you can create a /29 subnet, understand that some features require a specific gateway size. Please follow the  gateway subnet requirements for the feature you want to configure.

Please note that you must not deploy virtual machines or role instances in the gateway subnet.

### How do I specify which traffic goes through the VPN gateway?

If you are using the Azure Portal, add each range that you want sent through the gateway for your virtual network on the Networks page under Local Networks.

### Can I configure Forced Tunneling?

Yes. See [Configure forced tunneling](vpn-gateway-about-forced-tunneling.md).

### Can I setup my own VPN server in Azure and use it to connect to my on-premises network?

Yes, you can deploy your own VPN gateways or servers in Azure either from the Azure Marketplace or creating your own VPN routers. You will need to configure User-Defined Routes in your virtual network to ensure traffic is routed properly between your on premises networks and your virtual network subnets.

### More information about gateway types, requirements, and throughput

For more information, see [About VPN Gateways](vpn-gateway-about-vpngateways.md).

## Multi-site and VNet-to-VNet connectivity

### Which type of gateways can support multi-site and VNet-to-VNet connectivity?

Only the Dynamic Routing VPNs.

### Can I connect a virtual network with dynamic routing VPN to another virtual network with static routing VPN?

No, both virtual networks MUST be using dynamic routing VPNs.

### Is the VNet-to-VNet traffic secure?

Yes, it is protected by IPsec/IKE encryption.

### Does VNet-to-VNet traffic travel over the Azure backbone?

Yes.

### How many on-premises sites and virtual networks can one virtual network connect to?

Max. 10 combined for the Basic and Standard Dynamic Routing gateways; 30 for the High Performance VPN gateways.

### Can I use point-to-site VPNs with my virtual network with multiple VPN tunnels?

Yes, point-to-site (P2S) VPNs can be used with the VPN gateways connecting to multiple on premises sites and other virtual networks.

### Can I configure multiple tunnels between my virtual network and my on-premises site using multi-site VPN?

No, redundant tunnels between an Azure virtual network and an on-premises site is not supported.

### Can there be overlapping address spaces among the connected virtual networks and on-premises local sites?

No. Overlapping address spaces will cause the netcfg file upload or Creating Virtual Network to fail.

### Do I get more bandwidth with more site-to-site VPNs than for a single virtual network?

No, all VPN tunnels, including point-to-site VPNs, share the same Azure VPN gateway and the available bandwidth.

### Can I use Azure VPN gateway to transit traffic between my on premises sites or to another virtual network?

Transit traffic via Azure VPN gateway is possible, but rely on statically defined address spaces in the netcfg configuration file. BGP is not yet supported with Azure Virtual Networks and VPN gateways. Without BGP, manually defining transit address spaces in netcfg is very error prone, and not recommended.

### Does Azure generate the same IPsec/IKE pre-shared key for all my VPN connections for the same virtual network?

No, Azure by default generates different pre-shared keys for different VPN connections. However, you can use the Set VPN Gateway Key REST API or PowerShell cmdlet to set the key value you prefer. The key MUST be alphanumerical string of length between 1 to 128 characters.

### Does Azure charge for traffic between virtual networks?

For traffic between different Azure virtual networks, Azure charges only for traffic traversing from one Azure region to another. The charge rate is listed in the Azure [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) page.


### Can I connect a virtual network with IPsec VPNs to my ExpressRoute circuit?

Yes, this is supported. For more information, see [Configure ExpressRoute and Site-to-Site VPN connections that coexist](../expressroute/expressroute-coexist.md).

## Connectivity and VMs

### If my virtual machine is in a virtual network and I have a cross-premises connection, how should I connect to the VM?

You have a few options. If you have RDP enabled and you have created an endpoint, you can connect to your virtual machine by using the VIP. In that case, you would specify the VIP and the port that you want to connect to. You'll need to configure the port on your virtual machine for the traffic. Typically, you would go to the Management Portal and save the settings for the RDP connection to your computer. The settings will contain the necessary connection information.

If you have a virtual network with cross-premises connectivity configured, you can connect to your virtual machine by using the internal DIP or private IP address. You can also connect to your virtual machine by internal DIP from another virtual machine that's located on the same virtual network. You can't RDP to your virtual machine by using the DIP if you are connecting from a location outside of your virtual network. For example, if you have a point-to-site virtual network configured and you don't establish a connection from your computer, you can't connect to the virtual machine by DIP.

### If my virtual machine is in a virtual network with cross-premises connectivity, does all the traffic from my VM go through that connection?

No. Only the traffic that has a destination IP that is contained in the virtual network Local Network IP address ranges that you specified will go through the virtual network gateway. Traffic has a destination IP located within the virtual network will stay within the virtual network. Other traffic is sent through the load balancer to the public networks, or if forced tunneling is used, sent through the Azure VPN gateway. If you are troubleshooting, it's important to make sure that you have all the ranges listed in your Local Network that you want to send through the gateway. Verify that the Local Network address ranges do not overlap with any of the address ranges in the virtual network. Also, you'll want to verify that the DNS server you are using is resolving the name to the proper IP address.

## Next Steps

View more networking FAQs for additional details:

- [Virtual Network FAQ](../virtual-network/virtual-networks-faq.md)

- [ExpressRoute FAQ](../expressroute/expressroute-faqs.md)

 