---
title: OT sensor VM (Microsoft Hyper-V) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT OT sensor as a virtual appliance using Microsoft Hyper-V.
ms.date: 04/24/2022
ms.topic: reference
---

# OT sensor VM (Microsoft Hyper-V)

This article describes an OT sensor deployment on a virtual appliance using Microsoft Hyper-V.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | 	As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |


### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational

- Available hardware resources for the virtual machine

- ISO installation file for the Microsoft Defender for IoT sensor

Make sure the hypervisor is running.

### Create the virtual machine (Hyper-V)

This procedure describes how to create a virtual machine by using Hyper-V.

**To create the virtual machine using Hyper-V**:

1. Create a virtual disk in Hyper-V Manager.

1. Select **format = VHDX**.

1. Select **type = Dynamic Expanding**.

1. Enter the name and location for the VHD.

1. Enter the required size (according to the architecture).

1. Review the summary, and select **Finish**.

1. On the **Actions** menu, create a new virtual machine.

1. Enter a name for the virtual machine.

1. Select **Specify Generation** > **Generation 1**.

1. Specify the memory allocation (according to the architecture), and select the check box for dynamic memory.

1. Configure the network adaptor according to your server network topology.

1. Connect the VHDX created previously to the virtual machine.

1. Review the summary, and select **Finish**.

1. Right-click on the new virtual machine, and select **Settings**.

1. Select **Add Hardware**, and add a new network adapter.

1. Select the virtual switch that will connect to the sensor management network.

1. Allocate CPU resources (according to the architecture).

1. Connect the management console's ISO image to a virtual DVD drive.

1. Start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

### Software installation 

This section describes the ESXi software installation.

To install:

1. Open the virtual machine console.

