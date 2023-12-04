---
title: Troubleshoot pipeline orchestration and triggers in Azure Data Factory
description: Use different methods to troubleshoot pipeline trigger issues in Azure Data Factory. 
author: ssabat
ms.service: data-factory
ms.date: 07/20/2023
ms.subservice: troubleshooting
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
 
You have Data Factory and a function app running on a private endpoint in Azure. You're trying to run a pipeline that interacts with the function app. You've tried three different methods, but one returns error "Bad Request," and the other two methods return "103 Error Forbidden."

**Cause**

Data Factory currently doesn't support a private endpoint connector for function apps. Azure Functions rejects calls because it's configured to allow only connections from a private link.

**Resolution**

Create a **PrivateLinkService** endpoint and provide your function app's DNS.

### A pipeline run is canceled but the monitor still shows progress status

**Cause**

When you cancel a pipeline run, pipeline monitoring often still shows the progress status. This happens because of a browser cache issue. You also might not have the correct monitoring filters.

**Resolution**

Refresh the browser and apply the correct monitoring filters.
 
### You see a "DelimitedTextMoreColumnsThanDefined" error when copying a pipeline
 
 **Cause**
 
If a folder you're copying contains files with different schemas, such as variable number of columns, different delimiters, quote char settings, or some data issue, the Data Factory pipeline might throw this error:

`
Operation on target Copy_sks  failed: Failure happened on 'Sink' side.
ErrorCode=DelimitedTextMoreColumnsThanDefined,
'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
Message=Error found when processing 'Csv/Tsv Format Text' source '0_2020_11_09_11_43_32.avro' with row number 53: found more columns than expected column count 27.,
Source=Microsoft.DataTransfer.Common,'
`

**Resolution**

Select the **Binary Copy** option while creating the Copy activity. This way, for bulk copies or migrating your data from one data lake to another, Data Factory won't open the files to read the schema. Instead, Data Factory will treat each file as binary and copy it to the other location.

### A pipeline run fails when you reach the capacity limit of the integration runtime for data flow

**Issue**

Error message:

`
Type=Microsoft.DataTransfer.Execution.Core.ExecutionException,Message=There are substantial concurrent MappingDataflow executions which is causing failures due to throttling under Integration Runtime 'AutoResolveIntegrationRuntime'.
`

**Cause**

You've reached the integration runtime's capacity limit. You might be running a large amount of data flow by using the same integration runtime at the same time. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-data-factory-limits) for details.

**Resolution**
 
- Run your pipelines at different trigger times.
- Create a new integration runtime, and split your pipelines across multiple integration runtimes.

### A pipeline run error while invoking REST api in a Web activity

**Issue**

Error message:

`
Operation on target Cancel failed: {“error”:{“code”:”AuthorizationFailed”,”message”:”The client ‘<client>’ with object id ‘<object>’ does not have authorization to perform action ‘Microsoft.DataFactory/factories/pipelineruns/cancel/action’ over scope ‘/subscriptions/<subscription>/resourceGroups/<resource group>/providers/Microsoft.DataFactory/factories/<data factory name>/pipelineruns/<pipeline run id>’ or the scope is invalid. If access was recently granted, please refresh your credentials.”}}
`

**Cause**

Pipelines may use the Web activity to call ADF REST API methods if and only if the Azure Data Factory member is assigned the Contributor role. You must first configure and  add the Azure Data Factory managed identity to the Contributor security role. 

**Resolution**

Before using the Azure Data Factory’s REST API in a Web activity’s Settings tab, security must be configured. Azure Data Factory pipelines may use the Web activity to call ADF REST API methods if and only if the Azure Data Factory managed identity is assigned the *Contributor*  role. Begin by opening the Azure portal and clicking the **All resources** link on the left menu. Select **Azure Data Factory**  to add ADF managed identity with Contributor role by clicking the **Add** button in the *Add a role assignment* box.


### How to check and branch on activity-level success and failure in pipelines

**Cause**

Azure Data Factory orchestration allows conditional logic and enables users to take different paths based upon the outcome of a previous activity. It allows four conditional paths: **Upon Success** (default pass), **Upon Failure**, **Upon Completion**, and **Upon Skip**. 

