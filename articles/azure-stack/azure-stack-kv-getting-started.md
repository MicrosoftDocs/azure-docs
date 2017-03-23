---
title: Getting started with Key Vault in Azure Stack | Microsoft Docs
description: Get started using Azure Stack Key Vault
services: azure-stack
documentationcenter: ''
author: rlfmendes
manager: natmack
editor: ''

ms.assetid: b973be33-2fc1-4ee6-976a-84ed270e7254
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 01/23/2017
ms.author: ricardom

---
# Getting started with Key Vault
This section describes the steps to create a vault, manage keys and secrets as well as authorize users or applications to invoke operations in the vault in Azure Stack. The following steps assume a tenant subscription exists and KeyVault service is registered within that subscription. All the example commands are based on the KeyVault cmdlets available as part of the Azure PowerShell SDK.

## Enabling the tenant subscription for Vault operations
Before you can issue operations against any vault, you need to ensure that your subscription is enabled for vault operations. You can confirm that by issuing the following PowerShell command:

    Get-AzureRmResourceProvider -ProviderNamespace Microsoft.KeyVault | ft -AutoSize

The output of the above command should report “Registered” for the “Registration” state of every row.

    ProviderNamespace RegistrationState ResourceTypes Locations
    Microsoft.KeyVault Registered {operations} {local}
    Microsoft.KeyVault Registered {vaults} {local}
    Microsoft.KeyVault Registered {vaults/secrets} {local}


 If that’s not the case, you should
invoke the following command to register the KeyVault service within
your subscription:

    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.KeyVault

And the folowing is the output of the command:

    ProviderNamespace : Microsoft.KeyVault
    RegistrationState : Registered
    ResourceTypes : {operations, vaults, vaults/secrets}
    Locations : {local}


> [!NOTE]
> If you get the error: "*The subscription is not registered with Azure Key Vault*" when invoking KeyVault cmdlets, please confirm you have enabled the KeyVault resource provider per instructions above.
> 
> 

## Creating a hardened container (a vault) in Azure Stack to store and manage cryptographic keys and secrets
In order to create a Vault, a tenant should first create a resource group. The following PowerShell commands create a resource group and then a Vault in that Resource Group. The example also includes the typical output from that cmdlet.

### Creating a resource group:
    New-AzureRmResourceGroup -Name vaultrg010 -Location local -Verbose -Force

Output:

    VERBOSE: Performing the operation "Replacing resource group ..." on target "".
    VERBOSE: 12:52:51 PM - Created resource group 'vaultrg010' in location 'local'
    ResourceGroupName : vaultrg010
    Location : local
    ProvisioningState : Succeeded
    Tags :
    ResourceId : /subscriptions/fa881715-3802-42cc-a54e-a06adf61584d/resourceGroups/vaultrg010


### Creating a vault:
    New-AzureRmKeyVault -VaultName vault010 -ResourceGroupName vaultrg010 -Location local -Verbose

Output:

    VaultUri : https://vault010.vault.local.azurestack.global
    TenantId : 5454420b-2e38-4b9e-8b56-1712d321cf33
    TenantName : 5454420b-2e38-4b9e-8b56-1712d321cf33
    Sku : Standard
    EnabledForDeployment : False
    EnabledForTemplateDeployment : False
    EnabledForDiskEncryption : False
    AccessPolicies : {5454420b-2e38-4b9e-8b56-1712d321cf33}
    AccessPoliciesText :
    Tenant ID : 5454420b-2e38-4b9e-8b56-1712d321cf33
    Object ID : ca342e90-f6aa-435b-a11c-dfe5ef0bfeeb
    Application ID :
    Display Name : Tenant Admin (tenantadmin1@msazurestack.onmicrosoft.com)
    Permissions to Keys : get, create, delete, list, update, import, backup, restore
    Permissions to Secrets : all
    OriginalVault : Microsoft.Azure.Management.KeyVault.Vault
    ResourceId : /subscriptions/fa881715-3802-42cc-a54e-a06adf61584d/resourceGroups/vaultrg010/providers/Microsoft.KeyVault/vaults/vault010
    VaultName : vault010
    ResourceGroupName : vaultrg010
    Location : local
    Tags : {}
    TagsTable :

The output of this cmdlet shows properties of the key vault that you’ve just created. The two most important properties are:

* **Vault Name**: In the example, this is **vault010**. You will use this name for other Key Vault cmdlets.
* **Vault URI**: In the example, this is https://vault010.vault.local.azurestack.global. Applications that use your vault through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this key vault. As yet, nobody else is.

## Operating on Keys and Secrets
After creating a vault, follow the below steps to create manage keys and secrets:

### Creating a key
In order to create a key, use the **Add-AzureKeyVaultKey** per the example below. After successful key creation, the cmdlet will output the newly created key details.

    Add-AzureKeyVaultKey -VaultName \$vaultName -Name\$keyVaultKeyName -Verbose -Destination Software

