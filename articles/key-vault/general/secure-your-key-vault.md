---
title: Secure access to a key vault
description: The access model for Azure Key Vault, including Active Directory authentication and resource endpoints.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 10/07/2020
ms.author: sudbalas
# Customer intent: As a key vault administrator, I want to set access policies and configure the key vault, so that I can ensure it's secure and auditors can properly monitor all activities for this key vault.
---
# Secure access to a key vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. Because this data is sensitive and business critical, you need to secure access to your key vaults by allowing only authorized applications and users. This article provides an overview of the Key Vault access model. It explains authentication and authorization, and describes how to secure access to your key vaults.

For more information on Key Vault, see [About Azure Key Vault](overview.md); for more information on what can be stored in a key vault, see [About keys, secrets, and certificates](about-keys-secrets-certificates.md).

## Access model overview

Access to a key vault is controlled through two interfaces: the **management plane** and the **data plane**. The management plane is where you manage Key Vault itself. Operations in this plane include creating and deleting key vaults, retrieving Key Vault properties, and updating access policies. The data plane is where you work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

Both planes use [Azure Active Directory (Azure AD)](../../active-directory/fundamentals/active-directory-whatis.md) for authentication. For authorization, the management plane uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and the data plane uses a [Key Vault access policy](./assign-access-policy-portal.md) and [Azure RBAC for Key Vault data plane operations](./rbac-guide.md).

To access a key vault in either plane, all callers (users or applications) must have proper authentication and authorization. Authentication establishes the identity of the caller. Authorization determines which operations the caller can execute. Authentication with Key Vault works in conjunction with [Azure Active Directory (Azure AD)](../../active-directory/fundamentals/active-directory-whatis.md), which is responsible for authenticating the identity of any given **security principal**.

A security principal is an object that represents a user, group, service, or application that's requesting access to Azure resources. Azure assigns a unique **object ID** to every security principal.

* A **user** security principal identifies an individual who has a profile in Azure Active Directory.

* A **group** security principal identifies a set of users created in Azure Active Directory. Any roles or permissions assigned to the group are granted to all of the users within the group.

* A **service principal** is a type of security principal that identifies an application or service, which is to say, a piece of code rather than a user or group. A service principal's object ID is known as its **client ID** and acts like its username. The service principal's **client secret** or **certificate** acts like its password. Many Azure Services supports assigning [Managed Identity](../../active-directory/managed-identities-azure-resources/overview.md) with automated management of **client ID** and **certificate**. Managed identity is the most secure and recommended option for authenticating within Azure.

For more information about authentication to Key Vault, see [Authenticate to Azure Key Vault](authentication.md)

## Key Vault authentication options

When you create a key vault in an Azure subscription, it's automatically associated with the Azure AD tenant of the subscription. All callers in both planes must register in this tenant and authenticate to access the key vault. In both cases, applications can access Key Vault in three ways:

- **Application-only**: The application represents a service principal or managed identity. This identity is the most common scenario for applications that periodically need to access certificates, keys, or secrets from the key vault. For this scenario to work, the `objectId` of the application must be specified in the access policy and the `applicationId` must _not_ be specified or must be `null`.
- **User-only**: The user accesses the key vault from any application registered in the tenant. Examples of this type of access include Azure PowerShell and the Azure portal. For this scenario to work, the `objectId` of the user must be specified in the access policy and the `applicationId` must _not_ be specified or must be `null`.
- **Application-plus-user** (sometimes referred as _compound identity_): The user is required to access the key vault from a specific application _and_ the application must use the on-behalf-of authentication (OBO) flow to impersonate the user. For this scenario to work, both `applicationId` and `objectId` must be specified in the access policy. The `applicationId` identifies the required application and the `objectId` identifies the user. Currently, this option isn't available for data plane Azure RBAC (preview).

