---
title: Sensor console overview
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/24/2020
ms.topic: article
ms.service: azure
ms.topic: conceptual
---

# About the Defender for IoT sensor console

You can use the console's features to gain visibility and insight into your network perform forensics and device analysis, handle threats, forward information to partner systems, manage users.

You may not have access to all of the features described in this guide. See [User roles and permissions](concept-user-roles-and-permissions.md) for details.

## Console elements

:::image type="content" source="media/concept-sensor-console-overview/azure-defender-for-iot-dashboard-explanation-screen.png" alt-text="Console elements":::

The opening screen elements include:

| Number | Element | Description |
|-----|---------|-------------|
| 1. | Side menu | Contains links to the windows available to the current user based on their role and permissions.|
| 2. | Window name | Displays the name of the window being viewed. |
| 3. | Alerts by severity | Displays the total number of unacknowledged alerts in each of the four categories of severity (Critical, Major, Minor, and Warnings). |
| 4. |  Event timeline | Lists all of the alerts in chronological order, starting with the most recent alert at the top. |
| 5. | Learning mode indicator | Displays the :::image type="content" source="media/concept-sensor-console-overview/learning-indicator-image.png" alt-text="Learning"::: indicator when in learning mode. |
| 6. | User profile | Select the user profile icon to:<br /> - View the first and last name of the active user.  <br /> - Edit your user profile and system settings. <br /> - Access help. <br /> - Sign out of the console|.
| 7. | Sensor name and version number | Displays the sensor name and version number. You can choose to update the name of your sensor if it is locally managed. |
| 8. | Packets per second gauge | Displays the number of packets being acknowledged by the system per second. |
| 9. | Unacknowledged alerts gauge | Displays the number of alerts that have not yet been acknowledged. |
| 10. | Unacknowledged alerts list | Lists all unacknowledged alerts. |

The console's main window provides a list of options available that will vary based on the user type that is signed in.
> [!Note] 
> See [Overview](how-to-create-and-manage-users.md) to learn more about user roles.

## Access to console tools

Console tools are accessed from the side menu.

**Navigation** 
| Window | Icon | Description |
| -----------|--|--|
| Dashboard | :::image type="icon" source="media/concept-sensor-console-overview/dashboard-icon-azure.png" border="false"::: | Provides an intuitive snapshot of the state of the network's security. |
| Device map | :::image type="icon" source="media/concept-sensor-console-overview/asset-map-icon-azure.png" border="false"::: | View the network devices, device connections, and device properties in a map. Various zooms, highlight, and filter options are available to display your network. |
| Device inventory | :::image type="icon" source="media/concept-sensor-console-overview/asset-inventory-icon-azure.png" border="false":::  | The device inventory displays an extensive range device attributes detected by this sensor. Options are available to: <br /> - Filter the information according to the table fields, and see the filtered information displayed. <br /> - Export information to a CSV file. <br /> - Import windows registry details.|
| Alerts | :::image type="icon" source="media/concept-sensor-console-overview/alerts-icon-azure.png" border="false"::: | Display alerts when policy violations occur, deviations from the baseline behavior, or any type of suspicious activity in the network is detected. |
| Reports | :::image type="icon" source="media/concept-sensor-console-overview/reports-icon-azure.png" border="false"::: | View reports that are based on data mining queries. |


**Analysis**
| Window | Icon | Description |
|---|---|---|
| Event timeline | :::image type="icon" source="media/concept-sensor-console-overview/event-timeline-icon-azure.png" border="false"::: | Contains a timeline with information regarding, alerts, network events (informational), user operations such, as user sign-in, and user deletion.|


**Navigation**
| Window | Icon | Description |
|---|---|---|
| Data mining | :::image type="icon" source="media/concept-sensor-console-overview/data-mining-icon-azure.png" border="false"::: | Data mining tools let you generate comprehensive and granular information regarding your network's devices at various layers. |
| Trends and statistics | :::image type="icon" source="media/concept-sensor-console-overview/trends-and-statistics-icon-azure.jpg" border="false"::: | View trends and statistics in an extensive range of widgets. |
| Vulnerabilities | :::image type="icon" source="media/concept-sensor-console-overview/vulnerabilities-icon-azure.png" border="false"::: | Displays the vulnerabilities window. |


**Admin**
| Window | Icon | Description |
|---|---|---|
| Users | :::image type="icon" source="media/concept-sensor-console-overview/users-icon-azure.png" border="false"::: | Define users and roles with various access levels. |
| Forwarding | :::image type="icon" source="media/concept-sensor-console-overview/forwarding-icon-azure.png" border="false"::: | Forward alert information to partner vendors using the forwarding rules. In addition to the forwarding rule, actions delivered with your system, and other actions may become available when you integrate with partner vendors.<br /> See [Forward alert information to partners](how-to-forward-alert-information-to-partners.md) for details. |
| System settings | :::image type="icon" source="media/concept-sensor-console-overview/system-settings-icon-azure.png" border="false"::: | Configure the system settings. For example define DHCP settings, mail server details, or create port aliases. |
| Import settings | :::image type="icon" source="media/concept-sensor-console-overview/import-settings-icon-azure.png" border="false"::: | Displays the Import Settings window. You can perform manual changes in a device's information.<br /> See [Import device information](how-to-import-device-information.md) for details. |


**Support**
| Window | Icon | Description |
|----|---|---|
| Support | :::image type="icon" source="media/concept-sensor-console-overview/support-icon-azure.png" border="false"::: | Contact support.microsoft.com for help. |
