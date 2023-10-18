---
title: Copy data from Azure Blob Storage to Azure SQL Database
description: 'This tutorial provides step-by-step instructions for copying  data from Azure Blob Storage to Azure SQL Database.'
author: jianleishen
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 08/10/2023
ms.author: jianleishen
---

# Copy data from Azure Blob to Azure SQL Database using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this tutorial, you create a Data Factory pipeline that copies data from Azure Blob Storage to Azure SQL Database. The configuration pattern in this tutorial applies to copying from a file-based data store to a relational data store. For a list of data stores supported as sources and sinks, see [supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

You take the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure Storage and Azure SQL Database linked services.
> * Create Azure Blob and Azure SQL Database datasets.
> * Create a pipeline contains a Copy activity.
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.

This tutorial uses .NET SDK. You can use other mechanisms to interact with Azure Data Factory; refer to samples under **Quickstarts**.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* *Azure Storage account*. You use the blob storage as *source* data store. If you don't have an Azure storage account, see [Create a general-purpose storage account](../storage/common/storage-account-create.md).
* *Azure SQL Database*. You use the database as *sink* data store. If you don't have a database in Azure SQL Database, see the [Create a database in Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).
* *Visual Studio*. The walkthrough in this article uses Visual Studio 2019.
* *[Azure SDK for .NET](/dotnet/azure/dotnet-tools)*.
* *Azure Active Directory application*. If you don't have an Azure Active Directory application, see the [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) section of [How to: Use the portal to create an Azure AD application](../active-directory/develop/howto-create-service-principal-portal.md). Copy the following values for use in later steps: **Application (client) ID**, **authentication key**, and **Directory (tenant) ID**. Assign the application to the **Contributor** role by following the instructions in the same article.

### Create a blob and a SQL table

Now, prepare your Azure Blob and Azure SQL Database for the tutorial by creating a source blob and a sink SQL table.

#### Create a source blob

First, create a source blob by creating a container and uploading an input text file to it:

1. Open Notepad. Copy the following text and save it locally to a file named *inputEmp.txt*.

    ```inputEmp.txt
    John|Doe
    Jane|Doe
    ```

2. Use a tool such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to create the *adfv2tutorial* container, and to upload the *inputEmp.txt* file to the container.

#### Create a sink SQL table

Next, create a sink SQL table:

1. Use the following SQL script to create the *dbo.emp* table in your Azure SQL Database.

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

2. Allow Azure services to access SQL Database. Ensure that you allow access to Azure services in your server so that the Data Factory service can write data to SQL Database. To verify and turn on this setting, do the following steps:

    1. Go to the [Azure portal](https://portal.azure.com) to manage your SQL server. Search for and select **SQL servers**.

    2. Select your server.

    3. Under the SQL server menu's **Security** heading, select **Firewalls and virtual networks**.

    4. In the **Firewall and virtual networks** page, under **Allow Azure services and resources to access this server**, select **ON**.

## Create a Visual Studio project

Using Visual Studio, create a C# .NET console application.

1. Open Visual Studio.
2. In the **Start** window, select **Create a new project**.
3. In the **Create a new project** window, choose the C# version of **Console App (.NET Framework)** from the list of project types. Then select **Next**.
4. In the **Configure your new project** window, enter a **Project name** of *ADFv2Tutorial*. For **Location**, browse to and/or create the directory to save the project in. Then select **Create**. The new project appears in the Visual Studio IDE.

## Install NuGet packages

Next, install the required library packages using the NuGet package manager.

1. In the menu bar, choose **Tools** > **NuGet Package Manager** > **Package Manager Console**.
2. In the **Package Manager Console** pane, run the following commands to install packages. For information about the Azure Data Factory NuGet package, see [Microsoft.Azure.Management.DataFactory](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactory/).

    ```package manager console
    Install-Package Microsoft.Azure.Management.DataFactory
    Install-Package Microsoft.Azure.Management.ResourceManager -PreRelease
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    ```

## Create a data factory client

Follow these steps to create a data factory client.

1. Open *Program.cs*, then overwrite the existing `using` statements with the following code to add references to namespaces.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Rest;
    using Microsoft.Rest.Serialization;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.DataFactory;
    using Microsoft.Azure.Management.DataFactory.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```

2. Add the following code to the `Main` method that sets variables. Replace the 14 placeholders with your own values.

    To see the list of Azure regions in which Data Factory is currently available, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). Under the **Products** drop-down list, choose **Browse** > **Analytics** > **Data Factory**. Then in the **Regions** drop-down list, choose the regions that interest you. A grid appears with the availability status of Data Factory products for your selected regions.

    > [!NOTE]
    > Data stores, such as Azure Storage and Azure SQL Database, and computes, such as HDInsight, that Data Factory uses can be in other regions than what you choose for Data Factory.

    ```csharp
    // Set variables
    string tenantID = "<your tenant ID>";
    string applicationId = "<your application ID>";
    string authenticationKey = "<your authentication key for the application>";
    string subscriptionId = "<your subscription ID to create the factory>";
    string resourceGroup = "<your resource group to create the factory>";

    string region = "<location to create the data factory in, such as East US>";
    string dataFactoryName = "<name of data factory to create (must be globally unique)>";

    // Specify the source Azure Blob information
    string storageAccount = "<your storage account name to copy data>";
    string storageKey = "<your storage account key>";
    string inputBlobPath = "adfv2tutorial/";
    string inputBlobName = "inputEmp.txt";

    // Specify the sink Azure SQL Database information
    string azureSqlConnString =
        "Server=tcp:<your server name>.database.windows.net,1433;" +
        "Database=<your database name>;" +
        "User ID=<your username>@<your server name>;" +
        "Password=<your password>;" +
        "Trusted_Connection=False;Encrypt=True;Connection Timeout=30";
    string azureSqlTableName = "dbo.emp";

    string storageLinkedServiceName = "AzureStorageLinkedService";
    string sqlDbLinkedServiceName = "AzureSqlDbLinkedService";
    string blobDatasetName = "BlobDataset";
    string sqlDatasetName = "SqlDataset";
    string pipelineName = "Adfv2TutorialBlobToSqlCopy";
    ```

3. Add the following code to the `Main` method that creates an instance of `DataFactoryManagementClient` class. You use this object to create a data factory, linked service, datasets, and pipeline. You also use this object to monitor the pipeline run details.

    ```csharp
    // Authenticate and create a data factory management client
    var context = new AuthenticationContext("https://login.windows.net/" + tenantID);
    ClientCredential cc = new ClientCredential(applicationId, authenticationKey);
    AuthenticationResult result = context.AcquireTokenAsync(
        "https://management.azure.com/", cc
    ).Result;
    ServiceClientCredentials cred = new TokenCredentials(result.AccessToken);
    var client = new DataFactoryManagementClient(cred) { SubscriptionId = subscriptionId };
    ```

## Create a data factory

Add the following code to the `Main` method that creates a *data factory*.

```csharp
// Create a data factory
Console.WriteLine("Creating a data factory " + dataFactoryName + "...");
Factory dataFactory = new Factory
{
    Location = region,
    Identity = new FactoryIdentity()
};

client.Factories.CreateOrUpdate(resourceGroup, dataFactoryName, dataFactory);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(dataFactory, client.SerializationSettings)
);

