---
title: Manage access to a resource in Azure AD entitlement management (Preview)
description: How to manage access across groups, apps and SharePoint Online sites in Azure AD entitlement management using access packages.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/15/2019
ms.author: rolyon
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a catalog creating end user or admin, I want add one or more resources to an access package so that users access rights to those are time limited.

---
# Manage a resource in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure AD entitlement management can be used to manage how users get access across your organization's resources.  Currently the resource types supported in entitlement management are Office groups, Azure AD security groups, Azure AD integrated applications, and SharePoint Online site collections.

There are three places where you can manage resources in the entitlement management administrator UI, in the Azure portal:
* an access package catalog can have resources that are available for an access package in that catalog.  The catalog holds all of the resources which are used in one or more of the access packages in that catalog.  A catalog can also have additional resources which are not yet included in any access package, but users will not be assigned access to those resources.
* an access package can have a specific resource role. When a user is assigned to that access package, they will be added to that resource role.
* an access package assignment can have the specific resource role assignments for a user. 

The following sections discuss how groups, apps and SharePoint Online sites are managed through entitlements.

## Prerequisites

In order to add a resource, you will either need to be a User administrator, or both an entitlement management catalog creator and a owner of the resource.  If you are not an administrator and have not yet created a catalog, you will also need to create a catalog before proceeding.

## Group memberships

Azure AD entitlement management can assign user membership or ownership of a group as part of a user being assigned an access package.  Any Office group and Azure AD security group can be added.

Four considerations for selecting groups:
* When a group is part of an access package, then a user who is assigned that access package is added to that group by entitlement management, if not already present. When their access package assignment expires, if they do not have another access package that includes that group, they will be removed from the group.
* When a user is added to a group, they can see all the other members of that group.
* Azure AD cannot change the membership of a group that was synchronized from Windows Server Active Directory using Azure AD Connect.  
* The membership of dynamic groups cannot be updated using entitlement management.

If you are a catalog creator, you can add to an access package in your catalog any group you own.  If there is a group which you wish to assign users to but do not own, you will need to have a User administrator add that group to your catalog.  Once the group is part of the catalog, you can select either the 'owner' role or the 'member' role in the access package.  (Typically the 'member' role is used - assigning a user as an owner will allow them to add or remove other members or owners.)

Once a user is assigned the access package they will be added to that group, and when their assignment expires or is removed, they will be removed from the group.

## Application access

Azure AD entitlement management can assign users access to an Azure AD enterprise application, including both SaaS applications and your own applications federated to Azure AD.  For applications which integrate with Azure AD through federated single sign on, Azure AD will issue federation tokens for users assigned to the app.

Two considerations for selecting apps:
* When an application's role is part of an access package, then a user who is assigned that access package is added to that application role by entitlement management, if not already present. When their access package assignment expires, if they do not have another access package that includes that application, they will be removed from the application.
* Applications can have multiple roles, as well as groups assigned to roles.  

If you are a catalog creator, you can add to an access package in your catalog any aplication you own.  If there is a application which you wish to assign users to but do not own, you will need to have a User administrator add that application to your catalog.  Once the application is part of the catalog, you can select any of the application's roles in an access package.

## SharePoint Online site collection memberships


## Next steps

Once you have added the resources, you can add them to your access packages.

