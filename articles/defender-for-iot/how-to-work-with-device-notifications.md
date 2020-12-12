---
title: Work with device notifications
description: Notifications provide information about network activity that may require your attention, as well as recommendations for handling this activity.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/12/2020
ms.topic: how-to
ms.service: azure
---

# Work with device notifications

Notifications provide information about network activity that may require your attention, also recommendations for handling this activity. For example, you may receive a notification about:

 - An inactive device. If the device is no longer a part of your network, you can remove it. If the device is inactive, for example because it is mistakenly disconnected from the network. Reconnect the device and dismiss the notification.

  - An IP address was detected on a device currently identified by a MAC address only. Respond by authorizing the IP address for the device.

Responding to notifications improves the information provided in the Device Map, Device Inventory, Data Mining queries and reports, and provides insight into legitimate network changes and potential network misconfigurations.

To access notifications:

 1. Select **System Settings** and then select **Data Enhancement**.

## Notifications vs alerts

In addition to receiving notifications on network activity, you may also receive *alerts*. Notifications provide information about network changes or unresolved device properties that do not present a threat. Alerts provide information about network deviations and changes that may present a threat to the network.

To view notifications:

1. Select **Device Map** from the console left menu pane.

2. Select the **Notifications** icon. The red number above the icon indicates the number of notifications.

   :::image type="content" source="media/how-to-enrich-asset-information/notifications-alert-screenshot.png" alt-text="Notification icons":::

   The notifications window displays all notifications detected by the sensor.

   :::image type="content" source="media/how-to-enrich-asset-information/notification-screen.png" alt-text="Notifications":::

## Filter the Notifications window

Use search filters to display notifications of interest to you.

| Filter by | Description |
|--|--|
| Filter by type | View notifications that cover a specific area of interest. For example, only notifications for inactive devices. |
| Filter by date range | Display notifications that cover a specific time range. For example, notifications sent over the last week only. |
| Search for specific information | Search for specific notifications. |

## Notification events and responses

This article describes the notification event types you may receive, as well as the options for handling them. You can update the device information with a recommended value or dismiss the notification. When dismissing, the device information is not updated with the recommended information. If traffic is detected again, the notification will be resent.

| Notification event types | Description | Responses |
|--|--|--|
| New IP addresses | A new IP address is associated with the device. Five scenarios may be detected: <br /><br /> 1. An additional IP address was associated with a device. This device is also associated with an existing MAC address.<br /><br />2. A new IP address was detected for a device using an existing MAC address. Currently the device does not communicate using an IP address.<br /> <br />3. A new IP address was detected for the device using a NetBIOS name. <br /><br />4. An IP address was detected as the management interface for a device associated with a MAC address. <br /><br />5. A new IP address was detected for a device using a virtual IP address. | **Set Additional IP to Device**  (Merge devcies) <br /> <br />**Replace Existing IP** <br /> <br /> **Dismiss**<br /> Remove the notification. |
| Inactive devices | Traffic was not detected on a device for more than 60 days. | **Delete** If this device is not part of your network, remove it. <br /><br />**Dismiss** Remove the notification if the device is part of your network. If the device is inactive, for example, because it is mistakenly disconnected from the network, dismiss the notification, and reconnect the device. |
| New OT device | A subnet includes an OT device, that is not defined in an ICS subnet. <br /><br /> Each subnet that contains at least one OT device can be defined as an ICS subnet. This helps differentiate between OT and IT devices on the map. | **Set as ICS Subnet** <br /> <br /> **Dismiss** <br />Remove the notification if the device is not part of the subnet. |
| No subnets configured | No subnets are currently configured in your network. <br /><br /> Configure subnets for better representation in the map and the ability to differentiate between OT and IT devices. | **Open Subnets Configuration** and configure subnets. <br /><br />**Dismiss** Remove the notification. |
| Operating system changes | One or more new operating systems have been associated with the device. | Select the name of the new OS you want to associate with the device.<br /><br /> **Dismiss** Remove the notification. |
| Subnets were detected | New subnets were discovered. | **Learn**<br />Automatically add the subnet.<br />**Open Subnet Configuration**<br />Add all missing subnet information.<br />**Dismiss**<br />Remove the notification. |
| Device type change was detected | A new device type has been associated with the device. | **Set as {…}**<br />Associate the new type with the device.<br />**Dismiss**<br />Remove the notification. |

## Respond to many notifications simultaneously

You may need to handle several notifications simultaneously. For example, if:

  -  IT did an OS upgrade to a large set of network servers, you can instruct the sensor to learn the new server versions for all upgraded servers. 

  - A group of devices in a certain line was phased out and are not active anymore, you can instruct the sensor to remove these devices from the console.

You can instruct the sensor to apply newly detected information to multiple devices or ignore it.   

To display notifications and handle notifications:

1. Use the **filter by type, date range** options or the **Select All** option. Deselect notifications as required.

2. Instruct the sensor to apply newly detected information to selected devices by selecting **LEARN**. Instead, instruct the sensor to ignore newly detected information by selecting **DISMISS**.  The number of notifications you can simultaneously learn and dismiss, as well as the number of notifications you must handle individually is shown.

**New IPs** and **No Subnets** **configured** events cannot be handled simultaneously. They require manual confirmation.

## Improve device OS classification – data enhancement 

The sensor continuously autodiscovers new OT devices, as well as changes to previously discovered devices including operating system types.

Under certain circumstances, conflicts may be detected in discovered operating systems. This may happen because you have an OS version that may refer to either desktop or server systems. If it happens, you'll receive a notification with optional OS classifications.

:::image type="content" source="media/how-to-enrich-asset-information/enhance-data-screen.png" alt-text="Enhance data":::

Investigate the recommendations in order to enrich OS classification. This information appears in the device inventory, data mining reports, and other displays and may also improve the accuracy of alerts, threats, and risk analysis.

When you accept a recommendation, the OS type information will be updated in the sensor.

## See also

[View alerts](how-to-view-alerts.md)
