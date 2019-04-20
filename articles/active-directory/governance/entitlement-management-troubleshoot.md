---
title: Troubleshoot Azure AD entitlement management? (Preview)
description: #Required; article description that is displayed in search results.
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
ms.date: 04/19/2019
ms.author: rolyon
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Troubleshoot Azure AD entitlement management? (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article answers common questions to help you troubleshoot Azure Active Directory (Azure AD) entitlement management.

## Checklist for adding a resource

* If there are users that have already been assigned to a resource that you want to manage with an access package, be sure that the users are assigned to the access package with an appropriate policy. For example, you might want to include a group in an access package that already has users in the group. If those users in the group require continued access, they must have an appropriate policy for the access packages so that they don't lose their access to the group. You can assign the access package by either asking the users to request the access package containing that resource, or by directly assigning them to the access package. For more information, see [Edit and manage an existing access package](entitlement-management-access-package-edit.md).

## Checklist for troubleshooting request issues

* When a user wants to request access to an access package, be sure that they are using the **My Access portal link** for the access package. For more information, see [Copy My Access portal link](entitlement-management-access-package-edit.md#copy-my-access-portal-link).

* When a user signs in to the My Access portal to request an access package, be sure they authenticate using their organizational account. The organizational account can be either an account in the resource directory, or in a directory that is included in one of the policies of the access package. If the user's account is not an organizational account, or the directory is not included in the policy, then the user will not see the access package. For more information, see [Request access to an access package](entitlement-management-request-access.md).

* If a user is blocked from signing in to the resource directory, they will not be able to request access in the My Access portal. Before the user can request access, you must remove the sign-in block from the user's profile. To remove the sign-in block, in the Azure portal, click **Azure Active Directory**, click **Users**, click the user, and then click **Profile**. Edit the **Settings** section and change **Block sign in** to **No**. For more information, see [Add or update a user's profile information using Azure Active Directory](../fundamentals/active-directory-users-profile-azure-portal.md)

* In the My Access portal, if a user is both a requestor and an approver, they will not see their request for an access package on the **Approvals** page. This behavior is intentional - a user cannot approve their own request. Ensure that the access package they are requesting has additional approvers configured on the policy. For more information, see [Edit an existing policy](entitlement-management-access-package-edit.md#edit-an-existing-policy).

* If a new external user, that has not previously signed in your directory, receives an access package including a SharePoint Online site, their access package will show as not fully delivered until their account is provisioned in SharePoint Online.

## Next steps

- [View reports of how users got access in entitlement management](entitlement-management-reports.md)
