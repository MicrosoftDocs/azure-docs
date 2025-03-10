---
title: Release notes for 2024 Azure Health Data Services monthly releases
description: 2024 - Stay updated with the latest features and improvements for the FHIR, DICOM, and MedTech services in Azure Health Data Services in 2024. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: shellyhaverkamp
ms.service: azure-health-data-services
ms.subservice: workspace
ms.topic: reference
ms.date: 07/29/2024
ms.author: kesheth
ms.custom: references_regions
---

# Release notes 2024: Azure Health Data Services

This article describes features, enhancements, and bug fixes released in 2024 for the FHIR&reg; service, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## November 2024

### Azure Health Data Services

#### Improvements in the import operation

- Error Logging Enhancements: During the import operation, the error log now reports the specific files that failed during ingestion into the FHIR service. This improvement provides more detailed feedback on failed imports.
- Import Job Cancellation: A bug was identified where canceling an import job didn't trigger cancellation for associated child jobs. This issue is resolved, and now canceling an import job also cancels all related child jobs within the current orchestrator.
- Export Validation Improvement: An issue was found where exports proceeded despite invalid search parameters. A change is implemented to prevent exports under these conditions. This is the default behavior, but customers can override it using the lenient flag. The change was communicated to customers last month.
- Bundle Performance Enhancement: The profile refresh process during bundle execution has been simplified. If a bundle contains changes to `ValueSet`, `StructureDefinition`, and/or `CodeSystem`, no profile refreshes will occur until the bundle is fully completed. The change improves the performance of bundles by reducing delays caused by multiple refreshes when handling changes to these resource types.
- Content Type Header Parsing: An issue related to parsing the `application/x-www-form-urlencoded` content type header has been addressed and resolved.
- Reindexing Enhancements: The reindex operation is improved by removing an artificial limitation which previously restricted handling of large historical datasets, or cases where customers requested a limited query size. Additionally, reindex process would incorrectly report as "completed" when handling many sequential historical or deleted resources with the default query size. This issue has been addressed to ensure that the reindexing process completes correctly and reports the appropriate status.

## October 2024

### Azure Health Data Services

### FHIR service

#### Bug fixes

- Export Validation: An issue was identified where exports proceeded despite invalid search parameters. We're introducing a change that prevents exports under these conditions. This feature is currently behind a strict validation flag and will become the default behavior on or after October 30.
- Search Parameter Inclusion: We resolved an issue where additional search parameters (for instance, `_include`, `_has`) didn't return all expected results, sometimes omitting the next link.
- Export Job Execution: A rare occurrence of `System.ObjectDisposedException` during export job completion has been addressed by preventing premature exits.
- HTTP Status Code Update: The HTTP status code for invalid parameters during `$reindex` job creation is now updated to 400, ensuring better error handling.
- Search Parameter Cleanup: A fix has been implemented to ensure complete cleanup of search parameters in the database when triggered with delete API calls, addressing issues related to incomplete deletions.
- Descending Sort Issue: Resolved an issue where descending sort operations returned no resources if the sorted field had no data in the database, even when relevant resources existed.
- Authentication Failure Handling: Added a new catch block to manage authentication failures when import requests are executed with managed identity turned off.


## September 2024

### Azure Health Data Services

### FHIR service

#### Enhanced Export Efficiency
The export functionality has been improved to optimize memory usage. With this change, the export process now pushes data to blob storage one resource at a time, reducing memory consumption. 

## August 2024

### Azure Health Data Services

### FHIR service

#### Import operation error handling
1. The import operation returns an HTTP 400 error when a search parameter resource is ingested via the import process. This change is intended to prevent search parameters from being placed in an invalid state when ingested with an import operation.
2. The import operation returns an HTTP 400 status code, as opposed to the previous HTTP 500 status code, in cases where configuration issues with the storage account occur. This update aims to improve error handling associated with managed identities during import operations. 

## July 2024

### Azure Health Data Services

### FHIR service

#### Allow dates in JSON data to be treated as strings in the Convert-Data operation

It's possible for dates supplied within JSON data to be returned in a different format than what was supplied. During deserialization of the JSON payload strings that are identified as dates get converted into .NET DateTime objects. These objects then get converted back to strings before going through the Liquid template engine. This conversion can cause the date value to be reformatted and represented in the local timezone of the FHIR service.

The coercion of strings to .NET DateTime objects can be disabled using the boolean parameter `jsonDeserializationTreatDatesAsStrings`. When set to `true`, the supplied data is treated as a string and won't be modified before being supplied to the Liquid engine.

#### Import Operation enhancement
The FHIR service now allows ingestion of data without specifying a version at the resource level. The order of resources is maintained using the lastUpdated value. This enhancement introduces the "allowNegativeVersions" flag. Setting flag true allows the FHIR service to assign negative versions for resource records with an explicit lastUpdated value and no version specified.

