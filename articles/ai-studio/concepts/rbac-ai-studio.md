---
title: Role-based access control in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces role-based access control in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
---

# Role-based access control in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to manage access (authorization) to an Azure AI Studio hub. Azure role-based access control (Azure RBAC) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Microsoft Entra ID are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles. 

> [!WARNING]
> Applying some roles might limit UI functionality in Azure AI Studio for other users. For example, if a user's role does not have the ability to create a compute instance, the option to create a compute instance will not be available in studio. This behavior is expected, and prevents the user from attempting operations that would return an access denied error. 

## AI Studio hub vs project

In the Azure AI Studio, there are two levels of access: the hub and the project. The hub is home to the infrastructure (including virtual network setup, customer-managed keys, managed identities, and policies) and where you configure your Azure AI services. Hub access can allow you to modify the infrastructure, create new hubs, and create projects. Projects are a subset of the hub that act as workspaces that allow you to build and deploy AI systems. Within a project you can develop flows, deploy models, and manage project assets. Project access lets you develop AI end-to-end while taking advantage of the infrastructure setup on the hub.

:::image type="content" source="../media/concepts/azureai-hub-project-relationship.png" alt-text="Diagram of the relationship between AI Studio resources." lightbox="../media/concepts/azureai-hub-project-relationship.png":::

One of the key benefits of the hub and project relationship is that developers can create their own projects that inherit the hub security settings. You might also have developers who are contributors to a project, and can't create new projects.

## Default roles for the hub 

The AI Studio hub has built-in roles that are available by default. 

Here's a table of the built-in roles and their permissions for the hub:

| Role | Description | 
| --- | --- |
| Owner | Full access to the hub, including the ability to manage and create new hubs and assign permissions. This role is automatically assigned to the hub creator|
| Contributor |    User has full access to the hub, including the ability to create new hubs, but isn't able to manage hub permissions on the existing resource. |
| Azure AI Developer |     Perform all actions except create new hubs and manage the hub permissions. For example, users can create projects, compute, and connections. Users can assign permissions within their project. Users can interact with existing Azure AI resources such as Azure OpenAI, Azure AI Search, and Azure AI services. |
| Azure AI Inference Deployment Operator | Perform all actions required to create a resource deployment within a resource group. |
| Reader |     Read only access to the hub. This role is automatically assigned to all project members within the hub. |


The key difference between Contributor and Azure AI Developer is the ability to make new hubs. If you don't want users to make new hubs (due to quota, cost, or just managing how many hubs you have), assign the Azure AI Developer role.

Only the Owner and Contributor roles allow you to make a hub. At this time, custom roles can't grant you permission to make hubs.

The full set of permissions for the new "Azure AI Developer" role are as follows:

```json
{
    "Permissions": [ 
        { 
        "Actions": [ 
    
            "Microsoft.MachineLearningServices/workspaces/*/read", 
            "Microsoft.MachineLearningServices/workspaces/*/action", 
            "Microsoft.MachineLearningServices/workspaces/*/delete", 
            "Microsoft.MachineLearningServices/workspaces/*/write" 
        ], 
    
        "NotActions": [ 
            "Microsoft.MachineLearningServices/workspaces/delete", 
            "Microsoft.MachineLearningServices/workspaces/write", 
            "Microsoft.MachineLearningServices/workspaces/listKeys/action", 
            "Microsoft.MachineLearningServices/workspaces/hubs/write", 
            "Microsoft.MachineLearningServices/workspaces/hubs/delete", 
            "Microsoft.MachineLearningServices/workspaces/featurestores/write", 
            "Microsoft.MachineLearningServices/workspaces/featurestores/delete" 
        ], 
        "DataActions": [ 
            "Microsoft.CognitiveServices/accounts/OpenAI/*", 
            "Microsoft.CognitiveServices/accounts/SpeechServices/*", 
            "Microsoft.CognitiveServices/accounts/ContentSafety/*" 
        ], 
        "NotDataActions": [], 
        "Condition": null, 
        "ConditionVersion": null 
        } 
    ] 
}
```
## Default roles for projects 

Projects in AI Studio have built-in roles that are available by default. 

Here's a table of the built-in roles and their permissions for the project:

| Role | Description | 
| --- | --- |
| Owner | Full access to the project, including the ability to assign permissions to project users. |
| Contributor |    User has full access to the project but can't assign permissions to project users. |
| Azure AI Developer |     User can perform most actions, including create deployments, but can't assign permissions to project users. |
| Azure AI Inference Deployment Operator | Perform all actions required to create a resource deployment within a resource group. |
| Reader |     Read only access to the project. |

When a user is granted access to a project (for example, through the AI Studio permission management), two more roles are automatically assigned to the user. The first role is Reader on the hub. The second role is the Inference Deployment Operator role, which allows the user to create deployments on the resource group that the project is in. This role is composed of these two permissions: ```"Microsoft.Authorization/*/read"``` and    ```"Microsoft.Resources/deployments/*"```.

In order to complete end-to-end AI development and deployment, users only need these two autoassigned roles and either the Contributor or Azure AI Developer role on a project.

The minimum permissions needed to create a project is a role that has the allowed action of `Microsoft.MachineLearningServices/workspaces/hubs/join` on the hub. The Azure AI Developer built-in role has this permission.

## Dependency service Azure RBAC permissions

The hub has dependencies on other Azure services. The following table lists the permissions required for these services when you create a hub. The person that creates the hub needs these permissions. The person who creates a project from the hub doesn't need them.

