---
title: Work with device notifications in Defender for IoT
description: Notifications provide information and recommendations about network activity.
ms.date: 01/02/2022
ms.topic: how-to
---

# Work with device notifications

Discovery notifications provide information about network activity that might require your attention, along with recommendations for handling this activity. For example, you might receive a notification about an inactive device that should be reconnected, or removed if it's no longer part of the network. Notifications aren't the same as alerts. Alerts provide information about changes that might present a threat to your network.

## Notification types

The following table describes the notification event types you might receive, along with the options for handling them. When you dismiss a notification, the device information is not updated with the recommended action. If traffic is detected again, the notification is resent.

| Type | Description | Responses |
|--|--|--|
| New IP detected | A new IP address is associated with the device. Five scenarios might be detected: <br /><br /> An additional IP address was associated with a device. This device is also associated with an existing MAC address.<br /><br /> A new IP address was detected for a device that's using an existing MAC address. Currently the device does not communicate by using an IP address.<br /> <br /> A new IP address was detected for a device that's using a NetBIOS name. <br /><br /> An IP address was detected as the management interface for a device associated with a MAC address. <br /><br /> A new IP address was detected for a device that's using a virtual IP address. | **Set Additional IP to Device** (merge devices) <br /> <br />**Replace Existing IP** <br /> <br /> **Dismiss**<br /> Remove the notification. |
| Inactive devices | Traffic wasn't detected on a device for more than 60 days. For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device) | **Delete** <br /> If this device isn't part of your network, remove it. <br /><br />**Dismiss** <br /> Remove the notification if the device is part of your network. If the device is inactive (for example, because it's mistakenly disconnected from the network), dismiss the notification and reconnect the device. |
| New OT devices | A subnet includes an OT device that's not defined in an ICS subnet. <br /><br /> Each subnet that contains at least one OT device can be defined as an ICS subnet. This helps differentiate between OT and IT devices on the map. | **Set as ICS Subnet** <br /> <br /> **Dismiss** <br />Remove the notification if the device isn't part of the subnet. |
| No subnets configured | No subnets are currently configured in your network. <br /><br /> Configure subnets for better representation in the map and the ability to differentiate between OT and IT devices. | **Open Subnets Configuration** and configure subnets. <br /><br />**Dismiss** <br /> Remove the notification. |
| Operating system changes | One or more new operating systems have been associated with the device. | Select the name of the new OS that you want to associate with the device.<br /><br /> **Dismiss** <br /> Remove the notification. |
| New subnets | New subnets were discovered. | **Learn**<br />Automatically add the subnet.<br />**Open Subnet Configuration**<br />Add all missing subnet information.<br />**Dismiss**<br />Remove the notification. |
| Device type changes | A new device type has been associated with the device. | **Set as {…}**<br />Associate the new type with the device.<br />**Dismiss**<br />Remove the notification. |

## View notifications

1. In Defender for IoT, select **Device Map**.
1. Select **Notifications** icon. 
1. In **Discovery Notifications**, review all notifications.
1. For each notification, either accept the recommendation, or dismiss it.
1. By default, all notifications are shown.
    - To filter for specific dates and times, select **Time range ==** and specify a days, weeks, or month filter.
    - Select **Add filter** to filter on other device, subnet, and operating system values.


## Respond to multiple notifications 

You might need to handle several notifications simultaneously. For example:

- If IT did an OS upgrade to a large set of network servers, you can instruct the sensor to learn the new server versions for all upgraded servers. 
- If a group of devices in a certain line was phased out and isn't active anymore, you can instruct the sensor to remove these devices from the console.

Respond as follows:

1. In **Discovery Notifications**, choose  **Select All**, and then clear the notifications you don't need. When you choose **Select All**, Defender for IoT displays information about which notifications can be handled or dismissed simultaneously, and which need your input.
1. You can accept all recommendations, dismiss all recommendations, or handled notifications one at a time. 
1. For notifications that indicate manual changes are required, such as **New IPs** and **No Subnets**, make the manual modifications as needed. 

## Next steps

For more information, see [View alerts](how-to-view-alerts.md).
