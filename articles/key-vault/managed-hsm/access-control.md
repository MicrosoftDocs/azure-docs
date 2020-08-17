---
title: Secure access to a Managed HSM - Azure Key Vault Managed HSM| Microsoft Docs
description: Manage access permissions for Managed HSM and keys. Covers the authentication and authorization model for Managed HSM, and how to secure your HSM pools.
services: key-vault
author: amitbapat
manager: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: ambapat
# Customer intent: As an HSM pool administrator, I want to set access policies and configure the Managed HSM, so that I can ensure it's secure and auditors can properly monitor all activities for this Managed HSM pool.
---
# Secure access to a Managed HSM pool

Azure Key Vault Managed HSM is a cloud service that safeguards encryption keys. Because this data is sensitive and business critical, you need to secure access to your HSM pools by allowing only authorized applications and users to access it. This article provides an overview of the Managed HSM access control model. It explains authentication and authorization, and describes how to secure access to your HSM pools.

## Access control model overview

Access to a Managed HSM pool is controlled through two interfaces: the **management plane** and the **data plane**. The management plane is where you manage Managed HSM pool itself. Operations in this plane include creating and deleting HSM pools and retrieving HSM pool properties. The data plane is where you work with the data stored in an HSM pool -- that is HSM-backed encryption keys. You can add, delete, modify, and use keys to perform cryptographic operations, manage role assignments to control access to the  keys, create a full HSM backup, restore full backup, and manage security domain from the data plane interface.

