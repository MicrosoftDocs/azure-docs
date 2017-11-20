---
title: Create an Azure data factory using .NET | Microsoft Docs
description: Create an Azure data factory to copy data from one location in in an Azure Blob Storage to another location in the same Blob Storage. 
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 09/06/2017
ms.author: jingwang

---

# Create a data factory and pipeline using .NET SDK
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Version 2 - Preview](quickstart-create-data-factory-dot-net.md)

This quickstart describes how to use .NET SDK to create an Azure data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md). 

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
>
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

### Azure subscription
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

### Azure roles
To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription. In the Azure portal, click your **user name** at the top-right corner, and select **Permissions** to view the permissions you have in the subscription. If you have access to multiple subscriptions, select the appropriate subscription. For sample instructions on adding a user to a role, see the [Add roles](../billing/billing-add-change-azure-subscription-administrator.md) article.

### Azure Storage Account
You use a general-purpose Azure Storage Account (specifically Blob Storage) as both **source** and **destination** data stores in this quickstart. If you don't have a general-purpose Azure storage account, see [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) on creating one. 

#### Get storage account name and account key
You use the name and key of your Azure storage account in this quickstart. The following procedure provides steps to get the name and key of your storage account. 

1. Launch a Web browser and navigate to [Azure portal](https://portal.azure.com). Log in using your Azure user name and password. 
2. Click **More services >** in the left menu, and filter with **Storage** keyword, and select **Storage accounts**.

    ![Search for storage account](media/quickstart-create-data-factory-dot-net/search-storage-account.png)
3. In the list of storage accounts, filter for your storage account (if needed), and then select **your storage account**. 
4. In the **Storage account** page, select **Access keys** on the menu.

    ![Get storage account name and key](media/quickstart-create-data-factory-dot-net/storage-account-name-key.png)
5. Copy the values for **Storage account name** and **key1** fields to the clipboard. Paste them into a notepad or any other editor and save it.  

#### Create input folder and files
In this section, you create a blob container named **adftutorial** in your Azure blob storage. Then, you create a folder named **input** in the container, and then upload a sample file to the input folder. 

1. In the **Storage account** page, switch to the **Overview**, and then click **Blobs**. 

    ![Select Blobs option](media/quickstart-create-data-factory-dot-net/select-blobs.png)
2. In the **Blob service** page, click **+ Container** on the toolbar. 

    ![Add container button](media/quickstart-create-data-factory-dot-net/add-container-button.png)    
3. In the **New container** dialog, enter **adftutorial** for the name, and click **OK**. 

    ![Enter container name](media/quickstart-create-data-factory-dot-net/new-container-dialog.png)
4. Click **adftutorial** in the list of containers. 

    ![Select the container](media/quickstart-create-data-factory-dot-net/select-adftutorial-container.png)
1. In the **Container** page, click **Upload** on the toolbar.  

    ![Upload button](media/quickstart-create-data-factory-dot-net/upload-toolbar-button.png)
6. In the **Upload blob** page, click **Advanced**.

    ![Click Advanced link](media/quickstart-create-data-factory-dot-net/upload-blob-advanced.png)
7. Launch **Notepad** and create a file named **emp.txt** with the following content: Save it in the **c:\ADFv2QuickStartPSH** folder: Create the folder **ADFv2QuickStartPSH** if it does not already exist.
    
    ```
    John, Doe
    Jane, Doe
    ```    
8. In the Azure portal, in the **Upload blob** page, browse, and select the **emp.txt** file for the **Files** field. 
9. Enter **input** as a value **Upload to folder** filed. 

    ![Upload blob settings](media/quickstart-create-data-factory-dot-net/upload-blob-settings.png)    
10. Confirm that the folder is **input** and file is **emp.txt**, and click **Upload**.
11. You should see the **emp.txt** file and the status of the upload in the list. 
12. Close the **Upload blob** page by clicking **X** in the corner. 

    ![Close upload blob page](media/quickstart-create-data-factory-dot-net/close-upload-blob.png)
1. Keep the **container** page open. You use it to verify the output at the end of this quickstart.

### Visual Studio
The walkthrough in this article uses Visual Studio 2017. You can also use Visual Studio 2013 or 2015.

### Azure .NET SDK
Download and install [Azure .NET SDK](http://azure.microsoft.com/downloads/) on your machine.

### Create an application in Azure Active Directory
Following instructions in [this article](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application) to do the following tasks: 

1. **Create an Azure Active Directory application**. Create an application in Azure Active Directory to represent the .NET application. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
2. Get the **application ID** and **authentication key**** by using instructions from the **Get application ID and authentication key** section in the article. Note down these values that you use later in this tutorial. 
3. Get the **tenant ID** by using instructions from the **Get tenant ID** section in the article. Note down this value. 
4. Assign the application to the **Contributor** role at the subscription level so that the application can create data factories in the subscription. Follw instructions in the **Assign application to role** section in the article. 

## Create a Visual Studio project

Using Visual Studio 2013/2015/2017, create a C# .NET console application.

1. Launch **Visual Studio**.
2. Click **File**, point to **New**, and click **Project**.
3. Select **Visual C#** -> **Console App (.NET Framework)** from the list of project types on the right. .NET version 4.5.2 or above is required.
4. Enter **ADFv2QuickStart** for the Name.
5. Click **OK** to create the project.

## Install NuGet packages

1. Click **Tools** -> **NuGet Package Manager** -> **Package Manager Console**.
2. In the **Package Manager Console**, run the following commands to install packages:

    ```
    Install-Package Microsoft.Azure.Management.DataFactory -Prerelease
    Install-Package Microsoft.Azure.Management.ResourceManager -Prerelease
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

2. Add the following code to the **Main** method that sets the variables. Replace the place-holders with your own values. Currently, Data Factory V2 allows you to create data factories only in the East US, East US2, and West Europe regions. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

    ```csharp
    // Set variables
    string tenantID = "<your tenant ID>";
    string applicationId = "<your application ID>";
    string authenticationKey = "<your authentication key for the application>";
    string subscriptionId = "<your subscription ID where the data factory resides>";
    string resourceGroup = "<your resource group where the data factory resides>";
    string region = "East US 2";
    string dataFactoryName = "<specify the name of data factory to create. It must be globally unique.>";
    string storageAccount = "<your storage account name to copy data>";
    string storageKey = "<your storage account key>";
    // specify the container and input folder from which all files need to be copied to the output folder. 
    string inputBlobPath = "<the path to existing blob(s) to copy data from, e.g. containername/foldername>";
    //specify the contains and output folder where the files are copied
    string outputBlobPath = "<the blob path to copy data to, e.g. containername/foldername>";

    string storageLinkedServiceName = "AzureStorageLinkedService";  // name of the Azure Storage linked service
    string blobDatasetName = "BlobDataset";             // name of the blob dataset
    string pipelineName = "Adfv2QuickStartPipeline";    // name of the pipeline
    ```

3. Add the following code to the **Main** method that creates an instance of **DataFactoryManagementClient** class. You use this object to create a data factory, a linked service, datasets, and a pipeline. You also use this object to monitor the pipeline run details.

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
Console.WriteLine("Creating data factory " + dataFactoryName + "...");
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

## Create a linked service

Add the following code to the **Main** method that creates an **Azure Storage linked service**.

You create linked services in a data factory to link your data stores and compute services to the data factory. In this Quickstart, you only need to create one Azure Storage linked service for both the copy source and sink store, named "AzureStorageLinkedService" in the sample.

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

## Create a dataset

Add the following code to the **Main** method that creates an **Azure blob dataset**.

You define a dataset that represents the data to copy from a source to a sink. In this example, this Blob dataset references to the Azure Storage linked service you created in the previous step. The dataset takes a parameter whose value is set in an activity that consumes the dataset. The parameter is used to construct the "folderPath" pointing to where the data resides/stored.

```csharp
// Create a Azure Blob dataset
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
client.Datasets.CreateOrUpdate(resourceGroup, dataFactoryName, blobDatasetName, blobDataset);
Console.WriteLine(SafeJsonConvert.SerializeObject(blobDataset, client.SerializationSettings));
```

## Create a pipeline

Add the following code to the **Main** method that creates a **pipeline with a copy activity**.

In this example, this pipeline contains one activity and takes two parameters - input blob path and output blob path. The values for these parameters are set when the pipeline is triggered/run. The copy activity refers to the same blob dataset created in the previous step as input and output. When the dataset is used as an input dataset, input path is specified. And, when the dataset is used as an output dataset, the output path is specified. 

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

This code also sets values of **inputPath** and **outputPath** parameters specified in pipeline with the actual values of source and sink blob paths.

```csharp
// Create a pipeline run
Console.WriteLine("Creating pipeline run...");
Dictionary<string, object> parameters = new Dictionary<string, object>
{
    { "inputPath", inputBlobPath },
    { "outputPath", outputBlobPath }
};
CreateRunResponse runResponse = client.Pipelines.CreateRunWithHttpMessagesAsync(resourceGroup, dataFactoryName, pipelineName, parameters).Result.Body;
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
        Console.WriteLine(activityRuns.First().Output);
    else
        Console.WriteLine(activityRuns.First().Error);
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
    ```

## Run the code

Build and start the application, then verify the pipeline execution.

The console prints the progress of creating data factory, linked service, datasets, pipeline, and pipeline run. It then checks the pipeline run status. Wait until you see the copy activity run details with data read/written size. Then, use tools such as [Azure Storage explorer](https://azure.microsoft.com/features/storage-explorer/) to check the blob(s) is copied to "outputBlobPath" from "inputBlobPath" as you specified in variables.

### Sample output: 
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
    "usedCloudDataMovementUnits": 2,
    "billedDuration": 23
}

Press any key to exit...

```

## Clean up resources
To programmatically, delete the data factory, add the following lines of code to the program: 

```csharp
            Console.WriteLine("Deleting the data factory");
            client.Factories.Delete(resourceGroup, dataFactoryName);
```

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the [tutorials](tutorial-copy-data-dot-net.md) to learn about using Data Factory in more scenarios. 
