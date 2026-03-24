---
title: Configure Import Settings in the FHIR Service in Azure Health Data Services
description: Learn how to configure import settings in the FHIR service in Azure Health Data Services, including managed identity, storage permissions, and secure import operations.
author: Expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 03/24/2026
ms.author: kesheth
ms.reviewer: v-catheribun
ms.custom: sfi-image-nochange
---

# Configure import settings in the FHIR service in Azure Health Data Services

The FHIR&reg; service supports the `$import` operation [specified by HL7](https://www.hl7.org/fhir/uv/bulkdata/) for importing FHIR data from a FHIR server. In the FHIR service implementation, when you call the `$import` endpoint, the FHIR service imports data into a preconfigured Azure storage account. The storage account must be a Blob or Azure Data Lake Storage Gen2 (ADLS Gen2) account.

This article describes how to configure import settings for the FHIR service and give the FHIR service permission to access your storage account. If your FHIR service is outside the network boundary of your storage account, you can configure access by allowing the FHIR service as a Microsoft trusted service or by allowing specific IP addresses to access the storage account. For more information, see [Secure the FHIR service `$import` operation](#secure-the-fhir-service-import-operation).    

## Prerequisites

- A FHIR service. To create one, see [Deploy the FHIR service](deploy-azure-portal.md).
- An [Azure Blob or Azure Data Lake Storage Gen2 (ADLS Gen2)](../../storage/common/storage-account-create.md) account. 
- You need to have the **FHIR Data importer role** application role. To learn more about application roles, see [Authentication and Authorization for FHIR service](../../healthcare-apis/authentication-authorization.md).

## Step 1:Enable a managed identity on the FHIR service for import

First, enable a system-assigned managed identity on the service. Use this identity to grant the FHIR service access to the storage account. For more information about managed identities in Azure, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

To enable a managed identity on the FHIR service:

1. In the Azure portal, browse to your FHIR service.
1. On the left menu, select **Identity**.
1. In the **System assigned** tab, set the **Status** option to **On**, and then select **Save**. 
1. When the **Yes** and **No** buttons display, select **Yes** to enable the managed identity for the FHIR service. After you enable the system identity, you see an **Object (principal) ID** value for your FHIR service.

:::image type="content" source="media/configure-import-data/fhir-managed-identity-enabled.png" alt-text="Screenshot of the Identity pane for the FHIR service with the Status option set to On." lightbox="media/configure-import-data/fhir-managed-identity-enabled.png":::


## Step 2: Assign storage permissions to the FHIR service

Use the following steps to assign permissions to access the storage account.

1. In the storage account, browse to **Access Control (IAM)**.
1. Select **Add role assignment**. If the option for adding a role assignment is unavailable, ask your Azure administrator to assign you permission to perform this step.

   For more information about assigning roles in the Azure portal, see [Azure built-in roles](/azure/role-based-access-control/role-assignments-portal).

1. Add the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) role to the FHIR service.
1. Select **Save**.

:::image type="content" source="media/configure-import-data/add-role-assignment-page.png" alt-text="Screenshot of the page for adding a role assignment." lightbox="media/configure-import-data/add-role-assignment-page.png":::

Now you're ready to select the storage account for import.

## Step 3: Set the import configuration for the FHIR service

You can set the import configuration for the FHIR service through the import settings in the Azure portal, or by using an Azure Resource Manager template (ARM template), or a REST API.

> [!NOTE]
> If you don't assign storage access permissions to the FHIR service, the `import` operation fails.

# [Azure portal](#tab/azure-portal)

To set the import configuration through the portal:

1. In the Azure portal, browse to your FHIR service.
1. On the left menu, select **Import**.
1. Enter the required information, such as the storage account name, and select the import mode. The import mode can be either initial or incremental. For more information about the two import modes, see [Import FHIR data](import-data.md).
1. Select **Save** to retain the settings.

:::image type="content" source="media/configure-import-data/fhir-import-portal.png" alt-text="Screenshot of the FHIR import settings in the Azure portal." lightbox="media/configure-import-data/fhir-import-portal.png":::

# [ARM template](#tab/arm-template)

You can also set the import configuration by using an ARM template that updates the FHIR service configuration for `import`. You can deploy the template through the portal or the [REST API](/rest/api/healthcareapis/services/create-or-update).


Select the following button to deploy the ARM template. The template updates the FHIR service configuration for `import`. 

[![Screenshot that shows the Deploy to Azure button.](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Ffhir-import%2Fazuredeploy.json)

To update an existing FHIR service, you need to provide the following information in the template:

1. Select the **Resource group** from the dropdown list. This resource group is where your FHIR service is located.
1. Enter the **Workspace Name** where the FHIR service is located.
1. Enter the **Fhir Name**.
1. Enter the **Storage Name**. 
1. Select the **Import Mode**. The import mode can be either initial or incremental. For more information about the two import modes, see [Import FHIR data](import-data.md).
1. Select **Existing** for the **Deployment mode**.
1. Select **Review + create**. Review the settings, and then select **Create** to apply the configuration.

:::image type="content" source="media/configure-import-data/import-template-portal.png" alt-text="Screenshot of the Deploy to Azure page with parameters for the ARM template." lightbox="media/configure-import-data/import-template-portal.png":::

# [REST API](#tab/rest-api)

You can set the import configuration by using the REST API to update the FHIR service. This method is helpful if you want to automate the configuration process through scripting.

First, get the request URL and JSON body for the FHIR service.

1. In the Azure portal, browse to your FHIR service.
1. Select **Overview**.
1. Select **JSON View**.

    :::image type="content" source="media/bulk-import/fhir-json-view.png" alt-text="Screenshot of selections for opening the JSON view." lightbox="media/bulk-import/fhir-json-view.png":::

1. Select the API version as **2022-06-01** or later.
1. Copy the request URL and JSON body.
1. Make the following changes to the JSON body:
   1. In `importConfiguration`, set `enabled` to `true`.
   1. Update `integrationDataStore` with the target storage account name.
   1. Set `initialImportMode` to `true` or `false` based on your import mode choice.
   1. Delete the `provisioningState` line.

    :::image type="content" source="media/bulk-import/import-url-json-body.png" alt-text="Screenshot of a code example for import configuration." lightbox="media/bulk-import/import-url-json-body.png":::

1. Use the request URL with the [REST API Update API](/rest/api/healthcareapis/services/create-or-update) to update the FHIR service.

---

## Secure the FHIR service import operation

To securely import data from the FHIR service outside the network boundary of your storage account, use one of the following options:

* Enable the FHIR service as a trusted Microsoft service.
* Allow specific IP addresses associated with the FHIR service to access the storage account from other Azure regions.
* Allow specific IP addresses associated with the FHIR service to access the storage account in the same region as the FHIR service.

### Enable the FHIR service as a trusted Microsoft service

To enable the FHIR workspace as a trusted Microsoft service, follow these steps:

Ensure that your storage account public network access scope is enabled for selected networks. 

1. In the Azure portal, go to your Blob or Data Lake Storage Gen2 account.
1. On the left menu, select **Security + Networking** > **Networking**.
1. On the **Public access** tab under **Public network access**, select **Manage**.

   :::image type="content" source="media/export-data/storage-networking-1.png" alt-text="Screenshot of Azure Storage networking settings." lightbox="media/export-data/storage-networking-1.png":::
1. Select **Enable from selected networks**.
1. In the **Resource type** dropdown list, select **Microsoft.HealthcareApis/workspaces**. In the **Instance name** dropdown list, select your workspace.
1. In the **Exceptions** section, select the **Allow trusted Microsoft services to access this storage account** checkbox.
   :::image type="content" source="media/export-data/exceptions.png" alt-text="Screenshot that shows the option to allow trusted Microsoft services to access this storage account." lightbox="media/export-data/exceptions.png":::
1. Select **Save** to retain the settings.


To enable the FHIR service as a trusted Microsoft service through PowerShell, use the following commands:

1. Run the following PowerShell command to install the `Az.Storage` PowerShell module in your local environment. Use this module to configure your Azure storage accounts by using PowerShell.

    ```PowerShell
    Install-Module Az.Storage -Repository PsGallery -AllowClobber -Force 
    ```

1. Use the following PowerShell command to set the selected FHIR service instance as a trusted resource for the storage account. Make sure that all listed parameters are defined in your PowerShell environment.

   You need to run the `Add-AzStorageAccountNetworkRule` command as an administrator in your local environment. For more information, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md).

   ```PowerShell
   $subscription="xxx"
   $tenantId = "xxx"
   $resourceGroupName = "xxx"
   $storageaccountName = "xxx"
   $workspacename="xxx"
   $fhirname="xxx"
   $resourceId = "/subscriptions/$subscription/resourceGroups/$resourceGroupName/providers/Microsoft.HealthcareApis/workspaces/$workspacename/fhirservices/$fhirname"

   Add-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $storageaccountName -TenantId $tenantId -ResourceId $resourceId
   ```

You're now ready to securely import FHIR data from the storage account. The storage account is on selected networks and isn't publicly accessible. To securely access the files, use [private endpoints](../../storage/common/storage-private-endpoints.md) for the storage account.



[!INCLUDE [Specific IP ranges for storage account](../includes/common-ip-address-storage-account.md)]

## Next steps

>[!div class="nextstepaction"]
>[Import FHIR data](import-data.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
