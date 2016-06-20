<properties
   pageTitle="Administrative units management in Azure Active Directory"
   description="Using administrative units for more granular delegation of permissions in Azure Active Directory"
   services="active-directory"
   documentationCenter=""
   authors="curtand"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="04/26/2016"
   ms.author="curtand"/>

# Administrative units management in Azure AD - Public Preview

This article describes administrative units – a new Azure Active Directory container of resources that can be used for delegating administrative permissions over subsets of users and applying policies to a subset of users. In Azure Active Directory, administrative units enable central administrators to delegate permissions to regional administrators or to set policy at a granular level.

This is useful in organizations with independent divisions, for example, a large university that is made up of many autonomous schools (Business school, Engineering school, and so on) which are independent from each other. Such divisions have their own IT administrators who control access, manage users, and set policies specifically for their division. Central administrators want to be able grant these divisional administrators permissions over the users in their particular divisions. More specifically, using this example, a central administrator can, for instance, create an administrative unit for a particular school (Business school) and populate it with only the Business school users. Then a central administrator can add the Business school IT staff to a scoped role, in other words, grant the IT staff of Business school administrative permissions only over the Business school administrative unit.

> [AZURE.IMPORTANT]
> You can create and use administrative units only if you enable Azure Active Directory Premium. For more information, see [Getting started with Azure AD Premium](active-directory-get-started-premium.md).

From the central administrator’s point of view, an administrative unit is a directory object that can be created and populated with resources. **In this release, these resources can be only users.** Once created and populated, the administrative unit can be used as a scope to restrict the granted permission only over resources contained in the administrative unit.

## Managing administrative units

In this preview release, you can create and manage administrative units using the Azure Active Directory Module for Windows PowerShell cmdlets.

For more information on software requirements and installing the Azure AD module, and for information on the Azure AD Module cmdlets for managing administrative units, including syntax, parameter descriptions, and examples, see [Manage Azure AD using Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx).


## Next steps
[Azure Active Directory editions](active-directory-editions.md)
