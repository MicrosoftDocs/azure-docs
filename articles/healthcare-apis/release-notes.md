---
title: Azure Healthcare APIs monthly releases
description: This article provides details about the Azure Healthcare APIs monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/15/2021
ms.author: cavoeg
---

# Release notes: Azure Healthcare APIs

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

Azure Healthcare APIs is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Healthcare APIs including the different service types (FHIR service, DICOM service, and IoT connector) that seamlessly work with one another.

## October 2021

### Azure Healthcare APIs Feature Enhancements


| Enhancements | Related information          |
|------------- | -----------------------------|
|Test Data Generator tool |We've updated the Healthcare APIs  GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter, that can be deployed to Azure AKS for performance tests. |

### FHIR service

#### **Feature enhancements**

|Enhancements | Related information |
|------------------------ | -------------------------------|
|<img width=100/>|<img width=400/>|
|Added support for [_sort](././../healthcare-apis/fhir/overview-of-search.md#search-result-parameters) on strings and dateTime. |[#2169](https://github.com/microsoft/fhir-server/pull/2169)  |

#### **Bug fixes**

|Bug fixes | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Fixed issue where [Conditional Delete](././../healthcare-apis/fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop. | [#2269](https://github.com/microsoft/fhir-server/pull/2269) |
|Resolved 500 error possibly caused by a malformed transaction body in a bundle POST. We've added a check that the URL is populated in the [transaction bundle](././..//healthcare-apis/fhir/fhir-features-supported.md#rest-api) requests. | [#2255](https://github.com/microsoft/fhir-server/pull/2255) |

### **DICOM service**

|Added support | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Regions |South Brazil and Central Canada |
|Extended Query tags |DateTime (DT) and Time (TM) Value Representation (VR) types |

|Bug fixes | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Implemented fix to workspace names |Enabled DICOM service to work with workspaces that have names beginning with a letter. |

## September 2021

### FHIR service

#### **Feature enhancements**

|Enhancements | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|

|Added support for conditional patch | [Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)|
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Conditional patch | [#2163](https://github.com/microsoft/fhir-server/pull/2163) |
|Added conditional patch audit event. | [#2213](https://github.com/microsoft/fhir-server/pull/2213) |

|Allow JSON patch in bundles | [JSON patch in bundles](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-in-bundles)|
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Allows for search history bundles with Patch requests. |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enabled JSON patch in bundles using Binary resources. |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |
|Added new audit event [OperationName sub-types](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details). | [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

|Running a reindex job | [Reindex improvements](./././fhir/how-to-run-a-reindex.md)|
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters. |[#2103](https://github.com/microsoft/fhir-server/pull/2103)|
|Updated error message for reindex parameter boundaries.|[#2109](https://github.com/microsoft/fhir-server/pull/2109)|
|Adds final reindex count check. |[#2099](https://github.com/microsoft/fhir-server/pull/2099)|

#### **Bug fixes**

|Resolved patch bugs | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Wider catch for exceptions when applying patch. | [#2192](https://github.com/microsoft/fhir-server/pull/2192)|
|Fixes history with PATCH in STU3. |[#2177](https://github.com/microsoft/fhir-server/pull/2177) |

|Custom search bugs | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Addresses the delete failure with Custom Search parameters. |[#2133](https://github.com/microsoft/fhir-server/pull/2133) |
|Added retry logic while Deleting Search parameter. | [#2121](https://github.com/microsoft/fhir-server/pull/2121)|
|Set max item count in search options in SearchParameterDefinitionManager. |[#2141](https://github.com/microsoft/fhir-server/pull/2141) |
|Provides better exception if there's a bad expression in a search parameter. |[#2157](https://github.com/microsoft/fhir-server/pull/2157) |

|Resolved SQL batch reindex if one resource fails | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Updates SQL batch reindex retry logic. |[#2118](https://github.com/microsoft/fhir-server/pull/2118) |

|GitHub issues closed | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Unclear error message for conditional create with no ID. |[#2168](https://github.com/microsoft/fhir-server/issues/2168) |

### **DICOM service**

|Bug fixes | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|Implemented fix to resolve QIDO paging ordering issues. |  [#989](https://github.com/microsoft/dicom-server/pull/989) |


### **IoT connector**

|Bug fixes | Related information |
|------------------------ | -------------------------------|
|<img width=600/>|<img width=300/>|
|IoT connector normalized improvements with calculations to support and enhance health data standardization. | See: [Use device mappings](./../healthcare-apis/iot/how-to-use-device-mapping-iot.md) and [Calculated functions](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md) |

## Next steps

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)


