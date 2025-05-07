---
title: "Quickstart: Create a management group with REST API"
description: In this quickstart, you use REST API to create a management group to organize your resources into a resource hierarchy.
ms.date: 07/19/2024
ms.topic: quickstart
---

# Quickstart: Create a management group with REST API

Management groups are containers that help you manage access, policy, and compliance across multiple
subscriptions. Create these containers to build an effective and efficient hierarchy that can be
used with [Azure Policy](../policy/overview.md) and [Azure Role Based Access
Controls](../../role-based-access-control/overview.md). For more information on management groups,
see [Organize your resources with Azure management groups](overview.md).

The first management group created in the directory could take up to 15 minutes to complete. There
are processes that run the first time to set up the management groups service within Azure for your
directory. You receive a notification when the process is complete. For more information, see
[initial setup of management groups](./overview.md#initial-setup-of-management-groups).

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- If you haven't already, install [ARMClient](https://github.com/projectkudu/ARMClient). It's a tool
  that sends HTTP requests to Azure Resource Manager-based REST APIs.

- Any Microsoft Entra ID user in the tenant can create a management group without the management group write
  permission assigned to that user if
  [hierarchy protection](./how-to/protect-resource-hierarchy.md#setting-require-authorization)
  isn't enabled. This new management group becomes a child of the Root Management Group or the
  [default management group](./how-to/protect-resource-hierarchy.md#setting-define-the-default-management-group)
  and the creator is given an Owner role assignment. Management group service allows this ability
  so that role assignments aren't needed at the root level. When the Root
    Management Group is created, users don't have access to it. To start using management groups, the service allows the creation of the initial management groups at the root level. For more information, see [Root management group for each directory](./overview.md#root-management-group-for-each-directory).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

### Create in REST API

For REST API, use the
[Management Groups - Create or Update](/rest/api/managementgroups/managementgroups/createorupdate)
endpoint to create a new management group. In this example, the management group **groupId** is
_Contoso_.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/Contoso?api-version=2020-05-01
  ```

- No Request Body

The **groupId** is a unique identifier being created. This ID is used by other commands to reference
this group and it can't be changed later.

If you want the management group to show a different name within the Azure portal, add the
**properties.displayName** property in the request body. For example, to create a management group
with the **groupId** of _Contoso_ and the display name of _Contoso Group_, use the following
endpoint and request body:

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/Contoso?api-version=2020-05-01
  ```

- Request Body

  ```json
  {
    "properties": {
      "displayName": "Contoso Group"
    }
  }
  ```

In the preceding examples, the new management group is created under the root management group. To
specify a different management group as the parent, use the **properties.parent.id** property.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/Contoso?api-version=2020-05-01
  ```

- Request Body

  ```json
  {
    "properties": {
      "displayName": "Contoso Group",
      "parent": {
        "id": "/providers/Microsoft.Management/managementGroups/HoldingGroup"
      }
    }
  }
  ```

## Clean up resources

To remove the management group created above, use the
[Management Groups - Delete](/rest/api/managementgroups/managementgroups/delete) endpoint:

- REST API URI

  ```http
  DELETE https://management.azure.com/providers/Microsoft.Management/managementGroups/Contoso?api-version=2020-05-01
  ```

- No Request Body

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
