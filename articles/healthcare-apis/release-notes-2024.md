---
title: Release notes for 2024 Azure Health Data Services monthly releases
description: 2024 - Stay updated with the latest features and improvements for the FHIR, DICOM, and MedTech services in Azure Health Data Services in 2024. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: shellyhaverkamp
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 05/13/2024
ms.author: jasteppe
ms.custom: references_regions
---

# Release notes 2024: Azure Health Data Services

This article describes features, enhancements, and bug fixes released in 2024 for the FHIR&reg; service, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## May 2024

### Azure Health Data Services

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

### FHIR Service 

#### Bundle parallelization (GA)
Bundles are executed serially in FHIR service by default. To improve throughput with bundle calls, we enabled parallel processing.

Learn more:
- [Bundle parallelization](./../healthcare-apis/fhir/rest-api-capabilities.md)

#### Import operation accepts multiple resource types in single file

Import operation allowed to have resource type per input file in the request parameters. With this enhance capability, you can pass multiple resource types in single file.

#### Bug Fixes

- **Fixed: Import operation ingests resources with the same resource type and lastUpdated field value**. Before this change, resources executed in a batch with the same type and `lastUpdated` field value weren't ingested into the FHIR service. This bug fix addresses the issue. See [PR#3768](https://github.com/microsoft/fhir-server/pull/3768).

- **Fixed: FHIR search with 3 or more custom search parameters**. Before this fix, FHIR search query at the root with three or more custom search parameters resulted in HTTP status code 504. See [PR#3701](https://github.com/microsoft/fhir-server/pull/3701).

- **Fixed: Improve performance for bundle processing**. Updates are made to the task execution method, leading to bundle processing performance improvement. See [PR#3727](https://github.com/microsoft/fhir-server/pull/3727).

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
