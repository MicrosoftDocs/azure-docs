---
title: Create sensor console users
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/18/2020
ms.topic: article
ms.service: azure
---

# Manage users

This section describes how to create and manage sensor users. User management allows three permissions levels:

  - **Read Only** – The Read Only (RO) user can instantly evaluate overall system status. In addition, the RO performs tasks such as checking alerts and assets. Read Only users see the **Navigation** section only.

  - **Security Analyst** – The Security Analyst has Read Only and can also perform actions on assets, investigate and acknowledge alerts, use the Trends & Statistics features, etc. Security Analysts can see the **Navigation** and **Analysis** sections.

  - **Administrator** – The Administrator has all the permissions of the RO and Security Analyst and can also manage the system configuration, create and delete users and create notifications. Administrators can see the **Navigation, Analysis** and **Administration** sections.

Features also available to track user activity and enable Active Directory Login to the sensor.

## Working with Active Directory

You can enable Active Directory login to the sensor. To work with Active Directory, set up the sensor to communicate with your organizational Active Directory server.

Active Directory groups defined can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group Read Only permissions.

See [Integrate with Active Directory Servers](./integrate-with-active-directory-servers.md) for details.

> [!NOTE]
> **Administrators** may perform the procedures descried in this.

## Create users

This section describes how to create users.

**To create:**

1. Select **Users** on the side menu.

    :::image type="content" source="media/how-to-create-sensor-console-users/image271.png" alt-text="Users 1":::

**To create a new user:**

1.  Select **Create User** at the top right of the page.

2. Enter the requested information, including the user role and password.

3. Select **CCCC**.

    :::image type="content" source="media/how-to-create-sensor-console-users/image272.png" alt-text="Users 2":::

**To edit a user:**

1. Find the desired user and select **Edit Profile** under the **Actions** drop-down menu for the user.

2. Edit the information on the page as needed.

3. Select **Update** to save the changes.

    :::image type="content" source="media/how-to-create-sensor-console-users/image273.png" alt-text="Update":::

**To delete a user:**

  - Find the desired user and select **Delete** under the **Actions** drop-down menu for the user.

## Access to sensor tools – permissions

| Permissions or Role | Read Only | Security Analyst | Administrator |
|--|--|--|--|
| View the dashboard<br />See <a href="./the-dashboard.md">The Dashboard</a> for details. | ✓ | ✓ | ✓ |
| Control map zoom vie-ws<br /> See <a href="./map-zoom-views.md">Map Zoom Views</a> for details. |  |  | ✓ |
| View alerts<br />See <a href="./alerts.md">Alerts</a> for details. | ✓ | ✓ | ✓ |
| Manage alerts – acknowledge, learn, or pin<br />See <a href="./alerts.md">Alerts</a> for details. |  | ✓ | ✓ |
| View events in a timeline<br />See <a href="./event-timeline.md">Event Timeline</a> for details. |  | ✓ | ✓ |
| Authorize assets, known scanning devices, programming assets<br />See <a href="./learn-more-about-assets.md#view-and-manage-asset-properties">View and Manage Asset Properties</a> for details. |  | ✓ | ✓ |
| View investigation data<br /> See <a href="./trends-and-statistics.md">Trends and Statistics</a> for details. | ✓ | ✓ | ✓ |
| Manage system settings<br />See <a href="./system-settings.md">System Settings</a> for details. |  |  | ✓ |
| Manage Users,br /> See <a href="./manage-users.md">Manage Users</a> for details. |  |  | ✓ |
| DNS Servers for Reverse Lookup<br /> See <a href="./configure-dns-servers-for-reverse-lookup-resolution.md">Configure DNS Servers for Reverse Lookup Resolution</a> for details. |  |  | ✓ |
| Send alert data to partners<br /> See <a href="./forward-alert-information-to-3rd-parties.md">Forward Alert Information to 3rd Parties</a> for details. |  | ✓ | ✓ |
| Create alert comments<br /> See <a href="./accelerate-incident-workflow-with-alert-comments.md">Accelerate Incident Workflow with Alert Comments</a> for details. |  | ✓ | ✓ |
| View programming change history<br /> See <a href="learn-more-about-assets.md#analyze-programming-details-and-changes">Analyze Programming Details and Changes</a> for details. | ✓ | ✓ | ✓ |
| Create customize alerts rules<br /> See <a href="./customized-alert-rules.md">Customized Alert Rules</a> for details. |  | ✓ | ✓ |
| Manage Multiple Notifications Simultaneously<br /> See <a href="learn-more-about-assets.md#working-with-asset-notifications">Working with Asset Notifications</a> for details. |  | ✓ | ✓ |
| Session timeout when users are not active | 30 mins | 30 mins | 30 mins |

## Edit user profiles 

This section describes how to edit a user profile.

1. Select the :::image type="content" source="media/how-to-create-sensor-console-users/image274.png" alt-text="select"::: icon at the top right of any page.

2. Select Profile on the drop-down menu.

3. The user may edit the following fields:

    - Email address
  
    - First name
  
    - Last name
  
    - Change Password
  
      :::image type="content" source="media/how-to-create-sensor-console-users/image275.png" alt-text="Change Password":::

## Tracking user activity 

User activity can be tracked in the Event Timeline. The Timeline displays the event or impacted asset, and the time and date the user carried out the activity.

**To view user activity:**

1. In the Event Timeline, enable the User Operations option. See Event Timeline for details.

    :::image type="content" source="media/how-to-create-sensor-console-users/image276.png" alt-text="view user activity":::
