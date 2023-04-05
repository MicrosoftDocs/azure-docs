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
ms.custom: 
---

# How to create a batch endpoint to perform batch scoring with pre-processing

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

# Batch scoring with pre-processing

In the example [Operationalize a training routine with Batch Endpoints](../training-with-components/) you learnt how to deploy a training routine under a Batch Deployment to perform the training of a Machine Learning model. On that training routine, you saw a preprocessing step used to do feature engineering of the input data.

In this example, you will learn how to operationalize an scoring routine that runs the resulting model to perform predictions over tabular data for the UCI Heart Disease Data Set. Particularly, this example will show you how you can reuse preprocessing code along with parameters learnt during the preprocesing before running your model.

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

## 2. Registering the model and transformations

### 2.1 About the model

This example shows how you deploy an inference pipeline that performs pre and post processing before and after a model is executed to perform inference. The model is registered in the model registry and some of the transformations are also registered as they are fitted to the data. Those assets may came from a training job we introduced in the sample [Operationalize a training routine with Batch Endpoints](../training-with-components/):


```python
from IPython.display import Image
Image(filename="docs/batch-scoring-train-job.png", width=800) 
```




    
![png](output_9_0.png)
    



### 2.2 Registering the model in the workspace


```python
model_name = "heart-classifier"
transformation_name = "heart-classifier-transforms"
model_local_path = "model"
transformation_local_path = "transformations"
```

Let's verify if the model is registered in the workspace. If not, we will create it from a local copy in this repository. If you are wondering how this model was trained, this is the resulting model of the tutorial [Operationalize a training routine with Batch Endpoints](../training-with-components/).


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

The model registered before was not trained directly over the input data, but some data preprocessing was done before. Among the multiple transformations, data normalization was perform to ensure predictors are in the range [-1, 1] and they are centered. Those parameters were captured in a Scikit-Learn transformation we can also register in the registry to ensure we can also apply it to new data:


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

## 3 Create the pipeline component

### 3.1 Load the components


```python
prepare_data = load_component(source="../../components/prepare/prepare.yml")
score_data = load_component(source="../../components/score/score.yml")
```

### 3.2 Construct the pipeline


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

The pipeline looks as follows:


```python
from IPython.display import Image
Image(filename="docs/batch-scoring-with-preprocessing.png", width=800) 
```




    
![png](output_24_0.png)
    



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
