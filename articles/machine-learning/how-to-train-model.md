---
title: Train ML models
titleSuffix: Azure Machine Learning
description: Configure and submit Azure Machine Learning jobs to train your models using the SDK, CLI, etc.
services: machine-learning
author: balapv
ms.author: balapv
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 08/25/2022
ms.topic: how-to
ms.custom: sdkv2
---

# Train models with Azure Machine Learning

[!INCLUDE [sdk v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning provides multiple ways to submit ML training jobs. In this article, you'll learn how to submit jobs using the following methods:

* Azure CLI extension for machine learning: The `ml` extension, also referred to as CLI v2.
* Python SDK v2 for Azure Machine Learning.
* REST API: The API that the CLI and SDK are built on.

> [!IMPORTANT]
> SDK v2 is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An Azure Machine Learning workspace. If you don't have one, you can use the steps in the [Quickstart: Create Azure ML resources](quickstart-create-resources.md) article.

# [Python SDK](#tab/python)

To use the __SDK__ information, install the Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).

# [Azure CLI](#tab/azurecli)

To use the __CLI__ information, install the [Azure CLI and extension for machine learning](how-to-configure-cli.md).

# [REST API](#tab/restapi)

To use the __REST API__ information, you need the following items:

- A __service principal__ in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal __authentication token__. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The __curl__ utility. The curl program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. 

    > [!TIP]
    > In PowerShell, `curl` is an alias for `Invoke-WebRequest` and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`.
    >
    > While it is possible to call the REST API from PowerShell, the examples in this article assume you are using Bash.

---

### Clone the examples repository

The code snippets in this article are based on examples in the [Azure ML examples GitHub repo](https://github.com/azure/azureml-examples). To clone the repository to your development environment, use the following command:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

## Example job

The example machine learning training job used in this article is [TBD]. You can use the following steps to run it locally on your development environment before using it with Azure ML.

[TBD]

## Train in the cloud



### 1. Connect to the workspace

# [Python SDK](#tab/python)

To connect to the workspace, you need identifier parameters - a subscription, resource group, and workspace name. You'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. To authenticate, you use the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true). Check this [example](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace.

```python
#import required libraries
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

#Enter details of your AzureML workspace
subscription_id = '<SUBSCRIPTION_ID>'
resource_group = '<RESOURCE_GROUP>'
workspace = '<AZUREML_WORKSPACE_NAME>'

#connect to the workspace
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
```

# [Azure CLI](#tab/azurecli)

When using the Azure CLI, you need identifier parameters - a subscription, resource group, and workspace name. While you can specify these parameters for each command, you can also set defaults that will be used for all the commands. Use the following commands to set default values. Replace `<subscription ID>`, `<AzureML workspace name>`, and `<resource group>` with the values for your configuration:

```azurecli
az account set --subscription <subscription ID>
az configure --defaults workspace=<AzureML workspace name> group=<resource group>
```

# [REST API](#tab/restapi)

The REST API examples in this article use `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, `$LOCATION`, `$WORKSPACE`, and `$TOKEN` as placeholders. Replace the placeholders with your own values as follows:

* `$SUBSCRIPTION_ID`: Your Azure subscription ID.
* `$RESOURCE_GROUP`: The Azure resource group that contains your workspace.
* `$LOCATION`: The Azure region where your workspace is located.
* `$WORKSPACE`: The name of your Azure Machine Learning workspace.
* `$COMPUTE_NAME`: The name of your Azure Machine Learning compute cluster.

### Get a token

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). You can retrieve a token with the following command. The token is stored in the `$TOKEN` environment variable:

```azurecli
TOKEN=$(az account get-access-token --query accessToken -o tsv)
```

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. Set the API version as a variable to accommodate future versions:

:::code language="rest-api" source="~/azureml-examples-main/cli/deploy-rest.sh" id="api_version":::

<!-- ### Get the default datastores

When training using the REST API, you must upload the training data and training files to a storage account. The following commands get the default storage account and default container for your workspace. These values are stored in the `$AZUREML_DEFAULT_DATASTORE` and `$AZUREML_DEFAULT_CONTAINER` environment variables:

```azurecli
response=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/datastores?api-version=$API_VERSION&isDefault=true" \
--header "Authorization: Bearer $TOKEN")

# <get_storage_details>
AZUREML_DEFAULT_DATASTORE=$(echo $response | jq -r '.value[0].name')
AZUREML_DEFAULT_CONTAINER=$(echo $response | jq -r '.value[0].properties.containerName')
AZURE_STORAGE_ACCOUNT=$(echo $response | jq -r '.value[0].properties.accountName')
``` -->

---

### 2. Create a compute resource for training

To train in the cloud, an AzureML compute cluster is used to run the training job. In the following examples, a compute cluster named `cpu-compute` is created.

# [Python SDK](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/configuration.ipynb?name=create-cpu-compute)]

# [Azure CLI](#tab/azurecli)

```azurecli
az ml compute create -n cpu-cluster --type amlcompute --min-instances 0 --max-instances 4
```

# [REST API](#tab/restapi)

The following example creates a new compute cluster:

```bash
curl -X PUT \
  "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/computes/$COMPUTE_NAME?api-version=$API_VERSION" \
  -H "Authorization:Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "'$LOCATION'",
    "properties": {
        "computeType": "AmlCompute",
        "properties": {
            "vmSize": "Standard_D2_V2",
            "vmPriority": "Dedicated",
            "scaleSettings": {
                "maxNodeCount": 4,
                "minNodeCount": 0,
                "nodeIdleTimeBeforeScaleDown": "PT30M"
            }
        }
    }
}'
```

