---
title: Create Azure Data Factory using .NET SDK
description: Create an Azure Data Factory and pipeline using .NET SDK to copy data from one location in Azure Blob storage to another location.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.devlang: csharp
ms.topic: quickstart
ms.date: 07/20/2023
ms.author: jianleishen
ms.custom: mode-api, devx-track-dotnet
---
# Quickstart: Create a data factory and pipeline using .NET SDK

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Current version](quickstart-create-data-factory-dot-net.md)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use .NET SDK to create an Azure Data Factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](tutorial-transform-data-spark-portal.md).

> [!NOTE]
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

[!INCLUDE [data-factory-quickstart-prerequisites](includes/data-factory-quickstart-prerequisites.md)] 

### Visual Studio

The walkthrough in this article uses Visual Studio 2019. The procedures for Visual Studio 2013, 2015, or 2017 differ slightly.

<a name='create-an-application-in-azure-active-directory'></a>

## Create an application in Microsoft Entra ID

From the sections in *How to: Use the portal to create a Microsoft Entra application and service principal that can access resources*, follow the instructions to do these tasks:

1. In [Create a Microsoft Entra application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal), create an application that represents the .NET application you're creating in this tutorial. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
2. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application), get the **application ID** and **tenant ID**, and note down these values that you use later in this tutorial. 
3. In [Certificates and secrets](../active-directory/develop/howto-create-service-principal-portal.md#set-up-authentication), get the **authentication key**, and note down this value that you use later in this tutorial.
4. In [Assign the application to a role](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application), assign the application to the **Contributor** role at the subscription level so that the application can create data factories in the subscription.

## Create a Visual Studio project

Next, create a C# .NET console application in Visual Studio:

1. Launch **Visual Studio**.
2. In the Start window, select **Create a new project** > **Console App (.NET Framework)**. .NET version 4.5.2 or above is required.
3. In **Project name**, enter **ADFv2QuickStart**.
4. Select **Create** to create the project.

## Install NuGet packages

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console**.
2. In the **Package Manager Console** pane, run the following commands to install packages. For more information, see the [Microsoft.Azure.Management.DataFactory NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactory/).

    ```powershell
    Install-Package Microsoft.Azure.Management.DataFactory
    Install-Package Microsoft.Azure.Management.ResourceManager -IncludePrerelease
    Install-Package Microsoft.Identity.Client
    ```

## Create a data factory client

1. Open **Program.cs**, include the following statements to add references to namespaces.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Rest;
    using Microsoft.Rest.Serialization;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.DataFactory;
    using Microsoft.Azure.Management.DataFactory.Models;
    using Microsoft.Identity.Client;
    ```

2. Add the following code to the **Main** method that sets the variables. Replace the placeholders with your own values. For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, Azure SQL Database, and more) and computes (HDInsight and others) used by data factory can be in other regions.

   ```csharp
   // Set variables
   string tenantID = "<your tenant ID>";
   string applicationId = "<your application ID>";
   string authenticationKey = "<your authentication key for the application>";
   string subscriptionId = "<your subscription ID where the data factory resides>";
   string resourceGroup = "<your resource group where the data factory resides>";
   string region = "<the location of your resource group>";
   string dataFactoryName = 
       "<specify the name of data factory to create. It must be globally unique.>";
   string storageAccount = "<your storage account name to copy data>";
   string storageKey = "<your storage account key>";
   // specify the container and input folder from which all files 
   // need to be copied to the output folder. 
   string inputBlobPath =
       "<path to existing blob(s) to copy data from, e.g. containername/inputdir>";
   //specify the contains and output folder where the files are copied
   string outputBlobPath =
       "<the blob path to copy data to, e.g. containername/outputdir>";

   // name of the Azure Storage linked service, blob dataset, and the pipeline
   string storageLinkedServiceName = "AzureStorageLinkedService";
   string blobDatasetName = "BlobDataset";
   string pipelineName = "Adfv2QuickStartPipeline";
   ```
> [!NOTE]
> For Sovereign clouds, you must use the appropriate cloud-specific endpoints for ActiveDirectoryAuthority and ResourceManagerUrl (BaseUri). 
>  For example, in US Azure Gov you would use authority of ```https://login.microsoftonline.us``` instead of `https://login.microsoftonline.com`, and use ```https://management.usgovcloudapi.net``` instead of ```https://management.azure.com/```, and then create the data factory management client. 
>  You can use PowerShell to easily get the endpoint Urls for various clouds by executing “Get-AzEnvironment | Format-List”, which will return a list of endpoints for each cloud environment.

3. Add the following code to the **Main** method that creates an instance of **DataFactoryManagementClient** class. You use this object to create a data factory, a linked service, datasets, and a pipeline. You also use this object to monitor the pipeline run details.

   ```csharp
   // Authenticate and create a data factory management client
   IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(applicationId)
    .WithAuthority("https://login.microsoftonline.com/" + tenantID)
    .WithClientSecret(authenticationKey)
    .WithLegacyCacheCompatibility(false)
    .WithCacheOptions(CacheOptions.EnableSharedCacheOptions)
    .Build();

   AuthenticationResult result = await app.AcquireTokenForClient(
     new string[]{ "https://management.azure.com//.default"})
      .ExecuteAsync();
   ServiceClientCredentials cred = new TokenCredentials(result.AccessToken);
   var client = new DataFactoryManagementClient(cred) {
       SubscriptionId = subscriptionId };
   ```


## Create a data factory

Add the following code to the **Main** method that creates a **data factory**. 

```csharp
// Create a data factory
Console.WriteLine("Creating data factory " + dataFactoryName + "...");
Factory dataFactory = new Factory
{
    Location = region,
    Identity = new FactoryIdentity()
};
client.Factories.CreateOrUpdate(resourceGroup, dataFactoryName, dataFactory);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(dataFactory, client.SerializationSettings));

while (client.Factories.Get(resourceGroup, dataFactoryName).ProvisioningState ==
       "PendingCreation")
{
    System.Threading.Thread.Sleep(1000);
}
```

## Create a linked service

Add the following code to the **Main** method that creates an **Azure Storage linked service**.

You create linked services in a data factory to link your data stores and compute services to the data factory. In this Quickstart, you only need to create one Azure Storage linked service for both the copy source and the sink store; it's named "AzureStorageLinkedService" in the sample.

```csharp
// Create an Azure Storage linked service
Console.WriteLine("Creating linked service " + storageLinkedServiceName + "...");

LinkedServiceResource storageLinkedService = new LinkedServiceResource(
    new AzureStorageLinkedService
    {
        ConnectionString = new SecureString(
            "DefaultEndpointsProtocol=https;AccountName=" + storageAccount +
            ";AccountKey=" + storageKey)
    }
);
client.LinkedServices.CreateOrUpdate(
    resourceGroup, dataFactoryName, storageLinkedServiceName, storageLinkedService);
Console.WriteLine(SafeJsonConvert.SerializeObject(
    storageLinkedService, client.SerializationSettings));
```

## Create a dataset

Add the following code to the **Main** method that creates an **Azure blob dataset**.

You define a dataset that represents the data to copy from a source to a sink. In this example, this Blob dataset references to the Azure Storage linked service you created in the previous step. The dataset takes a parameter whose value is set in an activity that consumes the dataset. The parameter is used to construct the "folderPath" pointing to where the data resides/is stored.

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
        FolderPath = new Expression { Value = "@{dataset().path}" },
        Parameters = new Dictionary<string, ParameterSpecification>
        {
            { "path", new ParameterSpecification { Type = ParameterType.String } }
        }
    }
);
client.Datasets.CreateOrUpdate(
    resourceGroup, dataFactoryName, blobDatasetName, blobDataset);
