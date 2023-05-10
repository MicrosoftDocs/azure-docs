---
title: Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN) - Microsoft Defender for IoT
description: This article describes traffic mirroring with ERSPAN for monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: install-set-up-deploy
---

# Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN)

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

This article provides high-level guidance for configuring [traffic mirroring with ERSPAN](../best-practices/traffic-mirroring-methods.md#erspan-ports). Specific implementation details will vary depending on your equipment vendor.

We recommend using your receiving router as the generic routing encapsulation (GRE) tunnel destination.

## Prerequisites

Before you start, make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure.

For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

## Configure ERSPAN on your OT network sensor

Newly installed OT network sensors have ERSPAN and GRE header stripping turned off by default. To turn on support for ERSPAN, you'll need to configure your ERSPAN interfaces, and then enable the RCDCAP component to restart your monitoring processes.

ERSPAN support is configured in the **Select erspan monitor interfaces** screen, which appears during your first software installation on the appliance. For example:

:::image type="content" source="../media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

To access this screen later on, sign in to your sensor via SSH as the *cyberx_host* user and run the following command:

```console
sudo dpkg-reconfigure iot-sensor
```

The installation wizard starts to run, and you can select the interfaces you want to receive ERSPAN traffic.

Complete the wizard to apply your changes.

For more information, see [Install OT monitoring software on OT sensors](../how-to-install-software.md).

## Sample configuration on a Cisco switch

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


## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)

