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
ms.date: 01/31/2019
ms.author: curtand

ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;

ms.collection: M365-identity-device-management
---
# Administrative units management in Azure Active Directory (public preview)

This article describes administrative units – a new Azure Active Directory (Azure AD) container of resources that can be used for delegating administrative permissions over subsets of users and applying policies to a subset of users. In Azure Active Directory, administrative units enable central administrators to delegate permissions to regional administrators or to set policy at a granular level.

This is useful in organizations with independent divisions, for example, a large university that is made up of many autonomous schools (Business school, Engineering school, and so on) which are independent from each other. Such divisions have their own IT administrators who control access, manage users, and set policies specifically for their division. Central administrators want to be able grant these divisional administrators permissions over the users in their particular divisions. More specifically, using this example, a central administrator can, for instance, create an administrative unit for a particular school (Business school) and populate it with only the Business school users. Then a central administrator can add the Business school IT staff to a scoped role, in other words, grant the IT staff of Business school administrative permissions only over the Business school administrative unit.

> [!IMPORTANT]
> To use Administrative Units requires the Administrative Unit-scoped admin to have an Azure Active Directory Premium license, and Azure Active Directory Basic licenses for all users in the Administrative Unit. For more information, see [Getting started with Azure AD Premium](../fundamentals/active-directory-get-started-premium.md).
>


From the central administrator’s point of view, an administrative unit is a directory object that can be created and populated with resources. **In this preview release, these resources can be only users.** Once created and populated, the administrative unit can be used as a scope to restrict the granted permission only over resources contained in the administrative unit.

## Managing administrative units
In this preview release, you can create and manage administrative units using the Azure Active Directory Module for Windows PowerShell cmdlets. To learn more about how to do that, see [Working with Administrative Units](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0)

For more information on software requirements and installing the Azure AD module, and for information on the Azure AD Module cmdlets for managing administrative units, including syntax, parameter descriptions, and examples, see [Azure Active Directory PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/overview?view=azureadps-2.0).

## Next steps
[Azure Active Directory editions](../fundamentals/active-directory-whatis.md)
