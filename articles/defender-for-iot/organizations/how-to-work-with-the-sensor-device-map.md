---
title: Work with the sensor device map
description: The Device map provides a graphical representation of network devices detected. Use the map to analyze, and manage device information, network slices and generate reports.
ms.date: 02/02/2022
ms.topic: how-to
---

# Investigate sensor detections in the Device map

The Device map provides a graphical representation of network devices detected, and the connections between them. Use the map to:

  - Retrieve, analyze, and manage device information.

  - Analyze network slices, for example-specific groups of interest or Purdue layers.

  - Generate reports, for example export device details and summaries.

:::image type="content" source="media/how-to-work-with-maps/device-map-v2.png" alt-text="Screenshot of the device map." lightbox="media/how-to-work-with-maps/device-map-v2.png":::

**To access the map:**

- Select **Device map** from the console main screen.


## Map search and layout tools

A variety of map tools help you gain insight into devices and connections of interest to you.  
- [Basic search tools](#basic-search-tools)
- [Group highlight and filters tools](#group-highlight-and-filters-tools)
- [Map display tools](#map-display-tools)

Your user role determines which tools are available in the Device Map window. See [Create and manage users](how-to-create-and-manage-users.md) for details about user roles.

### Basic search tools

The following basic search tools are available:
- Search by IP or MAC address
- Multicast or broadcast traffic
- Last seen: Filter the devices on the map according to the time they last communicated with other devices.

    :::image type="icon" source="media/how-to-work-with-maps/search-bar-icon-v2.png" border="false":::

When you search by IP or MAC address, the map displays the device that you searched for with the devices connected to it.

:::image type="content" source="media/how-to-work-with-maps/search-ip-entered.png" alt-text="Screenshot of an I P address entered in the Device map search and displayed in the map.":::

### Group highlight and filters tools

Filter or highlight the map based on default and custom device groups.

- Filtering omits the devices that aren't in the selected group.
- Highlights display all devices and highlights the selected items in the group in blue.

     :::image type="content" source="media/how-to-work-with-maps/group-highlight-and-filters-v2.png" alt-text="Screenshot of the group highlights and filters."::: 

**To highlight or filter devices:**

1. Select **Device map** on the side menu.

1. From the Groups pane, select the group you want to highlight or filter.

1. Toggle the **Highlight** or **Filter** option. 
The following predefined groups are available:

| Group name | Description |
|--|--|
| **Known applications** | Devices that use reserved ports, such as TCP.  |
| **non-standard ports (default)** | Devices that use non-standard ports or ports that haven't been assigned an alias. |
| **OT protocols (default)** | Devices that handle known OT traffic. |
| **Authorization (default)** | Devices that were discovered in the network during the learning process or were officially authorized on the network. |
| **Device inventory filters** | Devices grouped according to the filters saved in the Device Inventory table. |
| **Polling intervals** | Devices grouped by polling intervals. The polling intervals are generated automatically according to cyclic channels or periods. For example, 15.0 seconds, 3.0 seconds, 1.5 seconds, or any other interval. Reviewing this information helps you learn if systems are polling too quickly or slowly. |
| **Programming** | Engineering stations, and programming machines. |
| **Subnets** | Devices that belong to a specific subnet. |
| **VLAN** | Devices associated with a specific VLAN ID. |
| **Cross subnet connections** | Devices that communicate from one subnet to another subnet. |
| **Attack vector simulations** | Vulnerable devices detected in attack vector reports. To view these devices on the map, select the **Display on Device Map** checkbox when generating the Attack Vector. :::image type="content" source="media/how-to-work-with-maps/add-attack-v3.png" alt-text="Screenshot of the Add Attack Vector Simulations":::|
| **Last seen** | Devices grouped by the time frame they were last seen, for example: One hour, six hours, one day, or seven days. |
| **Not In Active Directory** | All non-PLC devices that aren't communicating with the Active Directory. |

For information about creating custom groups, see [Define custom groups](#define-custom-groups).

### View filtered information as a map group

You can display devices from saved filters in the Device map. For more information, see [View the device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md#view-the-device-inventory).

**To view devices in the map:**

1. After creating and saving an Inventory filter, navigate to the Device map.
1. In the map page, open the Groups pane on the left.
1. Scroll down to the **Asset Inventory Filters** group.  The groups you saved from the Inventory appear.

### Map display tools

| Icon | Description |
|--|--|
| :::image type="icon" source="media/how-to-work-with-maps/fit-to-screen-icon.png" border="false"::: | Fit to screen. |
| :::image type="icon" source="media/how-to-work-with-maps/fit-to-selection-icon.png" border="false"::: | Fits a group of selected devices to the center of the screen. |
| :::image type="icon" source="media/how-to-work-with-maps/collapse-view-icon.png" border="false"::: | IT/OT presentation. Collapse view to enable a focused view on OT devices, and group IT devices.  |
|:::image type="icon" source="media/how-to-work-with-maps/layouts-icon-v2.png" border="false"::: | Layout options, including: <br />**Pin layout**. Drag devices on the map to a new location. Use the Pin option to save those locations when you leave the map to use another option.  <br />**Layout by connection**. View connections between devices. <br />**Layout by Purdue**. View the devices in the map according to Enterprise, supervisory and process control layers. <br /> |
| :::image type="icon" source="media/how-to-work-with-maps/zoom-in-icon-v2.png" border="false"::: :::image type="icon" source="media/how-to-work-with-maps/zoom-out-icon-v2.png"  border="false"::: | Zoom in or out of the map. |


### Map zoom views

Working with map views helps expedite forensics when analyzing large networks. Map views include the following options:

  - [Bird’s-eye view](#birds-eye-view)

  - [Device type and connection view](#device-type-and-connection-view)


### Bird’s-eye view

This view provides an at-a-glance view of devices represented as follows:

  - Red dots indicate devices with alert(s)

  - Starred dots indicate devices marked as important

  - Black dots indicate devices with no alerts

    :::image type="content" source="media/how-to-work-with-maps/colored-dots-v2.png" alt-text="Screenshot of a bird eye view of the map." lightbox="media/how-to-work-with-maps/colored-dots-v2.png":::

### Device type and connection view 

This view presents devices represented as icons on the map.

  - Devices with alerts are displayed with a red ring

  - Devices without alerts are displayed with a grey ring

  - Devices displayed as a star were marked as important

Overall connections are displayed.

:::image type="content" source="media/how-to-work-with-maps/colored-rings.png" alt-text="Screenshot of the connection view." lightbox="media/how-to-work-with-maps/colored-rings.png" :::

**To view specific connections:**

1. Select a device in the map.
1. Specific connections between devices are displayed in blue. In addition, you'll see connections that cross various Purdue levels.

    :::image type="content" source="media/how-to-work-with-maps/connections-purdue-level.png" alt-text="Screenshot of the detailed map view." lightbox="media/how-to-work-with-maps/connections-purdue-level.png" :::

### View IT subnets

By default, IT devices are automatically aggregated by subnet, so that the map view is focused on OT and ICS networks. The presentation of the IT network elements is collapsed to a minimum which reduces the total number of the devices presented on the map, and provides a clear picture of the OT and ICS network elements.

Each subnet is presented as a single entity on the Device map. Options are available to expand subnets to see details, collapse subnets or hide them.

**To expand an IT subnet:**
1. Right-click the icon on the map that represents the IT network and select **Expand Network**.
1. A confirmation box appears, notifying you that the layout change can't be redone.
1. Select **OK**. The IT subnet elements appear on the map.

**To collapse an IT subnet:**

1. From the left pane, select **Devices**.

2. Select the expanded subnet. The number in red indicates how many expanded IT subnets currently appear on the map.

3. Select the subnet(s) that you want to collapse or select **Collapse All**. The selected subnet appears collapsed on the map.

The collapse icon is updated with the updated number of collapsed IT subnets.

**To disable the option to collapse and expand IT subnets:**
1. Select the **Disable Display IT Network Groups**. 
1. Select Confirm the dialog box that opens.
This option is available to Administrator users.

> [!NOTE]
   > For information on updating default OT IT networks, see [Configure subnets](how-to-control-what-traffic-is-monitored.md#configure-subnets).

## Define custom groups

In addition to viewing predefined groups, you can define custom groups. The groups appear in the Device map, Device inventory, and Data Mining Reports.

> [!NOTE]
> You can also create groups from the Device Inventory.

**To create a group:**

1. Select **Create Custom Group** from the Device map.

1. In the Add custom group dialog box, add the name of the group. Use up to 30 characters. 

1. Select an existing group(s) or choose specific device(s).

1. Select **Submit**. 

**To add devices to a custom group**:

1. Right-click a device(s) on the map.

1. Select **Add to custom group**.

1. Select an existing group(s) or choose specific device(s). 

1. Select **Submit**. 

## Learn more about devices 

An extensive range of tools are available to learn more about devices from the Device map, including:

- [Device labels and indicators](#device-labels-and-indicators)

- [Device details](#device-details)

- [Device types](#device-types)

- [Backplane properties](#backplane-properties)


### Device labels and indicators

The following labels and indicators may appear on devices on the map:

| Device label | Description |
|--|--|
| :::image type="content" source="media/how-to-work-with-maps/host-v2.png" alt-text="Screenshot of the I P host name."::: | IP address host name and IP address, or subnet addresses |
| :::image type="content" source="media/how-to-work-with-maps/amount-alerts-v2.png" alt-text="Screenshot of the number of alerts"::: | Number of alerts associated with the device |
| :::image type="icon" source="media/how-to-work-with-maps/type-v2.png" border="false"::: | Device type icon, for example storage, PLC or historian. |
| :::image type="content" source="media/how-to-work-with-maps/grouped-v2.png" alt-text="Screenshot of devices grouped together."::: | Number of devices grouped in a subnet in an IT network. In this example 8. |
| :::image type="content" source="media/how-to-work-with-maps/not-authorized-v2.png" alt-text="Screenshot of the device learning period"::: | A device that was detected after the Learning period and wasn't authorized as a network device. |
| Solid line | Logical connection between devices |
| :::image type="content" source="media/how-to-work-with-maps/new-v2.png" alt-text="Screenshot of a new device discovered after learning is complete."::: | New device discovered after Learning is complete. |

### Device details and contextual information

You can access detailed and contextual information  about a device from the map, for example:
- Device properties, such as the device type, protocols detected, or Purdue level associated with the device. 
- Backplane properties. 
- Contextual information such as open alerts associated with the device.

**To view details:**
1. Right-click a device on the map.
1. Select **View properties**. 
1. Navigate to the information you need.

 :::image type="content" source="media/how-to-work-with-maps/device-details-from-map.png" alt-text="Screenshot of the device details shown for the device selected in map.":::

#### Device details

This section describes device details.

| Item | Description |
|--|--|
| Name | The device name. <br /> By default, the sensor discovers the device name as it's defined in the network. For example, a name defined in the DNS server. <br /> If no such names were defined, the device IP address appears in this field. <br /> You can change a device name manually. Give your devices meaningful names that reflect their functionality. |
| Authorized status | Indicates if the device is authorized or not. During the Learning period, all the devices discovered in the network are identified as Authorized. When a device is discovered after the Learning period, it appears as Unauthorized by default. You can change this definition manually. For information on this status and manually authorizing and unauthorizing, see [Authorize and unauthorize devices](#authorize-and-unauthorize-devices). |
| Last seen | The last time the device was detected. |
| Alert | The number of open alerts associated with the device. |
| Type | The device type as detected by the sensor. |
| Vendor | The device vendor. This is determined by the leading characters of the device MAC address. This field is read-only. |
| Operating System | The device OS detected by the sensor. |
| Location | The Purdue layer identified by the sensor for this device, including: <br /> - Automatic <br /> - Process Control <br /> - Supervisory <br /> - Enterprise |
| Description | A free text field. <br /> Add more information about the device. |
| Attributes | Additional information  was discovered on the device. For example, view the PLC Run and Key state, the secure status of the PLC, or information on when the state changed.  <br /> The information is read only and can't be updated from the Attributes section. |
| Scanner or Programming device | **Scanner**: Enable this option if you know that this device is known as a scanner and there's no need to alert you about it. <br /> **Programming Device**: Enable this option if you know that this device is known as a programming device and is used to make programming changes. Identifying it as a programming device will prevent alerts for programming changes originating from this asset. |
| Network Interfaces | The device interfaces. A RO field. |
| Protocols | The protocols used by the device. A RO field. |
| Firmware | If Backplane information is available, firmware information won't be displayed. |
| Address | The device IP address. |
| Serial | The device serial number. |
| Module Address | The device model and slot number or ID. |
| Model | The device model number. |
| Firmware Version | The firmware version number. |

#### Contextual information

 View contextual information about the device.

**To view:**
1. Select **Map View** to see device connections to other devices.
1. Select **Alerts** to see details about alerts associated with the device.
1. Select **Event Timeline** to review events that occurred around the time of the detection. 

#### Backplane properties

If a PLC contains multiple modules separated into racks and slots, the characteristics might vary between the module cards. For example, if the IP address and the MAC address are the same, the firmware might be different.

You can use the Backplane option to review multiple controllers/cards and their nested devices as one entity with various  definitions. Each slot in the Backplane view represents the underlying devices – the devices that were discovered behind it.

:::image type="content" source="media/how-to-work-with-maps/backplane-image-v2.png" alt-text="Screenshot of the Backplane Properties pane.":::

:::image type="content" source="media/how-to-work-with-maps/backplane-details-v2.png" alt-text="Screenshot of the Backplane Device Properties pane.":::

A Backplane can contain up to 30 controller cards and up to 30 rack units. The total number of devices included in the multiple levels can be up to 200 devices.

The Backplane pane is shown in the Device Properties window when Backplane details are detected.

Each slot appears with the number of underlying devices and the icon that shows the module type.

| Icon | Module Type |
|--|--|
| :::image type="content" source="media/how-to-work-with-maps/power.png" alt-text="Screenshot of the Power Supply icon."::: | Power Supply |
| :::image type="content" source="media/how-to-work-with-maps/analog.png" alt-text="Screenshot the Analog I/O icon."::: | Analog I/O |
| :::image type="content" source="media/how-to-work-with-maps/comms.png" alt-text="Screenshot of the Communication Adapter icon."::: | Communication Adapter |
| :::image type="content" source="media/how-to-work-with-maps/digital.png" alt-text="Screenshot of the Digital I/O icon."::: | Digital I/O |
| :::image type="content" source="media/how-to-work-with-maps/computer-processor.png" alt-text="Screenshot of the CPU icon."::: | CPU |
| :::image type="content" source="media/how-to-work-with-maps/HMI-icon.png" alt-text="Screenshot of the HMI icon."::: | HMI |
| :::image type="content" source="media/how-to-work-with-maps/average.png" alt-text="Screenshot of the Generic icon."::: | Generic |

When you select a slot, the slot details appear:

:::image type="content" source="media/how-to-work-with-maps/slot-selection-v2.png" alt-text="Screenshot of the slot selection options.":::

To view the underlying devices behind the slot, select **VIEW ON MAP**. The slot is presented in the device map with all the underlying modules and devices connected to it.

:::image type="content" source="media/how-to-work-with-maps/map-appearance-v2.png" alt-text="Screenshot of the map view.":::


## Manage device information from the map

Under certain circumstances, you may need to update device information provided by Defender for IoT. The following options are available:

- [Update device properties](#update-device-properties)
- [Delete devices](#delete-devices)
- [Merge devices](#merge-devices)
- [Authorize and unauthorize devices](#authorize-and-unauthorize-devices)
- [Mark devices as important](#mark-devices-as-important)


### Update device properties

Certain device properties can be updated manually. Information manually entered will override information discovered by Defender for IoT.

**To update properties:**
1. Right-click a device from the map. 
1. Select **View properties**.
1. Select **Edit properties.**

    :::image type="content" source="media/how-to-work-with-maps/edit-config.png" alt-text="Screenshot of the Edit device property pane.":::
1. Update any of the following:

    - Authorized status
    - Device name
    - Device type. For a list of types, see [Device types](#device-types).
    - OS
    - Purdue layer
    - Description
    

#### Device types

This table lists device types you can manually assign to a device. 

| Category | Device Type |
|--|--|
| ICS | Engineering Station <br /> PLC <br />Historian <br />HMI <br />IED <br />DCS Controller <br />RTU <br />Industrial Packaging System <br />Industrial Scale <br />Industrial Robot <br />Slot <br />Meter <br />Variable Frequency Drive  <br />Robot Controller <br />Servo Drive <br />Pneumatic Device <br />Marquee |
| IT | Domain Controller <br />DB Server <br />Workstation <br />Server <br />Terminal Station <br />Storage <br />Smart Phone <br />Tablet <br />Backup Server |
| IoT | IP Camera <br />Printer  <br />Punch Clock <br />ATM <br />Smart TV <br />Game console <br />DVR <br />Door Control Panel <br />HVAC <br />Thermostat <br />Fire Alarm <br />Smart Light <br />Smart Switch <br />Fire Detector <br />IP Telephone <br />Alarm System <br />Alarm Siren <br />Motion Detector <br />Elevator <br />Humidity Sensor <br />Barcode Scanner <br />Uninterruptible Power Supply <br />People Counter System <br />Intercom <br />Turnstile |
| Network | Wireless Access Point <br />Router <br />Switch <br />Firewall <br />VPN Gateway <br />NTP Server <br />Wifi Pineapple <br />Physical Location <br />I/O Adapter <br /> Protocol Converter |

### Delete devices

You may want to delete a device if the information learned isn't relevant. For example,

  - A partner contractor at an engineering workstation connects temporarily to perform configuration updates. After the task is completed, the device is removed.

  - Due to changes in the network, some devices are no longer connected.

If you don't delete the device, the sensor will continue monitoring it. After 60 days, a notification will appear, recommending that you delete.

You may receive an alert indicating that the device is unresponsive if another device tries to access it. In this case, your network may be misconfigured.

The device will be removed from the Device Map, Device Inventory, and Data Mining reports. Other information, for example: information stored in Widgets will be maintained.

The device must be inactive for at least 10 minutes to delete it.

**To delete a device from the device map:**

1. Right-click a device on the map and select **Delete**.

### Merge devices

Under certain circumstances you may need to merge devices. This may be required if the sensor discovered separate network entities that are associated with one unique device. For example,

  - A PLC with four network cards.

  - A Laptop with WIFI and physical card.
  
  - A Workstation with two, or more network cards.

When merging, you instruct the sensor to combine the device properties of two devices into one. When you do this, the Device Properties window and sensor reports will be updated with the new device property details.

For example, if you merge two devices, each with an IP address, both IP addresses will appear as separate interfaces in the Device Properties window. You can only merge authorized devices.

The event timeline presents the merge event.

:::image type="content" source="media/how-to-work-with-maps/events-time.png" alt-text="Screenshot of an event timeline with merged events.":::

You can't undo a device merge. If you mistakenly merged two devices, delete the device and wait for the sensor to rediscover both.

**To merge devices:**

1. Select two devices (shift-click), and then right-click one of them.

2. Select **Merge** to merge the devices. It can take up to 2 minutes complete the merge.

3. In the set merge device attributes dialog box, choose a device name.

   :::image type="content" source="media/how-to-work-with-maps/name-the-device-v2.png" alt-text="Screenshot of the attributes dialog box.":::

4. Select **Save**.

### Authorize and unauthorize devices

During the Learning period, all the devices discovered in the network are identified as authorized devices. The **Authorized** label doesn't appear on these devices in the Device map.

When a device is discovered after the Learning period, it appears as an unauthorized device. In addition to seeing unauthorized devices in the map, you can also see them in the Device Inventory.

:::image type="content" source="media/how-to-work-with-maps/inventory-icon.png" alt-text="Screenshot of the Device Inventory icon.":::

**New device vs unauthorized**

New devices detected after the Learning period will appear with a `New` and `Unauthorized` label.

If you move a device on the map or manually change the device properties, the `New` label is removed from the device icon.

#### Unauthorized devices - Attack Vectors and Risk Assessment reports

Unauthorized devices are included in Risk Assessment reports and Attack Vectors reports.

- **Attack Vector Reports:** Devices marked as unauthorized are resolved in the Attack Vector as suspected rogue devices that might be a threat to the network.

   :::image type="content" source="media/how-to-work-with-maps/attack-vector-reports.png" alt-text="Screenshot of the attack vector reports.":::

- **Risk Assessment Reports:** Devices marked as unauthorized are identified in Risk Assessment reports.

    :::image type="content" source="media/how-to-work-with-maps/unauthorized-risk-assessment-report.png" alt-text="Screenshot of a Risk Assessment report showing an unauthorized device.":::

**To authorize or unauthorize devices manually:**

1. Right-click the device on the map and select **Authorize** or **Unauthorize**.

### Mark devices as important

You can mark significant network devices as important, for example, business critical servers. These devices are marked with a star on the map. The star varies according to the map's zoom level.

:::image type="icon" source="media/how-to-work-with-maps/star-one.png" border="false"::: :::image type="icon" source="media/how-to-work-with-maps/star-two.png" border="false"::: :::image type="icon" source="media/how-to-work-with-maps/star-3.png" border="false":::

**To mark a device as Important:**

1. Right-click the device on the map and select **Mark as important**

#### Important devices - Attack Vectors and Risk Assessment reports

Important devices are calculated when generating Risk Assessment reports and Attack Vectors reports.

  - Attack Vector reports devices marked as important are resolved in the Attack Vector as Attack Targets. 

  - Risk Assessment Reports: Devices marked as important are calculated when providing the security score in the Risk Assessment report.
  
#### Important devices -  Defender for IoT on the Azure portal

Devices you mark as important on your sensor are also marked as important in the Device inventory on the Defender for IoT portal on Azure.

:::image type="content" source="media/how-to-work-with-maps/important-devices-on-cloud.png" alt-text="Screenshot of the Device inventory page in the Azure portal showing important devices." lightbox="media/how-to-work-with-maps/important-devices-on-cloud.png":::

## Next steps

For more information, see [Investigate sensor detections in a Device Inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md).
