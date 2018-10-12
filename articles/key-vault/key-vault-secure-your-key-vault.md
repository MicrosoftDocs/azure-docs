---
title: Secure your Azure Key Vault | Microsoft Docs
description: Manage access permissions for key vault for managing Azure Key Vault, keys, and secrets. Authentication and authorization model for key vault and how to secure your key vault.
services: key-vault
documentationcenter: ''
author: amitbapat
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: e5b4e083-4a39-4410-8e3a-2832ad6db405
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: ambapat

---
# Secure your key vault
Azure Key Vault is a cloud service that safeguards encryption keys and secrets (such as certificates, connection strings, passwords). Since this data is sensitive and business critical, access to your key vaults must be secured, allowing only authorized applications and users to obtain access. 

This article provides an overview of the key vault access model. It explains authentication and authorization, and describes how to secure access to key vault.

## Overview
Access to a key vault is controlled through two separate interfaces: management plane and data plane. For both planes, proper authentication and authorization are required before a caller (a user or an application) can get access to key vault. Authentication establishes the identity of the caller, while authorization determines the operations the caller is allowed to perform.

For authentication both management plane and data plane use Azure Active Directory. For authorization, management plane uses role-based access control (RBAC) while data plane uses key vault access policy.

Here is a brief overview of the topics covered:

