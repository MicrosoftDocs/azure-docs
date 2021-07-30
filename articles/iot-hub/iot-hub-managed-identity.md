---
title: Azure IoT Hub managed identity | Microsoft Docs
description: How to use managed identities to allow egress connectivity from your IoT Hub to other Azure resources.
author: miag
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/11/2021
ms.author: miag
---

# IoT Hub support for managed identities 

Managed identities provide Azure services with an automatically managed identity in Azure AD in a secure manner. This eliminates the needs for developers having to manage credentials by providing an identity. There are two types of managed identities: system-assigned and user-assigned. IoT Hub supports both. 

In IoT Hub, managed identities can be used for egress connectivity from IoT Hub to other Azure services for features such as [message routing](iot-hub-devguide-messages-d2c.md), [file upload](iot-hub-devguide-file-upload.md), and [bulk device import/export](iot-hub-bulk-identity-mgmt.md). In this article, you learn how to use system-assigned and user-assigned managed identities in your IoT hub for different functionalities. 


## Prerequisites
- Read the documentation of [managed identities for Azure resources](./../active-directory/managed-identities-azure-resources/overview.md) to understand the differences between system-assigned and user-assigned managed identity.

- If you don’t have an IoT hub, [create one](iot-hub-create-through-portal.md) before continuing.


## System-assigned managed identity 

### Add and remove a system-assigned managed identity in Azure portal
1.	Sign in to the Azure portal and navigate to your desired IoT hub.
2.	Navigate to **Identity** in your IoT Hub portal
3.	Under **System-assigned** tab, select **On** and click **Save**.
4.	To remove system-assigned managed identity from an IoT hub, select **Off** and click **Save**.

    :::image type="content" source="./media/iot-hub-managed-identity/system-assigned.png" alt-text="Screenshot showing where to turn on system-assigned managed identity for an IoT hub":::        

### Enable system-assigned managed identity at hub creation time using ARM template

