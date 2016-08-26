<properties
	pageTitle="Step 6: Access the Machine Learning web service | Microsoft Azure"
	description="Step 6 of the Develop a predictive solution walkthrough: Access an active Azure Machine Learning web service."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/10/2016"
	ms.author="garye"/>


# Walkthrough Step 6: Access the Azure Machine Learning web service

This is the last step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)


1.	[Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2.	[Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3.	[Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4.	[Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5.	[Deploy the web service](machine-learning-walkthrough-5-publish-web-service.md)
6.	**Access the web service**

----------

In the previous step in this walkthrough we deployed a web service that uses our credit risk prediction model. 
Now users need to be able to send data to it and receive results. 

The web service is an Azure web service that can receive and return data using REST APIs in one of two ways:  

-	**Request/Response** - The user sends one or more rows of credit data to the service by using an HTTP protocol, and the service responds with one or more sets of results.
-	**Batch Execution** - The user stores one or more rows of credit data in an Azure blob and then sends the blob location to the service. The service scores all the rows of data in the input blob, stores the results in another blob, and returns the URL of that container.  

The quickest and easiest way to access the web service is through the Web App Templates available in the [Azure Web App Marketplace](https://azure.microsoft.com/marketplace/web-applications/all/).
These web app templates can build a custom web app that knows your web service's input data and what it will return. All you need to do is provide access to your web service and data, and the template does the rest.

For more information on using the web app templates, see [Consume an Azure Machine Learning web service with a web app template](machine-learning-consume-web-service-with-web-app-template.md).

You can also develop a custom application to access the web service using starter code provided for you in R, C#, and Python programming languages.
You can find complete details in [How to consume an Azure Machine Learning web service that has been published from a Machine Learning experiment](machine-learning-consume-web-services.md).
