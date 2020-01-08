---
title: Documentation links for AI enrichment
titleSuffix: Azure Cognitive Search
description: An annotated list of articles, tutorials, samples, and blog posts related to AI enrichment workloads in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 11/04/2019
---
# Documentation resources for AI enrichment in Azure Cognitive Search

AI enrichment is a capability of Azure Cognitive Search indexing that finds latent information in non-text sources and undifferentiated text, transforming it into full text searchable content in Azure Cognitive Search.

The following articles are the complete documentation for AI enrichment.

## Getting started
+ [Introduction to AI in Azure Cognitive Search](cognitive-search-concept-intro.md)
+ [Quickstart: Create a cognitive skillset in the Azure portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Enriched indexing with AI](cognitive-search-tutorial-blob.md)
+ [Example: Creating a custom skill for AI enrichment](cognitive-search-create-custom-skill-example.md)

## How-to guidance
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to reference annotations in a skillset](cognitive-search-concept-annotations-syntax.md)
+ [How to map fields to an index](cognitive-search-output-field-mapping.md)
+ [How to process and extract information from images](cognitive-search-concept-image-scenarios.md)
+ [How to rebuild an Azure Cognitive Search index](search-howto-reindex.md)
+ [How to define a custom skills interface](cognitive-search-custom-skill-interface.md)
+ [Troubleshooting tips](cognitive-search-concept-troubleshooting.md)

## Reference

+ [Built-in skills](cognitive-search-predefined-skills.md)
  + [Microsoft.Skills.Text.KeyPhraseExtractionSkill](cognitive-search-skill-keyphrases.md)
  + [Microsoft.Skills.Text.LanguageDetectionSkill](cognitive-search-skill-language-detection.md)
  + [Microsoft.Skills.Text.EntityRecognitionSkill](cognitive-search-skill-entity-recognition.md)
  + [Microsoft.Skills.Text.MergeSkill](cognitive-search-skill-textmerger.md)
  + [Microsoft.Skills.Text.SplitSkill](cognitive-search-skill-textsplit.md)
  + [Microsoft.Skills.Text.SentimentSkill](cognitive-search-skill-sentiment.md)
  + [Microsoft.Skills.Text.TranslationSkill](cognitive-search-skill-text-translation.md)
  + [Microsoft.Skills.Vision.ImageAnalysisSkill](cognitive-search-skill-image-analysis.md)
  + [Microsoft.Skills.Vision.OcrSkill](cognitive-search-skill-ocr.md)
  + [Microsoft.Skills.Util.ConditionalSkill](cognitive-search-skill-conditional.md)
  + [Microsoft.Skills.Util.DocumentExtractionSkill](cognitive-search-skill-document-extraction.md)
  + [Microsoft.Skills.Util.ShaperSkill](cognitive-search-skill-shaper.md)

+ Custom skills
  + [Microsoft.Skills.Custom.WebApiSkill](cognitive-search-custom-skill-web-api.md)

+ [Deprecated skills](cognitive-search-skill-deprecated.md)
  + [Microsoft.Skills.Text.NamedEntityRecognitionSkill](cognitive-search-skill-named-entity-recognition.md)

+ [REST API](https://docs.microsoft.com/rest/api/searchservice/)
  + [Create Skillset (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
  + [Create Indexer (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)

## See also

+ [Azure Cognitive Search REST API](https://docs.microsoft.com/rest/api/searchservice/)
+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [What is Azure Cognitive Search?](search-what-is-azure-search.md)
