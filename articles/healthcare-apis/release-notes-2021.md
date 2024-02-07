---
title: Release notes archive for Azure Health Data Services monthly releases 2021
description: Explore the archive of Azure Health Data Services release notes for 2021. Learn about the features and enhancements introduced in FHIR, DICOM, and MedTech services to help you manage and analyze health data. 
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 02/15/2024
ms.author: kavitagaddam 
ms.custom: references_regions
---

# Release notes: Azure Health Data Services 2021

This article describes features and enhancements introduced in 2021 for the FHIR&reg; service, DICOM&reg; service, or MedTech service in Azure Health Data Services.

> [!NOTE]
> Azure Health Data Services is generally available. For more information, see the [Service Level Agreement (SLA) for Azure Health Data Services](https://azure.microsoft.com/support/legal/sla/health-data-services/v1_1/).

## December 2021

### Azure Health Data Services 


**Quota details for support requests**
We've updated the quota details for customer support requests with the latest information. 

**Local RBAC documentation updated **

We've updated the local RBAC documentation to clarify the use of the secondary tenant and the steps to disable it. 

**Deploy and configure Azure Health Data Services using scripts**

We've started the process of providing PowerShell, CLI scripts, and ARM templates to configure app registration and role assignments. Scripts for deploying Azure Health Data Services will be available after GA. 

### FHIR service


**Added Publisher to `CapabilityStatement.name`**

You can find the publisher in the capability statement at `CapabilityStatement.name`. [#2319](https://github.com/microsoft/fhir-server/pull/2319) 


**Log `FhirOperation` linked to anonymous calls to Request metrics**

 We weren't logging operations that didn’t require authentication. We extended the ability to get `FhirOperation` type in `RequestMetrics` for anonymous calls. [#2295](https://github.com/microsoft/fhir-server/pull/2295) 

**Fixed 500 error when `SearchParameter` Code is null**

Fixed an issue with `SearchParameter` if it had a null value for Code, the result would be a 500. Now it results in an `InvalidResourceException` like the other values do. [#2343](https://github.com/microsoft/fhir-server/pull/2343)
 
**Returned `BadRequestException` with valid message when input JSON body is invalid**

For invalid JSON body requests, the FHIR server was returning a 500 error. Now the server returns a `BadRequestException` with a valid message instead of 500. [#2239](https://github.com/microsoft/fhir-server/pull/2239) 


**Handled SQL Timeout issue**

If SQL Server timed out, the PUT `/resource{id}` returned a 500 error. Now we handle the 500 error and return a timeout exception with an operation outcome. [#2290](https://github.com/microsoft/fhir-server/pull/2290) 

## November 2021

### FHIR service

**Process Patient-everything links**

We've expanded the Patient-everything capabilities to process patient links [#2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](./../healthcare-apis/fhir/patient-everything.md#processing-patient-links) documentation. 

**Added software name and version to capability statement.**
In the capability statement, the software name distinguishes if you're using Azure API for FHIR or Azure Health Data Services. The software version specifies which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service [#2294](https://github.com/microsoft/fhir-server/pull/2294). Addresses: [#1778](https://github.com/microsoft/fhir-server/issues/1778) and [#2241](https://github.com/microsoft/fhir-server/issues/2241) 


**Compress continuation tokens**

In certain instances, the continuation token was too long to be able to follow the [next link](./../healthcare-apis/fhir/overview-of-search.md#pagination) in searches and would result in a 404. To resolve the issue, we compressed the continuation token to ensure it stays below the size limit [#2279](https://github.com/microsoft/fhir-server/pull/2279). Addresses issue [#2250](https://github.com/microsoft/fhir-server/issues/2250). 

**FHIR service autoscale**

The [FHIR service autoscale](./fhir/fhir-service-autoscale.md) is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all [regions](https://azure.microsoft.com/global-infrastructure/services/) where the FHIR service is supported. 


**Resolved 500 error when the date was passed with a time zone.**

This fix addresses a 500 error when a date with a time zone was passed into a datetime field [#2270](https://github.com/microsoft/fhir-server/pull/2270). 


**Resolved issue when posting a bundle with incorrect Media Type returned a 500 error.**

Previously when posting a search with a key that contains certain characters, a 500 error is returned. This fixes issue [#2264](https://github.com/microsoft/fhir-server/pull/2264) and addresses [#2148](https://github.com/microsoft/fhir-server/issues/2148). 

### DICOM service

**Content-Type header includes transfer-syntax.**

This enhancement enables the user to know which transfer syntax is used in case multiple accept headers are being supplied. 

## October 2021

### Azure Health Data Services 

**Test Data Generator tool**

We've updated Azure Health Data Services GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter that can be deployed to Azure AKS for performance tests. 

### FHIR service

**Added support for [_sort](././../healthcare-apis/fhir/overview-of-search.md#search-result-parameters) on strings and dateTime.**
[#2169](https://github.com/microsoft/fhir-server/pull/2169) 


**Fixed issue where [Conditional Delete](././../healthcare-apis/fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop.**[#2269](https://github.com/microsoft/fhir-server/pull/2269) 


**Resolved 500 error possibly caused by a malformed transaction body in a bundle POST.** We've added a check that the URL is populated in the [transaction bundle](././..//healthcare-apis/fhir/fhir-features-supported.md#rest-api) requests.**[#2255](https://github.com/microsoft/fhir-server/pull/2255) 

### DICOM service


**Regions**

**South Brazil and Central Canada.** For more information about Azure regions and availability zones, see [Azure services that support availability zones](https://azure.microsoft.com/global-infrastructure/services/). 


**Extended Query tags**
DateTime (DT) and Time (TM) Value Representation (VR) types 


**Implemented fix to workspace names.**
Enabled DICOM service to work with workspaces that have names beginning with a letter. 



## September 2021

### FHIR service



**Added support for conditional patch**

 
[Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)
[#2163](https://github.com/microsoft/fhir-server/pull/2163)

 
Added conditional patch audit event. [#2213](https://github.com/microsoft/fhir-server/pull/2213) 

**Allow JSON patch in bundles**


Allows for search history bundles with Patch requests. [#2156](https://github.com/microsoft/fhir-server/pull/2156) 


Enabled JSON patch in bundles using Binary resources. [#2143](https://github.com/microsoft/fhir-server/pull/2143) 


Added new audit event [OperationName subtypes](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details) [#2170](https://github.com/microsoft/fhir-server/pull/2170) 



**Running a reindex job**

 
Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters. 
[#2103](https://github.com/microsoft/fhir-server/pull/2103)


Updated error message for reindex parameter boundaries[#2109](https://github.com/microsoft/fhir-server/pull/2109)


Added final reindex count check.[#2099](https://github.com/microsoft/fhir-server/pull/2099)

**Bug fixes** 


Wider catch for exceptions during applying patch [#2192](https://github.com/microsoft/fhir-server/pull/2192)


Fix history with PATCH in STU3[#2177](https://github.com/microsoft/fhir-server/pull/2177) 

**Custom search bugs** 


Addresses the delete failure with Custom Search parameters [#2133](https://github.com/microsoft/fhir-server/pull/2133) 


Added retry logic while Deleting Search parameter [#2121](https://github.com/microsoft/fhir-server/pull/2121)


Set max item count in search options in SearchParameterDefinitionManager [#2141](https://github.com/microsoft/fhir-server/pull/2141)


Better exception if there's a bad expression in a search parameter [#2157](https://github.com/microsoft/fhir-server/pull/2157)

**Resolved SQL batch reindex if one resource fails** 
Updates SQL batch reindex retry logic [#2118](https://github.com/microsoft/fhir-server/pull/2118) 

**GitHub issues closed** 


Unclear error message for conditional create with no ID [#2168](https://github.com/microsoft/fhir-server/issues/2168) 

### DICOM service**

**Implemented fix to resolve QIDO paging-ordering issues** [#989](https://github.com/microsoft/dicom-server/pull/989) 


### MedTech service**


**MedTech service normalized improvements with calculations to support and enhance health data standardization.** 

See [Use device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [CalculatedContent](./../healthcare-apis/iot/how-to-use-calculatedcontent-mappings.md) 

## Related content

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]