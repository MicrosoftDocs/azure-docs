---
title: Enable data-aware security posture for Azure datastores - Microsoft Defender for Cloud
description: Learn how to enable data-aware security posture for Azure datastores in Microsoft Defender for Cloud to identify sensitive data and prevent data breaches.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: template-how-to-pattern
---

# Enable data-aware security posture

To help you protect against data breaches, you can enable data-aware security posture in Microsoft Defender for Cloud. Data-aware security posture identifies sensitive data in your Azure datastores. You'll get alerts when sensitive data is uploaded to your datastores, and you can use attack paths and the security explorer to see how sensitive data is exposed to risk.

## Prerequisites

Before you enable data-aware security posture, you must have the following:

- Subscription owner role
- 

## Enable Data-aware security posture in Defender CSPM for Azure subscriptions

To enable data-aware security posture for Azure subscriptions, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environmental settings**.
1. Select the relevant Azure subscription.
1. For the Defender for CSPM plan, select the **On** status.

    If Defender for CSPM is already on, select **Settings** in the Monitoring coverage column of the Defender CSPM plan and make sure that the Data security posture component is set to **On** status.

## Enable Data-aware security posture in Defender CSPM for AWS accounts

To enable data-aware security posture for AWS accounts, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environmental settings**.
1. Select the relevant AWS account.
1. For the Defender for CSPM plan, select the **On** status.

    If Defender for CSPM is already on, select **Settings** in the Monitoring coverage column of the Defender CSPM plan and make sure that the Data security posture component is set to **On** status.

<!-- 5. Next steps ------------------------------------------------------------------------

Required: Provide at least one next step and no more than three. Include some context so the 
customer can determine why they would click the link.
Add a context sentence for the following links.

-->

## Next steps
TODO: Add your next step link(s)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

-->