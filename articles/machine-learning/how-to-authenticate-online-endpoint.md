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

This article covers how to authenticate clients to perform data plane operations on online endpoints. Data plane operations use data to interact with online endpoints without changing the endpoints. For example, a data plane operation could consist of sending a scoring request to an online endpoint and getting a response.

## Prepare a user identity

You can use the same identity you use for CRUD (control plane) operations when desired but this is not required. To create the identity under Microsoft Entra ID, refer to [Set up authentication](how-to-setup-authentication.md#microsoft-entra-id).

You will need the identity ID later.

## Assign permissions to the identity

### Use a built-in role

`AzureML Data Scientist` built-in role includes below control plane RBAC actions:
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action`
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action`

The same role includes below data plane RBAC action as well:
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action`

If you decide to use this built-in role, there's no action needed at this step.

### Create a custom role (optional)

You can skip this step if you are using built-in roles or other custom roles pre-created.

Create .json definitions of custom roles that define the scope and actions for the role. For example, the following role definitions allow the user to CRUD on online endpoints, and send scoring requests to online endpoint, respectively, under a specified workspace.

`custom-role-for-control-plane.json`:

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

`custom-role-for-scoring.json`:

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

Use the definition to create custom roles:

```bash
az role definition create --role-definition custom-role-for-control-plane.json --subscription <subscriptionId>

az role definition create --role-definition custom-role-for-scoring.json --subscription <subscriptionId>
```

> [!NOTE]
> You will need either Owner or User Access Administrator role, or a custom role that allows `Microsoft.Authorization/roleDefinitions/write` permission to be able to create/delete/update custom roles and `Microsoft.Authorization/roleDefinitions/read` to view custom roles. See [Azure custom roles](https://learn.microsoft.com/azure/role-based-access-control/custom-roles#who-can-create-delete-update-or-view-a-custom-role) for more.

You can check current definition to verify it:

```bash
az role definition list --custom-role-only -o table

az role definition list -n "Custom role for control plane operations - online endpoint"
az role definition list -n "Custom role for scoring - online endpoint"

export role_definition_id1=`(az role definition list -n "Custom role for control plane operations - online endpoint" --query "[0].id" | tr -d '"')`

export role_definition_id2=`(az role definition list -n "Custom role for scoring - online endpoint" --query "[0].id" | tr -d '"')`
```

### Assign the role to the identity

If you are using `AzureML Data Scientist` built-in role,

```bash
az role assignment create --assignee <identityId> --role "AzureML Data Scientist" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
```

If you are using your own custom role,

```bash
az role assignment create --assignee <identityId> --role "Custom role for control plane operations - online endpoint" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>

az role assignment create --assignee <identityId> --role "Custom role for scoring - online endpoint" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
```

> [!NOTE]
> You will need either Owner or User Access Administrator role, or a custom role that allows `Microsoft.Authorization/roleAssignments/write` permission to be able to assign custom roles and `Microsoft.Authorization/roleAssignments/read` to view role assignments. See [Azure roles](https://learn.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles) and [Assigning Azure roles using Azure Portal](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-portal) for more.

Confirm the assignment:

```bash
az role assignment list --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
```


## Get Microsoft Entra token for control plane operations

This step is needed only when you will perform control plane operations with REST API, which will use the token. If you plan to use other development channels such as CLI/SDK/Studio, you don't need to manually get this token because the identity would be already authenticated while you log in and token will be automatically retrieved and passed for you.

Microsoft Entra token for control plane can be retrieved from Azure resource endpoint of `https://management.azure.com`.


# [Azure CLI](#tab/azure-cli)

```bash
az login
export CONTROL_PLANE_TOKEN=`(az account get-access-token --resource https://management.azure.com --query accessToken | tr -d '"')`
```

# [REST](#tab/rest)

To get the Microsoft Entra token (`aad_token`) for the control plane operation, get the token from Azure resource endpoint of `management.azure.com` from an environment with managed identity:

```bash
export CONTROL_PLANE_TOKEN=`(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true -s)`
```

Refer to [Get a token using HTTP](/active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http) for more.

# [Python](#tab/python)

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

Refer to [Get a token using the Azure identity client library](/active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-the-azure-identity-client-library) for more.

# [Studio](#tab/studio)

Studio doesn't expose the Entra token.

---

## Create an endpoint

# [Azure CLI](#tab/azure-cli)

Create an endpoint definition YAML file.

`endpoint.yml`:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: my-endpoint
auth_mode: aad_token
```

Replace `auth_mode` to `key` for key auth, or `aml_token` for Azure Machine Learning token auth.

CLI command:

```CLI
az ml online-endpoint create -f endpoint.yml
```

Note that CLI doesn't require you to explicitly provide the control plane token.

Check current status:

```CLI
az ml online-endpoint show -n my-endpoint
```

If you want to override auth_mode (for example, to `aad_token`), you can:

```CLI
az ml online-endpoint create -n my-endpoint --auth_mode aad_token
```

If you want to update existing endpoint and specify auth_mode (for example, to `aad_token`), you can:

```CLI
az ml online-endpoint update -n my-endpoint --set auth_mode=aad_token
```

# [REST](#tab/rest)

You will use the control plane token you retrieved earlier.

Create or Update an endpoint:

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

Replace `authMode` to `key` for key auth, or `AMLToken` for Azure Machine Learning token auth.

Note that REST API call will require you to explicitly provide the control plane token.

Get current status:

```bash
response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME?api-version=$API_VERSION" \
--header "Content-Type: application/json" \
--header "Authorization: Bearer $CONTROL_PLANE_TOKEN" \
)

echo $response
```

# [Python](#tab/python)

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

Replace `auth_mode` to `key` for key auth, or `aml_token` for Azure Machine Learning token auth.

Note that SDK doesn't require you to explicitly provide the control plane token.

# [Studio](#tab/studio)

Creating endpoint with Entra token in Studio is not supported at this moment.

---

## Create a deployment

You can refer to [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md) or [Use REST to deploy an model as an online endpoint](how-to-deploy-with-rest.md) to create a deployment. There's no difference in creating deployments for different auth modes.

# [Azure CLI](#tab/azure-cli)

Create a deployment definition YAML file.

`blue-deployment.yml`:

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

Create the deployment using the YAML file. For this sample, we'll set all traffic to the new deployment.

```CLI
az ml online-deployment create -f blue-deployment.yml --all-traffic
```

Refer to [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md?tabs=azure-cli#deploy-to-azure)

# [REST](#tab/rest)

Refer to [Use REST to deploy an model as an online endpoint](how-to-deploy-with-rest.md).

# [Python](#tab/python)

Refer to [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md?tabs=python#deploy-to-azure)

# [Studio](#tab/studio)

Refer to [Deploy an ML model with an online endpoint](how-to-deploy-online-endpoints.md?tabs=azure-studio#deploy-to-azure)

---


## Get scoring URI for the endpoint

# [Azure CLI](#tab/azure-cli)

If you plan to use CLI to invoke the endpoint, you are not required to get the scoring URI explicitly. CLI will handle it for you. But you can still use CLI to get the scoring URI so that you can use it with other channels such as REST API.

```CLI
scoringUri=$(az ml online-endpoint show -n my-endpoint --query "scoring_uri")
```

# [REST](#tab/rest)

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

# [Python](#tab/python)

If you plan to use SDK to invoke the endpoint, you are not required to get the scoring URI explicitly. SDK will handle it for you. But you can still use SDK to get the scoring URI so that you can use it with other channels such as REST API.

```Python
scoring_uri = ml_client.online_endpoints.get(name=endpoint_name).scoring_uri
```

# [Studio](#tab/studio)

If you plan to use Studio to invoke the endpoint, you are not required to get the scoring URI explicitly. Studio will handle it for you. But you can still use Studio to get the scoring URI so that you can use it with other channels such as REST API.

You can find the scoring URI on the `Details` tab on the endpoint detail page.

---


## Get the key or token for data plane operation

Remember that retrieving key or token requires the right role assigned to the identity as described earlier.

# [Azure CLI](#tab/azure-cli)

### Key or Azure Machine Learning token

If you plan to use CLI to invoke the endpoint and if the endpoint is set to use auth mode of key or Azure Machine Learning token (`aml_token`), you are **not** required to get the data plane token explicitly. CLI will handle it for you. But you can still use CLI to get the data plane token so that you can use it with other channels such as REST API.

To get the key or Azure Machine Learning token (`aml_token`), use [az ml online-endpoint get-credentials](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-get-credentials). This command returns a JSON document that contains the key or Azure Machine Learning token.

__Keys__ will be returned in the `primaryKey` and `secondaryKey` fields. The following example shows how to use the `--query` parameter to return only the primary key:

```bash
export DATA_PLANE_TOKEN=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME -g $RESOURCE_GROUP -w $WORKSPACE_NAME -o tsv --query primaryKey)
```

__Azure Machine Learning Tokens__ will be returned in the `accessToken` field:

```bash
export DATA_PLANE_TOKEN=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME -g $RESOURCE_GROUP -w $WORKSPACE_NAME -o tsv --query accessToken)
```

Additionally, the `expiryTimeUtc` and `refreshAfterTimeUtc` fields contain the token expiration and refresh times. 

### Microsoft Entra token

If you plan to use CLI to invoke the endpoint and if the endpoint is set to use Microsoft Entra token (`aad_token`), you will need to get the Microsoft Entra token explicitly. Currently CLI doesn't support invoke with Microsoft Entra token. You can use REST API instead.

To get the Microsoft Entra token (`aad_token`), use [az account get-access-token](/cli/azure/account#az-account-get-access-token). This command returns a JSON document that contains the Microsoft Entra token.

__Microsoft Entra token__ will be returned in the `accessToken` field:

```bash
export DATA_PLANE_TOKEN=`(az account get-access-token --resource https://ml.azure.com --query accessToken | tr -d '"')`
```

# [REST](#tab/rest)

### Key or Azure Machine Learning token

To get the key or Azure Machine Learning token (`aml_token`):

```bash
response=$(curl -H "Content-Length: 0" --location --request POST "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/onlineEndpoints/$ENDPOINT_NAME/token?api-version=$API_VERSION" \
--header "Authorization: Bearer $CONTROL_PLANE_TOKEN")

export DATA_PLANE_TOKEN=$(echo $response | jq -r '.accessToken')
```

### Microsoft Entra token

To get the Microsoft Entra token (`aad_token`) for the data plane operation, get the token from Azure resource endpoint of `ml.azure.com` from an environment with managed identity:

```bash
export DATA_PLANE_TOKEN=`(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fml.azure.com%2F' -H Metadata:true -s)`
```

Refer to [Get a token using HTTP](/active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http) for more.

# [Python](#tab/python)

### Key or Azure Machine Learning token

If you plan to use SDK to invoke the endpoint and if the endpoint is set to use auth mode of key or Azure Machine Learning token (`aml_token`), you are **not** required to get the data plane token explicitly. SDK will handle it for you. But you can still use SDK to get the data plane token so that you can use it with other channels such as REST API.

To get the key or Azure Machine Learning token (`aml_token`), use the [get_keys](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-get-keys) method in the `OnlineEndpointOperations` Class.

__Keys__ will be returned in the `primary_key` and `secondary_key` fields:

```Python
DATA_PLANE_TOKEN = ml_client.online_endpoints.get_keys(name=endpoint_name).primary_key
```

__Azure Machine Learning Tokens__ will be returned in the `accessToken` field:

```Python
DATA_PLANE_TOKEN = ml_client.online_endpoints.get_keys(name=endpoint_name).access_token
```

Additionally, the `expiry_time_utc` and `refresh_after_time_utc` fields contain the token expiration and refresh times. 

For example, to get the `expiry_time_utc`:
```Python
print(ml_client.online_endpoints.get_keys(name=endpoint_name).expiry_time_utc)
```
### Microsoft Entra token

If you plan to use SDK to invoke the endpoint and if the endpoint is set to use Microsoft Entra token (`aad_token`), you will need to get the Microsoft Entra token explicitly. Currently SDK doesn't support invoke with Microsoft Entra token. You can use REST API instead.

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

Refer to [Get a token using the Azure identity client library](/active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-the-azure-identity-client-library) for more.

# [Studio](#tab/studio)

You can find the key or token on the `Consume` tab on the endpoint detail page.

---

## Score data using the key or token

# [Azure CLI](#tab/azure-cli)

You can use `az ml online-endpoint invoke` for endpoints with key or Azure Machine Learning token today. CLI handles the key or Azure Machine Learing token automatically so you don't need to pass it explicitly.

```CLI
az ml online-endpoint invoke -n my-endpoint -r request.json
```
 
For endpoints with Microsoft Entra token, use REST API instead and use the scoring URI above to invoke the endpoint. If you need to switch to REST API sample, make sure all environment variables are set correctly.

# [REST](#tab/rest)

When invoking the online endpoint for scoring, pass the key or token in the authorization header. The following example shows how to use the curl utility to call the online endpoint using a key/token:

```bash
curl --request POST "$scoringUri" --header "Authorization: Bearer $DATA_PLANE_TOKEN" --header 'Content-Type: application/json' --data @endpoints/online/model-1/sample-request.json
```

# [Python](#tab/python)

When calling the online endpoint for scoring, pass the key or token in the authorization header. The following example shows how to call the online endpoint using a key/token in Python. In the example, replace the `api_key` variable with your key/token you obtained.

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

For endpoints with key or Azure Machine Learning token, alternative option is to use Azure Machine Learning Python SDK with `ml_client.online_endpoints.invoke()`. For endpoints with Microsoft Entra token, `ml_client.online_endpoints.invoke()` is not supported. Instead, use generic Python SDK to send the POST request to the scoring URI as described above.

# [Studio](#tab/studio)

Studio is not supported at this moment.

---

## Telemetry

Enable traffic log in diagnostics settings for the endpoint, by following [How to enable/disable logs](how-to-monitor-online-endpoints.md#how-to-enabledisable-logs).

If the diagnostic setting is enabled, you can check `AmlOnlineEndpointTrafficLogs` table to check the auth mode and user identity.


## Next steps

* [Authentication for managed online endpoint](concept-endpoints-online-auth.md)
* [Deploy a machine learning model using an online endpoint](how-to-deploy-online-endpoints.md)
* [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md)
