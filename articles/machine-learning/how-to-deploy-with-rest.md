---
title: Deploy models by using online endpoints with REST APIs
titleSuffix: Azure Machine Learning
description: Learn how to deploy models by using online endpoints with REST APIs, including creation of assets, training jobs, and hyperparameter tuning sweep jobs.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.reviewer: sehan
ms.date: 07/29/2024
ms.custom: devplatv2

#customer intent: As a developer, I want to use the Azure Machine Learning REST APIs so that I can deploy models by using online endpoints.
---

# Deploy models with REST

This article describes how to use the Azure Machine Learning REST API to deploy models by using online endpoints. Online endpoints allow you to deploy your model without having to create and manage the underlying infrastructure and Kubernetes clusters. The following procedures demonstrate how to create an online endpoint and deployment and validate the endpoint by invoking it.

There are many ways to create an Azure Machine Learning online endpoint. You can use [the Azure CLI](how-to-deploy-online-endpoints.md), the [Azure Machine Learning studio](how-to-deploy-online-endpoints.md), or the REST API. The REST API uses standard HTTP verbs to create, retrieve, update, and delete resources. It works with any language or tool that can make HTTP requests. The straightforward structure of the REST API makes it a good choice in scripting environments and for machine learning operations automation.

## Prerequisites

- An **Azure subscription** for which you have administrative rights. If you don't have such a subscription, try the [free or paid personal subscription](https://azure.microsoft.com/free/).

- An [Azure Machine Learning workspace](quickstart-create-resources.md).

- A service principal in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).

- A service principal authentication token. You can get the token by following the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token).

- The **curl** utility.

   - All installations of Microsoft Windows 10 and Windows 11 have curl installed by default. In PowerShell, curl is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. 

   - For UNIX platforms, the curl program is available in the [Windows Subsystem for Linux](/windows/wsl/install) or any UNIX distribution.

## Set endpoint name

Endpoint names must be unique at the Azure region level. An endpoint name such as _my-endpoint_ must be the only endpoint with that name within a specified region.

Create a unique endpoint name by calling the `RANDOM` utility, which adds a random number as a suffix to the value `endpt-rest`:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="set_endpoint_name":::

## Create machine learning assets

To prepare for the deployment, set up your Azure Machine Learning assets and configure your job. You register the assets required for deployment, including the model, code, and environment.

> [!TIP]
> The REST API calls in the following procedures use `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, `$LOCATION` (region), and Azure Machine Learning `$WORKSPACE` as placeholders for some arguments. When you implement the code for your deployment, replace the argument placeholders with your specific deployment values. 
 
Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). When you implement the code for your deployment, replace instances of the `$TOKEN` placeholder with the service principal token for your deployment. You can retrieve this token with the following command:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_access_token":::

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service.

Set the `API_version` variable to accommodate future versions:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="api_version":::

### Get storage account details

To register the model and code, you need to first upload these items to an Azure Storage account. The details of the Azure Storage account are available in the data store. In this example, you get the default data store and Azure Storage account for your workspace. Query your workspace with a GET request to get a JSON file with the information.

You can use the [jq](https://jqlang.github.io/jq/) tool to parse the JSON result and get the required values. You can also use the Azure portal to find the same information:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_storage_details":::

### Upload and register code

Now that you have the data store, you can upload the scoring script. Use the Azure Storage CLI to upload a blob into your default container:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="upload_code":::

> [!TIP]
> You can use other methods to complete the upload, such as the Azure portal or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

After you upload your code, you can specify your code with a PUT request and refer to the data store with the `datastoreId` identifier:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_code":::

### Upload and register model

Upload the model files with a similar REST API call:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="upload_model":::

After the upload completes, register the model:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_model":::

### Create environment

The deployment needs to run in an environment that has the required dependencies. Create the environment with a PUT request. Use a Docker image from Microsoft Container Registry. You can configure the Docker image with the `docker` command and add conda dependencies with the `condaFile` command.

The following code reads the contents of a Conda environment (YAML file) into an environment variable:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_environment":::

### Create endpoint

Create the online endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_endpoint":::

### Create deployment

Create a deployment under the endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_deployment":::

### Invoke endpoint to score data with model

You need the scoring URI and access token to invoke the deployment endpoint. 

First, get the scoring URI:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_endpoint":::

Next, get the endpoint access token:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_access_token":::

Finally, invoke the endpoint by using the curl utility:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="score_endpoint":::

### Check deployment logs

Check the deployment logs:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_deployment_logs":::

### Delete endpoint

If you aren't going to use the deployment further, delete the resources.

Run the following command, which deletes the endpoint and all underlying deployments:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="delete_endpoint":::

## Related content

- [Deploy and score a model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Troubleshoot online endpoints deployment and scoring](how-to-troubleshoot-online-endpoints.md)
- [Monitor online endpoints](how-to-monitor-online-endpoints.md)
