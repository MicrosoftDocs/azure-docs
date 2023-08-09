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

Before performing the procedures in this article, make sure that you have:

- An on-premises management console [installed](ot-deploy/install-software-on-premises-management-console.md), [activated, and configured](ot-deploy/activate-deploy-management.md). To view alerts by location or zone, make sure that you've [configured sites and zones](ot-deploy/sites-and-zones-on-premises.md) on the on-premises management console.

- One or more OT sensors [installed](ot-deploy/install-software-ot-sensor.md), [configured, activated](ot-deploy/activate-deploy-sensor.md), and [connected to your on-premises management console](ot-deploy/connect-sensors-to-management.md). To view alerts per zone, make sure that each sensor is assigned to a specific zone.

- Access to the on-premises management console with one of the following [user roles](roles-on-premises.md):

    - **To view alerts the on-premises management console**, sign in as an *Admin*, *Security Analyst*, or *Viewer* user.

    - **To manage alerts on the on-premises management console**, sign in as an *Admin* or *Security Analyst* user. Management activities include acknowledging or muting an alert, depending on the alert type.

## View alerts on the on-premises management console

1. Sign into the on-premises management console and select **Alerts** on the left-hand menu.

    Alerts are shown in a simple table, showing the sensor that triggered the alert and alert details in two columns.

1. Select an alert row to expand its full details. For example:

    :::image type="content" source="media/alerts/alerts-cm-expand.png" alt-text="Screenshot of the Alerts page on the on-premises management console with one alert expanded for details.":::

1. In an expanded alert row, do any of the following to view more context about the alert:

    - Select **OPEN SENSOR** to open the sensor that generated the alert and continue your investigation. For more information, see [View and manage alerts on your OT sensor](how-to-view-alerts.md).

    - Select **SHOW DEVICES** to show the affected devices on a zone map. For more information, see [Create OT sites and zones on an on-premises management console](ot-deploy/sites-and-zones-on-premises.md).

> [!NOTE]
> On the on-premises management console, *New* alerts are called *Unacknowledged*, and *Closed* alerts are called *Acknowledged*. For more information, see [Alert statuses and triaging options](alerts.md#alert-statuses-and-triaging-options).

### Filter the alerts displayed

At the top of the **Alerts** page, use the **Free Search**, **Sites**, **Zones**, **Devices**, and **Sensors** options to filter the alerts displayed by specific parameters, or to help locate a specific alert.

- [Acknowledged alerts](alerts.md#alert-statuses-and-triaging-options) aren't listed by default. Select **Show Acknowledged Alerts** to include them in the list.

- Select **Clear** to remove all filters.

### View alerts by location

To view alerts from connected OT sensors across your entire global network, use the **Enterprise View** map on an on-premises management console.

1. Sign into your on-premises management console and select **Enterprise View**. The default map view shows your sites at their locations around the world.

    (Optional) Use the **All Sites** and **All Regions** menus at the top of the page to filter your map and display only specific sites, or only specific regions.

1. From the **Default View** menu at the top of the page, select any of the following to drill down to specific types of alerts:

    - **Risk Management**. Highlights site risk alerts, helping you prioritize mitigation activities and plan security improvements.
    - **Incident Response** Highlights any active (unacknowledged) alerts on each site.
    - **Malicious Activity**. Highlights malware alerts, which require immediate action.
    - **Operational Alerts**. Highlights operational alerts, such as PLC stops and firmware or program uploads.

    In any view but the **Default View**, your sites appear in red, yellow, or green. Red sites have alerts that require immediate action, yellow sites have alerts that justify investigation, and green sites require no action.

1. Select any site that's red or yellow, and then select the :::image type="icon" source="media/how-to-work-with-alerts-on-premises-management-console/alerts-icon.png" border="false"::: alerts button for a specific OT sensor to jump to that sensor's current alerts. For example:

    :::image type="content" source="media/how-to-work-with-alerts-on-premises-management-console/select-alerts-button.png" alt-text="Screenshot showing the Alerts button.":::

    The **Alerts** page opens, automatically filtered to the selected alerts.

### View alerts by zone

To view alerts from connected OT sensors for a specific zone, use the **Site Management** page on an on-premises management console.

1. Sign into your on-premises management console and select **Site Management**. 

1. Locate the site and zone you want to view, using the filtering options at the top as needed:

    - **Connectivity**: Select to view only all OT sensors, or only connected / disconnected sensors only.
    - **Upgrade Status**: Select to view all OT sensors, or only those with a specific [software update status](update-ot-software.md#update-an-on-premises-management-console).
    - **Business Unit**: Select to view all OT sensors, or only those from a [specific business unit](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).
    - **Region**: Select to view all OT sensors, or only those from a [specific region](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).

1. Select the :::image type="icon" source="media/how-to-work-with-alerts-on-premises-management-console/alerts-icon.png" border="false":::  alerts button for a specific OT sensor to jump to that sensor's current alerts.

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
