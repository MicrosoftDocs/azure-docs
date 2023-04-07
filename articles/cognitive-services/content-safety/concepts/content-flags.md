---
title: "Content flags"
titleSuffix: Azure Cognitive Services
description: Learn about the different content moderation flags and severity levels that the Content Safety service returns.
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





# Concepts 

### Content Categories 

| Category  | Description                                                  |
| --------- | ------------------------------------------------------------ |
| Hate      | Hate refers to any content that attacks or uses pejorative or discriminatory language with reference to a person or identity Group based on certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance and body size. |
| Sexual    | Sexual describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts, including those acts portrayed as an assault or a forced sexual violent act against one’s will, prostitution, pornography and abuse. |
| Violence  | Violence describes language related to physical actions intended to hurt, injure, damage, or kill someone or something. It also includes weapons, guns and related entities, such as manufacturers, associations, legislation, and similar. |
| Self-Harm | Self-harm describes language related to physical actions intended to purposely hurt, injure, damage one’s body or kill oneself. |



### Severity Levels

| Severity | Description |
| -------- | ----------- |
| 0        | Safe        |
| 2        | Low         |
| 4        | Medium      |
| 6        | High        |