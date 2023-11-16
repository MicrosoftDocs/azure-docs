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
- **Create a storage account with a hierarchical namespace**.  For more information, see [Create a storage account to use with Azure Data Lake Storage Gen2](/azure/storage/blobs/create-data-lake-storage-account).
- **Create a blob container in the storage account**.  The container is used by the DICOM service to store DICOM files.  For more information, see [Manage blob containers using the Azure portal](/azure/storage/blobs/blob-containers-portal)

> [!NOTE]
> The Azure Data Lake Storage option is currently only available for newly created instances of the DICOM service.  After the option becomes generally available, we plan to offer a migration path for existing DICOM service instances.

## Deploy the DICOM service with Data Lake Storage using the Azure portal

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
    > Configuration of customer-managed keys isn't supported during the creation of a DICOM service when you opt to use external storage.  Customer-managed keys can be configured after the DICOM service has been created.  

1. When the system displays a green validation check mark, select **Create** to deploy the DICOM service.

1. After the deployment process completes, select **Go to resource**.

   :::image type="content" source="media/deploy-data-lake/dicom-deploy-complete.png" alt-text="Screenshot that shows the completed deployment of the DICOM service." lightbox="media/deploy-data-lake/dicom-deploy-complete.png":::

   The DICOM service overview screen shows the new service.

   :::image type="content" source="media/deploy-data-lake/dicom-service-overview.png" alt-text="Screenshot that shows the DICOM service overview." lightbox="media/deploy-data-lake/dicom-service-overview.png":::

## Deploy the DICOM service with Data Lake Storage using an ARM template

Use the Azure portal to **Deploy a custom template** and use the sample ARM template to deploy the DICOM service with Data Lake Storage. For more information, see [Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "String"
    },
    "dicomServiceName": {
      "type": "String"
    },
    "region": {
      "defaultValue": "westus3",
      "type": "String"
    },
    "storageAccountName": {
      "type": "String"
    },
    "storageAccountSku": {
      "defaultValue": "Standard_LRS",
      "type": "String"
    },
    "containerName": {
      "type": "String"
    }
  },
  "variables": {
    "managedIdentityName": "[concat(parameters('workspacename'), '-', parameters('dicomServiceName'))]",
    "StorageBlobDataContributor": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-05-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('region')]",
      "sku": {
        "name": "[parameters('storageAccountSku')]"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot",
        "supportsHttpsTrafficOnly": true,
        "isHnsEnabled": true,
        "minimumTlsVersion": "TLS1_2",
        "allowBlobPublicAccess": false,
        "allowSharedKeyAccess": false,
        "encryption": {
          "keySource": "Microsoft.Storage",
          "requireInfrastructureEncryption": true,
          "services": {
            "blob": {
              "enabled": true
            },
            "file": {
              "enabled": true
            },
            "queue": {
              "enabled": true
            }
          }
        }
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
      "apiVersion": "2022-05-01",
      "name": "[format('{0}/default/{1}', parameters('storageAccountName'), parameters('containerName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2023-01-31",
      "name": "[variables('managedIdentityName')]",
      "location": "[parameters('region')]"
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2021-04-01-preview",
      "name": "[guid(resourceGroup().id, parameters('storageAccountName'), variables('managedIdentityName'))]",
      "location": "[parameters('region')]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('managedIdentityName'))]"
      ],
      "properties": {
        "roleDefinitionId": "[variables('StorageBlobDataContributor')]",
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities',variables('managedIdentityName'))).principalId]",
        "principalType": "ServicePrincipal"
      },
      "scope": "[concat('Microsoft.Storage/storageAccounts', '/', parameters('storageAccountName'))]"
    },
    {
      "type": "Microsoft.HealthcareApis/workspaces",
      "apiVersion": "2023-02-28",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('region')]"
    },
    {
      "type": "Microsoft.HealthcareApis/workspaces/dicomservices",
      "apiVersion": "2023-02-28",
      "name": "[concat(parameters('workspaceName'), '/', parameters('dicomServiceName'))]",
      "location": "[parameters('region')]",
      "dependsOn": [
        "[resourceId('Microsoft.HealthcareApis/workspaces', parameters('workspaceName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('managedIdentityName'))]",
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ],
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
          "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('managedIdentityName'))]": {}
        }
      },
      "properties": {
        "storageConfiguration": {
          "accountName": "[parameters('storageAccountName')]",
          "containerName": "[parameters('containerName')]"
        }
      }
    }
  ],
  "outputs": {
    "storageAccountResourceId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    },
    "containerName": {
      "type": "string",
      "value": "[parameters('containerName')]"
    }
  }
}
```

1. When prompted, select the values for the workspace name, DICOM service name, region, storage account name, storage account SKU, and container name.  

1. Select **Review + create** to deploy the DICOM service.  

## Next steps

* [Assign roles for the DICOM service](../configure-azure-rbac.md#assign-roles-for-the-dicom-service)
* [Use DICOMweb Standard APIs with DICOM services](dicomweb-standard-apis-with-dicom-services.md)
* [Enable audit and diagnostic logging in the DICOM service](enable-diagnostic-logging.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
