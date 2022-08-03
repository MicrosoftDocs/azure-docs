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
ms.date: 06/03/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Label your utterances in Language Studio

Once you have [built a schema](build-schema.md) for your project, you should add training utterances to your project. The utterances should be similar to what your users will use when interacting with the project. When you add an utterance, you have to assign which intent it belongs to. After the utterance is added, label the words within your utterance that you want to extract as entities. 

Data labeling is a crucial step in development lifecycle; this data will be used in the next step when training your model so that your model can learn from the labeled data. If you already have labeled utterances, you can directly [import it into your project](create-project.md#import-project), but you need to make sure that your data follows the [accepted data format](../concepts/data-formats.md). See [create project](create-project.md#import-project) to learn more about importing labeled data into your project. Labeled data informs the model how to interpret text, and is used for training and evaluation.

## Prerequisites

Before you can label your data, you need:

* A successfully [created project](create-project.md).

See the [project development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Data labeling guidelines

After [building your schema](build-schema.md) and [creating your project](create-project.md), you will need to label your data. Labeling your data is important so your model knows which words will be associated with the entities you need to extract. You will want to spend time labeling your utterances - introducing and refining the data that will be used to in training your models.


<!--  Composition guidance where does this live -->

<!-- 
  > [!NOTE]
  >  An entity's learned components is only defined when you label utterances for that entity. You can also have entities that include _only_ list or prebuilt components without labelling learned components. see the [entity components](../concepts/entity-components.md) article for more information.
 -->

As you add utterances and label them, keep in mind:

* The machine learning models generalize based on the labeled examples you provide it; the more examples you provide, the more data points the model has to make better generalizations. 

* The precision, consistency and completeness of your labeled data are key factors to determining model performance. 

    * **Label precisely**: Label each entity to its right type always. Only include what you want extracted, avoid unnecessary data in your labels.
    * **Label consistently**:  The same entity should have the same label across all the utterances.
    * **Label completely**: Label all the instances of the entity in all your utterances.

* For [Multilingual projects](../language-support.md#multi-lingual-option), adding utterances in other languages increases the model's performance in these languages, but avoid duplicating your data across all the languages you would like to support. For example, to improve a calender bot's performance with users, a developer might add examples mostly in English, and a few in Spanish or French as well. They might add utterances such as:

  * "_Set a meeting with **Matt** and **Kevin** **tomorrow** at **12 PM**._" (English)
  * "_Reply as **tentative** to the **weekly update** meeting._" (English)
  * "_Cancelar mi **próxima** reunión_." (Spanish)

## How to label your utterances

Use the following steps to label your utterances:

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. From the left side menu, select **Data labeling**. In this page, you can start adding your utterance and labeling them. You can also upload your utterance directly by clicking on **Upload utterance file** from the top menu, make sure it follows the [accepted format](../concepts/data-formats.md#utterance-file-format).

3. From the top pivots, you can change the view to be **training set** or **testing set**.  Learn more about [training and testing sets](train-model.md#data-splitting) and how they're used for model training and evaluation.
    
    :::image type="content" source="../media/tag-utterances.png" alt-text="A screenshot of the page for tagging utterances in Language Studio." lightbox="../media/tag-utterances.png":::
     
    > [!TIP]
    > If you are planning on using **Automatically split the testing set from training data** splitting, add all your utterances to the training set.
    
  
4.  From the **Select intent** dropdown menu, select one of the intents, the language of the utterance (for multilingual projects), and the utterance itself. Press the enter key in the utterance's text box to add the utterance.

5. You have two options to label entities in an utterance:
    
    |Option |Description  |
    |---------|---------|
    |Label using a brush     | Select the brush icon next to an entity in the right pane, then highlight the text in the utterance you want to label.           |
    |Label using inline menu     | Highlight the word you want to label as an entity, and a menu will appear. Select the entity you want to label these words with. |
    
6. In the right side pane, under the **Labels** pivot, you can find all the entity types in your project and the count of labeled instances per each.

7. Under the **Distribution** pivot you can view the distribution across training and testing sets. You have two options for viewing:
    * *Total instances per labeled entity* where you can view count of all labeled instances of a specific entity.
    * *Unique utterances per labeled entity* where each utterance is counted if it contains at least one labeled instance of this entity.
    * *Utterances per intent* where you can view count of utterances per intent.

:::image type="content" source="../media/label-distribution.png" alt-text="A screenshot showing entity distribution in Language Studio." lightbox="../media/label-distribution.png":::


  > [!NOTE]
  > list and prebuilt components are not shown in the data labeling page, and all labels here only apply to the **learned component**.

To remove a label:
  1. From within your utterance, select the entity you want to remove a label from.
  3. Scroll through the menu that appears, and select **Remove label**.

To delete or rename an entity:
  1. Select the entity you want to edit in the right side pane.
  2. Click on the three dots next to the entity, and select the option you want from the drop-down menu.

## Next Steps
* [Train Model](./train-model.md)