#### Bug Fixes
- **Fixed inclusion of soft deleted resources when using _security:not search parameter**
When using the _security:not search parameter in search operations, IDs for soft-deleted resources were being included in the search results. We have fixed the issue so that soft-deleted resources are now excluded from search results.
- **Exporting Data as SMART User**
Exporting data as a SMART user no longer requires write scopes. Previously, it was necessary to grant "write" privileges to a SMART user for exporting data, which implied higher privilege levels. To initiate an export job as a SMART user, ensure the user is a member of the FHIR export role in RBAC and requests the "read" SMART clinical scope. 
Updating Status Code from HTTP 500 to HTTP 400
- **Updating Status Code from HTTP 500 to HTTP 400**
During a patch operation, if the payload requested an update for a resource type other than parameter, an internal server error (HTTP 500) was initially thrown. This has been updated to throw an HTTP 400 error instead.

#### Performance enhancement
Query optimization is added when searching FHIR resources with a data range. This query optimization helps with efficient querying as one combined CTE is generated.

## May 2024

### Azure Health Data Services

### FHIR service

#### Scaling enhancement to the Import operation

The scaling logic for import operations is improved, enabling multiple jobs to be executed in parallel. This change impacts audit logs for the import operation. Audit logs for individual import jobs have multiple rows, with each row corresponding to an internal processing job. 

#### Bug fixes
- **Fixed: HTTP status code for long-running requests**. FHIR requests that take longer than 100 seconds to execute return an HTTP 408 status code instead of HTTP 500. 
- **Fixed: History request in bundle**. Before the fix, history request in a bundle returned HTTP status code 404.

#### Stand-alone FHIR converter (preview)

The stand-alone FHIR converter API available for preview is decoupled from the FHIR service and packaged as a container (Docker) image. In addition to enabling you to convert data from the source of record to FHIR R4 bundles, the FHIR converter offers:

