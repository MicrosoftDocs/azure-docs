---
title: What's new in the Text Analytics API
titleSuffix: Text Analytics - Azure Cognitive Services
description: This article provides you with information about new releases and features for the Azure Cognitive Services Text Analytics.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/12/2021
ms.author: aahi
ms.custom: references_regions 
---

# What's new in the Text Analytics API?

The Text Analytics API is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## July 2021

### GA release updates

* General availability for [Text Analytics for health](how-tos/text-analytics-for-health.md?tabs=ner) for both containers and hosted API (/health).
* General availability for [Opinion Mining](how-tos/text-analytics-how-to-sentiment-analysis.md?tabs=version-3-1#opinion-mining).
* General availability for [PII extraction and redaction](how-tos/text-analytics-how-to-entity-linking.md?tabs=version-3-1#personally-identifiable-information-pii).
* General availability for [Asynchronous (`/analyze`) endpoint](how-tos/text-analytics-how-to-call-api.md?tabs=synchronous#using-the-api-asynchronously).
* Updated [quickstart](quickstarts/client-libraries-rest-api.md) examples with new SDK. 

## June 2021

### General API updates

* New model-version `2021-06-01` for key phrase extraction based on transformers. It provides:
  * Support for 10 languages (Latin and CJK). 
  * Improved key phrase extraction.
* The `2021-06-01` model version for [Named Entity Recognition](how-tos/text-analytics-how-to-entity-linking.md) v3.x, which provides 
  * Improved AI quality and expanded language support for the *Skill* entity category. 
  * Added Spanish, French, German, Italian and Portuguese language support for the *Skill* entity category
* Asynchronous (/analyze) operation and Text Analytics for health (ungated preview) is available in all regions. 

### Text Analytics for health updates

* You no longer need to apply for access to preview Text Analytics for health.
* A new model version `2021-05-15` for the `/health` endpoint and on-premise container which provides
    * 5 new entity types: `ALLERGEN`, `CONDITION_SCALE`, `COURSE`, `EXPRESSION` and `MUTATION_TYPE`,
    * 14 new relation types,
    * Assertion detection expanded for new entity types and
    * Linking support for ALLERGEN entity type
* A new image for the Text Analytics for health container with tag `3.0.016230002-onprem-amd64` and model version `2021-05-15`. This container is available for download from Microsoft Container Registry.
 
## May 2021

* [Custom question answering](../qnamaker/custom-question-answering.md) (previously QnA maker) can now be accessed using a Text Analytics resource. 

### General API updates

* Release of the new API v3.1-preview.5 which includes 
  * Asynchronous [Analyze API](how-tos/text-analytics-how-to-call-api.md?tabs=asynchronous) now supports Sentiment Analysis (SA) and Opinion Mining (OM).
  * A new query parameter, `LoggingOptOut`, is now available for customers who wish to opt out of logging input text for incident reports.  Learn more about this parameter in the [data privacy](/legal/cognitive-services/text-analytics/data-privacy?context=/azure/cognitive-services/text-analytics/context/context) article.
* Text Analytics for health and the Analyze asynchronous operations are now available in all regions

## March 2021

### General API updates
* Release of the new API v3.1-preview.4 which includes 
   * Changes in the Opinion Mining JSON response body: 
      * `aspects` is now `targets` and `opinions` is now `assessments`. 
   * Changes in the JSON response body of the hosted web API of Text Analytics for health: 
      * The `isNegated` boolean name of a detected entity object for Negation is deprecated and replaced by Assertion Detection.
      * A new property called `role` is now part of the extracted relation between an attribute and an entity as well as the relation between entities.  This adds specificity to the detected relation type.
   * Entity linking is now available as an asynchronous task in the `/analyze` endpoint.
   * A new `pii-categories` parameter is now available in the `/pii` endpoint.
      * This parameter lets you specify select PII entities as well as those not supported by default for the input language.
* Updated client libraries, which include asynchronous Analyze, and Text Analytics for health operations. You can find examples on GitHub:

    * [C#](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics)
    * [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/)
    * [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/textanalytics/azure-ai-textanalytics)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/textanalytics/ai-text-analytics/samples/v5/javascript)
    
> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3.1-Preview.4](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-4/operations/Languages)

### Text Analytics for health updates

* A new model version `2021-03-01` for the `/health` endpoint and on-premise container which provides
    * A rename of the `Gene` entity type to `GeneOrProtein`.
    * A new `Date` entity type.
    * Assertion detection which replaces negation detection (only available in API v3.1-preview.4).
    * A new preferred `name` property for linked entities that is normalized from various ontologies and coding systems (only available in API v3.1-preview.4). 
* A new container image with tag `3.0.015490002-onprem-amd64` and the new model-version `2021-03-01` has been released to the container preview repository. 
    * This container image will no longer be available for download from `containerpreview.azurecr.io` after April 26th, 2021.
* A new Text Analytics for health container image with this same model-version is now available at `mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare`. Starting April 26th, you will only be able to download the container from this repository.

> [!div class="nextstepaction"]
> [Learn more about Text Analytics for health](how-tos/text-analytics-for-health.md)

### Text Analytics resource portal update
* **Processed Text Records** is now available as a metric in the **Monitoring** section for your Text Analytics resource in the Azure portal.  

## February 2021

* The `2021-01-15` model version for the PII endpoint in [Named Entity Recognition](how-tos/text-analytics-how-to-entity-linking.md) v3.1-preview.x, which provides 
  * Expanded support for 9 new languages
  * Improved AI quality of named entity categories for supported languages.
* The S0 through S4 pricing tiers are being retired on March 8th, 2021. If you have an existing Text Analytics resource using the S0 through S4 pricing tier, you should update it to use the Standard (S) [pricing tier](how-tos/text-analytics-how-to-call-api.md#change-your-pricing-tier).
* The [language detection container](how-tos/text-analytics-how-to-install-containers.md?tabs=sentiment) is now generally available.
* v2.1 of the API is being retired. 

## January 2021

* The `2021-01-15` model version for [Named Entity Recognition](how-tos/text-analytics-how-to-entity-linking.md) v3.x, which provides 
  * Expanded language support for [several general entity categories](named-entity-types.md). 
  * Improved AI quality of general entity categories for all supported v3 languages. 

* The `2021-01-05` model version for [language detection](how-tos/text-analytics-how-to-language-detection.md), which provides additional [language support](language-support.md?tabs=language-detection).

These model versions are currently unavailable in the East US region. 

> [!div class="nextstepaction"]
> [Learn more about about the new NER model](https://azure.microsoft.com/updates/text-analytics-ner-improved-ai-quality)

## December 2020

* [Updated pricing](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/) details for the Text Analytics API.

## November 2020

* A [new endpoint](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-3/operations/Analyze) with Text Analytics API v3.1-preview.3 for the new asynchronous [Analyze API](how-tos/text-analytics-how-to-call-api.md?tabs=analyze), which supports batch processing for NER, PII, and key phrase extraction operations.
* A [new endpoint](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-3/operations/Health) with Text Analytics API v3.1-preview.3 for the new asynchronous [Text Analytics for health](how-tos/text-analytics-for-health.md) hosted API with support for batch processing.
* Both new features listed above are only available in the following regions: `West US 2`, `East US 2`, `Central US`, `North Europe` and `West Europe` regions.
* Portuguese (Brazil) `pt-BR` is now supported in [Sentiment Analysis](how-tos/text-analytics-how-to-sentiment-analysis.md) v3.x, starting with model version `2020-04-01`. It adds to the existing `pt-PT` support for Portuguese.
* Updated client libraries, which include asynchronous Analyze, and Text Analytics for health operations. You can find examples on GitHub:

    * [C#](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics)
    * [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/)
    * [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/textanalytics/azure-ai-textanalytics)
    * 
> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3.1-Preview.3](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-3/operations/Languages)

## October 2020

* Hindi support for Sentiment Analysis v3.x, starting with model version `2020-04-01`. 
* Model version `2020-09-01` for the v3 /languages endpoint, which adds increased language detection and accuracy improvements.
* v3 availability in Central India and UAE North.

## September 2020

### General API updates

* Release of a new URL for the Text Analytics v3.1 public preview to support updates to the following Named Entity Recognition v3 endpoints: 
    * `/pii` endpoint now includes the new `redactedText` property in the response JSON where detected PII entities in the input text are replaced by an `*` for each character of those entities.
    * `/linking` endpoint now includes the `bingID` property in the response JSON for linked entities.
* The following Text Analytics preview API endpoints were retired on September 4th, 2020:
    * v2.1-preview
    * v3.0-preview
    * v3.0-preview.1
    
> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3.1-Preview.2](quickstarts/client-libraries-rest-api.md)

### Text Analytics for health container updates

The following updates are specific to the September release of the Text Analytics for health container only.
* A new container image with tag `1.1.013530001-amd64-preview` with the new model-version `2020-09-03` has been released to the container preview repository. 
* This model version provides improvements in entity recognition, abbreviation detection, and latency enhancements.

> [!div class="nextstepaction"]
> [Learn more about Text Analytics for health](how-tos/text-analytics-for-health.md)

## August 2020

### General API updates

* Model version `2020-07-01` for the v3 `/keyphrases`, `/pii` and `/languages` endpoints, which adds:
    * Additional government and country specific [entity categories](named-entity-types.md?tabs=personal) for Named Entity Recognition.
    * Norwegian and Turkish support in Sentiment Analysis v3.
* An HTTP 400 error will now be returned for v3 API requests that exceed the published [data limits](concepts/data-limits.md). 
* Endpoints that return an offset now support the optional `stringIndexType` parameter, which adjusts the returned `offset` and `length` values to match a supported [string index scheme](concepts/text-offsets.md).

### Text Analytics for health container updates

The following updates are specific to the August release of the Text Analytics for health container only.

* New model-version for Text Analytics for health: `2020-07-24`
* New URL for sending Text Analytics for health requests: `http://<serverURL>:5000/text/analytics/v3.2-preview.1/entities/health` (Please note that a browser cache clearing will be needed in order to use the demo web app included in this new container image)

The following properties in the JSON response have changed:

* `type` has been renamed to `category` 
* `score` has been renamed to `confidenceScore`
* Entities in the `category` field of the JSON output are now in pascal case. The following entities have been renamed:
    * `EXAMINATION_RELATION` has been renamed to `RelationalOperator`.
    * `EXAMINATION_UNIT` has been renamed to `MeasurementUnit`.
    * `EXAMINATION_VALUE` has been renamed to `MeasurementValue`.
    * `ROUTE_OR_MODE` has been renamed `MedicationRoute`.
    * The relational entity `ROUTE_OR_MODE_OF_MEDICATION` has been renamed to `RouteOfMedication`.

The following entities have been added:

* NER
    * `AdministrativeEvent`
    * `CareEnvironment`
    * `HealthcareProfession`
    * `MedicationForm` 

* Relation extraction
    * `DirectionOfCondition`
    * `DirectionOfExamination`
    * `DirectionOfTreatment`

> [!div class="nextstepaction"]
> [Learn more about Text Analytics for health container](how-tos/text-analytics-for-health.md)

## July 2020 

### Text Analytics for health container - Public gated preview

The Text Analytics for health container is now in public gated preview, which lets you extract information from unstructured English-language text in clinical documents such as: patient intake forms, doctor's notes, research papers and discharge summaries. Currently, you will not be billed for Text Analytics for health container usage.

The container offers the following features:

* Named Entity Recognition
* Relation extraction
* Entity linking
* Negation

## May 2020

### Text Analytics API v3 General Availability

Text Analysis API v3 is now generally available with the following updates:

* Model version `2020-04-01`
* New [data limits](concepts/data-limits.md) for each feature
* Updated [language support](language-support.md) for [Sentiment Analysis (SA) v3](how-tos/text-analytics-how-to-sentiment-analysis.md)
* Separate endpoint for Entity Linking 
* New "Address" entity category in [Named Entity Recognition (NER) v3](how-tos/text-analytics-how-to-entity-linking.md).
* New subcategories in NER v3:
   * Location - Geographical
   * Location - Structural
   * Organization - Stock Exchange
   * Organization - Medical
   * Organization - Sports
   * Event - Cultural
   * Event - Natural
   * Event - Sports

The following properties in the JSON response have been added:
   * `SentenceText` in Sentiment Analysis
   * `Warnings` for each document 

The names of the following properties in the JSON response have been changed, where applicable:

* `score` has been renamed to `confidenceScore`
    * `confidenceScore` has two decimal points of precision. 
* `type` has been renamed to `category`
* `subtype` has been renamed to `subcategory`

> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Languages)

### Text Analytics API v3.1 Public Preview
   * New Sentiment Analysis feature - [Opinion Mining](how-tos/text-analytics-how-to-sentiment-analysis.md#opinion-mining)
   * New Personal (`PII`) domain filter for protected health information (`PHI`).

> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3.1 Preview](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-1/operations/Languages)

## February 2020

### SDK support for Text Analytics API v3 Public Preview

As part of the [unified Azure SDK release](https://techcommunity.microsoft.com/t5/azure-sdk/january-2020-unified-azure-sdk-release/ba-p/1097290), the Text Analytics API v3 SDK is now available as a public preview for the following programming languages:
   * [C#](./quickstarts/client-libraries-rest-api.md?pivots=programming-language-csharp&tabs=version-3)
   * [Python](./quickstarts/client-libraries-rest-api.md?pivots=programming-language-python&tabs=version-3)
   * [JavaScript (Node.js)](./quickstarts/client-libraries-rest-api.md?pivots=programming-language-javascript&tabs=version-3)
   * [Java](./quickstarts/client-libraries-rest-api.md?pivots=programming-language-java&tabs=version-3)
   
> [!div class="nextstepaction"]
> [Learn more about Text Analytics API v3 SDK](./quickstarts/client-libraries-rest-api.md?tabs=version-3)

### Named Entity Recognition v3 public preview

Additional entity types are now available in the Named Entity Recognition (NER) v3 public preview service as we expand the detection of general and personal information entities found in text. This update introduces [model version](concepts/model-versioning.md) `2020-02-01`, which includes:

* Recognition of the following general entity types (English only):
    * PersonType
    * Product
    * Event
    * Geopolitical Entity (GPE) as a subtype under Location
    * Skill

* Recognition of the following personal information entity types (English only):
    * Person
    * Organization
    * Age as a subtype under Quantity
    * Date as a subtype under DateTime
    * Email 
    * Phone Number (US only)
    * URL
    * IP Address

### October 2019

#### Named Entity Recognition (NER)

* A [new endpoint](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-2/operations/EntitiesRecognitionPii) for recognizing personal information entity types (English only)

* Separate endpoints for [entity recognition](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-2/operations/EntitiesRecognitionGeneral) and [entity linking](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-2/operations/EntitiesLinking).

* [Model version](concepts/model-versioning.md) `2019-10-01`, which includes:
    * Expanded detection and categorization of entities found in text. 
    * Recognition of the following new entity types:
        * Phone number
        * IP address

Entity linking supports English and Spanish. NER language support varies by the entity type.

#### Sentiment Analysis v3 public preview

* A [new endpoint](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-2/operations/Sentiment) for analyzing sentiment.
* [Model version](concepts/model-versioning.md) `2019-10-01`, which includes:

    * Significant improvements in the accuracy and detail of the API's text categorization and scoring.
    * Automatic labeling for different sentiments in text.
    * Sentiment analysis and output on a document and sentence level. 

It supports English (`en`), Japanese (`ja`), Chinese Simplified (`zh-Hans`),  Chinese Traditional (`zh-Hant`), French (`fr`), Italian (`it`), Spanish (`es`), Dutch (`nl`), Portuguese (`pt`), and German (`de`), and is available in the following regions: `Australia East`, `Central Canada`, `Central US`, `East Asia`, `East US`, `East US 2`, `North Europe`, `Southeast Asia`, `South Central US`, `UK South`, `West Europe`, and `West US 2`. 

> [!div class="nextstepaction"]
> [Learn more about Sentiment Analysis v3](how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-versions-and-features)

## Next steps

* [What is the Text Analytics API?](overview.md)  
* [Example user scenarios](text-analytics-user-scenarios.md)
* [Sentiment analysis](how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Language detection](how-tos/text-analytics-how-to-language-detection.md)
* [Entity recognition](how-tos/text-analytics-how-to-entity-linking.md)
* [Key phrase extraction](how-tos/text-analytics-how-to-keyword-extraction.md)
