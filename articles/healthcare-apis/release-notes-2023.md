---
title: Release notes for 2023 Azure Health Data Services monthly releases
description: 2023 - Find out about features and improvements introduced in 2023 for the FHIR, DICOM, and MedTech services in Azure Health Data Services. Review the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: shellyhaverkamp
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 03/13/2024
ms.author: jasteppe 
ms.custom: references_regions
---

# Release notes: 2023 Azure Health Data Services

This article describes features, enhancements, and bug fixes released in 2023 for the FHIR&reg; service, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## December 2023

### Azure Health Data Services

#### Encryption with customer-managed keys for the FHIR and DICOM services

Data stored in Azure Health Data Services is automatically and seamlessly encrypted with service-managed keys managed by Microsoft. You can enable data encryption with customer-managed keys (CMK) for new and existing FHIR and DICOM services, providing your organization with improved flexibility to manage access controls.

Learn more:

- [Configure customer-managed keys for the FHIR service](fhir/configure-customer-managed-keys.md)
- [Configure customer-managed keys for the DICOM service](dicom/configure-customer-managed-keys.md)

### DICOM service

#### Store and manage medical imaging data with Azure Data Lake Storage (preview)

With the integration of the DICOM service with Azure Data Lake Storage available for preview, organizations have full control over their imaging data and increased flexibility to access and work with that data through the Azure storage ecosystem and APIs. By using Azure Data Lake Storage with the DICOM service, organizations are able to:

- Enable direct access to medical imaging data stored by the DICOM service using Azure storage APIs and DICOMweb APIs, providing more flexibility to access and work with the data.
- Open medical imaging data up to the entire ecosystem of tools for working with Azure storage, including AzCopy, Azure Storage Explorer, and the Data Movement library.
- Unlock new analytics and AI/ML scenarios by using services that natively integrate with Azure Data Lake Storage, including Azure Synapse, Azure Databricks, Azure Machine Learning, and Microsoft Fabric.
- Grant controls to manage storage permissions, access controls, tiers, and rules.

Learn more: 

- [Azure Data Lake Storage integration for the DICOM service in Azure Health Data Services](dicom/dicom-data-lake.md)
- [Deploy the DICOM service with Azure Data Lake Storage](dicom/deploy-dicom-services-in-azure-data-lake.md)

### FHIR service

#### Enhancement of the export operation

The `export` operation supports exporting versioned resources and soft deleted resources. 

Learn more:

- [Export query parameters](fhir/export-data.md)

## November 2023

### Azure Health Data Services

#### Unified Azure portal landing page 

In the Azure portal, we launched a unified landing page that lets users access all Microsoft Health Data and AI Services in one place. The landing page makes it easier to find and use all related Health Data and AI Services and includes links to relevant documentation to help users get started. To check out the landing page, sign into your Azure subscription and then search for **Health Data and AI Services**.

### FHIR service

#### Bulk delete capability (preview)

The `bulk delete` operation allows you to delete resources from the FHIR server asynchronously. The `bulk delete` operation can be executed at the system level or for individual resource types. 

Learn more:

- [Bulk delete operation](./../healthcare-apis/fhir/fhir-bulk-delete.md)

#### Import operation supports soft deleted resources