> [!TIP]
> It can take a few minutes for the cluster creation to finish.

You must also specify the training environment to load when running the training script. The following example loads the contents of a conda file into an environment variable:

ENV_VERSION=$RANDOM
curl --location --request PUT "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/environments/lightgbm-environment/versions/$ENV_VERSION?api-version=$API_VERSION" \
--header "Authorization: Bearer $TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
    \"properties\":{
        \"condaFile\": \"$CONDA_FILE\",
        \"image\": \"mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04\"
    }
}"

---

<!-- ### 3. Configure the training data

There are multiple potential storage options for your training data in the cloud. Azure Machine Learning uses _datastores_ as an abstraction over the underlying storage type. In this step, you'll create a datastore that is backed by the default Azure Storage Account used by your workspace:

# [Python SDK](#tab/python)

[TBD]

# [Azure CLI](#tab/azurecli)

[TBD]

# [REST API](#tab/restapi)

[TBD]

--- -->

### 4. Submit the training job

# [Python SDK](#tab/python)

To run this script, you'll use a `command`. The command will be run by submitting it as a `job` to Azure ML. 

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=create-command)]

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb?name=run-command)]

In the above, you configured:
- `code` - path where the code to run the command is located
- `command` -  command that needs to be run
- `inputs` - dictionary of inputs using name value pairs to the command. The key is a name for the input within the context of the job and the value is the input value. Inputs are referenced in the `command` using the `${{inputs.<input_name>}}` expression. To use files or folders as inputs, you can use the `Input` class.

For more details, refer to the [reference documentation](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command).

When you submit the job, a URL is returned to the job status in the AzureML studio. Use this to view the job progress. You can also use `returned_job.status` to check the current status of the job.

# [Azure CLI](#tab/azurecli)

The `az ml job create` command used in this example requires a YAML job definition file. The contents of the file used in this example are:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job.yml":::

To submit the job, use the following command. The run ID (name) of the training job is stored in the `$run_id` variable:

```azurecli
run_id=$(az ml job create -f jobs/single-step/scikit-learn/iris/job.yml --query name -o tsv)
```

You can use the stored run ID to return information about the job. The `--web` parameter opens the AzureML studio web UI where you can drill into details on the job:

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="hello_world_show":::

# [REST API](#tab/restapi)

As part of job submission, the training scripts and data must be uploaded to a cloud storage location that your AzureML workspace can access.

> [!IMPORTANT]
> We do not cover the Blob Service REST API in this example. For information on using the Blob REST API to upload files, see the [Put Blob](/rest/api/storageservices/put-blob) reference. 


```bash
DATA_VERSION=$RANDOM
curl --location --request PUT "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/data/iris-data/versions/$DATA_VERSION?api-version=$API_VERSION" \
--header "Authorization: Bearer $TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
  \"properties\": {
    \"description\": \"Iris dataset\",
    \"dataType\": \"uri_file\",
    \"dataUri\": \"https://azuremlexamples.blob.core.windows.net/datasets/iris.csv\"
  }
}"
```

The following example registers the training script for use with a job:

```bash
TRAIN_CODE=$(curl --location --request PUT "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/codes/train-lightgbm/versions/1?api-version=$API_VERSION" \
--header "Authorization: Bearer $TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
  \"properties\": {
    \"description\": \"Train code\",
    \"codeUri\": \"https://azuremlexamples.blob.core.windows.net/testjob\"
  }
}" | jq -r '.id')
```

The following example gets the latest version of the `` curated environment. This environment is used to build the Docker container that the compute cluster uses to run the training job:

```bash
ENVIRONMENT=$(curl --location --request GET "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/environments/AzureML-lightgbm-3.2-ubuntu18.04-py37-cpu/versions?api-version=$API_VERSION" --header "Authorization: Bearer $TOKEN" | jq -r .value[0].id)
```

The following example creates the job:

```bash
run_id=$(uuidgen)
curl --location --request PUT "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/jobs/$run_id?api-version=$API_VERSION" \
--header "Authorization: Bearer $TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
    \"properties\": {
        \"jobType\": \"Command\",
        \"codeId\": \"$TRAIN_CODE\",
        \"command\": \"python main.py --iris-csv \$AZURE_ML_INPUT_iris\",
        \"environmentId\": \"$ENVIRONMENT\",
        \"inputs\": {
            \"iris\": {
                \"jobInputType\": \"uri_file\",
                \"uri\": \"https://azuremlexamples.blob.core.windows.net/datasets/iris.csv\"
            }
        },
        \"experimentName\": \"lightgbm-iris\",
        \"computeId\": \"/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/computes/$COMPUTE_NAME\"
    }
}"
```

---



## Register the model

The following examples demonstrate how to register a model in your AzureML workspace.

# [Python SDK](#tab/python)

Note that the `name` of the job is used as part of the path to the model created by the training job.

```python
from azure.ai.ml.entities import Model
from azure.ai.ml.constants import ModelType

run_model = Model(
    path="azureml://jobs/{}/outputs/artifacts/paths/model/".format(returned_job.name),
    name="run-model-example",
    description="Model created from run.",
    type=ModelType.MLFLOW
)

ml_client.models.create_or_update(run_model)
```

# [Azure CLI](#tab/azurecli)

:::code language="azurecli" source="~/azureml-examples-main/cli/train.sh" id="sklearn_download_register_model":::

# [REST API](#tab/restapi)

---

## Next steps

Now that you have a trained model, learn [how to deploy it](how-to-deploy-managed-online-endpoint.md).

