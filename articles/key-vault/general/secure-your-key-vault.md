---
title: Secure access to a key vault
description: The access model for Azure Key Vault, including Active Directory authentication and resource endpoints.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: sudbalas
# Customer intent: As a key vault administrator, I want to set access policies and configure the key vault, so that I can ensure it's secure and auditors can properly monitor all activities for this key vault.
---
# Secure access to a key vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. Because this data is sensitive and business critical, you need to secure access to your key vaults by allowing only authorized applications and users. This article provides an overview of the Key Vault access model. It explains authentication and authorization, and describes how to secure access to your key vaults.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Access model overview

Access to a key vault is controlled through two interfaces: the **management plane** and the **data plane**. The management plane is where you manage Key Vault itself. Operations in this plane include creating and deleting key vaults, retrieving Key Vault properties, and updating access policies. The data plane is where you work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

To access a key vault in either plane, all callers (users or applications) must have proper authentication and authorization. Authentication establishes the identity of the caller. Authorization determines which operations the caller can execute.

Both planes use Azure Active Directory (Azure AD) for authentication. For authorization, the management plane uses role-based access control (RBAC) and the data plane uses a Key Vault access policy and Azure RBAC (preview).

## Active Directory authentication

When you create a key vault in an Azure subscription, it's automatically associated with the Azure AD tenant of the subscription. All callers in both planes must register in this tenant and authenticate to access the key vault. In both cases, applications can access Key Vault in two ways:

- **Application-only**: The application represents a service or background job. This is the most common scenario for applications that need to access certificates, keys or secrets from the key vault, periodically. For this scenario to work, the `objectId` of the application must be specified in the access policy, and the `applicationId` must _not_ be specified or must be `null`.
- **User-only**: The user accesses the key vault from any application registered in the tenant. Examples of this type of access include Azure PowerShell and Azure Portal. For this scenario to work, the `objectId` of the user must be specified in the access policy, and the `applicationId` must _not_ be specified or must be `null`.
- **Application-plus-user** (sometimes referred as _compound identity_): The user is required to access the key vault from a specific application _and_ the application must use the on-behalf-of authentication (OBO) flow to impersonate the user. For this scenario to work, both `applicationId` and `objectId` must be specified in the access policy. The `applicationId` identifies the required application, and the `objectId` identifies the user. This option is currently not available for data plane Azure RBAC (preview)

