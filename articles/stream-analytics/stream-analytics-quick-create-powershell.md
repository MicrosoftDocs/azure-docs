---
title: Create a Stream Analytics job by using Azure PowerShell | Microsoft Docs
description: This quickstart details using the Azure PowerShell module to deploy and run an Azure Stream Analytics job.
services: stream-analytics
keywords: Stream analytics, Cloud jobs, Azure PowerShell, job input, job output, job transformation

author: SnehaGunda
ms.author: sngun
ms.date: 03/16/2018
ms.topic: quickstart
ms.service: stream-analytics
ms.custom: mvc
manager: kfile
#Customer intent: "As an IT admin/developer I want to create a Stream Analytics job, configure input and output & analyze data by using Azure PowerShell."
---

# Quickstart: Create a Stream Analytics job by using Azure PowerShell

The Azure PowerShell module is used to create and manage Azure resources by using PowerShell cmdlets or scripts. This quickstart details using the Azure PowerShell module to deploy and run an Azure Stream Analytics job.

## Before you begin

* If you don't have an Azure subscription, create a [free account.](https://azure.microsoft.com/free/)  

* This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version that is installed on your local machine. If you need to install or upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) article. The scenario in this article describes reading data from the blob storage, transforming the data and writing it back to a different container in the same blob storage.

## Sign in to Azure

Log in to your Azure subscription with the `Connect-AzureRmAccount` command and enter your Azure credentials in the pop-up browser. After signing in, if you have multiple subscriptions, select the subscription that you would like to use for this quickstart by running the following cmdlets. Make sure to replace <your subscription> with the name of your subscription:  

```powershell
# Log in to your Azure account
Connect-AzureRmAccount

# Select the Azure subscription you want to use to create the resource group.
Get-AzureRmSubscription `
  -SubscriptionName “<your subscription>” | Select-AzureRmSubscription
```

## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```powershell
$resourceGroup = "ASAPSRG"
$location = "WestUS2"
New-AzureRMResourceGroup `
  -Name $resourceGroup `
  -Location $location 
```

## Prepare the input data

Before defining the Stream Analytics job, you should prepare the data which is configured as input to the job. Run the following steps to prepare the input data required by the job: 

1. Download the [sensor sample data](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/GettingStarted/HelloWorldASA-InputStream.json) from GitHub.  

2. Create a standard general-purpose storage account with LRS replication using [New-AzureRmStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.storage/New-AzureRmStorageAccount) cmdlet  

3. Retrieve the storage account context that defines the storage account to be used. When working with storage accounts, you reference the context instead of repeatedly providing the credentials. This example creates a storage account called mystorageaccount with locally redundant storage(LRS) and blob encryption (enabled by default).  

4. Next create a container using [New-AzureStorageContainer](https://docs.microsoft.com/powershell/module/azure.storage/new-azurestoragecontainer), set the permissions to 'blob' to allow public access of the files, and upload the [sensor sample data](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/GettingStarted/HelloWorldASA-InputStream.json) that you downloaded earlier. 

These steps are achieved by running the following PowerShell script:

```powershell
$storageAccountName = "mystorageaccount"
$storageAccount = New-AzureRmStorageAccount `
  -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind Storage

$ctx = $storageAccount.Context
$containerName = "myinputcontainer"

New-AzureStorageContainer `
  -Name $containerName `
  -Context $ctx `
  -Permission blob

Set-AzureStorageBlobContent `
  -File "C:\HelloWorldASA-InputStream.json" `
  -Container $containerName `
  -Context $ctx  

$storageAccountKey = (Get-AzureRmStorageAccountKey `
  -ResourceGroupName $resourceGroup `
  -Name $storageAccountName).Value[0]
```

## Create a Stream Analytics job

