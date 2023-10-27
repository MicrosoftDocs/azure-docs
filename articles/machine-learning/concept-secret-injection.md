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

Secret injection in the context of an online endpoint is a process of retrieving secrets (from secret stores) and injecting them into your user container that runs inside the online deployment. Secrets will eventually be accessible via environment variables, allowing the inference server that runs your scoring script or the inferencing stack that you bring with a BYOC (bring your own container) deployment approach to consume the secrets in a secured way.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Problem statement

When you create an online deployment, you might want to use secrets, such as API keys, to access external services from within the deployment. These external services could include Microsoft Azure OpenAI service, Azure AI Services, Azure AI Content Safety, and so on. 

Currently, to get this access in a secured way, you need to directly interact with [workspace connections](prompt-flow/concept-connections.md) or [key vaults](../key-vault/general/overview.md) within the deployment. You can use the inference server/scoring script or BYOC to implement this interaction to retrieve the credentials. Because your user container will run with the managed identity associated with the endpoint, using the Azure RBAC and managed identity is recommended. Regardless of which secret store you want to retrieve the secrets from, either workspace connections or key vaults, the endpoint's identity needs to have the right permissions to read secrets from the store, but ensuring that the endpoint's identity has the right permissions poses two challenges:

- How to assign the right roles to the endpoint's identity so that it can read secrets from the secret stores.
- How to implement the scoring logic for the deployment so that it uses the endpoint's managed identity to retrieve the secrets from the secret stores.

The platform already supports these scenarios, and [code example for using managed identities to access external services](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities) is available. However, to improve the experience, we introduce a way to achieve the same goal in a simplified, yet secured way.

## Managed identity associated with the endpoint

An online deployment runs your user container with the managed identity associated with the endpoint. This managed identity, the _endpoint's identity_, is a [Microsoft Entra ID](/entra/fundamentals/whatis) that supports [Azure RBAC](../role-based-access-control/overview.md). Therefore, you can assign Azure roles to the identity to control permissions that are required to perform operations. This endpoint's identity can be either a system-assigned identity (SAI) or a user-assigned identity (UAI), and you can decide which one to use when you create the deployment.

- For a _system-assigned identity_, the identity is created automatically when you create the endpoint, and roles with fundamental permissions (such as the Azure Container Registry pull permission and the storage blob data reader) are automatically assigned.
- For a _user-assigned identity_, you need to create the identity first, and then associate it with the endpoint when you create the endpoint. You're also responsible for assigning proper roles to the user-assigned identity as needed.

For more information on using managed identities of an endpoint, see [How to access resources from endpoints with managed identities](how-to-access-resources-from-endpoints-managed-identities.md), and an [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).

## Implementation of secret injection

There are two ways to inject secrets:

- Inject secrets yourself, using managed identities.
- Inject secrets, using the secret injection feature.

Both of these approaches involve two steps:

1. First, assign roles with proper permissions to the endpoint's identity.
1. Second, you retrieve the secrets from the secret stores to inject into your user container.

### Secret injection via the use of managed identities

This approach to secret injection involves role assignment to the endpoint's identity, followed by secret retrieval and injection into your user container.

__Role assignment to the endpoint's identity__:

Because the automatic role assignment for the endpoint's system-assigned identity (SAI) doesn't include the "read secrets" permission by default, you need to perform this role assignment yourself. For example,

- If your secrets are stored in workspace connections under your workspace: `Workspace Connections` provides a [List Secrets API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) that requires the identity that calls the API to have `Azure Machine Learning Workspace Connection Secret Reader` role (or equivalent) assigned to the identity.
- If your secrets are stored in an external Azure Key Vault: Azure Key Vault provides a [Get Secret Versions API](/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) that requires the identity that calls the API to have `Key Vault Secret Reader` role (or equivalent) assigned to the identity.

__Secret retrieval and injection__:

In your deployment definition, you need to use the endpoint's identity to call the APIs from secret stores. This logic can be implemented in your scoring script, or in shell scripts that you run in your BYOC container. You can do this by extending the [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).

### Secret injection via the secret injection feature

This approach to secret injection involves role assignment to the endpoint's identity, followed by secret retrieval and injection into your user container.

__Role assignment to the endpoint's identity__:

When you create an online endpoint, you can set a flag on the endpoint to allow the endpoint's system-assigned identity (SAI) to have the permission to read secrets from workspace connections. This means that the `Azure Machine Learning Workspace Connection Secret Reader` role would be automatically assigned to the endpoint's identity. This is done if the following conditions are met:

- Your _user identity_, that is, the identity that creates the endpoint has the permissions to read secrets from workspace connections when creating the endpoint.
- The endpoint uses a system-assigned identity.
- The endpoint is defined with a flag to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint.

If you're using a user-assigned identity (UAI) for the endpoint, or if the Azure Key Vault is used as the secret store, you'll need to assign the role with proper permissions to the endpoint identity yourself.

__Secret retrieval and injection__:

In your deployment definition, instead of directly calling the APIs from workspace connections or the Azure Key Vault, you can map the environment variables with the secrets that you want to refer to from workspace connections or Azure Key Vault. This does not require you to write any code in your scoring script or in shell scripts that you run in your BYOC container. This is done if the following conditions are met:

- If the endpoint was defined to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint, your user identity that creates the deployment should have the permissions to read secrets from workspace connections.
- The endpoint's identity has permissions to read secrets from either workspace connections or the Azure Key Vault, as referenced in the deployment definition.
    - If endpoint was successfully created with SAI and the flag set to enforce access to default secret stores, the endpoint's identity would already have these permissions.
    - Else, the endpoint's identity might not have these permissions. In that case, you'll need to assign the role with proper permissions to the endpoint's identity by yourself.

For more information on using secret injection, see [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md).

### User identity and endpoint identity

__The differences__:

The _user identity_ is the identity that can be used to create the endpoints and deployment(s) under the endpoint. 


The _endpoint identity_ is the identity that runs the user container in deployments. This identity can be a user-assigned identity (UAI) or a system-assigned identity (SAI). As mentioned earlier, in the case of an SAI, the endpoint identity is created automatically when you create the endpoint. In the case of a UAI, you need to create the identity first and then associate it with the endpoint when you create the endpoint.

__Permissions needed for user identity__:

When the endpoint is created with a system-assigned identity, and the flag is set to enforce access to the default secret stores, the user identity needs to have permissions to read secrets from workspace connections when creating the endpoint and creating the deployment(s) under the endpoint. This restriction ensures that only a user identity with the permission to read secrets can grant the endpoint identity the permission to read secrets.

- If a user identity does not have the permissions to read secrets from workspace connections, but tries to create the endpoint with a system-assigned identity and the endpoint's flag set to enforce access to the default secret stores, the endpoint creation will be rejected.

- Similarly, if a user identity does not have the permissions to read secrets from workspace connections, but tries to create a deployment under the endpoint with a system-assigned identity and the endpoint's flag set to enforce access to the default secret stores, the deployment creation will be rejected.


## Related content

- [Online endpoints](concept-endpoints-online.md)
- [Deploy machine learning models to online endpoints with secret injection (preview)](how-to-deploy-online-endpoint-with-secret-injection.md)
