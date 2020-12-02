---
title: Azure Key Vault security
description: Manage access permissions for Azure Key Vault, keys, and secrets. Covers the authentication and authorization model for Key Vault, and how to secure your key vault.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 09/30/2020
ms.author: mbaldwin
#Customer intent: As a key vault administrator, I want to learn the options available to secure my vaults
---

# Azure Key Vault security

You use Azure Key Vault to protect encryption keys and secrets like certificates, connection strings, and passwords in the cloud. When storing sensitive and business critical data, you need to take steps to maximize the security of your vaults and the data stored in them.

## Identity and access management

When you create a key vault in an Azure subscription, it's automatically associated with the Azure AD tenant of the subscription. Anyone trying to manage or retrieve content from a vault must be authenticated by Azure AD.

- Authentication establishes the identity of the caller.
- Authorization determines which operations the caller can perform. Authorization in Key Vault uses a combination of [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and Azure Key Vault access policies.

### Access model overview

Access to vaults takes place through two interfaces or planes. These planes are the management plane and the data plane.

- The *management plane* is where you manage Key Vault itself and it is the interface used to create and delete vaults. You can also read key vault properties and manage access policies.
- The *data plane* allows you to work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

To access a key vault in either plane, all callers (users or applications) must be authenticated and authorized. Both planes use Azure Active Directory (Azure AD) for authentication. For authorization, the management plane uses Azure role-based access control (Azure RBAC) and the data plane uses a Key Vault access policy.

The model of a single mechanism for authentication to both planes has several benefits:

- Organizations can control access centrally to all key vaults in their organization.
- If a user leaves, they instantly lose access to all key vaults in the organization.
- Organizations can customize authentication by using the options in Azure AD, such as to enable multi-factor authentication for added security.

### Managing administrative access to Key Vault

When you create a key vault in a resource group, you manage access by using Azure AD. You grant users or groups the ability to manage the key vaults in a resource group. You can grant access at a specific scope level by assigning the appropriate Azure roles. To grant access to a user to manage key vaults, you assign a predefined `key vault Contributor` role to the user at a specific scope. The following scopes levels can be assigned to an Azure role:

- **Subscription**: An Azure role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An Azure role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An Azure role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md).

> [!IMPORTANT]
> If a user has `Contributor` permissions to a key vault management plane, the user can grant themselves access to the data plane by setting a Key Vault access policy. You should tightly control who has `Contributor` role access to your key vaults. Ensure that only authorized persons can access and manage your key vaults, keys, secrets, and certificates.

<a id="data-plane-access-control"></a>
### Controlling access to Key Vault data

Key Vault access policies grant permissions separately to keys, secrets, or certificate. You can grant a user access only to keys and not to secrets. Access permissions for keys, secrets, and certificates are managed at the vault level.

> [!IMPORTANT]
> Key Vault access policies don't support granular, object-level permissions like a specific key, secret, or certificate. When a user is granted permission to create and delete keys, they can perform those operations on all keys in that key vault.

You can set access policies for a key vault use the [Azure portal](assign-access-policy-portal.md), the [Azure CLI](assign-access-policy-cli.md), [Azure PowerShell](assign-access-policy-powershell.md), or the [Key Vault Management REST APIs](/rest/api/keyvault/).

You can restrict data plane access by using [virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md)). You can configure [firewalls and virtual network rules](network-security.md) for an additional layer of security.

## Network access

You can reduce the exposure of your vaults by specifying which IP addresses have access to them. The virtual network service endpoints for Azure Key Vault allow you to restrict access to a specified virtual network. The endpoints also allow you to restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to your key vault from outside those sources is denied access.

After firewall rules are in effect, users can only read data from Key Vault when their requests originate from allowed virtual networks or IPv4 address ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. This also affects the Key Vault Picker by other Azure services. Users might be able to see list of key vaults, but not list keys, if firewall rules prevent their client machine.

For more information on Azure Key Vault network address review [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md))

## TLS and HTTPS

*	The Key Vault front end (data plane) is a multi-tenant server. This means that key vaults from different customers can share the same public IP address. In order to achieve isolation, each HTTP request is authenticated and authorized independently of other requests.
*	You may identify older versions of TLS to report vulnerabilities but because the public IP address is shared, it is not possible for key vault service team to disable old versions of TLS for individual key vaults at transport level.
*	The HTTPS protocol allows the client to participate in TLS negotiation. **Clients can enforce the most recent version of TLS**, and whenever a client does so, the entire connection will use the corresponding level protection. The fact that Key Vault still supports older TLS versions won’t impair the security of connections using newer TLS versions.
*	Despite known vulnerabilities in TLS protocol, there is no known attack that would allow a malicious agent to extract any information from your key vault when the attacker initiates a connection with a TLS version that has vulnerabilities. The attacker would still need to authenticate and authorize itself, and as long as legitimate clients always connect with recent TLS versions, there is no way that credentials could have been leaked from vulnerabilities at old TLS versions.

## Logging and monitoring

Key Vault logging saves information about the activities performed on your vault. For full details, see [Key Vault logging](logging.md).

For recommendation on securely managing storage accounts, review the [Azure Storage security guide](../../storage/blobs/security-recommendations.md)

## Next Steps

- [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md)
- [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md)