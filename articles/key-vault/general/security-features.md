---
title: Azure Key Vault security overview
description: An overview of security features and best practices for Azure Key Vault.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 09/25/2022
ms.author: mbaldwin
#Customer intent: As a key vault administrator, I want to learn the options available to secure my vaults
---

# Azure Key Vault security

Azure Key Vault protects cryptographic keys, certificates (and the private keys associated with the certificates), and secrets (such as connection strings and passwords) in the cloud. When storing sensitive and business critical data, however, you must take steps to maximize the security of your vaults and the data stored in them.

This article provides an overview of security features and best practices for Azure Key Vault.

> [!NOTE]
> For a comprehensive list of Azure Key Vault security recommendations see the [Security baseline for Azure Key Vault](security-baseline.md).

## Network security

You can reduce the exposure of your vaults by specifying which IP addresses have access to them. The virtual network service endpoints for Azure Key Vault allow you to restrict access to a specified virtual network. The endpoints also allow you to restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to your key vault from outside those sources is denied access.  For full details, see [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md)

After firewall rules are in effect, users can only read data from Key Vault when their requests originate from allowed virtual networks or IPv4 address ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. For implementation steps, see [Configure Azure Key Vault firewalls and virtual networks](network-security.md)

Azure Private Link Service enables you to access Azure Key Vault and Azure hosted customer/partner services over a Private Endpoint in your virtual network. An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.  For implementation steps, see [Integrate Key Vault with Azure Private Link](private-link-service.md)

## TLS and HTTPS

- The Key Vault front end (data plane) is a multi-tenant server. This means that key vaults from different customers can share the same public IP address. In order to achieve isolation, each HTTP request is authenticated and authorized independently of other requests.
- You may identify older versions of TLS to report vulnerabilities but because the public IP address is shared, it is not possible for key vault service team to disable old versions of TLS for individual key vaults at transport level.
- The HTTPS protocol allows the client to participate in TLS negotiation. **Clients can enforce the version of TLS**, and whenever a client does so, the entire connection will use the corresponding level protection. Applications that are communicating with or authenticating against Microsoft Entra ID might not work as expected if they are NOT able to use TLS 1.2 to communicate.
- Despite known vulnerabilities in TLS protocol, there is no known attack that would allow a malicious agent to extract any information from your key vault when the attacker initiates a connection with a TLS version that has vulnerabilities. The attacker would still need to authenticate and authorize itself, and as long as legitimate clients always connect with TLS 1.2 version, there is no way that credentials could have been leaked from vulnerabilities at old TLS versions.

