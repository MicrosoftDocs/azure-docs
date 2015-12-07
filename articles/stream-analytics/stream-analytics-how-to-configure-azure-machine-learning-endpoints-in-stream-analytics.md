<properties 
	pageTitle="How to configure Azure Machine Learning endpoints in Stream Analytics | Microsoft Azure" 
	description="Machine Language User defined functions in Stream Analytics"
	keywords=""
	documentationCenter=""
	services="stream-analytics"
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="12/07/2015" 
	ms.author="jeffstok"
/>

# Introduction: Machine Learning user defined function capabilities in Stream Analytics

Stream Analytics provides support for user defined functions that call out to Azure Machine Learning endpoints. REST API support for this feature is detailed in the Stream Analytics REST API library. This article provides supplemental information needed for successful implementation of this capability in Stream Analytics.

## Overview: Azure Machine Learning terminology

Microsoft Azure Machine Learning provides a collaborative, drag-and-drop tool you can use to build, test, and deploy predictive analytics solutions on your data. This tool is called the *Azure Machine Learning Studio*. The studio will be utilized to interact with the Machine Learning resources and easily build, test and iterate on your design. These resources and their definitions are below.

- **Workspace**: The *workspace* is a container that holds all other Machine Learning resources together in a container for management and control.
- **Experiment**: *Experiments* are created by data scientists to utilize datasets and train a machine learning model.
- **Endpoint**: *Endpoints* are the Azure Machine Learning object used to apply the experiment to input and return output. 
- **Scoring Webservice**: A *scoring webservice* is utilized to apply a trained experiment to one or more endpoints.

Each endpoint has apis for batch execution and synchronous execution. Stream Analytics uses synchronous execution exclusively. The specific service is named a [Request/Response Service](./articles/machine-learning-consume-web-services/#request-response-service-rrs "Azure Machine Learning request-response service") in AzureML studio.

## AzureML resources that are needed for Stream Analytics jobs

For the purposes of Stream Analytics job processing, a Request/Response endpoint, an [apikey](./articles/machine-learning-connect-to-azure-machine-learning-web-service/#get-an-azure-machine-learning-authorization-key "Azure Machine Learning API Key") and a swagger definition are all necessary for successful execution. Stream Analytics has an additional endpoint that constructs the url for swagger endpoint, looks up the interface and returns a default UDF definition to the user.

## Configuring a Stream Analytics job with Azure Machine Learning functions via the REST API

By using REST APIs you may configure your job to call Azure Machine Language functions. The steps are as follows:

1. Create a Stream Analytics job
2. Define an input
3. Define an output
4. Create a user defined function (UDF)
5. Write a Stream Analytics transformation that calls the UDF
6. Start the job


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)