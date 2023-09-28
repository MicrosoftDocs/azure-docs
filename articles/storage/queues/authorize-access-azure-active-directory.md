---
title: Authorize access to queues using Active Directory
titleSuffix: Azure Storage
description: Authorize access to Azure queues using Azure Active Directory (Azure AD). Assign Azure roles for access rights. Access data with an Azure AD account.
author: akashdubey-ms

ms.service: azure-queue-storage
ms.topic: conceptual
ms.date: 03/17/2023
ms.author: akashdubey

---

# Authorize access to queues using Azure Active Directory

Azure Storage supports using Azure Active Directory (Azure AD) to authorize requests to queue data. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, group, or application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can then be used to authorize a request against the Queue service.

Authorization with Azure AD provides superior security and ease of use over Shared Key authorization. Microsoft recommends using Azure AD authorization with your queue applications when possible to assure access with minimum required privileges.

Authorization with Azure AD is available for all general-purpose storage accounts in all public regions and national clouds. Only storage accounts created with the Azure Resource Manager deployment model support Azure AD authorization.

## Overview of Azure AD for queues

When a security principal (a user, group, or application) attempts to access a queue resource, the request must be authorized, unless it's a queue available for anonymous access. With Azure AD, access to a resource is a two-step process:

1. First, the security principal's identity is authenticated and an OAuth 2.0 token is returned.

    The authentication step requires that an application request an OAuth 2.0 access token at runtime. If an application is running from within an Azure entity such as an Azure VM, a Virtual Machine Scale Set, or an Azure Functions app, it can use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access queue data.

