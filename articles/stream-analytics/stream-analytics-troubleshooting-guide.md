---
title:  Troubleshooting guide for Azure Stream Analytics | Microsoft Docs
description: How to troubleshoot your Stream Analytics job.
keywords: troubleshoot job
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

# Troubleshooting guide for Azure Stream Analytics

Azure Stream Analytics troubleshooting can be a complex effort at first glance. So after working with customers we have created this guide to help streamline the process and take away the guesswork of what is happening with your inputs, outputs, queries, and functions.

## Azure Stream Analytics troubleshooting guide

For best results follow the guide below to troubleshoot your Stream Analytics job.

1.  Testing Connectivity
    - Verify connectivity to inputs and outputs by using the “Test Connection” button for each of the inputs and outputs.
2.  Examine your input data
    - Use [Service Bus Explorer](https://code.msdn.microsoft.com/windowsapps/Service-Bus-Explorer-f2abca5a) to connect to Azure Event Hub (if Event Hub input is used) to verify that input data is flowing into Event Hub.  
    - Use the [Sample Data](stream-analytics-sample-data-input.md) button for each of the inputs and download the input sample data.
    - Inspect the sample data to understand the shape of the data: the schema and the [data types](https://msdn.microsoft.com/library/azure/dn835065.aspx).
3.  Test Query
    - On the Query tab, use the “Test” button to test the query and use the sample data downloaded to [test the query](stream-analytics-test-query.md). Examine any errors and attempt to correct them.
    - If [**Timestamp By**](https://msdn.microsoft.com/library/azure/mt573293.aspx) is used, make sure the events have timestamps greater than the [job start time](stream-analytics-out-of-order-and-late-events.md).
4.  Query debugging
    - Re-build the query progressively from simple select statement to more complex aggregates using steps. Using [WITH](https://msdn.microsoft.com/library/azure/dn835049.aspx) clause to build up the query logic, step by step.
    - Use [SELECT INTO](stream-analytics-select-into.md) to debug query steps.
5.  Eliminate common pitfalls such as:
    - Watch out for common mistakes where it is possible that your query is functioning just fine but:
        - A [**WHERE**](https://msdn.microsoft.com/library/azure/dn835048.aspx) clause in the query filtered out their events that prevented outputs from being generated.
        - The window size is large enough that you’ll need to wait for the corresponding duration to see an output from the query.
        - Timestamp for events is before the job start time and therefore events are being dropped.
6.  Event Ordering
    - If all the above steps worked fine, go to Settings blade and select ["Event Ordering."](stream-analytics-out-of-order-and-late-events.md) Verify this policy is configuration makes sense for your job. It should be noted that this policy is **not** applied when the “Test” button is used to test the query. This is a difference between testing in browser verses running the job for real.
7.  Debug using metrics
    - If no output is obtained after the expected duration (based on the query), try the following:
        - Look at ["Monitoring Metrics"](stream-analytics-monitoring.md) on the Monitor tab. The metrics here are delayed by about couple of minutes as they are aggregated values over last minute.
            - If Input Events > 0, the ASA job is able to read data. If not, then then
                - Look at the data source and see if it has valid data for this job using Service Bus Explorer (if Event Hub is used as input)
                - Check if the Data serialization format and Encoding are as expected.
                - If the job is using an Event Hub, check if the body of the message is "Null."
            - If Data Conversion Errors > 0 and climbing, the following may be true:
                - The job may not be able to de-serialize the events.
                - The event schema may not match the defined/expected schema of the events in the query.
                - The datatypes of some of the fields in the Event may not match expectations.
            - If Runtime Errors > 0, means that the job can receive the data but is getting errors while processing the query.
                - Go to the [Audit Logs](../azure-resource-manager/resource-group-audit.md) and filter on “Failed” status to find all these errors.
            - If InputEvents > 0 and OutputEvents = 0, means one of the following:
                - Query processing resulted in zero output events.
                - Events or its fields may be malformed, so resulted in zero output after query processing.
                - Unable to push data to the [output sink](stream-analytics-select-into.md) for connectivity/authentication reasons.
        - In all the above-mentioned error cases, operations log messages explain additional details (including what is happening), except for the cases the query logic filtered out all events. If the processing of multiple events generates errors, Stream Analytics logs the first 3 error messages of the same type within 10 minutes to Operations logs and then suppress additional identical errors with a message that reads “Errors are happening too rapidly, these are being suppressed”.
8. Debug using Audit and Diagnostic logs
    - Use [Audit Logs](../azure-resource-manager/resource-group-audit.md) and filter to identify and debug errors.
    - Use [job diagnostic logs](stream-analytics-job-diagnostic-logs.md) to identify and debug errors
9. Examining outputs
    - Once the job status is “Running”, depending on the duration stipulated in the query, the output can be seen in the Sink data-source.
    - When outputs going to a specific output type are not seen, redirect the output to different output type that is less complex (such as an Azure Blob) and check if the output can be seen there (using Storage Explore. Additionally, verify if throttling limits at the output are preventing data from coming in.
10. Data flow analysis with Job diagram metrics
    - Use the [job diagram with metrics](stream-analytics-job-diagram-with-metrics.md) to analyze data flow and identify issues
11. Support Case
    Finally, if all else fails, open a Microsoft support case with the following details:


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
