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

* If users already have been assigned to a resource, e.g., there are already members in a group, prior to that group being used in an access package, ensure that any users that are in that group which require continued access have the access package.  This can be done by either asking the users to request the access package containing that resource, or by adding them to a direct assignment policy.

## Checklist for troubleshooting request issues

* When a user wishes to request access, ensure that the URL they are using is the one which is provided for that access package in the Azure Portal access package overview field `MyAccess portal link`.

* When requesting access, the user should authenticate using their organizational account.  The organizational account can be either an account in the resource directory, or in a directory which is included in one of the policies of the access package.  If the user's account is not an organizational account, or the directory is not included in the policy, then the user will not see the access package.

* If the user is blocked from sign in to the resource directory, then they will not be able to request access. Then they must be re-enabled in the resource directory before they can request.  This can be done in the Azure portal, by navigating to Azure Active Directory, selecting User management and editing the user so that their `block sign in` setting is `No`.

* If a user does not see a request that they made on the approvals page, that is intentional - a user cannot approve their own request. Ensure that the access package they are requesting has additional approvers configured on the policy.

* If a new external user, that has not previously been in the directory, receives an access package including a SharePoint Online site, their access package will show as not fully delivered until their account is provisioned into SharePoint Online.

## Next steps

- [View reports of how users got access in entitlement management](entitlement-management-reports.md)
