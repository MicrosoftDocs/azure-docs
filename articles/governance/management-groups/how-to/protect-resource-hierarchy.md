---
title: How to protect your resource hierarchy - Azure Governance
description: Learn how to protect your resource hierarchy with hierarchy settings that include setting the default management group.
ms.date: 08/17/2021
ms.topic: conceptual
---
# How to protect your resource hierarchy

Your resources, resource groups, subscriptions, management groups, and tenant collectively make up
your resource hierarchy. Settings at the root management group, such as Azure custom roles or Azure
Policy policy assignments, can impact every resource in your resource hierarchy. It's important to
protect the resource hierarchy from changes that could negatively impact all resources.

Management groups now have hierarchy settings that enable the tenant administrator to control these
behaviors. This article covers each of the available hierarchy settings and how to set them.

## Azure RBAC permissions for hierarchy settings

Configuring any of the hierarchy settings requires the following two resource provider operations on
the root management group:

- `Microsoft.Management/managementgroups/settings/write`
- `Microsoft.Management/managementgroups/settings/read`

These operations only allow a user to read and update the hierarchy settings. The operations don't
provide any other access to the management group hierarchy or resources in the hierarchy. Both of
these operations are available in the Azure built-in role **Hierarchy Settings Administrator**.

## Setting - Default management group

By default, a new subscription added within a tenant is added as a member of the root management
group. If policy assignments, Azure role-based access control (Azure RBAC), and other governance
constructs are assigned to the root management group, they immediately effect these new
subscriptions. For this reason, many organizations don't apply these constructs at the root
management group even though that is the desired place to assign them. In other cases, a more
restrictive set of controls is desired for new subscriptions, but shouldn't be assigned to all
subscriptions. This setting supports both use cases.

By allowing the default management group for new subscriptions to be defined, organization-wide
governance constructs can be applied at the root management group, and a separate management group
with policy assignments or Azure role assignments more suited to a new subscription can be defined.

### Set default management group in portal

To configure this setting in the Azure portal, follow these steps:

1. Use the search bar to search for and select 'Management groups'.

1. On the root management group, select **details** next to the name of the management group.

1. Under **Settings**, select **Hierarchy settings**.

1. Select the **Change default management group** button.

   > [!NOTE]
   > If the **Change default management group** button is disabled, either the management group
   > being viewed isn't the root management group or your security principal doesn't have the
   > necessary permissions to alter the hierarchy settings.

1. Select a management group from your hierarchy and use the **Select** button.

### Set default management group with REST API

To configure this setting with REST API, the
[Hierarchy Settings](/rest/api/managementgroups/hierarchysettings) endpoint is called. To do so, use
the following REST API URI and body format. Replace `{rootMgID}` with the ID of your root management
group and `{defaultGroupID}` with the ID of the management group to become the default management
group:

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{rootMgID}/settings/default?api-version=2020-05-01
  ```

- Request Body

  ```json
  {
      "properties": {
          "defaultManagementGroup": "/providers/Microsoft.Management/managementGroups/{defaultGroupID}"
      }
  }
  ```

To set the default management group back to the root management group, use the same endpoint and set
**defaultManagementGroup** to a value of
`/providers/Microsoft.Management/managementGroups/{rootMgID}`.

## Setting - Require authorization

Any user, by default, can create new management groups within a tenant. Admins of a tenant may wish
to only provide these permissions to specific users to maintain consistency and conformity in the
management group hierarchy. If enabled, a user requires the
`Microsoft.Management/managementGroups/write` operation on the root management group to create new
child management groups.

### Set require authorization in portal

To configure this setting in the Azure portal, follow these steps:

1. Use the search bar to search for and select 'Management groups'.

1. On the root management group, select **details** next to the name of the management group.

1. Under **Settings**, select **Hierarchy settings**.

1. Toggle the **Require permissions for creating new management groups.** option to on.

   > [!NOTE]
   > If the **Require permissions for creating new management groups.** toggle is disabled, either
   > the management group being viewed isn't the root management group or your security principal
   > doesn't have the necessary permissions to alter the hierarchy settings.

### Set require authorization with REST API

To configure this setting with REST API, the
[Hierarchy Settings](/rest/api/managementgroups/hierarchysettings) endpoint is called. To do so, use
the following REST API URI and body format. This value is a _boolean_, so provide either **true** or
**false** for the value. A value of **true** enables this method of protecting your management group
hierarchy:

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{rootMgID}/settings/default?api-version=2020-05-01
  ```

- Request Body

  ```json
  {
      "properties": {
          "requireAuthorizationForGroupCreation": true
      }
  }
  ```

To turn the setting back off, use the same endpoint and set
**requireAuthorizationForGroupCreation** to a value of **false**.

## PowerShell sample

PowerShell doesn't have an 'Az' command to set the default management group or set require
authorization, but as a workaround you can use the REST API with the PowerShell sample below:

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

## Next steps

To learn more about management groups, see:

- [Create management groups to organize Azure resources](../create-management-group-portal.md)
- [How to change, delete, or manage your management groups](../manage.md)
