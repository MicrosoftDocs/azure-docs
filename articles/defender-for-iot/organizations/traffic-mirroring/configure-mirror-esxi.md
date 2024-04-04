---
title: Configure a monitoring interface using an ESXi vSwitch - Sample - Microsoft Defender for IoT
description: This article describes traffic mirroring methods with an ESXi vSwitch for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: install-set-up-deploy
---


# Configure traffic mirroring with a ESXi vSwitch

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

This article describes how to use *Promiscuous mode* in a ESXi vSwitch environment as a workaround for configuring traffic mirroring, similar to a [SPAN port](configure-mirror-span.md). A SPAN port on your switch mirrors local traffic from interfaces on the switch to a different interface on the same switch.

For more information, see [Traffic mirroring with virtual switches](../best-practices/traffic-mirroring-methods.md#traffic-mirroring-with-virtual-switches).

## Prerequisites

Before you start, make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure.

For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

## Configure a monitoring interface using Promiscuous mode

To configure a monitoring interface with Promiscuous mode on an ESXi v-Switch:

1. Open the vSwitch properties page and select **Add standard virtual switch**.

1. Enter **SPAN Network** as the network label.

1. In the MTU field, enter **4096**.

1. Select **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **Add** to close the vSwitch properties.

1. Highlight the vSwitch you have just created, and select **Add uplink**.

1. Select the physical NIC you will use for the SPAN traffic, change the MTU to **4096**, then select **Save**.

1. Open the **Port Group** properties page and select **Add Port Group**.

1.  Enter **SPAN Port Group** as the name, enter **4095** as the VLAN ID, and select **SPAN Network** in the vSwitch drop down, then select **Add**.

1. Open the **OT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

[!INCLUDE [validate-traffic-mirroring](../includes/validate-traffic-mirroring.md)]

## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)

