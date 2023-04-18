---
title: Accelerate on-premises OT alert workflows - Microsoft Defender for IoT
description: Learn how to improve Microsoft Defender for IoT OT alert workflows on an OT network sensor or the on-premises management console.
ms.date: 12/12/2022
ms.topic: how-to
---


# Accelerate on-premises OT alert workflows

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. OT alerts are triggered when OT network sensors detect changes or suspicious activity in network traffic that needs your attention.

This article describes the following methods for reducing OT network alert fatigue in your team:

- **Create alert comments** for your teams to add to individual alerts, streamlining communication and record-keeping across your alerts.

- **Create custom alert rules** to identify specific traffic in your network

- **Create alert exclusion rules** to reduce the alerts triggered by your sensors

## Prerequisites

- To create alert comments or custom alert rules on an OT network sensor, you must have an OT network sensor installed and access to the sensor as an **Admin** user.

- To create a DNS allowlist on an OT sensor, you must have an OT network sensor installed and access to the sensor as a **Support** user.
- To create alert exclusion rules on an on-premises management console, you must have an on-premises management console installed and access to the on-premises management console as an **Admin** user.

For more information, see [Install OT agentless monitoring software](how-to-install-software.md) and [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Create alert comments on an OT sensor

1. Sign into your OT sensor and select **System Settings** > **Network Monitoring** > **Alert Comments**.

1. In the **Alert comments** pane, in the **Description** field, enter the new comment, and select **Add**. The new comment appears in the **Description** list below the field.

    For example:

    :::image type="content" source="media/alerts/create-custom-comment.png" alt-text="Screenshot of the Alert comments pane on the OT sensor.":::

1. Select **Submit** to add your comment to the list of available comments in each alert on your sensor.

Custom comments are available in each alert on your sensor for team members to add. For more information, see [Add alert comments](how-to-view-alerts.md#add-alert-comments).

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
    |**Conditions**     | Define one or more conditions that must be met to trigger the alert. <br><br>- Select the **+** sign to create a condition set with multiple conditions that use the **AND** operator. The **+** sign is enabled only after selecting an **Alert protocol** value.<br>- If you select a MAC address or IP address as a variable, you must convert the value from a dotted-decimal address to decimal format. <br><br> You must add at least one condition to create a custom alert rule.        |
    |**Detected**     | Define a date and/or time range for the traffic you want to detect. Customize the days and time range to fit with maintenance hours or set working hours.      |
    |**Action**     | Define an action you want Defender for IoT to take automatically when the alert is triggered. <br>Have Defender for IoT create either an alert or event, with the specified severity.        |
    |**PCAP included** | If you've selected to create an event, clear the **PCAP included** option as needed. If you've selected to create an alert, the PCAP is always included, and can't be removed. |

    For example:

    :::image type="content" source="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png" alt-text="Screenshot of the Create custom alert rule pane for creating custom alert rules." lightbox="media/how-to-accelerate-alert-incident-response/create-custom-alert-rule.png":::

1. Select **Save** when you're done to save the rule.

### Edit a custom alert rule

To edit a custom alert rule, select the rule and then select the options (**...**) menu > **Edit**. Modify the alert rule as needed and save your changes.

Edits made to custom alert rules, such as changing a severity level or protocol, are tracked in the **Event timeline** page on the OT sensor.

For more information, see [Track sensor activity](how-to-track-sensor-activity.md).

### Disable, enable, or delete custom alert rules

Disable custom alert rules to prevent them from running without deleting them altogether.

In the **Custom alert rules** page, select one or more rules, and then select  **Disable**, **Enable**, or **Delete** in the toolbar as needed.

## Allow internet connections on an OT network

Decrease the number of unauthorized internet alerts by creating an allowlist of domain names on your OT sensor. When a DNS allowlist is configured, the sensor checks each unauthorized internet connectivity attempt against the list before triggering an alert. If the domain's FQDN is included in the allowlist, the sensor doesn’t trigger the alert and allows the traffic automatically.

All OT sensor users can view a currently configured list of domains in a [data mining report](how-to-create-data-mining-queries.md), including the FQDNs, resolved IP addresses, and the last resolution time.


**To define a DNS allowlist:**

1. Sign into your OT sensor as the *support* user and select the **Support** page.

1. In the search box, search for **DNS** and then locate the engine with the **Internet Domain Allowlist** description.

1. Select **Edit** :::image type="icon" source="media/how-to-generate-reports/manage-icon.png" border="false"::: for the **Internet Domain Allowlist** row. For example:

    :::image type="content" source="media/how-to-accelerate-alert-incident-response/dns-edit-configuration.png" alt-text="Screenshot of how to edit configurations for DNS in the sensor console." lightbox="media/how-to-accelerate-alert-incident-response/dns-edit-configuration.png":::

1. In the **Edit configuration** pane > **Fqdn allowlist** field, enter one or more domain names. Separate multiple domain names with commas. Your sensor won't generate alerts for unauthorized internet connectivity attempts on the configured domains.

1. Select **Submit** to save your changes.


**To view the current allowlist in a data mining report:**

When selecting a category in your [custom data mining report](how-to-create-data-mining-queries.md#create-an-ot-sensor-custom-data-mining-report), make sure to select **Internet Domain Allowlist** under the **DNS** category. 

For example:

:::image type="content" source="media/how-to-accelerate-alert-incident-response/data-mining-allowlist.png" alt-text="Screenshot of how to generate a custom data mining report for the allowlist in the sensor console." lightbox="media/how-to-accelerate-alert-incident-response/data-mining-allowlist.png":::

The generated data mining report shows a list of the allowed domains and each IP address that’s being resolved for those domains. The report also includes the TTL, in seconds, during which those IP addresses won't trigger an internet connectivity alert. For example:

:::image type="content" source="media/how-to-accelerate-alert-incident-response/data-mining-report-allowlist.png" alt-text="Screenshot of data mining report of allowlist in the sensor console." lightbox="media/how-to-accelerate-alert-incident-response/data-mining-report-allowlist.png":::

## Create alert exclusion rules on an on-premises management console

Create alert exclusion rules to instruct your sensors to ignore specific traffic on your network that would otherwise trigger an alert.

For example, if you know that all the OT devices monitored by a specific sensor will be going through maintenance procedures for two days, define an exclusion rule that instructs Defender for IoT to suppress alerts detected by this sensor during the predefined period.

**To create an alert exclusion rule**:

1. Sign into your on-premises management console and select **Alert Exclusion** on the left-hand menu.

1. On the **Alert Exclusion** page, select the **+** button at the top-right to add a new rule.

1. In the **Create Exclusion Rule** dialog, enter the following details:

    |Name  |Description  |
    |---------|---------|
    |**Name**     |  Enter a meaningful name for your rule. The name can't contain quotes (`"`).      |
    |**By Time Period**     |   Select a time zone and the specific time period you want the exclusion rule to be active, and then select **ADD**. <br><br>Use this option to create separate rules for different time zones. For example, you might need to apply an exclusion rule between 8:00 AM and 10:00 AM in three different time zones. In this case, create three separate exclusion rules that use the same time period and the relevant time zone.      |
    |**By Device Address**     |   Select and enter the following values, and then select **ADD**: <br><br>- Select whether the designated device is a source, destination, or both a source and destination device. <br>- Select whether the address is an IP address, MAC address, or subnet <br>- Enter the value of the IP address, MAC address, or subnet. |
    |**By Alert Title**     |  Select one or more alerts to add to the exclusion rule and then select **ADD**. To find alert titles, enter all, or part of an alert title and select the one you want from the dropdown list.        |
    |**By Sensor Name**     |  Select one or more sensors to add to the exclusion rule and then select **ADD**. To find sensor names, enter all or part of the sensor name and select the one you want from the dropdown list.         |

    > [!IMPORTANT]
    > Alert exclusion rules are `AND` based, which means that alerts are only excluded when all rule conditions are met.
    > If a rule condition is not defined, all options are included. For example, if you don't include the name of a sensor in the rule, the rule is applied to all sensors.

    A summary of the rule parameters is shown at the bottom of the dialog.

1. Check the rule summary shown at the bottom of the **Create Exclusion Rule** dialog and then select **SAVE**

### Create alert exclusion rules via API

Use the [Defender for IoT API](references-work-with-defender-for-iot-apis.md) to create alert exclusion rules from an external ticketing system or other system that manage network maintenance processes.

Use the [maintenanceWindow (Create alert exclusions)](api/management-alert-apis.md#maintenancewindow-create-alert-exclusions) API to define the sensors, analytics engines, start time, and end time to apply the rule.  Exclusion rules created via API are shown in the on-premises management console as read-only.

For more information, see 
[Defender for IoT API reference](references-work-with-defender-for-iot-apis.md).

## Next steps

> [!div class="nextstepaction"]
> [Microsoft Defender for IoT alerts](alerts.md)
