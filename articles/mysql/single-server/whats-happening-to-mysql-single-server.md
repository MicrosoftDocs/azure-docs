---
title: What's happening to Azure Database for MySQL Single Server?
description: The Azure Database for MySQL Single Server service is being deprecated.
ms.service: mysql
ms.subservice: single-server
ms.topic: overview
author: markingmyname
ms.author: maghan
ms.reviewer: 
ms.custom: deprecation
ms.date: 09/15/2022
---

# What's happening to Azure Database for MySQL - Single Server?

Hello! We have news to share - **Azure Database for MySQL - Single Server is on the retirement path**.

After years of evolving the Azure Database for MySQL - Single Server service, it can no longer handle all the new features, functions, and security needs. We recommend upgrading to Azure Database for MySQL - Flexible Server. 

Azure Database for MySQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit **[Azure Database for MySQL - Flexible Server](../flexible-server/overview.md)**.

If you currently have an Azure Database for MySQL - Single Server service hosting production servers, we're glad to let you know that you can migrate your Azure Database for MySQL - Single Server servers to the Azure Database for MySQL - Flexible Server service.

However, we know change can be disruptive to any environment, so we want to help you with this transition. Review the different ways using the Azure Data Migration Service to [migrate from Azure Database for MySQL - Single Server to MySQL - Flexible Server.](#migrate-from-single-server-to-flexible-server)

## Migrate from Single Server to Flexible Server

Learn how to migrate from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server using the Azure Database Migration Service (DMS).

| Scenario | Tool(s) | Details | 
|----------|---------|---------|
| Offline | Database Migration Service (DMS) and the Azure portal | [Tutorial: DMS with the Azure portal (offline)](../../dms/tutorial-mysql-azure-single-to-flex-offline-portal.md) |
| Online | Database Migration Service (DMS) and the Azure portal | [Tutorial: DMS with the Azure portal (online)](../../dms/tutorial-mysql-Azure-single-to-flex-online-portal.md) |

For more information on migrating from Single Server to Flexible Server, visit [Select the right tools for migration to Azure Database for MySQL](../migrate/how-to-decide-on-right-migration-tools.md).

## Migration Eligibility

To upgrade to Azure Database for MySQL Flexible Server, it's important to know when you're eligible to migrate your single server. Find the migration eligibility criteria in the below table.

| Single Server configuration not supported for migration | How and when to migrate? |
|---------------------------------------------------------|--------------------------|
| Single servers with Private Link enabled | Private Link for flexible servers will be released by Q2 2023, post, which you can migrate your single server. Additionally, you can choose to migrate now and so perform VNet injection via a point-in-time restore operation to move to private access network connectivity method. |
| Single servers with Cross-Region Read Replicas enabled | Cross-Region Read Replicas for flexible servers will be released by Q4 2022 (for paired region) and Q1 2023 (for any cross-region), post, which you can migrate your single server. |
| Single server deployed in regions where flexible server isn't supported (Learn more about regions here) | Azure Database Migration Service (DMS) supports cross-region migration. Deploy your target flexible server in a suitable region and migrate using DMS. |

> [!Warning]
> This article is not for Azure Database for MySQL - Flexible Server users. It is for Azure Database for MySQL - Single Server customers who need to upgrade to MySQL - Flexible Server.

Visit the **[FAQ](../../dms/faq-mysql-single-to-flex.md)** for information about using the Azure Database Migration Service (DMS) for Azure Database for MySQL - Single Server to Flexible Server migrations.

We know migrating services can be a frustrating experience, and we apologize in advance for any inconvenience this might cause you. You can choose what scenario best works for you and your environment.

## Next steps

- [Frequently Asked Questions](../../dms/faq-mysql-single-to-flex.md)
- [Select the right tools for migration to Azure Database for MySQL](../migrate/how-to-decide-on-right-migration-tools.md)