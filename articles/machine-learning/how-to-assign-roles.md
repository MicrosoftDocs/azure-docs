---
title: Manage roles in your workspace
titleSuffix: Azure Machine Learning
description: Learn how to access to an Azure Machine Learning workspace using role-based access control (RBAC).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: Blackmist
ms.author: nigup
author: nishankgu
ms.date: 07/24/2020
ms.custom: how-to, seodec18

---


# Manage access to an Azure Machine Learning workspace

In this article, you learn how to manage access to an Azure Machine Learning workspace. [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) is used to manage access to Azure resources. Users in your Azure Active Directory are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles.

## Default roles

An Azure Machine Learning workspace is an Azure resource. Like other Azure resources, when a new Azure Machine Learning workspace is created, it comes with three default roles. You can add users to the workspace and assign them to one of these built-in roles.

| Role | Access level |
| --- | --- |
| **Reader** | Read-only actions in the workspace. Readers can list and view assets, including [datastore](how-to-access-data.md) credentials, in a workspace. Readers can't create or update these assets. |
| **Contributor** | View, create, edit, or delete (where applicable) assets in a workspace. For example, contributors can create an experiment, create or attach a compute cluster, submit a run, and deploy a web service. |
| **Owner** | Full access to the workspace, including the ability to view, create, edit, or delete (where applicable) assets in a workspace. Additionally, you can change role assignments. |
| **Custom Role** | Allows you to customize access to specific control or data plane operations within a workspace. For example, submitting a run, creating a compute, deploying a model or registering a dataset. |

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

If you have installed the [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md), you can use CLI commands to assign roles to users:

```azurecli-interactive 
az ml workspace share -w <workspace_name> -g <resource_group_name> --role <role_name> --user <user_corp_email_address>
```

The `user` field is the email address of an existing user in the instance of Azure Active Directory where the workspace parent subscription lives. Here is an example of how to use this command:

```azurecli-interactive 
az ml workspace share -w my_workspace -g my_resource_group --role Contributor --user jdoe@contoson.com
```

> [!NOTE]
> "az ml workspace share" command does not work for federated account by Azure Active Directory B2B. Please use Azure UI portal instead of command.


## Azure Machine Learning operations

Azure Machine Learning built-in actions for many operations and tasks. For a complete list, see [Azure resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices).

## Create custom role

If the built-in roles are insufficient, you can create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that workspace. You can make the role available at a specific workspace level, a specific resource group level, or a specific subscription level.

> [!NOTE]
> You must be an owner of the resource at that level to create custom roles within that resource.

To create a custom role, first construct a role definition JSON file that specifies the permission and scope for the role. The following example defines a custom role named "Data Scientist Custom" scoped at a specific workspace level:

`data_scientist_custom_role.json` :
```json
{
    "Name": "Data Scientist Custom",
    "IsCustom": true,
    "Description": "Can run experiment but can't create or delete compute.",
    "Actions": ["*"],
    "NotActions": [
        "Microsoft.MachineLearningServices/workspaces/*/delete",
        "Microsoft.MachineLearningServices/workspaces/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/delete", 
        "Microsoft.Authorization/*/write"
    ],
    "AssignableScopes": [
        "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace_name>"
    ]
}
```

