---
title: What is secret injection in online endpoints (preview)?
titleSuffix: Azure Machine Learning
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
ms.date: 01/10/2024

#CustomerIntent: As an ML Pro, I want to retrieve and inject secrets into the deployment environment easily so that deployments I create can consume the secrets in a secured manner.
---

# Secret injection in online endpoints (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Secret injection in the context of an online endpoint is a process of retrieving secrets (such as API keys) from secret stores, and injecting them into your user container that runs inside an online deployment. Secrets are eventually accessed securely via environment variables, which are used by the inference server that runs your scoring script or by the inferencing stack that you bring with a BYOC (bring your own container) deployment approach.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Problem statement

When you create an online deployment, you might want to use secrets from within the deployment to access external services. Some of these external services include Microsoft Azure OpenAI service, Azure AI Services, and Azure AI Content Safety.

To use the secrets, you have to find a way to securely pass them to your user container that runs inside the deployment. We don't recommend that you include secrets as part of the deployment definition, since this practice would expose the secrets in the deployment definition. 

A better approach is to store the secrets in secret stores and then retrieve them securely from within the deployment. However, this approach poses its own challenge: how the deployment should authenticate itself to the secret stores to retrieve secrets. Because the online deployment runs your user container using the _endpoint identity_, which is a [managed identity](/entra/identity/managed-identities-azure-resources/overview), you can use [Azure RBAC](../role-based-access-control/overview.md) to control the endpoint identity's permissions and allow the endpoint to retrieve secrets from the secret stores.
Using this approach requires you to do the following tasks:

- Assign the right roles to the endpoint identity so that it can read secrets from the secret stores.
- Implement the scoring logic for the deployment so that it uses the endpoint's managed identity to retrieve the secrets from the secret stores.

While this approach of using a managed identity is a secure way to retrieve and inject secrets, [secret injection via the secret injection feature](#secret-injection-via-the-secret-injection-feature) further simplifies the process of retrieving secrets for [workspace connections](prompt-flow/concept-connections.md) and [key vaults](../key-vault/general/overview.md).


## Managed identity associated with the endpoint


An online deployment runs your user container with the managed identity associated with the endpoint. This managed identity, called the _endpoint identity_, is a [Microsoft Entra ID](/entra/fundamentals/whatis) that supports [Azure RBAC](../role-based-access-control/overview.md). Therefore, you can assign Azure roles to the identity to control permissions that are required to perform operations. The endpoint identity can be either a system-assigned identity (SAI) or a user-assigned identity (UAI). You can decide which of these kinds of identities to use when you create the deployment.

- For a _system-assigned identity_, the identity is created automatically when you create the endpoint, and roles with fundamental permissions (such as the Azure Container Registry pull permission and the storage blob data reader) are automatically assigned.
- For a _user-assigned identity_, you need to create the identity first, and then associate it with the endpoint when you create the endpoint. You're also responsible for assigning proper roles to the UAI as needed.

For more information on using managed identities of an endpoint, see [How to access resources from endpoints with managed identities](how-to-access-resources-from-endpoints-managed-identities.md), and the example for [using managed identities to interact with external services](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).


## Role assignment to the endpoint identity

The following roles are required by the secret stores:

- For __secrets stored in workspace connections under your workspace__: `Workspace Connections` provides a [List Secrets API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) that requires the identity that calls the API to have `Azure Machine Learning Workspace Connection Secrets Reader` role (or equivalent) assigned to the identity.
- For __secrets stored in an external Microsoft Azure Key Vault__: Key Vault provides a [Get Secret Versions API](/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) that requires the identity that calls the API to have `Key Vault Secrets User` role (or equivalent) assigned to the identity.


## Implementation of secret injection

Once secret (such as API keys) are retrieved from secret stores, there are two ways to inject them into a user container that runs inside the online deployment:

- Inject secrets yourself, using managed identities.
- Inject secrets, using the secret injection feature.

Both of these approaches involve two steps:

1. First, retrieve secrets from the secret stores, using the endpoint identity.
1. Second, inject the secrets into your user container.

### Secret injection via the use of managed identities

In your deployment definition, you need to use the endpoint identity to call the APIs from secret stores. You can implement this logic either in your scoring script or in shell scripts that you run in your BYOC container. To implement secret injection via the use of managed identities, see the [example for using managed identities to interact with external services](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).

### Secret injection via the secret injection feature

To use the secret injection feature, in your deployment definition, map environment variables onto the secrets (that you want to refer to) from workspace connections or the Key Vault. This approach doesn't require you to write any code in your scoring script or in shell scripts that you run in your BYOC container. To map environment variables onto the secrets from workspace connections or the Key Vault, the following conditions must be met:

- During endpoint creation, if an online endpoint was defined to enforce access to default secret stores (workspace connections under the current workspace), your user identity that creates the deployment under the endpoint should have the permissions to read secrets from workspace connections.
- The endpoint identity that the deployment uses should have permissions to read secrets from either workspace connections or the Key Vault, as referenced in the deployment definition.

> [!NOTE]
> - If the endpoint was successfully created with an SAI and the flag set to enforce access to default secret stores, then the endpoint would automatically have the permission for workspace connections. 
> - In the case where the endpoint used a UAI, or the flag to enforce access to default secret stores wasn't set, then the endpoint identity might not have the permission for workspace connections. In such a situation, you need to manually assign the role for the workspace connections to the endpoint identity.
> - The endpoint identity won't automatically receive permission for the external Key Vault. If you're using the Key Vault as a secret store, you'll need to manually assign the role for the Key Vault to the endpoint identity.

For more information on using secret injection, see [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md).


## Related content

- [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md)
- [Authentication for managed online endpoints](concept-endpoints-online-auth.md)
- [Online endpoints](concept-endpoints-online.md)
