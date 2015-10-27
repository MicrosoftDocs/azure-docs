<properties
   pageTitle="Scaling Web Services | Microsoft Azure"
   description="This article describes on how to "
   services="machine-learning"
   documentationCenter=""
   authors="neerajkh"
   manager="srikants"
   editor="cgronlun"
   keywords="azure machine learning, web services, operationalization, scaling, endpoint, concurrency"
   />
<tags
   ms.service="machine-learning"
   ms.workload="data-services"
	 ms.tgt_pltfrm="na"
   ms.topic="article"
   ms.date="10/24/2015"
   ms.author="neerajkh"/>

# Scaling Web Service #
## Increase Concurrency ##
By default, each published web service is configured to support 20 concurrent request. The user can increase this concurrency to 200 concurrent request through [Azure Management Portal](https://manage.windowsazure.com/) as shown in the figure below:



Go to [Azure Management Portal](https://manage.windowsazure.com/), click Machine Learning icon on the left, select the work space used for publishing web service, click desired web service, select the endpoint that needs increase in concurrency,  click configure. Use slider to increase the concurrency and then click save on the bottom panel.

The detailed steps to increase the concurrency is provided [here](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-scaling-endpoints/)


![](http://neerajkh.blob.core.windows.net/images/ConfigureEndpointCapture.png)

## Add new endpoints for same web service ##
The scaling of web service is a common task either to support more than 200 concurrent request, increase availability through multiple endpoints or to provide separate endpoint for different consumer of web service. The user can increase the scale by adding additional endpoints for the same web service. The user can add additional endpoints through [Azure Management Portal](https://manage.windowsazure.com/) as shown in the figure below:


Go to [Azure Management Portal](https://manage.windowsazure.com/), click Machine Learning icon on the left, select the work space used for publishing web service, click desired web service, click "Add Endpoint" on the bottom panel, and finally, provide a name, description and desired concurrency for the new endpoint.

The detailed steps to add new endpoints is provided [here](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-endpoint/)

![](http://neerajkh.blob.core.windows.net/images/AddEndpoint.png)
