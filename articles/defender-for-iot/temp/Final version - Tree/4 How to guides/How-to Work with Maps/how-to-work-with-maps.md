---
title: Work with maps
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/04/2020
ms.topic: article
ms.service: azure
---

# Overview

## Investigate sensor detections in the map

### The asset map

The Asset Map provides a graphical representation of network assets detected. Use the map to:

  - Retrieve, analyze and manage asset information.

  - Analyze network slices, for example specific groups of interest or Purdue layers.

  - Generate reports, for example export asset details and summaries.

:::image type="content" source="media/image44.png" alt-text="asset map":::

To access the map:

  - Select **Asset Map** from the Console main screen.

### Map search and layout tools

The following tools are used to working in the map.

Your user role determines which tools are available in the Asset Map window. See [Manage Users](./manage-users.md) for details about user roles.

| Symbol | Description |
|---|---|
| <img alt="Search" src="media/image45.png" style="width:2.02604in;height:0.33099in" /> | Search by IP or MAC address for a specific asset. Enter IP/MAC in the text box. The map displays the asset that you searched for with assets connected to it. |
| Group Highlight and Filters <br /> <img alt="Default and custom asset groups" src="media/image47.png" style="width:1.55206in;height:1.40566in" />| Filter or highlight the map based on default and custom asset groups. See <a href="#viewhighlight-asset-groups">View/Highlight Asset Groups</a> and <a href="#define-custom-groups">Define Custom Groups</a> for details.<br /> |
| <img alt="Collapse view" src="media/image48.png" style="width:0.29688in;height:0.34635in" /> | <em> IT Collapse</em> view, to enable a focused view on OT assets, and group IT assets. See <a href="#view-ot-elements-only">View OT Elements Only</a> for details. |
| <img alt="Asset Management" src="media/image49.png" style="width:0.27083in;height:0.30208in" /> | Maintain current asset arrangement in the map. For example, if you drag assets to new locations on the map, the assets will remain in these locations when exiting the map. |
| <img alt="Fit to screen" src="media/image50.png" style="width:0.22918in;height:0.22918in" /> | Fit to screen |
| <img alt="Layer" src="media/image51.png" style="width:0.38537in;height:0.41661in" /> <br /><img alt="Layouts" src="media/image52.png" style="width:1.72083in;height:0.65069in" /> | - View the Purdue layer identified for this asset, including Automatic, Process Control, Supervisory and Enterprise <br /> - View connections between assets.|
| <img alt="Broadcast" src="media/image53.png" style="width:0.26786in;height:0.20833in" /> | Show/hide between Broadcast/Multicast. |
| <img alt="Time" src="media/image54.png" style="width:0.18751in;height:0.23612in" /> | Filter the assets on the map according to the time they last communicating with other assets. |
| <img alt="notifications" src="media/image55.png" style="width:0.29168in;height:0.25001in" /> | View notifications about an asset. For example, if a new IP was detected for an asset using an existing MAC address See <a herf="./working-with-asset-inventory-filters.md">Working with Asset</a> Notifications for details. |
| <img alt="Export" src="media/image56.png" style="width:0.16668in;height:0.20834in" /> | Export/Import asset information. |
| <img alt="properties" src="media/image57.png" style="width:0.18751in;height:0.22918in" /> | View basic asset properties for selected assets. |
| <img alt="Zoom In" src="media/image58.png" style="width:0.20833in;height:0.22135in" /> or <img alt="Zoom Out" src="media/image59.png" style="width:0.20833in;height:0.20833in" /> | Zoom in or out of assets in the map. See <a href="map-zoom-views.md">Map Zoom Views</a> for details about map view options. |


#### View OT elements only

By default, IT assets are automatically aggregated by subnet, so that the map view is focused on OT/ICS networks. The presentation of the IT network elements is collapsed to a minimum, which reduces the total number of the assets presented on the map and provides a clear picture of the OT/ICS network elements.

Each subnet is presented as a single entity on the Asset map, including an interactive collapsing/expanding capability to “drill down” into an IT subnet and back.

The figure below shows a collapsed IT subnet with 27 IT network elements.

:::image type="content" source="media/image60.png" alt-text="collapsed IT subnet with 27 IT network elements":::

To enable the IT networks collapsing capability:

- In the **System Setting** window, ensure that the IT Networks capability is enabled.

  :::image type="content" source="media/image61.png" alt-text="System Setting window":::

To expand an IT subnet:

1. To differentiate between the IT and OT networks, from **System Settings**, select **Subnets**.

   > [!NOTE]
   > It is recommended to name each subnet with meaningful names at the user can easily identify in order to differentiate between IT and OT networks.

   :::image type="content" source="media/image62.png" alt-text="Subnets Configuration":::

2. In the **Edit Subnets Configuration** window, clear **ICS Subnet** for each subnet that you want to define as an IT subnet. The IT subnets appear collapsed in the **Asset** map with the notifications for ICS Assets, such as a Controller or PLC, in IT networks.

   :::image type="content" source="media/image63.png" alt-text="Edit Subnets Configuration":::

