---
title: Create azure for defender users and roles
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/05/2020
ms.topic: article
ms.service: azure
---

# Overview

## Create on-premises management console users

Each on-premises management console user has access to view and configuration options based on their user role. Administrators can add and remove users and can reassign roles.

The following roles can be defined:

- Administrator

- Security Analyst

- Read Only

When creating users, consider the following:

**Your organizational structure:** Administrators can further enhance user access control by assigning users to specific Access Groups. These groups represent zones, sites, regions, and business units to which a sensor is assigned. For example, a global glass enterprise with several factories on different continents. By assigning users to access groups, administrators gain specific control over where specific roles manage and analyze assets in Defender for IoT.

Working this way accommodates large organizations where user permissions can be complex and may be determined by a global organizational structure, in addition to the standard site or zone structure. See **Define Global Access Control** for details about access groups.

**Your user structure:** You can create local users or users associated with an Active Directory group. If you want to work with Active Directory user groups, you must configure Defender for IoT integration with Active Directory.

## Role-Based Permissions

This section describes the specific permissions associated with each user role.

Permissions per role are predefined and cannot be updated.

All the on-premises management console capabilities are divided into the three main categories that appear in the left pane: Navigation, Analysis, and Administration, as shown in the following figure.

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image96.png" alt-text="Screenshot of on-premises management console view":::

The on-premises management console configuration options are correlated with the roles as follows:

- **Read Only**: The Read Only (RO) user can access the **Discover** section only.

- **Security Analyst:** The Security Analyst user can access the **Discover** and the **Analyze** sections.

- **Administrator:** The Administrator user can access the **Discover**, **Analyze, and **Manage** sections.

### User Session Timeout

If users are not active at the keyboard or mouse for a specific time, they are logged out of their session and must log in again. **See Control User Session Logout** for details.

## Define Users

Users at the on-premises management console are defined with a user role. Each role provides unique levels of access to the on-premises management console features.

By default, the on-premises management console is deployed with two users, *Defender for IoT* and *support*. This is done for support purposes and you cannot change their definitions.

To add a new user:

1. From the on-premises management console left pane, select **Users**. The **Users** window appears.

2. In the Users window, select :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image97.png" alt-text="Icon of Create User button":::, the **Crate User** pane appears.

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image98.png" alt-text="Screenshot of Create User view":::

3. In the **Create User** pane, set the following parameters:

- **Username:** Type the username of the new user.
- **Email:** Type the user's email address.
- **First Name:** Type the user's first name.
- **Last Name:** Type the user's last name.
- **Role:** Define the user's role, see Role-Based Permissions.
- **Access Group:** Define the user's access group, See Define Global Access Control for details.
- **Password:** Select the user type as follows:
  - **Local User:** A regular on-premises management console user. Set a password for this user. The password must include at least six characters and must include letters and numbers.
  - **Active Directory User:** If you use Active Directory in your organization, select this option. on-premises management console connects to the list of users that you have defined in Active Directory and allows using the same credentials in both systems.

4. Select :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image99.png" alt-text="Icon of Create button":::. The new user appears in the list of users in the Users pane.

:::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image100.png" alt-text="Screenshot of Manage Users view":::

## Access Permissions

| Permissions/Role | Read Only | Security Analyst | Administrator |
|--|--|--|--|
| View and filter the enterprise map | ✓ | ✓ | ✓ |
| Build a site |  |  | ✓ |
| Manage Site (Add/edit zones) |  |  | ✓ |
| View /filter Asset Inventory | ✓ | ✓ | ✓ |
| View/Manage alerts – acknowledge/learn/pin (see alerts for details.) | ✓ | ✓ | ✓ |
| Generate reports |  | ✓ | ✓ |
| View risk assessment Reports |  | ✓ | ✓ |
| Set alert exclusions |  | ✓ | ✓ |
| View/define access groups |  |  | ✓ |
| Manage system settings (See on-premises management console and sensor System Settings for details.) |  |  | ✓ |
| Manage Users (See Create on-premises management console Users for details.) |  |  | ✓ |
| Send alert data to partners (See Define Forwarding Rules for details.) |  |  | ✓ |
| Session timeout when users are not active | 30 mins | 30 mins | 30 mins |

## Control User Session Logout

When users have not worked with their console mouse or keyboard for a period of 30 mins, a session logout is forced.

This feature is enabled by default and on upgrade but can be disabled. In addition, session counting times can be updated. Session times are defined in seconds.

Configurations are applied per sensor and on-premises management console.

A session timeout message appears at the console hen the inactivity timeout has passed.

### Control Inactivity Logout

Admin users can enable and disable this feature and adjust the in-activity thresholds.

**To access the command:**

1. Log in to the sensor or on-premises management console CLI with Defender for IoT administrative credentials.

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

**To disable the feature:**
Change `infinity_session_expiration = true` to `infinity_session_expiration = false`

**To update logout counting periods:**

- Adjust the `= <number>` to the time required.

## Manage users