The capability to import soft deleted resources is useful during migration from Azure API for FHIR to Azure Health Data Services. See [PR #3530](https://github.com/microsoft/fhir-server/pull/3530)

#### Performance improvement for queries

We improved performance of FHIR queries with the `_include` parameter. See [PR #3572](https://github.com/microsoft/fhir-server/pull/3572).

#### Bug fixes

- **Fixed: Searching with `_include` and wildcard results in query failure**. The issue is fixed and permits only the wild character  `*` to be present for `_include` and `_revinclude` searches. [PR #3541](https://github.com/microsoft/fhir-server/pull/3541).

 - **Fixed: Multiple export jobs created results in increase data storage volume**. Due to a bug, export jobs created multiple child jobs when used with the typefilter parameter. The fix addresses the issue. See [PR #3567](https://github.com/microsoft/fhir-server/pull/3567).

- **Fixed: Retriable exception for import operation when using duplicate files**. If there are duplicate files during import, an exception would be thrown. This exception was considered as a retriable exception. The fix addresses the issue. Import operations with same file are no longer retriable. See [PR #3557](https://github.com/microsoft/fhir-server/pull/3557).

## October 2023

### DICOM service

#### Bulk import (preview)

Bulk import simplifies the process of adding data to the DICOM service. When enabled, the capability creates a storage container and .dcm files that are copied to the container are automatically added to the DICOM service. For more information, see [Import DICOM files (preview)](./../healthcare-apis/dicom/import-files.md).  

## September 2023

### Azure Health Data Services

#### Documentation navigation improvements

Documentation navigation improvements include a new hub page for Azure Health Data Services: [Azure Health Data Services Documentation](./index.yml). Also, fixes to breadcrumbs across the FHIR, DICOM, and MedTech services documentation and the table of contents make it easier and more intuitive to find documentation.

### FHIR service

#### Retirement announcement for Azure API for FHIR

Azure API for FHIR will be retired on September 30, 2026. [Azure Health Data Services FHIR service](/azure/healthcare-apis/healthcare-apis-overview) is the evolved version of Azure API for FHIR that enables customers to manage FHIR, DICOM, and MedTech services with integrations into other Azure services. Due to retirement of Azure API for FHIR, new deployments won't be allowed beginning April 1, 2025. For more information, see [migration strategies](/azure/healthcare-apis/fhir/migration-strategies). 

## August 2023

### FHIR service

#### Incremental import 

The import operation supports incremental load mode, which is optimized to periodically load data into the FHIR service. 

With incremental load mode, healthcare organizations can:
- Perform concurrent ingestion of data while simultaneously executing API CRUD operations on the FHIR server.
- Ingest versioned FHIR resources.
- Maintain the `lastUpdated` field value in FHIR resources during ingestion.
- Support conditional references.

Learn more:

- [Configure bulk import settings](./../healthcare-apis/fhir/configure-import-data.md)
- [Import FHIR data](./../healthcare-apis/fhir/import-data.md)

#### Batch-bundle parallelization (preview)

Batch bundles are executed serially in FHIR service by default. To improve throughput with bundle calls, we enabled parallel processing of batch bundles for preview.

Learn more:

- [Batch bundle parallelization](./../healthcare-apis/fhir/rest-api-capabilities.md)
- [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

#### Bug fixes

- **Fixed: Decimal value precision aligns with the FHIR specification.** Before the fix, FHIR service allowed precision value of [18,6]. The service was updated to support decimal value precision of [36,18] per the FHIR specification. See [FHIR specification data types](https://www.hl7.org/fhir/datatypes.html).

- **Fixed: Reindex on targeted search parameter sets the status correctly.** We identified a bug where after performing targeted search parameter reindex, resource data with search parameter wasn't searchable. This bug was addressed by changing the status of the search parameter. See [PR #3400](https://github.com/microsoft/fhir-server/pull/3400).

## July 2023

### FHIR service

#### Bug fixes

- **Fixed: Continuous retry on the import operation.** We observed an issue where $import kept retrying when the NDJSON file size is greater than 2 GB. The issue is fixed. See [PR #3342](https://github.com/microsoft/fhir-server/pull/3342).

- **Fixed: Patient and group level export job restart.** Patient and group level exports on interruption would restart from the beginning. This bug is fixed to restart the export jobs from the last successfully completed page of results. See [PR #3205](https://github.com/microsoft/fhir-server/pull/3205).

### DICOM service

#### API version 2 

The DICOM service API version 2 (v2) introduces several changes and new features. Most notable is the change to validation of DICOM attributes during store (STOW) operations. Beginning with v2, the request fails only if necessary attributes fail validation. 

Learn more:

- [DICOM v2 API changes](dicom/dicom-service-v2-api-changes.md)
- [DICOM Conformance Statement v2](dicom/dicom-services-conformance-statement-v2.md)

## June 2023

### FHIR service 

#### Bug fixes

- **Fixed: Reindex operation provides job status at resource level.** The `reindex` operation supports determining the status of the `reindex` operation with help of the API call `GET {{FHIR_URL}}/_operations/reindex/{{reindexJobId}}`. To see how many resources were reindexed, look for the **resourceReindexProgressByResource** field in the response. This field shows the progress for each resource type. See [PR #3286](https://github.com/microsoft/fhir-server/pull/3286).

- **Fixed: Optimization of complex search queries.** Some organizations experienced issues where complex FHIR queries with reference search parameters would time out. The issue was fixed by updating the SQL query generator to use an INNER JOIN for reference search parameters. See [PR #3295](https://github.com/microsoft/fhir-server/pull/3295).

- **Fixed: Metadata endpoint URL in the capability statement is a relative URL.** According to the FHIR specification, the metadata endpoint URL in the capability statement needs to be an absolute URL. The fix addresses the issue. See [PR #3265](https://github.com/microsoft/fhir-server/pull/3265).

Learn more:
- [FHIR Capability Statement](https://www.hl7.org/fhir/capabilitystatement-definitions.html#CapabilityStatement.url). 

### DICOM service

#### Retrieve rendered images

[Rendered images](dicom/dicom-services-conformance-statement.md#retrieve-rendered-image-for-instance-or-frame) can be retrieved from the DICOM service by using the new rendered endpoint. This API allows a DICOM instance or frame to be accessed in a consumer format (`jpeg` or `png`), a capability that can simplify scenarios such as a client application displaying an image preview. 

#### Bug fixes

- **Fixed: Issue where DICOM events and the change feed may miss changes.** The DICOM change feed API returned results that incorrectly skipped pending changes when the DICOM server was under load. Identical calls to the change feed resource resulted in new change events appearing in the middle of the result set. 

  For example, if the first call returned sequence numbers `1`, `2`, `3`, and `5`, then the second identical call might incorrectly return `1`, `2`, `3`, `4`, and `5`. This behavior also impacted the DICOM events sent to Azure Event Grid system topics, and resulted in missing events in downstream event handlers. See [PR #2611](https://github.com/microsoft/dicom-server/pull/2611).

### MedTech service 

#### Link device messages to FHIR encounters

Device messages can have encounter identifiers that match the ones in FHIR encounters. This way, healthcare organizations can easily find and link the FHIR encounters to the observations from the device data. Open Source Software (OSS) supports the look-up feature, which customers of the MedTech service asked for.

## May 2023

### FHIR service 

#### Bug fixes

- **Fixed: SMART on FHIR clinical scope mapping for applications.** This bug fix addresses an issue with clinical scope not interpreted correctly for backend applications. 
See [PR #3250](https://github.com/microsoft/fhir-server/pull/3250).

- **Fixed: Duplicate key error when passed in request parameters and body.** This fix handles the issue when using the POST {resourcetype}/search endpoint to query FHIR resources, the server returns `415 Unsupported Media Type`. This issue is due to repeating a query parameter in the URL query string and the request body. The fix considers all the query parameters from request and body as input. See [PR #3232](https://github.com/microsoft/fhir-server/pull/3232).

## April 2023

### Azure Health Data Services

#### Availability in West Central US region

Azure Health Data Services is generally available in the West Central US region.

### FHIR service 

#### Bug fixes

- **Fixed: Performance for search queries with identifiers.** This bug fix addresses timeout issues observed for search queries with identifiers by using the OPTIMIZE clause.
See [PR #3207](https://github.com/microsoft/fhir-server/pull/3207)

- **Fixed: Transient issues associated with loading custom search parameters.** This bug fix addresses the issue where the FHIR service wouldn't load the latest SearchParameter status in a failure. See [PR #3222](https://github.com/microsoft/fhir-server/pull/3222)

## March 2023

### Azure Health Data Services

#### Availability in the Japan East region

Azure Health Data Services is generally available in the Japan East region.

## February 2023

### FHIR service

#### The _till parameter and throughput improvement by 50x

The `_till` parameter is an optional parameter and allows you to export resources that were modified until the specified time. This improvement applies to system export.

Learn more:

- [Export FHIR data](./../healthcare-apis/fhir/export-data.md)
- [FHIR specification](https://hl7.org/fhir/uv/bulkdata/)

#### Bug fixes

- **Fixed: Chained search with :contains modifier results but no resources.** This bug fix addresses the issue and identified resources, per search criteria with :contains modifier are returned. See [PR #2990](https://github.com/microsoft/fhir-server/pull/2990). 

- **Fixed: The ability to tweak continuation token size limit header.** Before this change, during pagination a Cosmos DB continuation token had a default limit of 3 KB. With this change, you can send a Cosmos DB continuation token limit in the header. Valid range is set to 1-3 KB. The header value to send the value is `x-ms-documentdb-responsecontinuationtokenlimitinkb`. See [PR #2971](https://github.com/microsoft/fhir-server/pull/2971/files).

- **Fixed: HTTP Status code 500 encountered when :not modifier is used with chained searches.** This bug fix addresses the issue. Identified resources are returned per search criteria with :contains modifier. See [PR #3041](https://github.com/microsoft/fhir-server/pull/3041).

- **Fixed: Versioning policy enabled at resource level required If-match header for transaction requests.** The fix addresses the issue. Versioned policy at the resource level doesn't require if-match header. See [PR #2994](https://github.com/microsoft/fhir-server/pull/2994).

### MedTech service

#### Mapping Debugger (preview)

The MedTech service Mapping Debugger is a self-service tool for creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. It enables you to easily view and make inline adjustments in real-time without having to leave the Azure portal. 

Learn more:

- [Use the MedTech service Mapping debugger](./../healthcare-apis/iot/how-to-use-mapping-debugger.md)

#### Error message capability (preview)

The MedTech service error message feature allows you to view any errors generated, and the message that caused each error. You can learn the context behind any errors without manual effort. 

Learn more:

- [Troubleshoot errors using the MedTech service logs](./../healthcare-apis/iot/troubleshoot-errors-logs.md)

### DICOM service

#### DICOM event types

DICOM events are available in Azure Health Data Services workspace-level event subscriptions. These new event types enable event-driven workflows in medical imaging applications by subscribing to events for newly created and deleted DICOM images.

Learn more:

- [DICOM events](events/events-message-structure.md#dicom-events-message-structure)

#### Toolkit and samples open source
Two more sample apps are available in the open source samples repo. See [Azure-Samples/azure-health-data-services-samples)](https://github.com/Azure-Samples/azure-health-data-services-samples).

#### Bug fixes

- **Fixed: Validation errors included with the FailedSOPSequence.** Previously, DICOM validation failures returned by the Store (STOW) API lacked the detail necessary to diagnose and resolve problems. The API changes improve the error messages by including more information about the attributes that failed validation and the reason why. 

Learn more:

- [DICOM conformance statement](dicom/dicom-services-conformance-statement.md#store-response-payload)

## January 2023

### Azure Health Data Services

#### Azure Health Data services available in more regions

Azure Health Data Services is generally available in the France Central, North Central US, and Qatar Central regions.

### DICOM service

#### Support for ModalitiesInStudy attribute

The DICOM service supports `ModalitiesInStudy` as a [searchable attribute](dicom/dicom-services-conformance-statement.md#searchable-attributes) at the study, series, and instance level. Support for this attribute allows for the list of modalities in a study to be returned more efficiently without needing to query each series independently. 

Learn more:

- [Searchable attributes](dicom/dicom-services-conformance-statement.md#searchable-attributes)

#### Support for NumberOfStudyRelatedInstances and NumberOfSeriesRelatedInstances attributes

Two attributes for returning the count of instances in a study or series are available in search responses.

Learn more:

[Search responses](dicom/dicom-services-conformance-statement.md#other-series-tags) 

### Toolkit and samples open source

#### Another sample app is available

One new sample app is released in the [Azure Health Data Services samples repo](https://github.com/Azure-Samples/azure-health-data-services-samples).

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2022](release-notes-2022.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
