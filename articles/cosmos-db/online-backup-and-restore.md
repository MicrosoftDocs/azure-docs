---
title: Online backup and on-demand data restore in Azure Cosmos DB.
description: This article describes how automatic backup, on-demand data restore works. It also explains the difference between continuous and periodic backup modes. 
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/13/2020
ms.author: govindk
ms.reviewer: sngun

---

# Online backup and on-demand data restore in Azure Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All the backups are stored separately in a storage service, and those backups are globally replicated for resiliency against regional disasters. The automatic backups are helpful in scenarios when you accidentally delete or update your Azure Cosmos account, database, or container and later require the data recovery. There are two backup modes:

* **Periodic backup mode** - This mode is the default backup mode for all existing accounts. In this mode, backup is taken at a periodic interval and the data is restored by creating a request with the support team. In this mode, you configure a backup interval and retention for your account. The maximum retention period extends to a month. The minimum backup interval can be one hour.  To learn more, see the [Periodic backup mode]() article.

* **Continuous backup mode** (currently in public preview) – You choose this mode while creating the Azure Cosmos DB account. This mode allows you to do restore to any point of time within 30 days of window. To learn more, see the [Continuous backup mode]() article.

These options allow you to take automatic backups without affecting the performance or availability of the database operations. All the backups are stored separately in a storage service, that is accessible only to Azure Cosmos DB.  

> [!NOTE]
> If you configure a new account with continuous backup, you can do self-service restore via Azure portal, PowerShell, or CLI. If your account is configured in continuous mode, you can’t switch it back to periodic mode. Currently existing accounts with periodic backup mode can’t be changed into continuous mode.

## Next steps

Next you can learn about how to restore data from an Azure Cosmos account or learn how to migrate data to an Azure Cosmos account

* To make a restore request, contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
* [Use Cosmos DB change feed](change-feed.md) to move data to Azure Cosmos DB.
* [Use Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) to move data to Azure Cosmos DB.
