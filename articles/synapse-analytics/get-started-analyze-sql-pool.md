---
title: "Tutorial: Get started analyze data with dedicated SQL pools"
description: In this tutorial, use the NYC Taxi sample data to explore SQL pool's analytic capabilities.
author: whhender
ms.author: whhender
ms.reviewer: whhender, wiassaf
ms.date: 12/11/2024
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: tutorial
ms.custom: engagement-fy23
---

# Tutorial: Analyze data with dedicated SQL pools

In this tutorial, use the NYC Taxi data to explore a dedicated SQL pool's capabilities.

> [!div class="checklist"]
> * [Deploy a dedicated SQL pool]
> * [Load data into the pool]
> * [Explore the data you've loaded]

## Prerequisites

* This tutorial assumes you've completed the steps in the rest of the quickstarts. Specifically it uses the 'contosodatalake' resource created in [the Create a Synapse Workspace quickstart.](get-started-create-workspace.md#place-sample-data-into-the-primary-storage-account)

## Create a dedicated SQL pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **SQL pools** under **Analytics pools**.
1. Select **New**.
1. For **Dedicated SQL pool name** select `SQLPOOL1`.
1. For **Performance level** choose **DW100C**.
1. Select **Review + create** > **Create**. Your dedicated SQL pool will be ready in a few minutes.

Your dedicated SQL pool is associated with a SQL database that's also called `SQLPOOL1`.

1. Navigate to **Data** > **Workspace**.
1. You should see a database named **SQLPOOL1**. If you don't see it, select **Refresh**.

A dedicated SQL pool consumes billable resources as long as it's active. You can pause the pool later to reduce costs.

> [!NOTE] 
> When creating a new dedicated SQL pool (formerly SQL DW) in your workspace, the dedicated SQL pool provisioning page will open. Provisioning will take place on the logical SQL server.

## Load the NYC Taxi Data into SQLPOOL1

1. In Synapse Studio, navigate to the **Develop** hub, select the **+** button to add new resource, then create new SQL script.
1. Select the pool `SQLPOOL1` (pool created in [STEP 1](./get-started-create-workspace.md) of this tutorial) in **Connect to** drop down list above the script.
1. Enter the following code:

    ```sql
    IF NOT EXISTS (SELECT * FROM sys.objects O JOIN sys.schemas S ON O.schema_id = S.schema_id WHERE O.NAME = 'NYCTaxiTripSmall' AND O.TYPE = 'U' AND S.NAME = 'dbo')
    CREATE TABLE dbo.NYCTaxiTripSmall
        (
        [VendorID] bigint, 
        [store_and_fwd_flag] nvarchar(1) NULL, 
        [RatecodeID] float NULL, 
        [PULocationID] bigint NULL,  
        [DOLocationID] bigint NULL, 
        [passenger_count] float NULL, 
        [trip_distance] float NULL, 
        [fare_amount] float NULL, 
        [extra] float NULL, 
        [mta_tax] float NULL, 
        [tip_amount] float NULL, 
        [tolls_amount] float NULL, 
        [ehail_fee] float NULL, 
        [improvement_surcharge] float NULL, 
        [total_amount] float NULL, 
        [payment_type] float NULL, 
        [trip_type] float NULL, 
        [congestion_surcharge] float  NULL
        )
    WITH
        (
        DISTRIBUTION = ROUND_ROBIN,
         CLUSTERED COLUMNSTORE INDEX
         -- HEAP
        )
    GO

    COPY INTO dbo.NYCTaxiTripSmall
    (VendorID 1, store_and_fwd_flag 4, RatecodeID 5,  PULocationID 6 , DOLocationID 7,  
     passenger_count 8,trip_distance 9, fare_amount 10, extra 11, mta_tax 12, tip_amount 13, 
     tolls_amount 14, ehail_fee 15, improvement_surcharge 16, total_amount 17, 
     payment_type 18, trip_type 19, congestion_surcharge 20 )
    FROM 'https://contosolake.dfs.core.windows.net/users/NYCTripSmall.parquet'
    WITH
    (
        FILE_TYPE = 'PARQUET'
        ,MAXERRORS = 0
        ,IDENTITY_INSERT = 'OFF'
        ,AUTO_CREATE_TABLE ='ON'
    )
    ```

    >[!TIP]
    >If you get an error that reads `Login failed for user '<token-identified principal>'`, you need to set your Entra Id admin. 
    > 1. In the Azure Portal, search for your synapse workspace.
    > 1. Under **Settings** select **Microsoft Entra ID**.
    > 1. Select **Set admin** and set a Microsoft Entra ID admin.

1. Select the **Run** button to execute the script.
1. This script finishes in less than 60 seconds. It loads 2 million rows of NYC Taxi data into a table called `dbo.NYCTaxiTripSmall`.

## Explore the NYC Taxi data in the dedicated SQL pool

1. In Synapse Studio, go to the **Data** hub.
1. Go to **SQLPOOL1** > **Tables**. (If you don't see it in the menu, refresh the page.)
1. Right-click the **dbo.NYCTaxiTripSmall** table and select **New SQL Script** > **Select TOP 100 Rows**.
1. Wait while a new SQL script is created and runs.
1. At the top of the SQL script **Connect to** is automatically set to the SQL pool called **SQLPOOL1**.
1. Replace the text of the SQL script with this code and run it.

    ```sql
    SELECT passenger_count as PassengerCount,
          SUM(trip_distance) as SumTripDistance_miles,
          AVG(trip_distance) as AvgTripDistance_miles
    INTO dbo.PassengerCountStats
    FROM  dbo.NYCTaxiTripSmall
    WHERE trip_distance > 0 AND passenger_count > 0
    GROUP BY passenger_count;

    SELECT * FROM dbo.PassengerCountStats
    ORDER BY PassengerCount;
    ```

    This query creates a table `dbo.PassengerCountStats` with aggregate data from the `trip_distance` field, then queries the new table. The data shows how the total trip distances and average trip distance relate to the number of passengers.
1. In the SQL script result window, change the **View** to **Chart** to see a visualization of the results as a line chart. Change **Category column** to `PassengerCount`.

## Clean up

Pause your dedicated SQL Pool to reduce costs.

1. Navigate to **Manage** in your synapse workspace.
1. Select **SQL pools**.
1. Hover over SQLPOOL1 and select the **Pause** button.
1. Confirm to pause.

## Next step

> [!div class="nextstepaction"]
> [Analyze data in an Azure Storage account](get-started-analyze-storage.md)
