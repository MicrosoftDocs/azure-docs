---
title: "Operationalize a scoring pipeline on batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to operationalize a pipeline that performs batch scoring with preprocessing.
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

# How to deploy a pipeline to perform batch scoring with preprocessing

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

# Batch scoring with pre-processing

In this article, you'll learn how to deploy a scoring pipeline under a batch endpoint. The pipeline includes an XGBoost classification model and reuses a data preprocessing component that was created earlier while training the model.

The model will perform predictions on tabular data from the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). In particular, this example will show you how to reuse preprocessing code and the parameters learned during preprocesing before you use your model for inferencing. By reusing the preprocessing code and the learned parameters, we can ensure that the same transformations (such as normalization and feature encoding) that were applied to the input data during training are also applied during inferencing.

You'll learn to:

> [!div class="checklist"]
> * Create a pipeline that reuses existing components from the workspace
> * Test the pipeline
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

## Create the environment and compute cluster

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

---

## Register the required assets

This example shows how you deploy an inference pipeline that performs preprocessing (before) and postprocessing (after) a model is executed to perform inference. The model is registered in the model registry and some of the transformations are also registered as they're fitted to the data. These assets (model and transformations) are the same ones from the training job (training component) of the pipeline in the [Operationalize a training routine with Batch Endpoints](how-to-use-batch-training-pipeline.md#configure-the-pipeline) article.

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-scoring-pipeline/pipeline-with-transform-and-training-components.png" alt-text="Pipeline showing the preprocessing and training components" lightbox="media/how-to-use-batch-scoring-pipeline/pipeline-with-transform-and-training-components.png":::

# [Azure CLI](#tab/azure-cli)

### Register the model and transformations in the workspace

Register the model:

```azurecli
az ml model create --name heart-classifier --type mlflow_model --path model
```

Register the transformation:

```azurecli
az ml model create --name heart-classifier-transforms --type custom_model --path transformations
```

### Register the components

To achieve reusability, we'll reuse components from training the model as described in the [Operationalize a training routine with Batch Endpoints](how-to-use-batch-training-pipeline.md#configure-the-pipeline) article. Hence, instead of referencing components using YAML, we'll reference them from the workspace. We'll also register another component to run inference.

Register the prepare component:

```azurecli
az ml component create -f ../../components/prepare/prepare.yml
```

Now this component can be referenced from the workspace. For example: `azureml:uci_heart_prepare@latest` will get the last version of the prepare component.

# [Python](#tab/python)

```python
model_name = "heart-classifier"
transformation_name = "heart-classifier-transforms"
model_local_path = "model"
transformation_local_path = "transformations"
```

<!-- add link below -->
Let's verify that the model is registered in the workspace. If it's not registered, we'll create it from a local copy in the repository [UPDATE with link]. Recall that this model is the resulting model from the [How to deploy a training pipeline with batch endpoints](how-to-use-batch-training-pipeline.md) article.

```python
if not any(filter(lambda m: m.name == model_name, ml_client.models.list())):
    print(f"Model {model_name} is not registered. Creating...")
    model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
    )
```

```python
model = ml_client.models.get(name=model_name, label="latest")
```

The model registered before was not trained directly on the input data. Instead, data preprocessing (transformation) was done on the input data before training. Among the  transformations, data normalization was performed to ensure predictors were centered and in the range [-1, 1]. The transformation parameters were captured in a scikit-learn transformation that we can also register in the registry so that we can apply the same transformation to new data:

```python
if not any(filter(lambda m: m.name == transformation_name, ml_client.models.list())):
    print(f"Model {transformation_name} is not registered. Creating...")
    model = ml_client.models.create_or_update(
        Model(name=transformation_name, path=transformation_local_path, type=AssetTypes.CUSTOM_MODEL)
    )
```

```python
transformations = ml_client.models.get(name=transformation_name, label="latest")
```

---

## Create the pipeline

# [Azure CLI](#tab/azure-cli)

### Configure the pipeline

The pipeline has two components (steps):

1. `preprocess_job`: This step reads the input data and returns the prepared data and the applied transformations. The step receives two inputs:
    - `data`: a folder containing the input data to score
    - `transformations`: (optional) the path to the transformations that will be applied. When provided, the transformations are read from the model that is indicated. However, if this value isn't provided, then the transformations will be learned from the input data. When performing inference, you can't learn the transformation parameters (in this example, the normalization coefficients) from the input data because you need to use exactly the same parameters from training. Since this input is optional, the `preprocess_job` component can be used for both training and serving.
