---
title: Passive vs active monitoring - Microsoft Defender for IoT
description: Describes how Microsoft Defender for IoT provides both passive and active monitoring on your network devices, and provides guidance as to when to use each method.
ms.date: 05/10/2022
ms.topic: conceptual
---

# Active and passive OT monitoring in Defender for IoT

This article describes how Microsoft Defender for IoT supports both passive monitoring, which is the default OT network monitoring method, and active monitoring, which provides additional insights into your network assets and data.

**Passive monitoring** is Defender for IoT's default method for monitoring and analyzing traffic on your OT network.

Passive monitoring architectures analyze network events and detect risks by running network sniffing on captured metadata. Defender for IoT uses [SPAN ports](traffic-mirroring-methods.md) to create copies of your network metadata, such as from PCAP files, and then analyzes the copied data.

In contrast, you can configure **active monitoring** to run analysis directly on your actual network data. Active monitoring doesn't use SPAN ports or copies of your metadata, but access your data directly on your network.

Passive monitoring is Defender for IoT's default method because it doesn't require access inside your network, and is therefore less risky and requires less bandwidth. However, since passive monitoring only runs on *copied* data, it may not provide the full picture of your network activity.

> [!TIP]
> To illustrate the differences between passive and active scanning, compare a security guard at the entrance to an event hall to a security guard circulating inside the actual event. While the security guard at the entrance will check every person entering or exiting the event, they will certainly miss others inside the event.
>
> For example, a guard at the entrance may miss kitchen staff who were present before the event began or guests who entered through a back door. Security guards circulating inside the event will have a full picture of all people inside the event.

## When to configure active monitoring

You may want to consider active monitoring to fill in gaps in your device visibility. Active monitoring can add detection for more devices, or to enhance detection for more data on devices you've already detected.

For example, active monitoring is helpful in the following situations:

- **For non-transmitting devices**, or **devices without an engineering workstation**. In such cases, there may be no device traffic for passive monitoring to analyze.

- **For quiet devices**, where traffic patterns may rise and fall. Active monitoring can detect data from quiet devices even with low traffic patterns.

- **For networks where you can't create SPAN ports**. SPAN ports are required for Defender for IoT passive monitoring to create mirrors of your network metadata.

- **Deeply hierarchical networks**. Passive monitoring architectures might not create mirrors of the full depth of your network hierarchy, leaving your device visibility with gaps. Use active monitoring to capture the full picture of your devices.

## Supported protocols for active monitoring

Active discovery scans are supported for the following protocols:

|Scan type  |Supported protocols  | Method |
|---------|---------|---------|
|**Switch discovery scans**     |  - SNMPv1<br>- SNMPv2<br>- SNMPv3<br>- HTTP       | [Configure active discovery scans](../configure-active-discovery-scans.md) |
|**PLC discovery and enrichment scans**     | - S7 (Siemens) <br>- CIP (Rockwell)        | [Configure active discovery scans](../configure-active-discovery-scans.md) |
|**Windows event scans** | - WMI | [Configure Windows Endpoint Monitoring](../configure-windows-endpoint-monitoring.md) |
|**DNS lookup scans** | - DNS | [Configure reverse DNS lookup](../configure-reverse-dns-lookup.md) |

## Challenges with active monitoring

If you've decided that you need to add active monitoring to your Defender for IoT deployment, plan your active monitoring activity carefully.

Active monitoring requires direct access to your network, and can affect network bandwidth and latency, cause overloaded devices, and can reach devices at scale. Also consider what other monitoring processes you may have running on your network, and how they and Defender for IoT's active monitoring will need to co-exist.


## Next steps

If you've determined that active monitoring is right for your organization, complete the [prerequisites](../configure-active-monitoring.md) and then use one of the following methods:

- [Configure active discovery scans](../configure-active-discovery-scans.md)
- [Configure Windows Endpoint monitoring](../configure-windows-endpoint-monitoring.md)
- [Configure DNS servers for reverse lookup resolution for OT monitoring](../configure-reverse-dns-lookup.md)

For more information, see:

- [Understand your OT network architecture](understand-network-architecture.md)
- [Plan your sensor connections for OT monitoring](plan-network-monitoring.md)
- [Traffic mirroring methods for OT monitoring](traffic-mirroring-methods.md)
- [Sample OT network connectivity models](sample-connectivity-models.md)

