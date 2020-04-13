---
title: Default user permissions - Azure Active Directory | Microsoft Docs
description: Learn about the different user permissions available in Azure Active Directory.
services: active-directory
author: msaburnley
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 02/16/2019
ms.author: ajburnle
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
Users and contacts | Read all public properties of users and contacts<br>Invite guests<br>Change own password<br>Manage own mobile phone number<br>Manage own photo<br>Invalidate own refresh tokens | Read own properties<br>Read display name, email, sign in name, photo, user principal name, and user type properties of other users and contacts<br>Change own password
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
Allow users to connect work or school account with LinkedIn | Setting this option to No prevents users from connecting their work or school account with their LinkedIn account. For more information, see [LinkedIn account connections data sharing and consent](https://docs.microsoft.com/azure/active-directory/users-groups-roles/linkedin-user-consent).
Ability to create security groups | Setting this option to No prevents users from creating security groups. Global administrators and User administrators can still create security groups. See [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md) to learn how.
Ability to create Office 365 groups | Setting this option to No prevents users from creating Office 365 groups. Setting this option to Some allows a select set of users to create Office 365 groups. Global administrators and User administrators will still be able to create Office 365 groups. See [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md) to learn how.
Restrict access to Azure AD administration portal | Setting this option to No lets non-administrators use the Azure AD administration portal to read and manage Azure AD resources. Yes restricts all non-administrators from accessing any Azure AD data in the administration portal. Important to note: this setting does not restrict access to Azure AD data using PowerShell or other clients such as Visual Studio. When set to Yes, to grant a specific non-admin user the ability to use the Azure AD administration portal assign any administrative role such as the Directory Readers role. This role allows reading basic directory information, which member users have by default (guests and service principals do not).
Ability to read other users | This setting is available in PowerShell only. Setting this flag to $false prevents all non-admins from reading user information from the directory. This flag does not prevent reading user information in other Microsoft services like Exchange Online. This setting is meant for special circumstances, and setting this flag to $false is not recommended.

## Object ownership

### Application registration owner permissions
When a user registers an application, they are automatically added as an owner for the application. As an owner, they can manage the metadata of the application, such as the name and permissions the app requests. They can also manage the tenant-specific configuration of the application, such as the SSO configuration and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can only manage applications they own.

### Enterprise application owner permissions
When a user adds a new enterprise application, they are automatically added as an owner. As an owner, they can manage the tenant-specific configuration of the application, such as the SSO configuration, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the applications they own.

### Group owner permissions
When a user creates a group, they are automatically added as an owner for that group. As an owner, they can manage properties of the group such as the name, as well as manage group membership. An owner can also add or remove other owners. Unlike Global administrators and User administrators, owners can only manage groups they own. To assign a group owner, see [Managing owners for a group](active-directory-accessmanagement-managing-group-owners.md).

### Ownership Permissions
The following tables describe the specific permissions in Azure Active Directory member users have over owned objects. The user only has these permissions on objects they own.

#### Owned application registrations
Users can perform the following actions on owned application registrations.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/applications/audience/update | Update applications.audience property in Azure Active Directory. |
| microsoft.directory/applications/authentication/update | Update applications.authentication property in Azure Active Directory. |
| microsoft.directory/applications/basic/update | Update basic properties on applications in Azure Active Directory. |
| microsoft.directory/applications/credentials/update | Update applications.credentials property in Azure Active Directory. |
| microsoft.directory/applications/delete | Delete applications in Azure Active Directory. |
| microsoft.directory/applications/owners/update | Update applications.owners property in Azure Active Directory. |
| microsoft.directory/applications/permissions/update | Update applications.permissions property in Azure Active Directory. |
| microsoft.directory/applications/policies/update | Update applications.policies property in Azure Active Directory. |
| microsoft.directory/applications/restore | Restore applications in Azure Active Directory. |

#### Owned enterprise applications
Users can perform the following actions on owned enterprise applications. An enterprise application is made up of service principal, one or more application policies, and sometimes an application object in the same tenant as the service principal.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on auditLogs in Azure Active Directory. |
| microsoft.directory/policies/basic/update | Update basic properties on policies in Azure Active Directory. |
| microsoft.directory/policies/delete | Delete policies in Azure Active Directory. |
| microsoft.directory/policies/owners/update | Update policies.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update servicePrincipals.appRoleAssignedTo property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/appRoleAssignments/update | Update users.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/audience/update | Update servicePrincipals.audience property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/authentication/update | Update servicePrincipals.authentication property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/basic/update | Update basic properties on servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/credentials/update | Update servicePrincipals.credentials property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/delete | Delete servicePrincipals in Azure Active Directory. |
| microsoft.directory/servicePrincipals/owners/update | Update servicePrincipals.owners property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/permissions/update | Update servicePrincipals.permissions property in Azure Active Directory. |
| microsoft.directory/servicePrincipals/policies/update | Update servicePrincipals.policies property in Azure Active Directory. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on signInReports in Azure Active Directory. |

#### Owned devices
Users can perform the following actions on owned devices.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read devices.bitLockerRecoveryKeys property in Azure Active Directory. |
| microsoft.directory/devices/disable | Disable devices in Azure Active Directory. |

#### Owned groups
Users can perform the following actions on owned groups.

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.directory/groups/dynamicMembershipRule/update | Update groups.dynamicMembershipRule property in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |

## Next steps

* To learn more about how to assign Azure AD administrator roles, see [Assign a user to administrator roles in Azure Active Directory](active-directory-users-assign-role-azure-portal.md)
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../../role-based-access-control/rbac-and-directory-admin-roles.md)
* For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)
* [Manage users](add-users-azure-active-directory.md)
