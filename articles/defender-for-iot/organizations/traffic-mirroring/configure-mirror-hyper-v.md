---
title: Configure a monitoring interface using a Hyper-V vSwitch - Microsoft Defender for IoT
description: This article describes traffic mirroring with a Hyper-V vSwitch for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: install-set-up-deploy
---


# Configure traffic mirroring with a Hyper-V vSwitch

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

This article describes how to use *Promiscuous mode* in a Hyper-V Vswitch environment as a workaround for configuring traffic mirroring, similar to a [SPAN port](configure-mirror-span.md). A SPAN port on your switch mirrors local traffic from interfaces on the switch to a different interface on the same switch.

For more information, see [Traffic mirroring with virtual switches](../best-practices/traffic-mirroring-methods.md#traffic-mirroring-with-virtual-switches).

## Prerequisites

Before you start:

- Make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure.

    For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

- Ensure that there's no instance of a virtual appliance running.

- Make sure that you've enabled *Ensure SPAN* on your virtual switch's data port, and not the management port.

- Ensure that the data port SPAN configuration isn't configured with an IP address.

## Configure a traffic mirroring port with Hyper-V

1. Open the Virtual Switch Manager.

1. In the **Virtual switches** list, select **New virtual network switch** > **External** as the dedicated spanned network adapter type.

    :::image type="content" source="../media/tutorial-install-components/new-virtual-network.png" alt-text="Screenshot of selecting new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. In the **Connection type** area, select **External network** and ensure that the **Allow management operating system to share this network adapter** option is selected. For example:

   :::image type="content" source="../media/tutorial-install-components/external-network.png" alt-text="Screenshot of the External network option.":::

1. Select **OK**.

## Attach a SPAN Virtual Interface to the virtual switch

Use Windows PowerShell or Hyper-V Manager to attach a SPAN virtual interface to the virtual switch you'd [created earlier](#configure-a-traffic-mirroring-port-with-hyper-v).

If you use PowerShell, define the name of the newly added adapter hardware as `Monitor`. If you use Hyper-V Manager, the name of the newly added adapter hardware is set to `Network Adapter`.

### Attach a SPAN virtual interface to the virtual switch with PowerShell

1. Select the newly added SPAN virtual switch you'd configured [earlier](#configure-a-traffic-mirroring-port-with-hyper-v), and run the following command to add a new network adapter:

    ```powershell
    ADD-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 -Name Monitor -SwitchName vSwitch_Span
    ```

1. Enable port mirroring for the selected interface as the span destination with the following command:

    ```powershell
    Get-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 | ? Name -eq Monitor | Set-VMNetworkAdapter -PortMirroring Destination
    ```

    Where:

    | Parameter | Description |
    |--|--|
    |**VK-C1000V-LongRunning-650** | CPPM VA name |
    |**vSwitch_Span** |Newly added SPAN virtual switch name |
    |**Monitor** |Newly added adapter name |

1. When you're done, select **OK**.

### Attach a SPAN virtual interface to the virtual switch with Hyper-V Manager

1. Under the Hyper-V Manager's **Hardware** list, select **Network Adapter**.

1. In the **Virtual switch** field, select **vSwitch_Span**.

    :::image type="content" source="../media/tutorial-install-components/vswitch-span.png" alt-text="Screenshot of selecting the following options on the virtual switch screen.":::

1. In the **Hardware** list, under the **Network Adapter** drop-down list, select **Hardware Acceleration** and clear the **Virtual Machine Queue** option for the monitoring network interface.

1. In the **Hardware** list, under the **Network Adapter** drop-down list, select **Advanced Features**. Under the **Port Mirroring** section, select **Destination** as the mirroring mode for the new virtual interface.

    :::image type="content" source="../media/tutorial-install-components/destination.png" alt-text="Screenshot of the selections needed to configure mirroring mode.":::

1. Select **OK**.

## Turn on Microsoft NDIS capture extensions

Turn on support for [Microsoft NDIS Capture Extensions](/windows-hardware/drivers/network/capturing-extensions) for the virtual switch you'd [created earlier](#configure-a-traffic-mirroring-port-with-hyper-v).

**To enable Microsoft NDIS capture extensions for your new virtual switch**:

1. Open the Virtual Switch Manager on the Hyper-V host.

1. In the Virtual Switches list, expand the virtual switch name `vSwitch_Span` and select **Extensions**.

1. In the Switch Extensions field, select **Microsoft NDIS Capture**.

    :::image type="content" source="../media/tutorial-install-components/microsoft-ndis.png" alt-text="Screenshot of enabling the Microsoft NDIS by selecting it from the switch extensions menu.":::

1. Select **OK**.

## Configure the switch's mirroring mode

Configure the mirroring mode on the virtual switch you'd [created earlier](#configure-a-traffic-mirroring-port-with-hyper-v) so that the external port is defined as the mirroring source. This includes configuring the Hyper-V virtual switch (vSwitch_Span) to forward any traffic that comes to the external source port to a virtual network adapter configured as the destination.

To set the virtual switch's external port as the source mirror mode, run:

```PowerShell
$ExtPortFeature=Get-VMSystemSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings"
$ExtPortFeature.SettingData.MonitorMode=2
Add-VMSwitchExtensionPortFeature -ExternalPort -SwitchName vSwitch_Span -VMSwitchExtensionFeature $ExtPortFeature
```

Where:

| Parameter | Description |
|--|--|
|**vSwitch_Span** | Name of the virtual switch you'd [created earlier](#configure-a-traffic-mirroring-port-with-hyper-v) |
|**MonitorMode=2** | Source |
|**MonitorMode=1** | Destination |
|**MonitorMode=0** | None |

To verify the monitoring mode status, run:

```PowerShell
Get-VMSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings" -SwitchName vSwitch_Span -ExternalPort | select -ExpandProperty SettingData
```

| Parameter | Description |
|--|--|
|**vSwitch_Span** | Newly added SPAN virtual switch name |

[!INCLUDE [validate-traffic-mirroring](../includes/validate-traffic-mirroring.md)]

## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)
