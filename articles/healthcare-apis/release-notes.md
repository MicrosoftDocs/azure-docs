---
title: Release notes for Azure Health Data Services monthly releases 2023-2024
description: Stay updated with the latest features and improvements of Azure Health Data Services. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 02/15/2024
ms.author: kavitagaddam 
ms.custom: references_regions
---

# Release notes: Azure Health Data Services 2023-2024

Azure Health Data Services is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. 

This article describes new features and enhancements introduced in Azure Health Data Services in 2023 and 2024, including these services:

- FHIR&reg; service
- DICOM&reg; service
- MedTech service

> [!NOTE]
> Azure Health Data Services is generally available. For more information, see the [Service Level Agreement (SLA) for Azure Health Data Services](https://azure.microsoft.com/support/legal/sla/health-data-services/v1_1/).

## January 2024

### Bulk update of files in the DICOM service

The bulk update operation allows you to change imaging metadata for multiple files stored in the DICOM service. For example, bulk update enables you to modify DICOM attributes for one or more studies in a single, asynchronous operation. You can use an API to perform updates to patient demographics and avoid the cost of repeating time-consuming uploads.

Beyond the efficiency gains, the bulk update capability preserves a record of the changes in the change feed and persists the original, unmodified instances for future retrieval.

Learn more:

- [Bulk update DICOM files](dicom/update-files.md)

### Selectable search parameters for the FHIR service (preview)

The selectable search parameter capability available for preview allows you to customize and optimize searches on FHIR resources. The capability lets you choose which inbuilt search parameters to enable or disable for the FHIR service. By enabling only the search parameters you need, you can store more FHIR resources and potentially improve performance of FHIR search queries.

Learn more: 

- [Selectable search parameters for the FHIR service](fhir/selectable-search-parameters.md)

### Integration of the FHIR service with Azure Active Directory B2C

Healthcare organizations can use the FHIR service in Azure Health Data Services with Azure Active Directory B2C (Azure AD B2C). This capability gives organizations a secure and convenient way to grant access to the FHIR service in Azure Health Data Services with fine-grained access control for different users or groups, without creating or comingling user accounts in their organization’s Microsoft Entra ID tenant. With this integration, organizations can:

- Use additional identity providers to authenticate and access FHIR resources with SMART on FHIR scopes. 
- Manage and customize user access rights or permissions with SMART on FHIR scopes that support fine-grained access control, FHIR resource types and interactions, and a user’s underlying privileges.

Related content:

- [Use Azure Active Directory B2C to grant access to the FHIR service](fhir/azure-ad-b2c-setup.md)
- [Configure multiple service identity providers for the FHIR service](fhir/configure-identity-providers.md)
- [Troubleshoot identity provider configuration for the FHIR service](fhir/troubleshoot-identity-provider-configuration.md)
- [SMART on FHIR](fhir/smart-on-fhir.md)
- [Sample: Azure ONC (g)(10) SMART on FHIR](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/patientandpopulationservices-smartonfhir-oncg10)

### Request up to 100 TB of storage for the FHIR service

The FHIR service can store and exchange large amounts of health data, and each FHIR service instance has a storage limit of 4 TB by default. If you have more data, you can ask Microsoft to increase storage up to 100 TB for your FHIR service.
 
With more storage, organizations can handle large data sets to enable analytics scenarios. For example, you can use more storage to manage population health, conduct research, and gain new insights from health data. Plus, more storage enables Azure API for FHIR customers with high-volume data (greater than 4 TB) to migrate to the FHIR service in Azure Health Data Services.
 
To request storage greater than 4 TB, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) on the Azure portal and use the issue type **Service and Subscription limit (quotas)**.

> [!NOTE]
> Due to an issue with billing metrics for storage, customers who opt for more than 4 TB of storage capacity won't be billed for storage until the issue is resolved.

## December 2023

### Encryption with customer-managed keys for the FHIR and DICOM services

Data stored in Azure Health Data Services is automatically and seamlessly encrypted with service-managed keys managed by Microsoft. You can enable data encryption with customer-managed keys (CMK) for new and existing FHIR® and DICOM® services, providing your organization with improved flexibility to manage access controls.

Learn more:

