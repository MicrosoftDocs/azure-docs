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
   ms.date="10/27/2015"
   ms.author="neerajkh"/>

# Scaling web service

## Increase concurrency

By default, each published web service is configured to support 20 concurrent requests. You can increase this concurrency to 200 concurrent requests through [Azure Management Portal](https://manage.windowsazure.com/) as shown in the figure below.

Go to [Azure Management Portal](https://manage.windowsazure.com/), click the Machine Learning icon on the left, select the work space used for publishing web service, click the desired web service, select the endpoint that needs the increase in concurrency, and then click **CONFIGURE**. Use the slider to increase the concurrency, and then click **SAVE** on the bottom panel.

To increase the concurrency, see [Scaling API Endpoints](machine-learning-scaling-endpoints.md).

   ![Machine Learning, scaling endpoints.][1]

## Add new endpoints for same web service

The scaling of web service is a common task either to support more than 200 concurrent request, increase availability through multiple endpoints or to provide separate endpoint for different consumer of web service. The user can increase the scale by adding additional endpoints for the same web service. The user can add additional endpoints through [Azure Management Portal](https://manage.windowsazure.com/) as shown in the figure below:

Go to [Azure Management Portal](https://manage.windowsazure.com/), click the Machine Learning icon on the left, select the work space used for publishing the web service, click the desired web service, click **ADD ENDPOINT** on the bottom panel, and then provide a name, description, and desired concurrency for the new endpoint.

To add new endpoints, see [Creating Endpoints](machine-learning-create-endpoint.md).

   ![Machine Learning, add new endpoints.][2]

<!--Image references-->
[1]: ./media/machine-learning-scaling-webservice/machlearn-1.png
[2]: ./media/machine-learning-scaling-webservice/machlearn-2.png