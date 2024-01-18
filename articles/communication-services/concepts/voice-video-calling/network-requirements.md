---
title: Prepare your organization's network for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the network requirements for Azure Communication Services voice and video calling.
author: nmurav
manager: chpalm
services: azure-communication-services

ms.author: nmurav
ms.date: 09/12/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: devx-track-js
---

# Network recommendations

This article summarizes how the network environment affects voice and video calling quality. Many factors contribute to the quality of Azure Communication Services real-time media that includes audio, video, and application sharing. Some of the factors include network quality and bandwidth, firewall, host, and device configurations.

## Network quality

The quality of real-time media over IP is significantly affected by the quality of the underlying network connectivity, but especially by the amount of:

* **Latency**. The time it takes to get an IP packet from point A to point B on the network. This network propagation delay is determined by the physical distance between the two points and any other overhead incurred by the devices that your traffic flows through. Latency is measured as one-way or round-trip time (RTT).
* **Packet loss**. A percentage of packets that are lost in a specific window of time. Packet loss directly affects audio quality—from small, individual lost packets having almost no impact to back-to-back burst losses that cause complete audio cut-out.
* **Inter-packet arrival jitter, also known as jitter**. The average change in delay between successive packets. Communication Services can adapt to some levels of jitter through buffering. It's only when the jitter exceeds the buffering that a participant will notice its effects.

## Network bandwidth

Ensure that your network is configured to support the bandwidth required by concurrent Communication Services media sessions and other business applications. Testing the end-to-end network path for bandwidth bottlenecks is critical to the successful deployment of your multimedia Communication Services solution.

The following bandwidth requirements are for the JavaScript SDKs.

|Bandwidth|Scenarios|
|:--|:--|
|40 Kbps|Peer-to-peer audio calling|
|500 Kbps|Peer-to-peer audio calling and screen sharing|
|500 Kbps|Peer-to-peer quality video calling 360 pixels at 30 FPS|
|1.2 Mbps|Peer-to-peer HD-quality video calling with resolution of HD 720 pixels at 30 FPS|
|500 Kbps|Group video calling 360 pixels at 30 FPS|
|1.2 Mbps|HD group video calling with resolution of HD 720 pixels at 30 FPS| 

The following bandwidth requirements are for the native Windows, Android, and iOS SDKs.

|Bandwidth|Scenarios|
|:--|:--|
|30 Kbps|Peer-to-peer audio calling |
|130 Kbps|Peer-to-peer audio calling and screen sharing|
|500 Kbps|Peer-to-peer quality video calling 360 pixels at 30 FPS|
|1.2 Mbps|Peer-to-peer HD-quality video calling with resolution of HD 720 pixels at 30 FPS|
|1.5 Mbps|Peer-to-peer HD-quality video calling with resolution of HD 1080 pixels at 30 FPS |
|500 Kbps/1 Mbps|Group video calling|
|1 Mbps/2 Mbps|HD group video calling, 540-pixel videos on a 1080-pixel screen|

## Firewall configuration

Communication Services connections require internet connectivity to specific ports and IP addresses to deliver high-quality multimedia experiences. Without access to these ports and IP addresses, Communication Services will not work properly. The list of IP ranges and allow listed domains that need to be enabled are:

| Category | IP ranges or FQDN | Ports | 
| :-- | :-- | :-- |
| Media traffic | Range of Azure public cloud IP addresses 20.202.0.0/16 The range provided above is the range of IP addresses on either Media processor or Azure Communication Services TURN service. | UDP 3478 through 3481, TCP ports 443 |
| Signaling, telemetry, registration| *.skype.com, *.microsoft.com, *.azure.net, *.azure.com, *.office.com| TCP 443, 80 |


The endpoints below should be reachable for U.S. Government GCC High customers only

| Category | IP ranges or FQDN | Ports | 
| :-- | :-- | :-- |
| Media traffic | 52.127.88.0/21, 52.238.114.160/32, 52.238.115.146/32, 52.238.117.171/32, 52.238.118.132/32, 52.247.167.192/32, 52.247.169.1/32, 52.247.172.50/32, 52.247.172.103/32, 104.212.44.0/22, 195.134.228.0/22 | UDP 3478 through 3481, TCP ports 443 |
| Signaling, telemetry, registration| *.gov.teams.microsoft.us, *.infra.gov.skypeforbusiness.us, *.online.gov.skypeforbusiness.us, gov.teams.microsoft.us | TCP 443, 80 |


## Network optimization

The following tasks are optional and aren't required for rolling out Communication Services. Use this guidance to optimize your network and Communication Services performance or if you know you have some network limitations.
You might want to optimize further if:

