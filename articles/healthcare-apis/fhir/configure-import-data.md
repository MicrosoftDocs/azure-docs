---
title: Configure import settings in the FHIR service - Azure Health Data Services
description: This article describes how to configure import settings in the FHIR service.
author: RuiyiC
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/06/2022
ms.author: chenrui 
---

# Configure bulk-import settings

The FHIR service supports $import operation that allows you to import data into FHIR service account from a storage account.

The three steps below are used in configuring import settings in the FHIR service:

- Enable managed identity for the FHIR service.
- Create an Azure storage account or use an existing storage account, and then grant permissions to the FHIR service to access it.
- Set the import configuration in the FHIR service.

## Enable managed identity on the FHIR service

The first step in configuring the FHIR service for import is to enable system wide managed identity on the service, which will be used to grant the service to access the storage account. For more information about managed identities in Azure, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

In this step, browse to your FHIR service in the Azure portal, and select the **Identity** blade. Select the **Status** option to **On** , and then select **Save**. The **Yes** and **No** buttons will display. Select **Yes** to enable the managed identity for FHIR service. After the system identity has been enabled, you'll see a system assigned GUID value. 

[![Enable Managed Identity](media/export-data/fhir-mi-enabled.png)](media/export-data/fhir-mi-enabled.png#lightbox)


## Assign permissions to the FHIR service to access the storage account

Browse to the **Access Control (IAM)** in the storage account, and then select **Add role assignment**. If the add role assignment option is grayed out, you'll need to ask your Azure Administrator to assign you permission to perform this task.

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

Add the role [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) to the FHIR service, and then select **Save**.

[![Screen shot of the Add role assignment page.](media/bulk-import/add-role-assignment-page.png)](media/bulk-import/add-role-assignment-page.png#lightbox)

Now you're ready to select the storage account in the FHIR service as a default storage account for import.

## Set import configuration of the FHIR service

The final step is to set the import configuration of the FHIR service, which contains specify storage account, enable import and enable initial import mode.

> [!NOTE]
> If you haven't assigned storage access permissions to the FHIR service, the import operations ($import) will fail.

To specify the Azure Storage account, you need to use [REST API](/rest/api/healthcareapis/services/create-or-update) to update the FHIR service.

To get the request URL and body, browse to the Azure portal of your FHIR service. Select **Overview**, and then **JSON View**.

[![Screenshot of Get JSON View](media/bulk-import/fhir-json-view.png)](media/bulk-import/fhir-json-view.png#lightbox)

Select the API version to **2022-06-01** or later version. 

Copy the URL as request URL and do following changes of the JSON as body:
- Set enabled in importConfiguration to **true**
- add or change the integrationDataStore with target storage account name 
- Set initialImportMode in importConfiguration to **true**
- Drop off provisioningState.

[![Screenshot of the importer configuration code example](media/bulk-import/import-url-and-body.png)](media/bulk-import/import-url-and-body.png#lightbox)

After you've completed this final step, you're ready to import data using $import.

You can also use the **Deploy to Azure** button below to open custom Resource Manager template that updates the configuration for $import.

 [![Deploy to Azure Button.](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Ffhir-import%2Fazuredeploy.json)


## Next steps

In this article, you've learned the FHIR service supports $import operation and how it allows you to import data into FHIR service account from a storage account. You also learned about the three steps used in configuring import settings in the FHIR service. For more information about converting data to FHIR, exporting settings to set up a storage account, and moving data to Azure Synapse, see

>[!div class="nextstepaction"]
>[Use $import](import-data.md)

>[!div class="nextstepaction"]
>[Converting your data to FHIR](convert-data.md)

>[!div class="nextstepaction"]
>[Configure export settings and set up a storage account](configure-export-data.md)

>[!div class="nextstepaction"]
>[Copy data from FHIR service to Azure Synapse Analytics](copy-to-synapse.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
