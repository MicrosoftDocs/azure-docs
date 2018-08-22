---
title: How to create a basic group and add members using the Azure Active Directory portal | Microsoft Docs
description: Learn how to create a basic group in Azure Active Directory.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: quickstart
ms.date: 08/04/2017
ms.author: lizross
ms.reviewer: krbain
ms.custom: it-pro                         
---

# How to: Create a basic group and add members using the Azure Active Directory portal

You can create a basic group using the Azure Active Directory (Azure AD) portal. For the purposes of this article, a basic group is assigned to a single resource by the resource owner (administrator) and includes specific members (employees) that need to access that resource. For more complex scenarios, including dynamic memberships and rule creation, see the [Azure Active Directory user management documentation](../users-groups-roles/index.md).

## To create a basic group
1. Sign in to the [Azure AD portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, **Groups**, and then select **New group**.

    ![Azure AD portal with Groups showing](media/group-full-screen.png)

3. In the **Groups** blade, fill out the required information.

    ![New group blade, filled out with example info](media/create-basic-group-azure-portal/new-group-blade.png)

    - **Group type (required).** Select a pre-defined group type. This includes:
        
        - **Security**. Used to manage member and computer access to shared resources for a group of users. For example, you can create a security group for a specific security policy. By doing it this way, you can assign permissions to all the members at once, instead of having to add permissions to each member individually. For more info about managing access to resources, see [Manage access to resources with Azure Active Directory groups](active-directory-manage-groups.md).
        
        - **Office 365**. Provides a place to collaborate by giving members access to a shared mailbox, calendar, files, SharePoint site, and more. This option also lets you give people outside of your organization access to the group. For more info about Office 365 Groups, see [Learn about Office 365 Groups](https://support.office.com/article/learn-about-office-365-groups-b565caa1-5c40-40ef-9915-60fdb2d97fa2).

    - **Group name (required).** Add a name for the group, something that you'll remember and that makes sense.

    - **Group description.** Add an optional description to your group.

    - **Membership type (required).** Select a pre-defined membership type. This includes:

        - **Assigned.** Lets you assign specific employees to be members of this group and to have unique permissions. For more info about how to add members, see the [Add members to your group](#add-members-to-your-group) section of this article.

        - **Dynamic user.** Lets you use dynamic group rules to automatically add and remove members. If a member's attributes change, the system looks at your dynamic group rules for the directory to see if the member meets the rule requirements (is added) or no longer meets the rules requirements (is removed).

        - **Dynamic device.** Lets you use dynamic group rules to automatically add and remove devices. If a device's attributes change, the system looks at your dynamic group rules for the directory to see if the device meets the rule requirements (is added) or no longer meets the rules requirements (is removed).

        >[!Important]
        >You can create a dynamic group for either devices or users, but not for both. You also can't create a device group based on the device owners' attributes. Device membership rules can only reference device attributions.

4. Select **Create**.

## Assign members to your group
After you've created your group, you must add members. For this article we're using the group _MDM policy-West_, with a group membership of **Assigned**. For more info about creating a dynamic group, see [Create a dyncamic group and check status](../users-groups-roles/groups-create-rule.md).

### To assign members to your group
1. 


