---
title: Traffic mirroring methods - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Traffic mirroring methods for OT monitoring

This article introduces the supported traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.

To ensure that Defender for IoT only analyzes the traffic that you want to monitor, we recommend that you configure traffic mirroring on a switch or a terminal access point (TAP) that includes only industrial ICS and SCADA traffic.

> [!NOTE]
> SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.
>

## Supported mirroring methods

The decision as to which traffic mirroring method to use depends on your network configuration and the needs of your organization.

Defender for IoT supports the following methods:

|Method  |Description  |
|---------|---------|
|[A switch SPAN port](../traffic-mirroring/configure-mirror-span.md)     |  Mirrors local traffic from interfaces on the switch to a different interface on the same switch       |
|[Remote SPAN (RSPAN) port](../traffic-mirroring/configure-mirror-rspan.md)     |  Mirrors traffic from multiple, distributed source ports into a dedicated remote VLAN      |
|[An encapsulated remote switched port analyzer (ERSPAN)](../traffic-mirroring/configure-mirror-erspan.md)     | Mirrors input interfaces to your OT sensor's monitoring interface  |
|[Active or passive aggregation (TAP)](../traffic-mirroring/configure-mirror-tap.md)     |   Installs an active / passive aggregation TAP inline to your network cable, which duplicates traffic to the OT network sensor. Best method for forensic monitoring.      |
|[An ESXi vSwitch](../traffic-mirroring/configure-mirror-esxi.md)    |  Mirrors traffic using *Promiscuous mode* on an ESXi vSwitch.        |
|[A Hyper-V vSwitch](../traffic-mirroring/configure-mirror-hyper-v.md)    |   Mirrors traffic using *Promiscuous mode* on a Hyper-V vSwitch.       |

## Mirroring port scope recommendations

We recommend configuring your traffic mirroring from all of your switch's ports, even if no data is connected to them. If you don't, rogue devices can later be connected to an unmonitored port, and those devices won't be detected by the Defender for IoT network sensors.

For OT networks that use broadcast or multicast messaging, configure traffic mirroring only for RX (*Recieve*) transmissions. Multicast messages will be repeated for any relevant active ports, and you'll be using more bandwidth unnecessarily.

## Next steps

For more information, see:

- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)
- [Sample OT network connectivity models](sample-connectivity-models.md)
