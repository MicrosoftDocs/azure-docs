---
title: Migrate from Basic, Standard, and Premium tiers to Azure Managed Redis
description: Learn how to migrate from Azure Cache for Redis Basic, Standard, and Premium tiers to Azure Managed Redis.
ms.date: 03/16/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Basic, Standard, or Premium instances, I want to migrate them to Azure Managed Redis.
---

# Migrate from Basic, Standard, and Premium tiers to Azure Managed Redis

This guide walks you through migrating your Azure Cache for Redis Basic, Standard, or Premium instances to Azure Managed Redis. The guide is organized into three phases:

[!INCLUDE [Redis migration agent skill](../includes/redis-migration-agent-skill.md)]

## 1. Understand the differences

Before migrating, review the key differences between Azure Cache for Redis Basic, Standard, and Premium tiers and Azure Managed Redis. Understanding the feature, SKU, and client application differences helps you plan effectively and choose the right Azure Managed Redis size and performance tier.

> [!div class="nextstepaction"]
> [Understand the differences](migrate-basic-standard-premium-understand.md)

## 2. Explore migration options

There are two migration paths to consider — switching over to a new Azure Managed Redis instance manually or using Azure migration tooling. Review the options and their trade-offs to choose the right approach for your scenario.

> [!div class="nextstepaction"]
> [Explore migration options](migrate-basic-standard-premium-options.md)

## 3. Plan execution

Based on the option you have chosen to perform migration, follow step-by-step instructions to create your new Azure Managed Redis instance, migrate your data, update your application, and validate the migration.

> [!div class="nextstepaction"]
> [Plan execution for self-service migration](migrate-basic-standard-premium-self-service.md)

> [!div class="nextstepaction"]
> [Plan migration with tooling](migrate-basic-standard-premium-with-tooling.md)

## Related content

- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)
- [Scale an Azure Managed Redis instance](../how-to-scale.md)
