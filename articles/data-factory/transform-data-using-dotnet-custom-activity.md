---
title: Use custom activities in an Azure Data Factory pipeline
description: Learn how to create custom activities and use them in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: douglaslMS
manager: craigg

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/18/2018
ms.author: douglasl

---
# Use custom activities in an Azure Data Factory pipeline
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-use-custom-activities.md)
> * [Current version](transform-data-using-dotnet-custom-activity.md)

There are two types of activities that you can use in an Azure Data Factory pipeline.

- [Data movement activities](copy-activity-overview.md) to move data between [supported source and sink data stores](copy-activity-overview.md#supported-data-stores-and-formats).
- [Data transformation activities](transform-data.md) to transform data using compute services such as Azure HDInsight, Azure Batch, and Azure Machine Learning. 

To move data to/from a data store that Data Factory does not support, or to transform/process data in a way that isn't supported by Data Factory, you can create a **Custom activity** with your own data movement or transformation logic and use the activity in a pipeline. The custom activity runs your customized code logic on an **Azure Batch** pool of virtual machines.

See following articles if you are new to Azure Batch service:

* [Azure Batch basics](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
* [New-AzureRmBatchAccount](/powershell/module/azurerm.batch/New-AzureRmBatchAccount?view=azurermps-4.3.1) cmdlet to create an Azure Batch account (or) [Azure portal](../batch/batch-account-create-portal.md) to create the Azure Batch account using Azure portal. See [Using PowerShell to manage Azure Batch Account](http://blogs.technet.com/b/windowshpc/archive/2014/10/28/using-azure-powershell-to-manage-azure-batch-account.aspx) article for detailed instructions on using the cmdlet.
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
| folderPath            | Path to the folder of the custom application and all its dependencies<br/><br/>If you have dependencies stored in subfolders - that is, in a hierarchical folder structure under *folderPath* - the folder structure is currently flattened when the files are copied to Azure Batch. That is, all files are copied into a single folder with no subfolders. To work around this behavior, consider compressing the files, copying the compressed file, and then unzipping it with custom code in the desired location. | No       |
| referenceObjects      | An array of existing Linked Services and Datasets. The referenced Linked Services and Datasets are passed to the custom application in JSON format so your custom code can reference resources of the Data Factory | No       |
| extendedProperties    | User-defined properties that can be passed to the custom application in JSON format so your custom code can reference additional properties | No       |

## Custom activity permissions

The custom activity sets the Azure Batch auto-user account to *Non-admin access with task scope* (the default auto-user specification). You can't change the permission level of the auto-user account. For more info, see [Run tasks under user accounts in Batch | Auto-user accounts](../batch/batch-user-accounts.md#auto-user-accounts).

## Executing commands

You can directly execute a command using Custom Activity. The following example runs the "echo hello world" command on the target Azure Batch Pool nodes and prints the output to stdout. 

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

```csharp
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
            Console.WriteLine(linkedServices[0].properties.typeProperties.accountName);
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
If you would like to consume the content of stdout.txt in downstream activities, you can get the path to the stdout.txt file in expression "\@activity('MyCustomActivity').output.outputs[0]". 

  > [!IMPORTANT]
  > - The activity.json, linkedServices.json, and datasets.json are stored in the runtime folder of the Batch task. For this example, the activity.json, linkedServices.json, and datasets.json are stored in "https://adfv2storage.blob.core.windows.net/adfjobs/<GUID>/runtime/" path. If needed, you need to clean them up separately. 
  > - For Linked Services uses Self-Hosted Integration Runtime, the sensitive information like keys or passwords are encrypted by the Self-Hosted Integration Runtime to ensure credential stays in customer defined private network environment. Some sensitive fields could be missing when referenced by your custom application code in this way. Use SecureString in extendedProperties instead of using Linked Service reference if needed. 

## Retrieve SecureString outputs

Sensitive property values designated as type *SecureString*, as shown in some of the examples in this article, are masked out in the Monitoring tab in the Data Factory user interface.  In actual pipeline execution, however, a *SecureString* property is serialized as JSON within the `activity.json` file as plain text. For example:

```json
"extendedProperties": {
	"connectionString": {
		"type": "SecureString",
		"value": "aSampleSecureString"
	}
}
```

This serialization is not truly secure, and is not intended to be secure. The intent is to hint to Data Factory to mask the value in the Monitoring tab.

To access properties of type *SecureString* from a custom activity, read the `activity.json` file, which is placed in the same folder as your .EXE, deserialize the JSON, and then access the JSON property (extendedProperties => [propertyName] => value).

## <a name="compare-v2-v1"></a> Compare v2 Custom Activity and version 1 (Custom) DotNet Activity

  In Azure Data Factory version 1, you implement a (Custom) DotNet Activity by creating a .Net Class Library project with a class that implements the `Execute` method of the `IDotNetActivity` interface. The Linked Services, Datasets, and Extended Properties in the JSON payload of a (Custom) DotNet Activity are passed to the execution method as strongly-typed objects. For details about the version 1 behavior, see [(Custom) DotNet in version 1](v1/data-factory-use-custom-activities.md). Because of this implementation, your version 1 DotNet Activity code has to target .Net Framework 4.5.2. The version 1 DotNet Activity also has to be executed on Windows-based Azure Batch Pool nodes. 

  In the Azure Data Factory V2 Custom Activity, you are not required to implement a .Net interface. You can now directly run commands, scripts, and your own custom code, compiled as an executable. To configure this implementation, you specify the `Command` property together with the `folderPath` property. The Custom Activity uploads the executable and its dependencies to `folderpath` and executes the command for you. 

  The Linked Services, Datasets (defined in referenceObjects), and Extended Properties defined in the JSON payload of a Data Factory v2 Custom Activity can be accessed by your executable as JSON files. You can access the required properties using a JSON serializer as shown in the preceding SampleApp.exe code sample. 

  With the changes introduced in the Data Factory V2 Custom Activity, you can write your custom code logic in your preferred language and execute it on Windows and Linux Operation Systems supported by Azure Batch. 

  The following table describes the differences between the Data Factory V2 Custom Activity and the Data Factory version 1 (Custom) DotNet Activity: 


|Differences      | Custom Activity      | version 1 (Custom) DotNet Activity      |
| ---- | ---- | ---- |
|How custom logic is defined      |By providing an executable      |By implementing a .Net DLL      |
|Execution environment of the custom logic      |Windows or Linux      |Windows (.Net Framework 4.5.2)      |
|Executing scripts      |Supports executing scripts directly (for example "cmd /c echo hello world" on Windows VM)      |Requires implementation in the .Net DLL      |
|Dataset required      |Optional      |Required to chain activities and pass information      |
|Pass information from activity to custom logic      |Through ReferenceObjects (LinkedServices and Datasets) and ExtendedProperties (custom properties)      |Through ExtendedProperties (custom properties), Input, and Output Datasets      |
|Retrieve information in custom logic      |Parses activity.json, linkedServices.json, and datasets.json stored in the same folder of the executable      |Through .Net SDK (.Net Frame 4.5.2)      |
|Logging      |Writes directly to STDOUT      |Implementing Logger in .Net DLL      |


  If you have existing .Net code written for a version 1 (Custom) DotNet Activity, you need to modify your code for it to work with the current version of the Custom Activity. Update your code by following these high-level guidelines:  

   - Change the project from a .Net Class Library to a Console App. 
   - Start your application with the `Main` method. The `Execute` method of the `IDotNetActivity` interface is no longer required. 
   - Read and parse the Linked Services, Datasets and Activity with a JSON serializer, and not as strongly-typed objects. Pass the values of required properties to your main custom code logic. Refer to the preceding SampleApp.exe code as an example. 
   - The Logger object is no longer supported. Output from your executable can be printed to the console and is saved to stdout.txt. 
   - The Microsoft.Azure.Management.DataFactories NuGet package is no longer required. 
   - Compile your code, upload the executable and its dependencies to Azure Storage, and define the path in the `folderPath` property. 

For a complete sample of how the end-to-end DLL and pipeline sample described in the Data Factory version 1 article [Use custom activities in an Azure Data Factory pipeline](https://docs.microsoft.com/azure/data-factory/v1/data-factory-use-custom-activities) can be rewritten as a Data Factory Custom Activity, see [Data Factory Custom Activity sample](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/ADFv2CustomActivitySample). 

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
