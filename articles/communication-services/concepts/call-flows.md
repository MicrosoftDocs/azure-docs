---
title: Call networking internals
titleSuffix: An Azure Communication Services article
description: This article describes call flows for different Azure Communication Services call types.
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 06/20/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call networking internals

The article describes the call flows in Azure Communication Services. Signaling and media flows depend on the types of calls your users are making. Examples of call types include one-to-one VoIP, one-to-one public switched telephone network (PSTN), and group calls containing a combination of VoIP and PSTN-connected participants. For more information, see [Call types](./voice-video-calling/about-call-types.md).

## Signaling and media protocols

When you establish a peer-to-peer or group call, two protocols are used behind the scenes - HTTPS (REST) for signaling and Secure Real-time Transport Protocol (SRTP) for media.

Signaling between the SDKs or between SDKs and Communication Services signaling controllers is handled with HTTPS REST (TLS). Azure Communication Services uses TLS 1.2. For real-time media traffic (RTP), we recommend user datagram protocol (UDP). If the firewall prevents use of UDP, the SDK uses the transmission control protocol (TCP) for media.

Let's review the signaling and media protocols in various scenarios.

## Call flow cases

### Case 1: VoIP with a direct connection between two devices

In one-to-one VoIP or video calls, traffic prefers the most direct path. *Direct path* means that if two SDKs can reach each other directly, they establish a direct connection. Direct path is possible when two SDKs are in the same subnet (such as in a subnet 192.168.1.0/24) or two when the devices each live in subnets that can see each other (SDKs in subnet 10.10.0.0/16 and 192.168.1.0/24 can reach out each other).

:::image type="content" source="./media/call-flows/about-voice-case-1.png" alt-text="Diagram showing a Direct VOIP call between users and Communication Services.":::

### Case 2: VoIP in which a direct connection between devices isn't possible, but a connection between NAT devices is possible

If two devices are located in subnets that can't reach each other but the connection between the network address translation (NAT) devices is possible, the client side SDKs establish connectivity via NAT devices. For example, if Alice works from a coffee shop and Bob works from a home office.

For Alice, it's the NAT of the coffee shop and for Bob it's the NAT of the home office. Alice's device sends the external address of her NAT and Bob's does the same. The SDKs learn the external addresses from a session traversal utilities for NAT (STUN) service that Azure Communication Services provides free of charge. The logic that handles the handshake between Alice and Bob is embedded in the Azure Communication Services provided SDKs. You don't need any added configuration.

:::image type="content" source="./media/call-flows/about-voice-case-2.png" alt-text="Diagram showing a VOIP call, using a session traversal utilities for NAT (STUN) connection.":::

### Case 3: VoIP in which a direct nor NAT connection is possible

If one or both client devices are behind a symmetric NAT, a separate cloud service is required to relay the media between the two SDKs. This service is called traversal using relays around NAT (TURN) and is also provided by Azure Communication Services. The Communication Services Calling SDK automatically uses TURN services based on detected network conditions. TURN charges are included in the price of the call.

:::image type="content" source="./media/call-flows/about-voice-case-3.png" alt-text="Diagram showing a VOIP, over a traversal using relays around NAT (TURN) connection.":::

### Case 4: Group calls with PSTN

Both signaling and media for PSTN Calls use the Azure Communication Services telephony resource. This resource is interconnected with other carriers.

PSTN media traffic flows through a media processor component.

:::image type="content" source="./media/call-flows/about-voice-pstn.png" alt-text="Diagram showing a PSTN Group Call with Communication Services.":::

> [!NOTE]
> The media processor is also a back to back user agent, as defined in [RFC 3261 SIP: Session Initiation Protocol](https://tools.ietf.org/html/rfc3261), meaning it can translate codecs when handling calls between Microsoft and Carrier networks. The Azure Communication Services signaling controller is Microsoft's implementation of a SIP Proxy per the same RFC.

For group calls, media and signaling always flow via the Azure Communication Services backend. The audio and/or video from all participants is mixed in the media processor. All members of a group call send their audio and video streams to the media processor, which returns mixed media streams.

The default real-time protocol (RTP) for group calls is user datagram protocol (UDP).

> [!NOTE]
> The Media Processor can act as a multipoint control unit (MCU) or selective forwarding unit (SFU).

:::image type="content" source="./media/call-flows/about-voice-group-calls.png" alt-text="Diagram showing UDP media process flow within Communication Services.":::

If the SDK can't use UDP for media due to firewall restrictions, it attempts to use the transmission control protocol (TCP). The media processor component requires UDP, so when in this case, the Communication Services TURN service is added to the group call to translate TCP to UDP. TURN charges are included in the price of the call.

:::image type="content" source="./media/call-flows/about-voice-group-calls-2.png" alt-text="Diagram showing TCP media process flow within Communication Services.":::

### Case 5: Communication Services SDK and Microsoft Teams in a scheduled Teams meeting

Signaling flows through the signaling controller. Media flows through the media processor. The signaling controller and media processor are shared between Communication Services and Microsoft Teams.

:::image type="content" source="./media/call-flows/teams-communication-services-meeting.png" alt-text="Diagram showing Communication Services SDK and Teams Client in a scheduled Teams meeting.":::

### Case 6: Early media

Refers to media that is exchanged, such as audio and video, before the callee accepts the session. For early media flow, the session border controller (SBC) must latch to the first endpoint that starts streaming media; media flow can start before candidates are nominated. The SBC must support sending dual tone multi-frequency (DTMF) during this phase to enable IVR/voicemail scenarios. The SBC should use the highest priority path on which it receives checks, if nominations aren't complete.

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Related articles

- Learn more about [call types](../concepts/voice-video-calling/about-call-types.md)
- Learn about [Client-server architecture](./client-and-server-architecture.md)
- Learn about [Call flow topologies](./detailed-call-flows.md)
