---
title: Visualize Remote Monitoring data using Power BI - Azure | Microsoft Docs 
description: This tutorial uses Power BI Desktop and Cosmos DB to integerate data from a Remote Monitoring solution into a customized visualization. This way users can build their own custom dashboards and share them out to users not on the solution. 
author: asdonald
manager: hegate
ms.author: asdonald
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 05/01/2018
ms.topic: conceptual
---

# Visualize Remote Monitoring data using Power BI

This tutorial will walk you through how to plug in your Remote Monitoring solution data from CosmosDB into Power BI. With this connection established, you can then create your own custom dashboards, and add them back onto your Remote Monitoring solution dashboard. This workstream allows for more specialized graphs to be created, in addition to the ones out of the box. You can then use this tutorial to integrate with other data streams or build custom dashboards to be consumed outside of your Remote Monitoring Solution. Building dashboards in Power BI means that you can also make each panel interact with one another as you select specific pieces. For example, you could have a filter that shows you only information about your simulated trucks and each piece of your dashboard would interact to show you only simulated truck information. If you would like to use a tool other than Power BI, you can also extend these steps to use your visualization tool of choice and hook into the Cosmos Database, or custom database if you've set one up. 

## Prerequisites

- You must have a Remote Monitoring solution currently running
- You must have access to [Azure Portal](https://portal.azure.com) and your subscription on which the IoT Hub and Solution are running
- You must have [Power BI desktop](https://powerbi.microsoft.com) installed, any version will do


## Information Needed from Azure Portal

1. Navigate to [Azure Portal](https://portal.azure.com) and sign-in if needed

2. On the left-hand panel, click Resource groups

    ![Side Panel Nav](./media/iot-accelerators-integrate-data-powerbi/side_panel.png)

3. Navigate to the Resource Group of which your Iot Solution is running on and click to be taken to that Resource Group's Overview page. 

4. On that overview page click the item, which has type "Azure Cosmos DB Account", you will then be taken to the overview page of the Cosmos DB stream for that IoT Solution.

    ![Resource Group](./media/iot-accelerators-integrate-data-powerbi/resource_groups.png)

5. On the panel to the left, click the "Keys" section and take note of the following values to be used in Power BI:

   - URI
   - Primary Key

     ![keys](./media/iot-accelerators-integrate-data-powerbi/keys.png)

## Setting up the Stream in Power BI
  
1. Open up the Power BI desktop app and click "Get Data" from the top-left corner. 

    ![Get Data](./media/iot-accelerators-integrate-data-powerbi/get_data.png)

2. When asked to enter data, choose to Search for "Azure Cosmos DB" and select this connector. This connector essentially pulls data straight from the cosmos database of your Azure IoT Solution
  
    ![Cosmos DB](./media/iot-accelerators-integrate-data-powerbi/cosmos_db.png)
  
3. Enter the information, which you have recorded above:

    * URI
    * Primary Key

4. Select all the tables to be imported into Power BI. This action will kick off the loading of the data. The longer your solution has been running, the longer it can take for the data to load (up to a few hours). 

    ![Import Tables](./media/iot-accelerators-integrate-data-powerbi/import_tables.png)

5. Once the data has finished loading, click "Edit Queries" on the top row of Power BI and expand all the tables by clicking the arrows in the yellow bar for each table. This will essentially expand to show all the columns. You will notice how data for things such as humidity, speed time, etc. are not of the correct type.

    ![New Column](./media/iot-accelerators-integrate-data-powerbi/new_column.png)
  
    For example, the data coming into Power BI was changed into UNIX time when it came in through the connector. To adjust for this conversion, going forward you can create a new column and use this equation to get it into date time format: 

    ```text
    #datetime(1970, 1, 1, 0, 0, 0) + #duration(0, 0, 0, [Document.device.msg.received]/1000)
    ```

    ![Updated Table](./media/iot-accelerators-integrate-data-powerbi/updated_table.png)
  
    Document.device.msg.received is just one of the columns with UNIX formatting and can be substituted with others that need conversion. 
  
    Other data points were converted to type String can be changed into Doubles or Int where appropriate using the same steps as above.

## Creating a dashboard

Once the stream has been connected, you are ready to create your personalized dashboards! The dashboard below is an example of taking the telemetry being emitted by our simulated devices, and showing different pivots around it such as: 

* Device Location on a map (right)
* Devices with their status and severity. (top left)
* Devices with rules in place, and if there are any alerts going off for them (bottom left)

![PowerBi Visualization](./media/iot-accelerators-integrate-data-powerbi/visual_data.png)

## Publishing the dashboard and refreshing the data

After you have successfully created your dashboards, we recommend that you [publish your Power BI dashboards](https://docs.microsoft.com/power-bi/desktop-upload-desktop-files) to share with others.

You'll also want to [refresh the data](https://docs.microsoft.com/power-bi/refresh-data) on the published dashboard to make sure that you have the latest data set.

## Next steps

In this article, you learned about how to visualize remote monitoring data using Power BI

For more information about customizing the Remote Monitoring solution, see:

* [Customizing the Remote Monitoring Solution UI](iot-accelerators-remote-monitoring-customize.md)
* [Developer Reference Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide)
* [Developer Troubleshooting Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Troubleshooting-Guide)

