---
title: 'Tutorial: Get started with Azure Synapse Analytics' 
description: In this tutorial, you'll learn the basic steps to set up and use Azure Synapse Analytics.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: tutorial
ms.date: 05/19/2020 
---

# Analyze data with SQL on-demand

## Analyze NYC Taxi data in Spark databases using SQL on-demand

Tables in Spark databases are automatically visible, and they can be queried by SQL on-demand.

1. In Synapse Studio, go to the **Develop** hub and create a new SQL script.
1. Set **Connect to** to **SQL on-demand**.
1. Paste the following text into the script and run the script.

    ```sql
    SELECT *
    FROM nyctaxi.dbo.passengercountstats
    ```

    > [!NOTE]
    > The first time you run a query that uses SQL on-demand, it takes about 10 seconds for SQL on-demand to gather the SQL resources needed to run your queries. Subsequent queries will be much faster.
  
