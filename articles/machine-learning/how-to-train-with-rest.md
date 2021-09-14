---
title: 'Train models with REST (preview)'
titleSuffix: Azure Machine Learning
description: Learn how to train models and create jobs with REST APIs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: wenxwei
ms.author: wenxwei
ms.date: 05/25/2021
ms.reviewer: peterlu
ms.custom: devplatv2
---

# Train models with REST (preview)

Learn how to use the Azure Machine Learning REST API to create and manage training jobs (preview).

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

The REST API uses standard HTTP verbs to create, retrieve, update, and delete resources. The REST API works with any language or tool that can make HTTP requests. REST's straightforward structure makes it a good choice in scripting environments and for MLOps automation.

In this article, you learn how to use the new REST APIs to:

> [!div class="checklist"]
> * Create machine learning assets
> * Create a basic training job 
> * Create a hyperparameter tuning sweep job

## Prerequisites

- An **Azure subscription** for which you have administrative rights. If you don't have such a subscription, try the [free or paid personal subscription](https://azure.microsoft.com/free/).
- An [Azure Machine Learning workspace](how-to-manage-workspace.md).
- A service principal in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal authentication token. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The **curl** utility. The **curl** program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. 

## Azure Machine Learning jobs
A job is a resource that specifies all aspects of a computation job. It aggregates three things:

- What to run?
- How to run it?
- Where to run it?

There are many ways to submit an Azure Machine Learning job including the SDK, Azure CLI, and visually with the studio. The following example submits a LightGBM training job with the REST API.

## Create machine learning assets

First, set up your Azure Machine Learning assets to configure your job.

In the following REST API calls, we use `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, `$LOCATION`, and `$WORKSPACE` as placeholders. Replace the placeholders with your own values. 

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). Replace `$TOKEN` with your own value. You can retrieve this token with the following command:

```bash
TOKEN=$(az account get-access-token --query accessToken -o tsv)
```

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. The current Azure Machine Learning API version is `2021-03-01-preview`. Set the API version as a variable to accommodate future versions:

```bash
API_VERSION="2021-03-01-preview"
```

### Compute

Running machine learning jobs requires compute resources. You can list your workspace's compute resources:

```bash
curl "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/computes?api-version=$API_VERSION" \
--header "Authorization: Bearer $TOKEN"
```

For this example, we use an existing compute cluster named `cpu-cluster`. We set the compute name as a variable for encapsulation:

```bash
COMPUTE_NAME="cpu-cluster"
```

> [!TIP]
> You can [create or overwrite a named compute resource with a PUT request](./how-to-manage-rest.md#create-and-modify-resources-using-put-and-post-requests). 

### Environment 

The LightGBM example needs to run in a LightGBM environment. Create the environment with a PUT request. Use a docker image from Microsoft Container Registry.

You can configure the docker image with `Docker` and add conda dependencies with `condaFile`: 

:::code language="rest" source="~/azureml-examples-main/cli/train-rest.sh" id="create_environment":::

### Datastore

The training job needs to run on data, so you need to specify a datastore. In this example, you get the default datastore and Azure Storage account for your workspace. Query your workspace with a GET request to return a JSON file with the information.

You can use the tool [jq](https://stedolan.github.io/jq/) to parse the JSON result and get the required values. You can also use the Azure portal to find the same information.

```bash
response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/datastores?api-version=$API_VERSION&isDefault=true" \
--header "Authorization: Bearer $TOKEN")

AZURE_STORAGE_ACCOUNT=$(echo $response | jq '.value[0].properties.contents.accountName')
AZUREML_DEFAULT_DATASTORE=$(echo $response | jq '.value[0].name')
AZUREML_DEFAULT_CONTAINER=$(echo $response | jq '.value[0].properties.contents.containerName')
AZURE_STORAGE_KEY=$(az storage account keys list --account-name $AZURE_STORAGE_ACCOUNT | jq '.[0].value')
```

### Data

Now that you have the datastore, you can create a dataset. For this example, use the common dataset `iris.csv` and point to it in the `path`. 

:::code language="rest" source="~/azureml-examples-main/cli/train-rest.sh" id="create_data":::

### Code

Now that you have the dataset and datastore, you can upload the training script that will run on the job. Use the Azure Storage CLI to upload a blob into your default container. You can also use other methods to upload, such as the Azure portal or Azure Storage Explorer.


```bash
az storage blob upload-batch -d $AZUREML_DEFAULT_CONTAINER/src \
 -s jobs/train/lightgbm/iris/src --account-name $AZURE_STORAGE_ACCOUNT --account-key $AZURE_STORAGE_KEY
```

Once you upload your code, you can specify your code with a PUT request and refer to the datastore with `datastoreId`. 

:::code language="rest" source="~/azureml-examples-main/cli/train-rest.sh" id="create_code":::

## Submit a training job

Now that your assets are in place, you can run the LightGBM job, which outputs a trained model and metadata. You need the following information to configure the training job: 

- **run_id**: [Optional] The name of the job, which must be unique across all jobs. Unless a name is specified either in the YAML file via the `name` field or the command line via `--name/-n`, a GUID/UUID is automatically generated and used for the name.
- **jobType**: The job type. For a basic training job, use `Command`.
- **codeId**: The path to your training script.
- **command**: The command to execute. Input data can be written into the command and can be referred to with data binding. 
- **environmentId**: The path to your environment.
- **inputDataBindings**: Data binding can help you reference input data. Create an environment variable and the name of the binding will be added to AZURE_ML_INPUT_, which you can refer to in `command`. To create a data binding, you need to add the path to the data you created as `dataId`. 
- **experimentName**: [Optional] Tags the job to help you organize jobs in Azure Machine Learning studio. Each job's run record is organized under the corresponding experiment in the studio "Experiment" tab. If omitted, tags default to the name of the working directory when the job is created.
- **compute**: The `target` specifies the compute target, which can be the path to your compute. `instanceCount` specifies the number of instances you need for the job.

Use the following commands to submit the training job:

:::code language="rest" source="~/azureml-examples-main/cli/train-rest.sh" id="create_job":::

## Submit a hyperparameter sweep job

Azure Machine Learning also lets you efficiently tune training hyperparameters. You can create a hyperparameter tuning suite, with the REST APIs. For more information on Azure Machine Learning's hyperparameter tuning options, see [Hyperparameter tuning a model](how-to-tune-hyperparameters.md). Specify the hyperparameter tuning parameters to configure the sweep:

- **jobType**: The job type. For a sweep job, it will be `Sweep`. 
- **algorithm**: The sampling algorithm - "random" is often a good place to start. See the sweep job [schema](https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json) for the enumeration of options. 
- **trial**: The command job configuration for each trial to be run. 
- **objective**: The `primaryMetric` is the optimization metric, which must match the name of a metric logged from the training code. The `goal` specifies the direction (minimize or maximize). See the [schema](https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json) for the full enumeration of options. 
- **searchSpace**: A dictionary of the hyperparameters to sweep over. The key is a name for the hyperparameter, for example, `learning_rate`. The value is the hyperparameter distribution. See the [schema](https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json) for the enumeration of options.
- **maxTotalTrials**: The maximum number of individual trials to run.
- **maxConcurrentTrials**: [Optional] The maximum number of trials to run concurrently on your compute cluster.
- **timeout**: [Optional] The maximum number of minutes to run the sweep job for.

To create a sweep job with the same LightGBM example, use the following commands: 

:::code language="rest" source="~/azureml-examples-main/cli/train-rest.sh" id="create_a_sweep_job":::

## Next steps

Now that you have a trained model, learn [how to deploy your model](how-to-deploy-and-where.md).
