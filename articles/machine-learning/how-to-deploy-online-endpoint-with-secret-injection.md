---
title: Deploy machine learning models to online endpoints with secret injection
titleSuffix: Azure Machine Learning
description: Learn to use secret injection with online endpoint and deployment.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.date: 10/25/2023
ms.topic: how-to
ms.custom: how-to, ignite-2023, sdkv2
---

# Deploy machine learning models to online endpoints with secret injection (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn to use [secret injection](concept-secret-injection.md) with online endpoint and deployment. You'll start by setting up the user identity and its permission and creating workspace connections to use as a secret store, and then create the endpoint and deployment to use the secret injection feature.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

<!-- TODO:
Explain key vault as well

-->

## Prerequisites

- Choice of user identity to use to create the online endpoint and online deployment.
    - Follow [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md) to set up the user identity. It can be a user account, a service principal account, or a managed identity in Microsoft Entra ID.
- (Optional) Role assignment to the user identity.
    - If a user wants the system-assigned identity (SAI) to be auto-granted for reading secrets from workspace connections, the user needs to be assigned a role `Azure Machine Learning Workspace Connection Secret Reader` on the scope of the workspace (or higher).
        - An admin that has `Microsoft.Authorization/roleAssignments/write` permission can run below command to assign the role to the User:

        ```azurecli
        az role assignment create --assignee <UserIdentityID> --role "Azure Machine Learning Workspace Connection Secret Reader" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
        ```

    - If a user wants to use user-assigned identity (UAI) for the endpoint, this role assignment is not required.
- Workspace connections to use as secret stores.
    - Create workspace connections to use in your deployment.
        - Connection sample 1

            ```YAML
            name: aoai_connection
            type: azure_openai
            target: https://<name>.openai.azure.com
            credentials:
                type: api_key
                key: <key>
            tags:
                api_version: <version>
            ```
<!-- TODO: check if `tags` is the latest -->
        - Connection sample 2
    
            ```YAML
            name: multi_connection_langchain
            type: custom
            credentials:
                type: custom
                OPENAI_API_KEY: <key>
                SPEECH_KEY: <key>
            tags:
                    OPENAI_API_BASE : <aoai endpoint>
                    OPENAI_API_VERSION : <aoai version>
                OPENAI_API_TYPE: azure
                SPEECH__REGION : eastus
            ```
<!-- TODO: check if `tags` is the latest -->
    
- (Optional) Verify that the user identity can read the secrets from the workspace connection using the [Workspace Connection ReadSecrets REST API](TBD).


## Create an endpoint

# [SAI](#tab/sai)

1. In case of SAI, Specify whether you will enforce access to default secret stores (namely, workspace connections under the workspace) to the endpoint identity:

    ```YAML
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: my-endpoint
    auth_mode: key
    properties:
        enforce_access_to_default_secret_stores: enabled  # default: disabled
    ```

  > [!NOTE]
  > Above example does not specify `identity` property in the endpoint definition. This means the endpoint will use system-assigned identity.
  > 
  > If below conditions are met, the endpoint identity will be granted with `Azure Machine Learning Workspace Connection Secret Reader` role on the scope of the workspace (or higher) automatically:
  > - The user identity that creates the _endpoint_ has the permissions to read secrets from workspace connections.
  > - The endpoint uses system-assigned identity.
  > - The endpoint is defined with a flag to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint.

# [UAI](#tab/uai)

1. In case of UAI, you are not allowed to specify the `enforce_access_to_default_secret_stores` flag:

    ```YAML
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: my-endpoint
    auth_mode: key
    identity:
        type: user_assigned
        user_assigned_identities: /subscriptions/00000000-0000-0000-000-000000000000/resourcegroups/myrg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity 
    ```

> [!NOTE]
  > When using user-assigned identity, you must assign any required roles to the endpoint identity manually if needed.

---

## Create a deployment

1. Author scoring script or dockerfile and related scripts so that it can consume the secrets via environment variables. At this stage, you can assume the environment variables they plan to use will be populated with the secrets when user container in the deployment initiates.
1. The value that will be populated into environment variable can be one of the two types:
    1. The whole [Workspace Connection ReadSecret REST API](TBD) response. You will need to understand the API response structure and parse it and use it in the user container.
    1. Individual secret or metadata from the workspace connection. You can use it without understanding the workspace connection API response structure.

1. Initiate the creation of the deployment using the scoring script (in the case of custom model approach) or a Dockerfile (in the case of Bring Your Own Container, or BYOC, approach), specifying environment variables the user expects within the user container. If the values that are mapped to the environment variables follow certain patterns, secret retrieval and injection will be performed using the endpoint identity.
    1. Pattern
        1. ${{azureml://connections/<connection_name>}}: The whole [Workspace Connection ReadSecret REST API](TBD) response will be populated into the environment variable.
        1. ${{azureml://connections/<connection_name>/credentials/<credential_name>}}: The value of the credential will be populated into the environment variable.
        1. ${{azureml://connections/<connection_name>/metadata/<metadata_name>}}: The value of the metadata will be populated into the environment variable.
        1. ${{azureml://connections/<connection_name>/target}}: The value of the target (where applicable) will be populated into the environment variable.
        <!-- 1. TBD: KV -->
    1. For example,

        ```YAML
        $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
        name: blue
        #…
        environment_variables:
            AOAI_CONNECTION: ${{azureml://connections/aoai_connection}} # Specifying WS connection with the simple notation, the whole connection/listsecrets response including confidentials and metadata will be passed as a whole. CLI/SDK or WorkspaceRP will resolve this to the proper ARM resource ID and send it to the backend.
            LANGCHAIN_CONNECTION: ${{azureml://connections/multi_connection_langchain}}
            
            OPENAI_KEY: ${{azureml://connections/multi_connection_langchain/credentials/OPENAI_API_KEY}} # Specifying each credential to use.
            OPENAI_VERSION: ${{azureml://connections/multi_connection_langchain/metadata/OPENAI_API_VERSION}} # Specifying each metadata to use.
            
            USER_SECRET_KV1_KEY: ${{keyvault:https://mykeyvault.vault.azure.net/secrets/secret1/secretversion1}} # Specifying WS KV using the vault URI that contains the secret name and secret version. CLI/SDK or WorkspaceRP will resolve this to the pair of (proper ARM resource ID + secret name + secret version) and send it to the backend        
        ```

> [!IMPORTANT]
> - If `enforce_access_to_default_secret_stores` flag was set at the endpoint, user identity's permission to read secrets from workspace connections will be checked in both endpoint creation and deployment creation time. If the user identity does not have the permission, the creation will fail.
> - At deployment creation time, if any environment variable is mapped to a value that follows the fore-mentioned patterns, secret retrieval and injection will be tried with the endpoint identity. This endpoint identity can be either system-assigned identity or user-assigned identity. If the endpoint identity does not have the permission to read secrets from workspace connections, the creation will fail.


<!-- 5. Next step/Related content------------------------------------------------------------------------

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