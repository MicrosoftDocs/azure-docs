---
title: SQL Maintenance Window
description: Understand how Azure SQL Database and Managed Instance maintenance windows can be configured.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: how-to
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 01/26/2021
---
# Configure SQL maintenance window
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]


Configure the [SQL maintenance window](sql-maintenance-window.md) for an Azure SQL database or Azure SQL Managed Instance database during database creation or anytime after a database is created. 

All Azure SQL databases and Managed Instance databases are updated during the *default* maintenance window: 5PM to 8AM daily (local time of the Azure region the database is hosted in) to avoid peak business hours interruptions. If the default maintenance window is not the best time, select one of the other available maintenance windows that you can configure your databases or pools to use:

* **SQL_Default** window, 5PM to 8AM local time Mon-Sunday 
* **Weekday** window, 10PM to 6AM local time Monday to Thursday
* **Weekend** window, 10PM to 6AM local time Friday to Sunday


## Configure SQL maintenance window during database creation 

To configure the maintenance window when you create a database, set the desired **Maintenance window** on the **Additional settings** page. 

For step-by-step information on creating a new SQL database and setting the SQL maintenance window, see [Create an Azure SQL Database single database](single-database-create-quickstart.md).

   :::image type="content" source="media/sql-maintenance-window-configure/additional-settings.png" alt-text="Create database additional settings tab":::




## Configure SQL maintenance window for an existing database 

To configure the maintenance window for an existing database:

1. Navigate to the SQL database, elastic pool, or managed instance you want to set the maintenance window for.
1. In the **Settings** menu select **Maintenance**, then select the desired maintenance window.

   :::image type="content" source="media/sql-maintenance-window-configure/maintenance.png" alt-text="SQL database Maintenance page":::




## Next steps

- To learn more about SQL maintenance window, see [SQL maintenance window](sql-maintenance-window.md).
- For more information, see [SQL maintenance window FAQ](sql-maintenance-window-faq.yml).
- To learn about optimizing performance, see [Monitoring and performance tuning in Azure SQL Database and Azure SQL Managed Instance](monitor-tune-overview.md).
