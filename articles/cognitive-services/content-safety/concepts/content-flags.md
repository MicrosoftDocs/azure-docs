---
title: "Content flags in Azure Content Safety"
titleSuffix: Azure Cognitive Services
description: Learn about the different content moderation flags and risk levels that the Content Safety service returns.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: conceptual
ms.date: 04/06/2023
ms.author: pafarley
keywords: 
---


# Content flags in Azure Content Safety

This guide describes all of the content categories and ratings that Content Safety uses to flag content. Both text and image content use the same set of flags.

## Content categories

Content Safety recognized four distinct categories of objectionable content.

| Category  | Description         |
| --------- | ------------------- |
| Hate      | **Hate** refers to any content that attacks or uses pejorative or discriminatory language in reference to a person or identity group based on certain differentiating attributes of that group. This includes but is not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. |
| Sexual    | **Sexual** describes content related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts&mdash;including those acts portrayed as an assault or a forced sexual violent act against one’s will&mdash;, prostitution, pornography, and abuse. |
| Violence  | **Violence** describes content related to physical actions intended to hurt, injure, damage, or kill someone or something. It also includes weapons, guns and related entities, such as manufacturers, associations, legislation, and similar. |
| Self-harm | **Self-harm** describes content related to physical actions intended to purposely hurt, injure, or damage one’s body or kill oneself. |


## Risk levels

Every content flag the service applies also comes with a risk level rating. The risk level is meant to indicate the severity of the consequences of showing the flagged content.

| Severity | Label |
| -------- | ----------- |
| 0        | Safe        |
| 2        | Low         |
| 4        | Medium      |
| 6        | High        |

## Next steps

Follow a quickstart to get started using Content Safety.

> [!div class="nextstepaction"]
> [Content Safety quickstart](../quickstart.md)