---
title: Secure access to a key vault - Azure Key Vault | Microsoft Docs
description: Manage access permissions for Azure Key Vault, keys, and secrets. Covers the authentication and authorization model for Key Vault, and how to secure your key vault.
services: key-vault
author: amitbapat
manager: barbkess
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 01/07/2019
ms.author: ambapat
# Customer intent: As a key vault administrator, I want to set access policies and configure the key vault, so that I can ensure it's secure and auditors can properly monitor all activities for this key vault.
---
# Secure access to a key vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. Because this data is sensitive and business critical, you need to secure access to your key vaults by allowing only authorized applications and users. This article provides an overview of the Key Vault access model. It explains authentication and authorization, and describes how to secure access to your key vaults.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Access model overview

Access to a key vault is controlled through two interfaces: the **management plane** and the **data plane**. The management plane is where you manage Key Vault itself. Operations in this plane include creating and deleting key vaults, retrieving Key Vault properties, and updating access policies. The data plane is where you work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

To access a key vault in either plane, all callers (users or applications) must have proper authentication and authorization. Authentication establishes the identity of the caller. Authorization determines which operations the caller can execute. 

Both planes use Azure Active Directory (Azure AD) for authentication. For authorization, the management plane uses role-based access control (RBAC) and the data plane uses a Key Vault access policy.

## Active Directory authentication

When you create a key vault in an Azure subscription, it's automatically associated with the Azure AD tenant of the subscription. All callers in both planes must register in this tenant and authenticate to access the key vault. In both cases, applications can access Key Vault in two ways:

- **User plus application access**: The application accesses Key Vault on behalf of a signed-in user. Examples of this type of access include Azure PowerShell and the Azure portal. User access is granted in two ways. Users can access Key Vault from any application, or they must use a specific application (referred to as _compound identity_).
- **Application-only access**: The application runs as a daemon service or background job. The application identity is granted access to the key vault.

For both types of access, the application authenticates with Azure AD. The application uses any [supported authentication method](../active-directory/develop/authentication-scenarios.md) based on the application type. The application acquires a token for a resource in the plane to grant access. The resource is an endpoint in the management or data plane, based on the Azure environment. The application uses the token and sends a REST API request to Key Vault. To learn more, review the [whole authentication flow](../active-directory/develop/v1-protocols-oauth-code.md).

The model of a single mechanism for authentication to both planes has several benefits:

- Organizations can control access centrally to all key vaults in their organization.
- If a user leaves, they instantly lose access to all key vaults in the organization.
- Organizations can customize authentication by using the options in Azure AD, such as to enable multi-factor authentication for added security.

## Resource endpoints

Applications access the planes through endpoints. The access controls for the two planes work independently. To grant an application access to use keys in a key vault, you grant data plane access by using a Key Vault access policy. To grant a user read access to Key Vault properties and tags, but not access to data (keys, secrets, or certificates), you grant management plane access with RBAC.

The following table shows the endpoints for the management and data planes.

| Access&nbsp;plane | Access endpoints | Operations | Access&nbsp;control mechanism |
| --- | --- | --- | --- |
| Management plane | **Global:**<br> management.azure.com:443<br><br> **Azure China 21Vianet:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 | Create, read, update, and delete key vaults<br><br>Set Key Vault access policies<br><br>Set Key Vault tags | Azure Resource Manager RBAC |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China 21Vianet:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 | Keys: decrypt, encrypt,<br> unwrap, wrap, verify, sign,<br> get, list, update, create,<br> import, delete, backup, restore<br><br> Secrets: get, list, set, delete | Key Vault access policy |

## Management plane and RBAC

