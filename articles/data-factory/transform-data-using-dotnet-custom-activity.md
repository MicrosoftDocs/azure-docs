---
title: Use custom activities in an Azure Data Factory pipeline
description: Learn how to create custom activities and use them in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: shengcmsft
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: shengc

---
# Use custom activities in an Azure Data Factory pipeline

There are two types of activities that you can use in an Azure Data Factory pipeline.

- [Data movement activities](copy-activity-overview.md) to move data between [supported source and sink data stores](copy-activity-overview.md#supported-data-stores-and-formats).
- [Data transformation activities](trasnform-data.md) to transform data using compute services such as Azure HDInsight, Azure Batch, and Azure Machine Learning. 

To move data to/from a data store that Data Factory does not support, or to transform/process data in a way that isn't supported by Data Factory, you can create a **Custom activity** with your own data movement or transformation logic and use the activity in a pipeline. The custom activity runs your customized code logic on an **Azure Batch** pool of virtual machines. 

See following topics if you are new to Azure Batch service:

* [Azure Batch basics](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
* [New-AzureRmBatchAccount](/powershell/module/azurerm.batch/New-AzureRmBatchAccount?view=azurermps-4.3.1) cmdlet to create an Azure Batch account (or) [Azure portal](../batch/batch-account-create-portal.md) to create the Azure Batch account using Azure portal. See [Using PowerShell to manage Azure Batch Account](http://blogs.technet.com/b/windowshpc/archive/2014/10/28/using-azure-powershell-to-manage-azure-batch-account.aspx) topic for detailed instructions on using the cmdlet.
* [New-AzureBatchPool](/powershell/module/azurerm.batch/New-AzureBatchPool?view=azurermps-4.3.1) cmdlet to create an Azure Batch pool.

### Azure Batch Linked Service 

Refer to the JSON definition of an sample Azure Batch Linked Services below, for details, refer to [Compute environments supported by Azure Data Factory](compute-linked-services.md)

```json
{
  "name": "AzureBatchLinkedService",
  "properties": {
    "type": "AzureBatch",
    "typeProperties": {
      "accountName": "batchaccount",
      "accessKey": {
        "type": "SecureString",
        "value": "access key"
      },
      "batchUri": "https://batchaccount.region.batch.azure.com",
      "poolName": "poolname",
      "linkedServiceName": {
        "referenceName": "StorageLinkedService",
        "type": "LinkedServiceReference"
      }
    }
  }
}
```

### Custom Activity

The following JSON snippet defines a pipeline with a simple Custom Activity. The activity definition has a reference to the Azure Batch linked service created above. 

```json
{
    "name": "MyCustomActivityPipeline",
    "properties": {
      "description": "Custom activity sample",
      "activities": [{
        "type": "Custom",
        "name": "MyCustomActivity",
        "linkedServiceName": {
          "referenceName": "AzureBatchLinkedService",
          "type": "LinkedServiceReference"
        },
        "typeProperties": {
          "command": "helloworld.exe",
          "folderPath": "customactv2/helloworld",
          "resourceLinkedService": {
            "referenceName": "StorageLinkedService",
            "type": "LinkedServiceReference"
          }
        }
      }]
    }
  }
```

In this sample, the helloworld.exe is a custom application stored in the customactv2/helloworld folder of the Azure Storage account used in the resourceLinkedService. The Custom activity submits this custom application to be executed on Azure Batch. You can replace the command to any preferred application that can be executed on the target Operation System of the Azure Batch Pool nodes. 

The following table describes names and descriptions of properties that are specific to this activity. 

| Property              | Description                              | Required |
| :-------------------- | :--------------------------------------- | :------- |
| name                  | Name of the activity in the pipeline     | Yes      |
| description           | Text describing what the activity does.  | No       |
| type                  | For Custom activity, the activity type is **Custom**. | Yes      |
| linkedServiceName     | Linked Service to Azure Batch            | Yes      |
| command               | Command of the custom application to be executed. If the application is already available on the Azure Batch Pool Node, the resourceLinkedService and folderPath can be skipped. For example, you can specify the command to be "cmd /c dir" which is natively supported by the Windows Batch Pool node. | Yes      |
| resourceLinkedService | Azure Storage Linked Service to the Storage account here the above custom application is stored | No       |
| folderPath            | Path to the folder of the custom application and all its dependencies | No       |
| referenceObjects      | An array of existing Linked Services and Datasets. The referenced Linked Services and Datasets are passed to the custom application in JSON format so your custom code can reference resources of the Data Factory | No       |
| extendedProperties    | User defined properties that can be passed to the custom application in JSON format so your custom code can reference additional properties | No       |

####Passing objects and properties

The below sample shows how you can use the referenceObjects and extendedProperties to pass Data Factory objects and user defined properties to your custom application. 


```json
{
  "name": "MyCustomActivityPipeline",
  "properties": {
    "description": "Custom activity sample",
    "activities": [{
      "type": "Custom",
      "name": "MyCustomActivity",
      "linkedServiceName": {
        "referenceName": "AzureBatchLinkedService",
        "type": "LinkedServiceReference"
      },
      "typeProperties": {
        "command": "SampleApp.exe",
        "folderPath": "customactv2/SampleApp",
        "resourceLinkedService": {
          "referenceName": "StorageLinkedService",
          "type": "LinkedServiceReference"
        },
        "referenceObjects": {
          "linkedServices": [{
            "referenceName": "AzureBatchLinkedService",
            "type": "LinkedServiceReference"
          }]
        },
        "extendedProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "aSampleSecureString"
            }           
        }
      }
    }]
  }
}
```

When the activity is executed, referenceObjects and extendedProperties are stored in following files which are deployed to the same execution folder of the SampleApp.exe: 

- activity.json

  Stores extendedProperties and properties of the custom activity. 

- linkedServices.json

  Stores an array of Linked Services defined in the referenceObjects property. 

- datasets.json

  Stores an array of Datasets defined in the referenceObjects property. 

Following sample code demonstrate how the SampleApp.exe can accesses the required information from above JSON files: 

```C#
using Newtonsoft.Json;
using System;
using System.IO;

namespace SampleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            //From Extend Properties
            dynamic activity = JsonConvert.DeserializeObject(File.ReadAllText("activity.json"));
            Console.WriteLine(activity.typeProperties.extendedProperties.connectionString.value);

            // From LinkedServices
            dynamic linkedServices = JsonConvert.DeserializeObject(File.ReadAllText("linkedServices.json"));
            Console.WriteLine(linkedServices[0].properties.typeProperties.connectionString.value);
        }
    }
}
```

####Retrieve execution outputs

You can start a pipeline run of the above sample pipeline and monitor the execution result using the following PowerShell commands: 

```powershell
$runId = New-AzureRmDataFactoryV2PipelineRun -dataFactoryName "factoryName" -PipelineName "pipelineName" -Parameters @{ dummy = "b" }
$result = Get-AzureRmDataFactoryV2ActivityRun -dataFactoryName "factoryName" -PipelineName "pipelineName" -PipelineRunId $runId -RunStartedAfter "2017-09-06" -RunStartedBefore "2017-12-31"
$result.output -join "`r`n" 
$result.Error -join "`r`n" 
```

The **stdout** and **stderr** of your custom application will be saved to a adfjobs container in the Azure Storage Linked Service you defined when creating Azure Batch Linked Service with a GUID of the task. You can get the detailed path from Activity Run output as shown below: 

```shell
"exitcode": 0
"outputs": [
"https://adfv2storage.blob.core.windows.net/adfjobs/097235ff-2c65-4d50-9770-29c029cbafbb/output/stdout.txt",
"https://adfv2storage.blob.core.windows.net/adfjobs/097235ff-2c65-4d50-9770-29c029cbafbb/output/stderr.txt"
]
"errorCode": ""
"message": ""
"failureType": ""
"target": "MyCustomActivity"
```

> [!IMPORTANT]
> - The activity.json, linkedServices.json and datasets.json are stored in the runtime folder of the Bath task. For above example, the activity.json, linkedServices.json and datasets.json are stored in https://adfv2storage.blob.core.windows.net/adfjobs/097235ff-2c65-4d50-9770-29c029cbafbb/runtime/ path. You will need to clean it up separately if needed. 
> - For Linked Services uses Self-Hosted Integration Runtime, the sensitive information like keys or passwords are encrypted by the Self-Hosted Integration Runtime to ensure credential stays in customer defined private network environment. Some sensitive fields could be missing when referenced by your custom application code in above way. Use SecureString in extendedProperties instead of using Linked Service reference if needed. 



## Auto-scaling of Azure Batch
You can also create an Azure Batch pool with **autoscale** feature. For example, you could create an azure batch pool with 0 dedicated VMs and an autoscale formula based on the number of pending tasks. 

The sample formula here achieves the following behavior: When the pool is initially created, it starts with 1 VM. $PendingTasks metric defines the number of tasks in running + active (queued) state.  The formula finds the average number of pending tasks in the last 180 seconds and sets TargetDedicated accordingly. It ensures that TargetDedicated never goes beyond 25 VMs. So, as new tasks are submitted, pool automatically grows and as tasks complete, VMs become free one by one and the autoscaling shrinks those VMs. startingNumberOfVMs and maxNumberofVMs can be adjusted to your needs.

Autoscale formula:

``` 
startingNumberOfVMs = 1;
maxNumberofVMs = 25;
pendingTaskSamplePercent = $PendingTasks.GetSamplePercent(180 * TimeInterval_Second);
pendingTaskSamples = pendingTaskSamplePercent < 70 ? startingNumberOfVMs : avg($PendingTasks.GetSample(180 * TimeInterval_Second));
$TargetDedicated=min(maxNumberofVMs,pendingTaskSamples);
```

See [Automatically scale compute nodes in an Azure Batch pool](../batch/batch-automatic-scaling.md) for details.

If the pool is using the default [autoScaleEvaluationInterval](https://msdn.microsoft.com/library/azure/dn820173.aspx), the Batch service could take 15-30 minutes to prepare the VM before running the custom activity.  If the pool is using a different autoScaleEvaluationInterval, the Batch service could take autoScaleEvaluationInterval + 10 minutes.


## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL Activity](transform-data-using-data-lake-analytics.md)
* [Hive Activity](transform-data-using-hadoop-hive.md)
* [Pig Activity](transform-data-using-hadoop-pig.md)
* [MapReduce Activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming Activity](transform-data-using-hadoop-streaming.md)
* [Spark Activity](transform-data-using-spark.md)
* [Machine Learning Bach Execution Activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
