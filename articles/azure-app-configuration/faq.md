---
title: Azure App Configuration FAQ | Microsoft Docs
description: Frequently asked questions about Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: yegu
ms.custom: mvc
---

# Azure App Configuration FAQ

This article addresses frequently asked questions about Azure App Configuration.

## How is App Configuration different from Azure Key Vault?

App Configuration is designed for a distinct set of use cases: it helps developers manage application settings and control feature availability. It aims to simplify many of the tasks of working with complex configuration data.

App Configuration supports:

- Hierarchical namespaces
- Labeling
- Extensive queries
- Batch retrieval
- Specialized management operations
- A feature-management user interface

App Configuration is complementary to Key Vault, and the two should be used side by side in most application deployments.

## Should I store secrets in App Configuration?

Although App Configuration provides hardened security, Key Vault is still the best place for storing application secrets. Key Vault provides hardware-level encryption, granular access policies, and management operations, such as certificate rotation.

## Does App Configuration encrypt my data?

Yes. App Configuration encrypts all key values it holds, and it encrypts network communication. Key names are used as indexes for retrieving configuration data and aren't encrypted.

## How should I store configurations for multiple environments (test, staging, production, and so on)?

Currently you can control who has access to App Configuration at a per-store level. Use a separate store for each environment that requires different permissions. This approach gives you the best security isolation.

## What are the recommended ways to use App Configuration?

See [best practices](./howto-best-practices.md).

## How much does App Configuration cost?

The service is free to use during the public preview.

## How can I report an issue or give a suggestion?

You can reach us directly on [GitHub](https://github.com/Azure/AppConfiguration/issues).

## Next steps

* [About Azure App Configuration](./overview.md)