This section describes how to create and manage sensor users. User management allows three permissions levels:

  - **Read Only** – The Read Only (RO) user can instantly evaluate overall system status. In addition, the RO performs tasks such as checking alerts and assets. Read Only users see the **Navigation** section only.

  - **Security Analyst** – The Security Analyst has Read Only and can also perform actions on assets, investigate and acknowledge alerts, use the Trends & Statistics features, etc. Security Analysts can see the **Navigation** and **Analysis** sections.

  - **Administrator** – The Administrator has all the permissions of the RO and Security Analyst and can also manage the system configuration, create, and delete users and create notifications. Administrators can see the **Navigation, Analysis, and **Administration** sections.

Features also available to track user activity and enable Active Directory Login to the sensor.

### Working with Active Directory

You can enable Active Directory login to the sensor. To work with Active Directory, set up the sensor to communicate with your organizational Active Directory server.

Active Directory groups defined can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group Read Only permissions.

See [Integrate with Active Directory Servers](./integrate-with-active-directory-servers.md) for details.

> [!NOTE]
> **Administrators** may perform the procedures descried in this.

### Create users

This section describes how to create users.

**To create:**

1. Select **Users** on the side menu.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image271.png" alt-text="Users 1":::

**To create a new user:**

1.  Select **Create User** at the top right of the page.

2. Enter the requested information, including the user role and password.

3. Select **CCCC**.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image272.png" alt-text="Users 2":::

**To edit a user:**

1. Find the desired user and select **Edit Profile** under the **Actions** drop-down menu for the user.

2. Edit the information on the page as needed.

3. Select **Update** to save the changes.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image273.png" alt-text="Update":::

**To delete a user:**

  - Find the desired user and select **Delete** under the **Actions** drop-down menu for the user.

### Access to sensor tools and permissions

| Permissions and role | Read only | Security analyst | Administrator |
|--|--|--|--|
| View the dashboard <br />See <a href="./the-dashboard.md">The Dashboard for details. | ✓ | ✓ | ✓ |
| Control map zoom views <br /> See <a href="./map-zoom-views.md">Map Zoom Views</a> for details. |  |  | ✓ |
| View alerts <br /> See <a href="./alerts.md">Alerts</a> for details. | ✓ | ✓ | ✓ |
| Manage alerts – acknowledge/learn/pin <br /> See <a href="./alerts.md">Alerts</a> for details. |  | ✓ | ✓ |
| View events in a timeline <br />See <a href="./event-timeline.md">Event Timeline</a> for details. |  | ✓ | ✓ |
| Authorize assets, known scanning devices, programming assets <br />See <a href="./learn-more-about-assets.md#view-and-manage-asset-properties">View and Manage Asset Properties</a> for details. |  | ✓ | ✓ |
| View investigation data <br />See <a href="./trends-and-statistics.md">Trends and Statistics</a> for details. | ✓ | ✓ | ✓ |
| Manage system settings <br />See <a href="./system-settings.md">System Settings</a> for details. |  |  | ✓ |
| Manage Users <br />See <a href="./manage-users.md">Manage Users</a> for details. |  |  | ✓ |
| DNS Servers for Reverse Lookup <br />See <a href="./configure-dns-servers-for-reverse-lookup-resolution.md">Configure DNS Servers for Reverse Lookup Resolution</a> for details. |  |  | ✓ |
| Send alert data to partners <br />See <a href="./forward-alert-information-to-3rd-parties.md">Forward Alert Information to partners</a> for details. |  | ✓ | ✓ |
| Create alert comments <br />See <a href="./accelerate-incident-workflow-with-alert-comments.md">Accelerate Incident Workflow with Alert Comments</a> for details. |  | ✓ | ✓ |
| View programming change history <br />See <a href="learn-more-about-assets.md#analyze-programming-details-and-changes">Analyze Programming Details and Changes</a> for details. | ✓ | ✓ | ✓ |
| Create customize alerts rules <br />See <a href="./customized-alert-rules.md">Customized Alert Rules</a> for details. |  | ✓ | ✓ |
| Manage Multiple Notifications Simultaneously <br />See <a href="learn-more-about-assets.md#working-with-asset-notifications">Working with Asset Notifications</a> for details. |  | ✓ | ✓ |
| Session timeout when users are not active | 30 mins | 30 mins | 30 mins |

### Edit user profiles 

This section describes how to edit a user profile.

1. Select the :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image274.png" alt-text="select"::: icon at the top right of any page. 

2. Select Profile on the drop-down menu.

3. The user may edit the following fields:

    - Email address
  
    - First name
  
    - Last name
  
    - Change Password
  
      :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image275.png" alt-text="Change Password":::

### Tracking user activity 

User activity can be tracked in the Event Timeline. The Timeline displays the event or impacted asset, and the time and date the user carried out the activity.

**To view user activity:**

1. In the Event Timeline, enable the User Operations option. See Event Timeline for details.

    :::image type="content" source="media/how-to-create-azure-for-defender-users-and-roles/image276.png" alt-text="view user activity":::