To enable the system-assigned managed identity in your IoT hub at resource provisioning time, use the Azure Resource Manager (ARM) template below. 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": 
    {
      "iotHubName": {
        "type": "string",
        "metadata": {
          "description": "Name of iothub resource"
        }
      },
      "skuName": {
        "type": "string",
        "defaultValue": "S1",
        "metadata": {
          "description": "SKU name of iothub resource, by default is Standard S1"
        }
      },
      "skuTier": {
        "type": "string",
        "defaultValue": "Standard",
        "metadata": {
          "description": "SKU tier of iothub resource, by default is Standard"
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Location of iothub resource. Please provide any of supported-regions of iothub"
        }
      }
    },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "createIotHub",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Devices/IotHubs",
              "apiVersion": "2021-03-31",
              "name": "[parameters('iotHubName')]",
              "location": "[parameters('location')]",
              "identity": {
                "type": "SystemAssigned"
              },
              "sku": {
              "name": "[parameters('skuName')]",
              "tier": "[parameters('skuTier')]",
              "capacity": 1
              }
            }
          ] 
        }
      }
    }
  ]
}
```

After substituting the values for your resource `name`, `location`, `SKU.name` and `SKU.tier`, you can use Azure CLI to deploy the resource in an existing resource group using:

```azurecli-interactive
az deployment group create --name <deployment-name> --resource-group <resource-group-name> --template-file <template-file.json> --parameters iotHubName=<valid-iothub-name> skuName=<sku-name> skuTier=<sku-tier> location=<any-of-supported-regions>
```

After the resource is created, you can retrieve the system-assigned assigned to your hub using Azure CLI:

```azurecli-interactive
az resource show --resource-type Microsoft.Devices/IotHubs --name <iot-hub-resource-name> --resource-group <resource-group-name>
```
## User-assigned managed identity 
In this section, you learn how to add and remove a user-assigned managed identity from an IoT hub using Azure portal.
1.	First you need to create a user-assigned managed identity as a standalone resource. To do so, you can follow the instructions in [Create a user-assigned managed identity](./../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity).
2.	Go to your IoT hub, navigate to the **Identity** in the IoT Hub portal.
3.	Under **User-Assigned** tab, click **Add user-assigned managed identity**. Choose the user-assigned managed identity you want to add to your hub and then click **Select**. 
4.	You can remove a user-assigned identity from an IoT hub. Choose the user-assigned identity you want to remove, and click **Remove** button. Note you are only removing it from IoT hub, and this removal does not delete the user-assigned identity as a resource. To delete the user-assigned identity as a resource, follow the instructions in [Delete a user-assigned managed identity](./../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#delete-a-user-assigned-managed-identity).

    :::image type="content" source="./media/iot-hub-managed-identity/user-assigned.png" alt-text="Screenshot showing how to add user-assigned managed identity for an IoT hub":::        


### Enable user-assigned managed identity at hub creation time using ARM template
Following is the example template that can be used to create hub with user-assigned managed identity. This template creates one user assigned identity with name *[iothub-name-provided]-identity* and assigned to the IoT hub created. You can change the template to add multiple user assigned identities as needed.
 
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "iotHubName": {
      "type": "string",
      "metadata": {
        "description": "Name of iothub resource"
      }
    },
  "skuName": {
    "type": "string",
    "defaultValue": "S1",
    "metadata": {
      "description": "SKU name of iothub resource, by default is Standard S1"
    }
  },
  "skuTier": {
    "type": "string",
    "defaultValue": "Standard",
    "metadata": {
      "description": "SKU tier of iothub resource, by default is Standard"
    }
  },
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]",
    "metadata": {
      "description": "Location of iothub resource. Please provide any of supported-regions of iothub"
    }
  }
},
  "variables": {
    "identityName": "[concat(parameters('iotHubName'), '-identity')]"
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "createIotHub",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
              "name": "[variables('identityName')]",
              "apiVersion": "2018-11-30",
              "location": "[resourceGroup().location]"
            },
            {
              "type": "Microsoft.Devices/IotHubs",
              "apiVersion": "2021-03-31",
              "name": "[parameters('iotHubName')]",
              "location": "[parameters('location')]",
              "identity": {
                "type": "UserAssigned",
                "userAssignedIdentities": {
                  "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('identityName'))]": {}
                }
              },
              "sku": {
                "name": "[parameters('skuName')]",
                "tier": "[parameters('skuTier')]",
                "capacity": 1
              },
              "dependsOn": [
                "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('identityName'))]"
              ]
            }
          ]
        }
      }
    }
  ]
}
```
```azurecli-interactive
az deployment group create --name <deployment-name> --resource-group <resource-group-name> --template-file <template-file.json> --parameters iotHubName=<valid-iothub-name> skuName=<sku-name> skuTier=<sku-tier> location=<any-of-supported-regions>
```

After the resource is created, you can retrieve the user-assigned managed identity in your hub using Azure CLI:

```azurecli-interactive
az resource show --resource-type Microsoft.Devices/IotHubs --name <iot-hub-resource-name> --resource-group <resource-group-name>
```
## Egress connectivity from IoT Hub to other Azure resources
In IoT Hub, managed identities can be used for egress connectivity from IoT Hub to other Azure services for [message routing](iot-hub-devguide-messages-d2c.md), [file upload](iot-hub-devguide-file-upload.md), and [bulk device import/export](iot-hub-bulk-identity-mgmt.md). You can choose which managed identity to use for each IoT Hub egress connectivity to customer-owned endpoints including storage accounts, event hubs, and service bus endpoints. 

## Configure message routing with managed identities
In this section, we use the [message routing](iot-hub-devguide-messages-d2c.md) to event hub custom endpoint as an example. The same thing applies to other routing custom endpoints. 

1.	First we need to go to your event hub in Azure portal, to assign the managed identity the right access. In your event hub, navigate to the **Access control (IAM)** tab and click **Add** then **Add a role assignment**.
3.	Select **Event Hubs Data Sender as role**.

    > [!NOTE] 
    > For storage account, select **Storage Blob Data Contributor** ([*not* Contributor or Storage Account Contributor](../storage/blobs/assign-azure-role-data-access.md)) as **role**. For service bus, select **Service bus Data Sender** as **role**.

4.  For user-assigned, choose **User-assigned managed identity** under **Assign access to**. Select your subscription and your user-assigned managed identity in the drop-down list. Click the **Save** button.

    :::image type="content" source="./media/iot-hub-managed-identity/eventhub-iam-user-assigned.png" alt-text="IoT Hub message routing with user assigned":::

