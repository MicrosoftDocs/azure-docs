---
title: "Harm categories in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about the different content moderation flags and severity levels that the Content Safety service returns.
services: cognitive-services
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

This guide describes all of the harm categories and ratings that Content Safety uses to flag content. Both text and image content use the same set of flags.

## Harm categories

Content Safety recognizes four distinct categories of objectionable content.

| Category  | Description         |
| --------- | ------------------- |
| Hate      | The hate category describes language attacks or uses that include pejorative or discriminatory language with reference to a person or identity group on the basis of certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size.  |
| Sexual    | The sexual category describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one’s will, prostitution, pornography, and abuse.  |
| Violence  | The violence category describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, etc. |
| Self-harm | The self-harm category describes language related to physical actions intended to purposely hurt, injure, or damage one’s body, or kill oneself. |

Classification can be multi-labeled. For example, when a text sample goes through the text moderation model, it could be classified as both Sexual content and Violence.

## Severity levels

Every harm category the service applies also comes with a severity level rating. The severity level is meant to indicate the severity of the consequences of showing the flagged content.

| Severity Levels          | Label |
| --------                 | ----------- |
|Severity Level 0 – Safe   | Content may be related to violence, self-harm, sexual or hate categories but the terms are used in general, journalistic, scientific, medical, and similar professional contexts which are appropriate for most audiences.  |
|Severity Level 2 – Low    | Content that expresses prejudiced, judgmental, or opinionated views, includes offensive use of language, stereotyping, use cases exploring a fictional world (e.g., gaming, literature) and depictions at low intensity.        |
|Severity Level 4 – Medium| Content that uses offensive, insulting, mocking, intimidating, or demeaning language towards specific identity groups, includes depictions of seeking and executing harmful instructions, fantasies, glorification, promotion of harm at medium intensity.      |
|Severity Level 6 – High   | Content that displays explicit and severe harmful instructions, actions, damage, or abuse, includes endorsement, glorification, promotion of severe harmful acts, extreme or illegal forms of harm, radicalization, and non-consensual power exchange or abuse.        |

## Next steps

Follow a quickstart to get started using Content Safety in your application.

> [!div class="nextstepaction"]
> [Content Safety quickstart](../quickstart-text.md)
