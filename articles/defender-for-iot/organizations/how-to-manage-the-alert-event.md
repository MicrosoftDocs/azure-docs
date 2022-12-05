---
title: Manage alert events from the sensor console - Microsoft Defender for IoT
description: Manage alerts detected in your network from a Defender for IoT sensor.
ms.date: 02/06/2022
ms.topic: how-to
---

## Learn and unlearn alert traffic

Some alerts indicate deviations of the learned network baseline. These alerts might reflect valid network changes, such as:

- New activity was detected on existing device. For example, an authorized device attempted to access a new resource on another device.

- Firmware version changes following standard maintenance procedures.

- A new device is added to the network.  

- A new  device performed a read/write operation on a destination controller.

- A new device performs a read/write operation on a destination controller and should be defined as a programming device.

- New legitimate scanning is carried out and the device should be defined as a scanning device.

When you want to approve these changes, you can instruct Defender for IoT to *learn* the traffic.

**To learn the traffic**:

1. Navigate to the **Alerts** tab.

1. Select an alert from the list of alerts.
1. Select **Take action**.

1. Enable the **Alert Learn** toggle.

    :::image type="content" source="media/how-to-manage-the-alert-event/learn-remediation.png" alt-text="Screenshot of the Learn option for Policy alerts.":::

After learning the traffic, configurations, or activity are considered valid. An alert will no longer be triggered for this activity.

In addition,

- The alert status is automatically updated to Closed.

- The learn action appears in the **Event Timeline**.

- For this traffic, the device won't be calculated when the sensor generates Risk Assessment, Attack Vector, and other reports.

### Unlearn alert traffic

Learned traffic can be unlearned. When the sensor unlearns traffic, alerts are retriggered for this traffic combination detected.

**To unlearn an alert**

1. Navigate to the alert you learned.
 
1. Disable the **Alert learn** toggle.

The alert status is automatically updated to **New**.

## Mute and unmute alerts

Under certain circumstances, you might want to instruct your sensor to ignore a specific scenario on your network. For example:

<!--keep this as examples for a tutorial or learn module-->
  - The Anomaly engine triggers an alert on a spike in bandwidth between two devices, but the spike is valid for these devices.

  - The Protocol Violation engine triggers an alert on a protocol deviation detected between two devices, but the deviation is valid between the devices.
  
  - The Operational engine triggers an alert indicating that the PLC Mode was changed on a device. The new mode may indicate that the PLC isn't secure. After investigation, it's determined that the new mode is acceptable.

In these situations, learning isn't available. You can mute the alert event when learning can't be carried out and you want to suppress the alert and remove the device when calculating risks and attack vectors.
<!-->


A muted scenario includes the network devices and traffic detected for an event. The alert title describes the traffic that is being muted.

> [!NOTE]
> You can't mute traffic if an internet device is defined as the source or destination.

**To mute an alert:**

1. Select an alert from the Alerts page and then select **Take action**.
1. Enable the **Alert mute** toggle.

**After an event is muted:**

- The alert status will automatically be changed to **Closed.**

- The mute action will appear in the **Event Timeline**.

- The sensor will recalculate devices when generating Risk Assessment, Attack Vector, and other reports. For example, if you muted an alert that detected malicious traffic on a device, that device won't be calculated in the Risk Assessment report.


<!--keep these as good examples for a learn module? or a tutorial?
- **Mitigate a network configuration or device**: You receive an alert indicating that a new device was detected on the network. When investigating, you discover that the device is unauthorized. You handle the alert by disconnecting the device from the network.

- **Update a sensor configuration**: You receive an alert indicating that a server initiated an excessive number of remote connections. This alert was triggered because the sensor anomaly thresholds were defined to trigger alerts above a certain number of sessions within one minute. You handle the alert by updating the thresholds. 

-->


## Next steps

For more information, see:

- [Detection engines and alerts](concept-key-concepts.md#detection-engines-and-alerts)

- [View alerts on your sensor](how-to-view-alerts.md#view-alerts-on-your-sensor)

- [Alert types and descriptions](alert-engine-messages.md)

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)

