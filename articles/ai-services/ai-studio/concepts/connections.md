---
title: Vector indexes in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces connections in Azure AI Studio
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Vector indexes in Azure AI Studio

In this article, you learn about connections in Azure AI Studio.

Connections are a way to authenticate and consume both Microsoft and third-party resources within your Azure AI projects. Connections can be used for prompt flow, training, and deployments (link to connections in MIR).  

Connectors allow you to securely store credentials, authenticate access, and consume data and information. Connections can be set up as shared with all projects in the same Azure AI resource, or created exclusively for one project (link to manage connections). Secrets associated with connections are securely persisted in the corresponding Azure Key Vault, adhering to robust security and compliance standards. As an administrator, you can audit both shared and project-scoped connections on an Azure AI resource level (link to connection rbac). 

Azure connections serve as key vault proxies, and interactions with connections are direct interactions with an Azure key vault. Azure AI Studio connections store API keys securely, as secrets, in a key vault. The key vault [Azure role-based access control (Azure RBAC)](#role-based-access-control-in-azure-ai-studio) controls access to these connection resources. A connection references the credentials from the key vault storage location for further use. You won't need to directly deal with the credentials after they are stored in the Azure AI resource's key vault. You have the option to store the credentials in the YAML file. A CLI command or SDK can override them. We recommend that you avoid credential storage in a YAML file, because a security breach could lead to a credential leak.  

There are two connections you can use to access third party Generative AI APIs. 
- The [API key](../how-to/connections-add.md#service-connection-types?tabs=api-key) allows you to access a single API. We recommend in most scenarios for you to use Api Key as it allows you to individually manage access per API. API Key connections also include authentication, allowing you to use your Key to authenticate to your desired Target.
- The second is Custom Connections that allows you to store multiple api keys and their targets. For some scenarios, ex: LangChain support, you may need to include multiple secret keys in a single connection, this is where Custom Connections is advantageous. Custom Connections do not authenticate for you, you will have to manage authenticate on your own. Custom Connections allow you to securely store and access keys while storing related properties, such as targets and versions, all in one “connection”. 

## Connections for datastores

An AI Studio Connection can be created as a *reference* to an *existing* Azure storage account or other *existing* Microsoft services.
We support Connection to data from following Azure storage account types: Microsoft OneLake, Azure Blob, Azure Data Lake Gen2.
A data connection offers these benefits:

- A common, easy-to-use API that interacts with different storage types (OneLake/Blob/ADLS gen2).
- Easier discovery of useful connections in team operations.
- For credential-based access (service principal/SAS/key), AI Studio connection secures credential information. This way, you won't need to place that information in your scripts.

When you create a connection with an existing Azure storage account, you can choose between two different authentication methods:

- **Credential-based** - authenticate data access with a service principal, shared access signature (SAS) token, or account key. Users with *Reader* workspace access can access the credentials.
- **Identity-based** - use your Azure Active Directory identity or managed identity to authenticate data access.

The following table summarizes the Azure cloud-based storage services that an Azure Machine Learning datastore can create. Additionally, the table summarizes the authentication types that can access those services:

Supported storage service | Credential-based authentication | Identity-based authentication
|---|:----:|:---:|
Azure Blob Container| ✓ | ✓|
Microsoft OneLake| ✓ | ✓|
Azure Data Lake Gen2| ✓ | ✓|


## Role-based access control in Azure AI Studio 

In this article, you learn how to manage access (authorization) to an Azure AI Studio. Azure role-based access control (Azure RBAC) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Microsoft Entra ID are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles. 

> [!WARNING]
> Applying some roles may limit UI functionality in Azure Machine Learning studio for other users. For example, if a user's role does not have the ability to create a compute instance, the option to create a compute instance will not be available in studio. This behavior is expected, and prevents the user from attempting operations that would return an access denied error. 


### Default roles 

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

### Manage access with roles 

If you're an owner of an AI Studio, you can add and remove roles for the Studio. For example, use the [Azure CLI](/cli/azure/) to assign Azure AI Developer role to "joe@contoso.com" for resource group "this-rg" with the following command: 
 
```azurecli-interactive
az role assignment create --role "Azure AI Developer" --assignee "joe@contoso.com" --resource-group this-rg 
```

### Create custom role 

If the built-in roles are insufficient, you can create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that AI Studio. You can make the role available at a specific project level, a specific resource group level, or a specific subscription level. 

> [!NOTE]
> You must be an owner of the resource at that level to create custom roles within that resource. 



## Next steps

- [How to create a connection in Azure AI Studio](../how-to/connections-add.md)
