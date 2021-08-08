---
title: Configure SPAN for Hyper-V
description: This article explains how to configure SPAN for Hyper-V.
ms.date: 08/08/2021
ms.topic: how-to
---

# Configure Span for Hyper-V

The default behavior of Hyper-V Manager allows port mirroring between VA instances on the same Hyper-V server. Users are not allowed to configure promiscuous mode for a virtual interface on a specific VA instance in order to receive external traffic.

## Prerequisites

- Ensure that there is no instance of ClearPass VA running.

- Enable Ensure SPAN on the data port, and not the management port.

- Ensure that the data port SPAN configuration is not configured with an IP address.

## Create a virtual switch

1. Open the Virtual Switch Manager.

1. In the Virtual Switches list, select **New virtual network switch** > **External** as the dedicated spanned network adapter type.

    :::image type="content" source="organizations/media/how-to-configure-hyperv/new-virtual-network.png" alt-text="Select, new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. Under connection type, select **External Network**.

1. Ensure the checkbox for **Allow management operating system to share this network adapter** is checked.

   :::image type="content" source="organizations/media/how-to-configure-hyperv/external-network.png" alt-text="Select external network, and allow the management operating system to share the network adapter.":::

1. Select **OK**.

## Attach a ClearPass SPAN Virtual Interface to the virtual switch

You are able to attach a ClearPass SPAN Virtual Interface to the Virtual Switch through Windows PowerShell, or through Hyper-V Manager.

**To attach a ClearPass SPAN Virtual Interface to the virtual switch with PowerShell**:

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

**To attach a ClearPass SPAN Virtual Interface to the virtual switch with Hyper-V Manager**:

1. Under the Hardware list, select **Network Adapter**.

1. In the Virtual Switch field, select **vSwitch_Span**.

    :::image type="content" source="organizations/media/how-to-configure-hyperv/vswitch-span.png" alt-text="Select the following options on the virtual switch screen.":::

1. In the Hardware list, under the Network Adapter drop-down list, select **Advanced Features**.

1. In the Port Mirroring section, select **Destination** as the mirroring mode for the new virtual interface.

    :::image type="content" source="organizations/media/how-to-configure-hyperv/destination.png" alt-text="Screenshot of the selections needed to configure mirroring mode.":::

1. Select **OK**.

## Enable Microsoft NDIS Capture Extensions for the Virtual Switch

Microsoft NDIS Capture Extensions will need to be enabled for the new virtual switch.

**To enable Microsoft NDIS Capture Extensions for the newly added virtual switch**:

1. Open the Virtual Switch Manager on the Hyper-V host.

1. In the Virtual Switches list, expand the virtual switch name `vSwitch_Span` and select **Extensions**.

1. In the Switch Extensions field, select **Microsoft NDIS Capture**.

    :::image type="content" source="organizations/media/how-to-configure-hyperv/microsoft-ndis.png" alt-text="enable the Microsoft NDIS by selecting it from the switch extensions menu.":::

1. Select **OK**.

## Set the Mirroring Mode on the external port

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

## Set the Local SPAN in a Cisco Switch

Use the following commands to set the local span on a Cisco switch where you plan to test SPAN:

- Add the source:

    ```bash
    monitor session 1 source interface gigabitEthernet 1/0/1 both
    ```

- Add the destination:

    ```bash
    monitor session 1 destination interface gigabitEthernet 1/0/11
    ```
