---
title: Conditional Access - Require MFA for administrators - Azure Active Directory
description: Create a custom Conditional Access policy to require administrators to perform multi-factor authentication

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 12/12/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: Require MFA for administrators

Accounts that are assigned administrative rights are targeted by attackers. Requiring multi-factor authentication (MFA) on those accounts is an easy way to reduce the risk of those accounts being compromised.

Microsoft recommends you require MFA on the following roles at a minimum:

* Global administrator
* SharePoint administrator
* Exchange administrator
* Conditional Access administrator
* Security administrator
* Helpdesk (Password) administrator
* Password administrator
* Billing administrator
* User administrator

Organizations can choose to include or exclude roles as they see fit.

## User exclusions

Conditional Access policies are powerful tools, we recommend excluding the following accounts from your policy:

* **Emergency access** or **break-glass** accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant take steps to recover access.
   * More information can be found in the article, [Manage emergency access accounts in Azure AD](../users-groups-roles/directory-emergency-access.md).
* **Service accounts** and **service principals**, such as the Azure AD Connect Sync Account. Service accounts are non-interactive accounts that are not tied to any particular user. They are normally used by back-end services and allow programmatic access to applications. Service accounts should be excluded since MFA can’t be completed programmatically.
   * If your organization has these accounts in use in scripts or code, consider replacing them with [managed identities](../managed-identities-azure-resources/overview.md). As a temporary workaround, you can exclude these specific accounts from the baseline policy.

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require those assigned administrative roles to perform multi-factor authentication.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **Directory roles (preview)** and choose the following roles at a minimum:
      * Global administrator
      * SharePoint administrator
      * Exchange administrator
      * Conditional Access administrator
      * Security administrator
      * Helpdesk administrator
      * Password administrator
      * Billing administrator
      * User administrator
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**, and select **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multi-factor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
