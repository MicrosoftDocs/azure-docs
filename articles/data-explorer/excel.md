---
title: 'Visualize data using the Azure Data Explorer connector for Microsoft Excel'
description: 'In this article, you learn how to use the Excel connector for Azure Data Explorer.'
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/20/2019

# Customer intent: As a data analyst, I want to understand how to visualize my Azure Data Explorer data in Excel.
---

# Visualize data using the Azure Data Explorer connector for Excel

Azure Data Explorer offers the ability to export query results to Excel using the Excel native connector. In addition, you can add a Kusto query language query as an Excel data source for additional calculations or visualizations.

Azure Data Explorer provides two options for connecting to data in Excel:
* Use the native connector, detailed in this article, in Excel to connect to the Azure Data Explorer cluster.
* Import a query from Azure Data Explorer

## Define Kusto query as Excel data source

1. Open **Microsoft Excel**.
1. In **Data** tab, select **Get Data** > **From Azure** > **From Azure Data Explorer**

    ![Get data from Azure Data Explorer](media/excel/get-data-from-adx.png)

1. In the **Azure Data Explorer (Kusto)** window complete the following fields and select **OK**.

    ![Azure Data Explorer (Kusto) window](media/excel/adx-connection-window.png)

    
    |Field   |Description |
    |---------|---------|
    |**Cluster**   |         |    
    |**Database**     |         |    
    |**Table name or Azure Data Explorer query**    |         | 

    
    **Advanced Options:**

     |Field   |Description |
    |---------|---------|
    |**Limit query result record number**     |         |    
    |**(Limit query result data size (bytes)**    |         |   
    |**Disable result-set truncation**    |         |      
    |**Additional Set statements (separated by semicolons)**    |         |   


