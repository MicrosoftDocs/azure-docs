---
title: "Harm categories in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about the different content moderation flags and severity levels that the Azure AI Content Safety service returns.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: conceptual
ms.date: 04/06/2023
ms.author: pafarley
keywords: 
---


# Harm categories in Azure AI Content Safety

This guide describes all of the harm categories and ratings that Azure AI Content Safety uses to flag content. Both text and image content use the same set of flags.

## Harm categories

Content Safety recognizes four distinct categories of objectionable content.

| Category  | Description         |
| --------- | ------------------- |
| Hate and Fairness      | Hate and fairness-related harms refer to any content that attacks or uses pejorative or discriminatory language with reference to a person or identity group based on certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. </br></br> Fairness is concerned with ensuring that AI systems treat all groups of people equitably without contributing to existing societal inequities. Similar to hate speech, fairness-related harms hinge upon disparate treatment of identity groups. |
| Sexual  | Sexual describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one's will, prostitution, pornography, and abuse.   |
| Violence  | Violence describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, guns and related entities, such as manufactures, associations, legislation, and so on.    |
| Self-Harm  | Self-harm describes language related to physical actions intended to purposely hurt, injure, damage one's body or kill oneself.  |

Classification can be multi-labeled. For example, when a text sample goes through the text moderation model, it could be classified as both Sexual content and Violence.

## Severity levels

Every harm category the service applies also comes with a severity level rating. The severity level is meant to indicate the severity of the consequences of showing the flagged content.

**Text**: The current version of the text model supports the full 0-7 severity scale. The classifier detects amongst all severities along this scale. If the user specifies, it can return severities in the trimmed scale of 0, 2, 4, and 6; each two adjacent levels are mapped to a single level.
- [0,1] -> 0
- [2,3] -> 2
- [4,5] -> 4
- [6,7] -> 6

**Image**: The current version of the image model supports the trimmed version of the full 0-7 severity scale. The classifier only returns severities 0, 2, 4, and 6; each two adjacent levels are mapped to a single level.
- [0,1] -> 0
- [2,3] -> 2
- [4,5] -> 4
- [6,7] -> 6

[!INCLUDE [severity-levels text](../includes/severity-levels-text.md)]

[!INCLUDE [severity-levels image](../includes/severity-levels-image.md)]


## Next steps

Follow a quickstart to get started using Azure AI Content Safety in your application.

> [!div class="nextstepaction"]
> [Content Safety quickstart](../quickstart-text.md)
