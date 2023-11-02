---
title: Deploy a model in a custom container to an online endpoint
titleSuffix: Azure Machine Learning
description: Learn how to use a custom container with an open-source server to deploy a model in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 10/13/2022
ms.topic: how-to
ms.custom: deploy, devplatv2, devx-track-azurecli, cliv2, event-tier1-build-2022, sdkv2
ms.devlang: azurecli
---

# Use a custom container to deploy a model to an online endpoint

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn how to use a custom container for deploying a model to an online endpoint in Azure Machine Learning.

Custom container deployments can use web servers other than the default Python Flask server used by Azure Machine Learning. Users of these deployments can still take advantage of Azure Machine Learning's built-in monitoring, scaling, alerting, and authentication.

The following table lists various [deployment examples](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/custom-container) that use custom containers such as TensorFlow Serving, TorchServe, Triton Inference Server, Plumber R package, and AzureML Inference Minimal image.

|Example|Script (CLI)|Description| 
|-------|------|---------|
|[minimal/multimodel](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/minimal/multimodel)|[deploy-custom-container-minimal-multimodel](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-minimal-multimodel.sh)|Deploy multiple models to a single deployment by extending the Azure Machine Learning Inference Minimal image.|
|[minimal/single-model](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/minimal/single-model)|[deploy-custom-container-minimal-single-model](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-minimal-single-model.sh)|Deploy a single model by extending the Azure Machine Learning Inference Minimal image.|
|[mlflow/multideployment-scikit](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/mlflow/multideployment-scikit)|[deploy-custom-container-mlflow-multideployment-scikit](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-mlflow-multideployment-scikit.sh)|Deploy two MLFlow models with different Python requirements to two separate deployments behind a single endpoint using the Azure Machine Learning Inference Minimal Image.|
|[r/multimodel-plumber](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/r/multimodel-plumber)|[deploy-custom-container-r-multimodel-plumber](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-r-multimodel-plumber.sh)|Deploy three regression models to one endpoint using the Plumber R package|
|[tfserving/half-plus-two](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/tfserving/half-plus-two)|[deploy-custom-container-tfserving-half-plus-two](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-tfserving-half-plus-two.sh)|Deploy a simple Half Plus Two model using a TensorFlow Serving custom container using the standard model registration process.|
|[tfserving/half-plus-two-integrated](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/tfserving/half-plus-two-integrated)|[deploy-custom-container-tfserving-half-plus-two-integrated](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-tfserving-half-plus-two-integrated.sh)|Deploy a simple Half Plus Two model using a TensorFlow Serving custom container with the model integrated into the image.|
|[torchserve/densenet](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/torchserve/densenet)|[deploy-custom-container-torchserve-densenet](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-torchserve-densenet.sh)|Deploy a single model using a TorchServe custom container.|
|[torchserve/huggingface-textgen](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/torchserve/huggingface-textgen)|[deploy-custom-container-torchserve-huggingface-textgen](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-torchserve-huggingface-textgen.sh)|Deploy Hugging Face models to an online endpoint and follow along with the Hugging Face Transformers TorchServe example.| 
|[triton/single-model](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/triton/single-model)|[deploy-custom-container-triton-single-model](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-triton-single-model.sh)|Deploy a Triton model using a custom container|

This article focuses on serving a TensorFlow model with TensorFlow (TF) Serving.

> [!WARNING]
> Microsoft may not be able to help troubleshoot problems caused by a custom image. If you encounter problems, you may be asked to use the default image or one of the images Microsoft provides to see if the problem is specific to your image.

## Prerequisites

[!INCLUDE [cli & sdk](includes/machine-learning-cli-sdk-v2-prereqs.md)]

* You, or the service principal you use, must have `Contributor` access to the Azure Resource Group that contains your workspace. You'll have such a resource group if you configured your workspace using the quickstart article.

