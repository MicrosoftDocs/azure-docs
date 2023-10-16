---
title: Azure Active Directory token-based authentication for online endpoints
titleSuffix: Azure Machine Learning
description: Use Azure Active Directory token-based authentication to authenticate clients to an Azure Machine Learning online endpoint. 
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 10/16/2023
ms.topic: how-to
ms.custom: how-to, cliv2, sdkv2, ignite-2023
---

# Azure Active Directory token-based authentication for online endpoints

This article focuses on Azure Active Directory (AAD) token-based authentication for online endpoints for data plane operations (ie. sending scoring requests to online endpoint). For information on other authentication methods, see [Authenticate to online endpoints](how-to-authenticate-online-endpoint.md).

Online endpoint supports Azure Active Directory authentication. That means that in order to invoke an online endpoint, the user must present a valid Azure Active Directory authentication token to the online endpoint scoring URI. The token must be issued by the same Azure Active Directory tenant that the workspace is in.

In this article, we describe how to configure an online endpoint to use Azure Active Directory authentication, and how to get and use the authentication token to invoke the online endpoint.

> [!NOTE]
> - CLI runs the same way on Linux or Windows, some CLI examples use bash syntax to post-process the result from CLI commands. If you are using Windows, you can replace the post-processing logic that works on Windows. Alternatively, you can use [Azure Cloud Shell](https://shell.azure.com) to run bash or install [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/install-win10) to run bash locally.
> - CLI examples in this repo uses YAML definition files and other assets in this repo. You can clone this repo and set the current directory to `cli/endpoint/online/managed/sample` to run the CLI commands.

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. If you use studio to create/manage online endpoints/deployments, you will need an additional permission "Microsoft.Resources/deployments/write" from the resource group owner. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [REST](#tab/rest)

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Studio](#tab/studio)

Studio is not supported for AAD auth at this moment.

---

## Prepare a user identity

You can use the same identity you use for CRUD (control plane) operations when desired but this is not required.
To create the identity under Azure Active Directory, refer to [Set up authentication](https://learn.microsoft.com/azure/machine-learning/how-to-setup-authentication#azure-active-directory).

You will need the identity ID later.

## Assign permissions to the identity

List of supported permission actions:

- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action`: This is the permission that is checked with Azure RBAC for scoring to the *managed* online endpoint with `AADToken` auth, and users without this permission for those endpoints will get rejected at scoring time. For example, key auth or AMLToken auth with online endpoint (both managed and Kubernetes) would not check this permission.
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action`: This is the permission that is checked when you are trying to fetch a scoring token for an online endpoint using `AMLToken` auth.
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listKeys/action`:  This is the permission that is checked when you are trying to fetch the keys for an online endpoint that is using `Key` auth. The keys are safely stored in the key vault that was created as part of your workspace creation.
- `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/regenerateKeys/action`: This is the permission checked for running the `az ml online-endpoint regenerate-keys` command. Applicable to Key auth only.

> [!NOTE]
> For AAD Auth, you will get the token directly from Azure Active Directory, and you don't need additional permission on the workspace, other than the above.

You can define the permission action according to your business needs. For example, you can use the permission action `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*/actions` if you want to control all operations above altogether.

You can also define the scopes according to your business needs. For example, you can use the scope `/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>/onlineEndpoints/<endpointName>` if you want to control the operations for a specific endpoint. You can also use the scope `/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>` if you want to control the operations for all endpoints in a workspace. See [Understand scope for Azure RBAC](https://learn.microsoft.com/azure/role-based-access-control/scope-overview) for more.

### Use a built-in role

`AzureML Data Scientist` built-in role include all 4 RBAC actions described above. 

### Create a custom role (optional)

You can skip this step if you are using built-in roles or other custom roles pre-created.

Create a .json definition of a custom role that defines the scope and actions for the role. For example, the following role definition allows the user to send scoring requests to online endpoint under a specified workspace.

`score-custom-role.json`:

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

Use the definition to create a custom role:

```bash
az role definition create --role-definition score-custom-role.json --subscription <subscriptionId>
```

> [!NOTE]
> You will need either Owner or User Access Administrator role, or a custom role that allows `Microsoft.Authorization/roleDefinitions/write` permission to be able to create/delete/update custom roles and `Microsoft.Authorization/roleDefinitions/read` to view custom roles. See [Azure custom roles](https://learn.microsoft.com/azure/role-based-access-control/custom-roles#who-can-create-delete-update-or-view-a-custom-role) for more.

You can check current definition to verify it:

```bash
az role definition list --custom-role-only -o table

az role definition list -n "Custom role for scoring - online endpoint"

export role_definition_id=`(az role definition list -n "Custom role for scoring - online endpoint" --query "[0].id" | tr -d '"')`
```

### Assign the role to the identity

If you are using `AzureML Data Scientist` built-in role,

```bash
az role assignment create --assignee <identityId> --role "AzureML Data Scientist" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
```

If you are using your own custom role,

```bash
az role assignment create --assignee <identityId> --role "Custom role for scoring - online endpoint" --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
```

> [!NOTE]
> You will need either Owner or User Access Administrator role, or a custom role that allows `Microsoft.Authorization/roleAssignments/write` permission to be able to assign custom roles and `Microsoft.Authorization/roleAssignments/read` to view role assignments. See [Azure roles](https://learn.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles) and [Assigning Azure roles using Azure Portal](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-portal) for more.

Confirm the assignment:

```base
az role assignment list --scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.MachineLearningServices/workspaces/<workspaceName>
```

## Get the token

AAD token for *control plane* should be retrieved from `https://management.azure.com`. This can be used for REST API calls to control plane (CRUD on endpoints/deployments). When doing CRUD on endpoints/deployments, CLI/SDK wouldn't need this token as they would have been already authenticated with Azure Active Directory. 

AAD token for *data plane* should be retrieved from `https://ml.azure.com`. This can be used for REST API calls to data plane (invoking endpoints). When invoking endpoints, CLI/SDK are not supported for AAD auth - you'll need to use REST API at this moment.

# [Azure CLI](#tab/azure-cli)

```bash
export CONTROL_PLANE_TOKEN=`(az account get-access-token --resource https://management.azure.com --query accessToken | tr -d '"')`
```

`az ml online-endpoint get-credentials` is not supported for AAD auth data plane token. Instead, you can use CLI to get the token directly from Azure Active Directory.

```bash
export DATA_PLANE_TOKEN=`(az account get-access-token --resource https://ml.azure.com --query accessToken | tr -d '"')`
```

# [REST](#tab/rest)

TBD. For now, use CLI (`az account get-access-token`) to get the tokens. 

# [Python](#tab/python)

TBD. You can use MSAL SDK (AAD ADK) to achieve this.

# [Studio](#tab/studio)

Studio is not supported at this moment.

---

## Create an endpoint with AAD auth

# [Azure CLI](#tab/azure-cli)

Create an endpoint definition YAML file. Sample file is created for you in this repo.

`endpoint.yml`:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: my-endpoint
auth_mode: aad_token
```

CLI command:

```CLI
az ml online-endpoint create -f endpoint.yml
```

Check current status:

```CLI
az ml online-endpoint show -n my-endpoint
```

If you want to override auth_mode, you can:

```CLI
az ml online-endpoint create -n my-endpoint --auth_mode aad_token
```

If you want to update existing endpoint and specify auth_mode, you can:

```CLI
az ml online-endpoint update -n my-endpoint --set auth_mode=aad_token
```

# [REST](#tab/rest)

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

# [Studio](#tab/studio)

Studio is not supported at this moment.

---

## Create a deployment

Creating a deployment for AAD auth is the same as creating a deployment for key or AML token auth.

CLI example is provided for convenience. You can refer to [Deploy an ML model with an online endpoint](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-deploy-online-endpoints) or [Use REST to deploy an model as an online endpoint](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-deploy-with-rest) for general guidance.

# [Azure CLI](#tab/azure-cli)

Create a deployment definition YAML file. Sample file is created for you in this repo.

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

# [REST](#tab/rest)

TBD

# [Python](#tab/python)

TBD

# [Studio](#tab/studio)

TBD

---

## Get scoring URI for the endpoint

# [Azure CLI](#tab/azure-cli)

TBD

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

# [Studio](#tab/studio)

---

## Invoke the endpoint

# [Azure CLI](#tab/azure-cli)

CLI `az ml online-endpoint invoke` for AAD auth is not supported at this moment. Use REST API instead and use the scoring URI above to invoke the endpoint.
If you need to switch to REST API sample, make sure all environment variables are set correctly.

# [REST](#tab/rest)

```bash
curl --location --request POST $scoringUri \
--header "Authorization: Bearer $DATA_PLANE_TOKEN" \
--header "Content-Type: application/json" \
--data-raw '{"data":[[1,2,3,4,5,6,7,8,9,10],[10,9,8,7,6,5,4,3,2,1]]}'
```

Make sure you have the `sample-request.json` file in the specified directory.

# [Python](#tab/python)

Using Azure Machine Learning Python SDK with `ml_client.online_endpoints.invoke()` for AAD auth is not supported at this moment. Instead, use generic Python SDK to send the POST request to the scoring URI.

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
api_key = '<AAD token as retrieved earlier>'
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

# [Studio](#tab/studio)

Studio is not supported at this moment.

---

## Telemetry

Enable traffic log in diagnostics settings for the endpoint, by following [How to enable/disable logs](https://learn.microsoft.com/azure/machine-learning/how-to-monitor-online-endpoints#how-to-enabledisable-logs).

If the diagnostic setting is enabled, you can check AmlOnlineEndpointTrafficLogs table to check the auth mode and user identity.

![screenshot of traffic log for a scoring request](docs/traffic-logs.png)

## Next steps

Please provide your feedbacks using AAD auth with this approach using this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2MCOuuIp2tBl5FOumTtkYtUQUs1MVNWSTZVOFlZMkZTUktBS1RLSTVOSC4u).