* Communication Services runs slowly. Maybe you have insufficient bandwidth.
* Calls keep dropping. Drops might be caused by firewall or proxy blockers.
* Calls have static and cut out, or voices sound like robots. These issues might be caused by jitter or packet loss.

| Network optimization task | Details |
| :-- | :-- |
| Plan your network | In this documentation, you can find minimal requirements to your network for calls. Refer to the [Teams example for planning your network](/microsoftteams/tutorial-network-planner-example). |
| External name resolution | Be sure that all computers running the Communication Services SDKs can resolve external DNS queries to discover the services provided by communication servicers and that your firewalls aren't preventing access. Ensure that the SDKs can resolve the addresses *.skype.com, *.microsoft.com, *.azure.net, *.azure.com, and *.office.com. |
| Maintain session persistence | Make sure your firewall doesn't change the mapped network address translation (NAT) addresses or ports for UDP.
Validate NAT pool size | Validate the NAT pool size required for user connectivity. When multiple users and devices access Communication Services by using [NAT or port address translation](/office365/enterprise/nat-support-with-office-365), ensure that the devices hidden behind each publicly routable IP address don't exceed the supported number. Ensure that adequate public IP addresses are assigned to the NAT pools to prevent port exhaustion. Port exhaustion contributes to internal users and devices being unable to connect to Communication Services. |
| Intrusion detection and prevention guidance | If your environment has an [intrusion detection system](../../../network-watcher/network-watcher-intrusion-detection-open-source-tools.md) or intrusion prevention system deployed for an extra layer of security for outbound connections, allow all Communication Services URLs. |
| Configure split-tunnel VPN | Provide an alternate path for Teams traffic that bypasses the virtual private network (VPN), commonly known as [split-tunnel VPN](/windows/security/identity-protection/vpn/vpn-routing). Split tunneling means that traffic for Communication Services doesn't go through the VPN but instead goes directly to Azure. Bypassing your VPN has a positive impact on media quality, and it reduces load from the VPN devices and the organization's network. To implement a split-tunnel VPN, work with your VPN vendor. Other reasons why we recommend bypassing the VPN: <ul><li> VPNs are typically not designed or configured to support real-time media.</li><li> VPNs might also not support UDP, which is required for Communication Services.</li><li>VPNs also introduce an extra layer of encryption on top of media traffic that's already encrypted.</li><li>Connectivity to Communication Services might not be efficient because of hair-pinning traffic through a VPN device.</li></ul>|
| Implement QoS | [Use Quality of Service (QoS)](/microsoftteams/qos-in-teams) to configure packet prioritization. QoS improves call quality and helps you monitor and troubleshoot call quality. QoS should be implemented on all segments of a managed network. Even when a network is adequately provisioned for bandwidth, QoS provides risk mitigation if unanticipated network events occur. With QoS, voice traffic is prioritized so that these unanticipated events don't negatively affect quality. | 
| Optimize Wi-Fi | Similar to VPN, Wi-Fi networks aren't necessarily designed or configured to support real-time media. Planning for, or optimizing, a Wi-Fi network to support Communication Services is an important consideration for a high-quality deployment. Consider these factors: <ul><li>Implement QoS or Wi-Fi Multimedia to ensure that media traffic is getting prioritized appropriately over your Wi-Fi networks.</li><li>Plan and optimize the Wi-Fi bands and access point placement. The 2.4-GHz range might provide an adequate experience depending on access point placement, but access points are often affected by other consumer devices that operate in that range. The 5-GHz range is better suited to real-time media because of its dense range, but it requires more access points to get sufficient coverage. Endpoints also need to support that range and be configured to use those bands accordingly.</li><li>If you're using dual-band Wi-Fi networks, consider implementing band steering. Band steering is a technique implemented by Wi-Fi vendors to influence dual-band clients to use the 5-GHz range.</li><li>When access points of the same channel are too close together, they can cause signal overlap and unintentionally compete, which results in a degraded user experience. Ensure that access points next to each other are on channels that don't overlap.</li></ul> Each wireless vendor has its own recommendations for deploying its wireless solution. Consult your Wi-Fi vendor for specific guidance.|

## Operating systems and browsers (for JavaScript SDKs)

Communication Services voice and video SDKs support certain operating systems and browsers.
Learn about the operating systems and browsers that the calling SDKs support in the [Calling conceptual documentation](./calling-sdk-features.md).

## Next steps

The following articles might be of interest to you:

- Learn more about [calling libraries](./calling-sdk-features.md).
- Learn about [client-server architecture](../client-and-server-architecture.md).
- Learn about [call flow topologies](../call-flows.md).
