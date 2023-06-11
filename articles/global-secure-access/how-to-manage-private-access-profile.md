---
title: How to manage the Private access profile
description: Learn how to manage the Private access traffic forwarding profile for Microsoft Entra Private Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---

# How to enable the Private access profile

The private access traffic forwarding profile routes traffic to your private network through the Global Secure Access Client. Enabling this traffic forwarding profile allows remote workers to connect to internal resources without a VPN.

## Prerequisites

To enable the Microsoft 365 traffic forwarding profile for your tenant, you must have:

- A **Global Secure Access Administrator** role in Microsoft Entra ID

### Known limitations

- At this time, private access traffic can only be acquired with the Global Secure Access client. Remote networks can't be assigned to the Private access traffic forwarding profile.
- Tunneling traffic to Private Access destinations by IP address is supported only for IP ranges outside of the end-user device local subnet. 
- To tunnel network traffic based on rules of FQDNs (in the forwarding profile), DNS over HTTPS (Secure DNS) needs to be disabled. 

## Private access traffic forwarding profile

To enable the Private access traffic forwarding profile, we recommend you first configure Quick Access. Quick Access includes the IP addresses, IP ranges, and fully qualified domain names (FQDN) for the private resources you want to include in the policy. For more information, see [Configure Quick Access](how-to-configure-quick-access.md).

Because remote networks can't be assigned to the Private access traffic forwarding profile, you must install the Global Secure Access Client on your end-user devices. For more information, see [How to install the Windows client](how-to-install-windows-client.md).

### Private access Conditional Access policies

Conditional Access policies can be applied to your quick access applications. Applying Conditional Access policies provides more options for managing access to applications, sites, and services.

Conditional Access policies are created and applied to the quick access application in the **Protection** area of Microsoft Entra ID. For more information, see the article [Building a Conditional Access policy](../active-directory/conditional-access/concept-conditional-access-policies.md).

The following example creates a Conditional Access policy requiring multifactor authentication for your quick access applications.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Microsoft Entra ID** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Include**, and select **Select apps**.
   1. Choose your configured quick access application.
1. Under **Access controls** > **Grant**
   1. Select **Grant access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](../active-directory/conditional-access/howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Configure Quick Access](how-to-configure-quick-access.md)
- [Learn about traffic forwarding](concept-traffic-forwarding.md)