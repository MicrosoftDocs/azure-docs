---
title: Release notes for 2021 Azure Health Data Services monthly releases 
description: 2021 - Explore the new capabilities and benefits of Azure Health Data Services in 2021. Learn about the features and enhancements introduced in the FHIR, DICOM, and MedTech services that help you manage and analyze health data. 
services: healthcare-apis
author: shellyhaverkamp
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 03/13/2024
ms.author: jasteppe
ms.custom: references_regions
---

# Release notes 2021: Azure Health Data Services

This article describes features, enhancements, and bug fixes released in 2021 for the FHIR&reg; service, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## December 2021

### Azure Health Data Services 

#### Quota details for support requests

We updated the quota details for customer support requests with the latest information. 

#### Local RBAC documentation updated

We updated the local RBAC documentation to clarify the use of the secondary tenant and the steps to disable it. 

#### Deploy and configure Azure Health Data Services using scripts

We started the process of providing PowerShell, CLI scripts, and ARM templates to configure app registration and role assignments. Scripts for deploying Azure Health Data Services will be available after GA. 

### FHIR service

#### Bug fixes

- **Fixed: Added Publisher to `CapabilityStatement.name`**. You can find the publisher in the capability statement at `CapabilityStatement.name`. See [PR #2319](https://github.com/microsoft/fhir-server/pull/2319).

- **Fixed: Log `FhirOperation` linked to anonymous calls to Request metrics**. We weren't logging operations that didn’t require authentication. We extended the ability to get `FhirOperation` type in `RequestMetrics` for anonymous calls. See [PR #2295](https://github.com/microsoft/fhir-server/pull/2295) .

- **Fixed: 500 error when `SearchParameter` Code is null**. Fixed an issue with `SearchParameter` if it had a null value for Code, the result was a 500 error. After the bug fix, it results in an `InvalidResourceException` like the other values do. See [PR #2343](https://github.com/microsoft/fhir-server/pull/2343).
 
- **Fixed: Returned `BadRequestException` with valid message when input JSON body is invalid**. For invalid JSON body requests, the FHIR server was returning a 500 error. After the bug fix, the server returns a `BadRequestException` with a valid message instead of 500. See [PR #2239](https://github.com/microsoft/fhir-server/pull/2239).

- **Fixed: Handled SQL timeout issue**. If the SQL Server timed out, PUT `/resource{id}` returned a 500 error. After the bug fix, we handle the 500 error and return a timeout exception with an operation outcome. See [PR #2290](https://github.com/microsoft/fhir-server/pull/2290).

## November 2021

### FHIR service

#### Process patient-everything links

We expanded the atient-everything capabilities to process patient links [PR #2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](./../healthcare-apis/fhir/patient-everything.md#processing-patient-links).

### Bug fixes

- **Fixed: Added software name and version to capability statement**. In the capability statement, the software name distinguishes if you're using Azure API for FHIR or Azure Health Data Services. The software version specifies which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service. See [PR #2294](https://github.com/microsoft/fhir-server/pull/2294), [PR #1778](https://github.com/microsoft/fhir-server/issues/1778), and [Issue #2241](https://github.com/microsoft/fhir-server/issues/2241).

- **Fixed: Compress continuation tokens**. Occasionally, the continuation token was too long to follow the [next link](./../healthcare-apis/fhir/overview-of-search.md#pagination) in searches and resulted in a 404 error. To resolve the issue, we compressed the continuation token to ensure it stays below the size limit. See [PR #2279](https://github.com/microsoft/fhir-server/pull/2279) and [Issue #2250](https://github.com/microsoft/fhir-server/issues/2250). 

- **Fixed: FHIR service autoscale**. 
[FHIR service autoscale](./fhir/fhir-service-autoscale.md) provides optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads. It's available in all [regions](https://azure.microsoft.com/global-infrastructure/services/) where the FHIR service is supported. 

- **Fixed: Resolved 500 error when the date was passed with a time zone**. This fix addresses a 500 error when a date with a time zone was passed into a datetime field [PR #2270](https://github.com/microsoft/fhir-server/pull/2270). 

- **Fixed: Resolved issue when posting a bundle with incorrect media type returned a 500 error**. before the bug fix, when posting a search with a key that contains certain characters a 500 error was returned. See [PR #2264](https://github.com/microsoft/fhir-server/pull/2264) and [Issue #2148](https://github.com/microsoft/fhir-server/issues/2148). 

### DICOM service

**Content-Type header includes transfer-syntax.**

This enhancement enables the user to know which transfer syntax is used in case multiple accept headers are being supplied. 

## October 2021

### Azure Health Data Services 

#### Test Data Generator tool*

We updated Azure Health Data Services GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter that can be deployed to Azure AKS for performance tests. 

### FHIR service

#### Bug fixes

- **Fixed:  Added support for [_sort](././../healthcare-apis/fhir/overview-of-search.md#search-result-parameters) on strings and dateTime**. See
[PR #2169](https://github.com/microsoft/fhir-server/pull/2169).


- **Fixed: [Conditional Delete](././../healthcare-apis/fhir/rest-api-capabilities.md#conditional-delete) results in an infinite loop**. See [PR #2269](https://github.com/microsoft/fhir-server/pull/2269).

- **Fixed: Resolved 500 error possibly caused by a malformed transaction body in a bundle POST**. We added a check that the URL is populated in the [transaction bundle](././..//healthcare-apis/fhir/fhir-features-supported.md#rest-api) requests. See [PR #2255](https://github.com/microsoft/fhir-server/pull/2255).

### DICOM service

#### Support for more regions

The DICOM service is available in South Brazil and Central Canada. For more information, see [Azure services that support availability zones](https://azure.microsoft.com/global-infrastructure/services/). 

#### Extended query tags

Support for DateTime (DT) and Time (TM) Value Representation (VR) types. 

#### Implemented fix to workspace names

Enabled DICOM service to work with workspaces that have names beginning with a letter. 

## September 2021

### FHIR service

#### Bug fixes

- **Fixed: Added support for conditional patch**. See [Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch) and [PR #2163](https://github.com/microsoft/fhir-server/pull/2163).
 
- **Fixed: Added conditional patch audit event***. See [PR #2213](https://github.com/microsoft/fhir-server/pull/2213).

- **Fixed: Allow JSON patch in bundles**. Allows for search history bundles with Patch requests. See [PR #2156](https://github.com/microsoft/fhir-server/pull/2156).

- **Fixed: Enabled JSON patch in bundles using binary resources**. See [PR #2143](https://github.com/microsoft/fhir-server/pull/2143).

- **Fixed: Added new audit event**. See [OperationName subtypes](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details) and [PR #2170](https://github.com/microsoft/fhir-server/pull/2170).

- **Fixed: Running a reindex job**. Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters. See [PR #2103](https://github.com/microsoft/fhir-server/pull/2103).

- **Fixed: Updated error message for reindex parameter boundaries**. See [PR #2109](https://github.com/microsoft/fhir-server/pull/2109).

- **Fixed: Added final reindex count check**. See [PR #2099](https://github.com/microsoft/fhir-server/pull/2099).

- **Fixed: Wider catch for exceptions during applying patch**. See [PR #2192](https://github.com/microsoft/fhir-server/pull/2192).

- **Fixed: History with PATCH in STU3**. See [PR #2177](https://github.com/microsoft/fhir-server/pull/2177). 

- **Fixed: Custom search bugs**. Addresses the failure to delete with custom search parameters. See [PR #2133](https://github.com/microsoft/fhir-server/pull/2133).

- **Fixed: Added retry logic while deleting search parameter**. See [PR #2121](https://github.com/microsoft/fhir-server/pull/2121).

- **Fixed: Set max item count in search options in SearchParameterDefinitionManager**. See [PR #2141](https://github.com/microsoft/fhir-server/pull/2141).

- **Fixed: Better exception if there's a bad expression in a search parameter**. See [PR #2157](https://github.com/microsoft/fhir-server/pull/2157).

- **Fixed: Resolved SQL batch reindex if one resource fails**. Updates SQL batch reindex retry logic. See [PR #2118](https://github.com/microsoft/fhir-server/pull/2118).

- **Fixed: GitHub issue closed**. Unclear error message for conditional create with no ID. See [PR #2168](https://github.com/microsoft/fhir-server/issues/2168).

### DICOM service

#### Bug fixes

- **Fixed: Implemented fix to resolve QIDO paging-ordering issues**. See [PR #989](https://github.com/microsoft/dicom-server/pull/989).

### MedTech service**

#### Improvements with calculations to support and enhance health data standardization

For more information, see [Use device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [CalculatedContent](./../healthcare-apis/iot/how-to-use-calculatedcontent-mappings.md).

## Related content

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]