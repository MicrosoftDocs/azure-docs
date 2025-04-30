---
title: Setup Customer Managed Key (CMK) Encryption within an Enclave
titleSuffix: Azure Virtual Enclaves
description: Setup Customer Managed Key (CMK) Encryption within an Enclave.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Set-up customer-managed-key (CMK) encryption within an enclave

The fastest way to deploy customer managed keys to be compliant with the Azure Virtual Enclaves policy requiring CMK is through the [Common Dependencies](./deploy-common-dependencies-service-catalog.md) Service Catalog template. 

There are several types of [encryption](/azure/virtual-machines/windows/disk-encryption-overview) available for securing your data on managed disks and other Azure PaaS services, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE) and encryption at host. In accordance with Azure Virtual Enclaves (AVE) default [governance and cybersecurity posture](./what-azure-virtual-enclaves.md#multi-layered-governance-security-and-monitoring) requires customer-managed-key encryption for all resources deployed in an [enclave](./what-enclave.md).

## Prerequisites for manual deployment method
- Portal Access from Admin Workstation (192.168.0.0/26 usually).
  - [Create community endpoint](./create-community-endpoint-portal.md) to Azure portal and Microsoft Azure services.
    - A default endpoint should have been created with the community that defines these. If so you might skip this step.
  - [Create enclave Connection](./create-enclave-connection-portal.md) to community endpoint.
- You have been assigned "Key Vault Contributor" to the KV or enclave RG.

## Steps in this guide
- [Create KV RSA 2048 Key](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) or Bring your own key.
- [Create Managed Identity](./create-user-managed-identity.md) with permissions to the KV Key.

### Enclave Key Vault
Every enclave is deployed with an [Azure Key Vault](https://aka.ms/kv) in the [default resource group](./best-practices.md#enclave-managed-resource-group) for enclave infrastructure. Azure Key Vault is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys. By default, enclave contributors should be able to upload keys, secrets, or certificates to the enclave Key Vault and utilize existing Azure capabilities and design patterns of other Azure services to support CMK encryption.

Examples of setting-up CMK encryption are provided below, with more [detailed instructions](#create-cmk-via-the-portal) or articles provided.

### Create a Key in a Key Vault
- How-to Azure article - [Key creation starts after Step 6](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)

### Disk encryption sets (Windows IaaS)
- How-to Azure article - [Pick up after KV creation](/azure/virtual-machines/disks-enable-customer-managed-keys-portal)
- [Learn more](/azure/virtual-machines/windows/disk-encryption-windows)

### Azure PaaS example (Storage account)
- [Customer Managed Keys overview](../storage/common/customer-managed-keys-overview.md)
- [Existing storage accounts](../storage/common/customer-managed-keys-configure-existing-account.md)
- [New storage accounts](../storage/common/customer-managed-keys-configure-new-account.md)

## Create CMK via template
1. From the portal, in the top search bar, enter `deploy` and select `Deploy a Custom Template`.
2. Select `Build your own template in the editor`.
3. Select all of the existing template code within the curly brackets.
4. Copy the [template](#cmk-template) and paste into the `Build your own template in the editor` window.
5. Select `Save`.
6. Enter required parameters.
7. Select `Review + Create` and `Create`.

## Create CMK via the Portal
Alternatively, CMK can be created via the Portal
### Steps in this guide
1. [Sign in to Admin Workstation](./understand-admin-vm.md).
2. [Create Access Policy from Admin Workstation](#create-access-policy-from-admin-workstation).
3. [Generate Key for CMK in Key Vault](#generate-key-for-cmk-in-key-vault).

### Enable Enclave access to the Azure portal
KV access is restricted to the KV virtual network so the KV Key will need to be created from the Azure portal from within the Admin Workstation.
* [Create enclave Connection](./create-enclave-connection-portal.md) to community endpoint for access to the Azure portal.
 
### Sign in to Admin Workstation
Follow [these Admin Workstation](./understand-admin-vm.md) instructions to sign in.

### Update Key Vault from Admin Workstation
1. After Admin Workstation sign in, open Microsoft Edge (e.g. via the Start Menu).
2. Navigate to `https://portal.azure.com` or the domain specific portal URL.

### Create Access Policy from Admin Workstation
KV access is restricted to the KV virtual network so the KV Key will need to be created from the Azure portal from within the Admin Workstation.
1. From the portal, navigate to the Key Vault and select the `Access Policy` on the left side.
2. Select `Create`.
3. Select the "Configure from a template" dropdown and select `Key Management`.
4. Select `Next` to the Principle tab.
5. Enter your username in the search bar and select your user account.
5. Select `Next` and then `Create`.

### Generate Key for CMK in Key Vault
1. From the portal, navigate to the Key Vault and select the `Keys` on the left side.
2. Select `Generate/Import`.
3. Enter the name for the new key.
4. Select `Create`. The default options should create an RSA 2048 key.
5. Copy the key name you created.
6. You can sign out of the Admin Workstation.

### Create a user-assigned managed identity
[Create a user-assigned managed identity](./create-user-managed-identity.md) in the `HostedResources` resource group for the enclave.

### CMK Template
```
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.5.6.12127",
      "templateHash": "16023511331197397029"
    }
  },
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The resource group location into which the resources should be deployed."
      }
    },
    "tenantId": {
      "type": "string",
      "defaultValue": "[subscription().tenantId]",
      "metadata": {
        "description": "The Tenant Id that should be used throughout the deployment."
      }
    },
    "userAssignedIdentityName": {
      "type": "string",
      "defaultValue": "user-id-1",
      "metadata": {
        "description": "The name of the managed identity resource."
      }
    },
    "userAssignedIdentityResourceGroupName": {
      "type": "string",
      "defaultValue": "resourceGroup().name",
      "metadata": {
        "description": "The Azure resource group where the managed identity should be created."
      }
    },
    "keyVaultName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Key Vault the new Key will be created in."
      }
    },
    "keyVaultKeyName": {
      "type": "string",
      "defaultValue": "cmk-key",
      "metadata": {
        "description": "Name of the new key in the Key Vault"
      }
    },
    "keyExpiration": {
      "type": "int",
      "defaultValue": "[dateTimeToEpoch(dateTimeAdd(utcNow(), 'P1Y'))]",
      "metadata": {
        "description": "Expiration time of the key"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2018-11-30",
      "name": "[parameters('userAssignedIdentityName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2021-10-01",
      "name": "[parameters('keyVaultName')]",
      "location": "[parameters('location')]",
      "properties": {
        "sku": {
          "name": "standard",
          "family": "A"
        },
        "tenantId": "[parameters('tenantId')]",
        "accessPolicies": [
            {
                "tenantId": "[parameters('tenantId')]",
                "permissions": {
                "keys": [
                    "unwrapKey",
                    "wrapKey",
                    "get"
                ]
                },
                "objectId": "[reference(extensionResourceId(format('/subscriptions/{0}/resourceGroups/{1}', subscription().subscriptionId, resourceGroup().name), 'Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName')), '2018-11-30').principalId]"
            }
        ]
      }
    },
    {
      "type": "Microsoft.KeyVault/vaults/keys",
      "apiVersion": "2021-10-01",
      "name": "[format('{0}/{1}', parameters('keyVaultName'), parameters('keyVaultKeyName'))]",
      "properties": {
        "attributes": {
          "enabled": true,
          "exp": "[parameters('keyExpiration')]"
        },
        "keySize": 4096,
        "kty": "RSA"
      },
      "dependsOn": [
        "[resourceId('Microsoft.KeyVault/vaults', parameters('keyVaultName'))]"
      ]
    }
  ]
}
```

## Further reading
- [Disk Encryption](/azure/virtual-machines/windows/disk-encryption-overview)
Read More:
- [Generate Keys on Windows](/windows-server/administration/openssh/openssh_keymanagement)
- [Configure Key Vault for Storage Account CMK](../storage/common/customer-managed-keys-configure-new-account.md)
