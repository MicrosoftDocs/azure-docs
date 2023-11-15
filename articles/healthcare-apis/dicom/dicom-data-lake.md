---
title: Overview of the DICOM service with Azure Data Lake Storage - Azure Health Data Services
description: This article provides an overview of the capabilities, benefits, and limitations of using the DICOM service with Azure Data Lake Storage.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: how-to
ms.date: 11/07/2023
ms.author: mmitrik
ms.custom: mode-api
---

# Azure Data Lake Storage integration for the DICOM service (Preview)

The [DICOM&reg; service](overview.md) provides cloud-scale storage for medical imaging data using the DICOMweb standard. With the integration of Azure Data Lake Storage, you now have full control of your imaging data and increased flexibility for accessing and working with that data through the Azure storage ecosystem and APIs.  

By using Azure Data Lake Storage with the DICOM service, you're able to:

- **Directly access medical imaging data** stored by the DICOM service using Azure storage APIs and DICOMweb APIs, providing more flexibility to access and work with the data.
- **Open medical imaging data up to the entire ecosystem of tools** for working with Azure storage, including AzCopy, Azure Storage Explorer, and the Data Movement library.
- **Unlock new analytics and AI/ML scenarios** by using services that natively integrate with Azure Data Lake Storage, including Azure Synapse, Azure Databricks, Azure Machine Learning, and Microsoft Fabric. 
- **Grant controls to manage storage permissions, access controls, tiers, and rules**. 

Another benefit of Azure Data Lake Storage is that it connects to [Microsoft Fabric](https://learn.microsoft.com/fabric/get-started/microsoft-fabric-overview). Microsoft Fabric is an end-to-end, unified analytics platform that brings together all the data and analytics tools that organizations need to unlock the potential of their data and lay the foundation for the era of AI.  By using Microsoft Fabric, you can use the rich ecosystem of Azure services to perform advanced analytics and AI/ML with medical imaging data, such as building and deploying machine learning models, creating cohorts for clinical trials, and generating insights for patient care and outcomes.

To learn more about using Microsoft Fabric with imaging data, see [Get started using DICOM data in analytics workloads](get-started-with-analytics-dicom.md).

## Service architecture & APIs

:::image type="content" source="media/data-lake-layer-diagram.png" alt-text="Architecture diagram showing the relationship of the DICOMweb APIs, the DICOM service, Azure Data Lake Storage, and Azure Storage APIs." lightbox="media/data-lake-layer-diagram.png":::

The DICOM service exposes the [DICOMweb APIs](dicomweb-standard-apis-with-dicom-services.md) to store, query for, and retrieve DICOM data.  This new architecture provides you with the option to specify an Azure Data Lake Storage account and container at the time the DICOM service is deployed.  This storage container is used by the DICOM service to store DICOM files received by the DICOMweb APIs.  Likewise, the DICOM service retrieves data from the storage account to fulfill search and retrieve queries, allowing full DICOMweb interoperability with your DICOM data.  

What's new in this architecture is that the storage container remains in your control and is directly accessible using familiar [Azure storage APIs](https://learn.microsoft.com/rest/api/storageservices/data-lake-storage-gen2) and tools. 

## Data contracts

The DICOM service stores data in predictable locations in the data lake, following this convention:

```
AHDS/{workspace-name}/dicom/{dicom-service-name}/{partition-name}
``` 

| Parameter            | Description |
|----------------------|-------------|
| `{workspace-name}`     | The name of the Health Data Services workspace that contains the DICOM service. |
| `{dicom-service-name}` | The name of the DICOM service instance. |
| `{partition-name}`     | The name of the data partition. Note, if no partitions are specified, all DICOM data is stored in the default partition, named `Microsoft.Default`. |

> [!NOTE]
> During public preview, the DICOM service will write data to the storage container and read data that it has written, but user added data will not be read and indexed by the DICOM service.  Similarly, if DICOM data written by the DICOM service is modified or removed, it may result in errors when access data via the DICOMweb APIs.

## Permissions

The DICOM service is granted access to the data like any other service or application accessing data in a storage account, and that access can be revoked at any time without affecting a customer’s ability to access their data.  Specifically, the DICOM service needs to be granted the [Storage Blob Data Contributor](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role via a system-assigned or user-assigned managed identity.  

## Access tiers

You can manage costs for imaging data stored by the DICOM service using Azure Storage access tiers for the data lake storage account.  Currently, the DICOM service only supports online access tiers (either hot, cool, or cold), and can retrieve imaging data in those tiers immediately.  The hot tier is the best choice for data that is in active use. The cool or cold tier is ideal for data that is accessed less frequently, but that still must be available for reading and writing.

To learn more about access tiers, including cost tradeoffs and best practices, see [Azure Storage access tiers](/articles/storage/blobs/access-tiers-overview.md)

## Limitations

During public preview, the DICOM service with data lake storage has the following limitations:  

- [Bulk Import](import-files.md) isn't supported.
- [Private link](../healthcare-apis-configure-private-link.md) isn't yet supported.  
- UPS-RS work items aren't stored in the data lake storage account.  
- User data added to the data lake storage account won't be read and indexed by the DICOM service.  It's possible that a filename collision could occur, so it's recommended to not write data to the folder structure used by the DICOM service.
- If DICOM data written by the DICOM service is modified or removed, it might result in errors when accessing data via the DICOMweb APIs.
- Configuration of customer-managed keys isn't supported during the creation of a DICOM service when opting to use external storage.
- The archive access tier isn't yet supported by the DICOM service.  Moving data to the archive tier will result in errors when accessing data via the DICOMweb APIs.

## Next steps

[Deploy the DICOM service with Data Lake Storage (Preview)](deploy-dicom-services-in-azure-data-lake.md)

[Get started using DICOM data in analytics workloads](get-started-with-analytics-dicom.md)

[Use DICOMweb standard APIs](dicomweb-standard-apis-with-dicom-services.md)

[!INCLUDE [FHIR and DICOM trademark statements](../includes/healthcare-apis-fhir-dicom-trademark.md)]