---
title: Accelerate alert workflows on an OT network sensor - Microsoft Defender for IoT
description: Learn how to improve alert workflows on the OT network sensor by creating custom alert comments and custom alert rules.
ms.date: 12/06/2022
ms.topic: how-to
---


# Accelerate alert workflows on an OT network sensor

This article describes how to accelerate alert workflows by creating custom alert comments that your teams can add to alerts and by creating custom alert rules for your organization.

Both custom alert comments and custom alert rules help you reduce alert fatigue by automating some of the steps involved.

## Prerequisites

To create custom alert comments or alert rules on an OT network sensor, you must have access to the sensor as an **Admin** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Create custom alert comments

1. Sign into your sensor and select **System Settings** > **Network Monitoring**> **Alert Comments**.

1. In the **Alert comments** pane, in the **Description** field, enter the new comment, and select **Add**.

    :::image type="content" source="media/alerts/create-custom-comment.png" alt-text="Screenshot of the Alert comments pane on the OT sensor.":::

    The new comment appears in the **Description** list below.

1. Select **Submit** to add your comment to the list of available comments in each alert on your sensor.

For more information, see [Add custom alert comments](how-to-view-alerts.md#add-custom-alert-comments).

## Create custom alert rules

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

## Next steps

For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md).
