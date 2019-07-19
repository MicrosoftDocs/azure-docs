---
title: Grant permission to many applications to access an Azure key vault - Azure Key Vault | Microsoft Docs
description: Learn how to grant permission to many applications to access a key vault
services: key-vault
author: amitbapat
manager: barbkess
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 01/07/2019
ms.author: ambapat

---
# Grant several applications access to a key vault

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Access control policy can be used to grant several applications access to a key vault. An access control policy can support up to 1024 applications, and is configured as follows:

1. Create an Azure Active Directory security group. 
2. Add all of the applications' associated service principals to the security group.
3. Grant the security group access to your Key Vault.

## Prerequisites

Here are the prerequisites:
* [Install Azure PowerShell](/powershell/azure/overview).
* [Install the Azure Active Directory V2 PowerShell module](https://www.powershellgallery.com/packages/AzureAD).
* Permissions to create/edit groups in the Azure Active Directory tenant. If you don't have permissions, you may need to contact your Azure Active Directory administrator. See [About Azure Key Vault keys, secrets and certificates](about-keys-secrets-and-certificates.md) for details on Key Vault access policy permissions.

## Granting Key Vault access to applications

Run the following commands in PowerShell:

```powershell
# Connect to Azure AD 
Connect-AzureAD 
 
# Create Azure Active Directory Security Group 
$aadGroup = New-AzureADGroup -Description "Contoso App Group" -DisplayName "ContosoAppGroup" -MailEnabled 0 -MailNickName none -SecurityEnabled 1 
 
# Find and add your applications (ServicePrincipal ObjectID) as members to this group 
$spn = Get-AzureADServicePrincipal –SearchString "ContosoApp1" 
Add-AzureADGroupMember –ObjectId $aadGroup.ObjectId -RefObjectId $spn.ObjectId 
 
# You can add several members to this group, in this fashion. 
 
# Set the Key Vault ACLs 
Set-AzKeyVaultAccessPolicy –VaultName ContosoVault –ObjectId $aadGroup.ObjectId `
-PermissionsToKeys decrypt,encrypt,unwrapKey,wrapKey,verify,sign,get,list,update,create,import,delete,backup,restore,recover,purge `
–PermissionsToSecrets get,list,set,delete,backup,restore,recover,purge `
–PermissionsToCertificates get,list,delete,create,import,update,managecontacts,getissuers,listissuers,setissuers,deleteissuers,manageissuers,recover,purge,backup,restore `
-PermissionsToStorage get,list,delete,set,update,regeneratekey,getsas,listsas,deletesas,setsas,recover,backup,restore,purge 
 
# Of course you can adjust the permissions as required 
```

If you need to grant a different set of permissions to a group of applications, create a separate Azure Active Directory security group for such applications.

## Next steps

Learn more about how to [Secure your key vault](key-vault-secure-your-key-vault.md).
