---
title: Troubleshooting guide for Azure Stream Analytics | Microsoft Docs
description: How to troubleshoot your Stream Analytics job
keywords: troubleshoot guide
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
ms.date: 04/20/2017
ms.author: jeffstok

---

# Troubleshooting guide for Azure Stream Analytics

Azure Stream Analytics troubleshooting can appear to be a complex effort at first glance. After working with many users, we have created this guide to help streamline the process and remove the guesswork about your inputs, outputs, queries, and functions.

## Troubleshoot your Stream Analytics job

For best results in troubleshooting your Stream Analytics job, use the following guidelines:

1.  Test your connectivity:
    - Verify connectivity to inputs and outputs by using the **Test Connection** button for each input and output.

2.  Examine your input data:
    - To verify that input data is flowing into Event Hub, use [Service Bus Explorer](https://code.msdn.microsoft.com/windowsapps/Service-Bus-Explorer-f2abca5a) to connect to Azure Event Hub (if Event Hub input is used).  
    - Use the [**Sample Data**](stream-analytics-sample-data-input.md) button for each input, and download the input sample data.
    - Inspect the sample data to understand the shape of the data: the schema and the [data types](https://msdn.microsoft.com/library/azure/dn835065.aspx).

3.  Test your query:
    - On the **Query** tab, use the **Test** button to test the query, and use the downloaded sample data to [test the query](stream-analytics-test-query.md). Examine any errors and attempt to correct them.
    - If you use [**Timestamp By**](https://msdn.microsoft.com/library/azure/mt573293.aspx), verify that the events have timestamps greater than the [job start time](stream-analytics-out-of-order-and-late-events.md).

4.  Debug your query:
    - Rebuild the query progressively from simple select statement to more complex aggregates by using steps. To build up the query logic step by step, use [WITH](https://msdn.microsoft.com/library/azure/dn835049.aspx) clauses.
    - Use [SELECT INTO](stream-analytics-select-into.md) to debug query steps.

5.  Eliminate common pitfalls, such as:
    - A [**WHERE**](https://msdn.microsoft.com/library/azure/dn835048.aspx) clause in the query filtered out all events, preventing any output from being generated.
    - When you use window functions, wait for the entire window duration to see an output from the query.
    - The timestamp for events precedes the job start time and, therefore, events are being dropped.

6.  Use event ordering:
    - If all the previous steps worked fine, go to the **Settings** blade and select [**Event Ordering**](stream-analytics-out-of-order-and-late-events.md). Verify that this policy is configured for what makes sense in your scenario. The policy is *not* applied when you use the **Test** button to test the query. This result is one difference between testing in-browser versus running the job in production.

7.  Debug by using metrics:
    - If you obtain no output after the expected duration (based on the query), try the following:
        - Look at [**Monitoring Metrics**](stream-analytics-monitoring.md) on the **Monitor** tab. Because the values are aggregated, the metrics are delayed by a few minutes.
            - If Input Events > 0, the job is able to read input data. If Input Events is not > 0, then:
                - To see whether the data source has valid data, check it by using [Service Bus Explorer](https://code.msdn.microsoft.com/windowsapps/Service-Bus-Explorer-f2abca5a). This check applies if the job is using Event Hub as input.
                - Check to see whether the data serialization format and data encoding are as expected.
                - If the job is using an Event Hub, check to see whether the body of the message is *Null*.
            - If Data Conversion Errors > 0 and climbing, the following might be true:
                - The job might not be able to de-serialize the events.
                - The event schema might not match the defined or expected schema of the events in the query.
                - The datatypes of some of the fields in the event might not match expectations.
            - If Runtime Errors > 0, it means that the job can receive the data but is generating errors while processing the query.
                - To find the errors, go to the [Audit Logs](../azure-resource-manager/resource-group-audit.md) and filter on *Failed* status.
            - If InputEvents > 0 and OutputEvents = 0, it means that one of the following is true:
                - Query processing resulted in zero output events.
                - Events or its fields might be malformed, resulting in zero output after query processing.
                - The job was unable to push data to the [output sink](stream-analytics-select-into.md) for connectivity or authentication reasons.
        - In all the previously mentioned error cases, operations log messages explain additional details (including what is happening), except in cases where the query logic filtered out all events. If the processing of multiple events generates errors, Stream Analytics logs the first three error messages of the same type within 10 minutes to Operations logs. It then suppresses additional identical errors with a message that reads “Errors are happening too rapidly, these are being suppressed.”

8. Debug by using audit and diagnostic logs:
    - Use [Audit Logs](../azure-resource-manager/resource-group-audit.md), and filter to identify and debug errors.
    - Use [job diagnostic logs](stream-analytics-job-diagnostic-logs.md) to identify and debug errors.

9. Examine the outputs:
    - When the job status is *Running*, depending on the duration that's stipulated in the query, you can see the output in the sink data source.
    - If you cannot see outputs that are going to a specific output type, redirect them to an output type that is less complex, such as an Azure Blob. By using Storage Explorer, check to see whether the output can be seen. Additionally, verify whether throttling limits at the output are preventing data from being received.

10. Use data-flow analysis with job diagram metrics:
    - To analyze data flow and identify issues, use the [job diagram with metrics](stream-analytics-job-diagram-with-metrics.md).

11. Open a support case:
    - Finally, if all else fails, open a Microsoft support case by using the SubscriptionID that contains your job.

## Get help

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
