---
title: Enable Automatic tuning for Azure SQL Database | Microsoft Docs
description: You can enable Automatic tuning on you Azure SQL Database easily.
services: sql-database
documentationcenter: ''
author: vvasic
manager: drasumic
editor: vvasic

ms.assetid: 
ms.service: sql-database
ms.custom: monitor and tune
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: NA
ms.date: 06/05/2016
ms.author: vvasic

---
# Enable Automatic tuning

Azure SQL Database is an automatically managed data service that constantly monitors your queries and identifies the action that you can perform to improve performance of your workload. You can review recommendation and manually apply them, or let Azure SQL Database automatically apply corrective actions, which is known as Automatic tuning mode. 

## Enable Automatic tuning on server

Enabling Automatic tuning on a database or entire server is very simple and it can be done through Azure Portal.  To enable Automatic tuning on Azure SQL Database server, navigate to a server in Azure Portal and select ‘Automatic tuning’ item in the menu. Then select automatic tuning options you want to enable and hit Apply:

![Server](./media/sql-database-enable-automatic-tuning/server.png)

Automatic tuning options on server are applied on all databases on the server. By default, all databases inherit the configuration from their parent server, but this can be overridden and specified for each database individually.

## Configure Automatic tuning on database

Azure portal enables you to override Automatic tuning configuration on every database.

> [!NOTE]
> General recommendation is to manage Automatic tuning configuration on server level so it can be applied on every database. Configure automatic tuning on individual database if the database is different that others on the same server.
>

To enable Automatic tuning on a single database, navigate to the database and select ‘Automatic tuning’. You can configure a single database to inherit the settings from the database, by checking the checkbox or you can specify the configuration for a database individually:

![Database](./media/sql-database-automatic-tuning-enable/database.png)

Once you have selected appropriate configuration click on apply button.

Next steps
* Read [Automatic tuning article](sql-database-automatic-tuning.md) to learn more about automatic tuning and how it can help you improve your performance
* See [Performance recommendations](sql-database-advisor.md) for an overview of Azure SQL Database performance recommendations.
* See [Query Performance Insights](sql-database-query-performance.md) to learn about viewing the performance impact of your top queries.