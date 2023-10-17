---
title: Default user permissions
description: Learn about the user permissions available in Microsoft Entra ID.
services: active-directory
author: barclayn
manager: amycolannino

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 02/17/2023
ms.author: barclayn
ms.reviewer: vincesm
ms.custom: "it-pro, seodec18, contperf-fy21q1"
ms.collection: M365-identity-device-management
---
# What are the default user permissions in Microsoft Entra ID?

In Microsoft Entra ID, all users are granted a set of default permissions. A user's access consists of the type of user, their [role assignments](./how-subscriptions-associated-directory.md), and their ownership of individual objects. 

This article describes those default permissions and compares the member and guest user defaults. The default user permissions can be changed only in user settings in Microsoft Entra ID.

## Member and guest users

The set of default permissions depends on whether the user is a native member of the tenant (member user) or whether the user is brought over from another directory as a business-to-business (B2B) collaboration guest (guest user). For more information about adding guest users, see [What is Microsoft Entra B2B collaboration?](../external-identities/what-is-b2b.md). Here are the capabilities of the default permissions:

* *Member users* can register applications, manage their own profile photo and mobile phone number, change their own password, and invite B2B guests. These users can also read all directory information (with a few exceptions). 
* *Guest users* have restricted directory permissions. They can manage their own profile, change their own password, and retrieve some information about other users, groups, and apps. However, they can't read all directory information. 

  For example, guest users can't enumerate the list of all users, groups, and other directory objects. Guests can be added to administrator roles, which grant them full read and write permissions. Guests can also invite other guests.

## Compare member and guest default permissions

**Area** | **Member user permissions** | **Default guest user permissions** | **Restricted guest user permissions**
------------ | --------- | ---------- | ----------
Users and contacts | <ul><li>Enumerate the list of all users and contacts<li>Read all public properties of users and contacts</li><li>Invite guests<li>Change their own password<li>Manage their own mobile phone number<li>Manage their own photo<li>Invalidate their own refresh tokens</li></ul> | <ul><li>Read their own properties<li>Read display name, email, sign-in name, photo, user principal name, and user type properties of other users and contacts<li>Change their own password<li>Search for another user by object ID (if allowed)<li>Read manager and direct report information of other users</li></ul> | <ul><li>Read their own properties<li>Change their own password</li><li>Manage their own mobile phone number</li></ul>
Groups | <ul><li>Create security groups<li>Create Microsoft 365 groups<li>Enumerate the list of all groups<li>Read all properties of groups<li>Read non-hidden group memberships<li>Read hidden Microsoft 365 group memberships for joined groups<li>Manage properties, ownership, and membership of groups that the user owns<li>Add guests to owned groups<li>Manage dynamic membership settings<li>Delete owned groups<li>Restore owned Microsoft 365 groups</li></ul> | <ul><li>Read properties of non-hidden groups, including membership and ownership (even non-joined groups)<li>Read hidden Microsoft 365 group memberships for joined groups<li>Search for groups by display name or object ID (if allowed)</li></ul> | <ul><li>Read object ID for joined groups<li>Read membership and ownership of joined groups in some Microsoft 365 apps (if allowed)</li></ul>
Applications | <ul><li>Register (create) new applications<li>Enumerate the list of all applications<li>Read properties of registered and enterprise applications<li>Manage application properties, assignments, and credentials for owned applications<li>Create or delete application passwords for users<li>Delete owned applications<li>Restore owned applications<li>List permissions granted to applications</ul> | <ul><li>Read properties of registered and enterprise applications<li>List permissions granted to applications</ul> | <ul><li>Read properties of registered and enterprise applications</li><li>List permissions granted to applications</li></ul>
Devices</li></ul> | <ul><li>Enumerate the list of all devices<li>Read all properties of devices<li>Manage all properties of owned devices</li></ul> | No permissions | No permissions
Organization | <ul><li>Read all company information<li>Read all domains<li>Read configuration of certificate-based authentication<li>Read all partner contracts</li><li>Read multi-tenant organization basic details and active tenants</li></ul> | <ul><li>Read company display name<li>Read all domains<li>Read configuration of certificate-based authentication</li></ul> | <ul><li>Read company display name<li>Read all domains</li></ul>
Roles and scopes | <ul><li>Read all administrative roles and memberships<li>Read all properties and membership of administrative units</li></ul> | No permissions | No permissions
Subscriptions | <ul><li>Read all licensing subscriptions<li>Enable service plan memberships</li></ul> | No permissions | No permissions
Policies | <ul><li>Read all properties of policies<li>Manage all properties of owned policies</li></ul> | No permissions | No permissions