- **Bidirectional data conversion from source of record to FHIR R4 bundles and back.** For example, the FHIR converter can convert data from FHIR R4 format back to HL7v2 format.
- **Improved experience for customization** of default [Liquid](https://shopify.github.io/liquid/) templates.
- **Samples** that demonstrate how to create an ETL (extract, transform, load) pipeline with [Azure Data Factory (ADF)](/azure/data-factory/introduction).

To implement the FHIR converter container image, see the [FHIR converter GitHub project](https://github.com/microsoft/fhir-converter).

## April 2024

### DICOM service

#### Enhanced Upsert operation

The enhanced Upsert operation enables you to upload a DICOM image to the server and seamlessly replace it if it already exists. Before this enhancement, users had to perform a Delete operation followed by a STOW-RS to achieve the same result. With the enhanced Upsert operation, managing DICOM images is more efficient and streamlined.

#### Expanded storage for required attributes

The DICOM service allows users to upload DICOM files up to 4 GB in size. No single DICOM file or combination of files in a single request is allowed to exceed this limit.  

### FHIR service

#### The bulk delete operation is generally available

The bulk delete operation allows deletion of FHIR resources across different levels, enabling healthcare organizations to comply with data retention policies while providing asynchronous processing capabilities. The benefits of the bulk delete operation are:

- **Execute bulk delete at different levels**: The bulk delete operation allows you to delete resources from the FHIR server asynchronously. You can execute bulk delete at different levels:
    - **System level**: Enables deletion of FHIR resources across all resource types.
    - **Individual resource type**: Allows deletion of specific FHIR resources.
- **Customizable**: Query parameters allow filtering of raw resources for targeted deletions.
- **Async processing**: The operation is asynchronous, providing a polling endpoint to track progress.

Learn more:
- [Bulk delete in the FHIR service](./fhir/fhir-bulk-delete.md)

## March 2024

### DICOM service

#### Integration with Azure Data Lake Storage is generally available

Azure Data Lake Storage integration for the DICOM service in Azure Health Data Services is generally available. The DICOM service provides cloud-scale storage for medical imaging data using the DICOMweb standard. With the integration of Azure Data Lake Storage, organizations can enjoy full control over their imaging data and increased flexibility for accessing and working with that data through the Azure storage ecosystem and APIs.

By using Azure Data Lake Storage with the DICOM service, organizations are able to:
-	Enable direct access to medical imaging data stored by the DICOM service using Azure storage APIs and DICOMweb APIs, providing more flexibility to access and work with the data.
-	Open medical imaging data up to the entire ecosystem of tools for working with Azure storage, including AzCopy, Azure Storage Explorer, and the Data Movement library.
-	Unlock new analytics and AI/ML scenarios by using services that natively integrate with Azure Data Lake Storage, including Azure Synapse, Azure Databricks, Azure Machine Learning, and Microsoft Fabric.
-	Grant controls to manage storage permissions, access controls, tiers, and rules.

Learn more:
- [Manage medical imaging data with the DICOM service and Azure Data Lake Storage](./dicom/dicom-data-lake.md)
- [Deploy the DICOM service with Azure Data Lake Storage](./dicom/deploy-dicom-services-in-azure-data-lake.md)

### FHIR service 

#### Bundle parallelization (GA)
Bundles are executed serially in FHIR service by default. To improve throughput with bundle calls, we enabled parallel processing.

Learn more:
- [Bundle parallelization](./../healthcare-apis/fhir/rest-api-capabilities.md)

#### Import operation accepts multiple resource types in single file

Import operation allowed to have resource type per input file in the request parameters. With this enhance capability, you can pass multiple resource types in single file.

#### Bug fixes

- **Fixed: Import operation ingests resources with the same resource type and lastUpdated field value**. Before this change, resources executed in a batch with the same type and `lastUpdated` field value wasn't ingested into the FHIR service. This bug fix addresses the issue. See [PR#3768](https://github.com/microsoft/fhir-server/pull/3768).

- **Fixed: FHIR search with 3 or more custom search parameters**. Before this fix, a FHIR search query at the root with three or more custom search parameters resulted in HTTP status code 504. See [PR#3701](https://github.com/microsoft/fhir-server/pull/3701).

- **Fixed: Improve performance for bundle processing**. Updates to the task execution method, enabling bundle processing performance improvement. See [PR#3727](https://github.com/microsoft/fhir-server/pull/3727).

## February 2024

### FHIR service

#### Counting all versions of resources is enabled

The query parameter `_summary=count` and `_count=0` can be added to the `_history` endpoint to get a count of all versioned resources. This count includes historical and soft deleted resources.

#### Revinclude search can reference all resources with wildcard character

The FHIR service supports wildcard searches with `revinclude`. Add `*.*` to the query parameter in a `revinclude` query to direct the FHIR service to reference all resources mapped to the source resource. 

#### Bug fixes

- **Fixed: Improve FHIR query response time with performance enhancements**. To improve performance, a missing modifier can be specified for a search parameter that is used for sort. See [PR#3655](https://github.com/microsoft/fhir-server/pull/3655).

- **Fixed: Import operation honors ingestion of non-sequential resource versions**. Before this change, incremental mode in the `import` operation assumed versions are sequential integers. After this bug fix, versions can be ingested in nonsequential order. See [PR#3685](https://github.com/microsoft/fhir-server/pull/3685).

## January 2024

### DICOM service

#### Bulk update of files 

The bulk update operation allows you to change imaging metadata for multiple files stored in the DICOM service. For example, bulk update enables you to modify DICOM attributes for one or more studies in a single, asynchronous operation. You can use an API to perform updates to patient demographics and avoid the cost of repeating time-consuming uploads.

Beyond the efficiency gains, the bulk update capability preserves a record of the changes in the change feed and persists the original, unmodified instances for future retrieval.

Learn more:

- [Bulk update DICOM files](dicom/update-files.md)

### FHIR service

#### Selectable search parameters (preview)

The selectable search parameter capability available for preview allows you to customize and optimize searches on FHIR resources. The capability lets you choose which inbuilt search parameters to enable or disable for the FHIR service. By enabling only the search parameters you need, you can store more FHIR resources and potentially improve performance of FHIR search queries.

Learn more: 

- [Selectable search parameters for the FHIR service](fhir/selectable-search-parameters.md)

#### Integration of the FHIR service with Azure Active Directory B2C

Healthcare organizations can use the FHIR service in Azure Health Data Services with Azure Active Directory B2C (Azure AD B2C). Organizations gain a secure and convenient way to grant access to the FHIR service with fine-grained access control for different users or groups, without creating or comingling user accounts in their organization’s Microsoft Entra ID tenant. With this integration, organizations can:

- Use additional identity providers to authenticate and access FHIR resources with SMART on FHIR scopes. 
- Manage and customize user access rights or permissions with SMART on FHIR scopes that support fine-grained access control, FHIR resource types and interactions, and a user’s underlying privileges.

Related content:

- [Use Azure Active Directory B2C to grant access to the FHIR service](fhir/azure-ad-b2c-setup.md)
- [Configure multiple service identity providers for the FHIR service](fhir/configure-identity-providers.md)
- [Troubleshoot identity provider configuration for the FHIR service](fhir/troubleshoot-identity-provider-configuration.md)
- [Enable SMART on FHIR for the FHIR service](fhir/smart-on-fhir.md)
- [Sample: Azure ONC (g)(10) SMART on FHIR](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/patientandpopulationservices-smartonfhir-oncg10)

#### Request up to 100 TB of storage

The FHIR service can store and exchange large amounts of health data, and each FHIR service instance has a storage limit of 4 TB by default. If you have more data, you can ask Microsoft to increase storage up to 100 TB for your FHIR service.
 
With more storage, organizations can handle large data sets to enable analytics scenarios. For example, you can use more storage to manage population health, conduct research, and gain new insights from health data. Plus, more storage enables Azure API for FHIR customers with high-volume data (greater than 4 TB) to migrate to the FHIR service in Azure Health Data Services.
 
To request storage greater than 4 TB, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) on the Azure portal and use the issue type **Service and Subscription limit (quotas)**.

> [!NOTE]
> Due to an issue with billing metrics for storage, customers who opt for more than 4 TB of storage capacity won't be billed for storage until the issue is resolved.

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
