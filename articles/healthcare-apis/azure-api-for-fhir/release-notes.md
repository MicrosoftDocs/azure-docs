---
title: Azure API for FHIR monthly releases
description: This article provides details about the Azure API for FHIR monthly features and enhancements.
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/16/2022
ms.custom: references_regions
ms.author: kavitagaddam
---

# Release notes: Azure API for FHIR

Azure API for FHIR provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

> [!Note]
> Azure Health Data services is the evolved version of Azure API for FHIR enabling customers to manage FHIR, DICOM, and MedTech services with integrations into other Azure Services. To learn about Azure Health Data Services [click here](https://azure.microsoft.com/products/health-data-services/).

## **July 2023**
**Feature enhancement: Change to the exported file name format**
FHIR service enables customers to export data with $export operation. Export can be conducted across various levels, such as System, Patient and Group of patients. There are name changes with exported file and default storage account name.
* Exported file names will follow the format \<FHIR Resource Name\>-\<Number\>- \<Number\>.ndjson. The order of the files is not guaranteed to correspond to any ordering of the resources in the database.
* Default storage account name is updated to Export-\<Number\>.

There is no change to number of resources added in individual exported files.

## **June 2023**
**Bug Fix: Metadata endpoint URL in capability statement is relative URL**
Per FHIR specification, metadata endpoint URL in capability statement needs to be an absolute URL. 
For details on FHIR specification, visit [Capability Statement](https://www.hl7.org/fhir/capabilitystatement-definitions.html#CapabilityStatement.url). This fanix addresses the issue, for details visit [3265](https://github.com/microsoft/fhir-server/pull/3265).

## **May 2023**

**SMART on FHIR : Fixed clinical scope mapping for applications**

This bug fix addresses issue with clinical scope not interpreted correctly for backend applications. 
For more details, visit [#3250](https://github.com/microsoft/fhir-server/pull/3250)

## **April 2023**

**Fixed transient issues associated with loading custom search parameters**
This bug fix address the issue, where the FHIR service would not load the latest SearchParameter status in event of failure.
For more details, visit [#3222](https://github.com/microsoft/fhir-server/pull/3222)

## **November 2022**

**Fixed the Error generated when resource is updated using if-match header and PATCH**

Bug is now fixed and Resource will be updated if matches the Etag header. For details , see [#2877](https://github.com/microsoft/fhir-server/issues/2877)|

## May 2022

### **Enhancement**

|Enhancement |Related information |
| :----------------------------------- | :--------------- |
|Azure API for FHIR does not create a new version of the resource if the resource content has not changed. |If a user updates an existing resource and only meta.versionId or meta.lastUpdated have changed then we return OK with existing resource information without updating VersionId and lastUpdated. For more information, see [#2519](https://github.com/microsoft/fhir-server/pull/2519). |

## April 2022

### **Enhancements**

|Enhancements |Related information |
| :----------------------------------- | :--------------- |
|FHIRPath Patch |FHIRPath Patch was added as a feature to both the Azure API for FHIR. This implements FHIRPath Patch as defined on the [HL7](http://hl7.org/fhir/fhirpatch.html) website. |
|Move Bundle notification to Core |With the introduction of the Resource.Bundle namespace to Core, the Resource references to the string resources file had to be made more explicit. For more information, see [PR #2478](https://github.com/microsoft/fhir-server/pull/2478). |
|Handles invalid header on versioned update |When the versioning policy is set to "versioned-update", we required that the most recent version of the resource is provided in the request's if-match header on an update. The specified version must be in ETag format. Previously, a 500 would be returned if the version was invalid or in an incorrect format. This update now returns a 400 Bad Request. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Adds core to resource path |Part of the path to a string resource was accidentally removed in the versioning policy. This fix adds it back in. For more information, see [PR #2470](https://github.com/microsoft/fhir-server/pull/2470). |
|SQL timeout is returning a 500 error |Fixed a bug when a SQL request hits a timeout and the request returns a 500. In the logs, this is a timeout from SQL compared to getting a 429 error from front end. For more information, see [PR #2497](https://github.com/microsoft/fhir-server/pull/2497). |

## March 2022

### **Features**

|Feature |Related information |
| :----------------------------------- | :--------------- |
|FHIRPath Patch |This new feature enables you to use the FHIRPath Patch operation on FHIR resources. For more information, see [FHIR REST API capabilities for Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/fhir-rest-api-capabilities.md). |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Duplicate resources in search with `_include` |Fixed issue where a single resource can be returned twice in a search that has `_include`. For more information, see [PR #2448](https://github.com/microsoft/fhir-server/pull/2448). |
|PUT creates on versioned update |Fixed issue where creates with PUT resulted in an error when the versioning policy is configured to `versioned-update`. For more information, see [PR #2457](https://github.com/microsoft/fhir-server/pull/2457). |
|Invalid header handling on versioned update |Fixed issue where invalid `if-match` header would result in an HTTP 500 error. Now an HTTP Bad Request is returned instead. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). |

## February 2022

### **Features and enhancements**

|Enhancements  |Related information |
| :----------------------------------- | :--------------- |
|Added 429 retry and logging in BundleHandler |We sometimes encounter 429 errors when processing a bundle. If the FHIR service receives a 429 at the BundleHandler layer, we abort processing of the bundle and skip the remaining resources. We've added another retry (in addition to the retry present in the data store layer) that will execute one time per resource that encounters a 429. For more about this feature enhancement, see [PR #2400](https://github.com/microsoft/fhir-server/pull/2400).|
|Billing for `$convert-data` and `$de-id` |Azure API for FHIR's data conversion and de-identified export features are now Generally Available. Billing for `$convert-data` and `$de-id` operations in Azure API for FHIR has been enabled. Billing meters were turned on March 1, 2022. |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Update compartment search index |There was a corner case where the compartment search index wasn't being set on resources. Now we use the same index as the main search for compartment search to ensure all data is being returned. For more about the code fix, see [PR #2430](https://github.com/microsoft/fhir-server/pull/2430).|


## December 2021

### **Features and enhancements**

|Enhancements |Related information |
| :------------------- | :--------------- |
|Added Publisher to `CapabiilityStatement.name` |You can now find the publisher in the capability statement at `CapabilityStatement.name`. [#2319](https://github.com/microsoft/fhir-server/pull/2319) |
|Log `FhirOperation` linked to anonymous calls to Request metrics |We weren’t logging operations that didn’t require authentication. We extended the ability to get `FhirOperation` type in `RequestMetrics` for anonymous calls. [#2295](https://github.com/microsoft/fhir-server/pull/2295) |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Fixed 500 error when `SearchParameter` Code is null |Fixed an issue with `SearchParameter` if it had a null value for Code, the result would be a 500. Now it will result in an  `InvalidResourceException` like the other values do. [#2343](https://github.com/microsoft/fhir-server/pull/2343) |
|Returned `BadRequestException` with valid message when input JSON body is invalid |For invalid JSON body requests, the FHIR server was returning a 500 error. Now we'll return a `BadRequestException` with a valid message instead of 500. [#2239](https://github.com/microsoft/fhir-server/pull/2239) |
|`_sort` can cause `ChainedSearch` to return incorrect results |Previously, the sort options from the chained search's `SearchOption` object wasn't cleared, causing the sorting options to be passed through to the chained subsearch, which aren't valid. This could result in no results when there should be results. This bug is now fixed  [#2347](https://github.com/microsoft/fhir-server/pull/2347). It addressed GitHub bug [#2344](https://github.com/microsoft/fhir-server/issues/2344). |


## November 2021

### **Features and enhancements**

|Enhancements |Related information |
| :------------------- | :--------------- |
|Process Patient-everything links  |We've expanded the Patient-everything capabilities to process patient links [#2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](../../healthcare-apis/fhir/patient-everything.md#processing-patient-links) documentation.  |
|Added software name and version to capability statement |In the capability statement, the software name now distinguishes if you're using Azure API for FHIR or Azure Health Data Services. The software version will now specify which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service [#2294](https://github.com/microsoft/fhir-server/pull/2294). Addresses: [#1778](https://github.com/microsoft/fhir-server/issues/1778) and [#2241](https://github.com/microsoft/fhir-server/issues/2241) |
|Log 500's to `RequestMetric` |Previously, 500s or any unknown/unhandled errors weren't getting logged in `RequestMetric`. They're now getting logged [#2240](https://github.com/microsoft/fhir-server/pull/2240). For more information, see [Enable diagnostic settings in Azure API for FHIR](../../healthcare-apis/azure-api-for-fhir/enable-diagnostic-logging.md) |
|Compress continuation tokens |In certain instances, the continuation token was too long to be able to follow the [next link](../../healthcare-apis/azure-api-for-fhir/overview-of-search.md#pagination) in searches and would result in a 404. To resolve this, we compressed the continuation token to ensure it stays below the size limit [#2279](https://github.com/microsoft/fhir-server/pull/2279). Addresses issue [#2250](https://github.com/microsoft/fhir-server/issues/2250). |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Resolved 500 error when the date was passed with a time zone. |This fixes a 500 error when a date with a time zone was passed into a datetime field [#2270](https://github.com/microsoft/fhir-server/pull/2270). |
|Resolved issue when posting a bundle with incorrect Media Type returned a 500 error. |Previously when posting a search with a key that contains certain characters, a 500 error was returned. This fixes this issue [#2264](https://github.com/microsoft/fhir-server/pull/2264), and it addresses [#2148](https://github.com/microsoft/fhir-server/issues/2148). |


## October 2021

### **Bug fixes**

| Infinite loop bug | Related information          |
| :----------------- | :---------------------------- |
|Fixed issue where [Conditional Delete](./././../azure-api-for-fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop. | [#2269](https://github.com/microsoft/fhir-server/pull/2269) |

## September 2021 

### **Features and enhancements**

|Enhancements |Related information |
| :------------------- | :--------------- |
|Added support for conditional patch | [Conditional patch](././../azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)|
|Conditional patch |[#2163](https://github.com/microsoft/fhir-server/pull/2163) |
|Added conditional patch audit event. |[#2213](https://github.com/microsoft/fhir-server/pull/2213) |

|Allow JSON patch in bundles | [JSON patch in bundles](././../azure-api-for-fhir/fhir-rest-api-capabilities.md#json-patch-in-bundles)|
| :----------------------------------- | :------ |
|Allows for search history bundles with Patch requests. |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enabled JSON patch in bundles using Binary resources. |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |

|New audit event subtypes |Related information |
| :----------------------------------- | :--------------- |
|Added new audit [OperationName subtypes](././../azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details).| [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

|[Reindex improvements](how-to-run-a-reindex.md) |Related information |
| :----------------------------------- | :--------------- |
|Added [boundaries for reindex](how-to-run-a-reindex.md) parameters. |[#2103](https://github.com/microsoft/fhir-server/pull/2103)|
|Update error message for reindex parameter boundaries. |[#2109](https://github.com/microsoft/fhir-server/pull/2109)|
|Added final reindex count check. |[#2099](https://github.com/microsoft/fhir-server/pull/2099)|


### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Wider catch for exceptions when applying patch. |[#2192](https://github.com/microsoft/fhir-server/pull/2192)|
|Fixes history with PATCH in STU3.| [#2177](https://github.com/microsoft/fhir-server/pull/2177)|

|Custom search bugs |Related information |
| :----------------------------------- | :--------------- |
|Addresses the delete failure with Custom Search parameters. | [#2133](https://github.com/microsoft/fhir-server/pull/2133)|
|Added retry logic while Deleting Search parameter. | [#2121](https://github.com/microsoft/fhir-server/pull/2121)|
|Set max item count in search options in SearchParameterDefinitionManager. | [#2141](https://github.com/microsoft/fhir-server/pull/2141)|
|Provides better exception if there's a bad expression in search parameter. |[#2157](https://github.com/microsoft/fhir-server/pull/2157)|

|Resolved retry 503 error |Related information |
| :----------------------------------- | :--------------- |
|Retry 503 error from Azure Cosmos DB. |[#2106](https://github.com/microsoft/fhir-server/pull/2106)|
|Fixes processing 429s from StoreProcedures. |[#2165](https://github.com/microsoft/fhir-server/pull/2165)|

|GitHub issues closed |Related information |
| :----------------------------------- | :--------------- |
|Unable to create custom search parameter for the CarePlan medical device. |[#2146](https://github.com/microsoft/fhir-server/issues/2146) |
|Unclear error message for conditional create with no ID. | [#2168](https://github.com/microsoft/fhir-server/issues/2168)|

### IoT connector for FHIR (preview)

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Fixed broken link.| Updated link to the IoT connector Azure documentation in the Azure API for FHIR portal. |

## Next steps

For information about the features and bug fixes in Azure Health Data Services (FHIR service, DICOM service, and MedTech service), see

>[!div class="nextstepaction"]
>[Release notes: Azure Health Data Services](../release-notes.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
