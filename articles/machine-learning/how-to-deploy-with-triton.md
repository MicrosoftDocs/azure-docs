---
title: High-performance model serving with Triton (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to deploy your model with NVIDIA Triton Inference Server in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.date: 02/16/2020
ms.topic: conceptual
ms.reviewer: larryfr
ms.custom: deploy
---

# High-performance serving with Triton Inference Server (Preview) 

Learn how to use [NVIDIA Triton Inference Server](https://aka.ms/nvidia-triton-docs) to improve the performance of the web service used for model inference.

One of the ways to deploy a model for inference is as a web service. For example, a deployment to Azure Kubernetes Service or Azure Container Instances. By default, Azure Machine Learning uses a single-threaded, *general purpose* web framework for web service deployments.

Triton is a framework that is *optimized for inference*. It provides better utilization of GPUs and more cost-effective inference. On the server-side, it batches incoming requests and submits these batches for inference. Batching better utilizes GPU resources, and is a key part of Triton's performance.

> [!IMPORTANT]
> Using Triton for deployment from Azure Machine Learning is currently in __preview__. Preview functionality may not be covered by customer support. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

> [!TIP]
> The code snippets in this document are for illustrative purposes and may not show a complete solution. For working example code, see the [end-to-end samples of Triton in Azure Machine Learning](https://aka.ms/triton-aml-sample).

## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* Familiarity with [how and where to deploy a model](how-to-deploy-and-where.md) with Azure Machine Learning.
* The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/) **or** the [Azure CLI](/cli/azure/) and [machine learning extension](reference-azure-machine-learning-cli.md).
* A working installation of Docker for local testing. For information on installing and validating Docker, see [Orientation and setup](https://docs.docker.com/get-started/) in the docker documentation.

## Architectural overview

Before attempting to use Triton for your own model, it's important to understand how it works with Azure Machine Learning and how it compares to a default deployment.

**Default deployment without Triton**

* Multiple [Gunicorn](https://gunicorn.org/) workers are started to concurrently handle incoming requests.
* These workers handle pre-processing, calling the model, and post-processing. 
* Clients use the __Azure ML scoring URI__. For example, `https://myservice.azureml.net/score`.

:::image type="content" source="./media/how-to-deploy-with-triton/normal-deploy.png" alt-text="Normal, non-triton, deployment architecture diagram":::

**Deploying with Triton directly**

* Requests go directly to the Triton server.
* Triton processes requests in batches to maximize GPU utilization.
* The client uses the __Triton URI__ to make requests. For example, `https://myservice.azureml.net/v2/models/${MODEL_NAME}/versions/${MODEL_VERSION}/infer`.

:::image type="content" source="./media/how-to-deploy-with-triton/triton-deploy.png" alt-text="Inferenceconfig deployment with Triton only, and no Python middleware":::

**Inference configuration deployment with Triton**

* Multiple [Gunicorn](https://gunicorn.org/) workers are started to concurrently handle incoming requests.
* The requests are forwarded to the **Triton server**. 
* Triton processes requests in batches to maximize GPU utilization.
* The client uses the __Azure ML scoring URI__ to make requests. For example, `https://myservice.azureml.net/score`.

:::image type="content" source="./media/how-to-deploy-with-triton/inference-config-deploy.png" alt-text="Deployment with Triton and Python middleware":::

The workflow to use Triton for your model deployment is:

1. Serve your model with Triton directly.
1. Verify you can send requests to your Triton-deployed model.
1. (Optional) Create a layer of Python middleware for server-side pre- and post-processing

## Deploying Triton without Python pre- and post-processing

First, follow the steps below to verify that the Triton Inference Server can serve your model.

### (Optional) Define a model config file

The model configuration file tells Triton how many inputs to expects and of what dimensions those inputs will be. For more information on creating the configuration file, see [Model configuration](https://aka.ms/nvidia-triton-docs) in the NVIDIA documentation.

> [!TIP]
> We use the `--strict-model-config=false` option when starting the Triton Inference Server, which means you do not need to provide a `config.pbtxt` file for ONNX or TensorFlow models.
> 
> For more information on this option, see [Generated model configuration](https://aka.ms/nvidia-triton-docs) in the NVIDIA documentation.

### Use the correct directory structure

When registering a model with Azure Machine Learning, you can register either individual files or a directory structure. To use Triton, the model registration must be for a directory structure that contains a directory named `triton`. The general structure of this directory is:

```bash
models
    - triton
        - model_1
            - model_version
                - model_file
                - config_file
        - model_2
            ...
```

> [!IMPORTANT]
> This directory structure is a Triton Model Repository and is required for your model(s) to work with Triton. For more information, see [Triton Model Repositories](https://aka.ms/nvidia-triton-docs) in the NVIDIA documentation.

### Register your Triton model

# [Azure CLI](#tab/azcli)

```azurecli-interactive
az ml model register -n my_triton_model -p models --model-framework=Multi
```

For more information on `az ml model register`, consult the [reference documentation](/cli/azure/ext/azure-cli-ml/ml/model).

# [Python](#tab/python)


```python

from azureml.core.model import Model

model_path = "models"

model = Model.register(
    model_path=model_path,
    model_name="bidaf-9-tutorial",
    tags={"area": "Natural language processing", "type": "Question-answering"},
    description="Question answering from ONNX model zoo",
    workspace=ws,
    model_framework=Model.Framework.MULTI,  # This line tells us you are registering a Triton model
)

```
For more information, see the documentation for the [Model class](/python/api/azureml-core/azureml.core.model.model).

---

### Deploy your model

# [Azure CLI](#tab/azcli)

If you have a GPU-enabled Azure Kubernetes Service cluster called "aks-gpu" created through Azure Machine Learning, you can use the following command to deploy your model.

```azurecli
az ml model deploy -n triton-webservice -m triton_model:1 --dc deploymentconfig.json --compute-target aks-gpu
```

# [Python](#tab/python)

```python
from azureml.core.webservice import AksWebservice
from azureml.core.model import InferenceConfig
from random import randint

service_name = "triton-webservice"

config = AksWebservice.deploy_configuration(
    compute_target_name="aks-gpu",
    gpu_cores=1,
    cpu_cores=1,
    memory_gb=4,
    auth_enabled=True,
)

service = Model.deploy(
    workspace=ws,
    name=service_name,
    models=[model],
    deployment_config=config,
    overwrite=True,
)
```
---

See [this documentation for more details on deploying models](how-to-deploy-and-where.md).

### Call into your deployed model

First, get your scoring URI and Bearer tokens.

# [Azure CLI](#tab/azcli)


```azurecli
az ml service show --name=triton-webservice
```
# [Python](#tab/python)

```python
import requests

print(service.scoring_uri)
print(service.get_keys())

```

---

Then, ensure your service is running by doing: 

```{bash}
!curl -v $scoring_uri/v2/health/ready -H 'Authorization: Bearer '"$service_key"''
```

This command returns information similar to the following. Note the `200 OK`; this status means the web server is running.

```{bash}
*   Trying 127.0.0.1:8000...
* Connected to localhost (127.0.0.1) port 8000 (#0)
> GET /v2/health/ready HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/7.71.1
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
HTTP/1.1 200 OK
```

Once you've performed a health check, you can create a client to send data to Triton for inference. For more information on creating a client, see the [client examples](https://aka.ms/nvidia-client-examples) in the NVIDIA documentation. There are also [Python samples at the Triton GitHub](https://aka.ms/nvidia-triton-docs).

At this point, if you do not want to add Python pre- and post-processing to your deployed webservice, you may be done. If you want to add this pre- and post-processing logic, read on.

## (Optional) Re-deploy with a Python entry script for pre- and post-processing

After verifying that the Triton is able to serve your model, you can add pre and post-processing code by defining an _entry script_. This file is named `score.py`. For more information on entry scripts, see [Define an entry script](how-to-deploy-and-where.md#define-an-entry-script).

The two main steps are to initialize a Triton HTTP client in your `init()` method, and to call into that client in your `run()` function.

### Initialize the Triton Client

Include code like the following example in your `score.py` file. Triton in Azure Machine Learning expects to be addressed on localhost, port 8000. In this case, localhost is inside the Docker image for this deployment, not a port on your local machine:

> [!TIP]
> The `tritonhttpclient` pip package is included in the curated `AzureML-Triton` environment, so there's no need to specify it as a pip dependency.

```python
import tritonhttpclient

def init():
    global triton_client
    triton_client = tritonhttpclient.InferenceServerClient(url="localhost:8000")
```

### Modify your scoring script to call into Triton

The following example demonstrates how to dynamically request the metadata for the model:

> [!TIP]
> You can dynamically request the metadata of models that have been loaded with Triton by using the `.get_model_metadata` method of the Triton client. See the [sample notebook](https://aka.ms/triton-aml-sample) for an example of its use.

```python
input = tritonhttpclient.InferInput(input_name, data.shape, datatype)
input.set_data_from_numpy(data, binary_data=binary_data)

output = tritonhttpclient.InferRequestedOutput(
         output_name, binary_data=binary_data, class_count=class_count)

# Run inference
res = triton_client.infer(model_name,
                          [input]
                          request_id='0',
                          outputs=[output])

```

<a id="redeploy"></a>

### Redeploy with an inference configuration

An inference configuration allows you use an entry script, as well as the Azure Machine Learning deployment process using the Python SDK or Azure CLI.

> [!IMPORTANT]
> You must specify the `AzureML-Triton` [curated environment](./resource-curated-environments.md).
>
> The Python code example clones `AzureML-Triton` into another environment called `My-Triton`. The Azure CLI code also uses this environment. For more information on cloning an environment, see the [Environment.Clone()](/python/api/azureml-core/azureml.core.environment.environment#clone-new-name-) reference.

# [Azure CLI](#tab/azcli)

> [!TIP]
> For more information on creating an inference configuration, see the [inference configuration schema](./reference-azure-machine-learning-cli.md#inference-configuration-schema).

```azurecli
az ml model deploy -n triton-densenet-onnx \
-m densenet_onnx:1 \
--ic inference-config.json \
-e My-Triton --dc deploymentconfig.json \
--overwrite --compute-target=aks-gpu
```

# [Python](#tab/python)

```python
from azureml.core.webservice import LocalWebservice
from azureml.core import Environment
from azureml.core.model import InferenceConfig


local_service_name = "triton-bidaf-onnx"
env = Environment.get(ws, "AzureML-Triton").clone("My-Triton")

for pip_package in ["nltk"]:
    env.python.conda_dependencies.add_pip_package(pip_package)

inference_config = InferenceConfig(
    entry_script="score_bidaf.py",  # This entry script is where we dispatch a call to the Triton server
    source_directory=os.path.join("..", "scripts"),
    environment=env
)

local_config = LocalWebservice.deploy_configuration(
    port=6789
)

local_service = Model.deploy(
    workspace=ws,
    name=local_service_name,
    models=[model],
    inference_config=inference_config,
    deployment_config=local_config,
    overwrite=True)

local_service.wait_for_deployment(show_output = True)
print(local_service.state)
# Print the URI you can use to call the local deployment
print(local_service.scoring_uri)
```

---

After deployment completes, the scoring URI is displayed. For this local deployment, it will be `http://localhost:6789/score`. If you deploy to the cloud, you can use the [az ml service show](/cli/azure/ext/azure-cli-ml/ml/service#ext_azure_cli_ml_az_ml_service_show) CLI command to get the scoring URI.

For information on how to create a client that sends inference requests to the scoring URI, see [consume a model deployed as a web service](how-to-consume-web-service.md).

### Setting the number of workers

To set the number of workers in your deployment, set the environment variable `WORKER_COUNT`. Given you have an [Environment](/python/api/azureml-core/azureml.core.environment.environment) object called `env`, you can do the following:

```{py}
env.environment_variables["WORKER_COUNT"] = "1"
```

This will tell Azure ML to spin up the number of workers you specify.


## Clean up resources

If you plan on continuing to use the Azure Machine Learning workspace, but want to get rid of the deployed service, use one of the following options:


# [Azure CLI](#tab/azcli)

```azurecli
az ml service delete -n triton-densenet-onnx
```
# [Python](#tab/python)

```python
local_service.delete()
```


---

## Next steps

* [See end-to-end samples of Triton in Azure Machine Learning](https://aka.ms/aml-triton-sample)
* Check out [Triton client examples](https://aka.ms/nvidia-client-examples)
* Read the [Triton Inference Server documentation](https://aka.ms/nvidia-triton-docs)
* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md)
* [Update web service](how-to-deploy-update-web-service.md)
* [Collect data for models in production](how-to-enable-data-collection.md)