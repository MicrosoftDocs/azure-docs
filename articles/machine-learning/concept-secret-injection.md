---
title: What is secret injection?
titleSuffix: Azure Machine Learning
# title: #Required; Keep the title body to 60-65 chars max including spaces and brand
# description: #Required; Keep the description within 100- and 165-characters including spaces
description: Learn about online endpoints for real-time inference in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: concept-article
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: ignite-2023
ms.date: 10/16/2023

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Secret injection in online deployments

Secret injection in the context of online deployment is a process of retrieving secrets from secret stores and injecting secrets into user container that runs inside the online deployment. Secrets will be eventually accessible via environment variables, so Inference Server that runs your scoring script or inferencing stack that you bring with BYOC (bring your own container) approach can consume the secrets in a secured way.


## Why this matters
<!-- (choose a better title, and rewrite this section) -->

When a user creates a deployment, the user may want to leverage secrets such as API keys to access external services (for example, Azure OpenAI, Azure Cognitive Search etc) from within the deployment. Currently to do this in a secured way, the user needs to directly interact with workspace connections or key vaults within the deployment.

The user would be using Inference Server / scoring script or BYOC (Bring your own container) to implement this interaction to retrieve the credentials. And this user container will run under the endpoint identity. For workspace connection, this means that the endpoint identity needs to have the ListCredentials permission on the workspace connections. For KV, it will be the ReadSecret permission on the workspace key vault.

If the endpoint identity is the user-assigned identity (UAI), user needs to manually assign a role with the required permission to the endpoint identity, which is often times a big administrative burden especially with enterprise customers. If the endpoint identity is the system-assigned identity (SAI), the identity would still need the permission, and currently we do not auto-grant this permission to the SAI.

Even if the endpoint identity has the permission, a user needs to use workspace connection API or key vault API to retrieve the credentials. This logic would be needed in the definition of the deployment.

To improve the experience, we want to provide a way for the user to specify the credentials from workspace connections or key vaults to be injected into the user container of the deployment, without requiring the user to directly interact with workspace connections or key vaults APIs within the deployments.

Further more, for workspace connections, we would like to auto-grant the permission to the endpoint identity so that the user with the right permission is relieved from manually assign the endpoint identity for the permission in the case of system-assigned identity.


## Managed identity associated with the endpoint

Online deployment runs the user container with the managed identity associated with the endpoint. This managed identity is a [Microsoft Entra ID](/entra/fundamentals/whatis) that supports [Azure RBAC](/role-based-access-control/overview.md), meaning that you can assign Azure roles to the identity to control permission to perform operations. This endpoint identity can be either a system-assigned identity or a user-assigned identity, and you can decide which one to use when you create the deployment.

- In the case of system-assigned identity, the identity is created automatically when you create the endpoint, and roles with fundamental permissions such as Azure Container Registry pull permission and Storage Blob Data Reader etc are automatically assigned.
- In the case of user-assigned identity, you need to create the identity first and then associate it with the endpoint when you create the endpoint. You are also responsible for assigning proper roles to the user-assigned identity as needed.

For more information on using managed identities of endpoint identity, see [How to access resources from endpoints with managed identities](how-to-access-resources-from-endpoints-managed-identities.md), and [example for using managed identities](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/managed-identities).


## Secret injection steps

There are two ways to inject secrets. Inject secrets yourself using managed identities, or use secret injection feature. Both involves two steps: (1) assign roles with proper permissions to the endpoint identity, and (2) retrieve the secrets from the secret stores and inject them into the user container.

### Injecting secrets yourself using managed identities

First, you will need to assign roles with proper permissions to the endpoint identity. Because the automatic role assignment for the system-assigned identity does not include read secrets permission by default, you will need to perform this role assignment yourself.

For example,

- If your secrets are stored in workspace connections under your workspace: Workspace connection provides a [List Secrets API (preview)](https://learn.microsoft.com/en-us/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) that requires the identity that calls the API to have `Azure Machine Learning Workspace Connection Secret Reader` role (or equivalent) assigned to the identity.
- If your secrets are stored in external Azure Key Vault: Azure Key Vault provides a [Get Secret Version API](https://learn.microsoft.com/en-us/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) that requires the identity that calls the API to have `Key Vault Secret Reader` role (or equivalent) assigned to the identity.

Second, in your deployment definition, you will need to use the endpoint identity to call the APIs from secret stores. This logic can be implemented in your scoring script, or shell scripts you run in your BYOC container. You can do this by extending the example provided above.

### Using secret injection feature

First, you can allow the system-assigned identity of the endpoint to have the permission to read secrets from workspace connection. This means the `Azure Machine Learning Workspace Connection Secret Reader` role (or equivalent) would be automatically assigned to the endpoint identity. This is done if below conditions are met: 

- The user identity that creates the endpoint has the permissions to read secrets from workspace connections.
- The endpoint uses system-assigned identity
- Workspace connection is used as the secret store
- The endpoint is defined to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint

If you are using user-assigned identity for the endpoint, or Azure Key Vault is used as the secret store, you will need to assign the role with proper permissions to the endpoint identity yourself.

Second, in your deployment definition, instead of directly calling the APIs from workspace connections or Azure Key Vault, you can map the environment variables with the secrets you want to refer to from workspace connections or Azure Key Vault. This does not require you to write any code in your scoring script or shell scripts you run in your BYOC container. This is done if below conditions are met:

- If the endpoint had been defined to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint, the user identity that creates the deployment should have the permissions to read secrets from workspace connections.
- The endpoint identity has permission to read secrets from either workspace connections or Azure Key Vault, as referenced in deployment definition.  

See [How to inject secrets for online endpoints](how-to-inject-secrets-for-online-endpoints.md) for more information.


<!-- 5. Next step/Related content ------------------------------------------------------------------------ 

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next step

TODO: Add your next step link(s)

> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

<!-- OR -->

## Related content

TODO: Add your next step link(s)

- [Write concepts](article-concept.md)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
