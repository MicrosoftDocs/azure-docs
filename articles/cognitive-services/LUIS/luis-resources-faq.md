---
title: Language Understanding Intelligent Services (LUIS) in Azure frequently asked questions | Microsoft Docs
description:  Get answers to frequently asked questions about Language Understanding Intelligent Services (LUIS)
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 07/19/2017
ms.author: v-demak
---
# Language Understanding Intelligent Services FAQ

This article contains answers to frequently asked questions about Language Understanding Intelligent Services (LUIS).

## How do I interpret LUIS scores? 
Your system should use the highest scoring intent regardless of its value. For example, a score below 0.5 does not necessarily mean that LUIS has low confidence. Providing more training data can help increase the score of the most-likely intent.

## What is the maximum number of intents and entities that a LUIS app can support?
A LUIS app can support up to 80 intents.

Limits on entities depend on the entity type, as shown in the following table:
| Type          | Limit | 
| ------------- | ----- |
| [Prebuilt entities](./Pre-builtEntities.md)   | No limit. | 
| [List entities](./luis-concept-entity-types.md)     | 50 list entities. Each list can contain up to 20,000 items. | 
| [Simple, hierarchical, and composite entities](./luis-concept-entity-types.md) | You can define up to 30 of these types of entities. A hierarchical entity can consist of up to 10 child entities. A composite entity can consist of up to 20 child entities. |

## I want to build a LUIS app with more than the maximum number of intents. What should I do?

First, consider whether your system is using too many intents. Intents that are too similar can make it more difficult for LUIS to distinguish between them. Intents should be varied enough to capture the main tasks that the user is asking for, but they don't need to capture every path your code takes. For example, BookFlight and BookHotel might be separate intents in a travel app, but BookInternationalFlight and BookDomesticFlight are too similar. If your system needs to distinguish them, use entities or other logic rather than intents.

If you cannot use fewer intents, divide your intents into multiple LUIS apps, and group related intents. This approach is a good best practice if you're using multiple apps for your system. For example, let's say you're developing an office assistant that has over 80 intents. If 20 intents relate to scheduling meetings, 20 are about reminders, 20 are about getting information about colleagues, and 20 are for sending email, you can put the intent for each of those categories in a separate LUIS app. 

When your system receives an utterance, you can use a variety of techniques to determine how to direct user utterances to LUIS apps:

* Create a top-level LUIS app to determine the category of utterance, and then use the result to send the utterance to the LUIS app for that category.
* Do some preprocessing on the utterance, such as matching on regular expressions, to determine which LUIS app or set of apps receives it.

When you're deciding which approach to use with multiple LUIS apps, consider the following trade-offs:
* **Saving suggested utterances for training**: Your LUIS apps get a performance boost when you label the user utterances that the apps receive, especially the [suggested utterances](./Label-Suggested-Utterances.md) that LUIS is relatively unsure of. Any LUIS app that doesn't receive an utterance won't have the benefit of learning from it.
* **Calling LUIS apps in parallel instead of in series**: To improve responsiveness, you might ordinarily design a system to reduce the number of REST API calls that happen in series. But if you send the utterance to multiple LUIS apps and pick the intent with the highest score, you can call the apps in parallel by sending all the requests asynchronously. If you call a top-level LUIS app to determine a category, and then use the result to send the utterance to another LUIS app, the LUIS calls happen in series.

If reducing the number of intents or dividing your intents into multiple apps doesn't work for you, contact support. To do so, gather detailed information about your system, go to the [Language Understanding Intelligent Service](https://www.luis.ai) site, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/en-us/support/options/).

## I want to build an app in LUIS with more than 30 entities. What should I do?

You might need to use hierarchical and composite entities. Hierarchical entities reflect the relationship between entities that share characteristics or are members of a category. The child entities are all members of their parent's category. For example, a hierarchical entity named PlaneTicketClass might have the child entities EconomyClass and FirstClass. The hierarchy spans only one level of depth. 

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder might have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass. You build a composite entity from pre-existing simple entities, children of hierarchical entities, or prebuilt entities. 

LUIS also provides the list entity type that is not machine-learned but allows your LUIS app to specify a fixed list of values. A list entity can have up to 20,000 items.