5.	For system-assigned, under **Assign access to** choose **User, group, or service principal** and select your IoT Hub's resource name in the drop-down list. Click **Save**.

    :::image type="content" source="./media/iot-hub-managed-identity/eventhub-iam-system-assigned.png" alt-text="IoT Hub message routing with system assigned":::

    If you need to restrict the connectivity to your custom endpoint through a VNet, you need to turn on the trusted Microsoft first party exception, to give your IoT hub access to the specific endpoint. For example, if you're adding an event hub custom endpoint, navigate to the **Firewalls and virtual networks** tab in your event hub and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access event hubs**. Click the **Save** button. This also applies to storage account and service bus. Learn more about [IoT Hub support for virtual networks](./virtual-network-support.md).

    > [!NOTE]
    > You need to complete above steps to assign the managed identity the right access before adding the event hub as a custom endpoint in IoT Hub. Please wait a few minutes for the role assignment to propagate. 

6. Next, go to your IoT hub. In your hub, navigate to **Message Routing**, then click **Custom endpoints**. Click **Add** and choose the type of endpoint you would like to use. In this section, we use event hub as the example.
7.	At the bottom of the page, choose your preferred **Authentication type**. In this section, we use the **User-Assigned** as the example. In the dropdown, select the preferred user-assigned managed identity then click **Create**.

    :::image type="content" source="./media/iot-hub-managed-identity/eventhub-routing-endpoint.png" alt-text="IoT Hub event hub with user assigned":::

8. Custom endpoint successfully created. 
9. After creation, you can still change the authentication type. Select the custom endpoint that you want to change the authentication type, then click **Change authentication type**.

    :::image type="content" source="./media/iot-hub-managed-identity/change-authentication-type.png" alt-text="IoT Hub authentication type":::

10. Choose the new authentication type to be updated for this endpoint, click **Save**.

## Configure file upload with managed identities
IoT Hub's [file upload](iot-hub-devguide-file-upload.md) feature allows devices to upload files to a customer-owned storage account. To allow the file upload to function, IoT Hub needs to have connectivity to the storage account. Similar to message routing, you can pick the preferred authentication type and managed identity for IoT Hub egress connectivity to your Azure Storage account. 

1. In the Azure portal, navigate to your storage account's **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.
2. Select **Storage Blob Data Contributor** (not Contributor or Storage Account Contributor) as role.
3. For user-assigned, choose **User-assigned managed identity** under Assign access to. Select your subscription and your user-assigned managed identity in the drop-down list. Click the **Save** button.
4. For system-assigned, under **Assign access to** choose **User, group, or service principal** and select your IoT hub's resource name in the drop-down list. Click **Save**.

    If you need to restrict the connectivity to your storage account through a VNet, you need to turn on the trusted Microsoft first party exception, to give your IoT hub access to the storage account. On your storage account resource page, navigate to the **Firewalls and virtual networks** tab and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access this storage account**. Click the **Save** button. Learn more about [IoT Hub support for virtual networks](./virtual-network-support.md). 


    > [!NOTE]
    > You need to complete above steps to assign the managed identity the right access before saving the storage account in IoT Hub for file upload using the managed identity. Please wait a few minutes for the role assignment to propagate. 
 
5. On your IoT hub's resource page, navigate to **File upload** tab.
6. On the page that shows up, select the container that you intend to use in your blob storage, configure the **File notification settings, SAS TTL, Default TTL, and Maximum delivery count** as desired. Choose the preferred authentication type, and click **Save**.

    :::image type="content" source="./media/iot-hub-managed-identity/file-upload.png" alt-text="IoT Hub file upload with msi":::

    > [!NOTE]
    > In the file upload scenario, both hub and your device need to connect with your storage account. The steps above are for connecting your IoT hub to your storage account with desired authentication type. You still need to connect your device to storage using the SAS URI. Today the SAS URI is generated using connection string. We'll add support to generate SAS URI with managed identity soon. Please follow the steps in [file upload](iot-hub-devguide-file-upload.md).

## Configure bulk device import/export with managed identities

IoT Hub supports the functionality to [import/export devices](iot-hub-bulk-identity-mgmt.md)' information in bulk from/to a customer-provided storage blob. This functionality requires connectivity from IoT Hub to the storage account. 

