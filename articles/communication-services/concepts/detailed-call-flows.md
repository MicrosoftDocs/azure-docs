---
title: Detailed Call flows in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about call flows in Azure Communication Services.
author:  nmurav
services: azure-communication-services

ms.author: nmurav
ms.date: 12/11/2020
ms.topic: overview
ms.service: azure-communication-services

---

# Overview
This article describes Azure Communication Services call flows in various topologies. The document describes these flows, their purpose, and their origin and termination on the network. 

This article covers the following information:

* **Background.** Provides background information such as networks that the flows may traverse, types of traffic, connectivity guidance from the customer network to Azure Communication Services endpoints, interoperability with third-party components, and principles that are used by ACS endpoints to select media flows.
* **Call flows** in various topologies. Illustrates the use of call flows in various topologies. For each topology, the section enumerates all supported flows and illustrates how these flows are used in several use cases. For each use case, it describes the sequence and selection of flows using a flow diagram.

# Background

## Network segments

**Customer network.** This is the network segment that you control and manage. This includes all customer connections within customer offices, whether wired or wireless, connections between office buildings, connections to on-premises datacenters, and your connections to Internet providers, or any other private peering.
Typically, a customer network has several network perimeters with firewalls and/or proxy servers, which enforce your organization's security policies, and that only allow certain network traffic that you have set up and configured. Because you manage this network, you have direct control over the performance of the network, and we recommend that you complete network assessments to validate performance both within sites in your network and from your network to the Azure Network.

**Internet.** This is the network segment that is part of your overall network that will be used by users who are connecting Azure Communication Services from outside of the customer network. It is also used by some traffic from the customer network to Azure Communication Services.

**Azure Communication Services.** This is the network segment that supports Azure Communication Services. It is distributed worldwide with edges in proximity to the customer network in most locations. Functions include Transport Relay, Media Processor for group calls, and others

## Types of traffic

**Real-time media.** Data encapsulated within Real-time Transport Protocol (RTP) that supports audio, video, and screen sharing workloads. In general, media traffic is highly latency sensitive, so you would want this traffic to take the most direct path possible, and to use UDP versus TCP as the transport layer protocol, which is the best transport for interactive real time media from a quality perspective. (Note that as a last resort, media can use TCP/IP and also be tunneled within the HTTP protocol, but it is not recommended due to bad quality implications.) RTP flow is secured using SRTP, in which only the payload is encrypted.

**Signaling.** The communication link between the client and server, or other clients that are used to control activities (for example, when a call is initiated), and deliver instant messages. Most signaling traffic uses the HTTPS-based REST interfaces, though in some scenarios (for example, connection between Azure Communication Services and a Session Border Controller (future use case)) it uses SIP protocol. It's important to understand that this traffic is much less sensitive to latency but may cause service outages or call timeouts if latency between the endpoints exceeds several seconds.

## Interoperability restrictions

**Third-party media relays.** An Azure Communication Services media flow (that is, where one of the media endpoints is ACS) may traverse only Microsoft native media relays (same as for Teams or Skype for Business). Interoperability with a third-party media relay is not supported. (Note that a third-party SBC on the boundary with PSTN must terminate RTP/RTCP stream, secured using SRTP, and not relay it to the next hop.)

**Third-party SIP proxy servers.** An Azure Communication Services signaling SIP dialog with a third-party SBC and/or gateway may traverse Microsoft native SIP proxies (same as for Teams). Interoperability with a third-party SIP proxy is not supported.

**Third-party B2BUA (or SBC).** An Azure Communication Services media flow to and from the PSTN is terminated by a third-party SBC. However, interoperability with a third-party SBC within the ACS network (where a third-party SBC mediates two ACS endpoints) is not supported.

## Technologies that are not recommended with Azure Communication Services endpoints

