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

In this article, you'll learn to use [secret injection](concept-secret-injection.md) with online endpoint and deployment. You'll start by setting up the user identity and its permission, create workspace connections and/or key vaults to use as secret stores, and then create the endpoint and deployment by using the secret injection feature.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

<!-- TODO:
Explain key vault as well

-->

## Prerequisites

- Choice of secret stores to use.
    - Workspace connections under the workspace. Later at endpoint creation time, the endpoint identity can be granted to read secrets from these automatically, if certain conditions are met. See system-assigned identity tab from [Create an endpoint](#create-an-endpoint) for more.
    - Key vaults that are not necessarily under the workspace. The endpoint identity will _not_ be granted to read secrets from these automatically.
- Choice of user identity to use to create the online endpoint and online deployment.
    - Follow [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md) to set up the user identity. It can be a user account, a service principal account, or a managed identity in Microsoft Entra ID.
- (Optional) Role assignment to the user identity.
    - If a user wants the system-assigned identity (SAI) to be auto-granted for reading secrets from workspace connections, the _user_ needs to be assigned a role `Azure Machine Learning Workspace Connection Secret Reader` on the scope of the workspace (or higher).
        - An admin that has `Microsoft.Authorization/roleAssignments/write` permission can run below command to assign the role to the User:

        ```azurecli
        az role assignment create --assignee <UserIdentityID> --role "Azure Machine Learning Workspace Connection Secret Reader" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
        ```

    - If a user wants to use user-assigned identity (UAI) for the endpoint, this role assignment is not required. Instead the user is expected to assign a proper role to the _UAI_ manually as needed.
- Workspace connections to use as secret stores.
    - Create workspace connections to use in your deployment with `az ml connections create -f connection.yaml` command. See [Create and manage workspace connections](TBD) for more details.
        - Connection sample 1

            ```YAML
            name: aoai_connection
            type: azure_openai
            target: https://<name>.openai.azure.com
            api_version: <version>
            credentials:
                type: api_key
                key: <key>
            ```

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
    
- (Optional) Verify that the user identity can read the secrets from the workspace connection using the [Workspace Connection ReadSecrets REST API](TBD).


## Create an endpoint

# [System-assigned identity](#tab/sai)

1. In case of SAI, Specify whether you will enforce access to default secret stores (namely, workspace connections under the workspace) to the endpoint identity:

    Create `endpoint.yaml`:

    ```YAML
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: my-endpoint
    auth_mode: key
    properties:
        enforce_access_to_default_secret_stores: enabled  # default: disabled
    ```

    Create the endpoint:

    ```azurecli
    az ml online-endpoint create -f endpoint.yaml
    ```

  > [!NOTE]
  > Above example does not specify `identity` property in the endpoint definition. This means the endpoint will use system-assigned identity, which is the default identity type for the endpoint.
  > 
  > If below conditions are met, the endpoint identity will be granted with `Azure Machine Learning Workspace Connection Secret Reader` role on the scope of the workspace (or higher) automatically:
  >  
  > - The user identity that creates the _endpoint_ has the permissions to read secrets from workspace connections.
  > - The endpoint uses system-assigned identity.
  > - The endpoint is defined with a flag to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint.
  >
  > The endpoint identity will not be automatically granted a role to read secrets from Key Vault. If you want to use Key Vault as a secret store, you need to assign a proper role such as `Key Vault Secrets User` to the endpoint identity manually. See [Azure built-in roles for Key Vault data plane operations](../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations) for more.

# [User-assigned identity](#tab/uai)

1. In case of UAI, you are not allowed to specify the `enforce_access_to_default_secret_stores` flag:

    Create `endpoint.yaml`:

    ```YAML
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: my-endpoint
    auth_mode: key
    identity:
        type: user_assigned
        user_assigned_identities: /subscriptions/00000000-0000-0000-000-000000000000/resourcegroups/myrg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity 
    ```

    Create the endpoint:

    ```azurecli
    az ml online-endpoint create -f endpoint.yaml
    ```

> [!NOTE]
  > When using user-assigned identity, you must assign any required roles to the endpoint identity manually as needed. For example, 

---

## Create a deployment

1. Author scoring script or dockerfile and related scripts so that it can consume the secrets via environment variables.
    1. There's no need for you to call the secret retrieval APIs for the workspace connections or key vaults. The environment variables will be populated with the secrets when the user container in the deployment initiates.
1. The value that will be populated into environment variable can be one of the three types:
    1. The whole [Workspace Connection ReadSecret REST API](TBD) response. You will need to understand the API response structure and parse it and use it in the user container.
    1. Individual secret or metadata from the workspace connection. You can use it without understanding the workspace connection API response structure.
    1. Individual secret version from the key vault. You can use it without understanding the key vault API response structure.

1. Initiate the creation of the deployment using the scoring script (in the case of custom model approach) or a Dockerfile (in the case of Bring Your Own Container, or BYOC, approach), specifying environment variables the user expects within the user container. If the values that are mapped to the environment variables follow certain patterns, secret retrieval and injection will be performed using the endpoint identity.
    1. Patterns
        1. ${{azureml://connections/<connection_name>}}: The whole [Workspace Connection ReadSecret REST API](TBD) response will be populated into the environment variable.
        1. ${{azureml://connections/<connection_name>/credentials/<credential_name>}}: The value of the credential will be populated into the environment variable.
        1. ${{azureml://connections/<connection_name>/metadata/<metadata_name>}}: The value of the metadata will be populated into the environment variable.
        1. ${{azureml://connections/<connection_name>/target}}: The value of the target (where applicable) will be populated into the environment variable.
        1. ${{keyvault:https://<keyvault_name>.vault.azure.net/secrets/<secret_name>/<secret_version>}}: The value of the secret version will be populated into the environment variable.
    1. For example,

        Create `deployment.yaml`:

        ```YAML
        $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
        name: blue
        endpoint_name: my-endpoint
        #…
        environment_variables:
            AOAI_CONNECTION: ${{azureml://connections/aoai_connection}}
            LANGCHAIN_CONNECTION: ${{azureml://connections/multi_connection_langchain}}
            
            OPENAI_KEY: ${{azureml://connections/multi_connection_langchain/credentials/OPENAI_API_KEY}}
            OPENAI_VERSION: ${{azureml://connections/multi_connection_langchain/metadata/OPENAI_API_VERSION}}
            
            USER_SECRET_KV1_KEY: ${{keyvault:https://mykeyvault.vault.azure.net/secrets/secret1/secretversion1}}
        ```

        Create the deployment:

        ```azurecli
        az ml online-deployment create -f deployment.yaml
        ```

> [!IMPORTANT]
> - If `enforce_access_to_default_secret_stores` flag was set at the endpoint, user identity's permission to read secrets from workspace connections will be checked in both endpoint creation and deployment creation time. If the user identity does not have the permission, the creation will fail.
> - At deployment creation time, if any environment variable is mapped to a value that follows the fore-mentioned patterns, secret retrieval and injection will be tried with the endpoint identity. This endpoint identity can be either system-assigned identity or user-assigned identity. If the endpoint identity does not have the permission to read secrets from workspace connections, the creation will fail. If the specified secret reference does not exist in the secret store, the creation will fail.


## Next step

- [Secret injection in online endpoints](concept-secret-injection.md)
- [How to authenticate online endpoint](how-to-authenticate-online-endpoint.md)
- [Deploy and score a model using an online endpoint](how-to-deploy-online-endpoints.md)
- [Use a custom container to deploy a model using an online endpoint](how-to-deploy-custom-container.md)