> [!TIP]
> You can change the `AssignableScopes` field to set the scope of this custom role at the subscription level, the resource group level, or a specific workspace level.
> The above custom role is just an example, see some suggested [custom roles for the Azure Machine Learning service](#customroles).

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

For more information on custom roles, see [Azure custom roles](/azure/role-based-access-control/custom-roles). For more information on the operations (actions and not actions) usable with custom roles, see [Resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices).

## Frequently asked questions


### Q. What are the permissions needed to perform some common scenarios in the Azure Machine Learning service?

The following table is a summary of Azure Machine Learning activities and the permissions required to perform them at the least scope. For example, if an activity can be performed with a workspace scope (Column 4), then all higher scope with that permission will also work automatically:

> [!IMPORTANT]
> All paths in this table that start with `/` are **relative paths** to `Microsoft.MachineLearningServices/` :

| Activity | Subscription-level scope | Resource group-level scope | Workspace-level scope |
| ----- | ----- | ----- | ----- |
| Create new workspace | Not required | Owner or contributor | N/A (becomes Owner or inherits higher scope role after creation) |
| Request subscription level Amlcompute quota or set workspace level quota | Owner, or contributor, or custom role </br>allowing `/locations/updateQuotas/action`</br> at subscription scope | Not Authorized | Not Authorized |
| Create new compute cluster | Not required | Not required | Owner, contributor, or custom role allowing: `/workspaces/computes/write` |
| Create new compute instance | Not required | Not required | Owner, contributor, or custom role allowing: `/workspaces/computes/write` |
| Submitting any type of run | Not required | Not required | Owner, contributor, or custom role allowing: `"/workspaces/*/read", "/workspaces/environments/write", "/workspaces/experiments/runs/write", "/workspaces/metadata/artifacts/write", "/workspaces/metadata/snapshots/write", "/workspaces/environments/build/action", "/workspaces/experiments/runs/submit/action", "/workspaces/environments/readSecrets/action"` |
| Publishing a pipeline endpoint | Not required | Not required | Owner, contributor, or custom role allowing: `"/workspaces/pipelines/write", "/workspaces/endpoints/pipelines/*", "/workspaces/pipelinedrafts/*", "/workspaces/modules/*"` |
| Deploying a registered model on an AKS/ACI resource | Not required | Not required | Owner, contributor, or custom role allowing: `"/workspaces/services/aks/write", "/workspaces/services/aci/write"` |
| Scoring against a deployed AKS endpoint | Not required | Not required | Owner, contributor, or custom role allowing: `"/workspaces/services/aks/score/action", "/workspaces/services/aks/listkeys/action"` (when you are not using Azure Active Directory auth) OR `"/workspaces/read"` (when you are using token auth) |
| Accessing storage using interactive notebooks | Not required | Not required | Owner, contributor, or custom role allowing: `"/workspaces/computes/read", "/workspaces/notebooks/samples/read", "/workspaces/notebooks/storage/*", "/workspaces/listKeys/action"` |
| Create new custom role | Owner, contributor, or custom role allowing `Microsoft.Authorization/roleDefinitions/write` | Not required | Owner, contributor, or custom role allowing: `/workspaces/computes/write` |

> [!TIP]
> If you receive a failure when trying to create a workspace for the first time, make sure that your role allows `Microsoft.MachineLearningServices/register/action`. This action allows you to register the Azure Machine Learning resource provider with your Azure subscription.

### Q. Are we publishing Azure built-in roles for the Machine Learning service?

We are currently not publishing [Azure built-in roles](/azure/role-based-access-control/built-in-roles) for the Machine Learning service. A built-in role once published cannot be updated, and we are still firming the role definitions based on customer scenarios and feedback. 

<a id="customroles"></a>

### Q. Are there some custom-role templates for the most common scenarios in Machine Learning service?

Yes here are some common scenarios with custom proposed role definitions that you can use as a base to define your own custom roles:

* __Data Scientist Custom__: Allows a data scientist to perform all operations inside a workspace **except**:

    * Creation of compute
    * Deploying models to a production AKS cluster
    * Deploying a pipeline endpoint in production

    `data_scientist_custom_role.json` :
    ```json
    {
        "Name": "Data Scientist Custom",
        "IsCustom": true,
        "Description": "Can run experiment but can't create or delete compute or deploy production endpoints.",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/*/read",
            "Microsoft.MachineLearningServices/workspaces/*/action",
            "Microsoft.MachineLearningServices/workspaces/*/delete",
            "Microsoft.MachineLearningServices/workspaces/*/write"
        ],
        "NotActions": [
            "Microsoft.MachineLearningServices/workspaces/delete",
            "Microsoft.MachineLearningServices/workspaces/write",
            "Microsoft.MachineLearningServices/workspaces/computes/*/write",
            "Microsoft.MachineLearningServices/workspaces/computes/*/delete", 
            "Microsoft.Authorization/*",
            "Microsoft.MachineLearningServices/workspaces/computes/listKeys/action",
            "Microsoft.MachineLearningServices/workspaces/listKeys/action",
            "Microsoft.MachineLearningServices/workspaces/services/aks/write",
            "Microsoft.MachineLearningServices/workspaces/services/aks/delete",
            "Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/write"
        ],
        "AssignableScopes": [
            "/subscriptions/<subscription_id>"
        ]
    }
    ```

* __Data Scientist Restricted Custom__: A more restricted role definition without wildcards in the allowed actions. It can perform all operations inside a workspace **except**:

    * Creation of compute
    * Deploying models to a production AKS cluster
    * Deploying a pipeline endpoint in production

    `data_scientist_restricted_custom_role.json` :
    ```json
    {
        "Name": "Data Scientist Restricted Custom",
        "IsCustom": true,
        "Description": "Can run experiment but can't create or delete compute or deploy production endpoints",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/*/read",
            "Microsoft.MachineLearningServices/workspaces/computes/start/action",
            "Microsoft.MachineLearningServices/workspaces/computes/stop/action",
            "Microsoft.MachineLearningServices/workspaces/computes/restart/action",
            "Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action",
            "Microsoft.MachineLearningServices/workspaces/notebooks/storage/read",
            "Microsoft.MachineLearningServices/workspaces/notebooks/storage/write",
            "Microsoft.MachineLearningServices/workspaces/notebooks/storage/delete",
            "Microsoft.MachineLearningServices/workspaces/notebooks/samples/read",
            "Microsoft.MachineLearningServices/workspaces/experiments/runs/write",
            "Microsoft.MachineLearningServices/workspaces/experiments/write",
            "Microsoft.MachineLearningServices/workspaces/experiments/runs/submit/action",
            "Microsoft.MachineLearningServices/workspaces/pipelinedrafts/write",
            "Microsoft.MachineLearningServices/workspaces/metadata/snapshots/write",
            "Microsoft.MachineLearningServices/workspaces/metadata/artifacts/write",
            "Microsoft.MachineLearningServices/workspaces/environments/write",
            "Microsoft.MachineLearningServices/workspaces/models/write",
            "Microsoft.MachineLearningServices/workspaces/modules/write",
            "Microsoft.MachineLearningServices/workspaces/datasets/registered/write", 
            "Microsoft.MachineLearningServices/workspaces/datasets/registered/delete",
            "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/write",
            "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/delete",
            "Microsoft.MachineLearningServices/workspaces/computes/listNodes/action",
            "Microsoft.MachineLearningServices/workspaces/environments/build/action"
        ],
        "NotActions": [
            "Microsoft.MachineLearningServices/workspaces/computes/write",
            "Microsoft.MachineLearningServices/workspaces/write",
            "Microsoft.MachineLearningServices/workspaces/computes/delete",
            "Microsoft.MachineLearningServices/workspaces/delete",
            "Microsoft.MachineLearningServices/workspaces/computes/listKeys/action",
            "Microsoft.MachineLearningServices/workspaces/listKeys/action",
            "Microsoft.Authorization/*",
            "Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/read",
            "Microsoft.MachineLearningServices/workspaces/datasets/registered/preview/read",
            "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/profile/read",
            "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/preview/read",
            "Microsoft.MachineLearningServices/workspaces/datasets/registered/schema/read",    
            "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/schema/read",
            "Microsoft.MachineLearningServices/workspaces/datastores/write",
            "Microsoft.MachineLearningServices/workspaces/datastores/delete"
        ],
        "AssignableScopes": [
            "/subscriptions/<subscription_id>"
        ]
    }
    ```

* __MLOps Custom__: Allows you to assign a role to a service principal and use that to automate your MLOps pipelines. For example, to submit runs against an already published pipeline:

    `mlops_custom_role.json` :
    ```json
    {
        "Name": "MLOps Custom",
        "IsCustom": true,
        "Description": "Can run pipelines against a published pipeline endpoint",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/read",
            "Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/read",
            "Microsoft.MachineLearningServices/workspaces/metadata/artifacts/read",
            "Microsoft.MachineLearningServices/workspaces/metadata/snapshots/read",
            "Microsoft.MachineLearningServices/workspaces/environments/read",    
            "Microsoft.MachineLearningServices/workspaces/metadata/secrets/read",
            "Microsoft.MachineLearningServices/workspaces/modules/read",
            "Microsoft.MachineLearningServices/workspaces/experiments/runs/read",
            "Microsoft.MachineLearningServices/workspaces/datasets/registered/read",
            "Microsoft.MachineLearningServices/workspaces/datastores/read",
            "Microsoft.MachineLearningServices/workspaces/environments/write",
            "Microsoft.MachineLearningServices/workspaces/experiments/runs/write",
            "Microsoft.MachineLearningServices/workspaces/metadata/artifacts/write",
            "Microsoft.MachineLearningServices/workspaces/metadata/snapshots/write",
            "Microsoft.MachineLearningServices/workspaces/environments/build/action",
            "Microsoft.MachineLearningServices/workspaces/experiments/runs/submit/action"
        ],
        "NotActions": [
            "Microsoft.MachineLearningServices/workspaces/computes/write",
            "Microsoft.MachineLearningServices/workspaces/write",
            "Microsoft.MachineLearningServices/workspaces/computes/delete",
            "Microsoft.MachineLearningServices/workspaces/delete",
            "Microsoft.MachineLearningServices/workspaces/computes/listKeys/action",
            "Microsoft.MachineLearningServices/workspaces/listKeys/action",
            "Microsoft.Authorization/*"
        ],
        "AssignableScopes": [
            "/subscriptions/<subscription_id>"
        ]
    }
    ```

* __Workspace Admin__: Allows you to perform all operations within the scope of a workspace, **except**:

    * Creating a new workspace
    * Assigning subscription or workspace level quotas

    The workspace admin also cannot create a new role. It can only assign existing built-in or custom roles within the scope of their workspace:

    `workspace_admin_custom_role.json` :
    ```json
    {
        "Name": "Workspace Admin Custom",
        "IsCustom": true,
        "Description": "Can perform all operations except quota management and upgrades",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/*/read",
            "Microsoft.MachineLearningServices/workspaces/*/action",
            "Microsoft.MachineLearningServices/workspaces/*/write",
            "Microsoft.MachineLearningServices/workspaces/*/delete",
            "Microsoft.Authorization/roleAssignments/*"
        ],
        "NotActions": [
            "Microsoft.MachineLearningServices/workspaces/write"
        ],
        "AssignableScopes": [
            "/subscriptions/<subscription_id>"
        ]
    }
    ```

<a name="labeler"></a>
* __Labeler Custom__: Allows you to define a role scoped only to labeling data:

    `labeler_custom_role.json` :
    ```json
    {
        "Name": "Labeler Custom",
        "IsCustom": true,
        "Description": "Can label data for Labeling",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/read",
            "Microsoft.MachineLearningServices/workspaces/labeling/projects/read",
            "Microsoft.MachineLearningServices/workspaces/labeling/labels/write"
        ],
        "NotActions": [
            "Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read"
        ],
        "AssignableScopes": [
            "/subscriptions/<subscription_id>"
        ]
    }
    ```

### Q. How do I list all the custom roles in my subscription?

In the Azure CLI, run the following command.

```azurecli-interactive
az role definition list --subscription <sub-id> --custom-role-only true
```

### Q. How do I find the operations supported by the Machine Learning Service?

In the Azure CLI, run the following command.

```azurecli-interactive
az provider operation show –n Microsoft.MachineLearningServices
```

They can also be found in the list of [Resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices).


### Q. What are some common gotchas when using Azure RBAC?

Here are a few things to be aware of while you use Azure role-based access control (Azure RBAC):

- When you create a resource in Azure, say a workspace, you are not directly the owner of the workspace. Your role gets inherited from the highest scope role that you are authorized against in that subscription. As an example if you are a Network Administrator, and had the permissions to create a Machine Learning workspace, you would be assigned the Network Administrator role against that workspace, and not the Owner role.
- When there are two role assignments to the same Azure Active Directory user with conflicting sections of Actions/NotActions, your operations listed in NotActions from one role might not take effect if they are also listed as Actions in another role. To learn more about how Azure parses role assignments, read [How Azure RBAC determines if a user has access to a resource](/azure/role-based-access-control/overview#how-azure-rbac-determines-if-a-user-has-access-to-a-resource)
- To deploy your compute resources inside a VNet, you need to explicitly have permissions for the following actions:
    - "Microsoft.Network/virtualNetworks/join/action" on the VNet resource.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.
    
    For more information on RBAC with networking, see the [Networking built-in roles](/azure/role-based-access-control/built-in-roles#networking).

- It can sometimes take upto 1 hour for your new role assignments to take effect over cached permissions across the stack.

### Q. What permissions do I need to use a user-assigned managed identity with my Amlcompute clusters?

To assign a user assigned identity on Amlcompute clusters, one has to have write permissions to create compute and have [Managed Identity Operator Role](/azure/role-based-access-control/built-in-roles#managed-identity-operator). For more information on RBAC with Managed Identities, read [How to manage user assigned identity](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal)


### Q. Do we support role-based access control on the Studio portal?

Azure Machine Learning Studio supports Azure role-based access control (Azure RBAC). 

> [!IMPORTANT]
> Once you have assigned a custom role with specific permissions to a data scientist in your workspace, corresponding actions (such as adding a compute button) are automatically hidden from the users. Hiding these items prevents any confusion from seeing controls that return an Unauthorized Access notification from the service when used.

### Q. How do I find the role definition for a role in my subscription?

In the Azure CLI, run the following command. The `<role-name>` should be in the same format returned by the command above.

```azurecli-interactive
az role definition list -n <role-name> --subscription <sub-id>
```

### Q. How do I update a role definition?

In the Azure CLI, run the following command.

```azurecli-interactive
az role definition update --role-definition update_def.json --subscription <sub-id>
```

You need to have permissions on the entire scope of your new role definition. For example if this new role has a scope across three subscriptions, you need to have permissions on all three subscriptions. 

> [!NOTE]
> Role updates can take 15 minutes to an hour to apply across all role assignments in that scope.


### Q. What permissions are needed to perform quota operations in a workspace? 

You need subscription level permissions to perform any quota-related operation in the workspace. This means setting either subscription level quota or workspace level quota for your managed compute resources can only happen if you have write permissions at the subscription scope. 


## Next steps

- [Enterprise security overview](concept-enterprise-security.md)
- [Virtual network isolation and privacy overview](how-to-network-security-overview.md)
- [Tutorial: Train models](tutorial-train-models-with-aml.md)
- [Resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices)
