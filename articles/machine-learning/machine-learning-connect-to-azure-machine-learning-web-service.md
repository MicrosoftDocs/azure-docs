<properties
	pageTitle="Connect to a Machine Learning Web Service | Microsoft Azure"
	description="With C# or Python, connect to an Azure Machine Learning web service using an authorization key."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun" />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/09/2015" 
	ms.author="derrickv" />


# Connect to an Azure Machine Learning Web Service
The Azure Machine Learning developer experience is a web service API to make predictions from input data in real time or in batch mode. You use the Azure Machine Learning Studio to create predictions and deploy an Azure Machine Learning web service.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

To learn about how to create and deploy an Azure Machine Learning web service using Studio:

- [Deploy a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md)
- [Getting Started with ML Studio](http://azure.microsoft.com/documentation/videos/getting-started-with-ml-studio/)
- [Azure Machine Learning Preview](https://studio.azureml.net/)
- [Machine Learning Documentation Center](http://azure.microsoft.com/documentation/services/machine-learning/)

## Azure Machine Learning web service ##

With the Azure Machine Learning (ML) web service, an external application communicates with an ML workflow scoring model in real time. An ML web service call returns prediction results to an external application. To make an ML web service call, you pass an API key which is created when you deploy a prediction. The ML web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning has two types of services:

- Request-Response Service (RRS) – A low latency, highly scalable service that provides an interface to the stateless models created and deployed from the ML Studio.
- Batch Execution Service (BES) – An asynchronous service that scores a batch for data records.

For more information about Azure Machine Learning web services, see [Deploy a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).

## Get an Azure Machine Learning authorization key ##
You get a web service API key from an ML web service. You can get it from Microsoft Azure Machine Learning studio or the Azure Management Portal.
### Microsoft Azure Machine Learning studio ###
1. In Microsoft Azure Machine Learning studio, click **WEB SERVICES** on the left.
2. Click a web service. The “API key” is on the **DASHBOARD** tab.

### Azure Management Portal ###

1. Click **MACHINE LEARNING** on the left.
2. Click a workspace.
3. Click **WEB SERVICES**.
4. Click a web service.
5. Click an endpoint. The “API KEY” is down at the lower-right.

## <a id="connect"></a>Connect to an Azure Machine Learning web service

You can connect to an Azure Machine Learning web service using any programming language that supports HTTP request and response. You can view examples in C#, Python, and R from an Azure ML web service help page.

### To view an Azure ML Web Service API help page ###
An Azure ML API help page is created when you deploy a web service. See [Azure Machine Learning Walkthrough- Deploy Web Service](machine-learning-walkthrough-5-publish-web-service.md).


**To view an Azure ML API help page**
In Microsoft Azure Machine Learning Studio:

1. Choose **WEB SERVICES**.
2. Choose a web service.
3. Choose **API help page** - **REQUEST/RESPONSE** or **BATCH EXECUTION**.


**Azure ML API help page**
The Azure ML API help page contains details about a prediction web service.



### C# Sample ###

To connect to an Azure ML web service, use an **HttpClient** passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Azure ML service with an API key.

To connect to an ML web service, the **Microsoft.AspNet.WebApi.Client** Nuget package must be installed.

**Install Microsoft.AspNet.WebApi.Client Nuget in Visual Studio**

1. Publish the Download dataset from UCI: Adult 2 class dataset Web Service.
2. Click **Tools** > **Nuget Package Manager** > **Package Manager Console**.
2. Choose **Install-Package Microsoft.AspNet.WebApi.Client**.

**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Azure ML sample collection.
2. Assign apiKey with the key from a web service. See How to get an Azure ML authorization key.
3. Assign serviceUri with the Request URI.


### Python Sample ###

To connect to an Azure ML web service, use the **urllib2** library passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Azure ML service with an API key.


**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Azure ML sample collection.
2. Assign apiKey with the key from a web service. See How to get an Azure ML authorization key.
3. Assign serviceUri with the Request URI. See How to get a Request URI.
