---
title: Users, groups, licensing, and roles overview - Azure Active Directory | Microsoft Docs
description: The relationship between users and licenses assigned, administrator roles, group membership in Azure Active Directory
keywords:
author: curtand
manager: mtillman

ms.author: curtand
ms.reviewer: vincesm
ms.date: 01/28/2019
ms.topic: overview
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
services: active-directory
ms.custom: "it-pro;seo-update-azuread-jan"

#As a new Azure AD identity administrator, user management is at the core of my work so I need to understand the user management tools such as groups, administrator roles, and licenses to manage users.
ms.collection: M365-identity-device-management
---
# Users, groups, licensing, and roles for large organizations

This article introduces the Azure AD administrator to the relationship between top [identity management](/azure/active-directory/fundamentals/identity-fundamentals?context=azure/active-directory/users-groups-roles/context/ugr-context) tasks for users in terms of their groups, licenses, deployed enterprise apps, and administrator roles. As your organization grows, you can use Azure AD groups and administrator roles to:

* Assign licenses to groups instead of to individually
* Delegate permissions to distribute the work of Azure AD management to less-privileged roles
* Assign enterprise app access to groups

## Assign users to groups

You can use groups in Azure AD to assign licenses to large numbers of users, or to assign user access to deployed enterprise apps. You can use groups to assign administrator roles in Azure AD, or you can grant access to resources that are external, such as SaaS applications or SharePoint sites.

For additional flexibility and to reduce the work of managing group membership, you can use [dynamic groups](groups-create-rule.md) in Azure AD to expand and contract group membership automatically. You'll need an Azure AD Premium P1 license for each unique user that is a member of one or more dynamic groups.

## Assign licenses to groups

Assigning or removing licenses from users individually can demand time and attention. If you [assign licenses to groups](/azure/active-directory/fundamentals/license-users-groups?context=azure/active-directory/users-groups-roles/context/ugr-context) instead, you can make your large-scale license management easier.

In Azure AD, when users join a licensed group, they're automatically assigned the appropriate licenses. When users leave the group, Azure AD removes their license assignments. Without Azure AD groups, you'd have to write a PowerShell script or use Graph API to bulk add or remove user licenses for users joining or leaving the organization.

If there are not enough available licenses, or an issue occurs like service plans that can't be assigned at the same time, you can see status of any licensing issue for the group in the Azure portal.

>[!NOTE]
>The group-based licensing feature currently is in public preview. During the preview, the feature is available with any paid Azure Active Directory (Azure AD) license plan or trial.

## Delegate administrator roles

Many large organizations want options for their users to obtain sufficient permissions for their work tasks without assigning the powerful Global Administrator role to, for example, users who must register applications. Here's an example of new Azure AD administrator roles to help you distribute the work of application management with more granularity:

 Role name | Permissions summary
 --------- | -------------------
 **Application Administrator** | Can add and manage enterprise applications and application registrations, and configure proxy application settings. Application Administrators can view Conditional Access policies and devices, but not manage them.
 **Cloud Application Administrator** | Can add and manage enterprise applications and enterprise app registrations. This role has all of the permissions of the Application Administrator, except it can't manage application proxy settings.
**Application Developer** | Can add and update application registrations, but can't manage enterprise applications or configure an application proxy.

New Azure AD administrator roles are being added. Check the Azure portal or the [administrator role permission reference](directory-assign-admin-roles.md) for current available roles.

## Assign app access

You can use Azure AD to assign group access to the [enterprise apps that are deployed in your Azure AD tenant](/azure/active-directory/manage-apps/methods-for-assigning-users-and-groups?context=azure/active-directory/users-groups-roles/context/ugr-context). If you combine dynamic groups with group assignment to apps, you can automate your user app access assignments as your organization grows. You'll need an Azure Active Directory Premium P1 or Premium P2 license to assign access to enterprise apps.

Azure AD also gives you granular control of the data that flows between the app and the groups to whom you assign access. In [Enterprise Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps), open an app and select **Provisioning** to:

* Set up automatic provisioning for apps that support it
* Provide credentials to connect to the app's user management API
* Set up the mappings that control which user attributes flow between Azure AD and the app when user accounts are provisioned or updated
* Start and stop the Azure AD provisioning service for an app, clear the provisioning cache, or restart the service
* View the **Provisioning activity report** that provides a log of all users and groups created, updated, and removed between Azure AD and the app, and the **Provisioning error report** that provides more detailed error messages

## Next steps

If you're a beginning Azure AD administrator, get the basics down in [Azure Active Directory Fundamentals](https://docs.microsoft.com/azure/active-directory/fundamentals/index).

Or you can start [creating groups](/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal?context=azure/active-directory/users-groups-roles/context/ugr-context), [assigning licenses](/azure/active-directory/fundamentals/license-users-groups?context=azure/active-directory/users-groups-roles/context/ugr-context), [assigning app access](/azure/active-directory/manage-apps/methods-for-assigning-users-and-groups?context=azure/active-directory/users-groups-roles/context/ugr-context) or [assigning administrator roles](directory-assign-admin-roles.md).
