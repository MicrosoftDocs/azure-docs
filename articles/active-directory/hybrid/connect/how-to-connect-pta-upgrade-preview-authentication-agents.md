---
title: Microsoft Entra Connect - Pass-through Authentication - Upgrade auth agents
description: This article describes how to upgrade your Microsoft Entra pass-through authentication configuration.
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.custom: seohack1
ms.collection: M365-identity-device-management
---

# Microsoft Entra pass-through authentication: Upgrade preview Authentication Agents

## Overview

This article is for customers using Microsoft Entra pass-through authentication through preview. We recently upgraded (and rebranded) the Authentication Agent software. You need to _manually_ upgrade preview Authentication Agents installed on your on-premises servers. This manual upgrade is a one-time action only. All future updates to Authentication Agents are automatic. The reasons to upgrade are as follows:

- The preview versions of Authentication Agents won't receive any further security or bug fixes.
- The preview versions of Authentication Agents can't be installed on other servers, for high availability.

## Check versions of your Authentication Agents

### Step 1: Check where your Authentication Agents are installed

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Follow these steps to check where your Authentication Agents are installed:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Hybrid Identity Administrator](../../roles/permissions-reference.md#hybrid-identity-administrator).
2. Browse to **Identity** > **Hybrid management** > **Microsoft Entra Connect** > **Connect sync**.
4. Select **Pass-through Authentication**. This blade lists the servers where your Authentication Agents are installed.

![[Microsoft Entra admin center](https://entra.microsoft.com) - Pass-through Authentication blade](./media/how-to-connect-pta-upgrade-preview-authentication-agents/pta8.png)

### Step 2: Check the versions of your Authentication Agents

To check the versions of your Authentication Agents, on each server identified in the preceding step, follow these instructions:

1. Go to **Control Panel -> Programs -> Programs and Features** on the on-premises server.
2. If there's an entry for "**Microsoft Entra Connect Authentication Agent**", you don't need to take any action on this server.
3. If there's an entry for "**Microsoft Entra application proxy Connector**", you need to manually upgrade on this server.

![Preview version of Authentication Agent](./media/how-to-connect-pta-upgrade-preview-authentication-agents/pta6.png)

## Best practices to follow before starting the upgrade

Before upgrading, ensure that you have the following items in place:

1. **Create cloud-only Global Administrator account**: Don’t upgrade without having a cloud-only Global Administrator account to use in emergency situations where your Pass-through Authentication Agents aren't working properly. Learn about [adding a cloud-only Global Administrator account](../../fundamentals/add-users.md). Doing this step is critical and ensures that you don't get locked out of your tenant.
2. **Ensure high availability**: If not completed previously, install a second standalone Authentication Agent to provide high availability for sign-in requests, using these [instructions](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability).

<a name='upgrading-the-authentication-agent-on-your-azure-ad-connect-server'></a>

## Upgrading the Authentication Agent on your Microsoft Entra Connect server

You need upgrade Microsoft Entra Connect before upgrading the Authentication Agent on the same server. Follow these steps on both your primary and staging Microsoft Entra Connect servers:

1. **Upgrade Microsoft Entra Connect**: Follow this [article](how-to-upgrade-previous-version.md) and upgrade to the latest Microsoft Entra Connect version.
2. **Uninstall the preview version of the Authentication Agent**: Download [this PowerShell script](https://aka.ms/rmpreviewagent) and run it as an Administrator on the server.
3. **Download the latest version of the Authentication Agent (versions 1.5.2482.0 or later)**: Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Hybrid Identity Administrator](../../roles/permissions-reference.md#hybrid-identity-administrator).  Browse to **Identity** > **Hybrid management** > **Microsoft Entra Connect** > **Connect sync**.

 Select **Pass-through Authentication -> Download agent**. Accept the [terms of service](https://aka.ms/authagenteula) and download the latest version of the Authentication Agent. You can also download the Authentication Agent from [here](https://aka.ms/getauthagent).
4. **Install the latest version of the Authentication Agent**: Run the executable downloaded in Step 3. Provide your tenant's Global Administrator credentials when prompted.
5. **Verify that the latest version has been installed**: As shown before, go to **Control Panel -> Programs -> Programs and Features** and verify that there's an entry for "**Microsoft Entra Connect Authentication Agent**".

> [!NOTE]
> If you check the Pass-through Authentication blade on the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Hybrid Identity Administrator](../../roles/permissions-reference.md#hybrid-identity-administrator). after completing the preceding steps, you'll see two Authentication Agent entries per server - one entry showing the Authentication Agent as **Active** and the other as **Inactive**. This is _expected_. The **Inactive** entry is automatically dropped after a few days.

## Upgrading the Authentication Agent on other servers

Follow these steps to upgrade Authentication Agents on other servers (where Microsoft Entra Connect isn't installed):

1. **Uninstall the preview version of the Authentication Agent**: Download [this PowerShell script](https://aka.ms/rmpreviewagent) and run it as an Administrator on the server.
2. **Download the latest version of the Authentication Agent (versions 1.5.2482.0 or later)**: Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Hybrid Identity Administrator](../../roles/permissions-reference.md#hybrid-identity-administrator) with your tenant's Global Administrator credentials. Select **Microsoft Entra ID -> Microsoft Entra Connect -> Pass-through Authentication -> Download agent**. Accept the terms of service and download the latest version.
3. **Install the latest version of the Authentication Agent**: Run the executable downloaded in Step 2. Provide your tenant's Global Administrator credentials when prompted.
4. **Verify that the latest version has been installed**: As shown before, go to **Control Panel -> Programs -> Programs and Features** and verify that there's an entry called **Microsoft Entra Connect Authentication Agent**.

> [!NOTE]
> If you check the Pass-through Authentication blade on the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Hybrid Identity Administrator](../../roles/permissions-reference.md#hybrid-identity-administrator) after completing the preceding steps, you'll see two Authentication Agent entries per server - one entry showing the Authentication Agent as **Active** and the other as **Inactive**. This is _expected_. The **Inactive** entry is automatically dropped after a few days.

## Next steps
- [**Troubleshoot**](tshoot-connect-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
