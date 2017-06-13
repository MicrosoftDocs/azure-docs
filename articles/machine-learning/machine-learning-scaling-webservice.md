---
title: How to increase concurrency of an Azure Machine Learning web service | Microsoft Docs
description: Learn how to increase concurrency of an Azure Machine Learning web service by adding additional endpoints.
services: machine-learning
documentationcenter: ''
author: neerajkh
manager: srikants
editor: cgronlun
keywords: azure machine learning, web services, operationalization, scaling, endpoint, concurrency

ms.assetid: c2c51d7f-fd2d-4f03-bc51-bf47e6969296
ms.service: machine-learning
ms.devlang: NA
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 01/23/2017
ms.author: neerajkh

---
# Scaling an Azure Machine Learning web service by adding additional endpoints
> [!NOTE]
> This topic describes techniques applicable to a **Classic** Machine Learning Web service. 
> 
> 

By default, each published Web service is configured to support 20 concurrent requests and can be as high as 200 concurrent requests. While the Azure classic portal provides a way to set this value, Azure Machine Learning automatically optimizes the setting to provide the best performance for your web service and the portal value is ignored. 

If you plan to call the API with a higher load than a Max Concurrent Calls value of 200 will support, you should create multiple endpoints on the same Web service. You can then randomly distribute your load across all of them.

The scaling of a Web service is a common task. Some reasons to scale are to support more than 200 concurrent requests, increase availability through multiple endpoints, or provide separate endpoints for the web service. You can increase the scale by adding additional endpoints for the same Web service through [Azure classic portal](https://manage.windowsazure.com/) or the [Azure Machine Learning Web Service](https://services.azureml.net/) portal.

For more information on adding new endpoints, see [Creating Endpoints](machine-learning-create-endpoint.md).

Keep in mind that using a high concurrency count can be detrimental if you're not calling the API with a correspondingly high rate. You might see sporadic timeouts and/or spikes in the latency if you put a relatively low load on an API configured for high load.

The synchronous APIs are typically used in situations where a low latency is desired. Latency here implies the time it takes for the API to complete one request, and doesn't account for any network delays. Let's say you have an API with a 50-ms latency. To fully consume the available capacity with throttle level High and Max Concurrent Calls = 20, you need to call this API 20 * 1000 / 50 = 400 times per second. Extending this further, a Max Concurrent Calls of 200 allows you to call the API 4000 times per second, assuming a 50-ms latency.

<!--Image references-->
[1]: ./media/machine-learning-scaling-webservice/machlearn-1.png
[2]: ./media/machine-learning-scaling-webservice/machlearn-2.png