- [Configure customer-managed keys for the FHIR service](fhir/configure-customer-managed-keys.md)
- [Configure customer-managed keys for the DICOM service](dicom/configure-customer-managed-keys.md)

### Store and manage DICOM medical imaging data with Azure Data Lake Storage (preview)

With the integration of the DICOM service with Azure Data Lake Storage available for preview, organizations have full control over their imaging data and increased flexibility to access and work with that data through the Azure storage ecosystem and APIs. By using Azure Data Lake Storage with the DICOM service, organizations are able to:

- Enable direct access to medical imaging data stored by the DICOM service using Azure storage APIs and DICOMweb APIs, providing more flexibility to access and work with the data.
- Open medical imaging data up to the entire ecosystem of tools for working with Azure storage, including AzCopy, Azure Storage Explorer, and the Data Movement library.
- Unlock new analytics and AI/ML scenarios by using services that natively integrate with Azure Data Lake Storage, including Azure Synapse, Azure Databricks, Azure Machine Learning, and Microsoft Fabric.
- Grant controls to manage storage permissions, access controls, tiers, and rules.

Learn more: 

- [Azure Data Lake Storage integration for the DICOM service in Azure Health Data Services](dicom/dicom-data-lake.md)
- [Deploy the DICOM service with Azure Data Lake Storage](dicom/deploy-dicom-services-in-azure-data-lake.md)

### Enhancement of the export operation in the FHIR service

The `export` operation supports exporting versioned resources and soft deleted resources. 

Learn more:

- [Export query parameters](fhir/export-data.md)

## November 2023

### Unified Azure portal landing page 

In the Azure portal, we launched a unified landing page that lets users access all Microsoft Health Data and AI Services in one place. The landing page makes it easier to find and use all related Health Data and AI Services and includes links to relevant documentation to help users get started. To check out the landing page, sign into your Azure subscription and then search for **Health Data and AI Services**.

### Bulk delete capability in the FHIR service (preview)

The `bulk delete` operation allows you to delete resources from the FHIR server asynchronously. The `bulk delete` operation can be executed at the system level or for individual resource types. 

Learn more:

- [Bulk delete operation](./../healthcare-apis/fhir/fhir-bulk-delete.md)

### Import operation in the FHIR service supports soft deleted resources

The capability to import soft deleted resources is useful during migration from Azure API for FHIR to Azure Health Data Services. 

Related content: 

