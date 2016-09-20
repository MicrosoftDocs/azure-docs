<properties
	pageTitle="Key Vault Authentication and Authorization | Microsoft Azure"
	description="Manage access permissions for Key Vault for managing vaults and keys and secrets. Authentication and authorization model for Key Vault and best practices."
	services="key-vault"
	documentationCenter=""
	authors="cabailey"
	manager="mbaldwin"
	tags="azure-resource-manager"/>

<tags
	ms.service="key-vault"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="authentication-and-authorization"
	ms.date="09/23/2016"
	ms.author="ambapat"/>



# Key Vault authentication and authorization model

This article covers following topics:
- Accessing Key Vault via data plane and control plane
- Two separate levels for access permissions
 - control plane permissions via Azure Resource Manager (RBAC)
 - data plane permissions via Key Vault access policies
- Key Vault authentication using Azure Active Directory
- Best practices
- Next Steps

## Data plane and control plane

When you create a key vault, you get a virtual container inside which you can create other objects like keys and secrets.


Key Vault is an Azure service available via Azure Resource Manager deployment model. Access to Key Vault is controlled through two separate interfaces, **management plane** -- accessed through Azure Resource Manager endpoint (for example, https://management.azure.com), and **data plane** -- accessed through Key Vault endpoint (for example, for your vault named 'myvault', https://myvault.vault.azure.net). Through control plane you can create/read/update/delete key vaults, and also set access policies for the vault. Through data plane you can manage objects in a key vault (such as keys and secrets), such as create/read/update/delete keys and secrets, and also perform cryptographic operations such as sign/verify/encrypt/decrypt etc. As there are two separate interfaces to access Key Vault, there are also two separate permissions required to access Key Vault.

| Access plane | Access endpoints | Access permissions |
|--------------|------------------|--------------------|
| Management plane|**Global:**<br> management.azure.com:443<br><br> **Azure China:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 | Create/Read/Update/Delete Key Vault <br> Set access policies for Key Vault<br>Set tags for Key Vault |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 | Permissions for Keys: Decrypt, Encrypt, UnwrapKey, WrapKey, Verify, Sign, Get, List, Update, Create, Import, Delete, Backup, Restore<br><br> Permissions for Secrets: Get, List, Set, Delete |

## Setting Key Vault permissions

Since key vault stores very sensitive information like encryption keys or application secrets (for example, SQL connection strings, storage keys), you would want to tightly control access to your key vaults
Access permissions for Key Vault control plane are set using Azure Resource Manage Role Based Access Control.

Access permissions for Key Vault data plane are set using Key Vault access policies.






## Key Vault authentication using Azure Active Directory

Authentication models - users, applications, native client applications, web applications on behalf of users

## Key Vault authorization model

Key Vault access policies

## Best practices

An example that illustrates separation of duties, 3 roles: Key Vault owner, developers/operators and auditors.


## Next Steps

For a getting started tutorial for an administrator, see [Get Started with Azure Key Vault](key-vault-get-started.md).

For more information about usage logging for Key Vault, see [Azure Key Vault Logging](key-vault-logging.md).

For more information about using keys and secrets with Azure Key Vault, see [About Keys and Secrets](https://msdn.microsoft.com/library/azure/dn903623.aspx).

If you have questions about Key Vault, visit the [Azure Key Vault Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureKeyVault)