3. To expand the IT network on the map, in the **Assets** window, right-click it and select **Expand Network**.

   :::image type="content" source="media/image64.png" alt-text="Expand Network":::

4. A confirmation box appears, notifying you that this action cannot be undone.

   :::image type="content" source="media/image65.png" alt-text="confirmation box":::

5. Select **OK**. The IT subnet elements appear on the map.

   :::image type="content" source="media/image66.png" alt-text="OK":::

To collapse an IT subnet:

1.  From the left pane, select **Assets**.

2. In the **Assets** window, select :::image type="content" source="media/image67.png)(the number in red indicates how many expanded IT subnets currently appear on the map" alt-text="indicate":::.

   :::image type="content" source="media/image68.png" alt-text="Asset window":::

3. Select the subnet(s) that you want to collapse or select **Collapse All**. The selected subnet appears collapsed on the map.

   :::image type="content" source="media/image69.png" alt-text="Collapse All":::

   The :::image type="content" source="media/image70.png" alt-text="icon"::: icon is displayed with the updated number of expanded IT subnets.

#### View/highlight asset groups

You can customize the map display based on asset *Groups,* for example groups of assets associated with a specific VLAN or subnet. Predefined groups are available and custom Groups can be created.

View groups by:

  - **Highlighting:** Highlight the assets that belong to a specific group in blue.

  - **Filtering:** Only display assets on the map only that belong to a specific group.

:::image type="content" source="media/image71.png" alt-text="Standard Port":::

The following predefined groups are available:

|                                                  |                                                                                                                                                                                                                                                                                              |
|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Known Applications/Non Standrad Ports/ (default)** | Assets that use reserved ports, such as TCP. Assets that use non-standard ports or ports that have not be assigned an alias. See [Customize Port Names](./customize-port-names.md) for details.                                                                                                                           |
| **OT Protocols (default)**                           | Assets that handle the OT traffic.                                                                                                                                                                                                                                                           |
| **Authorization (default)**                          | Assets that were discovered in the network during the learning process or were officially added to the network                                                                                                                                                                               |
| **Asset Inventory Filters**                          | Assets grouped according to the filters save in the Asset Inventory table, refer to [Working with Asset Inventory Filters](./working-with-asset-inventory-filters.md)                                                                                                                                                                     |
| **Polling Intervals**                                | Assets grouped by polling intervals. The polling intervals are generated automatically according to cyclic channels, or periods. For example, 15.0 seconds, 3.0 seconds, 1.5 seconds, Any interval. Reviewing this information helps you learn if systems are polling too quickly or slowly. |
| **Programming**                                      | Engineering Stations and Programmed Controllers                                                                                                                                                                                                                                              |
| **Subnets**                                          | Assets that belong to a specific subnet.                                                                                                                                                                                                                                                     |
| **VLAN**                                             | Assets associated with a specific VLAN ID.                                                                                                                                                                                                                                                   |
| **Connection between subnets**                       | Assets associated with cross subnet connection.                                                                                                                                                                                                                                              |
| **Pinned Alerts**                                    | Assets for which the user has pinned an alert.                                                                                                                                                                                                                                               |
| **Attack Vector Simulations**                        | Vulnerable assets detected in Attack Vector reports. In order to view these assets on the map, select the **Display on Asset Map** checkbox when generating the Attack Vector.  :::image type="content" source="media/image72.png" alt-text="Add Attack Vector Simulations":::                                                                                                                 |
| **Last Seen**                                        | Assets grouped by the time frame they were last seen, for example: 1 hour, 6 hours, 1 day, 7 days.                                                                                                                                                                                           |
| **Not In Active Directory**                          | All non-PLC assets that are not communicating with the Active Directory.                                                                                                                                                                                                                     |

To highlight/filter assets:

1. Select **Asset Map** on the side menu.

2. Select :::image type="content" source="media/image73.png" alt-text="Menu":::.

3. From the **Groups** pane, select the group you want to highlight/filter assets.

