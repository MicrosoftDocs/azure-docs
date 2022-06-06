---
title: Azure Health Data Services monthly releases
description: This article provides details about the Azure Health Data Services monthly features and enhancements.
services: healthcare-apis
author: mikaelweave
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/13/2022
ms.author: mikaelw
---

# Release notes: Azure Health Data Services

>[!Note]
> Azure Health Data Services is Generally Available. 
>
>For more information about Azure Health Data Services Service Level Agreements, see [SLA for Azure Health Data Services](https://azure.microsoft.com/support/legal/sla/health-data-services/v1_1/).

Azure Health Data Services is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Health Data Services including the different service types (FHIR service, DICOM service, and MedTech service) that seamlessly work with one another.

## April 2022

### FHIR service

### **Features and enhancements**

|Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |Related information |
| :------------------- | ---------------: |
|FHIRPath Patch |FHIRPath Patch was added as a feature to both the Azure API for FHIR. This implements FHIRPath Patch as defined on the [HL7](http://hl7.org/fhir/fhirpatch.html) website. |
|Handles invalid header on versioned update |When the versioning policy is set to "versioned-update", we required that the most recent version of the resource is provided in the request's if-match header on an update. The specified version must be in ETag format. Previously, a 500 would be returned if the version was invalid or in an incorrect format. This update now returns a 400 Bad Request. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). |
|Bulk import in public preview |The bulk-import feature enables importing FHIR data to the FHIR server at high throughput using the $import operation. It's designed for initial data load into the FHIR server. For more information, see [Bulk-import FHIR data (Preview)](./../healthcare-apis/fhir/import-data.md). |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | ---------------: |
|Adds core to resource path |Part of the path to a string resource was accidentally removed in the versioning policy. This fix adds it back in. For more information, see [PR #2470](https://github.com/microsoft/fhir-server/pull/2470). |

### **Known issues**

For more information about the currently known issues with the FHIR service, see [Known issues: FHIR service](known-issues.md).

### DICOM service

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | ---------------: |
|Reduce the strictness of validation applied to incoming DICOM files |When value representation (VR) is a decimal string (DS)/ integer string (IS), `fo-dicom` serialization treats value as a number. Customer DICOM files could be old and contains invalid numbers. Our service blocks such file upload due to the serialization exception. For more information, see [PR #1450](https://github.com/microsoft/dicom-server/pull/1450). |
|Correctly parse a range of input in the content negotiation headers |Currently, WADO with Accept: multipart/related; type=application/dicom will throw an error. It will accept Accept: multipart/related; type="application/dicom", but they should be equivalent. For more information, see [PR #1462](https://github.com/microsoft/dicom-server/pull/1462). |
|Fixed an issue where parallel upload of images in a study could fail under certain circumstances  |Handle race conditions during parallel instance inserts in the same study. For more information, see [PR #1491](https://github.com/microsoft/dicom-server/pull/1491) and [PR #1496](https://github.com/microsoft/dicom-server/pull/1496). |

## March 2022

### Azure Health Data Services 

### **Features**

|Feature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |Related information |
| :------------------- | ---------------: |
|Private Link |The Private Link feature is now available. With Private Link, you can access Azure Health Data Services securely from your VNet as a first-party service without having to go through a public Domain Name System (DNS). For more information, see [Configure Private Link for Azure Health Data Services](./../healthcare-apis/healthcare-apis-configure-private-link.md).   |

### FHIR service

### **Features**

|Feature | Related information |
| :------------------------ | -------------------------------: |
|FHIRPath Patch |This new feature enables you to use the FHIRPath Patch operation on FHIR resources. For more information, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](./../healthcare-apis/fhir/fhir-rest-api-capabilities.md). |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | ---------------: |
|SQL timeout returns 408 |Previously, a SQL timeout would return a 500. Now a timeout in SQL will return a FHIR OperationOutcome with a 408 status code. For more information, see [PR #2497](https://github.com/microsoft/fhir-server/pull/2497). |
|Duplicate resources in search with `_include` |Fixed issue where a single resource can be returned twice in a search that has `_include`. For more information, see [PR #2448](https://github.com/microsoft/fhir-server/pull/2448). |
|PUT creates on versioned update |Fixed issue where creates with PUT resulted in an error when the versioning policy is configured to `versioned-update`. For more information, see [PR #2457](https://github.com/microsoft/fhir-server/pull/2457). |
|Invalid header handling on versioned update |Fixed issue where invalid `if-match` header would result in an HTTP 500 error. Now an HTTP Bad Request is returned instead. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). |

### MedTech service

### **Features and enhancements**

|Enhancements | Related information |
| :------------------------ | -------------------------------: |
|Events |The Events feature within Health Data Services is now generally available (GA). The Events feature allows customers to receive notifications and triggers when FHIR observations are created, updated, or deleted. For more information, see [Events message structure](events/events-message-structure.md) and [What are events?](events/events-overview.md). |
|Events documentation for Azure Health Data Services  |Updated docs to allow for better understanding, knowledge, and help for Events as it went GA. Updated troubleshooting for ease of use for the customer.  |
|One touch deploy button for MedTech service launch in the portal |Enables easier deployment and use of MedTech service for customers without the need to go back and forth between pages or interfaces.  |

## January 2022

### **Features and enhancements**

|Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |Related information |
| :------------------- | ---------------: |
|Export FHIR data behind firewalls  |This new feature enables exporting FHIR data to storage accounts behind firewalls. For more information, see [Configure export settings and set up a storage account](./././fhir/configure-export-data.md). |
|Deploy Azure Health Data Services with Azure Bicep |This new feature enables you to deploy Azure Health Data Services using Azure Bicep. For more information, see [Deploy Azure Health Data Services using Azure Bicep](deploy-healthcare-apis-using-bicep.md). |

### DICOM service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | -------------------------------: |
|Customers can define their own query tags using the Extended Query Tags feature |With Extended Query Tags feature, customers now efficiently query non-DICOM metadata for capabilities like multitenancy and cohorts. It's available for all customers in Azure Health Data Services.  |

## December 2021

### Azure Health Data Services 

### **Features and enhancements**

|Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |Related information |
| :------------------- | ---------------: |
|Quota details for support requests  |We've updated the quota details for customer support requests with the latest information. |
|Local RBAC  |We've updated the local RBAC documentation to clarify the use of the secondary tenant and the steps to disable it. |
|Deploy and configure Azure Health Data Services using scripts  |We've started the process of providing PowerShell, CLI scripts, and ARM templates to configure app registration and role assignments. Note that scripts for deploying Azure Health Data Services will be available after GA. |

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
|Returned `BadRequestException` with valid message when input JSON body is invalid |For invalid JSON body requests, the FHIR server was returning a 500 error. Now we'll return a `BadRequestException` with a valid message instead of 500. [#2239](https://github.com/microsoft/fhir-server/pull/2239) |
|Handled SQL Timeout issue |If SQL Server timed out, the PUT `/resource{id}` returned a 500 error. Now we handle the 500 error and return a timeout exception with an operation outcome. [#2290](https://github.com/microsoft/fhir-server/pull/2290) |

## November 2021

### FHIR service

#### **Feature enhancements**

| Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Related information           |
| :------------- | -----------------------------: |
|Process Patient-everything links  |We've expanded the Patient-everything capabilities to process patient links [#2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](./../healthcare-apis/fhir/patient-everything.md#processing-patient-links) documentation. |
|Added software name and version to capability statement. |In the capability statement, the software name now distinguishes if you're using Azure API for FHIR or Azure Health Data Services. The software version will now specify which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service [#2294](https://github.com/microsoft/fhir-server/pull/2294). Addresses: [#1778](https://github.com/microsoft/fhir-server/issues/1778) and [#2241](https://github.com/microsoft/fhir-server/issues/2241) |
|Compress continuation tokens |In certain instances, the continuation token was too long to be able to follow the [next link](./../healthcare-apis/fhir/overview-of-search.md#pagination) in searches and would result in a 404. To resolve this, we compressed the continuation token to ensure it stays below the size limit [#2279](https://github.com/microsoft/fhir-server/pull/2279). Addresses issue [#2250](https://github.com/microsoft/fhir-server/issues/2250). |
|FHIR service autoscale |The [FHIR service autoscale](./fhir/fhir-service-autoscale.md) is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all regions where the FHIR service is supported. |

### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | ---------------: |
|Resolved 500 error when the date was passed with a time zone. |This fixes a 500 error when a date with a time zone was passed into a datetime field [#2270](https://github.com/microsoft/fhir-server/pull/2270). |
|Resolved issue when posting a bundle with incorrect Media Type returned a 500 error. |Previously when posting a search with a key that contains certain characters, a 500 error is returned. This fixes this issue [#2264](https://github.com/microsoft/fhir-server/pull/2264), and it addresses [#2148](https://github.com/microsoft/fhir-server/issues/2148). |

### DICOM service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | -------------------------------: |
|Content-Type header now includes transfer-syntax. |This enables the user to know which transfer syntax is used in case multiple accept headers are being supplied. |

## October 2021

### Azure Health Data Services 

#### **Feature enhancements**

| Enhancements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Related information           |
| :------------- | -----------------------------: |
|Test Data Generator tool |We've updated Azure Health Data Services GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter, that can be deployed to Azure AKS for performance tests. |

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

|Allow JSON patch in bundles | [JSON patch in bundles](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#json-patch-in-bundles)|
| :------------------- | -------------------------------:|
|Allows for search history bundles with Patch requests. |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enabled JSON patch in bundles using Binary resources. |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |
|Added new audit event [OperationName subtypes](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details)| [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

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

### **MedTech service**

|Bug fixes | Related information |
|:------------------- | -------------------------------: |
| MedTech service normalized improvements with calculations to support and enhance health data standardization. | See: [Use Device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [Calculated Functions](./../healthcare-apis/iot/how-to-use-calculated-functions-mappings.md)  |

## Next steps

In this article, you learned about the features and enhancements made to Azure Health Data Services. For more information about the known issues with Azure Health Data Services, See

>[!div class="nextstepaction"]
>[Known issues: Azure Health Data Services](known-issues.md)

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)
