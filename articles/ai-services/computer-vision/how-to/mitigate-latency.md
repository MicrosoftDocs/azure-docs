---
title: How to mitigate latency and improve performance when using the Face service
titleSuffix: Azure AI services
description: Learn how to mitigate network latency and improve service performance when using the Face service.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 11/06/2023
ms.author: pafarley
ms.devlang: csharp
ms.custom:
  - cogserv-non-critical-vision
  - ignite-2023
---

# Mitigate latency and improve performance

This guide describes how to mitigate network latency and improve service performance when using the Face service. The speed and performance of your application will affect the experience of your end-users, such as people who enroll in and use a face identification system.

## Mitigate latency

You may encounter latency when using the Face service. Latency refers to any kind of delay that occurs when systems communicate over a network. In general, possible causes of latency include:
- The physical distance each packet must travel from source to destination.
- Problems with the transmission medium.
- Errors in routers or switches along the transmission path.
- The time required by antivirus applications, firewalls, and other security mechanisms to inspect packets.
- Malfunctions in client or server applications.

This section describes how you can mitigate various causes of latency specific to the Azure AI Face service.

> [!NOTE]
> Azure AI services do not provide any Service Level Agreement (SLA) regarding latency.

### Choose the appropriate region for your Face resource

The network latency, the time it takes for information to travel from source (your application) to destination (your Azure resource), is strongly affected by the geographical distance between the application making requests and the Azure server responding to those requests. For example, if your Face resource is located in `EastUS`, it has a faster response time for users in New York, and users in Asia experience a longer delay. 

We recommend that you select a region that is closest to your users to minimize latency. If your users are distributed across the world, consider creating multiple resources in different regions and routing requests to the region nearest to your customers. Alternatively, you may choose a region that is near the geographic center of all your customers.

### Use Azure blob storage for remote URLs

The Face service provides two ways to upload images for processing: uploading the raw byte data of the image directly in the request, or providing a URL to a remote image. Regardless of the method, the Face service needs to download the image from its source location. If the connection from the Face service to the client or the remote server is slow or poor, it affects the response time of requests. If you have an issue with latency, consider storing the image in Azure Blob Storage and passing the image URL in the request. For more implementation details, see [storing the image in Azure Premium Blob Storage](../../../storage/blobs/storage-upload-process-images.md?tabs=dotnet). An example API call:

``` csharp
var faces = await client.Face.DetectWithUrlAsync("https://<storage_account_name>.blob.core.windows.net/<container_name>/<file_name>");
```

Be sure to use a storage account in the same region as the Face resource. This reduces the latency of the connection between the Face service and the storage account.

### Use optimal file sizes

If the image files you use are large, it affects the response time of the Face service in two ways:
- It takes more time to upload the file.
- It takes the service more time to process the file, in proportion to the file size.


#### The tradeoff between accuracy and network speed

The quality of the input images affects both the accuracy and the latency of the Face service. Images with lower quality may result in erroneous results. Images of higher quality may enable more precise interpretations. However, images of higher quality also increase the network latency due to their larger file sizes. The service requires more time to receive the entire file from the client and to process it, in proportion to the file size. Above a certain level, further quality enhancements won't significantly improve the accuracy.

To achieve the optimal balance between accuracy and speed, follow these tips to optimize your input data. 
- For face detection and recognition operations, see [input data for face detection](../concept-face-detection.md#input-data) and [input data for face recognition](../concept-face-recognition.md#input-data).
- For liveness detection, see the [tutorial](../Tutorials/liveness.md#select-a-good-reference-image). 

#### Other file size tips

Note the following additional tips:
- For face detection, when using detection model `DetectionModel.Detection01`, reducing the image file size increases processing speed. When you use detection model `DetectionModel.Detection02`, reducing the image file size will only increase processing speed if the image file is smaller than 1920x1080 pixels.
- For face recognition, reducing the face size will only increase the speed if the image is smaller than 200x200 pixels.
- The performance of the face detection methods also depends on how many faces are in an image. The Face service can return up to 100 faces for an image. Faces are ranked by face rectangle size from large to small.


## Call APIs in parallel when possible

If you need to call multiple APIs, consider calling them in parallel if your application design allows for it. For example, if you need to detect faces in two images to perform a face comparison, you can call them in an asynchronous task:

```csharp
var faces_1 = client.Face.DetectWithUrlAsync("https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg");
var faces_2 = client.Face.DetectWithUrlAsync("https://www.biography.com/.image/t_share/MTQ1NDY3OTIxMzExNzM3NjE3/john-f-kennedy---debating-richard-nixon.jpg");

Task.WaitAll (new Task<IList<DetectedFace>>[] { faces_1, faces_2 });
IEnumerable<DetectedFace> results = faces_1.Result.Concat (faces_2.Result);
```

## Smooth over spiky traffic 

The Face service's performance may be affected by traffic spikes, which can cause throttling, lower throughput, and higher latency. We recommend you increase the frequency of API calls gradually and avoid immediate retries. For example, if you have 3000 photos to perform facial detection on, do not send 3000 requests simultaneously. Instead, send 3000 requests sequentially over 5 minutes (that is, about 10 requests per second) to make the network traffic more consistent. If you want to decrease the time to completion, increase the number of calls per second gradually to smooth the traffic. If you encounter any error, refer to [Handle errors effectively](#handle-errors-effectively) to handle the response. 

## Handle errors effectively 

The errors `429` and `503` may occur on your Face API calls for various reasons. Your application must always be ready to handle these errors. Here are some recommendations:
 
|HTTP error code  | Description |Recommendation  |
|---------|---------|---------|
|  `429`   |   Throttling    |    You may encounter a rate limit with concurrent calls. You should decrease the frequency of calls and retry with exponential backoff. Avoid immediate retries and avoid re-sending numerous requests simultaneously. </br></br>If you want to increase the limit, see the [Request an increase](../identity-quotas-limits.md#how-to-request-an-increase-to-the-default-limits) section of the quotas guide.  |
| `503` |   Service unavailable    |   The service may be busy and unable to respond to your request immediately. You should adopt a back-off strategy similar to the one for error `429`.   |

## Ensure reliability and support 

The following are other tips to ensure the reliability and high support of your application: 

- Generate a unique GUID as the `client-request-id` HTTP request header and send it with each request. This helps Microsoft investigate any errors more easily if you need to report an issue with Microsoft. 
    - Always record the `client-request-id` and the response you received when you encounter an unexpected response. If you need any assistance, provide this information to Microsoft Support, along with the Azure resource ID and the time period when the problem occurred.
- Conduct a pilot test before you release your application into production. Ensure that your application can handle errors properly and effectively. 

## Next steps

In this guide, you learned how to improve performance when using the Face service. Next, follow the tutorial to set up a working software solution that combines server-side and client-side logic to do face liveness detection on users.

> [!div class="nextstepaction"]
> [Tutorial: Detect face liveness](../Tutorials/liveness.md)
