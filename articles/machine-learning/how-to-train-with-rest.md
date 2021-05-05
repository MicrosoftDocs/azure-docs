---
title: 'Train models with REST'
description: Learn how to train models and create jobs with REST.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: wenxwei
ms.author: wenxwei
ms.date: 05/25/2021
ms.reviewer: peterlu
---

# Train models with REST

Learn how to use the Azure Machine Learning REST API to create and manage training jobs.

The REST API uses standard HTTP verbs to create, retrieve, update, and delete resources. The REST API works with any language or tool that can make HTTP requests. REST's straightforward structure often makes it a good choice in scripting environments and for MLOps automation.

In this article, you learn how to use the new REST APIs to:

> [!div class="checklist"]
> * Create machine learning assets
> * Create a basic training job 
> * Create a hyperparameter tuning sweep job

## Prerequisites

- An **Azure subscription** for which you have administrative rights. If you don't have such a subscription, try the [free or paid personal subscription](https://aka.ms/AMLFree).
- An [Azure Machine Learning workspace](how-to-manage-workspace.md).
- A service principal in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal authentication token. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The **curl** utility. The **curl** program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. 

## Azure Machine Learning jobs
A job is a resource that specifies all aspects of a computation job. It aggregates 3 things:

- What to run?
- How to run it?
- Where to run it?

There are many ways to submit an Azure Machine Learning job including the SDK, CLI, and visually with the studio. The following examples show you how to submit a LightGBM training job on the Iris dataset with the Azure Machine Learning REST API.

## Create machine learning assets

You first need to set up your Azure Machine Learning assets to configure your job.

In the following REST API calls, we use `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, `$LOCATION`,`$WORKSPACE`as placeholders. You must replace the placeholders with your own values. 

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). Substitute `$TOKEN` with your own value. You can retrieve this token with the following command:

```bash
TOKEN=$(az account get-access-token --query accessToken -o tsv)
```

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. The current Azure Machine Learning API version is `2021-03-01-preview`. Set the API version as a variable for future encapsulation:

```bash
API_VERSION="2021-03-01-preview"
```

### Compute

Running machine learning jobs requires compute resources. You can list your workspace compute resources:

```bash
curl "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/computes?api-version=$API_VERSION \
--header "Authorization: Bearer $TOKEN"
```

For this example, we will use an existing compute cluster named `cpu-cluster`. Set the compute name as a variable for encapsulation:

```bash
COMPUTE_NAME="cpu-cluster"
```

> [!TIP]
> You can [create or overwrite a named compute resource with a PUT request](./how-to-manage-rest.md#create-and-modify-resources-using-put-and-post-requests). 

### Environment 

The LightGBM example needs to run in a LightGBM environment. Create the environment with a PUT request. Use a docker image from Microsoft Container Registry. You can configure the docker image with `Docker` and add conda dependencies with `condaFile`. 

:::code language="rest" source="~/azureml-examples-cli-preview/cli/how-to-train-rest.sh" id="create_environment":::

### Datastore

The training job needs to run on some specific data. In order to set up the data to use, let's first get some information about the default Datastore and Azure Storage account to house the data. You are going to query your account for the default Datastore.

You can get the values associated with your workspace with a GET request. This will return a JSON file. You can use the tool [jq](.https://stedolan.github.io/jq/) to parse the JSON result and get the required values. Or, you can get the values with your own way, such as with the Azure Portal.

```bash
response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/datastores?api-version=$API_VERSION&isDefault=true" \
--header "Authorization: Bearer $TOKEN")

AZURE_STORAGE_ACCOUNT=$(echo $response | jq '.value[0].properties.contents.accountName')
AZUREML_DEFAULT_DATASTORE=$(echo $response | jq '.value[0].name')
AZUREML_DEFAULT_CONTAINER=$(echo $response | jq '.value[0].properties.contents.containerName')
AZURE_STORAGE_KEY=$(az storage account keys list --account-name $AZURE_STORAGE_ACCOUNT | jq '.[0].value')

