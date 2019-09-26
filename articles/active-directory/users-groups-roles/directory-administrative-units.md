---
title: Administrative units management (preview) - Azure Active Directory | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 08/01/2019
ms.author: curtand

ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;

ms.collection: M365-identity-device-management
---
# Administrative units management in Azure Active Directory (public preview)

This article describes administrative units in Azure Active Directory (Azure AD). From the central administrator’s point of view, an administrative unit is an Azure AD resource that can be created and populated with other Azure AD resources. Administrative units are a container of Azure AD resources. You can delegating administrative permissions over subsets of users and applying policies to a subset of users. You can use administrative units to delegate permissions to regional administrators or to set policy at a granular level. For example, an administrative unit-scoped User account admin can update profile information, reset passwords, and assign licenses for users only in their administrative unit.

## Deployment scenario

This can useful in organizations with independent divisions. Consider the example of a large university that is made up of many autonomous schools (School of Business, School of Engineering, and so on) that each have their own IT administrators who control access, manage users, and set policies for their school. Central university administrators can use administrative units to grant these school-level administrators permissions over the users in their particular divisions. More specifically, using the same example, a central administrator could create an administrative unit for the School of Business and populate it with only the business school students and staff. Then the central administrator can add the Business school IT staff to a scoped role that grants administrative permissions over only Azure AD users in the business school administrative unit.

## License requirements

To use administrative units requires the administrative unit admin to have an Azure Active Directory Premium license. For more information, see [Getting started with Azure AD Premium](../fundamentals/active-directory-get-started-premium.md).

## Managing administrative units

In this preview release, the only way you can create and manage administrative units is to use the Azure Active Directory Module for Windows PowerShell cmdlets as described in [Working with Administrative Units](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0)

For more information on software requirements and installing the Azure AD module, and for reference information on the Azure AD Module cmdlets for managing administrative units, including syntax, parameter descriptions, and examples, see [Azure Active Directory PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

## Next steps

[Azure Active Directory editions](../fundamentals/active-directory-whatis.md)
