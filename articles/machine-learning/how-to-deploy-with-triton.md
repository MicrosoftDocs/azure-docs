---
title: High-performance model serving with Triton (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to deploy a model with Triton Inference Server in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.date: 09/14/2020
ms.topic: conceptual

---

# High-performance serving with Triton Inference Server (Preview) 

Learn how to use [NVIDIA Triton Inference Server](https://developer.nvidia.com/nvidia-triton-inference-server) to improve the performance of the web service used for model inference.

One of the ways to deploy a model for inference is as a web service. For example, a deployment to Azure Kubernetes Service or Azure Container Instances. By default, Azure Machine Learning uses a single-threaded, *general purpose* web framework for web service deployments.

Triton is a framework that is *optimized for inference*. It provides better utilization of GPUs and more cost-effective inference. On the server-side, it batches incoming requests and submits these batches for inference. This better utilizes GPU resources, and is a key part of it's performance.

> [!IMPORTANT]
> Using Triton for deployment from Azure Machine Learning is currently in __preview__. Preview functionality may not be covered by customer support. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)




Model deployment in Azure Machine Learning with Triton for high-performance inferencing is currently in preview. This article shows how to use Triton for your own models and provides links to [runnable sample notebooks and CLI commands](https://aka.ms/triton-aml-sample).


## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* Familiarity with [how and where to deploy a model](how-to-deploy-and-where.md) with Azure Machine Learning.
* The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/?view=azure-ml-py) **or** the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) and [machine learning extension](reference-azure-machine-learning-cli.md).

## Architectural overview

Before attempting to use Triton for your own model, it's important to understand how it works with Azure Machine Learning and how it compares to a default deployment.


