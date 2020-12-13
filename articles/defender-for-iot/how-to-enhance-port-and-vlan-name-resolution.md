---
title: Enhance port and VLAN names resolution
description: Customize port and VLAN names on your sensors to enrich device resolution.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/13/2020
ms.topic: how-to
ms.service: azure
---

# Enhance port and VLAN names resolution

## Customize port names

Defender for IoT automatically assigns names to most universally reserved ports. For example, DHCP or HTTP. You can customize port names for other ports detected.

For example, assign a name to a non-reserved port because that port shows unusually high activity.

These names appear when:

  - Selecting **Device groups** from the **Device Map**.

  - Creating widgets that provide port information.

### View custom port names in the Device Map

Ports that include a name defined by users appear in the **Device Map** in the **Known Applications** group.

:::image type="content" source="media/how-to-enrich-asset-information/applications-v2.png" alt-text="Screenshot of the Device Map showing the Known Applications.":::

### View custom port names in widgets

Port names you defined appear in the widgets that cover traffic by port.

:::image type="content" source="media/how-to-enrich-asset-information/traffic-v2.png" alt-text="cover traffic":::

To define custom port names:

1. Select **System Settings** and then select **Standard Aliases.**

2. Select **Add Port Alias**.

    :::image type="content" source="media/how-to-enrich-asset-information/edit-aliases.png" alt-text="Add Port Alias":::

3. Enter the port number, **TCP/UDP** or **Both** and add the name.

4. Select **Save.**

## Configure VLAN names

You can enrich Device Inventory data with device VLAN numbers and tags. In addition to data enrichment, you can view the number of devices per VLAN, and bandwidth by VLAN widgets.

VLANs support is based on 802.1q (up to VLAN ID 4094).

Two methods are available for retrieving VLAN information:

  - **Automatically discovered:** By default, VLANs are automatically discovered by the sensor. VLANs detected with traffic are displayed in the VLAN configuration screen and in Data Mining and other reports that contain VLAN information. Unused VLANs are not displayed. You cannot edit or delete these VLANs. You should add a unique name to each VLAN. If a name is not added, the VLAN number appears in all the locations where the VLAN is reported.

  - **Manually added:** You can add VLANs manually. You must add a unique name for each VLAN that was manually added, and you can edit or delete these VLANs.

VLAN names can contain up to 50 ASCII characters.

> [!NOTE]
> VLAN names are not synchronized between the sensor and the management console. You need to define the name on the management console as well.  
For Cisco switches, the following line should be added to the span configuration:  
`monitor session 1 destination interface XX/XX encapsulation dot1q.`  
where XX/XX is the name and number of the port.

To configure VLANs:

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **VLAN**.

    :::image type="content" source="media/how-to-enrich-asset-information/edit-vlan.png" alt-text="Use the system settings to edit your VLANs.":::

3. Add a unique name next to each VLAN ID.

## Next step

View enriched device information in the Device Inventory and Data Mining reports.

[Investigate sensor detections in a Device Inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
[Generate reports](how-to-generate-reports.md)
