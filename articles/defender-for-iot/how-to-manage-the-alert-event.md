---
title: Manage alert events
description: Manage alert events detected in your network. 
ms.date: 12/07/2020
ms.topic: how-to
---

# Manage alert events

The following options are available for managing alert events:

 | Action | Description |
 |--|--|
 | **Learn** | Authorize the detected event. For more information, see [About learning and unlearning events](#about-learning-and-unlearning-events). |
 | **Acknowledge** | Hide the alert once for the detected event. The alert will be triggered again if the event is detected again. For more information, see [About acknowledging and unacknowledging events](#about-acknowledging-and-unacknowledging-events). |
 | **Mute** | Continuously ignore activity with identical devices and comparable traffic. For more information, see [About muting and unmuting events](#about-muting-and-unmuting-events). |
 
You can also export alert information.
## About learning and unlearning events

Events that indicate deviations of the learned network might reflect valid network changes. Examples might include a new authorized device that joined the network or an authorized firmware update.

When you select **Learn**, the sensor considers traffic, configurations, or activity valid. This means alerts will no longer be triggered for the event. It also means the event won't be calculated when the sensor generates risk assessment, attack vector, and other reports.

For example, you receive an alert that indicates address scanning activity on a device that a network scanner didn't previously define. If this device was added to the network for the purpose of scanning, you can instruct the sensor to learn the device as a scanning device.

:::image type="content" source="media/how-to-work-with-alerts-sensor/detected.png" alt-text="The Address Detected Scan window.":::

Learned events can be unlearned. When the sensor unlearns events, it will retrigger alerts related to this event.

## About acknowledging and unacknowledging events

In certain situations, you might not want a sensor to learn a detected event, or the option might not be available. Instead, the incident might require mitigation. For example:

- **Mitigate a network configuration or device**: You receive an alert indicating that a new device was detected on the network. When investigating, you discover that the device is an unauthorized network device. You handle the incident by disconnecting the device from the network.
- **Update a sensor configuration**: You receive an alert indicating that a server initiated an excessive number of remote connections. This alert was triggered because the sensor anomaly thresholds were defined to trigger alerts above a certain number of sessions within one minute. You handle the incident by updating the thresholds.

After you carry out mitigation or investigation, you can instruct the sensor to hide the alert by selecting **Acknowledge**. If the event is detected again, the alert will be retriggered.

To clear the alert:

  - Select **Acknowledge**.

To view the alert again:

  - Access the alert and select **Unacknowledge**.

Unacknowledge alerts if further investigation is required.

## About muting and unmuting events

Under certain circumstances, you might want to instruct your sensor to ignore a specific scenario on your network. For example:

  - The **Anomaly** engine triggers an alert on a spike in bandwidth between two devices, but the spike is valid for these devices.

  - The **Protocol Violation** engine triggers an alert on a protocol deviation detected between two devices, but the deviation is valid between the devices.

In these situations, learning is not available. When learning can't be carried out and you want to suppress the alert and remove the device when calculating risks and attack vectors, you can mute the alert event instead.

> [!NOTE] 
> You can't mute events in which an internet device is defined as the source or destination.

### What alert activity is muted?

A muted scenario includes the network devices and traffic detected for an event. The alert title describes the traffic that is being muted.

The device or devices being muted will be displayed as an image in the alert. If two devices are shown, the specific alerted traffic between them will be muted.

**Example 1**

When an event is muted, it's is ignored any time the primary (source) sends the secondary (destination) an illegal function code as defined by the vendor.

:::image type="content" source="media/how-to-work-with-alerts-sensor/secondary-device-connected.png" alt-text="Secondary device received.":::

**Example 2**

When an event is muted, it's ignored any time the source sends an HTTP header with illegal content, regardless of the destination.

:::image type="content" source="media/how-to-work-with-alerts-sensor/illegal-http-header-content.png" alt-text="Screenshot of illegal HTTP header content.":::

**After an event is muted:**

- The alert will be accessible in the **Acknowledged** alert view until it is unmuted.

- The mute action will appear in the **Event Timeline**.

  :::image type="content" source="media/how-to-work-with-alerts-sensor/muted-event-notification-screenshot.png" alt-text="Event detected and muted.":::

- The sensor will recalculate devices when generating risk assessment, attack vector, and other reports. For example, if you muted an alert that detected malicious traffic on a device, that device will not be calculated in the risk assessment report.

**To mute and unmute an alert:**

- Select the **Mute** icon on the alert.

**To view muted alerts:**

1. Select the **Acknowledged** option form the **Alerts** main screen.

2. Hover over an alert to see if it's muted.  

## Export alert information

Export alert information to a .csv file. You can export information of all alerts detected or export information based on the filtered view.The following information is exported:

- Source address
- Destination address
- Alert title
- Alert severity
- Alert message
- Additional information
- Acknowledged status
- PCAP availability

To export:

1. Select Alerts from the side menu.
1. Select Export.
1. Select Export Extended Alerts to export alert information in separate rows for each alert that covers multiple devices. When Export Extended Alerts is selected, the .csv file will create a duplicate row of the alert event with the unique items in each row. Using this option makes it easier to investigate exported alert events.

## See also

[Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