> [!NOTE]
> For Azure Key Vault, ensure that the application accessing the Keyvault service should be running on a platform that supports TLS 1.2. If the application is dependent on .NET Framework, it should be updated as well. You can also make the registry changes mentioned in [this article](/troubleshoot/azure/active-directory/enable-support-tls-environment) to explicitly enable the use of TLS 1.2 at OS level and for .NET Framework. To meet with compliance obligations and to improve security posture, Key Vault connections via TLS 1.0 & 1.1 are considered a security risk, and any connections using old TLS protocols will be disallowed starting June 2023. You can monitor TLS version used by clients by monitoring Key Vault logs with sample Kusto query [here](monitor-key-vault.md#sample-kusto-queries).

> [!WARNING]
> TLS 1.0 and 1.1 is deprecated by Microsoft Entra ID and tokens to access key vault may not longer be issued for users or services requesting them with deprecated protocols. This may lead to loss of access to Key vaults. More information on Microsoft Entra TLS support can be found in [Microsoft Entra TLS 1.1 and 1.0 deprecation](/troubleshoot/azure/active-directory/enable-support-tls-environment/#why-this-change-is-being-made)

## Key Vault authentication options

When you create a key vault in an Azure subscription, it's automatically associated with the Microsoft Entra tenant of the subscription. All callers in both planes must register in this tenant and authenticate to access the key vault. In both cases, applications can access Key Vault in three ways:

- **Application-only**: The application represents a service principal or managed identity. This identity is the most common scenario for applications that periodically need to access certificates, keys, or secrets from the key vault. For this scenario to work, the `objectId` of the application must be specified in the access policy and the `applicationId` must _not_ be specified or must be `null`.
- **User-only**: The user accesses the key vault from any application registered in the tenant. Examples of this type of access include Azure PowerShell and the Azure portal. For this scenario to work, the `objectId` of the user must be specified in the access policy and the `applicationId` must _not_ be specified or must be `null`.
- **Application-plus-user** (sometimes referred as _compound identity_): The user is required to access the key vault from a specific application _and_ the application must use the on-behalf-of authentication (OBO) flow to impersonate the user. For this scenario to work, both `applicationId` and `objectId` must be specified in the access policy. The `applicationId` identifies the required application and the `objectId` identifies the user. Currently, this option isn't available for data plane Azure RBAC.

In all types of access, the application authenticates with Microsoft Entra ID. The application uses any [supported authentication method](../../active-directory/develop/authentication-vs-authorization.md) based on the application type. The application acquires a token for a resource in the plane to grant access. The resource is an endpoint in the management or data plane, based on the Azure environment. The application uses the token and sends a REST API request to Key Vault. To learn more, review the [whole authentication flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

The model of a single mechanism for authentication to both planes has several benefits:

- Organizations can control access centrally to all key vaults in their organization.
- If a user leaves, they instantly lose access to all key vaults in the organization.
- Organizations can customize authentication by using the options in Microsoft Entra ID, such as to enable multi-factor authentication for added security.

For more information, see [Key Vault authentication fundamentals](authentication.md).

## Access model overview

Access to a key vault is controlled through two interfaces: the **management plane** and the **data plane**. The management plane is where you manage Key Vault itself. Operations in this plane include creating and deleting key vaults, retrieving Key Vault properties, and updating access policies. The data plane is where you work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

Both planes use [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) for authentication. For authorization, the management plane uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and the data plane uses a [Key Vault access policy](./assign-access-policy-portal.md) and [Azure RBAC for Key Vault data plane operations](./rbac-guide.md).

To access a key vault in either plane, all callers (users or applications) must have proper authentication and authorization. Authentication establishes the identity of the caller. Authorization determines which operations the caller can execute. Authentication with Key Vault works in conjunction with [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md), which is responsible for authenticating the identity of any given **security principal**.

A security principal is an object that represents a user, group, service, or application that's requesting access to Azure resources. Azure assigns a unique **object ID** to every security principal.

- A **user** security principal identifies an individual who has a profile in Microsoft Entra ID.
- A **group** security principal identifies a set of users created in Microsoft Entra ID. Any roles or permissions assigned to the group are granted to all of the users within the group.
- A **service principal** is a type of security principal that identifies an application or service, which is to say, a piece of code rather than a user or group. A service principal's object ID is known as its **client ID** and acts like its username. The service principal's **client secret** or **certificate** acts like its password. Many Azure Services supports assigning [Managed Identity](../../active-directory/managed-identities-azure-resources/overview.md) with automated management of **client ID** and **certificate**. Managed identity is the most secure and recommended option for authenticating within Azure.

For more information about authentication to Key Vault, see [Authenticate to Azure Key Vault](authentication.md).

## Conditional access

Key Vault provides support for Microsoft Entra Conditional Access policies. By using Conditional Access policies, you can apply the right access controls to Key Vault when needed to keep your organization secure and stay out of your user's way when not needed.

For more information, see [Conditional Access overview](../../active-directory/conditional-access/overview.md)

## Privileged access

Authorization determines which operations the caller can perform. Authorization in Key Vault uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) on management plane and either Azure RBAC or Azure Key Vault access policies on data plane.

Access to vaults takes place through two interfaces or planes. These planes are the management plane and the data plane.

- The *management plane* is where you manage Key Vault itself and it is the interface used to create and delete vaults. You can also read key vault properties and manage access policies.
- The *data plane* allows you to work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

Applications access the planes through endpoints. The access controls for the two planes work independently. To grant an application access to use keys in a key vault, you grant data plane access by using Azure RBAC or a Key Vault access policy. To grant a user read access to Key Vault properties and tags, but not access to data (keys, secrets, or certificates), you grant management plane access with Azure RBAC.

The following table shows the endpoints for the management and data planes.

| Access&nbsp;plane | Access endpoints | Operations | Access&nbsp;control mechanism |
| --- | --- | --- | --- |
| Management plane | **Global:**<br> management.azure.com:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> management.chinacloudapi.cn:443<br><br> **Azure US Government:**<br> management.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> management.microsoftazure.de:443 | Create, read, update, and delete key vaults<br><br>Set Key Vault access policies<br><br>Set Key Vault tags | Azure RBAC |
| Data plane | **Global:**<br> &lt;vault-name&gt;.vault.azure.net:443<br><br> **Microsoft Azure operated by 21Vianet:**<br> &lt;vault-name&gt;.vault.azure.cn:443<br><br> **Azure US Government:**<br> &lt;vault-name&gt;.vault.usgovcloudapi.net:443<br><br> **Azure Germany:**<br> &lt;vault-name&gt;.vault.microsoftazure.de:443 | Keys: encrypt, decrypt, wrapKey, unwrapKey, sign, verify, get, list, create, update, import, delete, recover, backup, restore, purge, rotate (preview), getrotationpolicy (preview), setrotationpolicy (preview), release(preview) <br><br> Certificates: managecontacts, getissuers, listissuers, setissuers, deleteissuers, manageissuers, get, list, create, import, update, delete, recover, backup, restore, purge<br><br>  Secrets: get, list, set, delete,recover, backup, restore, purge | Key Vault access policy or Azure RBAC |

### Managing administrative access to Key Vault

When you create a key vault in a resource group, you manage access by using Microsoft Entra ID. You grant users or groups the ability to manage the key vaults in a resource group. You can grant access at a specific scope level by assigning the appropriate Azure roles. To grant access to a user to manage key vaults, you assign a predefined `key vault Contributor` role to the user at a specific scope. The following scopes levels can be assigned to an Azure role:

- **Subscription**: An Azure role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An Azure role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An Azure role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md).

> [!IMPORTANT]
> When using the Access Policy permission model, if a user has `Contributor` permissions to a key vault management plane, the user can grant themselves access to the data plane by setting a Key Vault access policy. You should tightly control who has `Contributor` role access to your key vaults with the Access Policy permission model to ensure that only authorized persons can access and manage your key vaults, keys, secrets, and certificates. It is recommended to use the new **Role Based Access Control (RBAC) permission model** to avoid this issue. With the RBAC permission model, permission management is limited to 'Owner' and 'User Access Administrator' roles, which allows separation of duties between roles for security operations and general administrative operations.

### Controlling access to Key Vault data

You can control access to Key Vault keys, certificates and secrets using Azure RBAC or Key Vault access policies. 

For more information, see
- [Azure RBAC for Key Vault data plane operations](./rbac-guide.md).
- [Key Vault access policy](./assign-access-policy-portal.md) 

## Logging and monitoring

Key Vault logging saves information about the activities performed on your vault. For full details, see [Key Vault logging](logging.md).

You can integrate Key Vault with Event Grid to be notified when the status of a key, certificate, or secret stored in key vault has changed. For details, see [Monitoring Key Vault with Azure Event Grid](event-grid-overview.md)

It is also important to monitor the health of your key vault, to make sure your service operates as intended. To learn how to do so, see [Monitoring and alerting for Azure Key Vault](alert.md).

## Backup and recovery

Azure Key Vault soft-delete and purge protection allows you to recover deleted vaults and vault objects. For full details, see [Azure Key Vault soft-delete overview](soft-delete-overview.md).

You should also take regular back ups of your vault on update/delete/create of objects within a Vault.  

## Next steps

- [Azure Key Vault security baseline](security-baseline.md)
- [Azure Key Vault best practices](security-baseline.md)
- [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md)
- [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md)
