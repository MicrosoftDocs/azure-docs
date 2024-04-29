---
title: Role-based access control in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces role-based access control in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 02/14/2024
ms.reviewer: meyetman
ms.author: larryfr
author: Blackmist
---

# Role-based access control in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this article, you learn how to manage access (authorization) to an Azure AI hub resource. Azure Role-based access control is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Microsoft Entra ID are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles. 

> [!WARNING]
> Applying some roles might limit UI functionality in Azure AI Studio for other users. For example, if a user's role does not have the ability to create a compute instance, the option to create a compute instance will not be available in studio. This behavior is expected, and prevents the user from attempting operations that would return an access denied error. 

## Azure AI hub resource vs Azure AI project

In the Azure AI Studio, there are two levels of access: the Azure AI hub and the Azure AI project. The AI hub is home to the infrastructure (including virtual network setup, customer-managed keys, managed identities, and policies) as well as where you configure your Azure AI services. Azure AI hub access can allow you to modify the infrastructure, create new Azure AI hub resources, and create projects. Azure AI projects are a subset of the Azure AI hub resource that act as workspaces that allow you to build and deploy AI systems. Within a project you can develop flows, deploy models, and manage project assets. Project access lets you develop AI end-to-end while taking advantage of the infrastructure setup on the Azure AI hub resource.

:::image type="content" source="../media/concepts/azureai-hub-project-relationship.png" alt-text="Diagram of the relationship between AI Studio resources." lightbox="../media/concepts/azureai-hub-project-relationship.png":::

One of the key benefits of the AI hub and AI project relationship is that developers can create their own projects that inherit the AI hub security settings. You might also have developers who are contributors to a project, and can't create new projects.

## Default roles for the Azure AI hub resource 

The Azure AI Studio has built-in roles that are available by default. In addition to the Reader, Contributor, and Owner roles, the Azure AI Studio has a new role called Azure AI Developer. This role can be assigned to enable users to create connections, compute, and projects, but not let them create new Azure AI hub resources or change permissions of the existing Azure AI hub resource.

Here's a table of the built-in roles and their permissions for the Azure AI hub resource:

| Role | Description | 
| --- | --- |
| Owner | Full access to the Azure AI hub resource, including the ability to manage and create new Azure AI hub resources and assign permissions. This role is automatically assigned to the Azure AI hub resource creator|
| Contributor |    User has full access to the Azure AI hub resource, including the ability to create new Azure AI hub resources, but isn't able to manage Azure AI hub resource permissions on the existing resource. |
| Azure AI Developer |     Perform all actions except create new Azure AI hub resources and manage the Azure AI hub resource permissions. For example, users can create projects, compute, and connections. Users can assign permissions within their project. Users can interact with existing Azure AI resources such as Azure OpenAI, Azure AI Search, and Azure AI services. |
| Reader |     Read only access to the Azure AI hub resource. This role is automatically assigned to all project members within the Azure AI hub resource. |


The key difference between Contributor and Azure AI Developer is the ability to make new Azure AI hub resources. If you don't want users to make new Azure AI hub resources (due to quota, cost, or just managing how many Azure AI hub resources you have), assign the AI Developer role.

Only the Owner and Contributor roles allow you to make an Azure AI hub resource. At this time, custom roles can't grant you permission to make Azure AI hub resources.

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
## Default roles for Azure AI projects 

Projects in the Azure AI Studio have built-in roles that are available by default. In addition to the Reader, Contributor, and Owner roles, projects also have the Azure AI Developer role.

Here's a table of the built-in roles and their permissions for the Azure AI project:

| Role | Description | 
| --- | --- |
| Owner | Full access to the Azure AI project, including the ability to assign permissions to project users. |
| Contributor |    User has full access to the Azure AI project but can't assign permissions to project users. |
| Azure AI Developer |     User can perform most actions, including create deployments, but can't assign permissions to project users. |
| Reader |     Read only access to the Azure AI project. |

When a user is granted access to a project (for example, through the AI Studio permission management), two more roles are automatically assigned to the user. The first role is Reader on the Azure AI hub resource. The second role is the Inference Deployment Operator role, which allows the user to create deployments on the resource group that the project is in. This role is composed of these two permissions: ```"Microsoft.Authorization/*/read"``` and    ```"Microsoft.Resources/deployments/*"```.

In order to complete end-to-end AI development and deployment, users only need these two autoassigned roles and either the Contributor or Azure AI Developer role on a *project*.

The minimum permissions needed to create an AI project resource is a role that has the allowed action of `Microsoft.MachineLearningServices/workspaces/hubs/join` on the AI hub resource. The Azure AI Developer built-in role has this permission.

## Dependency service RBAC permissions

The Azure AI hub resource has dependencies on other Azure services. The following table lists the permissions required for these services when you create an Azure AI hub resource. These permissions are needed by the person that creates the AI hub. They aren't needed by the person who creates an AI project from the AI hub.

