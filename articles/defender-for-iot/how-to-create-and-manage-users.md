---
title: Create and manage users
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/03/2020
ms.topic: article
ms.service: azure
---

# About Defender for IoT console users

This article describes how to create and manage sensor and on-premises management console users. Users can be assigned the role of either an Administrator, Security Analyst or Read Only user. Each role is associated with a range of permissions to sensor and on-premises management console tools. Roles are designed to facilitate granular, secure access to Defender for IoT.

Features also available to track user activity and enable Active Directory sign in.

By default, each sensor and on-premises management console are installed with a *cyberx and support* user. These users have access to advanced tools used for troubleshooting and setup. These users can log in and create additional users roles.

## Role-based permissions
 The following user role are available:

- **Read only** – Read Only users perform tasks such as viewing alerts and devices on the Device map. These users have access to options displayed on the **Navigation** pages.

- **Security analyst** – The security analyst has the permissions of the RO user and can also perform actions on devices, investigate and acknowledge alerts, use the investigation features. Security analysts can see the **Navigation** and **Analysis** sections.

- **Administrator** – The administrator has all the permissions of the RO and the security analyst and can also manage the system configuration, create, and delete users and create notifications. Administrators can see the **Navigation, Analysis**, and **Administration** sections.
### Role-based permissions to on-premises management console tools

This section describes permissions available to on-premises management console Administrators, Security analysts and Read only users.  

| Permission | Read only | Security analyst | Administrator |
|--|--|--|--|
| View and filter the enterprise map | ✓ | ✓ | ✓ |
| Build a site |  |  | ✓ |
| Manage Site (Add and edit zones) |  |  | ✓ |
| View and filter Device Inventory | ✓ | ✓ | ✓ |
| View and manage alerts – acknowledge, learn, and pin (see alerts for details.) | ✓ | ✓ | ✓ |
| Generate reports |  | ✓ | ✓ |
| View risk assessment Reports |  | ✓ | ✓ |
| Set alert exclusions |  | ✓ | ✓ |
| View/define access groups |  |  | ✓ |
| Manage system settings (See on-premises management console and sensor system settings for details.) |  |  | ✓ |
| Manage Users (See Create on-premises management console Users for details.) |  |  | ✓ |
| Send alert data to partners (See Define Forwarding Rules for details.) |  |  | ✓ |
| Session timeout when users are not active | 30 minutes | 30 minutes  | 30 minutes  |

#### Assign users to access groups

When creating on-premises management console users, Administrators can further enhance user access control by assigning users to specific *access groups*. These groups represent zones, sites, regions, and business units to which a sensor is assigned. For example, a global glass enterprise with several factories on different continents. By assigning users to access groups, administrators gain specific control over where specific roles manage and analyze devices in Defender for IoT.  Working this way accommodates large organizations where user permissions can be complex and may be determined by a global organizational structure, in addition to the standard site or zone structure. See [Define Global Access Control](how-to-define-global-user-access-control.md) for more information.

### Role-based permission to sensor tools 

This section describes permissions available to sensor Administrators, Security analysts and Read only users.  

| Permission | Read only | Security analyst | Administrator |
|--|--|--|--|
| View the dashboard | ✓ | ✓ | ✓ |
| Control map zoom views |  |  | ✓ |
| View alerts | ✓ | ✓ | ✓ |
| Manage alerts – acknowledge, learn, and pin |  | ✓ | ✓ |
| View events in a timeline |  | ✓ | ✓ |
| Authorize devices, known scanning devices, programming devices |  | ✓ | ✓ |
| View investigation data | ✓ | ✓ | ✓ |
| Manage system settings |  |  | ✓ |
| Manage users |  |  | ✓ |
| DNS servers for reverse lookup |  |  | ✓ |
| Send alert data to partners |  | ✓ | ✓ |
| Create alert comments |  | ✓ | ✓ |
| View programming change history | ✓ | ✓ | ✓ |
| Create customize alerts rules |  | ✓ | ✓ |
| Manage multiple notifications simultaneously |  | ✓ | ✓ |
| Session timeout when users are not active | 30 minutes | 30 minutes | 30 minutes |

## Define users

This section describes how to define users. Cyberx, support and administrators users can add, remove and update other user definitions.

To define a user:

1. From the sensor or on-premises management console left pane, select **Users**.
2. In the Users window, select Create User.
3. In the **Create User** pane, define the following parameters:

- **Username:** Enter a username.
- **Email:** Enter the user's email address.
- **First Name:** Enter the user's first name.
- **Last Name:** Enter the user's last name.
- **Role:** Define the user's role. See [Role-based permissions](#role-based-permissions).
- **Access Group:** If you are creating a user for the on-premises management console, define the user's access group. See [Define Global Access Control](how-to-define-global-user-access-control.md).
- **Password:** Select the user type as follows:
  - **Local User:** Define a password for a sensor or on-premises management console user. The password must include at least six characters and must include letters and numbers.
  - **Active Directory User:** You can allow users to log in to the sensor or management console using Active Directory credentials. Active Directory groups defined can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group to the Read Only user type. See [Integrate with active directory servers](how-to-set-up-active-directory.md).

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/manage-user-views.png" alt-text="Manage your users.":::

## User session timeout

If users are not active at the keyboard or mouse for a specific time, they are signed out of their session and must sign in again.

When users have not worked with their console mouse or keyboard for a period of 30 minutes, a session sign out is forced.

This feature is enabled by default and on upgrade but can be disabled. In addition, session counting times can be updated. Session times are defined in seconds. Definitions are applied per sensor and on-premises management console.

A session timeout message appears at the console when the inactivity timeout has passed.

### Control inactivity sign out

Administrator users can enable and disable this feature and adjust the inactivity thresholds.

To access the command:

1. Sign in to the sensor or on-premises management console CLI with Defender for IoT administrative credentials.

2. Type:

```azurecli-interactive
sudo nano /var/cyberx/properties/authentication.

    infinity_session_expiration = true
    session_expiration_default_seconds = 0
    # half an hour in seconds (comment)
    session_expiration_admin_seconds = 1800
    # a day in seconds
    session_expiration_security_analyst_seconds = 1800
    # a week in seconds
    session_expiration_read_only_users_seconds = 1800
```

To disable the feature:
Change `infinity_session_expiration = true` to `infinity_session_expiration = false`

To update sign out counting periods:

- Adjust the `= <number>` to the time required.


## Track user activity

User activity can be tracked in the Event Timeline on each sensor. The timeline displays the event or impacted device, and the time and date the user carried out the activity.

To view user activity:

1. Log in to the sensor.
1. In the Event Timeline, enable the **User Operations** option. 

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/User-login-attempts.png" alt-text="View a user's activity.":::

## See also

[Track sensor activity](how-to-track-sensor-activity.md)