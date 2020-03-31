---
title: Administrative unit scope for roles (preview) - Azure Active Directory | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 03/31/2020
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---
# Administrative unit scope for roles in Azure Active Directory (preview)

This article tells you about what's available in Administrative Units public preview in Azure Active Directory (Azure AD). We cover the basic tasks for setting up and using administrative units to restrict the scope of Azure AD role assignments.

Administrative units allow you to grant admin permissions that are restricted to a department, region, or other segment of your organization that you define. For example, delegating to regional support specialists the [Helpdesk Administrator](directory-assign-admin-roles.md#helpdesk-administrator) role restricted to managing just the users in the region they support.

Restricting administrative scope via administrative units can be useful in organizations with independent divisions. Consider the example of a large university that is made up of many autonomous schools (School of Business, School of Engineering, and so on) that each has their own IT administrators who control access, manage users, and set policies for their school. A central administrator could create an administrative unit for the School of Business and populate it with only the business school students and staff. Then the central administrator can add the Business school IT staff to a scoped role that grants administrative permissions over only Azure AD users in the business school administrative unit.

In addition to this article, you can also refer to the following:

- [Working with Admin Units](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0): How to work with administrative units using PowerShell
- [Administrative Unit Graph support](https://docs.microsoft.com/graph/api/resources/administrativeunit?view=graph-rest-beta): Detailed documentation on Graph APIs available for administrative units.

[Create and manage Administrative units in Azure AD](https://ms.portal.azure.com/?microsoft_aad_iam_adminunitprivatepreview=true&microsoft_aad_iam_rbacv2=true#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AdminUnit) at no additional charge as part of Azure Active Directory (Azure AD). Using administrative units to restrict the scope of Azure AD role assignments requires Azure AD Premium 1 licenses for administrators and Azure Active Directory Basic licenses for administrative unit members.

## Roles available

Role  |  Description
----- |  -----------
Authentication Administrator  |  Has access to view, set, and reset authentication method information for any non-admin user in the assigned administrative unit only.
Groups Administrator  |  Can manage all aspects of groups and groups settings like naming and expiration policies in the assigned administrative unit only.
Helpdesk Administrator  |  Can reset passwords for non-administrators and Helpdesk administrators in the assigned administrative unit only.
License Administrator  |  Can assign, remove and update license assignments within the administrative unit only.
Password Administrator  |  Can reset passwords for non-administrators and Password Administrators within the assigned administrative unit only.
User Administrator  |  Can manage all aspects of users and groups, including resetting passwords for limited admins within the assigned administrative unit only.

## Currently supported functions

Global administrators or Privileged Role Administrators can use the Azure AD portal to create administrative units, add users as members of administrative units, and then assign IT staff to administrative unit-scoped administrator roles. The administrative unit-scoped admins can then use the Office 365 portal for basic management of users in their administrative units.

Additionally, groups can be added as members of administrative unit, and an admin unit-scoped group administrator can manage them using PowerShell, the Microsoft Graph, and the Azure AD portal.

The below table describes current support for administrative unit scenarios.

### Administrative unit management

Permissions | MS Graph API/PowerShell | Azure AD Portal | M365 Admin Center
----------- | ----------------------- | --------------- | -----------------
Creating and deleting administrative units   |    Supported    |   Supported   |    No plan to support
Adding and removing administrative unit members individually    |   Supported    |   Supported   |    No plan to support
Bulk adding and removing administrative unit members using .csv file   |    Not supported     |  Supported   |    No plan to support
Assigning administrative unit-scoped administrators  |     Supported    |   Supported    |   No plan to support
Adding and removing administrative unit members dynamically based on attributes   |    Future improvement     |  Future improvement    |   No plan to support

### User management

Permissions | MS Graph API/PowerShell | Azure AD Portal | M365 Admin Center
----------- | ----------------------- | --------------- | -----------------
administrative unit-scoped management of user properties, passwords, licenses   |    Supported     |  Supported   |   Supported
administrative unit-scoped blocking and unblocking of user sign-ins    |   Supported   |    Supported   |    Supported
administrative unit-scoped management of user MFA credentials   |    Supported   |   Supported   |   Future improvement
administrative unit-scoped viewing of user sign-in reports    |   Future improvement   |   Future improvement   |   Future improvement
administrative unit-scoped creating and deleting users    |   Future improvement   |    Future improvement    |   Future improvement

### Group management

Permissions | MS Graph API/PowerShell | Azure AD Portal | M365 Admin Center
----------- | ----------------------- | --------------- | -----------------
administrative unit-scoped management of group properties and members     |  Supported   |    Supported    |  Future improvement
administrative unit-scoped management of group licensing   |    Supported  |    Supported   |   Future improvement
administrative unit-scoped creating and deleting groups    |   Future improvement    |   Future improvement   |    Future improvement

### Additional areas

Permissions | MS Graph API/PowerShell | Azure AD Portal | M365 Admin Center
----------- | ----------------------- | --------------- | -----------------
administrative unit-scoped device management   |    Future improvement    |   Future improvement   |    Future improvement
administrative unit-scoped application management   |    Future improvement    |   Future improvement   |    Future improvement

Administrative units apply scope only to management permissions. They do not prevent members or administrators from using their [default user permissions](../fundamentals/users-default-permissions.md) to browse other users, groups, or resources outside of the administrative unit. In the Office 365 portal, users outside of an administrative unit-scoped admin's administrative units are filtered out, but you can browse other users in the Azure AD portal, PowerShell, and other Microsoft services.

## Getting started

1. To run queries from the following instructions via [Graph Explorer](https://aka.ms/ge), please ensure the following:

    1. Go to Azure AD in the portal, and then in the applications select Graph Explorer and provide admin consent to Graph Explorer.

        ![select Graph Explorer and provide admin consent on this page](./media/roles-administrative-units-scope/select-graph-explorer.png)

    1. In the Graph Explorer, ensure that you select the beta version.

        ![select the beta version before the POST operation](./media/roles-administrative-units-scope/select-beta-version.png)

1. Please use the preview version of Azure AD PowerShell. Detailed instructions are here.
`
## Frequently asked questions

**Why are Administrative Units necessary? Couldn't we have used Security Groups as the way to define a scope?**
Security Groups have an existing purpose and authorization model. A User Administrator, for example, can manage membership of all Security Groups in the directory. That is because is it reasonable that a User Administrator can manage access to applications like Salesforce. A User Administrator should not have the ability to manage the delegation model itself, which would be the result if Security Groups were extended to support 'resource grouping' scenarios. Administrative Units, like Organizational Units in Windows Server Active Directory, are intended to provide a way to scope administration of a wide range of directory objects. Security Groups themselves can be members of resource scopes. Using Security Groups to define the set of Security Groups an administrator can manage would get very confusing.

**What does it mean to add a Group to an Administrative Unit?**
Adding a group to an administrative unit brings the group itself into the management scope of any administrative unit-scoped User Administrators. User Administrators for the administrative unit can manage the name and membership of the group itself. It does not grant the User Administrator for the administrative unit any permission to manage the users of the group (e.g. reset their passwords). To grant the User Administrator the ability to manage users, the users have to be direct members of the administrative unit.

**Can a resource (user, group, etc.) be a member of more than one Administrative Unit?**
Yes, a resource can be a member of more than one administrative unit. The resource can be managed by all tenant and administrative unit-scoped admins who have permissions over the resource.

**Are nested Administrative Units supported?**
Nesting administrative units is not supported.

**Are Administrative Units supported in PowerShell and Graph API?**
Yes. Support for Administrative Units exists in [PowerShell cmdlet documentation](https://docs.microsoft.com/powershell/module/Azuread/?view=azureadps-2.0-preview) and [sample scripts](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0-preview), and support is in the Microsoft Graph for the [administrativeUnit resource type](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/administrativeunit).

## Next steps

[Azure Active Directory license plans](../fundamentals/active-directory-whatis.md)
