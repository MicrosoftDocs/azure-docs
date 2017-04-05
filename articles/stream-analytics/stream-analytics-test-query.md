---
title:  Azure Stream Analytics query testing | Microsoft Docs
description: How to test your queries in Stream Analytics jobs.
keywords: test query, troubleshoot query
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
# Test Azure Stream Analytics queries in the Azure portal

Azure Stream Analytics allows you to test queries in the Azure portal without needing to start or stop a job.

## Test the input

To test with sample input data, right click on any of your Inputs and choose to "Upload sample data from file."

![stream analytics query editor test query](media/stream-analytics-test-query/stream-analytics-test-query-editor-upload.png)

Once the upload has completed you can then use the "Test" button to test this query against the sample data you have provided.

![stream analytics query editor test sample data](media/stream-analytics-test-query/stream-analytics-test-query-editor-test.png)

The output of your query is displayed in the browser, with a link to Download results should you wish to save the test output for later use. You can now easily and iteratively modify your query and test repeatedly to see how the output changes.

![Stream Analytics query editor sample output](media/stream-analytics-test-query/stream-analytics-test-query-editor-samples-output.png)

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
