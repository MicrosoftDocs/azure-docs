---
title: Call Flow Topologies
titleSuffix: An Azure Communication Services article
description: Learn about call flow topologies in Azure Communication Services.
author:  sloanster
services: azure-communication-services
ms.author: micahvivion
ms.date: 06/20/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call flow topologies

This article describes Azure Communication Services call flow topologies and details how calling traffic is encrypted. For an introduction to Azure Communication Services call flows, see [Call networking internals](./call-flows.md).

## Background

### Network concepts

Before you review call flow topologies, it's helpful to understand the terms that this article uses.

A *customer network* contains any network segments that you manage. The customer network might include wired and wireless networks within your office or between offices, datacenters, and internet service providers.

A customer network usually has several network perimeters with firewalls or proxy servers that enforce your organization's security policies. We recommend that you perform a [comprehensive network assessment](/microsoftteams/3-envision-evaluate-my-environment) to achieve the optimal performance and quality of your communication solution.

The *Azure Communication Services network* is the network  that supports Azure Communication Services. Microsoft manages this network and distributes it worldwide with the Microsoft-owned datacenters that are closest to end customers. This network is responsible for transport relay, media processing for group calls, and other components that support rich, real-time media communications.

### Types of traffic

Azure Communication Services is built primarily on two types of traffic: *real-time media* and *signaling*.

Real-time media is transmitted via Real-Time Transport Protocol (RTP). This protocol supports audio, video, and screen-sharing data transmission. This data is sensitive to network latency issues. Although it's possible for you to transmit real-time media by using TCP or HTTP, we recommend that you use User Datagram Protocol (UDP) as the transport-layer protocol to support high-performance end-user experiences. Media payloads transmitted over RTP are secured via secure RTP (SRTP).

Users of your Azure Communication Services solution connect to your services from their client devices. *Signaling* handles communication between these devices and your servers. For example, *signaling* between devices and your service supports call initiation and real-time chat. Most signaling traffic uses HTTPS REST. In some scenarios, you can use Session Initiation Protocol (SIP) as a signaling traffic protocol. Although this type of traffic is less sensitive to latency, low-latency signaling provides a pleasant end-user experience.

### Media encryption

