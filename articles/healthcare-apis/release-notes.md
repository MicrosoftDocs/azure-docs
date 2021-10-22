---
title: Azure Healthcare APIs monthly releases
description: This article provides details about the Azure Healthcare APIs monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 10/22/2021
ms.author: cavoeg
---

# Azure Healthcare APIs release notes

## September 2021

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

Azure Healthcare APIs is a set of tools and connectors that enable you to improve healthcare through insights discovered by bringing disparate sets of protected health information (PHI) together and connecting it end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Healthcare APIs including the different service types (FHIR service, DICOM service, and IoT connector) that seamlessly work with one another.

### FHIR service

Added support for [conditional patch](https://docs.microsoft.com/azure/healthcare-apis/fhir/fhir-rest-api-capabilities#patch-and-conditional-patch):

* Conditional patch - [#2163](https://github.com/microsoft/fhir-server/pull/2163)
* Add conditional patch audit event - [#2213](https://github.com/microsoft/fhir-server/pull/2213)

Allow [JSON patch in bundles](https://docs.microsoft.com/azure/healthcare-apis/fhir/fhir-rest-api-capabilities#patch-in-bundles):

* Allow search history bundles with patch requests - [#2156](https://github.com/microsoft/fhir-server/pull/2156)
* Enable JSON patch in bundles using Binary resources - [#2143](https://github.com/microsoft/fhir-server/pull/2143)

Added new audit [OperationName subtypes](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/enable-diagnostic-logging#audit-log-details) - [#2170](https://github.com/microsoft/fhir-server/pull/2170)

[How to run a reindex](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/how-to-run-a-reindex) improvements:

* Added [boundaries for reindex](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/how-to-run-a-reindex#performance-considerations) parameters - [#2103](https://github.com/microsoft/fhir-server/pull/2103)
* Update error message for reindex parameter boundaries - [#2109](https://github.com/microsoft/fhir-server/pull/2109)
* Adds final reindex count check - [#2099](https://github.com/microsoft/fhir-server/pull/2099)


### Bugs

Resolved patch bugs:

* Wider catch for exceptions during applying patch - [#2192](https://github.com/microsoft/fhir-server/pull/2192)
* Fix history with PATCH in STU3 - [#2177](https://github.com/microsoft/fhir-server/pull/2177)

Custom search bugs:

* Addresses the delete failure with Custom Search parameters - [#2133](https://github.com/microsoft/fhir-server/pull/2133)
* Added retry logic while Deleting Search Parameter - [#2121](https://github.com/microsoft/fhir-server/pull/2121)
* Set max item count in search options in SearchParameterDefinitionManager - [#2141](https://github.com/microsoft/fhir-server/pull/2141)
* Better exception if there's a bad expression in a search parameter - [#2157](https://github.com/microsoft/fhir-server/pull/2157)

Updates SQL batch reindex retry logic - [#2118](https://github.com/microsoft/fhir-server/pull/2118)


### GitHub issues closed

* Unclear error message for conditional create with no ID - [#2168](https://github.com/microsoft/fhir-server/issues/2168)

### DICOM service

* Details coming soon.

### IoT connector

* Details coming soon.
