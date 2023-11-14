---
title: Use custom activities in a pipeline
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to create custom activities by using .NET, and then use the activities in an Azure Data Factory or Azure Synapse Analytics pipeline.
ms.service: data-factory
ms.subservice: tutorials
author: nabhishek
ms.author: abnarain
ms.topic: conceptual
ms.custom: synapse, devx-track-dotnet
ms.date: 08/10/2023
---

# Use custom activities in an Azure Data Factory or Azure Synapse Analytics pipeline

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

There are two types of activities that you can use in an Azure Data Factory or Synapse pipeline.

- [Data movement activities](copy-activity-overview.md) to move data between [supported source and sink data stores](copy-activity-overview.md#supported-data-stores-and-formats).
- [Data transformation activities](transform-data.md) to transform data using compute services such as Azure HDInsight and Azure Batch.

To move data to/from a data store that the service does not support, or to transform/process data in a way that isn't supported by the service, you can create a **Custom activity** with your own data movement or transformation logic and use the activity in a pipeline. The custom activity runs your customized code logic on an **Azure Batch** pool of virtual machines.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

See following articles if you are new to Azure Batch service:

* [Azure Batch basics](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
* [New-AzBatchAccount](/powershell/module/az.batch/New-azBatchAccount) cmdlet to create an Azure Batch account (or) [Azure portal](../batch/batch-account-create-portal.md) to create the Azure Batch account using Azure portal. See [Using PowerShell to manage Azure Batch Account](/archive/blogs/windowshpc/using-azure-powershell-to-manage-azure-batch-account) article for detailed instructions on using the cmdlet.
* [New-AzBatchPool](/powershell/module/az.batch/New-AzBatchPool) cmdlet to create an Azure Batch pool.

> [!IMPORTANT]
> When creating a new Azure Batch pool, ‘VirtualMachineConfiguration’ must be used and NOT ‘CloudServiceConfiguration'. For more details refer [Azure Batch Pool migration guidance](../batch/batch-pool-cloud-service-to-virtual-machine-configuration.md). 

## Add custom activities to a pipeline with UI

To use a Custom activity in a pipeline, complete the following steps:

1. Search for _Custom_ in the pipeline Activities pane, and drag a Custom activity to the pipeline canvas.
1. Select the new Custom activity on the canvas if it is not already selected.
1. Select the  **Azure Batch** tab to select or create a new Azure Batch linked service that will execute the custom activity.

   :::image type="content" source="media/transform-data-using-dotnet-custom-activity/custom-activity.png" alt-text="Shows the UI for a Custom activity.":::

1. Select the **Settings** tab and specify a command to be executed on the Azure Batch, and optional advanced details.

   :::image type="content" source="media/transform-data-using-dotnet-custom-activity/custom-activity-settings.png" alt-text="Shows the UI for the Settings tab for a Custom activity.":::

## Azure Batch linked service

The following JSON defines a sample Azure Batch linked service. For details, see [Supported compute environments](compute-linked-services.md)

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
| resourceLinkedService | Azure Storage Linked Service to the Storage account where the custom application is stored | No &#42;       |
| folderPath            | Path to the folder of the custom application and all its dependencies<br/><br/>If you have dependencies stored in subfolders - that is, in a hierarchical folder structure under *folderPath* - the folder structure is currently flattened when the files are copied to Azure Batch. That is, all files are copied into a single folder with no subfolders. To work around this behavior, consider compressing the files, copying the compressed file, and then unzipping it with custom code in the desired location. | No &#42;       |
| referenceObjects      | An array of existing Linked Services and Datasets. The referenced Linked Services and Datasets are passed to the custom application in JSON format so your custom code can reference resources of the service | No       |
| extendedProperties    | User-defined properties that can be passed to the custom application in JSON format so your custom code can reference additional properties | No       |
| retentionTimeInDays | The retention time for the files submitted for custom activity. Default value is 30 days. | No |

&#42; The properties `resourceLinkedService` and `folderPath` must either both be specified or both be omitted.

> [!NOTE]
> If you are passing linked services as referenceObjects in Custom Activity, it is a good security practice to pass an Azure Key Vault enabled linked service (since it does not contain any secure strings) and fetch the credentials using secret name directly from Key Vault from the code. You can find an example [here](https://github.com/nabhishek/customactivity_sample/tree/linkedservice) that references AKV enabled linked service, retrieves the credentials from Key Vault, and then accesses the storage in the code.

> [!NOTE]
> Currently only Azure Blob storage is supported for resourceLinkedService in custom activity, and it is the only linked service that gets created by default and no option to choose other connectors like ADLS Gen2.

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

This sample shows how you can use the referenceObjects and extendedProperties to pass objects and user-defined properties from the service to your custom application.

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

- `activity.json`

  Stores extendedProperties and properties of the custom activity.

- `linkedServices.json`

  Stores an array of Linked Services defined in the referenceObjects property.

- `datasets.json`

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

```powershell
$runId = Invoke-AzDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineName $pipelineName
```

When the pipeline is running, you can check the execution output using the following commands:

```powershell
while ($True) {
    $result = Get-AzDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $runId -RunStartedAfter (Get-Date).AddMinutes(-30) -RunStartedBefore (Get-Date).AddMinutes(30)

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

```
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
  "https://<container>.blob.core.windows.net/adfjobs/<GUID>/output/stdout.txt",
  "https://<container>.blob.core.windows.net/adfjobs/<GUID>/output/stderr.txt"
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
> - The activity.json, linkedServices.json, and datasets.json are stored in the runtime folder of the Batch task. For this example, the activity.json, linkedServices.json, and datasets.json are stored in `https://adfv2storage.blob.core.windows.net/adfjobs/<GUID>/runtime/` path. If needed, you need to clean them up separately.
> - For Linked Services that use the Self-Hosted Integration Runtime, the sensitive information like keys or passwords are encrypted by the Self-Hosted Integration Runtime to ensure credential stays in customer defined private network environment. Some sensitive fields could be missing when referenced by your custom application code in this way. Use SecureString in extendedProperties instead of using Linked Service reference if needed.

## Pass outputs to another activity

You can send custom values from your code in a Custom Activity back to the service. You can do so by writing them into `outputs.json` from your application. The service copies the content of `outputs.json` and appends it into the Activity Output as the value of the `customOutput` property. (The size limit is 2MB.) If you want to consume the content of `outputs.json` in downstream activities, you can get the value by using the expression `@activity('<MyCustomActivity>').output.customOutput`.

## Retrieve SecureString outputs

Sensitive property values designated as type *SecureString*, as shown in some of the examples in this article, are masked out in the Monitoring tab in the user interface.  In actual pipeline execution, however, a *SecureString* property is serialized as JSON within the `activity.json` file as plain text. For example:

```json
"extendedProperties": {
  "connectionString": {
    "type": "SecureString",
    "value": "aSampleSecureString"
  }
}
```

This serialization is not truly secure, and is not intended to be secure. The intent is a hint to the service to mask the value in the Monitoring tab.

To access properties of type *SecureString* from a custom activity, read the `activity.json` file, which is placed in the same folder as your .EXE, deserialize the JSON, and then access the JSON property (extendedProperties => [propertyName] => value).

## Auto-scaling of Azure Batch

You can also create an Azure Batch pool with **autoscale** feature. For example, you could create an Azure batch pool with 0 dedicated VMs and an autoscale formula based on the number of pending tasks.

The sample formula here achieves the following behavior: When the pool is initially created, it starts with 1 VM. $PendingTasks metric defines the number of tasks in running + active (queued) state. The formula finds the average number of pending tasks in the last 180 seconds and sets TargetDedicated accordingly. It ensures that TargetDedicated never goes beyond 25 VMs. So, as new tasks are submitted, pool automatically grows and as tasks complete, VMs become free one by one and the autoscaling shrinks those VMs. startingNumberOfVMs and maxNumberofVMs can be adjusted to your needs.

Autoscale formula:

```
startingNumberOfVMs = 1;
maxNumberofVMs = 25;
pendingTaskSamplePercent = $PendingTasks.GetSamplePercent(180 * TimeInterval_Second);
pendingTaskSamples = pendingTaskSamplePercent < 70 ? startingNumberOfVMs : avg($PendingTasks.GetSample(180 * TimeInterval_Second));
$TargetDedicated=min(maxNumberofVMs,pendingTaskSamples);
```

See [Automatically scale compute nodes in an Azure Batch pool](../batch/batch-automatic-scaling.md) for details.

If the pool is using the default [autoScaleEvaluationInterval](/rest/api/batchservice/pool/enableautoscale), the Batch service could take 15-30 minutes to prepare the VM before running the custom activity. If the pool is using a different autoScaleEvaluationInterval, the Batch service could take autoScaleEvaluationInterval + 10 minutes.

## Next steps
See the following articles that explain how to transform data in other ways:

* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Hive activity](transform-data-using-hadoop-hive.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [MapReduce activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
