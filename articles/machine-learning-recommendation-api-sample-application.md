<properties title="Common operations in the Machine Learning Recommendations API" pageTitle="Common operations in the Machine Learning Recommendations API | Azure" description="Azure ML Recommendation Sample Application" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="jaymathe" manager="paulettm" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/14/2014" ms.author="jaymathe" /> 


# Common operations in the Machine Learning Recommendations API

##Purpose

This document shows the usage of some of the Azure ML recommendation API, via a sample application.

This application is not intended to include full functionality or use all the APIs, but just demonstrate some of the common operations to perform when you first want to play with the Azure ML recommendation service. 

##Introduction to Recommendation

Recommendation via Azure ML recommendation service are enabled when you build a recommendation model based on the following data:

* A repository of the item you want to recommend a.k.a. a catalog
* Data representing the usage of items per user/session (this can be acquire over time via data acquisition, not part of the sample app)

Once a recommendation model is built you can use it to predict items to a user according to a set of items (can be a single item) he selects.

In order to allow the scenario above you will do the following operation on Azure ML recommendation service:

* Create a model – this is a logical container that will holds the data (catalog and usage) and the prediction model(s), each model container is identified via a unique id allocated at its creation time, this id called model id, is used by most of the API 
* Upload catalog – once a model container is created you can associate to it a catalog

Note: The above steps (‘create model’ and ‘upload catalog’) are usually performed once for the model lifecycle.

* Upload usage – to add usage data to the model container.
* Build recommendation model – once you have enough data you will trigger Recommendation model build. This operation will use top of the art machine learning algorithms to create a recommendation model. Each build is associated with a unique id, you will need to keep this id since it is necessary to the functionality of some API.
* Monitor building process - a recommendation model build is an asynchronous operation and can take from several minutes to several hours depending on the amount of data (catalog and usage) and build parameters. Therefore you will need to monitor the build. A recommendation model is built only if its associated build ends successfully.
* (Optional) Chose an active recommendation model build, this step is only necessary if you have more than one recommendation model built in your model container. Any request to get recommendation without indicating the active build (active recommendation model) will be redirected automatically by the system to the default active build. 

Note: An active build (recommendation model) is production ready and is built for production workload by opposite to a non-active recommendation model which stay in a test like environment (sometimes called staging)

* Get Recommendation – once you have a recommendation model you can trigger recommendation for a single or a list of item you pick. 

You will usually invoke Get Recommendation for a certain period of time, in the meantime you can redirect usage data back to the Azure ML recommendation system which will add this usage to the model specified container. Once you have enough usage data you can trigger a new recommendation model build to use the more actual data. 

##Prerequisites

* Visual studio 2013
* Internet access 

##Azure ML sample app solution

The solution contains the source code, sample usage and catalog file and directives to download the nuget packages required for compilation.

##The API used

The application use only a small subset of the Azure ML recommendation functionality via a subset of the available API. The following APIs are demonstrated in the application:

* Create Model – create the logical container to holds data and recommendation models. A model is identified by a name, a user cannot create twice a model with the same name.
* Upload catalog file – to upload catalog data
* Upload usage file – to upload usage data
* Trigger build – to create a recommendation model
* Monitor build execution – monitor the status of a recommendation model build
* Choose a built model for recommendation – to indicate which recommendation model to use by default for a certain model container. This step is necessary only if you have more than one recommendation model and you want to a non-active build as active build.
* Get recommendation – To retrieve recommended item according to a given single or set of item. 

For a complete description of the API please check Microsoft Azure Marketplace documentation. 

Note: A model can have several builds over time (not simultaneously) each build was created with same or updated catalog, and additional usage data.

## Common pitfalls

* You need to provide your username and your Microsoft Azure Marketplace primary account key as a command line to run the sample
* Running the sample app consecutively will fail - the application flow handle creation, upload, build monitor and get recommendation of a predefined model name, therefore it will fail on consecutive execution if you do not change the model name between invocation
* Recommendation might return without data – the sample app use a very small catalog and usage file therefore the created recommendation model is not meaningful as a result some item from the catalog will have no recommended items.

## Disclaimer
The sample app is not intended to be run for production, the data provided in the catalog and usage is very small and will not provide a meaningful recommendation model, but are just provided as demonstration. 

## Legal
This document is provided “as-is”. Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. 
Some examples depicted herein are provided for illustration only and are fictitious. No real association or connection is intended or should be inferred. 
This document does not provide you with any legal rights to any intellectual property in any Microsoft product. You may copy and use this document for your internal, reference purposes. 
© 2014 Microsoft. All rights reserved. 

