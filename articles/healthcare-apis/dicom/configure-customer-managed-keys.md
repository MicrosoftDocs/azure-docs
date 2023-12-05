---
title: Configure customer-managed keys (CMK) for the DICOM service in Azure Health Data Services
description: Use customer-managed keys (CMK) to encrypt data in the DICOM service. Create and manage CMK in Azure Key Vault and update the encryption key with a managed identity.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 11/20/2023
ms.author: mmitrik
---

# Configure customer-managed keys for the DICOM service

By using customer-managed keys (CMK), you can protect and control access to your organization's data with keys that you create and manage. You use [Azure Key Vault](../../key-vault/index.yml) to create and manage CMK and then use the keys to encrypt the data stored by the DICOM&reg; service. 

## Prerequisites
- Make sure you're familiar with [best practices for customer-managed keys](customer-managed-keys.md).

- Add a key for the DICOM service in Azure Key Vault. For steps, see [Add a key in Azure Key Vault](../../key-vault/keys/quick-create-portal.md#add-a-key-to-key-vault). Customer-managed keys must meet these requirements:

   - The key is versioned.
  
   - The key type is **RSA-HSM** or **RSA**.
  
   - The key is **2048-bit** or **3072-bit**.
  
   - The key vault is located in the same Azure tenant as the DICOM service.
  
   - When using a key vault with a firewall to disable public access, the option to **Allow trusted Microsoft services to bypass this firewall** must be enabled.

   - To prevent losing the encryption key for the DICOM service, the key vault or managed HSM must have **soft delete** and **purge protection** enabled. These features allow you to recover deleted keys for a certain time (default 90 days) and block permanent deletion until that time is over.

   - When using a managed HSM, if the vault has disabled public traffic and has a private endpoint, a user-assigned managed identity must be used with the DICOM service.

## Enable a managed identity for the DICOM service

 You can use either a system-assigned or user-assigned managed identity. To find out the differences between a system-assigned and user-assigned managed identity, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview). 

#### System-assigned managed identity

1. In the Azure portal, go to the DICOM instance. Select **Identity** from the left pane.

2. On the **Identity** page, select the **System assigned** tab.
   
3. Set the **Status** field to **On**. 
   
4. Choose **Save**.

:::image type="content" source="media/configure-customer-managed-keys/system-assigned-managed-identity.png" alt-text="Screenshot showing the system-assigned managed identity toggle on the Identity page." lightbox="media/configure-customer-managed-keys/system-assigned-managed-identity.png":::

#### User-assigned managed identity

For steps to add a user-assigned managed identity, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

## Assign the Key Vault Crypto Service Encryption User role

The system-assigned managed identity needs the [Key Vault Crypto Service Encryption User](../../key-vault/general/rbac-guide.md) role to access keys and use them to encrypt and decrypt data.  

1. In the Azure portal, go to the key vault and then select **Access control (IAM)** from the left pane.

2. On the **Access control (IAM)** page, select **Add role assignment**.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-access-control.png" alt-text="Screenshot of the Access control (IAM) view for the key vault." lightbox="media/configure-customer-managed-keys/key-vault-access-control.png":::

3. On the Add role assignment page, select the **Key Vault Crypto Service Encryption User** role. 
   
4. Select **Next**.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-crypto-encryption-user-role.png" alt-text="Screenshot showing the Key Vault Crypto Officer role selected on the role assignments tab." lightbox="media/configure-customer-managed-keys/key-vault-crypto-encryption-user-role.png":::

5. On the Members tab, select **Managed Identity** and then select **+Select members**.

6. On the **Select managed identities** pane, select **DICOM service** from the **Managed identity** drop-down list. Select your DICOM service.
   
7. On the **Select managed identities** pane, choose **Select**. 

:::image type="content" source="media/configure-customer-managed-keys/key-vault-add-role-assignment.png" alt-text="Screenshot of selecting the system assigned managed identity in the Add role assignment page." lightbox="media/configure-customer-managed-keys/key-vault-add-role-assignment.png":::

8. Review the role assignment and then select **Review + assign**. 

:::image type="content" source="media/configure-customer-managed-keys/key-vault-add-role-review.png" alt-text="Screenshot of the role assignment with the review + assign action." lightbox="media/configure-customer-managed-keys/key-vault-add-role-review.png":::

## Update the DICOM service with the encryption key

After you add the key, you need to update the DICOM service with the key URL.  

1. In the key vault, select **Keys**.
   
2. Select the key for the DICOM service.  

:::image type="content" source="media/configure-customer-managed-keys/key-vault-list.png" alt-text="Screenshot of the Keys page and the key to use with the DICOM service." lightbox="media/configure-customer-managed-keys/key-vault-list.png":::

3. Select the key version.

