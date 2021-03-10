---
title: Troubleshoot pipeline orchestration and triggers in Azure Data Factory
description: Use different methods to troubleshoot pipeline trigger issues in Azure Data Factory. 
author: ssabat
ms.service: data-factory
ms.date: 12/15/2020
ms.topic: troubleshooting
ms.author: susabat
ms.reviewer: susabat
---

# Troubleshoot pipeline orchestration and triggers in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A pipeline run in Azure Data Factory defines an instance of a pipeline execution. For example, let's say you have a pipeline that runs at 8:00 AM, 9:00 AM, and 10:00 AM. In this case, there are three separate pipeline runs. Each pipeline run has a unique pipeline run ID. A run ID is a globally unique identifier (GUID) that defines that particular pipeline run.

Pipeline runs are typically instantiated by passing arguments to parameters that you define in the pipeline. You can run a pipeline either manually or by using a trigger. See [Pipeline execution and triggers in Azure Data Factory](concepts-pipeline-execution-triggers.md) for details.

## Common issues, causes, and solutions

### An Azure Functions app pipeline throws an error with private endpoint connectivity
 
You have Data Factory and an Azure function app running on a private endpoint. You're trying to run a pipeline that interacts with the function app. You've tried three different methods, but one returns error "Bad Request," and the other two methods return "103 Error Forbidden."

**Cause**: Data Factory currently doesn't support a private endpoint connector for function apps. Azure Functions rejects calls because it's configured to allow only connections from a private link.

**Resolution**: Create a **PrivateLinkService** endpoint and provide your function app's DNS.

### A pipeline run is canceled but the monitor still shows progress status

When you cancel a pipeline run, pipeline monitoring often still shows the progress status. This happens because of a browser cache issue. You also might not have the correct monitoring filters.

**Resolution**: Refresh the browser and apply the correct monitoring filters.
 
### You see a "DelimitedTextMoreColumnsThanDefined" error when copying a pipeline
 
If a folder you're copying contains files with different schemas, such as variable number of columns, different delimiters, quote char settings, or some data issue, the Data Factory pipeline might throw this error:

`
Operation on target Copy_sks  failed: Failure happened on 'Sink' side.
ErrorCode=DelimitedTextMoreColumnsThanDefined,
'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
Message=Error found when processing 'Csv/Tsv Format Text' source '0_2020_11_09_11_43_32.avro' with row number 53: found more columns than expected column count 27.,
Source=Microsoft.DataTransfer.Common,'
`

**Resolution**: Select the **Binary Copy** option while creating the Copy activity. This way, for bulk copies or migrating your data from one data lake to another, Data Factory won't open the files to read the schema. Instead, Data Factory will treat each file as binary and copy it to the other location.

### A pipeline run fails when you reach the capacity limit of the integration runtime

Error message:

`
Type=Microsoft.DataTransfer.Execution.Core.ExecutionException,Message=There are substantial concurrent MappingDataflow executions which is causing failures due to throttling under Integration Runtime 'AutoResolveIntegrationRuntime'.
`

**Cause**: You've reached the integration runtime's capacity limit. You might be running a large amount of data flow by using the same integration runtime at the same time. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#version-2) for details.

**Resolution**:
 
- Run your pipelines at different trigger times.
- Create a new integration runtime, and split your pipelines across multiple integration runtimes.

### You have activity-level errors and failures in pipelines

Azure Data Factory orchestration allows conditional logic and enables users to take different paths based upon the outcome of a previous activity. It allows four conditional paths: **Upon Success** (default pass), **Upon Failure**, **Upon Completion**, and **Upon Skip**. 

Azure Data Factory evaluates the outcome of all leaf-level activities. Pipeline results are successful only if all leaves succeed. If a leaf activity was skipped, we evaluate its parent activity instead. 

**Resolution**

1. Implement activity-level checks by following [How to handle pipeline failures and errors](https://techcommunity.microsoft.com/t5/azure-data-factory/understanding-pipeline-failures-and-error-handling/ba-p/1630459).
1. Use Azure Logic Apps to monitor pipelines in regular intervals following [Query By Factory](/rest/api/datafactory/pipelineruns/querybyfactory).

### How to monitor pipeline failures in regular intervals

You might need to monitor failed Data Factory pipelines in intervals, say 5 minutes. You can query and filter the pipeline runs from a data factory by using the endpoint. 

**Resolution**
You can set up an Azure logic app to query all of the failed pipelines every 5 minutes, as described in [Query By Factory](/rest/api/datafactory/pipelineruns/querybyfactory). Then, you can report incidents to your ticketing system.

For more information, go to [Send Notifications from Data Factory, Part 2](https://www.mssqltips.com/sqlservertip/5962/send-notifications-from-an-azure-data-factory-pipeline--part-2/).

### Degree of parallelism  increase does not result in higher throughput

**Cause** 

The degree of parallelism in *ForEach* is actually max degree of parallelism. We cannot guarantee a specific number of executions happening at the same time, but this parameter will guarantee that we never go above the value that was set. You should see this as a limit, to be leveraged when controlling concurrent access to your sources and sinks.

Known Facts about *ForEach*
 * Foreach has a property called batch count(n) where default value is 20 and the max is 50.
 * The batch count, n, is used to construct n queues. Later we will discuss some details on how these queues are constructed.
 * Every queue runs sequentially, but you can have several queues running in parallel.
 * The queues are pre-created. This means there is no rebalancing of the queues during the runtime.
 * At any time, you have at most one item being process per queue. This means at most n items being processed at any given time.
 * The foreach total processing time is equal to the processing time of the longest queue. This means that the foreach activity depends on how the queues are constructed.
 
**Resolution**

 * You should not use *SetVariable* activity inside *For Each* that runs in parallel.
 * Taking in consideration the way the queues are constructed, customer can improve the foreach performance by setting multiple *foreaches* where each foreach will have items with similar processing time. This will ensure that long runs are processed in parallel rather sequentially.

## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
