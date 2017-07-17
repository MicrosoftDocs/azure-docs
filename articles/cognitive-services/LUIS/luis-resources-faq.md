---
title: Language Understanding Intelligent Services (LUIS) in Azure Frequently Asked Questions | Microsoft Docs
description:  A list of Frequently Asked Questions about Language Understanding Intelligent Services (LUIS)
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---
# Language Understanding Intelligent Services (LUIS) Frequently Asked Questions

This article contains answers to some frequently asked questions about LUIS.


## I want to build an app in LUIS with more than 80 intents. What should I do?

Divide your intents into multiple LUIS apps, in which each app will group related intents. At runtime, you send the utterance to all the apps and pick the top firing intent with the highest confidence score. One best practice is to group related intents in one app.


## I want to build an app in LUIS with more than 30 entities. What should I do?

You might need to use hierarchical and composite entities. Hierarchical entities reflect the relationship between entities that share characteristics or are members of a category. The child entities are all members of their parent's category. For example, a hierarchical entity named PlaneTicketClass may have the child entities EconomyClass and FirstClass. The hierarchy spans only one level of depth. 

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder may have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass. You build a composite entity from pre-existing simple entities, children of hierarchical entities or prebuilt entities. LUIS is limited to 10 parent entities with up to 10 children for each parent entity (composite or hierarchical). 

LUIS also provides the list entity type that is not machine learned but allows users to specify a fixed set entities with a given set of values. 

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

## How can I delete data from LUIS? 

* If you delete an utterance from your LUIS app, it is removed from the LUIS web service and not available for export.
* If you delete an account, all apps and their utterances are deleted. Data is retained on the servers for 60 days before permanent deletion.
* You can turn off the logging of user utterances by setting `log=false` in the URL when your client application queries LUIS. However, note that this will disable your LUIS app's ability to suggest utterances or improve performance based on user queries. If you set `log=false` due to data privacy concerns be aware that you won't be able to download a record of user utterances from LUIS or use those utterances to improve your app.

<!-- What does it mean to delete an utterance? 
Deleting an account -all apps, all utterances deleted, 60 days retention
Turning off logging-->

## Next steps

* You can find many answers in the [Stack Overflow questions tagged with LUIS](https://stackoverflow.com/questions/tagged/luis).
* Another resource is the [MSDN LUIS Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=LUIS) 

