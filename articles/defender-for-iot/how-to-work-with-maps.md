---
title: Work with maps
description: The Device Map provides a graphical representation of network devices detected. Use the map to analyze, and manage device information, network slices and generate reports.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure
---

# Investigate sensor detections in the device map

The Device Map provides a graphical representation of network devices detected. Use the map to:

  - Retrieve, analyze, and manage device information.

  - Analyze network slices, for example-specific groups of interest or Purdue layers.

  - Generate reports, for example export device details and summaries.

:::image type="content" source="media/how-to-work-with-maps/device-map.png" alt-text="Screenshot of the device map.":::

To access the map:

  - Select **Device Map** from the console main screen.

### Map search and layout tools

The following tools are used to working in the map.

Your user role determines which tools are available in the Device Map window. See [Create and manage users](how-to-create-and-manage-users.md) for details about user roles.

| Symbol | Description |
|---|---|
| :::image type="icon" source="media/how-to-work-with-maps/search-bar-icon.png" border="false":::| Search by IP address or MAC address for a specific device. Enter the IP address or MAC address in the text box. The map displays the device that you searched for with devices connected to it. |
| Group Highlight and Filters <br /> :::image type="content" source="media/how-to-work-with-maps/group-highlight-and-filters.png" alt-text="Screenshot of the group highlights and filters."::: | Filter or highlight the map based on default and custom device groups. |
| :::image type="icon" source="media/how-to-work-with-maps/collapse-view-icon.png" border="false"::: | IT Collapse view, to enable a focused view on OT devices, and group IT devices.  |
| :::image type="icon" source="media/how-to-work-with-maps/device-management-icon.png" border="false"::: | Maintain current device arrangement in the map. For example, if you drag devices to new locations on the map, the devices will remain in these locations when exiting the map. |
| :::image type="icon" source="media/how-to-work-with-maps/fit-to-screen-icon.png" border="false"::: | Fit to screen |
| :::image type="icon" source="media/how-to-work-with-maps/layer-icon.png" border="false"::: :::image type="icon" source="media/how-to-work-with-maps/layouts-icon.png" border="false"::: | - View the Purdue layer identified for this device, including automatic, process control, supervisory, and enterprise <br /> - View connections between devices.|
| :::image type="icon" source="media/how-to-work-with-maps/broadcast-icon.png" border="false"::: | Show or hide between broadcast and multicast. |
| :::image type="icon" source="media/how-to-work-with-maps/time-icon.png" border="false"::: | Filter the devices on the map according to the time they last communicating with other devices. |
| :::image type="icon" source="media/how-to-work-with-maps/notifications-icon.png" alt-text="notifications" border="false"::: | View notifications about a device. For example, if a new IP was detected for a device using an existing MAC address |
| :::image type="icon" source="media/how-to-work-with-maps/export-import.png" alt-text="Export" border="false"::: | Export/Import device information. |
| :::image type="icon" source="media/how-to-work-with-maps/properties-icon.png" alt-text="properties" border="false"::: | View basic device properties for selected devices. |
| :::image type="icon" source="media/how-to-work-with-maps/zoom-in-icon.png" alt-text="Zoom In" border="false"::: or :::image type="icon" source="media/how-to-work-with-maps/zoom-out-icon.png" alt-text="Zoom Out" border="false"::: | Zoom in or out of devices in the map. |

#### View OT elements only

By default, IT devices are automatically aggregated by subnet, so that the map view is focused on OT and ICS networks. The presentation of the IT network elements is collapsed to a minimum, which reduces the total number of the devices presented on the map and provides a clear picture of the OT and ICS network elements.

Each subnet is presented as a single entity on the device map, including an interactive collapsing and expanding capability to look at the details of an IT subnet and back.

The figure below shows a collapsed IT subnet with 27 IT network elements.

:::image type="content" source="media/how-to-work-with-maps/shrunk-it-subnet.png" alt-text="collapsed IT subnet with 27 IT network elements":::

To enable the IT networks collapsing capability:

- In the System Setting window, ensure that the IT Networks capability is enabled.

  :::image type="content" source="media/how-to-work-with-maps/shrunk-it-subnet.png" alt-text="System Setting window":::

To expand an IT subnet:

1. To differentiate between the IT and OT networks, from the System Settings screen, select **Subnets**.

   > [!NOTE]
   > It is recommended to name each subnet with meaningful names at the user can easily identify in order to differentiate between IT and OT networks.

   :::image type="content" source="media/how-to-work-with-maps/subnet-list.png" alt-text="Subnets Configuration":::

