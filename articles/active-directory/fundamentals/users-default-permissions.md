---
title: Default user permissions - Azure Active Directory | Microsoft Docs
description: Learn about the different user permissions available in Azure Active Directory.
services: active-directory
author: eross-msft
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 02/16/2019
ms.author: lizross
ms.reviewer: vincesm
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# What are the default user permissions in Azure Active Directory?
In Azure Active Directory (Azure AD), all users are granted a set of default permissions. A user’s access consists of the type of user, their [role assignments](active-directory-users-assign-role-azure-portal.md), and their ownership of individual objects. This article describes those default permissions and contains a comparison of the member and guest user defaults. The default user permissions can be changed only in user settings in Azure AD.

## Member and guest users
The set of default permissions received depends on whether the user is a native member of the tenant (member user) or if the user is brought over from another directory as a B2B collaboration guest (guest user). See [What is Azure AD B2B collaboration?](../b2b/what-is-b2b.md) for more information about adding guest users.
* Member users can register applications, manage their own profile photo and mobile phone number, change their own password, and invite B2B guests. In addition, users can read all directory information (with a few exceptions). 
* Guest users have restricted directory permissions. For example, guest users cannot browse information from the tenant beyond their own profile information. However, a guest user can retrieve information about another user by providing the User Principal Name or objectId. A guest user can read properties of groups they belong to, including group membership, regardless of the **Guest users permissions are limited** setting. A guest cannot view information about any other tenant objects.

Default permissions for guests are restrictive by default. Guests can be added to administrator roles, which grant them full read and write permissions contained in the role. There is one additional restriction available, the ability for guests to invite other guests. Setting **Guests can invite** to **No** prevents guests from inviting other guests. See [Delegate invitations for B2B collaboration](../b2b/delegate-invitations.md) to learn how. To grant guest users the same permissions as member users by default, set **Guest users permissions are limited** to **No**. This setting grants all member user permissions to guest users by default, as well as to allow guests to be added to administrative roles.

## Compare member and guest default permissions

**Area** | **Member user permissions** | **Guest user permissions**
------------ | --------- | ----------
Users and contacts | Read all public properties of users and contacts<br>Invite guests<br>Change own password<br>Manage own mobile phone number<br>Manage own photo<br>Invalidate own refresh tokens | Read own properties<br>Read display name, email, sign-in name, photo, user principal name, and user type properties of other users and contacts<br>Change own password
Groups | Create security groups<br>Create Office 365 groups<br>Read all properties of groups<br>Read non-hidden group memberships<br>Read hidden Office 365 group memberships for joined group<br>Manage properties, ownership, and membership of groups the user owns<br>Add guests to owned groups<br>Manage dynamic membership settings<br>Delete owned groups<br>Restore owned Office 365 groups | Read all properties of groups<br>Read non-hidden group memberships<br>Read hidden Office 365 group memberships for joined groups<br>Manage owned groups<br>Add guests to owned groups (if allowed)<br>Delete owned groups<br>Restore owned Office 365 groups<br>Read properties of groups they belong to, including membership.
Applications | Register (create) new application<br>Read properties of registered and enterprise applications<br>Manage application properties, assignments, and credentials for owned applications<br>Create or delete application password for user<br>Delete owned applications<br>Restore owned applications | Read properties of registered and enterprise applications<br>Manage application properties, assignments, and credentials for owned applications<br>Delete owned applications<br>Restore owned applications
Devices | Read all properties of devices<br>Manage all properties of owned devices<br> | No permissions<br>Delete owned devices<br>
Directory | Read all company information<br>Read all domains<br>Read all partner contracts | Read display name and verified domains
Roles and Scopes | Read all administrative roles and memberships<br>Read all properties and membership of administrative units | No permissions 
Subscriptions | Read all subscriptions<br>Enable Service Plan Member | No permissions
Policies | Read all properties of policies<br>Manage all properties of owned policy | No permissions

## To restrict the default permissions for member users

Default permissions for member users can be restricted in the following ways.

Permission | Setting explanation
---------- | ------------
Users can register application | Setting this option to No prevents users from creating application registrations. The ability can then be granted back to specific individuals by adding them to the Application Developer role.
Allow users to connect work or school account with LinkedIn | Setting this option to No prevents users from connecting their work or school account with their LinkedIn account.  See [LinkedIn account connections data sharing and consent](https://docs.microsoft.com/azure/active-directory/users-groups-roles/linkedin-user-consent) for more information.
Ability to create security groups | Setting this option to No prevents users from creating security groups. Global administrators and User administrators can still create security groups. See [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md) to learn how.
Ability to create Office 365 groups | Setting this option to No prevents users from creating Office 365 groups. Setting this option to Some allows a select set of users to create Office 365 groups. Global administrators and User administrators will still be able to create Office 365 groups. See [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md) to learn how.
Restrict access to Azure AD administration portal | Setting this option to Yes prevents users from accessing Azure Active Directory through Azure portal only.
Ability to read other users | This setting is available in PowerShell only. Setting this to $false prevents all non-admins from reading user information from the directory. This does not prevent reading user information in other Microsoft services like Exchange Online. This setting is meant for special circumstances, and setting this to $false is not recommended.

## Object ownership

### Application registration owner permissions
When a user registers an application, they are automatically added as an owner for the application. As an owner, they can manage the metadata of the application, such as the name and permissions the app requests. They can also manage the tenant-specific configuration of the application, such as the SSO configuration and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can only manage applications they own.

<!-- ### Enterprise application owner permissions

When a user adds a new enterprise application, they are automatically added as an owner for the tenant-specific configuration of the application. As an owner, they can manage the tenant-specific configuration of the application, such as the SSO configuration, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the applications they own. <!--To assign an enterprise application owner, see *Assigning Owners for an Application*.-->

### Group owner permissions

When a user creates a group, they are automatically added as an owner for that group. As an owner, they can manage properties of the group such as the name, as well as manage group membership. An owner can also add or remove other owners. Unlike Global administrators and User administrators, owners can only manage groups they own. To assign a group owner, see [Managing owners for a group](active-directory-accessmanagement-managing-group-owners.md).

## Next steps

* To learn more about how to assign Azure AD administrator roles, see [Assign a user to administrator roles in Azure Active Directory](active-directory-users-assign-role-azure-portal.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../../role-based-access-control/rbac-and-directory-admin-roles.md)
* For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)
* [Manage users](add-users-azure-active-directory.md)
