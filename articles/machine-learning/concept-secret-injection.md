---
title: What is secret injection?
titleSuffix: Azure Machine Learning
# title: #Required; Keep the title body to 60-65 chars max including spaces and brand
# description: #Required; Keep the description within 100- and 165-characters including spaces
description: Learn about secret injection concept that applies to online endpoints in Azure Machine Learning.
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

#CustomerIntent: As a ML Pro, I want to retrieve and inject secrets into the deployment environment easily so that secrets can be consumed by the deployment I create in a secured manner.
---

# Secret injection in online deployments

Secret injection in the context of online deployment is a process of retrieving secrets from secret stores and injecting secrets into user container that runs inside the online deployment. Secrets will be eventually accessible via environment variables, so Inference Server that runs your scoring script or inferencing stack that you bring with BYOC (bring your own container) approach can consume the secrets in a secured way.


## Background

When a user creates a deployment, the user may want to leverage secrets such as API keys to access external services (for example, Azure OpenAI, Azure Cognitive Search, Azure Content Safety etc) from within the deployment. Currently to do this in a secured way, the user needs to directly interact with [workspace connections](prompt-flow/concept-connections.md) or [key vaults](/azure/key-vault/general/overview.md) within the deployment.

The user would be using Inference Server / scoring script or BYOC (Bring your own container) to implement this interaction to retrieve the credentials. As the user container will run with the managed identity associated with the endpoint, using the Azure RBAC and managed identity is recommended in general. Regardless of the secret store user wants to retrieve the secrets from, either workspace connections or key vaults, the endpoint identity would need to have the right permissions to read secrets from the store.

This imposes two challenges. User would need to deal with:
1. Assigning the right roles to the endpoint identity so that the endpoint identity can read secrets from the secret stores
1. Implementing the scoring logic for the deployment so that it uses the managed identity of the endpoint to retrieve the secrets from the secret stores by calling the APIs the secret stores provide

The platform already supports these challenges and a sample code using managed identity to access external services is provided. However, to improve the experience further, we provide a way to tackle these challenges in a simplified yet secured way.


## Managed identity associated with the endpoint

Online deployment runs the user container with the managed identity associated with the endpoint. This managed identity is a [Microsoft Entra ID](/entra/fundamentals/whatis) that supports [Azure RBAC](/azure/role-based-access-control/overview.md), meaning that you can assign Azure roles to the identity to control permission to perform operations. This endpoint identity can be either a system-assigned identity or a user-assigned identity, and you can decide which one to use when you create the deployment.

- In the case of system-assigned identity, the identity is created automatically when you create the endpoint, and roles with fundamental permissions such as Azure Container Registry pull permission and Storage Blob Data Reader etc are automatically assigned.
- In the case of user-assigned identity, you need to create the identity first and then associate it with the endpoint when you create the endpoint. You are also responsible for assigning proper roles to the user-assigned identity as needed.

For more information on using managed identities of endpoint identity, see [How to access resources from endpoints with managed identities](how-to-access-resources-from-endpoints-managed-identities.md), and [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).


## Secret injection approaches

There are two ways to inject secrets. Inject secrets yourself using managed identities, or use secret injection feature. Both involves two steps: (1) assign roles with proper permissions to the endpoint identity, and (2) retrieve the secrets from the secret stores and inject them into the user container.

### Injecting secrets yourself using managed identities

#### Assigning roles

First, you will need to assign roles with proper permissions to the endpoint identity. Because the automatic role assignment for the system-assigned identity does not include read secrets permission by default, you will need to perform this role assignment yourself.

For example,

- If your secrets are stored in workspace connections under your workspace: Workspace connection provides a [List Secrets API (preview)](https://learn.microsoft.com/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) that requires the identity that calls the API to have `Azure Machine Learning Workspace Connection Secret Reader` role (or equivalent) assigned to the identity.
- If your secrets are stored in external Azure Key Vault: Azure Key Vault provides a [Get Secret Version API](https://learn.microsoft.com/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) that requires the identity that calls the API to have `Key Vault Secret Reader` role (or equivalent) assigned to the identity.

#### Retrieving and injecting secrets

Second, in your deployment definition, you will need to use the endpoint identity to call the APIs from secret stores. This logic can be implemented in your scoring script, or shell scripts you run in your BYOC container. You can do this by extending the example provided above in [Managed identity associated with the endpoint](#managed-identity-associated-with-the-endpoint) section.

### Using secret injection feature

#### Assigning roles

First, you can set a flag on endpoint to allow the system-assigned identity of the endpoint to have the permission to read secrets from workspace connection. This means the `Azure Machine Learning Workspace Connection Secret Reader` role (or equivalent) would be automatically assigned to the endpoint identity. This is done if below conditions are met: 

- The user identity that creates the _endpoint_ has the permissions to read secrets from workspace connections.
- The endpoint uses system-assigned identity.
- Workspace connection is used as the secret store.
- The endpoint is defined with a flag to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint.

If you are using user-assigned identity for the endpoint, or Azure Key Vault is used as the secret store, you will need to assign the role with proper permissions to the endpoint identity yourself.

#### Retrieving and injecting secrets

Second, in your deployment definition, instead of directly calling the APIs from workspace connections or Azure Key Vault, you can map the environment variables with the secrets you want to refer to from workspace connections or Azure Key Vault. This does not require you to write any code in your scoring script or shell scripts you run in your BYOC container. This is done if below conditions are met:

- If the endpoint had been defined to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint, the user identity that creates the _deployment_ should have the permissions to read secrets from workspace connections.
- The endpoint identity has permissions to read secrets from either workspace connections or Azure Key Vault, as referenced in deployment definition.
    - If fore-mentioned conditions were met when endpoint was created, the endpoint identity would already have these permissions.
    - If fore-mentioned conditions were not met when endpoint was created, you will need to assign the role with proper permissions to the endpoint identity yourself.

See [How to deploy online endpoint with secret injection](how-to-deploy-online-endpoint-with-secret-injection.md) for more information.


## Related content

- [Online endpoint concept](concept-endpoints-online.md)
- [How to deploy online endpoint with secret injection](how-to-deploy-online-endpoint-with-secret-injection.md)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
