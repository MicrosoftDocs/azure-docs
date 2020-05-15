---
title: Features - LUIS
titleSuffix: Azure Cognitive Services
description: Use Language Understanding (LUIS) to add app features that can improve the detection or prediction of intents and entities that categories and patterns
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 05/06/2020
ms.author: diberry
---

# Use features to boost signal of word list

You can add features to your LUIS app to improve its accuracy. Features help LUIS by providing hints that certain words and phrases are part of an app domain vocabulary.

Review [concepts](luis-concept-feature.md) to understand when and why to use a feature.

## Add phrase list as a feature

1. Sign in to the [LUIS portal](https://www.luis.ai), and select your **Subscription** and **Authoring resource** to see the apps assigned to that authoring resource.
1. Open your app by selecting its name on **My Apps** page.
1. Select **Build**, then select **Features** in your app's left panel.

1. On the **Features** page, select **+ Create**.

1. In the **Create new phrase list feature** dialog box, enter a name such as `Cities`. In the **Value** box, enter examples of the cities, such as `Seattle`. You can type one value at a time, or a set of values separated by commas, and then press **Enter**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of adding feature (phrase list) Cities](./media/luis-add-features/add-phrase-list-cities.png)

    Once you have entered enough values for LUIS, suggestions appear. You can **+ Add all** of the proposed values, or select individual terms.

1. Keep **These values are interchangeable** checked if the phrases can be used interchangeably.

1. The phrase list can apply to the entire app with the **Global** setting, or to a specific model (intent or entity). If you create the phrase list, as a _feature_ from an intent or entity, the toggle is not set for global. In this case, the meaning of the toggle is that the feature is local only to that model, therefore, _not global_ to the application.

1. Select **Done**. The new feature is added to the **ML Features** page.

<a name="edit-phrase-list"></a>
<a name="delete-phrase-list"></a>
<a name="deactivate-phrase-list"></a>

> [!Note]
> You can delete, or deactivate a phrase list from the contextual toolbar on the **ML Features** page.

## Next steps

After adding, editing, deleting, or deactivating a feature, [train and test the app](luis-interactive-test.md) again to see if performance improves.
