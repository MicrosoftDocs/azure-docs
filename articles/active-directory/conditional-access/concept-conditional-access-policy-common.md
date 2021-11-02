---
title: Common Conditional Access policies - Azure Active Directory
description: Commonly used Conditional Access policies for organizations

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/13/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Common Conditional Access policies

[Security defaults](../fundamentals/concept-fundamentals-security-defaults.md) are great for some but many organizations need more flexibility than they offer. For example, many organizations need the ability to exclude specific accounts like their emergency access or break-glass administration accounts from Conditional Access policies requiring multi-factor authentication. For those organizations, the common policies referenced in this article can be of use.

![Conditional Access policies in the Azure portal](./media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png)

## Emergency access accounts

More information about emergency access accounts and why they are important can be found in the following articles: 

* [Manage emergency access accounts in Azure AD](../roles/security-emergency-access.md)
* [Create a resilient access control management strategy with Azure Active Directory](../authentication/concept-resilient-controls.md)

## Conditional Access templates (Preview)

Conditional Access templates are designed to provide a simple and easy method to deploy new policies that align with Microsoft recommended best practices. These templates policies are designed to provide maximum protection and align with commonly used policies across all customer types and locations.

The 14 policy templates are split into policies that would be assigned to user identitites or devices. Find the templates in the **Azure portal** > **Azure Active Directory** > **Security** > **Conditional Access** > **Create new policy from template**.

- Identities
   - Require multi-factor authentication for admins
   - Securing security info registration
   - Block legacy authentication
   - Require multi-factor authentication for all users
   - Require multi-factor authentication for guest access
   - Require multi-factor authentication for Azure management
   - Require multi-factor authentication for risky sign-in
   - Require password change for high-risk users
- Devices
   - Require compliant or Hybrid Azure AD joined device for admins
   - Block access for unknown or unsupported device platform
   - No persistent browser session
   - Require approved client apps and app protection
   - Require compliant or Hybrid Azure AD joined device or multi-factor authentication for all users
   - Use application enforced restrictions for unmanaged devices

Organizations not comfortable allowing Microsoft to create these policies can create them manually by copying the settings from **View policy summary** or use the following articles to create policies themselves. 

## Typical policies deployed by organizations

* [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)\*
* [Require MFA for administrators](howto-conditional-access-policy-admin-mfa.md)\*
* [Require MFA for Azure management](howto-conditional-access-policy-azure-management.md)\*
* [Require MFA for all users](howto-conditional-access-policy-all-users-mfa.md)\*

\* These four policies when configured together, mimic functionality enabled by [security defaults](../fundamentals/concept-fundamentals-security-defaults.md).

## Additional policies

* [Sign-in risk-based Conditional Access (Requires Azure AD Premium P2)](howto-conditional-access-policy-risk.md)
* [User risk-based Conditional Access (Requires Azure AD Premium P2)](howto-conditional-access-policy-risk-user.md)
* [Require trusted location for MFA registration](howto-conditional-access-policy-registration.md)
* [Block access by location](howto-conditional-access-policy-location.md)
* [Require compliant device](howto-conditional-access-policy-compliant-device.md)
* [Block access except specific apps](howto-conditional-access-policy-block-access.md)

## Next steps

- [Simulate sign in behavior using the Conditional Access What If tool.](troubleshoot-conditional-access-what-if.md)

- [Use report-only mode for Conditional Access to determine the impact of new policy decisions.](concept-conditional-access-report-only.md)
