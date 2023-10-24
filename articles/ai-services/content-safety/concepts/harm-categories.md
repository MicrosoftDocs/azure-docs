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
| Hate and Fairness      | Hate and fairness-related harms refer to any content that attacks or uses pejorative or discriminatory language with reference to a person or identity group based on certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. </br></br> Fairness is concerned with ensuring that AI systems treat all groups of people equitably without contributing to existing societal inequities. Similar to hate speech, fairness-related harms hinge upon disparate treatment of identity groups. |
| Sexual  | Sexual describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one's will, prostitution, pornography, and abuse.   |
| Violence  | Violence describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, guns and related entities, such as manufactures, associations, legislation, and so on.    |
| Self-Harm  | Self-harm describes language related to physical actions intended to purposely hurt, injure, damage one's body or kill oneself.  |

Classification can be multi-labeled. For example, when a text sample goes through the text moderation model, it could be classified as both Sexual content and Violence.

## Severity levels

Every harm category the service applies also comes with a severity level rating. The severity level is meant to indicate the severity of the consequences of showing the flagged content.

**Text**: The current version of the text model supports the full 0-7 severity scale. The classifier detects amongst all severities along this scale.

**Image**: The current version of the image model supports a trimmed version of the full 0-7 severity scale for image analysis. The classifier only returns severities 0, 2, 4, and 6; each two adjacent levels are mapped to a single level.

| **Severity Level** | **Description** |
| --- | --- |
| Level 0 – Safe | Content that might be related to violence, self-harm, sexual or hate & fairness categories, but the terms are used in general, journalistic, scientific, medical, or similar professional contexts that are **appropriate for most audiences**. This level doesn't include content unrelated to the above categories.  |
| Level 1 | Content that might be related to violence, self-harm, sexual or hate & fairness categories but the terms are used in general, journalistic, scientific, medial, and similar professional contexts that **may not be appropriate for all audiences**. This level might contain content that, in other contexts, might acquire a different meaning and higher severity level. Content can express **negative or positive sentiments towards identity groups or representations without endorsement of action.** |
| Level 2 – Low  | Content that expresses **general hate speech that does not target identity groups**, expressions **targeting identity groups with positive sentiment or intent**, use cases exploring a **fictional world** (for example, gaming, literature) and depictions at low intensity. |
| Level 3 | Content that expresses **prejudiced, judgmental or opinionated views**, including offensive use of language, stereotyping, and depictions aimed at **identity groups with negative sentiment**. |
| Level 4 – Medium  | Content that **uses offensive, insulting language towards identity groups, including fantasies or harm at medium intensity**. |
| Level 5 | Content that displays harmful instructions, **attacks against identity groups**, and **displays of harmful actions** with the **aim of furthering negative sentiments**. |
| Level 6 – High  | Content that displays **harmful actions, damage** , including promotion of severe harmful acts, radicalization, and non-consensual power exchange or abuse. |
| Level 7 | Content of the highest severity and maturity that **endorses, glorifies, or promotes extreme forms of activity towards identity groups**, includes extreme or illegal forms of harm, and radicalization. |

## Next steps

Follow a quickstart to get started using Content Safety in your application.

> [!div class="nextstepaction"]
> [Content Safety quickstart](../quickstart-text.md)
