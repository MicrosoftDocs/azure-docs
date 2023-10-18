---
title: Configure customer-managed Keys (CMK) - Azure Health Data Services
description: This document describes how to configure Customer Managed Keys (CMK) for the DICOM service in Azure Health Data Services.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/16/2023
ms.author: mmitrik
---

# Configure customer-managed keys for the DICOM service

Customer-managed keys (CMK) enable customers to protect and control access to their data using keys they create and manage.  The DICOM service supports CMK, allowing customers to create and manage keys using Azure Key Vault and then use those keys to encrypt the data stored by the DICOM service.  This article shows how to configure Azure Key Vault and the DICOM service to use customer-managed keys.

## Create a key in Azure Key Vault

To use customer-managed keys with the DICOM service, the key must first be created in Azure Key Vault.  The DICOM service also requires that keys meet the following requirements:

- The key vault or managed HSM that stores the key must have both **soft delete** and **purge protection** enabled.

- The key type is **RSA-HSM** or **RSA** with one of the following sizes: **2048-bit**, **3072-bit**, or **4096-bit**.

For more information, see [About keys](../../key-vault/keys/about-keys.md).

To create a key in your key vault, see [Add a key to Key Vault](../../key-vault/keys/quick-create-portal.md#add-a-key-to-key-vault)

## Enable system assigned managed identity

Before you configure keys, you need to enable a system-assigned managed identity for the DICOM service.

1. In the Azure portal, go to the DICOM instance and then select **Identity** from the left pane.

2. On the **Identity** page, select the **System assigned** tab, and then set the **Status** field to **On**. Choose **Save**.

:::image type="content" source="media/dicom-identity-sys-assign.png" alt-text="Screenshot of the system assigned managed identity toggle in the Identity page." lightbox="media/dicom-identity-sys-assign.png":::

### Assign Key Vault Crypto Officer role to the managed identity

The system assigned managed identity needs the [Key Vault Crypto Officer](../../role-based-access-control/built-in-roles.md#key-vault-crypto-officer) role in order to access keys and use them to encrypt and decrypt data.  

1. In the Azure portal, go to the key vault and then select **Access control (IAM)** from the left pane.

2. On the **Access control (IAM)** page select **Add role assignment**.

:::image type="content" source="media/kv-access-control.png" alt-text="Screenshot of the Access control (IAM) view for the key vault." lightbox="media/kv-access-control.png":::

3. On the Add role assignment page, select the **Key Vault Crypto Officer** role and then select **Next**.

:::image type="content" source="media/kv-crypto-officer-role.png" alt-text="Screenshot of the Key Vault Crypto Officer role selected in the Job function roles tab." lightbox="media/kv-crypto-officer-role.png":::

4. On the Members tab, select **Managed Identity** and then **Select members**.

5. On the Select managed identities panel, select **DICOM Service** from the Managed identity drop down, then select your DICOM service from the list, then choose **Select**. 

:::image type="content" source="media/kv-add-role-assignment.png" alt-text="Screenshot of selecting the system assigned managed identity in the Add role assignment page." lightbox="media/kv-add-role-assignment.png":::

6. Review the role assignment and select **Review + assign**. 

:::image type="content" source="media/kv-add-role-review.png" alt-text="Screenshot of the role assignment with the review + assign action." lightbox="media/kv-add-role-review.png":::

## Use an ARM template to update the encryption key

Once the key has been created, the DICOM service will need to be updated with the key URL.  

1. In the key vault, select **Keys** and then select the key for the DICOM service.  

:::image type="content" source="media/kv-keys-list.png" alt-text="Screenshot of they Keys page and the key to use with the DICOM service." lightbox="media/kv-keys-list.png":::

2. Select the key version and copy the **Key Identifier**.  This is the Key Url you will use in the next step.

:::image type="content" source="media/kv-key-url.png" alt-text="Screenshot of the key version details and the copy action forthe Key Identifier." lightbox="media/kv-key-url.png":::

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

4. When prompted, select the appropriate values for the resource group, region, workspace, and DICOM service name.  In the **Key Encryption Key Url** field, enter the Key Identifier copied from the key vault.  

:::image type="content" source="media/cmk-arm-deploy.md" alt-text="Screenshot of the deployment template with details, including Key Encryption Key URL filled in." lightbox="media/cmk-arm-deploy.md":::

5. Select **Review + create** to deploy the key changes.

When the deployment succeeds, the DICOM service data will be encrypted with the key provided.

## Losing access to the key
For the DICOM service to operate properly, it must always have access to the key in the key vault.  There are some scenarios where the service could lose access to the key, including:

- The key is disabled or deleted from the key vault
- The DICOM service's system assigned managed identity is disabled 


## Rotating they key
