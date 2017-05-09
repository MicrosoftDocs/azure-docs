---
title: Bing Custom Search Overview | Microsoft Docs
description: Explains key steps to create a custom search service
services: cognitive-services
author: TobiasHassmann
manager: carolz

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 05/09/2017
ms.author: tobih
---

# Create a custom search in four simple steps

You can build a custom search engine in four simple steps.


## Sign-up to get your free trial Azure subscription key
Signing up to Bing Custom Search requires you to have a Microsoft Account.
After you have successfully completed the sign-up, you have been automatically granted a free trial Azure subscription key. 
You can start now to configure your custom search service.

[!NOTE]
It is free to sign up to Bing Custom Search. The usage is capped to certain quota. The pricing overview provides detailed information on the available quota for Bing Custom Search Free Preview. 


## Build your custom search in the Bing Custom Search Portal
You can build your custom search service in the Custom Search Portal.

[!NOTE]
Bing Custom Search portal supports these browsers:

* Microsoft Edge - Desktop
* Google Chrome - Desktop

You can build as many different search services as you want. Technically, a search scenario is referred to as **custom search instance**. Before you publish a custom search instance, you should:
	
1. Define the sites that you want to search over.
2. Apply, and adjust based on your needs the Bing ranker for your selected sites.

Bing Custom Search supports unlimited search application scenarios. The two most common scenarios are:
* Building a site search
* Building a topical search

### Site search
To build a site search service with Bing Custom Search, you can use the following features:
* Let your users search across all your websites.
* Pin top results to ensure sites that are important for your or your business are shown on top.
* Adjust and control ranking based on your needs.

### Vertical search
To build a vertical search service, you can:
* Design a custom search targeting hundreds of sites and webpages on a topic.
* Deploy the search and use it on internal or external web applications.


## Publish your custom search
Once you decide that your custom search instance meets your needs, you can publish it. Publishing means: you are given a Bing Web Search API endpoint that you can call programmatically. To retrieve results from the Bing Web Search API, you need to specify your Azure subscription key for Bing Custom Search, along with a custom configuration parameter.


## Integrate your search into an endpoint application
Finally, you want to show your customized search in your endpoint of choice. For example, you can provide your search experience in an external website, an internal web application, or in a mobile app. You can choose any endpoint as long as it is able to consume and render JSON files.

[!NOTE]
Read the [Bing Web Search API Use and Display requirements](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/useanddisplayrequirements) to understand how to display the retrieved results.

## Next Steps
1. Create a custom search instance
2. Control the ranking of a custom search instance
3. Publish a custom search instance
