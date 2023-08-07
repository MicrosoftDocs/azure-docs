---
title: Require MFA for Azure management with Conditional Access
description: Create a custom Conditional Access policy to require multifactor authentication for Azure management tasks

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Require MFA for Azure management

Organizations use many Azure services and manage them from Azure Resource Manager based tools like:

* Azure portal
* Azure PowerShell
* Azure CLI

These tools can provide highly privileged access to resources that can make the following changes: 

- Alter subscription-wide configurations 
- Service settings
- Subscription billing

To protect these privileged resources, Microsoft recommends requiring multifactor authentication for any user accessing these resources. In Azure AD, these tools are grouped together in a suite called [Microsoft Azure Management](concept-conditional-access-cloud-apps.md#microsoft-azure-management). For Azure Government, this suite should be the Azure Government Cloud Management API app. 

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

[!INCLUDE [active-directory-policy-deploy-template](../../../includes/active-directory-policy-deploy-template.md)]

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require users who access the [Microsoft Azure Management](concept-conditional-access-cloud-apps.md#microsoft-azure-management) suite do multifactor authentication.

> [!CAUTION]
> Make sure you understand how Conditional Access works before setting up a policy to manage access to Microsoft Azure Management. Make sure you don't create conditions that could block your own access to the portal.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Cloud apps** > **Include** > **Select apps**, choose **Microsoft Azure Management**, and select **Select**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)