1. In the Azure portal, navigate to your storage account's **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.
2. Select **Storage Blob Data Contributor** (not Contributor or Storage Account Contributor) as role.
3. For user-assigned, choose **User-assigned managed identity** under Assign access to. Select your subscription and your user-assigned managed identity in the drop-down list. Click the **Save** button.
4. For system-assigned, under **Assign access to** choose **User, group, or service principal** and select your IoT hub's resource name in the drop-down list. Click **Save**.


### Using REST API or SDK for import and export jobs

You can now use the Azure IoT REST APIs for creating import and export jobs. You will need to provide the following properties in the request body:

- **storageAuthenticationType**: Set the value to **identityBased**. 
- **inputBlobContainerUri**: Set this property only in the import job.
- **outputBlobContainerUri**: Set this property for both the import and export jobs.
- **identity**: Set the value to the managed identity to use.


Azure IoT Hub SDKs also support this functionality in the service client's registry manager. The following code snippet shows how to initiate an import job or export job in using the C# SDK.

**C# code snippet**

```csharp
    // Create an export job
 
    using RegistryManager srcRegistryManager = RegistryManager.CreateFromConnectionString(hubConnectionString);
 
    JobProperties jobProperties = JobProperties.CreateForExportJob(
        outputBlobContainerUri: blobContainerUri,
        excludeKeysInExport: false,
        storageAuthenticationType: StorageAuthenticationType.IdentityBased,
        identity: new ManagedIdentity
        {
            userAssignedIdentity = userDefinedManagedIdentityResourceId
        });
```
 
```csharp
    // Create an import job
    
    using RegistryManager destRegistryManager = RegistryManager.CreateFromConnectionString(hubConnectionString);
 
    JobProperties jobProperties = JobProperties.CreateForImportJob(
        inputBlobContainerUri: blobContainerUri,
        outputBlobContainerUri: blobContainerUri,
        storageAuthenticationType: StorageAuthenticationType.IdentityBased,
        identity: new ManagedIdentity
        {
            userAssignedIdentity = userDefinedManagedIdentityResourceId
        });
```  

**Python code snippet**

```python
# see note below
iothub_job_manager = IoTHubJobManager("<IoT Hub connection string>")

# Create an import job
result = iothub_job_manager.create_import_export_job(JobProperties(
    type="import",
    input_blob_container_uri="<input container URI>",
    output_blob_container_uri="<output container URI>",
    storage_authentication_type="identityBased",
    identity=ManagedIdentity(
        user_assigned_identity="<resource ID of user assigned managed identity>"
    )
))

# Create an export job
result = iothub_job_manager.create_import_export_job(JobProperties(
    type="export",
    output_blob_container_uri="<output container URI>",
    storage_authentication_type="identityBased",
    exclude_keys_in_export=True,
    identity=ManagedIdentity(
        user_assigned_identity="<resource ID of user assigned managed identity>"
    ) 
))
```

> [!NOTE]
> - If **storageAuthenticationType** is set to **identityBased** and **userAssignedIdentity** property is not **null**, the jobs will use the specified user-assigned managed identity.
> - If the IoT hub is not configured with the user-assigned managed identity specified in **userAssignedIdentity**, the job will fail.
> - If **storageAuthenticationType** is set to **identityBased** the **userAssignedIdentity** property is null, the jobs will use system-assigned identity.
> - If the IoT hub is not configured with the user-assigned managed identity, the job will fail.
> - If **storageAuthenticationType** is set to **identityBased** and neither **user-assigned** nor **system-assigned** managed identities are configured on the hub, the job will fail.

## SDK samples
- [.NET SDK sample](https://aka.ms/iothubmsicsharpsample)
- [Java SDK sample](https://aka.ms/iothubmsijavasample)
- [Python SDK sample](https://aka.ms/iothubmsipythonsample)
- Node.js SDK samples: [bulk device import](https://aka.ms/iothubmsinodesampleimport), [bulk device export](https://aka.ms/iothubmsinodesampleexport)

## Next steps

Use the links below to learn more about IoT Hub features:

* [Message routing](./iot-hub-devguide-messages-d2c.md)
* [File upload](./iot-hub-devguide-file-upload.md)
* [Bulk device import/export](./iot-hub-bulk-identity-mgmt.md)