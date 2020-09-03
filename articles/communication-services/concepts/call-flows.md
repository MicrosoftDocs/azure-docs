---
title: Call flows in Azure Communication Services
description: Learn about call flows in Azure Communication Services.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services

---
# Call flows

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

The section below gives an overview of the call flows in Azure Communication Services. Signaling and media flows depend on the types of calls your users are making. Examples of call types include one-to-one VoIP, one-to-one PSTN, and group calls containing a combination of VoIP and PSTN-connected participants. Call types can be reviewed [here](./voice-video-calling/about-call-types.md).

## About signaling and media protocols

When you establish a peer-to-peer or group call, two protocols used behind the scenes. HTTP REST is used for signaling and SRTCP is used for media transfer. 

Signaling between the client SDKs or between client SDKs and Communication Services Signaling Controllers is handled with HTTP REST (TLS). For Real-Time Media Traffic (RTP), the Used Datagram Protocol (UDP) is preferred. If the use of UDP is prevented by your firewall, the Client SDK will use the Transmission Control Protocol (TCP) for media. 

Let's review the signaling and media protocols in various scenarios. 

## Call flow cases

### Case 1: VoIP where a direct connection between two devices is possible

In one-to-one VoIP or video calls, traffic prefers the most direct path. "Direct path" means that if two client SDKs can reach each other directly, they'll establish a direct connection. This is usually possible when two SDKs are in the same subnet (for example, in a subnet 192.168.1.0/24) or two when the devices each live in subnets that can see each other (SDKs in subnet 10.10.0.0/16 and 192.168.1.0/24 can reach out each other).

![Direct VOIP](./media/about-voice-case-1.png)

### Case 2: VoIP where a direct connection between devices is not possible, but where connection between NAT devices is possible

If two devices are located in subnets that can't reach each other (for example, Alice works from a coffee shop and Bob works from his home office) but the connection between the NAT devices is possible, the client side SDKs will establish connectivity via NAT devices. 

For Alice it will be the NAT of the coffee shop and for Bob it will be the NAT of the home office. Alice's device will send the external address of her NAT and Bob's will do the same. The SDKs learn the external addresses from a STUN (Session Traversal Utilities for NAT) service that Azure Communication Services provides free of charge. The logic that handles the handshake between Alice and Bob is embedded within the Azure Communication Services provided client SDKs. (You don't need any additional configuration)

![VOIP through STUN connection](./media/about-voice-case-2.png)

### Case 3: VoIP where neither a direct nor NAT connection is possible

If one or both client devices are behind a symmetric NAT, a separate cloud service to relay the media between the two client SDKs is required. This service is called TURN (Traversal Using Relays around NAT) and is also provided by the Communication Services. Approximately 20% of calls require use of TURN across all our clients. If you use the Communication Services Client SDKs, the request of the keys to use the TURN service happens automatically. Use of Microsoft's TURN service is charged separately. You can disable the use of TURN, but if your SDKs are behind a symmetric NAT, your calls are likely to fail.

![VOIP through TURN connection](./media/about-voice-case-3.png)
 
### Case 4: Group calls with PSTN

Both signaling and media for PSTN Calls use the Azure Communication Services telephony resource. This resource is interconnected with other carriers (to elaborate).

PSTN media traffic flows through a component called Media Processor.

![PSTN Group Call](./media/about-voice-pstn.png)

> [!NOTE]
> For those familiar with media processing, our Media Processor is also a Back to Back User Agent, as defined in [RFC 3261 SIP: Session Initiation Protocol](https://tools.ietf.org/html/rfc3261), meaning it can translate codecs when handling calls between Microsoft and Carrier networks. The Azure Communication Services Signaling Controller is Microsoft's implementation of an SIP Proxy per the same RFC.

For group calls, media and signaling always flow via the Azure Communication Services backend. The audio and/or video from all participants is mixed in the Media Processor component. All members of a group call send their audio and/or video streams to the media processor, which returns mixed media streams.

The default real-time protocol (RTP) for group calls is User Datagram Protocol (UDP).

> [!NOTE]
> The Media Processor can act as a Multipoint Control Unit (MCU) or Selective Forwarding Unit (SFU)

![UDP media processor](./media/about-voice-group-calls.png)

If the client SDK can't use UDP for media due to firewall restrictions, an attempt will be made to use the Transmission Control Protocol (TCP). Note that the Media Processor component requires UDP, so when this happens, the Communication Services TURN service will be added to the group call to translate TCP to UDP. TURN charges will be incurred in this case unless TURN capabilities are manually disabled.

![TCP media processor](./media/about-voice-group-calls-2.png)

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../quickstarts/voice-video-calling/getting-started-with-calling.md)

The following documents may be interesting to you:

- Learn more about [call types](../concepts/voice-video-calling/about-call-types.md)
- Learn about [Client-server architecture](./client-and-server-architecture.md)
- Explore [STUN and TURN](./networking/ice-stun-nat-turn-sdp.md) capabilities