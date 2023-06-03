---
title: Configure import settings in the FHIR service - Azure Health Data Services
description: This article describes how to configure import settings in the FHIR service.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/06/2022
ms.author: kesheth
---

# Configure bulk-import settings

The FHIR service supports $import operation that allows you to import data into FHIR service from a storage account. Import splits input files in several data streams for optimal performance and doesn't guarantee order in which resources are processed. There are two modes of $import supported today- 

* Initial mode is intended to load FHIR resources into an empty FHIR server. Initial mode only supports CREATE operations and, when enabled, blocks API writes to the FHIR server.
  
* Incremental mode is optimized to load data into FHIR server periodically and doesn't block writes via API. It also allows to load lastUpdated and versionId from resource Meta (if present in resource JSON). 

Note: Incremental import mode is in public preview. 

[!INCLUDE Public Preview Disclaimer]

In this document we go over The three steps used in configuring import settings on the FHIR service:

Step 1: Enable managed identity on the FHIR service.
Step 2: Create an Azure storage account or use an existing storage account, and then grant permissions to the FHIR service to access it.
Step 3: Set the import configuration in the FHIR service.

## Step 1: Enable managed identity on the FHIR service

The first step is to enable system wide managed identity on the service. This will be used to grant the FHIR service an access to the storage account. 
For more information about managed identities in Azure, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

Follow the steps to enable managed identity on FHIR service
1. Browse to your FHIR service in the Azure portal.
2. Select the **Identity** blade. 
3. Select the **Status** option to **On** , and then select **Save**.
4. Select **Yes** to enable the managed identity for FHIR service. 

After the system identity has been enabled, you'll see a system assigned GUID value.

[![Enable Managed Identity](media/export-data/fhir-mi-enabled.png)](media/export-data/fhir-mi-enabled.png#lightbox)


## Step 2: Assign permissions to the FHIR service to access the storage account

Follow the steps below to assign permissions to access the storage account
1. Browse to the **Access Control (IAM)** in the storage account.
2. Select **Add role assignment**. During this step, if the add role assignment option is grayed out, you need to ask your Azure Administrator to assign you permission to perform this step.
For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).
3. Add the role [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) to the FHIR service.
4. Select **Save**.

[![Screen shot of the Add role assignment page.](media/bulk-import/add-role-assignment-page.png)](media/bulk-import/add-role-assignment-page.png#lightbox)

Now you're ready to select the storage account for import.

## Step 3: Set import configuration of the FHIR service

> [!NOTE]
> If you haven't assigned storage access permissions to the FHIR service, the import operations ($import) will fail.

For this step you need to get request URL and JSON body. Follow the directions below
1. Browse to the Azure portal of your FHIR service.
2. Select **Overview**.
3. Select **JSON View**.
4. Select the API version to **2022-06-01** or later version. 

To specify the Azure Storage account in JSON view, you need to use [REST API](/rest/api/healthcareapis/services/create-or-update) to update the FHIR service.
[![Screenshot of Get JSON View](media/bulk-import/fhir-json-view.png)](media/bulk-import/fhir-json-view.png#lightbox)

Below steps walk through setting configurations for initial and incremental import mode. Choose the right import mode for your use case. 

### Step 3.1: Set import configuration for Initial import mode.
Do following changes to JSON:
1. Set enabled in importConfiguration to **true**.
2. Update the integrationDataStore with target storage account name.
3. Set initialImportMode in importConfiguration to **true**.
4. Drop off provisioningState.

[![Screenshot of the importer configuration code example](media/bulk-import/import-url-and-body.png)](media/bulk-import/import-url-and-body.png#lightbox)

After you've completed this final step, you're ready to perform **Initial mode** import using $import.

### Step 3.2: Set import configuration for Incremental import mode.

Do following changes to JSON:
1. Set enabled in importConfiguration to **true**.
2. Update the integrationDataStore with target storage account name.
3. Set initialImportMode in importConfiguration to **false**.
4. Drop off provisioningState.

After you've completed this final step, you're ready to perform **Incremental mode** import using $import.


Note : You can also use the **Deploy to Azure** button to open custom Resource Manager template that updates the configuration for $import.

 [![Deploy to Azure Button.](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Ffhir-import%2Fazuredeploy.json)


## Next steps

In this article, you've learned the FHIR service supports $import operation and how it allows you to import data into FHIR service from a storage account. You also learned about the three steps used in configuring import settings in the FHIR service. For more information about converting data to FHIR, exporting settings to set up a storage account, and moving data to Azure Synapse, see

>[!div class="nextstepaction"]
>[Use $import](import-data.md)

>[!div class="nextstepaction"]
>[Converting your data to FHIR](convert-data.md)

>[!div class="nextstepaction"]
>[Configure export settings and set up a storage account](configure-export-data.md)

>[!div class="nextstepaction"]
>[Copy data from FHIR service to Azure Synapse Analytics](copy-to-synapse.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
