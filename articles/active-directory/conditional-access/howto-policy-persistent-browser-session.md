---
title: Require reauthentication with Conditional Access - Azure Active Directory
description: Create a custom Conditional Access policy requiring reauthentication

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 09/27/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Require reauthentication and disable browser persistence

Protect user access on unmanaged devices by preventing browser sessions from remaining signed in after the browser is closed and setting a sign-in frequency to 1 hour.

[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

[!INCLUDE [active-directory-policy-deploy-template](../../../includes/active-directory-policy-deploy-template.md)]

## Create a Conditional Access policy

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
1. Under **Conditions** > **Filter for devices**, set **Configure** to **Yes**. 
   1. Under **Devices matching the rule:**, set to **Include filtered devices in policy**.
   1. Under **Rule syntax** select the **Edit** pencil and paste the following expressing in the box, then select **Apply**. 
      1. device.trustType -ne "ServerAD" -or device.isCompliant -ne True
   1. Select **Done**.
1. Under **Access controls** > **Session**
   1. Select **Sign-in frequency**, specify **Periodic reauthentication**, and set the duration to **1** and the period to **Hours**.
   1. Select **Persistent browser session**, and set **Persistent browser session** to **Never persistent**.
   1. Select, **Select**
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