## Restrict member users' default permissions 

It's possible to add restrictions to users' default permissions.

You can restrict default permissions for member users in the following ways:

> [!CAUTION]
> Using the **Restrict access to Microsoft Entra administration portal** switch **is NOT a security measure**. For more information on the functionality, see the table below.

| Permission | Setting explanation |
| ---------- | ------------ |
| **Register applications** | Setting this option to **No** prevents users from creating application registrations. You can then grant the ability back to specific individuals, by adding them to the application developer role. |
| **Allow users to connect work or school account with LinkedIn** | Setting this option to **No** prevents users from connecting their work or school account with their LinkedIn account. For more information, see [LinkedIn account connections data sharing and consent](../enterprise-users/linkedin-user-consent.md). |
| **Create security groups** | Setting this option to **No** prevents users from creating security groups. Global Administrators and User Administrators can still create security groups. To learn how, see [Microsoft Entra cmdlets for configuring group settings](../enterprise-users/groups-settings-cmdlets.md). |
| **Create Microsoft 365 groups** | Setting this option to **No** prevents users from creating Microsoft 365 groups. Setting this option to **Some** allows a set of users to create Microsoft 365 groups. Global Administrators and User Administrators can still create Microsoft 365 groups. To learn how, see [Microsoft Entra cmdlets for configuring group settings](../enterprise-users/groups-settings-cmdlets.md). |
| **Restrict access to Microsoft Entra administration portal** | **What does this switch do?** <br>**No** lets non-administrators browse the Microsoft Entra administration portal. <br>**Yes** Restricts non-administrators from browsing the Microsoft Entra administration portal. Non-administrators who are owners of groups or applications are unable to use the Azure portal to manage their owned resources. </p><p></p><p>**What does it not do?** <br> It doesn't restrict access to Microsoft Entra data using PowerShell, Microsoft GraphAPI, or other clients such as Visual Studio. <br>It doesn't restrict access as long as a user is assigned a custom role (or any role). </p><p></p><p>**When should I use this switch?** <br>Use this option to prevent users from misconfiguring the resources that they own. </p><p></p><p>**When should I not use this switch?** <br>Don't use this switch as a security measure. Instead, create a Conditional Access policy that targets Microsoft Azure Management that blocks non-administrators access to [Microsoft Azure Management](../conditional-access/concept-conditional-access-cloud-apps.md#microsoft-azure-management). </p><p></p><p> **How do I grant only a specific non-administrator users the ability to use the Microsoft Entra administration portal?** <br> Set this option to **Yes**, then assign them a role like global reader. </p><p></p><p>**Restrict access to the Microsoft Entra administration portal** <br>A Conditional Access policy that targets Microsoft Azure Management targets access to all Azure management. |
| **Restrict non-admin users from creating tenants** | Users can create tenants in the Microsoft Entra ID and Microsoft Entra administration portal under Manage tenant. The creation of a tenant is recorded in the Audit log as category DirectoryManagement and activity Create Company. Anyone who creates a tenant becomes the Global Administrator of that tenant. The newly created tenant doesn't inherit any settings or configurations. </p><p></p><p>**What does this switch do?** <br> Setting this option to **Yes** restricts creation of Microsoft Entra tenants to the Global Administrator or tenant creator roles. Setting this option to **No** allows non-admin users to create Microsoft Entra tenants. Tenant create will continue to be recorded in the Audit log. </p><p></p><p>**How do I grant only a specific non-administrator users the ability to create new tenants?** <br> Set this option to Yes, then assign them the tenant creator role.|
| **Restrict users from recovering the BitLocker key(s) for their owned devices** | This setting can be found in the Microsoft Entra admin center in the Device Settings. Setting this option to **Yes** restricts users from being able to self-service recover BitLocker key(s) for their owned devices. Users will have to contact their organization's helpdesk to retrieve their BitLocker keys. Setting this option to **No** allows users to recover their BitLocker key(s). |
| **Read other users** | This setting is available in Microsoft Graph and PowerShell only. Setting this flag to `$false` prevents all non-admins from reading user information from the directory. This flag doesn't prevent reading user information in other Microsoft services like Exchange Online.</p><p>This setting is meant for special circumstances, so we don't recommend setting the flag to `$false`. |