Call flows in Azure Communication Services that call SDK and Teams clients are based on the [Session Description Protocol (SDP) RFC 8866](https://datatracker.ietf.org/doc/html/rfc8866) offer and answer model over HTTPS. When the callee accepts an incoming call, the caller and callee agree on the session parameters.

Media traffic is encrypted and flows between the caller and callee by via SRTP, a profile of RTP that provides confidentiality, authentication, and replay attack protection to RTP traffic. In most cases, client-to-client media traffic is negotiated through client-to-server connection signaling, and is encrypted via SRTP when going directly from client to client.

Azure Communication Services instances that call SDK clients use Datagram Transport Layer Security (DTLS) to derive an encryption key. After the DTLS handshake is done, the media begins to flow through this DTLS-negotiated encryption key over SRTP.

Azure Communication Services instances that call SDK and Teams clients use a credentials-based token for secure access to media relays over TURN. Media relays exchange the token over a Transport Layer Security (TLS) secured channel.

Media traffic that's going between two endpoints that participate in Azure Communication Services audio, video, and video sharing uses SRTP to encrypt the media stream. Cryptographic keys are negotiated between the two endpoints over a signaling protocol, which uses a TLS 1.2 and AES-256 (in GCM mode) encrypted UDP/TCP channel.

### Call flow principles

There are four general principles that underpin Azure Communication Services call flows:

* The first participant of an Azure Communication Services group call determines the region in which the call is hosted. There are exceptions to this rule in some topologies, which you can find later in this article.
* The media endpoint that's used to support an Azure Communication Services call is selected based on media processing needs, and isn't affected by the number of participants on a call.

  For example, a point-to-point call might use a media endpoint in the cloud to process media for transcription or recording. A call with two participants might not use any media endpoints. Group calls use a media endpoint for mixing and routing purposes.

  This endpoint is selected based on the region in which the call is hosted. Media traffic sent from a client to the media endpoint might be routed directly. Or, it might use a transport relay in Azure if customer network firewall restrictions require it.

* Media traffic for peer-to-peer calls takes *the most direct route that's available*, assuming the call doesn't need a media endpoint in the cloud.

  The preferred route is direct to the remote peer (client). If a direct route isn't available, one or more transport relays forward the traffic. Media traffic shouldn't traverse servers that act like packet shapers or virtual private network (VPN) servers, or fulfill other functions that might delay processing and degrade the end-user experience.

* Signaling traffic always goes to *whatever server is closest to the user*.

For more information about media paths, see [Call flows conceptual documentation](./call-flows.md).

## Call flows in various topologies

### Azure Communication Services (internet)

This call flow topology example depicts customers that use Azure Communication Services from the cloud without any on-premises deployment, such as Azure direct routing. In this topology, traffic to and from Azure Communication Services flows over the internet.

:::image type="content" source="./media/call-flows/detailed-flow-general.png" alt-text="Diagram that shows the Azure Communication Services call flow topology initiated by a cloud-based user over the internet.":::

The direction of the arrows in the preceding diagram reflects the direction of the initial communication that affects connectivity at the enterprise perimeters. For UDP media, the first packets might flow in the reverse direction, but these packets might be blocked until packets are flowing in the other direction.

#### Flow descriptions

* Flow 2: Represents a flow initiated by a user on the customer network to the internet as a part of the user's Azure Communication Services experience. Examples of these flows include DNS and peer-to-peer media transmission.
* Flow 2`: Represents a flow initiated by a remote mobile Azure Communication Services user with VPN to the customer network.
* Flow 3: Represents a flow initiated by a remote mobile Azure Communication Services user to Azure Communication Services endpoints.
* Flow 4: Represents a flow initiated by a user on the customer network to Azure Communication Services.
* Flow 5: Represents a peer-to-peer media flow between one Azure Communication Services user and another within the customer network.
* Flow 6: Represents a peer-to-peer media flow between a remote mobile Azure Communication Services user and another remote mobile Azure Communication Services user over the internet.

### Use case: One-to-one calling

A one-to-one call means one user directly calls another user. To initialize the call, the calling SDK obtains a set of candidates that consists of IP addresses and ports. This set includes local, relay, and reflexive (the public IP address of the client as seen by the relay) candidates. The calling SDK sends these candidates to the called party. The called party receives a similar set of candidates and sends them to the caller.

The system uses STUN connectivity check messages to find which caller/called party media paths work, and then selects the best working path. After the system establishes the connection path, it performs a DTLS handshake over the connection to ensure security. After the DTLS handshake, the system derives SRTP keys from the DTLS handshake process. Media (RTP/RTCP packets secured via SRTP) are then sent via the selected candidate pair. The transport relay is available as part of Azure Communication Services.

If the local IP address and port candidates or the reflexive candidates have connectivity, then the direct path between the clients (or if you're using a NAT) is selected for media. If the clients are both on the customer network, then the direct path should be selected. This selection requires direct UDP connectivity within the customer network. If the clients are both nomadic cloud users, then depending on the NAT/firewall, media might use direct connectivity.

If one client is internal on the customer network and one client is external (for example, a mobile cloud user), it's unlikely that direct connectivity between the local or reflexive candidates would be enabled. In this case, you can use one of the transport relay candidates from either client. For example, the internal client obtained a relay candidate from the transport relay in Azure, and the external client needs to be able to send STUN/RTP/RTCP packets to the transport relay. Another option is that the internal client sends to the relay candidate obtained by the mobile cloud client. Although we highly recommend UDP connectivity for media, TCP is supported.

#### High-level steps

1. Azure Communication Services user A resolves URL domain name (DNS) by using Flow 2.

1. User A allocates a media relay port on the Teams transport relay by using Flow 4.

1. User A sends an *invite* with Interactive Connectivity Establishment (ICE) candidates by using Flow 4 to Azure Communication Services.

1. Azure Communication Services notifies User B by using Flow 4.

1. User B allocates a media relay port on the Teams transport relay by using Flow 4.

1. User B sends an *answer* with ICE candidates by using Flow 4, which is forwarded back to User A by using Flow 4.

1. User A and User B invoke ICE connectivity tests and the best available media path is selected. Review the following diagrams to see various use cases.

1. Both users send telemetry to Azure Communication Services by using Flow 4.

### Customer network (intranet)

:::image type="content" source="./media/call-flows/one-to-one-internal.png" alt-text="Diagram that shows traffic flow within the customer network between two Azure Communication Services users.":::

In step 7, peer-to-peer media Flow 5 is selected.

This media transmission is bidirectional. The direction of Flow 5 indicates that one side initiates the communication from a connectivity perspective. In this case, it doesn't matter which direction is used, because both endpoints are within the customer network.

### Customer network to external user (media relayed by the Teams transport relay)

:::image type="content" source="./media/call-flows/one-to-one-via-relay.png" alt-text="Diagram that shows a one-to-one call flow with an external user via an Azure transport relay.":::

In step 7, Flow 4 (from the customer network to Azure Communication Services) and Flow 3 (from a remote mobile Azure Communication Services user to Azure Communication Services) are selected.

The Teams transport relay handles these flows within Azure.

This media transmission is bidirectional. The direction indicates which side initiates the communication from a connectivity perspective. In this case, these flows are used for signaling and media, and they use different transport protocols and addresses.

### Customer network to external user (direct media)

:::image type="content" source="./media/call-flows/one-to-one-with-extenal.png" alt-text="Diagram that shows a one-to-one call flow with an external user with direct media.":::

In step 7, Flow 2 (from the customer network to the client's peer over the internet) is selected.

Direct media with a remote mobile user (not relayed through Azure) is optional. In other words, you can block this path to enforce a media path through a transport relay in Azure.

This media transmission is bidirectional. The direction of Flow 2 to the remote mobile user indicates that one side initiates the communication from a connectivity perspective.

### VPN user to internal user (media relayed by the Teams transport relay)

:::image type="content" source="./media/call-flows/vpn-to-internal-via-relay.png" alt-text="Diagram that shows a one-to-one call flow between an internal user and a VPN user via Azure transport relay.":::

Signaling between the VPN to the customer network uses Flow 2`. Signaling between the customer network and Azure uses Flow 4. However, media bypasses the VPN and is routed via Flows 3 and 4 through Azure Media Relay.

### VPN user to internal user (direct media)

:::image type="content" source="./media/call-flows/vpn-to-internal-direct-media.png" alt-text="Diagram that shows a one-to-one call flow between an internal user and a VPN user with direct media":::

Signaling between the VPN to the customer network uses Flow 2`. Signaling between the customer network and Azure uses Flow 4. However, media bypasses the VPN and is routed via Flow 2 from the customer network to the internet.

This media transmission is bidirectional. The direction of Flow 2 to the remote mobile user indicates that one side initiates the communication from a connectivity perspective.

### VPN user to external user (direct media)

:::image type="content" source="./media/call-flows/vpn-user-to-external-user.png" alt-text="Diagram that shows a one-to-one call flow for an external user calling a VPN user with direct media.":::

Signaling between the VPN user to the customer network uses Flow 2` and Flow 4 to Azure. However, media bypasses the VPN and is routed via Flow 6.

This media transmission is bidirectional. The direction of Flow 6 to the remote mobile user indicates that one side initiates the communication from a connectivity perspective.

### Use case: Azure Communication Services client to PSTN through an Azure Communication Services trunk

Azure Communication Services allows placing and receiving calls from the Public Switched Telephone Network (PSTN). If the PSTN trunk is connected through phone numbers provided by Azure Communication Services, there are no special connectivity requirements for this use case. If you want to connect your own on-premises PSTN trunk to Azure Communication Services, you can use Azure direct routing.

:::image type="content" source="./media/call-flows/acs-to-pstn.png" alt-text="Diagram that shows a one-to-one call between an internal user and a PSTN participant via the Azure trunk line.":::

In this case, signaling and media from the customer network to Azure use Flow 4.

### Use case: Azure Communication Services group calls

The service that provides audio, video, and screen sharing is part of Azure Communication Services. It has a public IP address that must be reachable from both the customer network and a nomadic cloud client. Each client and endpoint needs to be able to connect to the service.

Internal clients obtain local, reflexive, and relay candidates in the same manner as described for one-to-one calls. The clients send these candidates to the service in an invite. The service doesn't use a relay because it has a publicly reachable IP address, so it responds with its local IP address candidate. The client and the service check connectivity in the same manner described for one-to-one calls.

:::image type="content" source="./media/call-flows/acs-group-calls.png" alt-text="Diagram that shows an Azure Communication Services group call between external users and mobile users.":::

### Interoperability restrictions

Media that flows through Azure Communication Services is restricted as follows:

* **Third-party Session Border Controller (SBC)**: An SBC on the boundary with PSTN should terminate the RTP/RTCP stream, secured via SRTP, and not relay it to the next hop. If you relay the flow to the next hop, it might not be understood.

* **Third-party SIP proxy servers**: An Azure Communication Services signaling SIP dialog with a third-party SBC and/or gateway might traverse Microsoft-native SIP proxies (just like Teams). Interoperability with third-party SIP proxies isn't supported.

* **Third-party B2BUA (or SBC)**: A third-party SBC terminates these Azure Communication Services media flows to and from the PSTN. Interoperability with a third-party SBC within the Azure Communication Services network (in which a third-party SBC mediates two Azure Communication Services endpoints) isn't supported.

### Unsupported technologies

* **VPN**: Azure Communication Services doesn't support media transmission over VPNs. If your users are using VPN clients, the client should split and route media traffic over a non-VPN connection as specified in [Enabling Lync media to bypass a VPN tunnel](https://techcommunity.microsoft.com/t5/skype-for-business-blog/enabling-lync-media-to-bypass-a-vpn-tunnel/ba-p/620210).

  > [!NOTE]
  > Although the title indicates Lync, it's applicable to Azure Communication Services and Teams.

* **Packet shapers**: Packet-snipping, packet-inspection, or packet-shaping devices aren't supported and might degrade quality significantly.

## Next step

> [!div class="nextstepaction"]
> [Get started with calling](../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Related content

* Learn more about [call types](../concepts/voice-video-calling/about-call-types.md).
* Learn about [client-server architecture](./client-and-server-architecture.md).
