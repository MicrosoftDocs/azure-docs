---
title: Tutorial - Build a highly available application with Blob storage
titleSuffix: Azure Storage
description: Use read-access geo-zone-redundant (RA-GZRS) storage to make your application data highly available.
services: storage
author: tamram

ms.service: storage
ms.topic: tutorial
ms.date: 04/16/2020
ms.author: tamram
ms.reviewer: artek
ms.custom: mvc, tracking-python
ms.subservice: blobs
#Customer intent: As a developer, I want to have my data be highly available, so that in the event of a disaster I may retrieve it.
---

# Tutorial: Build a highly available application with Blob storage

This tutorial is part one of a series. In it, you learn how to make your application data highly available in Azure.

When you've completed this tutorial, you will have a console application that uploads and retrieves a blob from a [read-access geo-zone-redundant](../common/storage-redundancy.md) (RA-GZRS) storage account.

Geo-redundancy in Azure Storage replicates transactions asynchronously from a primary region to a secondary region that is hundreds of miles away. This replication process guarantees that the data in the secondary region is eventually consistent. The console application uses the [circuit breaker](/azure/architecture/patterns/circuit-breaker) pattern to determine which endpoint to connect to, automatically switching between endpoints as failures and recoveries are simulated.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create a storage account
> * Set the connection string
> * Run the console application

## Prerequisites

To complete this tutorial:

# [.NET](#tab/dotnet)

