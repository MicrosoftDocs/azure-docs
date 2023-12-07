---
title: Authenticate to an online endpoint
titleSuffix: Azure Machine Learning
description: Learn to authenticate clients to an Azure Machine Learning online endpoint
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 12/07/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, sdkv2, event-tier1-build-2022, ignite-2022
---

# Key and token-based authentication for online endpoints

When consuming an online endpoint from a client, you can use either a _key_ or a _token_. Keys don't expire, tokens do.

## Configure the endpoint authentication

You can set the authentication type when you create an online endpoint. Set the `auth_mode` to `key` or `aml_token` depending on which one you want to use. The default value is `key`.

When deploying using CLI v2, set this value in the [online endpoint YAML file](reference-yaml-endpoint-online.md). For more information, see [How to deploy an online endpoint](how-to-deploy-online-endpoints.md).

When deploying using the Python SDK v2, use the [OnlineEndpoint](/python/api/azure-ai-ml/azure.ai.ml.entities.onlineendpoint) class.

## Get the key or token

Access to retrieve the key or token for an online endpoint is restricted by Azure role-based access controls (Azure RBAC). To retrieve the authentication key or token, your security principal (user identity or service principal) must be assigned one of the following roles:

* Owner
* Contributor
* A custom role that allows `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` and `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listkeys/action`.

For more information on using Azure RBAC with Azure Machine Learning, see [Manage access to Azure Machine Learning](how-to-assign-roles.md).

On the option to retrieve the token via REST API, see [Invoke the endpoint to score data with your model](how-to-deploy-with-rest.md#invoke-the-endpoint-to-score-data-with-your-model).

# [Azure CLI](#tab/azure-cli)

To get the key or token, use [az ml online-endpoint get-credentials](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-get-credentials). This command returns a JSON document that contains the key or token.

__Keys__ will be returned in the `primaryKey` and `secondaryKey` fields. The following example shows how to use the `--query` parameter to return only the primary key:

```azurecli
ENDPOINT_CRED=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME -g $RESOURCE_GROUP -w $WORKSPACE_NAME -o tsv --query primaryKey)
```

__Tokens__ will be returned in the `accessToken` field:

```azurecli
ENDPOINT_CRED=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME -g $RESOURCE_GROUP -w $WORKSPACE_NAME -o tsv --query accessToken)
```

Additionally, the `expiryTimeUtc` and `refreshAfterTimeUtc` fields contain the token expiration and refresh times. 

# [Python](#tab/python)

To get the key or token, use the [get_keys](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-get-keys) method in the `OnlineEndpointOperations` Class.

__Keys__ will be returned in the `primary_key` and `secondary_key` fields:

```Python
endpoint_cred = ml_client.online_endpoints.get_keys(name=endpoint_name).primary_key
```

__Tokens__ will be returned in the `accessToken` field:

```Python
endpoint_cred = ml_client.online_endpoints.get_keys(name=endpoint_name).access_token
```

Additionally, the `expiry_time_utc` and `refresh_after_time_utc` fields contain the token expiration and refresh times. 

For example, to get the `expiry_time_utc`:
```Python
print(ml_client.online_endpoints.get_keys(name=endpoint_name).expiry_time_utc)
```

---

## Score data using the key or token

# [Azure CLI](#tab/azure-cli)

When calling the online endpoint for scoring, pass the key or token in the authorization header. The following example shows how to use the curl utility to call the online endpoint using a key/token:

```azurecli
SCORING_URI=$(az ml online-endpoint show -n $ENDPOINT_NAME -o tsv --query scoring_uri)

curl --request POST "$SCORING_URI" --header "Authorization: Bearer $ENDPOINT_CRED" --header 'Content-Type: application/json' --data @endpoints/online/model-1/sample-request.json
```

# [Python](#tab/python)

When calling the online endpoint for scoring, pass the key or token in the authorization header. The following example shows how to call the online endpoint using a key/token in Python. In the example, replace the `api_key` variable with your key/token you obtained.

```Python
import urllib.request
import json
import os
import ssl

def allowSelfSignedHttps(allowed):
    # bypass the server certificate verification on client side
    if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
        ssl._create_default_https_context = ssl._create_unverified_context

allowSelfSignedHttps(True) # this line is needed if you use self-signed certificate in your scoring service

# Request data goes here
# The example below assumes JSON formatting which may be updated
# depending on the format your endpoint expects
# More information can be found here:
# https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script
data = {}

body = str.encode(json.dumps(data))

url = 'https://endpt-auth-token.eastus.inference.ml.azure.com/score'
api_key = '<endpoint_cred>' # Replace this with the key or token you obtained
assert api_key != "<endpoint_cred>", "key should be provided to invoke the endpoint"

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


---

## Next steps

* [Deploy a machine learning model using an online endpoint](how-to-deploy-online-endpoints.md)
* [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md)
