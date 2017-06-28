---
title: 'Step 6: Access the Machine Learning Web service | Microsoft Docs'
description: 'Step 6 of the Develop a predictive solution walkthrough: Access an active Azure Machine Learning Web service.'
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 6a65c89a-40ab-4673-8dd8-8eee0a150e3b
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2017
ms.author: garye

---
# Walkthrough Step 6: Access the Azure Machine Learning web service

This is the last step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md)

1. [Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2. [Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3. [Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4. [Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5. [Deploy the Web service](machine-learning-walkthrough-5-publish-web-service.md)
6. **Access the Web service**

- - -
In the previous step in this walkthrough we deployed a web service that uses our credit risk prediction model. 
Now users are able to send data to it and receive results. 

The Web service is an Azure web service that can receive and return data using REST APIs in one of two ways:  

* **Request/Response** - The user sends one or more rows of credit data to the service by using an HTTP protocol, and the service responds with one or more sets of results.
* **Batch Execution** - The user stores one or more rows of credit data in an Azure blob and then sends the blob location to the service. The service scores all the rows of data in the input blob, stores the results in another blob, and returns the URL of that container.  

The quickest and easiest way to access a Classic web service is through the [Azure ML Request-Response Service Web App](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlaspnettemplateforrrs/) or [Azure ML Batch Execution Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlbeswebapptemplate/).

These web app templates can build a custom web app that knows your web service's input data and what it will return. All you need to do is provide access to your web service and data, and the template does the rest.

For more information on using the web app templates, see [Consume an Azure Machine Learning Web service with a web app template](machine-learning-consume-web-service-with-web-app-template.md).

You can also develop a custom application to access the web service using starter code provided for you in R, C#, and Python programming languages.

You can find complete details in [How to consume an Azure Machine Learning Web service](machine-learning-consume-web-services.md).

