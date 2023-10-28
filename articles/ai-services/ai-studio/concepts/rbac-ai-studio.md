---
title: Role-based access control in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces role-based access control in Azure AI Studio
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Role-based access control in Azure AI Studio 

In this article, you learn how to manage access (authorization) to an Azure AI resource. Azure role-based access control (Azure RBAC) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Microsoft Entra ID are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles. 

> [!WARNING]
> Applying some roles may limit UI functionality in Azure AI Studio for other users. For example, if a user's role does not have the ability to create a compute instance, the option to create a compute instance will not be available in studio. This behavior is expected, and prevents the user from attempting operations that would return an access denied error. 


## Default roles 

The Azure AI Studio has built-in roles that are available by default. This role can be assigned to enable users to perform all actions except manage to AI Studio resource itself. 

Here's a table of the built-in roles and their permissions:

| Role | Description | 
| --- | --- |
| Owner | Full access to the AI Studio, including the ability to manage the resource and assign permissions. |
| Azure AI Developer | Perform all actions except create new AI resources. For example, users can create projects, compute, and connections. Users can assign permissions within their project. Users can interact with existing AI resources such as Azure OpenAI, Azure AI Search, and Azure AI Services. |
| Reader | Read only access to the Studio and Projects. |
| AzureML Data Scientist | User has access within a project to perform actions except create computes, use AI resources, and modify the project itself. |
| Contributor | User has access within a project to perform actions except use AI resources and modify the project itself. |

Most users who wish to use the AI Studio will find that the "Azure AI Developer" role is the best role for them. The full set of permissions for the "Azure AI Developer" role are as follows:

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
            "Microsoft.MachineLearningServices/workspaces/endpoints/write", 
            "Microsoft.MachineLearningServices/workspaces/endpoints/delete", 
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

## Manage access with roles 

If you're an owner of an AI Studio, you can add and remove roles for the Studio. For example, use the [Azure CLI](/cli/azure/) to assign Azure AI Developer role to "joe@contoso.com" for resource group "this-rg" with the following command: 
 
```azurecli-interactive
az role assignment create --role "Azure AI Developer" --assignee "joe@contoso.com" --resource-group this-rg 
```

## Create custom role 

If the built-in roles are insufficient, you can create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that AI Studio. You can make the role available at a specific project level, a specific resource group level, or a specific subscription level. 

> [!NOTE]
> You must be an owner of the resource at that level to create custom roles within that resource. 



## Next steps

- [How to create a connection in Azure AI Studio](../how-to/connections-add.md)