2. In the Edit Subnets Configuration window, clear the  ICS subnet for each subnet that you want to define as an IT subnet. The IT subnets appear collapsed in the device map with the notifications for ICS devices, such as a controller or PLC, in IT networks.

   :::image type="content" source="media/how-to-work-with-maps/edit-config.png" alt-text="Edit Subnets Configuration":::

3. To expand the IT network on the map, in the Devices window, right-click it and select **Expand Network**.

   :::image type="content" source="media/how-to-work-with-maps/expand-network.png" alt-text="Expand your view of your network.":::

4. A confirmation box appears, notifying you that this action cannot be undone.

   :::image type="content" source="media/how-to-work-with-maps/confirmation.png" alt-text="confirmation box":::

5. Select **OK**. The IT subnet elements appear on the map.

   :::image type="content" source="media/how-to-work-with-maps/fixed-map.png" alt-text="OK":::

To collapse an IT subnet:

1.  From the left pane, select **Devices**.

2. In the Devices window, select :::image type="content" source="media/how-to-work-with-maps/red-number.png" alt-text="Number in red indicates how many expanded IT subnets currently appear on the map.":::

   :::image type="content" source="media/how-to-work-with-maps/devices-notifications.png" alt-text="Device window":::

3. Select the subnet(s) that you want to collapse or select **Collapse All**. The selected subnet appears collapsed on the map.

   :::image type="content" source="media/how-to-work-with-maps/close-all-subnets.png" alt-text="Collapse All":::

   The :::image type="content" source="media/how-to-work-with-maps/notify-icon.png" alt-text="icon"::: icon is displayed with the updated number of expanded IT subnets.

#### View or highlight device groups

You can customize the map display based on device Groups. For example, groups of devices associated with a specific VLAN or subnet. Predefined groups are available and custom groups can be created.

View groups by:

  - **Highlighting:** Highlight the devices that belong to a specific group in blue.

  - **Filtering:** Only display devices on the map only that belong to a specific group.

:::image type="content" source="media/how-to-work-with-maps/port-standard.png" alt-text="Standard view of your port":::

The following predefined groups are available:

| Group name | Description |
|--|--|
| **Known applications or non-standrad ports (default)** | Devices that use reserved ports, such as TCP. Devices that use non-standard ports or ports that have not been assigned an alias. |
| **OT protocols (default)** | Devices that handle the OT traffic. |
| **Authorization (default)** | Devices that were discovered in the network during the learning process or were officially added to the network |
| **Device inventory filters** | Devices grouped according to the filters save in the Device Inventory table. |
| **Polling intervals** | Devices grouped by polling intervals. The polling intervals are generated automatically according to cyclic channels, or periods. For example, 15.0 seconds, 3.0 seconds, 1.5 seconds, or any interval. Reviewing this information helps you learn if systems are polling too quickly or slowly. |
| **Programming** | Engineering stations and programmed controllers |
| **Subnets** | Devices that belong to a specific subnet. |
| **VLAN** | Devices associated with a specific VLAN ID. |
| **Connection between subnets** | Devices associated with cross subnet connection. |
| **Pinned alerts** | Devices for which the user has pinned an alert. |
| **Attack vector simulations** | Vulnerable devices detected in attack vector reports. In order to view these devices on the map, select the **Display on Device Map** checkbox when generating the Attack Vector. :::image type="content" source="media/how-to-work-with-maps/add-attack.png" alt-text="Add Attack Vector Simulations"::: |
| **Last seen** | Devices grouped by the time frame they were last seen, for example: One hour, six hours, one day, seven days. |
| **Not In Active Directory** | All non-PLC devices that are not communicating with the Active Directory. |

To highlight or filter devices:

1. Select **Device Map** on the side menu.

2. Select :::image type="content" source="media/how-to-work-with-maps/menu-icon.png" alt-text="Menu":::.

3. From the Groups pane, select the group you want to highlight or filter devices.

4. Select **Highlight** or **Filter**.

### Define custom groups

In addition to viewing predefined groups, you can define custom groups. The groups appear in the Device Map, Device Inventory, and Data Mining Reports.

> [!NOTE]
> You can also create groups from the Device Inventory.

To create a group:

1. Select **Devices** on the side menu. The Device Map is displayed.

2. Select :::image type="content" source="media/how-to-work-with-maps/menu-icon.png" alt-text="Group Setting"::: to display the Groups settings.

3. Select :::image type="content" source="media/how-to-work-with-maps/create-group.png" alt-text="groups"::: to create a new custom group.

   :::image type="content" source="media/how-to-work-with-maps/custom-group.png" alt-text="Create a custom group screen":::

