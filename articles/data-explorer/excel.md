---
title: 'Visualize data using the Azure Data Explorer connector for Microsoft Excel'
description: 'In this article, you learn how to use the Excel connector for Azure Data Explorer.'
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/04/2019

# Customer intent: As a data analyst, I want to understand how to visualize my Azure Data Explorer data in Excel.
---

# Visualize data using the Azure Data Explorer connector for Excel

Azure Data Explorer offers the ability to export query results to Excel using the Excel native connector. In addition, you can add a Kusto query as an Excel data source for additional calculations or visualizations.

Azure Data Explorer provides two options for connecting to data in Excel:
* Use the native connector, detailed in this article, in Excel to connect to the Azure Data Explorer cluster.
* Import a query from Azure Data Explorer

## Define Kusto query as Excel data source

1. Open **Microsoft Excel**.
1. Select **Get Data** > **From Azure** > **From Azure Data Explorer**

    ![Get data from Azure Data Explorer](media/excel/get-data-from-adx.png)

1. In the Azure Data Explorer (Kusto) window complete the following fields and select **OK**.

    ![Azure Data Explorer (Kusto) window](media/excel/adx-connection-window.png)

    
    |Field   |Description |Mandatory/Optional  |
    |---------|---------|---------|
    |Cluster   |         |    mandatory     |
    |Database     |         |    optional        |
    |Table name or Azure Data Explorer query    |         |  optional          |

    
    **Advanced Options:**

     |Field   |Description |Mandatory/Optional  |
    |---------|---------|---------|
    |Limit query result record number     |         |    optional        |
    |Limit query result data size (bytes)    |         |   optional         |
    |Disable result-set truncation    |         |      optional      |
    |Additional Set statements (separated by semicolons)     |         |   optional      |


## old content:

1. Create a query and run it in Azure Data Explorer Web UI. Check that the results are satisfactory.

1. Click on the **Query to Power BI** button in ?.

![alt text](./Images/KustoTools-PowerBI/step2.png "step2")

1. You should see the following notification:

![alt text](./Images/KustoTools-PowerBI/step3.png "step3")

1. In the **Data** tab in Excel click on **New Query** > **From Other Data Sources** -> **Blank Query**:

![alt text](./Images/KustoTools-Excel/ExcelMenu.png "ExcelMenu")

1. Click on the **Advanced Editor** menu item.

![alt text](./Images/KustoTools-Excel/AdvancedEditor.png "AdvancedEditor")

1. Paste the M query, previously stored in the clipboard, and select **Done**.

![alt text](./Images/KustoTools-PowerBI/step7.png "step7")

1. To authenticate, select **Edit Credentials**.

![alt text](./Images/KustoTools-PowerBI/step8.png "step8")

1. Select **Organizational account**, then **Sign-in**. Complete the sign-in process and connect.

![alt text](./Images/KustoTools-PowerBI/step9.png "step9")

1. Repeat the steps above to get more queries into the designer. Rename the queries to more meaningful names.

(10) Select **Close & Load**.

![alt text](./Images/KustoTools-PowerBI/step12.png "step12")

(11) Your data is now in Excel. Select **Refresh** to refresh the query.

![alt text](./Images/KustoTools-Excel/ExcelData.png "ExcelData")