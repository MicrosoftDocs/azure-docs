---
title: How to mitigate latency when using the Face service
titleSuffix: Azure AI services
description: Learn how to mitigate latency when using the Face service.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 11/07/2021
ms.author: pafarley
ms.devlang: csharp
ms.custom: cogserv-non-critical-vision
---

# How to: mitigate latency when using the Face service

You may encounter latency when using the Face service. Latency refers to any kind of delay that occurs when communicating over a network. In general, possible causes of latency include:
- The physical distance each packet must travel from source to destination.
- Problems with the transmission medium.
- Errors in routers or switches along the transmission path.
- The time required by antivirus applications, firewalls, and other security mechanisms to inspect packets.
- Malfunctions in client or server applications.

This article talks about possible causes of latency specific to using the Azure AI services, and how you can mitigate these causes.

> [!NOTE]
> Azure AI services does not provide any Service Level Agreement (SLA) regarding latency.

## Possible causes of latency

### Slow connection between Azure AI services and a remote URL

Some Azure AI services provide methods that obtain data from a remote URL that you provide. For example, when you call the [DetectWithUrlAsync method](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithurlasync#Microsoft_Azure_CognitiveServices_Vision_Face_FaceOperationsExtensions_DetectWithUrlAsync_Microsoft_Azure_CognitiveServices_Vision_Face_IFaceOperations_System_String_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_Collections_Generic_IList_System_Nullable_Microsoft_Azure_CognitiveServices_Vision_Face_Models_FaceAttributeType___System_String_System_Nullable_System_Boolean__System_String_System_Threading_CancellationToken_) of the Face service, you can specify the URL of an image in which the service tries to detect faces.

```csharp
var faces = await client.Face.DetectWithUrlAsync("https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg");
```

The Face service must then download the image from the remote server. If the connection from the Face service to the remote server is slow, that will affect the response time of the Detect method.

To mitigate this situation, consider [storing the image in Azure Premium Blob Storage](../../../storage/blobs/storage-upload-process-images.md?tabs=dotnet). For example:

``` csharp
var faces = await client.Face.DetectWithUrlAsync("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/Face/images/Family1-Daughter1.jpg");
```

Be sure to use a storage account in the same region as the Face resource. This will reduce the latency of the connection between the Face service and the storage account.

### Large upload size

Some Azure services provide methods that obtain data from a file that you upload. For example, when you call the [DetectWithStreamAsync method](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperationsextensions.detectwithstreamasync#Microsoft_Azure_CognitiveServices_Vision_Face_FaceOperationsExtensions_DetectWithStreamAsync_Microsoft_Azure_CognitiveServices_Vision_Face_IFaceOperations_System_IO_Stream_System_Nullable_System_Boolean__System_Nullable_System_Boolean__System_Collections_Generic_IList_System_Nullable_Microsoft_Azure_CognitiveServices_Vision_Face_Models_FaceAttributeType___System_String_System_Nullable_System_Boolean__System_String_System_Threading_CancellationToken_) of the Face service, you can upload an image in which the service tries to detect faces.

```csharp
using FileStream fs = File.OpenRead(@"C:\images\face.jpg");
System.Collections.Generic.IList<DetectedFace> faces = await client.Face.DetectWithStreamAsync(fs, detectionModel: DetectionModel.Detection02);
```

If the file to upload is large, that will impact the response time of the `DetectWithStreamAsync` method, for the following reasons:
- It takes longer to upload the file.
- It takes the service longer to process the file, in proportion to the file size.

Mitigations:
- Consider [storing the image in Azure Premium Blob Storage](../../../storage/blobs/storage-upload-process-images.md?tabs=dotnet). For example:
``` csharp
var faces = await client.Face.DetectWithUrlAsync("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/Face/images/Family1-Daughter1.jpg");
```
- Consider uploading a smaller file.
    - See the guidelines regarding [input data for face detection](../concept-face-detection.md#input-data) and [input data for face recognition](../concept-face-recognition.md#input-data).
    - For face detection, when using detection model `DetectionModel.Detection01`, reducing the image file size will increase processing speed. When you use detection model `DetectionModel.Detection02`, reducing the image file size will only increase processing speed if the image file is smaller than 1920x1080.
    - For face recognition, reducing the face size to 200x200 pixels doesn't affect the accuracy of the recognition model.
    - The performance of the `DetectWithUrlAsync` and `DetectWithStreamAsync` methods also depends on how many faces are in an image. The Face service can return up to 100 faces for an image. Faces are ranked by face rectangle size from large to small.
    - If you need to call multiple service methods, consider calling them in parallel if your application design allows for it. For example, if you need to detect faces in two images to perform a face comparison:
```csharp
var faces_1 = client.Face.DetectWithUrlAsync("https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg");
var faces_2 = client.Face.DetectWithUrlAsync("https://www.biography.com/.image/t_share/MTQ1NDY3OTIxMzExNzM3NjE3/john-f-kennedy---debating-richard-nixon.jpg");
Task.WaitAll (new Task<IList<DetectedFace>>[] { faces_1, faces_2 });
IEnumerable<DetectedFace> results = faces_1.Result.Concat (faces_2.Result);
```

### Slow connection between your compute resource and the Face service

If your computer has a slow connection to the Face service, this will affect the response time of service methods.

Mitigations:
- When you create your Face subscription, make sure to choose the region closest to where your application is hosted.
- If you need to call multiple service methods, consider calling them in parallel if your application design allows for it. See the previous section for an example.
- If longer latencies affect the user experience, choose a timeout threshold (for example, maximum 5 seconds) before retrying the API call.

## Next steps

In this guide, you learned how to mitigate latency when using the Face service. Next, learn how to scale up from existing PersonGroup and FaceList objects to LargePersonGroup and LargeFaceList objects, respectively.

> [!div class="nextstepaction"]
> [Example: Use the large-scale feature](use-large-scale.md)

## Related topics

- [Reference documentation (REST)](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
- [Reference documentation (.NET SDK)](/dotnet/api/overview/azure/cognitiveservices/face-readme)
