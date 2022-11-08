---
title: On-premises users and roles for Defender for IoT - Microsoft Defender for IoT
description: Learn about the on-premises user roles available for OT monitoring with Microsoft Defender for IoT network sensors and on-premises management consoles.
ms.date: 09/19/2022
ms.topic: conceptual
---

# On-premises users and roles for OT monitoring with Defender for IoT

When working with OT networks, Defender for IoT services and data is available from both the Azure portal and from on-premises OT network sensors and the on-premises sensor management consoles.

This article provides a description of the default user roles that come with Defender for IoT software installation, and a reference of the actions available for each on-premises user role on OT network sensors and the on-premises management console.

## Default privileged on-premises users

By default, each sensor and on-premises management console is [installed](how-to-install-software.md#install-ot-monitoring-software) with the *cyberx* and *support* privileged users. Sensors are also installed with the *cyberx_host* privileged user.

Privileged users have access to advanced tools for troubleshooting and setup. When first deploying Defender for IoT, sign in with these user credentials, create a first user with an **Administrator** role, and then create more users with **Security Analyst** or **Read-only** roles.

The following table describes each default privileged user in detail:

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**cyberx**     |   The sensor or on-premises management console's `sensor_app` container      | Serves as a root user within the main application container. <br><br>Used for troubleshooting with advanced root access.<br><br>Can access the container filesystem, commands, and dedicated CLI commands for controlling OT monitoring  <br><br>Can recover or change passwords for users with any roles.       |
|**support**     |   The sensor or on-premises management console's `sensor_app` container       | Serves as a locked-down, user shell for dedicated CLI tools<br><br>Has no filesystem access<br><br>Can access only  dedicated CLI commands for controlling OT monitoring <br><br>Can recover or change passwords for the **support** user, and any user with the **Administrator**, **Security Analyst**, and **Read-only** roles.  |
|**cyberx_host**     | The on-premises management console's host OS        | Serves as a root user in the on-premises management console's host OS<br><br>Used for support scenarios with containers and filesystem access        |

## On-premises user roles

OT network sensors and on-premises management consoles are installed with a set of [default, privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

When first deploying an OT monitoring system, sign in to your sensors and on-premises management console with one of the default users. Create your first **Administrator** user, and then use that user to create other users and assign them to roles.

The following roles are available on OT network sensors and on-premises management consoles:

- **Admin**: Admin users have access to all tools, including system configurations, creating and managing users, and more. These users have access to options displayed under **Discover**, **Analyze**, and **Manage** sections of the console main screen.

- **Read only**: Read-only users perform tasks such as viewing alerts and devices on the device map. These users have access to options displayed under **Discover**.

- **Security analyst**: Security Analysts have Read-only user permissions. They can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Discover** and **Analyze**.

Permissions applied to each role differ between the sensor and the on-premises management console. The following tables list the permissions available for each role, in each location.

## Role-based permissions for OT network sensors

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| **View the dashboard** | ✔ | ✔ |✔ |
| **Control map zoom views** | - | - | ✔ |
| **View alerts** | ✔ | ✔ | ✔ |
| **Manage alerts**: acknowledge, learn, and pin |-  | ✔ | ✔ |
| **View events in a timeline** | - | ✔ | ✔ |
| **Authorize devices**, known scanning devices, programming devices |  | ✔ | ✔ |
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
> <a name="pw-sensor"></a>**Administrator** users can only change passwords for other users with the **Security Analyst** and **Read-only** roles. To change the password of an **Administrator** user, sign in to your sensor as [a privileged user](#default-privileged-on-premises-users).

## Role-based permissions for the on-premises management console

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| **View and filter the enterprise map** | ✔ | ✔ | ✔ |
| **Build a site** | - | - | ✔ |
| **Manage a site** (add and edit zones) |-  |-  | ✔ |
| **View and filter device inventory** | ✔ | ✔ | ✔ |
| **View and manage alerts**: acknowledge, learn, and pin | ✔ | ✔ | ✔ |
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
> <a name="pw-cm"></a>**Administrator** users can only change passwords for other users with the **Security Analyst** and **Read-only** roles. To change the password of an **Administrator** user, sign in to your sensor as [a privileged user](#default-privileged-on-premises-users).

## Next steps

For more information, see:

- [Create and manage users on an OT network sensor](manage-users-sensor.md)
- [Create and manage users on an on-premises management console](manage-users-on-premises-management-console.md)
- [Manage users on the Azure portal](manage-users-portal.md)
- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