1. The VM will start from the ISO image, and the language selection screen will appear.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Install the software](#install-defender-for-iot-software).

## Install Defender for IoT software

Ensure you followed the installation instruction for your device prior to starting the software installation, and have downloaded the containerized sensor version ISO file.

Mount the ISO file using one of the following options;

- Physical media – burn the ISO file to a DVD, or USB, and boot from the media.  

- Virtual mount – use iLO for HPE, or iDRAC for Dell to boot the iso file.

> [!Note]
> At the end of this process you will be presented with the usernames, and passwords for your device. Make sure to copy these down as these passwords will not be presented again.
**To install the sensor's software**:

1. Select the installation language.

    :::image type="content" source="media/tutorial-install-components/language-select.png" alt-text="Screenshot of the sensor's language select screen.":::

1. Select the sensor's architecture.

    :::image type="content" source="media/tutorial-install-components/sensor-architecture.png" alt-text="Screenshot of the sensor's architecture select screen.":::

1. The Sensor will reboot, and the Package configuration screen will appear. Press the up, or down arrows to navigate, and the Space bar to select an option. Press the Enter key to advance to the next screen.  

1. Select the monitor interface, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen.":::

1. If one of the monitoring ports is for ERSPAN, select it, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

1. Select the interface to be used as the management interface, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::

1. Enter the sensor's IP address, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/sensor-ip-address.png" alt-text="Screenshot of the sensor IP address screen.":::

1. Enter the path of the mounted logs folder. We recommend using the default path, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/mounted-backups-path.png" alt-text="Screenshot of the mounted backup path screen.":::

1. Enter the Subnet Mask IP address, and press the **Enter** key.

1. Enter the default gateway IP address, and press the **Enter** key.

1. Enter the DNS Server IP address, and press the **Enter** key.

1. Enter the sensor hostname, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/sensor-hostname.png" alt-text="Screenshot of the screen where you enter a hostname for your sensor.":::

1. The installation process runs.

1. When the installation process completes, save the appliance ID, and passwords. Copy these credentials to a safe place as you'll need them to access the platform the first time you use it.

    :::image type="content" source="media/tutorial-install-components/login-information.png" alt-text="Screenshot of the final screen of the installation with usernames, and passwords.":::
    
## Configure a SPAN port

A virtual switch does not have mirroring capabilities. However, you can use promiscuous mode in a virtual switch environment. Promiscuous mode  is a mode of operation, and a security, monitoring and administration technique, that is defined at the virtual switch, or portgroup level. By default, Promiscuous mode is disabled. When Promiscuous mode is enabled the virtual machine’s network interfaces that are in the same portgroup will use the Promiscuous mode to view all network traffic that goes through that virtual switch. You can implement a workaround with either ESXi, or Hyper-V.

:::image type="content" source="media/tutorial-install-components/purdue-model.png" alt-text="A screenshot of where in your architecture the sensor should be placed.":::

### Configure a SPAN port with Hyper-V

Prior to starting you will need to:

- Ensure that there is no instance of a virtual appliance running.

- Enable Ensure SPAN on the data port, and not the management port.

- Ensure that the data port SPAN configuration is not configured with an IP address.

**To configure a SPAN port with Hyper-V**:

1. Open the Virtual Switch Manager.

1. In the Virtual Switches list, select **New virtual network switch** > **External** as the dedicated spanned network adapter type.

    :::image type="content" source="media/tutorial-install-components/new-virtual-network.png" alt-text="Screenshot of selecting new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. Under connection type, select **External Network**.

1. Ensure the checkbox for **Allow management operating system to share this network adapter** is checked.

   :::image type="content" source="media/tutorial-install-components/external-network.png" alt-text="Select external network, and allow the management operating system to share the network adapter.":::

1. Select **OK**.

#### Attach a SPAN Virtual Interface to the virtual switch

You are able to attach a SPAN Virtual Interface to the Virtual Switch through Windows PowerShell, or through Hyper-V Manager.

**To attach a SPAN Virtual Interface to the virtual switch with PowerShell**:

1. Select the newly added SPAN virtual switch, and add a new network adapter with the following command:

    ```bash
    ADD-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 -Name Monitor -SwitchName vSwitch_Span
    ```

1. Enable port mirroring for the selected interface as the span destination with the following command:

    ```bash
    Get-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 | ? Name -eq Monitor | Set-VMNetworkAdapter -PortMirroring Destination
    ```

    | Parameter | Description |
    |--|--|
    | VK-C1000V-LongRunning-650 | CPPM VA name |
    |vSwitch_Span |Newly added SPAN virtual switch name |
    |Monitor |Newly added adapter name |

1. Select **OK**.

These commands set the name of the newly added adapter hardware to be `Monitor`. If you are using Hyper-V Manager, the name of the newly added adapter hardware is set to `Network Adapter`.

**To attach a SPAN Virtual Interface to the virtual switch with Hyper-V Manager**:

1. Under the Hardware list, select **Network Adapter**.

1. In the Virtual Switch field, select **vSwitch_Span**.

    :::image type="content" source="media/tutorial-install-components/vswitch-span.png" alt-text="Screenshot of selecting the following options on the virtual switch screen.":::

1. In the Hardware list, under the Network Adapter drop-down list, select **Advanced Features**.

1. In the Port Mirroring section, select **Destination** as the mirroring mode for the new virtual interface.

    :::image type="content" source="media/tutorial-install-components/destination.png" alt-text="Screenshot of the selections needed to configure mirroring mode.":::

1. Select **OK**.

#### Enable Microsoft NDIS capture extensions for the virtual switch

Microsoft NDIS Capture Extensions will need to be enabled for the new virtual switch.

**To enable Microsoft NDIS capture extensions for the newly added virtual switch**:

1. Open the Virtual Switch Manager on the Hyper-V host.

1. In the Virtual Switches list, expand the virtual switch name `vSwitch_Span` and select **Extensions**.

1. In the Switch Extensions field, select **Microsoft NDIS Capture**.

    :::image type="content" source="media/tutorial-install-components/microsoft-ndis.png" alt-text="Screenshot of enabling the Microsoft NDIS by selecting it from the switch extensions menu.":::

1. Select **OK**.

#### Set the Mirroring Mode on the external port

Mirroring mode will need to be set on the external port of the new virtual switch to be the source.

You will need to configure the Hyper-V virtual switch (vSwitch_Span) to forward any traffic that comes to the external source port, to the virtual network adapter that you configured as the destination.

Use the following PowerShell commands to set the external virtual switch port to source mirror mode:

```bash
$ExtPortFeature=Get-VMSystemSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings"
$ExtPortFeature.SettingData.MonitorMode=2
Add-VMSwitchExtensionPortFeature -ExternalPort -SwitchName vSwitch_Span -VMSwitchExtensionFeature $ExtPortFeature
```

| Parameter | Description |
|--|--|
| vSwitch_Span | Newly added SPAN virtual switch name. |
| MonitorMode=2 | Source |
| MonitorMode=1 | Destination |
| MonitorMode=0 | None |

Use the following PowerShell command to verify the monitoring mode status:

```bash
Get-VMSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings" -SwitchName vSwitch_Span -ExternalPort | select -ExpandProperty SettingData
```
| Parameter | Description |
|--|--|
| vSwitch_Span | Newly added SPAN virtual switch name |


## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](../how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](../how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](../how-to-install-software.md)
