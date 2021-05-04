---
title: Azure Managed HSM access control
description: Manage access permissions for Azure Managed HSM and keys. Covers the authentication and authorization model for Managed HSM, and how to secure your HSMs.
services: key-vault
author: amitbapat
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: ambapat
# Customer intent: As the admin for managed HSMs, I want to set access policies and configure the Managed HSM, so that I can ensure it's secure and auditors can properly monitor all activities for these managed HSMs.
---

# Managed HSM access control

> [!NOTE]
> Key Vault resource provider supports two resource types: **vaults** and **managed HSMs**. Access control described in this article only applies to **managed HSMs**. To learn more about access control for managed HSM, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../general/rbac-guide.md).

Azure Key Vault Managed HSM is a cloud service that safeguards encryption keys. Because this data is sensitive and business critical, you need to secure access to your managed HSMs by allowing only authorized applications and users to access it. This article provides an overview of the Managed HSM access control model. It explains authentication and authorization, and describes how to secure access to your managed HSMs.

## Access control model

Access to a managed HSM is controlled through two interfaces: the **management plane** and the **data plane**. The management plane is where you manage the HSM itself. Operations in this plane include creating and deleting managed HSMs and retrieving managed HSM properties. The data plane is where you work with the data stored in an managed HSM -- that is HSM-backed encryption keys. You can add, delete, modify, and use keys to perform cryptographic operations, manage role assignments to control access to the  keys, create a full HSM backup, restore full backup, and manage security domain from the data plane interface.

To access a managed HSM in either plane, all callers must have proper authentication and authorization. Authentication establishes the identity of the caller. Authorization determines which operations the caller can execute. A caller can be any one of the [security principals](../../role-based-access-control/overview.md#security-principal) defined in Azure Active Directory - user, group, service principal or managed identity.

Both planes use Azure Active Directory for authentication. For authorization they use different systems as follows
- The management plane uses Azure role-based access control -- Azure RBAC -- an authorization system built on Azure Azure Resource Manager 
- The data plane uses a managed HSM-level RBAC (Managed HSM local RBAC) -- an authorization system implemented and enforced at the managed HSM level.

When a managed HSM is created, the requestor also provides a list of data plane administrators (all [security principals](../../role-based-access-control/overview.md#security-principal) are supported). Only these administrators are able to access the managed HSM data plane to perform key operations and manage data plane role assignments (Managed HSM local RBAC).

Permission model for both planes uses the same syntax, but they are enforced at different levels and role assignments use different scopes. Management plane Azure RBAC is enforced by Azure Resource Manager while data plane Managed HSM local RBAC is enforced by managed HSM itself.

> [!IMPORTANT]
> Granting a security principal management plane access to an managed HSM does not grant them any access to data plane to access keys or data plane role assignments Managed HSM local RBAC). This isolation is by design to prevent inadvertent expansion of privileges affecting access to keys stored in Managed HSM.

For example, a subscription administrator (since they have "Contributor" permission to all resources in the subscription) can delete an managed HSM in their subscription, but if they don't have data plane access specifically granted through Managed HSM local RBAC, they cannot gain access to keys or manage role assignment in the managed HSM to grant themselves or others access to data plane.

## Azure Active Directory authentication

When you create an managed HSM in an Azure subscription, it's automatically associated with the Azure Active Directory tenant of the subscription. All callers in both planes must be registered in this tenant and authenticate to access the managed HSM.

The application authenticates with Azure Active Directory before calling either plane. The application can use any [supported authentication method](../../active-directory/develop/authentication-vs-authorization.md) based on the application type. The application acquires a token for a resource in the plane to gain access. The resource is an endpoint in the management or data plane, based on the Azure environment. The application uses the token and sends a REST API request to Managed HSM endpoint. To learn more, review the [whole authentication flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

The use of a single authentication mechanism for both planes has several benefits:

- Organizations can control access centrally to all managed HSMs in their organization.
- If a user leaves, they instantly lose access to all managed HSMs in the organization.
- Organizations can customize authentication by using the options in Azure Active Directory, such as to enable multi-factor authentication for added security.

## Resource endpoints

Security principals access the planes through endpoints. The access controls for the two planes work independently. To grant an application access to use keys in an managed HSM, you grant data plane access by using Managed HSM local RBAC. To grant a user access to Managed HSM resource to create, read, delete, move the managed HSMs and edit other properties and tags you use Azure RBAC.

The following table shows the endpoints for the management and data planes.

| Access&nbsp;plane | Access endpoints | Operations | Access control mechanism |
| --- | --- | --- | --- |
| Management plane | **Global:**<br> management.azure.com:443<br> | Create, read, update, delete, and move managed HSMs<br>Set managed HSM tags | Azure RBAC |
| Data plane | **Global:**<br> &lt;hsm-name&gt;.managedhsm.azure.net:443<br> | **Keys**: decrypt, encrypt,<br> unwrap, wrap, verify, sign, get, list, update, create, import, delete, backup, restore, purge<br/><br/> **Data plane role-management (Managed HSM local RBAC)***: list role definitions, assign roles, delete role assignments, define custom roles<br/><br/>**Backup/restore**: backup, restore, check status backup/restore operations <br/><br/>**Security domain**: download and upload security domain | Managed HSM local RBAC |
|||||

## Management plane and Azure RBAC

In the management plane, you use Azure RBAC to authorize the operations a caller can execute. In the Azure RBAC model, each Azure subscription has an instance of Azure Active Directory. You grant access to users, groups, and applications from this directory. Access is granted to manage resources in the Azure subscription that use the Azure Resource Manager deployment model. To grant access, use the [Azure portal](https://portal.azure.com/), the [Azure CLI](/cli/azure/install-classic-cli), [Azure PowerShell](/powershell/azureps-cmdlets-docs), or the [Azure Resource Manager REST APIs](/rest/api/authorization/roleassignments).

You create a key vault in a resource group and manage access by using Azure Active Directory. You grant users or groups the ability to manage the key vaults in a resource group. You grant the access at a specific scope level by assigning appropriate Azure roles. To grant access to a user to manage key vaults, you assign a predefined `key vault Contributor` role to the user at a specific scope. The following scopes levels can be assigned to an Azure role:

- **Management group**:  An Azure role assigned at the subscription level applies to all the subscriptions in that management group.
- **Subscription**: An Azure role assigned at the subscription level applies to all resource groups and resources within that subscription.
- **Resource group**: An Azure role assigned at the resource group level applies to all resources in that resource group.
- **Specific resource**: An Azure role assigned for a specific resource applies to that resource. In this case, the resource is a specific key vault.

There are several predefined roles. If a predefined role doesn't fit your needs, you can define your own role. For more information, see [Azure RBAC: Built-in roles](../../role-based-access-control/built-in-roles.md).

## Data plane and Managed HSM local RBAC

You grant a security principal access to execute specific key operations by assigning a role. For each role assignment you need to specify a role and scope over which that assignment applies. For Managed HSM local RBAC two scopes are available.

- **"/" or "/keys"**: HSM level scope. Security principals assigned a role at this scope can perform the operations defined in the role for all objects (keys) in the managed HSM.
- **"/keys/&lt;key-name&gt;"**: Key level scope. Security principals assigned a role at this scope can perform the operations defined in this role for all versions of the specified key only.

## Next steps

- For a getting-started tutorial for an administrator, see [What is Managed HSM?](overview.md)
- For a role management tutorial, see [Managed HSM local RBAC](role-management.md)
- For more information about usage logging for Managed HSM logging, see [Managed HSM logging](logging.md)