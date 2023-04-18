---
title: RDP Shortpath - Azure Virtual Desktop
description: Learn about RDP Shortpath for Azure Virtual Desktop, which establishes a UDP-based transport between a Remote Desktop client and session host.
author: dknappettmsft
ms.topic: conceptual
ms.date: 02/02/2023
ms.author: daknappe
ms.custom: references_regions
---
# RDP Shortpath for Azure Virtual Desktop

> [!IMPORTANT]
> Using RDP Shortpath for public networks with TURN for Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Connections to Azure Virtual Desktop use Transmission Control Protocol (TCP) or User Datagram Protocol (UDP). RDP Shortpath is a feature of Azure Virtual Desktop that establishes a direct UDP-based transport between a supported Windows Remote Desktop client and session host. By default, Remote Desktop Protocol (RDP) tries to establish connection using UDP and uses a TCP-based reverse connect transport as a fallback connection mechanism. TCP-based reverse connect transport provides the best compatibility with various networking configurations and has a high success rate for establishing RDP connections. UDP-based transport offers better connection reliability and more consistent latency.

RDP Shortpath can be used in two ways:

1. **Managed networks**, where direct connectivity is established between the client and the session host when using a private connection, such as a virtual private network (VPN).

1. **Public networks**, where direct connectivity is established between the client and the session host when using a public connection. There are two connection types when using a public connection, which are listed here in order of preference:

   1. A *direct* UDP connection using the Simple Traversal Underneath NAT (STUN) protocol between a client and session host.
   
   1. An *indirect* UDP connection using the Traversal Using Relay NAT (TURN) protocol with a relay between a client and session host. This is in preview.

