---
title: View and manage OT alerts on the on-premises management console - Microsoft Defender for IoT
description: Learn how to view and manage OT alerts collected from all connected OT network sensors on a Microsoft Defender for IoT on-premises management console.
ms.date: 01/01/2023
ms.topic: how-to
---

# View and manage alerts on the on-premises management console

Microsoft Defender for IoT alerts enhance your network security and operations with real-time details about events logged in your network. OT alerts are triggered when OT network sensors detect changes or suspicious activity in network traffic that needs your attention.

This article describes how to view Defender for IoT alerts on an on-premises management console, which aggregates alerts from all connected OT sensors. You can also view OT alerts on the [Azure portal](how-to-manage-cloud-alerts.md) or an [OT network sensor](how-to-view-alerts.md).

## Prerequisites

- **To have alerts on the on-premises management console**, you must have an OT network sensor with alerts connected to your on-premises management console. For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md) and [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console).

- **To view alerts the on-premises management console**, sign in as an *Admin*, *Security Analyst*, or *Viewer* user.

- **To manage alerts on the on-premises management console**, sign in as an *Admin* or *Security Analyst* user. Management activities include acknowledging or muting an alert, depending on the alert type.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## View alerts on the on-premises management console

1. Sign into the on-premises management console and select **Alerts** on the left-hand menu.

    Alerts are shown in a simple table, showing the sensor that triggered the alert and alert details in two columns.

1. Select an alert row to expand its full details. For example:

    :::image type="content" source="media/alerts/alerts-cm-expand.png" alt-text="Screenshot of the Alerts page on the on-premises management console with one alert expanded for details.":::

1. In an expanded alert row, do any of the following to view more context about the alert:

    - Select **OPEN SENSOR** to open the sensor that generated the alert and continue your investigation. For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md).

    - Select **SHOW DEVICES** to show the affected devices on a zone map. For more information, see [View information per zone](how-to-view-information-per-zone.md).

> [!NOTE]
> On the on-premises management console, *New* alerts are called *Unacknowledged*, and *Closed* alerts are called *Acknowledged*. For more information, see [Alert statuses and triaging options](alerts.md#alert-statuses-and-triaging-options).

### Filter the alerts displayed

At the top of the **Alerts** page, use the **Free Search**, **Sites**, **Zones**, **Devices**, and **Sensors** options to filter the alerts displayed by specific parameters, or to help locate a specific alert.

- [Acknowledged alerts](alerts.md#alert-statuses-and-triaging-options) aren't listed by default. Select **Show Acknowledged Alerts** to include them in the list.

- Select **Clear** to remove all filters.

## Manage alert status and triage alerts

Use the following options to manage alert status on your on-premises management console, depending on the alert type:

- **To acknowledge or unacknowledge an alert**: In an expanded alert row, select **ACKNOWLEDGE** or **UNACKNOWLEDGE** as needed.

- **To mute or unmute an alert**: In an expanded alert row, hover over the top of the row and select the :::image type="icon" source="media/alerts/mute-on-prem.png" border="false"::: **Mute** button or :::image type="icon" source="media/alerts/unmute-on-prem.png" border="false"::: **Unmute** button as needed.

For more information, see [Alert statuses and triaging options](alerts.md#alert-statuses-and-triaging-options).

## Export alerts to a CSV file

You may want to export a selection of alerts to a CSV file for offline sharing and reporting.

1. Sign into your on-premises management console and select the **Alerts** page.

1. Use the [search and filter](#filter-the-alerts-displayed) options to show only the alerts you want to export.

1. Select **Export**.

The CSV file is generated, and you're prompted to save it locally.

## Next steps

> [!div class="nextstepaction"]
> [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)

> [!div class="nextstepaction"]
> [View and manage alerts on your OT sensor](how-to-view-alerts.md)

> [!div class="nextstepaction"]
> [Accelerate on-premises OT alert workflows](how-to-accelerate-alert-incident-response.md)

> [!div class="nextstepaction"]
> [Forward alert information](how-to-forward-alert-information-to-partners.md)

> [!div class="nextstepaction"]
> [Microsoft Defender for IoT alerts](alerts.md)

> [!div class="nextstepaction"]
> [Data retention across Microsoft Defender for IoT](references-data-retention.md)
