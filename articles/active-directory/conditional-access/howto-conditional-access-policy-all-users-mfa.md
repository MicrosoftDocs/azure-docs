---
title: Conditional Access - Require MFA for all users - Azure Active Directory
description: Create a custom Conditional Access policy to require all users to perform multi-factor authentication

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/26/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: Require MFA for all users

As Alex Weinert, the Directory of Identity Security at Microsoft, mentions in his blog post [Your Pa$$word doesn't matter](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984):

> Your password doesn't matter, but MFA does! Based on our studies, your account is more than 99.9% less likely to be compromised if you use MFA.

The guidance in this article will help your organization create a balanced MFA policy for your environment.

## User exclusions

Conditional Access policies are powerful tools, we recommend excluding the following accounts from your policy:

* **Emergency access** or **break-glass** accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant take steps to recover access.
   * More information can be found in the article, [Manage emergency access accounts in Azure AD](../users-groups-roles/directory-emergency-access.md).
* **Service accounts** and **service principals**, such as the Azure AD Connect Sync Account. Service accounts are non-interactive accounts that are not tied to any particular user. They are normally used by back-end services allowing programmatic access to applications, but are also used to sign in to systems for administrative purposes. Service accounts like these should be excluded since MFA can't be completed programmatically. Calls made by service principals are not blocked by Conditional Access.
   * If your organization has these accounts in use in scripts or code, consider replacing them with [managed identities](../managed-identities-azure-resources/overview.md). As a temporary workaround, you can exclude these specific accounts from the baseline policy.

## Application exclusions

Organizations may have many cloud applications in use. Not all of those applications may require equal security. For example, the payroll and attendance applications may require MFA but the cafeteria probably doesn't. Administrators can choose to exclude specific applications from their policy.

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require All users to perform multi-factor authentication.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users**
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
   1. Under **Exclude**, select any applications that do not require multi-factor authentication.
1. Under **Conditions** > **Client apps (Preview)**, set **Configure** to **Yes**. Under **Select the client apps this policy will apply to** leave all defaults selected and select **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multi-factor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

### Named locations

Organizations may choose to incorporate known network locations known as **Named locations** to their Conditional Access policies. These named locations may include trusted IPv4 networks like those for a main office location. For more information about configuring named locations, see the article [What is the location condition in Azure Active Directory Conditional Access?](location-condition.md)

In the example policy above, an organization may choose to not require multi-factor authentication if accessing a cloud app from their corporate network. In this case they could add the following configuration to the policy:

1. Under **Assignments**, select **Conditions** > **Locations**.
   1. Configure **Yes**.
   1. Include **Any location**.
   1. Exclude **All trusted locations**.
   1. Select **Done**.
1. Select **Done**.
1. **Save** your policy changes.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
