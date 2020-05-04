---
title: "Application settings"
description: Configure your application settings in the LUIS portal such as utterance normalization and app privacy.
ms.topic: quickstart
ms.date: 04/06/2020
#Customer intent: As a new user, I want to deploy a LUIS app in the LUIS portal so I can understand the process of putting the model on the prediction endpoint.
---

# Application settings in the LUIS portal

Configure your application settings in the LUIS portal such as utterance normalization and app privacy.

## Application name and ID

You can edit your application name, and description. You can copy your App ID. The culture can't be changed.

1. Sign into the [LUIS portal](https://www.luis.ai).
1. Select an app from the **My apps* list.
.
1. Select **Manage** from the top navigation bar, then **Application Settings** from the left navigation bar.

> [!div class="mx-imgBorder"]
> ![Screenshot of LUIS portal, Manage section, Application Settings page](media/app-settings/luis-portal-manage-section-application-settings.png)


## Change training and endpoint settings

The training and endpoints settings apply to your entire app, and all versions.

To change a setting, select the toggle on the page.

|Settings|Information|
|--|--|
|Make endpoints public|Anyone can access your public app if they have a prediction key and know your app ID. |
|Use non-deterministic training|[concept](), [reference](luis-reference-application-settings.md)|
|Normalize diacritics|[concept](luis-concept-utterance.md#utterance-normalization), [reference](luis-reference-application-settings.md)|
|Normalize punctuation|[concept](luis-concept-utterance.md#utterance-normalization), [reference](luis-reference-application-settings.md)|
|Normalize word forms|[concept](luis-concept-utterance.md#utterance-normalization), [reference](luis-reference-application-settings.md)|

## Next steps

* How to [collaborate](luis-how-to-collaborate.md) with other authors