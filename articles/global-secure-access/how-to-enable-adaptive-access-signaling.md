---
title: Enable adaptive access Global Secure Access signaling
description: Adaptive access toggle for Global Secure Access signaling.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 05/23/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Enable adaptive access Global Secure Access signaling

To enable the required setting to allow for source IP restoration and compliant network checks, an administrator must take the following steps.

1. Sign in to the **Microsoft Entra admin center** as a Global Secure Access Administrator.
1. Browse to **Global Secure Access** > **Global settings** > **Session management** > **Adaptive Access**.
1. Select the toggle to **Enable Network Access signaling in Conditional Access**.

This functionality allows services like Microsoft Graph, Microsoft Entra ID, SharePoint Online, and Exchange Online to see the actual source IP address.

:::image type="content" source="media/how-to-source-ip-restoration/toggle-enable-signaling-in-conditional-access.png" alt-text="Screenshot showing the toggle to enable signaling in Conditional Access.":::

> [!CAUTION]
> If your organization has active Conditional Access policies based on IP location checks, and you disable Global Secure Access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable this feature, first delete any corresponding Conditional Access policies. 