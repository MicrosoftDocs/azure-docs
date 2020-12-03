---
title: Manage the alert event
description: Manage alert events detected in your network. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/02/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Manage the alert event

The following options are available for managing alert events:

 | Action | Description |
 |--|--|
 | **Learn** | Authorize the detected event. See [About learning and unlearning events](#about-learning-and-unlearning-events) for details. |
 | **Acknowledge** | Hide the alert once for the detected event. The alert will be triggered again if the event is detected again. See [About acknowledging and unacknowledging events](#about-acknowledging-and-unacknowledging-events) for details. |
 | **Mute** | Continuously ignore activity with identical devices and comparable traffic. See [About muting and unmuting events](#about-muting-and-unmuting-events) for details. |

## About learning and unlearning events

Events that indicate deviations of the learned network may reflect valid network changes. For example, a new authorized device that joined the network or an authorized firmware update.

When you select **Learn**, the sensor considers traffic, configurations, or activity valid. This means alerts will no longer be triggered for the event and the event will not be calculated when generating risk assessment, attack vector, and other reports.

For example, you receive an alert indicating address scanning activity on a device not previously defined by a network scanner. If this device was added to the network for the purpose of scanning, you may instruct the sensor to learn the device as a scanning device.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image171.png" alt-text="Address detected scan":::

Learned events can be unlearned. When unlearned the sensor will retrigger, alerts relate to this event.

## About acknowledging and unacknowledging events

In certain situations, you may not want to learn the event detected, or the option may not be available. Instead, the incident may require mitigation. For example,

- **Mitigate a network configuration or device** - You receive an alert indicating that a new device was detected on the network. When investigating, you discover that the device is an unauthorized network device. The incident is handled by disconnecting the device from the network.
- **Update a sensor configuration** - You receive an alert indicating that an excessive number of remote connections were initiated with a server. This alert was triggered because the sensor anomaly thresholds were defined to alert trigger alerts above (x) sessions within (x) one minute. The incident is handled by updating the thresholds.

Once mitigation, or investigation is carried out, you can instruct the sensor to hide the alert by selecting **Acknowledge**. If the event is detected again, the alert will be retriggered.

To hide the alert:

  - Select **Acknowledge.**

To view the alert again.

  - Access the alert and select **Unacknowledge**.

Unacknowledge alerts if further investigation is required.

## About muting and unmuting events

Under certain circumstances, you may want to instruct your sensor to ignore a specific scenario on your network. For example,

  - The Anomaly engine triggers an alert on a spike in bandwidth between two devices, but the spike is valid for these devices.

  - The Protocol Violation engine triggers an alert on a protocol deviation detected between two devices, but the deviation is valid between the devices.

In these situations, learning is not available. When learning cannot be carried out and you want to suppress the alert and remove the device when calculating risks and attack vectors, you can mute the alert event instead.

> [!NOTE] 
> You cannot mute events in which an internet device is defined as the source or destination.

### What traffic is muted?

A muted scenario will include the network device(s) and traffic detected for an event. The traffic being muted is described in the alert title.

The device or devices being muted will be displayed as an image in the alert. If two devices are shown, the traffic between will both be muted.

**Example 1**

When muted, the event is ignored anytime the primary (source) sends the secondary (destination) an illegal function code as defined by the vendor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/secondary-device-connected.png" alt-text="Secondary device received.":::

**Example 2**

When muted, the event is ignored anytime the source sends an HTTP header with illegal content, regardless of the destination.

:::image type="content" source="media/how-to-work-with-alerts-sensor/illegal-http-header-content.png" alt-text="Illegal HTTP header content screenshot.":::

**Once muted:**

  - The alert will be accessible in the Acknowledged alert view until it is unmuted.

  - The mute action will be displayed in the Event Timeline.

    :::image type="content" source="media/how-to-work-with-alerts-sensor/muted-event-notification-screenshot.png" alt-text="Event detected and muted.":::

  - The sensor will recalculate devices when generating Risk Assessment reports, Attack Vectors, and other reports. For example, if you muted an alert that detected malicious traffic on a device, that device will not be calculated in the Risk Assessment report.

To mute and unmute an alert:

1. Select the mute icon on the alert.

To view muted alerts:

1. Select the acknowledged option form the Alerts main screen.

2. Hover over an alert to see if it muted.  

## See also

[Generate reports](how-to-generate-reports.md)

[Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
