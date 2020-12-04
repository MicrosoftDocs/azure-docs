---
title: Create and manage users
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/19/2020
ms.topic: article
ms.service: azure
---

# Overview

## Create on-premises management console users

Each on-premises management console user has access to view and configuration options based on their user role. Administrators can add and remove users and can reassign roles.

The following roles can be defined:

- Administrator

- Security analyst

- Read only

When creating users, consider the     :

**Your organizational structure:** Administrators can further enhance user access control by assigning users to specific access groups. These groups represent zones, sites, regions, and business units to which a sensor is assigned. For example, a global glass enterprise with several factories on different continents. By assigning users to access groups, administrators gain specific control over where specific roles manage and analyze devices in Defender for IoT.

Working this way accommodates large organizations where user permissions can be complex and may be determined by a global organizational structure, in addition to the standard site or zone structure. 

**Your user structure:** You can create local users or users associated with an Active Directory group. If you want to work with Active Directory user groups, you must configure Defender for IoT integration with Active Directory.

## Role-based permissions

This article describes the specific permissions associated with each user role.

Permissions per role are predefined and cannot be updated.

All the on-premises management console capabilities are divided into the three main categories that appear in the left pane: Navigation, Analysis, and Administration, as shown in the following figure.

The on-premises management console configuration options are correlated with the roles as follows:

- **Read Only**: The Read Only (RO) user can access the **Discover** section only.

- **Security Analyst:** The Security Analyst user can access the **Discover** and the **Analyze** sections.

- **Administrator:** The Administrator user can access the **Discover**, **Analyze, and **Manage** sections.

### User session timeout

If users are not active at the keyboard or mouse for a specific time, they are signed out of their session and must sign in again. 

## Define Users

Users of the on-premises management console are defined with a user role. Each role provides unique levels of access to the on-premises management console features.

By default, the on-premises management console is deployed with two users, Defender for IoT and Support. This is done for support purposes and you cannot change their definitions.

To add a new user:

1. From the on-premises management console left pane, select **Users**.

2. In the Users window, select the create user icon :::image type="icon" source="media/how-to-create-azure-for-defender-users-and-roles/create-user-icon.png" border="false":::. The create user window appears.

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/create-user-screen.png" alt-text="The create user window.":::

3. In the **Create User** pane, set the following parameters:

- **Username:** Type the username of the new user.
- **Email:** Type the user's email address.
- **First Name:** Type the user's first name.
- **Last Name:** Type the user's last name.
- **Role:** Define the user's role, see [Role based permissions](#role-based-permissions).
- **Access Group:** Define the user's access group.
- **Password:** Select the user type as follows:
  - **Local User:** A regular on-premises management console user. Set a password for this user. The password must include at least six characters and must include letters and numbers.
  - **Active Directory User:** If you use Active Directory in your organization, select this option. on-premises management console connects to the list of users that you have defined in Active Directory and allows using the same credentials in both systems.

4. Select :::image type="icon" source="media/how-to-create-azure-for-defender-users-and-roles/create-icon.png" border="false":::. The new user appears in the list of users in the Users pane.

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/manage-user-views.png" alt-text="Manage your users.":::

## Access Permissions

| Permissions and role | Read only | Security analyst | Administrator |
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

## Control user session sign out

When users have not worked with their console mouse or keyboard for a period of 30 minutes, a session sign out is forced.

This feature is enabled by default and on upgrade but can be disabled. In addition, session counting times can be updated. Session times are defined in seconds.

Configurations are applied per sensor and on-premises management console.

A session timeout message appears at the console hen the inactivity timeout has passed.

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

## Manage users

This article describes how to create and manage sensor users. User management allows for three permissions levels:

  - **Read Only** – The Read Only (RO) user can instantly evaluate overall system status. In addition, the RO performs tasks such as checking alerts and devices. read-only users see the **Navigation** section only.

  - **Security Analyst** – The Security Analyst has Read Only and can also perform actions on devices, investigate and acknowledge alerts, use the trends and statistics features. Security Analysts can see the **Navigation** and **Analysis** sections.

  - **Administrator** – The Administrator has all the permissions of the RO and Security Analyst and can also manage the system configuration, create, and delete users and create notifications. Administrators can see the **Navigation**, **Analysis**, and **Administration** sections.

Features also available to track user activity and enable Active Directory sign in to the sensor.

### Working with Active Directory

You can enable Active Directory sign in to the sensor. To work with Active Directory, set up the sensor to communicate with your organizational Active Directory server.

Active Directory groups defined can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group Read Only permissions.

> [!NOTE]
> **Administrators** may perform the procedures descried in this.

### Create users

This article describes how to create users.

To create:

1. Select **Users** on the side menu.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/user-management-screen.png" alt-text="Manage your users from the user's screen.":::

To create a new user:

1.  Select **Create User** at the top right of the page.

2. Enter the requested information, including the user role and password.

3. Select **CCCC**.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/create-user-information-screen.png" alt-text="Fill in the required information on the create user screen.":::

To edit a user:

1. Find the desired user and select **Edit Profile** under the **Actions** drop-down menu for the user.

2. Edit the information on the page as needed.

3. Select **Update** to save the changes.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/filled-out-user-information-screen.png" alt-text="Create user screen filled out with information.":::

To delete a user:

  - Find the desired user and select **Delete** under the **Actions** drop-down menu for the user.

### Access to sensor tools and permissions

| Permissions and role | Read only | Security analyst | Administrator |
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

### Edit user profiles 

To edit a user profile:

1. Select the :::image type="icon" source="media/how-to-create-azure-for-defender-users-and-roles/profile-icon.png" border="false"::: icon at the top right of any page. 

2. Select **Profile** on the drop-down menu.

3. The user may edit the following fields:

    - Email address
  
    - First name
  
    - Last name
  
    - Change Password
  
      :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/create-new-user-screen.png" alt-text="Change the user's password.":::

### Tracking user activity 

User activity can be tracked in the Event Timeline. The timeline displays the event or impacted device, and the time and date the user carried out the activity.

To view user activity:

1. In the Event Timeline, enable the **User Operations** option. 

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/User-login-attempts.png" alt-text="View a user's activity.":::
