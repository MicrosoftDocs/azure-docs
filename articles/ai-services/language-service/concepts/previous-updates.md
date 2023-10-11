---
title: Previous language service updates
titleSuffix: Azure AI services
description: An archive of previous Azure AI Language updates.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 06/23/2022
ms.author: aahi
ROBOTS: NOINDEX
---

# Previous updates for Azure AI Language

This article contains a list of previously recorded updates for Azure AI Language. For more current service updates, see [What's new](../whats-new.md).

## October 2021

* Quality improvements for the extractive summarization feature in model-version `2021-08-01`.

## September 2021

* Starting with version `3.0.017010001-onprem-amd64` The text analytics for health container can now be called using the client library.

## July 2021

* General availability for text analytics for health containers and API.
* General availability for opinion mining.
* General availability for PII extraction and redaction.
* General availability for asynchronous operation.

## June 2021

### General API updates

* New model-version `2021-06-01` for key phrase extraction based on transformers. It provides:
  * Support for 10 languages (Latin and CJK). 
  * Improved key phrase extraction.
* The `2021-06-01` model version for Named Entity Recognition (NER) which provides 
  * Improved AI quality and expanded language support for the *Skill* entity category. 
  * Added Spanish, French, German, Italian and Portuguese language support for the *Skill* entity category

### Text Analytics for health updates

* A new model version `2021-05-15` for the `/health` endpoint and on-premises container which provides
    * 5 new entity types: `ALLERGEN`, `CONDITION_SCALE`, `COURSE`, `EXPRESSION` and `MUTATION_TYPE`,
    * 14 new relation types,
    * Assertion detection expanded for new entity types and
    * Linking support for `ALLERGEN` entity type
* A new image for the Text Analytics for health container with tag `3.0.016230002-onprem-amd64` and model version `2021-05-15`. This container is available for download from Microsoft Container Registry.
 
## May 2021

* Custom question answering (previously QnA maker) can now be accessed using a Text Analytics resource. 
* Preview API release, including: 
  * Asynchronous API now supports sentiment analysis and opinion mining.
  * A new query parameter, `LoggingOptOut`, is now available for customers who wish to opt out of logging input text for incident reports.
* Text analytics for health and asynchronous operations are now available in all regions.

## March 2021

* Changes in the opinion mining JSON response body: 
    * `aspects` is now `targets` and `opinions` is now `assessments`. 
* Changes in the JSON response body of the hosted web API of text analytics for health: 
    * The `isNegated` boolean name of a detected entity object for negation is deprecated and replaced by assertion detection.
    * A new property called `role` is now part of the extracted relation between an attribute and an entity as well as the relation between entities.  This adds specificity to the detected relation type.
* Entity linking is now available as an asynchronous task.
* A new `pii-categories` parameter for the PII feature.
    * This parameter lets you specify select PII entities, as well as those not supported by default for the input language.
* Updated client libraries, which include asynchronous and text analytics for health operations.

* A new model version `2021-03-01` for text analytics for health API and on-premises container which provides:
    * A rename of the `Gene` entity type to `GeneOrProtein`.
    * A new `Date` entity type.
    * Assertion detection which replaces negation detection.
    * A new preferred `name` property for linked entities that is normalized from various ontologies and coding systems. 
* A new text analytics for health container image with tag `3.0.015490002-onprem-amd64` and the new model-version `2021-03-01` has been released to the container preview repository. 
    * This container image will no longer be available for download from `containerpreview.azurecr.io` after April 26th, 2021.
* **Processed Text Records** is now available as a metric in the **Monitoring** section for your text analytics resource in the Azure portal.  

## February 2021

* The `2021-01-15` model version for the PII feature, which provides:
  * Expanded support for 9 new languages
  * Improved AI quality
* The S0 through S4 pricing tiers are being retired on March 8th, 2021.
* The language detection container is now generally available.

## January 2021

* The `2021-01-15` model version for Named Entity Recognition (NER), which provides 
  * Expanded language support. 
  * Improved AI quality of general entity categories for all supported languages. 
* The `2021-01-05` model version for language detection, which provides additional language support.

## November 2020

* Portuguese (Brazil) `pt-BR` is now supported in sentiment analysis, starting with model version `2020-04-01`. It adds to the existing `pt-PT` support for Portuguese.
* Updated client libraries, which include asynchronous and text analytics for health operations.

## October 2020

* Hindi support for sentiment analysis, starting with model version `2020-04-01`. 
* Model version `2020-09-01` for language detection, which adds additional language support and accuracy improvements.

## September 2020

* PII now includes the new `redactedText` property in the response JSON where detected PII entities in the input text are replaced by an `*` for each character of those entities.
* Entity linking endpoint now includes the `bingID` property in the response JSON for linked entities.
* The following updates are specific to the September release of the text analytics for health container only.
    * A new container image with tag `1.1.013530001-amd64-preview` with the new model-version `2020-09-03` has been released to the container preview repository. 
    * This model version provides improvements in entity recognition, abbreviation detection, and latency enhancements.

## August 2020

* Model version `2020-07-01` for key phrase extraction, PII detection, and language detection. This update adds:
    * Additional government and country/region specific entity categories for Named Entity Recognition.
    * Norwegian and Turkish support in Sentiment Analysis.
* An HTTP 400 error will now be returned for API requests that exceed the published data limits. 
* Endpoints that return an offset now support the optional `stringIndexType` parameter, which adjusts the returned `offset` and `length` values to match a supported string index scheme.

The following updates are specific to the August release of the Text Analytics for health container only.

* New model-version for Text Analytics for health: `2020-07-24`
    
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

* Named Entity Recognition
    * `AdministrativeEvent`
    * `CareEnvironment`
    * `HealthcareProfession`
    * `MedicationForm` 

* Relation extraction
    * `DirectionOfCondition`
    * `DirectionOfExamination`
    * `DirectionOfTreatment`
    
## May 2020

* Model version `2020-04-01`:
    * Updated language support for sentiment analysis
    * New "Address" entity category in Named Entity Recognition (NER)
    * New subcategories in NER:
       * Location - Geographical
       * Location - Structural
       * Organization - Stock Exchange
       * Organization - Medical
       * Organization - Sports
       * Event - Cultural
       * Event - Natural
       * Event - Sports

* The following properties in the JSON response have been added:
   * `SentenceText` in sentiment analysis
   * `Warnings` for each document 

* The names of the following properties in the JSON response have been changed, where applicable:

* `score` has been renamed to `confidenceScore`
    * `confidenceScore` has two decimal points of precision. 
* `type` has been renamed to `category`
* `subtype` has been renamed to `subcategory`

* New sentiment analysis feature - opinion mining
* New personal (`PII`) domain filter for protected health information (`PHI`).

## February 2020

Additional entity types are now available in the Named Entity Recognition (NER). This update introduces model version `2020-02-01`, which includes:

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

* Introduction of PII feature
* Model version `2019-10-01`, which includes:
    * Named entity recognition:
        * Expanded detection and categorization of entities found in text. 
        * Recognition of the following new entity types:
            * Phone number
            * IP address
    * Sentiment analysis:
        * Significant improvements in the accuracy and detail of the API's text categorization and scoring.
        * Automatic labeling for different sentiments in text.
        * Sentiment analysis and output on a document and sentence level. 

    This model version supports: English (`en`), Japanese (`ja`), Chinese Simplified (`zh-Hans`),  Chinese Traditional (`zh-Hant`), French (`fr`), Italian (`it`), Spanish (`es`), Dutch (`nl`), Portuguese (`pt`), and German (`de`). 

## Next steps

See [What's new](../whats-new.md) for current service updates. 
