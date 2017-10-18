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
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-use-custom-activities.md)
> * [Version 2 - Preview](transform-data-using-dotnet-custom-activity.md)

There are two types of activities that you can use in an Azure Data Factory pipeline.

- [Data movement activities](copy-activity-overview.md) to move data between [supported source and sink data stores](copy-activity-overview.md#supported-data-stores-and-formats).
- [Data transformation activities](transform-data.md) to transform data using compute services such as Azure HDInsight, Azure Batch, and Azure Machine Learning. 

To move data to/from a data store that Data Factory does not support, or to transform/process data in a way that isn't supported by Data Factory, you can create a **Custom activity** with your own data movement or transformation logic and use the activity in a pipeline. The custom activity runs your customized code logic on an **Azure Batch** pool of virtual machines.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [(Custom) DotNet Activity in V1](v1/data-factory-use-custom-activities.md).
 

See following topics if you are new to Azure Batch service:

* [Azure Batch basics](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
* [New-AzureRmBatchAccount](/powershell/module/azurerm.batch/New-AzureRmBatchAccount?view=azurermps-4.3.1) cmdlet to create an Azure Batch account (or) [Azure portal](../batch/batch-account-create-portal.md) to create the Azure Batch account using Azure portal. See [Using PowerShell to manage Azure Batch Account](http://blogs.technet.com/b/windowshpc/archive/2014/10/28/using-azure-powershell-to-manage-azure-batch-account.aspx) topic for detailed instructions on using the cmdlet.
* [New-AzureBatchPool](/powershell/module/azurerm.batch/New-AzureBatchPool?view=azurermps-4.3.1) cmdlet to create an Azure Batch pool.

## Azure Batch linked service 
The following JSON defines a sample Azure Batch linked service. For details, see [Compute environments supported by Azure Data Factory](compute-linked-services.md)

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
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

 To learn more about Azure Batch linked service, see [Compute linked services](compute-linked-services.md) article. 

## Custom activity

The following JSON snippet defines a pipeline with a simple Custom Activity. The activity definition has a reference to the Azure Batch linked service. 

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
| linkedServiceName     | Linked Service to Azure Batch. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article.  | Yes      |
| command               | Command of the custom application to be executed. If the application is already available on the Azure Batch Pool Node, the resourceLinkedService and folderPath can be skipped. For example, you can specify the command to be `cmd /c dir`, which is natively supported by the Windows Batch Pool node. | Yes      |
| resourceLinkedService | Azure Storage Linked Service to the Storage account where the custom application is stored | No       |
| folderPath            | Path to the folder of the custom application and all its dependencies | No       |
| referenceObjects      | An array of existing Linked Services and Datasets. The referenced Linked Services and Datasets are passed to the custom application in JSON format so your custom code can reference resources of the Data Factory | No       |
| extendedProperties    | User-defined properties that can be passed to the custom application in JSON format so your custom code can reference additional properties | No       |

## Executing commands

You can directly execute a command using Custom Activity. In following example, we run a "echo hello world" command on the target Azure Batch Pool nodes and prints the output to stdout. 

  ```json
  {
    "name": "MyCustomActivity",
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
          "command": "cmd /c echo hello world"
        }
      }]
    }
  } 
  ```

## Passing objects and properties

This sample shows how you can use the referenceObjects and extendedProperties to pass Data Factory objects and user-defined properties to your custom application. 


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
            },
            "PropertyBagPropertyName1": "PropertyBagValue1",
            "propertyBagPropertyName2": "PropertyBagValue2",
            "dateTime1": "2015-04-12T12:13:14Z"              
        }
      }
    }]
  }
}
```

When the activity is executed, referenceObjects and extendedProperties are stored in following files that are deployed to the same execution folder of the SampleApp.exe: 

- activity.json

  Stores extendedProperties and properties of the custom activity. 

- linkedServices.json

  Stores an array of Linked Services defined in the referenceObjects property. 

- datasets.json

  Stores an array of Datasets defined in the referenceObjects property. 

Following sample code demonstrate how the SampleApp.exe can access the required information from JSON files: 

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

## Retrieve execution outputs

  You can start a pipeline run using the following PowerShell command: 

  ```.powershell
  $runId = Invoke-AzureRmDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineName $pipelineName
  ```
  When the pipeline is running, you can check the execution output using the following commands: 

  ```.powershell
  while ($True) {
      $result = Get-AzureRmDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $runId -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(30)

      if(!$result) {
          Write-Host "Waiting for pipeline to start..." -foregroundcolor "Yellow"
      }
      elseif (($result | Where-Object { $_.Status -eq "InProgress" } | Measure-Object).count -ne 0) {
          Write-Host "Pipeline run status: In Progress" -foregroundcolor "Yellow"
      }
      else {
          Write-Host "Pipeline '"$pipelineName"' run finished. Result:" -foregroundcolor "Yellow"
          $result
          break
      }
      ($result | Format-List | Out-String)
      Start-Sleep -Seconds 15
  }

  Write-Host "Activity `Output` section:" -foregroundcolor "Yellow"
  $result.Output -join "`r`n"

  Write-Host "Activity `Error` section:" -foregroundcolor "Yellow"
  $result.Error -join "`r`n"
  ```

  The **stdout** and **stderr** of your custom application are saved to the **adfjobs** container in the Azure Storage Linked Service you defined when creating Azure Batch Linked Service with a GUID of the task. You can get the detailed path from Activity Run output as shown in the following snippet: 

  ```shell
  Pipeline ' MyCustomActivity' run finished. Result:

  ResourceGroupName : resourcegroupname
  DataFactoryName   : datafactoryname
  ActivityName      : MyCustomActivity
  PipelineRunId     : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  PipelineName      : MyCustomActivity
  Input             : {command}
  Output            : {exitcode, outputs, effectiveIntegrationRuntime}
  LinkedServiceName : 
  ActivityRunStart  : 10/5/2017 3:33:06 PM
  ActivityRunEnd    : 10/5/2017 3:33:28 PM
  DurationInMs      : 21203
  Status            : Succeeded
  Error             : {errorCode, message, failureType, target}

  Activity Output section:
  "exitcode": 0
  "outputs": [
    "https://shengcstorbatch.blob.core.windows.net/adfjobs/<GUID>/output/stdout.txt",
    "https://shengcstorbatch.blob.core.windows.net/adfjobs/<GUID>/output/stderr.txt"
  ]
  "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (East US)"
  Activity Error section:
  "errorCode": ""
  "message": ""
  "failureType": ""
  "target": "MyCustomActivity"
  ```
If you would like to consume the content of stdout.txt in downstream activities, you can get the path to the stdout.txt file in expression "@activity('MyCustomActivity').output.outputs[0]". 

  > [!IMPORTANT]
  > - The activity.json, linkedServices.json, and datasets.json are stored in the runtime folder of the Bath task. For this example, the activity.json, linkedServices.json, and datasets.json are stored in "https://adfv2storage.blob.core.windows.net/adfjobs/<GUID>/runtime/" path. If needed, you need to clean them up separately. 
  > - For Linked Services uses Self-Hosted Integration Runtime, the sensitive information like keys or passwords are encrypted by the Self-Hosted Integration Runtime to ensure credential stays in customer defined private network environment. Some sensitive fields could be missing when referenced by your custom application code in this way. Use SecureString in extendedProperties instead of using Linked Service reference if needed. 

## Difference between Custom Activity in Azure Data Factory V2 and (Custom) DotNet Activity in Azure Data Factory V1 

  In Azure Data Factory V1, you implement (Custom) DotNet Activity code by creating a .Net Class Library project with a class that implements the Execute method of the IDotNetActivity interface. The Linked Services, Datasets and Extended Properties in (Custom) DotNet Activity JSON payload are passed to the Execution Method as strong typed objects. For details, refer to [(Custom) DotNet in V1](v1/data-factory-use-custom-activities.md). Because of that, your custom code needs to be written in .Net Framework 4.5.2 and be executed on Windows-based Azure Batch Pool nodes. 

  In Azure Data Factory V2 Custom Activity, you are not required to implement a .Net interface. You can now directly run commands, scripts, and run your own custom code complied as executable. You achieve so by specifying the Command property together with the folderPath property. Custom Activity uploads the executable and dependencies in folderpath and executes the command for you. 

  The Linked Services, Datasets (defined in referenceObjects), and Extended Properties defined in JSON payload of Custom Activity can be accessed by your executable as JSON files. You can access the required properties using JSON serializer as shown in preceding SampleApp.exe code sample. 

  With the changes introduced in Azure Data Factory V2 Custom Activity, you are free to write your custom code logic in your preferred language and execute them on Windows and Linux Operation Systems supported by Azure Batch. 

  If you have existing .Net code written for V1 (Custom) DotNet Activity, you need to modify your code for them to work with V2 Custom Activity with the following high-level guidelines:  

  > - Change the project from a .Net Class Library to a Console App. 
  > - Start your application with the Main method, the Execute method of the IDotNetActivity interface is no longer required. 
  > - Read and parse the Linked Services, Datasets and Activity with JSON serializer instead of as strong typed objects, and pass the values of required properties to your main custom code logic. Refer to preceding SampleApp.exe code as a sample. 
  > - Logger object is no longer supported, executeable outputs can be print to console and is saved to stdout.txt. 
  > - Microsoft.Azure.Management.DataFactories NuGet package is no longer required. 
  > - Compile your code, upload executable and dependencies to Azure Storage and define the path in folderPath property. 

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

* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Hive activity](transform-data-using-hadoop-hive.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [MapReduce activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [Machine Learning Batch Execution activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
