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



# Overview

Azure Key Vault is a cloud service that safeguards encryption keys and secrets (such as certificates, connection strings, passwords etc.) for your cloud applications. Since this data is sensitive and business critical, you want to secure access to your key vaults so that only authorized applications and users will get access to your key vault. This article will provide an overview of Key Vault access model, how to secure access to Key Vault and recommended best practices for setting up and using Key Vault for your cloud applications.

# Management plane and data plane

Key Vault is an Azure service available via Azure Resource Manager deployment model. When you create a key vault, you get a virtual container inside which you can create other objects like keys and secrets. Access to Key Vault is controlled through two separate interfaces: **management plane** and **data plane**. Management plane interface is used to manage your key vault, such as creating, deleting, updating your key vault and also setting access policies for data plane. Data plane interface is used to access and use the keys and secrets stored in your key vault.

The management plane and data plane interfaces are accessed through different endpoints (see table). The second column in the table describes the DNS names for these endpoints in different Azure environments, the third column describes the operations you can perform from each access plane. Each access plane also has its own access control mechanism: for management plane access control is set using Azure Resource Manager Role-Based Access Control (RBAC), while for data plane access control is set using Key Vault Access Policy.

| Access plane | Access endpoints | Access permissions |
|--------------|------------------|--------------------|
| Management plane|**Global:**<br> management.azure.com:443<br><br> **Azure China:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 | Create/Read/Update/Delete Key Vault <br> Set access policies for Key Vault<br>Set tags for Key Vault<br><br> Access control using Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 | Permissions for Keys: Decrypt, Encrypt, UnwrapKey, WrapKey, Verify, Sign, Get, List, Update, Create, Import, Delete, Backup, Restore<br><br> Permissions for Secrets: Get, List, Set, Delete <br><br>Access control using Key Vault Access Policy|

The management plane and data plane access control work independently. For example, if you want to grant an application access to use keys in a key vault, you only need to grant data plane access permissions using Key Vault access policies and no management plane access is needed for this application. And conversely, if you want a user to be able to read vault properties and tags, but not have any access to keys or secrets, you can grant this user, 'read' access using RBAC and no access to data plane is required.

# Management plane access control

The management plane consists of operations that affect the key vault itself. For example, you can create or delete a key vault, get a list of vaults in a subscription, retrieve key vault properties (such as SKU, tags) and also set key vault access policies that control the users and applications that can access keys and secrets in the key vault. Management plane access control uses RBAC.

## Role-based Access Control (RBAC)
Each Azure subscription has an Azure Active Directory. Users, groups and applications from this directory can be granted access to manage resources in the Azure subscription that use the Azure Resource Manager deployment model. This is referred to as Role-Based Access Control (RBAC). To manage this access, you can use the [Azure portal](https://portal.azure.com/), the [Azure CLI tools](../xplat-cli-install.md), [PowerShell](../powershell-install-configure.md), or the [Key Vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx).

With the Azure Resource Manager model, you create your key vault in a resource group and control access to the management plane of this key vault by using Azure Active Directory. For example, you can give specific users ability to set key vault access policy, while other users can only view and list key vaults in this resource group, but not change key vault access policy.

You can grant access to users, groups and applications at a specific scope by assigning appropriate RBAC roles. For example, to grant access to a user to manage key vaults you would assign a predefined role 'Key Vault Contributor' to this user at a specific scope. The scope in this case would be either a subscription, a resource group or just a specific key vault. A role assigned at subscription level will apply to all resource groups and resources within that subscription. A role assigned at resource group level will apply to all resources in that resource group. A role assigned for a specific resource will only apply to that resource. There are several predefined roles (see [RBAC: Built-in roles](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-built-in-roles/)), and you can also define your own roles if the predefined roles do not fit your needs.

# Data plane access control

The data plane consists of operations that affects the objects inside (such as keys, secrets and certificates) a key vault. This includes key operations such as create, import, update, list, backup and restore keys; cryptographic operations such as sign, verify, encrypt, decrypt, wrap and unwrap; and also set tags and other attributes for keys. Similarly for secrets it includes, get, set, list, delete.

Data plane access is granted by setting access policies for a key vault. A user, group or application must have 

## Key Vault Access Policies

Key Vault access policies grant permissions to keys, secrets and certificates separately. This means you can give a user access to only keys, but no permissions for secrets for example. However permissions to access keys or secrets or certificates are at the vault level. In other words, Key Vault access policy does not support object level permissions. For example, if a user has permission to perform a backup operation for a key vault, she can perform backup operation for **any** key in that key vault.



# Key Vault authentication using Azure Active Directory

Authentication models - users, applications, native client applications, web applications on behalf of users

# Best practices

An example that illustrates separation of duties, 3 roles: Key Vault owner, developers/operators and auditors.

# Example



# Resources

-   [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-configure.md)

    This article explains the Azure Active Directory Role-based Access Control and how it works.

-   [RBAC: Built in Roles](../active-directory/role-based-access-built-in-roles.md)

    This article details all of the built-in roles available in RBAC.

-   [Understanding Resource Manager deployment and classic deployment](../resource-manager-deployment-model.md)

    This article explains the Resource Manager deployment and classic deployment models, and explains the benefits of using the Resource Manager and resource groups

-   [Managing Role-Based Access Control with the REST API](../active-directory/role-based-access-control-manage-access-rest.md)

	This article shows how to use the REST API to manage RBAC.

-   [Key Vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx)

	This is the reference for the REST APIs to manage your key vault programmatically.

-   [Developer’s guide to auth with Azure Resource Manager API](http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/)

	This article shows how to authenticate using the Resource Manager APIs.

-   [Role-Based Access Control for Microsoft Azure from Ignite](https://channel9.msdn.com/events/Ignite/2015/BRK2707)

    This is a link to a video on Channel 9 from the 2015 MS Ignite conference. In this session, they talk about access management and reporting capabilities in Azure, and explore best practices around securing access to Azure subscriptions using Azure Active Directory.

-   [Key access control](https://msdn.microsoft.com/en-us/library/azure/dn903623.aspx#BKMK_KeyAccessControl)

    Link to Key access control reference documentation.

-   [Secret access control](https://msdn.microsoft.com/en-us/library/azure/dn903623.aspx#BKMK_SecretAccessControl)

    Link to Key access control reference documentation.

# Next Steps

For a getting started tutorial for an administrator, see [Get Started with Azure Key Vault](key-vault-get-started.md).

For more information about usage logging for Key Vault, see [Azure Key Vault Logging](key-vault-logging.md).

For more information about using keys and secrets with Azure Key Vault, see [About Keys and Secrets](https://msdn.microsoft.com/library/azure/dn903623.aspx).

If you have questions about Key Vault, visit the [Azure Key Vault Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureKeyVault)