* To deploy locally, you must have [Docker engine](https://docs.docker.com/engine/install/) running locally. This step is **highly recommended**. It will help you debug issues.

## Download source code

To follow along with this tutorial, download the source code below.

# [Azure CLI](#tab/cli)

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

# [Python SDK](#tab/python)

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/sdk
```

See also [the example notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/custom-container/online-endpoints-custom-container.ipynb) but note that `3. Test locally` section in the notebook assumes to run under the `azureml-examples/sdk` directory.

---

## Initialize environment variables

Define environment variables:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="initialize_variables":::

## Download a TensorFlow model

Download and unzip a model that divides an input by two and adds 2 to the result:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="download_and_unzip_model":::

## Run a TF Serving image locally to test that it works

Use docker to run your image locally for testing:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="run_image_locally_for_testing":::

### Check that you can send liveness and scoring requests to the image

First, check that the container is "alive," meaning that the process inside the container is still running. You should get a 200 (OK) response.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="check_liveness_locally":::

Then, check that you can get predictions about unlabeled data:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="check_scoring_locally":::

### Stop the image

Now that you've tested locally, stop the image:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="stop_image":::

## Deploy your online endpoint to Azure
Next, deploy your online endpoint to Azure.

# [Azure CLI](#tab/cli)

### Create a YAML file for your endpoint and deployment

You can configure your cloud deployment using YAML. Take a look at the sample YAML for this example:

__tfserving-endpoint.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/custom-container/tfserving/half-plus-two/tfserving-endpoint.yml":::

__tfserving-deployment.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/custom-container//tfserving/half-plus-two/tfserving-deployment.yml":::

# [Python SDK](#tab/python)

### Connect to Azure Machine Learning workspace
Connect to Azure Machine Learning Workspace, configure workspace details, and get a handle to the workspace as follows:

1. Import the required libraries:

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

2. Configure workspace details and get a handle to the workspace:

```python
# enter details of your Azure Machine Learning workspace
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<AZUREML_WORKSPACE_NAME>"

# get a handle to the workspace
ml_client = MLClient(
   DefaultAzureCredential(), subscription_id, resource_group, workspace
)
```

For more information, see [Deploy machine learning models to managed online endpoint using Python SDK v2](how-to-deploy-managed-online-endpoint-sdk-v2.md).

### Configure online endpoint

> [!TIP]
> * `name`: The name of the endpoint. It must be unique in the Azure region. The name for an endpoint must start with an upper- or lowercase letter and only consist of '-'s and alphanumeric characters. For more information on the naming rules, see [managed online endpoint limits](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).
> * `auth_mode` : Use `key` for key-based authentication. Use `aml_token` for Azure Machine Learning token-based authentication. A `key` doesn't expire, but `aml_token` does expire. For more information on authenticating, see [Authenticate to an online endpoint](how-to-authenticate-online-endpoint.md).

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

### Configure online deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. We'll create a deployment for our endpoint using the `ManagedOnlineDeployment` class.

> [!TIP]
> - `name` - Name of the deployment.
> - `endpoint_name` - Name of the endpoint to create the deployment under.
> - `model` - The model to use for the deployment. This value can be either a reference to an existing versioned > model in the workspace or an inline model specification.
> - `environment` - The environment to use for the deployment. This value can be either a reference to an existing > versioned environment in the workspace or an inline environment specification.
> - `code_configuration` - the configuration for the source code and scoring script
>     - `path`- Path to the source code directory for scoring the model
>     - `scoring_script` - Relative path to the scoring file in the source code directory
> - `instance_type` - The VM size to use for the deployment. For the list of supported sizes, see [endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
> - `instance_count` - The number of instances to use for the deployment

```python
# create a blue deployment
model = Model(name="tfserving-mounted", version="1", path="half_plus_two")

env = Environment(
    image="docker.io/tensorflow/serving:latest",
    inference_config={
        "liveness_route": {"port": 8501, "path": "/v1/models/half_plus_two"},
        "readiness_route": {"port": 8501, "path": "/v1/models/half_plus_two"},
        "scoring_route": {"port": 8501, "path": "/v1/models/half_plus_two:predict"},
    },
)

blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=online_endpoint_name,
    model=model,
    environment=env,
    environment_variables={
        "MODEL_BASE_PATH": "/var/azureml-app/azureml-models/tfserving-mounted/1",
        "MODEL_NAME": "half_plus_two",
    },
    instance_type="Standard_DS2_v2",
    instance_count=1,
)
```

---

There are a few important concepts to notice in this YAML/Python parameter:

#### Readiness route vs. liveness route

An HTTP server defines paths for both _liveness_ and _readiness_. A liveness route is used to check whether the server is running. A readiness route is used to check whether the server is ready to do work. In machine learning inference, a server could respond 200 OK to a liveness request before loading a model. The server could respond 200 OK to a readiness request only after the model has been loaded into memory.

Review the [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) for more information about liveness and readiness probes.

Notice that this deployment uses the same path for both liveness and readiness, since TF Serving only defines a liveness route.

#### Locating the mounted model

When you deploy a model as an online endpoint, Azure Machine Learning _mounts_ your model to your endpoint. Model mounting enables you to deploy new versions of the model without having to create a new Docker image. By default, a model registered with the name *foo* and version *1* would be located at the following path inside of your deployed container: `/var/azureml-app/azureml-models/foo/1`

For example, if you have a directory structure of `/azureml-examples/cli/endpoints/online/custom-container` on your local machine, where the model is named `half_plus_two`:

:::image type="content" source="./media/how-to-deploy-custom-container/local-directory-structure.png" alt-text="Diagram showing a tree view of the local directory structure.":::

# [Azure CLI](#tab/cli)

and `tfserving-deployment.yml` contains:

```yaml
model:
    name: tfserving-mounted
    version: 1
    path: ./half_plus_two
