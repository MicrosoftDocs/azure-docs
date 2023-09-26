---
title: Migrate a classic Conditional Access policy 
description: This article shows how to migrate a classic Conditional Access policy.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 09/21/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: nigu

ms.collection: M365-identity-device-management
---
# Migrate from a classic policy

This article shows an example of how to migrate a classic policy that requires **Multifactor authentication** for a cloud app.

![Classic policy details requiring MFA for Salesforce app](./media/policy-migration/33.png)

> [!WARNING]
> Once disabled a classic policy can't be re-enabled.

## Open a classic policy

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select, **Classic policies**.

   ![Classic policies view](./media/policy-migration-mfa/12.png)

1. In the list of classic policies, select the policy you wish to migrate. Document the configuration settings so that you can re-create with a new Conditional Access policy.

For examples of common policies and their configuration, see the article [Common Conditional Access policies](concept-conditional-access-policy-common.md).

## Disable the classic policy

To disable your classic policy, select **Disable** in the **Details** view.

> [!WARNING]
> Once disabled a classic policy can't be re-enabled.

![Disable classic policies](./media/policy-migration-mfa/14.png)

## Next steps

- [Use report-only mode for Conditional Access to determine the impact of new policy decisions.](concept-conditional-access-report-only.md)