while (
    client.Factories.Get(
        resourceGroup, dataFactoryName
    ).ProvisioningState == "PendingCreation"
)
{
    System.Threading.Thread.Sleep(1000);
}
```

## Create linked services

In this tutorial, you create two linked services for the source and sink, respectively.

### Create an Azure Storage linked service

Add the following code to the `Main` method that creates an *Azure Storage linked service*. For information about supported properties and details, see [Azure Blob linked service properties](connector-azure-blob-storage.md#linked-service-properties).

```csharp
// Create an Azure Storage linked service
Console.WriteLine("Creating linked service " + storageLinkedServiceName + "...");

LinkedServiceResource storageLinkedService = new LinkedServiceResource(
    new AzureStorageLinkedService
    {
        ConnectionString = new SecureString(
            "DefaultEndpointsProtocol=https;AccountName=" + storageAccount +
            ";AccountKey=" + storageKey
        )
    }
);

client.LinkedServices.CreateOrUpdate(
    resourceGroup, dataFactoryName, storageLinkedServiceName, storageLinkedService
);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(storageLinkedService, client.SerializationSettings)
);
```

### Create an Azure SQL Database linked service

Add the following code to the `Main` method that creates an *Azure SQL Database linked service*. For information about supported properties and details, see [Azure SQL Database linked service properties](connector-azure-sql-database.md#linked-service-properties).

```csharp
// Create an Azure SQL Database linked service
Console.WriteLine("Creating linked service " + sqlDbLinkedServiceName + "...");

LinkedServiceResource sqlDbLinkedService = new LinkedServiceResource(
    new AzureSqlDatabaseLinkedService
    {
        ConnectionString = new SecureString(azureSqlConnString)
    }
);

client.LinkedServices.CreateOrUpdate(
    resourceGroup, dataFactoryName, sqlDbLinkedServiceName, sqlDbLinkedService
);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(sqlDbLinkedService, client.SerializationSettings)
);
```

## Create datasets

In this section, you create two datasets: one for the source, the other for the sink.

### Create a dataset for source Azure Blob

Add the following code to the `Main` method that creates an *Azure blob dataset*. For information about supported properties and details, see [Azure Blob dataset properties](connector-azure-blob-storage.md#dataset-properties).

You define a dataset that represents the source data in Azure Blob. This Blob dataset refers to the Azure Storage linked service you create in the previous step, and describes:

- The location of the blob to copy from: `FolderPath` and `FileName`
- The blob format indicating how to parse the content: `TextFormat` and its settings, such as column delimiter
- The data structure, including column names and data types, which map in this example to the sink SQL table

```csharp
// Create an Azure Blob dataset
Console.WriteLine("Creating dataset " + blobDatasetName + "...");
DatasetResource blobDataset = new DatasetResource(
    new AzureBlobDataset
    {
        LinkedServiceName = new LinkedServiceReference {
            ReferenceName = storageLinkedServiceName
        },
        FolderPath = inputBlobPath,
        FileName = inputBlobName,
        Format = new TextFormat { ColumnDelimiter = "|" },
        Structure = new List<DatasetDataElement>
        {
            new DatasetDataElement { Name = "FirstName", Type = "String" },
            new DatasetDataElement { Name = "LastName", Type = "String" }
        }
    }
);