If you've considered hierarchical, composite, and list entities and still need more than the limit, contact support. To do so, gather detailed information about your system, go to the [Language Understanding Intelligent Service](https://www.luis.ai) site, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/en-us/support/options/).

## What are the limits on the number and size of phrase lists?
The maximum length of a [phrase list](./luis-concept-feature.md) is 5,000 items. You can use a maximum of 10 phrase lists per LUIS app.

## What is the limit on the length of an utterance?
The maximum length of an utterance is 500 characters.

## What is the best way to start building my app in LUIS?

The best way to build your app is through an incremental process. You could start by defining the schema of your app (intents and entities). For every intent and entity model, you can provide a few dozen labels. Train and publish your app to get an endpoint. Then, upload 100 to 200 unlabeled utterances to your app. As you select the most informative utterances to label, you can use the suggestion feature to take advantage of LUIS intelligence. You can select the intent or entity that you want to improve, and then label the utterances that are suggested by LUIS. Labeling a few hundred utterances should result in a decent accuracy for intents. Entities might need more examples to converge.

## What is a good practice to model the intents of my app? Should I create more specific or more generic intents?

Choose intents that are not so general as to be overlapping, but not so specific that it makes it difficult for LUIS to distinguish between similar intents. Creating discriminative specific intents is one of the best practices for LUIS modeling.

## Is it important to train the None intent?

Yes, it is good to train your **None** intent with more utterances as you add more labels to other intents. A good ratio is 1 or 2 labels added to **None** for every 10 labels added to an intent. This ratio boosts the discriminative power of LUIS.

## How can I deal with spelling mistakes in utterances?

You have one of two options: 
* Use a spell checker on your utterances before sending them to the LUIS endpoint. This option might be the easier of the two.
* For greatest diversity, label utterances that have spelling mistakes so that LUIS can learn proper spelling as well as typos. This option requires more labeling effort.

## I see some errors in the batch testing pane for some of the models in my app. How can I address this problem?

The errors indicate that there is some discrepancy between your labels and the predictions from your models. To address the problem, do one or both of the following:
* To help LUIS improve discrimination among intents, add more labels.
* To help LUIS learn faster, add phrase-list features that introduce domain-specific vocabulary.


## I have an app in one language and want to create a parallel app in another language. What is the easiest way to do so?
1. Export your app.
2. Translate the labeled utterances in the JSON file of the exported app to the target language.
3. You might need to change the names of the intents and entities or leave them as they are.
4. Finally, import the app to have a LUIS app in the target language.

## How do I download a log of user utterances?
By default, your LUIS app logs utterances from users. To download a log of utterances that users send to your LUIS app, under **My App**, select the download icon in the entry for your app. The log is formatted as a comma-separated value (CSV) file.

## How can I disable the logging of utterances?
You can turn off the logging of user utterances by setting `log=false` in the URL when your client application queries LUIS. However, turning off logging disables your LUIS app's ability to suggest utterances or improve performance that's based on user queries. If you set `log=false` because of data-privacy concerns, you won't be able to download a record of user utterances from LUIS or use those utterances to improve your app.

## Can I delete data from LUIS? 

* If you delete an utterance from your LUIS app, it is removed from the LUIS web service and is unavailable for export.
* If you delete an account, all apps and their utterances are deleted. The data is retained on the servers for 60 days before it is deleted permanently.

## What are the transaction limits on the Authoring API?
To edit your LUIS app programmatically, you use a programmatic key with the Authoring API. Programmatic authoring allows up to 100,000 calls per month and five transactions per second.

## What is the tenant ID in the "Add a key to your app" window?
In Azure, a tenant represents the client or organization that's associated with a service. Find your tenant ID in the Azure portal in the **Directory ID** box by selecting **Azure Active Directory** > **Manage** > **Properties**.

![Tenant ID in the Azure portal](./media/luis-manage-keys/luis-assign-key-tenant-id.png)

## Next steps

To learn more about LUIS, see the following resources:
* [Stack Overflow questions tagged with LUIS](https://stackoverflow.com/questions/tagged/luis)
* [MSDN Language Understanding Intelligent Services (LUIS) Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=LUIS) 

