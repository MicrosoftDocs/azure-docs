---
title: Make application data highly available in Azure | Microsoft Docs 
description: Use read access geo-redundant storage to make your application data highly available
services: storage
documentationcenter: 
author: georgewallace
manager: timlt
editor: ''

ms.service: storage
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: csharp
ms.topic: tutorial
ms.date: 09/19/2017
ms.author: gwallace
ms.custom: mvc
---

# Make your application data highly available with Azure storage

This tutorial is part one of a series. This tutorial shows you how to make your application data highly available in Azure. When you're finished, you have a console application that uploads a blob to a read access geo-redundant storage account and retrieves the image from a storage account. The application switches to secondary storage when a failure is simulated.

![Scenario app](media/storage-simulate-failure-ragrs-account-app/scenario.png)


In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create a storage account
> * Download the sample
> * Set the connection string
> * Run the console application

## Prerequisites

To complete this tutorial:

* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
  - **ASP.NET and web development**
  - **Azure development**

  ![ASP.NET and web development and Azure development (under Web & Cloud)](media/storage-create-geo-redundant-storage/workloads.png)

* Download and install [Fiddler](https://www.telerik.com/download/fiddler)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create a storage account

A storage account provides a unique namespace to store and access your Azure storage data objects.

Follow these steps to create a read only Geo-Redundant storage account:

1. Select the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Storage** from the **New** page, and select **Storage account - blob, file, table, queue** under **Featured**.
3. Fill out the storage account form with the following information, as shown in the following image and select **Create** :

   | Setting       | Suggested value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Name** | mySampleDatabase | A unique value |
   | **Deployment model** | Resource Manager  |  |
   | **Account kid** | General purpose |  |
   | **Performance** | Standard | Specifies that a blank database should be created. |
   | **Replication**| Read-access geo-redundant storage (RA-GRS) | |
   |**Secure transfer required** | Disabled| |
   |**Subscription** | your subscription |For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   |**ResourceGroup** | myResourceGroup |For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   |**Location** | East US | |

![create storage account](media/storage-create-geo-redundant-storage/figure1.png)

## Download the sample

[Download the sample project](https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip).

Extract (unzip) the storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file.
The sample project contains a console application.

## Set the connection string

Open the *storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs* console application in Visual Studio.

Open the **App.config** file, under the **appSettings** node replace the value of the _StorageConnectionString_ with your storage connection string. This value is  retrieved by selecting **Access keys** under **Settings** in your storage account. Copy the **connection string** from the primary or secondary key and paste in in the **App.config** file. **Save** the file when complete.

![app config file](media/storage-create-geo-redundant-storage/figure2.png)

## Run the console application

In Visual Studio press **F5** or select **Play** to start debugging the application. A console windows launches at the application begins running. The application uploads the **HelloWorld.png** image to the storage account. It waits until the image has replicated to the secondary read access account and then begins downloading the image a defined number of times. This simulates an application reading data from a storage account.

![Console app running](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `RunCircuitBreakerAsync` task in the `Program.cs` file is used to download an image from the primary location using the [DownloadToFileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob.downloadtofileasync?view=azure-dotnet) method. Prior to the download the [OperationContext](/dotnet/api/microsoft.windowsazure.storage.operationcontext?view=azure-dotnet) is defined. The operation context defines event handlers to be called when a download completes successfully or if a download fails and is retrying.

### Retry event handler

The `Operation_context_Retrying` event handler is called when the download of the image fails and is set to rety. If the maximum number of retries are reached the [LocationMode](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.locationmode?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_LocationMode) of the request is changed to `SecondaryOnly`. This forces the application to request the image from the secondary read access endpoint.

```csharp
private static void Operation_context_Retrying(object sender, RequestEventArgs e)
{
    retryCount++;
    Console.WriteLine("Retrying event because of failure reading the primary. RetryCount = " + retryCount);

    // Check if we have had more than n retries in which case switch to secondary.
    if (retryCount >= retryThreshold)
    {

        // Check to see if we can fail over to secondary.
        if (blobClient.DefaultRequestOptions.LocationMode != LocationMode.SecondaryOnly)
        {
            blobClient.DefaultRequestOptions.LocationMode = LocationMode.SecondaryOnly;
            retryCount = 0;
        }
        else
        {
            throw new ApplicationException("Both primary and secondary are unreachable. Check your application's network connection. ");
        }
    }
}
```

### Request completed event handler

The `Operation_context_RequestCompleted` event handler is called when the download of the image is successful. The application continues to read from the secondary location for a predetermined number of times and if the requests are successful the [LocationMode](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.locationmode?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_LocationMode) is set back to `PrimaryThenSecondary`. Requests will go to the primary node until failure.

```csharp
private static void Operation_context_RequestCompleted(object sender, RequestEventArgs e)
{
    if (blobClient.DefaultRequestOptions.LocationMode == LocationMode.SecondaryOnly)
    {
        // You're reading the secondary. Let it read the secondary [secondaryThreshold] times, 
        //    then switch back to the primary and see if it's available now.
        secondaryReadCount++;
        if (secondaryReadCount >= secondaryThreshold)
        {
            blobClient.DefaultRequestOptions.LocationMode = LocationMode.PrimaryThenSecondary;
            secondaryReadCount = 0;
        }
    }
}
```

## Next steps

In part one of the series, you learned about configuring a web app interacting with storage such as how to:

> [!div class="checklist"]
> * Create a storage account
> * Download the sample
> * Set the connection string
> * Run the console application

Advance to part two of the series to learn how to simulate a failure and force your application to use the read access redundant storage.

> [!div class="nextstepaction"]
> [Simulate a failure in connection to your primary storage account](storage-simulate-failure-ragrs-account-app.md)