| Permission | Purpose |
|------------|-------------|
| `Microsoft.Storage/storageAccounts/write` | Create a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
| `Microsoft.KeyVault/vaults/write` | Create a new key vault or updates the properties of an existing key vault. Certain properties might require more permissions. |
| `Microsoft.CognitiveServices/accounts/write` | Write API Accounts. |
| `Microsoft.Insights/Components/Write` | Write to an application insights component configuration. |
| `Microsoft.OperationalInsights/workspaces/write` | Create a new workspace or links to an existing workspace by providing the customer ID from the existing workspace. |

## Sample enterprise RBAC setup
The following is an example of how to set up role-based access control for your Azure AI Studio for an enterprise.

| Persona | Role | Purpose |
| --- | --- | ---|
| IT admin | Owner of the Azure AI hub resource | The IT admin can ensure the Azure AI hub resource is set up to their enterprise standards and assign managers the Contributor role on the resource if they want to enable managers to make new Azure AI hub resources or they can assign managers the Azure AI Developer role on the resource to not allow for new Azure AI hub resource creation. |
| Managers | Contributor or Azure AI Developer on the Azure AI hub resource | Managers can manage the AI hub, audit compute resources, audit connections, and create shared connections. |
| Team lead/Lead developer | Azure AI Developer on the Azure AI hub resource | Lead developers can create projects for their team and create shared resources (ex: compute and connections) at the Azure AI hub resource level. After project creation, project owners can invite other members. |
| Team members/developers | Contributor or Azure AI Developer on the Azure AI Project | Developers can build and deploy AI models within a project and create assets that enable development such as computes and connections. |

## Access to resources created outside of the Azure AI hub resource

When you create an Azure AI hub resource, the built-in role-based access control permissions grant you access to use the resource. However, if you wish to use resources outside of what was created on your behalf, you need to ensure both: 
- The resource you're trying to use has permissions set up to allow you to access it.
- Your Azure AI hub resource is allowed to access it. 

For example, if you're trying to consume a new Blob storage, you need to ensure that Azure AI hub resource's managed identity is added to the Blob Storage Reader role for the Blob. If you're trying to use a new Azure AI Search source, you might need to add the Azure AI hub resource to the Azure AI Search's role assignments. 

## Manage access with roles 

If you're an owner of an Azure AI hub resource, you can add and remove roles for the Studio. Within the Azure AI Studio, go to **Manage** and select your Azure AI hub resource. Then select **Permissions** to add and remove users for the Azure AI hub resource. You can also manage permissions from the Azure portal under **Access Control (IAM)** or through the Azure CLI. For example, use the [Azure CLI](/cli/azure/) to assign the Azure AI Developer role to "joe@contoso.com" for resource group "this-rg" with the following command: 
 
```azurecli-interactive
az role assignment create --role "Azure AI Developer" --assignee "joe@contoso.com" --resource-group this-rg 
```

## Create custom roles

> [!NOTE]
> In order to make a new Azure AI hub resource, you need the Owner or Contributor role. At this time, a custom role, even with all actions allowed, will not enable you to make an Azure AI hub resource. 

If the built-in roles are insufficient, you can create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that AI Studio. You can make the role available at a specific project level, a specific resource group level, or a specific subscription level. 

> [!NOTE]
> You must be an owner of the resource at that level to create custom roles within that resource. 

## Scenario: Use a customer-managed key

When using a customer-managed key (CMK), an Azure Key Vault is used to store the key. The user or service principal used to create the workspace must have owner or contributor access to the key vault.

If your Azure AI hub is configured with a **user-assigned managed identity**, the identity must be granted the following roles. These roles allow the managed identity to create the Azure Storage, Azure Cosmos DB, and Azure Search resources used when using a customer-managed key:

- `Microsoft.Storage/storageAccounts/write`
- `Microsoft.Search/searchServices/write`
- `Microsoft.DocumentDB/databaseAccounts/write`

Within the key vault, the user or service principal must have create, get, delete, and purge access to the key through a key vault access policy. For more information, see [Azure Key Vault security](/azure/key-vault/general/security-features#controlling-access-to-key-vault-data).

## Scenario: Use Azure Container Registry

An Azure Container Registry instance is an optional dependency for Azure AI Studio hub. The following table lists the support matrix when authenticating a hub to Azure Container Registry, depending on the authentication method and the __Azure Container Registry's__ [public network access configuration](/azure/container-registry/container-registry-access-selected-networks). 

| Authentication method | Public network access</br>disabled | Azure Container Registry</br>Public network access enabled |
| ---- | :----: | :----: |
| Admin user | ✓ | ✓ |
| AI Studio hub system-assigned managed identity | ✓ | ✓ |
| AI Studio hub user-assigned managed identity</br>with the **ACRPull** role assigned to the identity |  | ✓ |

A system-assigned managed identity is automatically assigned to the correct roles when the Azure AI hub is created. If you're using a user-assigned managed identity, you must assign the **ACRPull** role to the identity.

## Next steps

- [How to create an Azure AI hub resource](../how-to/create-azure-ai-resource.md)
- [How to create an Azure AI project](../how-to/create-projects.md)
- [How to create a connection in Azure AI Studio](../how-to/connections-add.md)
