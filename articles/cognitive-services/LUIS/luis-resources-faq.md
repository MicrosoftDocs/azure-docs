---
title: Language Understanding Intelligent Services (LUIS) in Azure Frequently Asked Questions | Microsoft Docs
description:  A list of Frequently Asked Questions about Language Understanding Intelligent Services (LUIS)
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 07/19/2017
ms.author: v-demak
---
# Language Understanding Intelligent Services (LUIS) Frequently Asked Questions

This article contains answers to some frequently asked questions about LUIS.

## How do I interpret LUIS scores? 
Your system should use the highest scoring intent regardless of its value. For example, a score below 0.5 does not necessarily mean LUIS has low confidence. Providing more training data can help increase the score of the most-likely intent.

## What is the maximum number of intents and entities that a LUIS app can support?
A LUIS app can support up to **80** intents.

Limits on entities depend on the entity type and are listed in the following table:
| Type          | Limit | 
| ------------- | ----- |
| [Prebuilt entities](./Pre-builtEntities.md)   | No limit. | 
| [List entities](./luis-concept-entity-types.md)     | 50 list entities. Each list can contain up to 20000 items | 
| [Simple, Hierarchical, and Composite entities](./luis-concept-entity-types.md) | You can define up to 30 entities of these types. A hierarchical entity can consist of up to 10 child entities. A composite entity can consist of up to 20 child entities. |

## I want to build a LUIS app with more than the maximum number of intents. What should I do?

First, consider whether your system is using too many intents. Intents that are too similar can make it more difficult for LUIS to distinguish between them. Intents should be varied enough to capture the main tasks the user is asking for, but they don't need to capture every path your code takes. For example, BookFlight and BookHotel may be separate intents in a travel app, but BookInternationalFlight and BookDomesticFlight are too similar, and if your system needs to distinguish them, use entities or other logic rather than intents.

If you cannot use fewer intents, divide your intents into multiple LUIS apps, by grouping together related intents. One best practice is to group related intents together if you're using multiple apps for your system. For example, if you're developing an office assistant that has over 80 intents, but 20 intents relate to scheduling meetings, 20 intents are about reminders, 20 intents are about getting information about colleagues, and 20 intents are for sending email, you can put the intent for each of those categories in a separate LUIS app. 

When your system receives an utterance, you can use a variety of techniques to determine how to direct user utterances to LUIS apps:

* Create a top-level LUIS app to determine the category of utterance, and then use the result to send the utterance to the LUIS app for that category.
* Do some preprocessing on the utterance, like matching on regular expressions, to determine which LUIS app or set of apps receives it.

Consider the following tradeoffs when deciding which approach you use with multiple LUIS apps:
* **Saving suggested utterances for training** Your LUIS apps get a performance boost when you label the user utterances it receives, especially the [suggested utterances](./Label-Suggested-Utterances.md) that LUIS is relatively unsure of. Any LUIS app that doesn't receive an utterance won't have the benefit of learning from it.
* **Calling LUIS apps in parallel instead of in series** It is a common to design a system to reduce to the number of REST API calls that happen in series to improve responsiveness. If you send the utterance to multiple LUIS apps and pick the intent with the highest score, you can call them in parallel by sending all the requests asynchronously. If you call a top-level LUIS app to determine a category, and then use the result to send the utterance to another LUIS app, the LUIS calls happen in series.

If reducing the number of intents or dividing your intents into multiple apps won't work for you, provide detailed information about your system and contact support. You can get support by clicking **Support** in www.luis.ai, or through Azure technical support if your Azure subscription inclues support services.

## I want to build an app in LUIS with more than 30 entities. What should I do?

You might need to use hierarchical and composite entities. Hierarchical entities reflect the relationship between entities that share characteristics or are members of a category. The child entities are all members of their parent's category. For example, a hierarchical entity named PlaneTicketClass may have the child entities EconomyClass and FirstClass. The hierarchy spans only one level of depth. 

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder may have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass. You build a composite entity from pre-existing simple entities, children of hierarchical entities or prebuilt entities. 

LUIS also provides the list entity type that is not machine-learned but allows your LUIS app to specify a fixed list of values. A list entity can have up to 20000 items.

If you've considered hierarchical, composite, and list entities and still need more than the limit, provide detailed information about your system and contact support. You can get support by clicking **Support** in www.luis.ai, or through Azure technical support if your Azure subscription inclues support services.

## What are the limits on the number and size of phrase lists?
The maximum length of a [phrase list](./luis-concept-feature.md) is 5000 items. You may use a maximum of 10 phrase lists per LUIS app.

## What is the limit on the length of an utterance?
The maximum length of an utterance is 500 characters.

## What is the best way to start on building my app in LUIS?

The best way to build you app is through an incremental process. You could start by defining the schema of your app (intents and entities). For every intent and entity model, you can provide a few dozen labels. Train and publish your app to get an endpoint. Then, upload 100-200 unlabeled utterances to your app. You can use the suggestion feature to leverage LUIS intelligence in selecting the most informative utterances to label. You can select the intent or entity you want to improve and label the utterances suggested by LUIS. Labeling a few hundred utterance should result in a decent accuracy for intents. Entities might need more examples to converge.

## What is a good practice to model the intents of my app? Should I create more specific or more generic intents?

Choose intents that are not so general as to be overlapping, but not so specific that it makes it difficult for LUIS to distinguish between similar intents. Creating discriminative specific intents is one of LUIS modeling best practices.

## Is it important to train the None intent?

Yes, it is good that to train your **None** intent with more utterances as you add more labels to other intents. A good ratio is to add 1 or 2 labels to **None** for every 10 labels added to an intent. This boosts the discriminative power of LUIS.

## How can I deal with spelling mistakes in utterances?

You have one of two options: 
1.	Pass your utterances by a spell checker before sending them to the LUIS endpoint.
2.	Label utterances that have spelling mistakes that are as diverse as possible, so that LUIS can learn proper spelling as well as typos.

The second option takes more labeling effort while the first might be easier.

## I see some errors in the batch testing pane for some of the models in my app. How can I address this problem?

This is an indication that there is some discrepancy between your labels and the predictions from your models. You need to do one or both of the following:
1.	Add more labels to help LUIS make the discrimination among intents better.
2.	Add phrase list feature(s) to introduce domain-specific vocabulary to help LUIS learn faster.


## I have an app in one language and would like to create a parallel app in another language. What is the easiest way to do so?
1.	Export your app.
2.	Translate the labeled utterances in the JSON of the exported app to the target language.
3.	You might need to change the names of the intents and entities or leave them as they are.
4.	Import the app afterwards to have an LUIS app in the target language

## How do I download a log of user utterances?
By default, utterances from users are logged. To download a log of utterances that users sent to your LUIS app, click the download icon in the entry for your app in **My Apps**. This log is in comma-separated value (CSV) format.

## How can I disable logging of utterances?
* You can turn off the logging of user utterances by setting `log=false` in the URL when your client application queries LUIS. However, note that this will disable your LUIS app's ability to suggest utterances or improve performance based on user queries. If you set `log=false` due to data privacy concerns be aware that you won't be able to download a record of user utterances from LUIS or use those utterances to improve your app.

## How can I delete data from LUIS? 

* If you delete an utterance from your LUIS app, it is removed from the LUIS web service and not available for export.
* If you delete an account, all apps and their utterances are deleted. Data is retained on the servers for 60 days before permanent deletion.

## Next steps

* You can find many answers in the [Stack Overflow questions tagged with LUIS](https://stackoverflow.com/questions/tagged/luis).
* Another resource is the [MSDN LUIS Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=LUIS) 