The **Restrict non-admin users from creating tenants** option is shown [below](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/UserSettings)


:::image type="content" source="media/user-default-permissions/tenant-creation-restriction.png" alt-text="Screenshot showing the option to Restrict non-admins from creating tenants." lightbox="media/user-default-permissions/tenant-creation-restriction.png":::

## Restrict guest users' default permissions

You can restrict default permissions for guest users in the following ways.

>[!NOTE]
>The **Guest user access restrictions** setting replaced the **Guest users permissions are limited** setting. For guidance on using this feature, see [Restrict guest access permissions in Microsoft Entra ID](../enterprise-users/users-restrict-guest-permissions.md).

Permission | Setting explanation
---------- | ------------
**Guest user access restrictions** | Setting this option to **Guest users have the same access as members** grants all member user permissions to guest users by default.<p>Setting this option to **Guest user access is restricted to properties and memberships of their own directory objects** restricts guest access to only their own user profile by default. Access to other users is no longer allowed, even when they're searching by user principal name, object ID, or display name. Access to group information, including groups memberships, is also no longer allowed.<p>This setting doesn't prevent access to joined groups in some Microsoft 365 services like Microsoft Teams. To learn more, see [Microsoft Teams guest access](/MicrosoftTeams/guest-access).<p>Guest users can still be added to administrator roles regardless of this permission setting.
**Guests can invite** | Setting this option to **Yes** allows guests to invite other guests. To learn more, see [Configure external collaboration settings](../external-identities/external-collaboration-settings-configure.md).

## Object ownership

### Application registration owner permissions

When a user registers an application, they're automatically added as an owner for the application. As an owner, they can manage the metadata of the application, such as the name and permissions that the app requests. They can also manage the tenant-specific configuration of the application, such as the single sign-on (SSO) configuration and user assignments. 

An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the applications that they own.

### Enterprise application owner permissions

When a user adds a new enterprise application, they're automatically added as an owner. As an owner, they can manage the tenant-specific configuration of the application, such as the SSO configuration, provisioning, and user assignments. 

An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the applications that they own.

### Group owner permissions

When a user creates a group, they're automatically added as an owner for that group. As an owner, they can manage properties of the group (such as the name) and manage group membership. 

An owner can also add or remove other owners. Unlike Global Administrators and User Administrators, owners can manage only the groups that they own. 

To assign a group owner, see [Managing owners for a group](./how-to-manage-groups.md).

### Ownership permissions

The following tables describe the specific permissions in Microsoft Entra ID that member users have over owned objects. Users have these permissions only on objects that they own.

#### Owned application registrations

Users can perform the following actions on owned application registrations:

| **Action** | **Description** |
| --- | --- |
| microsoft.directory/applications/audience/update | Update the `applications.audience` property in Microsoft Entra ID. |
| microsoft.directory/applications/authentication/update | Update the `applications.authentication` property in Microsoft Entra ID. |
| microsoft.directory/applications/basic/update | Update basic properties on applications in Microsoft Entra ID. |
| microsoft.directory/applications/credentials/update | Update the `applications.credentials` property in Microsoft Entra ID. |
| microsoft.directory/applications/delete | Delete applications in Microsoft Entra ID. |
| microsoft.directory/applications/owners/update | Update the `applications.owners` property in Microsoft Entra ID. |
| microsoft.directory/applications/permissions/update | Update the `applications.permissions` property in Microsoft Entra ID. |
| microsoft.directory/applications/policies/update | Update the `applications.policies` property in Microsoft Entra ID. |
| microsoft.directory/applications/restore | Restore applications in Microsoft Entra ID. |

