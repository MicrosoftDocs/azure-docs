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
ms.date: 10/18/2023
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, sdkv2, event-tier1-build-2022, ignite-2022
---

# Authenticate clients for online endpoints

This article covers how to authenticate clients to perform control plane and data plane operations on online endpoints.
- Control plane operations control and change the online endpoints themselves. These operations include create, read, update, and delete (CRUD) operations on online endpoints and online deployments. 
- Data plane operations use data to interact with online endpoints without changing the endpoints. For example, a data plane operation could consist of sending a scoring request to an online endpoint and getting a response.


## Prerequisites

None


## Prepare a user identity

You will need a user identity to perform control plane operations (that is, create, read, update, and delete the endpoint/deployment), and data plane operations (that is, send scoring request to the endpoint). The identity for control plane operations and the one for data plane operations can be the same or different. In this article, we use the same identity for both control plane and data plane operations.

To create a user identity under Microsoft Entra ID, see [Set up authentication](how-to-setup-authentication.md#microsoft-entra-id). You'll need the identity ID later.


## Assign permissions to the identity

In this section, you assign permissions to the user identity that you use for interacting the endpoint. You might begin by using a built-in role or by creating a custom role, and then you assign the role to your user identity.

### Use a built-in role

The `AzureML Data Scientist` built-in role (as defined [here](../role-based-access-control/built-in-roles.md#azureml-data-scientist)) uses wildcard to include the following _control plane_ RBAC actions:
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action`

and to include the following _data plane_ RBAC action:
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action`

If you use this built-in role, there's no action needed at this step.

### Create a custom role (optional)

You can skip this step if you're using built-in roles or other pre-made custom roles.

1. Create JSON definitions of custom roles to define the scope and actions for the role. For example, the following role definition allows the user to CRUD on an online endpoint, under a specified workspace.

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

1. Use the definitions to create custom roles:

    ```bash
    az role definition create --role-definition custom-role-for-control-plane.json --subscription <subscriptionId>
    
    az role definition create --role-definition custom-role-for-scoring.json --subscription <subscriptionId>
    ```

    > [!NOTE]
    > You need one of three roles: owner, user access administrator, or a custom role with `Microsoft.Authorization/roleDefinitions/write` permission (to be able to create/delete/update custom roles) and `Microsoft.Authorization/roleDefinitions/read` permission (to view custom roles). For more information on creating custom roles, see [Azure custom roles](/azure/role-based-access-control/custom-roles#who-can-create-delete-update-or-view-a-custom-role).
    
1. Check the role definition to verify it:

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
    > You need one of three roles: owner, user access administrator, or a custom role that allows `Microsoft.Authorization/roleAssignments/write` permission (to be able to assign custom roles) and `Microsoft.Authorization/roleAssignments/read` (to view role assignments). For more information on the different Azure roles and their permissions, see [Azure roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles) and [Assigning Azure roles using Azure Portal](/azure/role-based-access-control/role-assignments-portal).

1. Confirm the role assignment:

    ```bash
    az role assignment list --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
    ```


## Get Microsoft Entra token for control plane operations

You need this step only if you plan to perform control plane operations with REST API, which will use the token. If you plan to use Azure Machine Learning CLI (v2), or Python SDK (v2), or studio, you don't need to get the Microsoft Entra token manually because your user identity would already be authenticated during sign in, and the token would automatically be retrieved and passed for you.

Microsoft Entra token for control plane operations can be retrieved from the Azure resource endpoint: `https://management.azure.com`.

### [Azure CLI](#tab/azure-cli)

```bash
az login
export CONTROL_PLANE_TOKEN=`(az account get-access-token --resource https://management.azure.com --query accessToken | tr -d '"')`
```

### [REST](#tab/rest)

To get the Microsoft Entra token (`aad_token`) for the control plane operation, get the token from the Azure resource endpoint `management.azure.com` from an environment with managed identity:

```bash
export CONTROL_PLANE_TOKEN=`(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true -s)`
```

For more information on getting tokens, see [Get a token using HTTP](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-http).

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

Refer to [Get a token using the Azure identity client library](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-the-azure-identity-client-library) for more.

### [Studio](#tab/studio)

The studio doesn't expose the Entra token.

---


## Create an endpoint

Below example creates the endpoint with system-assigned identity as the endpoint identity (which is a default identity type of the managed identity for endpoints). Some basic roles will be automatically assigned for the system-assigned identity. See [Automatic role assignment for endpoint identity](concept-endpoints-online-auth.md#automatic-role-assignment-for-endpoint-identity) for more. 

### [Azure CLI](#tab/azure-cli)

CLI doesn't require you to explicitly provide the control plane token, as CLI would already authenticate you during sign in, and the token would automatically be retrieved and passed for you.

Create an endpoint definition YAML file.

_endpoint.yml_:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: my-endpoint
auth_mode: aad_token
```

Replace `auth_mode` with `key` for key auth, or `aml_token` for Azure Machine Learning token auth.

```CLI
az ml online-endpoint create -f endpoint.yml
```

Check the endpoint's status:

```CLI
az ml online-endpoint show -n my-endpoint
```

If you want to override `auth_mode` (for example, to `aad_token`) when creating an endpoint, run the following code:

```CLI
az ml online-endpoint create -n my-endpoint --auth_mode aad_token
```

If you want to update the existing endpoint and specify `auth_mode` (for example, to `aad_token`), run the following code:

```CLI
az ml online-endpoint update -n my-endpoint --set auth_mode=aad_token
```

### [REST](#tab/rest)

The REST API call requires you to explicitly provide the control plane token. You'll use the control plane token you retrieved earlier.

Create or update an endpoint:

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

Replace `authMode` with `key` for key auth, or `AMLToken` for Azure Machine Learning token auth.

Get the current status of the online endpoint:

```bash
response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME?api-version=$API_VERSION" \
--header "Content-Type: application/json" \
--header "Authorization: Bearer $CONTROL_PLANE_TOKEN" \
)

echo $response
```

### [Python](#tab/python)

Python SDK doesn't require you to explicitly provide the control plane token, as SDK MLClient would already authenticate you during sign in, and the token would automatically be retrieved and passed for you.

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

Replace `auth_mode` with `key` for key auth, or `aml_token` for Azure Machine Learning token auth.

### [Studio](#tab/studio)

The studio doesn't support creating an online endpoint with the Microsoft Entra token.

---


## Create a deployment

You can refer to [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md) or [Use REST to deploy an model as an online endpoint](how-to-deploy-with-rest.md) to create a deployment. There's no difference in how you create deployments for different auth modes. Following is given as an example.

### [Azure CLI](#tab/azure-cli)

Create a deployment definition YAML file.

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

Create the deployment using the YAML file. For this sample, set all traffic to the new deployment.

```CLI
az ml online-deployment create -f blue-deployment.yml --all-traffic
```

For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md?tabs=azure-cli#deploy-to-azure)

### [REST](#tab/rest)

For more information on deploying online endpoints using REST, see [Use REST to deploy an model as an online endpoint](how-to-deploy-with-rest.md).

### [Python](#tab/python)

For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md?tabs=python#deploy-to-azure)

### [Studio](#tab/studio)

For more information on deploying online endpoints, see [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md?tabs=azure-studio#deploy-to-azure)

---


## Get the scoring URI for the endpoint

### [Azure CLI](#tab/azure-cli)

If you plan to use the CLI to invoke the endpoint, you're not required to get the scoring URI explicitly, as the CLI handles it for you. However, you can still use the CLI to get the scoring URI so that you can use it with other channels such as REST API.

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

If you plan to use the Python SDK to invoke the endpoint, you're not required to get the scoring URI explicitly, as the SDK handles it for you. However, you can still use the SDK to get the scoring URI so that you can use it with other channels such as REST API.

```Python
scoring_uri = ml_client.online_endpoints.get(name=endpoint_name).scoring_uri
```

### [Studio](#tab/studio)

If you plan to use the studio to invoke the endpoint, you're not required to get the scoring URI explicitly, as the studio handles it for you. However, you can still use the studio to get the scoring URI so that you can use it with other channels such as REST API.

You can find the scoring URI on the `Details` tab on the endpoint's details page.

---


## Get the key or token for data plane operations

Remember that retrieving the key or token requires that the right role is assigned to the identity as described earlier.

### [Azure CLI](#tab/azure-cli)
#### Key or Azure Machine Learning token

If you plan to use the CLI to invoke the endpoint, and if the endpoint is set to use an auth mode of key or Azure Machine Learning token (`aml_token`), you're not required to get the data plane token explicitly, as the CLI handles it for you. However, you can still use the CLI to get the data plane token so that you can use it with other channels such as REST API.

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
> CLI `ml` extension doesn't support getting the Microsoft Entra token. Use 'az account get-access-token` instead.

### [REST](#tab/rest)
#### Key or Azure Machine Learning token

To get the key or Azure Machine Learning token (`aml_token`):

```bash
response=$(curl -H "Content-Length: 0" --location --request POST "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME/token?api-version=$API_VERSION" \
--header "Authorization: Bearer $CONTROL_PLANE_TOKEN")

export DATA_PLANE_TOKEN=$(echo $response | jq -r '.accessToken')
```

#### Microsoft Entra token

To get the Microsoft Entra token (`aad_token`) for the data plane operation, get the token from Azure resource endpoint `ml.azure.com` from an environment with managed identity (for example, Azure VM or Azure Machine Learning compute instance):

```bash
export DATA_PLANE_TOKEN=`(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fml.azure.com%2F' -H Metadata:true -s)`
```

For more information, see [Get a token using HTTP](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-http).

After getting the Entra token, you can optionally verify that the token is from the right Azure resource endpoint `ml.azure.com` by decoding it via [jwt.ms](https://jwt.ms/), which will return a json response with the following information:

```json
{
    "aud": "https://ml.azure.com",
    "oid": "<your-object-id>"
}
```

### [Python](#tab/python)
#### Key or Azure Machine Learning token

If you plan to use the Python SDK to invoke the endpoint, and if the endpoint is set to use an auth mode of key or Azure Machine Learning token (`aml_token`), you're not required to get the data plane token explicitly, as the SDK handles it for you. However, you can still use the SDK to get the data plane token so that you can use it with other channels such as REST API.

To get the key or Azure Machine Learning token (`aml_token`), use the [get_keys](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-get-keys) method in the `OnlineEndpointOperations` Class.

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

See [Get a token using the Azure identity client library](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-the-azure-identity-client-library) for more.

### [Studio](#tab/studio)
#### Key or Azure Machine Learning token

You can find the key or token on the __Consume__ tab of the endpoint's details page.

#### Microsoft Entra token

Entra token is not exposed in the studio.

---


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
When invoking the online endpoint for scoring, pass the key, Azure Machine Learning token, or Microsoft Entra token in the authorization header. The following example shows how to use the curl utility to call the online endpoint using a key or token:

```bash
curl --request POST "$scoringUri" --header "Authorization: Bearer $DATA_PLANE_TOKEN" --header 'Content-Type: application/json' --data @endpoints/online/model-1/sample-request.json
```

### [Python](#tab/python)
#### Key or Azure Machine Learning token

Azure Machine Learning SDK using `ml_client.online_endpoints.invoke()` is supported for key or Azure Machine Learning token.
In addition to using Azure Machine Learning SDK, you can also use generic Python SDK to send the POST request to the scoring URI.

#### Microsoft Entra token

Azure Machine Learning SDK using `ml_client.online_endpoints.invoke()` is not supported for Microsoft Entra token. Instead, use generic Python SDK to send the POST request to the scoring URI.

When calling the online endpoint for scoring, pass the key or token in the authorization header. The following example shows how to call the online endpoint using a key or token using generic Python SDK. In the example, replace the `api_key` variable with your key or token.

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

Test tab of the deployment detail page supports scoring for endpoints with key or Azure Machine Learning token auth.

#### Microsoft Entra token

Test tab of the deployment detail page does not support scoring for endpoints with Microsoft Entra token auth.

---


## Log and monitor traffic

To enable traffic logging in the diagnostics settings for the endpoint, follow the steps in [How to enable/disable logs](how-to-monitor-online-endpoints.md#how-to-enabledisable-logs).

If the diagnostic setting is enabled, you can check the `AmlOnlineEndpointTrafficLogs` table to see the auth mode and user identity.


## Related content

* [Authentication for managed online endpoint](concept-endpoints-online-auth.md)
* [Deploy a machine learning model using an online endpoint](how-to-deploy-online-endpoints.md)
* [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md)
