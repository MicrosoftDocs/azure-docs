---
title: On-premises users and roles for Defender for IoT - Microsoft Defender for IoT
description: Learn about the on-premises user roles available for OT monitoring with Microsoft Defender for IoT network sensors and on-premises management consoles.
ms.date: 09/19/2022
ms.topic: concept-article
---

# On-premises users and roles for OT monitoring with Defender for IoT

When working with OT networks, Defender for IoT services and data is available from on-premises OT network sensors and the on-premises sensor management consoles, in addition to Azure.

This article provides:

- A description of the default, privileged users that come with Defender for IoT software installation
- A reference of the actions available for each on-premises user role, on both OT network sensors and the on-premises management console

## Default privileged on-premises users

By default, each [sensor](ot-deploy/install-software-ot-sensor.md) and [on-premises management console](ot-deploy/install-software-on-premises-management-console.md) is installed with a privileged *support* user. The on-premises management console is also installed with a default *cyberx* user.

The privileged *support* and *cyberx* users have access to advanced tools for troubleshooting and setup, such as the CLI. When first setting up your sensor or on-premises management console, first sign in with the *support* user, create an initial user with an **Admin** role, and then use that admin user to create other users with other roles.

In sensor software versions earlier than [23.1.x](whats-new.md#july-2023), the *cyberx* and *cyberx_host* privileged users are also available. In newly installed versions 23.1.x and higher, the *cyberx* and *cyberx_host* users are available, but not enabled by default. To enable these extra privileged users, such as to use the [Defender for IoT CLI](references-work-with-defender-for-iot-cli-commands.md), [change their passwords](manage-users-sensor.md#change-a-sensor-users-password).

## On-premises user roles

The following roles are available on OT network sensors and on-premises management consoles:

|Role  |Description  |
|---------|---------|
|**Admin**     |  Admin users have access to all tools, including system configurations, creating and managing users, and more.   |
|**Security Analyst**     |  Security Analysts don't have admin-level permissions for configurations, but can perform actions on devices, acknowledge alerts, and use investigation tools. <br><br>Security Analysts can access options on the sensor displayed in the **Discover** and **Analyze** menus on the sensor, and in the **NAVIGATION** and **ANALYSIS** menus on the on-premises management console.    |
|**Read-Only**     | Read-only users perform tasks such as viewing alerts and devices on the device map. <br><br>Read-Only users can access options displayed in the **Discover** and **Analyze** menus on the sensor, in read-only mode, and in the **NAVIGATION** menu on the on-premises management console.        |

When first deploying an OT monitoring system, sign in to your sensors and on-premises management console with one of the [default, privileged users](#default-privileged-on-premises-users) described above. Create your first **Admin** user, and then use that user to create other users and assign them to roles.

Permissions applied to each role differ between the sensor and the on-premises management console. For more information, see the tables below for the permissions available for each role, on the [sensor](#role-based-permissions-for-ot-network-sensors) and on the [on-premises management console](#role-based-permissions-for-the-on-premises-management-console).

## Role-based permissions for OT network sensors

| Permission | Read Only | Security Analyst | Admin |
|--|--|--|--|
| **View the dashboard** | ✔ | ✔ |✔ |
| **Control map zoom views** | - | - | ✔ |
| **View alerts** | ✔ | ✔ | ✔ |
| **Manage alerts**: acknowledge, learn, and mute |-  | ✔ | ✔ |
| **View events in a timeline** | - | ✔ | ✔ |
| **Authorize devices**, known scanning devices, programming devices | - | ✔ | ✔ |
| **Merge and delete devices** |-  |-  | ✔ |
| **View investigation data** | ✔ | ✔ | ✔ |
| **Manage system settings** | - |  -| ✔ |
| **Manage users** |-  | - | ✔ |
| **Change passwords** |- | -| ✔[*](#pw-sensor) |
| **DNS servers for reverse lookup** |-  |  -| ✔ |
| **Send alert data to partners** | - | ✔ | ✔ |
| **Create alert comments** |-  | ✔ | ✔ |
| **View programming change history** | ✔ | ✔ | ✔ |
| **Create customized alert rules** | - | ✔ | ✔ |
| **Manage multiple notifications simultaneously** | - | ✔ | ✔ |
| **Manage certificates** | - | - | ✔ |

> [!NOTE]
> <a name="pw-sensor"></a>**Admin** users can only change passwords for themselves or for other users with the **Security Analyst** and **Read-only** roles.

## Role-based permissions for the on-premises management console

| Permission | Read Only | Security Analyst | Admin |
|--|--|--|--|
| **View and filter the enterprise map** | ✔ | ✔ | ✔ |
| **Build a site** | - | - | ✔ |
| **Manage a site** (add and edit zones) |-  |-  | ✔ |
| **View and filter device inventory** | ✔ | ✔ | ✔ |
| **View and manage alerts**: acknowledge, learn, and mute | ✔ | ✔ | ✔ |
| **Generate reports** |-  | ✔ | ✔ |
| **View risk assessment reports** | - | ✔ | ✔ |
| **Set alert exclusions** | - | ✔ | ✔ |
| **View or define access groups** | - | - | ✔ |
| **Manage system settings** | - | - | ✔ |
| **Manage users** | - |-  | ✔ |
| **Change passwords** |- | -| ✔[*](#pw-cm)|
| **Send alert data to partners** | - | - | ✔ |
| **Manage certificates** | - | - | ✔ |

> [!NOTE]
> <a name="pw-cm"></a>**Admin** users can only change passwords for themselves or for other users with the **Security Analyst** and **Read-only** roles.

## Next steps

For more information, see:

- [Microsoft Defender for IoT user management](manage-users-overview.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)
- [Create and manage users on an on-premises management console](manage-users-on-premises-management-console.md)
- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
