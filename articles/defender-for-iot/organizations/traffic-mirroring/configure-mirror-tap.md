---
title: Configure traffic mirroring with active or passive aggregation with terminal access points - Microsoft Defender for IoT
description: This article describes traffic mirroring with active passive aggregation with terminal access points (TAP) for OT monitoring with Microsoft Defender for IoT.
ms.date: 11/08/2022
ms.topic: how-to
---


# Configure traffic mirroring with active or passive aggregation (TAP)

When using active or passive aggregation to mirror traffic, an active or passive aggregation terminal access point (TAP) is installed inline to the network cable. The TAP duplicates both *Receive* and *Transmit* traffic to the OT network sensor so that you can monitor the traffic with Defender for IoT.

A TAP is a hardware device that allows network traffic to flow back and forth between ports without interruption. The TAP creates an exact copy of both sides of the traffic flow, continuously, without compromising network integrity.

For example:

:::image type="content" source="../media/how-to-set-up-your-network/active-passive-tap-v2.png" alt-text="Diagram of active and passive TAPs." border="false" lightbox="../media/how-to-set-up-your-network/active-passive-tap-v2.png":::

Some TAPs aggregate both *Receive* and *Transmit*, depending on the switch configuration. If your switch doesn't support aggregation, each TAP uses two ports on your OT network sensor to monitor both *Receive* and *Transmit* traffic.

## Advantages of mirroring traffic with a TAP

We recommend TAPs especially when traffic mirroring for forensic purposes. Advantages of mirroring traffic with TAPs include:

- TAPs are hardware-based and can't be compromised

- TAPs pass all traffic, even damaged messages that are often dropped by the switches

- TAPs aren't processor-sensitive, which means that packet timing is exact. In contrast, switches handle mirroring functionality as a low-priority task, which can affect the timing of the mirrored packets.

You can also use a TAP aggregator to monitor your traffic ports. However, TAP aggregators aren't processor-based, and aren't as intrinsically secure as hardware TAPs. TAP aggregators may not reflect exact packet timing.

## Common TAP models

The following TAP models have been tested for compatibility with Defender for IoT. Other vendors and models might also be compatible.

- **Garland P1GCCAS**

    When using a Garland TAP, make sure jumpers are set as follows:

    :::image type="content" source="../media/how-to-set-up-your-network/jumper-setup-v2.jpg" alt-text="Screenshot of US Robotics switch.":::

- **IXIA TPA2-CU3**

    :::image type="content" source="../media/how-to-set-up-your-network/ixia-tpa2-cu3-v2.png" alt-text="Screenshot of IXIA TPA2-CU3." border="false":::

- **US Robotics USR 4503**

    When using a US Robotics TAP, make sure **Aggregation mode** is active.

## Next steps

For more information, see:

- [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md)
- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)