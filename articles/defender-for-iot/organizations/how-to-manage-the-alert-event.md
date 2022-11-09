---
title: Manage alert events from the sensor console - Microsoft Defender for IoT
description: Manage alerts detected in your network from a Defender for IoT sensor.
ms.date: 02/06/2022
ms.topic: how-to
---

# Manage alerts from the sensor console

This article describes how to manage alerts from the sensor console.

## About managing alerts

The following options are available for managing alerts:

 | Action | Description |
 |--|--|
| **Remediate** |Remediate a device or network process that caused Defender for IoT to trigger the alert. For more information, see [View remediation steps](#view-remediation-steps).|
| **Learn** | Authorize the detected traffic. For more information, see [Learn and unlearn alert traffic](#learn-and-unlearn-alert-traffic). |
| **Mute** | Continuously ignore activity with identical devices and comparable traffic. For more information, see [Mute and unmute alerts](#mute-and-unmute-alerts).
| **Change status** |  Change the alert status to Closed or New. For more information, see [Close the alert](#close-the-alert). |
| **Forward to partner solutions** | Create Forwarding rules that send alert details to integrated solutions, for example to Microsoft Sentinel, Splunk or Service Now. For more information, see [Forward alert information](how-to-forward-alert-information-to-partners.md#forward-alert-information)  |

Alerts are managed from the Alerts page on the sensor.

**To access the Alerts page:**

1. Select **Alerts** from the sensor console, side pane.
1. Review the alerts details and decide how to manage the alert.

    :::image type="content" source="media/how-to-manage-the-alert-event/main-alerts-screen.png" alt-text="Screenshot of the main sensor alerts screen.":::

See [View alerts on your sensor](how-to-view-alerts.md#view-alerts-on-your-sensor) for information on:
- the kind of alert information available  
- customizing the alert view
- how long alerts are saved

## View remediation steps

Defender for IoT provides remediation steps you can carry out for the alert. Steps may include remediating a device or network process that caused Defender for IoT to trigger the alert.
Remediation steps help SOC teams better understand Operational Technology (OT) issues and resolutions. Review remediation information before managing the alert event or taking action on the device or the network.

**To view alert remediation steps:**

1. Select an alert from the Alerts page.
1. In the side pane, select **Take action.**
1. Review remediation steps.

    :::image type="content" source="media/how-to-manage-the-alert-event/remediation-steps.png" alt-text="Screenshot of a sample set of remediation steps for alert action.":::


Your administrator may have added instructions or comments to help you complete remediation or alert handling. If created, comments appear in the Alert Details section.

:::image type="content" source="media/how-to-view-alerts/alert-comments.png" alt-text="Screenshot of alert comments added to alert details section of Alert dialog box.":::

After taking remediation steps, you may want to change the alert status to Close the alert.

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

  - The Anomaly engine triggers an alert on a spike in bandwidth between two devices, but the spike is valid for these devices.

  - The Protocol Violation engine triggers an alert on a protocol deviation detected between two devices, but the deviation is valid between the devices.
  
  - The Operational engine triggers an alert indicating that the PLC Mode was changed on a device. The new mode may indicate that the PLC isn't secure. After investigation, it's determined that the new mode is acceptable.

In these situations, learning isn't available. You can mute the alert event when learning can't be carried out and you want to suppress the alert and remove the device when calculating risks and attack vectors.

:::image type="content" source="media/how-to-manage-the-alert-event/mute-alert.png" alt-text="Screenshot of an alert with the Mute action.":::

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

## Close the alert

 Close an alert when you finish remediating, investigating, or otherwise handling the alert. For example:

- **Mitigate a network configuration or device**: You receive an alert indicating that a new device was detected on the network. When investigating, you discover that the device is unauthorized. You handle the alert by disconnecting the device from the network.

- **Update a sensor configuration**: You receive an alert indicating that a server initiated an excessive number of remote connections. This alert was triggered because the sensor anomaly thresholds were defined to trigger alerts above a certain number of sessions within one minute. You handle the alert by updating the thresholds. 

After you carry out remediation or investigation, you can close  the alert.

If the traffic is detected again, the alert will be retriggered.

**To close a single alert:**

1. Select an alert. The Alert Details section opens.
1. Select the dropdown arrow in the Status field and select **Closed**.

    :::image type="content" source="media/how-to-manage-the-alert-event/close-alert.png" alt-text="Screenshot of the option to close an alert from the Alerts page.":::

**To close multiple alerts:**

1. Select the alerts you want to close from the Alerts page. 
1. Select **Change Status** from the action items on the top of the page.
1. Select **Closed** and **Apply.**

    :::image type="content" source="media/how-to-manage-the-alert-event/multiple-close.png" alt-text="Screenshot of selecting multiple alerts to close from the Alerts page.":::

Change the alert status to **New** if further investigation is required.

To view closed alerts on the Alerts page, verify that the **Status** filter is defined to show **Closed** alerts.

:::image type="content" source="media/how-to-manage-the-alert-event/show-closed-status.png" alt-text="Screenshot of the Alerts page status filter with closed alerts selected.":::

## Export alert information

Export alert information to a .csv file. The following information is exported:

- Source address
- Destination address
- Alert title
- Alert severity
- Alert message
- Additional information
- Acknowledged status
- PCAP availability

**To export:**

1. Select Export to CSV on the top of the Alerts page.


## Interaction with Azure Alerts page

Your deployment may have been set up to work with cloud-connected sensors on the Defender for IoT portal on Azure. In cloud-connected environments,  Alert detections shown on your sensors will also be seen in the Defender for IoT Alerts page, on the Azure portal. 

Viewing and managing alerts in the portal provides significant advantages. For example, you can:

- Display an aggregated  view of alert activity in all enterprise sensors
- Learn about related MITRE ATT&CK techniques, tactics and stages
- View alerts based on the sensor site
- Integrate alert details with Microsoft Sentinel
- Change the severity of an alert

    :::image type="content" source="media/how-to-view-alerts/alert-cloud-mitre.png" alt-text="Screenshot of a sample alert shown in the Azure portal.":::

Users working with alerts on the Defender for IoT portal on Azure should understand how alert management between the portal and the sensor operates.


 Parameter | Description
|--|--|
| **Alert Exclusion rules**|  Alert *Exclusion rules* defined in the on-premises management console impact the alerts triggered by managed sensors. As a result, the alerts excluded by these rules also won't be displayed in the Alerts page on the portal. For more information, see [Create alert exclusion rules](how-to-work-with-alerts-on-premises-management-console.md#create-alert-exclusion-rules).
| **Managing alerts on your sensor**  | If you change the status of an alert, or learn or mute an alert on a sensor, the changes are not updated in the Defender for IoT Alerts page on the portal. This means that this alert will stay open on the portal. However another alert  won't be triggered from the sensor for this activity.
| **Managing alerts in the portal Alerts page** | Changing the status of an alert on the Azure portal, Alerts page or changing the alert severity on the portal, doesn't impact the alert status or severity in on-premises sensors.

## Next steps

For more information, see:

- [Detection engines and alerts](concept-key-concepts.md#detection-engines-and-alerts)

- [View alerts on your sensor](how-to-view-alerts.md#view-alerts-on-your-sensor)

- [Alert types and descriptions](alert-engine-messages.md)

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)

