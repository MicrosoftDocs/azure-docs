---
title: Subscription keys - LUIS
titleSuffix: Azure Cognitive Services
description: LUIS uses two keys, the free authoring key to create your model and the metered endpoint key for querying the prediction endpoint with user utterances.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 08/25/2019
ms.author: diberry
---

# Authoring and query prediction endpoint keys in LUIS


Please [migrated]() any apps, which use the older non-Active Directory authentication, before continuing.

LUIS uses two Azure resources, which each have access keys: 

* [Authoring](#programmatic-key) to create intents, entities, and label utterances, train, and publish. When you are ready to publish your LUIS app, you need to [create the query prediction endpoint](luis-how-to-azure-subscription.md) resource if you don't have one, then [assign it](luis-how-to-azure-subscription.md) to your LUIS app.
* [Runtime](#runtime-key-for-query-predictions-of-user-utterances). Client-applications such as a chat bot need access to the runtime's **query prediction endpoint** through this key. 

|Key|Purpose|Cognitive service `kind`|Cognitive service `type`|
|--|--|--|--|
|[Authoring key](#programmatic-key)|Authoring, training, publishing, testing.|`LUIS.Authoring`|`Cognitive Services`|
|[Runtime key](#runtime-key-for-query-predictions-of-user-utterances)| Querying with a user utterance to determine intents and entities.|`LUIS`|`Cognitive Services`|

It is important to author LUIS apps in [regions](luis-reference-regions.md#publishing-regions) where you want to publish and query.

<a name="programmatic-key" ></a>

## Authoring key

An authoring key, also known as a starter key, is created automatically when you create a LUIS account and it is free. You have one authoring key across all your LUIS apps for each authoring [region](luis-reference-regions.md). The authoring key is provided to author your LUIS app or to test endpoint queries. 

To find the authoring Key, sign in to [LUIS](luis-reference-regions.md#luis-website) and click on the account name in the upper-right navigation bar to open **Account Settings**.

![authoring Key](./media/luis-concept-keys/programatic-key.png)

When you want to make **production endpoint queries**, create the Azure [LUIS subscription](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/). 

> [!CAUTION]
> For convenience, many of the samples use the Authoring key since it provides a few endpoint calls in its [quota](luis-boundaries.md#key-limits).  

<a href="endpoint-key"></a>

## Runtime key for query predictions of user utterances

When you need **production endpoint queries**, create an Language Understanding (LUIS) runtime resource then assign it to the LUIS app. 

[!INCLUDE [Azure runtime resource creation for Language Understanding and Cognitive Service resources](../../../includes/cognitive-services-luis-azure-resource-instructions.md)]

When the Azure runtime resource creation process is finished, [assign the key](luis-how-to-azure-subscription.md) to the app. 

* The runtime (query prediction endpoint) key allows a quota of endpoint hits based on the usage plan you specified when creating the runtime key. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information.

* The runtime key can be used for all your LUIS apps or for specific LUIS apps. 

* Do not use the runtime key for authoring LUIS apps. 

<a href="use-endpoint-key-in-query"></a>

## Use runtime key in query
The LUIS endpoint accepts two styles of query, both use the runtime key, but in different places.

The endpoint used to access the runtime uses a subdomain that is unique to your resource's region, denoted with `{region}` in the following table. 


|Verb|Example url and key location|
|--|--|
|[GET](https://{region}.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78)|`https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?runtime-key=your-endpoint-key-here&verbose=true&timezoneOffset=0&q=turn%20on%20the%20lights`<br><br>query string value for `runtime-key`<br><br>Change your endpoint query value for the `runtime-key` from the authoring (starter) key, to the new endpoint key in order to use the LUIS endpoint key quota rate. If you create the key, and assign the key but do not change the endpoint query value for `runtime-key`, you are not using your endpoint key quota.|
|[POST](https://{region}.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee79)| `https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2`<br><br> header value for `Ocp-Apim-Subscription-Key`<br>If you create the runtime key, and assign the runtime key but do not change the endpoint query value for `Ocp-Apim-Subscription-Key`, you are not using your runtime key.|

The app ID used in the previous URLs, `df67dcdb-c37d-46af-88e1-8b97951ca1c2`, is the public IoT app used for the [interactive demonstration](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/). 

## API usage of Ocp-Apim-Subscription-Key

The LUIS APIs use the header, `Ocp-Apim-Subscription-Key`. The header name does not change but the value of the key does. If you are accessing runtime APIs to get a query prediction of a user utterance, use the runtime time. All other APIs use the authoring key.

The API will return a `401` error (access denied) if you using the incorrect key.

## Key limits
See [Key Limits](luis-boundaries.md#key-limits) and [Azure regions](luis-reference-regions.md). The authoring key is free and used for authoring. The LUIS endpoint key has a free tier but must be created by you and associated with your LUIS app on the **Publish** page. It can't be used for authoring, but only endpoint queries.

Publishing regions are different from authoring regions. Make sure you create an app in the authoring region corresponding to the publishing region you want.

## Key limit errors
If you exceed your per second quota, you receive an HTTP 429 error. If you exceed your per month quota, you receive an HTTP 403 error. Fix these errors by getting a LUIS [endpoint](#endpoint-key) key, [assigning](luis-how-to-azure-subscription.md) the key to the app on the **Publish** page of the [LUIS](luis-reference-regions.md#luis-website) website.

## Assignment of the runtime key

You can [assign](luis-how-to-azure-subscription.md) the endpoint key in the [LUIS portal](https://www.luis.ai) or via the corresponding APIs. 


## Next steps

* Learn [concepts](luis-how-to-azure-subscription.md) about authoring and endpoint keys.
