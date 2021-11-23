---
title: Configure export settings in the FHIR service - Azure Healthcare APIs
description: This article describes how to configure export settings in the FHIR service
author: CaitlinV39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/22/2021
ms.author: cavoeg
---

# Configure export settings and set up a storage account

The FHIR service supports the $export command that allows you to export the data out of the FHIR service account to a storage account.

The three steps below are used in configuring export data in the FHIR service:

1. Enable managed identity for the FHIR service.
1. Create an Azure storage account (if it hasn't already been created) and assign permission to the FHIR service and storage account.
1. Select the storage account in the FHIR service as export storage account.

## Enable managed identity on the FHIR service

The first step in configuring the FHIR service for export is to enable system wide managed identity on the service. For more information about managed identities in Azure, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

In this step, browse to your FHIR service in the Azure portal, and select the **Identity** blade. Select the **Status** option to **On** , and then click **Save**. **Yes** and **No** buttons will display. Select **Yes** to enable the managed identity for FHIR service.

[ ![Enable Managed Identity](media/export-data/fhir-mi-enabled.png) ](media/export-data/fhir-mi-enabled.png#lightbox)

The next step is to assign permissions for the FHIR service to write to the storage account.

## Assign permissions to the FHIR service and storage account

After you've created a storage account, browse to the **Access Control (IAM)** in the storage account, and then select **Add role assignment**. 

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

Add the role [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) to the FHIR service, and then select **Save**.

[![Add role assignment page](../../../includes/role-based-access-control/media/add-role-assignment-page.png) ](../../../includes/role-based-access-control/media/add-role-assignment-page.png#lightbox)

Now you're ready to select the storage account in the FHIR service as a default storage account for $export.

## Select the storage account for $export

The final step is to assign the Azure storage account that the FHIR service will use to export the data to. To do this, go to **Integration** in FHIR service service and select the storage account.

![FHIR Export Storage](media/export-data/fhir-export-storage.png)

After you've completed this final step, you are now ready to export the data using $export command.

> [!Note]
> Only storage accounts in the same subscription as that for FHIR service are allowed to be registered as the destination for $export operations.