1. Next, the token is passed as part of a request to the Queue service and used by the service to authorize access to the specified resource.

    The authorization step requires that one or more Azure RBAC roles be assigned to the security principal making the request. For more information, see [Assign Azure roles for access rights](#assign-azure-roles-for-access-rights).

### Use an Azure AD account with portal, PowerShell, or Azure CLI

To learn about how to access data in the Azure portal with an Azure AD account, see [Data access from the Azure portal](#data-access-from-the-azure-portal). To learn how to call Azure PowerShell or Azure CLI commands with an Azure AD account, see [Data access from PowerShell or Azure CLI](#data-access-from-powershell-or-azure-cli).

### Use Azure AD to authorize access in application code

To authorize access to Azure Storage with Azure AD, you can use one of the following client libraries to acquire an OAuth 2.0 token:

- The Azure Identity client library is recommended for most development scenarios.
- The [Microsoft Authentication Library (MSAL)](../../active-directory/develop/msal-overview.md) may be suitable for certain advanced scenarios.

#### Azure Identity client library

The Azure Identity client library simplifies the process of getting an OAuth 2.0 access token for authorization with Azure Active Directory (Azure AD) via the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the Azure Storage client libraries for .NET, Java, Python, JavaScript, and Go integrate with the Azure Identity libraries for each of those languages to provide a simple and secure means to acquire an access token for authorization of Azure Storage requests.

An advantage of the Azure Identity client library is that it enables you to use the same code to acquire the access token whether your application is running in the development environment or in Azure. The Azure Identity client library returns an access token for a security principal. When your code is running in Azure, the security principal may be a managed identity for Azure resources, a service principal, or a user or group. In the development environment, the client library provides an access token for either a user or a service principal for testing purposes.

The access token returned by the Azure Identity client library is encapsulated in a token credential. You can then use the token credential to get a service client object to use in performing authorized operations against Azure Storage. A simple way to get the access token and token credential is to use the **DefaultAzureCredential** class that is provided by the Azure Identity client library. **DefaultAzureCredential** attempts to get the token credential by sequentially trying several different credential types. **DefaultAzureCredential** works in both the development environment and in Azure.

[!INCLUDE [storage-auth-language-table](../../../includes/storage-auth-language-table.md)]

#### Microsoft Authentication Library (MSAL)

While Microsoft recommends using the Azure Identity client library when possible, the MSAL library may be appropriate to use in certain advanced scenarios. For more information, see [Learn about MSAL](../../active-directory/develop/msal-overview.md).

When you use MSAL to acquire an OAuth token for access to Azure Storage, you need to provide an Azure AD resource ID. The Azure AD resource ID indicates the audience for which a token that is issued can be used to provide access to an Azure resource. In the case of Azure Storage, the resource ID may be specific to a single storage account, or it may apply to any storage account.

The following table describes the values that you can provide for the resource ID. The resource ID for Azure Storage is the same for all public and sovereign clouds:

| Resource ID | Description |
|---|---|
| `https://<account>.queue.core.windows.net` | The service endpoint for a given storage account. Use this value to acquire a token for authorizing requests to that specific Azure Storage account and service only. Replace the value in brackets with the name of your storage account. |
| `https://storage.azure.com/` | Use to acquire a token for authorizing requests to any Azure Storage account. |

## Assign Azure roles for access rights

Azure Active Directory (Azure AD) authorizes access rights to secured resources through Azure RBAC. Azure Storage defines a set of  built-in RBAC roles that encompass common sets of permissions used to access queue data. You can also define custom roles for access to queue data. To learn more about assigning Azure roles for queue access, see [Assign an Azure role for access to queue data](assign-azure-role-data-access.md).

An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). The RBAC roles that are assigned to a security principal determine the permissions that the principal will have. To learn more about assigning Azure roles for queue access, see [Assign an Azure role for access to queue data](assign-azure-role-data-access.md)

In some cases you may need to enable fine-grained access to queue resources or to simplify permissions when you have a large number of role assignments for a storage resource. You can use Azure attribute-based access control (Azure ABAC) to configure conditions on role assignments. You can use conditions with a [custom role](../../role-based-access-control/custom-roles.md) or select built-in roles. For more information about configuring conditions for Azure storage resources with ABAC, see [Authorize access to queues using Azure role assignment conditions](queues-auth-abac.md). For details about supported conditions for queue data operations, see [Actions and attributes for Azure role assignment conditions for Azure queues](queues-auth-abac-attributes.md).

> [!NOTE]
> When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an Azure role for access to Queue Storage. You can assign it at the level of your subscription, resource group, storage account, or queue.

### Resource scope

Before you assign an Azure RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

You can scope access to Azure queue resources at the following levels, beginning with the narrowest scope:

- **An individual queue.** At this scope, a role assignment applies to messages in the queue, and to queue properties and metadata.
- **The storage account.** At this scope, a role assignment applies to all queues and their messages.
- **The resource group.** At this scope, a role assignment applies to all of the queues in all of the storage accounts in the resource group.
- **The subscription.** At this scope, a role assignment applies to all of the queues in all of the storage accounts in all of the resource groups in the subscription.
- **A management group.** At this scope, a role assignment applies to all of the queues in all of the storage accounts in all of the resource groups in all of the subscriptions in the management group.

For more information about scope for Azure RBAC role assignments, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

### Azure built-in roles for queues

Azure RBAC provides several built-in roles for authorizing access to queue data using Azure AD and OAuth. Some examples of roles that provide permissions to data resources in Azure Storage include:

- [Storage Queue Data Contributor](../../role-based-access-control/built-in-roles.md#storage-queue-data-contributor): Use to grant read/write/delete permissions to Azure queues.
- [Storage Queue Data Reader](../../role-based-access-control/built-in-roles.md#storage-queue-data-reader): Use to grant read-only permissions to Azure queues.
- [Storage Queue Data Message Processor](../../role-based-access-control/built-in-roles.md#storage-queue-data-message-processor): Use to grant peek, retrieve, and delete permissions to messages in Azure Storage queues.
- [Storage Queue Data Message Sender](../../role-based-access-control/built-in-roles.md#storage-queue-data-message-sender): Use to grant add permissions to messages in Azure Storage queues.

To learn how to assign an Azure built-in role to a security principal, see [Assign an Azure role for access to queue data](assign-azure-role-data-access.md). To learn how to list Azure RBAC roles and their permissions, see [List Azure role definitions](../../role-based-access-control/role-definitions-list.md).

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md).

Only roles explicitly defined for data access permit a security principal to access queue data. Built-in roles such as **Owner**, **Contributor**, and **Storage Account Contributor** permit a security principal to manage a storage account, but don't provide access to the queue data within that account via Azure AD. However, if a role includes **Microsoft.Storage/storageAccounts/listKeys/action**, then a user to whom that role is assigned can access data in the storage account via Shared Key authorization with the account access keys. For more information, see [Choose how to authorize access to queue data in the Azure portal](../../storage/queues/authorize-data-operations-portal.md).

For detailed information about Azure built-in roles for Azure Storage for both the data services and the management service, see the **Storage** section in [Azure built-in roles for Azure RBAC](../../role-based-access-control/built-in-roles.md#storage). Additionally, for information about the different types of roles that provide permissions in Azure, see [Azure roles, Azure AD roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

> [!IMPORTANT]
> Azure role assignments may take up to 30 minutes to propagate.

### Access permissions for data operations

For details on the permissions required to call specific Queue service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

## Access data with an Azure AD account

Access to queue data via the Azure portal, PowerShell, or Azure CLI can be authorized either by using the user's Azure AD account or by using the account access keys (Shared Key authorization).

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

### Data access from the Azure portal

The Azure portal can use either your Azure AD account or the account access keys to access queue data in an Azure storage account. Which authorization scheme the Azure portal uses depends on the Azure roles that are assigned to you.

When you attempt to access queue data, the Azure portal first checks whether you've been assigned an Azure role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you've been assigned a role with this action, then the Azure portal uses the account key for accessing queue data via Shared Key authorization. If you haven't been assigned a role with this action, then the Azure portal attempts to access data using your Azure AD account.

To access queue data from the Azure portal using your Azure AD account, you need permissions to access queue data, and you also need permissions to navigate through the storage account resources in the Azure portal. The built-in roles provided by Azure Storage grant access to queue resources, but they don't grant permissions to storage account resources. For this reason, access to the portal also requires the assignment of an Azure Resource Manager role such as the [Reader](../../role-based-access-control/built-in-roles.md#reader) role, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable. To learn more about how to assign permissions to users for data access in the Azure portal with an Azure AD account, see [Assign an Azure role for access to queue data](assign-azure-role-data-access.md).

The Azure portal indicates which authorization scheme is in use when you navigate to a queue. For more information about data access in the portal, see [Choose how to authorize access to queue data in the Azure portal](authorize-data-operations-portal.md).

### Data access from PowerShell or Azure CLI

Azure CLI and PowerShell support signing in with Azure AD credentials. After you sign in, your session runs under those credentials. To learn more, see one of the following articles:

- [Choose how to authorize access to queue data with Azure CLI](authorize-data-operations-cli.md)
- [Run PowerShell commands with Azure AD credentials to access queue data](authorize-data-operations-powershell.md)

## Next steps

- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
- [Assign an Azure role for access to queue data](assign-azure-role-data-access.md)
