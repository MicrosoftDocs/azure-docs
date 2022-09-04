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

## On-premises users for Defender for IoT

The following users are installed by default together with OT network sensors and on-premises management consoles:

The following additional roles are also available to apply to other users:

- **Read only**: Read-only users perform tasks such as viewing alerts and devices on the device map. These users have access to options displayed under **Discover**.

- **Security analyst**: Security Analysts have Read-only user permissions. They can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Discover** and **Analyze**.

- **Administrator**: Administrators have access to all tools, including system configurations, creating and managing users, and more. These users have access to options displayed under **Discover**, **Analyze**, and **Manage** sections of the console main screen.

Permissions applied to each role differ between the sensor and the on-premises management console. The following sections list the permissions available for each role, in each location.

### Role-based permissions to OT monitoring sensors

This section describes permissions available to sensor Administrators, Security Analysts, and Read-only users.

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| View the dashboard | ✓ | ✓ | ✓ |
| Control map zoom views |  |  | ✓ |
| View alerts | ✓ | ✓ | ✓ |
| Manage alerts: acknowledge, learn, and pin |  | ✓ | ✓ |
| View events in a timeline |  | ✓ | ✓ |
| Authorize devices, known scanning devices, programming devices |  | ✓ | ✓ |
| Merge and delete devices |  |  | ✓ |
| View investigation data | ✓ | ✓ | ✓ |
| Manage system settings |  |  | ✓ |
| Manage users |  |  | ✓ |
| DNS servers for reverse lookup |  |  | ✓ |
| Send alert data to partners |  | ✓ | ✓ |
| Create alert comments |  | ✓ | ✓ |
| View programming change history | ✓ | ✓ | ✓ |
| Create customized alert rules |  | ✓ | ✓ |
| Manage multiple notifications simultaneously |  | ✓ | ✓ |
| Manage certificates |  |  | ✓ |
| Session timeout when users are not active | 30 minutes | 30 minutes | 30 minutes |

### Role-based permissions for the on-premises management console

This section describes permissions available to Administrators, Security Analysts, and Read-only users for the on-premises management console.  

| Permission | Read-only | Security Analyst | Administrator |
|--|--|--|--|
| View and filter the enterprise map | ✓ | ✓ | ✓ |
| Build a site |  |  | ✓ |
| Manage a site (add and edit zones) |  |  | ✓ |
| View and filter device inventory | ✓ | ✓ | ✓ |
| View and manage alerts: acknowledge, learn, and pin | ✓ | ✓ | ✓ |
| Generate reports |  | ✓ | ✓ |
| View risk assessment reports |  | ✓ | ✓ |
| Set alert exclusions |  | ✓ | ✓ |
| View or define access groups |  |  | ✓ |
| Manage system settings |  |  | ✓ |
| Manage users |  |  | ✓ |
| Send alert data to partners |  |  | ✓ |
| Manage certificates |  |  | ✓ |
| Session timeout when users aren't active | 30 minutes | 30 minutes  | 30 minutes  |


**Administrator users**

The Administrator can change the password for the Security Analyst and Read-only roles. The Administrator role user can't change their own password and must contact a higher-level role. 

**Security Analyst and Read-only users**

The Security Analyst and Read-only roles can't reset any passwords. The Security Analyst and Read-only roles need to contact a user with a higher role level to have their passwords reset.

**CyberX and Support users**

CyberX role can change the password for all user roles. The Support role can change the password for a Support, Administrator, Security Analyst, and Read-only user roles.  

You can recover the password for the on-premises management console or the sensor with the Password recovery feature. Only the CyberX and Support users have access to the Password recovery feature.
