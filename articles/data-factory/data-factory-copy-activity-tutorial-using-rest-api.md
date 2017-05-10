---
title: 'Tutorial: Create a pipeline with Copy Activity using REST API | Microsoft Docs'
description: In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using REST API.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: 1704cdf8-30ad-49bc-a71c-4057e26e7350
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/11/2017
ms.author: spelluru

---
# Tutorial: Create a pipeline with Copy Activity using REST API
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
> * [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
> * [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
> * [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
> * [Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
> * [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
> * [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)
> 
> 

This tutorial shows you how to create and monitor an Azure data factory using the REST API. The pipeline in the data factory uses a Copy Activity to copy data from Azure Blob Storage to Azure SQL Database.

> [!NOTE]
> This article does not cover all the Data Factory REST API. See [Data Factory REST API Reference](/rest/api/datafactory/) for comprehensive documentation on Data Factory cmdlets.
> 
> The data pipeline in this tutorial copies data from a source data store to a destination data store. It does not transform input data to produce output data. For a tutorial on how to transform data using Azure Data Factory, see [Tutorial: Build a pipeline to transform data using Hadoop cluster](data-factory-build-your-first-pipeline.md).

## Prerequisites
* Go through [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) and complete the **prerequisite** steps.
* Install [Curl](https://curl.haxx.se/dlwiz/) on your machine. You use the Curl tool with REST commands to create a data factory. 
* Follow instructions from [this article](../azure-resource-manager/resource-group-create-service-principal-portal.md) to: 
  1. Create a Web application named **ADFCopyTutorialApp** in Azure Active Directory.
  2. Get **client ID** and **secret key**. 
  3. Get **tenant ID**. 
  4. Assign the **ADFCopyTutorialApp** application to the **Data Factory Contributor** role.  
* Install [Azure PowerShell](/powershell/azure/overview).  
* Launch **PowerShell** and do the following steps. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run the commands again.
  
  1. Run the following command and enter the user name and password that you use to sign in to the Azure portal:
    
	```PowerShell 
	Login-AzureRmAccount
	```   
  2. Run the following command to view all the subscriptions for this account:

	```PowerShell     
	Get-AzureRmSubscription
	``` 
  3. Run the following command to select the subscription that you want to work with. Replace **&lt;NameOfAzureSubscription**&gt; with the name of your Azure subscription. 
     
	```PowerShell
	Get-AzureRmSubscription -SubscriptionName <NameOfAzureSubscription> | Set-AzureRmContext
	```
  4. Create an Azure resource group named **ADFTutorialResourceGroup** by running the following command in the PowerShell:  

	```PowerShell     
      New-AzureRmResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"
	```
     
      If the resource group already exists, you specify whether to update it (Y) or keep it as (N). 
     
      Some of the steps in this tutorial assume that you use the resource group named ADFTutorialResourceGroup. If you use a different resource group, you need to use the name of your resource group in place of ADFTutorialResourceGroup in this tutorial.

## Create JSON definitions
Create following JSON files in the folder where curl.exe is located. 

### datafactory.json
> [!IMPORTANT]
> Name must be globally unique, so you may want to prefix/suffix ADFCopyTutorialDF to make it a unique name. 
> 
> 

```JSON
{  
    "name": "ADFCopyTutorialDF",  
    "location": "WestUS"
}  
```

### azurestoragelinkedservice.json
> [!IMPORTANT]
> Replace **accountname** and **accountkey** with name and key of your Azure storage account. To learn how to get your storage access key, see [View, copy and regenerate storage access keys](../storage/storage-create-storage-account.md#manage-your-storage-access-keys).
> 
> 

```JSON
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
    }
}
```

### azuersqllinkedservice.json
> [!IMPORTANT]
> Replace **servername**, **databasename**, **username**, and **password** with name of your Azure SQL server, name of SQL database, user account, and password for the account.  
> 
> 

```JSON
{
    "name": "AzureSqlLinkedService",
    "properties": {
        "type": "AzureSqlDatabase",
        "description": "",
        "typeProperties": {
            "connectionString": "Data Source=tcp:<servername>.database.windows.net,1433;Initial Catalog=<databasename>;User ID=<username>;Password=<password>;Integrated Security=False;Encrypt=True;Connect Timeout=30"
        }
    }
}
```

### inputdataset.json

```JSON
{
  "name": "AzureBlobInput",
  "properties": {
    "structure": [
      {
        "name": "FirstName",
        "type": "String"
      },
      {
        "name": "LastName",
        "type": "String"
      }
    ],
    "type": "AzureBlob",
    "linkedServiceName": "AzureStorageLinkedService",
    "typeProperties": {
      "folderPath": "adftutorial/",
      "fileName": "emp.txt",
      "format": {
        "type": "TextFormat",
        "columnDelimiter": ","
      }
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

The JSON definition defines a dataset named **AzureBlobInput**, which represents input data for an activity in the pipeline. In addition, it specifies that the input data is located in the file **emp.txt** that is in blob container **adftutorial**. 

 Note the following points: 

* dataset **type** is set to **AzureBlob**.
* **linkedServiceName** is set to **AzureStorageLinkedService**. 
* **folderPath** is set to the **adftutorial** container and **fileName** is set to **emp.txt**.  
* format **type** is set to **TextFormat**
* There are two fields in the text file – **FirstName** and **LastName** – separated by a comma character (columnDelimiter)    
* The **availability** is set to **hourly** (frequency is set to hour and interval is set to 1). Therefore, Data Factory looks for input data every hour in the root folder of the specified blob container (adftutorial). 

if you don't specify a **fileName** for an input dataset, all files/blobs from the input folder (folderPath) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered as an input.

If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.&lt;Guid&gt;.txt (example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the **partitionedBy** property. In the following example, folderPath uses Year, Month, and Day from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2014-10-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2014/10/20 and the fileName is set to 08.csv. 

```JSON
  "folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
"fileName": "{Hour}.csv",
"partitionedBy": 
[
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } }, 
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }, 
    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } } 
],
```

### outputdataset.json

```JSON
{
  "name": "AzureSqlOutput",
  "properties": {
    "structure": [
      {
        "name": "FirstName",
        "type": "String"
      },
      {
        "name": "LastName",
        "type": "String"
      }
    ],
    "type": "AzureSqlTable",
    "linkedServiceName": "AzureSqlLinkedService",
    "typeProperties": {
      "tableName": "emp"
    },
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

The JSON definition defines a dataset named **AzureSqlOutput**, which represents output data for an activity in the pipeline. In addition, it specifies that the results are stored in the table: **emp** in the database represented by the AzureSqlLinkedService. The **availability** section specifies that the output dataset is produced on an hourly (frequency: hour and interval: 1) basis.

Note the following points: 

* dataset **type** is set to **AzureSQLTable**.
* **linkedServiceName** is set to **AzureSqlLinkedService**.
* **tablename** is set to **emp**.
* There are three columns – **ID**, **FirstName**, and **LastName** – in the emp table in the database. ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
* The **availability** is set to **hourly** (frequency set to hour and interval set to 1).  The Data Factory service generates an output data slice every hour in the **emp** table in the Azure SQL database.

### pipeline.json

```JSON
{
  "name": "ADFTutorialPipeline",
  "properties": {
    "description": "Copy data from a blob to Azure SQL table",
    "activities": [
      {
        "name": "CopyFromBlobToSQL",
        "description": "Push Regional Effectiveness Campaign data to Azure SQL database",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSqlOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "SqlSink",
            "writeBatchSize": 10000,
            "writeBatchTimeout": "60:00:00"
          }
        },
        "Policy": {
          "concurrency": 1,
          "executionPriorityOrder": "NewestFirst",
          "retry": 0,
          "timeout": "01:00:00"
        }
      }
    ],
    "start": "2016-08-12T00:00:00Z",
    "end": "2016-08-13T00:00:00Z"
  }
}
```

Note the following points:

* In the activities section, there is only one activity whose **type** is set to **CopyActivity**.
* Input for the activity is set to **AzureBlobInput** and output for the activity is set to **AzureSqlOutput**.
* In the **transformation** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

Replace the value of the **start** property with the current day and **end** value with the next day. You can specify only the date part and skip the time part of the date time. For example, "2015-02-03", which is equivalent to "2015-02-03T00:00:00Z"

Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional, but we use it in this tutorial. 

If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property.

In the example, there are 24 data slices as each data slice is produced hourly.

> [!NOTE]
> See [Anatomy of a Pipeline](data-factory-create-pipelines.md) for details about JSON properties used in the preceding example.
> 
> 

## Set global variables
In Azure PowerShell, execute the following commands after replacing the values with your own:

> [!IMPORTANT]
> See [Prerequisites](#prerequisites) section for instructions on getting client ID, client secret, tenant ID, and subscription ID.   
> 
> 

```JSON
$client_id = "<client ID of application in AAD>"
$client_secret = "<client key of application in AAD>"
$tenant = "<Azure tenant ID>";
$subscription_id="<Azure subscription ID>";

$rg = "ADFTutorialResourceGroup"
$adf = "ADFCopyTutorialDF"
```

## Authenticate with AAD
Run the following command to authenticate with Azure Active Directory (AAD): 

```PowerShell
$cmd = { .\curl.exe -X POST https://login.microsoftonline.com/$tenant/oauth2/token  -F grant_type=client_credentials  -F resource=https://management.core.windows.net/ -F client_id=$client_id -F client_secret=$client_secret };
$responseToken = Invoke-Command -scriptblock $cmd;
$accessToken = (ConvertFrom-Json $responseToken).access_token;

(ConvertFrom-Json $responseToken) 
```

## Create data factory
In this step, you create an Azure Data Factory named **ADFCopyTutorialDF**. A data factory can have one or more pipelines. A pipeline can have one or more activities in it. For example, a Copy Activity to copy data from a source to a destination data store. A HDInsight Hive activity to run Hive script to transform input data to product output data. Run the following commands to create the data factory: 

1. Assign the command to variable named **cmd**. 
   
    Confirm that the name of the data factory you specify here (ADFCopyTutorialDF) matches the name specified in the **datafactory.json**. 
   
	```PowerShell
    $cmd = {.\curl.exe -X PUT -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" --data “@datafactory.json” https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/ADFCopyTutorialDF?api-version=2015-10-01};
	```
2. Run the command by using **Invoke-Command**.
   
	```PowerShell
	$results = Invoke-Command -scriptblock $cmd;
	```
3. View the results. If the data factory has been successfully created, you see the JSON for the data factory in the **results**; otherwise, you see an error message.  
   
	```
	Write-Host $results
	```

Note the following points:

* The name of the Azure Data Factory must be globally unique. If you see the error in results: **Data factory name “ADFCopyTutorialDF” is not available**, do the following steps:  
  
  1. Change the name (for example, yournameADFCopyTutorialDF) in the **datafactory.json** file.
  2. In the first command where the **$cmd** variable is assigned a value, replace ADFCopyTutorialDF with the new name and run the command. 
  3. Run the next two commands to invoke the REST API to create the data factory and print the results of the operation. 
     
     See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
* To create Data Factory instances, you need to be a contributor/administrator of the Azure subscription
* The name of the data factory may be registered as a DNS name in the future and hence become publicly visible.
* If you receive the error: "**This subscription is not registered to use namespace Microsoft.DataFactory**", do one of the following and try publishing again: 
  
  * In Azure PowerShell, run the following command to register the Data Factory provider: 

	```PowerShell    
	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory
    ```
	You can run the following command to confirm that the Data Factory provider is registered. 
    
	```PowerShell
	Get-AzureRmResourceProvider
	```
  * Login using the Azure subscription into the [Azure portal](https://portal.azure.com) and navigate to a Data Factory blade (or) create a data factory in the Azure portal. This action automatically registers the provider for you.

Before creating a pipeline, you need to create a few Data Factory entities first. You first create linked services to link source and destination data stores to your data store. Then, define input and output datasets to represent data in linked data stores. Finally, create the pipeline with an activity that uses these datasets.

## Create linked services
Linked services link data stores or compute services to an Azure data factory. A data store can be an Azure Storage, Azure SQL Database, or an on-premises SQL Server database that contains input data or stores output data for a Data Factory pipeline. A compute service is the service that processes input data and produces output data. 

In this step, you create two linked services: **AzureStorageLinkedService** and **AzureSqlLinkedService**. AzureStorageLinkedService linked service links an Azure Storage Account and AzureSqlLinkedService links an Azure SQL database to the data factory: **ADFCopyTutorialDF**. You create a pipeline later in this tutorial that copies data from a blob container in AzuretStorageLinkedService to a SQL table in AzureSqlLinkedService.

### Create Azure Storage linked service
In this step, you link your Azure Storage account to your data factory. With this tutorial, you use the Azure Storage account to store input data. 

1. Assign the command to variable named **cmd**. 

	```PowerShell   
    $cmd = {.\curl.exe -X PUT -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" --data "@azurestoragelinkedservice.json" https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/$adf/linkedservices/AzureStorageLinkedService?api-version=2015-10-01};
	```
2. Run the command by using **Invoke-Command**.
	```PowerShell   
	$results = Invoke-Command -scriptblock $cmd;
	```
3. View the results. If the linked service has been successfully created, you see the JSON for the linked service in the **results**; otherwise, you see an error message.

	```PowerShell   
	Write-Host $results
	```

### Create Azure SQL linked service
In this step, you link your Azure SQL database to your data factory. With this tutorial, you use the same Azure SQL database to store the output data.

1. Assign the command to variable named **cmd**. 
   
	```PowerShell
	$cmd = {.\curl.exe -X PUT -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" --data “@azuresqllinkedservice.json” https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/$adf/linkedservices/AzureSqlLinkedService?api-version=2015-10-01};
	```
2. Run the command by using **Invoke-Command**.
   
	```PowerShell
	$results = Invoke-Command -scriptblock $cmd;
	```
3. View the results. If the linked service has been successfully created, you see the JSON for the linked service in the **results**; otherwise, you see an error message.
   
	```PowerShell
	Write-Host $results
	```

## Create datasets
In the previous step, you created linked services **AzureStorageLinkedService** and **AzureSqlLinkedService** to link an Azure Storage account and Azure SQL database to the data factory: **ADFCopyTutorialDF**. In this step, you create datasets that represent the input and output data for the Copy Activity in the pipeline you create in the next step. 

The input dataset in this tutorial refers to a blob container in the Azure Storage that AzureStorageLinkedService points to. The output dataset refers to a SQL table in the Azure SQL database that AzureSqlLinkedService points to.  

### Prepare Azure Blob Storage and Azure SQL Database for the tutorial
Perform the following steps to prepare the Azure blob storage and Azure SQL database for this tutorial. 

* Create a blob container named **adftutorial** in the Azure blob storage that **AzureStorageLinkedService** points to. 
* Create and upload a text file, **emp.txt**, as a blob to the **adftutorial** container. 
* Create a table named **emp** in the Azure SQL Database in the Azure SQL database that **AzureSqlLinkedService** points to.

1. Launch Notepad. Copy the following text and save it as **emp.txt** to **C:\ADFGetStartedPSH** folder on your hard drive. 

	```   
    John, Doe
    Jane, Doe
	```
2. Use tools such as [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) to create the **adftutorial** container and to upload the **emp.txt** file to the container.
   
    ![Azure Storage Explorer](media/data-factory-copy-activity-tutorial-using-powershell/getstarted-storage-explorer.png)
3. Use the following SQL script to create the **emp** table in your Azure SQL Database.  

	```SQL
    CREATE TABLE dbo.emp 
    (
        ID int IDENTITY(1,1) NOT NULL,
        FirstName varchar(50),
        LastName varchar(50),
    )
    GO

    CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID); 
	```

    If you have SQL Server 2014 installed on your computer: follow instructions from [Step 2: Connect to SQL Database of the Managing Azure SQL Database using SQL Server Management Studio][sql-management-studio] article to connect to your Azure SQL server and run the SQL script.

    If your client is not allowed to access the Azure SQL server, you need to configure firewall for your Azure SQL server to allow access from your machine (IP Address). See [this article](../sql-database/sql-database-configure-firewall-settings.md) for steps to configure the firewall for your Azure SQL server.

### Create input dataset
In this step, you create a dataset named **AzureBlobInput** that points to a blob container in the Azure Storage represented by the **AzureStorageLinkedService** linked service. This blob container (adftutorial) contains the input data in the file: **emp.txt**. 

1. Assign the command to variable named **cmd**. 

	```PowerSHell   
	$cmd = {.\curl.exe -X PUT -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" --data "@inputdataset.json" https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/$adf/datasets/AzureBlobInput?api-version=2015-10-01};
	```
2. Run the command by using **Invoke-Command**.
   
	```PowerShell
	$results = Invoke-Command -scriptblock $cmd;
	```
3. View the results. If the dataset has been successfully created, you see the JSON for the dataset in the **results**; otherwise, you see an error message.
   
	```PowerShell
	Write-Host $results
	```

### Create output dataset
In this step, you create an output table named **AzureSqlOutput**. This dataset points to a SQL table (emp) in the Azure SQL database represented by **AzureSqlLinkedService**. The pipeline copies data from the input blob to the **emp** table. 

1. Assign the command to variable named **cmd**.

	```PowerShell   
	$cmd = {.\curl.exe -X PUT -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" --data "@outputdataset.json" https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/$adf/datasets/AzureSqlOutput?api-version=2015-10-01};
	```
2. Run the command by using **Invoke-Command**.
	
	```PowerShell   
	$results = Invoke-Command -scriptblock $cmd;
	```
3. View the results. If the dataset has been successfully created, you see the JSON for the dataset in the **results**; otherwise, you see an error message.
   
	```PowerShell
	Write-Host $results
	``` 

## Create pipeline
In this step, you create a pipeline with a **Copy Activity** that uses **AzureBlobInput** as input and **AzureSqlOutput** as output.

1. Assign the command to variable named **cmd**.

	```PowerShell   
	$cmd = {.\curl.exe -X PUT -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" --data "@pipeline.json" https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/$adf/datapipelines/MyFirstPipeline?api-version=2015-10-01};
	```
2. Run the command by using **Invoke-Command**.

	```PowerShell   
	$results = Invoke-Command -scriptblock $cmd;
	```
3. View the results. If the dataset has been successfully created, you see the JSON for the dataset in the **results**; otherwise, you see an error message.  

	```PowerShell   
	Write-Host $results
	```

**Congratulations!** You have successfully created an Azure data factory, with a pipeline that copies data from Azure Blob Storage to Azure SQL database.

## Monitor pipeline
In this step, you use Data Factory REST API to monitor slices being produced by the pipeline.

```PowerShell
$ds ="AzureSqlOutput"
```

```PowerShell
$cmd = {.\curl.exe -X GET -H "Authorization: Bearer $accessToken" https://management.azure.com/subscriptions/$subscription_id/resourcegroups/$rg/providers/Microsoft.DataFactory/datafactories/$adf/datasets/$ds/slices?start=1970-01-01T00%3a00%3a00.0000000Z"&"end=2016-08-12T00%3a00%3a00.0000000Z"&"api-version=2015-10-01};
```

```PowerShell
$results2 = Invoke-Command -scriptblock $cmd;
```

```PowerShell
IF ((ConvertFrom-Json $results2).value -ne $NULL) {
    ConvertFrom-Json $results2 | Select-Object -Expand value | Format-Table
} else {
        (convertFrom-Json $results2).RemoteException
}
```

Run these commands until you see a slice in **Ready** state or **Failed** state. When the slice is in Ready state, check the **emp** table in your Azure SQL database for the output data. 

For each slice, two rows of data from the source file are copied to the emp table in the Azure SQL database. Therefore, you see 24 new records in the emp table when all the slices are successfully processed (in Ready state). 

## Summary
In this tutorial, you used REST API to create an Azure data factory to copy data from an Azure blob to an Azure SQL database. Here are the high-level steps you performed in this tutorial:  

1. Created an Azure **data factory**.
2. Created **linked services**:
   1. An Azure Storage linked service to link your Azure Storage account that holds input data.     
   2. An Azure SQL linked service to link your Azure SQL database that holds the output data. 
3. Created **datasets**, which describe input data and output data for pipelines.
4. Created a **pipeline** with a Copy Activity with BlobSource as source and SqlSink as sink. 

## See Also
| Topic | Description |
|:--- |:--- |
| [Data Movement Activities](data-factory-data-movement-activities.md) |This article provides detailed information about the Copy Activity you used in the tutorial. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of Azure Data Factory application model. |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Azure Data Factory and how to use them to construct end-to-end data-driven workflows for your scenario or business. |
| [Datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Azure Data Factory. |
| [Monitor and manage pipelines using Monitoring App](data-factory-monitor-manage-app.md) |This article describes how to monitor, manage, and debug pipelines using the Monitoring & Management App. |

[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908

[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[azure-portal]: http://portal.azure.com
[download-azure-powershell]: /powershell/azureps-cmdlets-docs
[data-factory-introduction]: data-factory-introduction.md

[image-data-factory-get-started-storage-explorer]: ./media/data-factory-copy-activity-tutorial-using-powershell/getstarted-storage-explorer.png

[sql-management-studio]: ../sql-database/sql-database-manage-azure-ssms.md
