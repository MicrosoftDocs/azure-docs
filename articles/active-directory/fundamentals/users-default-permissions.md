---
title: Default user permissions - Azure Active Directory | Microsoft Docs
description: Learn about the user permissions available in Azure Active Directory.
services: active-directory
author: ajburnle
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 08/04/2021
ms.author: ajburnle
ms.reviewer: vincesm
ms.custom: "it-pro, seodec18, contperf-fy21q1"
ms.collection: M365-identity-device-management
---

# What are the default user permissions in Azure Active Directory?
In Azure Active Directory (Azure AD), all users are granted a set of default permissions. A user's access consists of the type of user, their [role assignments](active-directory-users-assign-role-azure-portal.md), and their ownership of individual objects. 

This article describes those default permissions and contains a comparison of the member and guest user defaults. The default user permissions can be changed only in user settings in Azure AD.

## Member and guest users
The set of default permissions depends on whether the user is a native member of the tenant (member user) or if the user is brought over from another directory as a business-to-business (B2B) collaboration guest (guest user). For more information about adding guest users, see [What is Azure AD B2B collaboration?](../external-identities/what-is-b2b.md). Here are the capabilities of the default permissions:

* *Member users* can register applications, manage their own profile photo and mobile phone number, change their own password, and invite B2B guests. These users can also read all directory information (with a few exceptions). 
* *Guest users* have restricted directory permissions. They can manage their own profile, change their own password, and retrieve some information about other users, groups and apps. However, they can't read all directory information. 

  For example, guest users can't enumerate the list of all users, groups, and other directory objects. Guests can be added to administrator roles, which grant them full read and write permissions. Guests can also invite other guests.

## Compare member and guest default permissions

**Area** | **Member user permissions** | **Default guest user permissions** | **Restricted guest user permissions**
------------ | --------- | ---------- | ----------
Users and contacts | <ul><li>Enumerate the list of all users and contacts<li>Read all public properties of users and contacts</li><li>Invite guests<li>Change own password<li>Manage own mobile phone number<li>Manage own photo<li>Invalidate own refresh tokens</li></ul> | <ul><li>Read own properties<li>Read display name, email, sign-in name, photo, user principal name, and user type properties of other users and contacts<li>Change own password<li>Search for another user by object ID (if allowed)<li>Read manager and direct report information of other users</li></ul> | <ul><li>Read own properties<li>Change own password</li><li>Manage own mobile phone number</li></ul>
Groups | <ul><li>Create security groups<li>Create Microsoft 365 groups<li>Enumerate the list of all groups<li>Read all properties of groups<li>Read non-hidden group memberships<li>Read hidden Microsoft 365 group memberships for joined groups<li>Manage properties, ownership, and membership of groups that the user owns<li>Add guests to owned groups<li>Manage dynamic membership settings<li>Delete owned groups<li>Restore owned Microsoft 365 groups</li></ul> | <ul><li>Read properties of non-hidden groups, including membership and ownership (even non-joined groups)<li>Read hidden Microsoft 365 group memberships for joined groups<li>Search for groups by display name or object ID (if allowed)</li></ul> | <ul><li>Read object ID for joined groups<li>Read membership and ownership of joined groups in some Microsoft 365 apps (if allowed)</li></ul>
Applications | <ul><li>Register (create) new applications<li>Enumerate the list of all applications<li>Read properties of registered and enterprise applications<li>Manage application properties, assignments, and credentials for owned applications<li>Create or delete application passwords for users<li>Delete owned applications<li>Restore owned applications</li></ul> | <ul><li>Read properties of registered and enterprise applications</li></ul> | <ul><li>Read properties of registered and enterprise applications
Devices</li></ul> | <ul><li>Enumerate the list of all devices<li>Read all properties of devices<li>Manage all properties of owned devices</li></ul> | No permissions | No permissions
Directory | <ul><li>Read all company information<li>Read all domains<li>Read all partner contracts</li></ul> | <ul><li>Read company display name<li>Read all domains</li></ul> | <ul><li>Read company display name<li>Read all domains</li></ul>
Roles and Scopes | <ul><li>Read all administrative roles and memberships<li>Read all properties and membership of administrative units</li></ul> | No permissions | No permissions
Subscriptions | <ul><li>Read all subscriptions<li>Enable service plan memberships</li></ul> | No permissions | No permissions
Policies | <ul><li>Read all properties of policies<li>Manage all properties of owned policies</li></ul> | No permissions | No permissions

## Restrict member users' default permissions 

It's possible to add restrictions to users' default permissions. Some organizations might have a need to restrict users' access to the portal. You can use this feature if you don't want all users in the directory to have access to the Azure AD admin portal/directory. 

For example, a university has many users in its directory. The admin might not want all of the students in the directory to be able to see the full directory and violate other students' privacy. The use of this feature is optional and at the discretion of the Azure AD administrator. You can restrict default permissions for member users in the following ways:

