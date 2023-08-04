---
title: Require multifactor authentication for Microsoft admin portals
description: Create a Conditional Access policy requiring multifactor authentication for admins accessing Microsoft admin portals.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Require multifactor authentication for admins accessing Microsoft admin portals

Microsoft recommends securing access to any Microsoft admin portals like Microsoft Entra, Microsoft 365, Exchange, and Azure. Using the [Microsoft Admin Portals (Preview)](concept-conditional-access-cloud-apps.md#microsoft-admin-portals-preview) app organizations can control interactive access to Microsoft admin portals.

> [!IMPORTANT]
> Microsoft Admin Poratls (preview) is not currently supported in Government clouds.

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Create a Conditional Access policy

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Protection** > **Conditional Access**.
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
1. Under **Target resources** > **Cloud apps** > **Include**, **Select apps**, select **Microsoft Admin Portals (Preview)**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require authentication strength**, select **Multifactor authentication**, then select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
