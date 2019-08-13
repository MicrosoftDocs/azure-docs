---
title: How and where to deploy models 
titleSuffix: Azure Machine Learning service
description: 'Learn how and where to deploy your Azure Machine Learning service models including: Azure Container Instances, Azure Kubernetes Service, Azure IoT Edge, and Field-programmable gate arrays.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jordane
author: jpe316
ms.reviewer: larryfr
ms.date: 08/06/2019

ms.custom: seoapril2019
---

# Deploy models with the Azure Machine Learning service

Learn how to deploy your machine learning model as a web service in the Azure cloud, or to IoT Edge devices.

The workflow is similar regardless of [where you deploy](#target) your model:

1. Register the model.
1. Prepare to deploy (specify assets, usage, compute target).
1. Deploy the model to the compute target.
1. Test the deployed model, also called web service.

For more information on the concepts involved in the deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning Service](concept-model-management-and-deployment.md).

## Prerequisites

- An Azure Machine Learning service workspace. For more information, see [Create an Azure Machine Learning service workspace](how-to-manage-workspace.md).

- A model. If you do not have a trained model, you can use the model & dependency files provided in [this tutorial](https://aka.ms/azml-deploy-cloud).

- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](https://aka.ms/aml-sdk), or the [Azure Machine Learning Visual Studio Code extension](how-to-vscode-tools.md).

## Connect to your workspace

The following code demonstrates how to connect to an Azure Machine Learning service workspace using information cached to the local development environment:

**Using the SDK**

```python
from azureml.core import Workspace
ws = Workspace.from_config(path=".file-path/ws_config.json")
```

For more information on using the SDK to connect to a workspace, see the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py#workspace).

**Using the CLI**

When using the CLI, use the `-w` or `--workspace-name` parameter to specify the workspace for the command.

**Using VS Code**

When using VS Code, the workspace is selected using a graphical interface. For more information, see [Deploy and manage models](how-to-vscode-tools.md#deploy-and-manage-models) in the VS Code extension documentation.

## <a id="registermodel"></a> Register your model

A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register them as a single model in the workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.

> [!TIP]
> When registering a model, you provide either a path to a cloud location (from a training run) or a local directory. This path is just to locate the files for upload as part of the registration process; it does not need to match the path used in the entry script. For more information, see [What is get_model_path](#what-is-get_model_path).

Machine learning models are registered in your Azure Machine Learning workspace. The model can come from Azure Machine Learning or can come from somewhere else. The following examples demonstrate how to register a model:

### Register a model from an Experiment Run

The code snippets in this section demonstrate registering a model from a training run:

> [!IMPORTANT]
> These snippets assume that you have previously performed a training run and have access to the `run` object (SDK example) or run ID value (CLI example). For more information on training models, see [Create and use compute targets for model training](how-to-set-up-training-targets.md).

+ **Using the SDK**

  ```python
  model = run.register_model(model_name='sklearn_mnist', model_path='outputs/sklearn_mnist_model.pkl')
  print(model.name, model.id, model.version, sep='\t')
  ```

  The `model_path` refers to the cloud location of the model. In this example, the path to a single file is used. To include multiple files in the model registration, set `model_path` to the directory that contains the files.

+ **Using the CLI**

  ```azurecli-interactive
  az ml model register -n sklearn_mnist  --asset-path outputs/sklearn_mnist_model.pkl  --experiment-name myexperiment --run-id myrunid
  ```

  [!INCLUDE [install extension](../../../includes/machine-learning-service-install-extension.md)]

  The `--asset-path` refers to the cloud location of the model. In this example, the path to a single file is used. To include multiple files in the model registration, set `--asset-path` to the directory that contains the files.

+ **Using VS Code**

  Register models using any model files or folders with the [VS Code](how-to-vscode-tools.md#deploy-and-manage-models) extension.

### Register a model from a local file

You can register a model by providing a **local path** to the model. You can provide either a folder or a single file. You can use this method to register both models trained with Azure Machine Learning service and then downloaded, or models trained outside Azure Machine Learning.

[!INCLUDE [trusted models](../../../includes/machine-learning-service-trusted-model.md)]

+ **ONNX example with the Python SDK:**

    ```python
    import os
    import urllib.request
    from azureml.core import Model
    # Download model
    onnx_model_url = "https://www.cntk.ai/OnnxModels/mnist/opset_7/mnist.tar.gz"
    urllib.request.urlretrieve(onnx_model_url, filename="mnist.tar.gz")
    os.system('tar xvzf mnist.tar.gz')
    # Register model
    model = Model.register(workspace = ws,
                            model_path ="mnist/model.onnx",
                            model_name = "onnx_mnist",
                            tags = {"onnx": "demo"},
                            description = "MNIST image classification CNN from ONNX Model Zoo",)
    ```

  To include multiple files in the model registration, set `model_path` to the directory that contains the files.

+ **Using the CLI**

  ```azurecli-interactive
  az ml model register -n onnx_mnist -p mnist/model.onnx
  ```

  To include multiple files in the model registration, set `-p` to the directory that contains the files.

**Time estimate**: Approximately 10 seconds.

For more information, see the reference documentation for the [Model class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

For more information on working with models trained outside Azure Machine Learning service, see [How to deploy an existing model](how-to-deploy-existing-model.md).

<a name="target"></a>

## Choose a compute target

The following compute targets, or compute resources, can be used to host your web service deployment. 

[!INCLUDE [aml-compute-target-deploy](../../../includes/aml-compute-target-deploy.md)]

## Prepare to deploy

To deploy as a web service, you must create an inference configuration (`InferenceConfig`) and a deployment configuration. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data. In the inference config, you specify the scripts and dependencies needed to serve your model. In the deployment config you specify details of how to serve the model on the compute target.

> [!IMPORTANT]
> The Azure Machine Learning SDK does not provide a way for web service or IoT Edge deployments to access your datastore or data sets. If you need the deployed model to access data stored outside the deployment, such as in an Azure Storage account, you must develop a custom code solution using the relevant SDK. For example, the [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python).
>
> Another alternative that may work for your scenario is [batch predictions](how-to-run-batch-predictions.md), which does provide access to datastores when scoring.

### <a id="script"></a> 1. Define your entry script & dependencies

The entry script receives data submitted to a deployed web service, and passes it to the model. It then takes the response returned by the model and returns that to the client. **The script is specific to your model**; it must understand the data that the model expects and returns.

The script contains two functions that load and run the model:

* `init()`: Typically this function loads the model into a global object. This function is run only once when the Docker container for your web service is started.

* `run(input_data)`: This function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON for serialization and de-serialization. You can also work with raw binary data. You can transform the data before sending to the model, or before returning to the client.

#### What is get_model_path?

When you register a model, you provide a model name used for managing the model in the registry. You use this name with the [Model.get_model_path()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#get-model-path-model-name--version-none---workspace-none-) to retrieve the path of the model file(s) on the local file system. If you register a folder or a collection of files, this API returns the path to the directory that contains those files.

When you register a model, you give it a name, which corresponds to where the model is placed, either locally or during service deployment.

The below example will return a path to a single file called `sklearn_mnist_model.pkl` (which was registered with the name `sklearn_mnist`):

```python
model_path = Model.get_model_path('sklearn_mnist')
```

#### (Optional) Automatic schema generation

To automatically generate a schema for your web service, provide a sample of the input and/or output in the constructor for one of the defined type objects, and the type and sample are used to automatically create the schema. Azure Machine Learning service then creates an [OpenAPI](https://swagger.io/docs/specification/about/) (Swagger) specification for the web service during deployment.

The following types are currently supported:

* `pandas`
* `numpy`
* `pyspark`
* standard Python object

To use schema generation, include the `inference-schema` package in your conda environment file.

##### Example dependencies file

The following YAML is an example of a Conda dependencies file for inference:

```YAML
name: project_environment
dependencies:
  - python=3.6.2
  - pip:
    - azureml-defaults
    - scikit-learn==0.20.0
    - inference-schema[numpy-support]
```

If you want to use automatic schema generation, your entry script **must** import the `inference-schema` packages.

Define the input and output sample formats in the `input_sample` and `output_sample` variables, which represent the request and response formats for the web service. Use these samples in the input and output function decorators on the `run()` function. The scikit-learn example below uses schema generation.

##### Example entry script

The following example demonstrates how to accept and return JSON data:

```python
#example: scikit-learn and Swagger
import json
import numpy as np
from sklearn.externals import joblib
from sklearn.linear_model import Ridge
from azureml.core.model import Model

from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.numpy_parameter_type import NumpyParameterType


def init():
    global model
    # note here "sklearn_regression_model.pkl" is the name of the model registered under
    # this is a different behavior than before when the code is run locally, even though the code is the same.
    model_path = Model.get_model_path('sklearn_regression_model.pkl')
    # deserialize the model file back into a sklearn model
    model = joblib.load(model_path)


input_sample = np.array([[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]])
output_sample = np.array([3726.995])


@input_schema('data', NumpyParameterType(input_sample))
@output_schema(NumpyParameterType(output_sample))
def run(data):
    try:
        result = model.predict(data)
        # you can return any datatype as long as it is JSON-serializable
        return result.tolist()
    except Exception as e:
        error = str(e)
        return error
```

The following example demonstrates how to define the input data as a `<key: value>` dictionary, using a Dataframe. This method is supported for consuming the deployed web service from Power BI ([Learn more about how to consume the web service from Power BI](https://docs.microsoft.com/power-bi/service-machine-learning-integration)):

```python
import json
import pickle
import numpy as np
import pandas as pd
import azureml.train.automl
from sklearn.externals import joblib
from azureml.core.model import Model

from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.numpy_parameter_type import NumpyParameterType
from inference_schema.parameter_types.pandas_parameter_type import PandasParameterType


def init():
    global model
    # replace model_name with your actual model name, if needed
    model_path = Model.get_model_path('model_name')
    # deserialize the model file back into a sklearn model
    model = joblib.load(model_path)


input_sample = pd.DataFrame(data=[{
    # This is a decimal type sample. Use the data type that reflects this column in your data
    "input_name_1": 5.1,
    # This is a string type sample. Use the data type that reflects this column in your data
    "input_name_2": "value2",
    # This is a integer type sample. Use the data type that reflects this column in your data
    "input_name_3": 3
}])

# This is a integer type sample. Use the data type that reflects the expected result
output_sample = np.array([0])


@input_schema('data', PandasParameterType(input_sample))
@output_schema(NumpyParameterType(output_sample))
def run(data):
    try:
        result = model.predict(data)
        # you can return any datatype as long as it is JSON-serializable
        return result.tolist()
    except Exception as e:
        error = str(e)
        return error
```

For more example scripts, see the following examples:

* Pytorch: [https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-pytorch](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-pytorch)
* TensorFlow: [https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow)
* Keras: [https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras)
* ONNX: [https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/onnx/](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/onnx/)

<a id="binary"></a>

#### Binary data

If your model accepts binary data, such as an image, you must modify the `score.py` file used for your deployment to accept raw HTTP requests. To accept raw data, use the `AMLRequest` class in your entry script and add the `@rawhttp` decorator to the `run()` function.

Here's an example of a `score.py` that accepts binary data:

```python
from azureml.contrib.services.aml_request import AMLRequest, rawhttp
from azureml.contrib.services.aml_response import AMLResponse


def init():
    print("This is init()")


@rawhttp
def run(request):
    print("This is run()")
    print("Request: [{0}]".format(request))
    if request.method == 'GET':
        # For this example, just return the URL for GETs
        respBody = str.encode(request.full_path)
        return AMLResponse(respBody, 200)
    elif request.method == 'POST':
        reqBody = request.get_data(False)
        # For a real world solution, you would load the data from reqBody
        # and send to the model. Then return the response.

        # For demonstration purposes, this example just returns the posted data as the response.
        return AMLResponse(reqBody, 200)
    else:
        return AMLResponse("bad request", 500)
```

> [!IMPORTANT]
> The `AMLRequest` class is in the `azureml.contrib` namespace. Things in this namespace change frequently as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.
>
> If you need to test this on your local development environment, you can install the components by using the following command:
>
> ```shell
> pip install azureml-contrib-services
> ```

<a id="cors"></a>

#### Cross-origin resource sharing (CORS)

Cross-origin resource sharing is a way to allow resources on a web page to be requested from another domain. CORS works based on HTTP headers sent with the client request and returned with the service response. For more information on CORS and valid headers, see [Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) on Wikipedia.

To configure your model deployment to support CORS, use the `AMLResponse` class in your entry script. This class allows you to set the headers on the response object.

The following example sets the `Access-Control-Allow-Origin` header for the response from the entry script:

```python
from azureml.contrib.services.aml_response import AMLResponse

def init():
    print("This is init()")

def run(request):
    print("This is run()")
    print("Request: [{0}]".format(request))
    if request.method == 'GET':
        # For this example, just return the URL for GETs
        respBody = str.encode(request.full_path)
        return AMLResponse(respBody, 200)
    elif request.method == 'POST':
        reqBody = request.get_data(False)
        # For a real world solution, you would load the data from reqBody
        # and send to the model. Then return the response.

        # For demonstration purposes, this example
        # adds a header and returns the request body
        resp = AMLResponse(reqBody, 200)
        resp.headers['Access-Control-Allow-Origin'] = "http://www.example.com"
        return resp
    else:
        return AMLResponse("bad request", 500)
```

> [!IMPORTANT]
> The `AMLResponse` class is in the `azureml.contrib` namespace. Things in this namespace change frequently as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.
>
> If you need to test this on your local development environment, you can install the components by using the following command:
>
> ```shell
> pip install azureml-contrib-services
> ```

### 2. Define your InferenceConfig

The inference configuration describes how to configure the model to make predictions. The following example demonstrates how to create an inference configuration. This configuration specifies the runtime, the entry script, and (optionally) the conda environment file:

```python
inference_config = InferenceConfig(runtime="python",
                                   entry_script="x/y/score.py",
                                   conda_file="env/myenv.yml")
```

For more information, see the [InferenceConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) class reference.

For information on using a custom Docker image with inference configuration, see [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md).

### CLI example of InferenceConfig

[!INCLUDE [inference config](../../../includes/machine-learning-service-inference-config.md)]

The following command demonstrates how to deploy a model using the CLI:

```azurecli-interactive
az ml model deploy -n myservice -m mymodel:1 --ic inferenceconfig.json
```

In this example, the configuration contains the following items:

* That this model requires Python
* The [entry script](#script), which is used to handle web requests sent to the deployed service
* The conda file that describes the Python packages needed to inference

For information on using a custom Docker image with inference configuration, see [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md).

### 3. Define your Deployment configuration

Before deploying, you must define the deployment configuration. __The deployment configuration is specific to the compute target that will host the web service__. For example, when deploying locally you must specify the port where the service accepts requests.

You may also need to create the compute resource. For example, if you do not already have an Azure Kubernetes Service associated with your workspace.

The following table provides an example of creating a deployment configuration for each compute target:

| Compute target | Deployment configuration example |
| ----- | ----- |
| Local | `deployment_config = LocalWebservice.deploy_configuration(port=8890)` |
| Azure Container Instance | `deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |
| Azure Kubernetes Service | `deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |

> [!TIP]
> Prior to deploying your model as a service, you may want to profile it to determine optimal CPU and memory requirements. You can profile your model using either the SDK or CLI. For more information, see the [profile()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#profile-workspace--profile-name--models--inference-config--input-data-) and [az ml model profile](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/model?view=azure-cli-latest#ext-azure-cli-ml-az-ml-model-profile) reference.
>
> Model profiling results are emitted as a `Run` object. For more information, see the [ModelProfile](https://docs.microsoft.com/python/api/azureml-core/azureml.core.profile.modelprofile?view=azure-ml-py) class reference.

## Deploy to target

Deployment uses the inference configuration deployment configuration to deploy the models. The deployment process is similar regardless of the compute target. Deploying to AKS is slightly different, as you must provide a reference to the AKS cluster.

### <a id="local"></a> Local deployment

To deploy locally, you need to have Docker installed on your local machine.

#### Using the SDK

```python
deployment_config = LocalWebservice.deploy_configuration(port=8890)
service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output = True)
print(service.state)
```

For more information, see the reference documentation for [LocalWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.local.localwebservice?view=azure-ml-py), [Model.deploy()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config--deployment-config-none--deployment-target-none-), and [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice?view=azure-ml-py).

#### Using the CLI

To deploy using the CLI, use the following command. Replace `mymodel:1` with the name and version of the registered model:

```azurecli-interactive
az ml model deploy -m mymodel:1 -ic inferenceconfig.json -dc deploymentconfig.json
```

[!INCLUDE [aml-local-deploy-config](../../../includes/machine-learning-service-local-deploy-config.md)]

For more information, see the [az ml model deploy](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/model?view=azure-cli-latest#ext-azure-cli-ml-az-ml-model-deploy) reference.

### <a id="notebookvm"></a> NotebookVM web service (DEVTEST)

See [Deploy a model to Notebook VMs](how-to-deploy-local-container-notebook-vm.md).

### <a id="aci"></a> Azure Container Instances (DEVTEST)

See [Deploy to Azure Container Instances](how-to-deploy-azure-container-instance.md).

### <a id="aks"></a>Azure Kubernetes Service (DEVTEST & PRODUCTION)

See [Deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md).

## Consume web services

Every deployed web service provides a REST API, so you can create client applications in a variety of programming languages. 
If you have enabled key authentication for your service, you need to provide a service key as a token in your request header.
If you have enabled token authentication for your service, you need to provide an Azure Machine Learning JWT token as a bearer token in your request header.

> [!TIP]
> You can retrieve the schema JSON document after deploying the service. Use the [swagger_uri property](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.local.localwebservice?view=azure-ml-py#swagger-uri) from the deployed web service, such as `service.swagger_uri`, to get the URI to the local web service's Swagger file.

### Request-response consumption

Here is an example of how to invoke your service in Python:
```python
import requests
import json

headers = {'Content-Type': 'application/json'}

if service.auth_enabled:
    headers['Authorization'] = 'Bearer '+service.get_keys()[0]
elif service.token_auth_enabled:
    headers['Authorization'] = 'Bearer '+service.get_token()[0]

print(headers)

test_sample = json.dumps({'data': [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
]})

response = requests.post(
    service.scoring_uri, data=test_sample, headers=headers)
print(response.status_code)
print(response.elapsed)
print(response.json())
```

For more information, see [Create client applications to consume webservices](how-to-consume-web-service.md).

### Web service schema (OpenAPI specification)

If you used the automatic schema generation with the deployment, you can get the address of the OpenAPI specification for the service by using the [swagger_uri property](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.local.localwebservice?view=azure-ml-py#swagger-uri). For example, `print(service.swagger_uri)`. Use a GET request (or open the URI in a browser) to retrieve the specification.

The following JSON document is an example of a schema (OpenAPI specification) generated for a deployment:

```json
{
    "swagger": "2.0",
    "info": {
        "title": "myservice",
        "description": "API specification for the Azure Machine Learning service myservice",
        "version": "1.0"
    },
    "schemes": [
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "For example: Bearer abc123"
        }
    },
    "paths": {
        "/": {
            "get": {
                "operationId": "ServiceHealthCheck",
                "description": "Simple health check endpoint to ensure the service is up at any given point.",
                "responses": {
                    "200": {
                        "description": "If service is up and running, this response will be returned with the content 'Healthy'",
                        "schema": {
                            "type": "string"
                        },
                        "examples": {
                            "application/json": "Healthy"
                        }
                    },
                    "default": {
                        "description": "The service failed to execute due to an error.",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/score": {
            "post": {
                "operationId": "RunMLService",
                "description": "Run web service's model and get the prediction output",
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "serviceInputPayload",
                        "in": "body",
                        "description": "The input payload for executing the real-time machine learning service.",
                        "schema": {
                            "$ref": "#/definitions/ServiceInput"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The service processed the input correctly and provided a result prediction, if applicable.",
                        "schema": {
                            "$ref": "#/definitions/ServiceOutput"
                        }
                    },
                    "default": {
                        "description": "The service failed to execute due to an error.",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "ServiceInput": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                }
            },
            "example": {
                "data": [
                    [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
                ]
            }
        },
        "ServiceOutput": {
            "type": "array",
            "items": {
                "type": "number",
                "format": "double"
            },
            "example": [
                3726.995
            ]
        },
        "ErrorResponse": {
            "type": "object",
            "properties": {
                "status_code": {
                    "type": "integer",
                    "format": "int32"
                },
                "message": {
                    "type": "string"
                }
            }
        }
    }
}
```

For more information on the specification, see the [Open API specification](https://swagger.io/specification/).

For a utility that can create client libraries from the specification, see [swagger-codegen](https://github.com/swagger-api/swagger-codegen).

### <a id="azuremlcompute"></a> Batch inference
Azure Machine Learning Compute targets are created and managed by the Azure Machine Learning service. They can be used for batch prediction from Azure Machine Learning Pipelines.

For a walkthrough of batch inference with Azure Machine Learning Compute, read the [How to Run Batch Predictions](how-to-run-batch-predictions.md) article.

### <a id="iotedge"></a> IoT Edge inference
Support for deploying to the edge is in preview. For more information, see the  [Deploy Azure Machine Learning as an IoT Edge module](https://docs.microsoft.com/azure/iot-edge/tutorial-deploy-machine-learning) article.


## <a id="update"></a> Update web services

[!INCLUDE [aml-update-web-service](../../../includes/machine-learning-update-web-service.md)]

## Continuous model deployment 

You can continuously deploy models using the Machine Learning extension for [Azure DevOps](https://azure.microsoft.com/services/devops/). By using the Machine Learning extension for Azure DevOps, you can trigger a deployment pipeline when a new machine learning model is registered in Azure Machine Learning service workspace. 

1. Sign up for [Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops), which makes continuous integration and delivery of your application to any platform/any cloud possible. Azure Pipelines [differs from ML pipelines](concept-ml-pipelines.md#compare). 

1. [Create an Azure DevOps project.](https://docs.microsoft.com/azure/devops/organizations/projects/create-project?view=azure-devops)

1. Install the [Machine Learning extension for Azure Pipelines](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.vss-services-azureml&targetId=6756afbe-7032-4a36-9cb6-2771710cadc2&utm_source=vstsproduct&utm_medium=ExtHubManageList) 

1. Use __service Connections__ to set up a service principal connection to your Azure Machine Learning service workspace to access all your artifacts. Go to project settings, click on service connections, and select Azure Resource Manager.

    ![view-service-connection](media/how-to-deploy-and-where/view-service-connection.png) 

1. Define AzureMLWorkspace as the __scope level__ and fill in the subsequent parameters.

    ![view-azure-resource-manager](media/how-to-deploy-and-where/resource-manager-connection.png)

1. Next, to continuously deploy your machine learning model using the Azure Pipelines, under pipelines select __release__. Add a new artifact, select AzureML Model artifact and the service connection that was created in the earlier step. Select the model and version to trigger a deployment. 

    ![select-AzureMLmodel-artifact](media/how-to-deploy-and-where/enable-modeltrigger-artifact.png)

1. Enable the model trigger on your model artifact. By turning on the trigger, every time the specified version (i.e the newest version) of that model is register in your workspace, an Azure DevOps release pipeline is triggered. 

    ![enable-model-trigger](media/how-to-deploy-and-where/set-modeltrigger.png)

For more sample projects and examples, see the following sample repos:

* [https://github.com/Microsoft/MLOps](https://github.com/Microsoft/MLOps)
* [https://github.com/Microsoft/MLOpsPython](https://github.com/microsoft/MLOpsPython)

## Clean up resources
To delete a deployed web service, use `service.delete()`.
To delete a registered model, use `model.delete()`.

For more information, see the reference documentation for [WebService.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#delete--), and [Model.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#delete--).

## Next steps
* [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md)
* [Deployment troubleshooting](how-to-troubleshoot-deployment.md)
* [Secure Azure Machine Learning web services with SSL](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)

