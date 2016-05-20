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
	ms.date="05/02/2016" 
	ms.author="garye" />


# Connect to an Azure Machine Learning Web Service
The Azure Machine Learning developer experience is a web service API to make predictions from input data in real time or in batch mode. You use Azure Machine Learning Studio to create predictions and deploy an Azure Machine Learning web service.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

To learn about how to create and deploy a Machine Learning web service using Machine Learning Studio:

- For a tutorial on how to create an experiment in Machine Learning Studio, see [Create your first experiment](machine-learning-create-experiment.md).
- For details on how to deploy a web service, see [Deploy a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).
- For more information about Machine Learning in general, visit the [Machine Learning Documentation Center](https://azure.microsoft.com/documentation/services/machine-learning/).

## Azure Machine Learning web service ##

With the Azure Machine Learning web service, an external application communicates with a Machine Learning workflow scoring model in real time. A Machine Learning web service call returns prediction results to an external application. To make a Machine Learning web service call, you pass an API key which is created when you deploy a prediction. The Machine Learning web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning has two types of services:

- Request-Response Service (RRS) – A low latency, highly scalable service that provides an interface to the stateless models created and deployed from the Machine Learning Studio.
- Batch Execution Service (BES) – An asynchronous service that scores a batch for data records.

For more information about Machine Learning web services, see [Deploy a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).

## Get an Azure Machine Learning authorization key ##
You get a web service API key from a Machine Learning web service. You can get it from Machine Learning Studio or the Azure portal.
### Machine Learning Studio ###
1. In Machine Learning Studio, click **WEB SERVICES** on the left.
2. Click a web service. The “API key” is on the **DASHBOARD** tab.

### Azure portal ###

1. Click **MACHINE LEARNING** on the left.
2. Click a workspace.
3. Click **WEB SERVICES**.
4. Click a web service.
5. Click an endpoint. The “API KEY” is down at the lower-right.

## <a id="connect"></a>Connect to a Machine Learning web service

You can connect to a Machine Learning web service using any programming language that supports HTTP request and response. You can view examples in C#, Python, and R from a Machine Learning web service help page.

### To view a Machine Learning Web Service API help page ###
A Machine Learning API help page is created when you deploy a web service. See [Azure Machine Learning Walkthrough- Deploy Web Service](machine-learning-walkthrough-5-publish-web-service.md).


**To view a Machine Learning API help page**
In Machine Learning Studio:

1. Choose **WEB SERVICES**.
2. Choose a web service.
3. Choose **API help page** - **REQUEST/RESPONSE** or **BATCH EXECUTION**.


**Machine Learning API help page**
The Machine Learning API help page contains details about a prediction web service.



### C# Sample ###

To connect to a Machine Learning web service, use an **HttpClient** passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Machine Learning service with an API key.

To connect to a Machine Learning web service, the **Microsoft.AspNet.WebApi.Client** Nuget package must be installed.

**Install Microsoft.AspNet.WebApi.Client Nuget in Visual Studio**

1. Publish the Download dataset from UCI: Adult 2 class dataset Web Service.
2. Click **Tools** > **Nuget Package Manager** > **Package Manager Console**.
2. Choose **Install-Package Microsoft.AspNet.WebApi.Client**.

**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Machine Learning sample collection.
2. Assign apiKey with the key from a web service. See **Get an Azure Machine Learning authorization key** above.
3. Assign serviceUri with the Request URI.


### Python Sample ###

To connect to a Machine Learning web service, use the **urllib2** library passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Machine Learning service with an API key.


**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Machine Learning sample collection.
2. Assign apiKey with the key from a web service. See **Get an Azure Machine Learning authorization key** above.
3. Assign serviceUri with the Request URI. See How to get a Request URI.
