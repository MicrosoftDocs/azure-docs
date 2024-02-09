---
title: Release notes for 2022 Azure Health Data Services monthly releases
description: 2022 - Explore the Azure Health Data Services release notes for 2022. Learn about the features and enhancements introduced in the FHIR, DICOM, and MedTech services to help you manage and analyze health data. 
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 02/15/2024
ms.author: kavitagaddam 
ms.custom: references_regions
---

# Release notes 2022: Azure Health Data Services

This article describes features and enhancements released in 2023 for the FHIR&reg; service, DICOM&reg; service, and MedTech service in Azure Health Data Services.

> [!NOTE]
> Azure Health Data Services is generally available. For more information, see the [Service Level Agreement (SLA) for Azure Health Data Services](https://azure.microsoft.com/support/legal/sla/health-data-services/v1_1/).

## December 2022

### DICOM events available in public preview

Azure Health Data Services [Events](events/events-overview.md) include a public preview of [two new event types](events/events-message-structure.md#dicom-events-message-structure) for the DICOM service. These new event types enable applications that use Event Grid to use event-driven workflows when DICOM images are created or deleted.

## November 2022

### Fixed the Error generated when resource is updated using if-match header and PATCH

Bug is fixed and Resource is updated if it matches the Etag header. For details, see [#2877](https://github.com/microsoft/fhir-server/issues/2877)

### Azure Health Data Services Toolkit is released

The [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit), which was previously in a prerelease state, is in Public Preview. The toolkit is open-source project and allows customers to more easily customize and extend the functionality of their Azure Health Data Services implementations. The NuGet packages of the toolkit are available for download from the NuGet gallery, and you can find links to them from the repo documentation. 

## October 20222

### Added Deploy to Azure button added to documentation for the MedTech service

 Customers can deploy the MedTech service fully, including Event Hubs, AHDS workspace, FHIR service, MedTech service, and managed identity roles, all by clicking the "Deploy to Azure" button. [Deploy the MedTech service using an Azure Resource Manager template](./iot/deploy-new-arm.md)


### Added Dropped Event Metrics to the MedTech service

Customers can determine if their mappings are working as intended, as they can see dropped events as a metric to ensure that data is flowing through accurately. 


## September 2022

### Fixed issue where Querying with :not operator was returning more results than expected for all Azure Health Data Services

The issue is fixed and querying with :not operator should provide correct results. For more information, see [#2790](https://github.com/microsoft/fhir-server/pull/2785). 


### FHIR Service 
Provided an Error message for failure in export resulting from long time span in the FHIR service 

With failure in export job due to a long time span, a customer sees `RequestEntityTooLarge` HTTP status code. For more information, see [#2790](https://github.com/microsoft/fhir-server/pull/2790).

**Fixed issue in a query sort, where functionality throws an error when chained search is performed with same field value.**

The functionality returns a response. For more information, see [#2794](https://github.com/microsoft/fhir-server/pull/2794). 

**Fixed issue where Server doesn't indicate `_text` not supported**

 When passed as URL parameter,`_text` returns an error in response when using the `Prefer` heading with `value handling=strict`. For more information, see [#2779](https://github.com/microsoft/fhir-server/pull/2779).

**Added a Verbose error message for invalid resource type**

Verbose error message is added when resource type is invalid or empty for `_include` and `_revinclude` searches. For more information, see [#2776](https://github.com/microsoft/fhir-server/pull/2776).

### DICOM service


### Export is Generally Available (GA)**

The export feature for the DICOM service is generally available. Export enables a user-supplied list of studies, series, and/or instances to be exported in bulk to an Azure Storage account. Learn more about the [export feature](dicom/export-dicom-files.md).

### Improved deployment performance** 

Performance improvements have cut the time to deploy new instances of the DICOM service by more than 55% at the 50th percentile.

### Reduced strictness when validating STOW requests**

Some customers have run into issues storing DICOM files that don't perfectly conform to the specification. To enable those files to be stored in the DICOM service, we reduced the strictness of the validation performed on STOW. 

The service accepts: 
* DICOM UIDs that contain trailing whitespace 
* IS, DS, SV, and UV VRs that aren't valid numbers
* Invalid private creator tags

### [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) is in public preview

The toolkit is open-source and allows you to easily customize and extend the functionality of their Azure Health Data Services implementations. 

## August 2022

### FHIR service

**Azure Health Data services availability expands to new regions**

 Azure Health Data Services is available in the following regions: Central India, Korea Central, and Sweden Central.
 
**`$import` is Generally Available.**

 `$import` API is generally available in Azure Health Data Services API version 2022-06-01. See [Executing the import](./../healthcare-apis/fhir/import-data.md) by invoking the `$import` operation on FHIR service in Azure Health Data Services.

**`$convert-data` updated by adding STU3-R4 support.**

`$convert-data` added support for FHIR STU3-R4 conversion. See [Data conversion for Azure API for FHIR](./../healthcare-apis/azure-api-for-fhir/convert-data.md). 


**Analytics pipeline supports data filtering.**

 Data filtering is supported in FHIR to data lake pipeline. See [FHIR-Analytics-Pipelines_Filter FHIR data](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Filter%20FHIR%20data%20in%20pipeline.md) microsoft/FHIR-Analytics-Pipelines github.com. 


**Analytics pipeline supports FHIR extensions.**

Analytics pipeline can process FHIR extensions to generate parquet data. See [FHIR-Analytics-Pipelines_Process](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Process%20FHIR%20extensions.md) in pipeline.md at main.


**Fixed issue related to History bundles being sorted with the oldest version first.** 

We've recently identified an issue with the sorting order of history bundles on FHIR® server. History bundles were sorted with the oldest version first. Per FHIR specification, the sorting of versions defaults to the oldest version last. This bug fix addresses FHIR server behavior for sorting history bundle. <br><br>We understand if you would like to keep the sorting per existing behavior (oldest version first). To support existing behavior, we recommend you append `_sort=_lastUpdated` to the HTTP GET command utilized for retrieving history. <br><br>For example: `<server URL>/_history?_sort=_lastUpdated` <br><br>For more information, see [#2689](https://github.com/microsoft/fhir-server/pull/2689).

**Fixed issue where Queries were not providing consistent result count after appended with `_sort` operator.**
The issue is fixed and queries should provide consistent result count, with and without sort operator. 


### MedTech service


**Added New Metric Chart** 

Customers can see predefined metrics graphs in the MedTech landing page, complete with alerts to ease customers' burden of monitoring their MedTech service.

**Availability of Diagnostic Logs**

There are predefined queries with relevant logs for common issues so that customers can easily debug and diagnose issues in their MedTech service.

### DICOM service


**Modality worklists (UPS-RS) is Generally Available (GA)**.

The modality worklists (UPS-RS) service is generally available. Learn more about the [worklists service](./../healthcare-apis/dicom/dicom-services-conformance-statement.md). 

## July 2022

### FHIR service


**(Open Source) History bundles were sorted with the oldest version first.**
We've recently identified an issue with the sorting order of history bundles on FHIR® server. History bundles were sorted with the oldest version first. Per [FHIR specification](https://hl7.org/fhir/http.html#history), the sorting of versions defaults to the oldest version last. This bug fix addresses FHIR server behavior for sorting history bundle.<br /><br />We understand if you would like to keep the sorting per existing behavior (oldest version first). To support existing behavior, we recommend you append `_sort=_lastUpdated` to the HTTP `GET` command utilized for retrieving history. <br /><br />For example: `<server URL>/_history?_sort=_lastUpdated` <br /><br />For more information, see [#2689](https://github.com/microsoft/fhir-server/pull/2689). 


### MedTech service 

**Improvements to documentations for Events and MedTech and availability zones.**

Tested and enhanced usability and functionality. Added new documents to enable customers to better take advantage of the new improvements. See [Consume Events with Logic Apps](./../healthcare-apis/events/events-deploy-portal.md) and [Deploy Events Using the Azure portal](./../healthcare-apis/events/events-deploy-portal.md). 


**One touch launch Azure MedTech deploy.**

[Deploy the MedTech Service in the Azure portal](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md)

### DICOM service

**DICOM Service availability expands to new regions.**

The DICOM Service is available in the following [regions](https://azure.microsoft.com/global-infrastructure/services/): Southeast Asia, Central India, Korea Central, and Switzerland North. 

**Fast retrieval of individual DICOM frames**

For DICOM images containing multiple frames, performance improvements have been made to enable fast retrieval of individual frames (60-KB frames as fast as 60 MS). These improved performance characteristics enable workflows such as [viewing digital pathology images](https://microsofthealth.visualstudio.com/DefaultCollection/Health/_git/marketing-azure-docs?version=GBmain&path=%2Fimaging%2Fdigital-pathology%2FDigital%20Pathology%20using%20Azure%20DICOM%20service.md&_a=preview), which require rapid retrieval of individual frames. 

## June 2022

### FHIR service

**Fixed issue with Export Job not being queued for execution.**
Fixes issue with export job not being queued due to duplicate job definition caused due to reference to container URL. For more information, see [#2648](https://github.com/microsoft/fhir-server/pull/2648). 

**Fixed issue related to Queries not providing consistent result count after appended with the `_sort` operator.**

Fixes the issue with the help of distinct operator to resolve inconsistency and record duplication in response.For more information, see [#2680](https://github.com/microsoft/fhir-server/pull/2680). 


## May 2022

### FHIR service

**Removes SQL retry on upsert**

Removes retry on SQL command for upsert. The error still occurs, but data is saved correctly in success cases. For more information, see [#2571](https://github.com/microsoft/fhir-server/pull/2571). 

**Added handling for SqlTruncate errors**

Added a check for SqlTruncate exceptions and tests. In particular, exceptions and tests catch SqlTruncate exceptions for Decimal type based on the specified precision and scale. For more information, see [#2553](https://github.com/microsoft/fhir-server/pull/2553). 

### DICOM service

**DICOM service supports cross-origin resource sharing (CORS)**

DICOM service supports [CORS](./../healthcare-apis/dicom/configure-cross-origin-resource-sharing.md). CORS allows you to configure settings so that applications from one domain (origin) can access resources from a different domain, known as a cross-domain request. 

**DICOMcast supports Private Link**

DICOMcast supports Azure Health Data Services workspaces that are configured to use [Private Link](./../healthcare-apis/healthcare-apis-configure-private-link.md). 

**UPS-RS supports Change and Retrieve work item**

Modality worklist (UPS-RS) endpoints have been added to support Change and Retrieve operations for work items. 

**API version is required as part of the URI**

All REST API requests to the DICOM service must include the API version in the URI. For more information, see [API versioning for DICOM service](./../healthcare-apis/dicom/api-versioning-dicom-service.md). 

**Index the first value for DICOM tags that incorrectly specify multiple values**

Attributes that are defined to have a single value but have specified multiple values are leniently accepted. The first value for such attributes is indexed.

## April 2022

### FHIR service


**Added FHIRPath Patch**

FHIRPath Patch was added as a feature to both the Azure API for FHIR. This implements FHIRPath Patch as defined on the [HL7](http://hl7.org/fhir/fhirpatch.html) website. 


**Handles invalid header on versioned update**

 When the versioning policy is set to versioned-update, we required that the most recent version of the resource is provided in the request's if-match header on an update. The specified version must be in ETag format. Previously, a 500 would be returned if the version was invalid or in an incorrect format. This update returns a 400 Bad Request. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). 


**Bulk import in public preview**
The bulk-import feature enables importing FHIR data to the FHIR server at high throughput using the $import operation. It's designed for initial data load into the FHIR server. For more information, see [Bulk-import FHIR data (Preview)](./../healthcare-apis/fhir/import-data.md). 


**Added back the core to resource path**

 Part of the path to a string resource was accidentally removed in the versioning policy. This fix adds it back in. For more information, see [PR #2470](https://github.com/microsoft/fhir-server/pull/2470). 



### DICOM service


**Reduced the strictness of validation applied to incoming DICOM files** 

When value representation (VR) is a decimal string (DS)/ integer string (IS), `fo-dicom` serialization treats value as a number. Customer DICOM files could be old and contains invalid numbers. Our service blocks such file upload due to the serialization exception. For more information, see [PR #1450](https://github.com/microsoft/dicom-server/pull/1450). 

**Correctly parse a range of input in the content negotiation headers**

Currently, WADO with Accept: multipart/related; type=application/dicom throws an error. It accepts Accept: multipart/related; type="application/dicom", but they should be equivalent. For more information, see [PR #1462](https://github.com/microsoft/dicom-server/pull/1462). 


**Fixed an issue where parallel upload of images in a study could fail under certain circumstances**

Handle race conditions during parallel instance inserts in the same study. For more information, see [PR #1491](https://github.com/microsoft/dicom-server/pull/1491) and [PR #1496](https://github.com/microsoft/dicom-server/pull/1496). 

## March 2022

### Azure Health Data Services 

**Private Link is available**
With Private Link, you can access Azure Health Data Services securely from your virtual network as a first-party service without having to go through a public Domain Name System (DNS). For more information, see [Configure Private Link for Azure Health Data Services](./../healthcare-apis/healthcare-apis-configure-private-link.md). 

### FHIR service

**FHIRPath Patch operation available**
|This new feature enables you to use the FHIRPath Patch operation on FHIR resources. For more information, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](./../healthcare-apis/fhir/fhir-rest-api-capabilities.md). 


**SQL timeout that returns 408 status code**
Previously, a SQL timeout would return a 500. Now a timeout in SQL returns a FHIR OperationOutcome with a 408 status code. For more information, see [PR #2497](https://github.com/microsoft/fhir-server/pull/2497). 

**Fixed issue related to duplicate resources in search with `_include`**
Fixed issue where a single resource can be returned twice in a search that has `_include`. For more information, see [PR #2448](https://github.com/microsoft/fhir-server/pull/2448). 


**Fixed issue PUT creates on versioned update**
Fixed issue where creates with PUT resulted in an error when the versioning policy is configured to `versioned-update`. For more information, see [PR #2457](https://github.com/microsoft/fhir-server/pull/2457). 

**Invalid header handling on versioned update**

 Fixed issue where invalid `if-match` header would result in an HTTP 500 error. Now an HTTP Bad Request is returned instead. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). 

### MedTech service

**The Events feature within Health Data Services is generally available (GA).**

 The Events feature allows customers to receive notifications and triggers when FHIR observations are created, updated, or deleted. For more information, see [Events message structure](./../healthcare-apis/events/events-message-structure.md) and [What are events?](./../healthcare-apis/events/events-overview.md). 

**Events documentation for Azure Health Data Services**
Updated docs to allow for better understanding, knowledge, and help for Events as it went GA. Updated troubleshooting for ease of use for the customer. 

**One touch deploy button for MedTech service launch in the portal**
Enables easier deployment and use of MedTech service for customers without the need to go back and forth between pages or interfaces. 

## January 2022


**Export FHIR data behind firewalls**
This new feature enables exporting FHIR data to storage accounts behind firewalls. For more information, see [Configure export settings and set up a storage account](./././fhir/configure-export-data.md). 

**Deploy Azure Health Data Services with Azure Bicep**
This new feature enables you to deploy Azure Health Data Services using Azure Bicep. For more information, see [Deploy Azure Health Data Services using Azure Bicep](deploy-healthcare-apis-using-bicep.md). 

### DICOM service


**Customers can define their own query tags using the Extended Query Tags feature**

With Extended Query Tags feature, customers efficiently query non-DICOM metadata for capabilities like multi-tenancy and cohorts. It's available for all customers in Azure Health Data Services. 

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
