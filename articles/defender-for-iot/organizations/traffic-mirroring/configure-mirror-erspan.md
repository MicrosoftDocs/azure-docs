---
title: Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN) - Microsoft Defender for IoT
description: This article describes traffic mirroring with ERSPAN for monitoring with Microsoft Defender for IoT.
ms.date: 07/03/2023
ms.topic: install-set-up-deploy
---

# Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN)


<!--need to update for headless installation-->

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

This article provides high-level guidance for configuring [traffic mirroring with ERSPAN](../best-practices/traffic-mirroring-methods.md#erspan-ports). Specific implementation details will vary depending on your equipment vendor.

We recommend using your receiving router as the generic routing encapsulation (GRE) tunnel destination.

## Prerequisites

- Before you start, make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure. 

    For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

- To define ERSPAN settings via the UI, you'll need access to your sensor as an **Admin** user. To define ERSPAN settings via the CLI, you'll need access to your sensor as the *support* user. 

    For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md).
## Configure ERSPAN on your OT network sensor

Newly installed OT network sensors have ERSPAN and GRE header stripping turned off by default. To turn on support for ERSPAN, you'll need to configure your ERSPAN interfaces, and then enable the RCDCAP component to restart your monitoring processes.

ERSPAN support is first configured while configuring your initial system setup. To update your settings later on, do so via the sensor's system settings or CLI.

### Configure ERSPAN support via the GUI

1. Sign into your OT sensor as an **Admin** user, and select **System settings > Interface configurations**.

1. Locate the interface you want to configure with ERSPAN settings and select the **Advanced settings** button.

1. In the **Advanced settings** pane > **Mode** field, select **ERSPAN**.

1. Select **Save** to save your changes.

### Configure ERSPAN support via CLI

To access the Linux wizard **Select erspan monitor interfaces** page:

1. Sign into your sensor via SSH as the *support* user.

1. Run the following command to start the Linux configuration wizard:

    ```console
    sudo dpkg-reconfigure iot-sensor
    ```

The wizard starts to run, and you can select the interfaces you want to receive ERSPAN traffic.

Complete the wizard to apply your changes.

For more information, see [Configure setup via the CLI](../ot-deploy/activate-deploy-sensor.md#configure-setup-via-the-cli). <!--this wizard doesn't display it during initial setup, why would it display it now? i'm confused.-->

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