```

# [Python SDK](#tab/python)

and `Model` class contains:

```python
model = Model(name="tfserving-mounted", version="1", path="half_plus_two")
```

---

then your model will be located under `/var/azureml-app/azureml-models/tfserving-deployment/1` in your deployment:

:::image type="content" source="./media/how-to-deploy-custom-container/deployment-location.png" alt-text="Diagram showing a tree view of the deployment directory structure.":::

You can optionally configure your `model_mount_path`. It enables you to change the path where the model is mounted. 

> [!IMPORTANT]
> The `model_mount_path` must be a valid absolute path in Linux (the OS of the container image).

# [Azure CLI](#tab/cli)

For example, you can have `model_mount_path` parameter in your _tfserving-deployment.yml_:

```YAML
name: tfserving-deployment
endpoint_name: tfserving-endpoint
model:
  name: tfserving-mounted
  version: 1
  path: ./half_plus_two
model_mount_path: /var/tfserving-model-mount
.....
```

# [Python SDK](#tab/python)

For example, you can have `model_mount_path` parameter in your `ManagedOnlineDeployment` class:

```python
blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=online_endpoint_name,
    model=model,
    environment=env,
    model_mount_path="/var/tfserving-model-mount",
    ...
)
```

---

then your model will be located at `/var/tfserving-model-mount/tfserving-deployment/1` in your deployment. Note that it's no longer under `azureml-app/azureml-models`, but under the mount path you specified:

:::image type="content" source="./media/how-to-deploy-custom-container/mount-path-deployment-location.png" alt-text="Diagram showing a tree view of the deployment directory structure when using mount_model_path.":::

### Create your endpoint and deployment

# [Azure CLI](#tab/cli)

Now that you've understood how the YAML was constructed, create your endpoint.

```azurecli
az ml online-endpoint create --name tfserving-endpoint -f endpoints/online/custom-container/tfserving-endpoint.yml
```

Creating a deployment may take few minutes.

```azurecli
az ml online-deployment create --name tfserving-deployment -f endpoints/online/custom-container/tfserving-deployment.yml --all-traffic
```



# [Python SDK](#tab/python)

Using the `MLClient` created earlier, we'll now create the Endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.

```python
ml_client.begin_create_or_update(endpoint)
```

Create the deployment by running as well.

```python
ml_client.begin_create_or_update(blue_deployment)
```

---

### Invoke the endpoint

Once your deployment completes, see if you can make a scoring request to the deployed endpoint.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-custom-container-tfserving-half-plus-two.sh" id="invoke_endpoint":::

# [Python SDK](#tab/python)

Using the `MLClient` created earlier, we'll get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:
- `endpoint_name` - Name of the endpoint
- `request_file` - File with request data
- `deployment_name` - Name of the specific deployment to test in an endpoint

We'll send a sample request using a json file. The sample json is in the [example repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/custom-container).

```python
# test the blue deployment with some sample data
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="blue",
    request_file="sample-request.json",
)
```

---

### Delete the endpoint

Now that you've successfully scored with your endpoint, you can delete it:

# [Azure CLI](#tab/cli)

```azurecli
az ml online-endpoint delete --name tfserving-endpoint
```

# [Python SDK](#tab/python)

```python
ml_client.online_endpoints.begin_delete(name=online_endpoint_name)
```

---

## Next steps

- [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [Troubleshooting online endpoints deployment](./how-to-troubleshoot-online-endpoints.md)
- [Torch serve sample](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-custom-container-torchserve-densenet.sh)
