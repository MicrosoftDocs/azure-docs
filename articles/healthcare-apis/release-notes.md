---
title: Azure Health Data Services monthly releases
description: This article provides details about the Azure Health Data Services monthly features and enhancements.
services: healthcare-apis
author: judegnan
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/09/2022
ms.author: mikaelw
ms.custom: references_regions
---

# Release notes: Azure Health Data Services

>[!Note]
> Azure Health Data Services is Generally Available. 
>
>For more information about Azure Health Data Services Service Level Agreements, see [SLA for Azure Health Data Services](https://azure.microsoft.com/support/legal/sla/health-data-services/v1_1/).

Azure Health Data Services is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Health Data Services including the different service types (FHIR service, DICOM service, and MedTech service) that seamlessly work with one another.

## August 2022

### FHIR service

#### **Features**

| Enhancements | Related information |
| :------------------------ | :------------------------------- |
| Azure Health Data services availability expands to new regions | Azure Health Data services is now available in the following regions:  Central India, Korea Central, and Sweden Central.   
| `$import` is generally available. | `$import` API is now generally available in Azure Health Data Services API version 2022-06-01. See [Executing the import](./../healthcare-apis/fhir/import-data.md) by invoking the `$import` operation on FHIR service in Azure Health Data Services.
| `$convert-data` updated by adding STU3-R4 support. |`$convert-data` added support for FHIR STU3-R4 conversion. See [Data conversion for Azure API for FHIR](./../healthcare-apis/azure-api-for-fhir/convert-data.md). |  
| Analytics pipeline now supports data filtering. | Data filtering is now supported in FHIR to data lake pipeline. See [FHIR-Analytics-Pipelines_Filter FHIR data](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Filter%20FHIR%20data%20in%20pipeline.md) microsoft/FHIR-Analytics-Pipelines github.com. |
| Analytics pipeline now supports FHIR extensions. | Analytics pipeline can process FHIR extensions to generate parquet data. See [FHIR-Analytics-Pipelines_Process](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Process%20FHIR%20extensions.md) in pipeline.md at main.

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
| History bundles were sorted with the oldest version first |We've recently identified an issue with the sorting order of history bundles on FHIR® server. History bundles were sorted with the oldest version first. Per FHIR specification, the sorting of versions defaults to the oldest version last. <br><br>This bug fix, addresses FHIR server behavior for sorting history bundle. <br><br>We understand if you would like to keep the sorting per existing behavior (oldest version first). To support existing behavior, we recommend you append `_sort=_lastUpdated` to the HTTP GET command utilized for retrieving history. <br><br>For example: `<server URL>/_history?_sort=_lastUpdated` <br><br>For more information, see [#2689](https://github.com/microsoft/fhir-server/pull/2689).  |
| Queries not providing consistent result count after appended with `_sort` operator. | Issue is now fixed and queries should provide consistent result count, with and without sort operator. 

#### **Known issues**

| Known Issue | Description |
| :------------------------ | :------------------------------- |
| Using [token type fields](https://www.hl7.org/fhir/search.html#token) of more than 128 characters in length can result in undesired behavior on `create`, `search`, `update`, and `delete` operations.  | Currently, no workaround available. |

For more information about the currently known issues with the FHIR service, see [Known issues: FHIR service](known-issues.md).

### MedTech service

#### **Features and enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|New Metric Chart  |Customers can now see predefined metrics graphs in the MedTech landing page, complete with alerts to ease customers' burden of monitoring their MedTech service.  |
|Availability of Diagnostic Logs  |There are now pre-defined queries with relevant logs for common issues so that customers can easily debug and diagnose issues in their MedTech service.   |

### DICOM service

#### **Features and enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|Modality worklists (UPS-RS) is GA.   |The modality worklists (UPS-RS) service is now generally available. Learn more about the [worklists service](https://github.com/microsoft/dicom-server/blob/main/docs/resources/conformance-statement.md#worklist-service-ups-rs).  |

## July 2022

### FHIR service

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
| (Open Source) History bundles were sorted with the oldest version first.   | We've recently identified an issue with the sorting order of history bundles on FHIR® server. History bundles were sorted with the oldest version first. Per [FHIR specification](https://hl7.org/fhir/http.html#history), the sorting of versions defaults to the oldest version last. This bug fix, addresses FHIR server behavior for sorting history bundle.<br /><br />We understand if you would like to keep the sorting per existing behavior (oldest version first). To support existing behavior, we recommend you append `_sort=_lastUpdated` to the HTTP `GET` command utilized for retrieving history. <br /><br />For example: `<server URL>/_history?_sort=_lastUpdated` <br /><br />For more information, see [#2689](https://github.com/microsoft/fhir-server/pull/2689). 

#### **Known issues**

| Known Issue | Description |
| :------------------------ | :------------------------------- |
| Using [token type fields](https://www.hl7.org/fhir/search.html#token) of more than 128 characters in length can result in undesired behavior on `create`, `search`, `update`, and `delete` operations.  | Currently, no workaround available. |
| Queries not providing consistent result count after appended with `_sort` operator. For more information, see [#2680](https://github.com/microsoft/fhir-server/pull/2680). | Currently, no workaround available.|

For more information about the currently known issues with the FHIR service, see [Known issues: FHIR service](known-issues.md).

### MedTech service 

#### **Improvements**

|Azure Health Data Services  |Related information |
| :----------------------------------- | :--------------- |
|Improvements to documentations for Events and MedTech and availability zones.  |Tested and enhanced usability and functionality. Added new documents to enable customers to better take advantage of the new improvements. See [Consume Events with Logic Apps](./../healthcare-apis/events/events-deploy-portal.md) and [Deploy Events Using the Azure portal](./../healthcare-apis/events/events-deploy-portal.md). | 
|One touch launch Azure MedTech deploy. |[Deploy the MedTech Service in the Azure portal](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md)|

### DICOM service

#### **Features**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|DICOM Service availability expands to new regions.   | The DICOM Service is now available in the following [regions](https://azure.microsoft.com/global-infrastructure/services/): Southeast Asia, Central India, Korea Central, and Switzerland North. |
|Fast retrieval of individual DICOM frames    | For DICOM images containing multiple frames, performance improvements have been made to enable fast retrieval of individual frames (60 KB frames as fast as 60 MS). These improved performance characteristics enable workflows such as [viewing digital pathology images](https://microsofthealth.visualstudio.com/DefaultCollection/Health/_git/marketing-azure-docs?version=GBmain&path=%2Fimaging%2Fdigital-pathology%2FDigital%20Pathology%20using%20Azure%20DICOM%20service.md&_a=preview), which require rapid retrieval of individual frames.    |

## June 2022

### FHIR service

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Export Job not being queued for execution.  |Fixes issue with export job not being queued due to duplicate job definition caused due to reference to container URL. For more information, see [#2648](https://github.com/microsoft/fhir-server/pull/2648). |
|Queries not providing consistent result count after appended with the `_sort` operator.   |Fixes the issue with the help of distinct operator to resolve inconsistency and record duplication in response.  For more information, see [#2680](https://github.com/microsoft/fhir-server/pull/2680). |


## May 2022

### FHIR service

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Removes SQL retry on upsert  |Removes retry on SQL command for upsert. The error still occurs, but data is saved correctly in success cases. For more information, see [#2571](https://github.com/microsoft/fhir-server/pull/2571). |
|Added handling for SqlTruncate errors  |Added a check for SqlTruncate exceptions and tests. In particular, exceptions and tests will catch SqlTruncate exceptions for Decimal type based on the specified precision and scale. For more information, see [#2553](https://github.com/microsoft/fhir-server/pull/2553). |

### DICOM service

#### **Features**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|DICOM service supports cross-origin resource sharing (CORS)  |DICOM service now supports [CORS](./../healthcare-apis/dicom/configure-cross-origin-resource-sharing.md). CORS allows you to configure settings so that applications from one domain (origin) can access resources from a different domain, known as a cross-domain request. |
|DICOMcast supports Private Link   |DICOMcast has been updated to support Azure Health Data Services workspaces that have been configured to use [Private Link](./../healthcare-apis/healthcare-apis-configure-private-link.md). |
|UPS-RS supports Change and Retrieve work item  |Modality worklist (UPS-RS) endpoints have been added to support Change and Retrieve operations for work items. |
|API version is now required as part of the URI  |All REST API requests to the DICOM service must now include the API version in the URI. For more information, see [API versioning for DICOM service](./../healthcare-apis/dicom/api-versioning-dicom-service.md). |

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Index the first value for DICOM tags that incorrectly specify multiple values |Attributes that are defined to have a single value but have specified multiple values will now be leniently accepted. The first value for such attributes will be indexed. |

## April 2022

### FHIR service

#### **Features and enhancements**

|Enhancements |Related information |
| :------------------- | :--------------- |
|FHIRPath Patch |FHIRPath Patch was added as a feature to both the Azure API for FHIR. This implements FHIRPath Patch as defined on the [HL7](http://hl7.org/fhir/fhirpatch.html) website. |
|Handles invalid header on versioned update |When the versioning policy is set to "versioned-update", we required that the most recent version of the resource is provided in the request's if-match header on an update. The specified version must be in ETag format. Previously, a 500 would be returned if the version was invalid or in an incorrect format. This update now returns a 400 Bad Request. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). |
|Bulk import in public preview |The bulk-import feature enables importing FHIR data to the FHIR server at high throughput using the $import operation. It's designed for initial data load into the FHIR server. For more information, see [Bulk-import FHIR data (Preview)](./../healthcare-apis/fhir/import-data.md). |

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Adds core to resource path |Part of the path to a string resource was accidentally removed in the versioning policy. This fix adds it back in. For more information, see [PR #2470](https://github.com/microsoft/fhir-server/pull/2470). |

#### **Known issues**

For more information about the currently known issues with the FHIR service, see [Known issues: FHIR service](known-issues.md).

### DICOM service

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Reduce the strictness of validation applied to incoming DICOM files |When value representation (VR) is a decimal string (DS)/ integer string (IS), `fo-dicom` serialization treats value as a number. Customer DICOM files could be old and contains invalid numbers. Our service blocks such file upload due to the serialization exception. For more information, see [PR #1450](https://github.com/microsoft/dicom-server/pull/1450). |
|Correctly parse a range of input in the content negotiation headers |Currently, WADO with Accept: multipart/related; type=application/dicom will throw an error. It will accept Accept: multipart/related; type="application/dicom", but they should be equivalent. For more information, see [PR #1462](https://github.com/microsoft/dicom-server/pull/1462). |
|Fixed an issue where parallel upload of images in a study could fail under certain circumstances  |Handle race conditions during parallel instance inserts in the same study. For more information, see [PR #1491](https://github.com/microsoft/dicom-server/pull/1491) and [PR #1496](https://github.com/microsoft/dicom-server/pull/1496). |

## March 2022

### Azure Health Data Services 

#### **Features**

|Feature |Related information |
| :------------------- | :--------------- |
|Private Link |The Private Link feature is now available. With Private Link, you can access Azure Health Data Services securely from your VNet as a first-party service without having to go through a public Domain Name System (DNS). For more information, see [Configure Private Link for Azure Health Data Services](./../healthcare-apis/healthcare-apis-configure-private-link.md).   |

### FHIR service

#### **Features**

|Feature | Related information |
| :------------------------ | :------------------------------- |
|FHIRPath Patch |This new feature enables you to use the FHIRPath Patch operation on FHIR resources. For more information, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](./../healthcare-apis/fhir/fhir-rest-api-capabilities.md). |

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|SQL timeout returns 408 |Previously, a SQL timeout would return a 500. Now a timeout in SQL will return a FHIR OperationOutcome with a 408 status code. For more information, see [PR #2497](https://github.com/microsoft/fhir-server/pull/2497). |
|Duplicate resources in search with `_include` |Fixed issue where a single resource can be returned twice in a search that has `_include`. For more information, see [PR #2448](https://github.com/microsoft/fhir-server/pull/2448). |
|PUT creates on versioned update |Fixed issue where creates with PUT resulted in an error when the versioning policy is configured to `versioned-update`. For more information, see [PR #2457](https://github.com/microsoft/fhir-server/pull/2457). |
|Invalid header handling on versioned update |Fixed issue where invalid `if-match` header would result in an HTTP 500 error. Now an HTTP Bad Request is returned instead. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). |

### MedTech service

#### **Features and enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|Events |The Events feature within Health Data Services is now generally available (GA). The Events feature allows customers to receive notifications and triggers when FHIR observations are created, updated, or deleted. For more information, see [Events message structure](./../healthcare-apis/events/events-message-structure.md) and [What are events?](./../healthcare-apis/events/events-overview.md). |
|Events documentation for Azure Health Data Services  |Updated docs to allow for better understanding, knowledge, and help for Events as it went GA. Updated troubleshooting for ease of use for the customer.  |
|One touch deploy button for MedTech service launch in the portal |Enables easier deployment and use of MedTech service for customers without the need to go back and forth between pages or interfaces.  |

## January 2022

#### **Features and enhancements**

|Enhancement  |Related information |
| :------------------- | :--------------- |
|Export FHIR data behind firewalls  |This new feature enables exporting FHIR data to storage accounts behind firewalls. For more information, see [Configure export settings and set up a storage account](./././fhir/configure-export-data.md). |
|Deploy Azure Health Data Services with Azure Bicep |This new feature enables you to deploy Azure Health Data Services using Azure Bicep. For more information, see [Deploy Azure Health Data Services using Azure Bicep](deploy-healthcare-apis-using-bicep.md). |

### DICOM service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|Customers can define their own query tags using the Extended Query Tags feature |With Extended Query Tags feature, customers now efficiently query non-DICOM metadata for capabilities like multi-tenancy and cohorts. It's available for all customers in Azure Health Data Services.  |

## December 2021

### Azure Health Data Services 

#### **Features and enhancements**

|Enhancements |Related information |
| :------------------- | :--------------- |
|Quota details for support requests  |We've updated the quota details for customer support requests with the latest information. |
|Local RBAC  |We've updated the local RBAC documentation to clarify the use of the secondary tenant and the steps to disable it. |
|Deploy and configure Azure Health Data Services using scripts  |We've started the process of providing PowerShell, CLI scripts, and ARM templates to configure app registration and role assignments. Scripts for deploying Azure Health Data Services will be available after GA. |

### FHIR service

#### **Features and enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|Added Publisher to `CapabilityStatement.name` |You can now find the publisher in the capability statement at `CapabilityStatement.name`. [#2319](https://github.com/microsoft/fhir-server/pull/2319) |
|Log `FhirOperation` linked to anonymous calls to Request metrics |We weren't logging operations that didn’t require authentication. We extended the ability to get `FhirOperation` type in `RequestMetrics` for anonymous calls. [#2295](https://github.com/microsoft/fhir-server/pull/2295) |

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Fixed 500 error when `SearchParameter` Code is null |Fixed an issue with `SearchParameter` if it had a null value for Code, the result would be a 500. Now it will result in an  `InvalidResourceException` like the other values do. [#2343](https://github.com/microsoft/fhir-server/pull/2343) |
|Returned `BadRequestException` with valid message when input JSON body is invalid |For invalid JSON body requests, the FHIR server was returning a 500 error. Now we'll return a `BadRequestException` with a valid message instead of 500. [#2239](https://github.com/microsoft/fhir-server/pull/2239) |
|Handled SQL Timeout issue |If SQL Server timed out, the PUT `/resource{id}` returned a 500 error. Now we handle the 500 error and return a timeout exception with an operation outcome. [#2290](https://github.com/microsoft/fhir-server/pull/2290) |

## November 2021

### FHIR service

#### **Feature enhancements**

| Enhancements  | Related information           |
| :------------- | :----------------------------- |
|Process Patient-everything links  |We've expanded the Patient-everything capabilities to process patient links [#2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](./../healthcare-apis/fhir/patient-everything.md#processing-patient-links) documentation. |
|Added software name and version to capability statement. |In the capability statement, the software name now distinguishes if you're using Azure API for FHIR or Azure Health Data Services. The software version will now specify which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service [#2294](https://github.com/microsoft/fhir-server/pull/2294). Addresses: [#1778](https://github.com/microsoft/fhir-server/issues/1778) and [#2241](https://github.com/microsoft/fhir-server/issues/2241) |
|Compress continuation tokens |In certain instances, the continuation token was too long to be able to follow the [next link](./../healthcare-apis/fhir/overview-of-search.md#pagination) in searches and would result in a 404. To resolve this, we compressed the continuation token to ensure it stays below the size limit [#2279](https://github.com/microsoft/fhir-server/pull/2279). Addresses issue [#2250](https://github.com/microsoft/fhir-server/issues/2250). |
|FHIR service autoscale |The [FHIR service autoscale](./fhir/fhir-service-autoscale.md) is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all [regions](https://azure.microsoft.com/global-infrastructure/services/) where the FHIR service is supported. |

#### **Bug fixes**

|Bug fixes |Related information |
| :----------------------------------- | :--------------- |
|Resolved 500 error when the date was passed with a time zone. |This fix addresses a 500 error when a date with a time zone was passed into a datetime field [#2270](https://github.com/microsoft/fhir-server/pull/2270). |
|Resolved issue when posting a bundle with incorrect Media Type returned a 500 error. |Previously when posting a search with a key that contains certain characters, a 500 error is returned. This fixes issue [#2264](https://github.com/microsoft/fhir-server/pull/2264) and addresses [#2148](https://github.com/microsoft/fhir-server/issues/2148). |

### DICOM service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|Content-Type header now includes transfer-syntax. |This enhancement enables the user to know which transfer syntax is used in case multiple accept headers are being supplied. |

## October 2021

### Azure Health Data Services 

#### **Feature enhancements**

| Enhancements  | Related information           |
| :------------- | :----------------------------- |
|Test Data Generator tool |We've updated Azure Health Data Services GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter that can be deployed to Azure AKS for performance tests. |

### FHIR service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------------ | :------------------------------- |
|Added support for [_sort](././../healthcare-apis/fhir/overview-of-search.md#search-result-parameters) on strings and dateTime. |[#2169](https://github.com/microsoft/fhir-server/pull/2169)  |

#### **Bug fixes**

|Bug fixes | Related information |
| :------------------------ | :------------------------------- |
|Fixed issue where [Conditional Delete](././../healthcare-apis/fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop. | [#2269](https://github.com/microsoft/fhir-server/pull/2269) |
|Resolved 500 error possibly caused by a malformed transaction body in a bundle POST. We've added a check that the URL is populated in the [transaction bundle](././..//healthcare-apis/fhir/fhir-features-supported.md#rest-api) requests. | [#2255](https://github.com/microsoft/fhir-server/pull/2255) |

### **DICOM service**

|Added support | Related information |
| :------------------------ | :------------------------------- |
|Regions | South Brazil and Central Canada. For more information about Azure regions and availability zones, see [Azure services that support availability zones](https://azure.microsoft.com/global-infrastructure/services/). |
|Extended Query tags |DateTime (DT) and Time (TM) Value Representation (VR) types |

|Bug fixes | Related information |
| :------------------------ | :------------------------------- |
|Implemented fix to workspace names. |Enabled DICOM service to work with workspaces that have names beginning with a letter. |

## September 2021

### FHIR service

#### **Feature enhancements**

|Enhancements | Related information |
| :------------------- | :------------------------------- |
|Added support for conditional patch | [Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)|
|Conditional patch | [#2163](https://github.com/microsoft/fhir-server/pull/2163) |
|Added conditional patch audit event. | [#2213](https://github.com/microsoft/fhir-server/pull/2213) |

|Allow JSON patch in bundles | [JSON patch in bundles](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#json-patch-in-bundles)|
| :------------------- | :-------------------------------|
|Allows for search history bundles with Patch requests. |[#2156](https://github.com/microsoft/fhir-server/pull/2156) | 
|Enabled JSON patch in bundles using Binary resources. |[#2143](https://github.com/microsoft/fhir-server/pull/2143) |
|Added new audit event [OperationName subtypes](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details)| [#2170](https://github.com/microsoft/fhir-server/pull/2170) |

| Running a reindex job | [Re-index improvements](./././fhir/how-to-run-a-reindex.md)|
| :------------------- | :-------------------------------|
|Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters. |[#2103](https://github.com/microsoft/fhir-server/pull/2103)|
|Updated error message for reindex parameter boundaries. |[#2109](https://github.com/microsoft/fhir-server/pull/2109)|
|Added final reindex count check. |[#2099](https://github.com/microsoft/fhir-server/pull/2099)|

#### **Bug fixes**

|Bug fixes | Related information |
| :------------------- | :-------------------------------- |
| Wider catch for exceptions during applying patch | [#2192](https://github.com/microsoft/fhir-server/pull/2192)|
|Fix history with PATCH in STU3 |[#2177](https://github.com/microsoft/fhir-server/pull/2177) |

|Custom search bugs | Related information |
| :------------------- | :------------------------------- |
|Addresses the delete failure with Custom Search parameters |[#2133](https://github.com/microsoft/fhir-server/pull/2133) |
|Added retry logic while Deleting Search parameter | [#2121](https://github.com/microsoft/fhir-server/pull/2121)|
|Set max item count in search options in SearchParameterDefinitionManager |[#2141](https://github.com/microsoft/fhir-server/pull/2141) |
|Better exception if there's a bad expression in a search parameter |[#2157](https://github.com/microsoft/fhir-server/pull/2157) |

|Resolved SQL batch reindex if one resource fails | Related information |
| :------------------- | :------------------------------- |
|Updates SQL batch reindex retry logic |[#2118](https://github.com/microsoft/fhir-server/pull/2118) |

|GitHub issues closed | Related information |
| :------------------- | :------------------------------- |
|Unclear error message for conditional create with no ID |[#2168](https://github.com/microsoft/fhir-server/issues/2168) |

### **DICOM service**

#### **Bug fixes**

|Bug fixes | Related information |
| :------------------- | :------------------------------- |

|Implemented fix to resolve QIDO paging-ordering issues |  [#989](https://github.com/microsoft/dicom-server/pull/989) |
| :------------------- | :------------------------------- |

### **MedTech service**

#### **Bug fixes**

|Bug fixes | Related information |
| :------------------- | :------------------------------- |
| MedTech service normalized improvements with calculations to support and enhance health data standardization. | See [Use Device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [Calculated Functions](./../healthcare-apis/iot/how-to-use-calculated-functions-mappings.md)  |

## Next steps

In this article, you learned about the features and enhancements made to Azure Health Data Services. For more information about the known issues with Azure Health Data Services, see

>[!div class="nextstepaction"]
>[Known issues: Azure Health Data Services](known-issues.md)

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
