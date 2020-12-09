---
title: Create and manage users
description: Create and manage sensor and on-premises management console users. Users can be assigned the role of an Administrator, Security Analyst or Read Only user.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/08/2020
ms.topic: article
ms.service: azure
---

# About Defender for IoT console users

This article describes how to create and manage sensor and on-premises management console users. Users can be assigned the role of an Administrator, Security Analyst or Read Only user. Each role is associated with a range of permissions to sensor and on-premises management console tools. Roles are designed to facilitate granular, secure access to Defender for IoT.

Features also available to track user activity and enable Active Directory sign in.

By default, each sensor and on-premises management console are installed with a *cyberx and support* user. These users have access to advanced tools used for troubleshooting and setup. These users can log in and create additional users roles.

## Role-based permissions
 The following user role are available:

- **Read only** – Read Only users perform tasks such as viewing alerts and devices on the Device map. These users have access to options displayed under **Navigation**.

- **Security analyst** – Security Analysts have Read Only user permissions and can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Navigation** and **Analysis** windows.

- **Administrator** – Administrators have access to all tools, including defining system configurations, creating and managing users, and more. These users have access to options displayed under **Navigation, Analysis**, and **Administration**.

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

Administrators can enhance Defender for IoT user access control by assigning users to specific *access groups*. Access groups are assigned to zones, sites, regions, and business units at which a sensor is located. By assigning users to access groups, administrators gain specific control over where users manage and analyze device detections.  Working this way accommodates large organizations where user permissions can be complex or determined by a global organizational security policy. For more information, see [Define global access control](how-to-define-global-user-access-control.md).

### Role-based permissions to sensor tools

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
  - **Active Directory User:** You can allow users to log in to the sensor or management console using Active Directory credentials. Active Directory groups defined can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group to the Read Only user type.

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

2. Type: udo nano /var/cyberx/properties/authentication.

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

## Integrate with Active Directory servers 

Configure the sensor or on-premises management console to work with Active Directory. This allows Active Directory users to access the Defender for IoT consoles using their Active Directory credentials.

Two types of LDAP-based authentication are supported:

  - **Full authentication:** User details are retrieved from the LDAP server. For example, the first name, last name, email, and user permissions.

  - **Trusted user:** only the user password is retrieved. Other user details retrieved are based on users defined in the sensor.

### Active Directory and Defender for IoT permissions

Active Directory groups defined here can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group RO permissions. See [Create and manage users](how-to-create-and-manage-users.md) for details.

**To configure Active Directory:**

1. From the left navigation pane, select **System Settings**.

    :::image type="content" source="media/how-to-setup-active-directory/ad-system-settings.png" alt-text="View your Active Directory system settings.":::

2. In the System Settings pane, select **Active Directory**.

    :::image type="content" source="media/how-to-setup-active-directory/ad-configurations.png" alt-text="Edit your Active Directory configurations.":::

3. In the Edit Active Directory Configuration dialog box, select **Active Directory Integration Enabled** and select **Save**. The Edit Active Directory Configuration dialog box expands, and you can now enter the parameters to configure Active Directory.

    :::image type="content" source="media/how-to-setup-active-directory/ad-integration-enabled.png" alt-text="Enter the parameters to configure Active Directory.":::

    > [!NOTE]
    > - You must define the LDAP parameters here exactly as they appear in Active Directory.
    > -	For all the Active Directory parameters use lower case only, including when the configurations in your Active Directory use upper case.
    > -	You cannot configure both LDAP and LDAPS for the same domain. You can, however, use both for different domains at the same time.

4. Set the Active Directory server parameters, as follows:

| Server parameter | Description |
|--|--|
| Domain controller FQDN | Set the Fully Qualified Domain Name (FQDN) exactly as it appears on your LDAP server, for example, `host1.subdomain.domain.com` |
| Domain controller port | Define the port on which your LDAP is configured. |
| Primary domain | Set the domain name, for example, `subdomain.domain.com`, and the connection type according to your LDAP configuration. |
| Active directory groups | Type the group names that are defined in your Active Directory configuration on the LDAP server. |
| Trusted domains | To add a trusted domain, add the domain name and the connection type of a trusted domain. <br />You can configure trusted domains only for users that were defined under users. |

5. Select **Save**.

6. To add a trusted server, select the **Add Server** and configure another server.
## See also

[Track sensor activity](how-to-track-sensor-activity.md)