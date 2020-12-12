---
title: Troubleshooting pipeline orchestration and triggers in ADF
description: Use different  methods to troubleshoot pipeline trigger issues in ADF 
author: ssabat
ms.author: susabat
ms.reviewer: susabat
ms.topic: general
ms.date: 11/26/2020

---

# Troubleshooting pipeline orchestration and triggers in ADF

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A pipeline run in Azure Data Factory defines an instance of a pipeline execution. For example, say you have a pipeline that executes at 8:00 AM, 9:00 AM, and 10:00 AM. In this case, there are three separate runs of the pipeline or pipeline runs. Each pipeline run has a unique pipeline run ID. A run ID is a GUID that uniquely defines that particular pipeline run.

Pipeline runs are typically instantiated by passing arguments to parameters that you define in the pipeline. You can execute a pipeline either manually or by using a trigger. For more details, please review [Pipeline execution and triggers in Azure Data Factory](https://docs.microsoft.com/azure/data-factory/concepts-pipeline-execution-triggers)

# Pipeline with Azure Function throws error with private end point connectivity 
## Issue
For some context, you have ADF  and Azure Function App running on a private endpoints. You are trying to get a pipeline that interacts with the Azure Function App to work. You have tried three different methods, one  returns error “Bad Request” the other two methods return  “103 Error Forbidden” .
## Cause 
ADF currently does not support a PE connector for Azure Function App. And this should be the reason why Azure Function App is rejecting the calls since it would be configured to allow only connections from a Private Link.
## Resolution
You can create a Private Endpoint  of type PrivateLinkService and provide your function app’s DNS and connection should work.
# Pipeline is killed and monitor still shows Progress status
## Issue
 Often, you kill and pipeline. Pipeline monitoring still shows Progress status. This happens because of cache  issue in browser and not having right filters.

## Resolution
 Refresh browser and apply right filters for monitoring.
 
# Copy Pipeline failure – found more columns than expected column count (DelimitedTextMoreColumnsThanDefined)
## Issue  
If the files under a particular folder you are copying contains files having different schema like, variable number of columns, different delimiters, quote char settings, or some data issue, the ADF pipeline will end up running in this error. 

```
Operation on target Copy_sks  failed: Failure happened on ‘Sink’ side.
ErrorCode=DelimitedTextMoreColumnsThanDefined,
‘Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
Message=Error found when processing ‘Csv/Tsv Format Text’ source ‘0_2020_11_09_11_43_32.avro’ with row number 53: found more columns than expected column count 27.,
Source=Microsoft.DataTransfer.Common,’
```
## Resolution
Select “Binary Copy” option while creating the Copy Data activity while doing Copy activity. So, for bulk copying or migrating your data from one Data Lake to another,  with  **binary** option, ADF won’t open the files to read schema, but it  would just treat every file as binary and copy it to the other location.

# Pipeline fails with when capacity limit of integration runtime is reached
## Issue
Customer sees error message
```'
Type=Microsoft.DataTransfer.Execution.Core.ExecutionException,Message=There are substantial concurrent MappingDataflow executions which is causing failures due to throttling under Integration Runtime 'AutoResolveIntegrationRuntime'.
```
The error indicates the limitation of per integration runtime , which is currently 50. Please refer to: [Limits](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#version-2)

If you execute large amount of data flow using the same integration runtime at the same time, it might cause this kind of error.

## Resolution 
-	Separate these pipelines to different trigger time to execute.
-	Create a new integration runtime, and split these pipelines across multiple integration runtimes.

# How to monitor pipeline failures on regular interval
## Issue

There is often need to monitor ADF pipelines in intervals, say 5 minutes. You can query and filter the pipeline runs from a data factory using the endpoint. 

## Recommendation

-	Set up an Azure Logic App to query all of the failed pipelines every 5 minutes.
-	Then, you can report incidents to out ticketing system as per [QueryByFactory](https://docs.microsoft.com/en-us/rest/api/datafactory/pipelineruns/querybyfactory)

## Reference

- [External - Send Notifications from ADF]( https://www.mssqltips.com/sqlservertip/5962/send-notifications-from-an-azure-data-factory-pipeline--part-2/ )

# How to handle activity level error and failures in pipeline 
## Issue
Azure Data Factory orchestration allows conditional logic and enables user to take different based upon outcomes of a previous activity. It allows four conditional paths: Upon Success (default pass), Upon Failure, Upon Completion, and Upon Skip. Using different paths allow.
 Azure Data Factory defines pipeline success and failures as follows:

- Evaluate outcome for all leaf level activities. If a leaf activity was skipped, we evaluate its parent activity instead
- Pipeline result is success if and only if all leaves succeed

## Recommendation
- Please implement activity level checks following [How to handle pipeline failures and errors]( https://techcommunity.microsoft.com/t5/azure-data-factory/understanding-pipeline-failures-and-error-handling/ba-p/1630459)
- Use Azure Logic App to monitor pipelines in regular intervals following [Query By DataFactory]( https://docs.microsoft.com/en-us/rest/api/datafactory/pipelineruns/querybyfactory)


