---
title: Create and manage users
description: Create and manage users of sensors and the on-premises management console. Users can be assigned the role of administrator, security analyst, or read-only user.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/21/2020
ms.topic: article
ms.service: azure
---

# About Defender for IoT console users

This article describes how to create and manage users of sensors and the on-premises management console. User roles include administrator, security analyst, or read-only user. Each role is associated with a range of permissions to tools for the sensor or on-premises management console. Roles are designed to facilitate granular, secure access to Azure Defender for IoT.

Features are also available to track user activity and enable Active Directory sign-in.

By default, each sensor and on-premises management console is installed with a *cyberx and support* user. These users have access to advanced tools for troubleshooting and setup. Administrator users should sign in with these user credentials, create an admin user, and then create additional users for security analysts and read-only users.

## Role-based permissions
The following user roles are available:

- **Read only**: Read-only users perform tasks such as viewing alerts and devices on the device map. These users have access to options displayed under **Navigation**.

- **Security analyst**: Security analysts have read-only user permissions. They can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Navigation** and **Analysis**.

- **Administrator**: Administrators have access to all tools, including defining system configurations, creating and managing users, and more. These users have access to options displayed under **Navigation**, **Analysis**, and **Administration**.

### Role-based permissions to on-premises management console tools

This section describes permissions available to administrators, security analysts, and read-only users for the on-premises management console.  

| Permission | Read only | Security analyst | Administrator |
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
| Session timeout when users are not active | 30 minutes | 30 minutes  | 30 minutes  |

#### Assign users to access groups

Administrators can enhance user access control in Defender for IoT by assigning users to specific *access groups*. Access groups are assigned to zones, sites, regions, and business units where a sensor is located. By assigning users to access groups, administrators gain specific control over where users manage and analyze device detections. 

Working this way accommodates large organizations where user permissions can be complex or determined by a global organizational security policy. For more information, see [Define global access control](how-to-define-global-user-access-control.md).

### Role-based permissions to sensor tools

This section describes permissions available to sensor administrators, security analysts, and read-only users.  

| Permission | Read only | Security analyst | Administrator |
|--|--|--|--|
| View the dashboard | ✓ | ✓ | ✓ |
| Control map zoom views |  |  | ✓ |
| View alerts | ✓ | ✓ | ✓ |
| Manage alerts: acknowledge, learn, and pin |  | ✓ | ✓ |
| View events in a timeline |  | ✓ | ✓ |
| Authorize devices, known scanning devices, programming devices |  | ✓ | ✓ |
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

## Define users

This section describes how to define users. Cyberx, support, and administrator users can add, remove, and update other user definitions.

To define a user:

1. From the left pane for the sensor or the on-premises management console, select **Users**.
2. In the **Users** window, select **Create User**.
3. On the **Create User** pane, define the following parameters:

   - **Username**: Enter a username.
   - **Email**: Enter the user's email address.
   - **First Name**: Enter the user's first name.
   - **Last Name**: Enter the user's last name.
   - **Role**: Define the user's role. See [Role-based permissions](#role-based-permissions).
   - **Access Group**: If you're creating a user for the on-premises management console, define the user's access group. See [Define global access control](how-to-define-global-user-access-control.md).
   - **Password**: Select the user type as follows:
     - **Local User**: Define a password for the user of a sensor or an on-premises management console. The password must include at least six characters and must include letters and numbers.
     - **Active Directory User**: You can allow users to sign in to the sensor or management console by using Active Directory credentials. Defined Active Directory groups can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group to the read-only user type.

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/manage-user-views.png" alt-text="Manage your users.":::

## User session timeout

If users are not active at the keyboard or mouse for a specific time, they're signed out of their session and must sign in again.

When users have not worked with their console mouse or keyboard for a period of 30 minutes, a session sign-out is forced.

This feature is enabled by default and on upgrade but can be disabled. In addition, session counting times can be updated. Session times are defined in seconds. Definitions are applied per sensor and on-premises management console.

A session timeout message appears at the console when the inactivity timeout has passed.

### Control inactivity sign-out

Administrator users can enable and disable inactivity sign-out and adjust the inactivity thresholds.

To access the command:

1. Sign in to the CLI for the sensor or on-premises management console by using Defender for IoT administrative credentials.

2. Enter `sudo nano /var/cyberx/properties/authentication`.

```azurecli-interactive
    infinity_session_expiration = true
    session_expiration_default_seconds = 0
    # half an hour in seconds (comment)
    session_expiration_admin_seconds = 1800
    # a day in seconds
    session_expiration_security_analyst_seconds = 1800
    # a week in seconds
    session_expiration_read_only_users_seconds = 1800
```

To disable the feature, change `infinity_session_expiration = true` to `infinity_session_expiration = false`.

To update sign-out counting periods, adjust the `= <number>` value to the required time.


## Track user activity 

You can track user activity in the event timeline on each sensor. The timeline displays the event or affected device, and the time and date that the user carried out the activity.

To view user activity:

1. Sign in to the sensor.
1. In the event timeline, enable the **User Operations** option. 

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/User-login-attempts.png" alt-text="View a user's activity.":::

## Integrate with Active Directory servers 

Configure the sensor or on-premises management console to work with Active Directory. This allows Active Directory users to access the Defender for IoT consoles by using their Active Directory credentials.

Two types of LDAP-based authentication are supported:

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

### Active Directory and Defender for IoT permissions

You can associate Active Directory groups defined here with specific permission levels. For example, configure a specific Active Directory group and assign RO permissions to all users in the group. See [Create and manage users](how-to-create-and-manage-users.md) for details.

To configure Active Directory:

1. From the left pane, select **System Settings**.

    :::image type="content" source="media/how-to-setup-active-directory/ad-system-settings-v2.png" alt-text="View your Active Directory system settings.":::

2. On the **System Settings** pane, select **Active Directory**.

    :::image type="content" source="media/how-to-setup-active-directory/ad-configurations-v2.png" alt-text="Edit your Active Directory configurations.":::

3. In the **Edit Active Directory Configuration** dialog box, select **Active Directory Integration Enabled** > **Save**. The **Edit Active Directory Configuration** dialog box expands, and you can now enter the parameters to configure Active Directory.

    :::image type="content" source="media/how-to-setup-active-directory/ad-integration-enabled-v2.png" alt-text="Enter the parameters to configure Active Directory.":::

    > [!NOTE]
    > - You must define the LDAP parameters here exactly as they appear in Active Directory.
    > - For all the Active Directory parameters, use lowercase only. Use lowercase even when the configurations in Active Directory use uppercase.
    > - You can't configure both LDAP and LDAPS for the same domain. You can, however, use both for different domains at the same time.

4. Set the Active Directory server parameters, as follows:

   | Server parameter | Description |
   |--|--|
   | Domain controller FQDN | Set the fully qualified domain name (FQDN) exactly as it appears on your LDAP server. For example, enter `host1.subdomain.domain.com`. |
   | Domain controller port | Define the port on which your LDAP is configured. |
   | Primary domain | Set the domain name (for example, `subdomain.domain.com`) and the connection type according to your LDAP configuration. |
   | Active Directory groups | Enter the group names that are defined in your Active Directory configuration on the LDAP server. |
   | Trusted domains | To add a trusted domain, add the domain name and the connection type of a trusted domain. <br />You can configure trusted domains only for users who were defined under users. |

5. Select **Save**.

6. To add a trusted server, select **Add Server** and configure another server.

## See also

[Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)
[Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)
[Track sensor activity](how-to-track-sensor-activity.md)
