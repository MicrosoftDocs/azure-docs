---
title: Accelerate alert workflows on an OT network sensor - Microsoft Defender for IoT
description: Learn how to improve alert workflows on the OT network sensor by creating custom alert comments and custom alert rules.
ms.date: 12/06/2022
ms.topic: how-to
---


# Accelerate alert workflows on an OT network sensor

This article describes how to accelerate alert workflows using the following methods:

- Creating custom alert comments that your teams can add to alerts
- Creating custom alert rules to identify specific traffic in your network
- Creating alert exclusion rules to reduce the alerts triggered by your sensors

Each of these methods help you reduce alert fatigue by automating some of the steps involved.

## Prerequisites

- To create custom alert comments or alert rules on an OT network sensor, you must have access to the sensor as an **Admin** user.

- To create alert exclusion rules on an on-premises management console, you must have access to the on-premises management console as an **Admin** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Create custom alert comments on an OT sensor

1. Sign into your sensor and select **System Settings** > **Network Monitoring**> **Alert Comments**.

1. In the **Alert comments** pane, in the **Description** field, enter the new comment, and select **Add**.

    :::image type="content" source="media/alerts/create-custom-comment.png" alt-text="Screenshot of the Alert comments pane on the OT sensor.":::

    The new comment appears in the **Description** list below.

1. Select **Submit** to add your comment to the list of available comments in each alert on your sensor.

