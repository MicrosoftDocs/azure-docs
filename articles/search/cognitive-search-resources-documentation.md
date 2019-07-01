---
title: Cognitive search documentation resources - Azure Search
description: An annotated list of articles, tutorials, samples, and blog posts related to cognitive search workloads in Azure Search.
services: search
manager: cgronlun
author: HeidiSteen

ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: heidist
ms.custom: seodec2018
---
# Documentation resources for cognitive search workloads

Cognitive search, now generally available, is a new enrichment layer in Azure Search indexing that finds latent information in non-text sources and undifferentiated text, transforming it into full text searchable content in Azure Search.

The following articles are the complete documentation for cognitive search.

## Getting started
+ [What is cognitive search?](cognitive-search-concept-intro.md)
+ [Quickstart: Try cognitive search in the portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn the cognitive search APIs](cognitive-search-tutorial-blob.md)
+ [Example: Creating a custom skill for cognitive search](cognitive-search-create-custom-skill-example.md)

## How-to guidance
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to reference annotations in a skillset](cognitive-search-concept-annotations-syntax.md)
+ [How to map fields to an index](cognitive-search-output-field-mapping.md)
+ [How to process and extract information from images](cognitive-search-concept-image-scenarios.md)
+ [How to rebuild an Azure Search index](search-howto-reindex.md)
+ [How to define a custom skills interface](cognitive-search-custom-skill-interface.md)
+ [Troubleshooting tips](cognitive-search-concept-troubleshooting.md)

## Reference

+ [Predefined skills](cognitive-search-predefined-skills.md)
  + [Microsoft.Skills.Text.KeyPhraseSkill](cognitive-search-skill-keyphrases.md)
  + [Microsoft.Skills.Text.LanguageDetectionSkill](cognitive-search-skill-language-detection.md)
  + [Microsoft.Skills.Text.NamedEntityRecognitionSkill](cognitive-search-skill-named-entity-recognition.md)
  + [Microsoft.Skills.Text.MergeSkill](cognitive-search-skill-textmerger.md)
  + [Microsoft.Skills.Text.SplitSkill](cognitive-search-skill-textsplit.md)
  + [Microsoft.Skills.Text.SentimentSkill](cognitive-search-skill-sentiment.md)
  + [Microsoft.Skills.Vision.ImageAnalysisSkill](cognitive-search-skill-image-analysis.md)
  + [Microsoft.Skills.Vision.OcrSkill](cognitive-search-skill-ocr.md)
  + [Microsoft.Skills.Util.ShaperSkill](cognitive-search-skill-shaper.md)

+ [REST API](https://docs.microsoft.com/rest/api/searchservice/)
  + [Create Skillset (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
  + [Create Indexer (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)

## See also

+ [Azure Search REST API](https://docs.microsoft.com/rest/api/searchservice/)
+ [Indexers in Azure Search](search-indexer-overview.md)
+ [What is Azure Search?](search-what-is-azure-search.md)
