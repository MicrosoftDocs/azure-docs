---
title: Set up customer-managed keys (CMK) for the DICOM service in Azure Health Data Services
description: Learn how to use customer-managed keys (CMK) with Azure Key Vault to encrypt and decrypt data stored by the DICOM service in Azure Health Data Services. Follow the steps to create a key, enable a managed identity, and update the encryption key.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/16/2023
ms.author: mmitrik
---

# Set up customer-managed keys for the DICOM service

With customer-managed keys (CMK), you can protect and control access to your organization's data using keys that you create and manage. Azure Key Vault is a cloud service that lets you securely store and manage secrets, such as keys, passwords, and certificates. You can use [Azure Key Vault](../../key-vault/index.yml) to create and manage keys for CMK and then use those keys to encrypt the data stored by the DICOM&reg; service. For more information, see [About Key Vault keys](../../key-vault/keys/about-keys.md).

## Add a key for the DICOM service in Azure Key Vault

Before you set up keys, you need to [add a key in Azure Key Vault](../../key-vault/keys/quick-create-portal.md#add-a-key-to-key-vault). The DICOM service requires that keys meet these requirements:

   - The key type is **RSA-HSM** or **RSA** with one of these sizes: **2048-bit** or **3072-bit**.

   - To prevent losing the encryption key for the DICOM service, the key vault or managed HSM (hardware security module) must have **soft delete** and **purge protection** enabled. These features allow you to recover deleted keys for a certain time (default 90 days) and block permanent deletion until that time is over.

## Enable a managed identity

Before you set up keys, you need to enable a managed identity for the DICOM service. You can use either a system-assigned or user-assigned managed identity.

#### System-assigned managed identity

1. In the Azure portal, go to the DICOM instance and then select **Identity** from the left pane.

2. On the **Identity** page, select the **System assigned** tab, and then set the **Status** field to **On**. Choose **Save**.

:::image type="content" source="media/system-assigned-managed-identity.png" alt-text="Screenshot of the system assigned managed identity toggle in the Identity page." lightbox="media/system-assigned-managed-identity.png":::

#### User-assigned managed identity

Instead of a system-assigned managed identity, you can use a user-assigned managed identity. To understand the differences between a system-assigned and user-assigned managed identity, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview). For steps to add a user-managed identity, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

## Assign the Key Vault Crypto Officer role

The system-assigned managed identity needs the [Key Vault Crypto Officer](../../key-vault/general/rbac-guide.md) role to access keys and use them to encrypt and decrypt data.  

1. In the Azure portal, go to the key vault and then select **Access control (IAM)** from the left pane.

2. On the **Access control (IAM)** page, select **Add role assignment**.

:::image type="content" source="media/kv-access-control.png" alt-text="Screenshot of the Access control (IAM) view for the key vault." lightbox="media/kv-access-control.png":::

3. On the Add role assignment page, select the **Key Vault Crypto Officer** role and then select **Next**.

:::image type="content" source="media/kv-crypto-officer-role.png" alt-text="Screenshot of the Key Vault Crypto Officer role selected in the Job function roles tab." lightbox="media/kv-crypto-officer-role.png":::

4. On the Members tab, select **Managed Identity** and then **Select members**.

5. On the Select managed identities panel, select **DICOM Service** from the Managed identity drop-down list, then select your DICOM service from the list, then choose **Select**. 

:::image type="content" source="media/kv-add-role-assignment.png" alt-text="Screenshot of selecting the system assigned managed identity in the Add role assignment page." lightbox="media/kv-add-role-assignment.png":::

6. Review the role assignment and then select **Review + assign**. 

:::image type="content" source="media/kv-add-role-review.png" alt-text="Screenshot of the role assignment with the review + assign action." lightbox="media/kv-add-role-review.png":::

## Use an ARM template to update the encryption key

After you add the key, you need to update the DICOM service with the key URL.  

1. In the key vault, select **Keys** and then select the key for the DICOM service.  

:::image type="content" source="media/kv-keys-list.png" alt-text="Screenshot of they Keys page and the key to use with the DICOM service." lightbox="media/kv-keys-list.png":::

2. Select the key version and copy the **Key Identifier**.  You need the Key Url for the next step.

:::image type="content" source="media/kv-key-url.png" alt-text="Screenshot of the key version details and the copy action for the Key Identifier." lightbox="media/kv-key-url.png":::

3. Use the Azure portal to **Deploy a custom template** and use following ARM template to update the key.  

``` json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "type": "String"
        },
        "dicomServiceName": {
            "type": "String"
        },
        "keyEncryptionKeyUrl": {
            "type": "String"
        },
        "region": {
            "defaultValue": "West US 3",
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.HealthcareApis/workspaces/dicomservices",
            "apiVersion": "2023-06-01-preview",
            "name": "[concat(parameters('workspaceName'), '/', parameters('dicomServiceName'))]",
            "location": "[parameters('region')]",
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "encryption": {
                    "customerManagedKeyEncryption": {
                        "keyEncryptionKeyUrl": "[parameters('keyEncryptionKeyUrl')]"
                    }
                }
            }
        }
    ]
}

```

1. When prompted, select the values for the resource group, region, workspace, and DICOM service name.  In the **Key Encryption Key Url** field, enter the Key Identifier you copied from the key vault.  

:::image type="content" source="media/cmk-arm-deploy.png" alt-text="Screenshot of the deployment template with details, including Key Encryption Key URL filled in." lightbox="media/cmk-arm-deploy.png":::

5. Select **Review + create** to deploy the updates to the key.

When the deployment completes, the DICOM service data is encrypted with the key you provided.

## Troubleshoot lost access to the key
For the DICOM service to operate properly, it must always have access to the key in the key vault. There are some scenarios where the service could lose access to the key, including:

- The key is disabled or deleted from the key vault
- The DICOM service's system-assigned managed identity is disabled 
- The DICOM service's system-assigned managed identity loses access to the key vault

In any scenario where the DICOM service can't access the key, API requests return with `500` errors and the data is inaccessible until access to the key is restored. The Resource health view for the DICOM service can help diagnose key access issues.

If key access is lost for less than 30 minutes, 

## Rotate the key





[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]