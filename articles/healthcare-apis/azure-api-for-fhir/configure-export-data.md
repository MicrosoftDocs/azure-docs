---
title: Configure export settings in Azure API for FHIR
description: Learn how to configure export settings in Azure API for FHIR.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
---

# Configure export settings in Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure API for FHIR supports the $export command, which allows you to export the data out of an Azure API for FHIR instance to a storage account.

The steps are:

1. Enable Managed Identity on Azure API for FHIR.
1. Create an Azure storage account and assign permissions to Azure API for FHIR to the storage account, if necessary.
1. Select the storage account in Azure API for FHIR as the export storage account.

## Enable managed identity on Azure API for FHIR

First, enable system-wide managed identity on the service. For more information, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

In the Azure portal, go to the Azure API for FHIR service. Select **Identity**. Changing the status to **On** enables managed identity in Azure API for FHIR.

:::image type="content" source="media/export-data/fhir-mi-enabled.png" alt-text="Screenshot showing how to turn on a managed identity." lightbox="media/export-data/fhir-mi-enabled.png":::

Then, create a storage account and assign permission to the service.

## Add permission to storage account

Next, assign permission for Azure API for FHIR to write to the storage account.

After you create a storage account, go to the **Access Control (IAM)** in the storage account, and then select **Add role assignment**. 

For more information, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.yml).

It's here that you add the role [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) to the service name, and then select **Save**.

:::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot showing RBAC assignment page." lightbox="../../../includes/role-based-access-control/media/add-role-assignment-page.png":::

Next, select the storage account in Azure API for FHIR as a default storage account for $export.

## Select the storage account for $export

The final step is to assign the Azure storage account to export the data to. Go to **Export** in Azure API for FHIR and then select the storage account.

:::image type="content" source="media/export-data/fhir-export-storage.png" alt-text="Screenshot showing selection of the storage account for export." lightbox="media/export-data/fhir-export-storage.png":::

After you complete this final step, you’re ready to export the data by using the $export command.

> [!Note]
> Only storage accounts in the same subscription as Azure API for FHIR can be registered as the destination for $export operations.

## Next steps

[Additional settings](azure-api-for-fhir-additional-settings.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]