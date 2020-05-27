---
title: Voice
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

> [!WARNING]
> This is an **in-progress draft** that has not yet undergone editorial review.

<br>
<br>

#  Voice

You can use ACS to make and receive calls, analyze call metadata, record calls, and even build call trees. The calls can be VoIP, PSTN. The calls also can be one to one or group. You can use JS, Android or iOS Client SDKs to make and receive the calls. We also support calls to and from Bots. The section covers all aspects of calling in ACS using Client SDKs (Bots will be added later).

In order to start a call, you need:

1.	An Azure Communication Service resource. Please refer to this page to learn how to get one (link TBC). 
2.	An ACS User Token.  Please refer to this documentation how to get the token (Link TBC)
3.	Client-side SDK. For your convenience we provide client-Side SDKs to interact with Voice (and other) API. Client-side SDKs also contain the media stack which is fully compatible with the ACS Backend. 
4.	(Optional) If you want to add calling to and from the telephony numbers you might acquire the telephony capabilities for your Azure Communications Resource

Call types in Azure Communications Services

There are multiple types of calls you can make in the Azure Communication Services. Call type and number of participants define how the signaling and media traffic flows. Let dig into the call types.

#### Voice Over IP (VoIP) 

When an ACS user calls to another ACS user, using ACS Client SDKs, the call is a Voice Over IP call (VoIP). Both signaling and media flow over IP networks.

#### Telephony or Public Switched Telephone Network (PSTN Call)

Any call that goes to a PSTN user. Note for making or receiving PSTN calls you need to add telephony capabilities to your ACS resource. The signaling and media flows to the ACS backend using IP networks, after the signaling and media flow via telephone networks (either IP or TDM) 

#### One to one call

A call between two ACS users (VoIP), using the Client SDKs or a call between an ACS user and a PSTN user

#### Group call 

A call where three or more participant present. They can be all ACS users, one ACS and two PSTN users or any other combination of ACS and PSTN users on the same call. A one to one call can be converted to a group call by adding a third (or more) participant or a bot.


### Next steps

If you are interested in general call flows, please continue to “Call flows” (link) (Recommended). You also might want read the section “Ports, IP Addresses and FQDNs”  if you need to understand which ports, IP addresses and FQDNs need to be white listed on your firewall.

If you just want to start trying, go to Voice QuickStart (link). Note your firewall might prevent connection to the Azure Communication Services. If you face with the issues, please go back and read about ports and IP addresses.


### Call Flows (separate section under “About Voice”)

The section below gives an overview of the call flows in ACS. Note the traffic flow depends on the type of call (one to one VoIP, one to one PSTN, group calls) and type of participants (ACS only or mix of the ACS and PSTN participants.

#### About Signaling and Media protocols

For signaling between the Client SDKs or Client SDKs and ACS Signaling Controller  HTTP REST is used (TLS) .  For Real Time Media Traffic (RTP), the Used Datagram Protocol (UDP) preferred, if use of UDP prevented by firewall, the Client SDK will use the Transmission Control Protocol (TCP) for media. 

#### One to One Calls

#### VoIP calls


##### Case 1. Direct connection between two end points is possible

In one to one VoIP or Video calls the traffic always prefer direct path. Direct path means that if two Client SDKs can reach out each other, they will establish the direct connection. This usually happens when two SDKs are in the same subnet (for example, in a subnet 192.168.1.0/24) or two subnets are routable (SDKs in subnet 10.10.0.0/16 and 192.168.1.0/24 can reach out each other).

![alt text for image](../media/about-voice-case-1.png)

##### Case 2. Direct connection between client SDKs is not possible, but connection between NAT devices is possible

If two end points are placed in subnets that cannot reach each other (for example, Alice works from a coffee shop and Bob works from his home office) but the connection between the NAT devices is possible the SDKs will connect via NAT devices. For Alice it will be NAT of the coffee shop, for Bob NAT of the home office. Alice SDK will send the external address of her NAT, Bob will send external address of his NAT. The SDKs learn the external addresses from a STUN (Session Traversal Utilities for NAT) service, provided by ACS. Use of the ACS STUN service is free of charge. If you use the Client SDKs from ACS you don’t need to configure anything, the logic of requesting the external IPs of the NAT devices via ACS STUN is embedded in the Client SDKs.

![alt text for image](../media/about-voice-case-2.png)

##### Case 3. Nether direct connection nor the connection via the NAT devices possible

In case if one or both clients are behind a symmetric NAT, a separate cloud service to relay the media between two Client SDKs required. The service called TURN (Traversal Using Relays around NAT) and provided by the ACS. Approximately 20% of calls require use of TURN across all our clients. Microsoft has TURN servers placed around the globe. If you use the ACS Client SDKs, the request of the keys to use the TURN service happens automatically. Use of TURN service is charged separately. You can disable use of TURN service, but if your SDKs are behind the NAT device, which require use of TURN, your calls might fail.

![alt text for image](../media/about-voice-case-3.png)
 
#### PSTN Calls

Both signaling and Media for PSTN Calls using the ACS telephony resource always flow via the ACS backend. ACS interconnected with other carriers in backend, therefore, the traffic should flow to Microsoft. 
The Media traffic flows via component, called Media Processor.
Note for geeks: Media Processor is also a Back to Back User Agent, as defined in RFC 3261 .SIP: Session Initiation Protocol, meaning it can translate codecs when handling the calls between Microsoft and Carrier networks. ACS Signaling Controller is Microsoft implementation of SIP Proxy per the same RFC.

![alt text for image](../media/about-voice-pstn.png)



#### Group Calls

For Group calls media and signaling always flow via the ACS backend. For group calls the audio and/or video from all participants need to be mixed. The mixing happens in the component, called Media Processor. All clients, participating in a group call, send their audio and/or video streams to the media processor, which returns mixed audio and/or video streams.
For Group calls the default protocol for the Real Time Protocol (RTP) is User Datagram Protocol (UDP)

Note for geeks: Media Processor can act as a Multipoint Control Unit (MCU) or Selective Forwarding Unit (SFU)

![alt text for image](../media/about-voice-group-calls.png)

If client SDK for some reason cannot use UDP for Media, for example firewall prevents, the Transmission Control Protocol (TCP) will be tried.  However, the Media Processors cannot work with the TCP, the ACS TURN service is added to the group call to translate the TCP to UDP

![alt text for image](../media/about-voice-group-calls-2.png)

The charges for use of TURN will occur in this case (unless TURN service manually disabled)

IP addresses, ports, protocols and FDDNs (next section under “About Voice”)

In progress



### Related Docs: 

#### Conceptuals: 

- Phone Numbers 
- SIP, VOIP, and PSTN 
- Phone Trees 
- Call Detail Records 
- Call Analytics 
- Spam / Robocall Protection (PSTN) 

 
#### Quickstarts: 

- Get Started With Voice 

 

#### Tutorials: 

- How to make and receive phone calls 
- How to record phone calls 
- How to create a conference call 
- How to capture input from a phone's keypad 
- How to analyze call metadata 

#### Samples: 

TODO 



