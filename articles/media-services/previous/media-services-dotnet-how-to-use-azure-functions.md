---
title: Develop Azure Functions with Media Services
description: This topic shows how to start developing Azure Functions with Media Services using the Azure portal.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.assetid: 51bdcb01-1846-4e1f-bd90-70020ab471b0
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# Develop Azure Functions with Media Services

This article shows you how to get started with creating Azure Functions that use Media Services. The Azure Function defined in this article monitors a storage account container named **input** for new MP4 files. Once a file is dropped into the storage container, the blob trigger executes the function. To review Azure functions, see  [Overview](../../azure-functions/functions-overview.md) and other topics in the **Azure functions** section.

If you want to explore and deploy existing Azure Functions that use Azure Media Services, check out [Media Services Azure Functions](https://github.com/Azure-Samples/media-services-dotnet-functions-integration). This repository contains examples that use Media Services to show workflows related to ingesting content directly from blob storage, encoding, and writing content back to blob storage. It also includes examples of how to monitor job notifications via WebHooks and Azure Queues. You can also develop your Functions based on the examples in the [Media Services Azure Functions](https://github.com/Azure-Samples/media-services-dotnet-functions-integration) repository. To deploy the functions, press the **Deploy to Azure** button.

## Prerequisites

- Before you can create your first function, you need to have an active Azure account. If you don't already have an Azure account, [free accounts are available](https://azure.microsoft.com/free/).
- If you are going to create Azure Functions that perform actions on your Azure Media Services (AMS) account or listen to events sent by Media Services, you should create an AMS account, as described [here](media-services-portal-create-account.md).
	
## Create a function app

1. Go to the [Azure portal](https://portal.azure.com) and sign-in with your Azure account.
2. Create a function app as described [here](../../azure-functions/functions-create-function-app-portal.md).

>[!NOTE]
> A storage account that you specify in the **StorageConnection** environment variable (see the next step) should be in the same region as your app.

## Configure function app settings

When developing Media Services functions, it is handy to add environment variables that will be used throughout your functions. To configure app settings, click the Configure App Settings link. For more information, see  [How to configure Azure Function app settings](../../azure-functions/functions-how-to-use-azure-function-app-settings.md). 

The function, defined in this article, assumes you have the following environment variables in your app settings:

**AMSAADTenantDomain**: Azure AD tenant endpoint. For more information about connecting to the AMS API, see [this](media-services-use-aad-auth-to-access-ams-api.md) article.

**AMSRESTAPIEndpoint**:  URI that represents the REST API endpoint. 

**AMSClientId**: Azure AD application client ID.

**AMSClientSecret**: Azure AD application client secret.

**StorageConnection**: storage connection of the account associated with the Media Services account. This value is used in the **function.json** file and **run.csx** file (described below).

## Create a function

Once your function app is deployed, you can find it among **App Services** Azure Functions.

1. Select your function app and click **New Function**.
2. Choose the **C#** language and **Data Processing** scenario.
3. Choose **BlobTrigger** template. This function is triggered whenever a blob is uploaded into the **input** container. The **input** name is specified in the **Path**, in the next step.

	![files](./media/media-services-azure-functions/media-services-azure-functions004.png)

4. Once you select **BlobTrigger**, some more controls appear on the page.

	![files](./media/media-services-azure-functions/media-services-azure-functions005.png)

4. Click **Create**. 

## Files

Your Azure function is associated with code files and other files that are described in this section. When you use the Azure portal to create a function, **function.json** and **run.csx** are created for you. You need to add or upload a **project.json** file. The rest of this section gives a brief explanation of each file and shows their definitions.

![files](./media/media-services-azure-functions/media-services-azure-functions003.png)

### function.json

The function.json file defines the function bindings and other configuration settings. The runtime uses this file to determine the events to monitor and how to pass data into and return data from function execution. For more information, see [Azure functions HTTP and webhook bindings](../../azure-functions/functions-reference.md#function-code).

>[!NOTE]
>Set the **disabled** property to **true** to prevent the function from being executed. 

Replace the contents of the existing function.json file with the following code:

```json
{
  "bindings": [
    {
      "name": "myBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "input/{filename}.mp4",
      "connection": "ConnectionString"
    }
  ],
  "disabled": false
}
```

### project.json

The project.json file contains dependencies. Here is an example of **project.json** file that includes the required .NET Azure Media Services packages from Nuget. Note that the version numbers change with latest updates to the packages, so you should confirm the most recent versions. 

Add the following definition to project.json. 

```json
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "windowsazure.mediaservices": "4.0.0.4",
        "windowsazure.mediaservices.extensions": "4.0.0.4",
        "Microsoft.IdentityModel.Clients.ActiveDirectory": "3.13.1",
        "Microsoft.IdentityModel.Protocol.Extensions": "1.0.2.206221351"
      }
    }
   }
}

```
	
### run.csx

This is the C# code for your function.  The function defined below monitors a storage account container named **input** (that is what was specified in the path) for new MP4 files. Once a file is dropped into the storage container, the blob trigger executes the function.
	
The example defined in this section demonstrates 

1. how to ingest an asset into a Media Services account (by coping a blob into an AMS asset) and 
2. how to submit an encoding job that uses Media Encoder Standard's "Adaptive Streaming" preset.

In the real life scenario, you most likely want to track job progress and then publish your encoded asset. For more information, see [Use Azure WebHooks to monitor Media Services job notifications](media-services-dotnet-check-job-progress-with-webhooks.md). For more examples, see [Media Services Azure Functions](https://github.com/Azure-Samples/media-services-dotnet-functions-integration).  

Replace the contents of the existing run.csx file with the following code: Once you are done defining your function click **Save and Run**.

```csharp
#r "Microsoft.WindowsAzure.Storage"
#r "Newtonsoft.Json"
#r "System.Web"

using System;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.WindowsAzure.MediaServices.Client;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.Azure.WebJobs;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
  
// Read values from the App.config file.

static readonly string _AADTenantDomain = Environment.GetEnvironmentVariable("AMSAADTenantDomain");
static readonly string _RESTAPIEndpoint = Environment.GetEnvironmentVariable("AMSRESTAPIEndpoint");
 
static readonly string _mediaservicesClientId = Environment.GetEnvironmentVariable("AMSClientId");
static readonly string _mediaservicesClientSecret = Environment.GetEnvironmentVariable("AMSClientSecret");

static readonly string _connectionString = Environment.GetEnvironmentVariable("ConnectionString");  

private static CloudMediaContext _context = null;
private static CloudStorageAccount _destinationStorageAccount = null;

public static void Run(CloudBlockBlob myBlob, string fileName, TraceWriter log)
{
    // NOTE that the variables {fileName} here come from the path setting in function.json
    // and are passed into the  Run method signature above. We can use this to make decisions on what type of file
    // was dropped into the input container for the function. 

    // No need to do any Retry strategy in this function, By default, the SDK calls a function up to 5 times for a 
    // given blob. If the fifth try fails, the SDK adds a message to a queue named webjobs-blobtrigger-poison.

    log.Info($"C# Blob trigger function processed: {fileName}.mp4");
    log.Info($"Media Services REST endpoint : {_RESTAPIEndpoint}");

    try
    {
        AzureAdTokenCredentials tokenCredentials = new AzureAdTokenCredentials(_AADTenantDomain,
                            new AzureAdClientSymmetricKey(_mediaservicesClientId, _mediaservicesClientSecret),
                            AzureEnvironments.AzureCloudEnvironment);
 
        AzureAdTokenProvider tokenProvider = new AzureAdTokenProvider(tokenCredentials);
 
        _context = new CloudMediaContext(new Uri(_RESTAPIEndpoint), tokenProvider);

        IAsset newAsset = CreateAssetFromBlob(myBlob, fileName, log).GetAwaiter().GetResult();

        // Step 2: Create an Encoding Job

        // Declare a new encoding job with the Standard encoder
        IJob job = _context.Jobs.Create("Azure Function - MES Job");

        // Get a media processor reference, and pass to it the name of the 
        // processor to use for the specific task.
        IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");

        // Create a task with the encoding details, using a custom preset
        ITask task = job.Tasks.AddNew("Encode with Adaptive Streaming",
            processor,
            "Adaptive Streaming",
            TaskOptions.None); 

        // Specify the input asset to be encoded.
        task.InputAssets.Add(newAsset);

        // Add an output asset to contain the results of the job. 
        // This output is specified as AssetCreationOptions.None, which 
        // means the output asset is not encrypted. 
        task.OutputAssets.AddNew(fileName, AssetCreationOptions.None);

        job.Submit();
        log.Info("Job Submitted");

    }
    catch (Exception ex)
    {
        log.Error("ERROR: failed.");
        log.Info($"StackTrace : {ex.StackTrace}");
        throw ex;
    }
}

private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
{
    var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
    ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

    if (processor == null)
    throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

    return processor;
}

public static async Task<IAsset> CreateAssetFromBlob(CloudBlockBlob blob, string assetName, TraceWriter log){
    IAsset newAsset = null;

    try{
        Task<IAsset> copyAssetTask = CreateAssetFromBlobAsync(blob, assetName, log);
        newAsset = await copyAssetTask;
        log.Info($"Asset Copied : {newAsset.Id}");
    }
    catch(Exception ex){
        log.Info("Copy Failed");
        log.Info($"ERROR : {ex.Message}");
        throw ex;
    }

    return newAsset;
}

/// <summary>
/// Creates a new asset and copies blobs from the specifed storage account.
/// </summary>
/// <param name="blob">The specified blob.</param>
/// <returns>The new asset.</returns>
public static async Task<IAsset> CreateAssetFromBlobAsync(CloudBlockBlob blob, string assetName, TraceWriter log)
{
     //Get a reference to the storage account that is associated with the Media Services account. 
    _destinationStorageAccount = CloudStorageAccount.Parse(_connectionString);

    // Create a new asset. 
    var asset = _context.Assets.Create(blob.Name, AssetCreationOptions.None);
    log.Info($"Created new asset {asset.Name}");

    IAccessPolicy writePolicy = _context.AccessPolicies.Create("writePolicy",
    TimeSpan.FromHours(4), AccessPermissions.Write);
    ILocator destinationLocator = _context.Locators.CreateLocator(LocatorType.Sas, asset, writePolicy);
    CloudBlobClient destBlobStorage = _destinationStorageAccount.CreateCloudBlobClient();

    // Get the destination asset container reference
    string destinationContainerName = (new Uri(destinationLocator.Path)).Segments[1];
    CloudBlobContainer assetContainer = destBlobStorage.GetContainerReference(destinationContainerName);

    try{
    assetContainer.CreateIfNotExists();
    }
    catch (Exception ex)
    {
    log.Error ("ERROR:" + ex.Message);
    }

    log.Info("Created asset.");

    // Get hold of the destination blob
    CloudBlockBlob destinationBlob = assetContainer.GetBlockBlobReference(blob.Name);

    // Copy Blob
    try
    {
    using (var stream = await blob.OpenReadAsync()) 
    {            
        await destinationBlob.UploadFromStreamAsync(stream);          
    }

    log.Info("Copy Complete.");

    var assetFile = asset.AssetFiles.Create(blob.Name);
    assetFile.ContentFileSize = blob.Properties.Length;
    assetFile.IsPrimary = true;
    assetFile.Update();
    asset.Update();
    }
    catch (Exception ex)
    {
    log.Error(ex.Message);
    log.Info (ex.StackTrace);
    log.Info ("Copy Failed.");
    throw;
    }

    destinationLocator.Delete();
    writePolicy.Delete();

    return asset;
}
```

## Test your function

To test your function, you need to upload an MP4 file into the **input** container of the storage account that you specified in the connection string.  

1. Select the storage account that you specified in the **StorageConnection** environment variable.
2. Click **Blobs**.
3. Click **+ Container**. Name the container **input**.
4. Press **Upload** and browse to a .mp4 file that you want to upload.

>[!NOTE]
> When you're using a blob trigger on a Consumption plan, there can be up to a 10-minute delay in processing new blobs after a function app has gone idle. After the function app is running, blobs are processed immediately. For more information, see [Blob storage triggers and bindings](https://docs.microsoft.com/azure/azure-functions/functions-bindings-storage-blob).

## Next steps

At this point, you are ready to start developing a Media Services application. 
 
For more details and complete samples/solutions of using Azure Functions and Logic Apps with Azure Media Services to create custom content creation workflows, see the [Media Services .NET Functions Integration Sample on GitHub](https://github.com/Azure-Samples/media-services-dotnet-functions-integration)

Also, see [Use Azure WebHooks to monitor Media Services job notifications with .NET](media-services-dotnet-check-job-progress-with-webhooks.md). 

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

