---
title: Choose a traffic mirroring methods - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 07/04/2023
ms.topic: install-set-up-deploy
---

# Choose a traffic mirroring method for OT sensors

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes the supported traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="../media/deployment-paths/progress-plan-and-prepare.png":::

The decision as to which traffic mirroring method to use depends on your network configuration and the needs of your organization.

To ensure that Defender for IoT only analyzes the traffic that you want to monitor, we recommend that you configure traffic mirroring on a switch or a terminal access point (TAP) that includes only industrial ICS and SCADA traffic.

> [!NOTE]
> SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.
>

## Mirroring port scope recommendations

We recommend configuring your traffic mirroring from all of your switch's ports, even if no data is connected to them. If you don't, rogue devices can later be connected to an unmonitored port, and those devices won't be detected by the Defender for IoT network sensors.

For OT networks that use broadcast or multicast messaging, configure traffic mirroring only for RX (*Receive*) transmissions. Multicast messages will be repeated for any relevant active ports, and you'll be using more bandwidth unnecessarily.

## Compare supported traffic mirroring methods

Defender for IoT supports the following methods:

|Method  |Description  | More information |
|---------|---------|---------|
|**A switch SPAN port**     |  Mirrors local traffic from interfaces on the switch to a different interface on the same switch |  [Configure mirroring with a switch SPAN port](../traffic-mirroring/configure-mirror-span.md) |
|**Remote SPAN (RSPAN) port**     |  Mirrors traffic from multiple, distributed source ports into a dedicated remote VLAN  | [Remote SPAN (RSPAN) ports](#remote-span-rspan-ports) <br><br>[Configure traffic mirroring with a Remote SPAN (RSPAN) port](../traffic-mirroring/configure-mirror-rspan.md)     |
|**Active or passive aggregation (TAP)**    |   Installs an active / passive aggregation TAP inline to your network cable, which duplicates traffic to the OT network sensor. Best method for forensic monitoring. | [Active or passive aggregation (TAP)](#active-or-passive-aggregation-tap)     |
|**An encapsulated remote switched port analyzer (ERSPAN)**     | Mirrors input interfaces to your OT sensor's monitoring interface | [ERSPAN ports](#erspan-ports) <br><br>[Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan). |
|**An ESXi vSwitch**   |  Mirrors traffic using *Promiscuous mode* on an ESXi vSwitch. | [Traffic mirroring with virtual switches](#traffic-mirroring-with-virtual-switches) <br><br>[Configure traffic mirroring with a ESXi vSwitch](../traffic-mirroring/configure-mirror-esxi.md).      |
|**A Hyper-V vSwitch**    |   Mirrors traffic using *Promiscuous mode* on a Hyper-V vSwitch.  | [Traffic mirroring with virtual switches](#traffic-mirroring-with-virtual-switches) <br><br>[Configure traffic mirroring with a Hyper-V vSwitch](../traffic-mirroring/configure-mirror-hyper-v.md)     |

## Remote SPAN (RSPAN) ports

Configure a remote SPAN (RSPAN) session on your switch to mirror traffic from multiple, distributed source ports into a dedicated remote VLAN.

Data in the VLAN is then delivered through trunked ports, across multiple switches to a specified switch that contains the physical destination port. Connect the destination port to your OT network sensor to monitor traffic with Defender for IoT.

The following diagram shows an example of a remote VLAN architecture:

:::image type="content" source="../media/how-to-set-up-your-network/remote-vlan.jpg" alt-text="Diagram of remote VLAN." border="false" lightbox="../media/how-to-set-up-your-network/remote-vlan.jpg":::

For more information, see [Configure traffic mirroring with a Remote SPAN (RSPAN) port](../traffic-mirroring/configure-mirror-rspan.md).

## Active or passive aggregation (TAP)

When using active or passive aggregation to mirror traffic, an active or passive aggregation terminal access point (TAP) is installed inline to the network cable. The TAP duplicates both *Receive* and *Transmit* traffic to the OT network sensor so that you can monitor the traffic with Defender for IoT.

A TAP is a hardware device that allows network traffic to flow back and forth between ports without interruption. The TAP creates an exact copy of both sides of the traffic flow, continuously, without compromising network integrity.

For example:

:::image type="content" source="../media/how-to-set-up-your-network/active-passive-tap-v2.png" alt-text="Diagram of active and passive TAPs." border="false" lightbox="../media/how-to-set-up-your-network/active-passive-tap-v2.png":::

Some TAPs aggregate both *Receive* and *Transmit*, depending on the switch configuration. If your switch doesn't support aggregation, each TAP uses two ports on your OT network sensor to monitor both *Receive* and *Transmit* traffic.

### Advantages of mirroring traffic with a TAP

We recommend TAPs especially when traffic mirroring for forensic purposes. Advantages of mirroring traffic with TAPs include:

- TAPs are hardware-based and can't be compromised

- TAPs pass all traffic, even damaged messages that are often dropped by the switches

- TAPs aren't processor-sensitive, which means that packet timing is exact. In contrast, switches handle mirroring functionality as a low-priority task, which can affect the timing of the mirrored packets.

You can also use a TAP aggregator to monitor your traffic ports. However, TAP aggregators aren't processor-based, and aren't as intrinsically secure as hardware TAPs. TAP aggregators may not reflect exact packet timing.

### Common TAP models

The following TAP models have been tested for compatibility with Defender for IoT. Other vendors and models might also be compatible.

- **Garland P1GCCAS**

    When using a Garland TAP, make sure to set up your network to support aggregation. For more information, see the **Tap Aggregation** diagram under the **Network Diagrams** tab in the [Garland installation guide](https://www.garlandtechnology.com/products/aggregator-tap-copper).

- **IXIA TPA2-CU3**

    When using an Ixia TAP, make sure **Aggregation mode** is active. For more information, see the [Ixia install guide](https://support.ixiacom.com/sites/default/files/resources/install-guide/c_taps_zd-copper_qig_0303.pdf).

- **US Robotics USR 4503**

    When using a US Robotics TAP, make sure to toggle the aggregation mode on by setting the selectable switch to **AGG**. For more information, see the [US Robotics installation guide](https://www.usr.com/files/9814/7819/2756/4503-ig.pdf).

## ERSPAN ports

Use an encapsulated remote switched port analyzer (ERSPAN) to mirror input interfaces over an IP network to your OT sensor's monitoring interface, when securing remote networks with Defender for IoT.

The sensor's monitoring interface is a promiscuous interface and doesn't have a specifically allocated IP address. When ERSPAN support is configured, traffic payloads that are ERSPAN encapsulated with GRE tunnel encapsulation will be analyzed by the sensor.

Use ERSPAN encapsulation when there's a need to extend monitored traffic across Layer 3 domains. ERSPAN is a Cisco proprietary feature and is available only on specific routers and switches. For more information, see the [Cisco documentation](https://learningnetwork.cisco.com/s/article/span-rspan-erspan).

> [!NOTE]
> This article provides high-level guidance for configuring traffic mirroring with ERSPAN. Specific implementation details will vary depending on your equiptment vendor.
>

### ERSPAN architecture

ERSPAN sessions include a source session and a destination session configured on different switches. Between the source and destination switches, traffic is encapsulated in GRE, and can be routed over layer 3 networks.

For example:

:::image type="content" source="../media/traffic-mirroring/erspan.png" alt-text="Diagram of traffic mirrored from an air-gapped or industrial network to an OT network sensor using ERSPAN." border="false":::

ERSPAN transports mirrored traffic over an IP network using the following process:

1. A source router encapsulates the traffic and sends the packet over the network.
1. At the destination router, the packet is de-capsulated and sent to the destination interface.

ERSPAN source options include elements such as:

- Ethernet ports and port channels
- VLANs; all supported interfaces in the VLAN are ERSPAN sources
- Fabric port channels
- Satellite ports and host interface port channels

For more information, see [Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan).

## Traffic mirroring with virtual switches

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a monitoring port, similar to a [SPAN port](../traffic-mirroring/configure-mirror-span.md). A SPAN port on your switch mirrors local traffic from interfaces on the switch to a different interface on the same switch.

Connect the destination switch to your OT network sensor to monitor traffic with Defender for IoT.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When promiscuous mode is used, any of the virtual machine’s network interfaces in the same portgroup can view all network traffic that goes through that virtual switch. By default, promiscuous mode is turned off.

For more information, see:

- [Configure traffic mirroring with a ESXi vSwitch](../traffic-mirroring/configure-mirror-esxi.md)
- [Configure traffic mirroring with a Hyper-V vSwitch](../traffic-mirroring/configure-mirror-hyper-v.md)

## Next steps

> [!div class="step-by-step"]
> [« Prepare an OT site deployment](plan-prepare-deploy.md)
