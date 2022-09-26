---
title: Conditional Access - Require MFA for Azure management - Azure Active Directory
description: Create a custom Conditional Access policy to require multifactor authentication for Azure management tasks

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 08/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, davidspo

ms.collection: M365-identity-device-management
---
# Conditional Access: Require MFA for Azure management

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

Conditional Access policies are powerful tools, we recommend excluding the following accounts from your policy:

* **Emergency access** or **break-glass** accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant take steps to recover access.
   * More information can be found in the article, [Manage emergency access accounts in Azure AD](../roles/security-emergency-access.md).
* **Service accounts** and **service principals**, such as the Azure AD Connect Sync Account. Service accounts are non-interactive accounts that aren't tied to any particular user. They're normally used by back-end services allowing programmatic access to applications, but are also used to sign in to systems for administrative purposes. Service accounts like these should be excluded since MFA can't be completed programmatically. Calls made by service principals aren't blocked by Conditional Access.
   * If your organization has these accounts in use in scripts or code, consider replacing them with [managed identities](../managed-identities-azure-resources/overview.md). As a temporary workaround, you can exclude these specific accounts from the baseline policy.

## Template deployment

Organizations can choose to deploy this policy using the steps outlined below or using the [Conditional Access templates (Preview)](concept-conditional-access-policy-common.md#conditional-access-templates-preview). 

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require users who access the [Microsoft Azure Management](concept-conditional-access-cloud-apps.md#microsoft-azure-management) suite do multifactor authentication.

> [!CAUTION]
> Make sure you understand how Conditional Access works before setting up a policy to manage access to Microsoft Azure Management. Make sure you don't create conditions that could block your own access to the portal.

1. Sign in to the **Azure portal** as a Global Administrator, Security Administrator, or Conditional Access Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions** > **Include**, select **Select apps**, choose **Microsoft Azure Management**, and select **Select**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
