---
title: Manage roles in your workspace
titleSuffix: Azure Machine Learning
description: Learn how to access to an Azure Machine Learning workspace using role-based access control (RBAC).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: jmartens
ms.author: larryfr
author: Blackmist
ms.date: 03/06/2020
ms.custom: seodec18

---


# Manage access to an Azure Machine Learning workspace
[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to manage access to an Azure Machine Learning workspace. [Role-based access control (RBAC)](/azure/role-based-access-control/overview) is used to manage access to Azure resources. Users in your Azure Active Directory are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles.

## Default roles

An Azure Machine Learning workspace is an Azure resource. Like other Azure resources, when a new Azure Machine Learning workspace is created, it comes with three default roles. You can add users to the workspace and assign them to one of these built-in roles.

| Role | Access level |
| --- | --- |
| **Reader** | Read-only actions in the workspace. Readers can list and view assets (including [datastore](how-to-access-data.md) credentials) in a workspace, but can't create or update these assets. |
| **Contributor** | View, create, edit, or delete (where applicable) assets in a workspace. For example, contributors can create an experiment, create or attach a compute cluster, submit a run, and deploy a web service. |
| **Owner** | Full access to the workspace, including the ability to view, create, edit, or delete (where applicable) assets in a workspace. Additionally, you can change role assignments. |

> [!IMPORTANT]
> Role access can be scoped to multiple levels in Azure. For example, someone with owner access to a workspace may not have owner access to the resource group that contains the workspace. For more information, see [How RBAC works](/azure/role-based-access-control/overview#how-rbac-works).

For more information on specific built-in roles, see [Built-in roles for Azure](/azure/role-based-access-control/built-in-roles).

## Manage workspace access

If you're an owner of a workspace, you can add and remove roles for the workspace. You can also assign roles to users. Use the following links to discover how to manage access:
- [Azure portal UI](/azure/role-based-access-control/role-assignments-portal)
- [PowerShell](/azure/role-based-access-control/role-assignments-powershell)
- [Azure CLI](/azure/role-based-access-control/role-assignments-cli)
- [REST API](/azure/role-based-access-control/role-assignments-rest)
- [Azure Resource Manager templates](/azure/role-based-access-control/role-assignments-template)

If you have installed the [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md), you can also use a CLI command to assign roles to users.

```azurecli-interactive 
az ml workspace share -w <workspace_name> -g <resource_group_name> --role <role_name> --user <user_corp_email_address>
```

The `user` field is the email address of an existing user in the instance of Azure Active Directory where the workspace parent subscription lives. Here is an example of how to use this command:

```azurecli-interactive 
az ml workspace share -w my_workspace -g my_resource_group --role Contributor --user jdoe@contoson.com
```

## Create custom role

If the built-in roles are insufficient, you can create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that workspace. You can make the role available at a specific workspace level, a specific resource group level, or a specific subscription level.

> [!NOTE]
> You must be an owner of the resource at that level to create custom roles within that resource.

To create a custom role, first construct a role definition JSON file that specifies the permission and scope for the role. The following example defines a custom role named "Data Scientist" scoped at a specific workspace level:

`data_scientist_role.json` :
```json
{
    "Name": "Data Scientist",
    "IsCustom": true,
    "Description": "Can run experiment but can't create or delete compute.",
    "Actions": ["*"],
    "NotActions": [
        "Microsoft.MachineLearningServices/workspaces/*/delete",
        "Microsoft.MachineLearningServices/workspaces/computes/*/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/delete", 
        "Microsoft.Authorization/*/write"
    ],
    "AssignableScopes": [
        "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace_name>"
    ]
}
```

You can change the `AssignableScopes` field to set the scope of this custom role at the subscription level, the resource group level, or a specific workspace level.

This custom role can do everything in the workspace except for the following actions:

- It can't create or update a compute resource.
- It can't delete a compute resource.
- It can't add, delete, or alter role assignments.
- It can't delete the workspace.

To deploy this custom role, use the following Azure CLI command:

```azurecli-interactive 
az role definition create --role-definition data_scientist_role.json
```

After deployment, this role becomes available in the specified workspace. Now you can add and assign this role in the Azure portal. Or, you can assign this role to a user by using the `az ml workspace share` CLI command:

```azurecli-interactive
az ml workspace share -w my_workspace -g my_resource_group --role "Data Scientist" --user jdoe@contoson.com
```

For more information on custom roles, see [Custom roles for Azure resources](/azure/role-based-access-control/custom-roles).

For more information on the operations (actions) usable with custom roles, see [Resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices).


## Frequently asked questions


### Q. What are the permissions needed to perform various actions in the Azure Machine Learning service?

The following table is a summary of Azure Machine Learning activities and the permissions required to perform them at the least scope. As an example if an activity can be performed with a workspace scope (Column 4), then all higher scope with that permission will also work automatically. All paths in this table are **relative paths** to `Microsoft.MachineLearningServices/`.

| Activity | Subscription-level scope | Resource group-level scope | Workspace-level scope |
|---|---|---|---|
| Create new workspace | Not required | Owner or contributor | N/A (becomes Owner or inherits higher scope role after creation) |
| Create new compute cluster | Not required | Not required | Owner, contributor, or custom role allowing: `workspaces/computes/write` |
| Create new Notebook VM | Not required | Owner or contributor | Not possible |
| Create new compute instance | Not required | Not required | Owner, contributor, or custom role allowing: `workspaces/computes/write` |
| Data plane activity like submitting run, accessing data, deploying model or publishing pipeline | Not required | Not required | Owner, contributor, or custom role allowing: `workspaces/*/write` <br/> Note that you also need a datastore registered to the workspace to allow MSI to access data in your storage account. |


### Q. How do I list all the custom roles in my subscription?

In the Azure CLI, run the following command.

```azurecli-interactive
az role definition list --subscription <sub-id> --custom-role-only true
```

### Q. How do I find the role definition for a role in my subscription?

In the Azure CLI, run the following command. Note that `<role-name>` should be in the same format returned by the command above.

```azurecli-interactive
az role definition list -n <role-name> --subscription <sub-id>
```

### Q. How do I update a role definition?

In the Azure CLI, run the following command.

```azurecli-interactive
az role definition update --role-definition update_def.json --subscription <sub-id>
```

Note that you need to have permissions on the entire scope of your new role definition. For example if this new role has a scope across three subscriptions, you need to have permissions on all three subscriptions. 

> [!NOTE]
> Role updates can take 15 minutes to an hour to apply across all role assignments in that scope.
### Q. Can I define a role that prevents updating the workspace Edition? 

Yes, you can define a role that prevents updating the workspace Edition. Since the workspace update is a PATCH call on the workspace object, you do this by putting the following action in the `"NotActions"` array in your JSON definition: 

`"Microsoft.MachineLearningServices/workspaces/write"`

### Q. What permissions are needed to perform quota operations in a workspace? 

You need subscription level permissions to perform any quota related operation in the workspace. This means setting either subscription level quota or workspace level quota for your managed compute resources can only happen if you have write permissions at the subscription scope. 


## Next steps

- [Enterprise security overview](concept-enterprise-security.md)
- [Securely run experiments and inference/score inside a virtual network](how-to-enable-virtual-network.md)
- [Tutorial: Train models](tutorial-train-models-with-aml.md)
- [Resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices)
