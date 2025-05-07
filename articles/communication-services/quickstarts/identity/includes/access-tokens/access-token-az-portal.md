---
title: include file
description: include file
services: azure-communication-services
author: tophpalmer
manager: chpalm
ms.service: azure-communication-services
ms.subservice: identity
ms.date: 07/19/2021
ms.topic: include
ms.custom: include file
ms.author: chpalm
ms.custom: mode-other
---

## Prerequisites

- An [Azure Communication Services resource](../../../create-communication-resource.md).

## Create the access tokens

1. In the [Azure portal](https://portal.azure.com), navigate to the **Identities & User Access Tokens** blade in your Communication Services resource. 

2. Choose the scope of the access tokens. You can choose none, one, or multiple services. 

3. Select **Generate**.

   :::image type="content" source="../../media/quick-create-identity-choose-scopes.png" alt-text="Screenshot that shows the scopes of the identity and access tokens where you select Generate." lightbox="../../media/quick-create-identity-choose-scopes.png":::

   The system generates an identity and corresponding user access token.

4. Copy these strings and use them in the [sample apps](../../../../samples/overview.md) and other testing scenarios.

   :::image type="content" source="../../media/quick-create-identity-generated.png" alt-text="Screenshot that shows the identity and access tokens with expiration date" lightbox="../../media/quick-create-identity-generated.png":::
