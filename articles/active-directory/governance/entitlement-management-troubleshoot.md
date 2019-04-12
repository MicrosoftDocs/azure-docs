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
ms.date: 04/12/2019
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

## Frequently asked questions

**Q: What about access assigned outside of entitlement management?**<br />
A: Entitlement management does not manage access assigned to users outside of entitlement management.

**Q: What happens if entitlement management makes a user a member of a group and that group has access to an application?**<br />
A: Entitlement management does not manage access assigned to users outside of entitlement management.
If entitlement management makes a user a group member, and that group has access to an application, the application will not appear within the user's approved access package. However, the user will see the app in the My Apps portal. You should grant users access to the application instead.

**Q: Can you have the same policy for internal and external users?**<br />
No, a single policy cannot be used for internal and external users in the same access package. You should create two policies in the same access package, one for internal users and one for external users.

## Next steps

