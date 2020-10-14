---
title: 'Tutorial: Get started with Azure Synapse Analytics - visualize workspace data with Power BI' 
description: In this tutorial, you'll learn how to create a Power BI workspace, link your Azure Synapse workspace, and create a Power BI data set that utilizes data in the Azure Synapse workspace. 
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: tutorial
ms.date: 07/20/2020 
---

# Visualize data with Power BI

In this tutorial, you'll learn how to create a Power BI workspace, link your Azure Synapse workspace, and create a Power BI data set that utilizes data in your Azure Synapse workspace. 

## Overview

From the NYC Taxi data, we created aggregated datasets in two tables:
- **nyctaxi.passengercountstats**
- **SQLDB1.dbo.PassengerCountStats**

You can link a Power BI workspace to your Azure Synapse workspace. This capability allows you to easily get data into your Power BI workspace. You can edit your Power BI reports directly in your Azure Synapse workspace.

### Create a Power BI workspace

1. Sign in to [powerbi.microsoft.com](https://powerbi.microsoft.com/).
1. Create a new Power BI workspace called **NYCTaxiWorkspace1**.

### Link your Azure Synapse workspace to your new Power BI workspace

1. In Synapse Studio, go to **Manage** > **Linked Services**.
1. Select **New** > **Connect to Power BI**, and then set these fields:

    |Setting | Suggested value | 
    |---|---|
    |**Name**|**NYCTaxiWorkspace1**|
    |**Workspace name**|**NYCTaxiWorkspace1**|

1. Select **Create**.

### Create a Power BI dataset that uses data in your Azure Synapse workspace

1. In Synapse Studio, go to **Develop** > **Power BI**.
1. Go to **NYCTaxiWorkspace1** > **Power BI datasets** and select **New Power BI dataset**.
1. Hover over the **SQLDB1** database and select **Download .pbids file**.
1. Open the downloaded **.pbids** file. Power BI desktop opens and automatically connects to **SQLDB1** in your Azure Synapse workspace.
1. If you see a dialog box appear called **SQL server database**:
    1. Select **Microsoft account**.
    1. Select **Sign in** and sign in to your account.
    1. Select **Connect**.
1. After the **Navigator** dialog box opens, check the **PassengerCountStats** table and select **Load**.
1. After the **Connection settings** dialog box appears, select **DirectQuery** > **OK**.
1. Select the **Report** button on the left side.
1. Add **Line chart** to your report.
    1. Drag the **PassengerCount** column to **Visualizations** > **Axis**.
    1. Drag the **SumTripDistance** and **AvgTripDistance** columns to **Visualizations** > **Values**.
1. On the **Home** tab, select **Publish**.
1. Select **Save** to save your changes.
1. Choose the file name **PassengerAnalysis.pbix**, and then select **Save**.
1. In **Select a destination**, choose **NYCTaxiWorkspace1**, and then click **Select**.
1. Wait for publishing to finish.

### Configure authentication for your dataset

1. Open [powerbi.microsoft.com](https://powerbi.microsoft.com/) and **Sign in**.
1. On the left side, under **Workspaces**, select the **NYCTaxiWorkspace1** workspace.
1. Inside that workspace, locate a dataset called **Passenger Analysis** and a report called **Passenger Analysis**.
1. Hover over the **PassengerAnalysis** dataset, select the ellipsis (...) button, and then select **Settings**.
1. In **Data source credentials**, set the **Authentication method** to **OAuth2**, and then select **Sign in**.

### Edit a report in Synapse Studio

1. Go back to Synapse Studio and select **Close and refresh**.
1. Go to the **Develop** hub.
1. Hover over **Power BI** and select the refresh the **Power BI reports** node.
1. Under **Power BI** you should see:
    * Under **NYCTaxiWorkspace1** > **Power BI datasets**, a new dataset called **PassengerAnalysis**.
    * Under **NYCTaxiWorkspace1** > **Power BI reports**, a new report called **PassengerAnalysis**.
1. Select the **PassengerAnalysis** report. The report opens and you can edit it directly within Synapse Studio.

## Monitor activities

1. In Synapse Studio, go to the **monitor** hub.
1. In this location, you can see a history of all the activities taking place in the workspace and which ones are active now.
1. Explore the **Pipeline runs**, **Apache Spark applications**, and **SQL requests** to see what you've already done in the workspace.

## Next steps

> [!div class="nextstepaction"]
> [Monitor](get-started-monitor.md)
                                 

