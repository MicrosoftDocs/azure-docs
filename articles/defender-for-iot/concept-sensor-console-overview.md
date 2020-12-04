---
title: Sensor console overview
description: Use the console's features to gain visibility and insight into your network.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/2/2020
ms.service: azure
ms.topic: conceptual
---

# About the Defender for IoT sensor console

The Azure Defender for IoT sensor console gives you visibility and insight into your network. It helps you perform forensics and device analysis, handle threats, forward information to partner systems, and more.

## Console elements

:::image type="content" source="media/concept-sensor-console-overview/azure-defender-for-iot-dashboard-explanation-screen.png" alt-text="Screenshot that shows console elements.":::

Elements of the console's main window include:

| Number | Element | Description |
|-----|---------|-------------|
| 1. | Side menu | Contains links to the tools available to the signed-in user, based on that user's role.|
| 2. | Window name | Displays the name of the window that's being viewed. |
| 3. | Alerts by severity | Displays the total number of unacknowledged alerts per category (**Critical**, **Major**, **Minor**, and **Warnings**). |
| 4. |  Event timeline | Lists all of the alerts in chronological order, starting with the most recent alert at the top. |
| 5. | Learning mode indicator | Displays the :::image type="content" source="media/concept-sensor-console-overview/learning-indicator-image.png" alt-text="Learning"::: indicator when in learning mode. |
| 6. | User profile | Select the user profile icon to:<br /> - View the first and last name of the active user.  <br /> - Edit your user profile and system settings. <br /> - Access help. <br /> - Sign out of the console.|
| 7. | Sensor name and version number | Displays the sensor name and version number. You can choose to update the name of your sensor if it's locally managed. |
| 8. | Packets per second gauge | Displays the number of packets that the system acknowledges per second. |
| 9. | Unacknowledged alerts gauge | Displays the number of alerts that have not yet been acknowledged. |
| 10. | Unacknowledged alerts list | Lists all unacknowledged alerts. |

The options available in the console's main window can vary, based on the user who signed in.

## User roles and permissions

User roles are designed to facilitate granular access to console tools. The following roles are available:

- **Read Only** – Read Only users perform tasks such as viewing alerts and devices on the Device map. These users have access to options displayed on the **Navigation** pages.

- **Security Analyst** – The security analyst has the permissions of the RO user and can also perform actions on devices, investigate and acknowledge alerts, use the investigation features. Security analysts can see the **Navigation** and **Analysis** sections.

- **Administrator** – The administrator has all the permissions of the RO and the security analyst and can also manage the system configuration, create, and delete users and create notifications. Administrators can see the **Navigation, Analysis**, and **Administration** sections.

## Console tools

You access console tools from the side menu.

**Navigation** 
| Window | Icon | Description |
| -----------|--|--|
| Dashboard | :::image type="icon" source="media/concept-sensor-console-overview/dashboard-icon-azure.png" border="false"::: | View an intuitive snapshot of the state of the network's security. |
| Device map | :::image type="icon" source="media/concept-sensor-console-overview/asset-map-icon-azure.png" border="false"::: | View the network devices, device connections, and device properties in a map. Various zooms, highlight, and filter options are available to display your network. |
| Device inventory | :::image type="icon" source="media/concept-sensor-console-overview/asset-inventory-icon-azure.png" border="false":::  | The device inventory displays an extensive range of device attributes that this sensor detects. Options are available to: <br /> - Filter the information according to the table fields, and see the filtered information displayed. <br /> - Export information to a CSV file. <br /> - Import Windows registry details.|
| Alerts | :::image type="icon" source="media/concept-sensor-console-overview/alerts-icon-azure.png" border="false"::: | Display alerts when policy violations occur, deviations from the baseline behavior occur, or any type of suspicious activity in the network is detected. |
| Reports | :::image type="icon" source="media/concept-sensor-console-overview/reports-icon-azure.png" border="false"::: | View reports that are based on data mining queries. |

**Analysis**

| Window| Icon | Description |
|---|---|---|
| Event timeline | :::image type="icon" source="media/concept-sensor-console-overview/event-timeline-icon-azure.png" border="false"::: | Contains a timeline with information about alerts, network events (informational), and user operations, such as user sign-ins and user deletions.|

**Navigation**
| Window | Icon | Description |
|---|---|---|
| Data mining | :::image type="icon" source="media/concept-sensor-console-overview/data-mining-icon-azure.png" border="false"::: | Generate comprehensive and granular information regarding your network's devices at various layers. |
| Trends and statistics | :::image type="icon" source="media/concept-sensor-console-overview/trends-and-statistics-icon-azure.jpg" border="false"::: | View trends and statistics in an extensive range of widgets. |
| Risk Assessment | :::image type="icon" source="media/concept-sensor-console-overview/vulnerabilities-icon-azure.png" border="false"::: | Display the **Vulnerabilities** window. |

**Admin**
| Window | Icon | Description |
|---|---|---|
| Users | :::image type="icon" source="media/concept-sensor-console-overview/users-icon-azure.png" border="false"::: | Define users and roles with various access levels. |
| Forwarding | :::image type="icon" source="media/concept-sensor-console-overview/forwarding-icon-azure.png" border="false"::: | Forward alert information to partners integrating with Defender for IoT, to email addresses, to webhook servers, and more. <br /> See [Forward alert information](how-to-forward-alert-information.md) for details. |
| System settings | :::image type="icon" source="media/concept-sensor-console-overview/system-settings-icon-azure.png" border="false"::: | Configure the system settings. For example, define DHCP settings, provide mail server details, or create port aliases. |
| Import settings | :::image type="icon" source="media/concept-sensor-console-overview/import-settings-icon-azure.png" border="false"::: | Display the **Import Settings** window. You can perform manual changes in a device's information.<br /> See [Import device information](how-to-import-device-information.md) for details. |

**Support**
| Window| Icon | Description |
|----|---|---|
| Support | :::image type="icon" source="media/concept-sensor-console-overview/support-icon-azure.png" border="false"::: | Contact [Microsoft Support](support.microsoft.com) for help. |

## See also

[About the on-premises management console](concept-air-gapped-networks.md)