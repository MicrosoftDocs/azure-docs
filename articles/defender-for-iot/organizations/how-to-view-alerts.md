---
title: View alerts details on the sensor Alerts page - Microsoft Defender for IoT
description: View alerts detected by your Defender for IoT sensor.
ms.date: 06/02/2022
ms.topic: how-to
---

# View alerts on your OT sensor

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. Alerts are triggered when OT or Enterprise IoT network sensors detect changes or suspicious activity in network traffic that need your attention.

This article describes how to view Defender for IoT alerts directly on an OT network sensor. You can also view alerts on the [Azure portal](how-to-manage-cloud-alerts.md) or an [on-premises management console](how-to-work-with-alerts-on-premises-management-console.md).

For more information, see [Microsoft Defender for IoT alerts](alerts.md).

## Prerequisites

- To view alerts on an OT sensor, sign into your sensor as an **Admin**, **Security Analyst**, or **Viewer** user.

- To manage alerts on an OT sensor, including modifying their statuses or severities, *Learning* an alert, or accessing PCAP data, sign into your sensor as an **Admin** or **Security Analyst** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## View alerts on an OT sensor

1. On your sensor console, select the **Alerts** page.

    By default, the following details are shown in the grid:

    | Name | Description |
    |--|--|
    | **Severity** | A predefined alert severity assigned by the sensor that you can modify as needed, including: *Critical*, *Major*, *Minor*, *Warning*. |
    | **Name** | The alert title |
    | **Engine** | The [Defender for IoT detection engine](architecture.md#analytics-engines) that detected the activity and triggered the alert. <br><br>A value of **Micro-agent** indicates that the event by the Defender for IoT [Device Builder](/azure/defender-for-iot/device-builders/) platform.  |
    | **Last detection** | The last time the alert was detected. <br>- If an alert's status is **New**, and the same traffic is seen again, the **Last detection** time is updated for the same alert. <br>- If the alert's status is **Closed** and traffic is seen again, the **Last detection** time is *not* updated, and a new alert is triggered.  |
    | **Status** |The alert status: *New*, *Active*, *Closed* |
    | **Source Device** | The source device IP address, MAC, or device name. |

    1. To view more details, select the <!--add image-->**Edit Columns** button.

        In the **Edit Columns** dialog box, select **Add Column** and any of the following extra columns to add:

        | **Destination Device** | Defines the destination device IP address |
        | **First detection** | Defines the first time the alert activity was detected.   |
        | **ID** | Indicates the alert ID. |
        | **Last activity** | Defines the last time the alert was changed, including manual updates for severity or status, or automated changes for device updates or device/alert de-duplication   |

### Filter alerts displayed

<!--validate this. time range?-->
Use the **Search** box, **Time range**, and **Add filter** options to filter the alerts displayed by specific parameters or help locate a specific alert.

Filtering alerts by **Group** uses any custom groups you may have created in the [Device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md) or the [Device map](how-to-work-with-the-sensor-device-map.md).
 pages.

For example:

<!--img tbd-->

### Group alerts displayed

Use the **Group by** menu at the top right to collapse the grid into subsections based on *Severity*, *Name*, *Engine*, or *Status*.

For example, while the total number of alerts appears above the grid, you may want more specific information about alert count breakdown, such as the number of alerts with a specific severity or status.

### Export alerts to CSV or PDF

You may want to export a selection of alerts to a CSV or PDF file for offline sharing and reporting.

1. On the sensor's **Alerts** page, select one or more alerts to export.

    To export all alerts currently being shown to a CSV file, don't select any alerts.

1. In the toolbar above the grid, select one of the following options:

    - **Export to CSV**
    - **Export to PDF**

The file is generated, and you're prompted to save it locally.

CSV files include the following details for each alert:

- Source address
- Destination address
- Alert title
- Alert severity
- Alert message
- Additional information
- Acknowledged status
- PCAP availability


## View details and remediate a specific alert

1. Select an alert in the grid to display more details in the pane on the right, including the alert description, traffic source and destination, any comments added by an **Admin** user, and more.

    <!--img, validate-->

1. Select **View full details** to learn more, or **Take action** to jump directly to the suggested remediation steps.

    <!--img-->

1. Gain contextual insight with the following tabs on the alert details page:

    - **Map View**. View the source and destination devices in a map view with other devices connected to your sensor. For example:

    - **Event Timeline**. View the event together with other recent activity on the related devices. Filter options to customize the data displayed. For example:

        :::image type="content" source="media/how-to-view-alerts/alert-event-timeline.png" alt-text="Screenshot of an alert timeline for the selected alert from the Alerts page." lightbox="media/how-to-view-alerts/alert-event-timeline.png" :::


After taking remediation steps, you may want to change the alert status to close the alert.

## Manage alert status and severity

We recommend that you update alert severity as soon as you've triaged an alert so that you can prioritize the riskiest alerts as soon as possible. Make sure to update your alert status once you've taken remediation steps so that the progress is recorded.

You can update both severity and status for a single alert or for a selection of alerts in bulk.

*Learn* an alert to indicate to Defender for IoT that the detected network traffic is authorized. Learned alerts won't be triggered again the next time the same traffic is detected on your network. Alerts can be *unlearned* only on the OT network sensor. For more information, see [Learning alert traffic](alerts.md#learning-alert-traffic).

*Mute* an alert on an OT sensor to close it and 



<!--validate-->
- **To manage a single alert**:

    1. Select an alert in the grid.
    1. Either on the details pane on the right, or in an alert details page itself, select the new status and/or severity.

- **To manage multiple alerts in bulk**:

    1. Select the alerts in the grid that you want to modify.
    1. Use the :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/status-icon.png" border="false"::: **Change status** and/or :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/severity-icon.png" border="false"::: **Change severity** options in the toolbar to update the status and/or the severity for all the selected alerts.

- **To learn one or more alerts**, do one of the following:

    - Select one or more alerts in the grid and then select :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/learn-icon.png" border="false"::: **Learn** in the toolbar.
    - On an alert details page, in the **Take Action** tab, select **Learn**.


    - Select one or more alerts in the grid and then select :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/learn-icon.png" border="false"::: **Learn** in the toolbar.
    - On an alert details page, in the **Take Action** tab, select **Learn**.

- **To unlearn an alert, do the following:

    1. Locate the learned alert and open its alert details page.
    1. Toggle off the **Alert learn** option. For example:

        <!--img-->

    After you unlearn an alert, alerts are re-triggered whenever the sensor senses the selected traffic combination.

## Access alert PCAP data

To access raw traffic files for your alert, known as packet capture files or PCAP files, select one of the following in the top-left corner of your alert details page:

- **Download Full PCAP**
- **Download Filtered PCAP**


## Add custom alert comments

<!--what user? admin? security analyst? does this even belong here-->

**To add alert comments:**

1. On the side menu, select **System Settings** > **Network Monitoring**> **Alert Comments**.

3. Enter a description and select **Submit**.


## Next steps

For more information, see:

- [Microsoft Defender for IoT alerts](alerts.md)
- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)
- [OT monitoring alert types and descriptions](alert-engine-messages.md)
