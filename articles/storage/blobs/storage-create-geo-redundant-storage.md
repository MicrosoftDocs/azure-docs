---
title: Make application data highly available in Azure | Microsoft Docs 
description: Use read-access geo-redundant storage to make your application data highly available
services: storage
author: tamram

ms.service: storage
ms.topic: tutorial
ms.date: 03/26/2018
ms.author: tamram
ms.custom: mvc
ms.component: blobs
---

# Tutorial: Make your application data highly available with Azure storage

This tutorial is part one of a series, which shows you how to make your application data highly available in Azure. When you're finished, you have a console application that uploads and retrieves a blob to a [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) storage account. RA-GRS works by replicating transactions from the primary to the secondary region. This replication process guarantees that the data in the secondary region is eventually consistent. The application uses the [Circuit Breaker](/azure/architecture/patterns/circuit-breaker) pattern to determine which endpoint to connect to. The application switches to secondary endpoint when a failure is simulated.

In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create a storage account
> * Download the sample
> * Set the connection string
> * Run the console application

## Prerequisites

To complete this tutorial:
 
# [.NET] (#tab/dotnet)
* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
  - **Azure development**

  ![Azure development (under Web & Cloud)](media/storage-create-geo-redundant-storage/workloads.png)

* (Optional) Download and install [Fiddler](https://www.telerik.com/download/fiddler)
 
# [Python] (#tab/python) 

* Install [Python](https://www.python.org/downloads/)
* Download and install [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python)
* (Optional) Download and install [Fiddler](https://www.telerik.com/download/fiddler)

# [Java] (#tab/java)

* Install and configure [Maven](http://maven.apache.org/download.cgi) to work from the command line
* Install and configure a [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

---

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create a storage account

A storage account provides a unique namespace to store and access your Azure storage data objects.

Follow these steps to create a read-access geo-redundant storage account:

1. Select the **Create a resource** button found on the upper left-hand corner of the Azure portal.

2. Select **Storage** from the **New** page, and select **Storage account - blob, file, table, queue** under **Featured**.
3. Fill out the storage account form with the following information, as shown in the following image and select **Create**:

   | Setting       | Suggested value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Name** | mystorageaccount | A unique value for your storage account |
   | **Deployment model** | Resource Manager  | Resource Manager contains the latest features.|
   | **Account kind** | StorageV2 | For details on the types of accounts, see [types of storage accounts](../common/storage-introduction.md#types-of-storage-accounts) |
   | **Performance** | Standard | Standard is sufficient for the example scenario. |
   | **Replication**| Read-access geo-redundant storage (RA-GRS) | This is necessary for the sample to work. |
   |**Secure transfer required** | Disabled| Secure transfer is not required for this scenario. |
   |**Subscription** | your subscription |For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   |**ResourceGroup** | myResourceGroup |For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   |**Location** | East US | Choose a location. |

![create storage account](media/storage-create-geo-redundant-storage/createragrsstracct.png)

## Download the sample

# [.NET] (#tab/dotnet)

[Download the sample project](https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip) and extract (unzip) the storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a console application.

```bash
git clone https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.git 
```
# [Python] (#tab/python) 

[Download the sample project](https://github.com/Azure-Samples/storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip) and extract (unzip) the storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a basic Python application.

```bash
git clone https://github.com/Azure-Samples/storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs.git
```

# [Java] (#tab/java)
[Download the sample project](https://github.com/Azure-Samples/storage-java-ha-ra-grs) and extract the storage-java-ragrs.zip file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a basic Java application.

```bash
git clone https://github.com/Azure-Samples/storage-java-ha-ra-grs.git
```
---


## Set the connection string

In the application, you must provide the connection string for your storage account. It is recommended to store this connection string within an environment variable on the local machine running the application. Follow one of the examples below depending on your Operating System to create the environment variable.

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account. Copy the **connection string** from the primary or secondary key. Replace \<yourconnectionstring\> with your actual connection string by running one of the following commands based on your Operating System. This command saves an environment variable to the local machine. In Windows, the environment variable is not available until to reload the **Command Prompt** or shell you are using. Replace **\<storageConnectionString\>** in the following sample:

# [Linux] (#tab/linux) 
export storageconnectionstring=\<yourconnectionstring\> 

# [Windows] (#tab/windows) 
setx storageconnectionstring "\<yourconnectionstring\>"

---


## Run the console application

# [.NET] (#tab/dotnet)
In Visual Studio, press **F5** or select **Start** to start debugging the application. Visual studio automatically restores missing NuGet packages if configured, visit to [Installing and reinstalling packages with package restore](https://docs.microsoft.com/nuget/consume-packages/package-restore#package-restore-overview) to learn more.

A console window launches and the application begins running. The application uploads the **HelloWorld.png** image from the solution to the storage account. The application checks to ensure the image has replicated to the secondary RA-GRS endpoint. It then begins downloading the image up to 999 times. Each read is represented by a **P** or a **S**. Where **P** represents the primary endpoint and **S** represents the secondary endpoint.

![Console app running](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `RunCircuitBreakerAsync` task in the `Program.cs` file is used to download an image from the storage account using the [DownloadToFileAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_CloudBlob_DownloadToFileAsync_System_String_System_IO_FileMode_Microsoft_WindowsAzure_Storage_AccessCondition_Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_Microsoft_WindowsAzure_Storage_OperationContext_) method. Prior to the download, an [OperationContext](/dotnet/api/microsoft.windowsazure.storage.operationcontext?view=azure-dotnet) is defined. The operation context defines event handlers, that fire when a download completes successfully or if a download fails and is retrying.

# [Python] (#tab/python) 
To run the application on a terminal or command prompt, go to the **circuitbreaker.py** directory, then enter `python circuitbreaker.py`. The application uploads the **HelloWorld.png** image from the solution to the storage account. The application checks to ensure the image has replicated to the secondary RA-GRS endpoint. It then begins downloading the image up to 999 times. Each read is represented by a **P** or a **S**. Where **P** represents the primary endpoint and **S** represents the secondary endpoint.

![Console app running](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `run_circuit_breaker` method in the `circuitbreaker.py` file is used to download an image from the storage account using the [get_blob_to_path](https://azure.github.io/azure-storage-python/ref/azure.storage.blob.baseblobservice.html) method. 

The Storage object retry function is set to a linear retry policy. The retry function determines whether to retry a request, and specifies the number of seconds to wait before retrying the request. Set the **retry\_to\_secondary** value to true, if request should be retried to secondary in case the initial request to primary fails. In the sample application, a custom retry policy is defined in the `retry_callback` function of the storage object.
 
Prior to the download, the Service object [retry_callback](https://docs.microsoft.com/python/api/azure.storage.common.storageclient.storageclient?view=azure-python) and [response_callback](https://docs.microsoft.com/python/api/azure.storage.common.storageclient.storageclient?view=azure-python) function is defined. These functions define event handlers that fire when a download completes successfully or if a download fails and is retrying.  

# [Java] (#tab/java)
You can run the application by opening a terminal or command prompt scoped to the downloaded application folder. From there, enter `mvn compile exec:java` to run the application. The application then uploads the **HelloWorld.png** image from the directory to your storage account and checks to ensure that the image has replicated to the secondary RA-GRS endpoint. Once the check is complete, the application will begin downloading the image repeatedly, while reporting back the endpoint it is downloading from.

The Storage object retry function is set to use a linear retry policy. The retry function determines whether to retry a request and specifies the number of seconds to wait between each retry. The **LocationMode** property of your **BlobRequestOptions** is set to **PRIMARY\_THEN\_SECONDARY**. This allows the application to automatically switch to the secondary location if it fails to reach the primary location when attempting to download **HelloWorld.png**.

---

## Understand the sample code

# [.NET] (#tab/dotnet)

### Retry event handler

The `OperationContextRetrying` event handler is called when the download of the image fails and is set to retry. If the maximum number of retries defined in the application are reached, the [LocationMode](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.locationmode?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_LocationMode) of the request is changed to `SecondaryOnly`. This setting forces the application to attempt to download the image from the secondary endpoint. This configuration reduces the time taken to request the image as the primary endpoint is not retried indefinitely.
 
```csharp
private static void OperationContextRetrying(object sender, RequestEventArgs e)
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

The `OperationContextRequestCompleted` event handler is called when the download of the image is successful. If the application is using the secondary endpoint, the application continues to use this endpoint up to 20 times. After 20 times, the application sets the [LocationMode](/dotnet/api/microsoft.windowsazure.storage.blob.blobrequestoptions.locationmode?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_BlobRequestOptions_LocationMode) back to `PrimaryThenSecondary` and retries the primary endpoint. If a request is successful, the application continues to read from the primary endpoint.
 
```csharp
private static void OperationContextRequestCompleted(object sender, RequestEventArgs e)
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

# [Python] (#tab/python) 

### Retry event handler

The `retry_callback` event handler is called when the download of the image fails and is set to retry. If the maximum number of retries defined in the application are reached, the [LocationMode](https://docs.microsoft.com/python/api/azure.storage.common.models.locationmode?view=azure-python) of the request is changed to `SECONDARY`. This setting forces the application to attempt to download the image from the secondary endpoint. This configuration reduces the time taken to request the image as the primary endpoint is not retried indefinitely.  

```python
def retry_callback(retry_context):
    global retry_count
    retry_count = retry_context.count
    sys.stdout.write("\nRetrying event because of failure reading the primary. RetryCount= {0}".format(retry_count))
    sys.stdout.flush()

    # Check if we have more than n-retries in which case switch to secondary
    if retry_count >= retry_threshold:

        # Check to see if we can fail over to secondary.
        if blob_client.location_mode != LocationMode.SECONDARY:
            blob_client.location_mode = LocationMode.SECONDARY
            retry_count = 0
        else:
            raise Exception("Both primary and secondary are unreachable. "
                            "Check your application's network connection.")
```

### Request completed event handler

The `response_callback` event handler is called when the download of the image is successful. If the application is using the secondary endpoint, the application continues to use this endpoint up to 20 times. After 20 times, the application sets the [LocationMode](https://docs.microsoft.com/python/api/azure.storage.common.models.locationmode?view=azure-python) back to `PRIMARY` and retries the primary endpoint. If a request is successful, the application continues to read from the primary endpoint.

```python
def response_callback(response):
    global secondary_read_count
    if blob_client.location_mode == LocationMode.SECONDARY:

        # You're reading the secondary. Let it read the secondary [secondaryThreshold] times,
        # then switch back to the primary and see if it is available now.
        secondary_read_count += 1
        if secondary_read_count >= secondary_threshold:
            blob_client.location_mode = LocationMode.PRIMARY
            secondary_read_count = 0
```

# [Java] (#tab/java)

With Java, defining callback handlers is unnecessary if the **LocationMode** property of your **BlobRequestOptions** is set to **PRIMARY\_THEN\_SECONDARY**. This allows the application to automatically switch to the secondary location if it fails to reach the primary location when attempting to download **HelloWorld.png**.

```java
    BlobRequestOptions myReqOptions = new BlobRequestOptions();
    myReqOptions.setRetryPolicyFactory(new RetryLinearRetry(deltaBackOff, maxAttempts));
    myReqOptions.setLocationMode(LocationMode.PRIMARY_THEN_SECONDARY);
    blobClient.setDefaultRequestOptions(myReqOptions);

    blob.downloadToFile(downloadedFile.getAbsolutePath(),null,blobClient.getDefaultRequestOptions(),opContext);
```
---


## Next steps

In part one of the series, you learned about making an application highly available with RA-GRS storage accounts, such as how to:

> [!div class="checklist"]
> * Create a storage account
> * Download the sample
> * Set the connection string
> * Run the console application

Advance to part two of the series to learn how to simulate a failure and force your application to use the secondary RA-GRS endpoint.

> [!div class="nextstepaction"]
> [Simulate a failure in connection to your primary storage endpoint](storage-simulate-failure-ragrs-account-app.md)
