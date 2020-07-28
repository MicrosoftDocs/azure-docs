---
title: Administrative units management (preview) - Azure AD | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: overview
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 04/16/2020
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---
# Administrative units management in Azure Active Directory (preview)

This article describes administrative units in Azure Active Directory (Azure AD). An administrative unit is an Azure AD resource that can be a container for other Azure AD resources. In this preview release, an administrative unit can contain only users and groups.

Administrative units allow you to grant admin permissions that are restricted to a department, region, or other segment of your organization that you define. You can use administrative units to delegate permissions to regional administrators or to set policy at a granular level. For example, a User account admin could update profile information, reset passwords, and assign licenses for users only in their administrative unit.

 For example, delegating to regional support specialists the [Helpdesk Administrator](directory-assign-admin-roles.md#helpdesk-administrator) role restricted to managing just the users in the region they support.

## Deployment scenario

Restricting administrative scope using administrative units can be useful in organizations that are made up of independent divisions of any kind. Consider the example of a large university that is made up of many autonomous schools (School of Business, School of Engineering, and so on) that each has a team of IT admins who control access, manage users, and set policies for their school. A central administrator could:

- Create a role with administrative permissions over only Azure AD users in the business school administrative unit
- Create an administrative unit for the School of Business
- Populate the admin unit with only the business school students and staff
- Add the Business school IT team to the role with their scope

## License requirements

Using administrative units requires an Azure Active Directory Premium license for each administrative unit admin, and Azure Active Directory Free licenses for administrative unit members. For more information, see [Getting started with Azure AD Premium](../fundamentals/active-directory-get-started-premium.md).

## Manage administrative units

In this preview release, you can manage administrative units using the Azure portal, PowerShell cmdlets and scripts, or the Microsoft Graph. You can refer to our documentation for details:

- [Create, remove, populate, and add roles to administrative units](roles-admin-units-manage.md): Complete how-to procedures
- [Working with Admin Units](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0): How to work with administrative units using PowerShell
- [Administrative Unit Graph support](https://docs.microsoft.com/graph/api/resources/administrativeunit?view=graph-rest-beta): Detailed documentation on Microsoft Graph for administrative units.

### Planning your administrative units

Administrative units can be used to logically group Azure AD resources. For example, for an organization whose IT department is scattered globally, it might make sense to create administrative units that define those geographical boundaries. In another scenario where a multi-national organization has different "sub-organizations", that are semi-autonomous in operations, each sub-organization may be represented by an administrative unit.

The criteria on which administrative units are created will be guided by the unique requirements of an organization. Administrative Units are a common way to define structure across M365 services. We recommend that you prepare your administrative units with their use across M365 services in mind. You can get maximum value out of administrative units when you can associate common resources across M365 under an administrative unit.

You can expect the creation of administrative units in the organization to go through the following stages:

1. Initial Adoption: Your organization will start creating administrative units based on initial criteria and the number of administrative units will increase as the criteria is refined.
1. Pruning: Once the criteria is well defined, administrative units that are no longer required will be deleted.
1. Stabilization: Your organizational structure is well defined and the number of administrative units is not going to change significantly over short durations.

## Currently supported scenarios

Global administrators or Privileged role administrators can use the Azure AD portal to create administrative units, add users as members of administrative units, and then assign IT staff to administrative unit-scoped administrator roles. The administrative unit-scoped admins can then use the Office 365 portal for basic management of users in their administrative units.

Additionally, groups can be added as members of administrative unit, and an admin unit-scoped group administrator can manage them using PowerShell, the Microsoft Graph, and the Azure AD portal.

The below table describes current support for administrative unit scenarios.

### Administrative unit management

Permissions |   MS Graph/PowerShell   | Azure AD portal | Microsoft 365 admin center
----------- | ----------------------- | --------------- | -----------------
Creating and deleting administrative units   |    Supported    |   Supported   |    Not supported
Adding and removing administrative unit members individually    |   Supported    |   Supported   |    Not supported
Bulk adding and removing administrative unit members using .csv file   |    Not supported     |  Supported   |    No plan to support
Assigning administrative unit-scoped administrators  |     Supported    |   Supported    |   Not supported
Adding and removing AU members dynamically based on attributes | Not supported | Not supported | Not supported

### User management

Permissions |   MS Graph/PowerShell   | Azure AD portal | Microsoft 365 admin center
----------- | ----------------------- | --------------- | -----------------
administrative unit-scoped management of user properties, passwords, licenses   |    Supported     |  Supported   |   Supported
administrative unit-scoped blocking and unblocking of user sign-ins    |   Supported   |    Supported   |    Supported
administrative unit-scoped management of user MFA credentials   |    Supported   |   Supported   |   Not supported

### Group management

Permissions |   MS Graph/PowerShell   | Azure AD portal | Microsoft 365 admin center
----------- | ----------------------- | --------------- | -----------------
administrative unit-scoped management of group properties and members     |  Supported   |    Supported    |  Not supported
administrative unit-scoped management of group licensing   |    Supported  |    Supported   |   Not supported

> [!NOTE]
>
> Administrators with an administrative unit scope can't manage dynamic group membership rules.

Administrative units apply scope only to management permissions. They don't prevent members or administrators from using their [default user permissions](../fundamentals/users-default-permissions.md) to browse other users, groups, or resources outside of the administrative unit. In the Office 365 portal, users outside of a scoped admin's administrative units are filtered out, but you can browse other users in the Azure AD portal, PowerShell, and other Microsoft services.

## Next steps

- [Managing AUs](roles-admin-units-manage.md)
- [Manage users in AUs](roles-admin-units-add-manage-users.md)
- [Manage groups in AUs](roles-admin-units-add-manage-groups.md)
- [Assign scoped roles to an AU](roles-admin-units-assign-roles.md)