client.Datasets.CreateOrUpdate(
    resourceGroup, dataFactoryName, blobDatasetName, blobDataset
);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(blobDataset, client.SerializationSettings)
);
```

### Create a dataset for sink Azure SQL Database

Add the following code to the `Main` method that creates an *Azure SQL Database dataset*. For information about supported properties and details, see [Azure SQL Database dataset properties](connector-azure-sql-database.md#dataset-properties).

You define a dataset that represents the sink data in Azure SQL Database. This dataset refers to the Azure SQL Database linked service you created in the previous step. It also specifies the SQL table that holds the copied data.

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

client.Datasets.CreateOrUpdate(
    resourceGroup, dataFactoryName, sqlDatasetName, sqlDataset
);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(sqlDataset, client.SerializationSettings)
);
```

## Create a pipeline

Add the following code to the `Main` method that creates a *pipeline with a copy activity*. In this tutorial, this pipeline contains one activity: `CopyActivity`, which takes in the Blob dataset as source and the SQL dataset as sink. For information about copy activity details, see [Copy activity in Azure Data Factory](copy-activity-overview.md).

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
                new DatasetReference() { ReferenceName = blobDatasetName }
            },
            Outputs = new List<DatasetReference>
            {
                new DatasetReference { ReferenceName = sqlDatasetName }
            },
            Source = new BlobSource { },
            Sink = new SqlSink { }
        }
    }
};

client.Pipelines.CreateOrUpdate(resourceGroup, dataFactoryName, pipelineName, pipeline);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(pipeline, client.SerializationSettings)
);
```

## Create a pipeline run

Add the following code to the `Main` method that *triggers a pipeline run*.

```csharp
// Create a pipeline run
Console.WriteLine("Creating pipeline run...");
CreateRunResponse runResponse = client.Pipelines.CreateRunWithHttpMessagesAsync(
    resourceGroup, dataFactoryName, pipelineName
).Result.Body;
Console.WriteLine("Pipeline run ID: " + runResponse.RunId);
```

## Monitor a pipeline run

Now insert the code to check pipeline run states and to get details about the copy activity run.

1. Add the following code to the `Main` method to continuously check the statuses of the pipeline run until it finishes copying the data.

    ```csharp
    // Monitor the pipeline run
    Console.WriteLine("Checking pipeline run status...");
    PipelineRun pipelineRun;
    while (true)
    {
        pipelineRun = client.PipelineRuns.Get(
            resourceGroup, dataFactoryName, runResponse.RunId
        );
        Console.WriteLine("Status: " + pipelineRun.Status);
        if (pipelineRun.Status == "InProgress")
            System.Threading.Thread.Sleep(15000);
        else
            break;
    }
    ```

2. Add the following code to the `Main` method that retrieves copy activity run details, such as the size of the data that was read or written.

    ```csharp
    // Check the copy activity run details
    Console.WriteLine("Checking copy activity run details...");

    RunFilterParameters filterParams = new RunFilterParameters(
        DateTime.UtcNow.AddMinutes(-10), DateTime.UtcNow.AddMinutes(10)
    );

    ActivityRunsQueryResponse queryResponse = client.ActivityRuns.QueryByPipelineRun(
        resourceGroup, dataFactoryName, runResponse.RunId, filterParams
    );

    if (pipelineRun.Status == "Succeeded")
    {
        Console.WriteLine(queryResponse.Value.First().Output);
    }
    else
        Console.WriteLine(queryResponse.Value.First().Error);

    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
    ```

## Run the code

Build the application by choosing **Build** > **Build Solution**. Then start the application by choosing **Debug** > **Start Debugging**, and verify the pipeline execution.

The console prints the progress of creating a data factory, linked service, datasets, pipeline, and pipeline run. It then checks the pipeline run status. Wait until you see the copy activity run details with the data read/written size. Then, using tools such as SQL Server Management Studio (SSMS) or Visual Studio, you can connect to your destination Azure SQL Database and check whether the destination table you specified contains the copied data.

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
> * Create a pipeline containing a copy activity.
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.

Advance to the following tutorial to learn about copying data from on-premises to cloud:

> [!div class="nextstepaction"]
>[Copy data from on-premises to cloud](tutorial-hybrid-copy-powershell.md)
