---
title: View alerts details on the sensor Alerts page - Microsoft Defender for IoT
description: View alerts detected by your Defender for IoT sensor.
ms.date: 06/02/2022
ms.topic: how-to
---

# View and manage alerts on your OT sensor

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. OT alerts are triggered when OT network sensors detect changes or suspicious activity in network traffic that need your attention.

This article describes how to view Defender for IoT alerts directly on an OT network sensor. You can also view OT alerts on the [Azure portal](how-to-manage-cloud-alerts.md) or an [on-premises management console](how-to-work-with-alerts-on-premises-management-console.md).

For more information, see [Microsoft Defender for IoT alerts](alerts.md).

## Prerequisites


- **To have alerts on your OT sensor**, you must have a SPAN port configured for your sensor and Defender for IoT monitoring software installed. For more information, see [Install OT agentless monitoring software](how-to-install-software.md).

- **To view alerts on the OT sensor**, sign into your sensor as an **Admin**, **Security Analyst**, or **Viewer** user.

- **To manage alerts on an OT sensor**, sign into your sensor as an **Admin** or **Security Analyst** user. Alert management activities include modifying their statuses or severities, *Learning* an alert, accessing PCAP data, or adding pre-defined comments to an alert.

- **To create custom alert rules or alert comments**, sign into your sensor as an **Admin** user.

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

    1. To view more details, select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false"::: **Edit Columns** button.

        In the **Edit Columns** pane on the right, select **Add Column** and any of the following extra columns:

        | **Destination Device** | Defines the destination device IP address |
        | **First detection** | Defines the first time the alert activity was detected.   |
        | **ID** | Indicates the alert ID. |
        | **Last activity** | Defines the last time the alert was changed, including manual updates for severity or status, or automated changes for device updates or device/alert de-duplication   |

### Filter alerts displayed

Use the **Search** box, **Time range**, and **Add filter** options to filter the alerts displayed by specific parameters or help locate a specific alert.

Filtering alerts by **Groups** uses any custom groups you may have created in the [Device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md) or the [Device map](how-to-work-with-the-sensor-device-map.md).
 pages.

For example:

:::image type="content" source="media/how-to-view-alerts/filter-alerts-groups.png" alt-text="Screenshot of an OT sensor Alerts page being filtered by Groups.":::

### Group alerts displayed

Use the **Group by** menu at the top right to collapse the grid into subsections based on *Severity*, *Name*, *Engine*, or *Status*.

For example, while the total number of alerts appears above the grid, you may want more specific information about alert count breakdown, such as the number of alerts with a specific severity or status.

## View details and remediate a specific alert

1. On the **Alerts** page, select an alert in the grid to display more details in the pane on the right. The alert details pane includes the alert description, traffic source and destination, and more.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-detected.png" alt-text="Screenshot of an alert selected from Alerts page in the Azure portal." lightbox="media/how-to-view-manage-cloud-alerts/alert-detected.png":::

1. Select **View full details** to learn more, or **Take action** to jump directly to the suggested remediation steps.

    :::image type="content" source="media/how-to-view-manage-cloud-alerts/alert-full-details.png" alt-text="Screenshot of a selected alert with full details." lightbox="media/how-to-view-manage-cloud-alerts/alert-full-details.png":::


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



### Export alerts to CSV or PDF

You may want to export a selection of alerts to a CSV or PDF file for offline sharing and reporting.

- Export alerts to a CSV file from the main **Alerts** page, one at a time, or in bulk.
- Export alerts to a PDF file one at a time only, either from the main **Alerts** page or an alert details page.

**To export alerts to a CSV file**:

1. On the sensor's **Alerts** page, select one or more alerts to export, or select no alerts to export all alerts shown.

1. In the toolbar above the grid, select **Export to CSV**.

The file is generated, and you're prompted to save it locally. Exported CSV files include the following details for each alert:

- Source address
- Destination address
- Alert title
- Alert severity
- Alert message
- Additional information
- Acknowledged status
- PCAP availability

