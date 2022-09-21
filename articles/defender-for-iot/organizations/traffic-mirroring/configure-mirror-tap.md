---
title: Configure traffic mirroring with active or passive aggregation (TAP) - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---


## Configure traffic mirroring with active or passive aggregation (TAP)

A SPAN port on your switch mirrors local traffic from interfaces on the switch to a different interface on the same switch.


An active or passive aggregation TAP is installed inline to the network cable and duplicates both RX and TX to the monitoring sensor.

The terminal access point (TAP) is a hardware device that allows network traffic to flow from port A to port B, and from port B to port A, without interruption. It creates an exact copy of both sides of the traffic flow, continuously, without compromising network integrity. Some TAPs aggregate transmit and receive traffic by using switch settings if desired. If aggregation isn't supported, each TAP uses two sensor ports to monitor send and receive traffic.

The advantages of TAPs include:

- TAPs are hardware-based and can't be compromised
- TAPs pass all traffic, even damaged messages, which the switches often drop
- TAPs aren't processor sensitive, so packet timing is exact where switches handle the mirror function as a low-priority task that can affect the timing of the mirrored packets

For forensic purposes, a TAP is the best device.

TAP aggregators can also be used for port monitoring. These devices are processor-based and aren't as intrinsically secure as hardware TAPs, and therefore might not reflect exact packet timing.

The following diagram shows an example of a network setup with an active and passive TAP:

:::image type="content" source="../media/how-to-set-up-your-network/active-passive-tap-v2.png" alt-text="Diagram of active and passive TAPs." border="false":::

### Common TAP models

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