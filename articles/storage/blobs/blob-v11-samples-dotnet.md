---
title: Azure Blob Storage code samples using .NET version 11.x client libraries
titleSuffix: Azure Storage
description: View code samples that use the Azure Blob Storage client library for .NET version 11.x.
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.custom: devx-track-dotnet
ms.topic: how-to
ms.date: 04/03/2023
ms.author: pauljewell
---

# Azure Blob Storage code samples using .NET version 11.x client libraries

This article shows code samples that use version 11.x of the Azure Blob Storage client library for .NET.

[!INCLUDE [storage-v11-sdk-support-retirement](../../../includes/storage-v11-sdk-support-retirement.md)]

## Create a snapshot

Related article: [Create and manage a blob snapshot in .NET](snapshots-manage-dotnet.md)

To create a snapshot of a block blob using version 11.x of the Azure Storage client library for .NET, use one of the following methods:

- [CreateSnapshot](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.createsnapshot)
- [CreateSnapshotAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.createsnapshotasync)

The following code example shows how to create a snapshot with version 11.x. This example specifies additional metadata for the snapshot when it is created.

```csharp
private static async Task CreateBlockBlobSnapshot(CloudBlobContainer container)
{
    // Create a new block blob in the container.
    CloudBlockBlob baseBlob = container.GetBlockBlobReference("sample-base-blob.txt");

    // Add blob metadata.
    baseBlob.Metadata.Add("ApproxBlobCreatedDate", DateTime.UtcNow.ToString());

    try
    {
        // Upload the blob to create it, with its metadata.
        await baseBlob.UploadTextAsync(string.Format("Base blob: {0}", baseBlob.Uri.ToString()));

        // Sleep 5 seconds.
        System.Threading.Thread.Sleep(5000);

        // Create a snapshot of the base blob.
        // You can specify metadata at the time that the snapshot is created.
        // If no metadata is specified, then the blob's metadata is copied to the snapshot.
        Dictionary<string, string> metadata = new Dictionary<string, string>();
        metadata.Add("ApproxSnapshotCreatedDate", DateTime.UtcNow.ToString());
        await baseBlob.CreateSnapshotAsync(metadata, null, null, null);
        Console.WriteLine(snapshot.SnapshotQualifiedStorageUri.PrimaryUri);
    }
    catch (StorageException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

## Delete snapshots

Related article: [Create and manage a blob snapshot in .NET](snapshots-manage-dotnet.md)

To delete a blob and its snapshots using version 11.x of the Azure Storage client library for .NET, use one of the following blob deletion methods, and include the [DeleteSnapshotsOption](/dotnet/api/microsoft.azure.storage.blob.deletesnapshotsoption) enum:

- [Delete](/dotnet/api/microsoft.azure.storage.blob.cloudblob.delete)
- [DeleteAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.deleteasync)
- [DeleteIfExists](/dotnet/api/microsoft.azure.storage.blob.cloudblob.deleteifexists)
- [DeleteIfExistsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.deleteifexistsasync)

The following code example shows how to delete a blob and its snapshots in .NET, where `blockBlob` is an object of type [CloudBlockBlob][dotnet_CloudBlockBlob]:

```csharp
await blockBlob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots, null, null, null);
```

## Create a stored access policy

Related article: [Create a stored access policy with .NET](../common/storage-stored-access-policy-define-dotnet.md)

To create a stored access policy on a container with version 11.x of the .NET client library for Azure Storage, call one of the following methods:

- [CloudBlobContainer.SetPermissions](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setpermissions)
- [CloudBlobContainer.SetPermissionsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setpermissionsasync)

The following example creates a stored access policy that is in effect for one day and that grants read, write, and list permissions:

```csharp
private static async Task CreateStoredAccessPolicyAsync(CloudBlobContainer container, string policyName)
{
    // Create a new stored access policy and define its constraints.
    // The access policy provides create, write, read, list, and delete permissions.
    SharedAccessBlobPolicy sharedPolicy = new SharedAccessBlobPolicy()
    {
        // When the start time for the SAS is omitted, the start time is assumed to be the time when Azure Storage receives the request.
        SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
        Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.List |
            SharedAccessBlobPermissions.Write
    };

    // Get the container's existing permissions.
    BlobContainerPermissions permissions = await container.GetPermissionsAsync();

    // Add the new policy to the container's permissions, and set the container's permissions.
    permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
    await container.SetPermissionsAsync(permissions);
}
```

## Create a service SAS for a blob container

Related article: [Create a service SAS for a container or blob with .NET](sas-service-create-dotnet.md)

To create a service SAS for a container, call the [CloudBlobContainer.GetSharedAccessSignature](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.getsharedaccesssignature) method.

```csharp
private static string GetContainerSasUri(CloudBlobContainer container,
                                         string storedPolicyName = null)
{
    string sasContainerToken;

    // If no stored policy is specified, create a new access policy and define its constraints.
    if (storedPolicyName == null)
    {
        // Note that the SharedAccessBlobPolicy class is used both to define
        // the parameters of an ad hoc SAS, and to construct a shared access policy
        // that is saved to the container's shared access policies.
        SharedAccessBlobPolicy adHocPolicy = new SharedAccessBlobPolicy()
        {
            // When the start time for the SAS is omitted, the start time is assumed
            // to be the time when the storage service receives the request. Omitting
            // the start time for a SAS that is effective immediately helps to avoid clock skew.
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Permissions = SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.List
        };

        // Generate the shared access signature on the container,
        // setting the constraints directly on the signature.
        sasContainerToken = container.GetSharedAccessSignature(adHocPolicy, null);

        Console.WriteLine("SAS for blob container (ad hoc): {0}", sasContainerToken);
        Console.WriteLine();
    }
    else
    {
        // Generate the shared access signature on the container. In this case,
        // all of the constraints for the shared access signature are specified
        // on the stored access policy, which is provided by name. It is also possible
        // to specify some constraints on an ad hoc SAS and others on the stored access policy.
        sasContainerToken = container.GetSharedAccessSignature(null, storedPolicyName);

        Console.WriteLine("SAS for container (stored access policy): {0}", sasContainerToken);
        Console.WriteLine();
    }

    // Return the URI string for the container, including the SAS token.
    return container.Uri + sasContainerToken;
}
```

## Create a service SAS for a blob

Related article: [Create a service SAS for a container or blob with .NET](sas-service-create-dotnet.md)

To create a service SAS for a blob, call the [CloudBlob.GetSharedAccessSignature](/dotnet/api/microsoft.azure.storage.blob.cloudblob.getsharedaccesssignature) method.

```csharp
private static string GetBlobSasUri(CloudBlobContainer container,
                                    string blobName,
                                    string policyName = null)
{
    string sasBlobToken;

    // Get a reference to a blob within the container.
    // Note that the blob may not exist yet, but a SAS can still be created for it.
    CloudBlockBlob blob = container.GetBlockBlobReference(blobName);

    if (policyName == null)
    {
        // Create a new access policy and define its constraints.
        // Note that the SharedAccessBlobPolicy class is used both to define the parameters
        // of an ad hoc SAS, and to construct a shared access policy that is saved to
        // the container's shared access policies.
        SharedAccessBlobPolicy adHocSAS = new SharedAccessBlobPolicy()
        {
            // When the start time for the SAS is omitted, the start time is assumed to be
            // the time when the storage service receives the request. Omitting the start time
            // for a SAS that is effective immediately helps to avoid clock skew.
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Permissions = SharedAccessBlobPermissions.Read |
                          SharedAccessBlobPermissions.Write |
                          SharedAccessBlobPermissions.Create
        };

        // Generate the shared access signature on the blob,
        // setting the constraints directly on the signature.
        sasBlobToken = blob.GetSharedAccessSignature(adHocSAS);

        Console.WriteLine("SAS for blob (ad hoc): {0}", sasBlobToken);
        Console.WriteLine();
    }
    else
    {
        // Generate the shared access signature on the blob. In this case, all of the constraints
        // for the SAS are specified on the container's stored access policy.
        sasBlobToken = blob.GetSharedAccessSignature(null, policyName);

        Console.WriteLine("SAS for blob (stored access policy): {0}", sasBlobToken);
        Console.WriteLine();
    }

    // Return the URI string for the container, including the SAS token.
    return blob.Uri + sasBlobToken;
}
```

## Create an account SAS

Related article: [Create an account SAS with .NET](../common/storage-account-sas-create-dotnet.md)

To create an account SAS for a container, call the [CloudStorageAccount.GetSharedAccessSignature](/dotnet/api/microsoft.azure.storage.cloudstorageaccount.getsharedaccesssignature) method.

The following code example creates an account SAS that is valid for the Blob and File services, and gives the client permissions read, write, and list permissions to access service-level APIs. The account SAS restricts the protocol to HTTPS, so the request must be made with HTTPS. Remember to replace placeholder values in angle brackets with your own values:

```csharp
static string GetAccountSASToken()
{
    // To create the account SAS, you need to use Shared Key credentials. Modify for your account.
    const string ConnectionString = "DefaultEndpointsProtocol=https;AccountName=<storage-account>;AccountKey=<account-key>";
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);

    // Create a new access policy for the account.
    SharedAccessAccountPolicy policy = new SharedAccessAccountPolicy()
        {
            Permissions = SharedAccessAccountPermissions.Read | 
                          SharedAccessAccountPermissions.Write | 
                          SharedAccessAccountPermissions.List,
            Services = SharedAccessAccountServices.Blob | SharedAccessAccountServices.File,
            ResourceTypes = SharedAccessAccountResourceTypes.Service,
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Protocols = SharedAccessProtocol.HttpsOnly
        };

    // Return the SAS token.
    return storageAccount.GetSharedAccessSignature(policy);
}
```

## Use an account SAS from a client

Related article: [Create an account SAS with .NET](../common/storage-account-sas-create-dotnet.md)

In this snippet, replace the `<storage-account>` placeholder with the name of your storage account.

```csharp
static void UseAccountSAS(string sasToken)
{
    // Create new storage credentials using the SAS token.
    StorageCredentials accountSAS = new StorageCredentials(sasToken);
    // Use these credentials and the account name to create a Blob service client.
    CloudStorageAccount accountWithSAS = new CloudStorageAccount(accountSAS, "<storage-account>", endpointSuffix: null, useHttps: true);
    CloudBlobClient blobClientWithSAS = accountWithSAS.CreateCloudBlobClient();

    // Now set the service properties for the Blob client created with the SAS.
    blobClientWithSAS.SetServiceProperties(new ServiceProperties()
    {
        HourMetrics = new MetricsProperties()
        {
            MetricsLevel = MetricsLevel.ServiceAndApi,
            RetentionDays = 7,
            Version = "1.0"
        },
        MinuteMetrics = new MetricsProperties()
        {
            MetricsLevel = MetricsLevel.ServiceAndApi,
            RetentionDays = 7,
            Version = "1.0"
        },
        Logging = new LoggingProperties()
        {
            LoggingOperations = LoggingOperations.All,
            RetentionDays = 14,
            Version = "1.0"
        }
    });

    // The permissions granted by the account SAS also permit you to retrieve service properties.
    ServiceProperties serviceProperties = blobClientWithSAS.GetServiceProperties();
    Console.WriteLine(serviceProperties.HourMetrics.MetricsLevel);
    Console.WriteLine(serviceProperties.HourMetrics.RetentionDays);
    Console.WriteLine(serviceProperties.HourMetrics.Version);
}
```

## Optimistic concurrency for blobs

Related article: [Managing Concurrency in Blob storage](concurrency-manage.md)

```csharp
public void DemonstrateOptimisticConcurrencyBlob(string containerName, string blobName)
{
    Console.WriteLine("Demonstrate optimistic concurrency");

    // Parse connection string and create container.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExists();

    // Create test blob. The default strategy is last writer wins, so
    // write operation will overwrite existing blob if present.
    CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);
    blockBlob.UploadText("Hello World!");

    // Retrieve the ETag from the newly created blob.
    string originalETag = blockBlob.Properties.ETag;
    Console.WriteLine("Blob added. Original ETag = {0}", originalETag);

    /// This code simulates an update by another client.
    string helloText = "Blob updated by another client.";
    // No ETag was provided, so original blob is overwritten and ETag updated.
    blockBlob.UploadText(helloText);
    Console.WriteLine("Blob updated. Updated ETag = {0}", blockBlob.Properties.ETag);

    // Now try to update the blob using the original ETag value.
    try
    {
        Console.WriteLine(@"Attempt to update blob using original ETag
                            to generate if-match access condition");
        blockBlob.UploadText(helloText, accessCondition: AccessCondition.GenerateIfMatchCondition(originalETag));
    }
    catch (StorageException ex)
    {
        if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
        {
            Console.WriteLine(@"Precondition failure as expected.
                                Blob's ETag does not match.");
        }
        else
        {
            throw;
        }
    }
    Console.WriteLine();
}
```

## Pessimistic concurrency for blobs

Related article: [Managing Concurrency in Blob storage](concurrency-manage.md)

```csharp
public void DemonstratePessimisticConcurrencyBlob(string containerName, string blobName)
{
    Console.WriteLine("Demonstrate pessimistic concurrency");

    // Parse connection string and create container.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExists();

    CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);
    blockBlob.UploadText("Hello World!");
    Console.WriteLine("Blob added.");

    // Acquire lease for 15 seconds.
    string lease = blockBlob.AcquireLease(TimeSpan.FromSeconds(15), null);
    Console.WriteLine("Blob lease acquired. Lease = {0}", lease);

    // Update blob using lease. This operation should succeed.
    const string helloText = "Blob updated";
    var accessCondition = AccessCondition.GenerateLeaseCondition(lease);
    blockBlob.UploadText(helloText, accessCondition: accessCondition);
    Console.WriteLine("Blob updated using an exclusive lease");

    // Simulate another client attempting to update to blob without providing lease.
    try
    {
        // Operation will fail as no valid lease was provided.
        Console.WriteLine("Now try to update blob without valid lease.");
        blockBlob.UploadText("Update operation will fail without lease.");
    }
    catch (StorageException ex)
    {
        if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
        {
            Console.WriteLine(@"Precondition failure error as expected.
                                Blob lease not provided.");
        }
        else
        {
            throw;
        }
    }

    // Release lease proactively.
    blockBlob.ReleaseLease(accessCondition);
    Console.WriteLine();
}
```

## Build a highly available app with Blob Storage

Related article: [Tutorial: Build a highly available application with Blob storage](storage-create-geo-redundant-storage.md).

### Download the sample

Download the [sample project](https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs/archive/master.zip), extract (unzip) the storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.zip file, then navigate to the **v11** folder to find the project files.

You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project in the v11 folder contains a console application.

```bash
git clone https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs.git
```

### Configure the sample

In the application, you must provide the connection string for your storage account. You can store this connection string within an environment variable on the local machine running the application. Follow one of the examples below depending on your Operating System to create the environment variable.

In the Azure portal, navigate to your storage account. Select **Access keys** under **Settings** in your storage account. Copy the **connection string** from the primary or secondary key. Run one of the following commands based on your operating system, replacing \<yourconnectionstring\> with your actual connection string. This command saves an environment variable to the local machine. In Windows, the environment variable isn't available until you reload the **Command Prompt** or shell you're using.

### Run the console application

In Visual Studio, press **F5** or select **Start** to begin debugging the application. Visual Studio automatically restores missing NuGet packages if package restore is configured, visit [Installing and reinstalling packages with package restore](/nuget/consume-packages/package-restore#package-restore-overview) to learn more.

A console window launches and the application begins running. The application uploads the **HelloWorld.png** image from the solution to the storage account. The application checks to ensure the image has replicated to the secondary RA-GZRS endpoint. It then begins downloading the image up to 999 times. Each read is represented by a **P** or an **S**. Where **P** represents the primary endpoint and **S** represents the secondary endpoint.

![Screenshot of Console application output.](media/storage-create-geo-redundant-storage/figure3.png)

In the sample code, the `RunCircuitBreakerAsync` task in the `Program.cs` file is used to download an image from the storage account using the [DownloadToFileAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.downloadtofileasync) method. Prior to the download, an [OperationContext](/dotnet/api/microsoft.azure.cosmos.table.operationcontext) is defined. The operation context defines event handlers that fire when a download completes successfully, or if a download fails and is retrying.

### Understand the sample code

#### Retry event handler

The `OperationContextRetrying` event handler is called when the download of the image fails and is set to retry. If the maximum number of retries defined in the application are reached, the [LocationMode](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.locationmode) of the request is changed to `SecondaryOnly`. This setting forces the application to attempt to download the image from the secondary endpoint. This configuration reduces the time taken to request the image as the primary endpoint isn't retried indefinitely.

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

#### Request completed event handler

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

## Upload large amounts of random data to Azure storage

Related article: [Upload large amounts of random data in parallel to Azure storage](storage-blob-scalable-app-upload-files.md)

The minimum and maximum number of threads are set to 100 to ensure that a large number of concurrent connections are allowed.

```csharp
private static async Task UploadFilesAsync()
{
    // Create five randomly named containers to store the uploaded files.
    CloudBlobContainer[] containers = await GetRandomContainersAsync();

    var currentdir = System.IO.Directory.GetCurrentDirectory();

    // Path to the directory to upload
    string uploadPath = currentdir + "\\upload";

    // Start a timer to measure how long it takes to upload all the files.
    Stopwatch time = Stopwatch.StartNew();

    try
    {
        Console.WriteLine("Iterating in directory: {0}", uploadPath);

        int count = 0;
        int max_outstanding = 100;
        int completed_count = 0;

        // Define the BlobRequestOptions on the upload.
        // This includes defining an exponential retry policy to ensure that failed connections
        // are retried with a back off policy. As multiple large files are being uploaded using
        // large block sizes, this can cause an issue if an exponential retry policy is not defined.
        // Additionally, parallel operations are enabled with a thread count of 8.
        // This should be a multiple of the number of processor cores in the machine.
        // Lastly, MD5 hash validation is disabled for this example, improving the upload speed.
        BlobRequestOptions options = new BlobRequestOptions
        {
            ParallelOperationThreadCount = 8,
            DisableContentMD5Validation = true,
            StoreBlobContentMD5 = false
        };

        // Create a new instance of the SemaphoreSlim class to 
        // define the number of threads to use in the application.
        SemaphoreSlim sem = new SemaphoreSlim(max_outstanding, max_outstanding);

        List<Task> tasks = new List<Task>();
        Console.WriteLine("Found {0} file(s)", Directory.GetFiles(uploadPath).Count());

        // Iterate through the files
        foreach (string path in Directory.GetFiles(uploadPath))
        {
            var container = containers[count % 5];
            string fileName = Path.GetFileName(path);
            Console.WriteLine("Uploading {0} to container {1}", path, container.Name);
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

            // Set the block size to 100MB.
            blockBlob.StreamWriteSizeInBytes = 100 * 1024 * 1024;

            await sem.WaitAsync();

            // Create a task for each file to upload. The tasks are
            // added to a collection and all run asynchronously.
            tasks.Add(blockBlob.UploadFromFileAsync(path, null, options, null).ContinueWith((t) =>
            {
                sem.Release();
                Interlocked.Increment(ref completed_count);
            }));

            count++;
        }

        // Run all the tasks asynchronously.
        await Task.WhenAll(tasks);

        time.Stop();

        Console.WriteLine("Upload has been completed in {0} seconds. Press any key to continue", time.Elapsed.TotalSeconds.ToString());

        Console.ReadLine();
    }
    catch (DirectoryNotFoundException ex)
    {
        Console.WriteLine("Error parsing files in the directory: {0}", ex.Message);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
}
```

In addition to setting the threading and connection limit settings, the [BlobRequestOptions](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions) for the [UploadFromStreamAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.uploadfromstreamasync) method are configured to use parallelism and disable MD5 hash validation. The files are uploaded in 100-mb blocks, this configuration provides better performance but can be costly if using a poorly performing network as if there is a failure the entire 100-mb block is retried.

|Property|Value|Description|
|---|---|---|
|[ParallelOperationThreadCount](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.paralleloperationthreadcount)| 8| The setting breaks the blob into blocks when uploading. For highest performance, this value should be eight times the number of cores. |
|[DisableContentMD5Validation](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.disablecontentmd5validation)| true| This property disables checking the MD5 hash of the content uploaded. Disabling MD5 validation produces a faster transfer. But does not confirm the validity or integrity of the files being transferred.   |
|[StoreBlobContentMD5](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.storeblobcontentmd5)| false| This property determines if an MD5 hash is calculated and stored with the file.   |
| [RetryPolicy](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.retrypolicy)| 2-second backoff with 10 max retry |Determines the retry policy of requests. Connection failures are retried, in this example an [ExponentialRetry](/dotnet/api/microsoft.azure.batch.common.exponentialretry) policy is configured with a 2-second backoff, and a maximum retry count of 10. This setting is important when your application gets close to hitting the scalability targets for Blob storage. For more information, see [Scalability and performance targets for Blob storage](../blobs/scalability-targets.md).  |

## Download large amounts of random data from Azure storage

Related article: [Download large amounts of random data from Azure storage](storage-blob-scalable-app-download-files.md)

The application reads the containers located in the storage account specified in the **storageconnectionstring**. It iterates through the blobs 10 at a time using the [ListBlobsSegmentedAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.listblobssegmentedasync) method in the containers and downloads them to the local machine using the [DownloadToFileAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.downloadtofileasync) method.

The following table shows the [BlobRequestOptions](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions) defined for each blob as it is downloaded.

|Property|Value|Description|
|---|---|---|
|[DisableContentMD5Validation](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.disablecontentmd5validation)| true| This property disables checking the MD5 hash of the content uploaded. Disabling MD5 validation produces a faster transfer. But does not confirm the validity or integrity of the files being transferred. |
|[StoreBlobContentMD5](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.storeblobcontentmd5)| false| This property determines if an MD5 hash is calculated and stored.   |

```csharp
private static async Task DownloadFilesAsync()
{
    CloudBlobClient blobClient = GetCloudBlobClient();

    // Define the BlobRequestOptions on the download, including disabling MD5 
    // hash validation for this example, this improves the download speed.
    BlobRequestOptions options = new BlobRequestOptions
    {
        DisableContentMD5Validation = true,
        StoreBlobContentMD5 = false
    };

    // Retrieve the list of containers in the storage account.
    // Create a directory and configure variables for use later.
    BlobContinuationToken continuationToken = null;
    List<CloudBlobContainer> containers = new List<CloudBlobContainer>();
    do
    {
        var listingResult = await blobClient.ListContainersSegmentedAsync(continuationToken);
        continuationToken = listingResult.ContinuationToken;
        containers.AddRange(listingResult.Results);
    }
    while (continuationToken != null);

    var directory = Directory.CreateDirectory("download");
    BlobResultSegment resultSegment = null;
    Stopwatch time = Stopwatch.StartNew();

    // Download the blobs
    try
    {
        List<Task> tasks = new List<Task>();
        int max_outstanding = 100;
        int completed_count = 0;

        // Create a new instance of the SemaphoreSlim class to
        // define the number of threads to use in the application.
        SemaphoreSlim sem = new SemaphoreSlim(max_outstanding, max_outstanding);

        // Iterate through the containers
        foreach (CloudBlobContainer container in containers)
        {
            do
            {
                // Return the blobs from the container, 10 at a time.
                resultSegment = await container.ListBlobsSegmentedAsync(null, true, BlobListingDetails.All, 10, continuationToken, null, null);
                continuationToken = resultSegment.ContinuationToken;
                {
                    foreach (var blobItem in resultSegment.Results)
                    {

                        if (((CloudBlob)blobItem).Properties.BlobType == BlobType.BlockBlob)
                        {
                            // Get the blob and add a task to download the blob asynchronously from the storage account.
                            CloudBlockBlob blockBlob = container.GetBlockBlobReference(((CloudBlockBlob)blobItem).Name);
                            Console.WriteLine("Downloading {0} from container {1}", blockBlob.Name, container.Name);
                            await sem.WaitAsync();
                            tasks.Add(blockBlob.DownloadToFileAsync(directory.FullName + "\\" + blockBlob.Name, FileMode.Create, null, options, null).ContinueWith((t) =>
                            {
                                sem.Release();
                                Interlocked.Increment(ref completed_count);
                            }));

                        }
                    }
                }
            }
            while (continuationToken != null);
        }

        // Creates an asynchronous task that completes when all the downloads complete.
        await Task.WhenAll(tasks);
    }
    catch (Exception e)
    {
        Console.WriteLine("\nError encountered during transfer: {0}", e.Message);
    }

    time.Stop();
    Console.WriteLine("Download has been completed in {0} seconds. Press any key to continue", time.Elapsed.TotalSeconds.ToString());
    Console.ReadLine();
}
```

## Enable Azure Storage Analytics logs (classic)

Related article: [Enable and manage Azure Storage Analytics logs (classic)](../common/manage-storage-analytics-logs.md)

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();

serviceProperties.Logging.LoggingOperations = LoggingOperations.All;  
serviceProperties.Logging.RetentionDays = 2;

queueClient.SetServiceProperties(serviceProperties);  
```

## Modify log data retention period

Related article: [Enable and manage Azure Storage Analytics logs (classic)](../common/manage-storage-analytics-logs.md)

The following example prints to the console the retention period for blob and queue storage services.

```csharp
var storageAccount = CloudStorageAccount.Parse(connectionString);

var blobClient = storageAccount.CreateCloudBlobClient();
var queueClient = storageAccount.CreateCloudQueueClient();

var blobserviceProperties = blobClient.GetServiceProperties();
var queueserviceProperties = queueClient.GetServiceProperties();

Console.WriteLine("Retention period for logs from the blob service is: " +
   blobserviceProperties.Logging.RetentionDays.ToString());

Console.WriteLine("Retention period for logs from the queue service is: " +
   queueserviceProperties.Logging.RetentionDays.ToString());
```

The following example changes the retention period for logs for the blob and queue storage services to 4 days.

```csharp

blobserviceProperties.Logging.RetentionDays = 4;
queueserviceProperties.Logging.RetentionDays = 4;

blobClient.SetServiceProperties(blobserviceProperties);
queueClient.SetServiceProperties(queueserviceProperties);  
```

## Enable Azure Storage Analytics metrics (classic)

Related article: [Enable and manage Azure Storage Analytics metrics (classic)](../common/manage-storage-analytics-metrics.md)

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();

serviceProperties.HourMetrics.MetricsLevel = MetricsLevel.Service;  
serviceProperties.HourMetrics.RetentionDays = 10;

queueClient.SetServiceProperties(serviceProperties);  
```

## Configure Transport Layer Security (TLS) for a client application

Related article: [Configure Transport Layer Security (TLS) for a client application](../common/transport-layer-security-configure-client-version.md)

The following sample shows how to enable TLS 1.2 in a .NET client using version 11.x of the Azure Storage client library:

```csharp
static void EnableTls12()
{
    // Enable TLS 1.2 before connecting to Azure Storage
    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

    // Add your connection string here.
    string connectionString = "";

    // Connect to Azure Storage and create a new container.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    CloudBlobContainer container = blobClient.GetContainerReference("sample-container");
    container.CreateIfNotExists();
}
```

## Monitor, diagnose, and troubleshoot Microsoft Azure Storage (classic)

Related article: [Monitor, diagnose, and troubleshoot Microsoft Azure Storage (classic)](../common/storage-monitoring-diagnosing-troubleshooting.md)

If the Storage Client Library throws a **StorageException** in the client, the **RequestInformation** property contains a **RequestResult** object that includes a **ServiceRequestID** property. You can also access a **RequestResult** object from an **OperationContext** instance.

The code sample below demonstrates how to set a custom **ClientRequestId** value by attaching an **OperationContext** object the request to the storage service. It also shows how to retrieve the **ServerRequestId** value from the response message.

```csharp
//Parse the connection string for the storage account.
const string ConnectionString = "DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key";
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Create an Operation Context that includes custom ClientRequestId string based on constants defined within the application along with a Guid.
OperationContext oc = new OperationContext();
oc.ClientRequestID = String.Format("{0} {1} {2} {3}", HOSTNAME, APPNAME, USERID, Guid.NewGuid().ToString());

try
{
    CloudBlobContainer container = blobClient.GetContainerReference("democontainer");
    ICloudBlob blob = container.GetBlobReferenceFromServer("testImage.jpg", null, null, oc);  
    var downloadToPath = string.Format("./{0}", blob.Name);
    using (var fs = File.OpenWrite(downloadToPath))
    {
        blob.DownloadToStream(fs, null, null, oc);
        Console.WriteLine("\t Blob downloaded to file: {0}", downloadToPath);
    }
}
catch (StorageException storageException)
{
    Console.WriteLine("Storage exception {0} occurred", storageException.Message);
    // Multiple results may exist due to client side retry logic - each retried operation will have a unique ServiceRequestId
    foreach (var result in oc.RequestResults)
    {
            Console.WriteLine("HttpStatus: {0}, ServiceRequestId {1}", result.HttpStatusCode, result.ServiceRequestID);
    }
}
```

## Investigating client performance issues - disable the Nagle algorithm

Related article: [Monitor, diagnose, and troubleshoot Microsoft Azure Storage (classic)](../common/storage-monitoring-diagnosing-troubleshooting.md)

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);
ServicePoint queueServicePoint = ServicePointManager.FindServicePoint(storageAccount.QueueEndpoint);
queueServicePoint.UseNagleAlgorithm = false;
```

## Investigating network latency issues - configure Cross Origin Resource Sharing (CORS)

Related article: [Monitor, diagnose, and troubleshoot Microsoft Azure Storage (classic)](../common/storage-monitoring-diagnosing-troubleshooting.md)

```csharp
CloudBlobClient client = new CloudBlobClient(blobEndpoint, new StorageCredentials(accountName, accountKey));
// Set the service properties.
ServiceProperties sp = client.GetServiceProperties();
sp.DefaultServiceVersion = "2013-08-15";
CorsRule cr = new CorsRule();
cr.AllowedHeaders.Add("*");
cr.AllowedMethods = CorsHttpMethods.Get | CorsHttpMethods.Put;
cr.AllowedOrigins.Add("http://www.contoso.com");
cr.ExposedHeaders.Add("x-ms-*");
cr.MaxAgeInSeconds = 5;
sp.Cors.CorsRules.Clear();
sp.Cors.CorsRules.Add(cr);
client.SetServiceProperties(sp);
```

## Creating an empty page blob of a specified size

Related article: [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

To create a page blob, we first create a **CloudBlobClient** object, with the base URI for accessing the blob storage for your storage account (*pbaccount* in figure 1) along with the **StorageCredentialsAccountAndKey** object, as shown in the following example. The example then shows creating a reference to a **CloudBlobContainer** object, and then creating the container (*testvhds*) if it doesn't already exist. Then using the **CloudBlobContainer** object, create a reference to a **CloudPageBlob** object by specifying the page blob name (os4.vhd) to access. To create the page blob, call [CloudPageBlob.Create](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob.create), passing in the max size for the blob to create. The *blobSize* must be a multiple of 512 bytes.

```csharp
using Microsoft.Azure;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

long OneGigabyteAsBytes = 1024 * 1024 * 1024;
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the blob client.
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Retrieve a reference to a container.
CloudBlobContainer container = blobClient.GetContainerReference("testvhds");

// Create the container if it doesn't already exist.
container.CreateIfNotExists();

CloudPageBlob pageBlob = container.GetPageBlobReference("os4.vhd");
pageBlob.Create(16 * OneGigabyteAsBytes);
```

## Resizing a page blob

Related article: [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

To resize a page blob after creation, use the [Resize](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob.resize) method. The requested size should be a multiple of 512 bytes.

```csharp
pageBlob.Resize(32 * OneGigabyteAsBytes);
```

## Writing pages to a page blob

Related article: [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

To write pages,  use the [CloudPageBlob.WritePages](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob.beginwritepages) method.

```csharp
pageBlob.WritePages(dataStream, startingOffset); 
```

## Reading pages from a page blob

Related article: [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

To read pages, use the [CloudPageBlob.DownloadRangeToByteArray](/dotnet/api/microsoft.azure.storage.blob.icloudblob.downloadrangetobytearray) method to read a range of bytes from the page blob.

```csharp
byte[] buffer = new byte[rangeSize];
pageBlob.DownloadRangeToByteArray(buffer, bufferOffset, pageBlobOffset, rangeSize); 
```

To determine which pages are backed by data, use [CloudPageBlob.GetPageRanges](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob.getpageranges). You can then enumerate the returned ranges and download the data in each range.

```csharp
IEnumerable<PageRange> pageRanges = pageBlob.GetPageRanges();

foreach (PageRange range in pageRanges)
{
    // Calculate the range size
    int rangeSize = (int)(range.EndOffset + 1 - range.StartOffset);

    byte[] buffer = new byte[rangeSize];

    // Read from the correct starting offset in the page blob and
    // place the data in the bufferOffset of the buffer byte array
    pageBlob.DownloadRangeToByteArray(buffer, bufferOffset, range.StartOffset, rangeSize);

    // Then use the buffer for the page range just read
}
```
