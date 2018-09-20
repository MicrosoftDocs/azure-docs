---
title: Users, groups, licensing, roles overview in Azure Active Directory | Microsoft Docs
description: User model includes licenses assigned, administrator roles, group membership in Azure Active Diretory
keywords:
author: curtand
manager: mtillman

ms.author: curtand
ms.reviewer: vince.Smith
ms.date: 09/19/2018
ms.topic: overview
ms.service: active-directory
ms.workload: identity
services: active-directory
ms.custom: it-pro

#As a new Azure AD identity administrator, user management is at the core of my work so I need to understand the user management tools such as groups, administrator roles, and licenses to manage users at scale.
---

# Overview: Azure Active Directory tools manage users at scale

User management is at the core of identity management in Azure Active Directory (Azure AD). As your organization grows, you can use Azure AD groups as a user management tool and a licensing tool, and Azure AD as a user permissions management tool. You can assign licenses to groups instead of individuals, or delegate permissions to distribute the overhead of Azure AD management. These tools help you accomplish your top tasks more quickly and accommodate growth. This article introduces the new Azure AD administrator to the relationship between top identity management tasks for users and their groups, licenses, deployed enterprise apps, and administrator roles.

## Assign users to groups

Groups are how you manage users at scale in Azure AD. You can use groups in Azure AD to assign licenses *en masse* or to assign access to deployed enterprise apps to users. You can use groups to assign administrator roles in Azure AD, or you can grant access to resources that are external, such as:

* SaaS applications
* Azure services
* SharePoint sites
* On-premises resources

Dynamic groups in Azure AD expand and contract automatically according to a rule that matches group members to user attributes. You'll need an Azure AD Premium P1 license for each unique user that is a member of one or more dynamic groups.

## Assign service licenses to groups

Assigning or removing licenses from users individually can demand time and attention. If you assign licenses to groups instead, you can make your large-scale license management easier.

In Azure AD, when users join a licensed group, they're automatically assigned the appropriate licenses. When users leave the group, Azure AD removes their license assignments. Without Azure AD groups, you'd have to write a PowerShell script or use Graph API to bulk add or remove user licenses for users joining or leaving the organization.

If there are not enough available licenses, or an issue occurs like service plans that can't be assigned at the same time, you can see status of any licensing issue for the group in the Azure portal.

>[!NOTE]
>The group-based licensing feature currently is in public preview. During the preview, the feature is available with any paid Azure Active Directory (Azure AD) license plan or trial.

## Delegate workload with administrator roles

You want to assign the least possible privilege to users to perform their tasks. You probably don't want to assign the Global Administrator role, for example, to every application owner. But if you don't, you force application management responsibilities onto Global Administrators. Here's an example of how you can use new Azure AD admin roles to distribute the work of application management with more granularity:

* The **Application Administrator**, who can manage enterprise applications, application registrations and configure proxy application settings. They can view conditional access policies and devices, but not manage them. In scope for the role is the ability to configure single sign-on, managing and updating claims.

* The **Cloud Application Administrator**, who can add and manage enterprise application and application registrations. This role has the same permissions as the Application Administrator, except it can't manage application proxy settings.

* The **Application Developer**, who can create and update application registrations, but can't manage enterprise applications or configure an application proxy.

New Azure AD administrator roles are being added frequently.

## Assign app access to users

You can use Azure AD to manage group or user assignments to enterprise apps that are deployed in your Azure AD tenant. If you combine dynamic groups with group assignment to apps, you can automate how you scale up your user app access assignments. You'll need an Azure Active Directory Premium P1 or Premium P2 license to assign access to enterprise apps.

Azure AD also gives you granular control of the data flows between the app and the users and groups to whom you assign access. In the Enterprise Applications service (**All Services > Enterprise Applications > Provisioning**), you can:

* Set up automatic provisioning (when the app supports it)
* Provide credentials to connect to the application's user management API
* Set up the mappings that control which user attributes flow between Azure AD and the app when user accounts are provisioned or updated
* Start and stop the Azure AD provisioning service for the selected application, clear the provisioning cache, or restart the service
* View the **Provisioning activity report** that provides a log of all users and groups created, updated, and removed between Azure AD and the app, and the **Provisioning error report** that provides more detailed error messages

## Next steps

If you're a beginning Azure AD administrator, get the basics down in [Azure Active Directory Fundamentals](https://docs.microsoft.com/azure/active-directory/fundamentals/index).

Or you can start [creating groups](../fundamentals/active-directory-groups-create-azure-portal.md), [assigning licenses](../fundamentals/active-directory-licensing-whatis-azure-portal.md), [assigning app access](https://docs.microsoft.com/azure/active-directory/manage-apps/assign-user-or-group-access-portal) or [assigning administrator roles](directory-assign-admin-roles.md).