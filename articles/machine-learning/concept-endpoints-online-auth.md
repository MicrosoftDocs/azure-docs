---
title: Authentication for managed online endpoints
titleSuffix: Azure Machine Learning
description: Learn how authentication works for Azure Machine Learning managed online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: devplatv2
ms.date: 12/15/2023
---

# Authentication for managed online endpoints

[!INCLUDE [machine-learning-dev-v2](includes/machine-learning-dev-v2.md)]

This article explains the concepts of identity and permission in the context of online endpoints. We begin with a discussion of [Microsoft Entra IDs](/entra/fundamentals/whatis) that support [Azure RBAC](../role-based-access-control/overview.md). Depending on the purpose of the Microsoft Entra identity, we refer to it either as a _user identity_ or an _endpoint identity_.

A _user identity_ is a Microsoft Entra ID that you can use to create an endpoint and its deployment(s), or use to interact with endpoints or workspaces. In other words, an identity can be considered a user identity if it's issuing requests to endpoints, deployments, or workspaces. The user identity would need proper permissions to perform control plane and data plane operations on the endpoints or workspaces.

An _endpoint identity_ is a Microsoft Entra ID that runs the user container in deployments. In other words, if the identity is associated with the endpoint and used for the user container for the deployment, then it's called an endpoint identity. The endpoint identity would also need proper permissions for the user container to interact with resources as needed. For example, the endpoint identity would need the proper permissions to pull images from the Azure Container Registry or to interact with other Azure services.

In general, the user identity and endpoint identity would have separate permission requirements. For more information on managing identities and permissions, see [How to authenticate online endpoint](how-to-authenticate-online-endpoint.md). For more information on the special case of automatically adding extra permission for secrets, see [Additional permissions for user identity](#additional-permissions-for-user-identity-when-enforcing-access-to-default-secret-stores).


## Limitation

Microsoft Entra ID authentication (`aad_token`) is supported for managed online endpoints __only__. For Kubernetes online endpoints, you can use either a key or an Azure Machine Learning token (`aml_token`).


## Permissions needed for user identity

When you sign in to your Azure tenant with your Microsoft account (for example, using `az login`), you complete the user authentication step (commonly known as _authn_) and your identity as a user is determined. Now, say you want to create an online endpoint under a workspace, you'll need the proper permission to do so. This is where authorization (commonly known as _authz_) comes in.

### Control plane operations

_Control plane operations_ control and change the online endpoints. These operations include create, read, update, and delete (CRUD) operations on online endpoints and online deployments. For online endpoints and deployments, requests to perform control plane operations go to the Azure Machine Learning workspace.

#### Authentication for control plane operations

For control plane operations, you have one way to authenticate a client to the workspace: by using a __Microsoft Entra token__.

Depending on your use case, you can choose from [several authentication workflows to get this token](how-to-setup-authentication.md). Your user identity also needs to have a proper Azure role-based access control (Azure RBAC) allowed for access to your resources.

#### Authorization for control plane operations

For control plane operations, your user identity needs to have a proper Azure role-based access control (Azure RBAC) allowed for access to your resources. Specifically, for CRUD operations on online endpoints and deployments, you need the identity to have the role assigned with the following actions:

| Operation | Required Azure RBAC role | Scope that the role is assigned for |
| -- | -- | -- |
| Create/update operations on online endpoints and deployments | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write` | workspace |
| Delete operations on online endpoints and deployments | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete` | workspace |
| Create/update/delete operations on online endpoints and deployments via the Azure Machine Learning studio | Owner, contributor, or any role allowing `Microsoft.Resources/deployments/write` | resource group where the workspace belongs |
| Read operations on online endpoints and deployments | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read` | workspace |
| Fetch an Azure Machine Learning token (`aml_token`) for invoking online endpoints (both managed and Kubernetes) from the workspace | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` | endpoint |
| Fetch a key for invoking online endpoints (both managed and Kubernetes) from the workspace | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action` | endpoint |
| Regenerate keys for online endpoints (both managed and Kubernetes) | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action` | endpoint |
| Fetch a Microsoft Entra token (`aad_token`) for invoking _managed_ online endpoints | Doesn't require a role. | not applicable|

> [!NOTE]
> You can fetch your Microsoft Entra token (`aad_token`) directly from Microsoft Entra ID once you're signed in, and you don't need extra Azure RBAC permission on the workspace.

#### Additional permissions for user identity when enforcing access to default secret stores

If you intend to use the [secret injection](concept-secret-injection.md) feature, and while creating your endpoints, you set the flag to enforce access to the default secret stores, your _user identity_ needs to have the permission to read secrets from workspace connections.

When the endpoint is created with a system-assigned identity (SAI) _and_ the flag is set to enforce access to the default secret stores, your user identity needs to have permissions to read secrets from workspace connections when creating the endpoint and creating the deployment(s) under the endpoint. This restriction ensures that only a _user identity_ with the permission to read secrets can grant the endpoint identity the permission to read secrets.

- If a user identity doesn't have the permissions to read secrets from workspace connections, but it tries to create the _endpoint_ with an SAI and the endpoint's flag set to enforce access to the default secret stores, the endpoint creation is rejected.

- Similarly, if a user identity doesn't have the permissions to read secrets from workspace connections, but tries to create a _deployment_ under the endpoint with an SAI and the endpoint's flag set to enforce access to the default secret stores, the deployment creation is rejected.

When (1) the endpoint is created with a UAI, _or_ (2) the flag is _not_ set to enforce access to the default secret stores even if the endpoint uses an SAI, your user identity doesn't need to have permissions to read secrets from workspace connections. In this case, the endpoint identity won't be automatically granted the permission to read secrets, but you can still manually grant the endpoint identity this permission by assigning proper roles if needed. Regardless whether the role assignment was done automatically or manually, the secret retrieval and injection will still be triggered if you mapped the environment variables with secret references in the deployment definition, and it will use the endpoint identity to do so.

For more information on managing authorization to an Azure Machine Learning workspace, see [Manage access to Azure Machine Learning](how-to-assign-roles.md).

For more information on secret injection, see [Secret injection in online endpoints](concept-secret-injection.md).


### Data plane operations

_Data plane operations_ don't change the online endpoints, rather, they use data to interact with the endpoints. An example of a data plane operation is to send a scoring request to an online endpoint and get a response from it. For online endpoints and deployments, requests to perform data plane operations go to the endpoint's scoring URI.

#### Authentication for data plane operations

For data plane operations, you can choose from three ways to authenticate a client to send requests to an endpoint's scoring URI:

- key
- Azure Machine Learning token (`aml_token`)
- Microsoft Entra token (`aad_token`)

For more information on how to authenticate clients for data plane operations, see [How to authenticate clients for online endpoints](how-to-authenticate-online-endpoint.md).

#### Authorization for data plane operations

For data plane operations, your user identity needs to have a proper Azure role-based access control (Azure RBAC) allowed for access to your resources, only if the endpoint is set to use Microsoft Entra token (`aad_token`). Specifically, for data plane operations on online endpoints and deployments, you need the identity to have the role assigned with the following actions:


| Operation | Required Azure RBAC role | Scope that the role is assigned for |
| -- | -- | -- |
| Invoke online endpoints with key or Azure Machine Learning token (`aml_token`). | Doesn't require a role. | Not applicable |
| Invoke _managed_ online endpoints with Microsoft Entra token (`aad_token`). | Owner, contributor, or any role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action` | endpoint |
| Invoke _Kubernetes_ online endpoints with Microsoft Entra token (`aad_token`). | Doesn't require a role. | Not applicable |


## Permissions needed for endpoint identity

An online deployment runs your user container with the _endpoint identity_, that is, the managed identity associated with the endpoint. The endpoint identity is a [Microsoft Entra ID](/entra/fundamentals/whatis) that supports [Azure RBAC](../role-based-access-control/overview.md). Therefore, you can assign Azure roles to the endpoint identity to control permissions that are required to perform operations. This endpoint identity can be either a system-assigned identity (SAI) or a user-assigned identity (UAI). You can decide whether to use an SAI or a UAI when you create the endpoint.

- For a _system-assigned identity_, the identity is created automatically when you create the endpoint, and roles with fundamental permissions (such as the Azure Container Registry pull permission and the storage blob data reader) are automatically assigned.
- For a _user-assigned identity_, you need to create the identity first, and then associate it with the endpoint when you create the endpoint. You're also responsible for assigning proper roles to the UAI as needed.

### Automatic role assignment for endpoint identity

If the endpoint identity is a system-assigned identity, some roles are assigned to the endpoint identity for convenience.

Role | Description | Condition for the automatic role assignment
-- | -- | --
`AcrPull` | Allows the endpoint identity to pull images from the Azure Container Registry (ACR) associated with the workspace. | The endpoint identity is a system-assigned identity (SAI).
`Storage Blob Data Reader` | Allows the endpoint identity to read blobs from the default datastore of the workspace. | The endpoint identity is a system-assigned identity (SAI).
`AzureML Metrics Writer (preview)` | Allows the endpoint identity to write metrics to the workspace. | The endpoint identity is a system-assigned identity (SAI).
`Azure Machine Learning Workspace Connection Secrets Reader` <sup>1</sup> | Allows the endpoint identity to read secrets from workspace connections. | The endpoint identity is a system-assigned identity (SAI). The endpoint is created with a flag to enforce access to the default secret stores. The _user identity_ that creates the endpoint has the same permission to read secrets from workspace connections. <sup>2</sup>

> 1. For more information on the `Azure Machine Learning Workspace Connection Secrets Reader` role, see [Assign permissions to the identity](how-to-authenticate-online-endpoint.md#assign-permissions-to-the-identity).
> 2. Even if the endpoint identity is SAI, if the enforce flag is not set or the user identity doesn't have the permission, there's no automatic role assignment for this role. For more information, see [How to deploy online endpoint with secret injection](how-to-deploy-online-endpoint-with-secret-injection.md#create-an-endpoint).

If the endpoint identity is a user-assigned identity, there's no automatic role assignment. In this case, you need to manually assign roles to the endpoint identity as needed.


## Choosing the permissions and scope for authorization

Azure RBAC allows you to define and assign __roles__ with a set of allowed and/or denied __actions__ on specific __scopes__. You can customize these roles and scopes according to your business needs. The following examples serve as a starting point and can be extended as necessary.

__Examples for user identity__

- To control all operations listed in the previous [table for control plane operations](#authorization-for-control-plane-operations) and the table for [data plane operations](#authorization-for-data-plane-operations), you can consider using a built-in role `AzureML Data Scientist` that includes the permission action `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*/actions`.
- To control the operations for a specific endpoint, consider using the scope `/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>/onlineEndpoints/<endpointName>`.
- To control the operations for all endpoints in a workspace, consider using the scope `/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>`.

__Examples for endpoint identity__

- To allow the user container to read blobs, consider using a built-in role `Storage Blob Data Reader` that includes the permission data action `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`.

For more information on guidelines for control plane operations, see [Manage access to Azure Machine Learning](how-to-assign-roles.md). For more information on role definition, scope, and role assignment, see [Azure RBAC](/azure/role-based-access-control/overview). To understand the scope for assigned roles, see [Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview).


## Related content

- [Set up authentication](how-to-setup-authentication.md)
- [How to authenticate to an online endpoint](how-to-authenticate-online-endpoint.md)
- [How to deploy an online endpoint](how-to-deploy-online-endpoints.md)
