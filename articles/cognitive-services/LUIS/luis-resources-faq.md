---
title: FAQ - Frequently asked questions - Language Understanding (LUIS)
titleSuffix: Azure Cognitive Services
description: This article contains answers to frequently asked questions about Language Understanding (LUIS).
author: diberry
manager: cgronlun
services: cognitive-services
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 10/10/2018
ms.author: diberry
---
# Language Understanding FAQ

This article contains answers to frequently asked questions about Language Understanding (LUIS).

## LUIS authoring

### What are the LUIS best practices?
Start with the [Authoring Cycle](luis-concept-app-iteration.md), then read the [best practices](luis-concept-best-practices.md).

### What is the best way to start building my app in LUIS?

The best way to build your app is through an [incremental process](luis-concept-app-iteration.md).

### What is a good practice to model the intents of my app? Should I create more specific or more generic intents?

Choose intents that are not so general as to be overlapping, but not so specific that it makes it difficult for LUIS to distinguish between similar intents. Creating discriminative specific intents is one of the best practices for LUIS modeling.

### Is it important to train the None intent?

Yes, it is good to train your **None** intent with more utterances as you add more labels to other intents. A good ratio is 1 or 2 labels added to **None** for every 10 labels added to an intent. This ratio boosts the discriminative power of LUIS.

### How can I correct spelling mistakes in utterances?

See the [Bing Spell Check API V7](luis-tutorial-bing-spellcheck.md) tutorial. LUIS enforces limits imposed by Bing Spell Check API V7.

