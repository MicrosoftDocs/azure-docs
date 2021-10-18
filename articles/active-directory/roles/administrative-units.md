---
title: Administrative units in Azure Active Directory | Microsoft Docs
description: Use administrative units for more granular delegation of permissions in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: rolyon
manager: daveba
ms.service: active-directory
ms.topic: overview
ms.subservice: roles
ms.workload: identity
ms.date: 11/04/2020
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---
# Administrative units in Azure Active Directory

This article describes administrative units in Azure Active Directory (Azure AD). An administrative unit is an Azure AD resource that can be a container for other Azure AD resources. An administrative unit can contain only users and groups.

Administrative units restrict permissions in a role to any portion of your organization that you define. You could, for example, use administrative units to delegate the [Helpdesk Administrator](permissions-reference.md#helpdesk-administrator) role to regional support specialists, so they can manage users only in the region that they support.

## Deployment scenario

It can be useful to restrict administrative scope by using administrative units in organizations that are made up of independent divisions of any kind. Consider the example of a large university that's made up of many autonomous schools (School of Business, School of Engineering, and so on). Each school has a team of IT admins who control access, manage users, and set policies for their school.

A central administrator could:

- Create an administrative unit for the School of Business.
- Populate the administrative unit with only students and staff within the School of Business.
- Create a role with administrative permissions over only Azure AD users in the School of Business administrative unit.
- Add the business school IT team to the role, along with its scope.

## License requirements

Using administrative units requires an Azure AD Premium P1 license for each administrative unit administrator, and Azure AD Free licenses for administrative unit members. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## Manage administrative units

You can manage administrative units by using the Azure portal, PowerShell cmdlets and scripts, or Microsoft Graph. For more information, see:

- [Create, remove, populate, and add roles to administrative units](admin-units-manage.md): Includes complete how-to procedures.
- [Work with administrative units](/powershell/azure/active-directory/working-with-administrative-units): Covers how to work with administrative units by using PowerShell.
- [Administrative unit Graph support](/graph/api/resources/administrativeunit): Provides detailed documentation on Microsoft Graph for administrative units.

### Plan your administrative units

You can use administrative units to logically group Azure AD resources. An organization whose IT department is scattered globally might create administrative units that define relevant geographical boundaries. In another scenario, where a global organization has suborganizations that are semi-autonomous in their operations, administrative units could represent the suborganizations.

The criteria on which administrative units are created are guided by the unique requirements of an organization. Administrative units are a common way to define structure across Microsoft 365 services. We recommend that you prepare your administrative units with their use across Microsoft 365 services in mind. You can get maximum value out of administrative units when you can associate common resources across Microsoft 365 under an administrative unit.

You can expect the creation of administrative units in the organization to go through the following stages:

1. **Initial adoption**: Your organization will start creating administrative units based on initial criteria, and the number of administrative units will increase as the criteria are refined.
1. **Pruning**: After the criteria are defined, administrative units that are no longer required will be deleted.
1. **Stabilization**: Your organizational structure is defined, and the number of administrative units isn't going to change significantly in the short term.

## Currently supported scenarios

As a Global Administrator or a Privileged Role Administrator, you can use the Azure portal to:

- Create administrative units
- Add users and groups members of administrative units
- Assign IT staff to administrative unit-scoped administrator roles.

Administrative unit-scoped admins can use the Microsoft 365 admin center for basic management of users in their administrative units. A group administrator with administrative unit scope can manage groups by using PowerShell, Microsoft Graph, and the Microsoft 365 admin centers.

>[!Note]
>Only the features described in this section are available in the Microsoft 365 admin center. No organization-level features are available for an Azure AD role with administrative unit scope.

The following sections describe current support for administrative unit scenarios.

### Administrative unit management

| Permissions |   Graph/PowerShell   | Azure portal | Microsoft 365 admin center |
| --- | --- | --- | --- |
| Creating and deleting administrative units   |    Supported    |   Supported   |    Not supported |
| Adding and removing administrative unit members individually    |   Supported    |   Supported   |    Not supported |
| Adding and removing administrative unit members in bulk by using CSV files   |    Not supported     |  Supported   |    No plan to support |
| Assigning administrative unit-scoped administrators  |     Supported    |   Supported    |   Not supported |
| Adding and removing administrative unit members dynamically based on attributes | Not supported | Not supported | Not supported

### User management

| Permissions |   Graph/PowerShell   | Azure portal | Microsoft 365 admin center |
| --- | --- | --- | --- |
| Administrative unit-scoped management of user properties, passwords, and licenses   |    Supported     |  Supported   |   Supported |
| Administrative unit-scoped blocking and unblocking of user sign-ins    |   Supported   |    Supported   |    Supported |
| Administrative unit-scoped management of user multifactor authentication credentials   |    Supported   |   Supported   |   Not supported |

### Group management

| Permissions |   Graph/PowerShell   | Azure portal | Microsoft 365 admin center |
| --- | --- | --- | --- |
| Administrative unit-scoped management of group properties and members     |  Supported   |    Supported    |  Not supported |
| Administrative unit-scoped management of group licensing   |    Supported  |    Supported   |   Not supported |

Administrative units apply scope only to management permissions. They don't prevent members or administrators from using their [default user permissions](../fundamentals/users-default-permissions.md) to browse other users, groups, or resources outside the administrative unit. In the Microsoft 365 admin center, users outside a scoped admin's administrative units are filtered out. But you can browse other users in the Azure portal, PowerShell, and other Microsoft services.

## Next steps

- [Manage administrative units](admin-units-manage.md)
- [Manage users in administrative units](admin-units-add-manage-users.md)
- [Manage groups in administrative units](admin-units-add-manage-groups.md)
- [Assign scoped roles to an administrative unit](admin-units-assign-roles.md)
