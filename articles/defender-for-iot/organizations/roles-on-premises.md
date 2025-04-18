---
title: On-premises users and roles for Defender for IoT - Microsoft Defender for IoT
description: Learn about the on-premises user roles available for OT monitoring with Microsoft Defender for IoT network sensors.
ms.date: 12/19/2023
ms.topic: concept-article
---

# On-premises users and roles for OT monitoring with Defender for IoT

When working with OT networks, Defender for IoT services and data is available from on-premises OT network sensors, in addition to Azure.

This article provides:

- A description of the default, privileged users that come with Defender for IoT software installation
- A reference of the actions available for each on-premises user role, on both OT network sensors

[!INCLUDE [on-premises-management-deprecation](includes/on-premises-management-deprecation.md)]

## Default privileged on-premises users

By default, each sensor is installed with a default, privileged *admin* user, with access to advanced tools for troubleshooting and setup, such as the CLI.

When first setting up your sensor, sign in with the *admin* user, create an initial user with an **Admin** role, and then use that admin user to create other users with other roles.

For more information, see:

- [Install OT monitoring software on OT sensors](ot-deploy/install-software-ot-sensor.md)
- [Configure and activate your OT sensor](ot-deploy/activate-deploy-sensor.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)

### Legacy users

|Legacy scenario  |Description  |
|---------|---------|
|**Sensor versions earlier than 23.2.0**     |   In sensor versions earlier than [23.2.0](whats-new.md#default-privileged-user-is-now-admin-instead-of-support), the default *admin* user is named *support*. The *support* user is available and supported only on versions earlier than 23.2.0.<br><br>Documentation refers to the *admin* user to match the latest version of the software.      |
|**Sensor software versions earlier than 23.1.x**     |   In sensor software versions earlier than [23.1.x](whats-new.md#july-2023), the *cyberx* and *cyberx_host* privileged users are also in use. <br><br>In newly installed versions 23.1.x and higher, the *cyberx* and *cyberx_host* users are available, but not enabled by default. <br><br>To enable these extra privileged users, such as to use the [Defender for IoT CLI](references-work-with-defender-for-iot-cli-commands.md), change their passwords. For more information, see [Recover privileged access to a sensor](manage-users-sensor.md#recover-privileged-access-to-a-sensor).      |

### Access per privileged user

The following table describes the access available to each privileged user, including legacy users.

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**admin** | The OT sensor's `configuration shell` |	A powerful administrative account with access to: <br>- All CLI commands <br>- The ability to manage log files <br>- Start and stop services <br><br>This user has no filesystem access. In legacy software versions, this user is named *support*. |
|**cyberx**     |    The OT sensor's `terminal (root)`       | Serves as a root user and has unlimited privileges on the appliance. <br><br>Used only for the following tasks:<br>- Changing default passwords<br>- Troubleshooting<br>- Filesystem access      |
|**cyberx_host**     | The OT sensor's host OS `terminal (root)`         | Serves as a root user and has unlimited privileges on the appliance host OS.<br><br>Used for: <br>- Network configuration<br>- Application container control <br>- Filesystem access |

## On-premises user roles

The following roles are available on OT network sensors:

|Role  |Description  |
|---------|---------|
|**Admin**     |  Admin users have access to all tools, including system configurations, creating and managing users, and more.   |
|**Security Analyst**     |  Security Analysts don't have admin-level permissions for configurations, but can perform actions on devices, acknowledge alerts, and use investigation tools. <br><br>Security Analysts can access options on the sensor displayed in the **Discover** and **Analyze** menus on the sensor.  |
|**Read-Only**     | Read-only users perform tasks such as viewing alerts and devices on the device map. <br><br>Read-Only users can access options displayed in the **Discover** and **Analyze** menus on the sensor, in read-only mode        |

When first deploying an OT monitoring system, sign in to your sensors with one of the [default, privileged users](#default-privileged-on-premises-users) described above. Create your first **Admin** user, and then use that user to create other users and assign them to roles.

See the tables below for the permissions available for each role on the [sensor](#role-based-permissions-for-ot-network-sensors).

## Role-based permissions for OT network sensors

| Permission | Read Only | Security Analyst | Admin |
|--|--|--|--|
| **View the dashboard** | ✔ | ✔ |✔ |
| **Control map zoom views** | - | - | ✔ |
| **View alerts** | ✔ | ✔ | ✔ |
| **Manage alerts**: acknowledge, learn, and mute |-  | ✔ | ✔ |
| **View events in a timeline** | ✔ | ✔ | ✔ |
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

## Next steps

For more information, see:

- [Microsoft Defender for IoT user management](manage-users-overview.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)
- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