### How do I edit my LUIS app programmatically?
To edit your LUIS app programmatically, use the [Authoring API](https://aka.ms/luis-authoring-apis). See [Call LUIS authoring API](./luis-quickstart-node-add-utterance.md) and [Build a LUIS app programmatically using Node.js](./luis-tutorial-node-import-utterances-csv.md) for examples of how to call the Authoring API. The Authoring API requires that you use an [authoring key](luis-concept-keys.md#authoring-key) rather than an endpoint key. Programmatic authoring allows up to 1,000,000 calls per month and five transactions per second. For more info on the keys you use with LUIS, see [Manage keys](./luis-concept-keys.md).

### Where is the Pattern feature that provided regular expression matching?
The previous **Pattern feature** is currently deprecated, replaced by **[Patterns](luis-concept-patterns.md)**.

### How do I use an entity to pull out the correct data?
See [entities](luis-concept-entity-types.md) and [data extraction](luis-concept-data-extraction.md).

### Should variations of an example utterance include punctuation?
Either add the different variations as example utterances to the intent or add the pattern of the example utterance with the [syntax to ignore](luis-concept-patterns.md#pattern-syntax) the punctuation.

### Does LUIS currently support Cortana?

Cortana prebuilt apps were deprecated in 2017. They are no longer supported.

## LUIS endpoint

### Why does LUIS add spaces to the query around or in the middle of words?
LUIS [tokenizes](luis-glossary.md#token) the utterance based on the [culture](luis-language-support.md#tokenization). Both the original value and the tokenized value are available for [data extraction](luis-concept-data-extraction.md#tokenized-entity-returned).

### How do I create and assign a LUIS endpoint key?
[Create the endpoint key](luis-how-to-azure-subscription.md#create-luis-endpoint-key) in Azure for your [service](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/) level. [Assign the key](luis-how-to-manage-keys.md#assign-endpoint-key) on the **[Keys and endpoints](luis-how-to-manage-keys.md)** page. There is no corresponding API for this action. Then you must change the HTTP request to the endpoint to [use the new endpoint key](luis-concept-keys.md#use-endpoint-key-in-query).

### How do I interpret LUIS scores?
Your system should use the highest scoring intent regardless of its value. For example, a score below 0.5 (less than 50%) does not necessarily mean that LUIS has low confidence. Providing more training data can help increase the score of the most-likely intent.

### Why don't I see my endpoint hits in my app's Dashboard?
The total endpoint hits in your app's Dashboard are updated periodically, but the metrics associated with your LUIS endpoint key in the Azure portal are updated more frequently.

If you don't see updated endpoint hits in the Dashboard, log in to the Azure portal, and find the resource associated with your LUIS endpoint key, and open **Metrics** to select the **Total Calls** metric. If the endpoint key is used for more than one LUIS app, the metric in the Azure portal shows the aggregate number of calls from all LUIS apps that use it.

### My LUIS app was working yesterday but today I'm getting 403 errors. I didn't change the app. How do I fix it?
Following the [instructions](#how-do-i-create-and-assign-a-luis-endpoint-key) in the next FAQ to create a LUIS endpoint key and assign it to the app. Then you must change the HTTP request to the endpoint to [use the new endpoint key](luis-concept-keys.md#use-endpoint-key-in-query).

### How do I secure my LUIS endpoint?
See [Securing the endpoint](luis-concept-security.md#securing-the-endpoint).

## Working within LUIS limits

### What is the maximum number of intents and entities that a LUIS app can support?
See the [boundaries](luis-boundaries.md) reference.

### I want to build a LUIS app with more than the maximum number of intents. What should I do?

See [Best practices for intents](luis-concept-intent.md#if-you-need-more-than-the-maximum-number-of-intents).

### I want to build an app in LUIS with more than the maximum number of entities. What should I do?

See [Best practices for entities](luis-concept-entity-types.md#if-you-need-more-than-the-maximum-number-of-entities)

### What are the limits on the number and size of phrase lists?
For the maximum length of a [phrase list](./luis-concept-feature.md), see the [boundaries](luis-boundaries.md) reference.

### What are the limits on example utterances?
See the [boundaries](luis-boundaries.md) reference.

## Testing and training

### I see some errors in the batch testing pane for some of the models in my app. How can I address this problem?

The errors indicate that there is some discrepancy between your labels and the predictions from your models. To address the problem, do one or both of the following tasks:
* To help LUIS improve discrimination among intents, add more labels.
* To help LUIS learn faster, add phrase-list features that introduce domain-specific vocabulary.

See the [Batch testing](luis-tutorial-batch-testing.md) tutorial.

### When an app is exported then reimported into a new app (with a new app ID), the LUIS prediction scores are different. Why does this happen?

See [Prediction differences between copies of same app](luis-concept-prediction-score.md#differences-with-predictions).

### Some utterances go to the wrong intent after I made changes to my app. The issue seems to disappear at random. How do I fix it? 

See [Train with all data](luis-how-to-train.md#train-with-all-data).

## App publishing

### What is the tenant ID in the "Add a key to your app" window?
In Azure, a tenant represents the client or organization that is associated with a service. Find your tenant ID in the Azure portal in the **Directory ID** box by selecting **Azure Active Directory** > **Manage** > **Properties**.

![Tenant ID in the Azure portal](./media/luis-manage-keys/luis-assign-key-tenant-id.png)

<a name="why-are-there-more-subscription-keys-on-my-apps-publish-page-than-i-assigned-to-the-app"></a>
<a name="why-are-there-more-endpoint-keys-on-my-apps-publish-page-than-i-assigned-to-the-app"></a>


### Why are there more endpoint keys assigned to my app than I assigned?
Each LUIS app has the authoring/starter key in the endpoint list as a convenience. This key allows only a few endpoint hits so you can try out LUIS.  

If your app existed before LUIS was generally available (GA), LUIS endpoint keys in your subscription are assigned automatically. This was done to make GA migration easier. Any new LUIS endpoint keys in the Azure portal are _not_ automatically assigned to LUIS.

## App management

### How do I transfer ownership of a LUIS app?
To transfer a LUIS app to a different Azure subscription, export the LUIS app and import it using a new account. Update the LUIS app ID in the client application that calls it. The new app may return slightly different LUIS scores from the original app.

### How do I download a log of user utterances?
By default, your LUIS app logs utterances from users. To download a log of utterances that users send to your LUIS app, go to **My Apps**, and select the app. In the contextual toolbar, select **Export Endpoint Logs**. The log is formatted as a comma-separated value (CSV) file.

### How can I disable the logging of utterances?
You can turn off the logging of user utterances by setting `log=false` in the Endpoint URL that your client application uses to query LUIS. However, turning off logging disables your LUIS app's ability to suggest utterances or improve performance that's based on [active learning](luis-concept-review-endpoint-utterances.md#what-is-active-learning). If you set `log=false` because of data-privacy concerns, you can't download a record of those user utterances from LUIS or use those utterances to improve your app.

Logging is the only storage of utterances.

### Why don't I want all my endpoint utterances logged?
If you are using your log for prediction analysis, do not capture test utterances in your log.

## Data management

### Can I delete data from LUIS?

* You can always delete example utterances used for training LUIS. If you delete an example utterance from your LUIS app, it is removed from the LUIS web service and is unavailable for export.
* You can delete utterances from the list of user utterances that LUIS suggests in the **Review endpoint utterances** page. Deleting utterances from this list prevents them from being suggested, but doesn't delete them from logs.
* If you delete an account, all apps are deleted, along with their example utterances and logs. The data is retained on the servers for 60 days before it is deleted permanently.

### Does Microsoft access my LUIS app data for its own purposes, for example, to enhance LUIS or Microsoft in general?

No. The LUIS app’s data model is not used by LUIS to enhance LUIS as a platform or used by Microsoft in any way. Each app’s data is separate and owned only by the user and collaborators.

Learn more about [user privacy](luis-user-privacy.md), [additional security compliance](luis-concept-security.md#security-compliance), and [data storage](luis-concept-data-storage.md).

## Language and translation support

### I have an app in one language and want to create a parallel app in another language. What is the easiest way to do so?
1. Export your app.
2. Translate the labeled utterances in the JSON file of the exported app to the target language.
3. You might need to change the names of the intents and entities or leave them as they are.
4. Finally, import the app to have a LUIS app in the target language.

## App notification

### Why did I get an email saying I'm almost out of quota?
Your authoring/starter key is only allowed 1000 endpoint queries a month. Create a LUIS endpoint key (free or paid) and use that key when making endpoint queries. If you are making endpoint queries from a bot or another client application, you need to change the LUIS endpoint key there.

## Integrating LUIS

### Where is my LUIS app created during the Azure web app bot subscription process?
If you select a LUIS template, and select the **Select** button in the template pane, the left-side pane changes to include the template type, and asks in what region to create the LUIS template. The web app bot process doesn't create a LUIS subscription though.

![LUIS template web app bot region](./media/luis-faq/web-app-bot-location.png)

### What LUIS regions support Bot Framework speech priming?
[Speech priming](https://docs.microsoft.com/bot-framework/bot-service-manage-speech-priming) is only supported for LUIS apps in the central (US) instance.

## LUIS service

### Is LUIS available on-premises or in private cloud?
No.


### At the Build 2018 Conference, I heard about a Language Understanding feature or demo but I don't remember what it was called?

The following features were released at the Build 2018 Conference:

|Name|Content|
|--|--|
|Enhancements|[Regular expression](luis-concept-data-extraction.md##regular-expression-entity-data) entity and [Key phrase](luis-concept-data-extraction.md#key-phrase-extraction-entity-data) entity
|Patterns|Patterns [concept](luis-concept-patterns.md), [tutorial](luis-tutorial-pattern.md), [how-to](luis-how-to-model-intent-pattern.md)<br>[Patterns.Any](luis-concept-entity-types.md) entity concept including [Explicit list](luis-concept-patterns.md#explicit-lists) for exceptions<br>[Roles](luis-concept-roles.md) concept|
|Integrations|[Text analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/) integration of [sentiment analysis](luis-how-to-publish-app.md#enable-sentiment-analysis)<br>[Speech](https://docs.microsoft.com/azure/cognitive-services/speech) integration of speech priming in conjunction with [Speech SDK](https://aka.ms/SpeechSDK)|
|Dispatch tool|Part of [BotBuilder-tools](https://github.com/Microsoft/botbuilder-tools), Dispatch command line [tool](luis-concept-enterprise.md#when-you-need-to-combine-several-luis-and-qna-maker-apps) to combine multiple LUIS and QnA Maker apps into single LUIS app for better intent recognition in a Bot

Additional authoring [API routes](https://github.com/Microsoft/LUIS-Samples/blob/master/authoring-routes.md) were included.

Videos:
* [Azure Friday At Build 2018: Cognitive Services - Language (LUIS)](https://channel9.msdn.com/Shows/Azure-Friday/At-Build-2018-Cognitive-Services-Language-LUIS/player)
* [Build 2018 AI Show - What’s New with Language Understanding Service](https://channel9.msdn.com/Shows/AI-Show/Whats-New-with-Language-Understanding-Service-LUIS/player)
* [Build 2018 Session - Bot intelligence, Speech Capabilities, and NLU best practices](https://channel9.msdn.com/events/Build/2018/BRK3208)
* [Build 2018 - LUIS Updates](https://channel9.msdn.com/events/Build/2018/THR3118/player)

Projects:
* [Contoso Cafe bot](https://github.com/botbuilderbuild2018/build2018demo) demo - source code on Github

## Next steps

To learn more about LUIS, see the following resources:
* [Stack Overflow questions tagged with LUIS](https://stackoverflow.com/questions/tagged/luis)
* [MSDN Language Understanding Intelligent Services (LUIS) Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=LUIS)
