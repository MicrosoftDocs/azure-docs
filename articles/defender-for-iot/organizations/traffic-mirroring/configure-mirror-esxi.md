---
title: Configure a monitoring interface using an ESXi vSwitch - Sample - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---


# Configure traffic mirroring with a ESXi vSwitch

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a SPAN port.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When promiscuous mode is used, any of the virtual machine’s network interfaces that are in the same portgroup can view all network traffic that goes through that virtual switch. By default, promiscuous mode is turned off.

For more information, see [Purdue reference model and Defender for IoT](../best-practices/understand-network-architecture.md#purdue-reference-model-and-defender-for-iot).

**To configure a SPAN port with ESXi**:

1. Open vSwitch properties.

1. Select **Add**.

1. Select **Virtual Machine** > **Next**.

1. Insert a network label **SPAN Network**, select **VLAN ID** > **All**, and then select **Next**.

1. Select **Finish**.

1. Select **SPAN Network** > **Edit*.

1. Select **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK**, and then select **Close** to close the vSwitch properties.

1. Open the **OT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.