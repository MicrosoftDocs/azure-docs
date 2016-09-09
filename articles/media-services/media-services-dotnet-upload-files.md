<properties 
	pageTitle="Upload Files into a Media Services account using .NET" 
	description="Learn how to get media content into Media Services by creating and uploading assets." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
 	ms.date="07/18/2016" 
	ms.author="juliako"/>



#Upload Files into a Media Services account using .NET

[AZURE.INCLUDE [media-services-selector-upload-files](../../includes/media-services-selector-upload-files.md)]

In Media Services, you upload (or ingest) your digital files into an asset. The **Asset** entity can contain video, audio, images, thumbnail collections, text tracks and closed caption files (and the metadata about these files.)  Once the files are uploaded, your content is stored securely in the cloud for further processing and streaming.

The files in the asset are called **Asset Files**. The **AssetFile** instance and the actual media file are two distinct objects. The AssetFile instance contains metadata about the media file, while the media file contains the actual media content.

When you create assets, you can specify the following encryption options. 

- **None** - No encryption is used. This is the default value. Note that when using this option your content is not protected in transit or at rest in storage.
If you plan to deliver an MP4 using progressive download, use this option. 
- **CommonEncryption** - Use this option if you are uploading content that has already been encrypted and protected with Common Encryption or PlayReady DRM (for example, Smooth Streaming protected with PlayReady DRM).
- **EnvelopeEncrypted** – Use this option if you are uploading HLS encrypted with AES. Note that the files must have been encoded and encrypted by Transform Manager.
- **StorageEncrypted** - Encrypts your clear content locally using AES-256 bit encryption and then uploads it to Azure Storage where it is stored encrypted at rest. Assets protected with Storage Encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. The primary use case for Storage Encryption is when you want to secure your high quality input media files with strong encryption at rest on disk.

	Media Services provides on-disk storage encryption for your assets, not over-the-wire like Digital Rights Manager (DRM).

	If your asset is storage encrypted, you must configure asset delivery policy. For more information see [Configuring asset delivery policy](media-services-dotnet-configure-asset-delivery-policy.md).

If you specify for your asset to be encrypted with a **CommonEncrypted** option, or an **EnvelopeEncypted** option, you will need to associate your asset with a **ContentKey**. For more information, see [How to create a ContentKey](media-services-dotnet-create-contentkey.md). 

If you specify for your asset to be encrypted with a **StorageEncrypted** option, the Media Services SDK for .NET will create a **StorateEncrypted** **ContentKey** for your asset.

>[AZURE.NOTE]Media Services uses the value of the IAssetFile.Name property when building URLs for the streaming content (for example, http://{AMSAccount}.origin.mediaservices.windows.net/{GUID}/{IAssetFile.Name}/streamingParameters.) For this reason, percent-encoding is not allowed. The value of the **Name** property cannot have any of the following [percent-encoding-reserved characters](http://en.wikipedia.org/wiki/Percent-encoding#Percent-encoding_reserved_characters): !*'();:@&=+$,/?%#[]". Also, there can only be one ‘.’ for the file name extension.

This topic shows how to use Media Services .NET SDK as well as Media Services .NET SDK extensions to upload files into a Media Services asset.

 
## Upload a single file with Media Services .NET SDK 

The sample code below uses .NET SDK to perform the following tasks: 

- Creates an empty Asset.
- Creates an AssetFile instance that we want to associate with the asset.
- Creates an AccessPolicy instance that defines the permissions and duration of access to the asset.
- Creates a Locator instance that provides access to the asset.
- Uploads a single media file into Media Services. 

		
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

            Console.WriteLine("Created assetFile {0}", assetFile.Name);

            var policy = _context.AccessPolicies.Create(
                                    assetName,
                                    TimeSpan.FromDays(30),
                                    AccessPermissions.Write | AccessPermissions.List);

            var locator = _context.Locators.CreateLocator(LocatorType.Sas, inputAsset, policy);

            Console.WriteLine("Upload {0}", assetFile.Name);

            assetFile.Upload(singleFilePath);
            Console.WriteLine("Done uploading {0}", assetFile.Name);

            locator.Delete();
            policy.Delete();

            return inputAsset;
		}

##Upload multiple files with Media Services .NET SDK 

The following code shows how to create an asset and upload multiple files.

The code does the following:
	
- 	Creates an empty asset using the CreateEmptyAsset method defined in the previous step.
 	
- 	Creates an **AccessPolicy** instance that defines the permissions and duration of access to the asset.
 	
- 	Creates a **Locator** instance that provides access to the asset.
 	
- 	Creates a **BlobTransferClient** instance. This type represents a client that operates on the Azure blobs. In this example we use the client to monitor the upload progress. 
 	
- 	Enumerates through files in the specified directory and creates an **AssetFile** instance for each file.
 	
- 	Uploads the files into Media Services using the **UploadAsync** method. 
 	
