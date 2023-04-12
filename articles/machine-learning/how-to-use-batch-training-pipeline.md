---
title: "Operationalize a training pipeline on batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a training pipeline under a batch endpoint.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 03/29/2023
reviewer: msakande
ms.reviewer: mopeakande
ms.custom: how-to, devplatv2, event-tier1-build-2023
---

# How to deploy a training pipeline with batch endpoints

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to deploy a training pipeline under a batch endpoint. The pipeline uses multiple components (or steps) that include model training, data preprocessing, and model evaluation.

The model training component will use tabular data from the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease) to train an XGBoost model. During training, the data preprocessing component will perform data transformations, and finally, the model evaluation component will be used for inferencing.


You'll learn to:

> [!div class="checklist"]
> * Create and test a pipeline
> * Deploy the pipeline to an endpoint
> * Test the deployment
> * Modify a component in the pipeline and create a new pipeline deployment
> * Test the new deployment and set it as the default deployment

## Prerequisites

# [Azure CLI](#tab/azure-cli)

<!-- Update this... -->
[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

# [Python](#tab/python)

[!INCLUDE [basic prereqs sdk](../../includes/machine-learning-sdk-v2-prereqs.md)]

---

## Prepare your system

# [Azure CLI](#tab/azure-cli)

### Connect to the Azure Machine Learning workspace

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which the job will be run.

If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription ID, resource group name, workspace name, and location multiple times, run this code:

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

### Clone the examples repository

The example in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, first clone the repo. Then, go to the repository's `cli/endpoints/batch` directory:

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository. This reduces the time to complete the operation.

<!-- update links and paths -->
The commands in this tutorial are in the file `UPDATE _NAME.sh` in the `cli` directory, and the YAML configuration files are in the `cli/endpoints/batch/` subdirectory.

# [Python](#tab/python)

### Clone the examples repository

The example in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, first clone the repo. Then, go to the repository's `sdk/endpoints/batch` directory:

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/sdk/endpoints/batch
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository. This reduces the time to complete the operation.

<!-- update notebook name and link -->
You can follow along with this example in the notebook: [NAME.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/mnist-batch.ipynb). It contains the same content as this article, although the order of the codes is slightly different.

### Connect to the Azure Machine Learning workspace

1. Import the required libraries:

    ```python
    from time import sleep
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import (
        BatchEndpoint,
        BatchDeployment,
        Model,
        AmlCompute,
        Data,
        Environment,
    )
    from azure.ai.ml.dsl import pipeline
    from azure.ai.ml.entities._deployment.job_definition import JobDefinition
    from azure.ai.ml import load_component
    from azure.ai.ml.constants import AssetTypes
    from azure.identity import DefaultAzureCredential
    ```

1. Configure workspace details and get a handle to the workspace:

    To connect to a workspace, we need identifier parameters that include a subscription, resource group, and workspace name. We'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. We use the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential) for this tutorial.
    <!-- Check the [configuration notebook](../../jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace. -->
    
    To configure your workspace details, enter your subscription ID, resource group name, and workspace name in the following code:

    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    ```
    
    Get a handle to the workspace:
    
    ```python
    ml_client = MLClient(
        DefaultAzureCredential(), subscription_id, resource_group, workspace
    )
    ```

---

## Register the required assets

In this section, we'll begin by creating an environment that includes necessary libraries to train the model. We'll then create a compute cluster on which the batch deployment will run, and finally, we'll register the input data as a data asset.

# [Azure CLI](#tab/azure-cli)

### Create the environment

The components in this example will use an environment with the `XGBoost` and `scikit-learn` libraries. Create the environment by running this code:

```azurecli
az ml environment create -f ../../environment/xgboost-sklearn-py38.yml
```

### Create a compute cluster

Batch endpoints and deployments run on compute clusters. They can run on any Azure Machine Learning compute cluster that already exists in the workspace. This means that multiple batch deployments can share the same compute infrastructure. In this example, we'll work on an Azure Machine Learning compute cluster called `batch-cluster`. Let's verify that the compute exists on the workspace or create it otherwise.

```azurecli
az ml compute create -n batch-cluster --type amlcompute --min-instances 0 --max-instances 5
```

### Register the input data as a data asset

In this example, the training routine will consume data from a data asset. We're going to register the training dataset in the `heart.csv` file as a data asset in your workspace.

```azurecli
az ml data create --name heart-classifier-train --type uri_folder --path data/train
```

Once created, we'll get a reference to the data asset's ID:

```azurecli
DATASET_ID=$(az ml data show --name heart-classifier-train --version 1 | jq -r ".id")
```

# [Python](#tab/python)

### Create the environment

The components in this example will use an environment with the `XGBoost` and `scikit-learn` libraries. Create the environment by running this code:

```python
environment = Environment(
    name="xgboost-sklearn-py38",
    description="An environment for models built with XGBoost and Scikit-learn.",
    image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest",
    conda_file="../../environment/conda.yml"
)
```

```python
ml_client.environments.create_or_update(environment)
```

### Create a compute cluster

Batch endpoints and deployments run on compute clusters. They can run on any Azure Machine Learning compute cluster that already exists in the workspace. This means that multiple batch deployments can share the same compute infrastructure. In this example, we'll work on an Azure Machine Learning compute cluster called `batch-cluster`. Let's verify that the compute exists on the workspace or create it otherwise.

```python
compute_name = "batch-cluster"
if not any(filter(lambda m: m.name == compute_name, ml_client.compute.list())):
    print(f"Compute {compute_name} is not created. Creating...")
    compute_cluster = AmlCompute(
        name=compute_name, description="amlcompute", min_instances=0, max_instances=5
    )
    ml_client.begin_create_or_update(compute_cluster)
```

Compute may take time to be created. Let's wait for it:

```python
from time import sleep

print(f"Waiting for compute {compute_name}", end="")
while ml_client.compute.get(name=compute_name).provisioning_state == "Creating":
    sleep(1)
    print(".", end="")

print(" [DONE]")
```

### Register the input data as a data asset

In this example, the training routine will consume data from a data asset. We're going to register the training dataset in the `heart.csv` file as a data asset in your workspace.

```python
data_path = "data/train"
dataset_name = "heart-dataset-train"

heart_dataset_train = Data(
    path=data_path,
    type=AssetTypes.URI_FOLDER,
    description="A training dataset for heart classification",
    name=dataset_name,
)
```

```python
ml_client.data.create_or_update(heart_dataset_train)
```

Let's get a reference to the new data asset:

```python
print(f"Waiting for data asset {dataset_name}", end="")
while not any(filter(lambda m: m.name == dataset_name, ml_client.data.list())):
    sleep(10)
    print(".", end="")

print(" [DONE]")
```

```python
heart_dataset_train = ml_client.data.get(name=dataset_name, label="latest")
```

---

## Create the pipeline

# [Azure CLI](#tab/azure-cli)

### Configure the pipeline

The pipeline we want to operationalize has two components (steps):

1. `preprocess_job`: This step reads the input data and returns the prepared data and the applied transformations. The step receives three inputs:
    - `data`: a folder containing the input data to transform and score
    - `transformations`: (optional) the path to the transformations that will be applied, if available. If the path isn't provided, then the transformations will be learned from the input data. Since this input is optional, the `preprocess_job` component can be used for both training and serving.
    - `categorical_encoding`: the encoding strategy for the categorical features (`ordinal` or `onehot`).
1. `train_job`: This step will train an XGBoost model based on the prepared data and return the evaluation results and the trained model.

The pipeline is configured in the following `pipeline.yml` file:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineComponent.schema.json
type: pipeline

name: uci-heart-train-pipeline
display_name: uci-heart-train
description: This pipeline demonstrates how to make train a machine learning classifier over the UCI heart dataset.

inputs:
  input_data:
    type: uri_folder

outputs: 
  model:
    type: mlflow_model
    mode: upload
  evaluation_results:
    type: uri_folder
    mode: upload
  prepare_transformations:
    type: uri_folder
    mode: upload

jobs:
  preprocess_job:
    type: command
    component: ./../../components/prepare/prepare.yml
    inputs:
      data: ${{parent.inputs.input_data}}
      categorical_encoding: ordinal
    outputs:
      prepared_data:
      transformations_output: ${{parent.outputs.prepare_transformations}}
  
  train_job:
    type: command
    component: ./../../components/train_xgb/train_xgb.yml
    inputs:
      data: ${{parent.jobs.preprocess_job.outputs.prepared_data}}
      target_column: target
      register_best_model: false
      eval_size: 0.3
    outputs:
      model: 
        mode: upload
        type: mlflow_model
        path: ${{parent.outputs.model}}
      evaluation_results:
        mode: upload
        type: uri_folder
        path: ${{parent.outputs.evaluation_results}}
```

> [!NOTE]
> In the `pipeline.yml` file, the `transformations` input is missing; therefore, the script will learn the parameters from the input data.

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-training-pipeline/pipeline-with-transform-and-training-components.png" alt-text="Pipeline showing the preprocessing and training components." lightbox="media/how-to-use-batch-training-pipeline/pipeline-with-transform-and-training-components.png":::

### Test the pipeline

Let's test the pipeline with some sample data. To do that, we'll create a job using the pipeline and the `batch-cluster` compute cluster created previously.

The job is described in the following `pipeline-job.yml` file:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline

experiment_name: uci-heart-train-pipeline
display_name: uci-heart-train
description: This pipeline demonstrates how to make train a machine learning classifier over the UCI heart dataset.

compute: batch-cluster
component: pipeline-ordinal.yml
inputs:
  input_data:
    type: uri_folder
outputs: 
  model:
    type: mlflow_model
    mode: upload
  evaluation_results:
    type: uri_folder
    mode: upload
  prepare_transformations:
    mode: upload
```

Create the test job:

```bash
az ml job create -f pipeline-job.yml --set inputs.input_data.path=azureml:heart-classifier@latest
```

# [Python](#tab/python)

### Load the pipeline components

The pipeline we want to operationalize has two components (steps): a preprocessing step and a training step.

1. **preprocessing component**: This step reads the input data and returns the prepared data and the transformations parameters used. The step receives three inputs:
    - `data`: a folder containing the input data to transform and score
    - `transformations`: (optional) the path to the transformations that will be applied, if available. If the path isn't provided, then the transformations will be learned from the input data. Since this input is optional, the `preprocess_job` component can be used for both training and serving.
    - `categorical_encoding`: the encoding strategy for the categorical features (`ordinal` or `onehot`).
1. **training component**: This step will train an XGBoost model based on the prepared data and return the evaluation results and the trained model.

The pipeline components are configured in the `prepare.yml` and `train_xgb.yml` files. Load the components:

```python
prepare_data = load_component(source="../../components/prepare/prepare.yml")
train_xgb = load_component(source="../../components/train_xgb/train_xgb.yml")
```

### Construct the pipeline

```python
@pipeline()
def uci_heart_classifier_trainer(input_data: Input(type=AssetTypes.URI_FOLDER)):
    prepared_data = prepare_data(data=input_data)
    trained_model = train_xgb(
        data=prepared_data.outputs.prepared_data, 
        target_column="target",
        register_best_model=False,
        eval_size=0.3)

    return {
        "model": trained_model.outputs.model,
        "evaluation_results": trained_model.outputs.evaluation_results,
        "transformations_output": prepared_data.outputs.transformations_output,
    }
```

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-training-pipeline/pipeline-with-transform-and-training-components.png" alt-text="Pipeline showing the preprocessing and training components." lightbox="media/how-to-use-batch-training-pipeline/pipeline-with-transform-and-training-components.png":::

### Test the pipeline

Let's test the pipeline with some sample data. To do that, let's create a pipeline job:

```python
pipeline_job = uci_heart_classifier_trainer(
    Input(type="uri_folder", path=heart_dataset_train.id)
)
```

Now, we'll configure some run settings to run the test:

```python
# set pipeline level datastore
pipeline_job.settings.default_datastore = "workspaceblobstore"
pipeline_job.settings.default_compute = "batch-cluster"
```

Finally, let's run the job:

```python
pipeline_job_run = ml_client.jobs.create_or_update(
    pipeline_job, 
    experiment_name="uci-heart-train-pipeline"
)
pipeline_job_run
```

### Create the pipeline component to include in the deployment

First, we're going to compile the pipeline we created in the previous step:

```python
from mldesigner._compile._compile import compile

compile(uci_heart_classifier_trainer, debug=True)
```

Once compiled, we can create a pipeline component from it. Pipeline components are reusable compute graphs that can be included in batch deployments or used to compose more complex pipelines.

```python
pipeline_component = uci_heart_classifier_trainer._pipeline_builder.build()
```

---

## Create a batch endpoint

Batch endpoints receive pointers to data and run jobs asynchronously to process the data on compute clusters. Batch endpoints store outputs to a data store for further analysis.

# [Azure CLI](#tab/azure-cli)

To create a batch endpoint, we'll use the `BatchEndpoint` class. This class allows a user to configure the following key aspects of the endpoint:
- `name`: Name of the endpoint. It needs to be unique at the Azure region level.
- `auth_mode`: The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported.
- `properties.ComponentDeployment.Enabled`: Set this property to `True` to use component deployments in batch endpoints.

### Configure the endpoint

First, let's create the endpoint that is going to host the batch deployments. Remember that each endpoint can host multiple deployments at any time.

The `endpoint.yml` file contains the endpoint's configuration.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/batchEndpoint.schema.json
name: uci-classifier-train
description: An endpoint to perform training of the Heart Disease Data Set prediction task
auth_mode: aad_token
properties:
  ComponentDeployment.Enabled: True
```

### Create the endpoint

A batch endpoint's name needs to be unique in each region since the name is used to construct the invocation URI. To ensure uniqueness, we'll append a random suffix to the endpoint's name in this tutorial.

> [!TIP]
> In practice, you won't need to use this technique to name an endpoint but will use a more meaningful name.

Let's configure the name:

```azurecli
ENDPOINT_SUFIX=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w ${1:-5} | head -n 1)
ENDPOINT_NAME="uci-classifier-train-$ENDPOINT_SUFIX"
```

Now create the endpoint:

```azurecli
az ml batch-endpoint create --name $ENDPOINT_NAME -f endpoint.yml
```

You can query the endpoint URI as follows:

```azurecli
az ml batch-endpoint show --name $ENDPOINT_NAME --query scoring_uri
```

# [Python](#tab/python)

To create a batch endpoint, we'll use the `BatchEndpoint` class. This class allows a user to configure the following key aspects of the endpoint:
- `name`: Name of the endpoint. It needs to be unique at the Azure region level.
- `auth_mode`: The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported.
- `defaults`: Default settings for the endpoint.
   - `deployment_name`: Name of the deployment that will serve as the default deployment for the endpoint.
- `description`: Description of the endpoint.

### Configure the endpoint

We'll create the endpoint that is going to host the batch deployments. Remember that each endpoint can host multiple deployments at any time.

First, we'll configure the endpoint's name. A batch endpoint's name needs to be unique in each region since the name is used to construct the invocation URI. To ensure uniqueness, we'll append a random suffix to the endpoint's name in this tutorial.

> [!TIP]
> In practice, you won't need to use this technique to name an endpoint but will use a more meaningful name.

```python
import random
import string

# Creating a unique endpoint name by including a random suffix
allowed_chars = string.ascii_lowercase + string.digits
endpoint_suffix = "".join(random.choice(allowed_chars) for x in range(5))
endpoint_name = "uci-classifier-train-" + endpoint_suffix

print(f"Endpoint name: {endpoint_name}")
```

Configure the batch endpoint:

```python
endpoint = BatchEndpoint(
    name=endpoint_name,
    description="An endpoint to perform training of the Heart Disease Data Set prediction task",
    properties={
        "ComponentDeployment.Enabled": True
    }
)
```

### Create the endpoint

Using the `MLClient` created earlier, we'll now create the endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.

```python
ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
```

---

## Create a batch deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. We'll create a deployment for our endpoint using the `BatchDeployment` class.

# [Azure CLI](#tab/azure-cli)

### Configure the deployment

The batch deployment will run on the `batch-cluster` compute cluster that was created earlier in the [Create a compute cluster](#create-a-compute-cluster) section.

The `deployment-ordinal.yml` file contains the deployment's configuration.

```yaml
$schema: http://azureml/sdk-2-0/BatchDeployment.json
name: uci-classifier-train-xgb
description: A sample deployment that trains an XGBoost model for the UCI dataset.
endpoint_name: uci-classifier-train
compute: azureml:batch-cluster
type: component
job_definition:
   type: pipeline
   component: ./pipeline-ordinal.yml
   settings:
       continue_on_step_failure: false
```

### Create the deployment

Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.

```azurecli
az ml batch-deployment create --endpoint $ENDPOINT_NAME -f deployment-ordinal.yml --set-default
```

> [!TIP]
> Notice the use of the `--set-default` flag to indicate that this new deployment is now the default.

# [Python](#tab/python)

### Configure the deployment

The batch deployment will run on the `batch-cluster` compute cluster that was created earlier in the [Create a compute cluster](#create-a-compute-cluster-1) section. Let's configure the deployment:

```python
deployment = BatchDeployment(
    name="uci-classifier-train-xgb",
    description="A sample deployment that trains an XGBoost model for the UCI dataset.",
    endpoint_name=endpoint.name,
    compute=compute_name,
    job_definition=JobDefinition(
        type="pipeline",
        component=pipeline_component,
        settings={
            "continue_on_step_failure": False
        }
    ),
)
```

### Create the deployment
Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

```python
ml_client.batch_deployments.begin_create_or_update(deployment).result()
```

Once created, let's configure this new deployment as the default one:

```python
endpoint = ml_client.batch_endpoints.get(endpoint.name)
endpoint.defaults.deployment_name = deployment.name
ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
```

---

## Test the deployment

Once the deployment is created, it's ready to receive jobs. In this section, we'll create the input data, create a job to invoke the deployment, and access the job output.

# [Azure CLI](#tab/azure-cli)

### Create input data

The input data asset definition is contained in the `inputs.yml` file:

```yaml
inputs:
  input_data:
    type: uri_folder
    path: azureml:heart-classifier-train@latest
```

> [!TIP]
> To learn more about how to indicate inputs, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md).

### Invoke the deployment

Invoke the default deployment:

```azurecli
JOB_NAME = $(az ml batch-endpoint invoke -n $ENDPOINT_NAME --f inputs.yml | jq -r ".name")
```

You can monitor the progress of the show and stream the logs using:

```azurecli
az ml job stream --name $JOB_NAME
```

### Access job output

Once the job is completed, we can access some of its outputs. This pipeline produces the following outputs:
- `preprocess job`: outputs `transformations_output`
- `train job`: outputs `model` and `evaluation_results`

To read the outputs of the preprocess job:

```azurecli
PREPARE_JOB=$(az ml job list --parent-job-name $JOB_NAME | jq -r ".[0].name")
```

You can download the associated results using `az ml job download`.

```azurecli
az ml job download --name $PREPARE_JOB --output-name transformations_output
```

To read the outputs of the train job:

```azurecli
TRAIN_JOB=$(az ml job list --parent-job-name $JOB_NAME | jq -r ".[1].name")
```

You can download the associated results using `az ml job download`.

```azurecli
az ml job download --name $TRAIN_JOB --output-name model
az ml job download --name $TRAIN_JOB --output-name evaluation_results
```

# [Python](#tab/python)

### Create input data

Create the data asset:

```python
input_data = Input(type=AssetTypes.URI_FOLDER, path=heart_dataset_train.id)
```

> [!TIP]
> To learn more about how to indicate inputs, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md).

### Invoke the deployment

Using the `MLClient` created earlier, we'll get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:

- `name`: name of the endpoint
- `input_path`: path where input data is present
- `deployment_name`: name of the specific deployment to test in an endpoint

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name, 
    deployment_name=deployment.name, 
    inputs = { 
        "input_data": input_data
        }
)
```

You can monitor the job in Azure Machine Learning studio:

```python
ml_client.jobs.get(name=job.name)
```

We can wait for the job to finish by:

```python
print(f"Waiting for batch deployment job {job.name}", end="")
while ml_client.jobs.get(name=job.name).status not in ["Completed", "Failed"]:
    sleep(10)
    print(".", end="")

print(f" [STATUS={ml_client.jobs.get(name=job.name).status}]")
```

### Access job output

We can access the outputs of the job as follows:

```python
pipeline_job_steps = list(ml_client.jobs.list(parent_job_name=job.name))
preprocess_job = pipeline_job_steps[0]
train_job = pipeline_job_steps[1]
```

Download the outputs of the data preparation step (preprocessing component):

```python
ml_client.jobs.download(name=preprocess_job.name, download_path=".", output_name="transformations_output")
```

Download the outputs of the training step:

```python
ml_client.jobs.download(name=train_job.name, download_path=".", output_name="model")
ml_client.jobs.download(name=train_job.name, download_path=".", output_name="evaluation_results")
```

---

## Create a new deployment in the endpoint

Endpoints can host multiple deployments at once, while keeping only one deployment as the default. This allows you to iterate over your different models, deploy the different models to your endpoint and test them, and finally, switch the default deployment to the model deployment that works best for you.

Let's change the way preprocessing is done in the pipeline to see if we get a model that performs better.

# [Azure CLI](#tab/azure-cli)

### Change a parameter in the pipeline's preprocessing component

The preprocessing component has a parameter called `categorical_encoding` which can have values `ordinal` or `onehot`. These values correspond to two different ways of encoding categorical features. 

- `ordinal`: Encodes the feature values with numeric values (ordinal) from `[1:n]`, where `n` is the number of categories in the feature. Ordinal encoding implies that there is a natural rank order among the feature categories.
- `onehot`: Doesn't imply an ordinal relationship but introduces a dimensionality problem if the number of categories is large. 
 
By default, we used `ordinal` previously. Let's now change the categorical encoding to use `onehot` and see how the model performs.

The pipeline component has the following modification: `categorical_encoding: onehot`.

```yaml
jobs:
  preprocess_job:
    type: command
    compute: azureml:batch-cluster
    component: ./../../components/prepare/prepare.yml
    inputs:
      data: ${{parent.inputs.input_data}}
      categorical_encoding: onehot
    outputs:
      prepared_data:
      transformations_output: ${{parent.outputs.prepare_transformations}}
```

> [!TIP]
> As an alternative, we could have exposed the `categorial_encoding` as an input in the pipeline job itself, rather than changing it in the specific step. Such an alternative is completely valid but will expose the existence of the parameter as an input to your clients. In this case, we want to hide and control the parameter inside of the deployment by taking advantage of having multiple deployments under the same endpoint.

### Configure the deployment

The `deployment-onehot.yml` file contains the modified deployment's configuration.

```yaml
$schema: http://azureml/sdk-2-0/BatchDeployment.json
name: uci-classifier-train-onehot
description: A sample deployment that trains an XGBoost model for the UCI dataset using One hot encoding for variables.
endpoint_name: uci-classifier-train
compute: azureml:batch-cluster
type: component
job_definition:
    type: pipeline
    component: ./pipeline-onehot.yml
    settings:
        continue_on_step_failure: false
```

### Create the deployment

Run the following code to create a new batch deployment under the batch endpoint. Don't set the `--set-default` flag to default, as we want to test out the deployment first.

```azurecli
az ml batch-deployment create --endpoint $ENDPOINT_NAME -f deployment-onehot.yml
```

### Test a non-default deployment

Once the deployment is created, it is ready to receive jobs. The input data asset definition is contained in the `inputs.yml` file:

```yaml
inputs:
  input_data:
    type: uri_folder
    path: azureml:heart-classifier-train@latest
```

### Invoke the deployment

Invoke the deployment as follows, specifying the `-d uci-classifier-train-onehot` parameter to trigger the specific deployment `uci-classifier-train-onehot`:

```azurecli
JOB_NAME = $(az ml batch-endpoint invoke -n $ENDPOINT_NAME -d uci-classifier-train-onehot --f inputs.yml | jq -r ".name")
```

### Configure the new deployment as the default one

Once we're satisfied with the performance of the new deployment, we can set this new one as the default:

```azurecli
az ml batch-endpoint update -n $ENDPOINT_NAME --set defaults.deployment_name=uci-classifier-train-onehot
```

### Delete the old deployment

Once you're done, you can delete the old deployment if you don't need it anymore:

```azurecli
az ml batch-deployment delete --name uci-classifier-train-xgb --endpoint-name $ENDPOINT_NAME --yes
```

# [Python](#tab/python)

Update...

---

## Clean up resources

Once you're done, delete the associated resources from the workspace:

# [Azure CLI](#tab/azure-cli)

Run the following code to delete the batch endpoint and its underlying deployment. `--yes` is used to confirm the deletion.

```azurecli
az ml batch-endpoint delete --name $ENDPOINT_NAME --yes
```

# [Python](#tab/python)

Delete the endpoint:

```python
ml_client.batch_endpoints.begin_delete(endpoint.name).result()
```

(Optional) Delete compute, unless you plan to reuse your compute cluster with later deployments.

```python
ml_client.compute.begin_delete(name=compute_name)
```

---

## Next steps

- [How to deploy a pipeline to perform batch scoring with preprocessing](how-to-use-batch-scoring-pipeline.md)
- [Create batch endpoints from pipeline jobs](how-to-use-batch-pipeline-from-job.md)
- [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md)
- [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)