---
title: Authenticate to an online endpoint
titleSuffix: Azure Machine Learning
description: Learn to authenticate clients to an Azure Machine Learning online endpoint
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: seramasu
ms.reviewer: larryfr
author: rsethur
ms.date: 05/02/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2
---

# Key and token-based authentication for online endpoints

When consuming an online endpoint from a client, you can use either a _key_ or a _token_. Keys don't expire, tokens do.

## Configure the endpoint authentication

You can set the authentication type when you create an online endpoint. Set the `auth_mode` to `key` or `aml_token` depending on which one you want to use. The default value is `key`.

When deploying using CLI v2, set this value in the [online endpoint YAML file](reference-yaml-endpoint-online.md). For more information, see [How to deploy an online endpoint](how-to-deploy-managed-online-endpoint.md).

When deploying using the Python SDK v2 (preview), use the [OnlineEndpoint](/python/api/azure-ml/azure.ml.entities.onlineendpoint) class.

# Get the key or token

Access to retrieve the key or token for an online endpoint is restricted by Azure role-based access controls (Azure RBAC). To retrieve the authentication key or token, your security principal (user identity or service principal) must be assigned one of the following roles:

* Owner
* Contributor
* A custom role that allows `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` and `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listkeys/action`.

For more information on using Azure RBAC with Azure Machine Learning, see [Manage access to Azure Machine Learning](how-to-assign-roles.md).

To get the key, use [az ml online-endpoint get-credentials](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-get-credentials):

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl_get_key":::

## Score data using the token

The following example shows how to use the curl utility to call the online endpoint:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl" :::    

## Next steps

* [Deploy a machine learning model using an online endpoint](how-to-deploy-managed-online-endpoint.md)
* [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md)