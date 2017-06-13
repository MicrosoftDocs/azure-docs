---
title: Export to Power BI from Application Insights | Microsoft Docs
description: Analytics queries can be displayed in Power BI.
services: application-insights
documentationcenter: ''
author: noamben
manager: carmonm

ms.assetid: 7f13ea66-09dc-450f-b8f9-f40fdad239f2
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 10/18/2016
ms.author: cfreeman

---
# Feed Power BI from Application Insights
[Power BI](http://www.powerbi.com/) is a suite of business analytics tools that help you analyze data and share insights. Rich dashboards are available on every device. You can combine data from many sources, including Analytics queries from [Azure Application Insights](app-insights-overview.md).

There are three recommended methods of exporting Application Insights data to Power BI. You can use them separately or together.

* [**Power BI adapter**](#power-pi-adapter) - set up a complete dashboard of telemetry from your app. The set of charts is predefined, but you can add your own queries from any other sources.
* [**Export Analytics queries**](#export-analytics-queries) - write any query you want using Analytics, and export it to Power BI. You can place this query on a dashboard along with any other data.
* [**Continuous export and Stream Analytics**](app-insights-export-stream-analytics.md) - This involves more work to set up. It is useful if you want to keep your data for long periods. Otherwise, the other methods are recommended.

## Power BI adapter
This method creates a complete dashboard of telemetry for you. The initial data set is predefined, but you can add more data to it.

### Get the adapter
1. Sign in to [Power BI](https://app.powerbi.com/).
2. Open **Get Data**, **Services**, **Application Insights**
   
    ![Get from Application Insights data source](./media/app-insights-export-power-bi/power-bi-adapter.png)
3. Provide the details of your Application Insights resource.
   
    ![Get from Application Insights data source](./media/app-insights-export-power-bi/azure-subscription-resource-group-name.png)
4. Wait a minute or two for the data to be imported.
   
    ![Power BI adapter](./media/app-insights-export-power-bi/010.png)

You can edit the dashboard, combining the Application Insights charts with those of other sources, and with Analytics queries. There's a visualization gallery where you can get more charts, and each chart has a parameters you can set.

After the initial import, the dashboard and the reports continue to update daily. You can control the refresh schedule on the dataset.

## Export Analytics queries
This route allows you to write any Analytics query you like, and then export that to a Power BI dashboard. (You can add to the dashboard created by the adapter.)

### One time: install Power BI Desktop
To import your Application Insights query, you use the desktop version of Power BI. But then you can publish it to the web or to your Power BI cloud workspace. 

Install [Power BI Desktop](https://powerbi.microsoft.com/en-us/desktop/).

### Export an Analytics query
1. [Open Analytics and write your query](app-insights-analytics-tour.md).
2. Test and refine the query until you're happy with the results.

   **Make sure that the query runs correctly in Analytics before you export it.**
3. On the **Export** menu, choose **Power BI (M)**. Save the text file.
   
    ![Export Power BI query](./media/app-insights-export-power-bi/analytics-export-power-bi.png)
4. In Power BI Desktop select **Get Data, Blank Query** and then in the query editor, under **View** select **Advanced Query Editor**.

    Paste the exported M Language script into the Advanced Query Editor.

    ![Advanced query editor](./media/app-insights-export-power-bi/power-bi-import-analytics-query.png)

1. You might have to provide credentials to allow Power BI to access Azure. Use 'organizational account' to sign in with your Microsoft account.
   
    ![Supply Azure credentials to enable Power BI to run your Application Insights query](./media/app-insights-export-power-bi/power-bi-import-sign-in.png)

    (If you need to verify the credentials, use the Data Source Settings menu command in the Query Editor. Take care to specify the credentials you use for Azure, which might be different from your credentials for Power BI.)
2. Choose a visualization for your query and select the fields for x-axis, y-axis, and segmenting dimension.
   
    ![Select visualization](./media/app-insights-export-power-bi/power-bi-analytics-visualize.png)
3. Publish your report to your Power BI cloud workspace. From there, you can embed a synchronized version into other web pages.
   
    ![Select visualization](./media/app-insights-export-power-bi/publish-power-bi.png)
4. Refresh the report manually at intervals, or set up a scheduled refresh on the options page.

## About sampling
If your application sends a lot of data, the adaptive sampling feature may operate and send only a percentage of your telemetry. The same is true if you have manually set sampling either in the SDK or on ingestion. [Learn more about sampling.](app-insights-sampling.md)

## Next steps
* [Power BI - Learn](http://www.powerbi.com/learning/)
* [Analytics tutorial](app-insights-analytics-tour.md)