[Authentication using Azure Active Directory](#authentication-using-azure-active-directory) - This section explains how a caller authenticates with Azure Active Directory to access a key vault via management plane and data plane. 

[Management plane and data plane](#management-plane-and-data-plane) - Management plane and data plane are two access planes used for accessing your key vault. Each access plane supports specific operations. This section describes the access endpoints, operations supported, and access control method used by each plane. 

[Management plane access control](#management-plane-access-control) - In this section we'll look at allowing access to management plane operations using role-based access control.

[Data plane access control](#data-plane-access-control) - This section describes how to use key vault access policy to control data plane access.

[Example](#example) - This example describes how to set up access control for your key vault to allow three different teams (security team, developers/operators, and auditors) to perform specific tasks to develop, manage, and monitor an application in Azure.

## Authentication using Azure Active Directory
When you create a key vault in an Azure subscription, it's automatically associated with the subscription's Azure Active Directory tenant. All callers (users and applications) must be registered in this tenant, and must authenticate to access the key vault. This requirement applies to both management plane and data plane access. In both cases, an application can access key vault in two ways:

* **user+app access** - Used with applications that access key vault on behalf of a signed-in user. Azure PowerShell and Azure portal are examples of this type of access. There are two ways to grant access to users: 
- Grant access to users so they can access key vault from any application.
- Grant a user access to key vault only when they use a specific application (referred to as compound identity).

* **app-only access** - Used with applications that run as daemon services or background jobs. The application's identity is granted access to the key vault.

In both types of applications, the application authenticates with Azure Active Directory using any of the [supported authentication methods](../active-directory/develop/authentication-scenarios.md) and acquires a token. Authentication method used depends on the application type. Then the application uses this token and sends REST API request to key vault. Management plane requests are routed through an Azure Resource Manager endpoint. When accessing data plane, the applications talks directly to a key vault endpoint. See more details on the [whole authentication flow](../active-directory/develop/v1-protocols-oauth-code.md). 

The resource name for which the application requests a token is different depending on whether the application is accessing management plane or data plane. Hence the resource name is either management plane or data plane endpoint described in the table in a later section, depending on the Azure environment.

Having one single mechanism for authentication to both management and data plane has its own benefits:

* Organizations can centrally control access to all key vaults in their organization
* If a user leaves, they instantly lose access to all key vaults in the organization
* Organizations can customize authentication via the options in Azure Active Directory (for example, enabling multi-factor authentication for added security)

## Management plane and data plane
Azure Key Vault is an Azure service available via the Azure Resource Manager deployment model. When you create a key vault, you get a virtual container for storing sensitive objects such as keys, secrets, and certificates. Specific operations are performed on a key vault using management plane and data plane interfaces. The management plane is used to manage key vault itself. This includes operations such as managing attributes and setting data plane access policies. The data plane interface is used to add, delete, modify, and use the keys, secrets, and certificates stored in  key vault.

The management plane and data plane interfaces are accessed through the different endpoints listed below. The second column describes the DNS names for these endpoints in different Azure environments. The third column describes the operations you can perform from each access plane. Each access plane also has its own access control mechanism. Management plane access control is set using Azure Resource Manager Role-Based Access Control (RBAC). Data plane access control is set using key vault access policy.

| Access plane | Access endpoints | Operations | Access control mechanism |
| --- | --- | --- | --- |
| Management plane |**Global:**<br> management.azure.com:443<br><br> **Azure China 21Vianet:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 |Create/Read/Update/Delete key vault <br> Set access policies for key vault<br>Set tags for key vault |Azure Resource Manager Role-Based Access Control (RBAC) |
| Data plane |**Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China 21Vianet:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 |For Keys: Decrypt, Encrypt, UnwrapKey, WrapKey, Verify, Sign, Get, List, Update, Create, Import, Delete, Backup, Restore<br><br> For secrets: Get, List, Set, Delete |Key vault access policy |

Management plane and data plane access controls work independently. For example, if you want to grant an application access to use keys in a key vault, you only need to grant data plane access. Access is granted through key vault access policies. Conversely, a user that needs to read vault properties and tags, but not access data (keys, secrets, or certificates), only needs control plane access. Access is granted by assigning 'read' access to the user, using RBAC.

## Management plane access control
The management plane consists of operations that affect the key vault itself, such as:

- Creating or deleting a key vault.
- Getting a list of vaults in a subscription.
- Retrieving key vault properties (such as SKU, tags).
- Setting key vault access policies that control user and application access to keys and secrets.

Management plane access control uses RBAC. See the complete list of key vault operations that can be performed via management plane, in the table in preceding section. 

### Role-based Access Control (RBAC)
Each Azure subscription has an Azure Active Directory. Users, groups, and applications from this directory can be granted access to manage resources in the Azure subscription that use the Azure Resource Manager deployment model. This type of access control is referred to as Role-Based Access Control (RBAC). To manage this access, you can use the [Azure portal](https://portal.azure.com/), the [Azure CLI tools](../cli-install-nodejs.md), [PowerShell](/powershell/azureps-cmdlets-docs), or the [Azure Resource Manager REST APIs](https://msdn.microsoft.com/library/azure/dn906885.aspx).

You create a key vault in a resource group and control access to the management plane using Azure Active Directory. For example, you can grant users or a group the ability to manage key vaults in a resource group.

You can grant access to users, groups, and applications at a specific scope by assigning appropriate RBAC roles. For example, to grant access to a user to manage key vaults, you assign a predefined 'Key Vault Contributor' role to this user, at a specific scope. The scope in this case would be either a subscription, a resource group, or a specific key vault. A role assigned at subscription level applies to all resource groups and resources within that subscription. A role assigned at resource group level applies to all resources in that resource group. A role assigned for a specific resource applies to that resource. There are several predefined roles (see [RBAC: Built-in roles](../role-based-access-control/built-in-roles.md)). If a predefined role doesn't fit your needs you can define your own role.

> [!IMPORTANT]
> Note that if a user has Contributor permissions (RBAC) to a key vault management plane, she can grant herself access to data plane, by setting key vault access policy, which controls access to data plane. Therefore, it is recommended to tightly control who has 'Contributor' access to your key vaults to ensure only authorized persons can access and manage your key vaults, keys, secrets, and certificates.
> 
> 

## Data plane access control
Key vault data plane operations apply to stored objects such as keys, secrets, and certificates. Key operations include create, import, update, list, back up, and restore keys. Cryptographic operations include sign, verify, encrypt, decrypt, wrap, unwrap, set tags, and other attributes for keys. Similarly, operations on secrets include get, set, list, delete.

Data plane access is granted by setting access policies for a key vault. A user, group, or an application must have Contributor permissions (RBAC) for management plane for a key vault to be able to set access policies for that key vault. A user, group, or application can be granted access to perform specific operations for keys or secrets in a key vault. Key vault supports up to 1024 access policy entries for a key vault. Create an Azure Active Directory security group and add users to that group to grant data plane access to several users to a key vault.

### Key vault Access Policies
Key vault access policies grant permissions to keys, secrets, and certificates separately. For example, you can give a user access to only keys, and no permissions for secrets. Permissions to access keys or secrets or certificates are at the vault level. Key vault access policy doesn't support granular object level permissions, such as a specific key/secret/certificate. You can use [Azure portal](https://portal.azure.com/), the [Azure CLI tools](../cli-install-nodejs.md), [PowerShell](/powershell/azureps-cmdlets-docs), or the [key vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx) to set access policies for a key vault.

> [!IMPORTANT]
> Note that key vault access policies apply at the vault level. For example, when a user is granted permission to create and delete keys, she can perform those operations on all keys in that key vault.

In addition to access policies, data plane access can also be restricted using [Virtual Network Service Endpoints for Azure Key Vault](key-vault-overview-vnet-service-endpoints.md) by configuring [Firewalls and virtual network rules](key-vault-network-security.md) for an additional layer of security.

## Example
Let's say you're developing an application that uses a certificate for SSL, Azure storage for storing data, and an RSA 2048-bit key for sign operations. Let's say this application is running in an Azure Virtual Machine (or a Virtual Machine Scale Set). You can use a key vault to store all the application secrets, and store the bootstrap certificate used by the application to authenticate with Azure Active Directory.

Here's a summary of the types of keys and secrets stored in a key vault:

* **SSL Cert** - Used for SSL
* **Storage Key** - Used to get access to Storage account
* **RSA 2048-bit key** - Used for sign operations
* **Bootstrap certificate** - Used to authenticate with Azure Active Directory. Once access is granted, you can fetch the storage key and use the RSA key for signing.

Now let's meet the people who are managing, deploying, and auditing this application. We'll use three roles in this example.

* **Security team** - Typically IT staff from the 'office of the CSO (Chief Security Officer)' or equivalent. This team is responsible for the proper safekeeping of secrets. For example, SSL certificates, RSA keys used for signing, connection strings, and storage account keys.
* **Developers/operators** - Folks who develop the application and then deploy it in Azure. Typically, they're not part of the security team, and hence they shouldn't have access to sensitive data, such as SSL certificates and RSA keys. Only the application they deploy should have access to those objects.
* **Auditors** - Usually a different set of people, isolated from developers and general IT staff. Their responsibility is to review use and maintenance of certificates, keys, and secrets to ensure compliance with security standards. 

There's one more role that's outside the scope of this application, but relevant here to be mentioned. That role is the subscription (or resource group) administrator. The subscription administrator sets up initial access permissions for the security team. The subscription administrator grants access to the security team, using a resource group which contains the resources required by this application.

Now let's see what actions each role performs in the context of this application.

* **Security team**
  * Create key vaults
  * Turns on key vault logging
  * Add keys/secrets
  * Create backup of keys for disaster recovery
  * Set key vault access policy to grant permissions to users and applications to perform specific operations
  * Periodically roll keys/secrets
* **Developers/operators**
  * Get references to bootstrap and SSL certs (thumbprints), storage key (secret URI), and signing key (Key URI) from security team
  * Develop and deploy application that accesses keys and secrets programmatically
* **Auditors**
  * Review usage logs to confirm proper key/secret use and compliance with data security standards

Now let's see what access permissions are required for each role and the application, to perform their assigned tasks. 

| User Role | Management plane permissions | Data plane permissions |
| --- | --- | --- |
| Security Team |key vault Contributor |Keys: backup, create, delete, get, import, list, restore <br> Secrets: all |
| Developers/Operator |key vault deploy permission so that the VMs they deploy can fetch secrets from the key vault |None |
| Auditors |None |Keys: list<br>Secrets: list |
| Application |None |Keys: sign<br>Secrets: get |

> [!NOTE]
> Auditors need list permission for keys and secrets so they can inspect attributes for keys and secrets that are not emitted in the logs, such as tags, activation and expiration dates.
> 
> 

In addition to key vault permissions, all three roles also need access to other resources. For example, to be able to deploy VMs (or Web Apps etc.) Developers/Operators also need 'Contributor' access to those resource types. Auditors need 'Read' access to the storage account where the key vault logs are stored.

Since the focus of this article is securing access to your key vault, we only illustrate concepts pertaining to this topic. Details regarding deploying certificates, accessing keys and secrets programmatically, and others, are covered elsewhere. For instance:

- Deploying certificates stored in key vault to VMs is covered in a [blog post: Deploy Certificates to VMs from customer-managed Key Vault](https://blogs.technet.microsoft.com/kv/2016/09/14/updated-deploy-certificates-to-vms-from-customer-managed-key-vault/)
- The [Azure Key Vault client samples download](https://www.microsoft.com/download/details.aspx?id=45343) illustrates how to use a bootstrap certificate, to authenticate to Azure AD to access a key vault.

Most of the access permissions can be granted using Azure portal. To grant granular permissions, you may need to use Azure PowerShell or CLI to achieve the desired result. 

The following PowerShell snippets assume:

* The Azure Active Directory administrator has created security groups that represent the three roles (the Contoso Security Team, Contoso App Devops, Contoso App Auditors). The administrator has also added users to the groups they belong.
* **ContosoAppRG** is the resource group where all the resources reside. **contosologstorage** is where the logs are stored. 
* Key vault **ContosoKeyVault** and storage account used for key vault logs **contosologstorage** must be in the same Azure location

First the subscription administrator assigns 'key vault Contributor' and 'User Access Administrator' roles to the security team. These roles allow the security team to manage access to other resources and manage key vaults in the resource group ContosoAppRG.

```
New-AzureRmRoleAssignment -ObjectId (Get-AzureRmADGroup -SearchString 'Contoso Security Team')[0].Id -RoleDefinitionName "key vault Contributor" -ResourceGroupName ContosoAppRG
New-AzureRmRoleAssignment -ObjectId (Get-AzureRmADGroup -SearchString 'Contoso Security Team')[0].Id -RoleDefinitionName "User Access Administrator" -ResourceGroupName ContosoAppRG
```

The following script shows how the security team can create a key vault, and set up logging and access permissions. See [About Azure Key Vault keys, secrets and certificates](about-keys-secrets-and-certificates.md) for details on Key Vault access policy permissions.

```
# Create key vault and enable logging
$sa = Get-AzureRmStorageAccount -ResourceGroup ContosoAppRG -Name contosologstorage
$kv = New-AzureRmKeyVault -VaultName ContosoKeyVault -ResourceGroup ContosoAppRG -SKU premium -Location 'westus' -EnabledForDeployment
Set-AzureRmDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Categories AuditEvent

# Data plane permissions for Security team
Set-AzureRmKeyVaultAccessPolicy -VaultName ContosoKeyVault -ObjectId (Get-AzureRmADGroup -SearchString 'Contoso Security Team')[0].Id -PermissionsToKeys backup,create,delete,get,import,list,restore -PermissionsToSecrets get,list,set,delete,backup,restore,recover,purge

# Management plane permissions for Dev/ops
# Create a new role from an existing role
$devopsrole = Get-AzureRmRoleDefinition -Name "Virtual Machine Contributor"
$devopsrole.Id = $null
$devopsrole.Name = "Contoso App Devops"
$devopsrole.Description = "Can deploy VMs that need secrets from key vault"
$devopsrole.AssignableScopes = @("/subscriptions/<SUBSCRIPTION-GUID>")

# Add permission for dev/ops so they can deploy VMs that have secrets deployed from key vaults
$devopsrole.Actions.Add("Microsoft.KeyVault/vaults/deploy/action")
New-AzureRmRoleDefinition -Role $devopsrole

# Assign this newly defined role to Dev ops security group
New-AzureRmRoleAssignment -ObjectId (Get-AzureRmADGroup -SearchString 'Contoso App Devops')[0].Id -RoleDefinitionName "Contoso App Devops" -ResourceGroupName ContosoAppRG

# Data plane permissions for Auditors
Set-AzureRmKeyVaultAccessPolicy -VaultName ContosoKeyVault -ObjectId (Get-AzureRmADGroup -SearchString 'Contoso App Auditors')[0].Id -PermissionsToKeys list -PermissionsToSecrets list
```

The custom role defined, is only assignable to the subscription where the ContosoAppRG resource group is created. If the same custom roles will be used for other projects in other subscriptions, its scope could have more subscriptions added.

The custom role assignment for the developers/operators "deploy/action" permission is scoped to the resource group. This allows only VMs created in the resource group 'ContosoAppRG' to have access to the secrets (SSL cert and bootstrap cert). VMs created in another resource group by a dev/ops team member won't have access to these secrets, even if they have the secret URIs.

This example shows a simple scenario. Real life scenarios may be more complex, and you may need to adjust permissions to your key vault based on your needs. In our example, we assume the security team will provide the key and secret references (URIs and thumbprints), which developers/operators need to reference in their applications. Developers/operators do not require any data plane access. This example focuses on securing your key vault. Similar consideration should be given to secure [your VMs](https://azure.microsoft.com/services/virtual-machines/security/), [storage accounts](../storage/common/storage-security-guide.md), and other Azure resources.

> [!NOTE]
> Note: This example shows how key vault access will be locked down in production. The developers should have their own subscription or resourcegroup where they have full permissions to manage their vaults, VMs and storage account where they develop the application.

It's highly recommended to secure access to your key vault further by [configuring Key Vault firewalls and virtual networks](key-vault-network-security.md).

## Resources
* [Azure Active Directory Role-based Access Control](../role-based-access-control/role-assignments-portal.md)
  
  This article explains the Azure Active Directory Role-based Access Control and how it works.
* [RBAC: Built in Roles](../role-based-access-control/built-in-roles.md)
  
  This article details all the built-in roles available in RBAC.
* [Understanding Resource Manager deployment and classic deployment](../azure-resource-manager/resource-manager-deployment-model.md)
  
  This article explains the Resource Manager deployment and classic deployment models, and explains the benefits of using the Resource Manager and resource groups
* [Manage Role-Based Access Control with Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
  
  This article explains how to manage role-based access control with Azure PowerShell
* [Managing Role-Based Access Control with the REST API](../role-based-access-control/role-assignments-rest.md)
  
  This article shows how to use the REST API to manage RBAC.
* [Role-Based Access Control for Microsoft Azure from Ignite](https://channel9.msdn.com/events/Ignite/2015/BRK2707)
  
  This 2015 Microsoft Ignite conference video discusses access management and reporting capabilities in Azure. It also explores best practices for securing access to Azure subscriptions using Azure Active Directory.
* [Authorize access to web applications using OAuth 2.0 and Azure Active Directory](../active-directory/develop/v1-protocols-oauth-code.md)
  
  This article describes complete OAuth 2.0 flow for authenticating with Azure Active Directory.
* [key vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx)
  
  This document is the reference for the REST APIs to manage your key vault programmatically, including setting key vault access policy.
* [key vault REST APIs](https://msdn.microsoft.com/library/azure/dn903609.aspx)
  
  Link to key vault REST API reference documentation.
* [Key access control](https://msdn.microsoft.com/library/azure/dn903623.aspx#BKMK_KeyAccessControl)
  
  Link to Secret access control reference documentation.
* [Secret access control](https://msdn.microsoft.com/library/azure/dn903623.aspx#BKMK_SecretAccessControl)
  
  Link to Key access control reference documentation.
* [Set](https://docs.microsoft.com/powershell/module/azurerm.keyvault/Set-AzureRmKeyVaultAccessPolicy) and [Remove](https://docs.microsoft.com/powershell/module/azurerm.keyvault/Remove-AzureRmKeyVaultAccessPolicy) key vault access policy using PowerShell
  
  Links to reference documentation for PowerShell cmdlets to manage key vault access policy.

## Next Steps
[Configure Key Vault firewalls and virtual networks](key-vault-network-security.md)

For a getting started tutorial for an administrator, see [Get Started with Azure key vault](key-vault-get-started.md).

For more information about usage logging for key vault, see [Azure key vault Logging](key-vault-logging.md).

For more information about using keys and secrets with Azure key vault, see [About Keys and Secrets](https://msdn.microsoft.com/library/azure/dn903623.aspx).

If you have questions about key vault, visit the [Azure key vault Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureKeyVault)