Permission | Setting explanation
---------- | ------------
Register applications | Setting this option to **No** prevents users from creating application registrations. You can the grant the ability back to specific individuals by adding them to the Application Developer role.
Allow users to connect work or school account with LinkedIn | Setting this option to **No** prevents users from connecting their work or school account with their LinkedIn account. For more information, see [LinkedIn account connections data sharing and consent](../enterprise-users/linkedin-user-consent.md).
Create security groups | Setting this option to **No** prevents users from creating security groups. Global administrators and user administrators can still create security groups. To learn how, see [Azure Active Directory cmdlets for configuring group settings](../enterprise-users/groups-settings-cmdlets.md).
Create Microsoft 365 groups | Setting this option to **No** prevents users from creating Microsoft 365 groups. Setting this option to **Some** allows a select set of users to create Microsoft 365 groups. Global administrators and user administrators can still create Microsoft 365 groups. To learn how, see [Azure Active Directory cmdlets for configuring group settings](../enterprise-users/groups-settings-cmdlets.md).
Access the Azure AD administration portal | <p>Setting this option to **No** lets non-administrators use the Azure AD administration portal to read and manage Azure AD resources. **Yes** restricts all non-administrators from accessing any Azure AD data in the administration portal.</p><p>This setting does not restrict access to Azure AD data by using PowerShell or other clients such as Visual Studio. When you set this option to **Yes** to grant a specific non-admin user the ability to use the Azure AD administration portal, assign any administrative role such as the Directory Readers role.</p><p>This settings blocks non-admin users who are owners of groups or applications from using the Azure portal to manage their owned resources.</p><p>This role allows reading basic directory information, which member users have by default. (Guests and service principals don't).</p><p>This setting does not restrict access as long as a user is assigned a custom role (or any role) and is not just a user.</p>
Read other users | This setting is available in Microsoft Graph and PowerShell only. Setting this flag to `$false` prevents all non-admins from reading user information from the directory. This flag does not prevent reading user information in other Microsoft services like Exchange Online. This setting is meant for special circumstances, so we don't recommend setting the flag to `$false`.

>[!NOTE]
>It's assumed that the average user would only use the portal to access Azure AD, and not use PowerShell or the Azure CLI to access their resources. Currently, restricting access to users' default permissions only occurs when the user tries to access the directory within the Azure portal.

## Restrict guest users' default permissions

You an restrict default permissions for guest users in the following ways:

>[!NOTE]
>The guest user access restrictions setting replaced the **Guest users permissions are limited** setting. For guidance on using this feature, see [Restrict guest access permissions in Azure Active Directory](../enterprise-users/users-restrict-guest-permissions.md).

Permission | Setting explanation
---------- | ------------
Guest user access restrictions | Setting this option to **Guest users have the same access as members** grants all member user permissions to guest users by default.<p>Setting this option to **Guest user access is restricted to properties and memberships of their own directory objects** restricts guest access to only their own user profile by default. Access to other users are no longer allowed even when searching by user principal name, object ID, or display name. Access to groups information including groups memberships is also no longer allowed.<p>This setting does not prevent access to joined groups in some Microsoft 365 services like Microsoft Teams. To learn more, see [Microsoft Teams Guest access](/MicrosoftTeams/guest-access).<p>Guest users can still be added to administrator roles regardless of this permission settings.
Guests can invite | Setting this option to **Yes** allows guests to invite other guests. See [Delegate invitations for B2B collaboration](../external-identities/delegate-invitations.md#configure-b2b-external-collaboration-settings) to learn more.
Members can invite | Setting this option to **Yes** allows non-admin members of your directory to invite guests. See [Delegate invitations for B2B collaboration](../external-identities/delegate-invitations.md#configure-b2b-external-collaboration-settings) to learn more.
Admins and users in the guest inviter role can invite | Setting this option to **Yes** allows admins and users in the "Guest Inviter" role to invite guests. When set to **Yes**, users in the Guest inviter role will still be able to invite guests, regardless of the Members can invite setting. See [Delegate invitations for B2B collaboration](../external-identities/delegate-invitations.md#assign-the-guest-inviter-role-to-a-user) to learn more.

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

> [!NOTE]
> Owners of dynamic groups must have a Global administrator, Group administrator, Intune administrator, or User administrator role to edit group membership rules. For more information, see [Create or update a dynamic group in Azure Active Directory](../enterprise-users/groups-create-rule.md).

| **Actions** | **Description** |
| --- | --- |
| microsoft.directory/groups/appRoleAssignments/update | Update groups.appRoleAssignments property in Azure Active Directory. |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Azure Active Directory. |
| microsoft.directory/groups/delete | Delete groups in Azure Active Directory. |
| microsoft.directory/groups/members/update | Update groups.members property in Azure Active Directory. |
| microsoft.directory/groups/owners/update | Update groups.owners property in Azure Active Directory. |
| microsoft.directory/groups/restore | Restore groups in Azure Active Directory. |
| microsoft.directory/groups/settings/update | Update groups.settings property in Azure Active Directory. |

## Next steps

* To learn more about the guest user access restrictions setting, see [Restrict guest access permissions in Azure Active Directory](../enterprise-users/users-restrict-guest-permissions.md).
* To learn more about how to assign Azure AD administrator roles, see [Assign a user to administrator roles in Azure Active Directory](active-directory-users-assign-role-azure-portal.md).
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../../role-based-access-control/rbac-and-directory-admin-roles.md).
* For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md).
* [Manage users](add-users-azure-active-directory.md).
