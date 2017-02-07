---
title: Power BI dashboard on Stream Analytics | Microsoft Docs
description: Use a real-time streaming Power BI dashboard to gather business intelligence and analyze high-volume data from a Stream Analytics job.
keywords: analytics dashboard, real-time dashboard
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: fe8db732-4397-4e58-9313-fec9537aa2ad
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 02/01/2017
ms.author: jeffstok

---
# Stream Analytics & Power BI: A real-time analytics dashboard for streaming data
Azure Stream Analytics allows you to take advantage of one of the leading business intelligence tools, Microsoft Power BI. Learn how to use Azure Stream Analytics to analyze high-volume, streaming data and get the insight in a real-time Power BI analytics dashboard.

Use [Microsoft Power BI](https://powerbi.com/) to build a live dashboard quickly. [Watch a video illustrating the scenario](https://www.youtube.com/watch?v=SGUpT-a99MA).

In this article, learn how create your own custom business intelligence tools by using Power BI as an output for your Azure Stream Analytics jobs and utilize a real-time dashboard.

## Prerequisites
* Microsoft Azure Account
* Work or school account for Power BI
* Complete the Get Started scenario [Real-time fraud detection](stream-analytics-real-time-fraud-detection.md). This article builds upon that workflow and adds a Power BI streaming dataset output.

## Add Power BI output
Now that an input exists for the job, an output to Power BI can be defined. Select the box in the middle of the job dashboard **Outputs**. Then click the familiar **+ Add** button and create your output.

![add output](./media/stream-analytics-power-bi-dashboard/create-pbi-output.png)

Provide the **Output Alias** – You can put any output alias that is easy for you to refer to. This output alias is particularly helpful if you decide to have multiple outputs for your job. In that case, you have to refer to this output in your query. For example, let’s use the output alias value = "StreamAnalyticsRealTimeFraudPBI".

Then click the **Authorize** button.

![add authorization](./media/stream-analytics-power-bi-dashboard/pbi-authorize.png)

This will prompt a window to provide your Azure credentials (work or school account) and it will provide your Azure job access to your Power BI area.

![authorize fields](./media/stream-analytics-power-bi-dashboard/authorize-area.png)

The authorization window will disappear when satisfied and the New output area will have fields for the Dataset Name and Table Name.

![pbi workspace](./media/stream-analytics-power-bi-dashboard/pbi-workspace.png)

Define them as follows:
* **Group Workspace** – Select a workspace in your Power BI tenant under which the dataset will be created.
* **Dataset Name** - Provide a dataset name that you want your Power BI output to have. For example, let’s use "StreamAnalyticsRealTimeFraudPBI".
* **Table Name** - Provide a table name under the dataset of your Power BI output. Let’s say we call it "StreamAnalyticsRealTimeFraudPBI". Currently, Power BI output from Stream Analytics jobs may only have one table in a dataset.

Click **Create** and now you output configuration is complete.

> [!WARNING]
> Please be aware that if Power BI already had a dataset and table with the same name as the one you provided in this Stream Analytics job, the existing data will be overwritten!
> Also, you should not explicitly create this dataset and table in your Power BI account. They will be automatically created when you start your Stream Analytics job and the job starts pumping output into Power BI. If your job query doesn’t return any results, the dataset and table will not be created.
> 
> 

The dataset is created with the following settings set;
* defaultRetentionPolicy: BasicFIFO - data is FIFO, 200k maximum rows
* defaultMode: pushStreaming: supports both streaming tiles and traditional report-based visuals (aka push)
* creating datasets with other flags is unsupported at this time

For more information on Power BI datasets see the [Power BI REST API](https://msdn.microsoft.com/library/mt203562.aspx) reference.


## Write query
Go to the **Query** tab of your job. Write your query, the output of which you want in your Power BI. For example, it could be something such as the following SQL query to catch SIM fraud in the telecommunications industry:


```
/* Our criteria for fraud:
 Calls made from the same caller to two phone switches in different locations (e.g. Australia and Europe) within 5 seconds) */

 SELECT System.Timestamp AS WindowEnd, COUNT(*) AS FraudulentCalls
 INTO "StreamAnalyticsRealTimeFraudPBI"
 FROM "StreamAnalyticsRealTimeFraudInput" CS1 TIMESTAMP BY CallRecTime
 JOIN "StreamAnalyticsRealTimeFraudInput" CS2 TIMESTAMP BY CallRecTime
   
/* Where the caller is the same, as indicated by IMSI (International Mobile Subscriber Identity) */
 ON CS1.CallingIMSI = CS2.CallingIMSI

/* ...and date between CS1 and CS2 is between 1 and 5 seconds */
 AND DATEDIFF(ss, CS1, CS2) BETWEEN 1 AND 5

/* Where the switch location is different */
 WHERE CS1.SwitchNum != CS2.SwitchNum
 GROUP BY TumblingWindow(Duration(second, 1))
```

## Create the dashboard in Power BI

Go to [Powerbi.com](https://powerbi.com) and login with your work or school account. If the Stream Analytics job query outputs results, you will see your dataset is already created:

![streaming dataset](./media/stream-analytics-power-bi-dashboard/streaming-dataset.png)

Click Add tile and select your custom streaming data.

![custom streaming dataset](./media/stream-analytics-power-bi-dashboard/custom-streaming-data.png)

Then select your dataset from the list:

![your streaming dataset](./media/stream-analytics-power-bi-dashboard/your-streaming-dataset.png)

Now create a visualization card and select the field fraudulentcalls.

![add fraud](./media/stream-analytics-power-bi-dashboard/add-fraud.png)

Now we have a fraud counter!

![fraud counter](./media/stream-analytics-power-bi-dashboard/fraud-counter.png)

Walk through the exercise of adding a tile again but this time select line chart. Add fraudulentcalls as the value and the axis as windowend. I selected the last 10 minutes:

![fraud calls](./media/stream-analytics-power-bi-dashboard/fraud-calls.png)


Note that this tutorial demonstrated how to create but one kind of chart for a dataset. Power BI can help you create other customer business intelligence tools for your organization. For another example of a Power BI dashboard, watch the [Getting Started with Power BI](https://youtu.be/L-Z_6P56aas?t=1m58s) video.

For further information on configuring a Power BI output and to utilize Power BI groups, review the [Power BI section](stream-analytics-define-outputs.md#power-bi) of [Understanding Stream Analytics outputs](stream-analytics-define-outputs.md "Understanding Stream Analytics outputs"). Another helpful resource to learn more about creating Dashboards with Power BI is [Dashboards in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-dashboards/).

## Limitations and best practices
Power BI employs both concurrency and throughput constraints as described here: [https://powerbi.microsoft.com/pricing](https://powerbi.microsoft.com/pricing "Power BI Pricing")

Currently, you Power BI can be called roughly once per second. Streaming visuals support packets of size 15kb. Beyond that and streaming visuals will fail (but push will continue to work).

Because of those Power BI lands itself most naturally to cases where Azure Stream Analytics does a significant data load reduction.
We recommend using TumblingWindow or HoppingWindow to ensure that data push would be at most 1 push/second and that your query lands within the throughput requirements – you can use the following equation to compute the value to give your window in seconds:

![equation1](./media/stream-analytics-power-bi-dashboard/equation1.png)  

As an example – If you have 1,000 devices sending data every second, you are on the Power BI Pro SKU that supports 1,000,000 rows/hour and you want to get average data per device on Power BI you can do at most a push every 4 seconds per device (as shown below):  

![equation2](./media/stream-analytics-power-bi-dashboard/equation2.png)  

Which means we would change the original query to:

    SELECT
        MAX(hmdt) AS hmdt,
        MAX(temp) AS temp,
        System.TimeStamp AS time,
        dspl
    INTO
        OutPBI
    FROM
        Input TIMESTAMP BY time
    GROUP BY
        TUMBLINGWINDOW(ss,4),
        dspl


### Renew authorization
You need to re-authenticate your Power BI account if its password has changed since your job was created or last authenticated. If Multi-Factor Authentication (MFA) is configured on your Azure Active Directory (AAD) tenant you will also need to renew Power BI authorization every 2 weeks. A symptom of this issue is no job output and an "Authenticate user error" in the Operation Logs.

Similarly, if a job attempts to start while the token is expired, an error will occur and the job start will fail. To resolve this issue, stop your running job and go to your Power BI output.  Click the “Renew authorization” link, and restart your job from the Last Stopped Time to avoid data loss. Once the authorization is refreshed with Power BI you will see a green alert in the authorization area to reflect the issue is resolved.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