To access a Managed HSM pool in either plane, all callers must have proper authentication and authorization. Authentication establishes the identity of the caller. Authorization determines which operations the caller can execute. A caller can be any one of the [security principals](../../role-based-access-control/overview.md#security-principal) defined in Azure Active Directory - user, group, service principal or managed identity.

Both planes use Azure Active Directory for authentication. For authorization they use different systems as follows
- The management plane uses Azure role-based access control -- Azure RBAC -- an authorization system built on Azure Azure Resource Manager 
- The data plane uses a HSM pool level RBAC (Managed HSM local RBAC) -- an authorization system implemented and enforced at the HSM pool level. 

When an HSM pool resource is created, the requestor also provides a list of data plane administrators (all [security principals](../../role-based-access-control/overview.md#security-principal) are supported). Only these administrators are able to access the HSM pool  data plane to perform key operations and manage data plane role assignments (Managed HSM local RBAC).

Permission model for both planes uses the same syntax (RBAC), but they are enforced at different levels and role assignments use different scopes. Management plane RBAC is enforced by ARM while data plane RBAC is enforced by HSM pool itself.

> [!IMPORTANT] 
> Granting a security principal management plane access to an HSM pool resource does not grant them any access to data plane to access keys or data plane role assignments Managed HSM local RBAC). This isolation is by design to prevent inadvertent expansion of privileges affecting access to keys stored in Managed HSM.

For example, a subscription administrator (since they have "Contributor" permission to all resources in the subscription) can delete an HSM pool in their subscription, but if they don't have data plane access specifically granted through Managed HSM local RBAC, they cannot gain access to keys or manage role assignment in the HSM pool to grant themselves or others access to data plane.


## Azure Active Directory authentication

When you create an HSM pool in an Azure subscription, it's automatically associated with the Azure Active Directory tenant of the subscription. All callers in both planes must be registered in this tenant and authenticate to access the HSM pool. 

The application authenticates with Azure Active Directory before calling either plane. The application can use any [supported authentication method](../../active-directory/develop/authentication-scenarios.md) based on the application type. The application acquires a token for a resource in the plane to gain access. The resource is an endpoint in the management or data plane, based on the Azure environment. The application uses the token and sends a REST API request to Managed HSM endpoint. To learn more, review the [whole authentication flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

The use of a single authentication mechanism for both planes has several benefits:

- Organizations can control access centrally to all HSM pools in their organization.
- If a user leaves, they instantly lose access to all HSM pools in the organization.
- Organizations can customize authentication by using the options in Azure Active Directory, such as to enable multi-factor authentication for added security.

## Resource endpoints

Security principals access the planes through endpoints. The access controls for the two planes work independently. To grant an application access to use keys in an HSM pool, you grant data plane access by using Managed HSM local RBAC. To grant a user access to Managed HSM resource to create, read, delete, move the HSM pools and edit other properties and tags you use Azure RBAC.

The following table shows the endpoints for the management and data planes.

| Access&nbsp;plane | Access endpoints | Operations | Access control mechanism |
| --- | --- | --- | --- |
| Management plane | **Global:**<br> management.azure.com:443<br> | Create, read, update, delete, and move HSM pools<br>Set HSM pool tags | Azure RBAC |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br> | **Keys**: decrypt, encrypt,<br> unwrap, wrap, verify, sign, get, list, update, create, import, delete, backup, restore, purge<br/><br/> **Data plane role-management (Managed HSM local RBAC)***: list role definitions, assign roles, delete role assignments, define custom roles<br/><br/>**Backup/restore**: backup, restore, check status backup/restore operations <br/><br/>**Security domain**: download and upload security domain | Managed HSM local RBAC |
|||||
## Management plane and Azure RBAC

In the management plane, you use Azure RBAC to authorize the operations a caller can execute. In the RBAC model, each Azure subscription has an instance of Azure Active Directory. You grant access to users, groups, and applications from this directory. Access is granted to manage resources in the Azure subscription that use the Azure Resource Manager deployment model. To grant access, use the [Azure portal](https://portal.azure.com/), the [Azure CLI](../../cli-install-nodejs.md), [Azure PowerShell](/powershell/azureps-cmdlets-docs), or the [Azure Resource Manager REST APIs](https://msdn.microsoft.com/library/azure/dn906885.aspx).

You create a key vault in a resource group and manage access by using Azure Active Directory. You grant users or groups the ability to manage the key vaults in a resource group. You grant the access at a specific scope level by assigning appropriate RBAC roles. To grant access to a user to manage key vaults, you assign a predefined `key vault Contributor` role to the user at a specific scope. The following scopes levels can be assigned to an RBAC role:

- **Management group**:  An RBAC role assigned at the subscription level applies to all the subscriptions in that management group.
- **Subscription**: An RBAC role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An RBAC role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An RBAC role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md).

## Data plane and Managed HSM local RBAC

You grant a security principal access to execute specific key operations by assigning a role. For each role assignment you need to specify a role and scope over which that assignment applies. For Managed HSM local RBAC two scopes are available.

- **"/" or "/keys"**: HSM level scope. Security principals assigned a role at this scope can perform the operations defined in the role for all objects (keys) in the HSM pool.
- **"/keys/&lt;key-name&gt;"**: Key level scope. Security principals assigned a role at this scope can perform the operations defined in this role for all versions of the specified key only.


## Example

In this example, we're developing an application that uses Azure Storage account to store data and an RSA 2,048-bit key for sign operations. Our application runs in an Azure virtual machine (VM) with a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). The Storage account is configured to [encrypt data at rest with customer-managed key](../../storage/common/encryption-customer-managed-keys.md). Both the RSA key used for signing and the master key used to encryption storage account data are stored in our managed HSM pool.

We have identified following roles who manage, deploy, and audit our application:
- **Security team**: IT staff from the office of the CSO (Chief Security Officer) or similar contributors. The security team is responsible for the proper safekeeping of secrets. The secrets can include TLS/SSL certificates, RSA keys for signing, connection strings, and storage account keys.
- **Developers and operators**: The staff who develop the application and deploy it in Azure. The members of this team aren't part of the security staff. They shouldn't have access to sensitive data like TLS/SSL certificates and RSA keys. Only the application that they deploy should have access to sensitive data.
- **Auditors**: This role is for contributors who aren't members of the development or general IT staff. They review the use and maintenance of certificates, keys, and secrets to ensure compliance with security standards.

There's another role that's outside the scope of our application: the subscription (or resource group) administrator. The subscription admin sets up initial access permissions for the security team. They grant access to the security team by using a resource group that has the resources required by the application.

We need to authorize the following operations for our roles:

**Security team**
- Create Managed HSM pool.
- Turn on Managed HSM logging.
- Generate or import keys
- Create HSM pool backups for disaster recovery.
- Set Managed HSM local RBAC to grant permissions to users and applications for specific operations.
- Roll the keys periodically.

**Developers and operators**
- Get references from the security team for master key to encrypt storage account (key URI), and RSA key (key URI) for signing.
- Develop and deploy the application to access keys and secrets programmatically.

**Auditors**
- Review the HSM pool logs to confirm proper use of keys in compliance with data security standards.

The following table summarizes the role assignments to teams and resources to access the HSM pool.

| Role | Management plane role | Data plane role |
| --- | --- | --- |
| Security team | Managed HSM Contributor | Managed HSM Administrator |
| Developers and&nbsp;operators | None | None |
| Auditors | None | Managed HSM Auditor |
| Managed identify of the VM used by the Application| None | Managed HSM Crypto User |
| Managed identity of the Storage account used by the Application| None| Managed HSM Service Encryption |


The three team roles need access to other resources along with HSM pool permissions. To deploy VMs (or the Web Apps feature of Azure App Service), developers and operators need `Contributor` access to those resource types. Auditors need read access to the Storage account where the HSM pool logs are stored.

To assign management plane roles (Azure RBAC) you can use Azure portal or any of the other management interfaces such as Azure CLI or Azure PowerShell. To assign HSM pool data plane roles you must use Azure CLI.


The Azure CLI snippets in this section are built with the following assumptions:
- The Azure Active Directory administrator has created security groups to represent the three roles: Contoso Security Team, Contoso App DevOps, and Contoso App Auditors. The admin has added users to their respective groups.
- All resources are located in the **ContosoAppRG** resource group.
- The HSM pool logs are stored in the **contosologstorage** storage account.
- The **ContosoMHSM** HSM pool and the **contosologstorage** storage account are in the same Azure location.

The subscription admin assigns the `Managed HSM Contributor` and `User Access Administrator` roles to the security team. These roles allow the security team to manage access to other resources and key vaults, both of which in the **ContosoAppRG** resource group.

```AzureCLI
New-AzRoleAssignment -ObjectId (Get-AzADGroup -SearchString 'Contoso Security Team')[0].Id -RoleDefinitionName "key vault Contributor" -ResourceGroupName ContosoAppRG
New-AzRoleAssignment -ObjectId (Get-AzADGroup -SearchString 'Contoso Security Team')[0].Id -RoleDefinitionName "User Access Administrator" -ResourceGroupName ContosoAppRG
```

The security team creates an HSM pool and sets up logging and assigns roles.

```AzureCLI
# Create a Managed HSM pool and enable logging
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

For our DevOps staff, the custom role assignment for the key vault `deploy/action` permission is scoped to the resource group. Only VMs created in the **ContosoAppRG** resource group are allowed access to the secrets (TLS/SSL and bootstrap certificates). VMs created in other resource groups by a DevOps member can't access these secrets, even if the VM has the secret URIs.

Our example describes a simple scenario. Real-life scenarios can be more complex. You can adjust permissions to your key vault based on your needs. We assumed the security team provides the key and secret references (URIs and thumbprints), which are used by the DevOps staff in their applications. Developers and operators don't require any data plane access. We focused on how to secure your key vault. Give similar consideration when you secure [your VMs](https://azure.microsoft.com/services/virtual-machines/security/), [storage accounts](../../storage/blobs/security-recommendations.md), and other Azure resources.


## Resources

* [Azure RBAC documentation](../../role-based-access-control/overview.md)
* [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md)
* [Manage Azure RBAC with Azure CLI](../../role-based-access-control/role-assignments-cli.md)



## Next steps

For a getting-started tutorial for an administrator, see [What is Managed HSM?](overview.md).

For more information about usage logging for Managed HSM logging, see [Managed HSM logging](logging.md).