:::row:::
    :::column:::
        **Default deployment without Triton**

        * Multiple [Gunicorn](https://gunicorn.org/) workers are started to concurrently handle incoming requests.
        * These workers handle pre-processing, calling the model, and post-processing. 
        * Inference requests use the __scoring URI__. For example, `https://myserevice.azureml.net/score`.
    :::column-end:::
    :::column span="3":::
        :::image type="content" source="./media/how-to-deploy-with-triton/normal-deploy.png" alt-text="Normal, non-triton, deployment architecture diagram":::
    :::column-end:::
:::row-end:::

:::row:::
    :::column:::
        **Inference configuration deployment with Triton**

        * Multiple [Gunicorn](https://gunicorn.org/) workers are started to concurrently handle incoming requests.
        * The requests are forwarded to the **Triton server**. 
        * Triton processes requests in batches to maximize GPU utilization.
        * The client uses the __scoring URI__ to make requests. For example, `https://myserevice.azureml.net/score`.
    :::column-end:::
    :::column span="3":::
        :::image type="content" source="./media/how-to-deploy-with-triton/inferenceconfig-deploy.png" alt-text="Inferenceconfig deployment with Triton":::
    :::column-end:::
:::row-end:::

:::row:::
    :::column:::
        **No-code deployment with Triton**

        * Requests are handled directly by Triton.
        * Inference requests are made to the **Triton API**. For example, `https://myservice.azureml.net/api/v1/service/<name>`.
    :::column-end:::
    :::column span="3":::
        :::image type="content" source="./media/how-to-deploy-with-triton/no-code-deploy.png" alt-text="no-code deployment with Triton":::
    :::column-end:::
:::row-end:::

> [!TIP]
> If you decide to start with a no-code deployment, but later determine that you need to [add pre and post-processing](#processing), you can [redeploy using an inference config](#redeploy).


The workflow to use Triton for your model deployment is:

1. Verify that Triton can serve your model.
1. Verify you can send requests to your Triton-deployed model.
1. Incorporate your Triton-specific code into your AML deployment.

## (Optional) Define a config file

The model configuration file tells Triton how many inputs to expects and of what dimensions those inputs will be. For more information on creating the configuration file, see [Model configuration](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/model_configuration.html) in the NVIDIA documentation.

> [!TIP]
> We use the `--strict-model-config=false` option when starting the Triton Inference Server, which means you do not need to provide a `config.pbtxt` file for ONNX or TensorFlow models.
> 
> For more information on this option, see [Generated model configuration](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/model_configuration.html#generated-model-configuration) in the NVIDIA documentation.

## Directory structure

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

> [!TIP]
> This directory structure is a Triton Model Repository and is required for your model(s) to work with Triton. For more information, see [Triton Model Repositories](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/model_repository.html) in the NVIDIA documentation.

> [!IMPORTANT]
> If you are using **code-first** deployments, specify the top level `models` directory when registering the model.
>
> If you are are **not** using code-first, specify the `triton` directory when registering the model.

## Register your model

The following examples demonstrate how to register the model(s) to use for the deployment using both the Python SDK and Azure CLI:

# [Python](#tab/python)

```python
from azureml.core.model import Model

model = Model.register(
    model_path=os.path.join("..", "triton"),
    model_name="bidaf_onnx",
    tags={'area': "Natural language processing", 'type': "Question answering"},
    description="Question answering model from ONNX model zoo",
    model_framework=Model.Framework.MULTI,
    model_framework_version='20.07-py3',  # version of Triton Inference Server to use
    workspace=ws
```

# [Azure CLI](#tab/azure-cli)

```bash
az ml model register --model-path='triton' \
--name='bidaf_onnx' \
--model-framework='Multi' \
--model-framework-version='20.07-py3' \
--workspace-name='<my_workspace>'
```
---

## Use no-code deployment

When using [no-code deployment](./how-to-deploy-no-code-deployment.md) with `Model.Framework.MULTI`, Azure Machine Learning tries to deploy any models in the `triton` subdirectory of the registered model. The following examples demonstrated how to deploy using the Python SDK and Azure CLI:

# [Python](#tab/python)

```python
from azureml.core.webservice import LocalWebservice


local_config = LocalWebservice.deploy_configuration(
    port=6789
)

local_service = Model.deploy(
    workspace=ws,
    name="densenet_local",
    models=[model]
    deployment_config=local_config,
    overwrite=True)

local_service.wait_for_deployment(show_output = True)
print(local_service.state)

```

# [Azure CLI](#tab/azure-cli)

> [!TIP]
> For information on writing a deployment configuration, the [deployment configuration schema](./reference-azure-machine-learning-cli.md#deployment-configuration-schema).

```bash
az ml model deploy -n triton-bidaf-onnx \
-m bidaf_onnx:1 \
--dc deploymentconfig.json
```

---

## Test the web service

Before adding any pre or post-processing, check that the web service is working. To perform a basic health check, use the following steps:

1. To get the service endpoint, use one of the following options:

    # [Python](#tab/python)

    ```python
    print(local_service.scoring_url)
    ```

    # [Azure CLI](#tab/azure-cli)
    
    ```bash
    az ml service show
    ```

    ---

2. Use a utility such as curl to access the health endpoint. Replace `<service_endpoint>` with the value returned in the previous step:

    ```bash
    curl -L -v -i <service_endpoint>/v2/health/ready
    ```

Beyond a basic health check, you can create a client to send data to the scoring URI for inference. For more information on creating a client, see the [client examples](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/client_example.html) in the NVIDIA documentation. There are also [Python samples at the Triton GitHub](https://github.com/triton-inference-server/server/tree/master/src/clients/python/examples).

<a id="processing"></a>
## (Optional) Add pre and post-processing

After verifying that the web service is working, you can add pre and post-processing code.

The two main steps are to initialize a Triton HTTP client in your `init()` method, and to call into that client in your `run()` function.

### Initialize the Triton Client

Include code like the following example in your `score.py` file. Triton in Azure Machine Learning expects to be addressed on localhost, port 8000. In this case, localhost is inside the Docker image for this deployment, not your local machine:

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
## (Optional) Redeploy with an Inference Configuration

If you are using pre and post-processing, you need to redeploy your web service with an inference configuration.

> [!IMPORTANT]
> You must specify the `AzureML-Triton` [curated environment](./resource-curated-environments.md).
>
> The Python code example clones `AzureML-Triton` into another environment called `My-Triton`. The Azure CLI code also uses this environment. For more information on cloning an environment, see the [Environment.Clone()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py&preserve-view=true#clone-new-name-) reference.

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
```

# [Azure CLI](#tab/azure-cli)

> [!TIP]
> For more information on creating an inference configuration, see the [inference configuration schema](./reference-azure-machine-learning-cli.md#inference-configuration-schema).

```bash

az ml model deploy -n triton-densenet-onnx \
-m densenet_onnx:1 \
--ic inference-config.json \
-e My-Triton --dc deploymentconfig.json \
--overwrite --compute-target=aks-gpu
```

---

## Next steps

* [See end-to-end samples of Triton in Azure Machine Learning](https://aka.ms/aml-triton-sample)
* Check out [Triton client examples](https://github.com/triton-inference-server/server/tree/master/src/clients/python/examples)
* Read the [Triton Inference Server documentation](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html)
* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md)
* [Update web service](how-to-deploy-update-web-service.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
