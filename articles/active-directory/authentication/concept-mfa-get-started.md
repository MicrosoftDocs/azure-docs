---
title: Azure Multi-Factor Authentication - Get started - Azure Active Directory
description: Get started with Azure Multi-Factor Authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/22/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Get started with Azure Multi-Factor Authentication

There are multiple ways to enable Azure Multi-Factor Authentication (MFA) for your Azure Active Directory (AD) users based on the licenses that your organization owns.

## Azure AD Premium P2

For customers with Azure AD Premium P2 licenses or similar licenses that include this functionality such as Enterprise Mobility + Security E5 or Microsoft 365 E5. 

The recommendation is to use [Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md) along with [Identity Protection](../identity-protection/overview-v2.md) risk policies for the best user experience and security functionality.

## Azure AD Premium P1

For customers with Azure AD Premium P1 licenses or similar licenses that include this functionality such as Enterprise Mobility + Security E3 or Microsoft 365 E3. 

The recommendation is to use [Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md) for the best user experience.

## Office 365 customers

For customers with Office 365, there are two options:

1. [Security defaults](../conditional-access/concept-conditional-access-security-defaults.md) can be enabled through Azure AD to protect all of your users with Azure Multi-Factor Authentication.
2. If your organization requires more granularity in providing multi-factor authentication, your Office licenses include [per-user MFA](../authentication/howto-mfa-userstates.md) capabilities. Per-user MFA is less granular than Conditional Access-based MFA in that it requires users to perform MFA at each Azure AD sign-in even if they have already performed MFA in their current session. Per-user MFA is enabled and enforced on each user individually by administrators.

## Free option

Customers who are only utilizing the free benefits of Azure AD can enable [security defaults](../conditional-access/concept-conditional-access-security-defaults.md) to enable multi-factor authentication in their environment.

## Next steps

[Azure AD pricing page](https://azure.microsoft.com/pricing/details/active-directory/)