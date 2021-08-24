---
title: Reduce Azure role assignments by using conditions and principal attributes (Preview) - Azure ABAC
description: Reduce the number of Azure role assignments by using Azure attribute-based access control (Azure ABAC) conditions and Azure AD custom security attributes for principals.
services: active-directory
author: rolyon
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 09/15/2021
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to 
---

# Reduce Azure role assignments by using conditions and principal attributes (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure role-based access control (Azure RBAC) currently supports 2,000 role assignments in a subscription. If you need to create hundreds or even thousands of Azure role assignments, you might encounter this limit. Managing hundreds or thousands of role assignments can difficult. If your scenario meets the prerequisites, you might be able to reduce the number of role assignments and make it easier to manage access. This article describes a solution to reduce the number of role assignments by using Azure attribute-based access control (Azure ABAC) conditions and Azure AD custom security attributes for principals.

## Example scenario

Here is an example scenario that has the following configuration:

- Data is spread across 128 storage accounts for high performance​.
- Each storage account has 2,000 containers where there is a container for each customer.
- Each customer is represented by a unique Azure AD service principal.
- Each customer has access to objects in their container.​

This configuration would require 256,000 [Storage Blob Data Owner](built-in-roles.md#storage-blob-data-owner) role assignments in a subscription, which is well beyond the 2,000 role assignments limit.

![Diagram showing thousands for role assignments.](./media/conditions-role-assignments-reduce-example/role-assignments-multiple.png)

## Example solution

The following diagram shows a solution to reduce the 256,000 role assignments to just one role assignment by using a condition. The role assignment is at a higher resource group scope and a condition helps controls access to the containers. The condition checks whether the container name matches the custom security attribute on the service principal for the customer.

![Diagram showing one role assignment and a condition.](./media/conditions-role-assignments-reduce-example/role-assignment-condition.png)

Here is the expression in the condition that makes the solution work:

```
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name]
  StringEquals
  @Principal[Microsoft.Directory/CustomSecurityAttributes/Id:customer_name]
```

The full condition would be similar to the following:

```
(
 (
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write'})
 )
 OR 
 (
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals @Principal[Microsoft.Directory/CustomSecurityAttributes/Id:customer_name]
 )
)
```

## Steps to use this solution

Follow these steps to see if you could potentially use this solution for your scenario.

#### Step 1: Determine if you meet the prerequisites

To use this solution, you must have:

- Multiple built-in or custom role assignments that have [storage blob data actions](../storage/common/storage-auth-abac-attributes.md). These include the following built-in roles:

    - [Storage Blob Data Contributor](built-in-roles.md#storage-blob-data-contributor)
    - [Storage Blob Data Owner](built-in-roles.md#storage-blob-data-owner)
    - [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader)

#### Step 2: Identify the attributes you could use in your condition

There are several attributes you could use in your condition, such as the following:

- Container name
- Blob path
- Blob index tags [Keys]
- Blob index tags [Values in key]

You can also add your own custom security attributes for users, enterprise applications, and managed identities.

For more information, see [Azure role assignment condition format and syntax](conditions-format.md#attributes) and [What are custom security attributes in Azure AD?](../active-directory/fundamentals/custom-security-attributes-overview.md).

#### Step 3: Create a condition at a higher scope

Create one or more role assignments that use a condition at a higher scope to manage access. For more information, see [Add or edit Azure role assignment conditions using the Azure portal](conditions-role-assignments-portal.md).

## Next steps