Create a Stream Analytics job with [New-AzureRMStreamAnalyticsJob](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/new-azurermstreamanalyticsjob?view=azurermps-5.4.0) cmdlet. This cmdlet takes the job name, resource group name, and the job definition as parameters. Job name can be any friendly name that identifies your job, Stream Analytics job name can contain alphanumeric characters, hyphens, and underscores only and it must be between 3 and 63 characters long. Job definition is a JSON file that contains the properties required to create a job. On your local machine, create a file named “JobDefinition.json” and add the following JSON data to it:

```json
{    
   "location":"Central US",  
   "properties":{    
      "sku":{    
         "name":"standard"  
      },  
      "eventsOutOfOrderPolicy":"drop",  
      "eventsOutOfOrderMaxDelayInSeconds":10,  
      "compatibilityLevel": 1.1
}
}
```

Next run the New-AzureRMStreamAnalyticsJob cmdlet, make sure to replace the value of jobDefinitionFile variable with the path where you have stored the job definition JSON file. 

```powershell
$jobName = "MyStreamingJob"
$jobDefinitionFile = "C:\JobDefinition.json"
New-AzureRMStreamAnalyticsJob `
  -ResourceGroupName $resourceGroup `
  –File $jobDefinitionFile `
  –Name $jobName -Force 
```

## Configure input to the job

Add an input to your job by using the [New-AzureRMStreamAnalyticsInput](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/new-azurermstreamanalyticsinput?view=azurermps-5.4.0) cmdlet. This cmdlet takes the job name, job input name, resource group name, and the job input definition as parameters. Job input definition is a JSON file that contains the properties required to configure the job’s input, in this example you will create a blob storage as an input. 
On your local machine, create a file named “JobInputDefinition.json” and add the following JSON data to it, make sure to replace the value for **accountKey** with your storage account’s access key that is the value stored in $storageAccountKey value. 

```json
{
    "properties": {
        "type": "Stream",
        "datasource": {
            "type": "Microsoft.Storage/Blob",
            "properties": {
                "storageAccounts": [
                {
                   "accountName": "mystorageaccount",
                   "accountKey":"<Your storage account key>"
                }],
                "container": "myinputcontainer",
                "pathPattern": "",
                "dateFormat": "yyyy/MM/dd",
                "timeFormat": "HH"
            }
        },
        "serialization": {
            "type": "Json",
            "properties": {
                "encoding": "UTF8"
            }
        }
    },
    "name": "MyBlobInput",
    "type": "Microsoft.StreamAnalytics/streamingjobs/inputs"
}
```

Next run the New-AzureRMStreamAnalyticsInput cmdlet, make sure to replace the value of jobDefinitionFile variable with the path where you have stored the job input definition JSON file. 

```powershell
$jobInputName = "MyBlobInput"
$jobInputDefinitionFile = "C:\JobInputDefinition.json"
New-AzureRMStreamAnalyticsInput `
  -ResourceGroupName $resourceGroup `
  -JobName $jobName `
  -File $jobInputDefinitionFile `
  -Name $jobInputName 
```

## Configure output to the job

Add an output to your job by using the [New-AzureRmStreamAnalyticsOutput](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/new-azurermstreamanalyticsoutput?view=azurermps-5.4.0) cmdlet. This cmdlet takes the job name, job output name, resource group name, and the job output definition as parameters. Job output definition is a JSON file that contains the properties required to configure job’s output, in this example you will create a blob storage as output. 
On your local machine, create a file named “JobOutputDefinition.json” and add the following JSON data to it, make sure to replace the value for **accountKey** with your storage account’s access key that is the value stored in $storageAccountKey value. 

```json
{
    "properties": {
        "datasource": {
            "type": "Microsoft.Storage/Blob",
            "properties": {
                "storageAccounts": [
                    {
                      "accountName": "mystorageaccount",
		              "accountKey": "<Your storage account key>"
                    }],
                "container": "myoutputcontainer",
                "pathPattern": "",
                "dateFormat": "yyyy/MM/dd",
                "timeFormat": "HH"
            }
        },
        "serialization": {
            "type": "Json",
            "properties": {
                "encoding": "UTF8",
			    "format": "LineSeparated"
            }
        }
    },
    "name": "MyBlobOutput",
    "type": "Microsoft.StreamAnalytics/streamingjobs/outputs"
}
```

Next run the New-AzureRMStreamAnalyticsOutput cmdlet, make sure to replace the value of jobOutputDefinitionFile variable with the path where you have stored the job output definition JSON file. 

```powershell
$jobOutputName = "MyBlobOutput"
$jobOutputDefinitionFile = "C:\JobOutputDefinition.json"
New-AzureRMStreamAnalyticsOutput `
  -ResourceGroupName $resourceGroup `
  –JobName $jobName `
  –File $jobOutputDefinitionFile `
  –Name $jobOutputName -Force 