The following is the output of the *Add-AzureKeyVaultKey* cmdlet:

    Attributes : Microsoft.Azure.Commands.KeyVault.Models.KeyAttributes
    Key : {"kid":"https://vault010.vault.local.azurestack.global/keys/keyVaultKeyName001/86062b02b10342688f3b0b3713e343ff","kty":"RSA","key\_ops":\["encrypt"
    ,"decrypt","sign","verify","wrapKey","unwrapKey"\],"n":"nDkcBQCyyLnXtbwFMnXOWzPDqWKiyjf0G3QTxvuN\_MansEn9X-91q4\_WFmRBCd5zWBqz671iuZO\_D4r0P25
    Fe2lAq\_3T1gATVNGR7LTEU9W5h8AoY10bmt4e0y66Jn2vUV-UTCz4\_vtKSKoiuNXHFR\_tGZ-6YX-frqKIiC8pbE4Qvz1x-c7E-eM\_Cpu87koL95n-Hl3wQRQRPXEPRR6gcHR5E74D1
    gLEFCWKySTo4nXtLoeBMNK5QYEBZIAS61ACbR4czjHn6ty-tZeVTc7hyK\_UO2EbJovQIAhyayfq018uNtCBzjjkqJKnY34kviVCPoTQqOdpHa0FHrloe5FeIw","e":"AQAB"}
    VaultName : vault010
    Name : keyVaultKeyName001
    Version : 86062b02b10342688f3b0b3713e343ff
    Id : https://vault010.vault.local.azurestack.global:443/keys/keyVaultKeyName001/86062b02b10342688f3b0b3713e343ff

You can now reference this key that you created or uploaded to Azure Key Vault, by using its URI. Use **https://vault010.vault.local.azurestack.global:443/keys/keyVaultKeyName001**
to always get the current version; and use **https://vault010.vault.local.azurestack.global:443/keys/keyVaultKeyName001/86062b02b10342688f3b0b3713e343ff** to get this specific version.

### Retrieving a key
Use the **Get-AzureKeyVaultKey** to retrieve a key and its details per the following example:

    Get-AzureKeyVaultKey -VaultName vault010 -Name keyVaultKeyName001

The following is the output of Get-AzureKeyVaultKey

    Attributes : Microsoft.Azure.Commands.KeyVault.Models.KeyAttributes
    Key : {"kid":"https://vault010.vault.local.azurestack.global/keys/keyVaultKeyName001/86062b02b10342688f3b0b3713e343ff","kty":"RSA","key\_ops":\["encrypt"
    ,"decrypt","sign","verify","wrapKey","unwrapKey"\],"n":"nDkcBQCyyLnXtbwFMnXOWzPDqWKiyjf0G3QTxvuN\_MansEn9X-91q4\_WFmRBCd5zWBqz671iuZO\_D4r0P25
    Fe2lAq\_3T1gATVNGR7LTEU9W5h8AoY10bmt4e0y66Jn2vUV-UTCz4\_vtKSKoiuNXHFR\_tGZ-6YX-frqKIiC8pbE4Qvz1x-c7E-eM\_Cpu87koL95n-Hl3wQRQRPXEPRR6gcHR5E74D1
    gLEFCWKySTo4nXtLoeBMNK5QYEBZIAS61ACbR4czjHn6ty-tZeVTc7hyK\_UO2EbJovQIAhyayfq018uNtCBzjjkqJKnY34kviVCPoTQqOdpHa0FHrloe5FeIw","e":"AQAB"}
    VaultName : vault010
    Name : keyVaultKeyName001
    Version : 86062b02b10342688f3b0b3713e343ff
    Id : https://vault010.vault.local.azurestack.global:443/keys/keyVaultKeyName001/86062b02b10342688f3b0b3713e343ff

### Setting a secret
    $secretvalue = ConvertTo-SecureString 'User@123' -AsPlainText -Force
    Set-AzureKeyVaultSecret -Name MySecret-VaultName vault010 -SecretValue $secretvalue

Output

    Vault Name : vault010
    Name : MySecret
    Version : 65a387f2ed4a416180e852b970846f5b
    Id : https://vault010.vault.local.azurestack.global:443/secrets/MySecret/65a387f2ed4a416180e852b970846f5b
    Enabled : True
    Expires :
    Not Before :
    Created : 8/17/2016 10:49:52 PM
    Updated : 8/17/2016 10:49:52 PM
    Content Type :
    Tags : 

### Retrieving a secret
    Get-AzureKeyVaultSecret -VaultName vault010

Output

    Vault Name : vault010
    Name : MySecret
    Version :
    Id : https://vault010.vault.local.azurestack.global:443/secrets/MySecret
    Enabled : True
    Expires :
    Not Before :
    Created : 8/17/2016 10:49:52 PM
    Updated : 8/17/2016 10:49:52 PM
    Content Type :
    Tags :

Now, your key vault and key or secret is ready for applications to use.
You must authorize applications to use them.

## Authorize the application to use the key or secret
To authorize the application to access the key or secret in the vault, use the Set-**AzureRmKeyVaultAccessPolicy** cmdlet.

For example, if your vault name is *ContosoKeyVault* and the application you want to authorize has a *Client ID* of *8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed*, and you want to authorize the application to decrypt and sign with keys in your vault, run the following:

    Set-AzureRmKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ServicePrincipalName 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed -PermissionsToKeys decrypt,sign

If you want to authorize that same application to read secrets in your vault, run the following:

    Set-AzureRmKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ServicePrincipalName 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed -PermissionsToSecrets Get


## Next steps
[Deploy a VM with a Key Vault password](azure-stack-kv-deploy-vm-with-secret.md)

[Deploy a VM with a Key Vault certificate](azure-stack-kv-push-secret-into-vm.md)

