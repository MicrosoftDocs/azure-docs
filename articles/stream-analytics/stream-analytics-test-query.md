---
title: Test your Azure Stream Analytics job with sample data | Microsoft Docs
description: How to test your queries in Stream Analytics jobs.
keywords: test a job, input sampling, upload sample date
documentationcenter: ''
services: stream-analytics
author: SnehaGunda
manager: kfile

ms.assetid: 
ms.service: stream-analytics
ms.workload: data-services
ms.date: 03/18/2018
ms.author: sngun
---

# Test your Stream Analytics query with sample data

By using Azure Stream Analytics, you can upload sample data and test queries in the portal without starting or stopping a job.

## Upload sample data and test the query

1. Navigate to one of your existing Stream Analytics job > click on **Query** to open the Query editor window. 

2. To test your query with sample input data, right-click on any of your inputs, and then select **Upload sample data from file**. Currently you can upload JSON formatted data only. If your data is in a different format such as CSV, you should convert it to JSON before uploading. You can use any opensource conversion tool such as [CSV to JSON convertor](http://www.convertcsv.com/csv-to-json.htm) to convert your data to JSON.

    ![stream analytics query editor test query](media/stream-analytics-test-query/stream-analytics-test-query-editor-upload.png)

3. After the upload is complete, click **Test** to test this query against the sample data you have provided.

    ![stream analytics query editor test sample data](media/stream-analytics-test-query/stream-analytics-test-query-editor-test.png)

4. If you want to save the test output for later use, the output of your query is displayed in the browser with a link to the download results. You can now easily and iteratively modify your query and test it repeatedly to see how the output changes.

   ![Stream Analytics query editor sample output](media/stream-analytics-test-query/stream-analytics-test-query-editor-samples-output.png)

When you use multiple outputs in a query, you can see the results for each output separately and easily toggle between them. After you verify the results shown in the browser, you can save your query, start the job, and let it process events without error.
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
