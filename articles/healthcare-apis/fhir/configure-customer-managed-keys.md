---
title: Configure customer-managed keys (CMK) for the FHIR service in Azure Health Data Services
description: Use customer-managed keys (CMK) to encrypt data in the FHIR service. Create and manage CMK in Azure Key Vault and update the encryption key with a managed identity.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 11/20/2023
ms.author: kesheth
---

# Configure customer-managed keys for the FHIR service

By using customer-managed keys (CMK), you can protect and control access to your organization's data with keys that you create and manage. You use [Azure Key Vault](../../key-vault/index.yml) to create and manage CMK and then use the keys to encrypt the data stored by the FHIR&reg; service. 

Customer-managed keys enable you to:

- Create your own encryption keys and store them in a key vault, or use the [Azure Key Vault API](/rest/api/keyvault/) to generate keys.
  
- Maintain full control and responsibility for the key lifecycle, including key rotation.

## Prerequisites
- Make sure you're familiar with [best practices for customer-managed keys](customer-managed-keys.md).

- Verify you're assigned the [Azure Contributor](../../role-based-access-control/role-assignments-steps.md) RBAC role, which lets you create and modify Azure resources.

- Add a key for the FHIR service in Azure Key Vault. For steps, see [Add a key in Azure Key Vault](../../key-vault/keys/quick-create-portal.md#add-a-key-to-key-vault). Customer-managed keys must meet these requirements:

   - The key is versioned.
  
   - The key type is **RSA**.
  
   - The key is **2048-bit** or **3072-bit**.
  
   - The key vault is located in the same region as a created resource, but can be in different Azure subscriptions or tenants. 

   - The combined length for the key vault name and key name can't exceed **94 characters**.
  
   - When using a key vault with a firewall to disable public access, the option to **Allow trusted Microsoft services to bypass this firewall** must be enabled.

   - To prevent losing the encryption key for the FHIR service, the key vault or managed HSM must have **soft delete** and **purge protection** enabled. These features allow you to recover deleted keys for a certain time (default 90 days) and block permanent deletion until that time is over.

> [!NOTE]
>FHIR service supports attaching a single identity type (System-assigned or user-assigned identity). Changing identity type can have impact on background jobs such as export and import, if they have a specific identity type already mapped.
     
## Update the FHIR service with the encryption key

After you add the key, you need to update the FHIR service with the key URL.  

1. In the key vault, select **Keys**.
   
2. Select the key for the FHIR service.  

:::image type="content" source="media/configure-customer-managed-keys/key-vault-list.png" alt-text="Screenshot of the Keys page and the key to use with the FHIR service." lightbox="media/configure-customer-managed-keys/key-vault-list.png":::

3. Select the key version.

4. Copy the **Key Identifier**.  You need the key URL when you update the key by using an ARM template.

:::image type="content" source="media/configure-customer-managed-keys/key-vault-url.png" alt-text="Screenshot showing the key version details and the copy action for the Key Identifier." lightbox="media/configure-customer-managed-keys/key-vault-url.png":::

You can update the key in FHIR service using Portal or ARM template. During Update workflow, you can choose to use system-assigned or user-assigned managed identity. For system-assigned managed identity ensure it and has Key Vault Crypto Service Encryption User role enabled. For more information on assigning Azure RBAC roles with the Azure portal, see [Assign Azure roles using the Azure portal](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition).

### Update the key by using the Azure portal

1. In the Azure portal, go to the FHIR service and then select **Encryption** from the left pane.

1. Select **Customer-managed key** for the Encryption type.

1. Select a key vault and key or enter the Key URI for the key that was created previously.  

1. Select an identity type, either System-assigned or User-assigned, that matches the type of managed identity configured previously.

1. Select **Save** to update the FHIR service to use the customer-managed key.  

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
        "fhirServiceName": {
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
            "type": "Microsoft.HealthcareApis/workspaces/fhirservices",
            "apiVersion": "2023-06-01-preview",
            "name": "[concat(parameters('workspaceName'), '/', parameters('fhirServiceName'))]",
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
        "fhirServiceName": {
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
            "type": "Microsoft.HealthcareApis/workspaces/fhirservices",
            "apiVersion": "2023-06-01-preview",
            "name": "[concat(parameters('workspaceName'), '/', parameters('fhirServiceName'))]",
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

1. When prompted, select the values for the resource group, region, workspace, and FHIR service name.  

    * If you're using a system-assigned managed identity, enter the **Key Identifier** you copied from the key vault in the **Key Encryption Key Url** field.
    * If you're using a user-assigned managed identity, enter the values for the key vault name, key name, user assigned identity name, and tenant ID.

1. Select **Review + create** to deploy the updates to the key.

:::image type="content" source="media/configure-customer-managed-keys/cmk-arm-deploy.png" alt-text="Screenshot of the deployment template with details, including Key Encryption Key URL filled in." lightbox="media/configure-customer-managed-keys/cmk-arm-deploy.png":::

## Configure a key when you create the FHIR service

If you use a user-assigned managed identity with the FHIR service, you can configure customer-managed keys at the same time you create the FHIR service.  

1. On the **Create FHIR service** page, enter the **FHIR service name**.
   
2. Choose **Next: Security**.  

  :::image type="content" source="media/configure-customer-managed-keys/deploy-name.png" alt-text="Screenshot of the Create FHIR service view with the FHIR service name filled in." lightbox="media/configure-customer-managed-keys/deploy-name.png":::

3. On the **Security** tab, in the **Encryption section** select **Customer-managed key**.

4. Choose **Select from key vault** or **Enter key URI** and then enter the key.  

5. Choose **Select an identity** to use the user-assigned managed identity. On the Select user assigned managed identity page, filter for and then select the managed identity. Choose **Add**.

6. On the **Security** tab, choose **Review + create**.
  
  :::image type="content" source="media/configure-customer-managed-keys/deploy-security-tab.png" alt-text="Screenshot of the Security tab with the Customer-managed key option selected." lightbox="media/configure-customer-managed-keys/deploy-security-tab.png":::

7. On the **Review + create** tab, review the summary of the configuration options and the validation success message. Choose **Create** to deploy the FHIR service with customer-managed keys.

  :::image type="content" source="media/configure-customer-managed-keys/deploy-review.png" alt-text="Screenshot of the Review + create tab with the selected options and validation success message shown." lightbox="media/configure-customer-managed-keys/deploy-review.png":::

## Recover from lost key access

For the FHIR service to operate properly, it must always have access to the key in the key vault. However, there are scenarios where the service could lose access to the key, including:

- The key is disabled or deleted from the key vault.

- The FHIR service system-assigned managed identity is disabled.

- The FHIR service system-assigned managed identity loses access to the key vault.

In any scenario where the FHIR service can't access the key, API requests return with `500` errors and the data is inaccessible until access to the key is restored. The [Azure Resource health](../../service-health/overview.md) view for the FHIR service helps you diagnose key access issues.

If key access is lost, ensure you updated the key and required resources so they're accessible by the FHIR service. For more information, see [Create or update REST API for the FHIR service](/rest/api/healthcareapis/fhir-services/create-or-update). Make sure to match all the properties and identities with your current FHIR service.

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
