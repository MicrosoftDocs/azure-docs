---
title: Step 6: Query Data | Microsoft Docs
description: Get Started Tutorial with Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: 'barbkess'

ms.assetid: EAAA63A0-1B4E-4A9F-B630-FE4F30B884C6
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 12/21/2016
ms.author: elbutter

---

# Step 6: Querying Data 

## Scan Query with Scaling

Let's get a good idea of how scaling affects the speed of your queries.

Before we begin, let's scale our operation down to 100 DWUs so we can get an idea of how one compute node might perform on its own.

1. Go to the portal and select your SQL Data Warehouse instance

2. Select scale in the SQL Data Warehouse blade. 

![Scale DW From portal](./media/sql-data-warehouse-get-started-tutorial/scale-dw.png)

3. Scale down the performance bar to 100 DWU and hit save.

![Scale and save](./media/sql-data-warehouse-get-started-tutorial/scale-and-save.png)

4. Wait for your scale operation to finish.

> [!NOTE]
> Please note, scaling operations **kill** your currently running queries and prevent new ones from being run.
>
 
5. Do a scan operation on the trip data, selecting the top million entries for all the columns. If you're eager
 to move on quickly, feel free to select fewer rows.

    ```sql
    SELECT TOP(1000000) * FROM dbo.[Trip]
    ```

Take note of the time it took to run this operation.

6. Scale up your instance to 400 DWU. Remember, each 100 DWU is adding another compute node to your Azure SQL Data Warehouse.

7. Run the query again! You should notice a significant difference. 

> [!NOTE]
> Azure SQL Data Warehouse is a Massively Parallel Processing (MPP) platform. Queries and
> operations that can parallelize work among various nodes experience the true power of
> Azure SQL Data Warehouse.
>

## Join Query with Statistics

1. Run a query that joins the Date table with the Trip table

    ```sql
    SELECT TOP (1000000) dt.[DayOfWeek]
    ,tr.[MedallionID]
    ,tr.[HackneyLicenseID]
    ,tr.[PickupTimeID]
    ,tr.[DropoffTimeID]
    ,tr.[PickupGeographyID]
    ,tr.[DropoffGeographyID]
    ,tr.[PickupLatitude]
    ,tr.[PickupLongitude]
    ,tr.[PickupLatLong]
    ,tr.[DropoffLatitude]
    ,tr.[DropoffLongitude]
    ,tr.[DropoffLatLong]
    ,tr.[PassengerCount]
    ,tr.[TripDurationSeconds]
    ,tr.[TripDistanceMiles]
    ,tr.[PaymentType]
    ,tr.[FareAmount]
    ,tr.[SurchargeAmount]
    ,tr.[TaxAmount]
    ,tr.[TipAmount]
    ,tr.[TollsAmount]
    ,tr.[TotalAmount]
    FROM [dbo].[Trip] as tr
    join
    dbo.[Date] as dt
    on tr.DateID = dt.DateID
    ```

As you might expect, the query takes much longer when you shuffle data among the nodes, especially in a join scenario like this.

2. Let's see how this differs when we create statistics on the column we're joining by running the following:

    ```sql
    CREATE STATISTICS [dbo.Date DateID stats] ON dbo.Date (DateID);
    CREATE STATISTICS [dbo.Trip DateID stats] ON dbo.Trip (DateID);
    ```

> [!NOTE]
> SQL DW does not automatically manage statistics for you. Statistics are important for query
> performance and it is highly recommended you create and update statistics.
> 
> **You will gain the most benefit by having statistics on columns involved in joins, columns
> used in the WHERE clause and columns found in GROUP BY.**
>

3. Run the query from Step 1 again and observe any performance differences. While the differences in
query performance will not be as drastic as scaling up, you should notice a discernable speed-up. 

## Next Steps

You're now ready to query and explore. Check out our best practices or tips.

If you're done exploring for the day, make sure to pause your instance! In production, you can experience enormous 
savings by pausing and scaling to meet your business needs.

![Pause](./media/sql-data-warehouse-get-started-tutorial/pause.png)

## Useful Readings

[Concurrency and Workload Management]

[Best practices for Azure SQL Data Warehouse]

[Query Monitoring]

[Top 10 Best Practices for Building a Large Scale Relational Data Warehouse]

[Migrating Data to Azure SQL Data Warehouse]







[Concurrency and Workload Management]: sql-data-warehouse-develop-concurrency.md#change-a-user-resource-class-example
[Best practices for Azure SQL Data Warehouse]: sql-data-warehouse-best-practices.md#hash-distribute-large-tables
[Query Monitoring]: sql-data-warehouse-manage-monitor.md/
[Top 10 Best Practices for Building a Large Scale Relational Data Warehouse]: https://blogs.msdn.microsoft.com/sqlcat/2013/09/16/top-10-best-practices-for-building-a-large-scale-relational-data-warehouse/
[Migrating Data to Azure SQL Data Warehouse]: https://blogs.msdn.microsoft.com/sqlcat/2016/08/18/migrating-data-to-azure-sql-data-warehouse-in-practice/
