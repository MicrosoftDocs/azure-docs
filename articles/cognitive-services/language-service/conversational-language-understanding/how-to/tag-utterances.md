---
title: How to tag utterances in Conversational Language Understanding
titleSuffix: Azure Cognitive Services
description: Use this article to tag your utterances in Conversational Language Understanding projects
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# How to tag utterances

Once you have [built a schema](build-schema.md) for your project, you should add training utterances to your project. The utterances should be similar to what your users will use when interacting with the project. When you add an utterance, you have to assign which intent it belongs to. After the utterance is added, label the words within your utterance with the entities in your project. Your labels for entities should be consistent across the different utterances.

Tagging is the process of assigning your utterances to intents, and labeling them with entities. You will want to spend time tagging your utterances - introducing and refining the data that will train the underlying machine learning models for your project. The machine learning models generalize based on the examples you provide it. The more examples you provide, the more data points the model has to make better generalizations.

> [!NOTE]
>  An entity's learned components is only defined when you label utterances for that entity. You can also have entities that include _only_ list or prebuilt components without labelling learned components. see the [entity components](../concepts/entity-components.md) article for more information.

When you enable multiple languages in your project, you must also specify the language of the utterance you're adding. As part of the multilingual capabilities of Conversational Language Understanding, you can train your project in a dominant language, and then predict in the other available languages. Adding examples to other languages increases the model's performance in these languages if you determine it isn't doing well, but avoid duplicating your data across all the languages you would like to support. 

For example, to improve a calender bot's performance with users, a developer might add examples mostly in English, and a few in Spanish or French as well. They might add utterances such as:

* "_Set a meeting with **Matt** and **Kevin** **tomorrow** at **12 PM**._" (English)
* "_Reply as **tentative** to the **weekly update** meeting._" (English)
* "_Cancelar mi **próxima** reunión_." (Spanish)

## Tag utterances

:::image type="content" source="../media/tag-utterances.png" alt-text="A screenshot of the page for tagging utterances in Language Studio." lightbox="../media/tag-utterances.png":::

*Section 1* is where you choose which dataset you're viewing. You can add utterances in the training set or testing set.

Your utterances are split into two sets:
* Training set: These utterances are used to create your conversational model during training. The training set is processed as part of the training job to produce a trained model.
* Testing set: These utterances are used to test the performance of your conversation model when the model is created. Testing set is also used to output the evaluation of the model.

When adding utterances, you have the option to add to a specific set explicitly (training or testing). If you choose to do this you need to set your split type in train model page to **manual split of training and testing data**, otherwise keep all your utterances in the train set and use **Automatically split the testing set from training data**. See [How to train your model](train-model.md#train-model) for more information.

*Section 2* is where you add your utterances. You must select one of the intents from the drop-down list, the language of the utterance (if applicable), and the utterance itself. Press the enter key in the utterance's text box to add the utterance.

*Section 3* includes your project's entities and distribution of intents and entities across your training set and testing set.

You can select the highlight button next to any of the entities you've added, and then hover over the text to label the entities within your utterances, shown in *section 4*. You can also add new entities here by clicking the **+ Add Entity** button. 

When you select your distribution, you can also view tag distribution across:

* Total instances per tagged entity: The distribution of each of your entities across the training and testing sets. 

* Unique utterances per tagged entity: How your entities are distributed among the different utterances you have.
* Utterances per intent: The distribution of utterances among intents across your training and testing sets.

:::image type="content" source="../media/label-distribution.png" alt-text="A screenshot showing entity distribution in the Language Studio." lightbox="../media/label-distribution.png":::

*Section 4* includes the utterances you've added. You can drag over the text you want to label, and a contextual menu of the entities will appear.

:::image type="content" source="../media/label-utterance-menu.png" alt-text="A screenshot showing the contextual menu when selecting text." lightbox="../media/label-utterance-menu.png":::

> [!NOTE]
> Unlike LUIS, you cannot label overlapping entities. The same characters cannot be labeled by more than one entity.
> list and prebuilt components are not shown in the tag utterances page, and all labels here only apply to the learned component.

## Filter Utterances

Clicking on **Filter** lets you view only the utterances associated to the intents and entities you select in the filter pane.
When clicking on an intent in the [build schema](./build-schema.md) page then you'll be moved to the **Tag Utterances** page, with that intent filtered automatically. 

## Next Steps
* [Train and Evaluate Model](./train-model.md)