Azure Data Factory evaluates the outcome of all leaf-level activities. Pipeline results are successful only if all leaves succeed. If a leaf activity was skipped, we evaluate its parent activity instead. 

**Resolution**

* Implement activity-level checks by following [How to handle pipeline failures and errors](https://techcommunity.microsoft.com/t5/azure-data-factory/understanding-pipeline-failures-and-error-handling/ba-p/1630459).
* Use Azure Logic Apps to monitor pipelines in regular intervals following [Query By Factory](/rest/api/datafactory/pipelineruns/querybyfactory).
* [Visually Monitor Pipeline](monitor-visually.md)

### How to monitor pipeline failures in regular intervals

**Cause**

You might need to monitor failed Data Factory pipelines in intervals, say 5 minutes. You can query and filter the pipeline runs from a data factory by using the endpoint. 

**Resolution**
* You can set up an Azure logic app to query all of the failed pipelines every 5 minutes, as described in [Query By Factory](/rest/api/datafactory/pipelineruns/querybyfactory). Then, you can report incidents to your ticketing system.
* You can rerun pipelines and activities as described [here.](monitor-visually.md#rerun-pipelines-and-activities)
* You can rerun activities if you had canceled activity or had a failure as per  [Rerun from activity failures.](monitor-visually.md#rerun-from-failed-activity)
* [Visually Monitor Pipeline](monitor-visually.md)

### Degree of parallelism  increase does not result in higher throughput

**Cause** 

The degree of parallelism in *ForEach* is actually max degree of parallelism. We cannot guarantee a specific number of executions happening at the same time, but this parameter will guarantee that we never go above the value that was set. You should see this as a limit, to be leveraged when controlling concurrent access to your sources and sinks.

Known Facts about *ForEach*
 * Foreach has a property called batch count(n) where default value is 20 and the max is 50.
 * The batch count, n, is used to construct n queues. 
 * Every queue runs sequentially, but you can have several queues running in parallel.
 * The queues are pre-created. This means there is no rebalancing of the queues during the runtime.
 * At any time, you have at most one item being process per queue. This means at most n items being processed at any given time.
 * The foreach total processing time is equal to the processing time of the longest queue. This means that the foreach activity depends on how the queues are constructed.
 
**Resolution**

 * You should not use *SetVariable* activity inside *For Each* that runs in parallel.
 * Taking in consideration the way the queues are constructed, customer can improve the foreach performance by setting multiples of *foreach* where each *foreach* will have items with similar processing time. 
 * This will ensure that long runs are processed in parallel rather sequentially.

 ### Pipeline status is queued or stuck for a long time
 
 **Cause**
 
 This can happen for various reasons like hitting concurrency limits, service outages, network failures and so on.
 
 **Resolution**
 
* **Concurrency Limit:**  If your pipeline has a concurrency policy, verify that there are no old pipeline runs in progress. 
* **Monitoring limits**: Go to the ADF authoring canvas, select your pipeline, and determine if it has a concurrency property  assigned to it. If it does, go to the Monitoring view, and make sure there's nothing in the past 45 days that's in progress. If there is something in progress, you can cancel it and the new pipeline run should  start.

* **Transient  Issues:** It is possible that your run was impacted by a transient network issue, credential failures, services outages etc.  If this happens, Azure Data Factory has an internal recovery process that monitors all the runs and starts them when it notices something went wrong. You can rerun pipelines and activities as described [here.](monitor-visually.md#rerun-pipelines-and-activities). You can rerun activities if you had canceled activity or had a failure as per [Rerun from activity failures.](monitor-visually.md#rerun-from-failed-activity) This process happens every one  hour, so if your run is stuck for more than an hour, create a support case.


 
### Longer start up times for activities in ADF Copy and Data Flow

**Cause**

This can happen if you have not implemented time to live feature for Data Flow or optimized SHIR.

**Resolution**

* If each copy activity is taking up to 2 minutes to start, and the problem occurs primarily on a VNet join (vs. Azure IR), this can be a copy performance issue. To review troubleshooting steps, go to [Copy Performance Improvement.](copy-activity-performance-troubleshooting.md)
* You can use time to live feature to decrease cluster start-up time for data flow activities. Please review [Data Flow Integration Runtime.](control-flow-execute-data-flow-activity.md#data-flow-integration-runtime)

 ### Hitting capacity issues in SHIR(Self-Hosted Integration Runtime)
 
 **Cause**
 
This can happen if you have not scaled up SHIR as per your workload.

**Resolution**

* If you encounter a capacity issue from SHIR, upgrade the VM to increase the node to balance the activities. If you receive an error  message about a self-hosted IR general failure or error, a self-hosted IR upgrade, or self-hosted IR connectivity issues, which can generate a long queue, go to [Troubleshoot self-hosted integration runtime.](self-hosted-integration-runtime-troubleshoot-guide.md)

### Error messages due to long queues for ADF Copy and Data Flow

**Cause**

Long queue-related error messages can appear for various reasons. 

**Resolution**
* If you receive an error message from any source or destination via connectors, which can generate a long queue, go to [Connector Troubleshooting Guide.](connector-troubleshoot-guide.md)
* If you receive an error message about Mapping Data Flow, which can generate a long queue, go to [Data Flows Troubleshooting Guide.](data-flow-troubleshoot-guide.md)
* If you receive an error message about other activities, such as Databricks, custom activities, or HDI, which can generate a long queue, go to [Activity Troubleshooting Guide.](data-factory-troubleshoot-guide.md)
* If you receive an error message about running SSIS packages, which can generate a long queue, go to the [Azure-SSIS Package Execution Troubleshooting Guide](ssis-integration-runtime-ssis-activity-faq.md) and [Integration Runtime Management Troubleshooting Guide.](ssis-integration-runtime-management-troubleshoot.md)

### Error message - "code":"BadRequest", "message":"null"

**Cause**

It is a user error because JSON payload that hits management.azure.com is corrupt. No logs will be stored because user call did not reach ADF service layer.

**Resolution**

Perform network tracing of your API call from ADF portal using Edge/Chrome browser **Developer tools**. You will see offending JSON payload, which could be due to a special character(for example $), spaces and other types of user input. Once you fix the string expression, you will proceed with rest of  ADF usage calls in the browser.

### ForEach activities do not run in parallel mode

**Cause**

You are running ADF in debug mode.

**Resolution**

Execute the pipeline in trigger mode.

### Cannot publish because account is locked

**Cause**

You made changes in collaboration branch to remove storage event trigger. You are trying to publish and encounter `Trigger deactivation error` message.

**Resolution**

This is due to the storage account, used for the event trigger, is being locked. Unlock the account.

### Expression builder fails to load

**Cause**

The expression builder can fail to load due to network or cache problems with the web browser.  

**Resolution**


Upgrade the web browser to the latest version of a supported browser, clear cookies for the site, and refresh the page.

### "Code":"BadRequest","message":"ErrorCode=FlowRunSizeLimitExceeded

**Cause**

You have chained many activities.

**Resolution**

You can split your pipelines into sub pipelines, and stich them together with **ExecutePipeline** activity. 

###  How to optimize pipeline with mapping data flows to avoid internal server errors, concurrency errors etc. during execution

**Cause**

You have not optimized mapping data flow.

**Resolution**

* Use memory optimized compute when dealing with large amount of data and transformations.
* Reduce the batch size in case of a for each activity.
* Scale up your databases and warehouses to match the performance of your ADF. 
* Use a separate IR(integration runtime) for activities running in parallel.
* Adjust the partitions at the source and sink accordingly. 
* Review  [Data Flow Optimizations](concepts-data-flow-performance.md)

### Error Code "BadRequest" when  passing parameters to child pipelines

**Cause**

Failure type is user configuration issue. String of parameters, instead of Array, is passed to the child pipeline.

**Resolution**

Input  **execute pipeline**  activity for pipeline parameter  as  *@createArray('a','b')* for example, if you want to pass parameters 'a' and 'b'. If you want to pass numbers, for example, use *@createArray(1,2,3)*.  Use createArray function to force parameters being passed as an array.


## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
*  [Data Factory feature requests](/answers/topics/azure-data-factory.html)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
