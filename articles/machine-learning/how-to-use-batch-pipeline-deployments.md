---
title: "Deploy pipelines with batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to create a batch deploy a pipeline component and invoke it.
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

# Hello Batch

In this examples, you will learn how to deploy a simple hello world component under component deployment and invoke it. No inputs or outputs are indicated and the component consists of a simple command job. Use this examples before moving on.

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
    AmlCompute,
    CodeConfiguration,
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

## 2 Create the pipeline component

### 2.1 Load the components


```python
hello_batch = load_component(source="hello-component/hello.yml")
```

## 3 Create Batch Endpoint

Batch endpoints receive pointers to data and run jobs asynchronously to process the data on compute clusters. Batch endpoints store outputs to a data store for further analysis.

To create an batch endpoint we will use `BatchEndpoint`. This class allows user to configure the following key aspects:
- `name` - Name of the endpoint. Needs to be unique at the Azure region level
- `auth_mode` - The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported. 
- `defaults` - Default settings for the endpoint.
   - `deployment_name` - Name of the deployment that will serve as the default deployment for the endpoint.
- `description`- Description of the endpoint.

### 3.1 Configure the endpoint

First, let's create the endpoint that is going to host the batch deployments. Remember that each endpoint can host multiple deployments at any time.


```python
import random
import string

# Creating a unique endpoint name by including a random suffix
allowed_chars = string.ascii_lowercase + string.digits
endpoint_suffix = "".join(random.choice(allowed_chars) for x in range(5))
endpoint_name = "hello-batch-" + endpoint_suffix

print(f"Endpoint name: {endpoint_name}")
```


```python
endpoint = BatchEndpoint(
    name=endpoint_name,
    description="A hello world endpoint for component deployments",
    properties={
        "ComponentDeployment.Enabled": True
    }
)
```

### 3.2 Create the endpoint
Using the `MLClient` created earlier, we will now create the Endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.


```python
ml_client.batch_endpoints.begin_create_or_update(endpoint).result()
```

## 4. Create a batch deployment

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
    name="hello-batch-dpl",
    description="A hello world deployment with a single step.",
    endpoint_name=endpoint.name,
    compute=compute_name,
    job_definition=JobDefinition(
        type="pipeline",
        component=hello_batch,
        settings={
            "continue_on_step_failure": False
        }
    )
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

### 4.4 Testing the deployment

Once the deployment is created, it is ready to receive jobs.


```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name, 
    deployment_name=deployment.name, 
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

## 5. Clean un resources

Once done, delete the associated resources from the workspace:


```python
ml_client.batch_endpoints.begin_delete(endpoint.name).result()
```
