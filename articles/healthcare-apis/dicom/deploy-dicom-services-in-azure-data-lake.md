---
title: Deploy the DICOM service with a data lake by using the Azure portal - Azure Health Data Services
description: This article describes how to deploy the DICOM service with a data lake in the Azure portal.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: how-to
ms.date: 11/07/2023
ms.author: mmitrik
ms.custom: mode-api
---

# Deploy the DICOM service with Data Lake Storage (Preview)

In this quickstart, you learn how to deploy the [DICOM&reg; service with Data Lake Storage](dicom-data-lake.md) by using the Azure portal.

After deployment is finished, you can use the Azure portal to go to the newly created DICOM service to see the details, including your service URL. The service URL to access your DICOM service is ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the version as part of the URL when you make requests. For more information, see [API versioning for the DICOM service](api-versioning-dicom-service.md).

## Prerequisites

- **Deploy an Azure Health Data Services workspace**.  For more information, see [Deploy a workspace in the Azure portal](../healthcare-apis-quickstart.md).
- **Create a storage account with a hierarchical namespace**.  For more information, see [Create a storage account to use with Azure Data Lake Storage Gen2](https://learn.microsoft.com/azure/storage/blobs/create-data-lake-storage-account).
- **Create a new blob container in the storage account**.  This container will be used by the DICOM service to store DICOM files.  For more information, see [Manage blob containers using the Azure portal](https://learn.microsoft.com/azure/storage/blobs/blob-containers-portal)

> [!NOTE]
> The data lake storage option is currently only available for newly created instances of the DICOM service.  After GA, there will be options for existing DICOM service instances to migrate.

## Deploy the DICOM service with Data Lake Storage

1. On the **Resource group** page of the Azure portal, select the name of your **Azure Health Data Services workspace**.

   :::image type="content" source="media/deploy-data-lake/resource-group.png" alt-text="Screenshot that shows a Health Data Services Workspace in the resource group view in the Azure portal." lightbox="media/deploy-data-lake/resource-group.png":::

1. Select **Deploy DICOM service**.

   :::image type="content" source="media/deploy-data-lake/workspace-deploy-dicom.png" alt-text="Screenshot that shows the Deploy DICOM service button in the workspace view in the Azure portal." lightbox="media/deploy-data-lake/workspace-deploy-dicom.png":::

1. Select **Add DICOM service**.

   :::image type="content" source="media/deploy-data-lake/add-dicom-service.png" alt-text="Screenshot that shows the Add DICOM Service button in the Azure portal." lightbox="media/deploy-data-lake/add-dicom-service.png":::

1. Enter a name for the DICOM service.

1. Select **External (preview)** for the Storage Location.  

    :::image type="content" source="media/deploy-data-lake/dicom-deploy-options.png" alt-text="Screenshot that shows the options in the Create DICOM service view." lightbox="media/deploy-data-lake/dicom-deploy-options.png":::

1. Select the subscription that contains the storage account.

1. Select the storage account created in the prerequisites for the Data Lake Storage field.

1. Select the storage container created in the prerequisites for the File system name.  

1. Select **Review + create** to deploy the DICOM service.  

    > [!NOTE]
    > Configuration of customer-managed keys is not supported during the creation of a DICOM service when opting to use external storage.  Customer-managed keys can be configured after the DICOM service has been created.  

1. When you notice the green validation check mark, select **Create** to deploy the DICOM service.

1. After the deployment process is finished, select **Go to resource**.

   :::image type="content" source="media/deploy-data-lake/dicom-deploy-complete.png" alt-text="Screenshot that shows the completed deployment of the DICOM service." lightbox="media/deploy-data-lake/dicom-deploy-complete.png":::

   The DICOM service overview shows the newly created service.

   :::image type="content" source="media/deploy-data-lake/dicom-service-overview.png" alt-text="Screenshot that shows the DICOM service overview." lightbox="media/deploy-data-lake/dicom-service-overview.png":::

## Next steps

* [Assign roles for the DICOM service](../configure-azure-rbac.md#assign-roles-for-the-dicom-service)
* [Use DICOMweb Standard APIs with DICOM services](dicomweb-standard-apis-with-dicom-services.md)
* [Enable audit and diagnostic logging in the DICOM service](enable-diagnostic-logging.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]