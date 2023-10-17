---
title: Require MFA for administrators with Conditional Access
description: Create a custom Conditional Access policy to require administrators to perform multifactor authentication

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/26/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Require MFA for administrators

Accounts that are assigned administrative rights are targeted by attackers. Requiring multifactor authentication (MFA) on those accounts is an easy way to reduce the risk of those accounts being compromised.

Microsoft recommends you require MFA on the following roles at a minimum, based on [identity score recommendations](../reports-monitoring/concept-identity-secure-score.md):

- Global Administrator
- Application Administrator
- Authentication Administrator
- Billing Administrator
- Cloud Application Administrator
- Conditional Access Administrator
- Exchange Administrator
- Helpdesk Administrator
- Password Administrator
- Privileged Authentication Administrator
- Privileged Role Administrator
- Security Administrator
- SharePoint Administrator
- User Administrator

Organizations can choose to include or exclude roles as they see fit.

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

[!INCLUDE [active-directory-policy-deploy-template](../../../includes/active-directory-policy-deploy-template.md)]

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require those assigned administrative roles to perform multifactor authentication. Some organizations may be ready to move to stronger authentication methods for their administrators. These organizations may choose to implement a policy like the one described in the article [Require phishing-resistant multifactor authentication for administrators](how-to-policy-phish-resistant-admin-mfa.md).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **Directory roles** and choose built-in roles like:

      - Global Administrator
      - Application Administrator
      - Authentication Administrator
      - Billing Administrator
      - Cloud Application Administrator
      - Conditional Access Administrator
      - Exchange Administrator
      - Helpdesk Administrator
      - Password Administrator
      - Privileged Authentication Administrator
      - Privileged Role Administrator
      - Security Administrator
      - SharePoint Administrator
      - User Administrator
   
      > [!WARNING]
      > Conditional Access policies support built-in roles. Conditional Access policies are not enforced for other role types including [administrative unit-scoped](../roles/admin-units-assign-roles.md) or [custom roles](../roles/custom-create.md).

   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts.
1. Under **Target resources** > **Cloud apps** > **Include**, select **All cloud apps**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
