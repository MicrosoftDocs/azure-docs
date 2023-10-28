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

In this article, you learn to use [secret injection](concept-secret-injection.md) with online endpoint and deployment. You start by setting up the user identity and its permission, create workspace connections and/or key vaults to use as secret stores, and then create the endpoint and deployment by using the secret injection feature.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- Choice of secret stores to use.
    - Workspace connections under the workspace. Later at endpoint creation time, the endpoint identity can be granted to read secrets from the workspace connections automatically, if certain conditions are met. See system-assigned identity tab from [Create an endpoint](#create-an-endpoint) for more.
    - Key vaults that aren't necessarily under the workspace. The endpoint identity won't be granted to read secrets from these automatically. Hence, if you want to use Key Vault as a secret store, you must assign a proper role later.

- Workspace connections to use as secret stores.
    - Create workspace connections to use in your deployment. See [Workspace Connections - Create REST API](/rest/api/azureml/2023-08-01-preview/workspace-connections/create) for more. <!-- CLI link will be added later -->
    - For example,
        - Create an Azure OpenAI connection

            Create `aoai_connection.yaml`:

            ```YAML
            name: aoai_connection
            type: azure_openai
            target: https://<name>.openai.azure.com
            api_version: <version>
            credentials:
                type: api_key
                key: <key>
            ```

            Create the connection:

            ```azurecli
            az ml connections create -f aoai_connection.yaml
            ```

        - Create a custom connection

            Create `custom_connection.yaml`:

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

            Create the connection:

            ```azurecli
            az ml connections create -f custom_connection.yaml
            ```

        - Verify that the user identity can read the secrets from the workspace connection using the [Workspace Connections - List Secrets REST API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets).
- (Optional) Key Vault to use as secret stores.
    - Create Azure Key Vault and set a secret to use in your deployment. See [Set and retrieve a secret from Azure Key Vault using Azure CLI](../key-vault/secrets/quick-create-cli.md) for more. In addition,
        - [az keyvault CLI](/cli/azure/keyvault#az-keyvault-create) and [Set Secret REST API](/rest/api/keyvault/secrets/set-secret/set-secret) show how to set a secret.
        - [az keyvault secret show CLI](/cli/azure/keyvault/secret#az-keyvault-secret-show) and [Get Secret Versions REST API](/rest/api/keyvault/secrets/get-secret-versions/get-secret-versions) show how to retrieve a secret version.
    - For example,
        - Create a key vault
    
            ```azurecli
            az keyvault create --name mykeyvault --resource-group myrg --location eastus
            ```
        - Create a secret

            ```azurecli
            az keyvault secret set --vault-name mykeyvault --name secret1 --value <value>
            ``` 

            This command returns the secret version it creates. You can check `id` property of the response to get the secret version. For example, it looks like `https://mykeyvault.vault.azure.net/secrets/<secret_name>/<secret_version>`.

        - Verify that the user identity can read the secret from the key vault

            ```azurecli
            az keyvault secret show --vault-name mykeyvault --name secret1 --version <secret_version>
            ```

    > [!IMPORTANT]
    > If you use Key Vault as a secret store for secret injection, you must configure the key vault's permission model as `Azure role-based access control` (RBAC). See [Azure RBAC vs access policy for Key Vault](../key-vault/general/rbac-access-policy) for more.

- Choice of user identity to use to create the online endpoint and online deployment.
    - Follow [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md) to set up the user identity. It can be a user account, a service principal account, or a managed identity in Microsoft Entra ID.
- (Optional) Role assignment to the user identity.
    - If a user wants the system-assigned identity (SAI) to be automatically granted for reading secrets from workspace connections, the _user_ needs to be assigned a role `Azure Machine Learning Workspace Connection Secret Reader` on the scope of the workspace (or higher).
        - An admin that has `Microsoft.Authorization/roleAssignments/write` permission can run a CLI command to assign the role to the _user identity_:

        ```azurecli
        az role assignment create --assignee <UserIdentityID> --role "Azure Machine Learning Workspace Connection Secret Reader" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
        ```

        > [!NOTE]
        > System-assigned identity of the endpoint won't be automatically granted for reading secrets from key vaults. Hence, the _user_ doesn't need to be assigned a role for the key vault. 

    - If you want to use user-assigned identity (UAI) for the endpoint, you don't need to assign the role to your _user identity_. Instead, you must assign the role to the _UAI_ manually if you intend to use secret injection. For example,
        - An admin that has `Microsoft.Authorization/roleAssignments/write` permission can run below commands to assign the role to the _endpoint identity_:

        For workspace connections:

        ```azurecli
        az role assignment create --assignee <EndpointIdentityID> --role "Azure Machine Learning Workspace Connection Secret Reader" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
        ```

        Or for key vaults:

        ```azurecli
        az role assignment create --assignee <EndpointIdentityID> --role "Key Vault Secrets User" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.KeyVault/vaults/<vaultName>
        ```

    - To verify that an identity (either user identity or endpoint identity) has the role assigned, you can go to the resource in Azure portal (for example, Azure Machine Learning workspace, or Key Vault), click the `Access control (IAM)` tab, and `Check access` button, then find the identity. You can verify if the right role shows under the `Current role assignments` tab.


## Create an endpoint

### [System-assigned identity](#tab/sai)

1. If you are using SAI as the endpoint identity, specify whether you want to enforce access to default secret stores (namely, workspace connections under the workspace) to the endpoint identity:

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
  > If you do not specify `identity` property in the endpoint definition, the endpoint will use system-assigned identity by default.
  > 
  > If below conditions are met, the endpoint identity will be granted with `Azure Machine Learning Workspace Connection Secret Reader` role on the scope of the workspace (or higher) automatically:
  >  
  > - The user identity that creates the _endpoint_ has the permissions to read secrets from workspace connections.
  > - The endpoint uses system-assigned identity.
  > - The endpoint is defined with a flag to enforce access to default secret stores (workspace connections under the current workspace) when creating the endpoint.
  >
  > The endpoint identity won't be automatically granted a role to read secrets from Key Vault. If you want to use Key Vault as a secret store, you need to assign a proper role such as `Key Vault Secrets User` to the _endpoint identity_ on the scope of the Key Vault manually. See [Azure built-in roles for Key Vault data plane operations](../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations) for more.

### [User-assigned identity](#tab/uai)

1. If you are using UAI as the endpoint identity, you are not allowed to specify the `enforce_access_to_default_secret_stores` flag:

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
  > When using user-assigned identity, you must assign any required roles to the endpoint identity manually as needed. See [prerequisites](#prerequisites) for more.

---


## Create a deployment

1. Author scoring script or Dockerfile and related scripts so that it can consume the secrets via environment variables.
    1. There's no need for you to call the secret retrieval APIs for the workspace connections or key vaults. The environment variables are populated with the secrets when the user container in the deployment initiates.
1. The value that is injected into environment variable can be one of the three types:
    1. The whole [List Secrets API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) response. You'll need to understand the API response structure and parse it and use it in the user container.
    1. Individual secret or metadata from the workspace connection. You can use it without understanding the workspace connection API response structure.
    1. Individual secret version from the key vault. You can use it without understanding the key vault API response structure.

1. Initiate the creation of the deployment using the scoring script (if custom model approach is taken) or a Dockerfile (if BYOC approach is taken), specifying environment variables the user expects within the user container. If the values that are mapped to the environment variables follow certain patterns, secret retrieval and injection will be performed using the endpoint identity.
    1. Patterns
        | pattern | behavior |
        | -- | -- |
        | `${{azureml://connections/<connection_name>}}` | The whole [List Secrets API (preview)](/rest/api/azureml/2023-08-01-preview/workspace-connections/list-secrets) response is injected into the environment variable. |
        | `${{azureml://connections/<connection_name>/credentials/<credential_name>}}` | The value of the credential is injected into the environment variable. |
        | `${{azureml://connections/<connection_name>/metadata/<metadata_name>}}` | The value of the metadata is injected into the environment variable. |
        | `${{azureml://connections/<connection_name>/target}}` | The value of the target (where applicable) is injected into the environment variable. |
        | `${{keyvault:https://<keyvault_name>.vault.azure.net/secrets/<secret_name>/<secret_version>}}` | The value of the secret version is injected into the environment variable. |
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
> - At deployment creation time, if any environment variable is mapped to a value that follows the fore-mentioned patterns, secret retrieval and injection will be performed with the endpoint identity. This endpoint identity can be either system-assigned identity or user-assigned identity. If the endpoint identity does not have the permission to read secrets from designated secret stores (either workspace connections or key vaults), the creation will fail. If the specified secret reference does not exist in the secret stores, the creation will fail.


## Next step

- [Secret injection in online endpoints](concept-secret-injection.md)
- [How to authenticate online endpoint](how-to-authenticate-online-endpoint.md)
- [Deploy and score a model using an online endpoint](how-to-deploy-online-endpoints.md)
- [Use a custom container to deploy a model using an online endpoint](how-to-deploy-custom-container.md)
- [Troubleshoot online endpoints deployment](how-to-troubleshoot-online-endpoints.md)
