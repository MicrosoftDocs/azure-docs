---
title: Prepare your organization's network for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the network requirements for Azure Communication Services voice and video calling
author: nmurav
manager: jken
services: azure-communication-services

ms.author: nmurav
ms.date: 3/23/2021
ms.topic: overview
ms.service: azure-communication-services
---


# Ensure high-quality media in Azure Communication Services

This document provides an overview of the factors and best practices that should be considered when building high-quality multimedia communication experiences with Azure Communication Services.

## Factors that affect media quality and reliability

There are many different factors that contribute to Azure Communication Services real-time media (audio, video, and application sharing) quality. These include network quality, bandwidth, firewall, host, and device configurations.


### Network quality

The quality of real-time media over IP is significantly impacted by the quality of the underlying network connectivity, but especially by the amount of:
* **Latency**. This is the time it takes to get an IP packet from point A to point B on the network. This network propagation delay is determined by the physical distance between the two points and any additional overhead incurred by the devices that your traffic flows through. Latency is measured as one-way or Round-trip Time (RTT).
* **Packet Loss**. A percentage of packets that are lost in a given window of time. Packet loss directly affects audio quality—from small, individual lost packets having almost no impact, to back-to-back burst losses that cause complete audio cut-out.
* **Inter-packet arrival jitter or simply jitter**. This is the average change in delay between successive packets. Azure Communication Services can adapt to some levels of jitter through buffering. It's only when the jitter exceeds the buffering that a participant will notice its effects.

### Network bandwidth

Ensure that your network is configured to support the bandwidth required by concurrent Azure Communication Services media sessions and other business applications. Testing the end-to-end network path for bandwidth bottlenecks is critical to the successful deployment of your multimedia Communication Services solution.

Below are the bandwidth requirements for the JavaScript SDKs:

|Bandwidth|Scenarios|
|:--|:--|
|40  kbps|Peer-to-peer audio calling|
|500 kbps|Peer-to-peer audio calling and screen sharing|
|500 kbps|Peer-to-peer quality video calling 360p at 30fps|
|1.2 Mbps|Peer-to-peer HD quality video calling with resolution of HD 720p at 30fps|
|500 kbps|Group video calling 360p at 30fps|
|1.2 Mbps|HD Group video calling with resolution of HD 720p at 30fps| 

Below are the bandwidth requirements for the native Android and iOS SDKs:

|Bandwidth|Scenarios|
|:--|:--|
|30 kbps|Peer-to-peer audio calling |
|130 kbps|Peer-to-peer audio calling and screen sharing|
|500 kbps|Peer-to-peer quality video calling 360p at 30fps|
|1.2 Mbps|Peer-to-peer HD quality video calling with resolution of HD 720p at 30fps|
|1.5 Mbps|Peer-to-peer HD quality video calling with resolution of HD 1080p at 30fps |
|500kbps/1Mbps|Group video calling|
|1Mbps/2Mbps|HD Group video calling (540p videos on 1080p screen)|

### Firewall(s) configuration

Azure Communication Services connections require internet connectivity to specific ports and IP addresses in order to deliver high-quality multimedia experiences. Without access to these ports and IP addresses, Azure Communication Services can still work. However, the optimal experience is provided when the recommended ports and IP ranges are open.

