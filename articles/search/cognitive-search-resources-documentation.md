---
title: Documentation links for AI enrichment
titleSuffix: Azure Cognitive Search
description: An annotated list of articles, tutorials, samples, and blog posts related to AI enrichment workloads in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/12/2020
---
# Documentation resources for AI enrichment in Azure Cognitive Search

AI enrichment is an add-on to indexer-based indexing that finds latent information in non-text sources and undifferentiated text, transforming it into full text searchable content in Azure Cognitive Search. 

For built-in processing, the pre-trained AI models in Cognitive Services are called internally to perform the analyses. You can also integrate custom models using Azure Machine Learning, Azure Functions, or other approaches.

The following is a consolidated list of the documentation for AI enrichment.

## Concepts

+ [AI enrichments](cognitive-search-concept-intro.md)
+ [Skillsets](cognitive-search-working-with-skillsets.md)
+ [Debug sessions](cognitive-search-debug-session.md)
+ [Knowledge stores](knowledge-store-concept-intro.md)
+ [Projections](knowledge-store-projection-overview.md)
+ [Incremental enrichment (reuse of a cached enriched document)](cognitive-search-incremental-indexing-conceptual.md)

## Hands on walkthroughs

+ [Quickstart: Create a cognitive skillset in the Azure portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Enriched indexing with AI](cognitive-search-tutorial-blob.md)
+ [Tutorial: Diagnose, repair, and commit changes to your skillset with Debug Sessions](cognitive-search-tutorial-debug-sessions.md)

## Knowledge stores

+ [Quickstart: Create a knowledge store in the Azure portal](knowledge-store-create-portal.md)
+ [Create a knowledge store using REST and Postman](knowledge-store-create-rest.md)
+ [View a knowledge store with Storage Explorer](knowledge-store-view-storage-explorer.md)
+ [Connect a knowledge store with Power BI](knowledge-store-connect-power-bi.md)
+ [Projection examples (how to shape and export enrichments)](knowledge-store-projections-examples.md)

## Custom skills (advanced)

+ [How to define a custom skills interface](cognitive-search-custom-skill-interface.md)
+ [Example: Create a custom skill using Azure Functions (and Bing Entity Search APIs)](cognitive-search-create-custom-skill-example.md)
+ [Example: Create a custom skill using Python](cognitive-search-custom-skill-python.md)
+ [Example: Create a custom skill using Form Recognizer](cognitive-search-custom-skill-form.md) 
+ [Example: Create a custom skill using Azure Machine Learning](cognitive-search-tutorial-aml-custom-skill.md) 

## How-to guidance

+ [Attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md)
+ [Define a skillset](cognitive-search-defining-skillset.md)
+ [reference annotations in a skillset](cognitive-search-concept-annotations-syntax.md)
+ [Map fields to an index](cognitive-search-output-field-mapping.md)
+ [Process and extract information from images](cognitive-search-concept-image-scenarios.md)
+ [Configure caching for incremental enrichment](search-howto-incremental-index.md)
+ [How to rebuild an Azure Cognitive Search index](search-howto-reindex.md)
+ [Design tips](cognitive-search-concept-troubleshooting.md)
+ [Common errors and warnings](cognitive-search-common-errors-warnings.md)

## Skills reference

+ [Built-in skills](cognitive-search-predefined-skills.md)
  + [Microsoft.Skills.Text.KeyPhraseExtractionSkill](cognitive-search-skill-keyphrases.md)
  + [Microsoft.Skills.Text.LanguageDetectionSkill](cognitive-search-skill-language-detection.md)
  + [Microsoft.Skills.Text.EntityRecognitionSkill](cognitive-search-skill-entity-recognition.md)
  + [Microsoft.Skills.Text.MergeSkill](cognitive-search-skill-textmerger.md)
  + [Microsoft.Skills.Text.PIIDetectionSkill](cognitive-search-skill-pii-detection.md)
  + [Microsoft.Skills.Text.SplitSkill](cognitive-search-skill-textsplit.md)
  + [Microsoft.Skills.Text.SentimentSkill](cognitive-search-skill-sentiment.md)
  + [Microsoft.Skills.Text.TranslationSkill](cognitive-search-skill-text-translation.md)
  + [Microsoft.Skills.Vision.ImageAnalysisSkill](cognitive-search-skill-image-analysis.md)
  + [Microsoft.Skills.Vision.OcrSkill](cognitive-search-skill-ocr.md)
  + [Microsoft.Skills.Util.ConditionalSkill](cognitive-search-skill-conditional.md)
  + [Microsoft.Skills.Util.DocumentExtractionSkill](cognitive-search-skill-document-extraction.md)
  + [Microsoft.Skills.Util.ShaperSkill](cognitive-search-skill-shaper.md)

+ Custom skills
  + [Microsoft.Skills.Custom.AmlSkill](cognitive-search-aml-skill.md)
  + [Microsoft.Skills.Custom.WebApiSkill](cognitive-search-custom-skill-web-api.md)

+ [Deprecated skills](cognitive-search-skill-deprecated.md)
  + [Microsoft.Skills.Text.NamedEntityRecognitionSkill](cognitive-search-skill-named-entity-recognition.md)

## APIs

+ [REST API](https://docs.microsoft.com/rest/api/searchservice/)
  + [Create Skillset (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
  + [Create Indexer (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)

## See also

+ [Azure Cognitive Search REST API](https://docs.microsoft.com/rest/api/searchservice/)
+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [What is Azure Cognitive Search?](search-what-is-azure-search.md)