| Permission | Purpose |
|------------|-------------|
| `Microsoft.Storage/storageAccounts/write` | Create a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
| `Microsoft.KeyVault/vaults/write` | Create a new key vault or updates the properties of an existing key vault. Certain properties might require more permissions. |
| `Microsoft.CognitiveServices/accounts/write` | Write API Accounts. |
| `Microsoft.MachineLearningServices/workspaces/write` | Create a new workspace or updates the properties of an existing workspace. |

## Sample enterprise RBAC setup
The following table is an example of how to set up role-based access control for your Azure AI Studio for an enterprise.

| Persona | Role | Purpose |
| --- | --- | ---|
| IT admin | Owner of the hub | The IT admin can ensure the hub is set up to their enterprise standards. They can assign managers the Contributor role on the resource if they want to enable managers to make new hubs. Or they can assign managers the Azure AI Developer role on the resource to not allow for new hub creation. |
| Managers | Contributor or Azure AI Developer on the hub | Managers can manage the hub, audit compute resources, audit connections, and create shared connections. |
| Team lead/Lead developer | Azure AI Developer on the hub | Lead developers can create projects for their team and create shared resources (ex: compute and connections) at the hub level. After project creation, project owners can invite other members. |
| Team members/developers | Contributor or Azure AI Developer on the project | Developers can build and deploy AI models within a project and create assets that enable development such as computes and connections. |

## Access to resources created outside of the hub

When you create a hub, the built-in role-based access control permissions grant you access to use the resource. However, if you wish to use resources outside of what was created on your behalf, you need to ensure both: 
- The resource you're trying to use has permissions set up to allow you to access it.
- Your hub is allowed to access it. 

For example, if you're trying to consume a new Blob storage, you need to ensure that hub's managed identity is added to the Blob Storage Reader role for the Blob. If you're trying to use a new Azure AI Search source, you might need to add the hub to the Azure AI Search's role assignments. 

## Manage access with roles 

If you're an owner of a hub, you can add and remove roles for AI Studio. Go to the **Home** page in [AI Studio](https://ai.azure.com) and select your hub. Then select **Users** to add and remove users for the hub. You can also manage permissions from the Azure portal under **Access Control (IAM)** or through the Azure CLI. For example, use the [Azure CLI](/cli/azure/) to assign the Azure AI Developer role to "joe@contoso.com" for resource group "this-rg" with the following command: 
 
```azurecli-interactive
az role assignment create --role "Azure AI Developer" --assignee "joe@contoso.com" --resource-group this-rg 
```

## Create custom roles

> [!NOTE]
> In order to make a new hub, you need the Owner or Contributor role. At this time, a custom role, even with all actions allowed, will not enable you to make a hub. 

If the built-in roles are insufficient, you can create custom roles. Custom roles might have the read, write, delete, and compute resource permissions in that AI Studio. You can make the role available at a specific project level, a specific resource group level, or a specific subscription level. 

> [!NOTE]
> You must be an owner of the resource at that level to create custom roles within that resource. 

## Scenario: Use a customer-managed key

When configuring a hub to use a customer-managed key (CMK), an Azure Key Vault is used to store the key. The user or service principal used to create the workspace must have owner or contributor access to the key vault.

If your AI Studio hub is configured with a **user-assigned managed identity**, the identity must be granted the following roles. These roles allow the managed identity to create the Azure Storage, Azure Cosmos DB, and Azure Search resources used when using a customer-managed key:

- `Microsoft.Storage/storageAccounts/write`
- `Microsoft.Search/searchServices/write`
- `Microsoft.DocumentDB/databaseAccounts/write`

Within the key vault, the user or service principal must have the create, get, delete, and purge access to the key through a key vault access policy. For more information, see [Azure Key Vault security](/azure/key-vault/general/security-features#controlling-access-to-key-vault-data).

## Scenario: Use an existing Azure OpenAI resource

When you create a connection to an existing Azure OpenAI resource, you must also assign roles to your users so they can access the resource. You should assign either the **Cognitive Services OpenAI User** or **Cognitive Services OpenAI Contributor** role, depending on the tasks they need to perform. For information on these roles and the tasks they enable, see [Azure OpenAI roles](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles).

## Scenario: Use Azure Container Registry

An Azure Container Registry instance is an optional dependency for Azure AI Studio hub. The following table lists the support matrix when authenticating a hub to Azure Container Registry, depending on the authentication method and the __Azure Container Registry's__ [public network access configuration](/azure/container-registry/container-registry-access-selected-networks). 

| Authentication method | Public network access </br>disabled | Azure Container Registry</br>Public network access enabled |
| ---- | :----: | :----: |
| Admin user | ✓ | ✓ |
| AI Studio hub system-assigned managed identity | ✓ | ✓ |
| AI Studio hub user-assigned managed identity </br>with the **ACRPull** role assigned to the identity |  | ✓ |

A system-assigned managed identity is automatically assigned to the correct roles when the hub is created. If you're using a user-assigned managed identity, you must assign the **ACRPull** role to the identity.

## Scenario: Use Azure Application Insights for logging

Azure Application Insights is an optional dependency for Azure AI Studio hub. The following table lists the permissions required if you want to use Application Insights when you create a hub. The person that creates the hub needs these permissions. The person who creates a project from the hub doesn't need these permissions.

| Permission | Purpose |
|------------|-------------|
| `Microsoft.Insights/Components/Write` | Write to an application insights component configuration. |
| `Microsoft.OperationalInsights/workspaces/write` | Create a new workspace or links to an existing workspace by providing the customer ID from the existing workspace. |

## Next steps

- [How to create an Azure AI Studio hub](../how-to/create-azure-ai-resource.md)
- [How to create an Azure AI Studio project](../how-to/create-projects.md)
- [How to create a connection in Azure AI Studio](../how-to/connections-add.md)