```

You can then use these values to get the information about the default Datastore with a PUT request. 

:::code language="rest" source="~/azureml-examples-cli-preview/cli/how-to-train-rest.sh" id="createdatastore":::

### Data

Now that you have the datastore, you can create a data with a dataset. For this example, we will use an open dataset `iris.csv` and point to it in the `path`. 

:::code language="rest" source="~/azureml-examples-cli-preview/cli/how-to-train-rest.sh" id="create-data":::

### Code

Now that you have the data created, let's create a code. You want to train a LightGBM model and you have your training script. In order to create a code, you should upload the code to the datastore first: 

```bash
az storage blob upload-batch -d $AZUREML_DEFAULT_CONTAINER/src \
 -s jobs/train/lightgbm/iris/src --account-name $AZURE_STORAGE_ACCOUNT --account-key $AZURE_STORAGE_KEY
```

Once you have your code uploaded, you can create a code with a PUT request and refer to the datastore with `datastoreId`. 

:::code language="rest" source="~/azureml-examples-cli-preview/cli/how-to-train-rest.sh" id="create-code":::

## Basic Python training job

With the machine learning assets created, you can run the basic LightGBM job which outputs a model and accompanying metadata. Let's review the information we need to set up to configure a training job: 

- **run_id**: [Optional] The name of the job, which must be unique across all jobs. Unless a name is specified either in the YAML file via the `name` field or the command line via `--name/-n`, a GUID/UUID is automatically generated and used for the name.
- **jobType**: The job type. For a basic training job, it will be `Command`.
- **codeId**: The path to the training code you have created.
- **command**: The command to execute. Input data can be written into the command and can be referred to with data binding. 
- **environmentId**: The path to the environment you have created. 
- **inputDataBindings**: Data binding can help you reference the input data. You can create an environment variable and the name of the binding will be added to AZURE_ML_INPUT_, which you can refer to in the `command`. To create a data binding, you will need to add the path to the data you have created as `dataId`. 
- **experimentName**: [Optional] Tags the job for better organization in the Azure Machine Learning studio. Each job's run record will be organized under the corresponding experiment in the studio's "Experiment" tab. If omitted, it will default to the name of the working directory when the job is created.
- **compute**: The `target` specifies the compute target you would like to run on, which can be the path to the compute you have created.  The `instanceCount` specifies the number of instances you need for the job.

To create the LightGBM training job:

:::code language="rest" source="~/azureml-examples-cli-preview/cli/how-to-train-rest.sh" id="create-job":::


## Sweep hyperparameters

Azure Machine Learning also enables you to more efficiently tune the hyperparameters for your machine learning models. You can create a hyperparameter tuning job, called a sweep job, via the REST APIs. For more information on Azure Machine Learning's hyperparameter tuning offering, see the [Hyperparameters tuning a model](how-to-tune-hyperparameters.md). You will need to specify the hyperparameter tuning parameters in order to sweep your job:

- **jobType**: The job type. For a sweep job, it will be `Sweep`. 
- **algorithm**: The sampling algorithm - "random" is often a good choice. See the sweep job [schema](https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json) for the enumeration of options. 
- **trial**: The command job configuration for each trial to be run. 
- **objective**: The `primaryMetric` is the optimization metric, which must match the name of a metric logged from the training code. The `goal` specifies the direction ("minimize"/"maximize"). See the schema for the full enumeration of options. 
- **searchSpace**: A dictionary of the hyperparameters to sweep over. The key is a name for the hyperparameter, for example, `learning_rate`. The value is the hyperparameter distribution. See the schema for the enumeration of options.
- **maxTotalTrials**: The maximum number of individual trials to run.
- **maxConcurrentTrials**: [Optional] The maximum number of trials to run concurrently on your compute cluster.
- **timeout**: [Optional] The maximum number of minutes to run the sweep job for.

With these parameters, a sweep job can be specified for sweeping across hyperparameters used in the command. To create a sweep job with the same LightGBM example: 

:::code language="rest" source="~/azureml-examples-cli-preview/cli/how-to-train-rest.sh" id="create-a-sweep-job":::

## Next steps
- Deploy models with REST