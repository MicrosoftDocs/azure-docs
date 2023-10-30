---
title: Secure your resources with Conditional Access policy templates
description: Deploy recommended Conditional Access policies from easy to use templates.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 10/11/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth

ms.collection: M365-identity-device-management
---
# Conditional Access templates

Conditional Access templates provide a convenient method to deploy new policies aligned with Microsoft recommendations. These templates are designed to provide maximum protection aligned with commonly used policies across various customer types and locations. 

:::image type="content" source="media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png" alt-text="Screenshot that shows Conditional Access policies and templates in the Microsoft Entra admin center." lightbox="media/concept-conditional-access-policy-common/conditional-access-policies-azure-ad-listing.png":::

## Template categories

The 16 Conditional Access policy templates are organized into the following categories:

# [Secure foundation](#tab/secure-foundation)

Microsoft recommends these policies as the base for all organizations. We recommend these policies be deployed as a group.

- [Require multifactor authentication for admins](howto-conditional-access-policy-admin-mfa.md)
- [Securing security info registration](howto-conditional-access-policy-registration.md)
- [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)
- [Require multifactor authentication for admins accessing Microsoft admin portals](how-to-policy-mfa-admin-portals.md)
- [Require multifactor authentication for all users](howto-conditional-access-policy-all-users-mfa.md)
- [Require multifactor authentication for Azure management](howto-conditional-access-policy-azure-management.md)
- [Require compliant or Microsoft Entra hybrid joined device or multifactor authentication for all users](howto-conditional-access-policy-compliant-device.md)

# [Zero Trust](#tab/zero-trust)

These policies as a group help support a [Zero Trust architecture](/security/zero-trust/deploy/identity).

- [Require multifactor authentication for admins](howto-conditional-access-policy-admin-mfa.md)
- [Securing security info registration](howto-conditional-access-policy-registration.md)
- [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)
- [Require multifactor authentication for all users](howto-conditional-access-policy-all-users-mfa.md)
- [Require multifactor authentication for guest access](howto-policy-guest-mfa.md)
- [Require multifactor authentication for Azure management](howto-conditional-access-policy-azure-management.md)
- [Require multifactor authentication for risky sign-ins](howto-conditional-access-policy-risk.md) **Requires Microsoft Entra ID P2**
- [Require password change for high-risk users](howto-conditional-access-policy-risk-user.md) **Requires Microsoft Entra ID P2**
- [Block access for unknown or unsupported device platform](howto-policy-unknown-unsupported-device.md)
- [No persistent browser session](howto-policy-persistent-browser-session.md)
- [Require approved client apps or app protection policies](howto-policy-approved-app-or-app-protection.md)
- [Require compliant or Microsoft Entra hybrid joined device or multifactor authentication for all users](howto-conditional-access-policy-compliant-device.md)
- [Require multifactor authentication for admins accessing Microsoft admin portals](how-to-policy-mfa-admin-portals.md)

# [Remote work](#tab/remote-work)

These policies help secure organizations with remote workers.

- [Securing security info registration](howto-conditional-access-policy-registration.md)
- [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)
- [Require multifactor authentication for all users](howto-conditional-access-policy-all-users-mfa.md)
- [Require multifactor authentication for guest access](howto-policy-guest-mfa.md)
- [Require multifactor authentication for risky sign-ins](howto-conditional-access-policy-risk.md) **Requires Microsoft Entra ID P2**
- [Require password change for high-risk users](howto-conditional-access-policy-risk-user.md) **Requires Microsoft Entra ID P2**
- [Require compliant or Microsoft Entra hybrid joined device for administrators](howto-conditional-access-policy-compliant-device-admin.md)
- [Block access for unknown or unsupported device platform](howto-policy-unknown-unsupported-device.md)
- [No persistent browser session](howto-policy-persistent-browser-session.md)
- [Require approved client apps or app protection policies](howto-policy-approved-app-or-app-protection.md)
- [Use application enforced restrictions for unmanaged devices](howto-policy-app-enforced-restriction.md)

# [Protect administrator](#tab/protect-administrator)

These policies are directed at highly privileged administrators in your environment, where compromise might cause the most damage.

- [Require multifactor authentication for admins](howto-conditional-access-policy-admin-mfa.md)
- [Block legacy authentication](howto-conditional-access-policy-block-legacy.md)
- [Require multifactor authentication for Azure management](howto-conditional-access-policy-azure-management.md)
- [Require compliant or Microsoft Entra hybrid joined device for administrators](howto-conditional-access-policy-compliant-device-admin.md)
- [Require phishing-resistant multifactor authentication for administrators](how-to-policy-phish-resistant-admin-mfa.md)

# [Emerging threats](#tab/emerging-threats)

Policies in this category provide new ways to protect against compromise.

- [Require phishing-resistant multifactor authentication for administrators](how-to-policy-phish-resistant-admin-mfa.md)

---

Find these templates in the [Microsoft Entra admin center](https://entra.microsoft.com) > **Protection** > **Conditional Access** > **Create new policy from templates**. Select **Show more** to see all policy templates in each category.

:::image type="content" source="media/concept-conditional-access-policy-common/create-policy-from-template-identity.png" alt-text="Screenshot that shows how to create a Conditional Access policy from a preconfigured template in the Microsoft Entra admin center." lightbox="media/concept-conditional-access-policy-common/create-policy-from-template-identity.png":::

> [!IMPORTANT]
> Conditional Access template policies will exclude only the user creating the policy from the template. If your organization needs to [exclude other accounts](../roles/security-emergency-access.md), you will be able to modify the policy once they are created. You can find these policies in the [Microsoft Entra admin center](https://entra.microsoft.com) > **Protection** > **Conditional Access** > **Policies**. Select a policy to open the editor and modify the excluded users and groups to select accounts you want to exclude.

By default, each policy is created in [report-only mode](concept-conditional-access-report-only.md), we recommended organizations test and monitor usage, to ensure intended result, before turning on each policy.

Organizations can select individual policy templates and:

- View a summary of the policy settings.
- Edit, to customize based on organizational needs.
- Export the JSON definition for use in programmatic workflows.
   - These JSON definitions can be edited and then imported on the main Conditional Access policies page using the **Upload policy file** option.

## Other common policies

- [Block access by location](howto-conditional-access-policy-location.md)
- [Block access except specific apps](howto-conditional-access-policy-block-access.md)

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Next steps

- [Simulate sign in behavior using the Conditional Access What If tool.](troubleshoot-conditional-access-what-if.md)

- [Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
