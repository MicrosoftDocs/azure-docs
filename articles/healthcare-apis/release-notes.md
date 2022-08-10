---
title: Azure Healthcare APIs monthly releases
description: This article provides details about the Azure Healthcare APIs monthly features and enhancements.
services: healthcare-apis
author: caitlinv39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 01/11/2022
ms.author: cavoeg
---

# Release notes: Azure Healthcare APIs

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

Azure Healthcare APIs is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Healthcare APIs including the different service types (FHIR service, DICOM service, and IoT connector) that seamlessly work with one another.

## December 2021

### Azure Healthcare APIs 

### **Features and enhancements**

|Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |Related information |
| :------------------- | ---------------: |
|Quota details for support requests  |We've updated the quota details for customer support requests with the latest information. |
|Local RBAC  |We've updated the local RBAC documentation to clarify the use of the secondary tenant and the steps to disable it. |
|Deploy and configure Healthcare APIs using scripts  |We've started the process of providing PowerShell, CLI scripts, and ARM templates to configure app registration and role assignments. Note that scripts for deploying Healthcare APIs will be available after GA. |

### FHIR service

### **Features and enhancements**

|Enhancements | Related information |
| :------------------------ | -------------------------------: |
|Added Publisher to `CapabiilityStatement.name` |You can now find the publisher in the capability statement at `CapabilityStatement.name`. [#2319](https://github.com/microsoft/fhir-server/pull/2319) |
|Log `FhirOperation` linked to anonymous calls to Request metrics |We weren’t logging operations that didn’t require authentication. We extended the ability to get `FhirOperation` type in `RequestMetrics` for anonymous calls. [#2295](https://github.com/microsoft/fhir-server/pull/2295) |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | ---------------: |
|Fixed 500 error when `SearchParameter` Code is null |Fixed an issue with `SearchParameter` if it had a null value for Code, the result would be a 500. Now it will result in an  `InvalidResourceException` like the other values do. [#2343](https://github.com/microsoft/fhir-server/pull/2343) |
|Returned `BadRequestException` with valid message when input JSON body is invalid |For invalid JSON body requests, the FHIR server was returning a 500 error. Now we will return a `BadRequestException` with a valid message instead of 500. [#2239](https://github.com/microsoft/fhir-server/pull/2239) |
|Handled SQL Timeout issue |If SQL Server timed out, the PUT `/resource{id}` returned a 500 error. Now we handle the 500 error and return a timeout exception with an operation outcome. [#2290](https://github.com/microsoft/fhir-server/pull/2290) |

## November 2021

### FHIR service

#### **Feature Enhancements**

| Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Related information           |
| :------------- | -----------------------------: |
|Process Patient-everything links  |We've expanded the Patient-everything capabilities to process patient links [#2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](./../healthcare-apis/fhir/patient-everything.md#processing-patient-links) documentation. |
|Added software name and version to capability statement. |In the capability statement, the software name now distinguishes if you're using Azure API for FHIR or Azure Healthcare APIs. The software version will now specify which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service [#2294](https://github.com/microsoft/fhir-server/pull/2294). Addresses: [#1778](https://github.com/microsoft/fhir-server/issues/1778) and [#2241](https://github.com/microsoft/fhir-server/issues/2241) |
|Compress continuation tokens |In certain instances, the continuation token was too long to be able to follow the [next link](./../healthcare-apis/fhir/overview-of-search.md#pagination) in searches and would result in a 404. To resolve this, we compressed the continuation token to ensure it stays below the size limit [#2279](https://github.com/microsoft/fhir-server/pull/2279). Addresses issue [#2250](https://github.com/microsoft/fhir-server/issues/2250). |
|FHIR service autoscale |The [FHIR service autoscale](./fhir/fhir-service-autoscale.md) is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all regions where the FHIR service is supported. |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | ---------------: |
|Resolved 500 error when the date was passed with a time zone. |This fixes a 500 error when a date with a time zone was passed into a datetime field [#2270](https://github.com/microsoft/fhir-server/pull/2270). |
|Resolved issue where posting a bundle with incorrect Media Type returned a 500 error. |Previously when posting a search with a key that contains certain characters, a 500 error is returned. This fixes this issue [#2264](https://github.com/microsoft/fhir-server/pull/2264), and it addresses [#2148](https://github.com/microsoft/fhir-server/issues/2148). |

### DICOM service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | -------------------------------: |
|Content-Type header now includes transfer-syntax. |This enables the user to know which transfer syntax is used in case multiple accept headers are being supplied. |

## October 2021

### Azure Healthcare APIs 

#### **Feature Enhancements**

| Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Related information           |
| :------------- | -----------------------------: |
|Test Data Generator tool |We've updated the Healthcare APIs  GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter, that can be deployed to Azure AKS for performance tests. |

### FHIR service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | -------------------------------: |
|Added support for [_sort](././../healthcare-apis/fhir/overview-of-search.md#search-result-parameters) on strings and dateTime. |[#2169](https://github.com/microsoft/fhir-server/pull/2169)  |

#### **Bug fixes**

|Bug fixes | Related information |
| :------------------------ | -------------------------------: |
|Fixed issue where [Conditional Delete](././../healthcare-apis/fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop. | [#2269](https://github.com/microsoft/fhir-server/pull/2269) |
|Resolved 500 error possibly caused by a malformed transaction body in a bundle POST. We've added a check that the URL is populated in the [transaction bundle](././..//healthcare-apis/fhir/fhir-features-supported.md#rest-api) requests. | [#2255](https://github.com/microsoft/fhir-server/pull/2255) |

### **DICOM service**

|Added support | Related information |
| :------------------------ | -------------------------------: |
|Regions | South Brazil and Central Canada. For more information about Azure regions and availability zones, see [Azure services that support availability zones](./../availability-zones/az-region.md). |
|Extended Query tags |DateTime (DT) and Time (TM) Value Representation (VR) types |

|Bug fixes | Related information |
| :------------------------ | -------------------------------: |
|Implemented fix to workspace names. |Enabled DICOM service to work with workspaces that have names beginning with a letter. |

## September 2021

### FHIR service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------- | -------------------------------: |

|Added support for conditional patch | [Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)|
| :------------------- | -------------------------------:|
|Conditional patch | [#2163](https://github.com/microsoft/fhir-server/pull/2163) |
|Added conditional patch audit event. | [#2213](https://github.com/microsoft/fhir-server/pull/2213) |

|Allow JSON patch in bundles | [JSON patch in bundles](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-in-bundles)|
| :------------------- | -------------------------------:|
|Allows for search history bundles with Patch requests. |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enabled JSON patch in bundles using Binary resources. |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |
|Added new audit event [OperationName sub-types](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details)| [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

| Running a reindex job | [Reindex improvements](./././fhir/how-to-run-a-reindex.md)|
| :------------------- | -------------------------------:|
|Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters. |[#2103](https://github.com/microsoft/fhir-server/pull/2103)|
|Updated error message for reindex parameter boundaries. |[#2109](https://github.com/microsoft/fhir-server/pull/2109)|
|Added final reindex count check. |[#2099](https://github.com/microsoft/fhir-server/pull/2099)|

#### **Bug fixes**

|Bug fixes | Related information |
| :------------------- | --------------------------------: |
| Wider catch for exceptions during applying patch | [#2192](https://github.com/microsoft/fhir-server/pull/2192)|
|Fix history with PATCH in STU3 |[#2177](https://github.com/microsoft/fhir-server/pull/2177) |

|Custom search bugs | Related information |
| :------------------- | -------------------------------: |
|Addresses the delete failure with Custom Search parameters |[#2133](https://github.com/microsoft/fhir-server/pull/2133) |
|Added retry logic while Deleting Search parameter | [#2121](https://github.com/microsoft/fhir-server/pull/2121)|
|Set max item count in search options in SearchParameterDefinitionManager |[#2141](https://github.com/microsoft/fhir-server/pull/2141) |
|Better exception if there's a bad expression in a search parameter |[#2157](https://github.com/microsoft/fhir-server/pull/2157) |

|Resolved SQL batch reindex if one resource fails | Related information |
| :------------------- | -------------------------------: |
|Updates SQL batch reindex retry logic |[#2118](https://github.com/microsoft/fhir-server/pull/2118) |

|GitHub issues closed | Related information |
| :------------------- | -------------------------------: |
|Unclear error message for conditional create with no ID |[#2168](https://github.com/microsoft/fhir-server/issues/2168) |

### **DICOM service**

|Bug fixes | Related information |
| :------------------- | -------------------------------: |

|Implemented fix to resolve QIDO paging-ordering issues |  [#989](https://github.com/microsoft/dicom-server/pull/989) |
| :------------------- | -------------------------------: |

### **IoT connector**

|Bug fixes | Related information |
|:------------------- | -------------------------------: |
| IoT connector normalized improvements with calculations to support and enhance health data standardization. | See: [Use Device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [Calculated Functions](./../healthcare-apis/iot/how-to-use-calculated-functions-mappings.md)  |

## Next steps

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)
