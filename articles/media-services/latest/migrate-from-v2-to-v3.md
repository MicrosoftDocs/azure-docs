---
title: Migrate from Azure Media Services v2 to v3 | Microsoft Docs
description: This article describes changes that were introduced in Azure Media Services v3 and shows differences between two versions.
services: media-services
documentationcenter: na
author: Juliako
manager: cfowler
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 06/12/2018
ms.author: juliako
---

# Migrate from Media Services v2 to v3

> [!NOTE]
> The latest version of Azure Media Services is in Preview and may be referred to as v3.

This article describes changes that were introduced in Azure Media Services (AMS) v3 and shows differences between two versions.

## Why should you move to v3?

### API is more approachable

*  v3 is based on a unified API surface which exposes both management and operations functionality built on Azure Resource Manager. Azure Resource Manager templates can be used to create and deploy Transforms, Streaming Endpoints, LiveEvents, and more.
* Open API (aka Swagger) Specification document.
* SDKs available for .Net, .Net Core, Node.js, Python, Java, Ruby.
* Azure CLI integration.

### New features

* Encoding now supports HTTPS ingest (Url-based input).
* Transforms are new in v3. A Transform is used to share configurations, create Azure Resource Manager Templates, and isolate encoding settings for a specific customer or tenant. 
* An Asset can have multiple StreamingLocators each with different Dynamic Packaging and Dynamic Encryption settings.
* Content protection supports multi-key features. 
* LiveEvent Preview supports Dynamic Packaging and Dynamic Encryption. This enables content protection on Preview as well as DASH and HLS packaging.
* LiveOuput is simpler to use than the older Program entity. 
* RBAC support on entities was added.

## Changes from v2

* In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but will not allow creation of new ones.

    For Assets created with v3, Media Services supports the [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-service-encryption?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) server side storage encryption.
    
* Media Services SDKs decoupled from the Storage SDK which gives more control over the Storage SDK used and avoids versioning issues. 
* In v3, all of the encoding bit rates are in bits per second. This is different than the REST v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128, but in v3 it would be 128000. 
* AssetFiles, AccessPolicies, IngestManifests do not exist in v3.
* ContentKeys are no longer an entity, property of the StreamingLocator.
* Event Grid support replaces NotificationEndpoints.
* Some entities were renamed

  * JobOutput replaces Task, now just part of the Job.
  * LiveEvent replaces Channel.
  * LiveOutput replaces Program.
  * StreamingLocator replaces Locator.

## Code changes

### Create an asset and upload a file 

#### v2

```csharp
IAsset asset = context.Assets.Create(assetName, storageAccountName, options);

IAssetFile assetFile = asset.AssetFiles.Create(assetFileName);

assetFile.Upload(filePath);
```

#### v3

```csharp
Asset asset = client.Assets.CreateOrUpdate(resourceGroupName, accountName, assetName, new Asset());

var response = client.Assets.ListContainerSas(resourceGroupName, accountName, assetName, permissions: AssetContainerPermission.ReadWrite, expiryTime: DateTime.Now.AddHours(1));

var sasUri = new Uri(response.AssetContainerSasUrls.First());
CloudBlobContainer container = new CloudBlobContainer(sasUri);

var blob = container.GetBlockBlobReference(Path.GetFileName(fileToUpload));
blob.UploadFromFile(fileToUpload);
```

### Submit a job

#### v2

```csharp
IMediaProcessor processor = context.MediaProcessors.GetLatestMediaProcessorByName(mediaProcessorName);

IJob job = jobs.Create($"Job for {inputAsset.Name}");

ITask task = job.Tasks.AddNew($"Task for {inputAsset.Name}", processor, taskConfiguration);

task.InputAssets.Add(inputAsset);

task.OutputAssets.AddNew(outputAssetName, outputAssetStorageAccountName, outputAssetOptions);

job.Submit();
```

#### v3

```csharp
client.Assets.CreateOrUpdate(resourceGroupName, accountName, outputAssetName, new Asset());

JobOutput[] jobOutputs = { new JobOutputAsset(outputAssetName)};

JobInput jobInput = JobInputAsset(assetName: assetName);

Job job = client.Jobs.Create(resourceGroupName,
accountName, transformName, jobName,
new Job {Input = jobInput, Outputs = jobOutputs});
```

### Publish an asset with AES encryption 

#### v2

1. Create ContentKeyAuthorizationPolicyOption
2. Create ContentKeyAuthorizationPolicy
3. Create AssetDeliveryPolicy
4. Create Asset and upload content OR Submit job and use output asset
5. Associate AssetDeliveryPolicy with Asset
6. Create ContentKey
7. Attach ContentKey to Asset
8. Create AccessPolicy
9. Create Locator

#### v3

1. Create Content Key Policy
2. Create Asset
3. Upload content or use Asset as JobOutput
4. Create StreamingLocator

## Next steps

To see how easy it is to start encoding and streaming video files, check out [Stream files](stream-files-dotnet-quickstart.md). 

