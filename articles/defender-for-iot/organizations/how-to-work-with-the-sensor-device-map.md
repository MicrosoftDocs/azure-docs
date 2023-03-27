---
title: Investigate devices in the OT sensor or on-premises management console device map
description: Learn how to use the device map on an OT sensor or an on-premises management console, which provides a graphical representation of devices and the connections between them.
ms.date: 01/25/2023
ms.topic: how-to
---

# Investigate devices on a device map

OT device maps provide a graphic representation of the network devices detected by the OT network sensor and the connections between them.

Use a device map to retrieve, analyze, and manage device information, either all at once or by network segment, such as specific interest groups or Purdue layers. If you're working in an air-gapped environment with an on-premises management console, use a *zone map* to view devices across all connected OT sensors in a specific zone.

## Prerequisites

To perform the procedures in this article, make sure that you have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [activated, and configured](how-to-activate-and-set-up-your-sensor.md), with network traffic ingested

- Access to your OT sensor or on-premises management console. Users with the **Viewer** role can view data on the map. To import or export data or edit the map view, you need access as a **Security Analyst** or **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

To view devices across multiple sensors in a zone, you'll also need an on-premises management console [installed](ot-deploy/install-software-on-premises-management-console.md), [activated, and configured](how-to-activate-and-set-up-your-on-premises-management-console.md), with multiple sensors connected and assigned to sites and zones.

## View devices on OT sensor device map

1. Sign into your OT sensor and select **Device map**. All devices detected by the OT sensor are displayed by default according to [Purdue layer](best-practices/understand-network-architecture.md).

    On the OT sensor's device map:

    - Devices with currently active alerts are highlighted in red
    - Starred devices are those that had been marked as important
    - Devices with no alerts are shown in black, or grey in the zoomed-in connections view

    For example: 

    :::image type="content" source="media/how-to-work-with-maps/device-map-default.png" alt-text="Screenshot of a default view of an OT sensor's device map." lightbox="media/how-to-work-with-maps/device-map-default.png":::

1. Zoom in and select a specific device to view the connections between it and other devices, highlighted in blue.

    When zoomed in, each device shows the following details:

    - The device's host name, IP address, and subnet address, if relevant.
    - The number of currently active alerts on the device.
    - The device type, represented by a various icons.
    - The number of devices grouped in a subnet in an IT network, if relevant. This number of devices is shown in a black circle.
    - Whether the device is newly detected or unauthorized.

1. Right-click a specific device and select **View properties** to drill down further to the **Map View** tab on the device's [device details page](how-to-investigate-sensor-detections-in-a-device-inventory.md#view-the-device-inventory). 

### Modify the OT sensor map display

Use any of the following map tools to modify the data shown and how it's displayed:

