---
title: Require MFA for all users with Conditional Access - Azure Active Directory
description: Create a custom Conditional Access policy to require all users do multifactor authentication

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 08/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Require MFA for all users

As Alex Weinert, the Directory of Identity Security at Microsoft, mentions in his blog post [Your Pa$$word doesn't matter](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Your-Pa-word-doesn-t-matter/ba-p/731984):

> Your password doesn't matter, but MFA does! Based on our studies, your account is more than 99.9% less likely to be compromised if you use MFA.

The guidance in this article will help your organization create an MFA policy for your environment.

[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Application exclusions

Organizations may have many cloud applications in use. Not all of those applications may require equal security. For example, the payroll and attendance applications may require MFA but the cafeteria probably doesn't. Administrators can choose to exclude specific applications from their policy.

### Subscription activation

Organizations that use [Subscription Activation](/windows/deployment/windows-10-subscription-activation) to enable users to “step-up” from one version of Windows to another, may want to exclude the Universal Store Service APIs and Web Application, AppID 45a330b1-b1ec-4cc1-9161-9f03992aa49f from their all users all cloud apps MFA policy.

[!INCLUDE [active-directory-policy-deploy-template](../../../includes/active-directory-policy-deploy-template.md)]

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require all users do multifactor authentication.

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
   1. Under **Exclude**, select any applications that don't require multifactor authentication.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### Named locations

Organizations may choose to incorporate known network locations known as **Named locations** to their Conditional Access policies. These named locations may include trusted IPv4 networks like those for a main office location. For more information about configuring named locations, see the article [What is the location condition in Azure Active Directory Conditional Access?](location-condition.md)

In the example policy above, an organization may choose to not require multifactor authentication if accessing a cloud app from their corporate network. In this case they could add the following configuration to the policy:

1. Under **Assignments**, select **Conditions** > **Locations**.
   1. Configure **Yes**.
   1. Include **Any location**.
   1. Exclude **All trusted locations**.
   1. Select **Done**.
1. Select **Done**.
1. **Save** your policy changes.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
