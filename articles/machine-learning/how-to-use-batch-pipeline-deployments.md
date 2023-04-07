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
ms.date: 04/03/2023
reviewer: msakande
ms.reviewer: mopeakande
ms.custom: how-to, devplatv2, event-tier1-build-2023
---

# How to deploy pipelines with batch endpoints

[!INCLUDE [ml v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to create a batch deployment that contains a pipeline component. The component consists of a simple command job that prints "hello world!", and it requires no inputs or outputs.

You'll learn to:

> [!div class="checklist"]
> * Create a pipeline component
> * Create a batch endpoint with a deployment to host the component
> * Test the deployment

## About this example

The example in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, first clone the repo. Then, change directories to `cli/endpoints/batch` if you're using the Azure CLI or `sdk/endpoints/batch` if you're using the Python SDK.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch
```

### Follow along in Jupyter notebooks

<!-- update notebook name and link -->
You can follow along with this example in the following notebook. In the cloned repository, open the notebook: [NAME.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/mnist-batch.ipynb).

## Prerequisites

# [Azure CLI](#tab/azure-cli)

<!-- Update this... -->
[!INCLUDE [basic cli prereqs](../../includes/machine-learning-cli-prereqs.md)]

# [Python](#tab/python)

Update this...

---

## Connect to the Azure Machine Learning workspace

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which the job will be run.

# [Azure CLI](#tab/azure-cli)

Enter your subscription ID, resource group name, workspace name, and location in the following code:

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/python)

### Import the required libraries

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

### Configure workspace details and get a handle to the workspace

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

## Create the pipeline component

The pipeline component only prints a "hello world" message in the logs. It doesn't require any inputs or outputs. We'll deploy this component under a batch endpoint later.

# [Azure CLI](#tab/azure-cli)

Register the component:

```azurecli
az ml component create -f hello-component/hello.yml
```

# [Python](#tab/python)

Load the component:

```python
hello_batch = load_component(source="hello-component/hello.yml")
```

---

## Create a batch endpoint

Batch endpoints receive pointers to data and run jobs asynchronously to process the data on compute clusters. Batch endpoints store outputs to a data store for further analysis.

# [Azure CLI](#tab/azure-cli)

To create a batch endpoint, we'll use the `BatchEndpoint` class. This class allows a user to configure the following key aspects of the endpoint:
- `name` - Name of the endpoint. It needs to be unique at the Azure region level.
- `auth_mode` - The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported.
- `properties.ComponentDeployment.Enabled` - Set this property to `True` to use component deployments in Batch Endpoints.

### Configure the endpoint

First, let's create the endpoint that is going to host the batch deployments. Remember that each endpoint can host multiple deployments at any time.

The `endpoint.yml` file contains the endpoint's configuration.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/batchEndpoint.schema.json
name: hello-batch
description: A hello world endpoint for component deployments
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
ENDPOINT_NAME="hello-batch-$ENDPOINT_SUFIX"
```

Now create the endpoint:

```azurecli
az ml batch-endpoint create --name $ENDPOINT_NAME -f endpoint.yml
```

You can query the endpoint URI as follows:

```azurecli
az ml batch-endpoint show -name $ENDPOINT_NAME
```

# [Python](#tab/python)

To create a batch endpoint, we'll use the `BatchEndpoint` class. This class allows a user to configure the following key aspects of the endpoint:
- `name` - Name of the endpoint. It needs to be unique at the Azure region level.
- `auth_mode` - The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based (`aad_token`) authentication is supported.
- `defaults` - Default settings for the endpoint.
   - `deployment_name` - Name of the deployment that will serve as the default deployment for the endpoint.
- `description`- Description of the endpoint.

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
endpoint_name = "hello-batch-" + endpoint_suffix

print(f"Endpoint name: {endpoint_name}")
```

Configure the batch endpoint:

```python
endpoint = BatchEndpoint(
    name=endpoint_name,
    description="A hello world endpoint for component deployments",
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

### Create a compute cluster

Batch endpoints and deployments run on compute clusters. They can run on any Azure Machine Learning compute cluster that already exists in the workspace. Therefore, multiple batch deployments can share the same compute infrastructure. In this example, we'll work on an Azure Machine Learning compute cluster called `batch-cluster`. Let's verify that the compute exists on the workspace or create it otherwise.

# [Azure CLI](#tab/azure-cli)

```azurecli
az ml compute create -n batch-cluster --type amlcompute --min-instances 0 --max-instances 5
```

# [Python](#tab/python)

```python
compute_name = "batch-cluster"
if not any(filter(lambda m: m.name == compute_name, ml_client.compute.list())):
    print(f"Compute {compute_name} is not created. Creating...")
    compute_cluster = AmlCompute(
        name=compute_name, description="amlcompute", min_instances=0, max_instances=5
    )
    ml_client.begin_create_or_update(compute_cluster)
```

The compute may take time to be created. Let's wait for it:

```python
from time import sleep

print(f"Waiting for compute {compute_name}", end="")
while ml_client.compute.get(name=compute_name).provisioning_state == "Creating":
    sleep(1)
    print(".", end="")

print(" [DONE]")
```

---

### Configure the deployment

# [Azure CLI](#tab/azure-cli)

The `deployment.yml` file contains the deployment's configuration.

```yml
$schema: http://azureml/sdk-2-0/BatchDeployment.json
name: hello-batch-dpl
description: A hello world deployment with a single step.
endpoint: hello-batch
compute: azureml:batch-cluster
type: component
job_definition:
    type: pipeline
    component: azureml:hello-component@latest
```

# [Python](#tab/python)

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

---

### Create the deployment

# [Azure CLI](#tab/azure-cli)

Run the following code to create a batch deployment under the batch endpoint and set it as the default deployment.

```azurecli
az ml batch-deployment create --endpoint $ENDPOINT_NAME -f deployment.yml --set-default
```

> [!TIP]
> Notice the use of the `--set-default` flag to indicate that this new deployment is now the default.

# [Python](#tab/python)

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

### Test the deployment

Once the deployment is created, it's ready to receive jobs.

# [Azure CLI](#tab/azure-cli)

Invoke the default deployment:

```azurecli
JOB_NAME = $(az ml batch-endpoint invoke -n $ENDPOINT_NAME | jq -r ".name")
```

You can monitor the progress of the show and stream the logs using:

```azurecli
az ml job stream --name $JOB_NAME
```

# [Python](#tab/python)

Invoke the deployment:

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name, 
    deployment_name=deployment.name, 
)
```

You can monitor the job in Azure Machine Learning studio:

```python
ml_client.jobs.get(name=job.name)
```

To wait for the job to finish, run the following code:

```python
print(f"Waiting for batch deployment job {job.name}", end="")
while ml_client.jobs.get(name=job.name).status not in ["Completed", "Failed"]:
    sleep(10)
    print(".", end="")

print(f" [STATUS={ml_client.jobs.get(name=job.name).status}]")
```

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

## Next steps

- [Use batch model deployments for batch scoring](how-to-use-batch-model-deployments.md)
- [How to deploy a training pipeline with batch endpoints](how-to-use-batch-training-pipeline.md)
- [How to create a batch endpoint to perform batch scoring with pre-processing](how-to-use-batch-scoring-pipeline.md)
- [Create batch endpoints from pipeline jobs](how-to-use-batch-pipeline-from-job.md)
- [Accessing data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md)
- [Authentication on batch endpoints](how-to-authenticate-batch-endpoint.md)
- [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
- [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)
