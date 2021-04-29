---
title: Media Services v2 to v3 migration samples comparison 
description: A set of samples to help you compare the code differences between Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 03/25/2021
ms.author: inhenkel
---

# Media Services migration code sample comparison

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

## Compare the SDKs

You can use some of our code samples to compare the way things are done between SDKs.

## Samples for comparison

The following table is a listing of samples for comparison between v2 and v3 for common scenarios.

|Scenario|v2 API|v3 API|
|---|---|---|
|Create an asset and upload a file |[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L113)|[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L169)|
|Submit a job|[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L146)|[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L298)<br/><br/>Shows how to first create a Transform and then submit a Job.|
|Publish an asset with AES encryption |1. Create `ContentKeyAuthorizationPolicyOption`<br/>2. Create `ContentKeyAuthorizationPolicy`<br/>3. Create `AssetDeliveryPolicy`<br/>4. Create `Asset` and upload content OR submit `Job` and use `OutputAsset`<br/>5. Associate `AssetDeliveryPolicy` with `Asset`<br/>6. Create `ContentKey`<br/>7. Attach `ContentKey` to `Asset`<br/>8. Create `AccessPolicy`<br/>9. Create `Locator`<br/><br/>[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L64)|1. Create `ContentKeyPolicy`<br/>2. Create `Asset`<br/>3. Upload content or use `Asset` as `JobOutput`<br/>4. Create `StreamingLocator`<br/><br/>[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs#L105)|
|Get job details and manage jobs |[Manage jobs with v2](../previous/media-services-dotnet-manage-entities.md#get-a-job-reference) |[Manage jobs with v3](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L546)|