In all types of access, the application authenticates with Azure AD. The application uses any [supported authentication method](../../active-directory/develop/authentication-scenarios.md) based on the application type. The application acquires a token for a resource in the plane to grant access. The resource is an endpoint in the management or data plane, based on the Azure environment. The application uses the token and sends a REST API request to Key Vault. To learn more, review the [whole authentication flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

The model of a single mechanism for authentication to both planes has several benefits:

- Organizations can control access centrally to all key vaults in their organization.
- If a user leaves, they instantly lose access to all key vaults in the organization.
- Organizations can customize authentication by using the options in Azure AD, such as to enable multi-factor authentication for added security.

## Resource endpoints

Applications access the planes through endpoints. The access controls for the two planes work independently. To grant an application access to use keys in a key vault, you grant data plane access by using a Key Vault access policy or Azure RBAC (preview). To grant a user read access to Key Vault properties and tags, but not access to data (keys, secrets, or certificates), you grant management plane access with RBAC.

The following table shows the endpoints for the management and data planes.

| Access&nbsp;plane | Access endpoints | Operations | Access&nbsp;control mechanism |
| --- | --- | --- | --- |
| Management plane | **Global:**<br> management.azure.com:443<br><br> **Azure China 21Vianet:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 | Create, read, update, and delete key vaults<br><br>Set Key Vault access policies<br><br>Set Key Vault tags | Azure RBAC |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China 21Vianet:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 | Keys: decrypt, encrypt,<br> unwrap, wrap, verify, sign,<br> get, list, update, create,<br> import, delete, backup, restore<br><br> Certificates: <br><br>  Secrets: get, list, set, delete | Key Vault access policy or Azure RBAC (preview)|

## Management plane and Azure RBAC

In the management plane, you use Azure role-based access control (Azure RBAC) to authorize the operations a caller can execute. In the Azure RBAC model, each Azure subscription has an instance of Azure AD. You grant access to users, groups, and applications from this directory. Access is granted to manage resources in the Azure subscription that use the Azure Resource Manager deployment model. To grant access, use the [Azure portal](https://portal.azure.com/), the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest), [Azure PowerShell](/powershell/azure/), or the [Azure Resource Manager REST APIs](https://msdn.microsoft.com/library/azure/dn906885.aspx).

You create a key vault in a resource group and manage access by using Azure AD. You grant users or groups the ability to manage the key vaults in a resource group. You grant the access at a specific scope level by assigning appropriate Azure roles. To grant access to a user to manage key vaults, you assign a predefined `key vault Contributor` role to the user at a specific scope. The following scopes levels can be assigned to an Azure role:

- **Subscription**: An Azure role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An Azure role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An Azure role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

> [!IMPORTANT]
> If a user has `Contributor` permissions to a key vault management plane, the user can grant themselves access to the data plane by setting a Key Vault access policy. You should tightly control who has `Contributor` role access to your key vaults. Ensure that only authorized persons can access and manage your key vaults, keys, secrets, and certificates.
>

<a id="data-plane-access-control"></a>
## Data plane and access policies

You can grant data plane access by setting Key Vault access policies for a key vault. To set these access policies, a user, group, or application must have `Contributor` permissions for the management plane for that key vault.

You grant a user, group, or application access to execute specific operations for keys or secrets in a key vault. Key Vault supports up to 1,024 access policy entries for a key vault. To grant data plane access to several users, create an Azure AD security group and add users to that group.

You can see the full list of vault and secret operations and understand the operations allowed when you configure key vault access policies by viewing the following reference. [Key Vault Operation Reference](https://docs.microsoft.com/rest/api/keyvault/#vault-operations)

<a id="key-vault-access-policies"></a>
Key Vault access policies grant permissions separately to keys, secrets, and certificate. You can grant a user access only to keys and not to secrets. Access permissions for keys, secrets, and certificates are at the vault level. Key Vault access policies don't support granular, object-level permissions like a specific key, secret, or certificate. To set access policies for a key vault, use the [Azure portal](https://portal.azure.com/), the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest), [Azure PowerShell](/powershell/azure/), or the [Key Vault Management REST APIs](https://msdn.microsoft.com/library/azure/mt620024.aspx).

> [!IMPORTANT]
> Key Vault access policies apply at the vault level. When a user is granted permission to create and delete keys, they can perform those operations on all keys in that key vault.
>

## Data plane and Azure RBAC (preview)

Azure role-based access control is an alternative permission model to control access to Azure Key Vault data plane, which can be enabled on individual key vaults. Azure RBAC permission model is exclusive and once is set, vault access policies became inactive. Azure Key Vault defines a set of Azure built-in roles that encompass common sets of permissions used to access keys, secrets or certificates.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the key vault, or an individual key, secret or certificate. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

Key benefits of using Azure RBAC permission over vault access policies are centralized access control management and it's integration with Privileged Identity Management (PIM). Privileged Identity Management provides time-based and approval-based role activation to mitigate the risks of excessive, unnecessary, or misused access permissions on resources that you care about.

For guide on how to use Azure RBAC on Key Vault data plane, see [Use an Azure RBAC for managing access to keys, secrets, and certificates](rbac-guide.md)

> [!TIP]
> You can restrict data plane access by using [virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md)). You can configure [firewalls and virtual network rules](network-security.md) for an additional layer of security.

## Resources

* [Azure RBAC](../../role-based-access-control/role-assignments-portal.md)

* [Azure built-in roles](../../role-based-access-control/built-in-roles.md)

* [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md)

* [Key Vault REST APIs](https://https://docs.microsoft.com/rest/api/keyvault/)

## Next steps

[Authenticate to Azure Key Vault](authentication.md)

[Assign a Key Vault access policy](assign-access-policy-portal.md)

Configure [Key Vault firewalls and virtual networks](network-security.md).

