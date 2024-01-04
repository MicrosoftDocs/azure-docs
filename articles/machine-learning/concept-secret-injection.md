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
ms.date: 01/02/2024

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


## Role assignment to the endpoint's identity

__Roles required by the secret stores__:

- If your secrets are stored in workspace connections under your workspace: `Workspace Connections` provides a [List Secrets API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) that requires the identity that calls the API to have `Azure Machine Learning Workspace Connection Secrets Reader` role (or equivalent) assigned to the identity.
- If your secrets are stored in an external Microsoft Azure Key Vault: Key Vault provides a [Get Secret Versions API](/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) that requires the identity that calls the API to have `Key Vault Secrets User` role (or equivalent) assigned to the identity.


## Implementation of secret injection

There are two ways to inject secrets:

- Inject secrets yourself, using managed identities.
- Inject secrets, using the secret injection feature.

Both of these approaches involve two steps:

1. First, retrieve secrets from the secret stores using endpoint identity.
1. Second, inject into your user container.

### Secret injection via the use of managed identities

In your deployment definition, you need to use the endpoint identity to call the APIs from secret stores. This logic can be implemented in your scoring script, or in shell scripts that you run in your BYOC container. You can implement this logic by extending the [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).

### Secret injection via the secret injection feature

Instead of directly calling the APIs from workspace connections and/or the Key Vault, you can map environment variables with the secrets (that you want to refer to) from workspace connections or the Key Vault, in your deployment definition. This approach doesn't require you to write any code in your scoring script or in shell scripts that you run in your BYOC container. To map environment variables with the secrets from workspace connections or the Key Vault, the following conditions must be met:

- If an online endpoint was defined to enforce access to default secret stores (workspace connections under the current workspace) when the *endpoint* was created, your user identity that creates the *deployment* under the endpoint should have the permissions to read secrets from workspace connections.
- The endpoint identity that the deployment uses should have permissions to read secrets from either workspace connections or the Key Vault, as referenced in the deployment definition.

> [!NOTE]
> - The endpoint identity might have automatically received permission for workspace connections if the endpoint was successfully created with an SAI and the flag set to enforce access to default secret stores. In other cases, for example, if the endpoint used a UAI, or the flag wasn't set, the endpoint identity might not have the permission for workspace connections. In such a situation, you need to perform the task of assigning the role for the workspace connections to the endpoint identity.
> - The endpoint identity won't automatically receive permission for the external Key Vault. You'll need to manually assign the role for the Key Vault to the endpoint identity, if you are using the Key Vault as a secret store.

For more information on using secret injection, see [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md).


## Related content

- [Online endpoints](concept-endpoints-online.md)
- [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md)
