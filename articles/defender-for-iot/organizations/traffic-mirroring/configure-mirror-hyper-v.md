---
title: Configure a monitoring interface using a Hyper-V vSwitch - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---


# Configure traffic mirroring with a Hyper-V vSwitch

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a SPAN port.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When promiscuous mode is used, any of the virtual machine’s network interfaces in the same portgroup can view all network traffic that goes through that virtual switch. By default, promiscuous mode is turned off.

For more information, see [Purdue reference model and Defender for IoT](../best-practices/understand-network-architecture.md#purdue-reference-model-and-defender-for-iot).

## Prerequisites

Before you start:

- Ensure that there's no instance of a virtual appliance running.

- Enable Ensure SPAN on the data port, and not the management port.

- Ensure that the data port SPAN configuration is not configured with an IP address.

## Configure a SPAN port with Hyper-V

1. Open the Virtual Switch Manager.

1. In the Virtual Switches list, select **New virtual network switch** > **External** as the dedicated spanned network adapter type.

    :::image type="content" source="../media/tutorial-install-components/new-virtual-network.png" alt-text="Screenshot of selecting new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. Under connection type, select **External Network**.

1. Ensure the checkbox for **Allow management operating system to share this network adapter** is checked.

   :::image type="content" source="../media/tutorial-install-components/external-network.png" alt-text="Select external network, and allow the management operating system to share the network adapter.":::

1. Select **OK**.

### Attach a SPAN Virtual Interface to the virtual switch

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
    |**VK-C1000V-LongRunning-650** | CPPM VA name |
    |**vSwitch_Span** |Newly added SPAN virtual switch name |
    |**Monitor** |Newly added adapter name |

1. Select **OK**.

These commands set the name of the newly added adapter hardware to be `Monitor`. If you're using Hyper-V Manager, the name of the newly added adapter hardware is set to `Network Adapter`.

**To attach a SPAN Virtual Interface to the virtual switch with Hyper-V Manager**:

1. Under the Hardware list, select **Network Adapter**.

1. In the Virtual Switch field, select **vSwitch_Span**.

    :::image type="content" source="../media/tutorial-install-components/vswitch-span.png" alt-text="Screenshot of selecting the following options on the virtual switch screen.":::

1. In the Hardware list, under the Network Adapter drop-down list, select **Hardware Acceleration** and disable "Virtual Machine Queue" for the monitoring (SPAN) network interface.

1. In the Hardware list, under the Network Adapter drop-down list, select **Advanced Features**. Under the Port Mirroring section, select **Destination** as the mirroring mode for the new virtual interface.

    :::image type="content" source="../media/tutorial-install-components/destination.png" alt-text="Screenshot of the selections needed to configure mirroring mode.":::

1. Select **OK**.

### Enable Microsoft NDIS capture extensions for the virtual switch

Microsoft NDIS Capture Extensions will need to be enabled for the new virtual switch.

**To enable Microsoft NDIS capture extensions for the newly added virtual switch**:

1. Open the Virtual Switch Manager on the Hyper-V host.

1. In the Virtual Switches list, expand the virtual switch name `vSwitch_Span` and select **Extensions**.

1. In the Switch Extensions field, select **Microsoft NDIS Capture**.

    :::image type="content" source="../media/tutorial-install-components/microsoft-ndis.png" alt-text="Screenshot of enabling the Microsoft NDIS by selecting it from the switch extensions menu.":::

1. Select **OK**.

### Set the Mirroring Mode on the external port

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
|**vSwitch_Span** | Newly added SPAN virtual switch name. |
|**MonitorMode=2** | Source |
|**MonitorMode=1** | Destination |
|**MonitorMode=0** | None |

Use the following PowerShell command to verify the monitoring mode status:

```bash
Get-VMSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings" -SwitchName vSwitch_Span -ExternalPort | select -ExpandProperty SettingData
```
| Parameter | Description |
|--|--|
|**vSwitch_Span** | Newly added SPAN virtual switch name |

## Next steps