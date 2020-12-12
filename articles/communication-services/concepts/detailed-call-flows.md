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
