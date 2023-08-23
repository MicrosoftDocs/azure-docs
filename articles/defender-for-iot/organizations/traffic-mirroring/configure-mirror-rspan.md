---
title: Configure traffic mirroring with a Remote SPAN (RSPAN) port - Microsoft Defender for IoT
description: This article describes how to configure a remote SPAN (RSPAN) port for traffic mirroring when monitoring OT networks with Microsoft Defender for IoT.
ms.date: 11/08/2022
ms.topic: install-set-up-deploy
---

# Configure traffic mirroring with a Remote SPAN (RSPAN) port

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

This article describes a sample procedure for configuring [RSPAN](../best-practices/traffic-mirroring-methods.md#remote-span-rspan-ports) on a Cisco 2960 switch with 24 ports running IOS.

> [!IMPORTANT]
> This article is intended only as guidance and not as instructions. Mirror ports on other Cisco operating systems and other switch brands are configured differently. For more information, see your switch documentation.

## Prerequisites

- Before you start, make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure.

    For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

- RSPAN requires a specific VLAN to carry the monitored SPAN traffic between switches. Before you start, make sure that your switch supports RSPAN.

- Make sure that the mirroring option on your switch is turned off.

- Make sure that the remote VLAN is allowed on the trunked port between the source and destination switches.

- Make sure that all switches connecting to the same RSPAN session are from the same vendor.

- Make sure that the trunk port sharing the same remote VLAN between switches isn't already defined as a mirror session source port.

- The remote VLAN increases the bandwidth on the trunked port by the amount of traffic being mirrored from the source session. Make sure that your switch's trunk port can support the increased bandwidth.

> [!CAUTION]
> An increased bandwidth, whether due to large amounts of throughput or a large number of switches, can cause a switch to fail and therefore to bring down the entire network.
> When configuring traffic mirroring with RSPAN, make sure to consider the following:
> - The number of access / distribution switches that you configure with RSPAN.
> - The correlating throughput for the remote VLAN on each switch.

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

[!INCLUDE [validate-traffic-mirroring](../includes/validate-traffic-mirroring.md)]

## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)
