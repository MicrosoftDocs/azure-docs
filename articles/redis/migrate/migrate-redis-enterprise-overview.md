---
title: Migrate from Redis Enterprise to Azure Managed Redis
description: Learn how to migrate from Azure Cache for Redis Enterprise tier to Azure Managed Redis.
ms.date: 03/16/2026
ms.topic: concept-article
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis Enterprise
  - ✅ Azure Managed Redis

#customer intent: As a developer with Azure Cache for Redis Enterprise instances, I want to migrate them to Azure Managed Redis.
---

# Migrate from Redis Enterprise to Azure Managed Redis

This guide walks you through migrating your Azure Cache for Redis Enterprise instances to Azure Managed Redis. The guide is organized into three phases:

## 1. Understand the differences

Azure Managed Redis is built on the same Redis Enterprise software stack as Azure Cache for Redis Enterprise. Because the core software is the same, your existing applications require minimal changes. Review the key feature differences, SKU structure changes, and sizing guidance to plan effectively.

> [!div class="nextstepaction"]
> [Understand the differences](migrate-redis-enterprise-understand.md)

## 2. Explore migration options

There are two migration paths to consider — switching over to a new Azure Managed Redis instance manually or using Azure migration tooling. Review the options and their trade-offs to choose the right approach for your scenario.

> [!div class="nextstepaction"]
> [Explore migration options](migrate-redis-enterprise-options.md)

## 3. Plan execution

Based on the option you have chosen to perform migration, follow step-by-step instructions to create your new Azure Managed Redis instance, migrate your data, update your application, and validate the migration.

> [!div class="nextstepaction"]
> [Plan execution for self-service migration](migrate-redis-enterprise-self-service.md)

> [!div class="nextstepaction"]
> [Plan migration with tooling](migrate-redis-enterprise-with-tooling.md)

## Related content

- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)
- [Scale an Azure Managed Redis instance](../how-to-scale.md)
