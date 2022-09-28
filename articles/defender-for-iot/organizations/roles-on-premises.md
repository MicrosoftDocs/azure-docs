---
title: On-premises users and roles for Defender for IoT - Microsoft Defender for IoT
description: Learn about the on-premises user roles available for OT monitoring with Microsoft Defender for IoT network sensors and on-premises management consoles.
ms.date: 09/19/2022
ms.topic: conceptual
---

# On-premises users and roles for OT monitoring with Defender for IoT

When working with OT networks, Defender for IoT services and data is available from both the Azure portal and from on-premises sensor and management consoles.

This article provides a reference of the actions available for default on-premises users and each on-premises user role.


## On-premises user roles

The following roles are available on OT network sensors and on-premises management consoles.

- **Read only**: Read-only users perform tasks such as viewing alerts and devices on the device map. These users have access to options displayed under **Discover**.

- **Security analyst**: Security Analysts have Read-only user permissions. They can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Discover** and **Analyze**.

- **Administrator**: Administrators have access to all tools, including system configurations, creating and managing users, and more. These users have access to options displayed under **Discover**, **Analyze**, and **Manage** sections of the console main screen.

Permissions applied to each role differ between the sensor and the on-premises management console. The following tables list the permissions available for each role, in each location.

### Role-based permissions for OT network sensors

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| View the dashboard | ✔ | ✔ |✔ |
| Control map zoom views | - | - | ✔ |
| View alerts | ✔ | ✔ | ✔ |
| Manage alerts: acknowledge, learn, and pin |-  | ✔ | ✔ |
| View events in a timeline | - | ✔ | ✔ |
| Authorize devices, known scanning devices, programming devices |  | ✔ | ✔ |
| Merge and delete devices |-  |-  | ✔ |
| View investigation data | ✔ | ✔ | ✔ |
| Manage system settings | - |  -| ✔ |
| Manage users |-  | - | ✔ |
| Change passwords |- | -| ✔, for users with the **Security Analyst** and **Read-only** roles only. |
| DNS servers for reverse lookup |-  |  -| ✔ |
| Send alert data to partners | - | ✔ | ✔ |
| Create alert comments |-  | ✔ | ✔ |
| View programming change history | ✔ | ✔ | ✔ |
| Create customized alert rules | - | ✔ | ✔ |
| Manage multiple notifications simultaneously | - | ✔ | ✔ |
| Manage certificates | - | - | ✔ |
| Session timeout when users are not active | 30 minutes | 30 minutes | 30 minutes |

### Role-based permissions for the on-premises management console

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| View and filter the enterprise map | ✔ | ✔ | ✔ |
| Build a site | - | - | ✔ |
| Manage a site (add and edit zones) |-  |-  | ✔ |
| View and filter device inventory | ✔ | ✔ | ✔ |
| View and manage alerts: acknowledge, learn, and pin | ✔ | ✔ | ✔ |
| Generate reports |-  | ✔ | ✔ |
| View risk assessment reports | - | ✔ | ✔ |
| Set alert exclusions | - | ✔ | ✔ |
| View or define access groups | - | - | ✔ |
| Manage system settings | - | - | ✔ |
| Manage users | - |-  | ✔ |
| Change passwords |- | -| ✔ for users with the **Security Analyst** and **Read-only** roles only|
| Send alert data to partners | - | - | ✔ |
| Manage certificates | - | - | ✔ |
| Session timeout when users aren't active | 30 minutes | 30 minutes  | 30 minutes  |


## Next steps

For more information, see:

- [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md)
- [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md)