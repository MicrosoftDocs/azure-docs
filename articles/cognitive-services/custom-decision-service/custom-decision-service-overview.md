---
title: Microsoft Azure Custom Decision Service overview | Microsoft Docs
description: This article overviews Microsoft Custom Decision Service, a cloud-based API for contextual decision-making that sharpens with experience.
services: cognitive-services
author: alekh
manager: slivkins@microsoft.com

ms.service: cognitive-services
ms.topic: article
ms.date: 05/02/2017
ms.author: alekha
---

# Custom Decision Service

Microsoft Custom Decision Service helps you create intelligent systems with a cloud-based *contextual decision-making API* that sharpens with experience. Custom Decision Service harnesses the power of **reinforcement learning** and adapts the content in your application to maximize the overall engagement of users. The system incorporates user feedback into its decisions in *real time* and responds to emergent trends and breaking stories in minutes.

In a typical application, there is a front page with links to several articles or other types of content. As the front page loads, it requests the Custom Decision Service to provide a ranking of articles to include on the page. When the user clicks on an article, a second request is sent to the Custom Decision Service to log the outcome of our decision.

Custom Decision Service is easy to use. The easiest integration mode requires just an RSS feed for your content and a few lines of javascript to be added into your application.

Custom Decision Service converts your content into features for machine learning by using [Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services). These features allow the system to understand your content in terms of its text, images, videos, and overall sentiment.

Some common use cases for the Custom Decision Service include:

* Personalizing articles on a news website.
* Personalizing video content on a media portal.
* Optimizing ad placements or web pages that the ad directs to.
* Ranking recommended items on a shopping website.

Applications not in the content personalization domain could still benefit from Custom Decision Service. Such applications might be a good fit for a custom preview. Contact us to learn more.

Currently, we offer two modes of using the Custom Decision Service, which follow next. Regardless of which scenario you use, the APIs are identical.

- Simple scenario: global models for *low-traffic applications*.
- Advanced scenario: application-specific models for *high-traffic applications*.

## Simple scenario

Custom Decision Service learns from the click patterns of the users in response to the content presented in your application. Hence, learning can be tricky if your application has relatively low traffic. This problem is pronounced for dynamic content such as news. In such applications, the system has relatively little time to learn the quality of an article and apply this learning before new content arrives. If your application has sufficient traffic to learn rapidly enough, Custom Decision Service will get good results. However, for *low-traffic applications with dynamic content*, the recommended usage mode is for you to subscribe into a global model.

For all the applications that sign up for this mode, we learn a single model to customize content across all of them by pooling their data. Your **privacy** is respected as the raw data is never shared with any individual application, but only the decisions made by the system. This mode allows you to promote a breaking news story if users on other websites are interested in it, before anyone has read it on your website.

## Advanced scenario

For applications with sufficient traffic, the global model might not be ideal as the user preferences on your content are also merged with their preferences in other applications. When your data volume permits, we recommend you opt for the advanced scenario. For this version, you are required to specify an [Azure storage account key](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account), in addition to all the information required for the simple scenario.

In this usage mode, Custom Decision Service creates a deployment of the *entire learning pipeline for your application*. Hence, the learning is done only based on your user interaction with your content. The data collected by the system is also logged to your Azure account based on the key provided. You can access this data offline and derive further insights from it regarding user preferences.

## Glossary of terms

Finally, there are a few terms that will keep coming up as you read this documentation, which we introduce next.

* *Action Sets*: The set of content items for the Custom Decision Service to rank. This set can be specified as an *RSS* or *Atom* endpoint.
* *Ranking*: Each request to the Custom Decision Service specifies one or more action sets. The system responds by picking all the content options from these sets, and returns a ranked order of them.
* *Callback function*: This function, which you specify which renders the content in your UI. The content is ordered by the rank ordering returned by the Custom Decision Service.
* *Reward*: A measure of how the user responded to the rendered content. Custom Decision Service measures user response using clicks, and the clicks are reported to our system using custom code inserted in your application.

## Next steps:

1. Get started with Custom Decision Service [using browser API calls](custom-decision-service-get-started-browser.md) or [using server-side API calls](custom-decision-service-get-started-server.md).
2. Consult [API reference](custom-decision-service-api-reference.md) to learn more about the provided functionality.