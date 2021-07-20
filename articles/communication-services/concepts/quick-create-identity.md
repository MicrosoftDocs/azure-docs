---
title: Quickly create Azure Communication Services Identities
titleSuffix: An Azure Communication Services concept document
description: Learn how to use the Identities & Access Tokens tool in the Azure portal to use in samples and troubleshooting.
author: mikben

manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 07/19/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Quickly create Azure Communication Services access tokens

In the [Azure Portal](https://portal.azure.com) Communication Services extension, you can generate a Communication Services identity and access token. This reduces the time necessary to run one of the sample apps and enables you to skip creating an authentication service for simple samples. Note that this feature is intended for small-scale validation and testing scenarios and should not be used for production scenarios. For production code, please refer to the [creating access tokens quickstart](../quickstarts/access-tokens.md)

The tool showcases the behavior of the ```Identity SDK``` in a simple user experience. Tokens and identities that are created through this tool follow the same behaviors and rules as if they were created using the ```Identity SDK```.  For example, access tokens expire after 24 hours.

## Prerequisites

- An [Azure Communication Services resource](../quickstarts/create-communication-resource.md)

## Create the access tokens

In the [Azure Portal](https://portal.azure.com), navigate to the **Identities & User Access Tokens** blade within your Communication Services resource. 

Choose the scope of the access tokens. You can select none, one, or multiple. Click **Generate**.

You will see an identity and a user access token generated. You can copy these strings and use them in sample apps and websites.

## Next Steps

You may also want to:

 - [Learn about authentication](./authentication.md)
 - [Learn about client and server architecture](./client-and-server-architecture.md)
