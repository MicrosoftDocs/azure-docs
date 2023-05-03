---
title: Conditional Access templates
description: Deploy commonly used Conditional Access policies with templates

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 11/29/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Conditional Access templates (Preview)

Conditional Access templates provide a convenient method to deploy new policies aligned with Microsoft recommendations. These templates are designed to provide maximum protection aligned with commonly used policies across various customer types and locations.

:::image type="content" source="media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png" alt-text="Conditional Access policies and templates in the Azure portal." lightbox="media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png":::

There are 14 Conditional Access policy templates, filtered by five different scenarios: 

- Secure foundation
- Zero Trust
- Remote work
- Protect administrators
- Emerging threats
- All 

Find the templates in the **Azure portal** > **Azure Active Directory** > **Security** > **Conditional Access** > **New policy from template (Preview)**. Select **Show more** to see all policy templates in each scenario.

:::image type="content" source="media/concept-conditional-access-policy-common/create-policy-from-template-identity.png" alt-text="Create a Conditional Access policy from a preconfigured template in the Azure portal." lightbox="media/concept-conditional-access-policy-common/create-policy-from-template-identity.png":::

> [!IMPORTANT]
> Conditional Access template policies will exclude only the user creating the policy from the template. If your organization needs to [exclude other accounts](../roles/security-emergency-access.md), you will be able to modify the policy once they are created. Simply navigate to **Azure portal** > **Azure Active Directory** > **Security** > **Conditional Access** > **Policies**, select the policy to open the editor and modify the excluded users and groups to select accounts you want to exclude.
> 
> By default, each policy is created in [report-only mode](concept-conditional-access-report-only.md), we recommended organizations test and monitor usage, to ensure intended result, before turning each policy on.

Organizations can select individual policy templates and:

- View a summary of the policy settings.
- Edit, to customize based on organizational needs.
- Export the JSON definition for use in programmatic workflows.
   - These JSON definitions can be edited and then imported on the main Conditional Access policies page using the **Import policy file** option.

## Conditional Access template policies

- [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)\*
- [Require multifactor authentication for admins](howto-conditional-access-policy-admin-mfa.md)\*
- [Require multifactor authentication for all users](howto-conditional-access-policy-all-users-mfa.md)\*
- [Require multifactor authentication for Azure management](howto-conditional-access-policy-azure-management.md)\*

> \* These four policies when configured together, provide similar functionality enabled by [security defaults](../fundamentals/concept-fundamentals-security-defaults.md).

- [Block access for unknown or unsupported device platform](howto-policy-unknown-unsupported-device.md)
- [No persistent browser session](howto-policy-persistent-browser-session.md)
- [Require approved client apps or app protection](howto-policy-approved-app-or-app-protection.md)
- [Require compliant or hybrid Azure AD joined device or multifactor authentication for all users](howto-conditional-access-policy-compliant-device.md)
- [Require compliant or Hybrid Azure AD joined device for administrators](howto-conditional-access-policy-compliant-device-admin.md)
- [Require multifactor authentication for risky sign-in](howto-conditional-access-policy-risk.md) **Requires Azure AD Premium P2**
- [Require multifactor authentication for guest access](howto-policy-guest-mfa.md)
- [Require password change for high-risk users](howto-conditional-access-policy-risk-user.md) **Requires Azure AD Premium P2**
- [Securing security info registration](howto-conditional-access-policy-registration.md)
- [Use application enforced restrictions for unmanaged devices](howto-policy-app-enforced-restriction.md)

## Other common policies

- [Block access by location](howto-conditional-access-policy-location.md)
- [Block access except specific apps](howto-conditional-access-policy-block-access.md)

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Next steps

- [Simulate sign in behavior using the Conditional Access What If tool.](troubleshoot-conditional-access-what-if.md)

- [Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
