---

title: Compare default user permissions in Azure Active Directory | Microsoft Docs
description: Compare member, guest, app owner, and group owner permissions
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: article
ms.date: 01/18/2018
ms.author: curtand
ms.reviewer: vincesm

---

# Default user permissions in Azure Active Directory

In Azure Active Directory (Azure AD), all users are granted a set of default permissions. A user’s access consists the type of user, their [role
memberships](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-users-assign-role-azure-portal), and their ownership of individual objects. This article describes those default permissions and contains a comparison of the member and guest user defaults.

## Member and guest users
The set of default permissions received depends on if the user is a native member of the tenant (member user) or if the user is a B2B collaboration guest (guest user). For more information about B2B collaboration, see [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md) for more information about guest users). 
* Member users can register applications, manage their own profile photo and mobile phone number, change their own password, and invite B2B guests. In addition, users can read all directory information (with a few exceptions). 
* Azure AD B2B guest users have restricted directory permissions. For example, guest users cannot browse information from the tenant beyond their own profile information. However, a guest user can retrieve information about another user by providing the User Principal Name or objectId. A guest cannot view any information about other tenant objects such as groups and applications.

Default permissions for guests are restrictive by default. Guests can be added to administrator roles, which grant them full read and write permissions contained in the role. There is one additional restriction available, the ability for guests to invite other guests. Setting **Guests can invite** to **No** prevents guests from inviting other guests. See [Delegate invitations for B2B collaboration](active-directory-b2b-delegate-invitations.md) to learn how. To grant guest users the same permissions as member users by default, set **Guest users permissions are limited** to **No**. This setting grants all member user permissions to guest users by default, as well as to allow guests to be added to administrative roles.

## Compare member and guest default permissions

**Area** | **Member user permissions** | **Guest user permissions**
------------ | --------- | ----------
Users and contacts | Read all public properties of users and contacts<br>Invite guests<br>Change own password<br>Manage own mobile phone number<br>Manage own photo<br>Invalidate own refresh tokens | Read own properties<br>Read display name, email, sign-in name, photo, user principal name, and user type properties of other users and contacts<br>Change own password
Groups   | Create security groups<br>Create Office 365 groups<br>Read all properties of groups<br>Read non-hidden group memberships<br>Read hidden Office 365 group memberships for joined group<br>Manage properties, ownership, and membership of owned groups<br>Add guests to owned groups<br>Manage dynamic membership settings<br>Delete owned groups<br>Restore owned Office 365 groups | Read all properties of groups<br>Read non-hidden group memberships<br>Read hidden Office 365 group memberships for joined groups<br>Manage owned groups<br>Add guests to owned groups (if allowed)<br>Delete owned groups<br>Restore owned Office 365 groups           
Applications | Register (create) new application<br>Read properties of registered and enterprise applications<br>Manage application properties, assignments, and credentials for owned applications<br>Create or delete application password for user<br>Delete owned applications<br>Restore owned applications | Read properties of registered and enterprise applications<br>Manage application properties, assignments, and credentials for owned applications<br>Delete owned applications<br>Restore owned applications
Devices | Read all properties of devices<br>Manage all properties of owned devices<br> | No permissions<br>Delete owned devices<br>
Directory | Read all company information<br>Read all domains<br>Read all partner contracts | Read display name and verified domains
Roles and Scopes | Read all administrative roles and memberships<br>Read all properties and membership of administrative units | No permissions              
Subscriptions | Read all subscriptions<br>Enable Service Plan Member | No permissions
Policies | Read all properties of policies<br>Manage all properties of owned policy | No permissions

## To restrict the default permissions for member users


Default permissions for member users can be restricted in the following ways:

Permission | Setting explanation
---------- | ------------
Ability to create security groups | Setting this option to No prevents users from creating security groups. Global Administrators and User Account Administrators can still create security groups. See Configuring Group Settings to learn how.
Ability to create Office 365 groups | Setting this option to No prevents users from creating Office 365 groups. Setting this option to Some allows a select set of users to create Office 365 groups. Global Administrators and User Account Administrators will still be able to create Office 365 groups. See Configuring Group Settings to learn how.
Ability to consent to applications | Setting this option to No prevents users from consenting to applications. Global Administrators will still be able to consent to applications. See Configuring Default Permissions for Member Users.
Ability to add gallery apps to Access Panel | Setting this option to No prevents users from adding gallery apps to their Access Panel. See Configuring Default Permissions for Member Users.
Ability to register (create) applications | Setting this option to No prevents non-admins from creating applications. Global Administrators will still be able to create applications. See Configuring Default Permissions for Member Users.
Admins and users in the guest inviter role can invite guests | Setting this option to No prevents all users from inviting guests. See Configuring Default Permissions for Member Users.
Members can invite guests | Setting this to no prevents users from inviting guests. Global Administrators, User Account Administrators, and Guest Inviters will still be able to invite guests. See Configuring Default Permissions for Member Users.
Restrict access to Azure AD administration portal | Setting this option to No prevents users from accessing the Azure Active Directory portal.
Ability to read other users | See Configuring Default Permissions for Member Users.

## Application owner permissions

### Application Developer Owner
When a user registers an application, they are automatically added as an owner for the application. As an owner, they can manage the metadata of the application, such as the name and permissions the app requests. They can also manage the tenant-specific configuration of the application, such as the SSO configuration and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can only manage applications they own.

### How to assign an application registration owner

See *Assigning Owners for an Application Registration*.

### Application Configuration Owner

When a user adds a new enterprise application, they are automatically added as an owner for the tenant-specific configuration of the application. As an owner, they can manage the tenant-specific configuration of the application, such as the SSO configuration, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the applications they own.

### How to assign an enterprise application owner

See *Assigning Owners for an Application*.

## Group owner permissions

When a user creates a group, they are automatically added as an owner for that group. As an owner, they can manage properties of the group such as the name, as well as manage membership. An owner can also add or remove other owners. Unlike Global Administrators and User Account Administrators, owners can only manage groups they own.

### How to assign a group owner

See [Managing Owners for a Group](active-directory-accessmanagement-managing-group-owners.md).
