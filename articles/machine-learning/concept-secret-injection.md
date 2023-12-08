---
title: What is secret injection in online endpoints (preview)?
titleSuffix: Azure Machine Learning
# title: #Required; Keep the title body to 60-65 chars max including spaces and brand
# description: #Required; Keep the description within 100- and 165-characters including spaces
description: Learn about secret injection as it applies to online endpoints in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: concept-article
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: ignite-2023
ms.date: 10/25/2023

#CustomerIntent: As an ML Pro, I want to retrieve and inject secrets into the deployment environment easily so that deployments I create can consume the secrets in a secured manner.
---

# Secret injection in online endpoints (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Secret injection in the context of an online endpoint is a process of retrieving secrets (such as API keys) from secret stores, and injecting them into your user container that runs inside an online deployment. Secrets will eventually be accessible via environment variables, thereby providing a secure way for them to be consumed by the inference server that runs your scoring script or by the inferencing stack that you bring with a BYOC (bring your own container) deployment approach.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Problem statement

When you create an online deployment, you might want to use secrets from within the deployment to access external services. These external services could include Microsoft Azure OpenAI service, Azure AI Services, Azure AI Content Safety, and so on.

However, you have to find a way to securely pass secrets to your user container that runs inside the deployment. We don't recommend that you include secrets as part of the deployment definition—a practice that exposes the secrets in the deployment definition. A better approach is to store the secrets in secret stores and then retrieve them from within the deployment in a secure manner. This approach poses its own challenge—how can a deployment authenticate itself to the secret stores to retrieve secrets?

The online deployment runs your user container using the endpoint identity, which is a [managed identity](/entra/identity/managed-identities-azure-resources/overview). Use of the managed  identity means that you can use [Azure RBAC](../role-based-access-control/overview.md) to control the endpoint identity's permissions and allow the endpoint to retrieve secrets from the secret stores. You can see this [example that shows how to use managed identities to interact with external services](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities) and extend it to retrieve secrets in your deployment. This approach requires you to do the following tasks:

- Assign the right roles to the endpoint identity so that it can read secrets from the secret stores.
- Implement the scoring logic for the deployment so that it uses the endpoint's managed identity to retrieve the secrets from the secret stores.

While this approach of using a managed identity is a secure way to retrieve secrets, the secret injection feature simplifies the process further for [workspace connections](prompt-flow/concept-connections.md) and [key vaults](../key-vault/general/overview.md).


## Managed identity associated with the endpoint

An online deployment runs your user container with the managed identity associated with the endpoint. This managed identity, the _endpoint identity_, is a [Microsoft Entra ID](/entra/fundamentals/whatis) that supports [Azure RBAC](../role-based-access-control/overview.md). Therefore, you can assign Azure roles to the identity to control permissions that are required to perform operations. This endpoint identity can be either a system-assigned identity (SAI) or a user-assigned identity (UAI). You can decide whether to use an SAI or a UAI when you create the endpoint.

- For a _system-assigned identity_, the identity is created automatically when you create the endpoint, and roles with fundamental permissions (such as the Azure Container Registry pull permission and the storage blob data reader) are automatically assigned.
- For a _user-assigned identity_, you need to create the identity first, and then associate it with the endpoint when you create the endpoint. You're also responsible for assigning proper roles to the UAI as needed.

For more information on using managed identities of an endpoint, see [How to access resources from endpoints with managed identities](how-to-access-resources-from-endpoints-managed-identities.md), and an [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).

## Implementation of secret injection

There are two ways to inject secrets:

- Inject secrets yourself, using managed identities.
- Inject secrets, using the secret injection feature.

Both of these approaches involve two steps:

1. First, assign roles with proper permissions to the endpoint identity.
1. Second, retrieve secrets from the secret stores to inject into your user container.

### Secret injection via the use of managed identities

__Role assignment to the endpoint's identity__:

Because the automatic role assignment for the endpoint's system-assigned identity (SAI) doesn't include the "read secrets" permission by default, you need to perform this role assignment yourself. For example,

