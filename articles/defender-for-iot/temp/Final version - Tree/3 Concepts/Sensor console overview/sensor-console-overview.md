---
title: Sensor console overview
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/02/2020
ms.topic: article
ms.service: azure
---

# About the Azure Defender for IoT sensor console

You can use the console's features to gain visibility and insight into your network perform forensics and device analysis, handle threats, forward information to partner systems, manage users.

You may not have access to all of the features described in this guide. See [User Roles and Permissions](./user-roles-and-permissions.md) for details.

## Console elements

:::image type="content" source="media/azure-defender-for-iot-dashboard-explanation-screen.png" alt-text="User Roles and Permissions":::

The opening screen elements include:

| No. | Element | Description |
|-----|---------|-------------|
| 1. | Side Menu | Contains links to the windows available to the current user based on their role and permissions.|
| 2. | Window Name | Displays the name of the window being viewed. |
| 3. | Alerts by Severity | Displays the total number of unacknowledged alerts in each of the four categories of severity (Critical, Major, Minor, and Warnings). |
| 4. |  Event Timeline | Lists all of the alerts in chronological order, starting with the most recent alert at the top. |
| 5. | Learning Mode Indicator | Displays the :::image type="content" source="media/learning-indicator-image.png" alt-text="Learning"::: indicator when in learning mode. |
| 6. | User Profile | Select the user profile icon to:<br /> - View the first and last name of the active user.  <br /> - Edit your user profile and system settings. <br /> - Access help. <br /> - Sign out of the console|.
| 7. | Sensor Name and Version Number | Displays the sensor name and version number. You can choose to update the name of your sensor if it is locally managed. |
| 8. | Packets Per Second Gauge | Displays the number of packets being acknowledged by the system per second. |
| 9. | Unacknowledged Alerts Gauge | Displays the number of alerts that have not yet been acknowledged. |
| 10. | Unacknowledged Alerts List | Lists all unacknowledged alerts. |

The console's main window provides a list of options available that will vary based on the user type that is signed in.
> [!Note] 
> See [Manage Users](./manage-users.md) to learn more about user roles.

## Access to console tools

Console tools are accessed from the side menu.

| Navigation |  |  |
| -----------|--|--|
| Window | Icon | Description |
| Dashboard | :::image type="content" source="./the-dashboard.md" alt-text="Dashboard](media/dashboard-icon-azure.png)  | Provides an intuitive snapshot of the state of the network's security. See [The Dashboard"::: for details. |
| Device Map | :::image type="content" source="./the-asset-map.md" alt-text="Device Map](media/asset-map-icon-azure.png) | View the network devices, device connections, and device properties in a map. Various zoom, highlight, and filter options are available to display your network. See [The Device Map"::: for details. |
| Device Inventory | :::image type="content" source="./the-asset-inventory.md" alt-text="Device Inventory](media/asset-inventory-icon-azure.png)  | The Device Inventory displays an extensive range device attributes detected by this sensor. Options are available to: <br /> - Filter the information according to the table fields, and see the filtered information displayed. See [Working with Device Inventory Filters](./working-with-asset-inventory-filters.md). <br /> - Export information to a CSV file. <br /> - Import windows registry details. <br /> See [The Device Inventory"::: for details.|
| Alerts | :::image type="content" source="./alerts.md" alt-text="Alerts](media/alerts-icon-azure.png) | Display alerts when policy violations occur, deviations from the baseline behavior, or any type of suspicious activity in the network is detected. <br /> See [Alerts"::: for details.|
| Reports | :::image type="content" source="./reports-based-on-data-mining.md" alt-text="Reports](media/reports-icon-azure.png) | View reports that are based on data mining queries.<br /> See [Reports"::: for details. |


| Analysis |  |  |
|---|---|---|
| Window | Icon | Description |
| Event Timeline | :::image type="content" source="./event-timeline.md" alt-text="Event Timeline](media/event-timeline-icon-azure.png) | Contains a timeline with information regarding, alerts, network events (informational), user operations such, as user sign in, and user deletion.<br />See [Event Timeline"::: for details.|


| Navigation |  |  |
|---|---|---|
| Data Mining | :::image type="content" source="./data-mining-reports.md" alt-text="Data Mining](media/data-mining-icon-azure.png) | Data mining tools let you generate comprehensive and granular information regarding your network's devices at various layers. See [Data Mining Reports"::: for details. |
| Trends and Statistics | :::image type="content" source="trends-and-statistics.md" alt-text="Trends and Statistics](media/trends-and-statistics-icon-azure.jpg) | View trends and statistics in an extensive range of widgets. See [Trends and Statistics"::: for details. |
| Vulnerabilities | :::image type="content" source="./risk-assessment-reporting.md" alt-text="Vulnerabilities](media/vulnerabilities-icon-azure.png) | Displays the Vulnerabilities window. <br /> See [Risk Assessment Reporting"::: for details. |


| Admin |  |  |
|---|---|---|
| Window | Icon | Description |
| Users | :::image type="content" source="./manage-users.md" alt-text="Users](media/users-icon-azure.png) | Define users and roles with various access levels.<br /> See [Manage Users"::: for details. |
| Forwarding | :::image type="content" source="./forward-alert-information-to-3rd-parties.md" alt-text="Forwarding](media/forwarding-icon-azure.png) | Forward alert information to partner vendors using the forwarding rules. In addition to the forwarding rule, actions delivered with your system, and other actions may become available when you integrate with partner vendors.<br /> See [Forward Alert Information to Third Parties"::: for details. |
| System Settings | :::image type="content" source="./system-settings.md" alt-text="System Settings](media/system-settings-icon-azure.png) | Configure the system settings. For example define DHCP settings, mail server details, or create port aliases.<br /> See [System Settings"::: for details. |
| Import Settings | :::image type="content" source="./import-asset-information.md" alt-text="Import Settings](media/import-settings-icon-azure.png) | Displays the Import Settings window. You can perform manual changes in a device's information.<br /> See [Import Device Information"::: for details. |


| Support |  |  |
|----|---|---|
| Support | :::image type="content" source="https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099" alt-text="Support](media/support-icon-azure.png)  | Contact [support.microsoft.com"::: for help. |
