---
title: Administrative units management (preview) - Azure AD | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 11/13/2019
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---
# Administrative units management in Azure Active Directory (preview)

This article describes administrative units in Azure Active Directory (Azure AD). An administrative unit is an Azure AD resource that can be a container for other Azure AD resources. In this preview release, these resources can be only users. For example, an administrative unit-scoped User account admin can update profile information, reset passwords, and assign licenses for users only in their administrative unit.

You can use administrative units to delegate administrative permissions over subsets of users and applying policies to a subset of users. You can use administrative units to delegate permissions to regional administrators or to set policy at a granular level.

## Deployment scenario

Administrative units can be useful in organizations with independent divisions. Consider the example of a large university that is made up of many autonomous schools (School of Business, School of Engineering, and so on) that each has their own IT administrators who control access, manage users, and set policies for their school. A central administrator could create an administrative unit for the School of Business and populate it with only the business school students and staff. Then the central administrator can add the Business school IT staff to a scoped role that grants administrative permissions over only Azure AD users in the business school administrative unit.

## License requirements

To use administrative units requires an Azure Active Directory Premium license for each administrative unit admin. For more information, see [Getting started with Azure AD Premium](../fundamentals/active-directory-get-started-premium.md).

## Managing administrative units

In this preview release, the only way you can create and manage administrative units is to use the Azure Active Directory Module for Windows PowerShell cmdlets as described in [Working with Administrative Units](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0)

For more information on software requirements and installing the Azure AD module, and for reference information on the Azure AD Module cmdlets for managing administrative units, including syntax, parameter descriptions, and examples, see [Azure Active Directory PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

## Next steps

[Azure Active Directory editions](../fundamentals/active-directory-whatis.md)
