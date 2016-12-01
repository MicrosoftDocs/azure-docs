---
title: Grant permission to many applications to access a key vault | Microsoft Docs
description: Learn how to grant permission to many applications to access a key vault
services: key-vault
documentationcenter: ''
author: amitbapat
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 46d7bc21-fa79-49e4-8c84-032eef1d813e
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 12/01/2016
ms.author: ambapat

---
# Grant permission to many applications to access a key vault
### Q: I have several (over 16) applications that need to access a key vault. Since Key Vault only allows 16 access control entries, how can I achieve that?
Key Vault access control policy only supports 16 entries. However you can create an Azure Active Directory security groups, add all the associated service principals to this security group and then grant access to this security group to Key Vault.

There are some prerequisites to achieve this.
* Install Azure Active Directory V2 PowerShell module if you haven't already done so. [Follow instructions on this page](https://www.powershellgallery.com/packages/AzureAD/2.0.0.30).
* The user running the following commands needs to have permissions to create/edit groups in the Azure Active Directory tenant. You may need to contact your Azure Active Directory administrator, if you don't have permissions.

For example, if you have key vault 'myvault' in a subscription that has been moved from tenant A to tenant B, here's how to change the tenant ID for this key vault and remove old access policies.

<pre>
# Connect to Azure AD 

Connect-AzureAD 
 
# Create Azure Active Directory Security Group 
$aadGroup = New-AzureADGroup -Description "Contoso App Group" -DisplayName "ContosoAppGroup" -MailEnabled 0 -MailNickName none -SecurityEnabled 1 
 
# Find and add your applications (ServicePrincipal ObjectID) as members to this group 
 
$spn = Get-AzureADServicePrincipal –SearchString "ContosoApp1" 
Add-AzureADGroupMember –ObjectId $aadGroup.ObjectId -RefObjectId $spn.ObjectId 
 
# You can add several members to this group, in this fashion. 
 
# Set the Key Vault ACLs 
 
Set-AzureRmKeyVaultAccessPolicy –VaultName ContosoVault –ObjectId $aadGroup.ObjectId -PermissionToKeys all –PermissionToSecrets all –PermissionToCertificates all 
 
# Of course you can adjust the permissions as required 
</pre>

If you need to grant different set of permissions to a group of applications, create a separate Azure Active Directory security group for such applications.

## Next steps
Learn more about how to [Secure your key vault](key-vault-secure-your-key-vault.md).
