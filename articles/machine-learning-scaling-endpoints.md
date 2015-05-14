<properties 
	pageTitle="Scaling API Endpoints" 
	description="Scaling web service endpoints in Azure Machine Learning" 
	services="machine-learning" 
	authors="hiteshmadan" 
	manager="padou" 
	editor=""/>

<tags
	ms.service="machine-learning"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="tbd" 
	ms.date="02/19/2015"
	ms.author="himad"/>


# Scaling API Endpoints

Web service endpoints in Azure Machine Learning have selectable throttle levels to match the rate at which the endpoint will be consumed.

There are two factors which control the amount of throttling done on an endpoint
- Throttle Level: Low or High. Only paying customers are allowed to set throttle level to High
- Max Concurrent Calls : 4 for throttle level Low; 20-200 for throttle level High


The synchronous APIs are typically used in situations where a low latency is desired. Latency here implies the time it takes for the API to complete one request, and doesn't account for any network delays. Let's say you have an API with a 50ms latency. To fully consume the available capacity with throttle level High and Max Concurrent Calls = 20, you need to call this API 20 * 1000 / 50 = 400 times per second. Extending this further, a Max Concurrent Calls of 200 will allow you to call the API 4000 times per second, assuming a 50ms latency.

If you plan to call the API with a higher load than what Max Concurrent Calls of 200 will support, then you should create multiple endpoints on the same web service and randomly distribute your load across all of them.

Keep in mind that using a very high concurrency count can be detrimental if you're not hitting the API with a correspondingly high rate. You might see sporadic timeouts and/or spikes in the latency if you put a relatively low load on an API configured for high load.

Note that tweaking throttle settings only influences the behavior of the Synchronous API. You should tweak these settings if you see frequent 503 Service Unavailable responses on the Synchronous API.

The management UI allows toggling the throttle level. To have a custom concurrency number to go with Throttle Level High, please use the Patch Endpoint API.

- Open up manage.windowsazure.com
- Navigate to the Machine Learning tab
- Click on your workspace.
- Navigate to the web service which has your endpoint
![Navigate to web service](./media/machine-learning-scaling-endpoints/figure-1.png)

- Click on the endpoint, and then click on the Configure tab
![Navigate to endpoint configuration](./media/machine-learning-scaling-endpoints/figure-2.png)


- Change the throttle level to High and click on Save.


