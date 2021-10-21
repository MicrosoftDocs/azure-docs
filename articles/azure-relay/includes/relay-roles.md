---
author: spelluru
ms.service: service-bus-relay
ms.topic: include
ms.date: 07/19/2021
ms.author: spelluru
---

## Overview
When a security principal (a user, group, application) attempts to access a Relay entity, the request must be authorized. With Azure AD, access to a resource is a two-step process.

1. First, the security principal’s identity is **authenticated**, and an OAuth 2.0 token is returned. The resource name to request a token is `https://relay.azure.net`. If an application is running within an Azure entity such as an Azure VM, a virtual machine scale set, or an Azure Function app, it can use a managed identity to access the resources.
2. Next, the token is passed as part of a request to the Relay service to **authorize** access to the specified resource (hybrid connections, WCF relays). Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Relay defines a set of Azure built-in roles that encompass common sets of permissions used to access Relay entities. You can also define custom roles for accessing the data. For a list of built-in roles supported by Azure Relay, see [Azure Built-in roles for Azure Relay](#azure-built-in-roles-for-azure-relay). Native applications and web applications that make requests to Relay can also authorize with Azure AD.  

## Azure built-in roles for Azure Relay
For Azure Relay, the management of namespaces and all related resources through the Azure portal and the Azure resource management API is already protected using the Azure RBAC model. Azure provides the below Azure built-in roles for authorizing access to a Relay namespace:

| Role | Description | 
| ---- | ----------- | 
| [Azure Relay Owner](../../role-based-access-control/built-in-roles.md#azure-relay-owner) | Use this role to grant **full** access to Azure Relay resources. |
| [Azure Relay Listener](../../role-based-access-control/built-in-roles.md#azure-relay-listener) | Use this role to grant **listen and entity read** access to Azure Relay resources. |
| [Azure Relay Sender](../../role-based-access-control/built-in-roles.md#azure-relay-sender) | Use this role to grant **send and entity read** access to Azure Relay resources. | 

## Resource scope
Before you assign an Azure role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Azure Relay resources, starting with the narrowest scope:

- **Relay entities**: Role assignment applies to a specific Relay entity like a hybrid connection or a WCF relay.
- **Relay namespace**: Role assignment applies to all the Relay entities under the namespace.
- **Resource group**: Role assignment applies to all the Relay resources under the resource group.
- **Subscription**: Role assignment applies to all the Relay resources in all of the resource groups in the subscription.

> [!NOTE]
> Keep in mind that Azure role assignments may take up to five minutes to propagate. For more information about how built-in roles are defined, see [Understand role definitions](../../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md). 

