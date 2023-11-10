---
title: "Deploy models using online endpoints with REST APIs"
titleSuffix: Azure Machine Learning
description: Learn how to deploy models using online endpoints with REST APIs.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 10/24/2023
ms.custom: devplatv2, event-tier1-build-2022
---

# Deploy models with REST

Learn how to use the Azure Machine Learning REST API to deploy models.

The REST API uses standard HTTP verbs to create, retrieve, update, and delete resources. The REST API works with any language or tool that can make HTTP requests. REST's straightforward structure makes it a good choice in scripting environments and for MLOps automation.

In this article, you learn how to use the new REST APIs to:

> [!div class="checklist"]
> * Create machine learning assets
> * Create a basic training job 
> * Create a hyperparameter tuning sweep job

## Prerequisites

- An **Azure subscription** for which you have administrative rights. If you don't have such a subscription, try the [free or paid personal subscription](https://azure.microsoft.com/free/).
- An [Azure Machine Learning workspace](quickstart-create-resources.md).
- A service principal in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal authentication token. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The **curl** utility. The **curl** program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. 

## Set endpoint name

> [!NOTE]
> Endpoint names need to be unique at the Azure region level. For example, there can be only one endpoint with the name my-endpoint in westus2.

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="set_endpoint_name":::

## Azure Machine Learning online endpoints

Online endpoints allow you to deploy your model without having to create and manage the underlying infrastructure as well as Kubernetes clusters. In this article, you'll create an online endpoint and deployment, and validate it by invoking it. But first you'll have to register the assets needed for deployment, including model, code, and environment.

There are many ways to create an Azure Machine Learning online endpoint [including the Azure CLI](how-to-deploy-online-endpoints.md), and visually with [the studio](how-to-use-managed-online-endpoint-studio.md). The following example an online endpoint with the REST API.

## Create machine learning assets

First, set up your Azure Machine Learning assets to configure your job.

In the following REST API calls, we use `SUBSCRIPTION_ID`, `RESOURCE_GROUP`, `LOCATION`, and `WORKSPACE` as placeholders. Replace the placeholders with your own values. 

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). Replace `TOKEN` with your own value. You can retrieve this token with the following command:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_access_token":::

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. Set the API version as a variable to accommodate future versions:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="api_version":::

### Get storage account details

To register the model and code, first they need to be uploaded to a storage account. The details of the storage account are available in the data store. In this example, you get the default datastore and Azure Storage account for your workspace. Query your workspace with a GET request to get a JSON file with the information.

You can use the tool [jq](https://stedolan.github.io/jq/) to parse the JSON result and get the required values. You can also use the Azure portal to find the same information:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_storage_details":::

### Upload & register code

Now that you have the datastore, you can upload the scoring script. Use the Azure Storage CLI to upload a blob into your default container:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="upload_code":::

> [!TIP]
> You can also use other methods to upload, such as the Azure portal or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

Once you upload your code, you can specify your code with a PUT request and refer to the datastore with `datastoreId`:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_code":::

### Upload and register model

Similar to the code, Upload the model files:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="upload_model":::

Now, register the model:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_model":::

### Create environment
The deployment needs to run in an environment that has the required dependencies. Create the environment with a PUT request. Use a docker image from Microsoft Container Registry. You can configure the docker image with `Docker` and add conda dependencies with `condaFile`.

In the following snippet, the contents of a Conda environment (YAML file) has been read into an environment variable:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_environment":::

### Create endpoint

Create the online endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_endpoint":::

### Create deployment

Create a deployment under the endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="create_deployment":::

### Invoke the endpoint to score data with your model

We need the scoring uri and access token to invoke the endpoint. First get the scoring uri:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_endpoint":::

Get the endpoint access token:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_access_token":::

Now, invoke the endpoint using curl:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="score_endpoint":::

### Check the logs

Check the deployment logs:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="get_deployment_logs":::

### Delete the endpoint

If you aren't going use the deployment, you should delete it with the below command (it deletes the endpoint and all the underlying deployments):

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="delete_endpoint":::

## Next steps

* Learn how to deploy your model [using the Azure CLI](how-to-deploy-online-endpoints.md).
* Learn how to deploy your model [using studio](how-to-use-managed-online-endpoint-studio.md).
* Learn to [Troubleshoot online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md)
* Learn how to [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
* Learn how to [monitor online endpoints](how-to-monitor-online-endpoints.md).
* Learn [safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md).
* [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md).
* [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
* Learn about [limits for online endpoints](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).
