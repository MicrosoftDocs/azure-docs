---
title: What is Azure attribute-based access control (Azure ABAC)?
description: Get an overview of Azure attribute-based access control (Azure ABAC). Use role assignments with conditions to control access to Azure resources.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: overview
ms.workload: identity
ms.date: 04/11/2023
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to learn how to constrain access within a role assignment by using conditions.
---

# What is Azure attribute-based access control (Azure ABAC)?

Attribute-based access control (ABAC) is an authorization system that defines access based on attributes associated with security principals, resources, and the environment of an access request. With ABAC, you can grant a security principal access to a resource based on attributes. Azure ABAC refers to the implementation of ABAC for Azure.

## What are role assignment conditions?

[Azure role-based access control (Azure RBAC)](overview.md) is an authorization system that helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to. In most cases, Azure RBAC will provide the access management you need by using role definitions and role assignments. However, in some cases you might want to provide more fine-grained access management or simplify the management of hundreds of role assignments.

Azure ABAC builds on Azure RBAC by adding role assignment conditions based on attributes in the context of specific actions. A *role assignment condition* is an additional check that you can optionally add to your role assignment to provide more fine-grained access control. A condition filters down permissions granted as a part of the role definition and role assignment. For example, you can add a condition that requires an object to have a specific tag to read the object. You cannot explicitly deny access to specific resources using conditions.

## Why use conditions?

There are three primary benefits for using role assignment conditions:

- **Provide more fine-grained access control** - A role assignment uses a role definition with actions and data actions to grant security principal permissions. You can write conditions to filter down those permissions for more fine-grained access control. You can also add conditions to specific actions. For example, you can grant John read access to blobs in your subscription only if the blobs are tagged as Project=Blue. 
- **Help reduce the number of role assignments** - Each Azure subscription currently has a role assignment limit. There are scenarios that would require thousands of role assignments. All of those role assignments would have to be managed. In these scenarios, you could potentially add conditions to use significantly fewer role assignments. 
- **Use attributes that have specific business meaning** - Conditions allow you to use attributes that have specific business meaning to you in access control. Some examples of attributes are project name, software development stage, and classification levels. The values of these resource attributes are dynamic and change as users move across teams and projects.

## Example scenarios for conditions

There are several scenarios where you might want to add a condition to your role assignment. Here are some examples.

- Read access to blobs with the tag Project=Cascade
- New blobs must include the tag Project=Cascade
- Existing blobs must be tagged with at least one Project key or Program key
- Existing blobs must be tagged with a Project key and Cascade, Baker, or Skagit values
- Read, write, or delete blobs in containers named blobs-example-container
- Read access to blobs in containers named blobs-example-container with a path of readonly
- Write access to blobs in containers named Contosocorp with a path of uploads/contoso
- Read access to blobs with the tag Program=Alpine and a path of logs
- Read access to blobs with the tag Project=Baker and the user has a matching attribute Project=Baker
- Read access to blobs during a specific date/time range.
- Write access to blobs only over a private link or from a specific subnet.

For more information about how to create these examples, see [Example Azure role assignment conditions for Blob Storage](../storage/blobs/storage-auth-abac-examples.md).

## Where can conditions be added?

