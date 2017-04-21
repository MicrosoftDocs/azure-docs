---
title: Migrate to Azure Cognitive Services Recommendations API from the DataMarket Recommendations API| Microsoft Docs
description: Azure machine learning recommendations-- migrating to recommendations cognitive service
services: cognitive-services
documentationcenter: ''
author: luiscabrer
manager: jhubbard
editor: cgronlun

ms.assetid: ec9cc302-fef5-4b68-8f9b-fa73538d0424
ms.service: cognitive-services
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/01/2016
ms.author: luisca

---
# Migrate to Azure Cognitive Services Recommendations API from the DataMarket Recommendations API
This article shows you how to migrate from the [Microsoft DataMarket Recommendations API](https://datamarket.azure.com/dataset/amla/recommendations) 
to the [Microsoft Azure Cognitive Services Recommendations API](https://www.microsoft.com/cognitive-services/en-us/recommendations-api).

The DataMarket Recommendations API will stop accepting new customers December 31, 2016, and will be deprecated February 28, 2017.

## How do I start using the Azure Cognitive Services Recommendations API?
To migrate to the Cognitive Services Recommendations API, do the following:

1. If you don’t already have an Azure subscription, [sign up](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Recommendations/pricingtier/S1) for one. 
2. Get step-by-step instructions from the [Quick Start Guide](cognitive-services-recommendations-quick-start.md) to sign up for the Cognitive Services Recommendations API and use it programmatically. 
3. Go to the [Cognitive Services Recommendations API landing page](https://www.microsoft.com/cognitive-services/en-us/recommendations-api) to learn about the service and find documentation.

## I used the Recommendations UI to build my models. Is there a similar tool for the Cognitive Services Recommendations API?
Absolutely! The URL for the new [Recommendations UI](http://recommendations-portal.azurewebsites.net/) is http://recommendations-portal.azurewebsites.net. 

> [!NOTE]
> Your DataMarket credentials don’t work here. Sign up for a subscription in the Azure Portal, 
> and get the Account Key needed to use the new [Recommendations UI](http://recommendations-portal.azurewebsites.net/).
> If you don’t have an Account Key, see Task 1 of the [Quick Start Guide](cognitive-services-recommendations-quick-start.md).
> 
> 

## Is the new API format the same as the DataMarket Recommendations API?
The API supports the same scenarios and process flows as those scenarios supported in the DataMarket version, but the
actual API interface has been updated to conform to the [Microsoft REST API Guidelines](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md). 
The APIs are more consistent and work better with tools that support Swagger.

To understand each of the APIs, check out the [API explorer](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3db).
Use the *Try* it button to test an API call. The format of files consumed by the Recommendations API (catalog and
usage files) has not changed, so you can keep using the same files and/or infrastructure you have built to generate those files.

## What are some new features in the Cognitive Services Recommendations API?
Over the last two months, we have released new capabilities for the Cognitive Services Recommendations API:

* Recommendations UI for training and testing models without having to write a single line of code
* Batch scoring to provide you thousands of recommendations at once
* Build metrics support to query the quality of recommendations models
* Support for business rules
* Ability to enumerate and download usage and catalog files
* Ranking build support to query the quality of item features in a recommendations model
* Added ability to search for a product in the catalog

## When does Microsoft stop supporting the DataMarket Recommendations API?
[Recommendations API on DataMarket](https://datamarket.azure.com/dataset/amla/recommendations) stops accepting new customers after December 31, 2016, and will be completely deprecated by February 28, 2017. 

## What if I don’t have the data that I need to recreate my models in the Cognitive Services Recommendations API?
We want to make this transition as easy as possible for you. We can help you move your old models from your DataMarket account to your new Azure Cognitive Services Recommendations API subscription. 
Contact us at [mlapi@microsoft.com](mailto://mlapi@microsoft.com). We will ask you to provide your DataMarket subscription ID and your Cognitive Services subscription ID, before we associate the models with your new account.