The transport used for RDP Shortpath is based on the [Universal Rate Control Protocol (URCP)](https://www.microsoft.com/research/publication/urcp-universal-rate-control-protocol-for-real-time-communication-applications/). URCP enhances UDP with active monitoring of the network conditions and provides fair and full link utilization. URCP operates at low delay and loss levels as needed.

> [!IMPORTANT]
> - During the preview, TURN is only available for connections to session hosts in a validation host pool. To configure your host pool as a validation environment, see [Define your host pool as a validation environment](create-validation-host-pool.md#define-your-host-pool-as-a-validation-host-pool).
>
> - RDP Shortpath for public networks with TURN is only available in the Azure public cloud.

## Key benefits

Using RDP Shortpath has the following key benefits:

- Using URCP to enhance UDP achieves the best performance by dynamically learning network parameters and providing the protocol with a rate control mechanism.

- The removal of extra relay points reduces round-trip time, which improves connection reliability and user experience with latency-sensitive applications and input methods.

- In addition, for managed networks:

  - RDP Shortpath brings support for configuring Quality of Service (QoS) priority for RDP connections through Differentiated Services Code Point (DSCP) marks.

  - The RDP Shortpath transport allows limiting outbound network traffic by specifying a throttle rate for each session.

## How RDP Shortpath works

To learn how RDP Shortpath works for managed networks and public networks, select each of the following tabs.

# [Managed networks](#tab/managed-networks)

You can achieve the direct line of sight connectivity required to use RDP Shortpath with managed networks using the following methods.

- [ExpressRoute private peering](../expressroute/expressroute-circuit-peerings.md)

- Site-to-site or Point-to-site VPN (IPsec), such as [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)

Having direct line of sight connectivity means that the client can connect directly to the session host without being blocked by firewalls.

> [!NOTE]
> If you're using other VPN types to connect to Azure, we recommend using a UDP-based VPN. While most TCP-based VPN solutions support nested UDP, they add inherited overhead of TCP congestion control, which slows down RDP performance.

To use RDP Shortpath for managed networks, you must enable a UDP listener on your session hosts. By default, port **3390** is used, although you can use a different port.

The following diagram gives a high-level overview of the network connections when using RDP Shortpath for managed networks and session hosts joined to an Active Directory domain.

:::image type="content" source="media/rdp-shortpath-managed-networks.svg" alt-text="Diagram of network connections when using RDP Shortpath for managed networks." lightbox="media/rdp-shortpath-managed-networks.svg":::

### Connection sequence

All connections begin by establishing a TCP-based [reverse connect transport](network-connectivity.md) over the Azure Virtual Desktop Gateway. Then, the client and session host establish the initial RDP transport, and start exchanging their capabilities. These capabilities are negotiated using the following process:

1. The session host sends the list of its IPv4 and IPv6 addresses to the client.

1. The client starts the background thread to establish a parallel UDP-based transport directly to one of the session host's IP addresses.

1. While the client is probing the provided IP addresses, it continues to establish the initial connection over the reverse connect transport to ensure there's no delay in the user connection.

1. If the client has a direct connection to the session host, the client establishes a secure connection using TLS over reliable UDP.

1. After establishing the RDP Shortpath transport, all Dynamic Virtual Channels (DVCs), including remote graphics, input, and device redirection, are moved to the new transport. However, if a firewall or network topology prevents the client from establishing direct UDP connectivity, RDP continues with a reverse connect transport.

If your users have both RDP Shortpath for managed network and public networks available to them, then the first-found algorithm will be used. The user will use whichever connection gets established first for that session.

# [Public networks](#tab/public-networks)

To provide the best chance of a UDP connection being successful when using a public connection, there are the *direct* and *indirect* connection types:

- **Direct connection**: STUN is used to establish a direct UDP connection between a client and session host. To establish this connection, the client and session host must be able to connect to each other through a public IP address and negotiated port. However, most clients don't know their own public IP address as they sit behind a [Network Address Translation](#network-address-translation-and-firewalls) (NAT) gateway device. STUN is a protocol for the self-discovery of a public IP address from behind a NAT gateway device and the client to determine its own public-facing IP address. 

  For a client to use STUN, its network must allow UDP traffic. Assuming both the client and session host can route to the other's discovered IP address and port directly, communication is established with direct UDP over the WebSocket protocol. If firewalls or other network devices block direct connections, an indirect UDP connection will be tried.

- **Indirect connection**: TURN is used to establish an indirect connection, relaying traffic through an intermediate server between a client and session host when a direct connection isn't possible. TURN is an extension of STUN. Using TURN means the public IP address and port is known in advance, which can be allowed through firewalls and other network devices.

  TURN typically authorizes access to the server via username/password and its preferred mode of operation is to use UDP sockets. If firewalls or other network devices block UDP traffic, the connection will fall back to a TCP-based reverse connect transport.

When a connection is being established, Interactive Connectivity Establishment (ICE) coordinates the management of STUN and TURN to optimize the likelihood of a connection being established, and ensure that precedence is given to preferred network communication protocols.

Each RDP session uses a dynamically assigned UDP port from an ephemeral port range (**49152** to **65535** by default) that accepts the RDP Shortpath traffic. Port 65330 is ignored from this range as it is reserved for use internally by Azure. You can also use a smaller, predictable port range. For more information, see [Limit the port range used by clients for public networks](configure-rdp-shortpath-limit-ports-public-networks.md).

> [!TIP]
> RDP Shortpath for public networks will work automatically without any additional configuration, providing networks and firewalls allow the traffic through and RDP transport settings in the Windows operating system for session hosts and clients are using their default values.

The following diagram gives a high-level overview of the network connections when using RDP Shortpath for public networks where session hosts joined to Azure Active Directory (Azure AD).

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-public-networks.png" alt-text="Diagram of network connections when using RDP Shortpath for public networks." lightbox="media/rdp-shortpath/rdp-shortpath-public-networks.png":::

### Network Address Translation and firewalls

Most Azure Virtual Desktop clients run on computers on the private network. Internet access is provided through a Network Address Translation (NAT) gateway device. Therefore, the NAT gateway modifies all network requests from the private network and destined to the Internet. Such modification intends to share a single public IP address across all of the computers on the private network.

Because of IP packet modification, the recipient of the traffic will see the public IP address of the NAT gateway instead of the actual sender. When traffic comes back to the NAT gateway, it will take care to forward it to the intended recipient without the sender's knowledge. In most scenarios, the devices hidden behind such a NAT aren't aware translation is happening and don't know the network address of the NAT gateway.

NAT is applicable to the Azure Virtual Networks where all session hosts reside. When a session host tries to reach the network address on the Internet, the NAT Gateway (either your own or default provided by Azure), or Azure Load Balancer performs the address translation. For more information about various types of Source Network Address Translation, see [Use Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md).

Most networks typically include firewalls that inspect traffic and block it based on rules. Most customers configure their firewalls to prevent incoming connections (that is, unsolicited packets from the Internet sent without a request). Firewalls employ different techniques to track data flow to distinguish between solicited and unsolicited traffic. In the context of TCP, the firewall tracks SYN and ACK packets, and the process is straightforward. UDP firewalls usually use heuristics based on packet addresses to associate traffic with UDP flows and allow or block it.

There are many different NAT implementations available. In most cases, NAT gateway and firewall are the functions of the same physical or virtual device.

### Connection sequence

All connections begin by establishing a TCP-based [reverse connect transport](network-connectivity.md) over the Azure Virtual Desktop Gateway. Then, the client and session host establish the initial RDP transport, and start exchanging their capabilities. If RDP Shortpath for public networks is enabled on the session host, the session host then initiates a process called *candidate gathering*:

1. The session host enumerates all network interfaces assigned to a session host, including virtual interfaces like VPN and Teredo.

1. The Windows service *Remote Desktop Services* (TermService) allocates UDP sockets on each interface and stores the *IP:Port* pair in the candidate table as a *local candidate*.

1. The Remote Desktop Services service uses each UDP socket allocated in the previous step to try reaching the Azure Virtual Desktop STUN Server on the public internet. Communication is done by sending a small UDP packet to port **3478**.

1. If the packet reaches the STUN server, the STUN server responds with the public IP and port. This information is stored in the candidate table as a *reflexive candidate*.

1. After the session host gathers all the candidates, the session host uses the established reverse connect transport to pass the candidate list to the client.

1. When the client receives the list of candidates from the session host, the client also performs candidate gathering on its side. Then the client sends its candidate list to the session host.

1. After the session host and client exchange their candidate lists, both parties attempt to connect with each other using all the gathered candidates. This connection attempt is simultaneous on both sides. Many NAT gateways are configured to allow the incoming traffic to the socket as soon as the outbound data transfer initializes it. This behavior of NAT gateways is the reason the simultaneous connection is essential. If STUN fails because it's blocked, an indirect connection attempt is made using TURN.

1. After the initial packet exchange, the client and session host may establish one or many data flows. From these data flows, RDP chooses the fastest network path. The client then establishes a secure connection using TLS over reliable UDP with the session host and initiates RDP Shortpath transport.

1. After RDP establishes the RDP Shortpath transport, all Dynamic Virtual Channels (DVCs), including remote graphics, input, and device redirection move to the new transport.

If your users have both RDP Shortpath for managed network and public networks available to them, then the first-found algorithm will be used, meaning that the user will use whichever connection gets established first for that session. For more information, see [example scenario 4](#scenario-4).

> [!IMPORTANT]
> When using a TCP-based transport, outbound traffic from session host to client is through the Azure Virtual Desktop Gateway. With RDP Shortpath for public networks using STUN, outbound traffic is established directly between session host and client over the internet. This removes a hop which improves latency and end user experience. However, due to the changes in data flow between session host and client where the Gateway is no longer used, there will be standard [Azure egress network charges](https://azure.microsoft.com/pricing/details/bandwidth/) billed in addition per subscription for the internet bandwidth consumed. To learn more about estimating the bandwidth used by RDP, see [RDP bandwidth requirements](rdp-bandwidth.md).

### Network configuration

To support RDP Shortpath for public networks, you typically don't need any particular configuration. The session host and client will automatically discover the direct data flow if it's possible in your network configuration. However, every environment is unique, and some network configurations may negatively affect the rate of success of the direct connection. Follow the [recommendations](#general-recommendations) to increase the probability of a direct data flow.

As RDP Shortpath uses UDP to establish a data flow, if a firewall on your network blocks UDP traffic, RDP Shortpath will fail and the connection will fall back to TCP-based reverse connect transport. Azure Virtual Desktop uses STUN servers provided by Azure Communication Services and Microsoft Teams. By the nature of the feature, outbound connectivity from the session hosts to the client is required. Unfortunately, you can't predict where your users are located in most cases. Therefore, we recommend allowing outbound UDP connectivity from your session hosts to the internet. To reduce the number of ports required, you can [limit the port range used by clients](configure-rdp-shortpath-limit-ports-public-networks.md) for the UDP flow. Use the following tables for reference when configuring firewalls for RDP Shortpath.

If your environment uses Symmetric NAT, which is the mapping of a single private source *IP:Port* to a unique public destination *IP:Port*, then you can use an indirect connection with TURN. This will be the case if you use Azure Firewall and Azure NAT Gateway. For more information about NAT with Azure virtual networks, see [Source Network Address Translation with virtual networks](../virtual-network/nat-gateway/nat-gateway-resource.md#source-network-address-translation).

Where users have RDP Shortpath for both managed network and public networks is available to them, then the first algorithm found will be used. The user will use whichever connection gets established first for that session. For more information, see [Example scenarios](#example-scenarios).

#### TURN availability (preview)

TURN is available in the following Azure regions:

:::row:::
    :::column:::
        - Australia Southeast
        - Central India
        - East US
        - East US 2
        - France Central
        - Japan West
        - North Europe
    :::column-end:::
    :::column:::
        - South Central US
        - Southeast Asia
        - UK South
        - UK West
        - West Europe
        - West US
        - West US 2
    :::column-end:::
:::row-end:::

#### Session host virtual network

| Name | Source | Source Port | Destination | Destination Port | Protocol | Action |
|---|---|:---:|---|:---:|:---:|:---:|
| RDP Shortpath Server Endpoint | VM subnet | Any | Any | 1024-65535<br />(*default 49152-65535*) | UDP | Allow |
| STUN/TURN UDP | VM subnet | Any | 20.202.0.0/16 | 3478 | UDP | Allow |
| STUN/TURN TCP | VM subnet | Any | 20.202.0.0/16 | 443 | TCP | Allow |

#### Client network

| Name | Source | Source Port | Destination | Destination Port | Protocol | Action |
|---|---|:---:|---|:---:|:---:|:---:|
| RDP Shortpath Server Endpoint | Client network | Any | Public IP addresses assigned to NAT Gateway or Azure Firewall (provided by the STUN endpoint) | 1024-65535<br />(*default 49152-65535*) | UDP | Allow |
| STUN/TURN UDP | Client network | Any | 20.202.0.0/16 | 3478 | UDP | Allow |
| STUN/TURN TCP | Client network | Any | 20.202.0.0/16 | 443 | TCP | Allow |

### Teredo support

While not required for RDP Shortpath, Teredo adds extra NAT traversal candidates and increases the chance of the successful RDP Shortpath connection in IPv4-only networks. To learn how to enable Teredo on session hosts and clients, see [Teredo support](configure-rdp-shortpath.md#teredo-support).

### UPnP support

To improve the chances of a direct connection, on the side of the Remote Desktop client, RDP Shortpath may use [UPnP](/windows/win32/upnp/universal-plug-and-play-start-page) to configure a port mapping on the NAT router. UPnP is a standard technology used by various applications, such as Xbox, Delivery Optimization, and Teredo. UPnP is generally available on routers typically found on a home network. UPnP is enabled by default on most home routers and access points, but is often disabled on corporate networking.

### General recommendations

Here are some general recommendations when using RDP Shortpath for public networks:

- Avoid using force tunneling configurations if your users access Azure Virtual Desktop over the Internet.

- Make sure you aren't using double NAT or Carrier-Grade-NAT (CGN) configurations.

- Recommend to your users that they don't disable UPnP on their home routers.

- Avoid using cloud packet-inspection Services.

- Avoid using TCP-based VPN solutions.

- Enable IPv6 connectivity or Teredo.

---

## Connection security

RDP Shortpath extends RDP multi-transport capabilities. It doesn't replace the reverse connect transport but complements it. Initial session brokering is managed through the Azure Virtual Desktop service and the reverse connect transport. All connection attempts are ignored unless they match the reverse connect session first. RDP Shortpath is established after authentication, and if successfully established, the reverse connect transport is dropped and all traffic flows over the RDP Shortpath.

RDP Shortpath uses a secure connection using TLS over reliable UDP between the client and the session host using the session host's certificates. By default, the certificate used for RDP encryption is self-generated by the operating system during the deployment. You can also deploy centrally managed certificates issued by an enterprise certification authority. For more information about certificate configurations, see [Remote Desktop listener certificate configurations](/troubleshoot/windows-server/remote/remote-desktop-listener-certificate-configurations).

> [!NOTE]
> The security offered by RDP Shortpath is the same as that offered by TCP reverse connect transport.

## Example scenarios

Here are some example scenarios to show how connections are evaluated to decide whether RDP Shortpath is used across different network topologies.

### Scenario 1

A UDP connection can only be established between the client device and the session host over a public network (internet). A direct connection, such as a VPN, isn't available. UDP is allowed through firewall or NAT device.

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-1.png" alt-text="Diagram that shows RDP Shortpath for public networks uses STUN." border="false":::

### Scenario 2

A firewall or NAT device is blocking a direct UDP connection, but an indirect UDP connection can be relayed using TURN between the client device and the session host over a public network (internet). Another direct connection, such as a VPN, isn't available.

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-2.png" alt-text="Diagram that shows RDP Shortpath for public networks uses TURN." border="false":::

### Scenario 3

A UDP connection can be established between the client device and the session host over a public network or over a direct VPN connection, but RDP Shortpath for managed networks isn't enabled. When the client initiates the connection, the ICE/STUN protocol can see multiple routes and will evaluate each route and choose the one with the lowest latency.

In this example, a UDP connection using RDP Shortpath for public networks over the direct VPN connection will be made as it has the lowest latency, as shown by the green line.

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-3.png" alt-text="Diagram that shows a UDP connection using RDP Shortpath for public networks over the direct VPN connection will be made as it has the lowest latency." border="false":::

### Scenario 4

Both RDP Shortpath for public networks and managed networks are enabled. A UDP connection can be established between the client device and the session host over a public network or over a direct VPN connection. When the client initiates the connection, there are simultaneous attempts to connect using RDP Shortpath for managed networks through port 3390 (by default) and RDP Shortpath for public networks through the ICE/STUN protocol. The first-found algorithm will be used and the user will use whichever connection gets established first for that session.

Since going over a public network has more steps, for example a NAT device, a load balancer, or a STUN server, it's likely that the first-found algorithm will select the connection using RDP Shortpath for managed networks and be established first.

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-4.png" alt-text="Diagram that shows the first-found algorithm will select the connection using RDP Shortpath for managed networks and be established first." border="false":::

### Scenario 5

A UDP connection can be established between the client device and the session host over a public network or over a direct VPN connection, but RDP Shortpath for managed networks isn't enabled. To prevent ICE/STUN from using a particular route, an admin can block one of the routes for UDP traffic. Blocking a route would ensure the remaining path is always used.

In this example, UDP is blocked on the direct VPN connection and the ICE/STUN protocol establishes a connection over the public network.

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-5.png" alt-text="Diagram that shows UDP is blocked on the direct VPN connection and the ICE/STUN protocol establishes a connection over the public network." border="false":::

### Scenario 6

Both RDP Shortpath for public networks and managed networks are configured, however a UDP connection couldn't be established using direct VPN connection. A firewall or NAT device is also blocking a direct UDP connection using the public network (internet), but an indirect UDP connection can be relayed using TURN between the client device and the session host over a public network (internet).

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-6.png" alt-text="Diagram that shows UDP is blocked on the direct VPN connection and a direct connection using a public network also fails. TURN relays the connection over the public network." border="false":::

### Scenario 7

Both RDP Shortpath for public networks and managed networks are configured, however a UDP connection couldn't be established. In this instance, RDP Shortpath will fail and the connection will fall back to TCP-based reverse connect transport.

:::image type="content" source="media/rdp-shortpath/rdp-shortpath-scenario-7.png" alt-text="Diagram that shows a UDP connection couldn't be established. In this instance, RDP Shortpath will fail and the connection will fall back to TCP-based reverse connect transport." border="false":::

## Next steps

- Learn how to [Configure RDP Shortpath](configure-rdp-shortpath.md).
- Learn more about Azure Virtual Desktop network connectivity at [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).
- Understand [Azure egress network charges](https://azure.microsoft.com/pricing/details/bandwidth/).
- To understand how to estimate the bandwidth used by RDP, see [RDP bandwidth requirements](rdp-bandwidth.md).