Currently, conditions can be added to built-in or custom role assignments that have [blob storage or queue storage data actions](conditions-format.md#actions). Conditions are added at the same scope as the role assignment. Just like role assignments, you must have `Microsoft.Authorization/roleAssignments/write` permissions to add a condition.

Here are some of the [blob storage attributes](../storage/blobs/storage-auth-abac-attributes.md#azure-blob-storage-attributes) you can use in your conditions.

- Account name
- Blob index tags
- Blob path
- Blob prefix
- Container name
- Encryption scope name
- Is Current Version
- Is hierarchical namespace enabled
- Is private link
- Snapshot
- UTC now (the current date and time in Coordinated Universal Time)
- Version ID

## What does a condition look like?

You can add conditions to new or existing role assignments. Here is the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role that has been assigned to a user named Chandra at a resource group scope. A condition has also been added that only allows read access to blobs with the tag Project=Cascade.

![Diagram of role assignment with a condition.](./media/conditions-overview/condition-role-assignment-rg.png)

If Chandra tries to read a blob without the Project=Cascade tag, access will not be allowed.

![Diagram of access is not allowed with a condition.](./media/conditions-overview/condition-access-multiple.png)

Here is what the condition looks like in the Azure portal:

:::image type="content" source="./media/shared/condition-expressions.png" alt-text="Screenshot of condition editor in Azure portal showing build expression section with values for blob index tags." lightbox="./media/shared/condition-expressions.png":::

Here is what the condition looks like in code:

```
(
    (
        !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'}
        AND NOT
        SubOperationMatches{'Blob.List'})
    )
    OR
    (
        @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEqualsIgnoreCase 'Cascade'
    )
)
```

For more information about the format of conditions, see [Azure role assignment condition format and syntax](conditions-format.md).

## Status of condition features

Some features of conditions are still in preview. The following table lists the status of condition features:

| Feature | Status | Date |
| --- | --- | --- |
| Use [environment attributes](conditions-format.md#environment-attributes) in a condition | Preview | April 2023 |
| Add conditions using the [condition editor in the Azure portal](conditions-role-assignments-portal.md) | GA | October 2022 |
| Add conditions using [Azure PowerShell](conditions-role-assignments-powershell.md), [Azure CLI](conditions-role-assignments-cli.md), or [REST API](conditions-role-assignments-rest.md) | GA | October 2022 |
| Use [resource and request attributes](conditions-format.md#attributes) for specific combinations of Azure storage resources, access attribute types, and storage account performance tiers. For more information, see [Status of condition features in Azure Storage](../storage/blobs/storage-auth-abac.md#status-of-condition-features-in-azure-storage). | GA | October 2022 |
| Use [custom security attributes on a principal](conditions-format.md#principal-attributes) in a condition | Preview | November 2021 |

<a name='conditions-and-azure-ad-pim'></a>

## Conditions and Microsoft Entra PIM

You can also add conditions to eligible role assignments using Microsoft Entra Privileged Identity Management (Microsoft Entra PIM) for Azure resources. With Microsoft Entra PIM, your end users must activate an eligible role assignment to get permission to perform certain actions. Using conditions in Microsoft Entra PIM enables you not only to limit a user's access to a resource using fine-grained conditions, but also to use Microsoft Entra PIM to secure it with a time-bound setting, approval workflow, audit trail, and so on. For more information, see [Assign Azure resource roles in Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).

## Terminology

To better understand Azure RBAC and Azure ABAC, you can refer back to the following list of terms.

| Term | Definition |
| --- | --- |
| attribute-based access control (ABAC) | An authorization system that defines access based on attributes associated with security principals, resources, and environment. With ABAC, you can grant a security principal access to a resource based on attributes. |
| Azure ABAC | Refers to the implementation of ABAC for Azure. |
| role assignment condition | An additional check that you can optionally add to your role assignment to provide more fine-grained access control. |
| attribute | In this context, a key-value pair such as Project=Blue, where Project is the attribute key and Blue is the attribute value. Attributes and tags are synonymous for access control purposes. |
| expression | A statement in a condition that evaluates to true or false. An expression has the format of &lt;attribute&gt; &lt;operator&gt; &lt;value&gt;. |

## Limits

Here are some of the limits for conditions.

| Resource | Limit | Notes |
| --- | --- | --- |
| Number of expressions per condition using the visual editor | 5 | You can add more than five expressions using the code editor |

## Known issues

Here are the known issues with conditions:

- If you are using Microsoft Entra Privileged Identity Management (PIM) and [custom security attributes](../active-directory/fundamentals/custom-security-attributes-overview.md), **Principal** does not appear in **Attribute source** when adding a condition.

## Next steps

- [FAQ for Azure role assignment conditions](conditions-faq.md)
- [Example Azure role assignment conditions for Blob Storage](../storage/blobs/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal](../storage/blobs/storage-auth-abac-portal.md)
