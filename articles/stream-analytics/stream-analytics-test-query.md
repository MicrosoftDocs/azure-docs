---
title: Azure Stream Analytics query testing | Microsoft Docs
description: How to test your queries in Stream Analytics jobs.
keywords: test query, troubleshoot query
documentation center: ''
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
ms.date: 04/20/2017
ms.author: jeffstok

---
# Test Azure Stream Analytics queries in the Azure portal

With Azure Stream Analytics, you can test queries in the Azure portal without needing to start or stop a job.

## Test the input

1. To test with sample input data, right-click any of your inputs, and then select **Upload sample data from file**.

    ![stream analytics query editor test query](media/stream-analytics-test-query/stream-analytics-test-query-editor-upload.png)

2. After the upload is complete, click **Test** to test this query against the sample data you have provided.

    ![stream analytics query editor test sample data](media/stream-analytics-test-query/stream-analytics-test-query-editor-test.png)

The output of your query is displayed in the browser, with Download results link should you want to save the test output for later use. You can now easily and iteratively modify your query and test it repeatedly to see how the output changes.

![Stream Analytics query editor sample output](media/stream-analytics-test-query/stream-analytics-test-query-editor-samples-output.png)

With multiple outputs used in a query, you can see the results for both outputs separately and easily toggle between them.

After you are satisfied with the results shown in the browser, you can save your query, start your job, and let it process events without error.

## Get help

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
