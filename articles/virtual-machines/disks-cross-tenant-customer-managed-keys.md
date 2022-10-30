---
title: Use a disk encryption set across Azure AD tenants (preview)
description: Learn how to use customer-managed keys with your Azure disks in different Azure AD tenants.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 10/26/2022
ms.author: rogarana
ms.subservice: disks
---

# Encrypt managed disks with cross-tenant customer-managed keys (preview)

> [!IMPORTANT]
> Cross-tenant encryption with customer-managed keys (CMK) is currently in public preview.
> This preview version is provided without a service level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article covers building a solution where you encrypt managed disks with customer-managed keys using Azure Key Vaults stored in a different Azure Active Directory (Azure AD) tenant. This configuration can be ideal for several scenarios, one example being Azure support for service providers that want to offer bring-your-own encryption keys to their customers where resources from the service provider's tenant are encrypted with keys from their customer's tenant.

A disk encryption set with federated identity in a cross-tenant CMK workflow spans service provider/ISV tenant resources (disk encryption set, managed identities, and app registrations) and customer tenant resources (enterprise apps, user role assignments, and key vault). In this case, the source Azure resource is the service provider's disk encryption set.

If you have questions about cross-tenant customer-managed keys with managed disks, email <crosstenantcmkvteam@service.microsoft.com>.

## Prerequisites
- Install the latest [Azure PowerShell module](/powershell/azure/install-az-ps).
- You must enable the preview on your subscription. Use the following command to enable the preview:
    ```azurepowershell
    Register-AzProviderFeature -FeatureName "EncryptionAtRestWithCrossTenantKey" -ProviderNamespace "Microsoft.Compute"
    ```

    It may take some time for the feature registration to complete. You can confirm if it has with the following command:
    
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "EncryptionAtRestWithCrossTenantKey" -ProviderNamespace "Microsoft.Compute"
    ```

## Limitations

- Currently this feature is only available in the Central US, North Central US, West US, West Central US, East US, East US 2, and North Europe regions.
- Managed Disks and the customer's Key Vault must be in the same Azure region, but they can be in different subscriptions.
- This feature doesn't support Ultra Disks or Azure Premium SSD v2 managed disks.

[!INCLUDE [active-directory-msi-cross-tenant-cmk-overview](../../includes/active-directory-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault](../../includes/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

## Create a disk encryption set

Now that you've created your Azure Key Vault and performed the required Azure AD configurations, deploy a disk encryption set configured to work across tenants and associate it with a key in the key vault. You can do this using an ARM template, REST API, Azure PowerShell, or Azure CLI.

# [ARM/REST](#tab/azure-portal)

Use an ARM template or REST API.

### ARM

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "desname": {
      "defaultValue": "<Enter ISV disk encryption set name>",
      "type": "String"
    },
    "region": {
      "defaultValue": "WestCentralUS",
      "type": "String"
    },
    "userassignedmicmk": {
      "defaultValue": "/subscriptions/<Enter ISV Subscription Id>/resourceGroups/<Enter ISV resource group name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<Enter ISV User Assigned Identity Name>",
      "type": "String"
    },
    "cmkfederatedclientId": {
      "defaultValue": "<Enter ISV Multi-Tenant App Id>",
      "type": "String"
    },
    "keyVaultURL": {
      "defaultValue": "<Enter Client Key URL>",
      "type": "String"
    },
    "encryptionType": {
      "defaultValue": "EncryptionAtRestWithCustomerKey",
      "type": "String"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Compute/diskEncryptionSets",
      "apiVersion": "2021-12-01",
      "name": "[parameters('desname')]",
      "location": "[parameters('region')]",
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
          "[parameters('userassignedmicmk')]": {}
        }
      },
      "properties": {
        "activeKey": {
          "keyUrl": "[parameters('keyVaultURL')]"
        },
        "federatedClientId": "[parameters('cmkfederatedclientId')]",
        "encryptionType": "[parameters('encryptionType')]"
      }
    }
  ]
}
```

### REST API

Use bearer token as authorization header and application/JSON as content type in BODY. (Network tab, filter to management.azure while performing any ARM request on portal.)

```rest
PUT https://management.azure.com/subscriptions/<Enter ISV Subscription Id>/resourceGroups/<Enter ISV Resource Group Name>/providers/Microsoft.Compute/diskEncryptionSets/<Enter ISV Disk Encryption Set Name>?api-version=2021-12-01
Authorization: Bearer ...
Content-Type: application/json

{
  "name": "<Enter ISV disk encryption set name>",
  "id": "/subscriptions/<Enter ISV Subscription Id>/resourceGroups/<Enter ISV resource group name>/providers/Microsoft.Compute/diskEncryptionSets/<Enter ISV disk encryption set name>/",
  "type": "Microsoft.Compute/diskEncryptionSets",
  "location": "westcentralus",
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
"/subscriptions/<Enter ISV Subscription Id>/resourceGroups/<Enter ISV resource group name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<Enter ISV User Assigned Identity Name>
": {}
    }
  },
  "properties": {
    "activeKey": {
      "keyUrl": "<Enter Client Key URL>"
    },
    "encryptionType": "EncryptionAtRestWithCustomerKey",
    "federatedClientId": "<Enter ISV Multi-Tenant App Id>"
  }
}
```

# [PowerShell](#tab/azure-powershell)

To use Azure PowerShell, install the latest Az module or the Az.Storage module. For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/install-Az-ps).

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

In the script below, `-FederatedClientId` should be the application ID (client ID) of the multi-tenant application. You'll also need to provide the subscription ID, resource group name, and identity name.

```azurepowershell-interactive
$userAssignedIdentities = @{"/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identityName" = @{}};

$config = New-AzDiskEncryptionSetConfig `
   -Location 'westcentralus' `
   -KeyUrl "https://vault1.vault.azure.net:443/keys/key1/mykey" `
   -IdentityType 'UserAssigned' `
   -RotationToLatestKeyVersionEnabled $True `
   -UserAssignedIdentity $userAssignedIdentities `
   -FederatedClientId "00000000-0000-0000-0000-000000000000" `
   $config `
   | New-AzDiskEncryptionSet -ResourceGroupName 'rg1' -Name 'enc1'
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

In the command below, `myAssignedId` should be the resource ID of the user-assigned managed identity that you created earlier, and `myFederatedClientId` should be the application ID (client ID) of the multi-tenant application.

```azurecli-interactive
az disk-encryption-set create --resource-group MyResourceGroup --name MyDiskEncryptionSet --key-url MyKey --mi-user-assigned myAssignedId --federated-client-id myFederatedClientId --location westcentralus
```

---

## Next steps

See also:

- [Encrypt disks using customer-managed keys in Azure DevTest Labs](../devtest-labs/encrypt-disks-customer-managed-keys.md)
- [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](disks-enable-customer-managed-keys-portal.md)
