---
title: Create and manage users
description: Create and manage users of sensors and the on-premises management console. Users can be assigned the role of Administrator, Security Analyst, or Read-only user.
ms.date: 01/26/2022
ms.topic: article
---

# About Defender for IoT console users

This article describes how to create and manage users of sensors and the on-premises management console. User roles include Administrator, Security Analyst, or Read-only users. Each role is associated with a range of permissions to tools for the sensor or on-premises management console. Roles are designed to facilitate granular, secure access to Microsoft Defender for IoT.

Features are also available to track user activity and enable Active Directory sign in.

By default, each sensor and on-premises management console is installed with a *cyberx, support* and *cyberx_host* user. These users have access to advanced tools for troubleshooting and setup. Administrator users should sign in with these user credentials, create an admin user, and then create extra users for security analysts and read-only users.

## Role-based permissions
The following user roles are available:

- **Read only**: Read-only users perform tasks such as viewing alerts and devices on the device map. These users have access to options displayed under **Navigation**.

- **Security analyst**: Security Analysts have Read-only user permissions. They can also perform actions on devices, acknowledge alerts, and use investigation tools. These users have access to options displayed under **Navigation** and **Analysis**.

- **Administrator**: Administrators have access to all tools, including system configurations, creating and managing users, and more. These users have access to options displayed under **Discover**, **Analyze**, and **Manage** sections of the console main screen.

### Role-based permissions to on-premises management console tools

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

#### Assign users to access groups

Administrators can enhance user access control in Defender for IoT by assigning users to specific *access groups*. Access groups are assigned to zones, sites, regions, and business units where a sensor is located. By assigning users to access groups, administrators gain specific control over where users manage and analyze device detections.

Working this way accommodates large organizations where user permissions can be complex or determined by a global organizational security policy. For more information, see [Define global access control](how-to-define-global-user-access-control.md).

### Role-based permissions to sensor tools

This section describes permissions available to sensor Administrators, Security Analysts, and Read-only users.  

| Permission | Read-only | Security Analyst | Administrator |
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

**To define a user**:

1. From the left pane for the sensor or the on-premises management console, select **Users**.

     :::image type="content" source="media/how-to-create-and-manage-users/users-pane.png" alt-text="Screenshot of the Users pane for creating users.":::
1. In the **Users** window, select **Create User**.
    
1. In the **Create User** pane, define the following parameters:

   - **Username**: Enter a username.
   - **Email**: Enter the user's email address.
   - **First Name**: Enter the user's first name.
   - **Last Name**: Enter the user's last name.
   - **Role**: Define the user's role. For more information, see [Role-based permissions](#role-based-permissions).
   - **Access Group**: If you're creating a user for the on-premises management console, define the user's access group. For more information, see [Define global access control](how-to-define-global-user-access-control.md).
   - **Password**: Select the user type as follows:
     - **Local User**: Define a password for the user of a sensor or an on-premises management console. Password must have at least eight characters and contain lowercase and uppercase- alphabetic characters, numbers, and symbols.
     - **Active Directory User**: You can allow users to sign in to the sensor or management console by using Azure Active Directory credentials. Defined Azure Active Directory groups can be associated with specific permission levels. For example, configure a specific Azure Active Directory group and assign all users in the group to the Read-only user type.


## User session timeout

If users aren't active at the keyboard or mouse for a specific time, they're signed out of their session and must sign in again.

When users haven't worked with their console mouse or keyboard for 30 minutes, a session sign out is forced.

This feature is enabled by default and on upgrade but can be disabled. In addition, session counting times can be updated. Session times are defined in seconds. Definitions are applied per sensor and on-premises management console.

A session timeout message appears at the console when the inactivity timeout has passed.

### Control inactivity sign-out

Administrator users can enable and disable inactivity sign-out and adjust the inactivity thresholds.

**To access the command**:

1. Sign in to the CLI for the sensor or on-premises management console by using Defender for IoT administrative credentials.

1. Enter `sudo nano /var/cyberx/properties/authentication`.

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

**To view user activity**:

1. Select **Event Timeline** from the sensor side menu.

1. Verify that  **User Operations** filter is set to **Show**.  

   :::image type="content" source="media/how-to-create-and-manage-users/track-user-activity.png" alt-text="Screenshot of the Event timeline showing a user that signed in to Defender for IoT.":::

1. Use the filters or Ctrl F option to find the information of interest to you.

## Integrate with Active Directory servers

Configure the sensor or on-premises management console to work with Active Directory. This allows Active Directory users to access the Defender for IoT consoles by using their Active Directory credentials.

> [!Note]
> LDAP v3 is supported.

Two types of LDAP-based authentication are supported:

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

### Azure Active Directory and Defender for IoT permissions

You can associate Azure Active Directory groups defined here with specific permission levels. For example, configure a specific Azure Active Directory group and assign Read-only permissions to all users in the group.

### Azure Active Directory configuration guidelines

- You must define the LDAP parameters here exactly as they appear in Azure Active Directory.
- For all the Azure Active Directory parameters, use lowercase only. Use lowercase even when the configurations in Azure Active Directory use uppercase.
- You can't configure both LDAP and LDAPS for the same domain. You can, however, use both for different domains at the same time.

**To configure Azure Active Directory**:

1. From the left pane, select **System Settings**.
1. Select **Integrations** and then select **Active Directory**.
:::image type="content" source="media/how-to-create-and-manage-users/active-directory-configuration.png" alt-text="Screenshot of the Azure Active Directory configuration dialog box.":::

