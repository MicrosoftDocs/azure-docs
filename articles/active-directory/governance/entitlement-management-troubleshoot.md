---
title: Troubleshoot Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn about some items you should check to help you troubleshoot Azure Active Directory entitlement management (Preview).
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
ms.date: 05/30/2019
ms.author: rolyon
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want checklists and tips to help troubleshoot entitlement management to unblock users from performing their job.

---
# Troubleshoot Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes some items you should check to help you troubleshoot Azure Active Directory (Azure AD) entitlement management.

## Checklist for entitlement management administration

* If you get an access denied message when configuring entitlement management, and you are a Global administrator, ensure that your directory has an [Azure AD Premium P2 (or EMS E5) license](entitlement-management-overview.md#license-requirements).  
* If you get an access denied message when creating or viewing access packages, and you are a member of a Catalog creator group, you must create a catalog prior to creating your first access package.

## Checklist for adding a resource

* For an application to be a resource in an access package, it must have at least one resource role that can be assigned. The roles are defined by the application itself and are managed in Azure AD. Note that the Azure portal may also show service principals for services that cannot be selected as applications.  In particular, **Exchange Online** and **SharePoint Online** are services, not applications that have resource roles in the directory, so they cannot be included in an access package.  Instead, use group-based licensing to establish an appropriate license for a user who needs access to those services.

* For a group to be a resource in an access package, it must be able to be modifiable in Azure AD.  Groups that originate in an on-premises Active Directory cannot be assigned as resources because their owner or member attributes cannot be changed in Azure AD.  

* SharePoint Online document libraries and individual documents cannot be added as resources.  Instead, create an Azure AD security group, include that group and a site role in the access package, and in SharePoint Online use that group to control access to the document library or document.

* If there are users that have already been assigned to a resource that you want to manage with an access package, be sure that the users are assigned to the access package with an appropriate policy. For example, you might want to include a group in an access package that already has users in the group. If those users in the group require continued access, they must have an appropriate policy for the access packages so that they don't lose their access to the group. You can assign the access package by either asking the users to request the access package containing that resource, or by directly assigning them to the access package. For more information, see [Edit and manage an existing access package](entitlement-management-access-package-edit.md).

## Checklist for providing external users access

* If there is a B2B [allow list](../b2b/allow-deny-list.md), then users whose directories are not allowed will not be able to request access.

* Ensure that there are no [Conditional Access policies](../conditional-access/require-managed-devices.md) that would prevent external users from requesting access or being able to use the applications in the access packages.

## Checklist for request issues

* When a user wants to request access to an access package, be sure that they are using the **My Access portal link** for the access package. For more information, see [Copy My Access portal link](entitlement-management-access-package-edit.md#copy-my-access-portal-link).

* When a user signs in to the My Access portal to request an access package, be sure they authenticate using their organizational account. The organizational account can be either an account in the resource directory, or in a directory that is included in one of the policies of the access package. If the user's account is not an organizational account, or the directory is not included in the policy, then the user will not see the access package. For more information, see [Request access to an access package](entitlement-management-request-access.md).

* If a user is blocked from signing in to the resource directory, they will not be able to request access in the My Access portal. Before the user can request access, you must remove the sign-in block from the user's profile. To remove the sign-in block, in the Azure portal, click **Azure Active Directory**, click **Users**, click the user, and then click **Profile**. Edit the **Settings** section and change **Block sign in** to **No**. For more information, see [Add or update a user's profile information using Azure Active Directory](../fundamentals/active-directory-users-profile-azure-portal.md).  You can also check if the user was blocked due to an [Identity Protection policy](../identity-protection/howto-unblock-user.md).

* In the My Access portal, if a user is both a requestor and an approver, they will not see their request for an access package on the **Approvals** page. This behavior is intentional - a user cannot approve their own request. Ensure that the access package they are requesting has additional approvers configured on the policy. For more information, see [Edit an existing policy](entitlement-management-access-package-edit.md#edit-an-existing-policy).

* If a new external user, that has not previously signed in your directory, receives an access package including a SharePoint Online site, their access package will show as not fully delivered until their account is provisioned in SharePoint Online.

## Next steps

- [View reports of how users got access in entitlement management](entitlement-management-reports.md)
