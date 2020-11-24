---
title: Manage the alert event
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Manage the alert event

The following options are available for managing alert events:

 | Action | Description |
 |--|--|
 | **Learn** | Authorize the event detected. See ***About Learning and Unlearning Events*** for details. |
 | **Acknowledge** | Hide the alert once for the detected event. The alert will be triggered again if the event is detected again. See ***About Acknowledging and Unacknowledging Events*** for details. |
 | **Mute** | Continuously ignore activity with identical assets and comparable traffic. See ***About Muting and Unmuting Events*** for details. |

## About learning and unlearning events

Events that indicate deviations of the learned network may reflect valid network changes. For example, a new authorized asset that joined the network or an authorized firmware update.

When you select *Learn*, the sensor considers traffic, configurations or activity valid. This means alerts will no longer be triggered for the event and the event will not be calculated when generating Risk Assessment, Attack Vector, and other reports.

For example, you receive an alert indicating address scanning activity on an asset not previously defined by a network scanner. If this asset was added to the network for the purpose of scanning, you may instruct the sensor to learn the asset as a scanning device.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image171.png" alt-text="Address etected scan":::

Learned events can be *Unlearned*. When unlearned the sensor will retrigger, alerts relate to this event.

## About acknowledging and unacknowledging events

In certain situations, you may *not* want to learn the event detected, or the option may not be available. Instead, the incident may require mitigation. For example,

- **Mitigate a network configuration or device** - You receive an alert indicating that a new asset was detected on the network. When investigating, you discover that the asset is an unauthorized network device.</br>The incident is handled by disconnecting the asset from the network.
- **Update a sensor configuration** - You receive an alert indicating that an excessive number of remote connections were initiated with a server. This alert was triggered because the sensor anomaly thresholds were defined to alert trigger alerts above (x) sessions within (x) one minute. The incident is handled by updating the thresholds.

Once mitigation or investigation is carried out, you can instruct the sensor to hide the alert by selecting *Acknowledge*. If the event is detected again, the alert will be retriggered.

**To hide the alert:**

  - Select **Acknowledge.**

**To view the alert again.**

  - Access the alert and select **Unacknowledge**.

*Unacknowledge* alerts if further investigation is required.

## About muting and unmuting events

Under certain circumstances, you may want to instruct your sensor to ignore a specific scenario on your network. For example,

  - The Anomaly engine triggers an alert on a spike in bandwidth between two assets, but the spike is valid for these assets.

  - The Protocol Violation engine triggers an alert on a protocol deviation detected between two assets, but the deviation is valid between the assets.

In these situations, learning is not available. When learning cannot be carried out and you want to suppress the alert and remove the asset when calculating risks and attack vectors, you can mute the alert event instead.

> [!NOTE] 
> You cannot mute events in which an internet device is defined as the source or destination.

### What traffic is muted?

A muted scenario will include the network asset(s) and traffic detected for an event. The traffic being muted is described in the alert title.

The asset or assets being muted will be displayed as an image in the alert. If two assets are shown, the traffic between will both be muted.

**Example 1**

When muted, the event is ignored any time this Master (source) sends this Slave (destination) an illegal function code as defined by the vendor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image172.png" alt-text="Secondary device received":::

**Example 2**

When muted, the event is ignored any time the source sends an HTTP header with illegal content, regardless of the destination.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image173.png" alt-text="Illegal HTTP Header Content":::

**Once muted:**

  - The alert will be accessible in the Acknowledged alert view until it is unmuted.

  - The Mute action will be displayed in the Event Timeline.

    :::image type="content" source="media/how-to-work-with-alerts-sensor/image174.png" alt-text="Event Detected and Muted":::

  - The sensor will recalculate assets when generating Risk Assessment reports, Attack Vectors and other reports. For example, if you muted an Alert that detected malicious traffic on an asset, that asset will not be calculated in the Risk Assessment report.

**To mute/unmute an alert:**

1. Select the mute icon on the alert.

    :::image type="content" source="media/how-to-work-with-alerts-sensor/image175.png" alt-text="RPC operation failed":::

**To view muted alerts:**

1. Select the Acknowledged option form the Alerts main screen.

2. Hover over an alert to see if it muted

    :::image type="content" source="media/how-to-work-with-alerts-sensor/image176.png" alt-text="Alerts":::