- If your secrets are stored in workspace connections under your workspace: `Workspace Connections` provides a [List Secrets API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) that requires the identity that calls the API to have `Azure Machine Learning Workspace Connection Secret Reader` role (or equivalent) assigned to the identity.
- If your secrets are stored in an external Microsoft Azure Key Vault: Key Vault provides a [Get Secret Versions API](/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) that requires the identity that calls the API to have `Key Vault Secrets User` role (or equivalent) assigned to the identity.

__Secret retrieval and injection__:

In your deployment definition, you need to use the endpoint identity to call the APIs from secret stores. This logic can be implemented in your scoring script, or in shell scripts that you run in your BYOC container. You can implement this logic by extending the [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).

### Secret injection via the secret injection feature

__Role assignment to the endpoint's identity__:

When you create an online endpoint, you can set a flag on the endpoint to allow its system-assigned identity (SAI) to have the permission to read secrets from workspace connections. To have this permission, the `Azure Machine Learning Workspace Connection Secret Reader` role would be automatically assigned to the endpoint identity. For this role to be automatically assigned to the endpoint identity, the following conditions must be met:

- Your _user identity_, that is, the identity that creates the endpoint, has the permissions to read secrets from workspace connections when creating the endpoint.
- The endpoint uses an SAI.
- The endpoint is defined with a flag to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint.

If you're using a UAI for the endpoint, or if the Key Vault is used as the secret store, you need to perform the task of assigning the role with proper permissions to the endpoint identity.

__Secret retrieval and injection__:

In your deployment definition, instead of directly calling the APIs from workspace connections or the Key Vault, you can map environment variables with the secrets (that you want to refer to) from workspace connections or the Key Vault. This approach doesn't require you to write any code in your scoring script or in shell scripts that you run in your BYOC container. To map environment variables with the secrets from workspace connections or the Key Vault, the following conditions must be met:

- If the endpoint was defined to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint, your user identity that creates the deployment should have the permissions to read secrets from workspace connections.
- The endpoint identity has permissions to read secrets from either workspace connections or the Key Vault, as referenced in the deployment definition.
    - The endpoint identity might have automatically received permission for workspace connections if the endpoint was successfully created with an SAI and the flag set to enforce access to default secret stores. In other cases, for example, if the endpoint used a UAI, or the flag wasn't set, the endpoint identity might not have the permission for workspace connections. In such a situation, you need to perform the task of assigning the role for the workspace connections to the endpoint identity.
    - The endpoint identity won't automatically receive permission for the Key Vault. You need to manually assign the role for the Key Vault to the endpoint identity.

For more information on using secret injection, see [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md).

### User identity and endpoint identity

__The differences__:

The _user identity_ is the identity that you can use to create the endpoint and deployment(s) under the endpoint.

The _endpoint identity_ is the identity that runs the user container in deployments. This identity can be a user-assigned identity (UAI) or a system-assigned identity (SAI). As mentioned earlier, for an SAI, the endpoint identity is created automatically when you create the endpoint. For a UAI, you need to create the identity first and then associate it with the endpoint when you create the endpoint.

__Permissions needed for user identity__:

When the endpoint is created with an SAI _and_ the flag is set to enforce access to the default secret stores, your user identity needs to have permissions to read secrets from workspace connections when creating the endpoint and creating the deployment(s) under the endpoint. This restriction ensures that only a user identity with the permission to read secrets can grant the endpoint identity the permission to read secrets.

- If a user identity doesn't have the permissions to read secrets from workspace connections, but it tries to create the endpoint with an SAI and the endpoint's flag set to enforce access to the default secret stores, the endpoint creation is rejected.

- Similarly, if a user identity doesn't have the permissions to read secrets from workspace connections, but tries to create a deployment under the endpoint with an SAI and the endpoint's flag set to enforce access to the default secret stores, the deployment creation is rejected.

When the endpoint is created with a UAI, _or_ the flag is _not_ set to enforce access to the default secret stores, even if the endpoint uses an SAI, your user identity doesn't need to have permissions to read secrets from workspace connections. In this case, the endpoint identity won't be automatically granted the permission to read secrets, but you can still manually grant the endpoint identity this permission by assigning proper roles. Secret retrieval and injection will still be triggered if you mapped the environment variables with secret references, and it will use the current endpoint identity to do so.


## Related content

- [Online endpoints](concept-endpoints-online.md)
- [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md)
