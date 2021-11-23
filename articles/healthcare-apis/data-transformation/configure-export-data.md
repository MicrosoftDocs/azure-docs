---
title: Configure export settings in the FHIR service - Azure Healthcare APIs
description: This article describes how to configure export settings in the FHIR service
author: CaitlinV39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 11/23/2021
ms.author: cavoeg
---

# Configure export settings and set up a storage account

The FHIR service supports the $export command that allows you to export the data out of the FHIR service account to a storage account.

The three steps below are used in configuring export data in the FHIR service:

- Enable managed identity for the FHIR service.
- Create an Azure storage account or use an existing storage account, and then grant permissions to the FHIR service to access them.
- Select the storage account in the FHIR service as the destination.

## Enable managed identity on the FHIR service

The first step in configuring the FHIR service for export is to enable system wide managed identity on the service, which will be used to grant the service to access the storage account. For more information about managed identities in Azure, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

In this step, browse to your FHIR service in the Azure portal, and select the **Identity** blade. Select the **Status** option to **On** , and then click **Save**. **Yes** and **No** buttons will display. Select **Yes** to enable the managed identity for FHIR service. Once the system identity has been enabled, you will see a system assigned GUID value. 

[ ![Enable Managed Identity](media/export-data/fhir-mi-enabled.png) ](media/export-data/fhir-mi-enabled.png#lightbox)


## Assign permissions to the FHIR service to access the storage account

Browse to the **Access Control (IAM)** in the storage account, and then select **Add role assignment**. If the add role assignment option is grayed out, you will need to ask your Azure Administrator to assign you permission to perform this task.

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

Add the role [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) to the FHIR service, and then select **Save**.

[![Add role assignment page](../../../includes/role-based-access-control/media/add-role-assignment-page.png) ](../../../includes/role-based-access-control/media/add-role-assignment-page.png#lightbox)

Now you're ready to select the storage account in the FHIR service as a default storage account for export.

## Specify the export storage account for the FHIR service

The final step is to assign the Azure storage account that the FHIR service will use to export the data to.

> [!NOTE]
> If you haven't assigned storage access permissions to the FHIR service, the export operations ($export) will fail.

To do this, select the  **Export** blade in FHIR service service and select the storage account. To search for the storage account, enter its name in the text field. You can also search for your storage account by using the available filters **Name**, **Resource group**, or **Region**. 

[![FHIR Export Storage](media/export-data/fhir-export-storage.png) ](media/export-data/fhir-export-storage.png#lightbox)

After you've completed this final step, you're ready to export the data using $export command.

> [!Note]
> Only storage accounts in the same subscription as that for FHIR service are allowed to be registered as the destination for $export operations.

## Next steps

In this article, you learned about the three steps in configuring export settings that allows you to export data out of FHIR service account to a storage account. For more information about the Bulk Export feature that allows data to be exported from the FHIR service, see 

>[!div class="nextstepaction"]
>[How to export FHIR data](export-data.md)