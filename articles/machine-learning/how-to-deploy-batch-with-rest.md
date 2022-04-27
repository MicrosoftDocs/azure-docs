---
title: "Deploy models using batch endpoints with REST APIs (preview)"
titleSuffix: Azure Machine Learning
description: Learn how to deploy models using batch endpoints with REST APIs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: blackmist
ms.author: larryfr
ms.date: 03/31/2022
ms.reviewer: nibaccam
ms.custom: devplatv2
---

# Deploy models with REST (preview) for batch scoring 

Learn how to use the Azure Machine Learning REST API to deploy models for batch scoring (preview).

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]
[!INCLUDE [cli v2 how to update](../../includes/machine-learning-cli-v2-update-note.md)]

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
- The [jq](https://stedolan.github.io/jq/) JSON processor.

> [!IMPORTANT]
> The code snippets in this article assume that you are using the Bash shell.
>
> The code snippets are pulled from the `/cli/batch-score-rest.sh` file in the [AzureML Example repository](https://github.com/Azure/azureml-examples).

## Set endpoint name

> [!NOTE]
> Batch endpoint names need to be unique at the Azure region level. For example, there can be only one batch endpoint with the name mybatchendpoint in westus2.

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="set_endpoint_name":::

## Azure Machine Learning batch endpoints

[Batch endpoints (preview)](concept-endpoints.md#what-are-batch-endpoints-preview) simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. In this article, you'll create a batch endpoint and deployment, and invoking it to start a batch scoring job. But first you'll have to register the assets needed for deployment, including model, code, and environment.

There are many ways to create an Azure Machine Learning batch endpoint, [including the Azure CLI](how-to-use-batch-endpoint.md), and visually with [the studio](how-to-use-batch-endpoints-studio.md). The following example creates a batch endpoint and deployment with the REST API.

## Create machine learning assets

First, set up your Azure Machine Learning assets to configure your job.

In the following REST API calls, we use `SUBSCRIPTION_ID`, `RESOURCE_GROUP`, `LOCATION`, and `WORKSPACE` as placeholders. Replace the placeholders with your own values. 

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). Replace `TOKEN` with your own value. You can retrieve this token with the following command:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" range="10":::

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. Set the API version as a variable to accommodate future versions:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" range="8":::

### Create compute
Batch scoring runs only on cloud computing resources, not locally. The cloud computing resource is a reusable virtual computer cluster where you can run batch scoring workflows.

Create a compute cluster:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_compute":::

> [!TIP]
> If you want to use an existing compute instead, you must specify the full Azure Resource Manager ID when [creating the batch deployment](#create-batch-deployment). The full ID uses the format `/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/computes/<your-compute-name>`.

### Get storage account details

To register the model and code, first they need to be uploaded to a storage account. The details of the storage account are available in the data store. In this example, you get the default datastore and Azure Storage account for your workspace. Query your workspace with a GET request to get a JSON file with the information.

You can use the tool [jq](https://stedolan.github.io/jq/) to parse the JSON result and get the required values. You can also use the Azure portal to find the same information:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="get_storage_details":::

### Upload & register code

Now that you have the datastore, you can upload the scoring script. Use the Azure Storage CLI to upload a blob into your default container:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="upload_code":::

> [!TIP]
> You can also use other methods to upload, such as the Azure portal or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

Once you upload your code, you can specify your code with a PUT request:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_code":::

### Upload and register model

Similar to the code, Upload the model files:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="upload_model":::

Now, register the model:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_model":::

### Create environment
The deployment needs to run in an environment that has the required dependencies. Create the environment with a PUT request. Use a docker image from Microsoft Container Registry. You can configure the docker image with `image` and add conda dependencies with `condaFile`.

Run the following code to read the `condaFile` defined in json. The source file is at `/cli/endpoints/batch/mnist/environment/conda.json` in the example repository:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="read_condafile":::

Now, run the following snippet to create an environment:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_environment":::

## Deploy with batch endpoints

Next, create the batch endpoint, a deployment, and set the default deployment.

### Create batch endpoint

Create the batch endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_endpoint":::

### Create batch deployment

Create a batch deployment under the endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_deployment":::

### Set the default batch deployment under the endpoint

There's only one default batch deployment under one endpoint, which will be used when invoke to run batch scoring job.

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="set_endpoint_defaults":::

## Run batch scoring

Invoking a batch endpoint triggers a batch scoring job. A job `id` is returned in the response, and can be used to track the batch scoring progress. In the following snippets, `jq` is used to get the job `id`.

### Invoke the batch endpoint to start a batch scoring job

Get the scoring uri and access token to invoke the batch endpoint. First get the scoring uri:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="get_endpoint":::

Get the batch endpoint access token:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="get_access_token":::

Now, invoke the batch endpoint to start a batch scoring job. The following example scores data publicly available in the cloud:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="score_endpoint_with_data_in_cloud":::

If your data is stored in an Azure Machine Learning registered datastore, you can invoke the batch endpoint with a dataset. The following code creates a new dataset:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_dataset":::

Next, reference the dataset when invoking the batch endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="score_endpoint_with_dataset":::

In the previous code snippet, a custom output location is provided by using `datastoreId`, `path`, and `outputFileName`. These settings allow you to configure where to store the batch scoring results.

> [!IMPORTANT]
> You must provide a unique output location. If the output file already exists, the batch scoring job will fail.

For this example, the output is stored in the default blob storage for the workspace. The folder name is the same as the endpoint name, and the file name is randomly generated by the following code:

:::code language="azurecli" source="~/azureml-examples-main/cli/batch-score-rest.sh" ID="unique_output" :::

### Check the batch scoring job

Batch scoring jobs usually take some time to process the entire set of inputs. Monitor the job status and check the results after it's completed:

> [!TIP]
> The example invokes the default deployment of the batch endpoint. To invoke a non-default deployment, use the `azureml-model-deployment` HTTP header and set the value to the deployment name. For example, using a parameter of `--header "azureml-model-deployment: $DEPLOYMENT_NAME"` with curl.

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="check_job":::

### Check batch scoring results

For information on checking the results, see [Check batch scoring results](how-to-use-batch-endpoint.md#check-batch-scoring-results).

## Delete the batch endpoint

If you aren't going use the batch endpoint, you should delete it with the below command (it deletes the batch endpoint and all the underlying deployments):

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="delete_endpoint":::

## Next steps

* Learn how to deploy your model for batch scoring [using the Azure CLI](how-to-use-batch-endpoint.md).
* Learn how to deploy your model for batch scoring [using studio](how-to-use-batch-endpoints-studio.md).
* Learn to [Troubleshoot batch endpoints](how-to-troubleshoot-batch-endpoints.md)
