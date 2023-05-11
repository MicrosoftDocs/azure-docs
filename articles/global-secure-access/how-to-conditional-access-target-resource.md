---
title: Global Secure Access as a Conditional Access target resource
description: 

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/03/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Global Secure Access as a Conditional Access target resource

To control what users can access your compliant network 


1. Sign in to the **Azure portal** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target Resources** > **Netowrk Access (Preview)***.
   1. Choose **M365 traffic**.
1. Under **Access controls** > **Grant**.
   1. Select **Require multifactor authentication**, **Require device to be marked as compliant**, and **Require hybrid Azure AD joined device**
   1. **For multiple controls** select **Require one of the selected controls**.
   1. Select **Select**.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.