* Install [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the **Azure development** workload.

  ![Azure development (under Web & Cloud)](media/storage-create-geo-redundant-storage/workloads.png)

# [Python](#tab/python)

* Install [Python](https://www.python.org/downloads/)
* Download and install [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python)

# [Node.js](#tab/nodejs)

* Install [Node.js](https://nodejs.org).

---

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a storage account

A storage account provides a unique namespace to store and access your Azure Storage data objects.

Follow these steps to create a read-access geo-zone-redundant (RA-GZRS) storage account:

1. Select the **Create a resource** button in the Azure portal.
2. Select **Storage account - blob, file, table, queue** from the **New** page.
4. Fill out the storage account form with the following information, as shown in the following image and select **Create**:

   | Setting       | Sample value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Subscription** | *My subscription* | For details about your subscriptions, see [Subscriptions](https://account.azure.com/Subscriptions). |
   | **ResourceGroup** | *myResourceGroup* | For valid resource group names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming). |
   | **Name** | *mystorageaccount* | A unique name for your storage account. |
   | **Location** | *East US* | Choose a location. |
   | **Performance** | *Standard* | Standard performance is a good option for the example scenario. |
   | **Account kind** | *StorageV2* | Using a general-purpose v2 storage account is recommended. For more information on types of Azure storage accounts, see [Storage account overview](../common/storage-account-overview.md). |
   | **Replication**| *Read-access geo-zone-redundant storage (RA-GZRS)* | The primary region is zone-redundant and is replicated to a secondary region, with read access to the secondary region enabled. |
   | **Access tier**| *Hot* | Use the hot tier for frequently-accessed data. |

    ![create storage account](media/storage-create-geo-redundant-storage/createragrsstracct.png)

## Download the sample

# [.NET](#tab/dotnet)

[Download the sample project](https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip) and extract (unzip) the storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a console application.

```bash
git clone https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.git
```

# [Python](#tab/python)

[Download the sample project](https://github.com/Azure-Samples/storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip) and extract (unzip) the storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a basic Python application.

```bash
git clone https://github.com/Azure-Samples/storage-python-circuit-breaker-pattern-ha-apps-using-ra-grs.git
```

# [Node.js](#tab/nodejs)

[Download the sample project](https://github.com/Azure-Samples/storage-node-v10-ha-ra-grs) and unzip the file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a basic Node.js application.

```bash
git clone https://github.com/Azure-Samples/storage-node-v10-ha-ra-grs
```

---

## Configure the sample

# [.NET](#tab/dotnet)

In the application, you must provide the connection string for your storage account. You can store this connection string within an environment variable on the local machine running the application. Follow one of the examples below depending on your Operating System to create the environment variable.

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account. Copy the **connection string** from the primary or secondary key. Run one of the following commands based on your operating system, replacing \<yourconnectionstring\> with your actual connection string. This command saves an environment variable to the local machine. In Windows, the environment variable is not available until you reload the **Command Prompt** or shell you are using.

### Linux

```
export storageconnectionstring=<yourconnectionstring>
```

### Windows

```powershell
setx storageconnectionstring "<yourconnectionstring>"
```

# [Python](#tab/python)

In the application, you must provide your storage account credentials. You can store this information in environment variables on the local machine running the application. Follow one of the examples below depending on your Operating System to create the environment variables.

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account. Paste the **Storage account name** and **Key** values into the following commands, replacing the \<youraccountname\> and \<youraccountkey\> placeholders. This command saves the environment variables to the local machine. In Windows, the environment variable is not available until you reload the **Command Prompt** or shell you are using.

### Linux

```
export accountname=<youraccountname>
export accountkey=<youraccountkey>
```

### Windows

```powershell
setx accountname "<youraccountname>"
setx accountkey "<youraccountkey>"
```

# [Node.js](#tab/nodejs)

To run this sample, you must add your storage account credentials to the `.env.example` file and then rename it to `.env`.

```
AZURE_STORAGE_ACCOUNT_NAME=<replace with your storage account name>
AZURE_STORAGE_ACCOUNT_ACCESS_KEY=<replace with your storage account access key>
```

You can find this information in the Azure portal by navigating to your storage account and selecting **Access keys** in the **Settings** section.

Install the required dependencies. To do this, open a command prompt, navigate to the sample folder, then enter `npm install`.

---

## Run the console application

# [.NET](#tab/dotnet)

In Visual Studio, press **F5** or select **Start** to begin debugging the application. Visual studio automatically restores missing NuGet packages if configured, visit [Installing and reinstalling packages with package restore](https://docs.microsoft.com/nuget/consume-packages/package-restore#package-restore-overview) to learn more.

A console window launches and the application begins running. The application uploads the **HelloWorld.png** image from the solution to the storage account. The application checks to ensure the image has replicated to the secondary RA-GZRS endpoint. It then begins downloading the image up to 999 times. Each read is represented by a **P** or an **S**. Where **P** represents the primary endpoint and **S** represents the secondary endpoint.

![Console app running](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `RunCircuitBreakerAsync` task in the `Program.cs` file is used to download an image from the storage account using the [DownloadToFileAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.downloadtofileasync) method. Prior to the download, an [OperationContext](/dotnet/api/microsoft.azure.cosmos.table.operationcontext) is defined. The operation context defines event handlers, that fire when a download completes successfully or if a download fails and is retrying.

# [Python](#tab/python)

To run the application on a terminal or command prompt, go to the **circuitbreaker.py** directory, then enter `python circuitbreaker.py`. The application uploads the **HelloWorld.png** image from the solution to the storage account. The application checks to ensure the image has replicated to the secondary RA-GZRS endpoint. It then begins downloading the image up to 999 times. Each read is represented by a **P** or an **S**. Where **P** represents the primary endpoint and **S** represents the secondary endpoint.

![Console app running](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `run_circuit_breaker` method in the `circuitbreaker.py` file is used to download an image from the storage account using the [get_blob_to_path](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.baseblobservice.baseblobservice?view=azure-python-previous#get-blob-to-path-container-name--blob-name--file-path--open-mode--wb---snapshot-none--start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--lease-id-none--if-modified-since-none--if-unmodified-since-none--if-match-none--if-none-match-none--timeout-none-) method.

The Storage object retry function is set to a linear retry policy. The retry function determines whether to retry a request, and specifies the number of seconds to wait before retrying the request. Set the **retry\_to\_secondary** value to true, if request should be retried to secondary in case the initial request to primary fails. In the sample application, a custom retry policy is defined in the `retry_callback` function of the storage object.

Before the download, the Service object [retry_callback](https://docs.microsoft.com/python/api/azure-storage-common/azure.storage.common.storageclient.storageclient?view=azure-python) and [response_callback](https://docs.microsoft.com/python/api/azure-storage-common/azure.storage.common.storageclient.storageclient?view=azure-python) function is defined. These functions define event handlers that fire when a download completes successfully or if a download fails and is retrying.

# [Node.js](#tab/nodejs)

To run the sample, open a command prompt, navigate to the sample folder, then enter `node index.js`.

The sample creates a container in your Blob storage account, uploads **HelloWorld.png** into the container, then repeatedly checks whether the container and image have replicated to the secondary region. After replication, it prompts you to enter **D** or **Q** (followed by ENTER) to download or quit. Your output should look similar to the following example:

```
Created container successfully: newcontainer1550799840726
Uploaded blob: HelloWorld.png
Checking to see if container and blob have replicated to secondary region.
[0] Container has not replicated to secondary region yet: newcontainer1550799840726 : ContainerNotFound
[1] Container has not replicated to secondary region yet: newcontainer1550799840726 : ContainerNotFound
...
[31] Container has not replicated to secondary region yet: newcontainer1550799840726 : ContainerNotFound
[32] Container found, but blob has not replicated to secondary region yet.
...
[67] Container found, but blob has not replicated to secondary region yet.
[68] Blob has replicated to secondary region.
Ready for blob download. Enter (D) to download or (Q) to quit, followed by ENTER.
> D
Attempting to download blob...
Blob downloaded from primary endpoint.
> Q
Exiting...
Deleted container newcontainer1550799840726
```

---

## Understand the sample code

### [.NET](#tab/dotnet)

### Retry event handler

The `OperationContextRetrying` event handler is called when the download of the image fails and is set to retry. If the maximum number of retries defined in the application are reached, the [LocationMode](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.locationmode) of the request is changed to `SecondaryOnly`. This setting forces the application to attempt to download the image from the secondary endpoint. This configuration reduces the time taken to request the image as the primary endpoint is not retried indefinitely.

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

The `OperationContextRequestCompleted` event handler is called when the download of the image is successful. If the application is using the secondary endpoint, the application continues to use this endpoint up to 20 times. After 20 times, the application sets the [LocationMode](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.locationmode) back to `PrimaryThenSecondary` and retries the primary endpoint. If a request is successful, the application continues to read from the primary endpoint.

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

### [Python](#tab/python)

### Retry event handler

The `retry_callback` event handler is called when the download of the image fails and is set to retry. If the maximum number of retries defined in the application are reached, the [LocationMode](https://docs.microsoft.com/python/api/azure-storage-common/azure.storage.common.models.locationmode?view=azure-python) of the request is changed to `SECONDARY`. This setting forces the application to attempt to download the image from the secondary endpoint. This configuration reduces the time taken to request the image as the primary endpoint is not retried indefinitely.

```python
def retry_callback(retry_context):
    global retry_count
    retry_count = retry_context.count
    sys.stdout.write(
        "\nRetrying event because of failure reading the primary. RetryCount= {0}".format(retry_count))
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

The `response_callback` event handler is called when the download of the image is successful. If the application is using the secondary endpoint, the application continues to use this endpoint up to 20 times. After 20 times, the application sets the [LocationMode](https://docs.microsoft.com/python/api/azure-storage-common/azure.storage.common.models.locationmode?view=azure-python) back to `PRIMARY` and retries the primary endpoint. If a request is successful, the application continues to read from the primary endpoint.

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

### [Node.js](#tab/nodejs)

With the Node.js V10 SDK, callback handlers are unnecessary. Instead, the sample creates a pipeline configured with retry options and a secondary endpoint. This allows the application to automatically switch to the secondary pipeline if it fails to reach your data through the primary pipeline.

```javascript
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const storageAccessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const sharedKeyCredential = new SharedKeyCredential(accountName, storageAccessKey);

const primaryAccountURL = `https://${accountName}.blob.core.windows.net`;
const secondaryAccountURL = `https://${accountName}-secondary.blob.core.windows.net`;

const pipeline = StorageURL.newPipeline(sharedKeyCredential, {
  retryOptions: {
    maxTries: 3,
    tryTimeoutInMs: 10000,
    retryDelayInMs: 500,
    maxRetryDelayInMs: 1000,
    secondaryHost: secondaryAccountURL
  }
});
```

---

## Next steps

In part one of the series, you learned about making an application highly available with RA-GZRS storage accounts.

Advance to part two of the series to learn how to simulate a failure and force your application to use the secondary RA-GZRS endpoint.

> [!div class="nextstepaction"]
> [Simulate a failure in reading from the primary region](simulate-primary-region-failure.md)
