---
title: Configure Approvals in Azure Virtual Enclaves
description: Learn how to configure the Approvals feature in Azure Virtual Enclaves to enforce governance and oversight for critical infrastructure changes.
author: aserfass-msft
ms.author: aserfass
ms.topic: how-to
ms.date: 1/26/2026
---

# Configure Approvals in Azure Virtual Enclaves

This article explains how to configure the Approvals feature in Azure Virtual Enclaves to enforce governance and oversight for critical infrastructure operations.

> [!IMPORTANT]
> 
> The Approvals feature is currently in **Preview**. Access to this preview requires enrollment and approval from the Azure Virtual Enclaves team. This feature is encouraged for testing but shouldn't be used for production workloads.

## Prerequisites

Before configuring Approvals, make sure you have:

- An active Azure subscription
- Access to the Approvals preview
- One of the following roles:
  - Community Owner
  - Community Contributor
  - Subscription Owner/Contributor
- At least one community created in your environment
- Users or groups designated as approvers

## Enable Approvals for a community in the Azure portal

Approvals are configured at the community level. You decide what resource actions require approvals and then those settings apply to all resources of that type within the community.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to your Azure Virtual Enclaves community resource.

3. In the left navigation menu, under `Settings`, select `Configuration` or `Governance`.

4. In the Approvals section, toggle the `Enable Approvals` setting to `On`.

5. Configure the approval settings for the resource actions you want to govern:

  - `Require approval for enclave creation`: Require approval before a new enclave is created.
  - `Require approval for maintenance mode changes`: Require approval before maintenance mode is changed on an enclave, including toggling it on or off.
  - `Require approval for enclave connections`: Require approval when creating or modifying enclave connections.
  - `Require approval for enclave endpoints`: Require approval when modifying enclave endpoints.
  - `Require approval for community endpoints`: Require approval when modifying community endpoints.

6. Select `Save` to apply the configuration.

---

## Assign Enclave Approver role

After enabling Approvals, assign the Enclave Approver role to users or groups who will review and approve requests.

### [Portal](#tab/portal)

1. Navigate to the subscription or resource group where you want to assign approvers.

2. In the left navigation menu, select `Access control (IAM)`.

3. Select `+ Add` > `Add role assignment`.

4. On the `Role` tab, search for and select `Enclave Approver`.

5. Select `Next`.

6. On the `Members` tab, select `+ Select members`.

7. Search for and select the users, groups, or service principals you want to designate as approvers.

8. Select `Next`, then `Review + assign`.

### [Azure CLI](#tab/cli)

Assign the Enclave Approver role at the enclave scope:

```azurecli
az role assignment create \
  --assignee <user-or-group-id> \
  --role "Enclave Approver" \
  --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Mission/enclaves/<enclave-name>"
```

Assign the Enclave Approver role at the community scope:

```azurecli
az role assignment create \
  --assignee <user-or-group-id> \
  --role "Enclave Approver" \
  --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Mission/communities/<community-name>"
```

### [PowerShell](#tab/powershell)

Assign the Enclave Approver role at enclave scope:

```azurepowershell
New-AzRoleAssignment `
  -ObjectId <user-or-group-id> `
  -RoleDefinitionName "Enclave Approver" `
  -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Mission/enclaves/<enclave-name>"
```

Assign the Enclave Approver role at community scope:

```azurepowershell
New-AzRoleAssignment `
  -ObjectId <user-or-group-id> `
  -RoleDefinitionName "Enclave Approver" `
  -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Mission/communities/<community-name>"
```

---

## Notification behavior

The Approvals feature doesn't currently provide a built-in email notification option for approval requests.

If you need notifications, create your own monitoring workflow by using Azure Activity Logs and your organization's alerting tools.

## Configure approval requirements per resource type

You can configure different approval requirements based on the type of resource or operation.

### Configure connection approval requirements

When creating an enclave endpoint, you can specify whether connections to that endpoint require approval:

1. Navigate to `Enclave Endpoints` in your enclave.

2. Select `+ Create` to create a new endpoint.

3. In the `Approval settings` section:
   - Select `Yes` under `Require approval for connections` to require approval for any connection using this endpoint.
   - Select `No` to allow connections without approval.

4. Complete the endpoint configuration and select `Create`.

## Integration with Azure Privileged Identity Management

For enhanced security, combine Approvals with Azure PIM to grant approver permissions on a time-limited basis.

### Configure PIM for Enclave Approver role

1. Navigate to `Microsoft Entra Privileged Identity Management (PIM)` in the Azure portal.

2. Select `Azure resources` > `Discover resources`.

3. Select your subscription or resource group containing the community.

4. Navigate to **Roles** and search for **Enclave Approver**.

5. Select `Enclave Approver` > `Role settings` > `Edit`.

6. Configure the role settings:
   - `Require approval to activate`: Enable this setting.
   - `Select approvers`: Choose who can approve requests for approver access.
   - `Maximum activation duration`: Set to 8 hours or less.
   - `Require multifactor authentication`: Enable for security.

7. Select `Update` to save the settings.

8. Assign users as **eligible** for the Enclave Approver role rather than assigning it permanently.

[Learn more about Azure PIM integration](./just-in-time-access.md)

## Best practices for approval configuration

When configuring Approvals in your environment:

1. **Start with high-risk operations**: Begin by requiring approval for the most critical operations, such as community endpoints and transit hub modifications

2. **Define clear approval policies**: Document which operations require approval and the criteria for approval decisions

3. **Assign multiple approvers**: Ensure at least two users have the Enclave Approver role to prevent delays when an approver is unavailable

4. **Use Azure PIM for approver access**: Grant approver permissions on a just-in-time basis for sensitive environments

5. **Plan approver workflow**: Define an operational process so approvers review pending requests promptly

6. **Regular reviews**: Periodically review which operations require approval and adjust settings based on operational experience

7. **Test the workflow**: Before rolling out to production, test the approval workflow in a development environment

## Verify approval configuration

After configuring Approvals, verify the setup is working correctly:

1. As a user with Enclave Contributor permissions, attempt to create an enclave connection that requires approval

2. Verify that the connection enters a `Pending` state.

3. As a user with Enclave Approver permissions, select `Approvals` in the enclave on the left side.

4. Verify that the pending request appears in the approval queue

5. Approve the request and verify that the connection becomes active

## Disable Approvals

If you need to disable the Approvals feature:

> [!WARNING]
> Disabling Approvals allows new operations to proceed without creating new approval requests. Existing pending approval requests remain in the queue. To avoid transition issues, review and resolve or cancel pending requests as part of your change process.

1. Navigate to your community resource in the Azure portal.

2. Select `Configuration` or `Governance` in the left navigation menu.

3. Toggle the `Enable Approvals` setting to `Off`.

4. Select `Save` to apply the changes.

## Troubleshooting

### Approvers can't see pending requests

**Cause**: The user doesn't have the Enclave Approver role or the role is assigned at the wrong scope.

**Solution**: Verify that the user has the Enclave Approver role assigned at the enclave or community level.

### Approved requests aren't being implemented

**Cause**: There might be a resource conflict or insufficient permissions to implement the change.

**Solution**: Check the Azure Activity Log for error messages and ensure the system has the necessary permissions to implement the approved change.

## Next steps

- [Manage approval requests](./manage-approvals.md)
- [Learn about the Approvals feature](./what-approvals.md)
- [Configure Just-in-Time Access with PIM](./just-in-time-access.md)
- [Understand Azure Virtual Enclaves access control](./built-in-rbac-roles.md)
- [Create an enclave connection](./create-enclave-connection-portal.md)
