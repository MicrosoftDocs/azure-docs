<properties 
	pageTitle="Common operations in the Machine Learning Recommendations API | Azure" 
	description="Azure ML Recommendation Sample Application" 
	services="machine-learning" 
	documentationCenter="" 
	authors="jaymathe" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/15/2015" 
	ms.author="luiscabrer"/> 


# Common operations in the Machine Learning Recommendations API

##Purpose

This document shows the usage of the Azure Machine Learning Recommendations API via a [sample application](http://1drv.ms/1xeO2F3).

This application is not intended to include full functionality, nor does it use all the APIs. It demonstrates some common operations to perform when you first want to play with the Machine Learning recommendation service. 

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

##Introduction to Machine Learning recommendation service

Recommendations via the Machine Learning recommendation service are enabled when you build a recommendation model based on the following data:

* A repository of the items you want to recommend, also known as a catalog
* Data representing the usage of items per user or session (this can be acquired over time via data acquisition, not as part of the sample app)

After a recommendation model is built, you can use it to predict items that a user might be interested in, according to a set of items (or a single item) the user selects.

To enable the previous scenario, do the following in the Machine Learning recommendation service:

* Create a model: This is a logical container that holds the data (catalog and usage) and the prediction model(s). Each model container is identified via a unique ID, which is allocated when it is created. This ID is called the model ID, and it is used by most of the APIs. 
* Upload to catalog: When a model container is created, you can associate to it a catalog.

**Note**: Creating a model and uploading to a catalog are usually performed once for the model lifecycle.

* Upload usage: This adds usage data to the model container.
* Build a recommendation model: After you have enough data, you can build the recommendation model. This operation uses the top Machine Learning algorithms to create a recommendation model. Each build is associated with a unique ID. You need to keep a record of this ID because it is necessary for the functionality of some APIs.
* Monitor the building process: A recommendation model build is an asynchronous operation, and it can take from several minutes to several hours, depending on the amount of data (catalog and usage) and the build parameters. Therefore, you need to monitor the build. A recommendation model is created only if its associated build completes successfully.
* (Optional) Choose an active recommendation model build: This step is only necessary if you have more than one recommendation model built in your model container. Any request to get recommendations without indicating the active recommendation model is redirected automatically by the system to the default active build. 

**Note**: An active recommendation model is production ready and it is built for production workload. This differs from a non-active recommendation model, which stays in a test-like environment (sometimes called staging).

* Get recommendations: After you have a recommendation model, you can trigger recommendations for a single item or a list of items that you select. 

You will usually invoke Get Recommendation for a certain period of time. During that period of time, you can redirect usage data to the Machine Learning recommendation system, which adds this data to the specified model container. When you have enough usage data, you can build a new recommendation model that incorporates the additional usage data. 

##Prerequisites

* Visual Studio 2013
* Internet access 

##Azure Machine Learning sample app solution

This solution contains the source code, sample usage, catalog file, and directives to download the packages that are required for compilation.

##The APIs used

The application uses Machine Learning recommendation functionality via a subset of available APIs. The following APIs are demonstrated in the application:

* Create model: Create a logical container to hold data and recommendation models. A model is identified by a name, and you  cannot create more than one model with the same name.
* Upload catalog file: Use to upload catalog data.
* Upload usage file: Use to upload usage data.
* Trigger build: Use to create a recommendation model.
* Monitor build execution: Use to monitor the status of a recommendation model build.
* Choose a built model for recommendation: Use to indicate which recommendation model to use by default for a certain model container. This step is necessary only if you have more than one recommendation model and you want to activate a non-active build as the active recommendation model.
* Get recommendation: Use to retrieve recommended items according to a given single item or a set of items. 

For a complete description of the APIs, please see the Microsoft Azure Marketplace documentation. 

**Note**: A model can have several builds over time (not simultaneously). Each build is created with the same or an updated catalog and additional usage data.

## Common pitfalls

* You need to provide your user name and your Microsoft Azure Marketplace primary account key to run the sample app.
* Running the sample app consecutively will fail. The application flow includes creating, uploading, building the monitor, and getting recommendations from a predefined model; therefore, it will fail on consecutive execution if you do not change the model name between invocations.
* Recommendations might return without data. The sample app uses a very small catalog and usage file. Therefore, some items from the catalog will have no recommended items.

## Disclaimer
The sample app is not intended to be run in a production environment. The data provided in the catalog is very small, and it will not provide a meaningful recommendation model. The data is provided as a demonstration. 