In the management plane, you use RBAC(Role Based Access Control) to authorize the operations a caller can execute. In the RBAC model, each Azure subscription has an instance of Azure AD. You grant access to users, groups, and applications from this directory. Access is granted to manage resources in the Azure subscription that use the Azure Resource Manager deployment model. To grant access, use the [Azure portal](https://portal.azure.com/), the [Azure CLI](../cli-install-nodejs.md), [Azure PowerShell](/powershell/azureps-cmdlets-docs), or the [Azure Resource Manager REST APIs](https://msdn.microsoft.com/library/azure/dn906885.aspx).

You create a key vault in a resource group and manage access by using Azure AD. You grant users or groups the ability to manage the key vaults in a resource group. You grant the access at a specific scope level by assigning appropriate RBAC roles. To grant access to a user to manage key vaults, you assign a predefined `key vault Contributor` role to the user at a specific scope. The following scopes levels can be assigned to an RBAC role:

- **Subscription**: An RBAC role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An RBAC role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An RBAC role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [RBAC: Built-in roles](../role-based-access-control/built-in-roles.md).

> [!IMPORTANT]
> If a user has `Contributor` permissions to a key vault management plane, the user can grant themselves access to the data plane by setting a Key Vault access policy. You should tightly control who has `Contributor` role access to your key vaults. Ensure that only authorized persons can access and manage your key vaults, keys, secrets, and certificates.
>

<a id="data-plane-access-control"></a> 
## Data plane and access policies

You grant data plane access by setting Key Vault access policies for a key vault. To set these access policies, a user, group, or application must have `Contributor` permissions for the management plane for that key vault.

You grant a user, group, or application access to execute specific operations for keys or secrets in a key vault. Key Vault supports up to 1,024 access policy entries for a key vault. To grant data plane access to several users, create an Azure AD security group and add users to that group.

<a id="key-vault-access-policies"></a>
Key Vault access policies grant permissions separately to keys, secrets, and certificate. You can grant a user access only to keys and not to secrets. Access permissions for keys, secrets, and certificates are at the vault level. Key Vault access policies don't support granular, object-level permissions like a specific key, secret, or certificate. To set access policies for a key vault, use the [Azure portal](https://portal.azure.com/), the [Azure CLI](../cli-install-nodejs.md), [Azure PowerShell](/powershell/azureps-cmdlets-docs), or the [Key Vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx).

> [!IMPORTANT]
> Key Vault access policies apply at the vault level. When a user is granted permission to create and delete keys, they can perform those operations on all keys in that key vault.
>

You can restrict data plane access by using [virtual network service endpoints for Azure Key Vault](key-vault-overview-vnet-service-endpoints.md). You can configure [firewalls and virtual network rules](key-vault-network-security.md) for an additional layer of security.

## Example

In this example, we're developing an application that uses a certificate for SSL, Azure Storage to store data, and an RSA 2,048-bit key for sign operations. Our application runs in an Azure virtual machine (VM) (or a virtual machine scale set). We can use a key vault to store the application secrets. We can store the bootstrap certificate that's used by the application to authenticate with Azure AD.

We need access to the following stored keys and secrets:
- **SSL certificate**: Used for SSL.
- **Storage key**: Used to access the Storage account.
- **RSA 2,048-bit key**: Used for sign operations.
- **Bootstrap certificate**: Used to authenticate with Azure AD. After access is granted, we can fetch the storage key and use the RSA key for signing.

We need to define the following roles to specify who can manage, deploy, and audit our application:
- **Security team**: IT staff from the office of the CSO (Chief Security Officer) or similar contributors. The security team is responsible for the proper safekeeping of secrets. The secrets can include SSL certificates, RSA keys for signing, connection strings, and storage account keys.
- **Developers and operators**: The staff who develop the application and deploy it in Azure. The members of this team aren't part of the security staff. They shouldn't have access to sensitive data like SSL certificates and RSA keys. Only the application that they deploy should have access to sensitive data.
- **Auditors**: This role is for contributors who aren't members of the development or general IT staff. They review the use and maintenance of certificates, keys, and secrets to ensure compliance with security standards. 

There's another role that's outside the scope of our application: the subscription (or resource group) administrator. The subscription admin sets up initial access permissions for the security team. They grant access to the security team by using a resource group that has the resources required by the application.

We need to authorize the following operations for our roles:

**Security team**
- Create key vaults.
- Turn on Key Vault logging.
- Add keys and secrets.
- Create backups of keys for disaster recovery.
- Set Key Vault access policies to grant permissions to users and applications for specific operations.
- Roll the keys and secrets periodically.

**Developers and operators**
- Get references from the security team for the bootstrap and SSL certificates (thumbprints), storage key (secret URI), and RSA key (key URI) for signing.
- Develop and deploy the application to access keys and secrets programmatically.

**Auditors**
- Review the Key Vault logs to confirm proper use of keys and secrets, and compliance with data security standards.

The following table summarizes the access permissions for our roles and application. 

| Role | Management plane permissions | Data plane permissions |
| --- | --- | --- |
| Security team | Key Vault Contributor | Keys: backup, create, delete, get, import, list, restore<br>Secrets: all operations |
| Developers and&nbsp;operators | Key Vault deploy permission<br><br> **Note**: This permission allows deployed VMs to fetch secrets from a key vault. | None |
| Auditors | None | Keys: list<br>Secrets: list<br><br> **Note**: This permission enables auditors to inspect attributes (tags, activation dates, expiration dates) for keys and secrets not emitted in the logs. |
| Application | None | Keys: sign<br>Secrets: get |

The three team roles need access to other resources along with Key Vault permissions. To deploy VMs (or the Web Apps feature of Azure App Service), developers and operators need `Contributor` access to those resource types. Auditors need read access to the Storage account where the Key Vault logs are stored.

For more information about how to deploy certificates, access keys, and secrets programmatically, see these resources:
- Learn how to [deploy certificates to VMs from a customer-managed key vault](https://blogs.technet.microsoft.com/kv/2016/09/14/updated-deploy-certificates-to-vms-from-customer-managed-key-vault/) (blog post).
- Download the [Azure Key Vault client samples](https://www.microsoft.com/download/details.aspx?id=45343). This content illustrates how to use a bootstrap certificate to authenticate to Azure AD to access a key vault.

You can grant most of the access permissions by using the Azure portal. To grant granular permissions, you can use Azure PowerShell or the Azure CLI.

The PowerShell snippets in this section are built with the following assumptions:
- The Azure AD administrator has created security groups to represent the three roles: Contoso Security Team, Contoso App DevOps, and Contoso App Auditors. The admin has added users to their respective groups.
- All resources are located in the **ContosoAppRG** resource group.
- The Key Vault logs are stored in the **contosologstorage** storage account. 
- The **ContosoKeyVault** key vault and the **contosologstorage** storage account are in the same Azure location.

The subscription admin assigns the `key vault Contributor` and `User Access Administrator` roles to the security team. These roles allow the security team to manage access to other resources and key vaults, both of which in the **ContosoAppRG** resource group.

```powershell
New-AzRoleAssignment -ObjectId (Get-AzADGroup -SearchString 'Contoso Security Team')[0].Id -RoleDefinitionName "key vault Contributor" -ResourceGroupName ContosoAppRG
New-AzRoleAssignment -ObjectId (Get-AzADGroup -SearchString 'Contoso Security Team')[0].Id -RoleDefinitionName "User Access Administrator" -ResourceGroupName ContosoAppRG
```

The security team creates a key vault and sets up logging and access permissions. For details about Key Vault access policy permissions, see [About Azure Key Vault keys, secrets, and certificates](about-keys-secrets-and-certificates.md).

```powershell
# Create a key vault and enable logging
$sa = Get-AzStorageAccount -ResourceGroup ContosoAppRG -Name contosologstorage
$kv = New-AzKeyVault -Name ContosoKeyVault -ResourceGroup ContosoAppRG -SKU premium -Location 'westus' -EnabledForDeployment
Set-AzDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Category AuditEvent

# Set up data plane permissions for the Contoso Security Team role
Set-AzKeyVaultAccessPolicy -VaultName ContosoKeyVault -ObjectId (Get-AzADGroup -SearchString 'Contoso Security Team')[0].Id -PermissionsToKeys backup,create,delete,get,import,list,restore -PermissionsToSecrets get,list,set,delete,backup,restore,recover,purge

# Set up management plane permissions for the Contoso App DevOps role
# Create the new role from an existing role
$devopsrole = Get-AzRoleDefinition -Name "Virtual Machine Contributor"
$devopsrole.Id = $null
$devopsrole.Name = "Contoso App DevOps"
$devopsrole.Description = "Can deploy VMs that need secrets from a key vault"
$devopsrole.AssignableScopes = @("/subscriptions/<SUBSCRIPTION-GUID>")

# Add permissions for the Contoso App DevOps role so members can deploy VMs with secrets deployed from key vaults
$devopsrole.Actions.Add("Microsoft.KeyVault/vaults/deploy/action")
New-AzRoleDefinition -Role $devopsrole

# Assign the new role to the Contoso App DevOps security group
New-AzRoleAssignment -ObjectId (Get-AzADGroup -SearchString 'Contoso App Devops')[0].Id -RoleDefinitionName "Contoso App Devops" -ResourceGroupName ContosoAppRG

# Set up data plane permissions for the Contoso App Auditors role
Set-AzKeyVaultAccessPolicy -VaultName ContosoKeyVault -ObjectId (Get-AzADGroup -SearchString 'Contoso App Auditors')[0].Id -PermissionsToKeys list -PermissionsToSecrets list
```

Our defined custom roles are assignable only to the subscription where the **ContosoAppRG** resource group is created. To use a custom role for other projects in other subscriptions, add other subscriptions to the scope for the role.

For our DevOps staff, the custom role assignment for the key vault `deploy/action` permission is scoped to the resource group. Only VMs created in the **ContosoAppRG** resource group are allowed access to the secrets (SSL and bootstrap certificates). VMs created in other resource groups by a DevOps member can't access these secrets, even if the VM has the secret URIs.

Our example describes a simple scenario. Real-life scenarios can be more complex. You can adjust permissions to your key vault based on your needs. We assumed the security team provides the key and secret references (URIs and thumbprints), which are used by the DevOps staff in their applications. Developers and operators don't require any data plane access. We focused on how to secure your key vault. Give similar consideration when you secure [your VMs](https://azure.microsoft.com/services/virtual-machines/security/), [storage accounts](../storage/common/storage-security-guide.md), and other Azure resources.

> [!NOTE]
> This example shows how Key Vault access is locked down in production. Developers should have their own subscription or resource group with full permissions to manage their vaults, VMs, and the storage account where they develop the application.

We recommend that you set up additional secure access to your key vault by [configuring Key Vault firewalls and virtual networks](key-vault-network-security.md).

## Resources

* [Azure AD RBAC](../role-based-access-control/role-assignments-portal.md)

* [RBAC: Built-in roles](../role-based-access-control/built-in-roles.md)

* [Understand Resource Manager deployment and classic deployment](../azure-resource-manager/resource-manager-deployment-model.md) 

* [Manage RBAC with Azure PowerShell](../role-based-access-control/role-assignments-powershell.md) 

* [Manage RBAC with the REST API](../role-based-access-control/role-assignments-rest.md)

* [RBAC for Microsoft Azure](https://channel9.msdn.com/events/Ignite/2015/BRK2707)

    This 2015 Microsoft Ignite conference video discusses access management and reporting capabilities in Azure. It also explores best practices for securing access to Azure subscriptions by using Azure AD.

* [Authorize access to web applications by using OAuth 2.0 and Azure AD](../active-directory/develop/v1-protocols-oauth-code.md)

* [Key Vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx)

    The reference for the REST APIs to manage your key vault programmatically, including setting Key Vault access policy.

* [Key Vault REST APIs](https://msdn.microsoft.com/library/azure/dn903609.aspx)

* [Key access control](https://msdn.microsoft.com/library/azure/dn903623.aspx#BKMK_KeyAccessControl)
  
* [Secret access control](https://msdn.microsoft.com/library/azure/dn903623.aspx#BKMK_SecretAccessControl)
  
* [Set](/powershell/module/az.keyvault/Set-azKeyVaultAccessPolicy) and [remove](/powershell/module/az.keyvault/Remove-azKeyVaultAccessPolicy) Key Vault access policy by using PowerShell.
  
## Next steps

Configure [Key Vault firewalls and virtual networks](key-vault-network-security.md).

For a getting-started tutorial for an administrator, see [What is Azure Key Vault?](key-vault-overview.md).

For more information about usage logging for Key Vault, see [Azure Key Vault logging](key-vault-logging.md).

For more information about using keys and secrets with Azure Key Vault, see [About keys and secrets](https://msdn.microsoft.com/library/azure/dn903623.aspx).

If you have questions about Key Vault, visit the [forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureKeyVault).
