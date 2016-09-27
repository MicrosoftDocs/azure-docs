<properties
   pageTitle="Scaling web service | Microsoft Azure"
   description="Learn how to scale a web service by increasing concurrency and adding new endpoints."
   services="machine-learning"
   documentationCenter=""
   authors="neerajkh"
   manager="srikants"
   editor="cgronlun"
   keywords="azure machine learning, web services, operationalization, scaling, endpoint, concurrency"
   />
<tags
   ms.service="machine-learning"
   ms.devlang="NA"
   ms.workload="data-services"
   ms.tgt_pltfrm="na"
   ms.topic="article"
   ms.date="07/06/2016"
   ms.author="neerajkh"/>

# Scaling a web service

>[AZURE.NOTE] This topic describes techniques applicable to a classic web service. 

By default, each published web service is configured to support 20 concurrent requests and can be as high as 200 concurrent requests. While the Azure Classic Portal provides a way to set this value, Azure Machine Learning automatically optimizes this setting to provide the best performance for your web service and the portal value is ignored. 

If you plan to call the API with a higher load than what a Max Concurrent Calls value of 200 will support, then you should create multiple endpoints on the same web service and randomly distribute your load across all of them.

## Add new endpoints for same web service

The scaling of a web service is a common task either to support more than 200 concurrent request, increase availability through multiple endpoints or to provide separate endpoint for different consumer of web service. You can increase the scale by adding additional endpoints for the same web service through [Azure Classic Portal](https://manage.windowsazure.com/) as shown in the figure below:

Keep in mind that using a very high concurrency count can be detrimental if you're not hitting the API with a correspondingly high rate. You might see sporadic timeouts and/or spikes in the latency if you put a relatively low load on an API configured for high load.

The synchronous APIs are typically used in situations where a low latency is desired. Latency here implies the time it takes for the API to complete one request, and doesn't account for any network delays. Let's say you have an API with a 50 ms latency. To fully consume the available capacity with throttle level High and Max Concurrent Calls = 20, you need to call this API 20 * 1000 / 50 = 400 times per second. Extending this further, a Max Concurrent Calls of 200 will allow you to call the API 4000 times per second, assuming a 50 ms latency.

Go to [Azure Classic Portal](https://manage.windowsazure.com/), click the Machine Learning icon on the left, select the work space used for publishing the web service, click the desired web service, click **ADD ENDPOINT** on the bottom panel, and then provide a name, description, and desired concurrency for the new endpoint.

To add new endpoints, see [Creating Endpoints](machine-learning-create-endpoint.md).

<!--Image references-->
[1]: ./media/machine-learning-scaling-webservice/machlearn-1.png
[2]: ./media/machine-learning-scaling-webservice/machlearn-2.png
