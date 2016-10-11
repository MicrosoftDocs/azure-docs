<properties
	pageTitle="Retrain a Machine Learning Model | Microsoft Azure"
	description="Learn how to retrain a model and update the Web service to use the newly trained model in Azure Machine Learning."
	services="machine-learning"
	documentationCenter=""
	authors="vDonGlover"
	manager="raymondl"
	editor=""/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/10/2016"
	ms.author="v-donglo"/>

# Retrain a Machine Learning Model

As part of the process of operationalization of machine learning models in Azure Machine Learning, your model is trained and saved. You then use it to create a predicative Web service. The Web service can then be consumed in web sites, dashboards, and mobile apps. 

Models you create using Machine Learning are typically not static. As new data becomes available or when the consumer of the API has their own data the model needs to be retrained. 

Retraining may occur frequently. With the Programmatic Retraining API feature, you can programmatically retrain the model using the Retraining APIs and update the Web service with the newly trained model. 

This document describes the retraining process, and shows you how to use the Retraining APIs.

## Why retrain: defining the problem  

As part of the machine learning training process, a model is trained using a set of data. Models you create using Machine Learning are typically not static. As new data becomes available or when the consumer of the API has their own data the model needs to be retrained.

In these scenarios, a programmatic API provides a convenient way to allow you or the consumer of your APIs to create a client that can, on a one-time or regular basis, retrain the model using their own data. They can then evaluate the results of retraining, and update the Web service API to use the newly trained model.

>[AZURE.NOTE] If you have an existing Training Experiment and New Web service, you may want to check out Retrain an existing Predictive Web service instead of following the walkthrough mentioned in the following section.

## End-to-end workflow 

The process involves the following components: A Training Experiment and a Predictive Experiment published as a Web service. To enable retraining of a trained model, the Training Experiment must be published as a Web service with the output of a trained model. This enables API access to the model for retraining. 

The following steps apply to both New and Classic Web services:

Create the initial Predictive Web service:

* Create a training experiment
* Create a predictive web experiment
* Deploy a predictive web service

Retrain the Web service:

* Update training experiment to allow for retraining
* Deploy the retraining web service
* Grab Batch Execution Service code and retrain the model

For a walkthrough of the preceding steps, see [Retrain Machine Learning models programmatically](machine-learning-retrain-models-programmatically.md).

If you deployed a Classic Web Service:

* Create a new Endpoint on the Predictive Web service
* Get the PATCH URL and code
* Use the PATCH URL to point the new Endpoint at the retrained model 

For a walkthrough of the preceding steps, see [Retrain a Classic Web service](machine-learning-retrain-a-classic-web-service.md).

If you run into difficulties retraining a Classic Web service, see [Troubleshooting the retraining of an Azure Machine Learning Classic Web service](machine-learning-troubleshooting-retraining-models.md).


if you deployed a New Web service:

* Sign in to your Azure Resource Manager account
* Get the Web service definition
* Export the Web Service Definition as JSON
* Update the reference to the ilearner blob in the JSON
* Import the JSON into a Web Service Definition
* Update the Web service with new Web Service Definition

For a walkthrough of the preceding steps, see [Retrain a New Web service using the Machine Learning Management PowerShell cmdlets](machine-learning-retrain-new-web-service-using-powershell.md).

The process for setting up retraining for a Classic Web service involves the following steps:

![Retraining process overview][1]

Diagram 1: Retraining process for a Classic Web service overview 

The process for setting up retraining for a New Web service involves the following steps:

![Retraining process overview][7]

Diagram 2: Retraining process for a New Web service overview  


## Other Resources

[Retraining and Updating Azure Machine Learning models with Azure Data Factory](https://azure.microsoft.com/blog/retraining-and-updating-azure-machine-learning-models-with-azure-data-factory/)

<!--Retrain a New Web service with PowerShell video-->



<!--image links-->


[1]: ./media/machine-learning-retrain-machine-learning-model/machine-learning-retrain-models-programmatically-IMAGE01.png
[7]: ./media/machine-learning-retrain-machine-learning-model/machine-learning-retrain-models-programmatically-IMAGE07.png

