---
title: Work with device notifications
description: Notifications provide information about network activity that might require your attention, along with recommendations for handling this activity.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/12/2020
ms.topic: how-to
ms.service: azure
---

# Work with device notifications

Notifications provide information about network activity that might require your attention, along with recommendations for handling this activity. For example, you might receive a notification about:

- An inactive device. If the device is no longer a part of your network, you can remove it. If the device is inactive, for example because it's mistakenly disconnected from the network, reconnect the device and dismiss the notification.

- An IP address was detected on a device that's currently identified by a MAC address only. Respond by authorizing the IP address for the device.

Responding to notifications improves the information provided in the device map, device inventory, and data-mining queries and reports. It also provides insight into legitimate network changes and potential network misconfigurations.

**Notifications vs. alerts**

In addition to receiving notifications on network activity, you might receive *alerts*. Notifications provide information about network changes or unresolved device properties that don't present a threat. Alerts provide information about network deviations and changes that might present a threat to the network.

To view notifications:

1. Select **Device Map** from the console's left menu pane.

2. Select the **Notifications** icon. The red number above the icon indicates the number of notifications.

   :::image type="content" source="media/how-to-enrich-asset-information/notifications-alert-screenshot.png" alt-text="Notification icon.":::

   The **Notifications** window displays all notifications that the sensor has detected.

   :::image type="content" source="media/how-to-enrich-asset-information/notification-screen.png" alt-text="Notifications.":::

## Filter the Notifications window

Use search filters to display notifications of interest to you.

| Filter by | Description |
|--|--|
| Filter by type | View notifications that cover a specific area of interest. For example, view only notifications for inactive devices. |
| Filter by date range | Display notifications that cover a specific time range. For example, view notifications sent over the last week only. |
| Search for specific information | Search for specific notifications. |

## Notification events and responses

The following table describes the notification event types you might receive, along with the options for handling them. You can update the device information with a recommended value or dismiss the notification. When you dismiss a notification, the device information is not updated with the recommended information. If traffic is detected again, the notification will be re-sent.

| Notification event types | Description | Responses |
|--|--|--|
| New IP detected | A new IP address is associated with the device. Five scenarios might be detected: <br /><br /> An additional IP address was associated with a device. This device is also associated with an existing MAC address.<br /><br /> A new IP address was detected for a device that's using an existing MAC address. Currently the device does not communicate by using an IP address.<br /> <br /> A new IP address was detected for a device that's using a NetBIOS name. <br /><br /> An IP address was detected as the management interface for a device associated with a MAC address. <br /><br /> A new IP address was detected for a device that's using a virtual IP address. | **Set Additional IP to Device** (merge devices) <br /> <br />**Replace Existing IP** <br /> <br /> **Dismiss**<br /> Remove the notification. |
| Inactive devices | Traffic was not detected on a device for more than 60 days. | **Delete** <br /> If this device is not part of your network, remove it. <br /><br />**Dismiss** <br /> Remove the notification if the device is part of your network. If the device is inactive (for example, because it's mistakenly disconnected from the network), dismiss the notification and reconnect the device. |
| New OT devices | A subnet includes an OT device that's not defined in an ICS subnet. <br /><br /> Each subnet that contains at least one OT device can be defined as an ICS subnet. This helps differentiate between OT and IT devices on the map. | **Set as ICS Subnet** <br /> <br /> **Dismiss** <br />Remove the notification if the device is not part of the subnet. |
| No subnets configured | No subnets are currently configured in your network. <br /><br /> Configure subnets for better representation in the map and the ability to differentiate between OT and IT devices. | **Open Subnets Configuration** and configure subnets. <br /><br />**Dismiss** <br /> Remove the notification. |
| Operating system changes | One or more new operating systems have been associated with the device. | Select the name of the new OS that you want to associate with the device.<br /><br /> **Dismiss** <br /> Remove the notification. |
| New subnets | New subnets were discovered. | **Learn**<br />Automatically add the subnet.<br />**Open Subnet Configuration**<br />Add all missing subnet information.<br />**Dismiss**<br />Remove the notification. |
| Device type changes | A new device type has been associated with the device. | **Set as {…}**<br />Associate the new type with the device.<br />**Dismiss**<br />Remove the notification. |

## Respond to many notifications simultaneously

You might need to handle several notifications simultaneously. For example:

- If IT did an OS upgrade to a large set of network servers, you can instruct the sensor to learn the new server versions for all upgraded servers. 

- If a group of devices in a certain line was phased out and isn't active anymore, you can instruct the sensor to remove these devices from the console.

You can instruct the sensor to apply newly detected information to multiple devices or ignore it.   

To display notifications and handle notifications:

1. Use the **filter by type, date range** option or the **Select All** option. Deselect notifications as required.

2. Instruct the sensor to apply newly detected information to selected devices by selecting **LEARN**. Or, instruct the sensor to ignore newly detected information by selecting **DISMISS**. The number of notifications that you can simultaneously learn and dismiss, along with the number of notifications you must handle individually, is shown.

**New IPs** and **No Subnets** configured events can't be handled simultaneously. They require manual confirmation.

## See also

[View alerts](how-to-view-alerts.md)