For more information, see [Add custom alert comments](how-to-view-alerts.md#add-custom-alert-comments).

## Create custom alert rules on an OT sensor

Add custom alert rules to trigger alerts for specific activity on your network that's not covered by out-of-the-box functionality.

For example, for an environment running MODBUS, you might add a rule to detect any written commands to a memory register on a specific IP address and ethernet destination.

**To create a custom alert rule**:

1. Sign into your OT sensor and select **Custom alert rules** > **+ Create rule**.

1. In the **Create custom alert rule** pane, define the following fields:

    |Name  |Description  |
    |---------|---------|
    |**Alert name**     | Enter a meaningful name for the alert.        |
    |**Alert protocol**     | Select the protocol you want to detect. <br> In specific cases, select one of the following protocols: <br> <br> - For a database data or structure manipulation event, select **TNS** or **TDS**. <br> - For a file event, select **HTTP**, **DELTAV**, **SMB**, or **FTP**, depending on the file type. <br> - For a package download event, select **HTTP**. <br> - For an open ports (dropped) event, select **TCP** or **UDP**, depending on the port type. <br> <br> To create rules that track specific changes in one of your OT protocols, such as S7 or CIP, use any parameters found on that protocol, such as `tag` or `sub-function`.        |
    |**Message**     | Define a message to display when the alert is triggered. Alert messages support alphanumeric characters and any traffic variables detected. <br> <br> For example, you might want to include the detected source and destination addresses. Use curly brackets (**{}**) to add variables to the alert message.        |
    |**Direction**     | Enter a source and/or destination IP address where you want to detect traffic.        |
    |**Conditions**     | Define one or more conditions that must be met to trigger the alert. Select the **+** sign to create a condition set with multiple conditions that use the **AND** operator. If you select a MAC address or IP address as a variable, you must convert the value from a dotted-decimal address to decimal format. <br><br> Note that the **+** sign is enabled only after selecting an **Alert protocol** from above. <br> You must add at least one condition in order to create a custom alert rule.        |
    |**Detected**     | Define a date and/or time range for the traffic you want to detect. You can customize the days and time range to fit with maintenance hours or set working hours.      |
    |**Action**     | Define an action you want Defender for IoT to take automatically when the alert is triggered, creating either an alert or event, with the specified severity.        |
    |**PCAP included** | If you've selected to create an event, you can choose to clear the **PCAP included** option as needed. If you've chosen to create an alert, the PCAP is always included and cannot be removed. |

    For example:

    :::image type="content" source="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png" alt-text="Screenshot of the Create custom alert rule pane for creating custom alert rules." lightbox="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png":::

1. Select **Save** when you're done to save the rule.

### Edit a custom alert rule

To edit a custom alert rule, select the rule and then select the options (**...**) menu > **Edit**. Modify the alert rule as needed and save your changes.

Edits made to custom alert rules, such as changing a severity level or protocol, are tracked in the **Event timeline** page on the OT sensor.

For more information, see [Track sensor activity](how-to-track-sensor-activity.md).

### Disable, enable, or delete custom alert rules

Disable custom alert rules to prevent them from running without deleting them altogether.

In the **Custom alert rules** page, select one or more rules, and then select **Enable**, **Disable**, or **Delete** in the toolbar as needed.

## Create alert exclusion rules on an on-premises management console

Create alert exclusion rules to instruct your sensors to ignore specific traffic on your network that would otherwise trigger an alert.

For example, if you know that all the OT devices monitored by a specific sensor will be going through maintenance procedures for two days, you can define an exclusion rule that instructs Defender for IoT to suppress alerts detected by this sensor during the predefined period.

**To create an alert exclusion rule**:

1. Sign into your on-premises management console and select **Alert Exclusion** and select the **+** button at the top-right.

1. In the **Create Exclusion Rule** dialog, enter the following details:

    |Name  |Description  |
    |---------|---------|
    |**Name**     |  Enter a meaningful name for your rule. The name cannot contain quotes (`"`).      |
    |**By Time Period**     |   Select a time zone and then a specific time period you want the exclusion rule to be active, and then select **ADD**. <br><br>Use this option to create separate rules for different time zones. For example, you might need to apply an exclusion rule between 8:00 AM and 10:00 AM in three different time zones. In this case, create three separate exclusion rules that use the same time period and the relevant time zone.      |
    |**By Device Address**     |   Select: <br>- Whether the designated device is a source, destination, or both a source and destination device.     |
    |Row4     |         |
    |Row5     |         |




1. Select **ADD**. During the exclusion period, no alerts are created on the connected sensors.

   :::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/by-the-time-period.png" alt-text="Screenshot of the By Time Period view.":::

1. In the **** section, define the:

    - Device IP address, MAC address, or subnet address that you want to exclude.
    
    - Traffic direction for the excluded devices, source, and destination.

1. Select **ADD**.

1. In the **By Alert Title** section, start typing the alert title. From the drop-down list, select the alert title or titles to be excluded.

   :::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/alert-title.png" alt-text="Screenshot of the By Alert Title view.":::

1. Select **ADD**.

1. In the **By Sensor Name** section, start typing the sensor name. From the drop-down list, select the sensor or sensors that you want to exclude.

1. Select **ADD**.

1. Select **SAVE**. The new rule appears in the list of rules.

You can suppress alerts by either muting them or creating alert exclusion rules. This section describes potential use cases for both features.

- **Exclusion rule**. Write an exclusion rule when:

  - You know ahead of time that you want to exclude the event from the database. For example, you know that the scenario detected at a certain sensor will trigger irrelevant alerts. For example, you'll be carrying out maintenance work on organizational PLCs on a specific site and want to suppress alerts related to PLCs for this site.

  - You want Defender for IoT to ignore events for a specific range of time (for system maintenance tasks).

  - You want to ignore events in a specific subnet.

  - You want to control alert events generated from several sensors with one rule.

  - You don't want to track the alert exclusion as an event in the event log.

- **Mute**. Mute an alert when:

  - Items that need to be muted are not planned. You don't know ahead of time which events will be irrelevant.

  - You want to suppress the alert from the **Alerts** window, but you still want to track it in the event log.

  - You want to ignore events on a specific channel.

- Time zones and time periods

- Device address (IP, MAC, subnet)

- Alert names

- A specific sensor

Create alert exclusion rules when you want Defender for IoT to ignore activity that will trigger an alert.


### Alert exclusion logic

Alert rule logic is `AND` based. This means an alert will be triggered only when all the rule conditions are met.

If a rule condition is not defined, the condition will include all options. For example, if you don't include the name of a sensor in the rule, it will be applied to all sensors.

:::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/create-alert-exclusion-v2.png" alt-text="Screenshot of the Create Exclusion Rule view.":::

Rule summaries appear in the **Exclusion Rule** window.

:::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/exclusion-summary-v2.png" alt-text="Screenshot of the Exclusion Rule Summary view.":::

In addition to working with exclusion rules, you can suppress alerts by muting them.

### Create exclusion rules

**To create exclusion rules**:


### Trigger alert exclusion rules from external systems

Trigger alert exclusion rules from external systems. For example, manage exclusion rules from enterprise ticketing systems or systems that manage network maintenance processes.

Define the sensors, engines, start time, and end time to apply the rule. For more information, see [Defender for IoT API sensor and management console APIs](references-work-with-defender-for-iot-apis.md).

Rules that you create by using the API appear in the **Exclusion Rule** window as RO.

:::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/edit-exclusion-rule-screen.png" alt-text="Screenshot of the Edit Exclusion Rule view.":::
## Next steps

For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md).
