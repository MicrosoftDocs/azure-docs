---
title: "Deploy models using batch endpoints with REST APIs (preview)"
titleSuffix: Azure Machine Learning
description: Learn how to deploy models using batch endpoints with REST APIs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: tracych
ms.author: tracych
ms.date: 10/21/2021
ms.reviewer: laobri
ms.custom: devplatv2
---

# Deploy models with REST (preview) for batch scoring

Learn how to use the Azure Machine Learning REST API to deploy models for batch scoring (preview).

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

The REST API uses standard HTTP verbs to create, retrieve, update, and delete resources. The REST API works with any language or tool that can make HTTP requests. REST's straightforward structure makes it a good choice in scripting environments and for MLOps automation.

In this article, you learn how to use the new REST APIs to:

> [!div class="checklist"]
> * Create machine learning assets
> * Create a batch endpoint and a batch deployment
> * Invoke a batch endpoint to start a batch scoring job

## Prerequisites

- An **Azure subscription** for which you have administrative rights. If you don't have such a subscription, try the [free or paid personal subscription](https://azure.microsoft.com/free/).
- An [Azure Machine Learning workspace](how-to-manage-workspace.md).
- A service principal in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal authentication token. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The **curl** utility. The **curl** program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. 

## Set endpoint name

> [!NOTE]
> Batch endpoint names need to be unique at the Azure region level. For example, there can be only one batch endpoint with the name mybatchendpoint in westus2.

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="set_endpoint_name":::

## Azure Machine Learning batch endpoints
Batch endpoints (preview) simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. In this article, you'll create a batch endpoint and deployment, and invoking it to start a batch scoring job. But first you'll have to register the assets needed for deployment, including model, code, and environment.

There are many ways to create an Azure Machine Learning batch endpoint, [including the Azure CLI](how-to-use-batch-endpoint.md), and visually with [the studio](how-to-use-batch-endpoints-studio.md). The following example creates a batch endpoint and deployment with the REST API.

## Create machine learning assets

First, set up your Azure Machine Learning assets to configure your job.

In the following REST API calls, we use `SUBSCRIPTION_ID`, `RESOURCE_GROUP`, `LOCATION`, and `WORKSPACE` as placeholders. Replace the placeholders with your own values. 

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). Replace `TOKEN` with your own value. You can retrieve this token with the following command:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" range="13":::

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. Set the API version as a variable to accommodate future versions:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" range="11":::

### Get storage account details

To register the model and code, first they need to be uploaded to a storage account. The details of the storage account are available in the data store. In this example, you get the default datastore and Azure Storage account for your workspace. Query your workspace with a GET request to get a JSON file with the information.

You can use the tool [jq](https://stedolan.github.io/jq/) to parse the JSON result and get the required values. You can also use the Azure portal to find the same information:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="get_storage_details":::

### Upload & register code

Now that you have the datastore, you can upload the scoring script. Use the Azure Storage CLI to upload a blob into your default container:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="upload_code":::

> [!TIP]
> You can also use other methods to upload, such as the Azure portal or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

Once you upload your code, you can specify your code with a PUT request:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="create_code":::

### Upload and register model

Similar to the code, Upload the model files:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="upload_model":::

Now, register the model:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="create_model":::

### Create environment
The deployment needs to run in an environment that has the required dependencies. Create the environment with a PUT request. Use a docker image from Microsoft Container Registry. You can configure the docker image with `image` and add conda dependencies with `condaFile`.

Now, run the following snippet to create an environment:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="create_environment":::

### Create compute
Batch scoring runs only on cloud computing resources, not locally. The cloud computing resource is a reusable virtual computer cluster where you can run batch scoring workflows.

Create a compute cluster:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="create_compute":::

### Create batch endpoint

Create the batch endpoint:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="create_endpoint":::

### Create batch deployment

Create a batch deployment under the endpoint:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="create_deployment":::

### Set the default batch deployment under the endpoint

There's only one default batch deployment under one endpoint, which will be used when invoke to run batch scoring job.

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="set_endpoint_defaults":::

### Invoke the batch endpoint to start a batch scoring job

We need the scoring uri and access token to invoke the batch endpoint. First get the scoring uri:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="get_endpoint":::

Get the batch endpoint access token:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="get_access_token":::

Now, invoke the batch endpoint using curl with data in cloud:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="score_endpoint_with_data_in_cloud":::

You can also invoke the batch endpoint with a registered dataset:

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="score_endpoint_with_dataset":::

### Check the batch scoring job

Batch scoring jobs usually take some time to process the entire set of inputs. Monitor the job status and check the results after it's completed.

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="check_job":::

### Delete the batch endpoint

If you aren't going use the batch endpoint, you should delete it with the below command (it deletes the batch endpoint and all the underlying deployments):

:::code language="rest-api" source="~/azureml-examples-cli-preview/cli/batch-score-rest.sh" id="delete_endpoint":::

## Next steps

* Learn how to deploy your model for batch scoring [using the Azure CLI](how-to-use-batch-endpoint.md).
* Learn how to deploy your model for batch scoring [using studio](how-to-use-batch-endpoints-studio.md).
* Learn to [Troubleshoot batch endpoints](how-to-troubleshoot-batch-endpoints.md)