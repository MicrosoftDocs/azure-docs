---
title: Configure traffic mirroring with a Remote SPAN (RSPAN) port - Microsoft Defender for IoT
description: This article describes how to configure a SPAN port for traffic mirroring when monitoring OT networks with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Configure traffic mirroring with a Remote SPAN (RSPAN) port

Configure a remote SPAN (RSPAN) session on your switch to mirror traffic from multiple, distributed source ports into a dedicated remote VLAN. Data in the VLAN is then delivered through trunked ports, across multiple switches to a specified switch that contains the physical destination port. The destination port connects to the Defender for IoT OT sensor.

## Prerequisites

- RSPAN requires a specific VLAN to carry the monitored SPAN traffic between switches. Before you start, make sure that your switch supports RSPAN.

- Make sure that the mirroring option on your switch is disabled by default.

- Make sure that the remote VLAN is allowed on the trunked port between the source and destination switches.

- Make sure that all switches connecting to the same RSPAN session are from the same vendor.

- Make sure that the trunk port sharing the same remote VLAN between switches isn't already defined as a mirror session source port.

- 
- The remote VLAN must be allowed on the trunked port between the source and destination switches.
- All switches that connect the same RSPAN session must be from the same vendor.
- Make sure that the trunk port that's sharing the remote VLAN between the switches isn't defined as a mirror session source port.
- The remote VLAN increases the bandwidth on the trunked port by the size of the mirrored session's bandwidth. Verify that the switch's trunk port supports the increased bandwidth.

The following diagram shows an example of a remote VLAN architecture:

:::image type="content" source="../media/how-to-set-up-your-network/remote-vlan.jpg" alt-text="Diagram of remote VLAN." border="false":::

For example, use the following steps to set up an RSPAN for a Cisco 2960 switch with 24 ports running IOS.
## Configure the source switch

1. Enter global configuration mode.

1. Create a dedicated VLAN.

1. Identify the VLAN as the RSPAN VLAN.

1. Return to "configure terminal" mode.

1. Configure all 24 ports as session sources.

1. Configure the RSPAN VLAN to be the session destination.

1. Return to privileged EXEC mode.

1. Verify the port mirroring configuration.

## Configure the destination switch

1. Enter global configuration mode.

1. Configure the RSPAN VLAN to be the session source.

1. Configure physical port 24 to be the session destination.

1. Return to privileged EXEC mode.

1. Verify the port mirroring configuration.

1. Save the configuration.

## Next steps

For more information, see:

- [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md)
- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)