---
title: Enrich asset information
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/10/2020
ms.topic: article
ms.service: azure
---

#

## Configure DNS servers for reverse lookup resolution

Configure DNS servers for reverse lookup resolution 

To enhance asset enrichment in, you can configure multiple DNS servers to carryout reverse lookups. This lets you resolve host names or FQDNs associated with the IPs detected in network subnets. For example, if a sensor discovers an IP it may query multiple DNS servers for to resolve the hostname.

All CIDR formats are supported.

Hostname appears in the Asset Inventory and Asset Map, as well as reports.

You can schedule reverse lookup resolution schedules at specific in hourly intervals, for example every 12 hours, or at a specific time.

**To define DNS servers:**

1. Select **System Settings** and then select **DNS Settings.**

2. Select **Add DNS Server**.

    :::image type="content" source="media/how-to-enrich-asset-information/image302.png" alt-text="Add DNS Server":::

3. In the Schedule Reverse DNS Lookup field chose either:

    - intervals (per hour)
    
    - a specific time (use European formatting, 14:30 and not 2:30 PM)

4. In the **DNS Server Address** field, enter the DNS IP address

5. In the **DNS Server Port** field, enter the DNS port.

6. Resolve network IP addresses to asset FQDNs. Add the number of domain labels to display in **Number of Labels** field. Up to 30 characters are displayed from left to right.

7. Enter the Subnets you want the DNS server to query in the **Subnets** field.

8. Select the **Enable** toggle if you want to initiate the reverse lookup.

### Test the dns configuration 

Verify the settings you defined work properly using a test asset.

**To test:**

1. Enable the DNS Lookup toggle.

2. Select **Test**.

3. Enter an address in the **Lookup Address** of the DNS Reverse Lookup test For Server dialog box.

    :::image type="content" source="media/how-to-enrich-asset-information/image303.png" alt-text="Lookup Address":::

4. Select **Test.**

## Working with Asset Notifications

Notifications provide information about network activity that may require your attention, as well as recommendations for handling this activity. For example, you may receive a notification regarding:

  - An inactive asset. If the asset is no longer a part of your network, you can remove it. If the asset is inactive, for example because it is mistakenly disconnected from the network; reconnect the asset and dismiss the notification.

  - An IP address was detected on an asset currently identified by a MAC address only. Respond by authorizing the IP for the asset.

Responding to notifications improves the information provided in the Asset Map, Asset Inventory, Data Mining queries and reports, and provides insight into legitimate network changes and potential network misconfigurations.

### Notifications vs Alerts

In addition to receiving notifications on network activity, you may also receive *alerts*. Notifications provide information about network changes or unresolved asset properties that do not present a threat. Alerts provide information about network deviations and changes that may present a threat to the network.

To view notifications:

1. Select **Asset Map** from the Console left menu pane.

2. Select the **Notifications** icon. The red number above the icon indicates the number of notifications.

   :::image type="content" source="media/how-to-enrich-asset-information/image118.png" alt-text="Notification icons":::

   The Notifications window displays all notifications detected by the Senor.

   :::image type="content" source="media/how-to-enrich-asset-information/image119.png" alt-text="Notifications":::

### Filter the notifications window

Use search filters to display notifications of interest to you.

:::image type="content" source="media/how-to-enrich-asset-information/image120.png" alt-text="Search filters":::