4. Select **Highlight**/**Filter**.

### Define custom groups

In addition to viewing predefined groups, you can define custom groups. The groups appear in the Asset Map, Asset Inventory and Data Mining Reports.

> [!NOTE]
> You can also create groups from the Asset Inventory.

To create a group:

1. Select **Assets** on the side menu. The Asset Map is displayed.

2. Select :::image type="content" source="media/image73.png" alt-text="Group Setting"::: to display the Groups settings.

3. Select :::image type="content" source="media/image74.png" alt-text="groups"::: to create a new custom group.

   :::image type="content" source="media/image75.png" alt-text="custom group":::

4. Add the name of the group, use up to 30 characters.

5. Select the relevant assets, as follows:

   - Add the assets from this menu by selecting them from the list (select on the arrow button),

   Or,

   - Add the assets from this menu by copying them from a selected group (select on the arrow button)

6. Select **Add group**.

#### Add assets to a custom group 

You can add assets to a custom group or create a new custom group and the asset.

1. Right-click an asset/s on the map.

2. Select **Add to group**.

3. Enter a group name in the **Group**s field and select :::image type="content" source="media/image76.png" alt-text="add":::. The new group appears. If the group already exists, it will be added to the existing custom group.

   :::image type="content" source="media/image77.png" alt-text="Group name":::

4. Add assets to a group by repeating steps 1-3.

### Map zoom views

Working with map views help expedite forensics when analyzing large networks.

Three asset detail views can be displayed:

  - [Bird’s-eye View](#birds-eye-view)

  - [Asset Type/Connection View](#asset-typeconnection-view)

  - [Detailed View](#detailed-view)

#### Bird’s-eye view

This view provides an at-a-glance view of assets represented as follows:

  - Red dots indicate assets with alert(s)

  - Starred dots indicate assets marked as important

  - Black dots indicate assets with no alerts

:::image type="content" source="media/image78.png" alt-text="Bird eye view":::

#### Asset type/connection view 

This view presents assets represented as icons on the map in order to highlight assets with alerts, asset types and connected assets.

  - Assets with alerts are displayed with a red ring

  - Assets without alerts are displayed with a grey ring

  - Assets displayed as a star were marked as important

The asset type icon is shown with connected assets.

:::image type="content" source="media/image79.png" alt-text="connection view":::

#### Detailed view 

The detailed view presents assets and asset labels and indicators with the following information:

:::image type="content" source="media/image44.png" alt-text="Detailed view":::

#### Control the zoom view

The map view displayed depends on the map zoom-level. Switching between the map views is done by changing the zoom levels.

:::image type="content" source="media/image80.png" alt-text="Control the zoom view":::

#### Enabling simplified zoom views

Administrators who want Security Analysts and Read Only users to access Brid’s-eye and Asset /Type Connection views, should enable the Simplified view option.

To enable simplified map views:

  - Select **System Settings** and then toggle the Simplified Map View option.

:::image type="content" source="media/image81.png" alt-text="zoom views":::

### Learn more about assets

An extensive range of tools are available to learn more about assets form the Asset Map:

- [Asset Labels and Indicators](#asset-labels-and-indicators)

- [Asset Quick Views](#asset-quick-views)

- [View and Manage Asset Properties](#view-and-manage-asset-properties)

- [View Asset Types](#view-asset-types)

- [Backplane](#backplane-properties)

- [View a Timeline of Events for the Asset](#view-a-timeline-of-events-for-the-asset)

- [Analyze Programming Details and Changes](#analyze-programming-details-and-changes)

- [Working with Asset Notifications](#working-with-asset-notifications)

#### Asset labels and indicators

The following labels and indicators may appear on assets on the map:

|                                 |                                                                                                                                                                       |
| --------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| :::image type="content" source="media/image82.png" alt-text="IP host":::          | IP host name and IP address, or subnet addresses                                                                                                                      |
| :::image type="content" source="media/image83.png" alt-text="Number of alerts":::          | Number of alerts associated with the asset                                                                                                                            |
| :::image type="content" source="#view-and-manage-asset-properties" alt-text="Asset type icon](media/image84.png)          | Asset type icon, for example Storage, PLC or Historian. See [View and Manage Asset Properties"::: for details about asset types detected and how to manually assign types. |
| :::image type="content" source="media/image85.png" alt-text="assets grouped":::          | Number of assets grouped in a subnet in an IT network. In this example 8.                                                                                             |
| :::image type="content" source="media/image86.png" alt-text="asset Learning period":::          | An asset that was detected after the Learning period and was not authorized as a network asset.                                                                       |
| Solid line | Logical connection between assets                                                                                                                                     |
| :::image type="content" source="media/image87.png" alt-text="New asset":::          | New asset discovered after Learning is complete.                                                                                                                      |

#### Asset quick views

Access asset properties and connections from the map.

To open the quick properties menu:

  - Select the quick properties menu :::image type="content" source="media/image88.png" alt-text="quick properties menu":::.

##### Quick asset properties

Select an asset or multiple assets while the Quick Properties screen is open to see the highlights of those assets:

:::image type="content" source="media/image89.png" alt-text="Quick Asset Properties":::

##### Quick connection properties

Select a connection while the Quick Properties screen is open to see the protocols that are utilized in this connection and when they were last seen:

:::image type="content" source="media/image90.png" alt-text="Quick connection properties":::

#### View and manage asset properties

You can view asset proprieties for each asset displayed on the map. For example, the asset name, type or operating system, or the firmware or vendor.

:::image type="content" source="media/image91.png" alt-text="View and manage asset properties":::

The following information can be updated manually. Information manually entered will override information discovered by Defender for IoT.

  - Name

  - Type

  - Operating System

  - Purdue Layer

  - Description

<table>
<thead>
<tr class="header">
<th>Item</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Basic Information</strong></td>
<td></td>
</tr>
<tr class="even">
<td><strong>Name</strong></td>
<td><p>The asset name.</p>
<p>By default, the sensor discovers the asset name as it defined in the network. For example, a name defined in the DNS server.</p>
<p>If no such names were defined, the asset IP address appears in this field.</p>
<p>You can change an asset name manually. It is recommended to give your assets meaningful names that reflect their functionality.</p></td>
</tr>
<tr class="odd">
<td><strong>Type</strong></td>
<td><p>The asset type detected by the sensor.</p>
<p>See <a href="#view-asset-types">View Asset Types</a>.</p></td>
</tr>
<tr class="even">
<td><strong>Vendor</strong></td>
<td>The asset vendor.</td>
</tr>
<tr class="odd">
<td><strong>Operating System</strong></td>
<td>The asset operating system.</td>
</tr>
<tr class="even">
<td><strong>Purdue Layer</strong></td>
<td><p>The Purdue layer identified by the sensor for this asset, including:</p>
<ul>
<li><p>Automatic</p></li>
<li><p>Process Control</p></li>
<li><p>Supervisory</p></li>
<li><p>Enterprise</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><strong>Description</strong></td>
<td><p>A free text field.</p>
<p>Add more information about the asset.</p></td>
</tr>
<tr class="even">
<td><strong>Attributes</strong></td>
<td><p>Any additional information that was discovered about the asset during the learning period and does not belong to other categories, appears in the Attributes section.</p>
<p>The information is read-only.</p></td>
</tr>
<tr class="odd">
<td><strong>Settings</strong></td>
<td><p>You can manually change asset settings to prevent false positives:</p>
<ul>
<li><p><strong>Authorized Asset:</strong> During the learning period, all the assets discovered in the network are identified as authorized assets. When an asset is discovered after the learning period, it appears as an Unauthorized asset by default. You can change this definition manually.</p></li>
<li><p><strong>Known as Scanner:</strong> Enable this option if you know that this asset is known as scanner and there is no need to alert you about it.</p></li>
<li><p><strong>Programming Asset:</strong> Enable this option if you know that this asset is known as a programming asset and there is no need to alert you about it.</p></li>
</ul></td>
</tr>
<tr class="even">
<td><strong>Custom Groups</strong></td>
<td>The custom groups in the Asset map in which this asset participates.</td>
</tr>
<tr class="odd">
<td><strong>State</strong></td>
<td><p>The security and the authorization status of the asset:</p>
<ul>
<li><p>The status is <strong>Secured</strong> when there are no alerts</p></li>
<li><p>When there are alerts about the asset, the number of alerts is displayed</p></li>
<li><p>The status <strong>Unauthorized</strong> is displayed for assets that were added to the network after the learning period. You can manually define the asset as <strong>Authorized Asset</strong> in the Settings area</p></li>
<li><p>In case the address of this asset is defined as a dynamic address, <strong>DHCP</strong> is added to the status. For more information about dynamic addresses, refer to <a href="./configure-dhcp-address-ranges.md">Configure DHCP Address Ranges</a>.</p></li>
</ul></td>
</tr>
<tr class="even">
<td><strong>Network</strong></td>
<td></td>
</tr>
<tr class="odd">
<td><strong>Interfaces</strong></td>
<td>The asset interfaces. A read-only field.</td>
</tr>
<tr class="even">
<td><strong>Protocols</strong></td>
<td>The protocols used by the asset. A read-only field.</td>
</tr>
<tr class="odd">
<td><strong>Firmware</strong></td>
<td></td>
</tr>
<tr class="even">
<td colspan="2">If Backplane information is available, firmware information will not be displayed.</td>
</tr>
<tr class="odd">
<td><strong>Address</strong></td>
<td>The asset IP address.</td>
</tr>
<tr class="even">
<td><strong>Serial</strong></td>
<td>The asset serial number.</td>
</tr>
<tr class="odd">
<td><strong>Module Address</strong></td>
<td>The asset model/slot number or ID.</td>
</tr>
<tr class="even">
<td><strong>Model</strong></td>
<td>The asset model number.</td>
</tr>
<tr class="odd">
<td><strong>Firmware Version</strong></td>
<td>The firmware version number.</td>
</tr>
</tbody>
</table>

To view the asset information:

1. Select **Assets** on the side menu.

2. Right-click an asset and select **View Properties**. The **Asset Properties** window is displayed.

3. Select on the required alert at the bottom of this window to view detailed information about alerts for this asset.

#### View asset types

The Asset Type is automatically identified by the sensor during the asset discovery process. You can change the type manually.

:::image type="content" source="media/image92.png" alt-text="View Asset Types":::

The following table presents all the types in the system:

<table>
<thead>
<tr class="header">
<th>Category</th>
<th>Asset Type</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>ICS</strong></td>
<td><ul>
<li><p>Engineering Station</p></li>
<li><p>PLC</p></li>
<li><p>Historian</p></li>
<li><p>HMI</p></li>
<li><p>IED</p></li>
<li><p>DCS Controller</p></li>
<li><p>RTU</p></li>
<li><p>Industrial Packaging System</p></li>
<li><p>Industrial Scale</p></li>
<li><p>Industrial Robot</p></li>
<li><p>Slot</p></li>
<li><p>Meter</p></li>
<li><p>Variable Frequency Drive</p></li>
<li><p>Robot Controller</p></li>
<li><p>Servo Drive</p></li>
<li><p>Pneumatic Device</p></li>
<li><p>Marquee</p></li>
</ul></td>
</tr>
<tr class="even">
<td><strong>IT</strong></td>
<td><ul>
<li><p>Domain Controller</p></li>
<li><p>DB Server</p></li>
<li><p>Workstation</p></li>
<li><p>Server</p></li>
<li><p>Terminal Station</p></li>
<li><p>Storage</p></li>
<li><p>Smart Phone</p></li>
<li><p>Tablet</p></li>
<li><p>Backup Server</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><strong>IoT</strong></td>
<td><ul>
<li><p>IP Camera</p></li>
<li><p>Printer</p></li>
<li><p>Punch Clock</p></li>
<li><p>ATM</p></li>
<li><p>Smart TV</p></li>
<li><p>Game console</p></li>
<li><p>DVR</p></li>
<li><p>Door Control Panel</p></li>
<li><p>HVAC</p></li>
<li><p>Thermostat</p></li>
<li><p>Fire Alarm</p></li>
<li><p>Smart Light</p></li>
<li><p>Smart Switch</p></li>
<li><p>Fire Detector</p></li>
<li><p>IP Telephone</p></li>
<li><p>Alarm System</p></li>
<li><p>Alarm Siren</p></li>
<li><p>Motion Detector</p></li>
<li><p>Elevator</p></li>
<li><p>Humidity Sensor</p></li>
<li><p>Barcode Scanner</p></li>
<li><p>Uninterruptable Power Supply</p></li>
<li><p>People Counter System</p></li>
<li><p>Intercom</p></li>
<li><p>Turnstile</p></li>
</ul></td>
</tr>
<tr class="even">
<td><strong>Network</strong></td>
<td><ul>
<li><p>Wireless Access Point</p></li>
<li><p>Router</p></li>
<li><p>Switch</p></li>
<li><p>Firewall</p></li>
<li><p>VPN Gateway</p></li>
<li><p>NTP Server</p></li>
<li><p>Wifi Pineapple</p></li>
<li><p>Physical Location</p></li>
<li><p>I/O Adapter</p></li>
<li><p>Protocol Converter</p></li>
</ul></td>
</tr>
</tbody>
</table>

To view the asset information:

1.  Select **Assets** on the side menu.

2. Right-click an asset and select **View Properties**. The **Asset Properties** window is displayed.

3. Select on the required alert at the bottom of this window to view detailed information about alerts for this asset.

#### Backplane properties

If a PLC contains multiple modules separated into racks and slots, the characteristics might vary between the module cards. For example, if the IP and the MAC are the same, the firmware might be different.

You can use the Backplane option to review multiple controllers/cards and their nested assets as one entity with a variety of definitions. Each slot in the Backplane view represents the underlying assets – the assets that were discovered behind it.

:::image type="content" source="media/image93.png" alt-text="Backplane Properties":::

:::image type="content" source="media/image94.png" alt-text="Backplane Asset Properties":::

A backplane can contain up to 30 controller cards and up to 30 rack units. The total number of assets included in the multiple levels can be up to 200 assets.

The Backplane pane is shown in the Asset Properties window when Backplane details are detected.

Each slot appears with the number of underlying assets and the icon that shows the module type.

| Icon                                                                                                                                                                                                                                                               | Module Type           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| :::image type="content" source="media/image95.png" alt-text="Power Supply":::     | Power Supply          |
| :::image type="content" source="media/image96.png" alt-text="Analog I/O":::   | Analog I/O            |
| :::image type="content" source="media/image97.png" alt-text="Communication Adapter":::      | Communication Adapter |
| :::image type="content" source="media/image98.png" alt-text="Digital I/O":::    | Digital I/O           |
| :::image type="content" source="media/image99.png" alt-text="CPU":::    | CPU                   |
| :::image type="content" source="media/image100.png" alt-text="HMI":::   | HMI                   |
| :::image type="content" source="media/image101.png" alt-text="Generic"::: | Generic               |

When you select a slot, the slot details appear:

:::image type="content" source="media/image102.png" alt-text="select a slot":::

To view the underlying assets behind the slot, select VIEW ON MAP. The slot is presented in the Asset map with all the underlying modules and assets connected to it.

:::image type="content" source="media/image103.png" alt-text="VIEW ON MAP":::

#### View a timeline of events for the asset

View a timeline of events associated with an asset.

To view the timeline:

1. Right-click an asset from the map.

2. Select **Show Events**. The Event Timeline window opens with information about events detected for the selected asset.

See [Event Timeline](#event-timeline) for details.

### Analyze programming details and changes

Enhance forensics by displaying programming events carried out on your network assets and analyzing code changes. This information helps you discover suspicious programming activity, for example:

  - Human Error: An engineer is programming the wrong device.

  - Corrupted programming automation: Programming is erroneously carried out because of automation failure.

  - Hacked systems: Unauthorized users logged into a programming asset.

You can display a programmed asset and scroll through various programming changes carried out on it by other assets.

View code that was added, changed, removed or unchanged by the programming asset. Search for programming changes based on file types or dates/times of interest.

#### When to review programming activity 

You may need to review programming activity:

  - After viewing an alert regarding unauthorized programming

  - After a planned update to controllers

  - When a process or machine is not working correctly (to see who carried out the last update and when)

:::image type="content" source="media/image104.png" alt-text="Programing Change Log":::

Additional options let you:

  - Mark events of interest with a star.

  - Download a txt. file with the current code.

#### About authorized vs unauthorized programming events 

*Unauthorized* programming events are carried out by assets that have not been learned or manually defined as programming assets. *Authorized* programming events are carried out by assets that were resolved or manually defined as programming assets.

The Programming Analysis Window displays both authorized and unauthorized programming events.

#### Accessing programming details and changes

Access the Programming Analysis window from the:

- [Event Timeline](#event-timeline)

- [Unauthorized Programming Alerts](#unauthorized-programming-alerts)

#### Event timeline

Use the Event Timeline to display a timeline of events in which programming changes were detected.

:::image type="content" source="media/image105.png" alt-text="Event Timeline":::

#### Unauthorized programming alerts

Alerts are triggered when unauthorized programming assets carry out programming activities.

:::image type="content" source="media/image106.png" alt-text="Unauthorized programming alerts":::

> [!NOTE]
> You can also view basic programming information in the Device Properties window and Asset Inventory. See [Asset Programming Information: Additional Locations](#asset-programming-information-additional-locations) for details.

#### Working in the programming timeline window

This section describes how to view programming files and compare versions. Search for specific files sent to a programmed asset. Search for files based on:

  - Date

  - File type

:::image type="content" source="media/image107.png" alt-text="programming timeline window":::

The Programming Timeline includes the following information.

<table>
<thead>
<tr class="header">
<th>Programmed Asset</th>
<th>Provides details about the asset that was programmed, including the hostname and file.</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Recent Events</td>
<td><p>Displays the 50 most recent events detected by the sensor.</p>
<p>To highlight an event, hover over it and click the star. <img alt ="star" src="media/image108.png" style="width:0.21667in;height:0.20764in" /></p>
<p>The last 50 events can be viewed.</p></td>
</tr>
<tr class="even">
<td>Files</td>
<td><p>Displays the files detected for the chosen date and the file size on the programmed asset.</p>
<p>By default, the maximum number of files available for display per asset is 300.</p>
<p>By default, the maximum file size for each file is 15MB</p></td>
</tr>
<tr class="odd">
<td><p>File status</p>
<p><img alt="File status" src="media/image109.png" style="width:1.63542in;height:0.72917in" /></p></td>
<td><p>File labels indicate the status of the file on the asset, including:</p>
<p><strong>Added:</strong> the file was added to the endpoint on the date/time selected.</p>
<p><strong>Updated:</strong> The file was updated on the date/time selected.</p>
<p><strong>Deleted:</strong> This file was removed.</p>
<p><strong>No label:</strong> The file was not changed.</p></td>
</tr>
<tr class="even">
<td>Programming Asset</td>
<td>The asset that made the programming change. Multiple assets may have carried out programming changes on one programmed asset. The hostname, date/time of change and logged in user are displayed.</td>
</tr>
<tr class="odd">
<td><img alt="Current" src="media/image110.png" style="width:0.52077in;height:0.21872in" /></td>
<td>Displays the current file installed on the programmed asset.</td>
</tr>
<tr class="even">
<td><img alt="Download text" src="media/image111.png" style="width:0.24997in;height:0.36454in" /></td>
<td>Download a text file of the code displayed.</td>
</tr>
<tr class="odd">
<td><img alt="compare" src="media/image112.png" style="width:0.66658in;height:0.52077in" /></td>
<td>Compare the current file with the file detected on a selected date.</td>
</tr>
</tbody>
</table>

#### Choose a File to Review

This section describes how to choose a file to review.

To choose a file to review:

1. Select an event from the **Recent Events** pane


2. Select a file form the **File** pane. The file appears in the **Current** pane.

   :::image type="content" source="media/image113.png" alt-text="Select file":::

#### Compare Files

This section describes how to compare programming files.

To compare:

1. Select an event from the **Recent Events** pane.

2. Select a file from the **File** pane. The file appears in the **Current** pane. You can compare this file to other files.

3. Select the compare indicator.

   :::image type="content" source="media/image112.png" alt-text="Compare indicator":::

   The window displays all dates the selected file was detected on the programmed asset. The file may have been updated on the programmed asset by multiple programming assets.

   The number of differences detected appears in the upper right-hand corner of the window. You may need to scroll down to view differences.

   :::image type="content" source="media/image114.png" alt-text="scroll down":::

   The number is calculated by adjacent lines of changed text. For example, if 8 consecutive lines of code were changed (deleted, updated or added) this will be calculated as 1 difference.

   :::image type="content" source="media/image115.png" alt-text="Programing timeline":::

4. Select a date. The file detected on the selected date appears in the window.

5. The file selected from the **Recent Events /Files** pane always appears on the right.

#### Asset programming information: additional locations

In addition to reviewing details in the Programming Timeline, you can access programming information in the Asset Properties window and the Asset Inventory.


|                     |                                                                                                        |
|---------------------|--------------------------------------------------------------------------------------------------------|
| Asset Properties    | The Asset Properties window provides information on the last programming event detected on the asset\. :::image type="content" source="media/image116.png" alt-text="Asset Properties":::|
| The Asset Inventory | The Asset Inventory indicates if the asset is a programming asset\.                                    :::image type="content" source="media/image117.png" alt-text="The Asset Inventory":::|



## Manage asset information from the map 

The sensor does not update or impact assets directly on the network. Changes made here only impact how analyzes the asset.

### Delete assets 

You may want to delete an asset if the information learned is not relevant. For example,

  - A third-party contractor at an engineering workstation connects to perform configuration updates. After the task is completed, the device should no longer be monitored.

  - Due to changes in the network, some devices are no longer connected.

If you do not delete the asset, the sensor will continue monitoring it. After 60 days, a notification will appear, recommending that you delete.

You may receive an alert indicating that the asset is unresponsive if another device tries to access it. In this case, your network may be misconfigured.

The asset will be removed from the Asset Map, Asset Inventory and Data Mining reports. Other information, for example: information stored in Widgets will be maintained.

The asset must be active for at least 10 minutes to delete it.

To delete an asset from the asset map:

1. Select **Assets** on the side menu.

2. Right-click an asset and select **Delete**.

### Merge assets

Under certain circumstances you may need to *merge* assets. This may be required if the sensor discovered separate network entities which are one unique asset. For example,

  - A PLC with 4 network cards

  - A Laptop with WIFI and physical card  

When merging you instruct The sensor to combine the asset properties of two assets into one. When you do this, the Asset Properties window and sensor reports will be updated with the new asset property details.

For example, if you merge two assets with an IP, both IPs will appear as separate interfaces in the Device Properties window. You can only merge authorized assets.

:::image type="content" source="media/image131.png" alt-text="Device Properties window":::

The Event Timeline presents the merge event.

:::image type="content" source="media/image132.png" alt-text="Event Timeline":::

You cannot undo an asset merge. If you mistakenly merged two assets, delete the asset and wait for The sensor to rediscover both.

To merge assets:

1. Select 2 assets and right-click one of them.

2. Select **Merge** to merge the assets. It can take up to 2 minutes complete the merge.

3. In the Set merge device attributes dialog box choose an asset name.

   :::image type="content" source="media/image133.png" alt-text="attributes dialog box":::

4. Select **Save**.

### Authorize/unauthorize assets

During the Learning period, all the assets discovered in the network are identified as authorized assets. The **Authorized** label does not appear on these assts in the Asset Map.

When an asset is discovered after the Learning period it appears as an **Unauthorized** asset. In addition to seeing unauthorized assets in the map you can also see them in the Asset Inventory.

:::image type="content" source="media/image134.png" alt-text="Asset Inventory":::

**New Asset vs Unauthorized**

New assets detected after the Learning period will appear with **New** and **Unauthorized** label.

If you move an asset on the map or manually change the asset properties, the **New** label is removed from the asset icon.

#### Unauthorized assets - attack vectors and risk assessment reports

Unauthorized assets are calculated included in Risk Assessment reports and Attack Vectors reports.

- **Attack Vector Reports:** Assets marked as *Unauthorized* are resolved in the Attack Vector as suspected rogue devices that might be a threat to the network.

   :::image type="content" source="media/image135.png" alt-text="Attack Vector Reports":::

- **Risk Assessment Reports:** Assets marked as *Unauthorized* are:

  - Identified in Risk Assessment Reports

To authorize/Unauthorize assets manually:

1. Right-click the asset on the map and select **Unauthorize**

### Mark assets as important

You can mark significant network assets as *Important*, for example business critical servers. These assets are marked with a star on the map. The star varies according to the Map zoom level.

:::image type="content" source="media/image138.png" alt-text="Map zoom](media/image136.png) ![Star](media/image137.png) ![Map":::

#### Important assets - attack vectors and risk assessment reports

Important assets are calculated when generating Risk Assessment reports and Attack Vectors reports.

  - Attack Vector Reports Assets marked as *Important* are resolved in the Attack Vector as Attack Targets. See [Attack Vectors](./attack-vectors.md) for details about the report.

  - Risk Assessment Reports: Assets marked as *Important* are calculated when providing the security score in the Risk Assessment report.

## Generate reports from the map

### Activity reports

Generate an activity report for a selected asset over the 1,6,12 or 24 hours. The following information is available:

  - Category: Basic detection information based on traffic scenarios.

  - Source/Destination assets

  - Data: Additional information defected.

  - The time/date last seen.

You can save the report as a Microsoft Excel or Word file.

:::image type="content" source="media/image139.png" alt-text="Recent activity":::

To generate an activity report for an asset:

1. Right-click an asset from the Map.

2. Select an Activity Report.

   :::image type="content" source="media/image140.png" alt-text="Activity report":::

### Attack vector reports

Simulate an Attack Vector report to learn if an asset on the map you select is a vulnerable attack target.

Attack Vector reports provide a graphical representation of a vulnerability chain of exploitable assets. These vulnerabilities can give an attacker access to key network assets. The Attack Vector simulator calculates attack vectors in real-time and analyzes all attack vectors per a specific target. See [Attack Vectors](./attack-Vectors.md) for details about Attack Vector reports.

To view an asset in an Attack Vector reports:

1. Right-click an asset from the map.

2. Select **Simulate Attack Vectors**. The Attack Vector dialog box opens with the asset you select as the attack target.

   :::image type="content" source="media/image141.png" alt-text="Add attack vector simulation":::

3. Add the remaining parameters to the dialog box and select **Add Simulation**.

### Export asset information

Export the following asset information from the Map.

  - Asset details (Microsoft Excel)

  - An asset summary (Microsoft Excel)

  - A word file with groups (Microsoft Word)

To export:

1. Select the :::image type="content" source="media/image142.png" alt-text="icon"::: icon from the Map.

2. Select an export option.

## Gain insight into Global, Regional and Local Threats

### The Central Manager Map

With CyberX Central Manager you can plan how to achieve full security coverage by dividing your network into geographical and logical segments that reflect your business typology.

- **Geographical Facility Level:** A **Site** is a number of assets grouped according to geographical location presented on the map. By default, CyberX provides you with a world map. You can change it to the map relevant to your organization: a country map, a city map and so on. The map is empty by default. You need to add sites to the map to reflect your company structure.

  For example, there is a company with five physical sites, Toronto, New York, Berlin, Moscow, and Florence. All five sites were added to the map by the CyberX admin. When the site color changes on the map, it provides the SOC team with indication of critical system status at a glance.

  The map is interactive and enables opening each site and drilling down into this site's info.

- **Global Logical Layer:** A **Business Unit** is a way to divide the organization into logical sections according to specific industry fields. This is how you can reflect your business topology on the enterprise map.

  For example, a global company that contains glass factories, plastic factories, and automobile factories can be managed as three different business units, while a single site may contain all three business units. A physical site located in Toronto includes 3 different glass production lines, a plastic production line, and a truck engine production line. So, this site has representatives of all three business units.

- **Geographical Region Level:** A **Region** is a way to divide the global organization into geographical regions. For example, North America, Western Europe, Eastern Europe. North America has factories from all three Business Units; Western Europe has automobile factories and glass factories, and Eastern Europe only plastic factories.

  The Toronto site is in the North America region.

- **Local Logical Segment Level:** A **Zone** is a logical section within a site defined according to user-defined characteristics such as functional areas/production lines/controller types, to allow enforcement of security policies relevant to the zone definition. For example, the Toronto site contains 5 production lines that can be defined as 5 zones. The 3 glass production lines are 3 zones related to the glass business unit, the plastic production line is a zone within the plastic business unit and the truck engine production line is a zone within the automobile business unit.

- **Local View Level:** A single CyberX installation that provides insight into the operational and security status of the assets connected CyberX.

### Understanding the Map Views

The CyberX Central Manager provides an overall view of your industrial network in a context-related map. The general map view presents the global map of your organization with geographical location of each site.

:::image type="content" source="media/image9.png" alt-text="Screenshot of Enterprise Map View":::

In addition to the general map view, you can switch to filtered map views that pinpoint problems in your network. In the general map view, all the sites are presented in gray. In other views, the sites are presented according to the following color scheme:

- **Green**: The number of security events detected by CyberX is below the threshold defined by CyberX security experts for your system. No need to take any action at this stage.

- **Yellow**: The number of security events detected by CyberX is equal to the threshold defined by CyberX security experts for your system. Consider checking the situation.

- **Red**: The number of security events is beyond the threshold defined by CyberX security experts for your system. You must take immediate action.

An immediate view into problematic sites allows you to focus on the important issues and better prioritize your actions, as follows:

- **Risk Management:** The Vulnerability Assessment view displays information on site vulnerability rating. This assists you in prioritizing prevention activities and building a road map to plan improvements in OT network security.

- **Incident Response:** A centralized view of all unacknowledged alerts on each site across the enterprise, with the ability to drill down and manage alerts of a specific site.

:::image type="content" source="media/image10.png" alt-text="Screenshot of Enterprise Map View with Incident Response":::

- **Malicious Activity:** If malware was detected, the site appears in red, which means you must take immediate action.

:::image type="content" source="media/image11.png" alt-text="Screenshot of Enterprise Map View with Malicious Activity":::

- **Operational Alerts:** OT system operational alerts map view provides a better understanding of which OT system might experience operational incidents, such as PLC stops, Firmware upload, program upload and so on.

:::image type="content" source="media/image12.png" alt-text="Screenshot of Enterprise Map View with Operational Alerts":::

**To switch between the map views:**

- Select an option from the drop-down list. The Site Map view changes according to your choice.

:::image type="content" source="media/image13.png" alt-text="Screenshot of Site Map Default View":::