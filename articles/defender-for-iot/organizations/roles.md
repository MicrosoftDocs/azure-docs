---
title: Defender for IoT users, roles, and permissions
description: Learn about the users, roles, and permissions available for Defender for IoT on the Azure portal and on-premises sensors and management consoles.
ms.date: 09/04/2022
ms.topic: reference
---

# Defender for IoT users, roles, and permissions

Microsoft Defender for IoT provides access to services and data in both the Azure portal and on-premises sensor and management consoles.

This articles provides a reference of all roles relevant to Defender for IoT, their permissions, and management options.

## Azure user roles for Defender for IoT

The built-in **Security reader**, **Security administrator**, **Contributor**, and **Owner** roles are relevant for use in Defender for IoT. An extra **Sensor operator** role is also added for Defender for IoT users.

The following tables list functionality that is available to each user role by default.

**Permissions for management functionalities**:

|Sensor operator  |Security reader  |Security admin  |Contributor  |Owner  |
|---------|---------|---------|---------|---------|
|  **Download sensor and on-premises management console software and threat intelligence packages**<br>Resource scope: *Subscription*   |   Yes      |  Yes       |   Yes      | Yes | Yes |
|  **Download activation files**<br>Resource scope: *Subscription*   |   Yes      |    No     |   Yes      | Yes | Yes |
|  **Modify values on the Pricing page, update committed devices**<br>Resource scope: *Subscription*   |   Read-only      |  No       |   Read-write      | Read-write | Read-write |
|  **Recover on-premises passwords**<br>Resource scope: *Subscription*   |   Yes      |   No      |   Yes     | Yes | Yes |
|  **Push threat intelligence updates**<br>Resource scope: *Subscription*   |    No     |    No     |   Yes     | Yes | Yes |
|  **Modify values on the Sites and sensors page**<br>Resource scope: *Subscription*   |   Read-write      |     No    |   Read-write     | Read-write | Read-write |

**Permissions for security monitoring functionalities**:

|Sensor operator  |Security reader  |Security admin  |Contributor  |Owner  |
|---------|---------|---------|---------|---------|
| **Alerts page** <br><br>Resource scope: *Subscription* or *site* |  | Read-only | Read-write | Read-write | Read-write |
| **Device inventory** <br><br>Resource scope: *Subscription* or *site* |  | Read-only | Read-write | Read-write | Read-write |

For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## On-premises users for Defender for IoT

By default, each sensor and on-premises management console is installed with the *cyberx* and *support* privileged users. Sensors are also installed with the *cyberx_host* privileged user. For more information, see [Install OT monitoring software](how-to-install-software.md#install-ot-monitoring-software).

Privileged users have access to advanced tools for troubleshooting and setup. When first deploying Defender for IoT, sign in with these user credentials, create an admin user, and then create extra users with **Security Analyst** or **Read-only** roles.

### Default privileged on-premises users

The following table describes each default privileged user in detail:

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**cyberx**     |   The sensor or on-premises management console's `sensor_app` container      | Serves as a root user within the main application container. <br><br>Used for troubleshooting with advanced root access.<br><br>Can access the container filesystem, commands, and dedicated CLI commands for controlling OT monitoring  <br><br>Can recover or change passwords for users with any roles.       |
|**support**     |   The sensor or on-premises management console's `sensor_app` container       | Serves as a locked-down, user shell for dedicated CLI tools<br><br>Has no filesystem access<br><br>Can access only  dedicated CLI commands for controlling OT monitoring <br><br>Can recover or change passwords for the **support** user, and any user with the **Administrator**, **Security Analyst**, and **Read-only** roles. For more information, see [On-premises user roles](#on-premises-user-roles).  |
|**cyberx_host**     | The on-premises management console's host OS        | Serves as a root user in the on-premises management console's host OS<br><br>Used for support scenarios with containers and filesystem access        |

### On-premises user roles

The following roles are available on OT network sensors and on-premises management consoles.

- **Read only**: Read-only users perform tasks such as viewing alerts and devices on the device map. These users have access to options displayed under **Discover**.

- **Security analyst**: Security Analysts have Read-only user permissions. They can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Discover** and **Analyze**.

- **Administrator**: Administrators have access to all tools, including system configurations, creating and managing users, and more. These users have access to options displayed under **Discover**, **Analyze**, and **Manage** sections of the console main screen.

Permissions applied to each role differ between the sensor and the on-premises management console. The following tables list the permissions available for each role, in each location.

**Role-based permissions for OT network sensors**:

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| View the dashboard | Yes | Yes |Yes |
| Control map zoom views | No | No | Yes |
| View alerts | Yes | Yes | Yes |
| Manage alerts: acknowledge, learn, and pin |No  | Yes | Yes |
| View events in a timeline | No | Yes | Yes |
| Authorize devices, known scanning devices, programming devices |  | Yes | Yes |
| Merge and delete devices |No  |No  | Yes |
| View investigation data | Yes | Yes | Yes |
| Manage system settings | No |  No| Yes |
| Manage users |No  | No | Yes |
| Change passwords |No | No| Yes, for users with the **Security Analyst** and **Read-only** roles only. |
| DNS servers for reverse lookup |No  |  No| Yes |
| Send alert data to partners | No | Yes | Yes |
| Create alert comments |No  | Yes | Yes |
| View programming change history | Yes | Yes | Yes |
| Create customized alert rules | No | Yes | Yes |
| Manage multiple notifications simultaneously | No | Yes | Yes |
| Manage certificates | No | No | Yes |
| Session timeout when users are not active | 30 minutes | 30 minutes | 30 minutes |

**Role-based permissions for the on-premises management console**

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| View and filter the enterprise map | Yes | Yes | Yes |
| Build a site | No | No | Yes |
| Manage a site (add and edit zones) |No  |No  | Yes |
| View and filter device inventory | Yes | Yes | Yes |
| View and manage alerts: acknowledge, learn, and pin | Yes | Yes | Yes |
| Generate reports |No  | Yes | Yes |
| View risk assessment reports | No | Yes | Yes |
| Set alert exclusions | No | Yes | Yes |
| View or define access groups | No | No | Yes |
| Manage system settings | No | No | Yes |
| Manage users | No |No  | Yes |
| Change passwords |No | No| Yes, for users with the **Security Analyst** and **Read-only** roles only. |
| Send alert data to partners | No | No | Yes |
| Manage certificates | No | No | Yes |
| Session timeout when users aren't active | 30 minutes | 30 minutes  | 30 minutes  |

## Next steps

For more information, see [Manage users for OT network security](manage-users-portal.md).