Console.WriteLine(
    SafeJsonConvert.SerializeObject(blobDataset, client.SerializationSettings));
```

## Create a pipeline

Add the following code to the **Main** method that creates a **pipeline with a copy activity**.

In this example, this pipeline contains one activity and takes two parameters: the input blob path and the output blob path. The values for these parameters are set when the pipeline is triggered/run. The copy activity refers to the same blob dataset created in the previous step as input and output. When the dataset is used as an input dataset, input path is specified. And, when the dataset is used as an output dataset, the output path is specified. 

```csharp
// Create a pipeline with a copy activity
Console.WriteLine("Creating pipeline " + pipelineName + "...");
PipelineResource pipeline = new PipelineResource
{
    Parameters = new Dictionary<string, ParameterSpecification>
    {
        { "inputPath", new ParameterSpecification { Type = ParameterType.String } },
        { "outputPath", new ParameterSpecification { Type = ParameterType.String } }
    },
    Activities = new List<Activity>
    {
        new CopyActivity
        {
            Name = "CopyFromBlobToBlob",
            Inputs = new List<DatasetReference>
            {
                new DatasetReference()
                {
                    ReferenceName = blobDatasetName,
                    Parameters = new Dictionary<string, object>
                    {
                        { "path", "@pipeline().parameters.inputPath" }
                    }
                }
            },
            Outputs = new List<DatasetReference>
            {
                new DatasetReference
                {
                    ReferenceName = blobDatasetName,
                    Parameters = new Dictionary<string, object>
                    {
                        { "path", "@pipeline().parameters.outputPath" }
                    }
                }
            },
            Source = new BlobSource { },
            Sink = new BlobSink { }
        }
    }
};
client.Pipelines.CreateOrUpdate(resourceGroup, dataFactoryName, pipelineName, pipeline);
Console.WriteLine(SafeJsonConvert.SerializeObject(pipeline, client.SerializationSettings));
```

## Create a pipeline run

Add the following code to the **Main** method that **triggers a pipeline run**.

This code also sets values of the **inputPath** and **outputPath** parameters specified in the pipeline with the actual values of the source and sink blob paths.

```csharp
// Create a pipeline run
Console.WriteLine("Creating pipeline run...");
Dictionary<string, object> parameters = new Dictionary<string, object>
{
    { "inputPath", inputBlobPath },
    { "outputPath", outputBlobPath }
};
CreateRunResponse runResponse = client.Pipelines.CreateRunWithHttpMessagesAsync(
    resourceGroup, dataFactoryName, pipelineName, parameters: parameters
).Result.Body;
Console.WriteLine("Pipeline run ID: " + runResponse.RunId);
```

## Monitor a pipeline run

1. Add the following code to the **Main** method to continuously check the status until it finishes copying the data.

   ```csharp
   // Monitor the pipeline run
   Console.WriteLine("Checking pipeline run status...");
   PipelineRun pipelineRun;
   while (true)
   {
       pipelineRun = client.PipelineRuns.Get(
           resourceGroup, dataFactoryName, runResponse.RunId);
       Console.WriteLine("Status: " + pipelineRun.Status);
       if (pipelineRun.Status == "InProgress" || pipelineRun.Status == "Queued")
           System.Threading.Thread.Sleep(15000);
       else
           break;
   }
   ```

2. Add the following code to the **Main** method that retrieves copy activity run details, such as the size of the data that's read or written.

   ```csharp
   // Check the copy activity run details
   Console.WriteLine("Checking copy activity run details...");

   RunFilterParameters filterParams = new RunFilterParameters(
       DateTime.UtcNow.AddMinutes(-10), DateTime.UtcNow.AddMinutes(10));
   ActivityRunsQueryResponse queryResponse = client.ActivityRuns.QueryByPipelineRun(
       resourceGroup, dataFactoryName, runResponse.RunId, filterParams);
   if (pipelineRun.Status == "Succeeded")
       Console.WriteLine(queryResponse.Value.First().Output);
   else
       Console.WriteLine(queryResponse.Value.First().Error);
   Console.WriteLine("\nPress any key to exit...");
   Console.ReadKey();
   ```

## Run the code

Build and start the application, then verify the pipeline execution.

The console prints the progress of creating data factory, linked service, datasets, pipeline, and pipeline run. It then checks the pipeline run status. Wait until you see the copy activity run details with the size of the read/write data. Then use tools such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to check the blob(s) is copied to "outputBlobPath" from "inputBlobPath" as you specified in the variables.

### Sample output

```json
Creating data factory SPv2Factory0907...
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
        "value": "DefaultEndpointsProtocol=https;AccountName=<storageAccountName>;AccountKey=<storageAccountKey>",
        "type": "SecureString"
      }
    }
  }
}
Creating dataset BlobDataset...
{
  "properties": {
    "type": "AzureBlob",
    "typeProperties": {
      "folderPath": {
        "value": "@{dataset().path}",
        "type": "Expression"
      }
    },
    "linkedServiceName": {
      "referenceName": "AzureStorageLinkedService",
      "type": "LinkedServiceReference"
    },
    "parameters": {
      "path": {
        "type": "String"
      }
    }
  }
}
Creating pipeline Adfv2QuickStartPipeline...
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
            "type": "BlobSink"
          }
        },
        "inputs": [
          {
            "referenceName": "BlobDataset",
            "parameters": {
              "path": "@pipeline().parameters.inputPath"
            },
            "type": "DatasetReference"
          }
        ],
        "outputs": [
          {
            "referenceName": "BlobDataset",
            "parameters": {
              "path": "@pipeline().parameters.outputPath"
            },
            "type": "DatasetReference"
          }
        ],
        "name": "CopyFromBlobToBlob"
      }
    ],
    "parameters": {
      "inputPath": {
        "type": "String"
      },
      "outputPath": {
        "type": "String"
      }
    }
  }
}
Creating pipeline run...
Pipeline run ID: 308d222d-3858-48b1-9e66-acd921feaa09
Checking pipeline run status...
Status: InProgress
Status: InProgress
Checking copy activity run details...
{
    "dataRead": 331452208,
    "dataWritten": 331452208,
    "copyDuration": 23,
    "throughput": 14073.209,
    "errors": [],
    "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (West US)",
    "usedDataIntegrationUnits": 2,
    "billedDuration": 23
}

Press any key to exit...
```

## Verify the output

The pipeline automatically creates the output folder in the **adftutorial** blob container. Then, it copies the **emp.txt** file from the input folder to the output folder. 

1. In the Azure portal, on the **adftutorial** container page that you stopped at in the [Add an input folder and file for the blob container](#add-an-input-folder-and-file-for-the-blob-container) section above, select **Refresh** to see the output folder. 
2. In the folder list, select **output**.
3. Confirm that the **emp.txt** is copied to the output folder. 

## Clean up resources

To programmatically delete the data factory, add the following lines of code to the program: 

```csharp
Console.WriteLine("Deleting the data factory");
client.Factories.Delete(resourceGroup, dataFactoryName);
```

## Next steps

The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the [tutorials](tutorial-copy-data-dot-net.md) to learn about using Data Factory in more scenarios. 