| | |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Filter by type              | View notifications that cover a specific area of interest, for example only notifications for inactive assets. See [Notification Events and Responses](#notification-events-and-responses) for details about notifications and responding to them. |
| Filter by date range        | Display notifications that cover a specific time range, for example, notifications sent over the last week only.                                                                                                   |
| Search specific information | Search for specific notifications.                                                                                                                                                                                 |

### Notification events and responses 

This section describes the notification event types you may receive, as well as the options for handling them. You can update the asset information with a recommended value or dismiss the notification. When dismissing, the asset information is not updated with the recommended information. If traffic is detected again, the notification will be resent.

| Notification Event Types | Description | Responses  |
|--|--|--|
| New IPs | A new IP is associated with the asset. 5 scenarios may be detected: <br /><br /> 1. An additional IP address was associated with an asset. This asset is also associated with an existing MAC address.<br /><br />2. A new IP address was detected for an asset using an existing MAC address. Currently the asset does not communicate using an IP.<br /> <br />3. A new IP address was detected for the asset using a NetBIOS name. <br /><br />4. An IP address was detected as the management interface for an asset associated with a MAC address. <br /><br />5. A new IP address was detected for an asset using a virtual IP.| **Set Additional IP to Asset** <br /> See <a href="./manage-asset-information-from-the-map.md#merge-assets">Merge Assets</a> for information about associating two IPs with an asset. <br /> <br />**Replace Existing IP** <br /> <br /> **Dismiss**<br /> Remove the notification.|
| Inactive Assets | Traffic was not detected on an asset for more than 60 days. | **Delete** If this asset is not part of your network, remove it. See <a href="./manage-asset-information-from-the-map.md#delete-assets">Delete Assets</a> for information about asset deletion. <br /><br />**Dismiss** Remove the notification if the asset is part of your network. If the asset is inactive, for example because it is mistakenly disconnected from the network, dismiss the notification, and reconnect the asset.|
| New OT Asset | A subnet includes an OT asset, that is not defined in an ICS subnet. <br /><br /> Each subnet that contains at least one OT asset can be defined as an ICS subnet. This helps differentiate between OT and IT assets on the map. | **Set as ICS Subnet** <br /> <br /> **Dismiss** <br />Remove the notification if the asset is not part of the subnet.|
| No Subnets Configured | No subnets are currently configured in your network. <br /><br /> It is recommended to configure subnets for better representation in the map and the ability to differentiate between OT and IT assets.| **Open Subnets Configuration** and configure subnets. <br /><br />**Dismiss** Remove the notification.|
| Operating System Changes | One or more new operating systems have been associated with the asset. | Select the name of the new Operating System you want to associate with the asset.<br /><br /> **Dismiss** Remove the notification.|
| Subnets Were Detected | New subnets were discovered. | **Learn**<br />Automatically Add the subnet.<br />**Open Subnet Configuration**<br />Add all missing subnet information.<br />**Dismiss**<br />Remove the notification. |
| Asset Type Change Was Detected | A new asset type has been associated with the asset. | **Set as {…}**<br />Associate the new type with the asset.<br />**Dismiss**<br />Remove the notification. |

### Respond to many notification simultaneously 

You may need to handle several notifications simultaneously, for example if:

  -  IT performed an OS upgrade to a large set of network servers, you can instruct the sensor to learn the new server versions for all upgraded servers. 

  - a group of assets in a certain line was phased-out and are not active anymore, you can instruct the sensor to remove these assets from the Console.

You can instruct the sensor to apply newly detected information to multiple assets or ignore it.   

To display notifications and handle notifications:

1. Use the *Filter by type, date range* options or the **Select All** option. Deselect notifications as required.

   :::image type="content" source="media/how-to-enrich-asset-information/image121.png" alt-text="Notifications 48":::

2. Instruct the sensor to apply newly detected information to selected assets by selecting LEARN. Alternatively, instruct the sensor to ignore newly detected information by selecting DISMISS.  The number of notifications you can simultaneously Learn and Dismiss, as well as the number of notifications you must handle individually is shown.

**New IPs** and **No Subnets** **configured** events cannot be handled simultaneously. They require manual confirmation.

:::image type="content" source="media/how-to-enrich-asset-information/image122.png" alt-text="Set additional IP":::

### Improve asset OS classification – data enhancement 

The sensor continuously auto-discovers new OT assets, as well as changes to previously discovered assets including operating system types.

Under certain circumstances, conflicts may be detected in discovered operating systems. This may happen because you have an OS version that may refer to either desktop or server systems. If it happens, you will receive a notification with optional OS classifications.

:::image type="content" source="media/how-to-enrich-asset-information/image123.png" alt-text="Enhance data":::

You should investigate the recommendations in order to enrich OS classification. This information appears in the Asset Inventory, data mining reports, and other displays and may also improve the accuracy of alerts, threats and risk analysis.

When you accept a recommendation, the OS type information will be updated in the sensor.

To access notifications:

  - Select **System Settings** and then select **Data Enhancement**.

## Enhance port and VLAN names resolution

### Customize port names

Defender for IoT automatically assigns names to most universally reserved ports. For example, DHCP or HTTP. You can customize port names for other ports detected.

For example, assign a name to a non-reserved port because that port shows unusually high activity.

These names appear when:

  - Selecting Asset groups from the Asset Map.

  - Creating widgets that provide port information.

#### View custom port names in the asset map

Ports that include a name defined by users appear in the Asset Map in the **Known Applications** group.

:::image type="content" source="media/how-to-enrich-asset-information/image286.png" alt-text="Known Applications":::

#### View custom port names in widgets

Port names you defined appear in the widgets that cover traffic by port.

:::image type="content" source="media/how-to-enrich-asset-information/image287.png" alt-text="cover traffic":::

**To define custom port names:**

1. Select **System Settings** and then select **Standard Aliases.**

2. Select **Add Port Alias**.

    :::image type="content" source="media/how-to-enrich-asset-information/image288.png" alt-text="Add Port Alias":::

3. Enter the port number, **TCP/UDP** or **Both** and add the name.

4. Select **Save.**

### Configure VLAN names

You can enrich Asset Inventory data with asset VLAN numbers and tags. In addition to data enrichment, you can view the number of assets per VLAN and Bandwidth by VLAN widgets.

VLANs support is based on 802.1q (up to VLAN ID 4094).

Two methods are available for retrieving VLAN information:

  - **Automatically discovered:** By default, VLANs are automatically discovered by the sensor. VLANs detected with traffic are displayed in the VLAN configuration screen and in Data Mining and other reports that contain VLAN information. Unused VLANs are not displayed. You cannot edit or delete these VLANs. It is recommended to add a unique name to each VLAN. If you don’t add a name, the VLAN number appears in all the locations where the VLAN is reported.

  - **Manually added:** You can add VLANs manually. You must add a unique name for each VLAN that was manually added, and you can edit/delete these VLANs.

VLAN names can contain up to 50 ASCII characters.

> [!NOTE]
> VLAN names are not synchronized between the sensor and the Management console. You need to define the name separately on both.  
For Cisco switches, the following line should be added to the span configuration:  
`monitor session 1 destination interface XX/XX encapsulation dot1q.`  
where XX/XX is the name and number of the port.

**To configure VLANs:**

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **VLAN**.

    :::image type="content" source="media/how-to-enrich-asset-information/image289.png" alt-text="System Settings":::

3. Add a unique name next to each VLAN ID.