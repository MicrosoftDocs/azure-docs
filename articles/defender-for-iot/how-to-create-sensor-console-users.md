---
title: Create and manage sensor console users
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/02/2020
ms.topic: how-to
ms.service: azure
---

# Manage users

This article describes how to create and manage sensor users. User management allows three permissions levels:

  - **Read Only** – The Read Only (RO) user can instantly evaluate overall system status. In addition, the RO performs tasks such as checking alerts and devices. RO users see the **Navigation** section only.

  - **Security Analyst** – The Security Analyst has RO and can also perform actions on devices, investigate and acknowledge alerts, use the trends and statistics features, etc. Security Analysts can see the **Navigation** and **Analysis** sections.

  - **Administrator** – The Administrator has all the permissions of the RO and Security Analyst and can also manage the system configuration, create, and delete users and create notifications. Administrators can see the **Navigation**, **Analysis**, and **Administration** sections.

Features also available to track user activity and enable Active Directory sign in to the sensor.

## Working with Active Directory

You can enable Active Directory sign in to the sensor. To work with Active Directory, set up the sensor to communicate with your organizational Active Directory server.

Active Directory groups defined can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group RO permissions.

> [!NOTE]
> **Administrators** may perform the procedures descried in this.

## Create users

To create users:

1. Select **Users** on the side menu.

    :::image type="content" source="media/how-to-create-sensor-console-users/user-management-screen.png" alt-text="Create and manage your users.":::

To create a new user:

1.  Select **Create User** at the top right of the page.

2. Enter the requested information, including the user role and password.

3. Select **CCCC**.

    :::image type="content" source="media/how-to-create-sensor-console-users/create-user-screen-information-to-fill-in.png" alt-text="Fill in the appropriate information for your user.":::

To edit a user:

1. Find the desired user and select **Edit Profile** under the **Actions** drop-down menu for the user.

2. Edit the information on the page as needed.

3. Select **Update** to save the changes.

    :::image type="content" source="media/how-to-create-sensor-console-users/update-the-users-information.png" alt-text="Update your user's information.":::

To delete a user:

  - Find the desired user and select **Delete** under the **Actions** drop-down menu for the user.

## Access to sensor tools – permissions

| Permissions or role | Read only | Security analyst | Administrator |
|--|--|--|--|
| View the dashboard | ✓ | ✓ | ✓ |
| Control map zoom views |  |  | ✓ |
| View alerts | ✓ | ✓ | ✓ |
| Manage alerts – acknowledge, learn, or pin |  | ✓ | ✓ |
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
| Manage multiple notifications simultaneously|  | ✓ | ✓ |
| Session timeout when users are not active | 30 minutes| 30 minutes| 30 minutes|

## Edit user profiles 

To edit a user profile:

1. Select the :::image type="icon" source="media/how-to-create-sensor-console-users/user-profile-icon.png" border="false"::: icon at the top right of any page.

2. Select **Profile** on the drop-down menu.

3. The user may edit the following fields:

    - Email address
  
    - First name
  
    - Last name
  
    - Change password
  
      :::image type="content" source="media/how-to-create-sensor-console-users/change-password-screen.png" alt-text="Fill out information for a user and change their password.":::

## Tracking user activity 

User activity can be tracked in the Event Timeline. The Timeline displays the event or impacted device, and the time and date the user carried out the activity.

To view user activity:

1. In the Event Timeline, enable the **User Operations** option.

    :::image type="content" source="media/how-to-create-sensor-console-users/user-activity-screenshot.png" alt-text="View a user's activity.":::
