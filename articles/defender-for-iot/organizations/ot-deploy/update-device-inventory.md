---
title: Verify and update detected device inventory - Microsoft Defender for IoT
description: Learn how to fine-tune your newly detected device inventory on an OT sensor, such as updating device types and properties, merging devices as needed, and more.
ms.date: 03/09/2023
ms.topic: how-to
---

# Verify and update your detected device inventory

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to review your device inventory and enhance security monitoring with fine-tuned device details.

:::image type="content" source="../media/deployment-paths/progress-fine-tuning-ot-monitoring.png" alt-text="Diagram of a progress bar with Fine-tune OT monitoring highlighted." border="false" lightbox="../media/deployment-paths/progress-fine-tuning-ot-monitoring.png":::

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- An OT sensor [installed](install-software-ot-sensor.md), [activated, and configured](activate-deploy-sensor.md), with device data detected.

- Access to your OT sensor as **Security Analyst** or **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md).

This step is performed by your deployment teams.

## View your device inventory on the Azure portal

1. Sign into your OT sensor and select the **Device inventory** page.

1. Select **Edit Columns** to view additional information in the grid so that you can review the data detected for each device.

    We especially recommend reviewing data for the **Name**, **Class**, **Type**, and **Subtype**, **Authorization**, **Scanner device**, and **Programming device** columns.

1. Understand the devices that the OT sensor's detected, and identify any sensors where you'll need to identify device properties.

## Edit device properties per device

For each device where you need to edit device properties:

1. Select the device in the grid and then select **Edit** to view the editing pane. For example:

    :::image type="content" source="../media/update-device-inventory/edit-device-details.png" alt-text="Screenshot of editing device details from the OT sensor.":::

1. Edit any of the following device properties as needed:

    |Name  |Description  |
    |---------|---------|
    |**Authorized Device**     | Select if the device is a known entity on your network. Defender for IoT doesn't trigger alerts for learned traffic on authorized devices.        |
    |**Name**     | By default, shown as the device's IP address. Update this to a meaningful name for your device as needed.        |
    |**Description**     | Left blank by default. Enter a meaningful description for your device as needed.        |
    |**OS Platform**     |  If the operating system value is blocked for detection, select the device's operating system from the dropdown list.       |
    |**Type**     | If the device's type is blocked for detection or needs to be modified, select a device type from the dropdown list. For more information, see [Supported devices](../device-inventory.md#supported-devices).        |
    |**Purdue Level**     |  If the device's Purdue level is detected as **Undefined** or **Automatic**, we recommend selecting another level to fine-tune your data. For more information, see [Placing OT sensors in your network](../best-practices/understand-network-architecture.md#placing-ot-sensors-in-your-network). |
    |**Scanner**     | Select if your device is a scanning device. Defender for IoT doesn't trigger alerts for scanning activities detected on devices defined as scanning devices.        |
    |**Programming device**     | Select if your device is a programming device. Defender for IoT doesn't trigger alerts for programming activities detected on devices defined as programming devices.        |

1. Select **Save** to save your changes.

## Merge duplicate devices

As you review the devices detected on your device inventory, note whether multiple entries have been detected for the same device on your network.

For example, this might occur when you have a PLC with four network cards, a laptop with both WiFi and a physical network card, or a single workstation with multiple network cards.

Devices with the same IP and MAC addresses are automatically merged, and identified as the same device. We recommend merging any duplicate devices so that each entry in the device inventory represents only one unique device in your network.

> [!IMPORTANT]
> Device merges are irreversible. If you merge devices incorrectly, you'll have to delete the merged device and wait for the sensor to rediscover both devices.
>

To merge multiple devices, select two or more authorized devices in the device inventory and then select **Merge**.

The devices and all their properties are merged in the device inventory. For example, if you merge two devices with different IP addresses, each IP address appears as separate interfaces in the new device.

## Enhance device data (optional)

You may want to increase device visibility and enhance device data with more details than the default data detected.

- To increase device visibility to Windows-based devices, use the Defender for IoT [Windows Management Instrumentation (WMI) tool](../detect-windows-endpoints-script.md).

- If your organization's network policies prevent some data from being ingested, [import the extra data in bulk](../how-to-import-device-information.md).

## Next steps

> [!div class="step-by-step"]
> [« Control what traffic is monitored](../how-to-control-what-traffic-is-monitored.md)

> [!div class="step-by-step"]
> [Create a learned baseline of OT alerts »](create-learned-baseline.md)
