---
title: LUIS frequently asked questions
description: Use this article to see frequently asked questions about LUIS, and troubleshooting information
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 07/19/2022
---

# Language Understanding Frequently Asked Questions (FAQ)

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]



## What are the maximum limits for LUIS application?

LUIS has several limit areas. The first is the model limit, which controls intents, entities, and features in LUIS. The second area is quota limits based on key type. A third area of limits is the keyboard combination for controlling the LUIS website. A fourth area is the world region mapping between the LUIS authoring website and the LUIS endpoint APIs. See [LUIS limits](luis-limits.md) for more details.

## What is the difference between Authoring and Prediction keys?

An authoring resource lets you create, manage, train, test, and publish your applications. A prediction resource lets you query your prediction endpoint beyond the 1,000 requests provided by the authoring resource. See [Authoring and query prediction endpoint keys in LUIS](luis-how-to-azure-subscription.md) to learn about the differences between the authoring key and the prediction runtime key.

## Does LUIS support speech to text?

Yes, [Speech](../speech-service/how-to-recognize-intents-from-speech-csharp.md#luis-and-speech) to text is provided as an integration with LUIS.

## What are Synonyms and word variations?

LUIS has little or no knowledge of the broader _NLP_ aspects, such as semantic similarity, without explicit identification in examples. For example, the following tokens (words) are three different things until they are used in similar contexts in the examples provided:

* Buy
* Buying
* Bought

For semantic similarity Natural Language Understanding (NLU), you can use [Conversation Language Understanding](../language-service/conversational-language-understanding/overview.md)

## What are the Authoring and prediction pricing?
Language Understand has separate resources, one type for authoring, and one type for querying the prediction endpoint, each has their own pricing. See [Resource usage and limits](luis-limits.md#resource-usage-and-limits)

## What are the supported regions?

See [region support](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)

## How does LUIS store data?

LUIS stores data encrypted in an Azure data store corresponding to the region specified by the key. Data used to train the model such as entities, intents, and utterances will be saved in LUIS for the lifetime of the application. If an owner or contributor deletes the app, this data will be deleted with it. If an application hasn't been used in 90 days, it will be deleted.See [Data retention](luis-concept-data-storage.md) to know more details about data storage

## Does LUIS support Customer-Managed Keys (CMK)?

The Language Understanding service automatically encrypts your data when it is persisted to the cloud. The Language Understanding service encryption protects your data and helps you meet your organizational security and compliance commitments. See [the CMK article](encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault) for more details about customer-managed keys.

## Is it important to train the None intent?

Yes, it is good to train your  **None**  intent with utterances, especially as you add more labels to other intents. See [none intent](concepts/intents.md#none-intent) for details.

## How do I edit my LUIS app programmatically?

To edit your LUIS app programmatically, use the [Authoring API](https://go.microsoft.com/fwlink/?linkid=2092087). See [Call LUIS authoring API](get-started-get-model-rest-apis.md) and [Build a LUIS app programmatically using Node.js](luis-tutorial-node-import-utterances-csv.md) for examples of how to call the Authoring API. The Authoring API requires that you use an [authoring key](luis-how-to-azure-subscription.md) rather than an endpoint key. Programmatic authoring allows up to 1,000,000 calls per month and five transactions per second. For more info on the keys you use with LUIS, see [Manage keys](luis-how-to-azure-subscription.md).

## Should variations of an example utterance include punctuation?

Use one of the following solutions:

* Ignore [punctuation](luis-reference-application-settings.md#punctuation-normalization)
* Add the different variations as example utterances to the intent
* Add the pattern of the example utterance with the [syntax to ignore](concepts/utterances.md#utterance-normalization) the punctuation.

## Why is my app is getting different scores every time I train?

Enable or disable the use non-deterministic training option. When disabled, training will use all available data. When enabled (by default), training will use a random sample each time the app is trained, to be used as a negative for the intent. To make sure that you are getting same scores every time, make sure you train your LUIS app with all your data. See the [training article](how-to/train-test.md#change-deterministic-training-settings-using-the-version-settings-api) for more information.

## I received an HTTP 403 error status code. How do I fix it? Can I handle more requests per second?

You get 403 and 429 error status codes when you exceed the transactions per second or transactions per month for your pricing tier. Increase your pricing tier, or use Language Understanding Docker [containers](luis-container-howto.md).

When you use all of the free 1000 endpoint queries or you exceed your pricing tier's monthly transactions quota, you will receive an HTTP 403 error status code.

To fix this error, you need to either [change your pricing tier](luis-how-to-azure-subscription.md#change-the-pricing-tier) to a higher tier or [create a new resource](luis-get-started-create-app.md#sign-in-to-luis-portal) and assign it to your app.

Solutions for this error include:

* In the [Azure portal](https://portal.azure.com/), navigate to your Language Understanding resource, and select **Resource Management ,** then select **Pricing tier** , and change your pricing tier. You don't need to change anything in the Language Understanding portal if your resource is already assigned to your Language Understanding app.
* If your usage exceeds the highest pricing tier, add more Language Understanding resources with a load balancer in front of them. The [Language Understanding container](luis-container-howto.md) with Kubernetes or Docker Compose can help with this.

An HTTP 429 error code is returned when your transactions per second exceed your pricing tier.

Solutions include:

* You can [increase your pricing tier](luis-how-to-azure-subscription.md#change-the-pricing-tier), if you are not at the highest tier.
* If your usage exceeds the highest pricing tier, add more Language Understanding resources with a load balancer in front of them. The [Language Understanding container](luis-container-howto.md) with Kubernetes or Docker Compose can help with this.
* You can gate your client application requests with a [retry policy](/azure/architecture/best-practices/transient-faults#general-guidelines) you implement yourself when you get this status code.

## Why does LUIS add spaces to the query around or in the middle of words?

LUIS [tokenizes](luis-glossary.md#token) the utterance based on the [culture](luis-language-support.md#tokenization). Both the original value and the tokenized value are available for [data extraction](luis-concept-data-extraction.md#tokenized-entity-returned).

## What do I do when I expect LUIS requests to go beyond the quota?

LUIS has a monthly quota and a per-second quota, based on the pricing tier of the Azure resource.

If your LUIS app request rate exceeds the allowed [quota rate](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/), you can:

* Spread the load to more LUIS apps with the [same app definition](how-to/improve-application.md). This includes, optionally, running LUIS from a [container](./luis-container-howto.md).
* Create and [assign multiple keys](how-to/improve-application.md) to the app.

## Can I Use multiple apps with same app definition?

Yes, export the original LUIS app and import the app back into separate apps. Each app has its own app ID. When you publish, instead of using the same key across all apps, create a separate key for each app. Balance the load across all apps so that no single app is overwhelmed. Add [Application Insights](/azure/bot-service/bot-builder-howto-v4-luis) to monitor usage.

To get the same top intent between all the apps, make sure the intent prediction between the first and second intent is wide enough that LUIS is not confused, giving different results between apps for minor variations in utterances.

When training these apps, make sure to [train with all data](how-to/train-test.md).

Designate a single main app. Any utterances that are suggested for review should be added to the main app, then moved back to all the other apps. This is either a full export of the app, or loading the labeled utterances from the main app to the other apps. Loading can be done from either the [LUIS](./luis-reference-regions.md) website or the authoring API for a [single utterance](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08) or for a [batch](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09).

Schedule a periodic review, such as every two weeks, of [endpoint utterances](how-to/improve-application.md) for active learning, then retrain and republish the app.

## How do I download a log of user utterances?

By default, your LUIS app logs utterances from users. To download a log of utterances that users send to your LUIS app, go to  **My Apps** , and select the app. In the contextual toolbar, select  **Export Endpoint Logs**. The log is formatted as a comma-separated value (CSV) file.

## How can I disable the logging of utterances?

You can turn off the logging of user utterances by setting `log=false` in the Endpoint URL that your client application uses to query LUIS. However, turning off logging disables your LUIS app's ability to suggest utterances or improve performance that's based on [active learning](how-to/improve-application.md). If you set `log=false` because of data-privacy concerns, you can't download a record of those user utterances from LUIS or use those utterances to improve your app.

Logging is the only storage of utterances.

## Why don't I want all my endpoint utterances logged?

If you are using your log for prediction analysis, do not capture test utterances in your log.

## What are the supported languages?

See [supported languages](luis-language-support.md), for multilingual NLU, consider using the new [Conversation Language Understanding (CLU)](../language-service/conversational-language-understanding/overview.md) feature of the Language Service. 

## Is Language Understanding (LUIS) available on-premises or in a private cloud?

Yes, you can use the LUIS [container](luis-container-howto.md) for these scenarios if you have the necessary connectivity to meter usage.

## How do I integrate LUIS with Azure AI Bot Services?

Use this [tutorial](/composer/how-to-add-luis) to integrate LUIS app with a Bot
