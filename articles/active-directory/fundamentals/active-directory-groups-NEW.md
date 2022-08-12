---
title: Manage groups - Azure Active Directory | Microsoft Docs
description: Instructions about how to manage Azure AD groups and group membership.
services: active-directory
author: barclayn
manager: rkarlin

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 08/29/2018
ms.author: barclayn
ms.reviewer: krbain
ms.custom: "it-pro, seodec18"                      
ms.collection: M365-identity-device-management
---
# Manage Azure Active Directory groups and group membership

Azure Active Directory (Azure AD) groups are used to manage users that all need the same access and permissions to resources, such as potentially restricted apps and services. Instead of adding special permissions to individual users, you create a group that applies the special permissions to every member of that group. 

This article covers basic group scenarios where a single group is added to a single resource and users are added as members to that group. For more complex scenarios like dynamic memberships and rule creation, see the [Azure Active Directory user management documentation](../enterprise-users/index.yml).

The examples used in this article are based on the [group management quickstart](../fundamentals/active-directory-groups-create-azure-portal.md).

## Group and membership types
Before adding groups and members, review the group and membership types below to help you decide which options to use when you create a group.

### Group types:

**Security:** Used to manage user and computer access to shared resources.

For example, you can create a security group so that all group members have the same set of security permissions. Members of a security group can include users, devices, other groups, and [service principals](../fundamentals/service-accounts-principal.md), which define access policy and permissions. Owners of a security group can include users and service principals. For more info about managing access to resources, see [Manage access to resources with Azure Active Directory groups](active-directory-manage-groups.md).

**Microsoft 365:** Provides collaboration opportunities by giving group members access to a shared mailbox, calendar, files, SharePoint sites, and more.

This option also lets you give people outside of your organization access to the group. Members of a Microsoft 365 can only include users. Owners of a Microsoft 365 group can include users and service principals. For more info about Microsoft 365 Groups, see [Learn about Microsoft 365 Groups](https://support.office.com/article/learn-about-office-365-groups-b565caa1-5c40-40ef-9915-60fdb2d97fa2).

### Membership types:
- **Assigned:** Lets you add specific users as members of a group and have unique permissions. For the purposes of this article, we're using this option.
- **Dynamic user:** Lets you use dynamic membership rules to automatically add and remove members. If a member's attributes change, the system looks at your dynamic group rules for the directory to see if the member meets the rule requirements (is added) or no longer meets the rules requirements (is removed).
- **Dynamic device:** Lets you use dynamic group rules to automatically add and remove devices. If a device's attributes change, the system looks at your dynamic group rules for the directory to see if the device meets the rule requirements (is added) or no longer meets the rules requirements (is removed).

    > [!IMPORTANT]
    > You can create a dynamic group for either devices or users, but not for both. You can't create a device group based on the device owners' attributes. Device membership rules can only reference device attributions. For more info about creating a dynamic group for users and devices, see [Create a dynamic group and check status](../enterprise-users/groups-create-rule.md)

## Create a basic group and add members
You can create a basic group using the Azure Active Directory (Azure AD) portal. 



You can create a basic group and add your members at the same time. To create a basic group and add members use the following procedure:

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator account for the directory.

1. Navigate to **Azure Active Directory** > **Groups** > **New group**.

    ![Azure AD page, with Groups showing](media/active-directory-groups-create-azure-portal/group-full-screen.png)

1. The **New Group** pane will appear and you must fill out the required information.

    ![New group page, filled out with example info](media/active-directory-groups-create-azure-portal/new-group-blade.png)

1. Select a **Group type**. For more information on group types, see [Group and membership types](#group-types).

1. Enter a **Group name.** Choose a name that you'll remember and that makes sense for the group. A check will be performed to determine if the name is already in use. If the name is already in use, you'll be asked to change the name of your group.

1. **Group description.** Add an optional description to your group.

1. Switch the **Azure AD roles can be assigned to the group** setting to yes to use this group to assign Azure AD roles to members.
    - Enabling this option automatically selects "Assigned" as the **Membership type.**
    - The option to add roles while creating the group is added to the process.

1. Select a **Membership type.** For more information on membership types, see [Group and membership types](#membership-types).

1. Optionally add **Owners** or **Members**. Members and owners can be added after creating your group.
    1. Select the link under each heading to populate a list of every user in your directory.
    1. Choose users from the list and then select the **Select** button at the bottom of the window.

1. Select **Create**. Your group is created and ready for you to manage other settings.

### Add 

1. Select the **Members** area from the **Group** page, and then begin searching for the members to add to your group from the **Select members** page.

    ![Selecting members for your group during the group creation process](media/active-directory-groups-create-azure-portal/select-members-create-group.png)

1. When you're done adding members, choose **Select**.

    The **Group Overview** page updates to show the number of members who are now added to the group.

    ![Group Overview page with number of members highlighted](media/active-directory-groups-create-azure-portal/group-overview-blade-number-highlight.png)

## Turn off group welcome email

When any new Microsoft 365 group is created, whether with dynamic or static membership, a welcome notification is sent to all users who are added to the group. When any attributes of a user or device change, all dynamic group rules in the organization are processed for potential membership changes. Users who are added then also receive the welcome notification. You can turn this behavior off in [Exchange PowerShell](/powershell/module/exchange/users-and-groups/Set-UnifiedGroup).









# Delete a group using Azure Active Directory
You can delete an Azure Active Directory (Azure AD) group for any number of reasons, but typically it will be because you:

- Incorrectly set the **Group type** to the wrong option.

- Created the wrong or a duplicate group by mistake. 

- No longer need the group.

## To delete a group
1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, and then select **Groups**.

3. From the **Groups - All groups** page, search for and select the group you want to delete. For these steps, we'll use **MDM policy - East**.

    ![Groups-All groups page, group name highlighted](media/active-directory-groups-delete-group/group-all-groups-screen.png)

4. On the **MDM policy - East Overview** page, and then select **Delete**.

    The group is deleted from your Azure Active Directory tenant.

    ![MDM policy - East Overview page, delete option highlighted](media/active-directory-groups-delete-group/group-overview-blade.png)

## Next steps

- If you delete a group by mistake, you can create it again. For more information, see [How to create a basic group and add members](active-directory-groups-create-azure-portal.md).

- If you delete a Microsoft 365 group by mistake, you might be able to restore it. For more information, see [Restore a deleted Office 365 group](../enterprise-users/groups-restore-deleted.md).
