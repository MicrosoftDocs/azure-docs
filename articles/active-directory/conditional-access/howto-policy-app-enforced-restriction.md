---
title: Conditional Access - Use application enforced restrictions for unmanaged devices
description: Create a custom Conditional Access policy for unmanaged devices

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
# Common Conditional Access policy: Use application enforced restrictions for unmanaged devices

Block or limit access to SharePoint, OneDrive, and Exchange content from unmanaged devices.

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

[!INCLUDE [active-directory-policy-deploy-template](../../../includes/active-directory-policy-deploy-template.md)]

## Create a Conditional Access policy

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts.
1. Under **Target resources** > **Cloud apps**, select the following options:
   1. Under **Include**, choose **Select apps**.
   1. Choose **Office 365**, then select **Select**.
1. Under **Access controls** > **Session**, select **Use app enforced restrictions**, then select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
