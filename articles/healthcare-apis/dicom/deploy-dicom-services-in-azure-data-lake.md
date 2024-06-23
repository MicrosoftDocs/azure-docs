---
title: Deploy the DICOM service with Azure Data Lake Storage
description: Learn how to deploy the DICOM service and store all your DICOM data in its native format with a data lake in Azure Health Data Services.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: how-to
ms.date: 11/21/2023
ms.author: mmitrik
ms.custom: mode-api, devx-track-arm-template
---

# Deploy the DICOM service with Azure Data Lake Storage

Deploying the [DICOM&reg; service with Azure Data Lake Storage](dicom-data-lake.md) enables organizations to store and process imaging data in a standardized, secure, and scalable way.

After deployment completes, you can use the Azure portal to see the details about the DICOM service, including the service URL. The service URL to access your DICOM service is ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the API version as part of the URL when you make requests. For more information, see [API versioning for the DICOM service](api-versioning-dicom-service.md).

## Prerequisites

- **Deploy an Azure Health Data Services workspace**.  For more information, see [Deploy a workspace in the Azure portal](../healthcare-apis-quickstart.md).
- **Create a storage account with a hierarchical namespace**.  For more information, see [Create a storage account to use with Azure Data Lake Storage Gen2](/azure/storage/blobs/create-data-lake-storage-account).
- **Create a blob container in the storage account**.  The container is used by the DICOM service to store DICOM files.  For more information, see [Manage blob containers using the Azure portal](/azure/storage/blobs/blob-containers-portal).

> [!NOTE]
> The Azure Data Lake Storage option is only available for new instances of the DICOM service. After the option becomes generally available, we plan to offer a migration path for existing DICOM service instances.

## Deploy the DICOM service with Azure Data Lake Storage by using the Azure portal

1. On the **Resource group** page of the Azure portal, select the name of the **Azure Health Data Services workspace**.

   :::image type="content" source="media/deploy-data-lake/resource-group.png" alt-text="Screenshot showing a Health Data Services Workspace in the resource group view in the Azure portal." lightbox="media/deploy-data-lake/resource-group.png":::

1. Select **Deploy DICOM service**.

   :::image type="content" source="media/deploy-data-lake/workspace-deploy-dicom.png" alt-text="Screenshot showing the Deploy DICOM service button in the workspace view in the Azure portal." lightbox="media/deploy-data-lake/workspace-deploy-dicom.png":::

1. Select **Add DICOM service**.

   :::image type="content" source="media/deploy-data-lake/add-dicom-service.png" alt-text="Screenshot showing the Add DICOM Service button in the Azure portal." lightbox="media/deploy-data-lake/add-dicom-service.png":::

1. Enter a name for the DICOM service.

1. Select **Data Lake Storage (default)** for the storage location.  

    :::image type="content" source="media/deploy-data-lake/create-dicom-service-data-lake-sml.png" alt-text="Screenshot showing the storage location option." lightbox="media/deploy-data-lake/create-dicom-service-data-lake-lrg.png":::

1. Select the **subscription** and **resource group** that contains the storage account.

1. Select the **storage account** created in the prerequisites.

1. Select the **storage container** created in the prerequisites.  

1. Select **Review + create** to deploy the DICOM service.  

1. When the system displays a green validation check mark, select **Create** to deploy the DICOM service.

1. After the deployment process completes, select **Go to resource**.

   :::image type="content" source="media/deploy-data-lake/dicom-deploy-complete.png" alt-text="Screenshot showing the completed deployment of the DICOM service." lightbox="media/deploy-data-lake/dicom-deploy-complete.png":::

   The DICOM service overview screen shows the new service and lists the storage account.  

   :::image type="content" source="media/deploy-data-lake/dicom-service-overview.png" alt-text="Screenshot that shows the DICOM service overview." lightbox="media/deploy-data-lake/dicom-service-overview.png":::

## Deploy the DICOM service with Data Lake Storage by using an ARM template

Use the Azure portal to **Deploy a custom template** and then use the sample ARM template to deploy the DICOM service with Azure Data Lake Storage. For more information, see [Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

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

## Troubleshooting

### Connectivity

To be alerted to store health and connectivity failures, please sign up for [Resource Health alerts](/azure/service-health/resource-health-alert-monitor-guide).

### 424 Failed Dependency

When the response status code is `424 Failed Dependency`, the issue lies with a dependency configured with DICOM and it may be the data lake store.
The response body indicates which dependency failed and provides more context on the failure. For data lake storage account failures, an error code is provided which was received when attempting to interact with the store. For more information, see [Azure Blob Storage error codes](/rest/api/storageservices/blob-service-error-codes).
Note that a code of `ConditionNotMet` typically indicates the blob file has been moved, deleted or modified without using DICOM APIs. The best way to mitigate such a situation is to use the DICOM API to DELETE the instance to remove the index and then reupload the modified file. This will enable you to continue to reference and interact with the file through DICOM APIs.

## Next steps
[Receive resource health alerts](/azure/service-health/resource-health-alert-monitor-guide)

[Assign roles for the DICOM service](../configure-azure-rbac.md#assign-roles-for-the-dicom-service)

[Review DICOM service conformance statement](/azure/healthcare-apis/dicom/dicom-services-conformance-statement-v2)

[Use DICOMweb Standard APIs with DICOM services](dicomweb-standard-apis-with-dicom-services.md)

* [Enable audit and diagnostic logging in the DICOM service](enable-diagnostic-logging.md)


[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]