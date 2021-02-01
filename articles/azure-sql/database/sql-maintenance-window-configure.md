---
title: Configure SQL maintenance window (Preview)
description: Learn how to set the time when planned maintenance should be performed on your Azure SQL databases, elastic pools, and managed instance databases.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.topic: how-to
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 01/26/2021
---
# Configure SQL maintenance window (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]


Configure the [SQL maintenance window (Preview)](sql-maintenance-window.md) for an Azure SQL database, elastic pool, or Azure SQL Managed Instance database during database creation or anytime after a database is created. 

The *SQL_default* maintenance window is 5PM to 8AM daily (local time of the Azure region the database is hosted in) to avoid peak business hours interruptions. If the default maintenance window is not the best time, select one of the other available maintenance windows:

* **SQL_Default** window, 5PM to 8AM local time Mon-Sunday 
* **Weekday** window, 10PM to 6AM local time Monday to Thursday
* **Weekend** window, 10PM to 6AM local time Friday to Sunday

SQL maintenance window is not available for every service level or in every region. For details on availability, see [SQL maintenance window availability](sql-maintenance-window.md#availability).

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
