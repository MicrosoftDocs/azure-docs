---
title: Export Log Analytics data to Power BI | Microsoft Docs
description: Power BI is a cloud based business analytics service from Microsoft that provides rich visualizations and reports for analysis of different sets of data.  This article describes how to configure import Log Analytics data into Power BI and configure it to automatically refresh.
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 83edc411-6886-4de1-aadd-33982147b9c3
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/17/2017
ms.author: bwren

---
# Use Log Analytics data in Power BI


[Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/) is a cloud based business analytics service from Microsoft that provides rich visualizations and reports for analysis of different sets of data.  You can combine data from different sources and share reports on the web and mobile devices.

This article provides details on importing Log Analytics data into Power BI and scheduling it to automatically refresh.  

## Overview

To import Log Analytics data into Power BI, you create a dataset in Power BI based on a log search query in Log Analytics.  The query is run each time the dataset is refreshed.  You can then build Power BI reports that use data from the dataset.

![Log Analytics to Power BI](media/log-analytics-powerbi/overview.png)

## Importing Log Analytics data into Power BI

To create the dataset in Power BI, you export your query from Log Analytics to [Power Query (M) language](https://msdn.microsoft.com/en-us/library/mt807488.aspx).  You then use this to create a query in Power BI Desktop and then publish it to Power BI as a dataset.  The details for this process are described below.

### Export query
Start by creating a [log search](log-analytics-log-search-new.md) that returns the data from Log Analytics that you want to populate the Power BI dataset.  You then export that query to [Power Query (M) language](https://msdn.microsoft.com/en-us/library/mt807488.aspx).

1. Create the log search in Log Analytics to extract the data for your dataset.
2. If you're using the log search portal, click **Power BI**.  If you're using the Analytics portal, select **Export** > **Power BI Query (M)**.  Both of these options export the query to a text file called **PowerBIQuery.txt**. 

    ![](media/log-analytics-powerbi/export-analytics.png) ![](media/log-analytics-powerbi/export-logsearch.png)

### Import query into Power BI Desktop
Power BI Desktop allows you to create datasets and reports that can be published to Power BI.  It allows you to create a query using the Power Query language export from Log Analytics. 

1. Install [Power BI Desktop](https://powerbi.microsoft.com/desktop/) if you don't already have it.
1. Open Power BI Desktop.
2. Select **Get Data** > **Blank Query** to open a new query.  Then select **Advanced Editor** and paste the contents of the exported file into the query. Click **Done**.

    ![](media/log-analytics-powerbi/desktop-new-query.png)

5. The query runs, and its results are displayed.  You may be prompted for credentials to connect to Azure.  Use **Organizational account** to logon with your Microsoft account.
6. Type in a descriptive name for the query.  The default is **Query1**. Click **Close and Apply** to add the dataset to the report.

    ![](media/log-analytics-powerbi/desktop-results.png)



### Publish to Power BI
When you publish to Power BI, a dataset and a report will be created.  If you create a report in Power BI Desktop, then this will be published with your data.  If not, then a blank report will be created.  You can modify the report in Power BI or create a new one based on the dataset.

8. Create a report based on your data.  When you're ready to send it to Power BI, click **Publish**.  When prompted, select a destination in your Power BI account.  Unless you have a specific destination, use **My workspace**.

    ![](media/log-analytics-powerbi/desktop-publish.png)

3. When the publishing completes, click **Open in Power BI** to open Power BI with your new dataset.


## Configure scheduled refresh
The dataset created in Power BI will have the same data that you were working with in Power BI Desktop.  You need to refresh the dataset periodically to run the query again and populate it with the latest data from Log Analytics.  

1. Click on the workspace where you uploaded your report and select the **Datasets** menu. Select the context menu next to your new dataset and select **Settings**. You should have a message that the credentials are invalid.  This is because you haven't provided credentials yet for the dataset to use when it refreshes its data.  Click **Edit credentials** and specify credentials with access to Log Analytics.

    ![](media/log-analytics-powerbi/powerbi-schedule.png)

5. Select the option to **Keep your data up to date** and optionally change the **Refresh frequency**.

    ![](media/log-analytics-powerbi/powerbi-schedule-refresh.png)

## Legacy workspaces
The following procedure describes how to import data into Power BI from a legacy Log Analytics workspace.  This is only for workspaces that haven't been upgraded to the new query language.

When you configure Power BI with Log Analytics, you create log queries that export their results to corresponding datasets in Power BI.  The query and export continues to automatically run on a schedule that you define to keep the dataset up to date with the latest data collected by Log Analytics.

![Log Analytics to Power BI](media/log-analytics-powerbi/overview-legacy.png)

### Power BI Schedules
A *Power BI Schedule* includes a log search that exports a set of data from the OMS repository to a corresponding dataset in Power BI and a schedule that defines how often this search is run to keep the dataset current.

The fields in the dataset will match the properties of the records returned by the log search.  If the search returns records of different types then the dataset will include all of the properties from each of the included record types.  

> [!NOTE]
> It is a best practice to use a log search query that returns raw data as opposed to performing any consolidation using commands such as [Measure](log-analytics-search-reference.md#measure).  You can perform any aggregation and calculations in Power BI from the raw data.
>
>

### Connecting OMS workspace to Power BI
Before you can export from Log Analytics to Power BI, you must connect your OMS workspace to your Power BI account using the following procedure.  

1. In the OMS console click the **Settings** tile.
2. Select **Accounts**.
3. In the **Workspace Information** section click **Connect to Power BI Account**.
4. Enter the credentials for your Power BI account.

### Create a Power BI Schedule
Create a Power BI Schedule for each dataset using the following procedure.

1. In the OMS console click the **Log Search** tile.
2. Type in a new query or select a saved search that returns the data that you want to export to **Power BI**.  
3. Click the **Power BI** button at the top of the page to open the **Power BI** dialog.
4. Provide the information in the following table and click **Save**.

| Property | Description |
|:--- |:--- |
| Name |Name to identify the schedule when you view the list of Power BI schedules. |
| Saved Search |The log search to run.  You can either select the current query or select an existing saved search from the dropdown box. |
| Schedule |How often to run the saved search and export to the Power BI dataset.  The value must be between 15 minutes and 24 hours. |
| Dataset Name |The name of the dataset in Power BI.  It will be created if it doesn’t exist and updated if it does exist. |

### Viewing and Removing Power BI Schedules
View the list of existing Power BI Schedules with the following procedure.

1. In the OMS console click the **Settings** tile.
2. Select **Power BI**.

In addition to the details of the schedule, the number of times that the schedule has run in the past week and the status of the last sync are displayed.  If the sync encountered errors, you can click the link to run a log search for records with details of the error.

You can remove a schedule by clicking on the **X** in the **Remove column**.  You can disable a schedule by selecting **Off**.  To modify a schedule you must remove it and recreate it with the new settings.

![Power BI Schedules](media/log-analytics-powerbi/schedules.png)

### Sample walkthrough
The following section walks through an example of creating a Power BI Schedule and using its dataset to create a simple report.  In this example, all performance data for a set of computers is exported to Power BI and then a line graph is created to display processor utilization.

#### Create log search
We start by creating a log search for the data that we want to send to the dataset.  In this example, we’ll use a query that returns all performance data for computers with a name that starts with *srv*.  

![Power BI Schedules](media/log-analytics-powerbi/walkthrough-query.png)

#### Create Power BI Search
We click the **Power BI** button to open the Power BI dialog and provide the required information.  We want this search to run once per hour and create a dataset called *Contoso Perf*.  Since we already have the search open that creates the data we want, we keep the default of *Use current search query* for **Saved Search**.

![Power BI search](media/log-analytics-powerbi/walkthrough-schedule.png)

#### Verify Power BI Search
To verify that we created the schedule correctly, we view the list of Power BI Searches under the **Settings** tile in the OMS dashboard.  We wait several minutes and refresh this view until it reports that the sync has been run.

![Power BI search](media/log-analytics-powerbi/walkthrough-schedules.png)

#### Verify the dataset in Power BI
We log into our account at [powerbi.microsoft.com](http://powerbi.microsoft.com/) and scroll to **Datasets** at the bottom of the left pane.  We can see that the *Contoso Perf* dataset is listed indicating that our export has run successfully.

![Power BI dataset](media/log-analytics-powerbi/walkthrough-datasets.png)

#### Create report based on dataset
We select the **Contoso Perf** dataset and then click on **Results** in the **Fields** pane on the right to view the fields that are part of this dataset.  To create a line graph showing processor utilization for each computer, we perform the following actions.

1. Select the Line chart visualization.
2. Drag **ObjectName** to **Report level filter** and check **Processor**.
3. Drag **CounterName** to **Report level filter** and check **% Processor Time**.
4. Drag **CounterValue** to **Values**.
5. Drag **Computer** to **Legend**.
6. Drag **TimeGenerated** to **Axis**.

We can see that the resulting line graph is displayed with the data from our dataset.

![Power BI line graph](media/log-analytics-powerbi/walkthrough-linegraph.png)

#### Save the report
We save the report by clicking on the Save button at the top of the screen and validate that it is now listed in the Reports section in the left pane.

![Power BI reports](media/log-analytics-powerbi/walkthrough-report.png)



## Next steps
* Learn about [log searches](log-analytics-log-searches.md) to build queries that can be exported to Power BI.
* Learn more about [Power BI](http://powerbi.microsoft.com) to build visualizations based on Log Analytics exports.
