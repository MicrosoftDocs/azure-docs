---
title: Defender for IoT users, roles, and permissions for OT networks
description: Learn about the Azure user roles available for OT monitoring with Microsoft Defender for IoT on the Azure portal, and locally for on-premises sensors and management consoles.
ms.date: 09/11/2022
ms.topic: conceptual
---

# Defender for IoT users, roles, and permissions for OT network monitoring

Microsoft Defender for IoT uses Azure role-based access control (RBAC) to provide access to OT network monitoring services and data on the Azure portal. For OT networks, Defender for IoT services and data is also available from on-premises sensor and management consoles.

This article provides a reference of the actions available for each role and on-premises user.

## Azure user roles for OT networks

The built-in **Security reader**, **Security administrator**, **Contributor**, and **Owner** roles are relevant for use in Defender for IoT.

The following tables list the functionality for OT network monitoring that's available to each user role by default. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

### Permissions for management functionalities

Define management functionality roles across an entire Azure subscription.

| Action |[Security Reader](../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
|  **Download sensor and on-premises management console software and threat intelligence packages** | ✔      |  ✔       |   ✔      | ✔ |
|  **Download activation files**|   -     |   ✔      | ✔ | ✔ |
|  **Modify values on the Pricing page, update committed devices**  | -       |   ✔     | ✔ | ✔ |
|  **Recover on-premises passwords**  | -      |   ✔     | ✔ | ✔ |
|  **Push threat intelligence updates**  | -     |   ✔     | ✔ | ✔ |
|  **Modify values on the Sites and sensors page**   |   -    |   ✔    | ✔ | ✔|

### Permissions for security monitoring functionalities

Define security monitoring roles across an entire Azure subscription or a specific OT site.

| Action |[Security Reader](../role-based-access-control/built-in-roles.md#security-reader)  |[Security Admin](../role-based-access-control/built-in-roles.md#security-admin)  |[Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|---------|---------|---------|---------|---------|
| **Alerts page** | Read-only | Read-write |Read-write | Read-write |
| **Device inventory**  | Read-only | Read-write |Read-write | Read-write |

For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## On-premises users for OT networks

By default, each sensor and on-premises management console is installed with the *cyberx* and *support* privileged users. Sensors are also installed with the *cyberx_host* privileged user. For more information, see [Install OT monitoring software](how-to-install-software.md#install-ot-monitoring-software).

Privileged users have access to advanced tools for troubleshooting and setup. When first deploying Defender for IoT, sign in with these user credentials, create a first user with an **Administrator** role, and then create more users with **Security Analyst** or **Read-only** roles.

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

**Role-based permissions for the on-premises management console**

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

For more information, see [Manage users for OT network security](manage-users-portal.md).
