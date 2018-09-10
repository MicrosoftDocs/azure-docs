---
title: Test an Azure Stream Analytics job with sample data
description: How to test your queries in Stream Analytics jobs.
keywords: This article describes how to use the Azure portal to test an Azure Stream Analytics job, sample input, and upload sample data.
services: stream-analytics
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
manager: kfile
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/27/2018
---

# Test a Stream Analytics query with sample data

By using Azure Stream Analytics, you can upload sample data and test queries in the Azure portal without starting or stopping a job.

## Upload sample data and test the query

1. Sign in to the Azure portal. 

2. Locate your existing Stream Analytics job and select it.

3. On the Stream Analytics job page, under the **Job Topology** heading, select **Query** to open the Query editor window. 

4. To test your query with sample input data, right-click on any of your inputs.  Then select **Upload sample data from file**. The data must be serialized in JSON, CSV or AVRO. Sample input must be encoded in UTF-8 and not compressed. Only comma (,) delimiter is supported for testing CSV input on portal.

    ![stream analytics query editor test query](media/stream-analytics-test-query/stream-analytics-test-query-editor-upload.png)

5. After the upload is complete, select **Test** to test this query against the sample data you have provided.

    ![stream analytics query editor test sample data](media/stream-analytics-test-query/stream-analytics-test-query-editor-test.png)

6. If you need the test output for later use, the output of your query is displayed in the browser with a link to the download results. 

7. Iteratively modify your query and test it again to see how the output changes.

   ![Stream Analytics query editor sample output](media/stream-analytics-test-query/stream-analytics-test-query-editor-samples-output.png)

   When you use multiple outputs in a query, the results are shown on separate tabs, and you can easily toggle between them.

8. After you verify the results shown in the browser, **Save** your query. Then **Start** the job, and let it process the incoming events.

## Next steps
> [!div class="nextstepaction"]
> [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
