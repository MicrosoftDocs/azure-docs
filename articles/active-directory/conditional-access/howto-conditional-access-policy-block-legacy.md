---
title: Conditional Access - Block legacy authentication - Azure Active Directory
description: Create a custom Conditional Access policy to block legacy authentication protocols

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
# Conditional Access: Block legacy authentication

Due to the increased risk associated with legacy authentication protocols, Microsoft recommends that organizations block authentication requests using these protocols and require modern authentication.

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to block legacy authentication requests. This policy is put in to [Report-only mode](howto-conditional-access-report-only.md) to start so administrators can determine the impact they will have on existing users. When administrators are comfortable that the policy applies as they intend, they can switch to **On** or stage the deployment by adding specific groups and excluding others.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose any accounts that must maintain the ability to use legacy authentication. Exclude at least one account to prevent yourself from being locked out. If you do not exclude any account, you will not be able to create this policy.
   1. Select **Done**.
1. Under **Cloud apps or actions**, select **All cloud apps**.
   1. Select **Done**.
1. Under **Conditions** > **Client apps (preview)**, set **Configure** to **Yes**.
   1. Check only the boxes **Mobile apps and desktop clients** > **Other clients**.
   1. Select **Done**.
1. Under **Access controls** > **Grant**, select **Block access**.
   1. Select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)

[How to set up a multifunction device or application to send email using Office 365 and Microsoft 365](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-office-3)
