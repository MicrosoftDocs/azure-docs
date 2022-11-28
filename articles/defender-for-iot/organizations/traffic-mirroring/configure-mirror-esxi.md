---
title: Configure a monitoring interface using an ESXi vSwitch - Sample - Microsoft Defender for IoT
description: This article describes traffic mirroring methods with an ESXi vSwitch for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---


# Configure traffic mirroring with a ESXi vSwitch

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a monitoring port, similar to a [SPAN port](configure-mirror-span.md). A SPAN port on your switch mirrors local traffic from interfaces on the switch to a different interface on the same switch.

Connect the destination switch to your OT network sensor. Make sure to connect both incoming traffic and OT sensor's monitoring interface to the vSwitch in order start monitoring traffic with Defender for IoT.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When promiscuous mode is used, any of the virtual machine’s network interfaces that are in the same portgroup can view all network traffic that goes through that virtual switch. By default, promiscuous mode is turned off.

## Configure a monitoring interface using Promiscuous mode

To configure a monitoring interface with Promiscuous mode on an ESXi v-Switch:

1. Open the vSwitch properties and select **Add** > **Virtual Machine** > **Next**.

1. Enter **SPAN Network** as the network label.

1. Select **VLAN ID** > **All** > **Next** > **Finish**.

1. Select **SPAN Network** > **Edit** > **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK** > **Close** to close the vSwitch properties.

1. Open the **OT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

## Next steps

For more information, see:

- [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md)
- [OT network sensor VM (VMware ESXi)](../appliance-catalog/virtual-sensor-vmware.md)
- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)
