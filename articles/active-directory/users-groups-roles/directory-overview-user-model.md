---
title: Users, groups, licensing, roles overview in Azure Active Directory | Microsoft Docs
description: User model includes licenses assigned, administrator roles, group membership in Azure Active Diretory
keywords:
author: curtand
manager: mtillman

ms.author: curtand
ms.reviewer: vince.Smith
ms.date: 06/22/2018
ms.topic: overview
ms.service: active-directory
ms.workload: identity
services: active-directory
ms.custom: it-pro

#As a new Azure AD identity administrator, I want to understand the relationships between users and their groups, administrator roles, and licenses, so I can accomplish the top tasks associated with my job at scale.”
---

# What is user access management using groups, licensing, and roles?

User management is the basis of identity management in Azure Active Directory (Azure AD). The users that you manage belong to groups and need licenses to use online services. Some users need SaaS app access, and some users need permissions for Azure AD management tasks. If you're in a large organization, you can assign licenses to groups instead of individually, or delegate permissions to distribute the work of Azure AD management. To accomplish your top tasks more quickly and at scale, you should understand the relationships between users and their groups, administrator roles, and licenses.

This article introduces new Azure AD administrators to the relationship between top identity management tasks for users and their groups, licenses, and administrator roles.

## Assign users to groups

Groups are how you manage users at scale in Azure AD. You can use groups in Azure AD to assign app access, and to assign licenses to users. You can use groups to assign administrator roles in Azure AD, or you can grant access to resources that are external, such as:

* SaaS applications
* Azure services
* SharePoint sites
* On-premises resources

If you create a group by rule such that the members of the group match some attribute or attributes, the group membership expands and contracts automatically, saving time and attention.

## Assign service licenses to groups

Assigning licenses to or removing them from users individually, such as for Office 365, can also demand time and attention. If you assign licenses to groups instead, you can make large-scale license management easier.

In Azure AD, when users join a licensed group, they're automatically assigned the appropriate licenses. When users leave the group, Azure AD removes their license assignments. Without Azure AD groups, you'd have to write a PowerShell script or use Graph API to bulk add or remove user licenses for users joining or leaving the organization.

If there are not enough available licenses, or an issue occurs like service plans that can't be assigned at the same time, you can see the licensing issue status for the group in the Azure portal.

>[!NOTE]
>The group-based licensing feature currently is in public preview. Be prepared to revert or remove any changes. During the preview, the feature is available with any paid Azure Active Directory (Azure AD) license plan or trial. When the feature becomes generally available, some aspects of the feature might require one or more additional licenses.

## Assign roles to delegate permissions

You want to assign the least possible privilege to users to perform their tasks. You probably don't want to assign the Global Administrator role, for example, to every application owner. But if you don't, you force application management responsibilities onto Global Administrators. You can now use new Azure AD admin roles to distribute the work of application management with more granularity:

* The **Application Administrator**, who can manage enterprise applications, application registrations and configure proxy application settings. They can view conditional access policies and devices, but not manage them. In scope for the role is the ability to configure single sign-on, managing and updating claims. 
 
* The **Cloud Application Administrator**, who can add and manage enterprise application and application registrations. This role has the same permissions as the Application Administrator, except it can't manage application proxy settings.

* The **Application Developer**, who can create and update application registrations, but can't manage enterprise applications or configure an application proxy.

<!-- "we're adding new roles" text and also, what about app access, etc-->

## Next steps

If you're a beginning Azure AD administrator, get the basics down in Azure Active Directory Fundamentals.[Will be linked to the landing page for Fundamentals]

Or you can start [creating groups](../fundamentals/active-directory-groups-create-azure-portal.md), [assigning licenses](../fundamentals/active-directory-licensing-whatis-azure-portal.md), or [assigning administrator roles](directory-assign-admin-roles.md).