---
title: 'Tutorial: Get started analyze data with SQL pool' 
description: In this tutorial, you'll use the NYC Taxi sample data to explore SQL pool's analytic capabilities.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: tutorial
ms.date: 07/20/2020 
---

# Analyze data with SQL pools

Azure Synapse Analytics provides you with the capability to analyze data with SQL pool. In this tutorial, you'll use the NYC Taxi sample data to explore SQL pool's analytic capabilities.

## Link the NYC Taxi sample data into the SQLDB1 database

1. In Synapse Studio, navigate to the **Data** hub on the left.
1. Click **+**, then select **Browse samples**. This will open the **Sample center** and open the **Datasets** tab.
1. Select **NYC Taxi & Limousine Commission - yellow taxi trip records**. This dataset contains over 1.5 billion rows.
1. Click **Add dataset**
1. In the **Data** hub under **Linked** you will see a new data set in this location **Azure Blob Storage > Sample Datasets > nyc_tlc_yellow**   
1. On the card labeled **Query sample data**, select the SQL pool named **SQLDB1**.


## Explore the NYC Taxi data in the SQL pool

1. In Synapse Studio, go to the **Data** hub.
1. Go to **SQLDB1** > **Tables**. You'll see several tables loaded.
1. Right-click the **dbo.Trip** table and select **New SQL Script** > **Select TOP 100 Rows**.
1. Wait while a new SQL script is created and runs.
1. Notice that at the top of the SQL script **Connect to** is automatically set to the SQL pool called **SQLDB1**.
1. Replace the text of the SQL script with this code and run it.

    ```sql
    SELECT PassengerCount,
          SUM(TripDistanceMiles) as SumTripDistance,
          AVG(TripDistanceMiles) as AvgTripDistance
    FROM  dbo.Trip
    WHERE TripDistanceMiles > 0 AND PassengerCount > 0
    GROUP BY PassengerCount
    ORDER BY PassengerCount
    ```

    This query shows how the total trip distances and average trip distance relate to the number of passengers.
1. In the SQL script result window, change the **View** to **Chart** to see a visualization of the results as a line chart.



## Next steps

> [!div class="nextstepaction"]
> [Analyze using Spark](get-started-analyze-spark.md)

