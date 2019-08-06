---
title: 'Copy data from Azure Blob Storage to SQL Database | Microsoft Docs'
description: 'This tutorial provides step-by-step instructions for copying  data from Azure Blob Storage to Azure SQL Database.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: tutorial
ms.date: 02/20/2019
ms.author: jingwang
---
# Copy data from Azure Blob to Azure SQL Database using Azure Data Factory

In this tutorial, you create a Data Factory pipeline that copies data from Azure Blob Storage to Azure SQL Database. The configuration pattern in this tutorial applies to copying from a file-based data store to a relational data store. For a list of data stores supported as sources and sinks, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure Storage and Azure SQL Database linked services.
> * Create Azure Blob and Azure SQL Database datasets.
> * Create a pipeline contains a Copy activity.
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.

This tutorial uses .NET SDK. You can use other mechanisms to interact with Azure Data Factory, refer to samples under "Quickstarts".

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

* **Azure Storage account**. You use the blob storage as **source** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-quickstart-create-account.md) article for steps to create one.
* **Azure SQL Database**. You use the database as **sink** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article for steps to create one.
* **Visual Studio** 2015, or 2017. The walkthrough in this article uses Visual Studio 2017.
* **Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/)**.
* **Create an application in Azure Active Directory** following [this instruction](../active-directory/develop/howto-create-service-principal-portal.md#create-an-azure-active-directory-application). Make note of the following values that you use in later steps: **application ID**, **authentication key**, and **tenant ID**. Assign application to "**Contributor**" role by following instructions in the same article.

### Create a blob and a SQL table

Now, prepare your Azure Blob and Azure SQL Database for the tutorial by performing the following steps:

#### Create a source blob

1. Launch Notepad. Copy the following text and save it as **inputEmp.txt** file on your disk.

	```
    John|Doe
    Jane|Doe
	```

2. Use tools such as [Azure Storage Explorer](https://storageexplorer.com/) to create the **adfv2tutorial** container, and to upload the **inputEmp.txt** file to the container.

#### Create a sink SQL table

1. Use the following SQL script to create the **dbo.emp** table in your Azure SQL Database.

    ```sql
    CREATE TABLE dbo.emp
    (
        ID int IDENTITY(1,1) NOT NULL,
        FirstName varchar(50),
        LastName varchar(50)
    )
    GO

    CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID);
    ```

2. Allow Azure services to access SQL server. Ensure that **Allow access to Azure services** setting is turned **ON** for your Azure SQL server so that the Data Factory service can write data to your Azure SQL server. To verify and turn on this setting, do the following steps:

    1. Click **More services** hub on the left and click **SQL servers**.
    2. Select your server, and click **Firewall** under **SETTINGS**.
    3. In the **Firewall settings** page, click **ON** for **Allow access to Azure services**.


## Create a Visual Studio project

Using Visual Studio 2015/2017, create a C# .NET console application.

1. Launch **Visual Studio**.
2. Click **File**, point to **New**, and click **Project**.
3. Select **Visual C#** -> **Console App (.NET Framework)** from the list of project types on the right. .NET version 4.5.2 or above is required.
4. Enter **ADFv2Tutorial** for the Name.
5. Click **OK** to create the project.

## Install NuGet packages

1. Click **Tools** -> **NuGet Package Manager** -> **Package Manager Console**.
2. In the **Package Manager Console**, run the following commands to install packages. Refer to [Microsoft.Azure.Management.DataFactory nuget package](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactory/) with details.

    ```powershell
    Install-Package Microsoft.Azure.Management.DataFactory
    Install-Package Microsoft.Azure.Management.ResourceManager
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    ```

## Create a data factory client

1. Open **Program.cs**, include the following statements to add references to namespaces.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Rest;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.DataFactory;
    using Microsoft.Azure.Management.DataFactory.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```

    
2. Add the following code to the **Main** method that sets variables. Replace place-holders with your own values. For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

    ```csharp
    // Set variables
    string tenantID = "<your tenant ID>";
    string applicationId = "<your application ID>";
    string authenticationKey = "<your authentication key for the application>";
    string subscriptionId = "<your subscription ID to create the factory>";
    string resourceGroup = "<your resource group to create the factory>";

    string region = "East US";
    string dataFactoryName = "<specify the name of a data factory to create. It must be globally unique.>";

    // Specify the source Azure Blob information
    string storageAccount = "<your storage account name to copy data>";
    string storageKey = "<your storage account key>";
    string inputBlobPath = "adfv2tutorial/";
    string inputBlobName = "inputEmp.txt";

    // Specify the sink Azure SQL Database information
    string azureSqlConnString = "Server=tcp:<your server name>.database.windows.net,1433;Database=<your database name>;User ID=<your username>@<your server name>;Password=<your password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30";
    string azureSqlTableName = "dbo.emp";

    string storageLinkedServiceName = "AzureStorageLinkedService";
    string sqlDbLinkedServiceName = "AzureSqlDbLinkedService";
    string blobDatasetName = "BlobDataset";
    string sqlDatasetName = "SqlDataset";
    string pipelineName = "Adfv2TutorialBlobToSqlCopy";
    ```

3. Add the following code to the **Main** method that creates an instance of **DataFactoryManagementClient** class. You use this object to create a data factory, linked service, datasets, and pipeline. You also use this object to monitor the pipeline run details.

    ```csharp
    // Authenticate and create a data factory management client
    var context = new AuthenticationContext("https://login.windows.net/" + tenantID);
    ClientCredential cc = new ClientCredential(applicationId, authenticationKey);
    AuthenticationResult result = context.AcquireTokenAsync("https://management.azure.com/", cc).Result;
    ServiceClientCredentials cred = new TokenCredentials(result.AccessToken);
    var client = new DataFactoryManagementClient(cred) { SubscriptionId = subscriptionId };
    ```

## Create a data factory

Add the following code to the **Main** method that creates a **data factory**.

```csharp
// Create a data factory
Console.WriteLine("Creating a data factory " + dataFactoryName + "...");
Factory dataFactory = new Factory
{
    Location = region,
    Identity = new FactoryIdentity()

};
client.Factories.CreateOrUpdate(resourceGroup, dataFactoryName, dataFactory);
Console.WriteLine(SafeJsonConvert.SerializeObject(dataFactory, client.SerializationSettings));

while (client.Factories.Get(resourceGroup, dataFactoryName).ProvisioningState == "PendingCreation")
{
    System.Threading.Thread.Sleep(1000);
}
```

## Create linked services

In this tutorial, you create two linked services for source and sink respectively:

### Create an Azure Storage linked service

Add the following code to the **Main** method that creates an **Azure Storage linked service**. Learn more from [Azure Blob linked service properties](connector-azure-blob-storage.md#linked-service-properties) on supported properties and details.

```csharp
// Create an Azure Storage linked service
Console.WriteLine("Creating linked service " + storageLinkedServiceName + "...");

LinkedServiceResource storageLinkedService = new LinkedServiceResource(
    new AzureStorageLinkedService
    {
        ConnectionString = new SecureString("DefaultEndpointsProtocol=https;AccountName=" + storageAccount + ";AccountKey=" + storageKey)
    }
);
client.LinkedServices.CreateOrUpdate(resourceGroup, dataFactoryName, storageLinkedServiceName, storageLinkedService);
Console.WriteLine(SafeJsonConvert.SerializeObject(storageLinkedService, client.SerializationSettings));
```

### Create an Azure SQL Database linked service

Add the following code to the **Main** method that creates an **Azure SQL Database linked service**. Learn more from [Azure SQL Database linked service properties](connector-azure-sql-database.md#linked-service-properties) on supported properties and details.

```csharp
// Create an Azure SQL Database linked service
Console.WriteLine("Creating linked service " + sqlDbLinkedServiceName + "...");

LinkedServiceResource sqlDbLinkedService = new LinkedServiceResource(
    new AzureSqlDatabaseLinkedService
    {
        ConnectionString = new SecureString(azureSqlConnString)
    }
);
client.LinkedServices.CreateOrUpdate(resourceGroup, dataFactoryName, sqlDbLinkedServiceName, sqlDbLinkedService);
Console.WriteLine(SafeJsonConvert.SerializeObject(sqlDbLinkedService, client.SerializationSettings));
```

## Create datasets

In this section, you create two datasets: one for the source and the other for the sink. 

### Create a dataset for source Azure Blob

Add the following code to the **Main** method that creates an **Azure blob dataset**. Learn more from [Azure Blob dataset properties](connector-azure-blob-storage.md#dataset-properties) on supported properties and details.

You define a dataset that represents the source data in Azure Blob. This Blob dataset refers to the Azure Storage linked service you create in the previous step, and describes:

- The location of the blob to copy from: **FolderPath** and **FileName**;
- The blob format indicating how to parse the content: **TextFormat** and its settings (for example, column delimiter).
- The data structure, including column names and data types which in this case map to the sink SQL table.

```csharp
// Create an Azure Blob dataset
Console.WriteLine("Creating dataset " + blobDatasetName + "...");
DatasetResource blobDataset = new DatasetResource(
    new AzureBlobDataset
    {
        LinkedServiceName = new LinkedServiceReference
        {
            ReferenceName = storageLinkedServiceName
        },
        FolderPath = inputBlobPath,
        FileName = inputBlobName,
        Format = new TextFormat { ColumnDelimiter = "|" },
        Structure = new List<DatasetDataElement>
        {
            new DatasetDataElement
            {
                Name = "FirstName",
                Type = "String"
            },
            new DatasetDataElement
            {
                Name = "LastName",
                Type = "String"
            }
        }
    }
);
client.Datasets.CreateOrUpdate(resourceGroup, dataFactoryName, blobDatasetName, blobDataset);
Console.WriteLine(SafeJsonConvert.SerializeObject(blobDataset, client.SerializationSettings));
```

### Create a dataset for sink Azure SQL Database

Add the following code to the **Main** method that creates an **Azure SQL Database dataset**. Learn more from [Azure SQL Database dataset properties](connector-azure-sql-database.md#dataset-properties) on supported properties and details.

You define a dataset that represents the sink data in Azure SQL Database. This dataset refers to the Azure SQL Database linked service you create in the previous step. It also specifies the SQL table that holds the copied data. 

```csharp
// Create an Azure SQL Database dataset
Console.WriteLine("Creating dataset " + sqlDatasetName + "...");
DatasetResource sqlDataset = new DatasetResource(
    new AzureSqlTableDataset
    {
        LinkedServiceName = new LinkedServiceReference
        {
            ReferenceName = sqlDbLinkedServiceName
        },
        TableName = azureSqlTableName
    }
);
client.Datasets.CreateOrUpdate(resourceGroup, dataFactoryName, sqlDatasetName, sqlDataset);
Console.WriteLine(SafeJsonConvert.SerializeObject(sqlDataset, client.SerializationSettings));
```

## Create a pipeline

Add the following code to the **Main** method that creates a **pipeline with a copy activity**. In this tutorial, this pipeline contains one activity: copy activity, which takes in the Blob dataset as source and the SQL dataset as sink. Learn more from [Copy Activity Overview](copy-activity-overview.md) on copy activity details.

```csharp
// Create a pipeline with copy activity
Console.WriteLine("Creating pipeline " + pipelineName + "...");
PipelineResource pipeline = new PipelineResource
{
    Activities = new List<Activity>
    {
        new CopyActivity
        {
            Name = "CopyFromBlobToSQL",
            Inputs = new List<DatasetReference>
            {
                new DatasetReference()
                {
                    ReferenceName = blobDatasetName
                }
            },
            Outputs = new List<DatasetReference>
            {
                new DatasetReference
                {
                    ReferenceName = sqlDatasetName
                }
            },
            Source = new BlobSource { },
            Sink = new SqlSink { }
        }
    }
};
client.Pipelines.CreateOrUpdate(resourceGroup, dataFactoryName, pipelineName, pipeline);
Console.WriteLine(SafeJsonConvert.SerializeObject(pipeline, client.SerializationSettings));
```

## Create a pipeline run

Add the following code to the **Main** method that **triggers a pipeline run**.

```csharp
// Create a pipeline run
Console.WriteLine("Creating pipeline run...");
CreateRunResponse runResponse = client.Pipelines.CreateRunWithHttpMessagesAsync(resourceGroup, dataFactoryName, pipelineName).Result.Body;
Console.WriteLine("Pipeline run ID: " + runResponse.RunId);
```

## Monitor a pipeline run

1. Add the following code to the **Main** method to continuously check the status of the pipeline run until it finishes copying the data.

    ```csharp
    // Monitor the pipeline run
    Console.WriteLine("Checking pipeline run status...");
    PipelineRun pipelineRun;
    while (true)
    {
        pipelineRun = client.PipelineRuns.Get(resourceGroup, dataFactoryName, runResponse.RunId);
        Console.WriteLine("Status: " + pipelineRun.Status);
        if (pipelineRun.Status == "InProgress")
            System.Threading.Thread.Sleep(15000);
        else
            break;
    }
    ```

2. Add the following code to the **Main** method that retrieves copy activity run details, for example, size of the data read/written.

    ```csharp
    // Check the copy activity run details
    Console.WriteLine("Checking copy activity run details...");

    List<ActivityRun> activityRuns = client.ActivityRuns.ListByPipelineRun(
    resourceGroup, dataFactoryName, runResponse.RunId, DateTime.UtcNow.AddMinutes(-10), DateTime.UtcNow.AddMinutes(10)).ToList(); 
 
    if (pipelineRun.Status == "Succeeded")
    {
        Console.WriteLine(activityRuns.First().Output);
    }
    else
        Console.WriteLine(activityRuns.First().Error);
    
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
    ```

## Run the code

Build and start the application, then verify the pipeline execution.

The console prints the progress of creating a data factory, linked service, datasets, pipeline, and pipeline run. It then checks the pipeline run status. Wait until you see the copy activity run details with data read/written size. Then, use tools such as SSMS (SQL Server Management Studio) or Visual Studio to connect to your destination Azure SQL Database and check if the data is copied into the table you specified.

### Sample output

```json
Creating a data factory AdfV2Tutorial...
{
  "identity": {
    "type": "SystemAssigned"
  },
  "location": "East US"
}
Creating linked service AzureStorageLinkedService...
{
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": {
        "type": "SecureString",
        "value": "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>"
      }
    }
  }
}
Creating linked service AzureSqlDbLinkedService...
{
  "properties": {
    "type": "AzureSqlDatabase",
    "typeProperties": {
      "connectionString": {
        "type": "SecureString",
        "value": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
      }
    }
  }
}
Creating dataset BlobDataset...
{
  "properties": {
    "type": "AzureBlob",
    "typeProperties": {
      "folderPath": "adfv2tutorial/",
      "fileName": "inputEmp.txt",
      "format": {
        "type": "TextFormat",
        "columnDelimiter": "|"
      }
    },
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
    "linkedServiceName": {
      "type": "LinkedServiceReference",
      "referenceName": "AzureStorageLinkedService"
    }
  }
}
Creating dataset SqlDataset...
{
  "properties": {
    "type": "AzureSqlTable",
    "typeProperties": {
      "tableName": "dbo.emp"
    },
    "linkedServiceName": {
      "type": "LinkedServiceReference",
      "referenceName": "AzureSqlDbLinkedService"
    }
  }
}
Creating pipeline Adfv2TutorialBlobToSqlCopy...
{
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "SqlSink"
          }
        },
        "inputs": [
          {
            "type": "DatasetReference",
            "referenceName": "BlobDataset"
          }
        ],
        "outputs": [
          {
            "type": "DatasetReference",
            "referenceName": "SqlDataset"
          }
        ],
        "name": "CopyFromBlobToSQL"
      }
    ]
  }
}
Creating pipeline run...
Pipeline run ID: 1cd03653-88a0-4c90-aabc-ae12d843e252
Checking pipeline run status...
Status: InProgress
Status: InProgress
Status: Succeeded
Checking copy activity run details...
{
  "dataRead": 18,
  "dataWritten": 28,
  "rowsCopied": 2,
  "copyDuration": 2,
  "throughput": 0.01,
  "errors": [],
  "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (East US)",
  "usedDataIntegrationUnits": 2,
  "billedDuration": 2
}

Press any key to exit...
```


## Next steps

The pipeline in this sample copies data from one location to another location in an Azure blob storage. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure Storage and Azure SQL Database linked services.
> * Create Azure Blob and Azure SQL Database datasets.
> * Create a pipeline contains a Copy activity.
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.


Advance to the following tutorial to learn about copying data from on-premises to cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to cloud](tutorial-hybrid-copy-powershell.md)
