---
title: Use Microsoft Entra ID groups to manage permissions in Azure Data Manager for Energy
description: Learn how to use Microsoft Entra ID security groups with OSDU entitlement groups in Azure Data Manager for Energy.
author: atinb
ms.author: atinb
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 11/03/2026
---

# Use Microsoft Entra ID groups to manage permissions in Azure Data Manager for Energy

Azure Data Manager for Energy uses OSDU entitlement groups to control access to services and data. You can add a Microsoft Entra ID security group to an OSDU entitlement group instead of adding each user individually.

Microsoft Entra ID manages the membership of the security group. The OSDU entitlement group defines the permissions that members receive in Azure Data Manager for Energy.

## Why use Microsoft Entra ID groups?

Using Microsoft Entra ID groups provides the following benefits:

- Manage user membership centrally in Microsoft Entra ID.
- Simplify access changes when users join, change roles, or leave the organization.
- Avoid adding and removing individual users in multiple systems.
- Use direct, dynamic, or nested Microsoft Entra ID group membership.
- Continue using OSDU entitlement groups and access control lists (ACLs) to define access to Azure Data Manager for Energy services and data.

Azure Data Manager for Energy doesn't copy Microsoft Entra ID group membership. When a user calls Azure Data Manager for Energy, the service evaluates the user's current group membership through Microsoft Graph and applies the permissions of the associated OSDU entitlement groups.

### Use advanced Microsoft Entra capabilities for privileged access

You can apply Microsoft Entra governance capabilities, such as Conditional Access, access reviews, dynamic group membership, and just-in-time access, to groups used with Azure Data Manager for Energy.

For groups that grant high-privilege permissions, consider using Microsoft Entra Privileged Identity Management (PIM) for Groups. PIM allows eligible users to activate time-bound group membership instead of maintaining standing access.

> [!NOTE]
> Microsoft Entra licensing, configuration, and organizational policies determine which governance capabilities are available.
>
> PIM for Groups doesn't support dynamic membership groups or groups synchronized from an on-premises directory. Choose a supported group type when using PIM for time-bound membership. For more information, see [PIM for Groups](/entra/id-governance/privileged-identity-management/concept-pim-for-groups#relationship-between-role-assignable-groups-and-pim-for-groups).

## Prerequisites

Before you begin, ensure that you have:

- An Azure Data Manager for Energy instance and target data partition.
- A Bash environment with curl installed, such as [Azure Cloud Shell](../cloud-shell/overview.md).
- A Microsoft Entra ID security group and its object ID.
- The identifier of the target OSDU entitlement group.
- An account authorized to add members to the target OSDU entitlement group. For information about group ownership and permissions, see [Entitlement concepts](concepts-entitlements.md#users).
- A delegated user access token with the `https://energy.azure.com/.default` scope. For an Azure CLI example that retrieves a token with this scope, see the [Microsoft-provided delegated-token test sample](https://github.com/microsoft/adme-samples/blob/main/entra-id-groups-authorization/src/test.sh).

> [!IMPORTANT]
> Existing customers might need a tenant administrator to migrate to the current Azure Data Manager for Energy Microsoft first-party application. To determine the migration state and review the migration and consent requirements, see [Enable Microsoft Entra ID groups authorization](https://github.com/microsoft/adme-samples/blob/main/entra-id-groups-authorization/how-to-enable-entra-id-groups-authorization.md). Contact Microsoft support if you need assistance.

## Add a Microsoft Entra ID group to an OSDU entitlement group

### Get the Microsoft Entra ID group object ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Browse to **Entra ID** > **Groups** > **All groups**.
1. Select the security group whose members should receive access.
1. On the group's overview page, copy its **Object ID**.

The object ID is a GUID, for example:

```text
11111111-2222-3333-4444-555555555555
```

Use the object ID, not the group's display name or email address, in the Entitlements API request.

### Choose the OSDU entitlement group

Choose the OSDU entitlement group that provides the required service or data permissions in the target data partition.

Run the following requests in a Bash environment with curl installed. Replace the placeholders before running each request.

| Placeholder | Replacement |
|---|---|
| `<instance>` | Your instance hostname, such as `my-instance.energy.azure.com`. Don't include `https://`. |
| `<access-token>` | Your delegated user access token. |
| `<data-partition-id>` | The target data partition ID. |
| `<osdu-group>` | The complete OSDU entitlement-group identifier, including its partition and domain. |
| `<entra-group-object-id>` | The Microsoft Entra ID security group's object ID. |
| `<member-role>` | `MEMBER` for access through the group, or `OWNER` for group administration. |

Use `MEMBER` unless the Microsoft Entra ID group's members need to administer the OSDU entitlement group. OSDU membership roles are separate from Microsoft Entra group ownership.

To list the groups available to you in a data partition, use the following request:

```bash
curl --request GET \
  --url "https://<instance>/api/entitlements/v2/groups/" \
  --header "Authorization: Bearer <access-token>" \
  --header "data-partition-id: <data-partition-id>"
```

For information about OSDU group types and naming, see [Entitlement concepts in Azure Data Manager for Energy](concepts-entitlements.md).

### Add the group

Use the Entitlements API add-member operation. Pass the Microsoft Entra ID group object ID in the `email` property:

```bash
curl --request POST \
  --url "https://<instance>/api/entitlements/v2/groups/<osdu-group>/members" \
  --header "Authorization: Bearer <access-token>" \
  --header "data-partition-id: <data-partition-id>" \
  --header "Content-Type: application/json" \
  --data '{
    "email": "<entra-group-object-id>",
    "role": "<member-role>"
  }'
```

> [!NOTE]
> This operation adds a reference to the Microsoft Entra ID group. It doesn't copy the group's users into Azure Data Manager for Energy.

## Verify access

Use a test user who is a direct or nested member of the Microsoft Entra ID group:

1. Acquire a new delegated user token with the `https://energy.azure.com/.default` scope.
1. Call an Azure Data Manager for Energy API protected by the target OSDU entitlement group.
1. Confirm that the user receives the expected access.

## Considerations

- Using Microsoft Entra ID groups is optional. You can continue to add individual user object IDs to OSDU entitlement groups.
- The capability applies to user-delegated calls. Application-only calls don't include the user context required for group expansion.
- OSDU entitlement groups and memberships are scoped to a data partition. Configure access in each applicable data partition.

## Next steps

- [Manage users in Azure Data Manager for Energy](how-to-manage-users.md)
- [Entitlement concepts in Azure Data Manager for Energy](concepts-entitlements.md)
- [Generate an auth token for Azure Data Manager for Energy](how-to-generate-auth-token.md)
- [Microsoft Entra Privileged Identity Management for Groups](/entra/id-governance/privileged-identity-management/concept-pim-for-groups)