**VPN network.** It is not recommended for media traffic (or flow 2'). The VPN client should use split VPN and route media traffic like any external non-VPN user, as specified in [Enabling Lync media to bypass a VPN tunnel.](https://techcommunity.microsoft.com/t5/skype-for-business-blog/enabling-lync-media-to-bypass-a-vpn-tunnel/ba-p/620210)

*Note. Although the title indicates Lync, it is applicable to Azure Communications Services and  Teams.*

**Packet shapers.** Any kind of packet snippers, packet inspection, or packet shaper devices are not recommended and may degrade quality significantly.

## Principles

There are four general principles that help you understand call flows for Azure Communication Services:
* An Azure Communication Services group call is hosted in the same region where the first participant joined. (Note that if there are exceptions to this rule in some topologies, they will be described in this document and illustrated by an appropriate call flow.)
* An Azure Communication Services media endpoint in Azure is used based on media processing needs and not based on call type. (For example, a point-to-point call may use a media endpoint in the cloud to process media for transcription or recording, while a call with two participants may not use any media endpoint in the cloud.) However, group calls will use a media endpoint for mixing and routing purposes, allocated where the call is hosted. The media traffic sent from a client to the media endpoint may be routed directly or use a Transport Relay in Azure if required due to customer network firewall restrictions.
* Media traffic for peer-to-peer calls take the most direct route that is available, assuming that the call doesn't mandate a media endpoint in the cloud (see previous principle). The preferred route is direct to the remote peer (client), but if that route isn't available, then one or more Transport Relays will relay traffic. It is recommended that media traffic shall not transverse servers such as packet shapers, VPN servers, and so on, since this will impact the media quality.
* Signaling traffic always goes to the closest server to the user.

To learn more about the details on the media path that is chosen, please [see the following article](https://docs.microsoft.com/en-us/azure/communication-services/concepts/call-flows) 


# Call flows in various topologies

## Azure Communication Services topology

This topology is used by customers that leverage Azure Communication Services from the cloud without any on-premises deployment, such as SIP Interface. The interface to Azure Communication Services is done over the Internet.

:::image type="content" source="./media/call-flows/detailed-flow-general.png" alt-text="Azure Communication Services Topology.":::

*Figure 1 - ACS topology*

The direction of the arrows on the diagram above reflect the initiation direction of the communication that affects connectivity at the enterprise perimeters. In the case of UDP for media, the first packet(s) may flow in the reverse direction, but these packets may be blocked until packets in the other direction will flow.

Flow descriptions:
* Flow 2 – Represents a flow initiated by a user on the customer network to the Internet as a part of the user's ACS experience. Examples of these flows are DNS and peer-to-peer media.
* Flow 2' – Represents a flow initiated by a remote mobile ACS user, with VPN to the customer network.
* Flow 3 – Represents a flow initiated by a remote mobile ACS user to Azure Communication Services endpoints.
* Flow 4 – Represents a flow initiated by a user on the customer network to Azure Communication Services.
* Flow 5 – Represents a peer-to-peer media flow between an ACS and another ACS user within the customer network.
* Flow 6 – Represents a peer-to-peer media flow between a remote mobile ACS user and another remote mobile ACS user over the Internet.

## Use case: One-to-one

One-to-one calls use a common model in which the caller will obtain a set of candidates consisting of IP addresses/ports, including local, relay, and reflexive (public IP address of client as seen by the relay) candidates. The caller sends these candidates to the called party; the called party also obtains a similar set of candidates and sends them to the caller. STUN connectivity check messages are used to find which caller/called party media paths work, and the best working path is selected. Media (that is, RTP/RTCP packets secured using SRTP) are then sent using the selected candidate pair. The Transport relay is deployed as part of Azure Communication Services.

If the local IP address/port candidates or the reflexive candidates have connectivity, then the direct path between the clients (or using a NAT) will be selected for media. If the clients are both on the customer network, then the direct path should be selected. This requires direct UDP connectivity within the customer network. If the clients are both nomadic cloud users, then depending on the NAT/firewall, media may use direct connectivity.

If one client is internal on the customer network and one client is external (for example, a mobile cloud user), then it is unlikely that direct connectivity between the local or reflexive candidates is working. In this case, an option is to use one of the Transport Relay candidates from either client (for example, the internal client obtained a relay candidate from the Transport relay in Azure; the external client needs to be able to send STUN/RTP/RTCP packets to the transport relay). Another option is the internal client sends to the relay candidate obtained by the mobile cloud client. Note that, although UDP connectivity for media is highly recommended, TCP is supported.

**High-level steps:**
1.	ACS User A resolves URL domain name (DNS) using flow 2.
2.	ACS User A allocates a media Relay port on Teams Transport Relay using flow 4.
3.	ACS A sends "invite" with ICE candidates using flow 4 to Azure Communication Services
4.	Azure Communication Services sends notification to ACS User B using flow 4.
5.	ACS User B allocates a media Relay port on Teams Transport Relay using flow 4.
6.	ACS User B sends "answer" with ICE candidates using flow 4, which is forwarded back to ACS User A using Flow 4.
7.	ACS User A and ACS User B invoke ICE connectivity tests and the best available media path is selected (see diagrams below for various use cases).
8.	ACS User send telemetry to Azure Communication Services using flow 4.

### Within customer network:

:::image type="content" source="./media/call-flows/one-to-one-internal.png" alt-text="Traffic Flow within the Customer Network.":::

*Figure 2 - Within customer network*

In step 7, peer-to-peer media flow 5 is selected.

Media is bidirectional. The direction of flow 5 indicates that one side initiates the communication from a connectivity perspective, consistent with all the flows in this document. In this case, it doesn't matter which direction is used because both endpoints are within the customer network.

### Customer network to external user (media relayed by Azure Transport Relay):

:::image type="content" source="./media/call-flows/one-to-one-via-relay.png" alt-text="One to One Call Flow via a Relay.":::

*Figure 3 - Customer network to external user (media relayed by Azure Transport Relay)*

In step 7, flow 4, from customer network to Azure Communication Services, and flow 3, from remote mobile ACS user to Azure Communication Services, are selected. These flows are relayed by Teams Transport Relay within Azure.

Media is bidirectional, where direction indicates which side initiates the communication from a connectivity perspective. In this case, these flows are used for signaling and media, using different transport protocols and addresses.

### Customer network to external user (direct media):

:::image type="content" source="./media/call-flows/one-to-one-with-extenal.png" alt-text="One to One Call Flow with an External User.":::

*Figure 4 - Customer network to external user (direct media)*

In step 7, flow 2, from customer network to the Internet (client's peer), is selected.
* Direct media with remote mobile user (not relayed through Azure) is optional. In other words, customer may block this path to enforce a media path through Transport Relay in Azure.
* Media is bidirectional. The direction of flow 2 to remote mobile user indicates that one side initiates the communication from a connectivity perspective.

### VPN user to internal user (media relayed by Teams Transport Relay)

:::image type="content" source="./media/call-flows/vpn-to-internal-via-relay.png" alt-text="One to One Call Flow with a VPN user via Relay.":::

*Figure 5 - VPN user to internal user (media relayed by Azure Relay*

Signaling between the VPN to the customer network is using flow 2'. Signaling between the customer network and Azure is using flow 4. However, media bypasses the VPN and is routed using flows 3 and 4 through Azure Media Relay.

### VPN user to internal user (direct media)

:::image type="content" source="./media/call-flows/vpn-to-internal-direct-media.png" alt-text="One to One Call Flow with a VPN with Direct Media":::

*Figure 6 - VPN user to internal user (direct media)*

Signaling between the VPN to the customer network is using flow 2'. Signaling between the customer network and Azure  is using flow 4. However, media bypasses the VPN and is routed using flow 2 from the customer network to the Internet.

Media is bidirectional. The direction of flow 2 to the remote mobile user indicates that one side initiates the communication from a connectivity perspective.

### VPN user to external user (direct media)

:::image type="content" source="./media/call-flows/vpn-user-to-external-user.png" alt-text="One to One Call Flow with a VPN with Direct Media":::

*Figure 7 - VPN user to external user (direct media)*

Signaling between the VPN user to the customer network is using flow 2' and using flow 4 to Azure. However, media bypasses VPN and is routed using flow 6.

Media is bidirectional. The direction of flow 6 to the remote mobile user indicates that one side initiates the communication from a connectivity perspective.

### Use Case: ACS Client to PSTN through Azure Communication Services Trunk

Azure Communication Services allows placing and receiving calls from the Public Switched Telephone Network (PSTN). If the PSTN trunk is connected using the Azure Communication Services Phone Numbers, then there are no special connectivity requirements for this use case. (If you want to connect your own on-premises PSTN trunk to Azure Communication Services, you can use SIP Interface (available in CY2021.)

:::image type="content" source="./media/call-flows/acs-to-pstn.png" alt-text="One to One Call with a PSTN Participant":::

Signaling and media from the customer network to Azure using the flow 4
*Figure 8 – ACS User to PSTN through Azure Trunk*

### Use case: ACS Group Calls

The audio/video/screen sharing (VBSS) service is part of Azure Communication Services. It has a public IP address that must be reachable from the customer network and must be reachable from a Nomadic Cloud client. Each client/endpoint needs to be able to connect to the service.

Internal clients will obtain local, reflexive, and relay candidates in the same manner as described for one-to-one calls. The clients will send these candidates to the service in an invite. The service does not use a relay since it has a publicly reachable IP address, so it responds with its local IP address candidate. The client and the service will check connectivity in the same manner described for one-to-one calls.

:::image type="content" source="./media/call-flows/acs-group-calls.png" alt-text="OACS Group Call":::

*Figure 9 – ACS Group Calls*
