---
title: Authenticate to an online endpoint
titleSuffix: Azure Machine Learning
description: Learn to authenticate clients to an Azure Machine Learning online endpoint
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, event-tier1-build-2022, ignite-2022
---

# Key and token-based authentication for online endpoints

When consuming an online endpoint from a client, you can use either a _key_ or a _token_. Keys don't expire, tokens do.

## Configure the endpoint authentication

You can set the authentication type when you create an online endpoint. Set the `auth_mode` to `key` or `aml_token` depending on which one you want to use. The default value is `key`.

When deploying using CLI v2, set this value in the [online endpoint YAML file](reference-yaml-endpoint-online.md). For more information, see [How to deploy an online endpoint](how-to-deploy-managed-online-endpoints.md).

When deploying using the Python SDK v2, use the [OnlineEndpoint](/python/api/azure-ai-ml/azure.ai.ml.entities.onlineendpoint) class.

## Get the key or token

Access to retrieve the key or token for an online endpoint is restricted by Azure role-based access controls (Azure RBAC). To retrieve the authentication key or token, your security principal (user identity or service principal) must be assigned one of the following roles:

* Owner
* Contributor
* A custom role that allows `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` and `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listkeys/action`.

For more information on using Azure RBAC with Azure Machine Learning, see [Manage access to Azure Machine Learning](how-to-assign-roles.md).

To get the key, use [az ml online-endpoint get-credentials](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-get-credentials). This command returns a JSON document that contains the key or token. __Keys__ will be returned in the `primaryKey` and `secondaryKey` fields. __Tokens__ will be returned in the `accessToken` field. Additionally, the `expiryTimeUtc` and `refreshAfterTimeUtc` fields contain the token expiration and refresh times. The following example shows how to use the `--query` parameter to return only the primary key:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl_get_key":::

## Score data using the token

When calling the online endpoint for scoring, pass the key or token in the authorization header. The following example shows how to use the curl utility to call the online endpoint using a key (if using a token, replace `$ENDPOINT_KEY` with the token value):

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl" :::    

## Next steps

* [Deploy a machine learning model using an online endpoint](how-to-deploy-managed-online-endpoints.md)
* [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md)