4. Add the name of the group, use up to 30 characters.

5. Select the relevant devices, as follows:

   - Add the devices from this menu by selecting them from the list (select on the arrow button),<br /> Or, <br /> 
   - Add the devices from this menu by copying them from a selected group (select on the arrow button)

6. Select **Add group**.

#### Add devices to a custom group

You can add devices to a custom group or create a new custom group and the device.

1. Right-click a device(s) on the map.

2. Select **Add to group**.

3. Enter a group name in the group field and select :::image type="content" source="media/how-to-work-with-maps/green-plus-icon.png" alt-text="add":::. The new group appears. If the group already exists, it will be added to the existing custom group.

   :::image type="content" source="media/how-to-work-with-maps/groups-section.png" alt-text="Group name":::

4. Add devices to a group by repeating steps 1-3.

### Map zoom views

Working with map views help expedite forensics when analyzing large networks.

Three device detail views can be displayed:

  - [Bird’s-eye view](#birds-eye-view)

  - [Device type and connection view](#device-type-and-connection-view)

  - [Detailed view](#detailed-view)

#### Bird’s-eye view

This view provides an at-a-glance view of devices represented as follows:

  - Red dots indicate devices with alert(s)

  - Starred dots indicate devices marked as important

  - Black dots indicate devices with no alerts

:::image type="content" source="media/how-to-work-with-maps/colored-dots.png" alt-text="Bird eye view":::

#### Device type and connection view 

This view presents devices represented as icons on the map in order to highlight devices with alerts, device types, and connected devices.

  - Devices with alerts are displayed with a red ring

  - Devices without alerts are displayed with a grey ring

  - Devices displayed as a star were marked as important

The device type icon is shown with connected devices.

:::image type="content" source="media/how-to-work-with-maps/colored-rings.png" alt-text="connection view":::

#### Detailed view 

The detailed view presents devices and device labels and indicators with the following information:

:::image type="content" source="media/how-to-work-with-maps/device-map.png" alt-text="Detailed view":::

#### Control the zoom view

The map view displayed depends on the map zoom-level. Switching between the map views is done by changing the zoom levels.

:::image type="content" source="media/how-to-work-with-maps/zoom-in-out.png" alt-text="Control the zoom view":::

#### Enabling simplified zoom views

Administrators who want security analysts and RO users to access Brid’s-eye and device and type connection views, should enable the simplified view option.

To enable simplified map views:

  - Select **System Settings** and then toggle the **Simplified Map View** option.

:::image type="content" source="media/how-to-work-with-maps/simplify-view.png" alt-text="Simplify map view":::

### Learn more about devices

An extensive range of tools are available to learn more about devices form the Device Map:

- [Device Labels and Indicators](#device-labels-and-indicators)

- [Device Quick Views](#device-quick-views)

- [View and Manage Device Properties](#view-and-manage-device-properties)

- [View Device Types](#view-device-types)

- [Backplane](#backplane-properties)

- [View a Timeline of Events for the Device](#view-a-timeline-of-events-for-the-device)

- [Analyze Programming Details and Changes](#analyze-programming-details-and-changes)

#### Device labels and indicators

The following labels and indicators may appear on devices on the map:

| Device label | Description |
|--|--|
| :::image type="content" source="media/how-to-work-with-maps/host.png" alt-text="IP host name"::: | IP address host name and IP address, or subnet addresses |
| :::image type="content" source="media/how-to-work-with-maps/amount-alerts.png" alt-text="Number of alerts"::: | Number of alerts associated with the device |
| :::image type="icon" source="media/how-to-work-with-maps/type.png" border="false"::: | Device type icon, for example storage, PLC or historian. |
| :::image type="content" source="media/how-to-work-with-maps/grouped.png" alt-text="devices grouped"::: | Number of devices grouped in a subnet in an IT network. In this example 8. |
| :::image type="content" source="media/how-to-work-with-maps/not-authorized.png" alt-text="device Learning period"::: | An device that was detected after the Learning period and was not authorized as a network device. |
| Solid line | Logical connection between devices |
| :::image type="content" source="media/how-to-work-with-maps/new.png" alt-text="New device"::: | New device discovered after Learning is complete. |

#### Device quick views

Access device properties and connections from the map.

To open the quick properties menu:

  - Select the quick properties menu :::image type="content" source="media/how-to-work-with-maps/properties.png" alt-text="quick properties menu":::.

##### Quick device properties

Select a device or multiple devices while the Quick Properties screen is open to see the highlights of those devices:

:::image type="content" source="media/how-to-work-with-maps/device-information.png" alt-text="Quick device properties":::

##### Quick connection properties

Select a connection while the Quick Properties screen is open to see the protocols that are utilized in this connection and when they were last seen:

:::image type="content" source="media/how-to-work-with-maps/connection-details.png" alt-text="Quick connection properties":::

#### View and manage device properties

You can view device proprieties for each device displayed on the map. For example, the device name, type or OS, or the firmware or vendor.

:::image type="content" source="media/how-to-work-with-maps/device-properties.png" alt-text="View and manage device properties":::

The following information can be updated manually. Information manually entered will override information discovered by Defender for IoT.

  - Name

  - Type

  - OS

  - Purdue layer

  - Description

| Item | Description |
|--|--|
| Basic Information | The basic information needed. |
| Name | The device name. <br /> By default, the sensor discovers the device name as it defined in the network. For example, a name defined in the DNS server. <br /> If no such names were defined, the device IP address appears in this field. <br /> You can change a device name manually. Give your devices meaningful names that reflect their functionality. |
| Type | The device type detected by the sensor. <br /> For more information, see [View device types](#view-device-types). |
| Vendor | The device vendor. |
| Operating System | The device OS. |
| Purdue Layer | The Purdue layer identified by the sensor for this device, including: <br /> - Automatic <br /> - Process Control <br /> - Supervisory <br /> - Enterprise |
| Description | A free text field. <br /> Add more information about the device. |
| Attributes | Any additional information that was discovered about the device during the learning period and does not belong to other categories, appears in the attributes section. <br /> The information is RO. |
| Settings | You can manually change device settings to prevent false positives: <br /> - **Authorized Device**: During the learning period, all the devices discovered in the network are identified as authorized devices. When a device is discovered after the learning period, it appears as an unauthorized device by default. You can change this definition manually. <br /> - **Known as Scanner**: Enable this option if you know that this device is known as scanner and there is no need to alert you about it. <br /> - **Programming Device**: Enable this option if you know that this device is known as a programming device and there is no need to alert you about it. |
| Custom Groups | The custom groups in the device map in which this device participates. |
| State | The security and the authorization status of the device: <br /> - The status is `Secured` when there are no alerts <br /> - When there are alerts about the device, the number of alerts is displayed <br /> - The status `Unauthorized` is displayed for devices that were added to the network after the learning period. You can manually define the device as `Authorized Device` in the settings <br /> - In case the address of this device is defined as a dynamic address, `DHCP` is added to the status. |


| Network | Description |
|--|--|
| Interfaces | The device interfaces. A RO field. |
| Protocols | The protocols used by the device. A RO field. |
| Firmware | If Backplane information is available, firmware information will not be displayed. |
| Address | The device IP address. |
| Serial | The device serial number. |
| Module Address | The device model and slot number or ID. |
| Model | The device model number. |
| Firmware Version | The firmware version number. |

To view the device information:

1. Select **Devices** on the side menu.

2. Right-click a device and select **View Properties**. The Device Properties window is displayed.

3. Select on the required alert at the bottom of this window to view detailed information about alerts for this device.

#### View device types

The Device Type is automatically identified by the sensor during the device discovery process. You can change the type manually.

:::image type="content" source="media/how-to-work-with-maps/type-of-device.png" alt-text="View Device Types":::

The following table presents all the types in the system:

| Category | Device Type |
|--|--|
| ICS | Engineering Station <br /> PLC <br />Historian <br />HMI <br />IED <br />DCS Controller <br />RTU <br />Industrial Packaging System <br />Industrial Scale <br />Industrial Robot <br />Slot <br />Meter <br />Variable Frequency Drive  <br />Robot Controller <br />Servo Drive <br />Pneumatic Device <br />Marquee |
| IT | Domain Controller <br />DB Server <br />Workstation <br />Server <br />Terminal Station <br />Storage <br />Smart Phone <br />Tablet <br />Backup Server |
| IoT | IP Camera <br />Printer  <br />Punch Clock <br />ATM <br />Smart TV <br />Game console <br />DVR <br />Door Control Panel <br />HVAC <br />Thermostat <br />Fire Alarm <br />Smart Light <br />Smart Switch <br />Fire Detector <br />IP Telephone <br />Alarm System <br />Alarm Siren <br />Motion Detector <br />Elevator <br />Humidity Sensor <br />Barcode Scanner <br />Uninterruptible Power Supply <br />People Counter System <br />Intercom <br />Turnstile |
| Network | Wireless Access Point <br />Router <br />Switch <br />Firewall <br />VPN Gateway <br />NTP Server <br />Wifi Pineapple <br />Physical Location <br />I/O Adapter <br /> Protocol Converter |

To view the device information:

1.  Select **Devices** on the side menu.

2. Right-click a device and select **View Properties**. The Device Properties window is displayed.

3. Select on the required alert at the bottom of this window to view detailed information about alerts for this device.

#### Backplane properties

If a PLC contains multiple modules separated into racks and slots, the characteristics might vary between the module cards. For example, if the IP address and the MAC address are the same, the firmware might be different.

You can use the Backplane option to review multiple controllers/cards and their nested devices as one entity with a variety of definitions. Each slot in the Backplane view represents the underlying devices – the devices that were discovered behind it.

:::image type="content" source="media/how-to-work-with-maps/backplane-image.png" alt-text="Backplane Properties":::

:::image type="content" source="media/how-to-work-with-maps/backplane-details.png" alt-text="Backplane Device Properties":::

A Backplane can contain up to 30 controller cards and up to 30 rack units. The total number of devices included in the multiple levels can be up to 200 devices.

The Backplane pane is shown in the Device Properties window when Backplane details are detected.

Each slot appears with the number of underlying devices and the icon that shows the module type.

| Icon | Module Type |
|--|--|
| :::image type="content" source="media/how-to-work-with-maps/power.png" alt-text="Power Supply"::: | Power Supply |
| :::image type="content" source="media/how-to-work-with-maps/analog.png" alt-text="Analog I/O"::: | Analog I/O |
| :::image type="content" source="media/how-to-work-with-maps/comms.png" alt-text="Communication Adapter"::: | Communication Adapter |
| :::image type="content" source="media/how-to-work-with-maps/digital.png" alt-text="Digital I/O"::: | Digital I/O |
| :::image type="content" source="media/how-to-work-with-maps/computer-processor.png" alt-text="CPU"::: | CPU |
| :::image type="content" source="media/how-to-work-with-maps/HMI-icon.png" alt-text="HMI"::: | HMI |
| :::image type="content" source="media/how-to-work-with-maps/average.png" alt-text="Generic"::: | Generic |

When you select a slot, the slot details appear:

:::image type="content" source="media/how-to-work-with-maps/slot-selection.png" alt-text="select a slot":::

To view the underlying devices behind the slot, select **VIEW ON MAP**. The slot is presented in the device map with all the underlying modules and devices connected to it.

:::image type="content" source="media/how-to-work-with-maps/map-appearance.png" alt-text="VIEW ON MAP":::

#### View a timeline of events for the device

View a timeline of events associated with a device.

To view the timeline:

1. Right-click a device from the map.

2. Select **Show Events**. The Event Timeline window opens with information about events detected for the selected device.

See [Event Timeline](#event-timeline) for details.

### Analyze programming details and changes

Enhance forensics by displaying programming events carried out on your network devices and analyzing code changes. This information helps you discover suspicious programming activity, for example:

  - Human error: An engineer is programming the wrong device.

  - Corrupted programming automation: Programming is erroneously carried out because of automation failure.

  - Hacked systems: Unauthorized users logged into a programming device.

You can display a programmed device and scroll through various programming changes carried out on it by other devices.

View code that was added, changed, removed, or unchanged by the programming device. Search for programming changes based on file types, dates, or times of interest.

#### When to review programming activity 

You may need to review programming activity:

  - After viewing an alert regarding unauthorized programming

  - After a planned update to controllers

  - When a process or machine is not working correctly (to see who carried out the last update and when)

:::image type="content" source="media/how-to-work-with-maps/differences.png" alt-text="Programing Change Log":::

Additional options let you:

  - Mark events of interest with a star.

  - Download a *.txt file with the current code.

#### About authorized vs unauthorized programming events 

Unauthorized programming events are carried out by devices that have not been learned or manually defined as programming devices. Authorized programming events are carried out by devices that were resolved or manually defined as programming devices.

The Programming Analysis window displays both authorized and unauthorized programming events.

#### Accessing programming details and changes

Access the Programming Analysis window from the:

- [Event Timeline](#event-timeline)

- [Unauthorized Programming Alerts](#unauthorized-programming-alerts)

#### Event timeline

Use the event timeline to display a timeline of events in which programming changes were detected.

:::image type="content" source="media/how-to-work-with-maps/timeline.png" alt-text="A view of the event timeline.":::

#### Unauthorized programming alerts

Alerts are triggered when unauthorized programming devices carry out programming activities.

:::image type="content" source="media/how-to-work-with-maps/unauthorized.png" alt-text="Unauthorized programming alerts":::

> [!NOTE]
> You can also view basic programming information in the Device Properties window and Device Inventory. See [Device Programming Information: Additional Locations](#device-programming-information-additional-locations) for details.

#### Working in the programming timeline window

This section describes how to view programming files and compare versions. Search for specific files sent to a programmed device. Search for files based on:

  - Date

  - File type

:::image type="content" source="media/how-to-work-with-maps/timeline-view.png" alt-text="programming timeline window":::

|Programming timeline type | Description |
|--|--|
| Programmed Device | Provides details about the device that was programmed, including the hostname and file. |
| Recent Events | Displays the 50 most recent events detected by the sensor. <br />To highlight an event, hover over it and click the star. :::image type="icon" source="media/how-to-work-with-maps/star.png" border="false"::: <br /> The last 50 events can be viewed. |
| Files | Displays the files detected for the chosen date and the file size on the programmed device. <br /> By default, the maximum number of files available for display per device is 300. <br /> By default, the maximum file size for each file is 15 MB. |
| File status :::image type="icon" source="media/how-to-work-with-maps/status.png" border="false"::: | File labels indicate the status of the file on the device, including: <br /> **Added**: the file was added to the endpoint on the date or time selected. <br /> **Updated**: The file was updated on the date or time selected. <br /> **Deleted**: This file was removed. <br /> **No label**: The file was not changed.   |
| Programming Device | The device that made the programming change. Multiple devices may have carried out programming changes on one programmed device. The hostname, date, or time of change and logged in user are displayed. |
| :::image type="icon" source="media/how-to-work-with-maps/current.png" border="false"::: | Displays the current file installed on the programmed device. |
| :::image type="icon" source="media/how-to-work-with-maps/download-text.png" border="false"::: | Download a text file of the code displayed. |
| :::image type="icon" source="media/how-to-work-with-maps/compare.png" border="false"::: | Compare the current file with the file detected on a selected date. |

#### Choose a file to review

This section describes how to choose a file to review.

To choose a file to review:

1. Select an event from the **Recent Events** pane

2. Select a file form the File pane. The file appears in the Current pane.

:::image type="content" source="media/how-to-work-with-maps/choose-file.png" alt-text="Select the file to work with.":::

#### Compare files

This section describes how to compare programming files.

To compare:

1. Select an event from the Recent Events pane.

2. Select a file from the File pane. The file appears in the  Current pane. You can compare this file to other files.

3. Select the compare indicator.

   :::image type="content" source="media/how-to-work-with-maps/compare.png" alt-text="Compare indicator":::

   The window displays all dates the selected file was detected on the programmed device. The file may have been updated on the programmed device by multiple programming devices.

   The number of differences detected appears in the upper right-hand corner of the window. You may need to scroll down to view differences.

   :::image type="content" source="media/how-to-work-with-maps/scroll.png" alt-text="scroll down to your selection":::

   The number is calculated by adjacent lines of changed text. For example, if eight consecutive lines of code were changed (deleted, updated, or added) this will be calculated as one difference.

   :::image type="content" source="media/how-to-work-with-maps/program-timeline.png" alt-text="Your programing timeline view.":::

4. Select a date. The file detected on the selected date appears in the window.

5. The file selected from the Recent Events/Files pane always appears on the right.

#### Device programming information: additional locations

In addition to reviewing details in the Programming Timeline, you can access programming information in the Device Properties window and the Device Inventory.

| Device type | Description |
|--|--|
| Device properties | The device properties window provides information on the last programming event detected on the device\. :::image type="content" source="media/how-to-work-with-maps/information-from-device.png" alt-text="Your device's properties"::: |
| The device inventory | The device inventory indicates if the device is a programming device\.                                    :::image type="content" source="media/how-to-work-with-maps/inventory.png" alt-text="The inventory of devices"::: |

## Manage device information from the map

The sensor does not update or impact devices directly on the network. Changes made here only impact how analyzes the device.

### Delete devices

You may want to delete a device if the information learned is not relevant. For example,

  - A partner contractor at an engineering workstation connects to perform configuration updates. After the task is completed, the device should no longer be monitored.

  - Due to changes in the network, some devices are no longer connected.

If you do not delete the device, the sensor will continue monitoring it. After 60 days, a notification will appear, recommending that you delete.

You may receive an alert indicating that the device is unresponsive if another device tries to access it. In this case, your network may be misconfigured.

The device will be removed from the Device Map, Device Inventory, and Data Mining reports. Other information, for example: information stored in Widgets will be maintained.

The device must be active for at least 10 minutes to delete it.

To delete a device from the device map:

1. Select **Devices** on the side menu.

2. Right-click a device and select **Delete**.

### Merge devices

Under certain circumstances, you may need to merge devices. This may be required if the sensor discovered separate network entities that are one unique device. For example,

  - A PLC with four network cards

  - A Laptop with WIFI and physical card  

When merging, you instruct the sensor to combine the device properties of two devices into one. When you do this, the Device Properties window and sensor reports will be updated with the new device property details.

For example, if you merge two devices with an IP address, both IP addresses will appear as separate interfaces in the Device Properties window. You can only merge authorized devices.

:::image type="content" source="media/how-to-work-with-maps/properties-view.png" alt-text="Device Properties window":::

The event timeline presents the merge event.

:::image type="content" source="media/how-to-work-with-maps/events-time.png" alt-text="The event timeline with merged events.":::

You cannot undo a device merge. If you mistakenly merged two devices, delete the device and wait for The sensor to rediscover both.

To merge devices:

1. Select two devices and right-click one of them.

2. Select **Merge** to merge the devices. It can take up to 2 minutes complete the merge.

3. In the set merge device attributes dialog box, choose a device name.

   :::image type="content" source="media/how-to-work-with-maps/name-the-device.png" alt-text="attributes dialog box":::

4. Select **Save**.

### Authorize and unauthorize devices

During the Learning period, all the devices discovered in the network are identified as authorized devices. The **Authorized** label does not appear on these devices in the Device Map.

When a device is discovered after the Learning period, it appears as an unauthorized device. In addition to seeing unauthorized devices in the map, you can also see them in the Device Inventory.

:::image type="content" source="media/how-to-work-with-maps/inventory-icon.png" alt-text="Device Inventory":::

**New device vs unauthorized**

New devices detected after the Learning period will appear with a `New` and `Unauthorized` label.

If you move a device on the map or manually change the device properties, the `New` label is removed from the device icon.

#### Unauthorized devices - attack vectors and risk assessment reports

Unauthorized devices are calculated included in Risk Assessment reports and Attack Vectors reports.

- **Attack Vector Reports:** Devices marked as unauthorized are resolved in the Attack Vector as suspected rogue devices that might be a threat to the network.

   :::image type="content" source="media/how-to-work-with-maps/attack-vector-reports.png" alt-text="Vew your attack vector reports":::

- **Risk Assessment Reports:** Devices marked as unauthorized are:

  - Identified in Risk Assessment Reports

To authorize or unauthorize devices manually:

1. Right-click the device on the map and select **Unauthorize**

### Mark devices as important

You can mark significant network devices as important, for example business critical servers. These devices are marked with a star on the map. The star varies according to the map's zoom level.

:::image type="icon" source="media/how-to-work-with-maps/star-one.png" border="false"::: :::image type="icon" source="media/how-to-work-with-maps/star-two.png" border="false"::: :::image type="icon" source="media/how-to-work-with-maps/star-3.png" border="false":::

#### Important devices - attack vectors and risk assessment reports

Important devices are calculated when generating Risk Assessment reports and Attack Vectors reports.

  - Attack Vector reports devices marked as important are resolved in the Attack Vector as Attack Targets. 

  - Risk Assessment Reports: Devices marked as important are calculated when providing the security score in the Risk Assessment report.

## Generate reports from the map

### Activity reports

Generate an activity report for a selected device over the 1, 6, 12 or 24 hours. The following information is available:

  - Category: Basic detection information based on traffic scenarios.

  - Source and destination devices

  - Data: Additional information defected.

  - The time and date last seen.

You can save the report as a Microsoft Excel or Word file.

:::image type="content" source="media/how-to-work-with-maps/historical-information.png" alt-text="Recent activity":::

To generate an activity report for a device:

1. Right-click a device from the Map.

2. Select an Activity Report.

   :::image type="content" source="media/how-to-work-with-maps/activity-report.png" alt-text="View a report of your activity.":::

### Attack vector reports

Simulate an Attack Vector report to learn if a device on the map you select is a vulnerable attack target.

Attack Vector reports provide a graphical representation of a vulnerability chain of exploitable devices. These vulnerabilities can give an attacker access to key network devices. The Attack Vector simulator calculates attack vectors in real time and analyzes all attack vectors per a specific target.

To view a device in an Attack Vector reports:

1. Right-click a device from the map.

2. Select **Simulate Attack Vectors**. The Attack Vector dialog box opens with the device you select as the attack target.

   :::image type="content" source="media/how-to-work-with-maps/simulation.png" alt-text="Add attack vector simulation":::

3. Add the remaining parameters to the dialog box and select **Add Simulation**.

### Export device information

Export the following device information from the Map.

  - Device details (Microsoft Excel)

  - A device summary (Microsoft Excel)

  - A word file with groups (Microsoft Word)

To export:

1. Select the :::image type="icon" source="media/how-to-work-with-maps/file-icon.png" border="false"::: icon from the Map.

2. Select an export option.

## Gain insight into global, regional, and local threats

### The on-premises management console map

With Defender for Iot on-premises management console, you can plan how to achieve full security coverage by dividing your network into geographical and logical segments that reflect your business typology.

- **Geographical facility level:** A Site is a number of devices grouped according to geographical location presented on the map. By default, Defender for Iot provides you with a world map. You can change it to the map relevant to your organization: a country map, a city map and so on. The map is empty by default. You need to add sites to the map to reflect your company structure.

  For example, there is a company with five physical sites, Toronto, New York, Berlin, Moscow, and Florence. All five sites were added to the map by the Defender for Iot administrator. When the site color changes on the map, it provides the SOC team with indication of critical system status at a glance.

  The map is interactive and enables opening each site and delve into this site's info.

- **Global logical layer:** A Business Unit is a way to divide the organization into logical sections according to specific industry fields. This is how you can reflect your business topology on the enterprise map.

  For example, a global company that contains glass factories, plastic factories, and automobile factories can be managed as three different business units, while a single site may contain all three business units. A physical site located in Toronto includes three different glass production lines, a plastic production line, and a truck engine production line. So, this site has representatives of all three business units.

- **Geographical region level:** A Region is a way to divide the global organization into geographical regions. For example, North America, Western Europe, Eastern Europe. North America has factories from all three Business Units; Western Europe has automobile factories and glass factories, and Eastern Europe only plastic factories.

  The Toronto site is in the North America region.

- **Local logical segment level:** A Zone is a logical section within a site defined according to user-defined characteristics such as functional areas, production lines, or controller types, to allow enforcement of security policies relevant to the zone definition. For example, the Toronto site contains five production lines that can be defined as five zones. The three glass production lines are three zones related to the glass business unit, the plastic production line is a zone within the plastic business unit and the truck engine production line is a zone within the automobile business unit.

- **Local view level:** A single Defender for Iot installation that provides insight into the operational and security status of the devices connected Defender for Iot.

### Understanding the map views

The Defender for Iot on-premises management console provides an overall view of your industrial network in a context-related map. The general map view presents the global map of your organization with geographical location of each site.

:::image type="content" source="media/how-to-work-with-maps/enterprise.png" alt-text="Screenshot of Enterprise Map View":::

In addition to the general map view, you can switch to filtered map views that pinpoint problems in your network. In the general map view, all the sites are presented in gray. In other views, the sites are presented according to the following color scheme:

- **Green**: The number of security events detected by Defender for Iot is below the threshold defined by Defender for Iot security experts for your system. No need to take any action at this stage.

- **Yellow**: The number of security events detected by Defender for Iot is equal to the threshold defined by Defender for Iot security experts for your system. Consider checking the situation.

- **Red**: The number of security events is beyond the threshold defined by Defender for Iot security experts for your system. You must take immediate action.

An immediate view into problematic sites allows you to focus on the important issues and better prioritize your actions, as follows:

- **Risk management:** The Vulnerability Assessment view displays information on-site vulnerability rating. This assists you in prioritizing prevention activities and building a road map to plan improvements in OT network security.

- **Incident response:** A centralized view of all unacknowledged alerts on each site across the enterprise, with the ability to drill down and manage alerts of a specific site.

:::image type="content" source="media/how-to-work-with-maps/incident-responses.png" alt-text="Screenshot of Enterprise Map View with Incident Response":::

- **Malicious activity:** If malware was detected, the site appears in red, which means you must take immediate action.

:::image type="content" source="media/how-to-work-with-maps/malicious-activity.png" alt-text="Screenshot of Enterprise Map View with Malicious Activity":::

- **Operational alerts:** OT system operational alerts map view provides a better understanding of which OT system might experience operational incidents, such as PLC stops, firmware upload, program upload and so on.

:::image type="content" source="media/how-to-work-with-maps/operational-alerts.png" alt-text="Screenshot of Enterprise Map View with Operational Alerts":::

To switch between the map views:

- Select an option from the drop-down list. The Site Map view changes according to your choice.

:::image type="content" source="media/how-to-work-with-maps/map-views.png" alt-text="Screenshot of Site Map Default View":::

### Updating the map image 

A default world map is provided. You can change it to reflect your organization: a country map or a city map for example. 

To replace the map: 

1. In the left pane, select **System Settings**. 

2. Select the **Change Site Map** and upload the graphic file to replace the default map. 
