---
title: include file
description: include file
services: azure-communication-services
author: jrissam
manager: chpalm
ms.service: azure-communication-services
ms.subservice: identity
ms.date: 09/03/2024
ms.topic: include
ms.custom: include file
ms.author: jrissam
ms.custom: mode-other
---

## Prerequisites

- An [Azure Communication Services resource](../../../create-communication-resource.md)

## Create the access tokens

In the [Azure portal](https://portal.azure.com), navigate to the **Identities & User Access Tokens** tab under the **Settings** option in the left side menu within your Communication Services resource. 

Choose the scope of the access tokens. You can select none, one, or multiple. Click **Generate**.

![Select the scopes of the identity and access tokens.](../../media/quick-create-identity-choose-scopes-new.png)

You'll see an identity and corresponding user access token generated. You can copy these strings and use them in the [sample apps](../../../../samples/overview.md) and other testing scenarios.

![The identity and access tokens are generated and show the expiration date.](../../media/quick-create-identity-generated-new.png) 