4. Copy the **Key Identifier**.  You need the key URL when you update the key by using an ARM template.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-url.png" alt-text="Screenshot showing the key version details and the copy action for the Key Identifier." lightbox="media/configure-customer-managed-keys/key-vault-url.png":::

### Update the key by using the Azure portal

1. In the Azure portal, go to the DICOM service and then select **Encryption** from the left pane.

1. Select **Customer-managed key** for the Encryption type.

1. Select a key vault and key or enter the Key URI for the key that was created previously.  

1. Select an identity type, either System-assigned or User-assigned, that matches the type of managed identity configured previously.

1. Select **Save** to update the DICOM service to use the customer-managed key.  

:::image type="content" source="media/configure-customer-managed-keys/configure-encryption-portal.png" alt-text="Screenshot of the Encryption view, showing the selection of the Customer-managed key option, key vault settings, identity type settings, and Save button." lightbox="media/configure-customer-managed-keys/configure-encryption-portal.png":::

### Update the key by using an ARM template

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
                        "keyEncryptionKeyUrl": "[reference(resourceId('Microsoft.KeyVault/vaults/keys', parameters('keyVaultName'), parameters('keyName'))).keyUriWithVersion]"
                    }
                }
            }
        }
    ]
}
```

1. When prompted, select the values for the resource group, region, workspace, and DICOM service name.  

    * If you're using a system-assigned managed identity, enter the **Key Identifier** you copied from the key vault in the **Key Encryption Key Url** field.
    * If you're using a user-assigned managed identity, enter the values for the key vault name, key name, user assigned identity name, and tenant ID.

1. Select **Review + create** to deploy the updates to the key.

:::image type="content" source="media/configure-customer-managed-keys/cmk-arm-deploy.png" alt-text="Screenshot of the deployment template with details, including Key Encryption Key URL filled in." lightbox="media/configure-customer-managed-keys/cmk-arm-deploy.png":::

## Recover from lost key access

For the DICOM service to operate properly, it must always have access to the key in the key vault. However, there are scenarios where the service could lose access to the key, including:

- The key is disabled or deleted from the key vault.

- The DICOM service system-assigned managed identity is disabled.

- The DICOM service system-assigned managed identity loses access to the key vault.

In any scenario where the DICOM service can't access the key, API requests return with `500` errors and the data is inaccessible until access to the key is restored. The [Azure Resource health](../../service-health/overview.md) view for the DICOM service helps you diagnose key access issues.

If key access is lost, ensure you have updated the key and required resources so they're accessible by the DICOM service. For more information, see [Create or update REST API for the DICOM service](/rest/api/healthcareapis/dicom-services/create-or-update). Make sure to match all the properties and identities with your current DICOM service.

## Update the DICOM service after changing a managed identity
If you change the managed identity in any way, such as moving your DICOM service to a different tenant or subscription, the DICOM service isn't able to access your keys until you update the service manually with an ARM template deployment. For steps, see [Use an ARM template to update the encryption key](configure-customer-managed-keys.md#update-the-key-by-using-an-arm-template).

:::image type="content" source="media/configure-customer-managed-keys/dicom-encryption-view.png" alt-text="Screenshot of the encryption view with Encryption type showing Customer-managed key." lightbox="media/configure-customer-managed-keys/dicom-encryption-view.png":::

## Configure a key when you create the DICOM service

If you use a user-assigned managed identity with the DICOM service, you can configure customer-managed keys at the same time you create the DICOM service.  

1. On the **Create DICOM service** page, enter the **DICOM service name**.
   
2. Choose **Next: Security**.  

  :::image type="content" source="media/configure-customer-managed-keys/deploy-name.png" alt-text="Screenshot of the Create DICOM service view with the DICOM service name filled in." lightbox="media/configure-customer-managed-keys/deploy-name.png":::

3. On the **Security** tab, in the **Encryption section** select **Customer-managed key**.

4. Choose **Select from key vault** or **Enter key URI** and then enter the key.  

5. Choose **Select an identity** to use the user-assigned managed identity. On the Select user assigned managed identity page, filter for and then select the managed identity. Choose **Add**.

6. On the **Security** tab, choose **Review + create**.
  :::image type="content" source="media/configure-customer-managed-keys/deploy-security-tab.png" alt-text="Screenshot of the Security tab with the Customer-managed key option selected." lightbox="media/configure-customer-managed-keys/deploy-security-tab.png":::

7. On the **Review + create** tab, review the summary of the configuration options and the validation success message. Choose **Create** to deploy the DICOM service with customer-managed keys.

  :::image type="content" source="media/configure-customer-managed-keys/deploy-review.png" alt-text="Screenshot of the Review + create tab with the selected options and validation success message shown." lightbox="media/configure-customer-managed-keys/deploy-review.png":::

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
