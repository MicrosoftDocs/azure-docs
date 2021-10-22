---
title: Azure API for FHIR monthly releases
description: This article provides details about the Azure API for FHIR monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 10/22/2021
ms.author: cavoeg
---

# Release notes

## Azure API for FHIR 

Azure API for FHIR provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

## September 2021 

### Features and enhancements

Added support for [conditional patch](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/fhir-rest-api-capabilities#patch-and-conditional-patch):

* Conditional patch - [#2163](https://github.com/microsoft/fhir-server/pull/2163)
* Add conditional patch audit event - [#2213](https://github.com/microsoft/fhir-server/pull/2213)

Allow [JSON patch in bundles](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/fhir-rest-api-capabilities#patch-in-bundles):

* Allow search history bundles with patch requests - [#2156](https://github.com/microsoft/fhir-server/pull/2156)
* Enable JSON patch in bundles using Binary resources - [#2143](https://github.com/microsoft/fhir-server/pull/2143)

Added new audit [OperationName subtypes](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/enable-diagnostic-logging#audit-log-details) - [#2170](https://github.com/microsoft/fhir-server/pull/2170)

[Reindex](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/how-to-run-a-reindex) improvements:

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
* Better exception in case of bad expression in search parameter - [#2157](https://github.com/microsoft/fhir-server/pull/2157)

Retry 503 error from Cosmos DB - [#2106](https://github.com/microsoft/fhir-server/pull/2106)

Fixes processing 429s from StoreProcedures - [#2165](https://github.com/microsoft/fhir-server/pull/2165)


### GitHub issues closed

* Unclear error message for conditional create with no ID - [#2168](https://github.com/microsoft/fhir-server/issues/2168)