1. `score_job`: This step will perform inference on the transformed data using the input model. Notice that the component uses an MLflow model to perform inference. Finally, the scores are wrritten back in the same format as they were read.

The pipeline is configured in the following `pipeline.yml` file:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineComponent.schema.json
type: pipeline

name: batch_scoring_uci_heart
display_name: Batch Scoring for UCI heart
description: This pipeline demostrates how to make batch inference using a model from the Heart Disease Data Set problem, where pre and post processing is required as steps. The pre and post processing steps can be components reusable from the training pipeline.

inputs:
  input_data:
    type: uri_folder
  score_mode:
    type: string
    default: append

outputs: 
  scores:
    type: uri_folder
    mode: upload

jobs:
  preprocess_job:
    type: command
    component: azureml:uci_heart_prepare@latest
    inputs:
      data: ${{parent.inputs.input_data}}
      transformations: 
        path: azureml:heart-classifier-transforms@latest
        type: custom_model
    outputs:
      prepared_data:
  
  score_job:
    type: command
    component: ./../../components/score/score.yml
    inputs:
      data: ${{parent.jobs.preprocess_job.outputs.prepared_data}}
      model:
        path: azureml:heart-classifier@latest
        type: mlflow_model
      score_mode: ${{parent.inputs.score_mode}}
    outputs:
      scores: 
        mode: upload
        path: ${{parent.outputs.scores}}
```

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-scoring-pipeline/pipeline-for-batch-scoring-with-preprocessing.png" alt-text="Pipeline showing batch scoring with preprocessing." lightbox="media/how-to-use-batch-scoring-pipeline/pipeline-for-batch-scoring-with-preprocessing.png":::

# [Python](#tab/python)

### Load the pipeline components

The pipeline has two components (steps):

1. **preprocessing component**: This step reads the input data and returns the prepared data and the applied transformations. The step receives two inputs:
    - `data`: a folder containing the input data to score
    - `transformations`: (optional) the path to the transformations that will be applied. When provided, the transformations are read from the model that is indicated. However, if this value isn't provided, then the transformations will be learned from the input data. When performing inference, you can't learn the transformation parameters (in this example, the normalization coefficients) from the input data because you need to use exactly the same parameters from training. Since this input is optional, the `preprocess_job` component can be used for both training and serving.
1. **scoring component**: This step will perform inference on the transformed data using the input model. Notice that the component uses an MLflow model to perform inference. Finally, the scores are wrritten back in the same format as they were read.

```python
prepare_data = load_component(source="../../components/prepare/prepare.yml")
score_data = load_component(source="../../components/score/score.yml")
```

### Construct the pipeline

```python
@pipeline()
def uci_heart_classifier_scorer(input_data: Input(type=AssetTypes.URI_FOLDER), score_mode: str):
    """This pipeline demonstrates how to make batch inference using a model from the Heart Disease Data Set problem, where pre and post processing is required as steps. The pre and post processing steps can be components reusable from the training pipeline."""
    prepared_data = prepare_data(
        data=input_data, 
        transformations=Input(
            type=AssetTypes.CUSTOM_MODEL, 
            path=transformations.id
        )
    )
    scored_data = score_data(
        data=prepared_data.outputs.prepared_data,
        model=Input(
            type=AssetTypes.MLFLOW_MODEL,
            path=model.id
        ), 
        score_mode=score_mode
    )

    return {
        "scores": scored_data.outputs.scores
    }
