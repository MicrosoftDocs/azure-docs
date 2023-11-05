---
title: TBD - Face
titleSuffix: Azure AI services
description: Learn concepts related to the tbd
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 11/05/2023
ms.author: pafarley
ms.custom: 
---

# Best Practices for using the Face service 

This article presents a set of best practices that can enhance the performance of your application using Face API. 


## Choose the right Azure AI Face resource located in an appropriate region 

The network latency, or the time it takes for each packet to travel from source to destination (your Azure resource), is significantly influenced by the geographical distance between the application making requests and Face service responding to those requests. For instance, if your Face resource is located in East US, it will have a faster response time for users in New York. Conversely, users in Asia will experience a longer delay. 

We recommend that you select a region that is closest to your users to minimize the latency. If your users are distributed across the globe, you may consider creating multiple resources in different regions and routing requests to the nearest region to your customers. Alternatively, you may choose a region that is not too far away from all your customers. 

## The tradeoff between accuracy and network latency 

The quality of the images affects both the accuracy and the latency of the service. Images with lower quality may result in erroneous judgments, while images with higher quality may enable more precise interpretations. However, images with higher quality also increase the network latency due to the larger file size. The service will require more time to receive the entire file from the client and to process it, in proportion to the file size. Moreover, beyond a certain level of quality, further enhancement will not significantly improve the accuracy. 

To achieve the optimal balance between accuracy and latency, please follow these tips to optimize your input data. 
- For image input, see input data for face detection and input data for face recognition. 
- For liveness check, see <tbd>.  

## Store images in Azure Blob Storage to get lower latency 

The Face service offers two methods to upload the image for processing: uploading the raw byte of the image directly in the request or providing an image URL. Regardless of the method chosen, the Face service needs to download the image from the client or the remote server. If the connection from the Face service to the client or the remote server is slow or poor, it will affect the response time of requests. If you face a long latency problem, you may consider storing the image in Azure Blob Storage and passing the image URL in the request. For more implementation details, see this [how-to guides](/azure/ai-services/computer-vision/how-to/mitigate-latency#slow-connection-between-azure-ai-services-and-a-remote-url). 

## Smooth down spiky traffic 

The service performance may be affected by traffic spikes, which may cause throttling, lower throughput and higher latency. To optimize the performance, we recommend that you increase the frequency of calls gradually and avoid immediate retries. For example, if you have 3000 photos to perform facial detection, do not send 3000 requests simultaneously. Instead, send 3000 requests sequentially within 5 minutes (approximately 10 requests per second) to make the traffic more consistent. If you want to complete these detection tasks in less time, please increase the number of calls per second step-by-step to smooth the traffic. If you encounter any error, please refer to <how to handle errors effectively> to handle the response. 

## Handle errors effectively 

The errors 429 and 503 may occur at any time for various reasons. Your application must always be ready to handle these errors. Here are some recommendations for managing them. 

 
|Topic  |HTTP error code  |Best practice  |
|---------|---------|---------|
|Throttling     |  429       |    You may encounter the limitation of concurrent calls. You should decrease the frequency of calls and retry with exponential backoff. Refrain from immediate retries and resending numerous requests simultaneously. </br></br>If you want to increase the limit, please follow <this instruction> to request a higher rate limit.   |
|Service unavailable  |      503   |   The service may be busy and unable to respond to your request immediately. You should adopt a back-off strategy similar to the one for error 429.       |



## Reliability and support 

To ensure the reliability and high support of your application: 

- Generate a unique GUID as the client-request-id HTTP request header and send it on each request. This will facilitate Microsoft to investigate any errors more easily if you need to report an issue with Microsoft. 
    - Always record the client-request-id and the response you received when you encounter an unexpected response. If you need any assistance, provide these information along with the Azure resource id and the time period when the problem occurred to Microsoft Support. 
- Conduct a pilot test before releasing your application into production. Ensure that your application has the ability to handle errors properly and effectively. 


## Next steps

Follow the tutorial to set up a working software solution that combines server-side and client-side logic to do face liveness detection on users.

* [Tutorial: Detect face liveness](./Tutorials/liveness.md)