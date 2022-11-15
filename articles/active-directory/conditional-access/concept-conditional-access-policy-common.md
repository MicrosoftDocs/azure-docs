---
title: Common Conditional Access policies - Azure Active Directory
description: Commonly used Conditional Access policies for organizations

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 08/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policies

[Security defaults](../fundamentals/concept-fundamentals-security-defaults.md) are great for some but many organizations need more flexibility than they offer. Many organizations need to exclude specific accounts like their emergency access or break-glass administration accounts from Conditional Access policies. The policies referenced in this article can be customized based on organizational needs. Organizations can [use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)

## Conditional Access templates (Preview)

Conditional Access templates are designed to provide a convenient method to deploy new policies aligned with Microsoft recommendations. These templates are designed to provide maximum protection aligned with commonly used policies across various customer types and locations.

:::image type="content" source="media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png" alt-text="Conditional Access policies and templates in the Azure portal." lightbox="media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png":::

The 14 policy templates are split into policies that would be assigned to user identities or devices. Find the templates in the **Azure portal** > **Azure Active Directory** > **Security** > **Conditional Access** > **Create new policy from template**.

Organizations not comfortable allowing Microsoft to create these policies can create them manually by copying the settings from **View policy summary** or use the linked articles to create policies themselves. 

:::image type="content" source="media/concept-conditional-access-policy-common/create-policy-from-template-identity.png" alt-text="Create a Conditional Access policy from a preconfigured template in the Azure portal." lightbox="media/concept-conditional-access-policy-common/create-policy-from-template-identity.png":::

> [!IMPORTANT]
> Conditional Access template policies will exclude only the user creating the policy from the template. If your organization needs to [exclude other accounts](../roles/security-emergency-access.md) open the policy and modify the excluded users and groups to include them. 
> 
> By default, each policy is created in [report-only mode](concept-conditional-access-report-only.md), we recommended organizations test and monitor usage, to ensure intended result, before turning each policy on.

- Identities
   - [Require multi-factor authentication for admins](howto-conditional-access-policy-admin-mfa.md)\*
   - [Securing security info registration](howto-conditional-access-policy-registration.md)
   - [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)\*
   - [Require multi-factor authentication for all users](howto-conditional-access-policy-all-users-mfa.md)\*
   - [Require multi-factor authentication for guest access](howto-policy-guest-mfa.md)
   - [Require multi-factor authentication for Azure management](howto-conditional-access-policy-azure-management.md)\*
   - [Require multi-factor authentication for risky sign-in](howto-conditional-access-policy-risk.md) **Requires Azure AD Premium P2**
   - [Require password change for high-risk users](howto-conditional-access-policy-risk-user.md) **Requires Azure AD Premium P2**
- Devices
   - [Require compliant or hybrid Azure AD joined device or multifactor authentication for all users](howto-conditional-access-policy-compliant-device.md)
   - [Block access for unknown or unsupported device platform](howto-policy-unknown-unsupported-device.md)
   - [No persistent browser session](howto-policy-persistent-browser-session.md)
   - [Require approved client apps or app protection](howto-policy-approved-app-or-app-protection.md)
   - [Require compliant or Hybrid Azure AD joined device for administrators](howto-conditional-access-policy-compliant-device-admin.md)
   - [Use application enforced restrictions for unmanaged devices](howto-policy-app-enforced-restriction.md)

> \* These four policies when configured together, provide similar functionality enabled by [security defaults](../fundamentals/concept-fundamentals-security-defaults.md).

### Other policies

* [Block access by location](howto-conditional-access-policy-location.md)
* [Block access except specific apps](howto-conditional-access-policy-block-access.md)

## Emergency access accounts

More information about emergency access accounts and why they're important can be found in the following articles: 

* [Manage emergency access accounts in Azure AD](../roles/security-emergency-access.md)
* [Create a resilient access control management strategy with Azure Active Directory](../authentication/concept-resilient-controls.md)

## Next steps

- [Simulate sign in behavior using the Conditional Access What If tool.](troubleshoot-conditional-access-what-if.md)

- [Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
