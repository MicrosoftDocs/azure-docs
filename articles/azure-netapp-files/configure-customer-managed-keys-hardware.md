---
title: Configure customer-managed keys with Hardware Security Module for Azure NetApp Files volume encryption 
description: Learn how to encrypt data in Azure NetApp Files with customer-managed keys using the Hardware Security Module
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.custom: references_regions
ms.date: 08/09/2023
ms.author: anfdocs
---
# Configure customer-managed keys with Hardware Security Module for Azure NetApp Files volume encryption 


Azure NetApp Files volume encryption with customer-managed keys (CMK) with the managed Hardware Security Module (HSM) is an extension to [customer-managed keys for Azure NetApp Files volumes encryption feature](configure-customer-managed-keys.md). CMK with HSM allows you to store your encryptions keys in a more secure FIPS 140-2 level three HSM instead of the FIPS 140-2 Level 1 or 2 service used by Azure Key Vault (AKV).

## Considerations

* CMK with managed HSM is supported using the 2022.11 or later API version.
* CMK with managed HSM is only supported for Azure NetApp Files accounts that do not have existing encryption. 

## Requirements 

<!-- change link -->
> [!IMPORTANT]
> Customer-managed keys for Azure NetApp Files volume encryption is currently in preview. You need to submit a waitlist request for accessing the feature through the **[Customer-managed keys for Azure NetApp Files volume encryption](https://aka.ms/anfcmkpreviewsignup)** page. Customer-managed keys feature is expected to be enabled within a week after you submit the waitlist request. You can check the status of feature registration by using the following command:
>
> ```azurepowershell-interactive
> Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFManagedHsmEncryption
>
> FeatureName                ProviderName     RegistrationState
> -----------                ------------     -----------------
> ANFManagedHsmEncryption Microsoft.NetApp Registered
> ```

Before creating a CMK with managed HSM volume, you must have: 

* created a VNet with a subnet delegated to Microsoft.Netapp/volumes.
* a user or system-assigned identity for your Azure NetApp Files account. 
* [provisioned and activted a managed HSM.](../key-vault/managed-hsm/quick-create-cli.md)

VNet with a subnet delegated to Microsoft.Netapp/volumes.

## Supported regions
<!-- ? -->

## Create a CMK volume with managed HSM account

1. Grant yourself permission to create keys in HSM. 

```azurepowershell-interactive
az keyvault role assignment create --hsm-name <hsm name> --role 'Managed HSM Crypto User' --assignee <user principal name> --scope /keys
```

1. Create the HSM key. Azure NetApp Files supports key lengths of 2048 or greater. 

```azurepowershell-interactive
az keyvault key create --hsm-name <hsm name> --name <key name> --ops encrypt decrypt --kty RSA-HSM --size 4096
```

1. Create a new subnet in the Azure NetApp Files account’s VNet.
```azurepowershell-interactive
az network vnet subnet create --vnet-name <vnet name> -g <resource group name> --name <subnet name> --address-prefixes <address prefix>
```

1. Create a new private endpoint.
```azurepowershell-interactive
az network private-endpoint create --name <private endpoint name> -g <resource group name> 
--location <location> --vnet-name <vnet name> --subnet <subnet’s name> --private-connection-resource-id <hsm resource id> --group-id 'managedhsm' --connection-name <private link name>
```

1. Authorize the HSM permissions on your Azure NetApp Files account. The role must be authorized to read, encrypt, and decrypt keys. You can use a pre-defined role or a custom role.  
```azurepowershell-interactive
az keyvault role assignment create --hsm-name <hsm name> --role 'Managed HSM Crypto User' --assignee <user principal name> --scope /keys
```

1. Update the Azure NetApp Files account with the HSM key information.
    * If if the account authorization is managed with a user-assigned identity: 
    ```azurepowershell-interactive
    az netappfiles account update --name <Azure NetApp Files account name> -g <resource_group name> --user-assigned-identity <managed identity resource id> --key-source Microsoft.Keyvault --key-vault-resource-id <hsm resource id> --key-vault-uri <hsm uri> --key-name <key name>
    ```
    * If if the account authorization is managed with a system-assigned identity: 
```azurepowershell-interactive
az rest -m patch -u https://management.azure.com/<account-resource-id>?apiversion=
2022-11-01 -b 
"{'properties': {
    'encryption': {
            'keySource': 'Microsoft.KeyVault',
            'keyVaultProperties': {
            'keyVaultUri': '<hsm’s uri>',
            'keyName': '<key name>',
            'keyVaultResourceId': '<hsm’s resource id>'
        }
    }
}
```