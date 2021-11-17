---
title: Azure Healthcare APIs monthly releases
description: This article provides details about the Azure Healthcare APIs monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/01/2021
ms.author: cavoeg
---

# Release notes: Azure Healthcare APIs

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

Azure Healthcare APIs is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Healthcare APIs including the different service types (FHIR service, DICOM service, and IoT connector) that seamlessly work with one another.

## September 2021

### FHIR service

#### **Feature enhancements**

|Enhancements | Description |
|:------------------- | -----------:|

|Added support for conditional patch | [Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)|
|:------------------- | -----------:|
|Conditional patch | [#2163](https://github.com/microsoft/fhir-server/pull/2163) |
|Add conditional patch audit event | [#2213](https://github.com/microsoft/fhir-server/pull/2213) |

|Allow JSON patch in bundles | [JSON patch in bundles](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-in-bundles)|
|:------------------- | -----------:|
|Allows for search history bundles with Patch requests |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enable JSON patch in bundles using Binary resources |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |
|Added new audit event [OperationName sub-types](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details)| [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

| Running a reindex job | [Reindex improvements](./././fhir/how-to-run-a-reindex.md)|
|:------------------- | -----------:|
|Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters|[#2103](https://github.com/microsoft/fhir-server/pull/2103)|
|Update error message for reindex parameter boundaries|[#2109](https://github.com/microsoft/fhir-server/pull/2109)|
|Adds final reindex count check |[#2099](https://github.com/microsoft/fhir-server/pull/2099)|

#### **Bug fixes**

|Resolved patch bugs | Description |
|:------------------- | -----------:|

| Wider catch for exceptions during applying patch | [#2192](https://github.com/microsoft/fhir-server/pull/2192)|
|:------------------- | -----------:|
|Fix history with PATCH in STU3 |[#2177](https://github.com/microsoft/fhir-server/pull/2177) |

|Custom search bugs |Description |
|:------------------- | -----------:|
|Addresses the delete failure with Custom Search parameters |[#2133](https://github.com/microsoft/fhir-server/pull/2133) |
|Added retry logic while Deleting Search parameter | [#2121](https://github.com/microsoft/fhir-server/pull/2121)|
|Set max item count in search options in SearchParameterDefinitionManager |[#2141](https://github.com/microsoft/fhir-server/pull/2141) |
|Better exception if there's a bad expression in a search parameter |[#2157](https://github.com/microsoft/fhir-server/pull/2157) |

|Resolved SQL batch reindex if one resource fails |Description |
|:------------------- | -----------:|
|Updates SQL batch reindex retry logic |[#2118](https://github.com/microsoft/fhir-server/pull/2118) |

|GitHub issues closed |Description |
|:------------------- | -----------:|
|Unclear error message for conditional create with no ID |[#2168](https://github.com/microsoft/fhir-server/issues/2168) |

### **DICOM service**

|Bug fixes | Description |
|:------------------- | -----------:|

|Implemented fix to resolve QIDO paging ordering issues |  [#989](https://github.com/microsoft/dicom-server/pull/989) |
|:------------------- | -----------:|

### **IoT connector**

|Bug fixes | Description |
|:------------------- | -----------:|
| IoT connector normalized improvements with calculations to support and enhance health data standardization. | See: [Use Device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [Calculated Functions](./../healthcare-apis/iot/how-to-use-calculated-functions-mappings.md)  |

## Next steps

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)
