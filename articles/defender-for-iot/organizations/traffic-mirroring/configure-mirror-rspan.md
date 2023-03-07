---
title: Configure traffic mirroring with a Remote SPAN (RSPAN) port - Microsoft Defender for IoT
description: This article describes how to configure a remote SPAN (RSPAN) port for traffic mirroring when monitoring OT networks with Microsoft Defender for IoT.
ms.date: 11/08/2022
ms.topic: how-to
---

# Configure traffic mirroring with a Remote SPAN (RSPAN) port

Configure a remote SPAN (RSPAN) session on your switch to mirror traffic from multiple, distributed source ports into a dedicated remote VLAN.

Data in the VLAN is then delivered through trunked ports, across multiple switches to a specified switch that contains the physical destination port. Connect the destination port to your OT network sensor to monitor traffic with Defender for IoT.

The following diagram shows an example of a remote VLAN architecture:

:::image type="content" source="../media/how-to-set-up-your-network/remote-vlan.jpg" alt-text="Diagram of remote VLAN." border="false" lightbox="../media/how-to-set-up-your-network/remote-vlan.jpg":::

This article describes a sample procedure for configuring RSPAN on a Cisco 2960 switch with 24 ports running IOS. The steps described are intended as high-level guidance. For more information, see the Cisco documentation.

> [!IMPORTANT]
> This article is intended only as guidance and not as instructions. Mirror ports on other Cisco operating systems and other switch brands are configured differently.

## Prerequisites

- RSPAN requires a specific VLAN to carry the monitored SPAN traffic between switches. Before you start, make sure that your switch supports RSPAN.

- Make sure that the mirroring option on your switch is turned off.

- Make sure that the remote VLAN is allowed on the trunked port between the source and destination switches.

- Make sure that all switches connecting to the same RSPAN session are from the same vendor.

- Make sure that the trunk port sharing the same remote VLAN between switches isn't already defined as a mirror session source port.

- The remote VLAN increases the bandwidth on the trunked port by the amount of traffic being mirrored from the source session. Make sure that your switch's trunk port can support the increased bandwidth.

## Configure the source switch

On your source switch:

1. Enter `global configuration` mode and create a new, dedicated VLAN.

1. Identify your new VLAN as the RSPAN VLAN, and then return to `configure terminal` mode.

1. Configure all 24 ports as session sources.

1. Configure the RSPAN VLAN to be the session destination.

1. Return to the privileged `EXEC` mode and verify the port mirroring configuration.

## Configure the destination switch

On your destination switch:

1. Enter `global configuration` mode, and configure the RSPAN VLAN to be the session source.

1. Configure physical port 24 to be the session destination.

1. Return to privileged `EXEC` mode and verify the port mirroring configuration.

1. Save the configuration.

## Next steps

For more information, see:

- [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md)
- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)