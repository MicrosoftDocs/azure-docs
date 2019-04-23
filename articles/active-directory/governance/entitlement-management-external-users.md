---
title: Manage access for external users in Azure AD entitlement management (Preview) - Azure Active Directory
description: Learn how to manage access for external users in Azure Active Directory entitlement management (Preview).
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: jocastel-MSFT
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/05/2019
ms.author: rolyon
ms.reviewer: jocastel
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Manage access for external users in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Managing access to resources for users applies both to users already in your directory and to users not yet in your directory. Resource organizations can define that users from other organizations may need access for a project. Users from the other organization would be able to visit a resource organization portal and view available access packages, request those access packages. Assuming the request is approved, that user will be invited into the resource organization and provisioned into the resources associated with that access package. Based on the resource organizations policies, the approved user will only get for a certain period, after that time the system will remove access to resources including the Azure AD business-to-business (B2B) account.

Currently with B2B you need to the email address of who you want to work with. Which works great when your working on a small project, but this requirement introduces loads of hurdles at scale. For example, the current model may work if Contoso needs to provide access to 10-20 users from Fabrikam, but when happens if Contoso needs to provide 1,000 or 10,000 users from Fabrikam. Not only would the current process not scale, there is no one person in Contoso that would know who from Fabrikam needs access. This is where entitlement management can come in to save the day.

With entitlement management Contoso would be able to define a policy that allows users from specific organizations, using Azure AD, to be able to go to a Contoso specific end user portal and few Access packages that are available to request, and request them, if approved the system will provision the user with the necessary access which may include a B2B account (based on the B2B allow/deny list provisioning of the B2B account may fail). Contoso can define whether approval is required or not, and if approval is required, they can designate a user from Fabrikam since they will likely know who from Fabrikam needs access. Since Contoso has a mature governance strategy they do not want any of the Fabrikam users to have access forever, so they configured an expiration date where Fabrikam users can only have the access package for 180 days, after 180 days, if not renewed, the system will remove all access associated with that access package, including the B2B accounts, thus removing the problem of creating zombie accounts.

## Prerequisites

- First prerequisite
- Second prerequisite
- Third prerequisite

## Procedure 1


## Next steps


