---
title: Authenticate clients for online endpoints
titleSuffix: Azure Machine Learning
description: Learn to authenticate clients for an Azure Machine Learning online endpoint.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
reviewer: msakande
ms.date: 12/15/2023
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, sdkv2, event-tier1-build-2022, ignite-2022, devx-track-azurecli
---

# Authenticate clients for online endpoints

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

This article covers how to authenticate clients to perform control plane and data plane operations on online endpoints.

A _control plane operation_ controls an endpoint and changes it. Control plane operations include create, read, update, and delete (CRUD) operations on online endpoints and online deployments.

A _data plane operation_ uses data to interact with an online endpoint without changing the endpoint. For example, a data plane operation could consist of sending a scoring request to an online endpoint and getting a response.


## Prerequisites

[!INCLUDE [cli & sdk v2](includes/machine-learning-cli-sdk-v2-prereqs.md)]


## Limitations

Endpoints with Microsoft Entra token (`aad_token`) auth mode don't support scoring using the CLI `az ml online-endpoint invoke`, SDK `ml_client.online_endpoints.invoke()`, or the __Test__ or __Consume__ tabs of the Azure Machine Learning studio. Instead, use a generic Python SDK or use REST API to pass the control plane token. For more information, see [Score data using the key or token](#score-data-using-the-key-or-token).


## Prepare a user identity

You need a user identity to perform control plane operations (that is, CRUD operations) and data plane operations (that is, send scoring requests) on the online endpoint. You can use the same user identity or different user identities for the control plane and data plane operations. In this article, you use the same user identity for both control plane and data plane operations.