**To export an alert to PDF**:

Do one of the following:

- On the **Alerts** page, select an alert and then select **Export to PDF** from the toolbar above the grid.
- On an alerts details page, select **Export to PDF**.

The file is generated, and you're prompted to save it locally.
## Add custom alert comments

<!--what user? admin? security analyst? does this even belong here-->

**To add alert comments:**

1. On the side menu, select **System Settings** > **Network Monitoring**> **Alert Comments**.

3. Enter a description and select **Submit**.



## Customize alert rules

Add custom alert rules to pinpoint specific activity needed for your organization. The rules can refer, among others, to particular protocols, source or destination addresses, or a combination of parameters.
For example, for an environment running MODBUS, you can define a rule to detect any written commands to a memory register on a specific IP address and ethernet destination. Another example would be setting an alert about any access to a particular IP address.

Specify in the custom alert rule what action Defender for IT should take when the alert is triggered. For example, the action can be allowing users to access PCAP files from the alert, assigning alert severity, or generating an event that shows in the event timeline. Alert messages show that the alert was generated from a custom alert rule.

**To create a custom alert rule**:

1. On the sensor console, select **Custom alert rules** > **+ Create rule**.

1. In the **Create custom alert rule** pane that shows on the right, define the following fields:

    |Name  |Description  |
    |---------|---------|
    |**Alert name**     | Enter a meaningful name for the alert.        |
    |**Alert protocol**     | Select the protocol you want to detect. <br> In specific cases, select one of the following protocols: <br> <br> - For a database data or structure manipulation event, select **TNS** or **TDS**. <br> - For a file event, select **HTTP**, **DELTAV**, **SMB**, or **FTP**, depending on the file type. <br> - For a package download event, select **HTTP**. <br> - For an open ports (dropped) event, select **TCP** or **UDP**, depending on the port type. <br> <br> To create rules that track specific changes in one of your OT protocols, such as S7 or CIP, use any parameters found on that protocol, such as `tag` or `sub-function`.        |
    |**Message**     | Define a message to display when the alert is triggered. Alert messages support alphanumeric characters and any traffic variables detected. <br> <br> For example, you might want to include the detected source and destination addresses. Use curly brackets (**{}**) to add variables to the alert message.        |
    |**Direction**     | Enter a source and/or destination IP address where you want to detect traffic.        |
    |**Conditions**     | Define one or more conditions that must be met to trigger the alert. Select the **+** sign to create a condition set with multiple conditions that use the **AND** operator. If you select a MAC address or IP address as a variable, you must convert the value from a dotted-decimal address to decimal format. <br><br> Note that the **+** sign is enabled only after selecting an **Alert protocol** from above. <br> You must add at least one condition in order to create a custom alert rule.        |
    |**Detected**     | Define a date and/or time range for the traffic you want to detect. You can customize the days and time range to fit with maintenance hours or set working hours.      |
    |**Action**     | Define an action you want Defender for IoT to take automatically when the alert is triggered.        |

     For example:
     
     :::image type="content" source="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png" alt-text="Screenshot of the Create custom alert rule pane for creating custom alert rules." lightbox="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png":::

1. Select **Save** when you're done to save the rule.

### Edit a custom alert rule

To edit a custom alert rule, select the rule and then select the options (**...**) menu > **Edit**. Modify the alert rule as needed and save your changes.

Edits made to custom alert rules, such as changing a severity level or protocol, are tracked in the **Event timeline** page on the sensor console. For more information, see [Track sensor activity](how-to-track-sensor-activity.md).

### Disable, enable, or delete custom alert rules

Disable custom alert rules to prevent them from running without deleting them altogether.

In the **Custom alert rules** page, select one or more rules, and then select **Enable**, **Disable**, or **Delete** in the toolbar as needed.
## Next steps

For more information, see:

- [Microsoft Defender for IoT alerts](alerts.md)
- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)
- [OT monitoring alert types and descriptions](alert-engine-messages.md)
