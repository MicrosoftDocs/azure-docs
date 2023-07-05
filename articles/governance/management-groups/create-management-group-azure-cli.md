---
title: "Quickstart: Create a management group with the Azure CLI"
description: In this quickstart, you use the Azure CLI to create a management group to organize your resources into a resource hierarchy.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.tool: azure-cli
---
# Quickstart: Create a management group with the Azure CLI

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

- This quickstart requires that you run Azure CLI version 2.0.76 or later to install and use the CLI
  locally. To find the version, run `az --version`. If you need to install or upgrade, see
  [Install Azure CLI](/cli/azure/install-azure-cli).

- Any Azure AD user in the tenant can create a management group without the management group write
  permission assigned to that user if
  [hierarchy protection](./how-to/protect-resource-hierarchy.md#setting---require-authorization)
  isn't enabled. This new management group becomes a child of the Root Management Group or the
  [default management group](./how-to/protect-resource-hierarchy.md#setting---default-management-group)
  and the creator is given an "Owner" role assignment. Management group service allows this ability
  so that role assignments aren't needed at the root level. No users have access to the Root
  Management Group when it's created. To avoid the hurdle of finding the Azure AD Global Admins to
  start using management groups, we allow the creation of the initial management groups at the root
  level.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

### Create in the Azure CLI

For Azure CLI, use the
[az account management-group create](/cli/azure/account/management-group#az-account-management-group-create)
command to create a new management group. In this example, the management group **name** is
_Contoso_.

```azurecli-interactive
az account management-group create --name 'Contoso'
```

The **name** is a unique identifier being created. This ID is used by other commands to reference
this group and it can't be changed later.

If you want the management group to show a different name within the Azure portal, add the
**display-name** parameter. For example, to create a management group with the GroupName of Contoso
and the display name of "Contoso Group", use the following command:

```azurecli-interactive
az account management-group create --name 'Contoso' --display-name 'Contoso Group'
```

In the preceding examples, the new management group is created under the root management group. To
specify a different management group as the parent, use the **parent** parameter and provide the
name of the parent group.

```azurecli-interactive
az account management-group create --name 'ContosoSubGroup' --parent 'Contoso'
```

## Clean up resources

To remove the management group created above, use the
[az account management-group delete](/cli/azure/account/management-group#az-account-management-group-delete)
command:

```azurecli-interactive
az account management-group delete --name 'Contoso'
```

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
