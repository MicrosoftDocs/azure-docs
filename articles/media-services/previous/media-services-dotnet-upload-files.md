---
title: Upload files into a Media Services account using .NET  | Microsoft Docs
description: Learn how to get media content into Media Services by creating and uploading assets.
services: media-services
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.assetid: c9c86380-9395-4db8-acea-507c52066f73
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2018
ms.author: juliako

---
# Upload files into a Media Services account using .NET
> [!div class="op_single_selector"]
> * [.NET](media-services-dotnet-upload-files.md)
> * [REST](media-services-rest-upload-files.md)
> * [Portal](media-services-portal-upload-files.md)
> 
> 

In Media Services, you upload (or ingest) your digital files into an asset. The **Asset** entity can contain video, audio, images, thumbnail collections, text tracks and closed caption files (and the metadata about these files.)  Once the files are uploaded, your content is stored securely in the cloud for further processing and streaming.

The files in the asset are called **Asset Files**. The **AssetFile** instance and the actual media file are two distinct objects. The AssetFile instance contains metadata about the media file, while the media file contains the actual media content.

> [!NOTE]
> The following considerations apply:
> 
> * Media Services uses the value of the IAssetFile.Name property when building URLs for the streaming content (for example, http://{AMSAccount}.origin.mediaservices.windows.net/{GUID}/{IAssetFile.Name}/streamingParameters.) For this reason, percent-encoding is not allowed. The value of the **Name** property cannot have any of the following [percent-encoding-reserved characters](http://en.wikipedia.org/wiki/Percent-encoding#Percent-encoding_reserved_characters): !*'();:@&=+$,/?%#[]". Also, there can only be one '.' for the file name extension.
> * The length of the name should not be greater than 260 characters.
> * There is a limit to the maximum file size supported for processing in Media Services. See [this](media-services-quotas-and-limitations.md) article for details about the file size limitation.
> * There is a limit of 1,000,000 policies for different AMS policies (for example, for Locator policy or ContentKeyAuthorizationPolicy). You should use the same policy ID if you are always using the same days / access permissions, for example, policies for locators that are intended to remain in place for a long time (non-upload policies). For more information, see [this](media-services-dotnet-manage-entities.md#limit-access-policies) article.
> 

When you create assets, you can specify the following encryption options:

* **None** - No encryption is used. This is the default value. When using this option your content is not protected in transit or at rest in storage.
  If you plan to deliver an MP4 using progressive download, use this option: 
* **CommonEncryption** - Use this option if you are uploading content that has already been encrypted and protected with Common Encryption or PlayReady DRM (for example, Smooth Streaming protected with PlayReady DRM).
* **EnvelopeEncrypted** – Use this option if you are uploading HLS encrypted with AES. Note that the files must have been encoded and encrypted by Transform Manager.
* **StorageEncrypted** - Encrypts your clear content locally using AES-256 bit encryption and then uploads it to Azure Storage where it is stored encrypted at rest. Assets protected with Storage Encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. The primary use case for Storage Encryption is when you want to secure your high-quality input media files with strong encryption at rest on disk.
  
    Media Services provides on-disk storage encryption for your assets, not over-the-wire like Digital Rights Manager (DRM).
  
    If your asset is storage encrypted, you must configure asset delivery policy. For more information, see [Configuring asset delivery policy](media-services-dotnet-configure-asset-delivery-policy.md).

If you specify for your asset to be encrypted with a **CommonEncrypted** option, or an **EnvelopeEncypted** option, you need to associate your asset with a **ContentKey**. For more information, see [How to create a ContentKey](media-services-dotnet-create-contentkey.md). 

If you specify for your asset to be encrypted with a **StorageEncrypted** option, the Media Services SDK for .NET creates a **StorateEncrypted** **ContentKey** for your asset.

This article shows how to use Media Services .NET SDK as well as Media Services .NET SDK extensions to upload files into a Media Services asset.

## Upload a single file with Media Services .NET SDK
The following code uses .NET to upload a single file. The AccessPolicy and Locator are created and destroyed by the Upload function. 

```csharp
        static public IAsset CreateAssetAndUploadSingleFile(AssetCreationOptions assetCreationOptions, string singleFilePath)
        {
            if (!File.Exists(singleFilePath))
            {
                Console.WriteLine("File does not exist.");
                return null;
            }

            var assetName = Path.GetFileNameWithoutExtension(singleFilePath);
            IAsset inputAsset = _context.Assets.Create(assetName, assetCreationOptions);

            var assetFile = inputAsset.AssetFiles.Create(Path.GetFileName(singleFilePath));

            Console.WriteLine("Upload {0}", assetFile.Name);

            assetFile.Upload(singleFilePath);
            Console.WriteLine("Done uploading {0}", assetFile.Name);

            return inputAsset;
        }
```


## Upload multiple files with Media Services .NET SDK
The following code shows how to create an asset and upload multiple files.

The code does the following:

* Creates an empty asset using the CreateEmptyAsset method defined in the previous step.
* Creates an **AccessPolicy** instance that defines the permissions and duration of access to the asset.
* Creates a **Locator** instance that provides access to the asset.
* Creates a **BlobTransferClient** instance. This type represents a client that operates on the Azure blobs. In this example, the client monitors the upload progress. 
* Enumerates through files in the specified directory and creates an **AssetFile** instance for each file.
* Uploads the files into Media Services using the **UploadAsync** method. 

> [!NOTE]
> Use the UploadAsync method to ensure that the calls are not blocking and the files are uploaded in parallel.
> 
> 

```csharp
        static public IAsset CreateAssetAndUploadMultipleFiles(AssetCreationOptions assetCreationOptions, string folderPath)
        {
            var assetName = "UploadMultipleFiles_" + DateTime.UtcNow.ToString();

            IAsset asset = _context.Assets.Create(assetName, assetCreationOptions);

            var accessPolicy = _context.AccessPolicies.Create(assetName, TimeSpan.FromDays(30),
                                                                AccessPermissions.Write | AccessPermissions.List);

            var locator = _context.Locators.CreateLocator(LocatorType.Sas, asset, accessPolicy);

            var blobTransferClient = new BlobTransferClient();
            blobTransferClient.NumberOfConcurrentTransfers = 20;
            blobTransferClient.ParallelTransferThreadCount = 20;

            blobTransferClient.TransferProgressChanged += blobTransferClient_TransferProgressChanged;

            var filePaths = Directory.EnumerateFiles(folderPath);

            Console.WriteLine("There are {0} files in {1}", filePaths.Count(), folderPath);

            if (!filePaths.Any())
            {
                throw new FileNotFoundException(String.Format("No files in directory, check folderPath: {0}", folderPath));
            }

            var uploadTasks = new List<Task>();
            foreach (var filePath in filePaths)
            {
                var assetFile = asset.AssetFiles.Create(Path.GetFileName(filePath));
                Console.WriteLine("Created assetFile {0}", assetFile.Name);

                // It is recommended to validate AssetFiles before upload. 
                Console.WriteLine("Start uploading of {0}", assetFile.Name);
                uploadTasks.Add(assetFile.UploadAsync(filePath, blobTransferClient, locator, CancellationToken.None));
            }

            Task.WaitAll(uploadTasks.ToArray());
            Console.WriteLine("Done uploading the files");

            blobTransferClient.TransferProgressChanged -= blobTransferClient_TransferProgressChanged;

            locator.Delete();
            accessPolicy.Delete();

            return asset;
        }

    static void  blobTransferClient_TransferProgressChanged(object sender, BlobTransferProgressChangedEventArgs e)
    {
        if (e.ProgressPercentage > 4) // Avoid startup jitter, as the upload tasks are added.
        {
            Console.WriteLine("{0}% upload competed for {1}.", e.ProgressPercentage, e.LocalFile);
        }
    }
```


When uploading a large number of assets, consider the following:

* Create a new **CloudMediaContext** object per thread. The **CloudMediaContext** class is not thread-safe.
* Increase NumberOfConcurrentTransfers from the default value of 2 to a higher value like 5. Setting this property affects all instances of **CloudMediaContext**. 
* Keep ParallelTransferThreadCount at the default value of 10.

## <a id="ingest_in_bulk"></a>Ingesting Assets in Bulk using Media Services .NET SDK
Uploading large asset files can be a bottleneck during asset creation. Ingesting Assets in Bulk or “Bulk Ingesting”, involves decoupling asset creation from the upload process. To use a bulk ingesting approach, create a manifest (IngestManifest) that describes the asset and its associated files. Then use the upload method of your choice to upload the associated files to the manifest’s blob container. Microsoft Azure Media Services watches the blob container associated with the manifest. Once a file is uploaded to the blob container, Microsoft Azure Media Services completes the asset creation based on the configuration of the asset in the manifest (IngestManifestAsset).

To create a new IngestManifest, call the Create method exposed by the IngestManifests collection on the CloudMediaContext. This method creates a new IngestManifest with the manifest name you provide.

```csharp
    IIngestManifest manifest = context.IngestManifests.Create(name);
```

Create the assets that are associated with the bulk IngestManifest. Configure the desired encryption options on the asset for bulk ingesting.

```csharp
    // Create the assets that will be associated with this bulk ingest manifest
    IAsset destAsset1 = _context.Assets.Create(name + "_asset_1", AssetCreationOptions.None);
    IAsset destAsset2 = _context.Assets.Create(name + "_asset_2", AssetCreationOptions.None);
```

An IngestManifestAsset associates an Asset with a bulk IngestManifest for bulk ingesting. It also associates the AssetFiles that makes up each Asset. 
To create an IngestManifestAsset, use the Create method on the server context.

The following example demonstrates adding two new IngestManifestAssets that associate the two assets previously created to the bulk ingest manifest. Each IngestManifestAsset also associates a set of files that are uploaded for each asset during bulk ingesting.  

```csharp
    string filename1 = _singleInputMp4Path;
    string filename2 = _primaryFilePath;
    string filename3 = _singleInputFilePath;

    IIngestManifestAsset bulkAsset1 =  manifest.IngestManifestAssets.Create(destAsset1, new[] { filename1 });
    IIngestManifestAsset bulkAsset2 =  manifest.IngestManifestAssets.Create(destAsset2, new[] { filename2, filename3 });
```

You can use any high-speed client application capable of uploading the asset files to the blob storage container URI provided by the **IIngestManifest.BlobStorageUriForUpload** property of the IngestManifest. 

The following code shows how to use .NET SDK to upload the assets files.

```csharp
    static void UploadBlobFile(string containerName, string filename)
    {
        Task copytask = new Task(() =>
        {
            var storageaccount = new CloudStorageAccount(new StorageCredentials(_storageAccountName, _storageAccountKey), true);
            CloudBlobClient blobClient = storageaccount.CreateCloudBlobClient();
            CloudBlobContainer blobContainer = blobClient.GetContainerReference(containerName);

            string[] splitfilename = filename.Split('\\');
            var blob = blobContainer.GetBlockBlobReference(splitfilename[splitfilename.Length - 1]);

            using (var stream = System.IO.File.OpenRead(filename))
                blob.UploadFromStream(stream);

            lock (consoleWriteLock)
            {
                Console.WriteLine("Upload for {0} completed.", filename);
            }
        });

        copytask.Start();
    }
```

The code for uploading the asset files for the sample used in this article is shown in the following code example:

```csharp
    UploadBlobFile(manifest.BlobStorageUriForUpload, filename1);
    UploadBlobFile(manifest.BlobStorageUriForUpload, filename2);
    UploadBlobFile(manifest.BlobStorageUriForUpload, filename3);
```

You can determine the progress of the bulk ingesting for all assets associated with an **IngestManifest** by polling the Statistics property of the **IngestManifest**. In order to update progress information, you must use a new **CloudMediaContext** each time you poll the Statistics property.

The following example demonstrates polling an IngestManifest by its **Id**.

```csharp
    static void MonitorBulkManifest(string manifestID)
    {
       bool bContinue = true;
       while (bContinue)
       {
          CloudMediaContext context = GetContext();
          IIngestManifest manifest = context.IngestManifests.Where(m => m.Id == manifestID).FirstOrDefault();

          if (manifest != null)
          {
             lock(consoleWriteLock)
             {
                Console.WriteLine("\nWaiting on all file uploads.");
                Console.WriteLine("PendingFilesCount  : {0}", manifest.Statistics.PendingFilesCount);
                Console.WriteLine("FinishedFilesCount : {0}", manifest.Statistics.FinishedFilesCount);
                Console.WriteLine("{0}% complete.\n", (float)manifest.Statistics.FinishedFilesCount / (float)(manifest.Statistics.FinishedFilesCount + manifest.Statistics.PendingFilesCount) * 100);

                if (manifest.Statistics.PendingFilesCount == 0)
                {
                   Console.WriteLine("Completed\n");
                   bContinue = false;
                }
             }

             if (manifest.Statistics.FinishedFilesCount < manifest.Statistics.PendingFilesCount)
                Thread.Sleep(60000);
          }
          else // Manifest is null
             bContinue = false;
       }
    }
```


## Upload files using .NET SDK Extensions
The following example shows how to upload a single file using .NET SDK Extensions. In this case the **CreateFromFile** method is used, but the asynchronous version is also available (**CreateFromFileAsync**). The **CreateFromFile** method lets you specify the file name, encryption option, and a callback in order to report the upload progress of the file.

```csharp
    static public IAsset UploadFile(string fileName, AssetCreationOptions options)
    {
        IAsset inputAsset = _context.Assets.CreateFromFile(
            fileName,
            options,
            (af, p) =>
            {
                Console.WriteLine("Uploading '{0}' - Progress: {1:0.##}%", af.Name, p.Progress);
            });

        Console.WriteLine("Asset {0} created.", inputAsset.Id);

        return inputAsset;
    }
```

The following example calls UploadFile function and specifies storage encryption as the asset creation option.  

```csharp
    var asset = UploadFile(@"C:\VideoFiles\BigBuckBunny.mp4", AssetCreationOptions.StorageEncrypted);
```

## Next steps

You can now encode your uploaded assets. For more information, see [Encode assets](media-services-portal-encode.md).

You can also use Azure Functions to trigger an encoding job based on a file arriving in the configured container. For more information, see [this sample](https://azure.microsoft.com/resources/samples/media-services-dotnet-functions-integration/ ).

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Next step
Now that you have uploaded an asset to Media Services, go to the [How to Get a Media Processor][How to Get a Media Processor] article.

[How to Get a Media Processor]: media-services-get-media-processor.md