1. Enable the **Active Directory Integration Enabled** toggle.

1. Set the Active Directory server parameters, as follows:

   | Server parameter | Description |
   |--|--|
   | Domain controller FQDN | Set the fully qualified domain name (FQDN) exactly as it appears on your LDAP server. For example, enter `host1.subdomain.domain.com`. |
   | Domain controller port | Define the port on which your LDAP is configured. |
   | Primary domain | Set the domain name (for example, `subdomain.domain.com`) and the connection type according to your LDAP configuration. |
   | Azure Active Directory groups | Enter the group names that are defined in your Azure Active Directory configuration on the LDAP server. You can enter a group name that you'll associate with Admin, Security Analyst and Read-only permission levels. Use these groups when creating new sensor users.|
   | Trusted domains | To add a trusted domain, add the domain name and the connection type of a trusted domain. <br />You can configure trusted domains only for users who were defined under users. |

#### Azure Active Directory groups for the On-premises management console

If you're creating Azure Active Directory groups for on-premises management console users, you must create an Access Group rule for each Azure Active Directory group. On-premises management console Azure Active Directory credentials won't work if an Access Group rule doesn't exist for the Azure Active Directory user group. For more information, see [Define global access control](how-to-define-global-user-access-control.md).

1. Select **Save**.

1. To add a trusted server, select **Add Server** and configure another server.

## Change a user's password

User passwords can be changed for users created with a local password.

**Administrator users**

The Administrator can change the password for the Security Analyst, and Read-only role. The Administrator role user can't change their own password and must contact a higher-level role. 

**Security Analyst and Read-only users**

The Security Analyst and Read-only roles can't reset their or any other role's passwords. The Security Analyst and Read-only roles need to contact a user with a higher role level to have their passwords reset.

**CyberX and Support users**

CyberX role can change the password for all user roles. The Support role can change the password for a Support, Administrator, Security Analyst, and Read-only user roles.  

**To reset a user's password on the sensor**:

1. Sign in to the sensor using a user with the role Administrator, Support, or CyberX.

1. Select **Users** from the left-hand panel.

1. Locate the local user whose password needs to be changed.
    
1. On this row, select three dots (...) and then select **Edit**.

   :::image type="content" source="media/how-to-create-and-manage-users/change-password.png" alt-text="Screenshot of the Change password dialog for local sensor users.":::

1. Enter and confirm the new password in **Change Password** section.

    > [!NOTE]
    > Passwords must be at least 16 characters, contain lowercase and uppercase alphabetic characters, numbers and one of the following symbols: #%*+,-./:=?@[]^_{}~

1. Select **Update**.

**To reset a user's password on the on-premises management console**:

1. Sign in to the on-premises management console using a user with the role Administrator, Support, or CyberX.

1. Select **Users** from the left-hand panel.

1. Locate your user and select the edit icon :::image type="icon" source="media/password-recovery-images/edit-icon.png" border="false"::: .

1. Enter the new password in the **New Password**, and **Confirm New Password** fields.

    > [!NOTE]
    > Passwords must be at least 16 characters, contain lowercase and uppercase alphabetic characters, numbers and one of the symbols: #%*+,-./:=?@[]^_{}~

1. Select **Update**.

## Recover the password for the on-premises management console, or the sensor

You can recover the password for the on-premises management console, or the sensor with the Password recovery feature. Only the CyberX, and Support user have access to the Password recovery feature.

**To recover the password for the on-premises management console, or the sensor**:

1. On the sign in screen of either the on-premises management console, or the sensor, select **Password recovery**. The **Password recovery** screen opens.

    :::image type="content" source="media/how-to-create-and-manage-users/password-recovery.png" alt-text="Screenshot of the Select Password recovery from the sign in screen of either the on-premises management console, or the sensor.":::

1. Select either **CyberX**, or **Support** from the drop-down menu, and copy the unique identifier code.

    :::image type="content" source="media/how-to-create-and-manage-users/password-recovery-screen.png" alt-text="Screenshot of selecting either the Defender for IoT user or the support user.":::

1. Navigate to the Azure portal, and select **Sites and Sensors**.  

1. Select the **Subscription Filter** icon :::image type="icon" source="media/password-recovery-images/subscription-icon.png" border="false":::  from the top toolbar, and select the subscription your sensor is connected to.

1. Select the **More Actions** drop down menu, and select **Recover on-premises management console password**.

    :::image type="content" source="media/how-to-create-and-manage-users/recover-password.png" alt-text="Screenshot of the recover on-premises management console password option.":::   

1. Enter the unique identifier that you received on the **Password recovery** screen and select **Recover**. The `password_recovery.zip` file is downloaded.

    :::image type="content" source="media/how-to-create-and-manage-users/enter-identifier.png" alt-text="Screenshot of entering enter the unique identifier and then selecting recover." lightbox="media/how-to-create-and-manage-users/enter-identifier.png":::

1. On the Password recovery screen, select **Upload**. **The Upload Password Recovery File** window will open.

1. Select **Browse** to locate your `password_recovery.zip` file, or drag the `password_recovery.zip` to the window.

    > [!NOTE]
    > An error message may appear indicating the file is invalid. To fix this error message, ensure you selected the right subscription before downloading the `password_recovery.zip` and download it again.  

1. Select **Next**, and your user, and system-generated password for your management console will then appear.

## Next steps

- [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)

- [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)

- [Track sensor activity](how-to-track-sensor-activity.md)
