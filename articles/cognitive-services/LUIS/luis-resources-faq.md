---
title: Language Understanding Intelligent Services (LUIS) in Azure frequently asked questions | Microsoft Docs
titleSuffix: Azure
description: Get answers to frequently asked questions about Language Understanding Intelligent Services (LUIS)
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr
---
# Language Understanding FAQ

This article contains answers to frequently asked questions about Language Understanding (LUIS).

## How do I interpret LUIS scores? 
Your system should use the highest scoring intent regardless of its value. For example, a score below 0.5 (less than 50%) does not necessarily mean that LUIS has low confidence. Providing more training data can help increase the score of the most-likely intent.

## What is the maximum number of intents and entities that a LUIS app can support?
See the [boundaries](luis-boundaries.md) reference.

## I want to build a LUIS app with more than the maximum number of intents. What should I do?

See [Best practices for intents](luis-concept-best-practices.md#if-you-need-more-than-the-maximum-number-of-intents).

## I want to build an app in LUIS with more than the maximum number of entities. What should I do?

See [Best practices for entities](luis-concept-best-practices.md#if-you-need-more-than-the-maximum-number-of-entities)

## What are the limits on the number and size of phrase lists?
For the maximum length of a [phrase list](./luis-concept-feature.md), see the [boundaries](luis-boundaries.md) reference.

## What are the limits on example utterances?
See the [boundaries](luis-boundaries.md) reference.

## What is the best way to start building my app in LUIS?

The best way to build your app is through an [incremental process](luis-concept-app-iteration.md). 

## What is a good practice to model the intents of my app? Should I create more specific or more generic intents?

Choose intents that are not so general as to be overlapping, but not so specific that it makes it difficult for LUIS to distinguish between similar intents. Creating discriminative specific intents is one of the best practices for LUIS modeling.

## Is it important to train the None intent?

Yes, it is good to train your **None** intent with more utterances as you add more labels to other intents. A good ratio is 1 or 2 labels added to **None** for every 10 labels added to an intent. This ratio boosts the discriminative power of LUIS.

## How can I deal with spelling mistakes in utterances?

See the [Bing Spell Check API V7](luis-tutorial-bing-spellcheck.md) tutorial. LUIS enforces limits imposed by Bing Spell Check API V7. 

## I see some errors in the batch testing pane for some of the models in my app. How can I address this problem?

The errors indicate that there is some discrepancy between your labels and the predictions from your models. To address the problem, do one or both of the following tasks:
* To help LUIS improve discrimination among intents, add more labels.
* To help LUIS learn faster, add phrase-list features that introduce domain-specific vocabulary.

See the [Batch testing](luis-tutorial-batch-testing.md) tutorial.

## Why don't I see my endpoint hits in my app's Dashboard?
The total endpoint hits in your app's Dashboard are updated periodically, but the metrics associated with your LUIS Subscription key in the Azure portal are updated more frequently. If you don't see updated endpoint hits in the Dashboard, log in to the Azure portal, and find the resource associated with your LUIS subscription key, and open **Metrics** to select the **Total Calls** metric. If the subscription key is used for more than one LUIS app, the metric in the Azure portal shows the aggregate number of calls from all LUIS apps that use it.

## How do I transfer ownership of a LUIS app?
To transfer a LUIS app to a different Azure subscription, export the LUIS app and import it using a new account. Update the LUIS app ID in the client application that calls it. The new app may return slightly different LUIS scores from the original app. 

## I have an app in one language and want to create a parallel app in another language. What is the easiest way to do so?
1. Export your app.
2. Translate the labeled utterances in the JSON file of the exported app to the target language.
3. You might need to change the names of the intents and entities or leave them as they are.
4. Finally, import the app to have a LUIS app in the target language.

## How do I download a log of user utterances?
By default, your LUIS app logs utterances from users. To download a log of utterances that users send to your LUIS app, go to **My Apps**, and click on the ellipsis (***...***) in the listing for your app. Then click **Export Endpoint Logs**. The log is formatted as a comma-separated value (CSV) file.

## How can I disable the logging of utterances?
You can turn off the logging of user utterances by setting `log=false` in the Endpoint URL that your client application uses to query LUIS. However, turning off logging disables your LUIS app's ability to suggest utterances or improve performance that's based on user queries. If you set `log=false` because of data-privacy concerns, you won't be able to download a record of those user utterances from LUIS or use those utterances to improve your app.

## Why don't I want all my endpoint utterances logged?
If you are using your log for prediction analysis, do not capture test utterances in your log. 

## Can I delete data from LUIS? 

* You can always delete example utterances used for training LUIS. If you delete an example utterance from your LUIS app, it is removed from the LUIS web service and is unavailable for export.
* You can delete utterances from the list of user utterances that LUIS suggests in the **Review endpoint utterances** page. Deleting utterances from this list prevents them from being suggested, but doesn't delete them from logs.
* If you delete an account, all apps are deleted, along with their example utterances and logs. The data is retained on the servers for 60 days before it is deleted permanently.

## How do I edit my LUIS app programmatically?
To edit your LUIS app programmatically, use the [Authoring API](https://aka.ms/luis-authoring-apis). See [Call LUIS authoring API](./luis-quickstart-node-add-utterance.md) and [Build a LUIS app programmatically using Node.js](./luis-tutorial-node-import-utterances-csv.md) for examples of how to call the Authoring API. The Authoring API requires that you use an [authoring key](luis-concept-keys.md#authoring-key) rather than an endpoint key. Programmatic authoring allows up to 1,000,000 calls per month and five transactions per second. For more info on the keys you use with LUIS, see [Manage keys](./luis-concept-keys.md).

## What is the tenant ID in the "Add a key to your app" window?
In Azure, a tenant represents the client or organization that's associated with a service. Find your tenant ID in the Azure portal in the **Directory ID** box by selecting **Azure Active Directory** > **Manage** > **Properties**.

![Tenant ID in the Azure portal](./media/luis-manage-keys/luis-assign-key-tenant-id.png)

## Why did I get an email saying I'm almost out of quota?
Your authoring/starter key is only allowed 1000 endpoint queries a month. Create a LUIS subscription key (free or paid) and use that key when making endpoint queries. If you are making endpoint queries from a bot or another client application, you need to change the LUIS endpoint key there. 

## Where is the Pattern feature that provides regular expression matching?
The Pattern feature is currently deprecated. Pattern features in LUIS are provided by [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text). If you have a regular expression you need, or a culture in which a regular expression is not provided, contribute to the Recognizers-Text project. 

## Why are there more subscription keys on my app's publish page than I assigned to the app? 
Each LUIS app has the authoring/starter key. LUIS subscription keys created during the GA time frame are visible on your publish page, regardless if you added them to the app. This was done to make GA migration easier. Any new LUIS subscription keys do not appear on the publish page. 

## How do I secure my LUIS endpoint? 
See [Securing the endpoint](luis-concept-security.md#securing-the-endpoint).

## Where is my LUIS app created during the Azure web app bot subscription process?
If you select a LUIS template, and select the **Select** button in the template pane, the left-side pane changes to include the template type, and asks in what region to create the LUIS template. The web app bot process doesn't create a LUIS subscription though.

![LUIS template web app bot region](./media/luis-faq/web-app-bot-location.png)

## How do I use an entity to pull out the correct data? 
Review conceptual material for [entities](luis-concept-entity-types.md) and [utterances](luis-concept-utterance.md).

Example apps illustrating specific data extraction are: 
|App|Data Extracted|
|--|--|
|[MyCommunicator quickstart](luis-quickstart-primary-and-secondary-data.md)|[Message] entity<br>`Text boss [I'll be late to meeting]`

## Is LUIS available on-premise or in private cloud?
No. 

## What are the LUIS best practices? 
Start with the [Authoring Cycle](luis-concept-app-iteration.md), then read the [best practices](luis-concept-best-practices.md). 

## My LUIS app was working yesterday but today I'm getting 403 errors. I didn't change the app. How do I fix it? 
Following the [instructions](#how-do-i-create-and-assign-a-luis-endpoint-key) in the next FAQ to create a LUIS endpoint key and assign it to the app. Then you must change the HTTP request to the endpoint to [use the new endpoint key](luis-concept-keys.md#use-endpoint-key-in-query).

## How do I create and assign a LUIS endpoint key?
[Create the endpoint key](azureibizasubscription.md#create-luis-endpoint-key) in Azure for your [service](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/) level. [Assign the key](Manage-keys.md#assign-endpoint-key) on the **[Publish](publishapp.md)** page. There is no corresponding API for this action. Then you must change the HTTP request to the endpoint to [use the new endpoint key](luis-concept-keys.md#use-endpoint-key-in-query).

## What LUIS regions support Bot Framework speech priming?
[Speech priming](https://docs.microsoft.com/bot-framework/bot-service-manage-speech-priming) is only supported for LUIS apps in the central (US) instance. 

## Why does LUIS add spaces to the query around or in the middle of words?
LUIS [tokenizes](luis-glossary.md#token) the utterance based on the [culture](luis-supported-languages.md#tokenization). Both the original value and the tokenized value are available for [data extraction](luis-concept-data-extraction.md#tokenized-entity-returned).  

## Why do I keep getting "Your sign in has expired" error?
 
See [Website sign in time period](luis-boundaries.md#website-sign-in-time-period).

## Where did the tutorials go? 
The articles that were previously in the Tutorial section are now in the How-to section of the documents. 

|Tutorial|
|--|
|Integrate LUIS with a bot with [C#](luis-csharp-tutorial-build-bot-framework-sample.md) and [Node.js](luis-nodejs-tutorial-build-bot-framework-sample.md)|
|Add Application Insights to a Bot with [C#](luis-tutorial-bot-csharp-appinsights.md) and [Node.js](luis-tutorial-function-appinsights.md)|
|Build a LUIS app programmatically using [Node.js](luis-tutorial-node-import-utterances-csv.md)|
|Use [composite entity](luis-tutorial-composite-entity.md) to extract grouped data|
|Add [list entity](luis-tutorial-list-entity.md) for increased entity detection using Node.js|
|Improve prediction accuracy with a [phrase list](luis-tutorial-interchangeable-phrase-list.md), [patterns](luis-tutorial-pattern.md), and [batch testing](luis-tutorial-batch-testing.md)|
|[Correct spelling](luis-tutorial-batch-testing.md) with Bing Spell Check API v7

Does LUIS have any certificates or ISO conformance for security or GDPR? 

See [Security Compliance](luis-concept-security.md#security-compliance) for ISO and CSA STAR conformance. See [GDPR](luis-reference-gdpr.md) regarding General Data Protection Regulation information.

## Next steps

To learn more about LUIS, see the following resources:
* [Stack Overflow questions tagged with LUIS](https://stackoverflow.com/questions/tagged/luis)
* [MSDN Language Understanding Intelligent Services (LUIS) Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=LUIS) 

[LUIS]:luis-reference-regions.md#luis-website
