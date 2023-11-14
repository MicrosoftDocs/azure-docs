---
title: Overview of the DICOM service with Azure Data Lake Storage - Azure Health Data Services
description: This article provides and overview of the capabilties, benefits, and limitations of using the DICOM service with Azure Data Lake Storage.
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

- **Enable direct access to medical imaging data** stored by the DICOM service using Azure storage APIs and DICOMweb APIs, providing more flexibility to access and work with the data.
- **Open medical imaging data up to the entire ecosystem of tools** for working with Azure storage, including AzCopy, Azure Storage Explorer, and the Data Movement library.
- **Unlock new analytics and AI/ML scenarios** by using services that natively integrate with Azure Data Lake Storage, including Azure Synapse, Azure Databricks, Azure Machine Learning, and Microsoft Fabric. 
- **Grant controls to manage storage permissions, access controls, tiers, and rules**. 

Another benefit of Azure Data Lake Storage is that it connects to [Microsoft Fabric](https://learn.microsoft.com/fabric/get-started/microsoft-fabric-overview). Microsoft Fabric is an end-to-end, unified analytics platform that brings together all the data and analytics tools that organizations need to unlock the potential of their data and lay the foundation for the era of AI.  By using Microsoft Fabric, you can leverage the rich ecosystem of Azure services to perform advanced analytics and AI/ML with medical imaging data, such as building and deploying machine learning models, creating cohorts for clinical trials, and generating insights for patient care and outcomes.

To learn more about analytics with imaging data, see [Get started using DICOM data in analytics workloads](get-started-with-analytics-dicom.md).

## Service architecture

The new architecture provides you with the option to specify an Azure Data Lake Storage account and container at the time the DICOM service is deployed.  This storage container is used by the DICOM service to store DICOM files received by the DICOMweb APIs.  Likewise, the DICOM service retrieves data from search and retrieve queries from the storage account, allowing full DICOMweb interoperability with your DICOM data.  What's new in this architecture is that the storage container remains in your control and is directly accessible using familiar Azure storage APIs and tools.  

:::image type="content" source="media/data-lake-layer-diagram.png" alt-text="Architecture diagram showing the relationship of the DICOMweb APIs, the DICOM service, Azure Data Lake Storage, and Azure Storage APIs." lightbox="media/data-lake-layer-diagram.png":::

## Permissions

The DICOM service is granted access to the data like any other service or application accessing data in a storage account, and that access can be revoked at any time without affecting a customer’s ability to access their data. 

## Next steps

[Deploy the DICOM service with Data Lake Storage (Preview)](deploy-dicom-services-in-azure-data-lake.md)

[Get started using DICOM data in analytics workloads](get-started-with-analytics-dicom.md)

[Use DICOMweb standard APIs](dicomweb-standard-apis-with-dicom-services.md)

[!INCLUDE [FHIR and DICOM trademark statements](../includes/healthcare-apis-fhir-dicom-trademark.md)]