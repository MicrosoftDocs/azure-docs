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

Azure Active Directory (Azure AD) groups are used to manage users (members) that all need the same access and permissions for potentially restricted apps and services.




# Create a basic group and add members using Azure Active Directory
You can create a basic group using the Azure Active Directory (Azure AD) portal. For the purposes of this article, a basic group is added to a single resource by the resource owner (administrator) and includes specific members (employees) that need to access that resource. For more complex scenarios, including dynamic memberships and rule creation, see the [Azure Active Directory user management documentation](../enterprise-users/index.yml).

## Group and membership types
There are several group and membership types. The following information explains each group and membership type and why they are used, to help you decide which options to use when you create a group.

### Group types:
- **Security**. Used to manage member and computer access to shared resources for a group of users. For example, you can create a security group for a specific security policy. By doing it this way, you can give a set of permissions to all the members at once, instead of having to add permissions to each member individually. A security group can have users, devices, groups and service principals as its members and users and service principals as its owners. For more info about managing access to resources, see [Manage access to resources with Azure Active Directory groups](active-directory-manage-groups.md).
- **Microsoft 365**. Provides collaboration opportunities by giving members access to a shared mailbox, calendar, files, SharePoint site, and more. This option also lets you give people outside of your organization access to the group. A Microsoft 365 group can have only users as its members. Both users and service principals can be owners of a Microsoft 365 group. For more info about Microsoft 365 Groups, see [Learn about Microsoft 365 Groups](https://support.office.com/article/learn-about-office-365-groups-b565caa1-5c40-40ef-9915-60fdb2d97fa2).

### Membership types:
- **Assigned.** Lets you add specific users to be members of this group and to have unique permissions. For the purposes of this article, we're using this option.
- **Dynamic user.** Lets you use dynamic membership rules to automatically add and remove members. If a member's attributes change, the system looks at your dynamic group rules for the directory to see if the member meets the rule requirements (is added) or no longer meets the rules requirements (is removed).
- **Dynamic device.** Lets you use dynamic group rules to automatically add and remove devices. If a device's attributes change, the system looks at your dynamic group rules for the directory to see if the device meets the rule requirements (is added) or no longer meets the rules requirements (is removed).

    > [!IMPORTANT]
    > You can create a dynamic group for either devices or users, but not for both. You also can't create a device group based on the device owners' attributes. Device membership rules can only reference device attributions. For more info about creating a dynamic group for users and devices, see [Create a dynamic group and check status](../enterprise-users/groups-create-rule.md)
























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