- [Fix SQL Import for soft delete and history](https://github.com/microsoft/fhir-server/pull/3530)

### Performance improvement for FHIR queries

We improved performance of FHIR queries with the `_include` parameter. 

Related content:

- [Change query generator to use INNER JOIN](https://github.com/microsoft/fhir-server/pull/3572).

### FHIR service bug fixes

- **Fixed: Searching with _include and wildcard results in query failure**. The issue is fixed and permits only the wild character  `*` to be present for _include and _revinclude searches. 

 - **Fixed: Multiple export jobs created results in increase data storage volume**. Due to a bug, export jobs created multiple child jobs when used with the typefilter parameter. The fix addresses the issue. 

- **Fixed: Retriable exception for import operation when using duplicate files**. If there are duplicate files during import, an exception would be thrown. This exception was considered as a retriable exception. This fix addresses the issue. Import operations with same file are no longer retriable. 

Learn more:

  - [Fix syntax check for : when wildcard is used](https://github.com/microsoft/fhir-server/pull/3541)
  - [Fix export](https://github.com/microsoft/fhir-server/pull/3567)
  - [Handles exception message for duplicate file in import operation](https://github.com/microsoft/fhir-server/pull/3557)

## October 2023

### DICOM Service
**Bulk import is available for public preview**

Bulk import simplifies the process of adding data to the DICOM service. When enabled, the capability creates a storage container and .dcm files that are copied to the container are automatically added to the DICOM service. For more information, see [Import DICOM files (preview)](./../healthcare-apis/dicom/import-files.md).  

## September 2023

### FHIR service

**Retirement announcement for Azure API for FHIR**

Azure API for FHIR will be retired on September 30, 2026. [Azure Health Data Services FHIR service](/azure/healthcare-apis/healthcare-apis-overview) is the evolved version of Azure API for FHIR that enables customers to manage FHIR, DICOM, and MedTech services with integrations into other Azure services. Due to retirement of Azure API for FHIR, new deployments won't be allowed beginning April 1, 2025. For more information, see [migration strategies](/azure/healthcare-apis/fhir/migration-strategies). 

**Documentation navigation improvements**

Documentation navigation improvements include a new hub page for Azure Health Data Services: [Azure Health Data Services Documentation](./index.yml). Also, fixes to breadcrumbs across the FHIR, DICOM, and MedTech services documentation and the table of contents make it easier and more intuitive to find documentation.

## August 2023

### FHIR service

**Incremental Import feature is generally available (GA)**

$Import operation supports new capability of "Incremental Load" mode, which is optimized for periodically loading data into the FHIR service. 

With Incremental Load mode, customers can:
1.	Perform concurrent ingestion of data while simultaneously executing API CRUD operations on the FHIR server.
1.	Ingest versioned FHIR resources.
1.	Maintain the lastUpdated field value in FHIR resources during ingestion.
1. Supports conditional references
For details on Incremental Import, see [Import Documentation](./../healthcare-apis/fhir/configure-import-data.md).

**Batch-Bundle parallelization capability available in Public Preview**

Batch bundles are executed serially in FHIR service by default. To improve throughput with bundle calls, we're enabling parallel processing of batch bundles.For details, visit [Batch Bundle Parellization](./../healthcare-apis/fhir/fhir-rest-api-capabilities.md)

Batch-bundle parallelization capability is in public preview. Review disclaimer for more details. 
[!INCLUDE [public preview disclaimer](./../healthcare-apis/includes/common-publicpreview-disclaimer.md)]

**Decimal value precision in FHIR service is updated per FHIR specification**

Prior to the fix, FHIR service allowed precision value of [18,6]. The service is updated to support decimal value precision of [36,18] per FHIR specification. For details, visit [FHIR specification Data Types](https://www.hl7.org/fhir/datatypes.html)

**Reindex on targeted search parameter sets the status correctly**

We identified a bug where after performing targeted search parameter reindex, resource data with search parameter was still not searchable. This bug was addressed by changing the status of the search parameter. The issue is fixed, for details visit [3400](https://github.com/microsoft/fhir-server/pull/3400).

**$convert-data documentation updates**

Customers can find detailed documentation on the $convert-data operation, allowing them to have an easier self-service experience. The documentation includes an [overview](./fhir/overview-of-convert-data.md), how to [configure settings](./fhir/configure-settings-convert-data.md), a ready-made [pipeline template](./fhir/convert-data-with-azure-data-factory.md) in Azure Data Factory, [troubleshooting](./fhir/troubleshoot-convert-data.md) tips, and an [FAQ](./fhir/frequently-asked-questions-convert-data.md).

## July 2023

### FHIR Service
**Continuous retry on Import operation**

We observed an issue where $import kept on retrying when NDJSON file size is greater than 2 GB. The issue is fixed, for details visit [3342](https://github.com/microsoft/fhir-server/pull/3342).

**Patient and Group level export job restart**

Patient and Group level exports on interruption would restart from the beginning. Bug is fixed to restart the export jobs from the last successfully completed page of results. For more information, visit [3205](https://github.com/microsoft/fhir-server/pull/3205).

### DICOM Service
**API Version 2 is Generally Available (GA)**

The DICOM service API v2 is Generally Available (GA) and introduces [several changes and new features](dicom/dicom-service-v2-api-changes.md). Most notable is the change to validation of DICOM attributes during store (STOW) operations - beginning with v2, the request fails only if **required attributes** fail validation. See the [DICOM Conformance Statement v2](dicom/dicom-services-conformance-statement-v2.md) for full details. 

## June 2023

### FHIR Service 

**Introducing Incremental Import**

$Import operation supports new capability of "Incremental Load" mode, which is optimized for periodically loading data into the FHIR service. 

With Incremental Load mode, customers can:
1.	Perform concurrent ingestion of data while simultaneously executing API CRUD operations on the FHIR server.
1.	Ingest versioned FHIR resources.
1.	Maintain the lastUpdated field value in FHIR resources during ingestion.
For details on Incremental Import, visit [Import Documentation](./../healthcare-apis/fhir/configure-import-data.md).

**Reindex operation provides job status at resource level**

Reindex operation supports determining the status of the reindex operation with help of API call `GET {{FHIR_URL}}/_operations/reindex/{{reindexJobId}}`.
Details per resource, on the number of completed reindexed resources can be obtained with help of the new field, added in the response- "resourceReindexProgressByResource". For details, see [3286](https://github.com/microsoft/fhir-server/pull/3286).

**FHIR Search Query optimization of complex queries**

Some organizations experienced issues where complex FHIR queries with Reference Search Parameters would time out. Issue is fixed by updating the SQL query generator to use an INNER JOIN for Reference Search Parameters. For details, visit [#3295](https://github.com/microsoft/fhir-server/pull/3295).

**Metadata endpoint URL in capability statement is relative URL**

Per FHIR specification, metadata endpoint URL in capability statement needs to be an absolute URL. For details on the FHIR specification, visit [Capability Statement](https://www.hl7.org/fhir/capabilitystatement-definitions.html#CapabilityStatement.url). This fix addresses the issue, for details visit [3265](https://github.com/microsoft/fhir-server/pull/3265).


### DICOM Service

**Retrieve rendered image is GA**

[Rendered images](dicom/dicom-services-conformance-statement.md#retrieve-rendered-image-for-instance-or-frame) can be retrieved from the DICOM service by using the new rendered endpoint. This API allows a DICOM instance or frame to be accessed in a consumer format (`jpeg` or `png`), a capability that can simplify scenarios such as a client application displaying an image preview. 


**Fixed issue where DICOM events and Change Feed may miss changes**

The DICOM Change Feed API could previously return results that incorrectly skipped pending changes when the DICOM server was under load. Identical calls to the Change Feed resource could result in new change events appearing in the middle of the result set. For example, if the first call returned sequence numbers `1`, `2`, `3`, and `5`, then the second identical call could have incorrectly returned `1`, `2`, `3`, `4`, and `5`. This behavior also impacted the DICOM events sent to Azure Event Grid System Topics, and could have resulted in missing events in downstream event handlers. For more information, see [#2611](https://github.com/microsoft/dicom-server/pull/2611).

### MedTech service 

**Encounter identifiers included in the device message**

Customers can include encounter identifiers in the device message so that they can look up the corresponding FHIR encounter and link it to the observation created in the FHIR transformation. This look up feature is supported in OSS and was a request from customers for the PaaS MedTech service.


## May 2023

### FHIR Service 

**SMART on FHIR : Fixed clinical scope mapping for applications**

This bug fix addresses issue with clinical scope not interpreted correctly for backend applications. 
For more information, visit [#3250](https://github.com/microsoft/fhir-server/pull/3250)

**Addresses duplicate key error when passed in request parameters and body**

This bug fix handles the issue, when using the POST {resourcetype}/search endpoint to query FHIR resources, the server returns 415 Unsupported Media Type. This issue is due to repeating a query parameter in the URL query string and the request body. This fix considers all the query parameters from request and body as input. For more information, visit [#3232](https://github.com/microsoft/fhir-server/pull/3232)

## April 2023
### Azure Health Data Services

**Azure Health Data services General Available (GA) in new regions**

General availability (GA) of Azure Health Data services in West Central US region.

### FHIR Service 

**Fixed performance for Search Queries with identifiers**

This bug fix addresses timeout issues observed for search queries with identifiers, by using the OPTIMIZE clause.
For more information, visit [#3207](https://github.com/microsoft/fhir-server/pull/3207)

**Fixed transient issues associated with loading custom search parameters**

This bug fix addresses the issue where the FHIR service wouldn't load the latest SearchParameter status in a failure.
For more information, visit [#3222](https://github.com/microsoft/fhir-server/pull/3222)

## March 2023
### Azure Health Data Services

**Azure Health Data services General Available (GA) in new regions**

General availability (GA) of Azure Health Data services in Japan East region.


## February 2023
### FHIR service

**Introduction of _till parameters and throughput improvement by 50x**

_till parameter is introduced as optional parameter and allows you to export resources that have been modified until the specified time. 

This feature improvement is applicable to System export, for more information on export, see [FHIR specification](https://hl7.org/fhir/uv/bulkdata/)

Also see [Export your FHIR data by invoking the $export command on the FHIR service](./../healthcare-apis/fhir/export-data.md)

**Fixed issue for Chained search with :contains modifier results with no resources are returned**

This bug fix addresses the issue and identified resources, per search criteria with :contains modifier are returned. 

For more information, visit [#2990](https://github.com/microsoft/fhir-server/pull/2990) 



**Provide the ability to tweak continuation token size limit with header.**


Previous to this change, during pagination Cosmos DB continuation token had a default limit of 3 Kb. With this change, customers can send Cosmos DB Continuation Token limit in the header. Valid range is set to 1-3 Kb. Header value that can be used to send this value is x-ms-documentdb-responsecontinuationtokenlimitinkb

For more information, visit [#2971](https://github.com/microsoft/fhir-server/pull/2971/files) and [Overview of search in Azure API for FHIR | Microsoft Learn](./../healthcare-apis/azure-api-for-fhir/overview-of-search.md)


**Fixed issue related to HTTP Status code 500 was encountered when :not modifier was used with chained searches**

This bug fix addresses the issue. Identified resources are returned per search criteria with :contains modifier. for more information on bug fix visit [#3041](https://github.com/microsoft/fhir-server/pull/3041) 


**Versioning policy enabled at resource level still required If-match header for transaction requests.**

Bug fix addresses the issue and versioned policy at resource level doesn't require if-match header, for more information on bug fix visit [#2994](https://github.com/microsoft/fhir-server/pull/2994)




### MedTech service

**Mapping Debugger released in public-preview**

The MedTech service's new Mapping Debugger is a self-service tool that is used for creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. It enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. 

For more information, visit [How to use the MedTech service Mapping debugger - Azure Health Data Services | Microsoft Learn](./../healthcare-apis/iot/how-to-use-mapping-debugger.md)



**Error Message released in private-preview**

The MedTech service has an error message feature that allows you to easily view any errors generated, and the message that caused each error. You can understand the context behind any errors without manual effort. For more info on error logs, visit [Troubleshoot errors using the MedTech service logs - Azure Health Data Services | Microsoft Learn](./../healthcare-apis/iot/troubleshoot-errors-logs.md)





### DICOM service

**New DICOM Event Types are GA**

[DICOM Events](events/events-message-structure.md#dicom-events-message-structure) are generally available in the HDS workspace-level event subscriptions. These new event types enable event-driven workflows in medical imaging applications by subscribing to events for newly created and deleted DICOM images.


**Validation errors included with the FailedSOPSequence**

Previously, DICOM validation failures returned by the Store (STOW) API lacked the detail necessary to diagnose and resolve problems. The latest API changes improve the error messages by including more information about the specific attributes that failed validation and the reason for the failures. See the [conformance statement](dicom/dicom-services-conformance-statement.md#store-response-payload) for details.


### Toolkit and Samples Open Source


Two new sample apps are released in the open source samples repo: [Azure-Samples/azure-health-data-services-samples: Samples for using the Azure Health Data Services (github.com)](https://github.com/Azure-Samples/azure-health-data-services-samples)






## January 2023

### Azure Health Data Services

**Azure Health Data services General Available (GA) in new regions**

General availability (GA) of Azure Health Data services in France Central, North Central US and Qatar Central Regions.


### DICOM service

**Added support for `ModalitiesInStudy` attribute**

The DICOM service supports `ModalitiesInStudy` as a [searchable attribute](dicom/dicom-services-conformance-statement.md#searchable-attributes) at the Study, Series, and Instance level. Support for this attribute allows for the list of modalities in a study to be returned more efficiently, without needing to query each series independently. 


**Added support for `NumberOfStudyRelatedInstances` and `NumberOfSeriesRelatedInstances` attributes**

Two new attributes for returning the count of Instances in a Study or Series are available in Search [responses](dicom/dicom-services-conformance-statement.md#other-series-tags). 



### Toolkit and Samples Open Source


**New sample app has been released**

One new sample app is released in the [Health Data Services samples repo](https://github.com/Azure-Samples/azure-health-data-services-samples)

## Related content
[Release notes archive 2022-2021](release-notes-archive.md)
[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