| Category | IP ranges or FQDN | Ports | 
| :-- | :-- | :-- |
| Media traffic | [Range of Azure Public Cloud IP Addresses](https://www.microsoft.com/download/confirmation.aspx?id=56519) | UDP 3478 through 3481, TCP ports 443 |
| Signaling, telemetry, registration| *.skype.com, *.microsoft.com, *.azure.net, *.azureedge.net, *.office.com, *.trouter.io | TCP 443, 80 |

### Network optimization

The following tasks are optional and aren't required for rolling out Azure Communication Services. Use this guidance to optimize your network and Azure Communication Services performance or if you know you have some network limitations.
You might want to optimize further if:
* Azure Communication Services runs slowly (maybe you have insufficient bandwidth)
* Calls keep dropping (might be due to firewall or proxy blockers)
* Calls have static and cut out, or voices sound like robots (could be jitter or packet loss)

| Network optimization task | Details |
| :-- | :-- |
| Plan your network | In this documentation you can find minimal requirements to your network for calls. Refer to the [Teams example for planning your network](https://docs.microsoft.com/microsoftteams/tutorial-network-planner-example) |
| External name resolution | Be sure that all computers running the Azure Communications Services SDKs can resolve external DNS queries to discover the services provided by Azure Communication Servicers and that your firewalls are not preventing access. Please ensure that the SDKs can resolve addresses *.skype.com, *.microsoft.com, *.azure.net, *.azureedge.net, *.office.com, *.trouter.io  |
| Maintain session persistence | Make sure your firewall doesn't change the mapped Network Address Translation (NAT) addresses or ports for UDP
Validate NAT pool size | Validate the network address translation (NAT) pool size required for user connectivity. When multiple users and devices access Azure Communication Services using [Network Address Translation (NAT) or Port Address Translation (PAT)](https://docs.microsoft.com/office365/enterprise/nat-support-with-office-365), ensure that the devices hidden behind each publicly routable IP address do not exceed the supported number. Ensure that adequate public IP addresses are assigned to the NAT pools to prevent port exhaustion. Port exhaustion will contribute to internal users and devices being unable to connect to the Azure Communication Services |
| Intrusion Detection and Prevention Guidance | If your environment has an [Intrusion Detection](https://docs.microsoft.com/azure/network-watcher/network-watcher-intrusion-detection-open-source-tools) or Prevention System (IDS/IPS) deployed for an extra layer of security for outbound connections, allow all Azure Communication Services URLs |
| Configure split-tunnel VPN | We recommend that you provide an alternate path for Teams traffic that bypasses the virtual private network (VPN), commonly known as [split-tunnel VPN](https://docs.microsoft.com/windows/security/identity-protection/vpn/vpn-routing). Split tunneling means that traffic for Azure Communications Services doesn't go through the VPN but instead goes directly to Azure. Bypassing your VPN will have a positive impact on  media quality, and it reduces load from the VPN devices and the organization's network. To implement a split-tunnel VPN, work with your VPN vendor. Other reasons why we recommend bypassing the VPN: <ul><li> VPNs are typically not designed or configured to support real-time media.</li><li> VPNs might also not support UDP (which is required for Azure Communication Services)</li><li>VPNs also introduce an extra layer of encryption on top of media traffic that's already encrypted.</li><li>Connectivity to Azure Communication Services might not be efficient due to hair-pinning traffic through a VPN device.</li></ul>|
| Implement QoS | [Use Quality of Service (QoS)](https://docs.microsoft.com/microsoftteams/qos-in-teams) to configure packet prioritization. This will improve call quality and help you monitor and troubleshoot call quality. QoS should be implemented on all segments of a managed network. Even when a network has been adequately provisioned for bandwidth, QoS provides risk mitigation in the event of unanticipated network events. With QoS, voice traffic is prioritized so that these unanticipated events don't negatively affect quality. | 
| Optimize WiFi | Similar to VPN, WiFi networks aren't necessarily designed or configured to support real-time media. Planning for, or optimizing, a WiFi network to support Azure Communication Services is an important consideration for a high-quality deployment. Consider these factors: <ul><li>Implement QoS or WiFi Multimedia (WMM) to ensure that media traffic is getting prioritized appropriately over your WiFi networks.</li><li>Plan and optimize the WiFi bands and access point placement. The 2.4 GHz range might provide an adequate experience depending on access point placement, but access points are often affected by other consumer devices that operate in that range. The 5 GHz range is better suited to real-time media due to its dense range, but it requires more access points to get sufficient coverage. Endpoints also need to support that range and be configured to leverage those bands accordingly.</li><li>If you're using dual-band WiFi networks, consider implementing band steering. Band steering is a technique implemented by WiFi vendors to influence dual-band clients to use the 5 GHz range.</li><li>When access points of the same channel are too close together, they can cause signal overlap and unintentionally compete, resulting in a degraded user experience. Ensure that access points that are next to each other are on channels that don't overlap.</li></ul> Each wireless vendor has its own recommendations for deploying its wireless solution. Consult your WiFi vendor for specific guidance.|



### Operating system and Browsers (for JavaScript SDKs)

Azure Communication Services voice/video SDKs support certain operating systems and browsers.
Learn about the operating systems and browsers that the calling SDKs support in the [calling conceptual documentation](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features).

## Next steps

The following documents may be interesting to you:

- Learn more about [calling libraries](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features)
- Learn about [Client-server architecture](https://docs.microsoft.com/azure/communication-services/concepts/client-and-server-architecture)
- Learn about [Call flow topologies](https://docs.microsoft.com/azure/communication-services/concepts/call-flows)
