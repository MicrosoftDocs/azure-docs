---
title: Predefined data extraction, natural language, image processing skills (Azure Search) | Microsoft Docs
description: Data extraction, natural language, image processing cognitive skills add semantics and structure to raw content in an Azure Seach pipeline.
manager: pablocas
author: luiscabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: luisca
---
# Predefined skills for content enrichment (Azure Search)

In this article, you learn about the cognitive skills provided with Azure Search. A *cognitive skill* is an operation that transforms content in some way. Often, it is a component that extracts data or infers structure, and therefore augments our understanding of the input data. Almost always, the output is text-based. A *skillset* is collection of skills that define the enrichment pipeline. 

> [!NOTE]
> Cognitive Search is in public preview. Skillset execution, and image extraction and normalization are currently offered for free. At a later time, the pricing for these capabilities will be announced. 

## Predefined skills

Several skills are flexible in what they consume or produce. In general, most skills are based on pre-trained models, which means you cannot train the model using your own training data. For guidance on creating a custom skill, see [How to define a custom interface](cognitive-search-custom-skill-interface.md) and [Example: creating a custom skill](cognitive-search-create-custom-skill-example.md). The following table enumerates and describes the skills provided by Microsoft. 

| Skill | Description |
|-------|-------------|
| [Microsoft.Skills.Text.KeyPhraseSkill](cognitive-search-skill-keyphrases.md) | This skill uses a pretrained model to detect important phrases based on term placement, linguistic rules, proximity to other terms, and how unusual the term is within the source data. |
| [Microsoft.Skills.Text.LanguageDetectionSkill](cognitive-search-skill-language-detection.md)  | This skill uses a pretrained model to detect which language is used (one language ID per document). When multiple languages are used within the same text segments, the output is the LCID of the predominantly used language.|
| [Microsoft.Skills.Text.MergerSkill](cognitive-search-skill-textmerger.md) | Consolidates text from a collection of fields into a single field.  |
| [Microsoft.Skills.Text.NamedEntityRecognitionSkill](cognitive-search-skill-named-entity-recognition.md) | This skill uses a pretrained model to establish entities for a fixed set of categories: people, location, organization. |
| [Microsoft.Skills.Text.SentimentSkill](cognitive-search-skill-sentiment.md)  | This skill uses a pretrained model to score positive or negative sentiment on a record by record basis. The score is between 0 and 1. Neutral scores occur for both the null case when sentiment cannot be detected, and for text that is considered neutral.  |
| [Microsoft.Skills.Text.SplitSkill](cognitive-search-skill-textsplit.md) | Splits text into pages so that you can enrich or augment content incrementally. |
| [Microsoft.Skills.Vision.ImageAnalysisSkill](cognitive-search-skill-image-analysis.md) | This skill uses an image detection algorithm to identify the content of an image and generate a text description. |
| [Microsoft.Skills.Vision.OcrSkill](cognitive-search-skill-ocr.md) | Optical character recognition. |
| [Microsoft.Skills.Util.ShaperSkill](cognitive-search-skill-shaper.md) | Maps output to a complex type (a multi-part data type, which might be used for a full name, a multi-line address, or a combination of last name and a personal identifier.) |

## See also

+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Custom Skills interface definition](cognitive-search-custom-skill-interface.md)
+ [Tutorial: Enriched indexing with cognitive search](cognitive-search-tutorial-blob.md)