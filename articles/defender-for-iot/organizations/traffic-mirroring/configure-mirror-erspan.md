---
title: Configure ERSPAN traffic mirroring with a Cisco switch - Microsoft Defender for IoT
description: This article describes how to configure the Cisco switch for encapsulated remote switched port analyzer (ERSPAN) traffic mirroring for Microsoft Defender for IoT.
ms.date: 05/26/2024
ms.topic: install-set-up-deploy
---

# Configure ERSPAN traffic mirroring with a Cisco switch

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

This article provides high-level guidance for configuring encapsulated remote switched port analyzer [(ERSPAN) traffic mirroring](../best-practices/traffic-mirroring-methods.md#erspan-ports) for a Cisco switch.

We recommend using your receiving router as the generic routing encapsulation (GRE) tunnel destination.

## Prerequisites

Before you start, make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure.

For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

## Configure the Cisco switch

The following code shows a sample `ifconfig` output for ERSPAN configured on a Cisco switch:

```cli
monitor session 1 type erspan-source
description ERSPAN to D4IoT
erspan-id 32                              # required, # between 1-1023
vrf default                               # required
destination ip 172.1.2.3                  # IP address of destination
source interface port-channel1 both       # Port(s) to be sniffed
filter vlan 1                             # limit VLAN(s) (optional)
no shut                                   # enable

monitor erspan origin ip-address 172.1.2.1 global
```

For more information, see [CLI command reference from OT network sensors](../cli-ot-sensor.md).

[!INCLUDE [validate-traffic-mirroring](../includes/validate-traffic-mirroring.md)]

## Configure ERSPAN on your OT network sensor

After deploying your sensor, make sure to configure ERSPAN settings on the **Interface configurations** page. For more information, see:

- In the deployment wizard GUI: [Define the interfaces you want to monitor](../ot-deploy/activate-deploy-sensor.md#define-the-interfaces-you-want-to-monitor)
- In the OT sensor system settings: [Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan)

For example:

:::image type="content" source="../media/how-to-manage-individual-sensors/configure-erspan.png" alt-text="Screenshot of how to configure ERSPAN settings in the OT sensor settings.":::

## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)