In all types of access, the application authenticates with Azure AD. The application uses any [supported authentication method](../../active-directory/develop/authentication-vs-authorization.md) based on the application type. The application acquires a token for a resource in the plane to grant access. The resource is an endpoint in the management or data plane, based on the Azure environment. The application uses the token and sends a REST API request to Key Vault. To learn more, review the [whole authentication flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

The model of a single mechanism for authentication to both planes has several benefits:

- Organizations can control access centrally to all key vaults in their organization.
- If a user leaves, they instantly lose access to all key vaults in the organization.
- Organizations can customize authentication by using the options in Azure AD, such as to enable multi-factor authentication for added security.

## Resource endpoints

Applications access the planes through endpoints. The access controls for the two planes work independently. To grant an application access to use keys in a key vault, you grant data plane access by using a Key Vault access policy or Azure RBAC (preview). To grant a user read access to Key Vault properties and tags, but not access to data (keys, secrets, or certificates), you grant management plane access with Azure RBAC.

The following table shows the endpoints for the management and data planes.

| Access&nbsp;plane | Access endpoints | Operations | Access&nbsp;control mechanism |
| --- | --- | --- | --- |
| Management plane | **Global:**<br> management.azure.com:443<br><br> **Azure China 21Vianet:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 | Create, read, update, and delete key vaults<br><br>Set Key Vault access policies<br><br>Set Key Vault tags | Azure RBAC |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Azure China 21Vianet:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 | Keys: encrypt, decrypt, wrapKey, unwrapKey, sign, verify, get, list, create, update, import, delete, recover, backup, restore, purge<br><br> Certificates: managecontacts, getissuers, listissuers, setissuers, deleteissuers, manageissuers, get, list, create, import, update, delete, recover, backup, restore, purge<br><br>  Secrets: get, list, set, delete,recover, backup, restore, purge | Key Vault access policy or Azure RBAC (preview)|

## Management plane and Azure RBAC

In the management plane, you use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) to authorize the operations a caller can execute. In the Azure RBAC model, each Azure subscription has an instance of Azure AD. You grant access to users, groups, and applications from this directory. Access is granted to manage resources in the Azure subscription that use the Azure Resource Manager deployment model.

You create a key vault in a resource group and manage access by using Azure AD. You grant users or groups the ability to manage the key vaults in a resource group. You grant the access at a specific scope level by assigning appropriate Azure roles. To grant access to a user to manage key vaults, you assign a predefined [Key Vault Contributor](../../role-based-access-control/built-in-roles.md#key-vault-contributor) role to the user at a specific scope. The following scopes levels can be assigned to an Azure role:

- **Subscription**: An Azure role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An Azure role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An Azure role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md). 

