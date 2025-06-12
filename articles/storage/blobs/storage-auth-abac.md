---
title: Authorize access to Azure Blob Storage using Azure role assignment conditions
titleSuffix: Azure Storage
description: Authorize access to Azure Blob Storage and Azure Data Lake Storage using Azure role assignment conditions and Azure attribute-based access control (Azure ABAC). Define conditions on role assignments using Blob Storage attributes.
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 04/01/2024
ms.reviewer: nachakra
---

# Authorize access to Azure Blob Storage using Azure role assignment conditions

Attribute-based access control (ABAC) is an authorization strategy that defines access levels based on attributes associated with security principals, resources, the environment, and the requests themselves. With ABAC, you can grant a security principal access to a resource based on a condition expressed as a predicate using these attributes.

Azure ABAC builds on Azure role-based access control (Azure RBAC) by adding [conditions to Azure role assignments](../../role-based-access-control/conditions-overview.md). It enables you to author role-assignment conditions based on principal, resource, request, and environment attributes.

[!INCLUDE [storage-abac-preview](../../../includes/storage-abac-preview.md)]

## Overview of conditions in Azure Storage

You can [use Microsoft Entra ID](../common/authorize-data-access.md) (Microsoft Entra ID) to authorize requests to Azure storage resources using Azure RBAC. Azure RBAC helps you manage access to resources by defining who has access to resources and what they can do with those resources, using role definitions and role assignments. Azure Storage defines a set of Azure [built-in roles](../../role-based-access-control/built-in-roles.md#storage) that encompass common sets of permissions used to access Azure storage data. You can also define custom roles with select sets of permissions. Azure Storage supports role assignments for both storage accounts and blob containers.

Azure ABAC builds on Azure RBAC by adding [role assignment conditions](../../role-based-access-control/conditions-overview.md) in the context of specific actions. A *role assignment condition* is an additional check that is evaluated when the action on the storage resource is being authorized. This condition is expressed as a predicate using attributes associated with any of the following:

- Security principal that is requesting authorization
- Resource to which access is being requested
- Parameters of the request
- Environment in which the request is made

The benefits of using role assignment conditions are:

- **Enable finer-grained access to resources** - For example, if you want to grant a user read access to blobs in your storage accounts only if the blobs are tagged as Project=Sierra, you can use conditions on the read action using tags as an attribute.
- **Reduce the number of role assignments you have to create and manage** - You can do this by using a generalized role assignment for a security group, and then restricting the access for individual members of the group using a condition that matches attributes of a principal with attributes of a specific resource being accessed (such as a blob or a container).
- **Express access control rules in terms of attributes with business meaning** - For example, you can express your conditions using attributes that represent a project name, business application, organization function, or classification level.

The trade-off of using conditions is that you need a structured and consistent taxonomy when using attributes across your organization. Attributes must be protected to prevent access from being compromised. Also, conditions must be carefully designed and reviewed for their effect.

Role-assignment conditions in Azure Storage are supported for Azure blob storage. You can also use conditions with accounts that have the [hierarchical namespace](data-lake-storage-namespace.md) (HNS) feature enabled on them (Data Lake Storage).

## Supported attributes and operations

You can configure conditions on role assignments for [DataActions](../../role-based-access-control/role-definitions.md#dataactions) to achieve these goals. You can use conditions with a [custom role](../../role-based-access-control/custom-roles.md) or select built-in roles. Note, conditions aren't supported for management [Actions](../../role-based-access-control/role-definitions.md#actions) through the [Storage resource provider](/rest/api/storagerp).

You can add conditions to built-in roles or custom roles. The built-in roles on which you can use role-assignment conditions include:

- [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader)
- [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)
- [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)

You can use conditions with custom roles as long as the role includes [actions that support conditions](storage-auth-abac-attributes.md#azure-blob-storage-actions-and-suboperations).

If you're working with conditions based on [blob index tags](storage-manage-find-blobs.md), you should use the *Storage Blob Data Owner* since permissions for tag operations are included in this role.

> [!NOTE]
> Blob index tags are not supported for Data Lake Storage storage accounts, which use a hierarchical namespace. You should not author role-assignment conditions using index tags on storage accounts that have HNS enabled.

The [Azure role assignment condition format](../../role-based-access-control/conditions-format.md) allows the use of `@Principal`, `@Resource`, `@Request` or `@Environment` attributes in the conditions. A `@Principal` attribute is a custom security attribute on a principal, such as a user, enterprise application (service principal), or managed identity. A `@Resource` attribute refers to an existing attribute of a storage resource that is being accessed, such as a storage account, a container, or a blob. A `@Request` attribute refers to an attribute or parameter included in a storage operation request. An `@Environment` attribute refers to the network environment or the date and time of a request.

[Azure RBAC supports a limited number of role assignments per subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits). If you need to create thousands of Azure role assignments, you might encounter this limit. Managing hundreds or thousands of role assignments can be difficult. In some cases, you can use conditions to reduce the number of role assignments on your storage account and make them easier to manage. You can [scale the management of role assignments](../../role-based-access-control/conditions-custom-security-attributes-example.md) using conditions and [Microsoft Entra custom security attributes](/entra/fundamentals/custom-security-attributes-overview) for principals.

## Status of condition features in Azure Storage

Azure attribute-based access control (Azure ABAC) is generally available (GA) for controlling access to Azure Blob Storage, Azure Data Lake Storage, and Azure Queues using `request`, `resource`, `environment`, and `principal` attributes in both the standard and premium storage account performance tiers. Currently, the container metadata resource attribute and the list blob include request attribute are in PREVIEW.

The following table shows the current status of ABAC by storage resource type and attribute type. Exceptions for specific attributes are also shown.

| Resource types | Attribute types    | Attributes                | Availability |
|---|---|---|---|
| Blobs<br/>Data Lake Storage<br/>Queues | Request<br/>Resource<br/>Environment<br/>Principal | All attributes except those noted in this table | GA |
| Data Lake Storage                      | Resource        | [Snapshot](storage-auth-abac-attributes.md#snapshot)           | Preview |
| Blobs<br/>Data Lake Storage            | Resource        | [Container metadata](storage-auth-abac-attributes.md#container-metadata) | Preview |
| Blobs                                       | Request         | [List blob include](storage-auth-abac-attributes.md#list-blob-include)  | Preview |

See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE] 
> Some storage features aren't supported for Data Lake Storage storage accounts, which use a hierarchical namespace (HNS). To learn more, see [Blob storage feature support](storage-feature-support-in-storage-accounts.md).
>
>The following ABAC attributes aren't supported when hierarchical namespace is enabled for a storage account:
>
> - [Blob index tags [Keys]](storage-auth-abac-attributes.md#blob-index-tags-keys)
> - [Blob index tags [Values in key]](storage-auth-abac-attributes.md#blob-index-tags-values-in-key)
> - [Version ID](storage-auth-abac-attributes.md#version-id)
> - [List blob include](storage-auth-abac-attributes.md#list-blob-include)

## Next steps

- [Prerequisites for Azure role assignment conditions](../../role-based-access-control/conditions-prerequisites.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal](storage-auth-abac-portal.md)
- [Actions and attributes for Azure role assignment conditions in Azure Storage](storage-auth-abac-attributes.md)
- [Example Azure role assignment conditions](storage-auth-abac-examples.md)
- [Troubleshoot Azure role assignment conditions](../../role-based-access-control/conditions-troubleshoot.md)

## See also

- [What is Azure attribute-based access control (Azure ABAC)?](../../role-based-access-control/conditions-overview.md)
- [FAQ for Azure role assignment conditions](../../role-based-access-control/conditions-faq.md)
- [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md)
- [Scale the management of Azure role assignments by using conditions and custom security attributes](../../role-based-access-control/conditions-custom-security-attributes-example.md)
- [Security considerations for Azure role assignment conditions in Azure Storage](storage-auth-abac-security.md)