>[AZURE.NOTE] Use the UploadAsync method to ensure that the calls are not blocking and the files are uploaded in parallel.
 	
 	
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

                // It is recommended to validate AccestFiles before upload. 
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



When uploading a large number of assets, consider the following.

- Create a new **CloudMediaContext** object per thread. The **CloudMediaContext** class is not thread safe.
 
- Increase NumberOfConcurrentTransfers from the default value of 2 to a higher value like 5. Setting this property affects all instances of **CloudMediaContext**. 
 
- Keep ParallelTransferThreadCount at the default value of 10.
 
##<a id="ingest_in_bulk"></a>Ingesting Assets in Bulk using Media Services .NET SDK 

Uploading large asset files can be a bottleneck during asset creation. Ingesting Assets in Bulk or “Bulk Ingesting”, involves decoupling asset creation from the upload process. To use a bulk ingesting approach, create a manifest (IngestManifest) that describes the asset and its associated files. Then use the upload method of your choice to upload the associated files to the manifest’s blob container. Microsoft Azure Media Services watches the blob container associated with the manifest. Once a file is uploaded to the blob container, Microsoft Azure Media Services completes the asset creation based on the configuration of the asset in the manifest (IngestManifestAsset).


To create a new IngestManifest call the Create method exposed by the IngestManifests collection on the CloudMediaContext. This method will create a new IngestManifest with the manifest name you provide.

	IIngestManifest manifest = context.IngestManifests.Create(name);

Create the assets that will be associated with the bulk IngestManifest. Configure the desired encryption options on the asset for bulk ingesting.

	// Create the assets that will be associated with this bulk ingest manifest
	IAsset destAsset1 = _context.Assets.Create(name + "_asset_1", AssetCreationOptions.None);
	IAsset destAsset2 = _context.Assets.Create(name + "_asset_2", AssetCreationOptions.None);

An IngestManifestAsset associates an Asset with a bulk IngestManifest for bulk ingesting. It also associates the AssetFiles that will make up each Asset. 
To create an IngestManifestAsset, use the Create method on the server context.

The following example demonstrates adding two new IngestManifestAssets that associate the two assets previously created to the bulk ingest manifest. Each IngestManifestAsset also associates a set of files that will be uploaded for each asset during bulk ingesting.  

	string filename1 = _singleInputMp4Path;
	string filename2 = _primaryFilePath;
	string filename3 = _singleInputFilePath;
	
	IIngestManifestAsset bulkAsset1 =  manifest.IngestManifestAssets.Create(destAsset1, new[] { filename1 });
	IIngestManifestAsset bulkAsset2 =  manifest.IngestManifestAssets.Create(destAsset2, new[] { filename2, filename3 });
	
You can use any high speed client application capable of uploading the asset files to the blob storage container URI provided by the **IIngestManifest.BlobStorageUriForUpload** property of the IngestManifest. One notable high speed upload service is [Aspera On Demand for Azure Application](https://datamarket.azure.com/application/2cdbc511-cb12-4715-9871-c7e7fbbb82a6). You can also write code to upload the assets files as shown in the following code example.
	
	static void UploadBlobFile(string destBlobURI, string filename)
	{
	    Task copytask = new Task(() =>
	    {
	        var storageaccount = new CloudStorageAccount(new StorageCredentials(_storageAccountName, _storageAccountKey), true);
	        CloudBlobClient blobClient = storageaccount.CreateCloudBlobClient();
	        CloudBlobContainer blobContainer = blobClient.GetContainerReference(destBlobURI);
	
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

The code for uploading the asset files for the sample used in this topic is shown in the following code example.
	
	UploadBlobFile(manifest.BlobStorageUriForUpload, filename1);
	UploadBlobFile(manifest.BlobStorageUriForUpload, filename2);
	UploadBlobFile(manifest.BlobStorageUriForUpload, filename3);
	

You can determine the progress of the bulk ingesting for all assets associated with an **IngestManifest** by polling the Statistics property of the **IngestManifest**. In order to update progress information, you must use a new **CloudMediaContext** each time you poll the Statistics property.

The following example demonstrates polling an IngestManifest by its **Id**.
	
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
	


##Upload files using .NET SDK Extensions 

The example below shows how to upload a single file using .NET SDK Extensions. In this case the **CreateFromFile** method is used, but the asynchronous version is also available (**CreateFromFileAsync**). The **CreateFromFile** method lets you specify the file name, encryption option, and a callback in order to report the upload progress of the file.


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

The following example calls UploadFile function and specifies storage encryption as the asset creation option.  


	var asset = UploadFile(@"C:\VideoFiles\BigBuckBunny.mp4", AssetCreationOptions.StorageEncrypted);


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]



##Next Steps
Now that you have uploaded an asset to Media Services, go to the [How to Get a Media Processor][] topic.

[How to Get a Media Processor]: media-services-get-media-processor.md
 
