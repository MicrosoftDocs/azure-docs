---
title: Conditional Access - Block access by location - Azure Active Directory
description: Create a custom Conditional Access policy to block access to resources by IP location

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
# Conditional Access: Block access by location

With the location condition in Conditional Access, you can control access to your cloud apps based on the network location of a user. The location condition is commonly used to block access from countries where your organization knows traffic should not come from.

## Define locations

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**.
1. Choose **New location**.
1. Give your location a name.
1. Choose **IP ranges** if you know the specific externally accessible IPv4 address ranges that make up that location or **Countries/Regions**.
   1. Provide the **IP ranges** or select the **Countries/Regions** for the location you are specifying.
      * If you choose Countries/Regions, you can optionally choose to include unknown areas.
1. Choose **Save**

More information about the location condition in Conditional Access can be found in the article, 
[What is the location condition in Azure Active Directory Conditional Access](location-condition.md)

## Create a Conditional Access policy

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users**.
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**, and select **Done**.
1. Under **Conditions** > **Location**.
   1. Set **Configure** to **Yes**
   1. **Include** select **Selected locations**
   1. Select the blocked location you created for your organization.
   1. Click **Select** > **Done** > **Done**.
1. Under **Access controls** > **Block**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
