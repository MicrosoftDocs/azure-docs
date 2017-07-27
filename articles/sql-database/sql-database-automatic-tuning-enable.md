---
title: Enable automatic tuning for Azure SQL Database | Microsoft Docs
description: You can enable automatic tuning on your Azure SQL Database easily.
services: sql-database
documentationcenter: ''
author: vvasic
manager: drasumic
editor: vvasic

ms.assetid: 
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: NA
ms.date: 06/05/2016
ms.author: vvasic

---
# Enable automatic tuning

Azure SQL Database is an automatically managed data service that constantly monitors your queries and identifies the action that you can perform to improve performance of your workload. You can review recommendations and manually apply them, or let Azure SQL Database automatically apply corrective actions - this is known as **automatic tuning mode**. Automatic tuning can be enabled at the server or the database level.

## Enable automatic tuning on server

To enable automatic tuning on Azure SQL Database server, navigate to the server in Azure portal and then select **Automatic tuning** in the menu. Select the automatic tuning options you want to enable and select **Apply**:

![Server](./media/sql-database-automatic-tuning-enable/server.png)

Automatic tuning options on server are applied to all databases on the server. By default, all databases inherit the configuration from their parent server, but this can be overridden and specified for each database individually.

## Configure automatic tuning on database

The Azure portal enables you to individually specify the automatic tuning configuration on each database.

> [!NOTE]
> The general recommendation is to manage the automatic tuning configuration at server level so the same configuration settings can be applied on every database automatically. Configure automatic tuning on an individual database if the database is different that others on the same server.
>

To enable automatic tuning on a single database, navigate to the database in the Azure portal and then and select **Automatic tuning**. You can configure a single database to inherit the settings from the database by selecting the checkbox or you can specify the configuration for a database individually.

![Database](./media/sql-database-automatic-tuning-enable/database.png)

Once you have selected appropriate configuration, click **Apply**.

## Next steps
* Read the [Automatic tuning article](sql-database-automatic-tuning.md) to learn more about automatic tuning and how it can help you improve your performance.
* See [Performance recommendations](sql-database-advisor.md) for an overview of Azure SQL Database performance recommendations.
* See [Query Performance Insights](sql-database-query-performance.md) to learn about viewing the performance impact of your top queries.
