---
title: How to consume an Azure Machine Learning Web service | Microsoft Docs
description: Once a machine learning service is deployed, the RESTFul Web service that is made available can be consumed either as real-time request-response service or as a batch execution service.
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 804f8211-9437-4982-98e9-ca841b7edf56
ms.service: machine-learning
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 06/02/2017
ms.author: garye

---
# How to consume an Azure Machine Learning Web service

Once you deploy an Azure Machine Learning predictive model as a Web service, you can use a REST API to send it data and get predictions. You can send the data in real-time or in batch mode.

You can find more information about how to create and deploy a Machine Learning Web service using Machine Learning Studio here:

* For a tutorial on how to create an experiment in Machine Learning Studio, see [Create your first experiment](machine-learning-create-experiment.md).
* For details on how to deploy a Web service, see [Deploy a Machine Learning Web service](machine-learning-publish-a-machine-learning-web-service.md).
* For more information about Machine Learning in general, visit the [Machine Learning Documentation Center](https://azure.microsoft.com/documentation/services/machine-learning/).

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Overview
With the Azure Machine Learning Web service, an external application communicates with a Machine Learning workflow scoring model in real time. A Machine Learning Web service call returns prediction results to an external application. To make a Machine Learning Web service call, you pass an API key that is created when you deploy a prediction. The Machine Learning Web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning has two types of services:

* Request-Response Service (RRS) – A low latency, highly scalable service that provides an interface to the stateless models created and deployed from the Machine Learning Studio.
* Batch Execution Service (BES) – An asynchronous service that scores a batch for data records.

For more information about Machine Learning Web services, see [Deploy a Machine Learning Web service](machine-learning-publish-a-machine-learning-web-service.md).

## Get an Azure Machine Learning authorization key
When you deploy your experiment, API keys are generated for the Web service. You can retrieve the keys from several locations.

### From the Microsoft Azure Machine Learning Web Services portal
Sign in to the [Microsoft Azure Machine Learning Web Services](https://services.azureml.net) portal.

To retrieve the API key for a New Machine Learning Web service:

1. In the Azure Machine Learning Web Services portal, click **Web Services** the top menu.
2. Click the Web service for which you want to retrieve the key.
3. On the top menu, click **Consume**.
4. Copy and save the **Primary Key**.

To retrieve the API key for a Classic Machine Learning Web service:

1. In the Azure Machine Learning Web Services portal, click **Classic Web Services** the top menu.
2. Click the Web service with which you are working.
3. Click the endpoint for which you want to retrieve the key.
4. On the top menu, click **Consume**.
5. Copy and save the **Primary Key**.

### Classic Web service
 You can also retrieve a key for a Classic Web service from Machine Learning Studio or the Azure classic portal.

#### Machine Learning Studio
1. In Machine Learning Studio, click **WEB SERVICES** on the left.
2. Click a Web service. The **API key** is on the **DASHBOARD** tab.

#### Azure classic portal
1. Click **MACHINE LEARNING** on the left.
2. Click the workspace in which your Web service is located.
3. Click **WEB SERVICES**.
4. Click a Web service.
5. Click an endpoint. The “API KEY” is down at the lower-right.

## <a id="connect"></a>Connect to a Machine Learning Web service
You can connect to a Machine Learning Web service using any programming language that supports HTTP request and response. You can view examples in C#, Python, and R from a Machine Learning Web service help page.

**Machine Learning API help**
Machine Learning API help is created when you deploy a Web service. See [Azure Machine Learning Walkthrough- Deploy Web Service](machine-learning-walkthrough-5-publish-web-service.md).
The Machine Learning API help contains details about a prediction Web service.

1. Click the Web service with which you are working.
2. Click the endpoint for which you want to view the API Help Page.
3. On the top menu, click **Consume**.
4. Click **API help page** under either the Request-Response or Batch Execution endpoints.

**To view Machine Learning API help for a New Web service**

In the Azure Machine Learning Web Services Portal:

1. Click **WEB SERVICES** on the top menu.
2. Click the Web service for which you want to retrieve the key.

Click **Consume** to get the URIs for the Request-Reposonse and Batch Execution Services and Sample code in C#, R, and Python.

Click **Swagger API** to get Swagger based documentation for the APIs called from the supplied URIs.

### C# Sample
To connect to a Machine Learning Web service, use an **HttpClient** passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional vector of numerical features that represents the ScoreData. You authenticate to the Machine Learning service with an API key.

To connect to a Machine Learning Web service, the **Microsoft.AspNet.WebApi.Client** NuGet package must be installed.

**Install Microsoft.AspNet.WebApi.Client NuGet in Visual Studio**

1. Publish the Download dataset from UCI: Adult 2 class dataset Web Service.
2. Click **Tools** > **NuGet Package Manager** > **Package Manager Console**.
3. Choose **Install-Package Microsoft.AspNet.WebApi.Client**.

**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Machine Learning sample collection.
2. Assign apiKey with the key from a Web service. See **Get an Azure Machine Learning authorization key** above.
3. Assign serviceUri with the Request URI.

### Python Sample
To connect to a Machine Learning Web service, use the **urllib2** library passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Machine Learning service with an API key.

**To run the code sample**

1. Deploy "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Machine Learning sample collection.
2. Assign apiKey with the key from a Web service. See the **Get an Azure Machine Learning authorization key** section near the beginning of this article.
3. Assign serviceUri with the Request URI.

