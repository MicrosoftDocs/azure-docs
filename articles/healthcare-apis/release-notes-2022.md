---
title: Release notes for 2022 Azure Health Data Services monthly releases
description: 2022 - Explore the Azure Health Data Services release notes for 2022. Learn about the features and enhancements introduced in the FHIR, DICOM, and MedTech services that help you manage and analyze health data. 
services: healthcare-apis
author: shellyhaverkamp
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 03/13/2024
ms.author: jasteppe 
ms.custom: references_regions
---

# Release notes 2022: Azure Health Data Services

This article describes features and enhancements released in 2023 for the FHIR&reg; service, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## December 2022

### DICOM service

#### DICOM events available for public preview

Azure Health Data Services [events](events/events-overview.md) include a public preview of [two more event types](events/events-message-structure.md#dicom-events-message-structure) for the DICOM service. These event types enable applications that use Azure Event Grid for event-driven workflows when DICOM images are created or deleted.

## November 2022

### Azure Health Data Services

#### Azure Health Data Services toolkit is released for public preview

The [Azure Health Data Services toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) is available for public preview. The toolkit is an open-source project and allows you to customize and extend the functionality of your Azure Health Data Services implementations. The NuGet packages of the toolkit are available for download from the NuGet gallery, and you can find links to them in the repo documentation. 

### FHIR service

#### Bug fixes

- **Fixed: The error generated when resource is updated using if-match header and PATCH**. A resource is updated if it matches the Etag header. See [PR #2877](https://github.com/microsoft/fhir-server/issues/2877).

## October 2022

### MedTech service

#### Deploy to Azure button added to documentation

 Customers can deploy the MedTech service fully, including Event Hubs, an Azure Health Data Services workspace, FHIR service, MedTech service, and managed identity roles, by choosing a **Deploy to Azure** button on the documentation page. For more information, see [Deploy the MedTech service using an Azure Resource Manager template](./iot/deploy-new-arm.md).

#### Added dropped event metrics

Customers can determine if their mappings are working as intended, as they can see dropped events as a metric to ensure that data is flowing through accurately. 

## September 2022

### Azure Health Data Services

#### Azure Health Data Services toolkit is available for public preview

The [Azure Health Data Services toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) is open-source and allows you to customize and extend the functionality of your Azure Health Data Services implementations. 

### FHIR service 

#### Bug fixes

- **Fixed: Querying with :not operator was returning more results than expected**. The issue is fixed and querying with :not operator should provide correct results. See [PR #2790](https://github.com/microsoft/fhir-server/pull/2785). 

- **Fixed: Provided an error message for failure in export resulting from a long timespan**. With failure in an export job due to a long timespan, a customer sees `RequestEntityTooLarge` HTTP status code. See [PR #2790](https://github.com/microsoft/fhir-server/pull/2790).

- **Fixed: In a query sort, the system throws an error when chained search is performed with the same field value**. The functionality returns a response. [PR #2794](https://github.com/microsoft/fhir-server/pull/2794). 

- **Fixed: Server doesn't indicate `_text` not supported**. When passed as URL parameter,`_text` returns an error response when using the `Prefer` heading with `value handling=strict`. See [PR #2779](https://github.com/microsoft/fhir-server/pull/2779).

- **Fixed: Added a verbose error message for invalid resource type**. A verbose error message is added when a resource type is invalid or empty for `_include` and `_revinclude` searches. See [PR #2776](https://github.com/microsoft/fhir-server/pull/2776).

### DICOM service

#### Export capability is generally available

The export capability for the DICOM service is generally available. Export enables a user-supplied list of studies, series, and instances to be exported in bulk to an Azure Storage account. For more information, see [Export DICOM files](dicom/export-dicom-files.md).

#### Improved deployment performance

Performance improvements cut the time to deploy new instances of the DICOM service by more than 55% at the 50th percentile.

#### Reduced strictness when validating STOW requests

Some customers experienced issues storing DICOM files that don't perfectly conform to the specification. To enable those files to be stored in the DICOM service, the strictness of the validation performed on STOW was reduced. 

The service accepts: 
- DICOM UIDs that contain trailing whitespace 
- IS, DS, SV, and UV VRs that aren't valid numbers
- Invalid private creator tags

## August 2022

### Azure Health Data Services

#### Azure Health Data Services availability expands to more regions

 Azure Health Data Services is available in these regions: Central India, Korea Central, and Sweden Central.
 
### FHIR service

#### $import is generally available

 `$import` API is generally available in Azure Health Data Services API version 2022-06-01. See [Executing the import](./../healthcare-apis/fhir/import-data.md) by invoking the `$import` operation.

#### $convert-data updated by adding STU3-R4 support

`$convert-data` added support for FHIR STU3-R4 conversion. See [Data conversion for Azure API for FHIR](./../healthcare-apis/azure-api-for-fhir/convert-data.md). 

#### Analytics pipeline supports data filtering

 Data filtering is supported in FHIR to data lake pipeline. See [FHIR-Analytics-Pipelines_Filter FHIR data](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Filter%20FHIR%20data%20in%20pipeline.md). 

#### Analytics pipeline supports FHIR extensions

The analytics pipeline can process FHIR extensions to generate parquet data. See [FHIR-Analytics-Pipelines_Process](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Process%20FHIR%20extensions.md) in pipeline.md at main.

#### Bug fixes

- **Fixed: History bundles sorted with the oldest version first**. There was an issue with the sorting order of history bundles on the FHIR server. History bundles were sorted with the oldest version first. Per FHIR specification, the sorting of versions defaults to the oldest version last. This bug fix addresses FHIR server behavior for sorting the history bundle. 
  
  To keep the sorting per existing behavior (oldest version first), we recommend you append `_sort=_lastUpdated` to the HTTP GET command utilized for retrieving history. For example: `<server URL>/_history?_sort=_lastUpdated`. See [PR #2689](https://github.com/microsoft/fhir-server/pull/2689).

- **Fixed: Queries weren't providing a consistent result count after being appended with `_sort` operator**. The issue is fixed and queries should provide consistent result count, with and without sort operator. 

### DICOM service

#### Modality worklists (UPS-RS) is generally available

The modality worklists (UPS-RS) service is generally available. Learn more about the [worklists service](./../healthcare-apis/dicom/dicom-services-conformance-statement.md). 

### MedTech service

#### Added metrics chart

Customers can see predefined metrics graphs with alerts on the MedTech landing page to ease the burden of monitoring their MedTech service.

#### Availability of diagnostic logs

There are predefined queries with relevant logs for common issues so that customers can debug and diagnose issues.

## July 2022

### DICOM service

#### DICOM service availability expands to more regions

The DICOM Service is available in these [regions](https://azure.microsoft.com/global-infrastructure/services/): Southeast Asia, Central India, Korea Central, and Switzerland North. 

#### Fast retrieval of individual DICOM frames

For DICOM images containing multiple frames, performance improvements enable fast retrieval of individual frames (60-KB frames as fast as 60 MS). These improved performance characteristics enable workflows such as [viewing digital pathology images](https://microsofthealth.visualstudio.com/DefaultCollection/Health/_git/marketing-azure-docs?version=GBmain&path=%2Fimaging%2Fdigital-pathology%2FDigital%20Pathology%20using%20Azure%20DICOM%20service.md&_a=preview), which require rapid retrieval of individual frames. 

### MedTech service 

#### Improvements to documentations for events

Added articles to enable customers to take advantage of the events improvements. See [Consume Events with Logic Apps](./../healthcare-apis/events/events-deploy-portal.md) and [Deploy Events Using the Azure portal](./../healthcare-apis/events/events-deploy-portal.md). 

## June 2022

### FHIR service

#### Bug fixes

- **Fixed: Export job not queued for execution**. Fixes issue with export job not getting queued due to duplicate job definition in reference to container URL. See [PR #2648](https://github.com/microsoft/fhir-server/pull/2648). 

- **Fixed; Queries not providing a consistent result count after appended with the `_sort` operator**. Fixes the issue with the help of distinct operator to resolve inconsistency and record duplication in response. See [PR #2680](https://github.com/microsoft/fhir-server/pull/2680). 

## May 2022

### FHIR service

#### Bug fixes

- **Fixed: Removes SQL retry on upsert**. Removes retry on SQL command for upsert. The error still occurs, but data is saved correctly in success cases. See [PR #2571](https://github.com/microsoft/fhir-server/pull/2571). 

- **Fixed: Added handling for SqlTruncate errors**.Added a check for SqlTruncate exceptions and tests. Exceptions and tests catch SqlTruncate exceptions for decimal type based on the specified precision and scale. See [PR #2553](https://github.com/microsoft/fhir-server/pull/2553). 

### DICOM service

#### DICOM service supports cross-origin resource sharing (CORS)

The DICOM service supports [CORS](./../healthcare-apis/dicom/configure-cross-origin-resource-sharing.md). CORS allows you to configure settings so that applications from one domain (origin) can access resources from a different domain, known as a cross-domain request. 

#### DICOMcast supports Private Link

DICOMcast supports Azure Health Data Services workspaces that are configured to use [Private Link](./../healthcare-apis/healthcare-apis-configure-private-link.md). 

#### UPS-RS supports change and retrieve work item

Modality worklist (UPS-RS) endpoints were added to support change and retrieve operations for work items. 

#### API version is required as part of the URI

All REST API requests to the DICOM service must include the API version in the URI. For more information, see [API versioning for the DICOM service](./../healthcare-apis/dicom/api-versioning-dicom-service.md). 

#### Index the first value for DICOM tags that incorrectly specify multiple values

Attributes that are defined to have a single value but specified multiple values are leniently accepted. The first value for these attributes is indexed.

## April 2022

### FHIR service

#### Added FHIRPath Patch

FHIRPath Patch was added to Azure API for FHIR. This change implements FHIRPath Patch as defined on the [HL7](http://hl7.org/fhir/fhirpatch.html) website. 

#### Bulk import is available for public preview
The bulk import feature enables importing FHIR data to the FHIR server at high throughput using the $import operation. Bulk import is for initial data load into the FHIR server. For more information, see [Bulk-import FHIR data](./../healthcare-apis/fhir/import-data.md). 

### Bug fixes

- **Fixed: Handles invalid header on versioned update**.  When the versioning policy is set to a versioned update, the most recent version of the resource is provided in the request's if-match header on an update. The specified version must be in ETag format. Previously, a 500 error was returned if the version was invalid or in an incorrect format. This update returns a 400 Bad Request. See [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). 

- **Fixed: Added back the core to resource path**. Part of the path to a string resource was removed in the versioning policy. This fix adds it back in. See [PR #2470](https://github.com/microsoft/fhir-server/pull/2470). 

### DICOM service

### Bug fixes

- **Fixed: Reduced the strictness of validation of incoming DICOM files**. When value representation (VR) is a decimal string (DS)/ integer string (IS), `fo-dicom` serialization treats the value as a number. Customer DICOM files might be old and contain invalid numbers. The service blocks the file upload due to the serialization exception. See [PR #1450](https://github.com/microsoft/dicom-server/pull/1450). 

- **Fixed: Correctly parse a range of input in the content negotiation headers**. WADO with Accept: multipart/related; type=application/dicom throws an error. It accepts Accept: multipart/related; type="application/dicom", but they must be equivalent. See [PR #1462](https://github.com/microsoft/dicom-server/pull/1462). 

- **Fixed: Parallel upload of images in a study fails**. Handle race conditions during parallel instance inserts in the same study. See [PR #1491](https://github.com/microsoft/dicom-server/pull/1491) and [PR #1496](https://github.com/microsoft/dicom-server/pull/1496). 

## March 2022

### Azure Health Data Services 

#### Private Link is available

With Private Link, you can access Azure Health Data Services securely from your virtual network as a first-party service without having to go through a public Domain Name System (DNS). For more information, see [Configure Private Link for Azure Health Data Services](./../healthcare-apis/healthcare-apis-configure-private-link.md). 

### FHIR service

#### FHIRPath Patch operation available
|This feature enables you to use the FHIRPath Patch operation on FHIR resources. For more information, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](./../healthcare-apis/fhir/rest-api-capabilities.md). 

#### Bug fixes

- **Fixed: SQL timeout returns 408 status code**.
Before the bug fix, a SQL timeout returned a 500 error. With the bug fix, a timeout in SQL returns a `FHIR OperationOutcome` with a 408 status code. See [PR #2497](https://github.com/microsoft/fhir-server/pull/2497). 

- **Fixed: Issue duplicate resources in search with `_include`**. Fixed issue where a single resource is returned twice in a search that has `_include`. See [PR #2448](https://github.com/microsoft/fhir-server/pull/2448). 

- **Fixed: Issue with PUT creates on versioned update**. Fixed issue where PUT creates resulted in an error when the versioning policy is configured to `versioned-update`. See [PR #2457](https://github.com/microsoft/fhir-server/pull/2457). 

- **Fixed: Invalid header handling on versioned update**. Fixed issue where invalid `if-match` header would result in an HTTP 500 error. Now an HTTP Bad Request is returned instead. See [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). 

### Azure Health Data Services

#### Events capability in Azure Health Data Services is generally available (GA)

 The Events feature allows customers to receive notifications and triggers when FHIR observations are created, updated, or deleted. For more information, see [Events message structure](./../healthcare-apis/events/events-message-structure.md) and [What are events?](./../healthcare-apis/events/events-overview.md). 

## January 2022

### Azure Health Data Services

#### Deploy Azure Health Data Services with Azure Bicep
This feature enables you to deploy Azure Health Data Services by using Azure Bicep. For more information, see [Deploy Azure Health Data Services using Azure Bicep](deploy-healthcare-apis-using-bicep.md). 

#### Define query tags using the Extended Query Tags feature

With Extended Query Tags, customers can query non-DICOM metadata for capabilities like multi-tenancy and cohorts. 

### FHIR service

#### Export FHIR data behind firewalls

This feature enables exporting FHIR data to storage accounts behind firewalls. For more information, see [Configure export settings and set up a storage account](./././fhir/configure-export-data.md). 

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
