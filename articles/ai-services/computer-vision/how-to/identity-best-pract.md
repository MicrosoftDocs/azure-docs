---
title: TBD - Face
titleSuffix: Azure AI services
description: Learn concepts related to the tbd
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 11/05/2023
ms.author: pafarley
ms.custom: 
---

# Best Practices for using the Face service tbd

tbd latency
## Choose the appropriate region for your Azure AI Face resource

The network latency, the time it takes for information to travel from source (your application) to destination (your Azure resource), is strongly influenced by the geographical distance between the application making requests and the Azure server responding to those requests. For example, if your Face resource is located in `EastUS`, it will have a faster response time for users in New York, and users in Asia will experience a longer delay. 

We recommend that you select a region that is closest to your users to minimize latency. If your users are distributed across the world, consider creating multiple resources in different regions and routing requests to the region nearest to your customers. Alternatively, you may choose a region that is near the geographic center of all your customers.

## The tradeoff between accuracy and network speed

The quality of the input images affects both the accuracy and the latency of the Face service. Images with lower quality may result in erroneous results. Images of higher quality may enable more precise interpretations. However, images of higher quality also increase the network latency due to their larger file sizes. The service requires more time to receive the entire file from the client and to process it, in proportion to the file size. Note that above a certain level, further quality enhancements will not significantly improve the accuracy.

To achieve the optimal balance between accuracy and speed, follow these tips to optimize your input data. 
- For face detection and recognition operations, see [input data](tbd) for face detection and [input data](tbd) for face recognition. 
- For liveness detection, see <tbd>. 

## Store images in Azure Blob Storage to reduce latency 

The Face service provides two ways to upload images for processing: uploading the raw byte data of the image directly in the request, or providing a URL to a remote image. Regardless of the method, the Face service needs to download the image from its source location. If the connection from the Face service to the client or the remote server is slow or poor, it affects the response time of requests. If you have an issue with latency, consider storing the image in Azure Blob Storage and passing the image URL in the request. For more implementation details, see this [how-to guides](/azure/ai-services/computer-vision/how-to/mitigate-latency#slow-connection-between-azure-ai-services-and-a-remote-url). TBD is this redundant?

## Smooth over spiky traffic 

The Face service's performance may be affected by traffic spikes, which can cause throttling, lower throughput, and higher latency. We recommend you increase the frequency of API calls gradually and avoid immediate retries. For example, if you have 3000 photos to perform facial detection on, do not send 3000 requests simultaneously. Instead, send 3000 requests sequentially over 5 minutes (that is, about 10 requests per second) to make the network traffic more consistent. If you want to decrease the time to completion, increase the number of calls per second gradually to smooth the traffic. If you encounter any error, please refer to <tbd next section> to handle the response. 

## Handle errors effectively 

The errors `429` and `503` may occur for various reasons. Your application must always be ready to handle these errors. Here are some recommendations for managing them.
 
|HTTP error code  | Description |Recommendation  |
|---------|---------|---------|
|  `429`   |   Throttling    |    You may encounter a rate limit with concurrent calls. You should decrease the frequency of calls and retry with exponential backoff. Avoid immediate retries and avoid re-sending numerous requests simultaneously. </br></br>If you want to increase the limit, please follow <tbd link to quota doc section> to request a higher rate limit.  |
| `503` |   Service unavailable    |   The service may be busy and unable to respond to your request immediately. You should adopt a back-off strategy similar to the one for error `429`.   |



## Reliability and support 

To ensure the reliability and high support of your application: 

- Generate a unique GUID as the `client-request-id` HTTP request header and send it with each request. This will help Microsoft investigate any errors more easily if you need to report an issue with Microsoft. 
    - Always record the `client-request-id` and the response you received when you encounter an unexpected response. If you need any assistance, provide this information to Microsoft Support, along with the Azure resource ID and the time period when the problem occurred.
- Conduct a pilot test before you release your application into production. Ensure that your application can handle errors properly and effectively. 


## Next steps

Follow the tutorial to set up a working software solution that combines server-side and client-side logic to do face liveness detection on users.

* [Tutorial: Detect face liveness](./Tutorials/liveness.md)