#### Owned enterprise applications

Users can perform the following actions on owned enterprise applications. An enterprise application consists of a service principal, one or more application policies, and sometimes an application object in the same tenant as the service principal.

| **Action** | **Description** |
| --- | --- |
| microsoft.directory/auditLogs/allProperties/read | Read all properties (including privileged properties) on audit logs in Microsoft Entra ID. |
| microsoft.directory/policies/basic/update | Update basic properties on policies in Microsoft Entra ID. |
| microsoft.directory/policies/delete | Delete policies in Microsoft Entra ID. |
| microsoft.directory/policies/owners/update | Update the `policies.owners` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/appRoleAssignedTo/update | Update the `servicePrincipals.appRoleAssignedTo` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/appRoleAssignments/update | Update the `users.appRoleAssignments` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/audience/update | Update the `servicePrincipals.audience` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/authentication/update | Update the `servicePrincipals.authentication` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/basic/update | Update basic properties on service principals in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/credentials/update | Update the `servicePrincipals.credentials` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/delete | Delete service principals in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/owners/update | Update the `servicePrincipals.owners` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/permissions/update | Update the `servicePrincipals.permissions` property in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/policies/update | Update the `servicePrincipals.policies` property in Microsoft Entra ID. |
| microsoft.directory/signInReports/allProperties/read | Read all properties (including privileged properties) on sign-in reports in Microsoft Entra ID. |
| microsoft.directory/servicePrincipals/synchronizationCredentials/manage |	Manage application provisioning secrets and credentials |
| microsoft.directory/servicePrincipals/synchronizationJobs/manage |	Start, restart, and pause application provisioning synchronization jobs |
| microsoft.directory/servicePrincipals/synchronizationSchema/manage |	Create and manage application provisioning synchronization jobs and schema |
| microsoft.directory/servicePrincipals/synchronization/standard/read |	Read provisioning settings associated with your service principal |

#### Owned devices

Users can perform the following actions on owned devices:

| **Action** | **Description** |
| --- | --- |
| microsoft.directory/devices/bitLockerRecoveryKeys/read | Read the `devices.bitLockerRecoveryKeys` property in Microsoft Entra ID. |
| microsoft.directory/devices/disable | Disable devices in Microsoft Entra ID. |

#### Owned groups

Users can perform the following actions on owned groups.

> [!NOTE]
> Owners of dynamic groups must have a Global Administrator, Group Administrator, Intune Administrator, or User Administrator role to edit group membership rules. For more information, see [Create or update a dynamic group in Microsoft Entra ID](../enterprise-users/groups-create-rule.md).

| **Action** | **Description** |
| --- | --- |
| microsoft.directory/groups/appRoleAssignments/update | Update the `groups.appRoleAssignments` property in Microsoft Entra ID. |
| microsoft.directory/groups/basic/update | Update basic properties on groups in Microsoft Entra ID. |
| microsoft.directory/groups/delete | Delete groups in Microsoft Entra ID. |
| microsoft.directory/groups/members/update | Update the `groups.members` property in Microsoft Entra ID. |
| microsoft.directory/groups/owners/update | Update the `groups.owners` property in Microsoft Entra ID. |
| microsoft.directory/groups/restore | Restore groups in Microsoft Entra ID. |
| microsoft.directory/groups/settings/update | Update the `groups.settings` property in Microsoft Entra ID. |

## Next steps

* To learn more about the **Guest user access restrictions** setting, see [Restrict guest access permissions in Microsoft Entra ID](../enterprise-users/users-restrict-guest-permissions.md).
* To learn more about how to assign Microsoft Entra administrator roles, see [Assign a user to administrator roles in Microsoft Entra ID](./how-subscriptions-associated-directory.md).
* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../../role-based-access-control/rbac-and-directory-admin-roles.md).
* For more information on how Microsoft Entra ID relates to your Azure subscription, see [How Azure subscriptions are associated with Microsoft Entra ID](./how-subscriptions-associated-directory.md).
* [Manage users](./add-users.md).
