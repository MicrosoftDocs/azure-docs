---
title: Frequently asked questions about Azure App Configuration | Microsoft Docs
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

# Frequently asked questions about Azure App Configuration

### How is App Configuration different from Key Vault?

Key Vault is the best place to store application secrets. It provides hardware-level encryption, granular access policies and management operations such as certificate rotation. App Configuration is designed for a distinct set of use cases: it helps developers externalize application settings and control feature availability. It simplifies the tasks of working with complex configuration data by supporting hierarchical namespace, labeling, extensive queries, batch retrieval, and specialized management UI. App Configuration is complementary to Key Vault and the two should be used side-by-side in most application deployments.

### Does App Configuration encrypt my data?

Yes, App Configuration encrypts all user data at rest and in transit.

### Does App Configuration support Azure Virtual Network (VNET)?

Not yet. VNET service endpoint is planned for general availability.

### How should I store configurations for multiple environments (test, staging, production, etc.)?

Currently you control who has access to App Configuration at the per-store level. You should use a separate store for each environment with different permission requirements. This gives you the best security isolation.

### What are the recommended ways to use App Configuration?

See [best practices](./howto-best-practices.md).

### How much does App Configuration cost?

The service is free to use during the public preview.

### How can I report an issue or give a suggestion?

You can reach us directly on [GitHub](https://github.com/Azure/AppConfiguration/issues).
