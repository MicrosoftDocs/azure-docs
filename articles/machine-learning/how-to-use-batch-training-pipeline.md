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
ms.custom: 
---

# How to deploy a training pipeline with batch endpoints

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

# Operationalize a training routine with Batch Endpoints

In this example, you will learn how to operationalize a pipeline under a Component Deployment that performs training of a model over tabular data for the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). It will also generate data transformations that were learnt during training.

## Prerequisites

Enable preview features:


```python
import os
from azure.ai.ml.constants._common import AZUREML_PRIVATE_FEATURES_ENV_VAR
os.environ[AZUREML_PRIVATE_FEATURES_ENV_VAR] = "true"
```

## 1. Connect to Azure Machine Learning Workspace

The [workspace](https://docs.microsoft.com/en-us/azure/machine-learning/concept-workspace) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section we will connect to the workspace in which the job will be run.

### 1.1. Import the required libraries


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

### 1.2. Configure workspace details and get a handle to the workspace

To connect to a workspace, we need identifier parameters - a subscription, resource group and workspace name. We will use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. We use the default [default azure authentication](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) for this tutorial. Check the [configuration notebook](../../jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace.


```python
subscription_id = "<subscription>"
resource_group = "<resource-group>"
workspace = "<workspace>"
```


```python
ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace
)
```

## 2. Registering the required assets

### 2.1 Environments

The components in these examples will use an environment with `XGBoost` and `Scikit-Learn` libraries. Ensure the environment is created by:


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

### 2.2 Data assets

In this example, the training routine will consume data from a data asset. We are going to register the data set from local CSV files that are available in this repo:


```python
data_path = "data/train"
dataset_name = "heart-dataset-train"

heart_dataset_train = Data(
    path=data_path,
    type=AssetTypes.URI_FOLDER,
    description="An training dataset for heart classification",
    name=dataset_name,
)
```


```python
ml_client.data.create_or_update(heart_dataset_train)
```

Let's get a reference of the new data asset:


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

## 3 Create the pipeline component

### 3.1 Load the components


```python
prepare_data = load_component(source="../../components/prepare/prepare.yml")
train_xgb = load_component(source="../../components/train_xgb/train_xgb.yml")
```

### 3.2 Construct the pipeline


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

The pipeline looks as follows:


```python
from IPython.display import Image
Image(filename="docs/training-with-components.png") 
```

### 3.4 Test the pipeline first

Let's test the pipeline with same sample data. To do that, let's create a pipeline job:


```python
pipeline_job = uci_heart_classifier_trainer(
    Input(type="uri_folder", path=heart_dataset_train.id)
)
```

Now, we are going to configure some run settings to run the test:


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

### 3.5 Create the pipeline component to include in the deployment

First, we are going to compile the pipeline we created in the previous step:


```python
from mldesigner._compile._compile import compile

compile(uci_heart_classifier_trainer, debug=True)
```

Once compiled, we can create a pipeline component from it. Pipeline components are reusable compute graphs that can be included in Batch Deployments or to compose more complex pipelines.


```python
pipeline_component = uci_heart_classifier_trainer._pipeline_builder.build()
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
endpoint_name = "uci-classifier-train-" + endpoint_suffix

print(f"Endpoint name: {endpoint_name}")
```


```python
endpoint = BatchEndpoint(
    name=endpoint_name,
    description="An endpoint to perform training of the Heart Disease Data Set prediction task",
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

### 5.1 Creating the compute

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

 ### 5.2 Configuring the deployment


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

### 5.3 Create the deployment
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

Once the deployment is created, it is ready to receive jobs.

#### 5.4.1 Creating an input


```python
input_data = Input(type=AssetTypes.URI_FOLDER, path=heart_dataset_train.id)
```

> __Tip__: To learn more about how to indicate inputs please visit [Accessing data from batch endpoints jobs](https://learn.microsoft.com/en-us/azure/machine-learning/batch-inference/how-to-access-data-batch-endpoints-jobs?tabs=cli).

#### 5.4.2 Invoke the deployment

Using the `MLClient` created earlier, we will get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:
- `name` - Name of the endpoint
- `input_path` - Path where input data is present
- `deployment_name` - Name of the specific deployment to test in an endpoint


```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name, 
    deployment_name=deployment.name, 
    inputs = { 
        "input_data": input_data
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
preprocess_job = pipeline_job_steps[0]
train_job = pipeline_job_steps[1]
```

Download the outputs of the data preparation step:


```python
ml_client.jobs.download(name=preprocess_job.name, download_path=".", output_name="transformations_output")
```

Download the outputs of the training step:


```python
ml_client.jobs.download(name=train_job.name, download_path=".", output_name="model")
ml_client.jobs.download(name=train_job.name, download_path=".", output_name="evaluation_results")
```

## 5. Clean un resources

Once done, delete the associated resources from the workspace:


```python
ml_client.batch_endpoints.begin_delete(endpoint.name).result()
```
