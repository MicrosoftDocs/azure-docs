---
title: Protect your resource hierarchy - Azure Governance
description: Learn how to help protect your resource hierarchy by using hierarchy settings that include defining the default management group.
ms.date: 07/23/2024
ms.topic: conceptual
---
# Protect your resource hierarchy

Your resources, resource groups, subscriptions, management groups, and tenant compose
your resource hierarchy. Settings at the root management group, such as Azure custom roles or
policy assignments, can affect every resource in your resource hierarchy. It's important to
protect the resource hierarchy from changes that could negatively affect all resources.

Management groups have hierarchy settings that enable the tenant administrator to control these
behaviors. This article covers each of the available hierarchy settings and how to set them.

## Azure RBAC permissions for hierarchy settings

Configuring hierarchy settings requires the following resource provider operations on
the root management group:

- `Microsoft.Management/managementgroups/settings/write`
- `Microsoft.Management/managementgroups/settings/read`

These operations represent Azure role-based access control (Azure RBAC) permissions.
They only allow a user to read and update the hierarchy settings. They don't
provide any other access to the management group hierarchy or to resources in the hierarchy.

Both of
these operations are available in the Azure built-in role Hierarchy Settings Administrator.

## Setting: Define the default management group

By default, a new subscription that you add in a tenant becomes a member of the root management
group. If you assign policy assignments, Azure RBAC, and other governance
constructs to the root management group, they immediately affect these new
subscriptions. For this reason, many organizations don't apply these constructs at the root
management group, even though that's the desired place to assign them. In other cases, an organization wants a more
restrictive set of controls for new subscriptions but doesn't want to assign them to all
subscriptions. This setting supports both use cases.

By allowing the default management group for new subscriptions to be defined, you can apply organization-wide
governance constructs at the root management group. You can define a separate management group
with policy assignments or Azure role assignments that are more suited to a new subscription.

### Define the default management group in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Use the search bar to search for and select **Management groups**.

1. On the root management group, select **details** next to the name of the management group.

1. Under **Settings**, select **Hierarchy settings**.

1. Select the **Change default management group** button.

   If the **Change default management group** button is unavailable, the cause is one of these conditions:

   - The management group that you're viewing isn't the root management group.
   - Your security principal doesn't have the necessary permissions to alter the hierarchy settings.

1. Select a management group from your hierarchy, and then choose the **Select** button.

### Define the default management group by using the REST API

To define the default management group by using the REST API, you must call the
[Hierarchy Settings](/rest/api/managementgroups/hierarchysettings) endpoint. Use
the following REST API URI and body format. Replace `{rootMgID}` with the ID of your root management
group. Replace `{defaultGroupID}` with the ID of the management group that will become the default management
group.

- REST API URI:

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{rootMgID}/settings/default?api-version=2020-05-01
  ```

- Request body:

  ```json
  {
      "properties": {
          "defaultManagementGroup": "/providers/Microsoft.Management/managementGroups/{defaultGroupID}"
      }
  }
  ```

To set the default management group back to the root management group, use the same endpoint and set
`defaultManagementGroup` to a value of
`/providers/Microsoft.Management/managementGroups/{rootMgID}`.

## Setting: Require authorization

Any user, by default, can create new management groups in a tenant. Admins of a tenant might want
to provide these permissions only to specific users, to maintain consistency and conformity in the
management group hierarchy. To create child management groups, a user requires the
`Microsoft.Management/managementGroups/write` operation on the root management group.

### Require authorization in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Use the search bar to search for and select **Management groups**.

1. On the root management group, select **details** next to the name of the management group.

1. Under **Settings**, select **Hierarchy settings**.

1. Turn on the **Require permissions for creating new management groups** toggle.

   If the **Require permissions for creating new management groups** toggle is unavailable, the cause is one of these conditions:

   - The management group that you're viewing isn't the root management group.
   - Your security principal doesn't have the necessary permissions to alter the hierarchy settings.

### Require authorization by using the REST API

To require authorization by using the REST API, call the
[Hierarchy Settings](/rest/api/managementgroups/hierarchysettings) endpoint. Use
the following REST API URI and body format. This value is a Boolean, so provide either `true` or
`false` for the value. A value of `true` enables this method of protecting your management group
hierarchy.

- REST API URI:

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{rootMgID}/settings/default?api-version=2020-05-01
  ```

- Request body:

  ```json
  {
      "properties": {
          "requireAuthorizationForGroupCreation": true
      }
  }
  ```

To turn off the setting, use the same endpoint and set
`requireAuthorizationForGroupCreation` to a value of `false`.

## Azure PowerShell sample

Azure PowerShell doesn't have an `Az` command to define the default management group or to require
authorization. As a workaround, you can use the REST API with the following Azure PowerShell sample:

```powershell
$root_management_group_id = "Enter the ID of root management group"
$default_management_group_id = "Enter the ID of default management group (or use the same ID of the root management group)"

$body = '{
     "properties": {
          "defaultManagementGroup": "/providers/Microsoft.Management/managementGroups/' + $default_management_group_id + '",
          "requireAuthorizationForGroupCreation": true
     }
}'

$token = (Get-AzAccessToken).Token
$headers = @{"Authorization"= "Bearer $token"; "Content-Type"= "application/json"}
$uri = "https://management.azure.com/providers/Microsoft.Management/managementGroups/$root_management_group_id/settings/default?api-version=2020-05-01"

Invoke-RestMethod -Method PUT -Uri $uri -Headers $headers -Body $body
```

## Related content

To learn more about management groups, see:

- [Create management groups to organize Azure resources](../create-management-group-portal.md)
- [Change, delete, or manage your management groups](../manage.md)
