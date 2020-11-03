---
title: High-performance model serving with Triton (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to deploy your model with NVIDIA Triton Inference Server in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.date: 09/23/2020
ms.topic: conceptual
ms.reviewer: larryfr
ms.custom: deploy
---

# High-performance serving with Triton Inference Server (Preview) 

Learn how to use [NVIDIA Triton Inference Server](https://developer.nvidia.com/nvidia-triton-inference-server) to improve the performance of the web service used for model inference.

One of the ways to deploy a model for inference is as a web service. For example, a deployment to Azure Kubernetes Service or Azure Container Instances. By default, Azure Machine Learning uses a single-threaded, *general purpose* web framework for web service deployments.

Triton is a framework that is *optimized for inference*. It provides better utilization of GPUs and more cost-effective inference. On the server-side, it batches incoming requests and submits these batches for inference. Batching better utilizes GPU resources, and is a key part of Triton's performance.

> [!IMPORTANT]
> Using Triton for deployment from Azure Machine Learning is currently in __preview__. Preview functionality may not be covered by customer support. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

> [!TIP]
> The code snippets in this document are for illustrative purposes and may not show a complete solution. For working example code, see the [end-to-end samples of Triton in Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/tutorials).

## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* Familiarity with [how and where to deploy a model](how-to-deploy-and-where.md) with Azure Machine Learning.
* The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/?view=azure-ml-py) **or** the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) and [machine learning extension](reference-azure-machine-learning-cli.md).
* A working installation of Docker for local testing. For information on installing and validating Docker, see [Orientation and setup](https://docs.docker.com/get-started/) in the docker documentation.

## Architectural overview

Before attempting to use Triton for your own model, it's important to understand how it works with Azure Machine Learning and how it compares to a default deployment.

**Default deployment without Triton**

* Multiple [Gunicorn](https://gunicorn.org/) workers are started to concurrently handle incoming requests.
* These workers handle pre-processing, calling the model, and post-processing. 
* Inference requests use the __scoring URI__. For example, `https://myserevice.azureml.net/score`.

:::image type="content" source="./media/how-to-deploy-with-triton/normal-deploy.png" alt-text="Normal, non-triton, deployment architecture diagram":::

**Inference configuration deployment with Triton**

* Multiple [Gunicorn](https://gunicorn.org/) workers are started to concurrently handle incoming requests.
* The requests are forwarded to the **Triton server**. 
* Triton processes requests in batches to maximize GPU utilization.
* The client uses the __scoring URI__ to make requests. For example, `https://myserevice.azureml.net/score`.

:::image type="content" source="./media/how-to-deploy-with-triton/inferenceconfig-deploy.png" alt-text="Inferenceconfig deployment with Triton":::

The workflow to use Triton for your model deployment is:

1. Verify that Triton can serve your model.
1. Verify you can send requests to your Triton-deployed model.
1. Incorporate your Triton-specific code into your AML deployment.

## (Optional) Define a model config file

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

> [!IMPORTANT]
> This directory structure is a Triton Model Repository and is required for your model(s) to work with Triton. For more information, see [Triton Model Repositories](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/model_repository.html) in the NVIDIA documentation.

## Test with Triton and Docker

To test your model to make sure it runs with Triton, you can use Docker. The following commands pull the Triton container to your local computer, and then start the Triton Server:

1. To pull the image for the Triton server to your local computer, use the following command:

    ```bash
    docker pull nvcr.io/nvidia/tritonserver:20.09-py3
    ```

1. To start the Triton server, use the following command. Replace `<path-to-models/triton>` with the path to the Triton model repository that contains your models:

    ```bash
    docker run --rm -ti -v<path-to-models/triton>:/models nvcr.io/nvidia/tritonserver:20.09-py3 tritonserver --model-repository=/models --strict-model-config=false
    ```

    > [!IMPORTANT]
    > If you are using Windows, you may be prompted to allow network connections to this process the first time you run the command. If so, select to enable access.

    Once started, information similar to the following text is logged to the command line:

    ```bash
    I0923 19:21:30.582866 1 http_server.cc:2705] Started HTTPService at 0.0.0.0:8000
    I0923 19:21:30.626081 1 http_server.cc:2724] Started Metrics Service at 0.0.0.0:8002
    ```

    The first line indicates the address of the web service. In this case, `0.0.0.0:8000`, which is the same as `localhost:8000`.

1. Use a utility such as curl to access the health endpoint.

    ```bash
    curl -L -v -i localhost:8000/v2/health/ready
    ```

    This command returns information similar to the following. Note the `200 OK`; this status means the web server is running.

    ```bash
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

Beyond a basic health check, you can create a client to send data to Triton for inference. For more information on creating a client, see the [client examples](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/client_example.html) in the NVIDIA documentation. There are also [Python samples at the Triton GitHub](https://github.com/triton-inference-server/server/tree/master/src/clients/python/examples).

For more information on running Triton using Docker, see [Running Triton on a system with a GPU](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/run.html#running-triton-on-a-system-with-a-gpu) and [Running Triton on a system without a GPU](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/run.html#running-triton-on-a-system-without-a-gpu).

## Register your model

Now that you've verified that your model works with Triton, register it with Azure Machine Learning. Model registration stores your model files in the Azure Machine Learning workspace, and are used when deploying with the Python SDK and Azure CLI.

The following examples demonstrate how to register the model(s):

# [Python](#tab/python)

```python
from azureml.core.model import Model

model = Model.register(
    model_path=os.path.join("..", "triton"),
    model_name="bidaf_onnx",
    tags={'area': "Natural language processing", 'type': "Question answering"},
    description="Question answering model from ONNX model zoo",
    workspace=ws
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az ml model register --model-path='triton' \
--name='bidaf_onnx' \
--workspace-name='<my_workspace>'
```
---

<a id="processing"></a>

## Add pre and post-processing

After verifying that the web service is working, you can add pre and post-processing code by defining an _entry script_. This file is named `score.py`. For more information on entry scripts, see [Define an entry script](how-to-deploy-and-where.md#define-an-entry-script).

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

## Redeploy with an inference configuration

An inference configuration allows you use an entry script, as well as the Azure Machine Learning deployment process using the Python SDK or Azure CLI.

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
# Print the URI you can use to call the local deployment
print(local_service.scoring_uri)
```

# [Azure CLI](#tab/azure-cli)

> [!TIP]
> For more information on creating an inference configuration, see the [inference configuration schema](./reference-azure-machine-learning-cli.md#inference-configuration-schema).

```azurecli
az ml model deploy -n triton-densenet-onnx \
-m densenet_onnx:1 \
--ic inference-config.json \
-e My-Triton --dc deploymentconfig.json \
--overwrite --compute-target=aks-gpu
```

---

After deployment completes, the scoring URI is displayed. For this local deployment, it will be `http://localhost:6789/score`. If you deploy to the cloud, you can use the [az ml service show](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/service?view=azure-cli-latest#ext_azure_cli_ml_az_ml_service_show) CLI command to get the scoring URI.

For information on how to create a client that sends inference requests to the scoring URI, see [consume a model deployed as a web service](how-to-consume-web-service.md).

## Clean up resources

If you plan on continuing to use the Azure Machine Learning workspace, but want to get rid of the deployed service, use one of the following options:

# [Python](#tab/python)

```python
local_service.delete()
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az ml service delete -n triton-densenet-onnx
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
