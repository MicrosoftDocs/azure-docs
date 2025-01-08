---
title: Configure ERSPAN traffic mirroring with a Cisco switch - Microsoft Defender for IoT
description: This article describes how to configure the Cisco switch for encapsulated remote switched port analyzer (ERSPAN) traffic mirroring for Microsoft Defender for IoT.
ms.date: 05/26/2024
ms.topic: install-set-up-deploy
---

# Configure ERSPAN (legacy) traffic mirroring with a Cisco switch

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

## Configure legacy ERSPAN in the CLI

> [!IMPORTANT]
>
> We don't recommend using legacy versions of the software as this might cause security issues for your system. If you're still using the legacy version the user needs to run specific CLI commands discussed in this section.
>

## Configure setup via the CLI

Use this procedure to configure the following initial setup settings via CLI:

- Signing into the sensor console and setting a new *admin* user password
- Defining network details for your sensor
- Defining the interfaces you want to monitor

### CLI Legacy

To configure a legacy ERSPAN tunneling interface in the CLI you need to use an adapted line of code. This code ensures that the legacy ERSPAN option is available in the CLI sensor configuration wizard.

A new legacy ERPSAN can only be configured if you have an existing interface configured.

**To configure the legacy ERSPAN**:

1. Log in to your sensor using a CLI interface with a cyberx or admin user.
1. Type `ERSPAN=1 python3 -m cyberx.config.configure`.

    :::image type="content" source="media/configure-mirror-erspan/legacy-erspan-cli.png" alt-text="Screenshot of the CLI sensor configuration for a legacy version interface.":::

1. Select **LegacyErspan** and assign an interface.
1. Select **Save**.

## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)