To create a user identity under Microsoft Entra ID, see [Set up authentication](how-to-setup-authentication.md#microsoft-entra-id). You'll need the identity ID later.


## Assign permissions to the identity

In this section, you assign permissions to the user identity that you use for interacting with the endpoint. You begin by using either a built-in role or by creating a custom role. Thereafter, you assign the role to your user identity.

### Use a built-in role

The `AzureML Data Scientist` [built-in role](../role-based-access-control/built-in-roles.md#azureml-data-scientist) uses wildcards to include the following _control plane_ RBAC actions:
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action`

and to include the following _data plane_ RBAC action:
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action`

If you use this built-in role, there's no action needed at this step.

### (Optional) Create a custom role

You can skip this step if you're using built-in roles or other pre-made custom roles.

1. Define the scope and actions for custom roles by creating JSON definitions of the roles. For example, the following role definition allows the user to CRUD an online endpoint, under a specified workspace.

    _custom-role-for-control-plane.json_:
    
    ```json
    {
        "Name": "Custom role for control plane operations - online endpoint",
        "IsCustom": true,
        "Description": "Can CRUD against online endpoints.",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write",
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete",
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read",
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action",
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action",
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action"
        ],
        "NotActions": [
        ],
        "AssignableScopes": [
            "/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>"
        ]
    }
    ```
    
    The following role definition allows the user to send scoring requests to an online endpoint, under a specified workspace.
    
    _custom-role-for-scoring.json_:
    
    ```json
    {
        "Name": "Custom role for scoring - online endpoint",
        "IsCustom": true,
        "Description": "Can score against online endpoints.",
        "Actions": [
            "Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*/action"
        ],
        "NotActions": [
        ],
        "AssignableScopes": [
            "/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>"
        ]
    }
    ```

1. Use the JSON definitions to create custom roles:

    ```bash
    az role definition create --role-definition custom-role-for-control-plane.json --subscription <subscriptionId>
    
    az role definition create --role-definition custom-role-for-scoring.json --subscription <subscriptionId>
    ```

    > [!NOTE]
    > To create custom roles, you need one of three roles: 
    >
    > - owner
    > - user access administrator
    > - a custom role with `Microsoft.Authorization/roleDefinitions/write` permission (to create/update/delete custom roles) and `Microsoft.Authorization/roleDefinitions/read` permission (to view custom roles).
    >
    > For more information on creating custom roles, see [Azure custom roles](/azure/role-based-access-control/custom-roles#who-can-create-delete-update-or-view-a-custom-role).
    
1. Verify the role definition:

    ```bash
    az role definition list --custom-role-only -o table
    
    az role definition list -n "Custom role for control plane operations - online endpoint"
    az role definition list -n "Custom role for scoring - online endpoint"
    
    export role_definition_id1=`(az role definition list -n "Custom role for control plane operations - online endpoint" --query "[0].id" | tr -d '"')`
    
    export role_definition_id2=`(az role definition list -n "Custom role for scoring - online endpoint" --query "[0].id" | tr -d '"')`
    ```

### Assign the role to the identity

1. If you're using the `AzureML Data Scientist` built-in role, use the following code to assign the role to your user identity.

    ```bash
    az role assignment create --assignee <identityId> --role "AzureML Data Scientist" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
    ```

1. If you're using a custom role, use the following code to assign the role to your user identity.

    ```bash
    az role assignment create --assignee <identityId> --role "Custom role for control plane operations - online endpoint" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
    
    az role assignment create --assignee <identityId> --role "Custom role for scoring - online endpoint" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
    ```

    > [!NOTE]
    > To assign custom roles to the user identity, you need one of three roles: 
    >
    > - owner
    > - user access administrator
    > - a custom role that allows `Microsoft.Authorization/roleAssignments/write` permission (to assign custom roles) and `Microsoft.Authorization/roleAssignments/read` (to view role assignments).
    >
    > For more information on the different Azure roles and their permissions, see [Azure roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles) and [Assigning Azure roles using Azure Portal](/azure/role-based-access-control/role-assignments-portal).

1. Confirm the role assignment:

    ```bash
    az role assignment list --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
    ```


## Get the Microsoft Entra token for control plane operations

Perform this step __if you plan to perform control plane operations with REST API__, which will directly use the token. 

If you plan to use other ways such as Azure Machine Learning CLI (v2), Python SDK (v2), or the Azure Machine Learning studio, you don't need to get the Microsoft Entra token manually. Rather, during sign in, your user identity would already be authenticated, and the token would automatically be retrieved and passed for you.

You can retrieve the Microsoft Entra token for _control_ plane operations from the Azure resource endpoint: `https://management.azure.com`.

### [Azure CLI](#tab/azure-cli)

1. Sign in to Azure.

    ```bash
    az login
    ```

1. If you want to use a specific identity, use the following code to sign in with the identity:

    ```bash
    az login --identity --username <identityId>
    ```

1. Use this context to get the token.

    ```bash
    export CONTROL_PLANE_TOKEN=`(az account get-access-token --resource https://management.azure.com --query accessToken | tr -d '"')`
    ```

### [REST](#tab/rest)

__From an Azure virtual machine__

You can acquire the token based on the managed identity for an Azure VM (when the VM enables a managed identity). 

1. To get the Microsoft Entra token (`aad_token`) for the control plane operation on the Azure VM, submit the request to the [Azure Instance Metadata Service](../virtual-machines/instance-metadata-service.md) (IMDS) endpoint for the Azure resource endpoint `management.azure.com`:

    ```bash
    export CONTROL_PLANE_TOKEN=`(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true -s | jq -r '.access_token' )`
    ```
    
    > [!TIP]
    > To extract the token from the JSON output, the `jq` utility is used as an example. However, you can use any suitable tool for this purpose.
    
    For more information on getting tokens based on managed identities, see [Get a token using HTTP](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-http).

__From a compute instance__

You can get the token if you're using the Azure Machine Learning workspace's compute instance. To get the token, you must pass the client ID and the secret of the compute instance's managed identity to the managed system identity (MSI) endpoint that is configured locally at the compute instance. You can get the MSI endpoint, client ID, and secret from the environment variables `MSI_ENDPOINT`, `DEFAULT_IDENTITY_CLIENT_ID`, and `MSI_SECRET`, respectively. These variables are set automatically if you enable managed identity for the compute instance. 

1. Get the token for the Azure resource endpoint `management.azure.com` from the workspace's compute instance:

    ```bash
    export CONTROL_PLANE_TOKEN=`(curl $MSI_ENDPOINT'?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F&clientid='$DEFAULT_IDENTITY_CLIENT_ID -H Metadata:true -H Secret:$MSI_SECRET -s | jq -r '.access_token' )`
    ```

### [Python](#tab/python)

```python
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

try:
    credential = DefaultAzureCredential()
    # Check if given credential can get token successfully.
    access_token = credential.get_token("https://management.azure.com/.default")
    print(access_token)
except Exception as ex:
    # Fall back to InteractiveBrowserCredential in case DefaultAzureCredential not work
    # This will open a browser page for
    credential = InteractiveBrowserCredential()
```

See [Get a token using the Azure identity client library](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-the-azure-identity-client-library) for more information.

### [Studio](#tab/studio)

The studio doesn't expose the Microsoft Entra token.

---

### (Optional) Verify the resource endpoint and client ID for Microsoft Entra token

After you retrieve the Microsoft Entra token, you can verify that the token is for the right Azure resource endpoint `management.azure.com` and the right client ID by decoding the token via [jwt.ms](https://jwt.ms/), which will return a json response with the following information:

```json
{
    "aud": "https://management.azure.com",
    "oid": "<your-object-id>"
}
```



## Create an endpoint

The following example creates the endpoint with a system-assigned identity (SAI) as the endpoint identity. The SAI is the default identity type of the managed identity for endpoints. Some basic roles are automatically assigned for the SAI. For more information on role assignment for a system-assigned identity, see [Automatic role assignment for endpoint identity](concept-endpoints-online-auth.md#automatic-role-assignment-for-endpoint-identity).

### [Azure CLI](#tab/azure-cli)

The CLI doesn't require you to explicitly provide the control plane token. Instead, the CLI authenticates you during sign in, and the token is automatically retrieved and passed for you.

1. Create an endpoint definition YAML file.

    _endpoint.yml_:
    
    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: my-endpoint
    auth_mode: aad_token
    ```

1. You can replace `auth_mode` with `key` for key auth, or `aml_token` for Azure Machine Learning token auth. In this example, you use `aad_token` for Microsoft Entra token auth.

    ```CLI
    az ml online-endpoint create -f endpoint.yml
    ```

1. Check the endpoint's status:

    ```CLI
    az ml online-endpoint show -n my-endpoint
    ```

1. If you want to override `auth_mode` (for example, to `aad_token`) when creating an endpoint, run the following code:

    ```CLI
    az ml online-endpoint create -n my-endpoint --auth_mode aad_token
    ```

1. If you want to update the existing endpoint and specify `auth_mode` (for example, to `aad_token`), run the following code:

    ```CLI
    az ml online-endpoint update -n my-endpoint --set auth_mode=aad_token
    ```

### [REST](#tab/rest)

The REST API call requires you to explicitly provide the control plane token. Use the control plane token you retrieved earlier.

1. Create or update an endpoint:

    ```bash
    export SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
    export RESOURCE_GROUP=<RESOURCE_GROUP>
    export WORKSPACE=<AML_WORKSPACE_NAME>
    export ENDPOINT_NAME=<ENDPOINT_NAME>
    export LOCATION=<LOCATION_NAME>
    export API_VERSION=2023-04-01
    
    response=$(curl --location --request PUT "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME?api-version=$API_VERSION" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $CONTROL_PLANE_TOKEN" \
    --data-raw "{
        \"identity\": {
           \"type\": \"systemAssigned\"
        },
        \"properties\": {
            \"authMode\": \"AADToken\"
        },
        \"location\": \"$LOCATION\"
    }")
    
    echo $response
    ```

    You can replace `authMode` with `key` for key auth, or `AMLToken` for Azure Machine Learning token auth. In this example, you use `AADToken` for Microsoft Entra token auth.

1. Get the current status of the online endpoint:

    ```bash
    response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME?api-version=$API_VERSION" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $CONTROL_PLANE_TOKEN" \
    )
    
    echo $response
    ```

### [Python](#tab/python)

Python SDK doesn't require you to explicitly provide the control plane token. Rather, the SDK MLClient authenticates you during sign in, and the token is automatically retrieved and passed for you.

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    Environment,
    CodeConfiguration,
)
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace
)

endpoint = ManagedOnlineEndpoint(
    name="my-endpoint",
    description="this is a sample online endpoint",
    auth_mode="aad_token",
    tags={"foo": "bar"},
)
ml_client.online_endpoints.begin_create_or_update(endpoint).result()
```

You can replace `auth_mode` with `key` for key auth, or `aml_token` for Azure Machine Learning token auth. In this example, you use `aad_token` for Microsoft Entra token auth.

### [Studio](#tab/studio)

The studio doesn't require you to explicitly provide the control plane token, as the studio would already authenticate you during sign in, and the token would automatically be retrieved and passed for you.

For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint (via Studio)](how-to-deploy-online-endpoints.md?tabs=azure-studio#deploy-to-azure)

---


## Create a deployment

To create a deployment, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md) or [Use REST to deploy an model as an online endpoint](how-to-deploy-with-rest.md). There's no difference in how you create deployments for different auth modes. 

### [Azure CLI](#tab/azure-cli)

The following code is an example of how to create a deployment. For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint (via CLI)](how-to-deploy-online-endpoints.md?tabs=azure-cli#deploy-to-azure)

1. Create a deployment definition YAML file.

    _blue-deployment.yml_:

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: blue
    endpoint_name: my-aad-auth-endp1
    model:
      path: ../../model-1/model/
    code_configuration:
      code: ../../model-1/onlinescoring/
      scoring_script: score.py
    environment: 
      conda_file: ../../model-1/environment/conda.yml
      image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest
    instance_type: Standard_DS3_v2
    instance_count: 1
    ```

1. Create the deployment using the YAML file. For this example, set all traffic to the new deployment.

    ```CLI
    az ml online-deployment create -f blue-deployment.yml --all-traffic
    ```

### [REST](#tab/rest)

For more information on deploying online endpoints using REST, see [Use REST to deploy an model as an online endpoint](how-to-deploy-with-rest.md).

### [Python](#tab/python)

For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint (via SDK)](how-to-deploy-online-endpoints.md?tabs=python#deploy-to-azure)

### [Studio](#tab/studio)

For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint (via Studio)](how-to-deploy-online-endpoints.md?tabs=azure-studio#deploy-to-azure)

---


## Get the scoring URI for the endpoint

### [Azure CLI](#tab/azure-cli)

If you plan to use the CLI to invoke the endpoint, you're not required to get the scoring URI explicitly, as the CLI handles it for you. However, you can still use the CLI to get the scoring URI so that you can use it with other channels, such as REST API.

```CLI
scoringUri=$(az ml online-endpoint show -n my-endpoint --query "scoring_uri")
```

### [REST](#tab/rest)

```bash
export SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
export RESOURCE_GROUP=<RESOURCE_GROUP>
export WORKSPACE=<AML_WORKSPACE_NAME>
export ENDPOINT_NAME=<ENDPOINT_NAME>
export API_VERSION=2023-04-01
response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME?api-version=$API_VERSION" \
--header "Content-Type: application/json" \
--header "Authorization: Bearer $CONTROL_PLANE_TOKEN")
scoringUri=$(echo $response | jq -r '.properties' | jq -r '.scoringUri')

echo $response
echo $scoringUri
```

### [Python](#tab/python)

If you plan to use the Python SDK to invoke the endpoint, you're not required to get the scoring URI explicitly, as the SDK handles it for you. However, you can still use the SDK to get the scoring URI so that you can use it with other channels, such as REST API.

```Python
scoring_uri = ml_client.online_endpoints.get(name=endpoint_name).scoring_uri
```

### [Studio](#tab/studio)

If you plan to use the studio to invoke the endpoint, you're not required to get the scoring URI explicitly, as the studio handles it for you. However, you can still use the studio to get the scoring URI so that you can use it with other channels, such as REST API.

You can find the scoring URI on the __Details__ tab of the endpoint's page.

---


## Get the key or token for data plane operations


A key or token can be used for data plane operations, even though the process of getting the key or token is a control plane operation. In other words, you use a control plane token to get the key or token that you later use to perform your data plane operations.

Getting the _key_ or _Azure Machine Learning token_ requires that the correct role is assigned to the user identity that is requesting it, as described in [authorization for control plane operations](concept-endpoints-online-auth.md#control-plane-operations). 
The user identity doesn't need any extra roles to get the _Microsoft Entra token_.

### [Azure CLI](#tab/azure-cli)

#### Key or Azure Machine Learning token

If you plan to use the CLI to invoke the endpoint, and if the endpoint is set up to use an auth mode of key or Azure Machine Learning token (`aml_token`), you're not required to get the data plane token explicitly, as the CLI handles it for you. However, you can still use the CLI to get the data plane token so that you can use it with other channels, such as REST API.

To get the key or Azure Machine Learning token (`aml_token`), use the [az ml online-endpoint get-credentials](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-get-credentials) command. This command returns a JSON document that contains the key or Azure Machine Learning token.

__Keys__ are returned in the `primaryKey` and `secondaryKey` fields. The following example shows how to use the `--query` parameter to return only the primary key:

```bash
export DATA_PLANE_TOKEN=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME -g $RESOURCE_GROUP -w $WORKSPACE_NAME -o tsv --query primaryKey)
```

__Azure Machine Learning Tokens__ are returned in the `accessToken` field:

```bash
export DATA_PLANE_TOKEN=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME -g $RESOURCE_GROUP -w $WORKSPACE_NAME -o tsv --query accessToken)
```

Also, the `expiryTimeUtc` and `refreshAfterTimeUtc` fields contain the token expiration and refresh times.

#### Microsoft Entra token

To get the Microsoft Entra token (`aad_token`) using CLI, use the [az account get-access-token](/cli/azure/account#az-account-get-access-token) command. This command returns a JSON document that contains the Microsoft Entra token.

__Microsoft Entra token__ is returned in the `accessToken` field:

```bash
export DATA_PLANE_TOKEN=`(az account get-access-token --resource https://ml.azure.com --query accessToken | tr -d '"')`
```

> [!NOTE]
> - The CLI `ml` extension doesn't support getting the Microsoft Entra token. Use `az account get-access-token` instead, as described in the previous code.
> - The token for data plane operations is retrieved from the Azure resource endpoint `ml.azure.com` instead of `management.azure.com`, unlike the token for control plane operations.

### [REST](#tab/rest)

#### Key or Azure Machine Learning token

To get the key or Azure Machine Learning token (`aml_token`):

```bash
response=$(curl -H "Content-Length: 0" --location --request POST "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME/token?api-version=$API_VERSION" \
--header "Authorization: Bearer $CONTROL_PLANE_TOKEN")

export DATA_PLANE_TOKEN=$(echo $response | jq -r '.accessToken')
```

#### Microsoft Entra token

__From an Azure virtual machine__

You can acquire the token based on the managed identities for an Azure VM (when the VM enables a managed identity). 

1. To get the Microsoft Entra token (`aad_token`) for the _data plane_ operation on the Azure VM with managed identity, submit the request to the [Azure Instance Metadata Service](../virtual-machines/instance-metadata-service.md) (IMDS) endpoint for the Azure resource endpoint `ml.azure.com`:

    ```bash
    export DATA_PLANE_TOKEN=`(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fml.azure.com%2F' -H Metadata:true -s | jq -r '.access_token' )`
    ```

    > [!TIP]
    > To extract the token from the JSON output, the `jq` utility is used as an example. However, you can use any suitable tool for this purpose.

    For more information on getting tokens based on managed identities, see [Get a token using HTTP](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-http).

__From a compute instance__

You can get the token if you're using the Azure Machine Learning workspace's compute instance. To get the token, you must pass the client ID and the secret of the compute instance's managed identity to the managed system identity (MSI) endpoint that is configured locally at the compute instance. You can get the MSI endpoint, client ID, and secret from the environment variables `MSI_ENDPOINT`, `DEFAULT_IDENTITY_CLIENT_ID`, and `MSI_SECRET`, respectively. These variables are set automatically if you enable managed identity for the compute instance. 

1. Get the token for the Azure resource endpoint `ml.azure.com` from the workspace's compute instance:

    ```bash
    export CONTROL_PLANE_TOKEN=`(curl $MSI_ENDPOINT'?api-version=2018-02-01&resource=https%3A%2F%2Fml.azure.com%2F&clientid='$DEFAULT_IDENTITY_CLIENT_ID -H Metadata:true -H Secret:$MSI_SECRET -s | jq -r '.access_token' )`
    ```

### [Python](#tab/python)

#### Key or Azure Machine Learning token

If you plan to use the Python SDK to invoke the endpoint, and if the endpoint is set to use an auth mode of key or Azure Machine Learning token (`aml_token`), you're not required to get the data plane token explicitly, as the SDK handles it for you. However, you can still use the SDK to get the data plane token so that you can use it with other channels, such as REST API.

To get the key or Azure Machine Learning token (`aml_token`), use the [get_keys](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-get-keys) method in the `OnlineEndpointOperations` class.

__Keys__ are returned in the `primary_key` and `secondary_key` fields:

```Python
DATA_PLANE_TOKEN = ml_client.online_endpoints.get_keys(name=endpoint_name).primary_key
```

__Azure Machine Learning Tokens__ are returned in the `accessToken` field:

```Python
DATA_PLANE_TOKEN = ml_client.online_endpoints.get_keys(name=endpoint_name).access_token
```

Also, the `expiry_time_utc` and `refresh_after_time_utc` fields contain the token expiration and refresh times.

For example, to get the `expiry_time_utc`:

```Python
print(ml_client.online_endpoints.get_keys(name=endpoint_name).expiry_time_utc)
```

#### Microsoft Entra token

To get the Microsoft Entra token (`aad_token`) using SDK, use the Azure identity client library:

```python
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

try:
    credential = DefaultAzureCredential()
    # Check if given credential can get token successfully.
    access_token = credential.get_token("https://ml.azure.com/.default")
    print(access_token)
except Exception as ex:
    # Fall back to InteractiveBrowserCredential in case DefaultAzureCredential not work
    # This will open a browser page for
    credential = InteractiveBrowserCredential()
```

See [Get a token using the Azure identity client library](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-the-azure-identity-client-library) for more information.

### [Studio](#tab/studio)
#### Key or Azure Machine Learning token

You can find the key or token on the __Consume__ tab of the endpoint's page.

#### Microsoft Entra token

Microsoft Entra token isn't exposed in the studio.

---

### Verify the resource endpoint and client ID for the Microsoft Entra token


After getting the Entra token, you can verify that the token is for the right Azure resource endpoint `ml.azure.com` and the right client ID by decoding the token via [jwt.ms](https://jwt.ms/), which will return a json response with the following information:

```json
{
    "aud": "https://ml.azure.com",
    "oid": "<your-object-id>"
}
```


## Score data using the key or token

### [Azure CLI](#tab/azure-cli)
#### Key or Azure Machine Learning token

You can use `az ml online-endpoint invoke` for endpoints with a key or Azure Machine Learning token. The CLI handles the key or Azure Machine Learning token automatically so you don't need to pass it explicitly.

```CLI
az ml online-endpoint invoke -n my-endpoint -r request.json
```

#### Microsoft Entra token

Using `az ml online-endpoint invoke` for endpoints with a Microsoft Entra token isn't supported. Use REST API instead, and use the endpoint's scoring URI to invoke the endpoint.

### [REST](#tab/rest)
When invoking the online endpoint for scoring, pass the key, Azure Machine Learning token, or Microsoft Entra token in the authorization header. The following code shows how to use the curl utility to call the online endpoint using a key or token:

```bash
curl --request POST "$scoringUri" --header "Authorization: Bearer $DATA_PLANE_TOKEN" --header 'Content-Type: application/json' --data @endpoints/online/model-1/sample-request.json
```

### [Python](#tab/python)

#### Key or Azure Machine Learning token

Azure Machine Learning SDK using `ml_client.online_endpoints.invoke()` is supported for key or Azure Machine Learning token.
In addition to using Azure Machine Learning SDK, you can also use a generic Python SDK to send the POST request to the scoring URI.

#### Microsoft Entra token

Azure Machine Learning SDK using `ml_client.online_endpoints.invoke()` isn't supported for Microsoft Entra token. Instead, use a generic Python SDK, or use REST API to send the POST request to the scoring URI.

When calling the online endpoint for scoring, pass the key or token in the authorization header. The following code shows how to call the online endpoint using a key or token with a generic Python SDK. In the code, replace the `api_key` variable with your key or token.

```Python
import urllib.request
import json
import os

data = {"data": [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]}

body = str.encode(json.dumps(data))

url = '<scoring URI as retrieved earlier>'
api_key = '<key or token as retrieved earlier>'
headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

req = urllib.request.Request(url, body, headers)

try:
    response = urllib.request.urlopen(req)

    result = response.read()
    print(result)
except urllib.error.HTTPError as error:
    print("The request failed with status code: " + str(error.code))

    # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
    print(error.info())
    print(error.read().decode("utf8", 'ignore'))
```

### [Studio](#tab/studio)
#### Key or Azure Machine Learning token

The __Test__ tab of the deployment's detail page supports scoring for endpoints with key or Azure Machine Learning token auth.

#### Microsoft Entra token

The __Test__ tab of the deployment's detail page _doesn't_ support scoring for endpoints with Microsoft Entra token auth.

---


## Log and monitor traffic

To enable traffic logging in the diagnostics settings for the endpoint, follow the steps in [How to enable/disable logs](how-to-monitor-online-endpoints.md#how-to-enabledisable-logs).

If the diagnostic setting is enabled, you can check the `AmlOnlineEndpointTrafficLogs` table to see the auth mode and user identity.


## Related content

* [Authentication for managed online endpoint](concept-endpoints-online-auth.md)
* [Deploy a machine learning model using an online endpoint](how-to-deploy-online-endpoints.md)
* [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md)
