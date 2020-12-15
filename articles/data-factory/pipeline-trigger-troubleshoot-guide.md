---
title: Troubleshoot pipeline orchestration and triggers in ADF
description: Use different methods to troubleshoot pipeline trigger issues in ADF 
author: ssabat
ms.service: data-factory
ms.date: 12/15/2020
ms.topic: troubleshooting
ms.author: susabat
ms.reviewer: susabat
---

# Troubleshoot pipeline orchestration and triggers in ADF

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A pipeline run in Azure Data Factory defines an instance of a pipeline execution. For example, you have a pipeline that executes at 8:00 AM, 9:00 AM, and 10:00 AM. In this case, there are three separate runs of the pipeline or pipeline runs. Each pipeline run has a unique pipeline run ID. A run ID is a GUID (Globally Unique Identifier) that defines that particular pipeline run.

Pipeline runs are typically instantiated by passing arguments to parameters that you define in the pipeline. You can execute a pipeline either manually or by using a trigger. Refer to [Pipeline execution and triggers in Azure Data Factory](concepts-pipeline-execution-triggers.md) for details.

## Common issues, causes, and solutions

### Pipeline with Azure Function throws error with private end-point connectivity
 
#### Issue
For some context, you have ADF  and Azure Function App running on a private endpoint. You are trying to get a pipeline that interacts with the Azure Function App to work. You have tried three different methods, but one returns error `Bad Request`, the other two methods return `103 Error Forbidden`.

#### Cause 
ADF currently does not support a private endpoint connector for Azure Function App. And this should be the reason why Azure Function App is rejecting the calls since it would be configured to allow only connections from a Private Link.

#### Resolution
You can create a Private Endpoint of type **PrivateLinkService** and provide your function app's DNS, and the connection should work.

### Pipeline run is killed but the monitor still shows progress status

#### Issue
Often when you kill a pipeline run, pipeline monitoring still shows the progress status. This happens because of the cache issue in browser and you are not having right filters for monitoring.

#### Resolution
Refresh the browser and apply right filters for monitoring.
 
### Copy Pipeline failure – found more columns than expected column count (DelimitedTextMoreColumnsThanDefined)

#### Issue  
If the files under a particular folder you are copying contains files with different schemas like variable number of columns, different delimiters, quote char settings, or some data issue, the ADF pipeline will end up running in this error:

`
Operation on target Copy_sks  failed: Failure happened on 'Sink' side.
ErrorCode=DelimitedTextMoreColumnsThanDefined,
'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
Message=Error found when processing 'Csv/Tsv Format Text' source '0_2020_11_09_11_43_32.avro' with row number 53: found more columns than expected column count 27.,
Source=Microsoft.DataTransfer.Common,'
`

#### Resolution
Select "Binary Copy" option while creating the Copy Data activity. In this way, for bulk copy or migrating your data from one Data Lake to another, with **binary** option, ADF won't open the files to read schema, but just treat every file as binary and copy them to the other location.

### Pipeline run fails when capacity limit of integration runtime is reached

#### Issue
Error message:

`
Type=Microsoft.DataTransfer.Execution.Core.ExecutionException,Message=There are substantial concurrent MappingDataflow executions which is causing failures due to throttling under Integration Runtime 'AutoResolveIntegrationRuntime'.
`

The error indicates the limitation of per integration runtime, which is currently 50. Refer to [Limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#version-2) for details.

If you execute large amount of data flow using the same integration runtime at the same time, it might cause this kind of error.

#### Resolution 
- Separate these pipelines for different trigger time to execute.
- Create a new integration runtime, and split these pipelines across multiple integration runtimes.

### How to monitor pipeline failures on regular interval

#### Issue
There is often a need to monitor ADF pipelines in intervals, say 5 minutes. You can query and filter the pipeline runs from a data factory using the endpoint. 

#### Recommendation
1. Set up an Azure Logic App to query all of the failed pipelines every 5 minutes.
2. Then, you can report incidents to our ticketing system as per [QueryByFactory](https://docs.microsoft.com/rest/api/datafactory/pipelineruns/querybyfactory).

#### Reference
- [External-Send Notifications from ADF](https://www.mssqltips.com/sqlservertip/5962/send-notifications-from-an-azure-data-factory-pipeline--part-2/)

### How to handle activity-level errors and failures in pipelines

#### Issue
Azure Data Factory orchestration allows conditional logic and enables user to take different paths based upon outcomes of a previous activity. It allows four conditional paths: "Upon Success (default pass)", "Upon Failure", "Upon Completion", and "Upon Skip". Using different paths is allowed.

Azure Data Factory defines pipeline run success and failure as follows:

- Evaluate outcome for all leaf level activities. If a leaf activity was skipped, we evaluate its parent activity instead.
- Pipeline result is successful if and only if all leaves succeed.

#### Recommendation
- Implement activity level checks following [How to handle pipeline failures and errors](https://techcommunity.microsoft.com/t5/azure-data-factory/understanding-pipeline-failures-and-error-handling/ba-p/1630459).
- Use Azure Logic App to monitor pipelines in regular intervals following [Query By DataFactory]( https://docs.microsoft.com/rest/api/datafactory/pipelineruns/querybyfactory).

## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)