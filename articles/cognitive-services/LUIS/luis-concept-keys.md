---
title: Understand your LUIS keys - Azure | Microsoft Docs
description: Use Language Understanding (LUIS) keys to author your app and query your endpoing.
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/23/2018
ms.author: v-geberr;
---

# Keys in LUIS
A key allows you to author and publish your LUIS app, or query your endpoint. LUIS has two different types of keys: [authoring](#programmatic-key) and [endpoint](#endpoint-key) keys. 

|Key|Purpose|
|--|--|
|[Authoring key](#programmatic-key)|Authoring|
|[Endpoint key](#endpoint-key)| Querying|

It is important to author LUIS apps in [regions](luis-reference-regions.md#publishing-regions) where you also want to publish and query.

<a name="programmatic-key" ></a>
## Authoring key

An authoring key, also known as a starter key, is created automatically when you create a LUIS account and it is free. You have one authoring key across all your LUIS apps for each authoring [region](luis-reference-regions.md). The authoring key is provided to author your LUIS app or to test endpoint queries. 

To find the authoring Key, log in to [LUIS][LUIS] and click on the account name in the upper-right navigation bar to open **Account Settings**.

![authoring Key](./media/luis-concept-keys/programatic-key.png)

When you want to make **production endpoint queries**, create an Azure [LUIS subscription](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/). 

> [!CAUTION]
> For convenience, many of the samples use the Authoring key since it provides a few endpoint calls in its [quota](luis-boundaries.md#key-limits).  

## Endpoint Key
 When you need **production endpoint queries**, create an [Azure LUIS key](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/). This key allows a quota of endpoint hits based on the usage plan you specified when creating the key. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information.

An endpoint key is directly tied to an Azure LUIS subscription key. The endpoint key can be used for all your LUIS apps or for specific LUIS apps. When you publish each LUIS app, you set the endpoint key. Part of this process is choosing the Azure LUIS subscription.  

Do not use the endpoint key for authoring LUIS apps.

## Use endpoint key in query
Change your endpoint query value for the `Ocp-Apim-Subscription-Key` from the authoring (starter) key, to the new endpoint key in order to use the LUIS endpoint key quota rate. If you create the key, and assign the key but do not change the endpoint query value for `Ocp-Apim-Subscription-Key`, you are not using your endpoint key quota.

## API usage of Ocp-Apim-Subscription-Key
The LUIS APIs use the header, `Ocp-Apim-Subscription-Key`, in both the [authoring](https://aka.ms/luis-authoring-apis) and [endpoint](https://aka.ms/luis-endpoint-apis) APIs. The header name does not change based on which set of APIs you are using. 

Use the authoring key for authoring APIs. You can't pass the endpoint key for authoring APIs. If you do, you get a 401 error - access denied due to invalid subscription key. 

## Key limits
See [Key Limits](luis-boundaries.md#key-limits) and [Azure Regions](luis-reference-regions.md). The authoring key is free and used for authoring. The LUIS subscription key has a free tier but must be created by you and associated with your LUIS app on the **Publish** page. It can't be used for authoring, but only endpoint queries.

Publishing regions are different from authoring regions. Make sure you create an app in the authoring region corresponding to the publishing region you want.

## Key limit errors
If you exceed your per second quota, you receive an HTTP 429 error. If you exceed your per month quota, you receive an HTTP 403 error. Fix these errors by getting a LUIS [endpoint](#endpoint-key) key, [assigning](#assign-endpoint-key) the key to the app on the **Publish** page of the [LUIS][LUIS] website.

## Next steps

* [Add](Manage-Keys.md#assign-endpoint-key) an endpoint key.

[LUIS]:luis-reference-regions.md#luis-website