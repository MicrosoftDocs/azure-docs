---
title: How to label example utterances in LUIS 
description:  Learn how to label example utterance in LUIS.
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 01/05/2022
---

# How to label example utterances

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Labeling an entity in an example utterance gives LUIS an example of what the entity is and where the entity can appear in the utterance. You can label machine-learned entities and subentities.

You only label machine-learned entities and sub-entities. Other entity types can be added as features to them when applicable.

## Label example utterances from the Intent detail page

To label examples of entities within the utterance, select the utterance's intent.

1. Sign in to the [LUIS portal](https://www.luis.ai/), and select your  **Subscription**  and  **Authoring resource**  to see the apps assigned to that authoring resource.
2. Open your app by selecting its name on  **My Apps**  page.
3. Select the Intent that has the example utterances you want to label for extraction with an entity.
4. Select the text you want to label then select the entity.

### Two techniques to label entities

Two labeling techniques are supported on the Intent detail page.

* Select entity or subentity from [Entity Palette](../how-to/entities.md) then select within example utterance text. This is the recommended technique because you can visually verify you are working with the correct entity or subentity, according to your schema.
* Select within the example utterance text first. A menu will appear with labeling choices.

### Label with the Entity Palette visible

After you've [planned your schema with entities](../concepts/application-design.md), keep the  **Entity palette**  visible while labeling. The  **Entity palette**  is a reminder of what entities you planned to extract.

To access the  **Entity Palette** , select the  **@**  symbol in the contextual toolbar above the example utterance list.

:::image type="content" source="../media/label-utterances/entity-palette-from-tool-bar.png" alt-text="A screenshot of the entity palette within an intent details page." lightbox="../media/label-utterances/entity-palette-from-tool-bar.png":::

### Label entity from Entity Palette

The entity palette offers an alternative to the previous labeling experience. It allows you to brush over text to instantly label it with an entity.

1. Open the entity palette by selecting on the  **@**  symbol at the top right of the utterance table.
2. Select the entity from the palette that you want to label. This action is visually indicated with a new cursor. The cursor follows the mouse as you move in the LUIS portal.
3. In the example utterance, _paint_ the entity with the cursor.

    :::image type="content" source="../media/label-utterances/example-1-label-machine-learned-entity-palette-label-action.png" alt-text="A screenshot showing an entity painted with the cursor." lightbox="../media/label-utterances/example-1-label-machine-learned-entity-palette-label-action.png":::

## Add entity as a feature from the Entity Palette

The Entity Palette's lower section allows you to add features to the currently selected entity. You can select from all existing entities and phrase lists or create a new phrase list.

:::image type="content" source="../media/label-utterances/entity-palette-entity-as-a-feature.png" alt-text="A screenshot showing the entity palette with the entity as a feature." lightbox="../media/label-utterances/entity-palette-entity-as-a-feature.png":::

### Label text with a role in an example utterance

> [!TIP]
> Roles can be replaced by labeling with subentities of a machine-learning entities.

1. Go to the Intent details page, which has example utterances that use the role.
2. To label with the role, select the entity label (solid line under text) in the example utterance, then select  **View in entity pane**  from the drop-down list.

    :::image type="content" source="../media/add-entities/view-in-entity-pane.png" alt-text="A screenshot showing the view in entity menu." lightbox="../media/add-entities/view-in-entity-pane.png":::

    The entity palette opens to the right.

3. Select the entity, then go to the bottom of the palette and select the role.
 
    :::image type="content" source="../media/add-entities/select-role-in-entity-palette.png" alt-text="A screenshot showing where to select a role." lightbox="../media/add-entities/select-role-in-entity-palette.png":::


## Label entity from in-place menu

Labeling in-place allows you to quickly select the text within the utterance and label it. You can also create a machine learning entity or list entity from the labeled text.

Consider the example utterance: "hi, please i want a cheese pizza in 20 minutes".

Select the left-most text, then select the right-most text of the entity. In the menu that appears, pick the entity you want to label.

:::image type="content" source="../media/label-utterances/label-steps-in-place-menu.png" alt-text="A screenshot showing a menu for labeling an entity." lightbox="../media/label-utterances/label-steps-in-place-menu.png":::

## Review labeled text

After labeling, review the example utterance and ensure the selected span of text has been underlined with the chosen entity. The solid line indicates the text has been labeled.

:::image type="content" source="../media/label-utterances/example-1-label-machine-learned-entity-complete-order-labeled.png" alt-text="A screenshot showing a complete machine-learning entity." lightbox="../media/label-utterances/example-1-label-machine-learned-entity-complete-order-labeled.png":::

## Confirm predicted entity

If there is a dotted-lined box around the span of text, it indicates the text is predicted but _not labeled yet_. To turn the prediction into a label, select the utterance row, then select  **Confirm entities**  from the contextual toolbar.

<!--:::image type="content" source="../media/add-entities/prediction-confirm.png" alt-text="A screenshot showing confirming prediction." lightbox="../media/add-entities/prediction-confirm.png":::-->

> [!Note]
> You do not need to label for punctuation. Use [application settings](../luis-reference-application-settings.md) to control how punctuation impacts utterance predictions.


## Unlabel entities

> [!NOTE]
> Only machine learned entities can be unlabeled. You can't label or unlabel regular expression entities, list entities, or prebuilt entities.

To unlabel an entity, select the entity and select  **Unlabel**  from the in-place menu.

:::image type="content" source="../media/label-utterances/unlabel-entity-using-in-place-menu.png" alt-text="A screenshot showing how to unlabel an entity." lightbox="../media/label-utterances/unlabel-entity-using-in-place-menu.png":::

## Automatic labeling for parent and child entities

If you are labeling for a subentity, the parent will be labeled automatically.

## Automatic labeling for non-machine learned entities

Non-machine learned entities include prebuilt entities, regular expression entities, list entities, and pattern.any entities. These are automatically labeled by LUIS so they are not required to be manually labeled by users.

## Entity prediction errors

Entity prediction errors indicate the predicted entity doesn't match the labeled entity. This is visualized with a caution indicator next to the utterance.

:::image type="content" source="../media/label-utterances/example-utterance-indicates-prediction-error.png" alt-text="A screenshot showing the entity palette for a machine-learning entity." lightbox="../media/label-utterances/example-utterance-indicates-prediction-error.png":::

## Next steps

[Train and test your application](train-test.md)