You need to have `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../role-based-access-control/built-in-roles.md#owner)

> [!IMPORTANT]
> If a user has `Contributor` permissions to a key vault management plane, the user can grant themselves access to the data plane by setting a Key Vault access policy. You should tightly control who has `Contributor` role access to your key vaults. Ensure that only authorized persons can access and manage your key vaults, keys, secrets, and certificates.
>

<a id="data-plane-access-control"></a>
## Data plane and access policies

You can grant data plane access by setting Key Vault access policies for a key vault. To set these access policies, a user, group, or application must have `Key Vault Contributor` permissions for the management plane for that key vault.

You grant a user, group, or application access to execute specific operations for keys or secrets in a key vault. Key Vault supports up to 1,024 access policy entries for a key vault. To grant data plane access to several users, create an Azure AD security group and add users to that group.

You can see the full list of vault and secret operations here: [Key Vault Operation Reference](/rest/api/keyvault/#vault-operations)

<a id="key-vault-access-policies"></a>
Key Vault access policies grant permissions separately to keys, secrets, and certificates.  Access permissions for keys, secrets, and certificates are at the vault level. 

For more information about using key vault access policies, see [Assign a Key Vault access policy](assign-access-policy-portal.md)

> [!IMPORTANT]
> Key Vault access policies apply at the vault level. When a user is granted permission to create and delete keys, they can perform those operations on all keys in that key vault.
Key Vault access policies don't support granular, object-level permissions like a specific key, secret, or certificate. 
>

## Data plane and Azure RBAC (preview)

Azure role-based access control is an alternative permission model to control access to Azure Key Vault data plane, which can be enabled on individual key vaults. Azure RBAC permission model is exclusive and once is set, vault access policies became inactive. Azure Key Vault defines a set of Azure built-in roles that encompass common sets of permissions used to access keys, secrets, or certificates.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the key vault, or an individual key, secret, or certificate. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

Key benefits of using Azure RBAC permission over vault access policies are centralized access control management and its integration with [Privileged Identity Management (PIM)](../../active-directory/privileged-identity-management/pim-configure.md). Privileged Identity Management provides time-based and approval-based role activation to mitigate the risks of excessive, unnecessary, or misused access permissions on resources that you care about.

For more information about Key Vault data plane with Azure RBAC, see [Key Vault keys, certificates, and secrets with an Azure role-based access control](rbac-guide.md)

## Firewalls and virtual networks

For an additional layer of security, you can configure firewalls and virtual network rules. You can configure Key Vault firewalls and virtual networks to deny access to traffic from all networks (including internet traffic) by default. You can grant access to traffic from specific [Azure virtual networks](../../virtual-network/virtual-networks-overview.md) and public internet IP address ranges, allowing you to build a secure network boundary for your applications.

Here are some examples of how you might use service endpoints:

* You are using Key Vault to store encryption keys, application secrets, and certificates, and you want to block access to your key vault from the public internet.
* You want to lock down access to your key vault so that only your application, or a short list of designated hosts, can connect to your key vault.
* You have an application running in your Azure virtual network, and this virtual network is locked down for all inbound and outbound traffic. Your application still needs to connect to Key Vault to fetch secrets or certificates, or use cryptographic keys.

For more information about Key Vault firewall and virtual networks, see [Configure Azure Key Vault firewalls and virtual networks](network-security.md)

> [!NOTE]
> Key Vault firewalls and virtual network rules only apply to the data plane of Key Vault. Key Vault control plane operations (such as create, delete, and modify operations, setting access policies, setting firewalls, and virtual network rules) are not affected by firewalls and virtual network rules.

## Private endpoint connection

In case of a need to completely block Key Vault exposure to the public, an [Azure Private Endpoint](../../private-link/private-endpoint-overview.md) can be used. An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

Common scenarios for using Private Link for Azure services:

- **Privately access services on the Azure platform**: Connect your virtual network to services in Azure without a public IP address at the source or destination. Service providers can render their services in their own virtual network and consumers can access those services in their local virtual network. The Private Link platform will handle the connectivity between the consumer and services over the Azure backbone network. 
 
- **On-premises and peered networks**: Access services running in Azure from on-premises over ExpressRoute private peering, VPN tunnels, and peered virtual networks using private endpoints. There's no need to setup public peering or traverse the internet to reach the service. Private Link provides a secure way to migrate workloads to Azure.
 
- **Protection against data leakage**: A private endpoint is mapped to an instance of a PaaS resource instead of the entire service. Consumers can only connect to the specific resource. Access to any other resource in the service is blocked. This mechanism provides protection against data leakage risks. 
 
- **Global reach**: Connect privately to services running in other regions. The consumer's virtual network could be in region A and it can connect to services behind Private Link in region B.  
 
- **Extend to your own services**: Enable the same experience and functionality to render your service privately to consumers in Azure. By placing your service behind a standard Azure Load Balancer, you can enable it for Private Link. The consumer can then connect directly to your service using a private endpoint in their own virtual network. You can manage the connection requests using an approval call flow. Azure Private Link works for consumers and services belonging to different Azure Active Directory tenants. 

For more information about private endpoints, see [Key Vault with Azure Private Link](./private-link-service.md)

## Example

In this example, we're developing an application that uses a certificate for TLS/SSL, Azure Storage to store data, and an RSA 2,048-bit key for encrypting data in Azure Storage. Our application runs in an Azure virtual machine (VM) (or a virtual machine scale set). We can use a key vault to store the application secrets. We can store the bootstrap certificate that's used by the application to authenticate with Azure AD.

We need access to the following stored keys and secrets:
- **TLS/SSL certificate**: Used for TLS/SSL.
- **Storage key**: Used to access the Storage account.
- **RSA 2,048-bit key**: Used for wrap/unwrap data encryption key by Azure Storage.
- **Application Managed Identity**: Used to authenticate with Azure AD. After access to Key Vault is granted, application can fetch the storage key and certificate.

We need to define the following roles to specify who can manage, deploy, and audit our application:
- **Security team**: IT staff from the office of the CSO (Chief Security Officer) or similar contributors. The security team is responsible for the proper safekeeping of secrets. The secrets can include TLS/SSL certificates, RSA keys for encryption, connection strings, and storage account keys.
- **Developers and operators**: The staff who develop the application and deploy it in Azure. The members of this team aren't part of the security staff. They shouldn't have access to sensitive data like TLS/SSL certificates and RSA keys. Only the application that they deploy should have access to sensitive data.
- **Auditors**: This role is for contributors who aren't members of the development or general IT staff. They review the use and maintenance of certificates, keys, and secrets to ensure compliance with security standards.

There's another role that's outside the scope of our application: the subscription (or resource group) administrator. The subscription admin sets up initial access permissions for the security team. They grant access to the security team by using a resource group that has the resources required by the application.

We need to authorize the following operations for our roles:

**Security team**
- Create key vaults.
- Turn on Key Vault logging.
- Add keys and secrets.
- Create backups of keys for disaster recovery.
- Set Key Vault access policies and assign roles to grant permissions to users and applications for specific operations.
- Roll the keys and secrets periodically.

**Developers and operators**
- Get references from the security team for the bootstrap and TLS/SSL certificates (thumbprints), storage key (secret URI), and RSA key (key URI) for wrap/unwrap.
- Develop and deploy the application to access certificates and secrets programmatically.

**Auditors**
- Review the Key Vault logs to confirm proper use of keys and secrets, and compliance with data security standards.

The following table summarizes the access permissions for our roles and application.

| Role | Management plane permissions | Data plane permissions - vault access policies | Data plane permissions -Azure RBAC  |
| --- | --- | --- | --- |
| Security team | [Key Vault Contributor](../../role-based-access-control/built-in-roles.md#key-vault-contributor) | Certificates: all operations <br> Keys: all operations <br> Secrets: all operations | [Key Vault Administrator](../../role-based-access-control/built-in-roles.md#key-vault-administrator) |
| Developers and&nbsp;operators | Key Vault deploy permission<br><br> **Note**: This permission allows deployed VMs to fetch secrets from a key vault. | None | None |
| Auditors | None | Certificates: list <br> Keys: list<br>Secrets: list<br><br> **Note**: This permission enables auditors to inspect attributes (tags, activation dates, expiration dates) for keys and secrets not emitted in the logs. | [Key Vault Reader](../../role-based-access-control/built-in-roles.md#key-vault-reader) |
| Azure Storage Account | None | Keys: get, list, wrapKey, unwrapKey <br> | [Key Vault Crypto Service Encryption User](../../role-based-access-control/built-in-roles.md#key-vault-crypto-service-encryption-user) |
| Application | None | Secrets: get, list <br> Certificates: get, list | [Key Vault Reader](../../role-based-access-control/built-in-roles.md#key-vault-reader), [Key Vault Secret User](../../role-based-access-control/built-in-roles.md#key-vault-secrets-user) |

The three team roles need access to other resources along with Key Vault permissions. To deploy VMs (or the Web Apps feature of Azure App Service), developers and operators need deploy access. Auditors need read access to the Storage account where the Key Vault logs are stored.

Our example describes a simple scenario. Real-life scenarios can be more complex. You can adjust permissions to your key vault based on your needs. We assumed the security team provides the key and secret references (URIs and thumbprints), which are used by the DevOps staff in their applications. Developers and operators don't require any data plane access. We focused on how to secure your key vault.

> [!NOTE]
> This example shows how Key Vault access is locked down in production. Developers should have their own subscription or resource group with full permissions to manage their vaults, VMs, and the storage account where they develop the application.

## Resources

- [About Azure Key Vault](overview.md)
- [Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md)
- [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md)
- [Azure RBAC](../../role-based-access-control/overview.md)
- [Private Link](../../private-link/private-link-overview.md)

## Next steps

[Authenticate to Azure Key Vault](authentication.md)

[Assign a Key Vault access policy](assign-access-policy-portal.md)

[Assign Azure role to access to keys, secrets, and certificates](rbac-guide.md)

[Configure Key Vault firewalls and virtual networks](network-security.md)

[Establish a private link connection to Key Vault](private-link-service.md)
