---
title: Configure traffic mirroring overview - Microsoft Defender for IoT
description: This article serves as an overview for configuring traffic mirroring for Microsoft Defender for IoT.
ms.date: 07/04/2023
ms.topic: install-set-up-deploy
---

# Configure traffic mirroring

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT and provides an overview of the procedures for configuring traffic mirroring in your network.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

## Prerequisites

Before you configure traffic mirroring, make sure that you've decided on a traffic mirroring method. For more information, see [Prepare an OT site deployment](../best-practices/plan-prepare-deploy.md).

## Traffic mirroring processes

Use one of the following procedures to configure traffic mirroring in your network:

**SPAN ports**:

- [Configure mirroring with a switch SPAN port](configure-mirror-span.md)
- [Configure traffic mirroring with a Remote SPAN (RSPAN) port](configure-mirror-rspan.md)
- [Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan)

**Virtual switches**:

- [Configure traffic mirroring with a ESXi vSwitch](configure-mirror-esxi.md)
- [Configure traffic mirroring with a Hyper-V vSwitch](configure-mirror-hyper-v.md)

Defender for IoT also supports traffic mirroring with TAP configurations. For more information, see [Active or passive aggregation (TAP)](../best-practices/traffic-mirroring-methods.md#active-or-passive-aggregation-tap).

## Next steps 

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)
