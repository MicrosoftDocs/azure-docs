---
title: Configure customer-managed keys (CMK) for the DICOM service in Azure Health Data Services
description: Use customer-managed keys (CMK) to encrypt data in the DICOM service. Create and manage CMK in Azure Key Vault and update the encryption key with a managed identity.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/24/2023
ms.author: mmitrik
---

# Configure customer-managed keys for the DICOM service

With customer-managed keys (CMK), you can protect and control access to your organization's data using keys that you create and manage. 

Before you complete the steps in this article, make sure you're familiar with [Best practices for using customer-managed keys](customer-managed-keys.md).


## Add a key for the DICOM service in Azure Key Vault

Before you configure customer-managed keys for the DICOM service, you need to add the key. For steps, see [Add a key in Azure Key Vault](../../key-vault/keys/quick-create-portal.md#add-a-key-to-key-vault). 

## Enable a managed identity

Before configure keys, you need to enable a managed identity for the DICOM service. You can use either a system-assigned or user-assigned managed identity. To understand the differences between a system-assigned and user-assigned managed identity, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview). 

#### System-assigned managed identity

1. In the Azure portal, go to the DICOM instance. Select **Identity** from the left pane.

2. On the **Identity** page, select the **System assigned** tab.
   
3. Set the **Status** field to **On**. 
   
4. Choose **Save**.

:::image type="content" source="media/configure-customer-managed-keys/system-assigned-managed-identity.png" alt-text="Screenshot showing the system-assigned managed identity toggle on the Identity page." lightbox="media/configure-customer-managed-keys/system-assigned-managed-identity.png":::

#### User-assigned managed identity

For steps to add a user-assigned managed identity, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

## Assign the Key Vault Crypto Officer role

The system-assigned managed identity needs the [Key Vault Crypto Officer](../../key-vault/general/rbac-guide.md) role to access keys and use them to encrypt and decrypt data.  

1. In the Azure portal, go to the key vault and then select **Access control (IAM)** from the left pane.

2. On the **Access control (IAM)** page, select **Add role assignment**.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-access-control.png" alt-text="Screenshot of the Access control (IAM) view for the key vault." lightbox="media/configure-customer-managed-keys/key-vault-access-control.png":::

3. On the Add role assignment page, select the **Key Vault Crypto Officer** role. 
   
4. Select **Next**.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-crypto-officer-role.png" alt-text="Screenshot showing the Key Vault Crypto Officer role selected on the role assignments tab." lightbox="media/configure-customer-managed-keys/key-vault-crypto-officer-role.png":::

5. On the Members tab, select **Managed Identity** and then select **+ Select members**.

1. On the **Select managed identities** pane, select **DICOM service** from the **Managed identity** drop-down list. Select your DICOM service.
3. Choose **Select** on the **Select managed identities** pane. 

:::image type="content" source="media/configure-customer-managed-keys/key-vault-add-role-assignment.png" alt-text="Screenshot of selecting the system assigned managed identity in the Add role assignment page." lightbox="media/configure-customer-managed-keys/key-vault-add-role-assignment.png":::

8. Review the role assignment and then select **Review + assign**. 

:::image type="content" source="media/configure-customer-managed-keys/key-vault-add-role-review.png" alt-text="Screenshot of the role assignment with the review + assign action." lightbox="media/configure-customer-managed-keys/key-vault-add-role-review.png":::

## Use an ARM template to update the encryption key

After you add the key, you need to update the DICOM service with the key URL.  

1. In the key vault, select **Keys**.
   
2. Select the key for the DICOM service.  

:::image type="content" source="media/configure-customer-managed-keys/key-vault-list.png" alt-text="Screenshot of the Keys page and the key to use with the DICOM service." lightbox="media/configure-customer-managed-keys/key-vault-list.png":::

1. Select the key version, and then copy the **Key Identifier**.  You need the key URL for the next step.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-url.png" alt-text="Screenshot showing the key version details and the copy action for the Key Identifier." lightbox="media/configure-customer-managed-keys/key-vault-url.png":::

