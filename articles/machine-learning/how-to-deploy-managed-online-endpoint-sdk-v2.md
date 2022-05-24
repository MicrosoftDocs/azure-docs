---
title: Deploy machine learning models to managed online endpoint using Python SDK v2 (preview).
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model to Azure using Python SDK v2 (preview).
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: ssambare
ms.reviewer: larryfr
author: shivanissambare
ms.date: 05/24/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, sdkv2, event-tier1-build-2022, deployment
---

# Deploy and score a machine learning model with managed online endpoint using Python SDK v2 (preview) 

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

> [!IMPORTANT]
> SDK v2 is currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to deploy your machine learning model to managed online endpoint and get predictions. You'll begin by deploying a model on your local machine to debug any errors, and then you'll deploy and test it in Azure.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today
* The Azure Machine Learning SDK v2 for Python
* You must have an Azure resource group, and you (or the service principal you use) must have Contributor access to it.
* You must have an Azure Machine Learning workspace.
* To deploy locally, you must install Docker Engine on your local computer. We highly recommend this option, so it's easier to debug issues.

### Clone examples repository

To run the training examples, first clone the examples repository and change into the `sdk` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

## 1. Connect to Azure machine learning workspace

The [workspace](https://docs.microsoft.com/azure/machine-learning/concept-workspace) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section we will connect to the workspace in which you'll perform deployment tasks.

### 1.1. Import the required libraries

```python
# import required libraries
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    Environment,
    CodeConfiguration,
)
from azure.identity import DefaultAzureCredential
```

### 1.2. Configure workspace details and get a handle to the workspace
To connect to a workspace, we need identifier parameters - a subscription, resource group and workspace name. We will use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. We use the [default azure authentication](https://docs.microsoft.com/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) for this tutorial.

```python
# enter details of your AML workspace
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<AML_WORKSPACE_NAME>"
```

```python
# get a handle to the workspace
ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace
)
```

## 2. Create local endpoint and deployment

> [!NOTE]
> To deploy locally, [Docker Engine](https://docs.docker.com/engine/install/) must be installed.
> Docker Engine must be running. Docker Engine typically starts when the computer starts. If it doesn't, you can [troubleshoot Docker Engine](https://docs.docker.com/config/daemon/#start-the-daemon-manually).

### 2.1 Create local endpoint
The goal of a local endpoint deployment is to validate and debug your code and configuration before you deploy to Azure. Local deployment has the following limitations:

* Local endpoints do not support traffic rules, authentication, or probe settings.
* Local endpoints support only one deployment per endpoint.

```python
# Creating a local endpoint
import datetime

local_endpoint_name = "local-" + datetime.datetime.now().strftime("%m%d%H%M%f")

# create an online endpoint
endpoint = ManagedOnlineEndpoint(
    name=local_endpoint_name, description="this is a sample local endpoint"
)
```

```python
ml_client.online_endpoints.begin_create_or_update(endpoint, local=True)
```
### 2.2 Create local deployment
The example contains all the files needed to deploy a model on an online endpoint. To deploy a model, you must have:

* Model files (or the name and version of a model that's already registered in your workspace). In the example, we have a scikit-learn model that does regression.
* The code that's required to score the model. In this case, we have a score.py file.
* An environment in which your model runs. As you'll see, the environment might be a Docker image with Conda dependencies, or it might be a Dockerfile.
* Settings to specify the instance type and scaling capacity.

**Key aspects of deployment**
* `name` - Name of the deployment.
* `endpoint_name` - Name of the endpoint to create the deployment under.
* `model` - The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification.
* `environment` - The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification.
* `code_configuration` - the configuration for the source code and scoring script
    * `path`- Path to the source code directory for scoring the model
    * `scoring_script` - Relative path to the scoring file in the source code directory
* `instance_type` - The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](https://docs.microsoft.com/azure/machine-learning/reference-managed-online-endpoints-vm-sku-list).
* `instance_count` - The number of instances to use for the deployment

```python
model = Model(path="../model-1/model/sklearn_regression_model.pkl")
env = Environment(
    conda_file="../model-1/environment/conda.yml",
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
)

blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=local_endpoint_name,
    model=model,
    environment=env,
    code_configuration=CodeConfiguration(
        code="../model-1/onlinescoring", scoring_script="score.py"
    ),
    instance_type="Standard_F2s_v2",
    instance_count=1,
)
```

```python
ml_client.online_deployments.begin_create_or_update(
    deployment=blue_deployment, local=True
)
```

## 3. Verify the local deployment succeeded
### 3.1 Check the status to see whether the model was deployed without error

```python
ml_client.online_endpoints.get(name=local_endpoint_name, local=True)
```

### 3.2 Get logs

```python
ml_client.online_deployments.get_logs(
    name="blue", endpoint_name=local_endpoint_name, local=True, lines=50
)
```

### 3.3 Invoke the local endpoint
Invoke the endpoint to score the model by using the convenience command invoke and passing query parameters that are stored in a JSON file

```python
ml_client.online_endpoints.invoke(
    endpoint_name=local_endpoint_name,
    request_file="../model-1/sample-request.json",
    local=True,
)
```

## 4. Deploy your online endpoint to Azure
Next, deploy your online endpoint to Azure.

### 4.1 Configure online endpoint
`endpoint_name`: The name of the endpoint. It must be unique in the Azure region. Naming rules are defined under managed online endpoint limits.

`auth_mode` : Use `key` for key-based authentication. Use `aml_token` for Azure Machine Learning token-based authentication. A `key` does not expire, but `aml_token` does expire.

Optionally, you can add description, tags to your endpoint.

```python
# Creating a unique endpoint name with current datetime to avoid conflicts
import datetime

online_endpoint_name = "endpoint-" + datetime.datetime.now().strftime("%m%d%H%M%f")

# create an online endpoint
endpoint = ManagedOnlineEndpoint(
    name=online_endpoint_name,
    description="this is a sample online endpoint",
    auth_mode="key",
    tags={"foo": "bar"},
)
```

### 4.2 Create the endpoint
Using the `MLClient` created earlier, we will now create the Endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.

```python
ml_client.begin_create_or_update(endpoint)
```

### 4.3 Configure online deployment
A deployment is a set of resources required for hosting the model that does the actual inferencing. We will create a deployment for our endpoint using the `ManagedOnlineDeployment` class.

```python
model = Model(path="../model-1/model/sklearn_regression_model.pkl")
env = Environment(
    conda_file="../model-1/environment/conda.yml",
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
)

blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=online_endpoint_name,
    model=model,
    environment=env,
    code_configuration=CodeConfiguration(
        code="../model-1/onlinescoring", scoring_script="score.py"
    ),
    instance_type="Standard_F2s_v2",
    instance_count=1,
)
```

### 4.4 Create the deployment
Using the `MLClient` created earlier, we will now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.

```python
ml_client.begin_create_or_update(blue_deployment)
```

```python
# blue deployment takes 100 traffic
endpoint.traffic = {"blue": 100}
ml_client.begin_create_or_update(endpoint)
```

## 5. Test the endpoint with sample data
Using the `MLClient` created earlier, we will get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:

* `endpoint_name` - Name of the endpoint
* `request_file` - File with request data
* `deployment_name` - Name of the specific deployment to test in an endpoint

We will send a sample request using a [json](https://github.com/Azure/azureml-examples/blob/main/sdk/endpoints/online/model-1/sample-request.json) file.

```python
# test the blue deployment with some sample data
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="blue",
    request_file="../model-1/sample-request.json",
)
```

## 6. Managing endpoints and deployments
### 6.1 Get details of the endpoint

```python
# Get the details for online endpoint
endpoint = ml_client.online_endpoints.get(name=online_endpoint_name)

# existing traffic details
print(endpoint.traffic)

# Get the scoring URI
print(endpoint.scoring_uri)
```

### 6.2 Get the logs for the new deployment
Get the logs for the green deployment and verify as needed

```python
ml_client.online_deployments.get_logs(
    name="blue", endpoint_name=online_endpoint_name, lines=50
)
```

## 7. Delete the endpoint

```python
ml_client.online_endpoints.begin_delete(name=online_endpoint_name)
```

## Next steps

Try these next steps to learn how to use the Azure Machine Learning SDK (v2) for Python:
* [Managed online endpoint safe rollout](how-to-safely-rollout-managed-endpoints-sdk-v2.md)
* Explore online endpoint samples - [https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints](https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints)