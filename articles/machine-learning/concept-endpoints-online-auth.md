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
ms.date: 10/18/2023
---

# Authentication with managed online endpoints

[!INCLUDE [machine-learning-dev-v2](includes/machine-learning-dev-v2.md)]

In this article, we will explain what types of the authentication are available for online endpoints. We will cover both control plane operations and data plane operations.

## Types of operations

There are two types of operations on online endpoints: control plane operations and data plane operations.

- Control plane operations are operations that control the online endpoints themselves, such as create, read, update and delete (CRUD) operations on online endpoints and online deployments. For online endpoints/deployments, request to control plane goes to the workspace. 
- Data plane operations are operations that don't change the online endpoints but interact with them with data, such as sending a scoring request to the online endpoint and getting a response from it. For online endpoints/deployments, request to data plane goes to the scoring Uri of the online endpoint.


## Control plane authentication and authorization

### Authentication for control plane operations

For control plane operations, you will use the authentication to the workspace, based on Microsoft Entra ID. There are multiple authentication flows you can choose from, depending on your use case. You'll also need a proper Azure role-based access control (Azure RBAC) allowed for your identity of choice to your resources. See [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md) for more.

### Authorization for control plane operations

For control plane operations, you will need to have a proper Azure role-based access control (Azure RBAC) allowed for your identity of choice to your resources. Specifically for CRUD operations on online endpoints and deployments, you will need the identity to have the role assigned with the below actions:

| To do... | Required Azure RBAC action |
| -- | -- |
| Create/update operations on online endpoints and deployments | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write` on the scope of workspace. |
| Delete operations on online endpoints and deployments | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete` on the scope of workspace. |
| Create/update/delete operations on online endpoints and deployments via ML Studio | Owner, contributor, or custom role allowing `Microsoft.Resources/deployments/write` on the scope of resource group where the workspace belongs. |
| Read operations on online endpoints and deployments | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read` on the scope of workspace. |
| Fetch an Azure Machine Learning token (`aml_token`) for invoking online endpoints (both managed and Kubernetes) from the workspace | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` on the scope of endpoint. |
| Fetch a key for invoking online endpoints (both managed and Kubernetes) from the workspace | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action` on the scope of endpoint. |
| Regenerate keys for online endpoints (both managed and Kubernetes) | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action` on the scope of endpoint. |
| Fetch a Microsoft Entra token (`aad_token`) for invoking *managed* online endpoints | - |

> [!NOTE]
> You can fetch Microsoft Entra token (`aad_token`) directly from Microsoft Entra ID, and you don't need Azure RBAC permission on the workspace.

See [Manage access to Azure Machine Learning](how-to-assign-roles.md) for more.

## Data plane authentication and authorization

### Authentication for data plane operations

For data plane operations, you can choose from 3 types of authentication: key, Azure Machine Learning token (`aml_token`), or Microsoft Entra token (`aad_token`) to authenticate to send requests to the scoring Uri of the endpoint. See [How to authenticate to an online endpoint](how-to-authenticate-online-endpoint.md) for more.

### Authorization for data plane operations

For data plane operations, you will need to have a proper Azure role-based access control (Azure RBAC) allowed for your identity of choice to your resources, only if you endpoint is set to use Microsoft Entra token (`aad_token`). Specifically for data plane operations on online endpoints, you will need the identity to have the role assigned with the below actions:

| To do... | Required Azure RBAC action |
| -- | -- |
| Invoke *managed* online endpoints with Microsoft Entra token (`aad_token`). | Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action` on the scope of endpoint. |
| Invoke online endpoints with key or Azure Machine Learning token (`aml_token`). | - |


## Assigning roles for authorization

Azure RBAC allow you to define and assign a role with a set of allowed and/or denied actions on a specific scope. See [Manage access to Azure Machine Learning](how-to-assign-roles.md) for specific guidelines for control plane operations. See [Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview) to learn more about role definition, scope, and role assignment.

You can define the permission action according to your business needs. For example, you can use the permission action `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*/actions` if you want to control all operations above altogether.

You can also define the scopes according to your business needs. For example, you can use the scope `/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>/onlineEndpoints/<endpointName>` if you want to control the operations for a specific endpoint. You can also use the scope `/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>` if you want to control the operations for all endpoints in a workspace. See [Understand scope for Azure RBAC](https://learn.microsoft.com/azure/role-based-access-control/scope-overview) for more.


## Limitation

Entra ID authentication (`aad_token`) is supported for managed online endpoints only. For Kubernetes online endpoints, you can use either key or Azure Machine Learning token (`aml_token`).


## Next steps

- [Set up authentication](how-to-setup-authentication.md)
- [How to authenticate to an online endpoint](how-to-authenticate-online-endpoint.md)
- [How to deploy an online endpoint](how-to-deploy-online-endpoints.md)