|Name  |Description  |
|---------|---------|
|**Refresh map**     | Select to refresh the map with updated data.        |
| **Notifications** | Select to view [device notifications](#manage-device-notifications). |
|**Search by IP / MAC**     | Filter the map to display only devices connected to a specific IP or MAC address.       |
|**Multicast/broadcast**     | Select to edit the filter that shows or hides multicast and broadcast devices.    By default, multicast and broadcast traffic is hidden.      |
|**Add filter**  (Last seen)   | Select to filter devices displayed by those shown in a specific time period, from the last five minutes to the last seven days.       |
|**Reset filters**     |   Select to reset the *Last seen* filter.      |
|**Highlight**     | Select to highlight the devices in a specific [device group](#built-in-device-map-groups). Highlighted devices are shown on the map in blue. <br><br>Use the **Search groups** box to search for device groups to highlight, or expand your group options, and then select the group you want to highlight.       |
|**Filter**     |  Select to filter the map to show only the devices in a specific [device group](#built-in-device-map-groups). <br><br>Use the **Search groups** box to search for device groups, or expand your group options, and then select the group you want to filter by.        |
| **Zoom** <br>:::image type="icon" source="media/how-to-work-with-maps/zoom-in-icon-v2.png" border="false"::: / :::image type="icon" source="media/how-to-work-with-maps/zoom-out-icon-v2.png"  border="false"::: | Zoom in on the map to view the connections between each device, either using the mouse or the **+**/**-** buttons on the right of the map. |
| **Fit to screen** <br>:::image type="icon" source="media/how-to-work-with-maps/fit-to-screen-icon.png" border="false":::    |  Zooms out to fit all devices on the screen      |
|**Fit to selection**<br>:::image type="icon" source="media/how-to-work-with-maps/fit-to-selection-icon.png" border="false":::     |  Zooms out enough to fit all selected devices on the screen      |
|**IT/OT Presentation Options** <br> :::image type="icon" source="media/how-to-work-with-maps/collapse-view-icon.png" border="false":::    |Select **Disable Display IT Networks Groups** to prevent the ability to [collapse subnets](#view-it-subnets-from-an-ot-sensor-device-map) in the map. This option is selected on by default.        |
|**Layout options** <br>:::image type="icon" source="media/how-to-work-with-maps/layouts-icon-v2.png" border="false":::    |  Select one of the following: <br>- **Pin layout**. Select to save device locations if you've dragged them to new places on the map. <br />- **Layout by connection**. Select to view devices organized by their connections. <br />- **Layout by Purdue**. Select to view devices organized by their Purdue layers.        |

To see device details, select a device and expand the device details pane on the right. In a device details pane:

- Select **Activity Report** to jump to the device's [data mining report](how-to-create-data-mining-queries.md)
- Select **Event Timeline** to jump to the device's [event timeline](how-to-track-sensor-activity.md)
- Select **Device Details** to jump to a full [device details page](how-to-investigate-sensor-detections-in-a-device-inventory.md#view-the-device-inventory).


### View IT subnets from an OT sensor device map

By default, IT devices are automatically aggregated by [subnet](how-to-control-what-traffic-is-monitored.md#define-ot-and-iot-subnets), so that the map focuses on your local OT and IoT networks.

**To expand an IT subnet**:

1. Sign into your OT sensor and select **Device map**.
1. Locate your subnet on the map. You might need to zoom in on the map to view a subnet icon, which looks like several machines inside a box. For example: 

    :::image type="content" source="media/how-to-work-with-maps/expand-collapse-subnets.png" alt-text="Screenshot of a subnet device on the device map.":::

1. Right-click the subnet device on the map and **Expand Network**. 

1. In the confirmation message that appears above the map, select **OK**.

**To collapse an IT subnet:**

1. Sign into your OT sensor and select **Device map**. 
1. Select one or more expanded subnets and then select **Collapse All**.


## Create a custom device group

In addition to OT sensor's [built-in device groups](#built-in-device-map-groups), create new custom groups as needed to use when highlighting or filtering devices on the map.

1. Either select **+ Create Custom Group** in the toolbar, or right-click a device in the map and then select **Add to custom group**.

1. In the **Add custom group** pane:

    - In the **Name** field, enter a meaningful name for your group, with up to 30 characters. 
    - From the **Copy from groups** menu, select any groups you want to copy devices from.
    - From the **Devices** menu, select any extra devices to add to your group.

## Import / export device data

Use one of the following options to import and export device data:

- **Import Devices**. Select to import devices from a pre-configured .CSV file.
- **Export Devices**. Select to export all currently displayed devices, with full details, to a .CSV file.
- **Export Device Summary**. Select to export a high level summary of all currently displayed devices to a .CSV file. 


## Edit devices

1. Sign into an OT sensor and select **Device map**. 

1. Right-click a device to open the device options menu, and then select any of the following options:

    |Name  |Description  |
    |---------|---------|
    |**Edit properties**     |   Opens the edit pane where you can edit device properties, such as authorization, name, description, OS platform, device type, Purdue level and if it is a scanner or programming device.     |
    |**View properties**     |    Opens the device's details page.      |
    |**Authorize/Unauthorize**     |    Changes the device's [authorization status](device-inventory.md#unauthorized-devices).     |
    |**Mark as Important / Non-Important**     |    Changes the device's [importance](device-inventory.md#important-ot-devices) status, highlighting business critical servers on the map with a star and elsewhere, including OT sensor reports and the Azure device inventory.     |
    |**Show Alerts** / **Show Events**     |  Opens the **Alerts** or **Event Timeline** tab on the device's details page.   |
    |  **Activity Report**   | Generates an activity report for the device for the selected timespan.        |
    | **Simulate Attack Vectors**    |   Generates an [attack vector simulation](how-to-create-attack-vector-reports.md) for the selected device.      |
    | **Add to custom group**    | Creates a new [custom group](#create-a-custom-device-group) with the selected device.        |
    |  **Delete**   | Deletes the device from the inventory.     |

## Merge devices

You may want to merge devices if the OT sensor detected multiple network entities associated with a unique device, such as a PLC with four network cards, or a single laptop with both WiFi and a physical network card.

You can only merge [authorized devices](device-inventory.md#unauthorized-devices). 

> [!IMPORTANT]
> You can't undo a device merge. If you mistakenly merged two devices, delete the devices and then wait for the sensor to rediscover both.
> 

**To merge multiple devices**:

1. Sign into your OT sensor and select **Device map**.

1. Select the authorized devices you want to merge by using the SHIFT key to select more than one device, and then right-click and select **Merge**. 

The devices are merged, and a confirmation message appears at the top right. Merge events are listed in the OT sensor's event timeline.

## Manage device notifications

As opposed to alerts, which provide details about changes in your traffic that might present a threat to your network, device notifications on an OT sensor device map provide details about network activity that might require your attention, but aren't threats.

For example, you might receive a notification about an inactive device that needs to be reconnected, or removed if it's no longer part of the network.

**To view and handle device notifications**:

1. Sign into the OT sensor and select **Device map** > **Notifications**.

1. In the **Discovery Notifications** pane on the right, filter notifications as needed by time range, device, subnet, or operating systems.

    For example:

    :::image type="content" source="media/how-to-work-with-maps/device-notifications.png" alt-text="Screenshot of device notifications on an OT sensor's Device map page." lightbox="media/how-to-work-with-maps/device-notifications.png":::

1. Each notification may have different mitigation options. Do one of the following:

    - Handle one notification at a time, selecting a specific mitigation action, or selecting **Dismiss** to close the notification with no activity.
    - Select **Select All** to show which notifications can be [handled together](#handling-multiple-notifications-together). Clear selections for specific notifications, and then select **Accept All** or **Dismiss All** to handle any remaining selected notifications together.

> [!NOTE]
> Selected notifications are automatically resolved if they aren't dismissed or otherwise handled within 14 days. For more information, see the action indicated in the **Auto-resolve** column in the table [below](#device-notification-responses).
>

### Handling multiple notifications together

You may have situations where you'd want to handle multiple notifications together, such as:

- IT upgraded the OS across multiple network servers and you want to learn all of the new server versions.

- A group of devices is no longer active, and you want to instruct the OT sensor to remove the devices from the OT sensor.

When you handle multiple notifications together, you may still have remaining notifications that need to be handled manually, such as for new IP addresses or no subnets detected.


### Device notification responses

The following table lists available responses for each notification, and when we recommend using each one:

| Type | Description | Available responses | Auto-resolve|
|--|--|--|--|
| **New IP detected** | A new IP address is associated with the device. This may occur in the following scenarios: <br><br>- A new or additional IP address was associated with a device already detected, with an existing MAC address.<br><br> - A new IP address was detected for a device that's using a NetBIOS name. <br /><br /> - An IP address was detected as the management interface for a device associated with a MAC address. <br /><br /> - A new IP address was detected for a device that's using a virtual IP address. | - **Set Additional IP to Device**: Merge the devices <br />- **Replace Existing IP**: Replaces any existing IP address with the new address <br /> - **Dismiss**: Remove the notification. |**Dismiss** |
| **No subnets configured** | No subnets are currently configured in your network. <br /><br /> We recommend configuring subnets for the ability to differentiate between OT and IT devices on the map. | - **Open Subnets Configuration** and [configure subnets](how-to-control-what-traffic-is-monitored.md#define-ot-and-iot-subnets). <br />- **Dismiss**: Remove the notification. |**Dismiss** |
| **Operating system changes** | One or more new operating systems have been associated with the device. | - Select the name of the new OS that you want to associate with the device.<br /> - **Dismiss**:  Remove the notification. |No automatic handling|
| **New subnets** | New subnets were discovered. |-  **Learn**: Automatically add the subnet.<br />- **Open Subnet Configuration**: Add all missing subnet information.<br />- **Dismiss**<br />Remove the notification. |**Dismiss** |
| **Device type changes** | A new device type has been associated with the device. | - **Set as {…}**: Associate the new type with the device.<br />- **Dismiss**: Remove the notification. |No automatic handling|

## View a device map for a specific zone

If you're working with an on-premises management console with sites and zones configured, device maps are also available for each zone.

On the on-premises management console, zone maps show all network elements related to a selected zone, including OT sensors, detected devices, and more.

**To view a zone map**:

1. Sign into an on-premises management console and select **Site Management** > **View Zone Map** for the zone you want to view. For example:

    :::image type="content" source="media/how-to-work-with-asset-inventory-information/default-region-to-default-business-unit-v2.png" alt-text="Screenshot of default region to default business unit." lightbox="media/how-to-work-with-asset-inventory-information/default-region-to-default-business-unit-v2.png":::

1. Use any of the following map tools to change your map display:

    |Name  |Description  |
    |---------|---------|
    |**Save current arrangement** <br> <br>:::image type="icon" source="media/how-to-work-with-maps/save-zone-map.png" border="false":::   | Saves any changes you've made in the map display.        |
    |**Hide multicast/broadcast addresses**<br><br>:::image type="icon" source="media/how-to-work-with-maps/hide-multi-cast-zone-map.png" border="false":::         |  Selected by default. Select to show multicast and broadcast devices on the map.  |
    |**Present Purdue lines**  <br><br>:::image type="icon" source="media/how-to-work-with-maps/present-purdue-zone-map.png" border="false":::   | Selected by default. Select to hide Purdue lines on the map. |
    |**Relayout** <br> <br>:::image type="icon" source="media/how-to-work-with-maps/relayout-zone-map.png" border="false":::   | Select to reorganize the layout by Purdue lines or by zone.        |
    |**Scale to fit screen** <br><br> :::image type="icon" source="media/how-to-work-with-maps/scale-zone-map.png" border="false":::   | Zooms in or out on the map so that the entire map fits on the screen.        |
    | **Search by IP / MAC** | Select a specific IP or MAC address to highlight the device on the map. |
    | **Change to a different zone map** <br><br>:::image type="icon" source="media/how-to-work-with-maps/change-zone-map.png" border="false"::: | Select to open the **Change Zone Map** dialog, where you can select a different zone map to view. |
    | **Zoom** <br><br>:::image type="icon" source="media/how-to-work-with-maps/zoom-in-icon-v2.png" border="false"::: / :::image type="icon" source="media/how-to-work-with-maps/zoom-out-icon-v2.png"  border="false"::: | Zoom in on the map to view the connections between each device, either using the mouse or the **+**/**-** buttons on the right of the map. |

1. Zoom in to view more details per devices, such as to view the number of devices grouped in a subnet, or to expand a subnet.

1. Right-click a device and select **View properties** to open a **Device Properties** dialog, with more details about the device.

1. Right-click a device shown in red and select **View alerts** to jump to the **Alerts page**, with alerts filtered only for the selected device.


## Built-in device map groups

The following table lists the device groups available out-of-the-box on the OT sensor **Device map** page. [Create extra, custom groups](#create-a-custom-device-group) as needed for your organization.

| Group name | Description |
|--|--|
| **Attack vector simulations** | Vulnerable devices detected in attack vector reports, where the **Show in Device Map** option is [toggled on](how-to-create-attack-vector-reports.md).|
| **Authorization** | Devices that were either discovered during an initial learning period or were later manually marked as *authorized* devices.|
| **Cross subnet connections** | Devices that communicate from one subnet to another subnet. |
| **Device inventory filters** | Any devices based on a [filter](how-to-investigate-sensor-detections-in-a-device-inventory.md) created in the OT sensor's **Device inventory** page. |
| **Known applications** | Devices that use reserved ports, such as TCP.  |
| **Last activity** | Devices grouped by the time frame they were last active, for example: One hour, six hours, one day, or seven days. |
| **Non-standard ports** | Devices that use non-standard ports or ports that haven't been assigned an alias. |
| **Not In Active Directory** | All non-PLC devices that aren't communicating with the Active Directory. |
| **OT protocols** | Devices that handle known OT traffic. |
| **Polling intervals** | Devices grouped by polling intervals. The polling intervals are generated automatically according to cyclic channels or periods. For example, 15.0 seconds, 3.0 seconds, 1.5 seconds, or any other interval. Reviewing this information helps you learn if systems are polling too quickly or slowly. |
| **Programming** | Engineering stations, and programming machines. |
| **Subnets** | Devices that belong to a specific subnet. |
| **VLAN** | Devices associated with a specific VLAN ID. |

## Next steps

For more information, see [Investigate sensor detections in a Device Inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md).

