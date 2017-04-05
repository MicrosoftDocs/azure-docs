---
title:  Azure Stream Analytics sampling inputs | Microsoft Docs
description: How to pinpoint issues when troubleshooting Stream Analytics jobs.
keywords: troubleshoot input, input sampling
documentationcenter: ''
services: stream-analytics
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/03/2017
ms.author: jeffstok

---
# Azure Stream Analytics input stream sampling

A key requirement while writing Stream Analytics queries is being able to test (and test often) to ensure that the output is expected, given some set of input data. Having to save the query after every edit, start the job, wait for incoming data, check the results, and then stop the job again each time you make a small change to the query would make for a cumbersome workflow.

It is possible to test queries in the portal without needing to start or stop a job.

## Test your query

Open the Query editor blade from the job details screen by clicking on the query in the “Query” lens. Or in our case the "< >" placeholder because there is no query yet.

![stream analytics query editor](media/stream-analytics-sample-data-input/stream-analytics-query-editor.png)

You will be presented with the rich editor as before where you create your query. This blade has now been enhanced with a new pane on the left. This new pane shows the Inputs and Outputs used by the query, and those defined for this job.

![stream analytics query editor highlight](media/stream-analytics-sample-data-input/stream-analytics-query-editor-highlight.png)

There is also 1 additional Input and Output shown which I did not define. These come from the new query template that we start off with. These will change, or even disappear all together, as we edit the query. You can safely ignore them for now.

To test with sample input data, right click on any of your Inputs and choose to "Upload sample data from file."

![stream analytics query editor upload sample data](media/stream-analytics-sample-data-input/stream-analytics-query-editor-upload.png)

Once the upload has completed you can then use the Test button to test this query against the sample data you have just provided.

![stream analytics query editor test sample data](media/stream-analytics-sample-data-input/stream-analytics-query-editor-test.png)

The output of your query is displayed in the browser, with a link to Download results should you wish to save the test output for later use. You can now easily and iteratively modify your query, and test repeatedly to see how the output changes.

![Stream Analytics query editor sample output](media/stream-analytics-sample-data-input/stream-analytics-query-editor-samples-output.png)

In the diagram above a 2nd output has been added, called **HighAvgTempOutput**.

With multiple outputs used in a query you can see the results for both outputs separately and easily toggle between them.

Once you are satisfied with the results shown in the browser, you can save your query, start your job, sit back and watch the magic of Stream Analytics happen for you.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