```

## Define the transformation query

Add a transformation your job by using the [New-AzureRmStreamAnalyticsTransformation](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/new-azurermstreamanalyticstransformation?view=azurermps-5.4.0) cmdlet. This cmdlet takes the job name, job transformation name, resource group name, and the job transformation definition as parameters. On your local machine, create a file named “JobTransformationDefinition.json” and add the following JSON data to it. The JSON file contains a query parameter that defines the transformation query:

```json
{     
   "name":"MyTransformation",  
   "type":"Microsoft.StreamAnalytics/streamingjobs/transformations",  
   "properties":{    
      "streamingUnits":1,  
      "script":null,  
      "query":" SELECT System.Timestamp AS OutputTime, dspl AS SensorName, Avg(temp) AS AvgTemperature INTO MyBlobOutput FROM MyBlobInput TIMESTAMP BY time GROUP BY TumblingWindow(second,30),dspl HAVING Avg(temp)>100"  
   }  
}
```

Next run the New-AzureRMStreamAnalyticsTransformation cmdlet, make sure to replace the value of jobTransformationDefinitionFile variable with the path where you have stored the job transformation definition JSON file. 

```powershell
$jobTransformationName = "MyJobTransformation"
$jobTransformationDefinitionFile = "C:\JobTransformationDefinition.json"
New-AzureRMStreamAnalyticsTransformation `
  -ResourceGroupName $resourceGroup `
  –JobName $jobName `
  –File $jobTransformationDefinitionFile `
  –Name $jobTransformationName -Force
```

## Start the Stream Analytics job and check the output

Start the job by using the [Start-AzureRMStreamAnalyticsJob](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/start-azurermstreamanalyticsjob?view=azurermps-5.4.0) cmdlet. This cmdlet takes the job name, resource group name, output start mode, and start time as parameters. OUtpputStartMode accepts two values JobStartTime, CustomTime, or LastOutputEventTime to learn about what each of these values are referring to, see the [parameters](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/start-azurermstreamanalyticsjob?view=azurermps-5.4.0) section in PowerShell documentation. In this example, you can specify mode as CustomTime and provide a value for the OutputStartTime. 

For time value, select one day prior to when you uploaded the file to blob storage because the time at which the file was uploaded is earlier that the current time. After you run the following cmdlet, it returns “True” as output if the job starts. A container named “myoutputcontainer” is created in the storage account with the transformed data. 

```powershell
Start-AzureRMStreamAnalyticsJob `
  -ResourceGroupName $resourceGroup `
  -Name $jobName `
  -OutputStartMode CustomTime `
  -OutputStartTime 2018-03-11T14:45:12Z 
```

## Clean up resources

When no longer needed, delete the resource group, the streaming job, and all related resources. Deleting the job avoids billing the streaming units consumed by the job. If you're planning to use the job in future, you can stop it and re-start it later when you need. If you are not going to continue to use this job, delete all resources created by this quickstart by running the following cmdlet:

```powershell
Remove-AzureRmResourceGroup `
  -Name $resourceGroup 
```

## Next steps

In this quickstart, you’ve deployed a simple Stream Analytics job, to learn about configuring other input sources and performing real-time detection, continue to the following article:

> [!div class="nextstepaction"]
> [Real-time fraud detection using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