```

A visualization of the pipeline is as follows:

:::image type="content" source="media/how-to-use-batch-scoring-pipeline/pipeline-for-batch-scoring-with-preprocessing.png" alt-text="Pipeline showing batch scoring with preprocessing." lightbox="media/how-to-use-batch-scoring-pipeline/pipeline-for-batch-scoring-with-preprocessing.png":::

<!-- --------------------------------- -->

### Test the pipeline



### 3.4 Test the pipeline first

Let's test the pipeline with same sample data. To do that, let's create a pipeline job:


```python
pipeline_job = uci_heart_classifier_scorer(
    input_data=Input(type="uri_folder", path="data/unlabeled/"),
    score_mode="append"
)
```

Configure the pipeline defaults


```python
# set pipeline level compute
pipeline_job.settings.default_compute = "batch-cluster"
# set pipeline level datastore
pipeline_job.settings.default_datastore = "workspaceblobstore"
```

Finally, let's run the job:


```python
pipeline_job_run = ml_client.jobs.create_or_update(
    pipeline_job, experiment_name="uci-heart-score-pipeline"
)
pipeline_job_run
```

### 3.5 Create the pipeline component to include in the deployment

Pipeline components are reusable compute graphs that can be included in Batch Deployments or to compose more complex pipelines.


```python
pipeline_component = uci_heart_classifier_scorer._pipeline_builder.build()
```

## 4 Create Batch Endpoint

Batch endpoints receive pointers to data and run jobs asynchronously to process the data on compute clusters. Batch endpoints store outputs to a data store for further analysis.

To create an batch endpoint we will use `BatchEndpoint`. This class allows user to configure the following key aspects:
- `name` - Name of the endpoint. Needs to be unique at the Azure region level
- `auth_mode` - The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported. 
- `defaults` - Default settings for the endpoint.
   - `deployment_name` - Name of the deployment that will serve as the default deployment for the endpoint.
- `description`- Description of the endpoint.

### 4.1 Configure the endpoint

First, let's create the endpoint that is going to host the batch deployments. Remember that each endpoint can host multiple deployments at any time. To ensure that our endpoint name is unique, let's create a random suffix to append to it.

> In general, you won't need to use this technique but you will use more meaningful names. Please skip the following cell if your case:


```python
import random
import string

# Creating a unique endpoint name by including a random suffix
allowed_chars = string.ascii_lowercase + string.digits
endpoint_suffix = "".join(random.choice(allowed_chars) for x in range(5))
endpoint_name = "uci-classifier-score-" + endpoint_suffix

print(f"Endpoint name: {endpoint_name}")
```


```python
endpoint = BatchEndpoint(
    name=endpoint_name,
    description="Batch scoring endpoint of the Heart Disease Data Set prediction task",
    properties={
        "ComponentDeployment.Enabled": True
    }
)
```

### 4.2 Create the endpoint
Using the `MLClient` created earlier, we will now create the Endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.


```python
ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
```

## 5. Create a batch deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. We will create a deployment for our endpoint using the `BatchDeployment` class.

### 4.1 Creating the compute

Batch deployments can run on any Azure ML compute that already exists in the workspace. That means that multiple batch deployments can share the same compute infrastructure. In this example, we are going to work on an AzureML compute cluster called `batch-cluster`. Let's verify the compute exists on the workspace or create it otherwise.


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

 ### 4.2 Configuring the deployment


```python
deployment = BatchDeployment(
    name="uci-classifier-prepros-xgb",
    description="A sample deployment with pre and post processing done before and after inference.",
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

### 4.3 Create the deployment
Using the `MLClient` created earlier, we will now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.


```python
ml_client.batch_deployments.begin_create_or_update(deployment).result()
```

Once created, let's configure this new deployment as the default one:


```python
endpoint = ml_client.batch_endpoints.get(endpoint.name)
endpoint.defaults.deployment_name = deployment.name
ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
```

### 5.4 Testing the deployment

Once the deployment is created, it is ready to recieve jobs.

#### 5.4.1 Creating inputs


```python
input_data = Input(type=AssetTypes.URI_FOLDER, path="data/unlabeled/")
```

> __Tip__: To learn more about how to indicate inputs please visit [Accessing data from batch endpoints jobs](https://learn.microsoft.com/en-us/azure/machine-learning/batch-inference/how-to-access-data-batch-endpoints-jobs?tabs=cli).

#### 4.4.2 Invoke the deployment

Using the `MLClient` created earlier, we will get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:
- `name` - Name of the endpoint
- `input_path` - Path where input data is present
- `deployment_name` - Name of the specific deployment to test in an endpoint


```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name, 
    deployment_name=deployment.name, 
    inputs = { 
        'input_data': input_data,
        'score_mode': Input(type="string", default="append")
        }
)
```

You can monitor the job in Azure ML studio:


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

#### 5.4.3 Accessing results

We can get access to the outputs of the job as follows:


```python
pipeline_job_steps = list(ml_client.jobs.list(parent_job_name=job.name))
score_step = pipeline_job_steps[1]
```

Download the outputs of the scoring step:


```python
ml_client.jobs.download(name=score_step.name, download_path=".", output_name="scores")
```

Let's read the scored data:


```python
import pandas as pd
import glob

output_files = glob.glob("named-outputs/scores/*.csv")
score = pd.concat((pd.read_csv(f) for f in output_files))
score
```

## 5. Clean un resources

Once done, delete the associated resources from the workspace:


```python
ml_client.batch_endpoints.begin_delete(endpoint.name).result()
```
