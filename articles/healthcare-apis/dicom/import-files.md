---
title: Import DICOM files into the DICOM service
description: Learn how to import DICOM files by using bulk import in Azure Health Data Services.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: quickstart
ms.date: 10/05/2023
ms.author: mmitrik
---

# Import DICOM files (preview)

Bulk import is a quick way to add data to the DICOM&reg; service. Importing DICOM files with the bulk import capability enables:

- **Backup and migration**: For example, your organization might have many DICOM instances stored in local or on-premises systems that you want to back up or migrate to the cloud for better security, scalability, and availability. Rather than uploading the data one by one, use bulk import to transfer the data faster and more efficiently.

- **Machine learning development**: For example, your organization might have a large dataset of DICOM instances that you want to use for training machine learning models. With bulk import, you can upload the data to the DICOM service and then access it from [Microsoft Fabric](get-started-with-analytics-dicom.md), [Azure Machine Learning](../../machine-learning/overview-what-is-azure-machine-learning.md), or other tools.

## Prerequisites

- **Deploy an instance of the DICOM service.** For more information, see [Deploy the DICOM service](deploy-dicom-services-in-azure.md).
- **Deploy the events capability for the DICOM service.** For more information, see [Deploy events by using the Azure portal](../events/events-deploy-portal.md).

## Enable a system-assigned managed identity

Before you perform a bulk import, you need to enable a system-assigned managed identity.

1. In the Azure portal, go to the DICOM instance and then select **Identity** from the left pane.

1. On the **Identity** page, select the **System assigned** tab, and then set the **Status** field to **On**. Select **Save**.

   :::image type="content" source="media/system-assigned-managed-identity.png" alt-text="Screenshot that shows the system-assigned managed identity toggle on the Identity page." lightbox="media/system-assigned-managed-identity.png":::

## Enable bulk import

You need to enable bulk import before you import data.

#### Use the Azure portal

1. In the Azure portal, go to the DICOM service and then select **Bulk Import** from the left pane.

1. On the **Bulk Import** page, in the **Bulk Import** field, select **Enabled**. Select **Save**.

   :::image type="content" source="media/import-enable.png" alt-text="Screenshot that shows the Bulk Import page with the toggle set to Enabled." lightbox="media/import-enable.png":::

#### Use an Azure Resource Manager template

When you use an Azure Resource Manager template (ARM template), enable bulk import with the property named `bulkImportConfiguration`.

Here's an example of how to configure bulk import in an ARM template:

``` json
{ 
    "type": "Microsoft.HealthcareApis/workspaces/dicomservices", 
    "apiVersion": "2023-02-01-preview", 
    "name": "[parameters('dicomservicename')]", 
    "location": "[parameters('regionname')]", 
    "identity": { 
        "type": "SystemAssigned" 
    }, 
    "properties": { 
        "bulkImportConfiguration": { 
            "enabled": true 
        } 
    } 
} 
```

## Import data

After you enable bulk import, a resource group is provisioned in your Azure subscription. The name of the resource group begins with the prefix `AHDS_`, followed by the workspace and DICOM service name. For example, for the DICOM service named `mydicom` in the workspace `contoso`, the resource group is named `AHDS_contoso-mydicom`.

Within the new resource group, two resources are created:

- A randomly named storage account that has two precreated containers (`import-container` and `error-container`) and two queues (`import-queue` and `error-queue`).
- An [Azure Event Grid system topic](/azure/event-grid/create-view-manage-system-topics) named `dicom-bulk-import`.

DICOM images are added to the DICOM service by copying them into the `import-container`. Bulk import monitors this container for new images and adds them to the DICOM service. If there are errors that prevent a file from being added successfully, the errors are copied to the `error-container` and an error message is written to the `error-queue`.

#### Grant write access to the import container

The user or account that adds DICOM images to the import container needs write access to the container by using the `Data Owner` role. For more information, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

#### Upload DICOM images to the import container

Data is uploaded to Azure Storage containers in many ways:

- [Upload a blob with Azure Storage Explorer](../../storage/blobs/quickstart-storage-explorer.md#upload-blobs-to-the-container)
- [Upload a blob with AzCopy](../../storage/common/storage-use-azcopy-blobs-upload.md)
- [Upload a blob with the Azure CLI](../../storage/blobs/storage-quickstart-blobs-cli.md#upload-a-blob)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]