## Update the key by using an ARM template

   Use the Azure portal to **Deploy a custom template** and use one of the ARM templates to update the key. For more information, see [Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

#### ARM template for a system-assigned managed identity

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
#### ARM template for a user-assigned managed identity

```json
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
        "keyVaultName": {
            "type": "String"
        },
        "keyName": {
            "type": "String"
        },
        "userAssignedIdentityName": {
            "type": "String"
        },
        "roleAssignmentName": {
            "type": "String"
        },
        "region": {
            "defaultValue": "West US 3",
            "type": "String"
        },
        "tenantId": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.KeyVault/vaults",
            "apiVersion": "2022-07-01",
            "name": "[parameters('keyVaultName')]",
            "location": "[parameters('region')]",
            "properties": {
              "accessPolicies": [],
              "enablePurgeProtection": true,
              "enableRbacAuthorization": true,
              "enableSoftDelete": true,
              "sku": {
                "family": "A",
                "name": "standard"
              },
              "tenantId": "[parameters('tenantId')]"
            }
        },
        {
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
            "apiVersion": "2023-01-31",
            "name": "[parameters('userAssignedIdentityName')]",
            "location": "[parameters('region')]"
        },
        {
            "type": "Microsoft.KeyVault/vaults/keys",
            "apiVersion": "2022-07-01",
            "name": "[concat(parameters('keyVaultName'), '/', parameters('keyName'))]",
            "properties": {
              "attributes": {
                "enabled": true
              },
              "curveName": "P-256",
              "keyOps": [ "unwrapKey","wrapKey" ],
              "keySize": 2048,
              "kty": "RSA"
            },
            "dependsOn": [
                "[resourceId('Microsoft.KeyVault/vaults/', parameters('keyVaultName'))]"
            ]
        },
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2021-04-01-preview",
            "name": "[guid(parameters('roleAssignmentName'))]",
            "properties": {
              "roleDefinitionId": "[resourceId('Microsoft.Authorization/roleDefinitions', '14b46e9e-c2b7-41b4-b07b-48a6ebf60603')]",
              "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))).principalId]"
            },
            "dependsOn": [
                "[resourceId('Microsoft.KeyVault/vaults/keys', parameters('keyVaultName'), parameters('keyName'))]",
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))]"
            ]
        },
        {
            "type": "Microsoft.HealthcareApis/workspaces",
            "name": "[parameters('workspaceName')]",
            "apiVersion": "2022-05-15",
            "location": "[parameters('region')]"
        },
        {
            "type": "Microsoft.HealthcareApis/workspaces/dicomservices",
            "apiVersion": "2023-06-01-preview",
            "name": "[concat(parameters('workspaceName'), '/', parameters('dicomServiceName'))]",
            "location": "[parameters('region')]",
            "dependsOn": [
                "[resourceId('Microsoft.HealthcareApis/workspaces', parameters('workspaceName'))]",
                "[resourceId('Microsoft.Authorization/roleAssignments', guid(parameters('roleAssignmentName')))]"
            ],
            "identity": {
                "type": "userAssigned",
                "userAssignedIdentities": {
                    "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]": {}
                }
            },
            "properties": {
                "encryption": {
                    "customerManagedKeyEncryption": {
                        "keyEncryptionKeyUrl": "[concat(reference(resourceId('Microsoft.KeyVault/vaults', parameters('keyVaultName'))).vaultUri, 'keys/', parameters('keyName'))]"
                    }
                }
            }
        }
    ]
}
```

4. When prompted, select the values for the resource group, region, workspace, and DICOM service name.  

    * If you're using a system-assigned managed identity, enter the **Key Identifier** you copied from the key vault in the **Key Encryption Key Url** field.
    * If you're using a user-assigned managed identity, enter the values for the key vault name, key name, user assigned identity name, and tenant ID.

:::image type="content" source="media/configure-customer-managed-keys/cmk-arm-deploy.png" alt-text="Screenshot of the deployment template with details, including Key Encryption Key URL filled in." lightbox="media/configure-customer-managed-keys/cmk-arm-deploy.png":::

5. Select **Review + create** to deploy the updates to the key.

When the deployment completes, the DICOM service data is encrypted with the key you provided.

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
