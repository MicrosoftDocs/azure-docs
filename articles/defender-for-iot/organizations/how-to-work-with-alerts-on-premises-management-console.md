---
title: Work with alerts on the on-premises management console
description: Use the on-premises management console to get an enterprise view of recent threats in your network and better understand how sensor users are handling them.
ms.date: 11/09/2021
ms.topic: how-to
---

# View and manage alerts on the the on-premises management console

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. OT alerts are triggered when OT network sensors detect changes or suspicious activity in network traffic that need your attention.

This article describes how to view Defender for IoT alerts on an on-premises management console, which aggregates alerts from all connected OT sensors. You can also view OT alerts on the [Azure portal](how-to-manage-cloud-alerts.md) or an [OT network sensor](how-to-view-alerts.md).

You can do the following from the **Alerts** page in the management console:

- Work with alert filters

- Work with alert counters

- View alert information

- Manage alert events

- Create alert exclusion rules

- Trigger alert exclusion rules from external systems

- Accelerate incident workflow with alert groups


## Prerequisites

- **To have alerts on the on-premises management console**, you must have an OT network sensor with alerts connected to your on-premises management console.

    For more information, see [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console).

- **To view alerts the on-premises management console**, sign in as an **Admin**, **Security Analyst**, or **Viewer** user.

- **To manage alerts on the on-premises management console**, sign in as an **Admin** or **Security Analyst** user.

    On the on-premises management console, you can *acknowledge* or *mute* an alert, depending on the alert type. Both *acknowledging* and *muting* an alert hides it once for the detected event.

## View alerts on the on-premises management console

1. On the on-premises management console, select the **Alerts** page.

1. Alerts are shown in a simple table, showing the sensor that triggered the alert and alert details in two columns.

1. Select an alert row to view full details. For example:

    :::image type="content" source="media/alerts/alerts-cm-expand.png" alt-text="Screenshot of the Alerts page on the on-premises management console with one alert expanded for details.":::

1. In an expanded alert row, do any of the following to view more context about the alert:

    - Select **OPEN SENSOR** to open the sensor that generated the alert and continue your investigation. For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md).

    - Select **SHOW DEVICES** to show the affected devices on a zone map. For more information, see [View information per zone](how-to-view-information-per-zone.md).

### Filter the alerts displayed

At the top of the **Alerts** page, use the **Free Search**, **Sites**, **Zones**, **Devices**, and **Sensors** options to filter the alerts displayed by specific parameters, or to help locate a specific alert.

Acknowledged alerts aren't listed by default. Select **Show Acknowledged Alerts** to include them in the list.

Select **Clear** to remove all filters.

## Manage alert status

Use the following options to manage alert status on your on-premises management console, depending on the alert type. Some alerts support acknowledgement, some support muting, and some support both. <!--why would we have both?-->

Both acknowledging and muting an alert hide it for this instance only, and the alert will be triggered again if the same event occurs.

- **To acknowledge or unacknowledge an alert**: In an expanded alert row, select **ACKNOWLEDGE** or **UNACKNOWLEDGE** as needed.

- **To mute or unmute an alert**: In an expanded alert row, hover over the top of the row and select the **Mute** button or **Unmute** button as needed. For example: <!--image-->

For more information, see [Learning alert traffic](alerts.md#learning-alert-traffic).

## Export alerts to a CSV file

You may want to export a selection of alerts to a CSV file for offline sharing and reporting.

1. On the **Alerts** page, use the search and filter options to show only the alerts you want to export.

1. Select **Export**.

The file is generated, and you're prompted to save it locally.


## Create forwarding rules

**To create a forwarding rule on the management console**:

1. Sign in to the sensor.

1. Select **Forwarding** on the side menu.

1. Select the :::image type="icon" source="media/how-to-work-with-alerts-on-premises-management-console/plus-add-icon.png" border="false"::: icon.

1. In the Create Forwarding Rule window, enter a name for the rule

    :::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/management-console-create-forwarding-rule.png" alt-text="Screenshot of the Create Forwarding Rule window..":::

   Define criteria by which to trigger a forwarding rule. Working with forwarding rule criteria helps pinpoint and manage the volume of information sent from the sensor to external systems.

1. Select the severity level from the drop-down menu.

    This is the minimum incident to forward, in terms of severity level. For example, if you select **Minor**, minor alerts and any alert above this severity level will be forwarded. Levels are predefined.

1. Select any protocols to apply.

    Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

1. Select which engines the rule should apply to.
 
   Select the required engines, or choose them all. Alerts from selected engines will be sent. 

1. Select which notifications you want to forward:
 
    -	**Report system notifications:** disconnected sensors, remote backup failures.

    -	**Report alert notifications:** date and time of alert, alert title, alert severity, source and destination name and IP, suspicious traffic and engine that detected the event.

1. Select **Add** to add an action to apply. Fill in any parameters needed for the selected action.

    Forwarding rule actions instruct the sensor to forward alert information to partner vendors or servers. You can create multiple actions for each forwarding rule.

1. Add another action if desired.

1. Select **Save**.

You can learn more [About forwarded alert information](how-to-forward-alert-information-to-partners.md#about-forwarded-alert-information). You can also [Test forwarding rules](how-to-forward-alert-information-to-partners.md#test-forwarding-rules), or [Edit and delete forwarding rules](how-to-forward-alert-information-to-partners.md#edit-and-delete-forwarding-rules). You can also learn more about [Forwarding rules and alert exclusion rules](how-to-forward-alert-information-to-partners.md#forwarding-rules-and-alert-exclusion-rules).



## Next steps

Review the [Defender for IoT Engine alerts](alert-engine-messages.md).