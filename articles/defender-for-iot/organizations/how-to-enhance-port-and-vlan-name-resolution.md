---
title: Enhance port and VLAN name resolution
description: Customize port and VLAN names on your sensors to enrich device resolution.
ms.date: 12/13/2020
ms.topic: how-to
---

# Enhance port, VLAN and OS resolution

You can customize port and VLAN names on your sensors to enrich device resolution.

## Customize port names

Azure Defender for IoT automatically assigns names to most universally reserved ports, such as DHCP or HTTP. You can customize port names for other ports that Defender for IoT detects. For example, assign a name to a non-reserved port because that port shows unusually high activity.

These names appear when:

  - You select **Device groups** from the device map.

  - You create widgets that provide port information.

### View custom port names in the device map

Ports that include a name defined by users appear in the device map, in the **Known Applications** group.

:::image type="content" source="media/how-to-enrich-asset-information/applications-v2.png" alt-text="Screenshot of the device map, showing the Known Applications group.":::

### View custom port names in widgets

Port names that you defined appear in the widgets that cover traffic by port.

:::image type="content" source="media/how-to-enrich-asset-information/traffic-v2.png" alt-text="Cover traffic.":::

To define custom port names:

1. Select **System Settings** and then select **Standard Aliases**.

2. Select **Add Port Alias**.

    :::image type="content" source="media/how-to-enrich-asset-information/edit-aliases.png" alt-text="Add Port Alias.":::

3. Enter the port number, select **TCP/UDP**, or select **Both**, and add the name.

4. Select **Save**.

## Configure VLAN names

You can enrich device inventory data with device VLAN numbers and tags. In addition to data enrichment, you can view the number of devices per VLAN, and view bandwidth by VLAN widgets.

VLANs support is based on 802.1q (up to VLAN ID 4094).

Two methods are available for retrieving VLAN information:

- **Automatically discovered**: By default, the sensor automatically discovers VLANs. VLANs detected with traffic are displayed on the VLAN configuration screen, in data-mining reports, and in other reports that contain VLAN information. Unused VLANs are not displayed. You can't edit or delete these VLANs. 

  You should add a unique name to each VLAN. If you don't add a name, the VLAN number appears in all the locations where the VLAN is reported.

- **Manually added**: You can add VLANs manually. You must add a unique name for each VLAN that was manually added, and you can edit or delete these VLANs.

VLAN names can contain up to 50 ASCII characters.

> [!NOTE]
> VLAN names are not synchronized between the sensor and the management console. You need to define the name on the management console as well.  
For Cisco switches, add the following line to the span configuration: `monitor session 1 destination interface XX/XX encapsulation dot1q`. In that command, *XX/XX* is the name and number of the port.

To configure VLAN names:

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **VLAN**.

    :::image type="content" source="media/how-to-enrich-asset-information/edit-vlan.png" alt-text="Use the system settings to edit your VLANs.":::

3. Add a unique name next to each VLAN ID.

## Improve device operating system classification: data enhancement

Sensors continuously auto discover new devices, as well as changes to previously discovered devices, including operating system types.

Under certain circumstances, conflicts might be detected in discovered operating systems. This can happen, for example, if you have an operating systems version that refers to either desktop or server systems. If it happens, you'll receive a notification with optional operating systems classifications.

:::image type="content" source="media/how-to-enrich-asset-information/enhance-data-screen.png" alt-text="Enhance data.":::

Investigate the recommendations in order to enrich  operating system classification. This classification appears in the device inventory, data-mining reports, and other displays. Making sure this information is up-to-date can improve the accuracy of alerts, threats, and risk analysis reports.

To access operating system recommendations:

1. Select **System Settings**.
1. Select **Data Enhancement**.

## Next steps

View enriched device information in various reports:

- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Sensor trends and statistics reports](how-to-create-trends-and-statistics-reports.md)
- [Sensor data mining queries](how-to-create-data-mining-queries.md)
