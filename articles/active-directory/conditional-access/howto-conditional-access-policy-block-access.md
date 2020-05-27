---
title: Conditional Access - Block access - Azure Active Directory
description: Create a custom Conditional Access policy to 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/26/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, 

ms.collection: M365-identity-device-management
---
# Conditional Access: Block access

For organizations with a conservative cloud migration approach, the block all policy is an option that can be used. 

> [!CAUTION]
> Misconfiguration of a block policy can lead to organizations being locked out of the Azure portal.

Policies like these can have unintended side effects. Proper testing and validation are vital before enabling. Administrators should utilize tools such as [Conditional Access report-only mode](concept-conditional-access-report-only.md) and [the What If tool in Conditional Access](what-if-tool.md) when making changes.

## User exclusions

Conditional Access policies are powerful tools, we recommend excluding the following accounts from your policy:

* **Emergency access** or **break-glass** accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant take steps to recover access.
   * More information can be found in the article, [Manage emergency access accounts in Azure AD](../users-groups-roles/directory-emergency-access.md).
* **Service accounts** and **service principals**, such as the Azure AD Connect Sync Account. Service accounts are non-interactive accounts that are not tied to any particular user. They are normally used by back-end services allowing programmatic access to applications, but are also used to sign in to systems for administrative purposes. Service accounts like these should be excluded since MFA can't be completed programmatically. Calls made by service principals are not blocked by Conditional Access.
   * If your organization has these accounts in use in scripts or code, consider replacing them with [managed identities](../managed-identities-azure-resources/overview.md). As a temporary workaround, you can exclude these specific accounts from the baseline policy.

## Create a Conditional Access policy

The following steps will help create Conditional Access policies to block access to all apps except for [Office 365](concept-conditional-access-cloud-apps.md#office-365-preview) if users are not on a trusted network. These policies are put in to [Report-only mode](howto-conditional-access-report-only.md) to start so administrators can determine the impact they will have on existing users. When administrators are comfortable that the policies apply as they intend, they can switch them to **On**.

The first policy blocks access to all apps except for Office 365 applications if not on a trusted location.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions**, select the following options:
   1. Under **Include**, select **All cloud apps**.
   1. Under **Exclude**, select **Office 365 (preview)**, select **Select**, then select **Done**.
1. Under **Conditions**:
   1. Under **Conditions** > **Location**.
      1. Set **Configure** to **Yes**
      1. Under **Include**, select **Any location**.
      1. Under **Exclude**, select **All trusted locations**.
      1. Select **Done**.
   1. Under **Client apps (Preview)**, set **Configure** to **Yes**, and select **Done**, then **Done**.
1. Under **Access controls** > **Grant**, select **Block access**, then select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

A second policy is created below to require multi-factor authentication or a compliant device for users of Office 365.

1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **Select apps**, choose **Office 365 (preview)**, and select **Select**, then **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require multi-factor authentication** and **Require device to be marked as compliant** select **Select**.
   1. Ensure **Require all the selected controls** is selected.
   1. Select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
