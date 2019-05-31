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
ms.date: 05/31/2019

ms.custom: seoapril2019
---

# Deploy models with the Azure Machine Learning service

Learn how to deploy your machine learning model as a web service in the Azure cloud, or to IoT Edge devices. 

The workflow is similar regardless of [where you deploy](#target) your model:

1. Register the model.
1. Prepare to deploy (specify assets, usage, compute target)
1. Deploy the model to the compute target.
1. Test the deployed model, also called web service.

For more information on the concepts involved in the deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning Service](concept-model-management-and-deployment.md).

## Prerequisites

- A model. If you do not have a trained model, you can use the model & dependency files provided in [this tutorial](https://aka.ms/azml-deploy-cloud).

- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](https://aka.ms/aml-sdk), or the [Azure Machine Learning Visual Studio Code extension](how-to-vscode-tools.md).

## <a id="registermodel"></a> Register your model

Register your machine learning models in your Azure Machine Learning workspace. The model can come from Azure Machine Learning or can come from somewhere else. The following examples demonstrate how to register a model from file:

### Register a model from an Experiment Run

+ **Scikit-Learn example using the SDK**
  ```python
  model = run.register_model(model_name='sklearn_mnist', model_path='outputs/sklearn_mnist_model.pkl')
  print(model.name, model.id, model.version, sep='\t')
  ```
+ **Using the CLI**
  ```azurecli-interactive
  az ml model register -n sklearn_mnist  --asset-path outputs/sklearn_mnist_model.pkl  --experiment-name myexperiment
  ```


+ **Using VS Code**

  Register models using any model files or folders with the [VS Code](how-to-vscode-tools.md#deploy-and-manage-models) extension.

### Register an externally created model

[!INCLUDE [trusted models](../../../includes/machine-learning-service-trusted-model.md)]

You can register an externally created model by providing a **local path** to the model. You can provide either a folder or a single file.

+ **ONNX example with the Python SDK:**
  ```python
  onnx_model_url = "https://www.cntk.ai/OnnxModels/mnist/opset_7/mnist.tar.gz"
  urllib.request.urlretrieve(onnx_model_url, filename="mnist.tar.gz")
  !tar xvzf mnist.tar.gz
  
  model = Model.register(workspace = ws,
                         model_path ="mnist/model.onnx",
                         model_name = "onnx_mnist",
                         tags = {"onnx": "demo"},
                         description = "MNIST image classification CNN from ONNX Model Zoo",)
  ```

+ **Using the CLI**
  ```azurecli-interactive
  az ml model register -n onnx_mnist -p mnist/model.onnx
  ```

**Time estimate**: Approximately 10 seconds.

For more information, see the reference documentation for the [Model class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

<a name="target"></a>

## Choose a compute target

The following compute targets, or compute resources, can be used to host your web service deployment. 

| Compute target | Usage | Description |
| ----- | ----- | ----- |
| [Local web service](#local) | Testing/debug | Good for limited testing and troubleshooting.
| [Azure Kubernetes Service (AKS)](#aks) | Real-time inference | Good for high-scale production deployments. Provides autoscaling, and fast response times. |
| [Azure Container Instances (ACI)](#aci) | Testing | Good for low scale, CPU-based workloads. |
| [Azure Machine Learning Compute](how-to-run-batch-predictions.md) | Batch inference | Run batch inference on serverless compute. Supports normal and low-priority VMs. |
| [Azure IoT Edge](#iotedge) | (Preview) IoT module | Deploy & serve ML models on IoT devices. |


## Prepare to deploy

To deploy as a web service, you must create an inference configuration (`InferenceConfig`) and a deployment configuration. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data. In the inference config, you specify the scripts and dependencies needed to serve your model. In the deployment config you specify details of how to serve the model on the compute target.


### <a id="script"></a> 1. Define your entry script & dependencies

The entry script receives data submitted to a deployed web service, and passes it to the model. It then takes the response returned by the model and returns that to the client. **The script is specific to your model**; it must understand the data that the model expects and returns.

The script contains two functions that load and run the model:

* `init()`: Typically this function loads the model into a global object. This function is run only once when the Docker container for your web service is started.

* `run(input_data)`: This function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON for serialization and de-serialization. You can also work with raw binary data. You can transform the data before sending to the model, or before returning to the client.

#### (Optional) Automatic Swagger schema generation

To automatically generate a schema for your web service, provide a sample of the input and/or output in the constructor for one of the defined type objects, and the type and sample are used to automatically create the schema. Azure Machine Learning service then creates an [OpenAPI](https://swagger.io/docs/specification/about/) (Swagger) specification for the web service during deployment.

The following types are currently supported:

* `pandas`
* `numpy`
* `pyspark`
* standard Python object

To use schema generation, include the `inference-schema` package in your conda environment file. The following example uses `[numpy-support]` since the entry script uses a numpy parameter type: 

#### Example dependencies file
The following YAML is an example of a Conda dependencies file for inference.

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

> [!TIP]
> After deploying the service, use the `swagger_uri` property to retrieve the schema JSON document.

#### Example entry script

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

input_sample = np.array([[10,9,8,7,6,5,4,3,2,1]])
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

For more example scripts, see the following examples:

* Pytorch: [https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-pytorch](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-pytorch)
* TensorFlow: [https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow)
* Keras: [https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras)
* ONNX: [https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/onnx/](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/onnx/)
* Scoring against binary data: [How to consume a web service](how-to-consume-web-service.md)

### 2. Define your InferenceConfig

The inference configuration describes how to configure the model to make predictions. The following example demonstrates how to create an inference configuration:

```python
inference_config = InferenceConfig(source_directory="C:/abc",
                                   runtime= "python",
                                   entry_script="x/y/score.py",
                                   conda_file="env/myenv.yml")
```

In this example, the configuration contains the following items:

* A directory that contains assets needed to inference
* That this model requires Python
* The [entry script](#script), which is used to handle web requests sent to the deployed service
* The conda file that describes the Python packages needed to inference

For information on InferenceConfig functionality, see the [Advanced configuration](#advanced-config) section.

### 3. Define your Deployment configuration

Before deploying, you must define the deployment configuration. The deployment configuration is specific to the compute target that will host the web service. For example, when deploying locally you must specify the port where the service accepts requests.

You may also need to create the compute resource. For example, if you do not already have an Azure Kubernetes Service associated with your workspace.

The following table provides an example of creating a deployment configuration for each compute target:

| Compute target | Deployment configuration example |
| ----- | ----- |
| Local | `deployment_config = LocalWebservice.deploy_configuration(port=8890)` |
| Azure Container Instance | `deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |
| Azure Kubernetes Service | `deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |

The following sections demonstrate how to create the deployment configuration, and then use it to deploy the web service.

## Deploy to target

### <a id="local"></a> Local deployment

To deploy locally, you need to have **Docker installed** on your local machine.

+ **Using the SDK**

  ```python
  deployment_config = LocalWebservice.deploy_configuration(port=8890)
  service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
  service.wait_for_deployment(show_output = True)
  print(service.state)
  ```

+ **Using the CLI**

  ```azurecli-interactive
  az ml model deploy -m sklearn_mnist:1 -ic inferenceconfig.json -dc deploymentconfig.json
  ```

### <a id="aci"></a> Azure Container Instances (DEVTEST)

Use Azure Container Instances for deploying your models as a web service if one or more of the following conditions is true:
- You need to quickly deploy and validate your model.
- You are testing a model that is under development. 

To see quota and region availability for ACI, see the [Quotas and region availability for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-quotas) article.

+ **Using the SDK**

  ```python
  deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
  service = Model.deploy(ws, "aciservice", [model], inference_config, deployment_config)
  service.wait_for_deployment(show_output = True)
  print(service.state)
  ```

+ **Using the CLI**

  ```azurecli-interactive
  az ml model deploy -m sklearn_mnist:1 -n aciservice -ic inferenceconfig.json -dc deploymentconfig.json
  ```


+ **Using VS Code**

  To [deploy your models with VS Code](how-to-vscode-tools.md#deploy-and-manage-models) you don't need to create an ACI container to test in advance, because ACI containers are created on the fly.

For more information, see the reference documentation for the [AciWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py) and [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice?view=azure-ml-py) classes.

### <a id="aks"></a>Azure Kubernetes Service (DEVTEST & PRODUCTION)

You can use an existing AKS cluster or create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

<a id="deploy-aks"></a>

If you already have an AKS cluster attached, you can deploy to it. If you haven't created or attached an AKS cluster, follow the process to <a href="#create-attach-aks">create a new AKS cluster</a>.

+ **Using the SDK**

  ```python
  aks_target = AksCompute(ws,"myaks")
  # If deploying to a cluster configured for dev/test, ensure that it was created with enough
  # cores and memory to handle this deployment configuration. Note that memory is also used by
  # things such as dependencies and AML components.
  deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
  service = Model.deploy(ws, "aksservice", [model], inference_config, deployment_config, aks_target)
  service.wait_for_deployment(show_output = True)
  print(service.state)
  print(service.get_logs())
  ```

+ **Using the CLI**

  ```azurecli-interactive
  az ml model deploy -ct myaks -m mymodel:1 -n aksservice -ic inferenceconfig.json -dc deploymentconfig.json
  ```

+ **Using VS Code**

  You can also [deploy to AKS via the VS Code extension](how-to-vscode-tools.md#deploy-and-manage-models), but you'll need to configure AKS clusters in advance.

Learn more about AKS deployment and autoscale in the [AksWebservice.deploy_configuration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice) reference.

#### Create a new AKS cluster<a id="create-attach-aks"></a>
**Time estimate:** Approximately 5 minutes.

Creating or attaching an AKS cluster is a one time process for your workspace. You can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, you must create a new cluster the next time you need to deploy. You can have multiple AKS clusters attached to your workspace.

If you want to create an AKS cluster for development, validation, and testing, you set `cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST` when using [`provisioning_configuration()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py). A cluster created with this setting will only have one node.

> [!IMPORTANT]
> Setting `cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST` creates an AKS cluster that is not suitable for handling production traffic. Inference times may be longer than on a cluster created for production. Fault tolerance is also not guaranteed for dev/test clusters.
>
> We recommend that clusters created for dev/test use at least two virtual CPUs.

The following example demonstrates how to create a new Azure Kubernetes Service cluster:

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (you can also provide parameters to customize this).
# For example, to create a dev/test cluster, use:
# prov_config = AksCompute.provisioning_configuration(cluster_purpose = AksComputee.ClusterPurpose.DEV_TEST)
prov_config = AksCompute.provisioning_configuration()

aks_name = 'myaks'
# Create the cluster
aks_target = ComputeTarget.create(workspace = ws,
                                    name = aks_name,
                                    provisioning_configuration = prov_config)

# Wait for the create process to complete
aks_target.wait_for_completion(show_output = True)
```

For more information on creating an AKS cluster outside of the Azure Machine Learning SDK, see the following articles:
* [Create an AKS cluster](https://docs.microsoft.com/cli/azure/aks?toc=%2Fazure%2Faks%2FTOC.json&bc=%2Fazure%2Fbread%2Ftoc.json&view=azure-cli-latest#az-aks-create)
* [Create an AKS cluster (portal)](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal?view=azure-cli-latest)

For more information on the `cluster_purpose` parameter, see the [AksCompute.ClusterPurpose](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute.clusterpurpose?view=azure-ml-py) reference.

> [!IMPORTANT]
> For [`provisioning_configuration()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py), if you pick custom values for agent_count and vm_size, then you need to make sure agent_count multiplied by vm_size is greater than or equal to 12 virtual CPUs. For example, if you use a vm_size of "Standard_D3_v2", which has 4 virtual CPUs, then you should pick an agent_count of 3 or greater.

**Time estimate**: Approximately 20 minutes.

#### Attach an existing AKS cluster

If you already have AKS cluster in your Azure subscription, and it is version 1.12.##, you can use it to deploy your image.

> [!WARNING]
> When attaching an AKS cluster to a workspace, you can define how you will use the cluster by setting the `cluster_purpose` parameter.
>
> If you do not set the `cluster_purpose` parameter, or set `cluster_purpose = AksCompute.ClusterPurpose.FAST_PROD`, then the cluster must have at least 12 virtual CPUs available.
>
> If you set `cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST`, then the cluster does not need to have 12 virtual CPUs. However a cluster that is configured for dev/test will not be suitable for production level traffic and may increase inference times.

The following code demonstrates how to attach an existing AKS 1.12.## cluster to your workspace:

```python
from azureml.core.compute import AksCompute, ComputeTarget
# Set the resource group that contains the AKS cluster and the cluster name
resource_group = 'myresourcegroup'
cluster_name = 'mycluster'

# Attach the cluster to your workgroup. If the cluster has less than 12 virtual CPUs, use the following instead:
# attach_config = AksCompute.attach_configuration(resource_group = resource_group,
#                                         cluster_name = cluster_name,
#                                         cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST)
attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                         cluster_name = cluster_name)
aks_target = ComputeTarget.attach(ws, 'mycompute', attach_config)
```

For more information on `attack_configuration()`, see the [AksCompute.attach_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py#attach-configuration-resource-group-none--cluster-name-none--resource-id-none--cluster-purpose-none-) reference.

For more information on the `cluster_purpose` parameter, see the [AksCompute.ClusterPurpose](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute.clusterpurpose?view=azure-ml-py) reference.

## Consume web services

Every deployed web service provides a REST API, so you can create client applications in a variety of programming languages. 
If you have enabled authentication for your service, you need to provide a service key as a token in your request header.

### Request-response consumption

Here is an example of how to invoke your service in Python:
```python
import requests
import json

headers = {'Content-Type':'application/json'}

if service.auth_enabled:
    headers['Authorization'] = 'Bearer '+service.get_keys()[0]

print(headers)
    
test_sample = json.dumps({'data': [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]})

response = requests.post(service.scoring_uri, data=test_sample, headers=headers)
print(response.status_code)
print(response.elapsed)
print(response.json())
```

For more information, see [Create client applications to consume webservices](how-to-consume-web-service.md).


### <a id="azuremlcompute"></a> Batch inference
Azure Machine Learning Compute targets are created and managed by the Azure Machine Learning service. They can be used for batch prediction from Azure Machine Learning Pipelines.

For a walkthrough of batch inference with Azure Machine Learning Compute, read the [How to Run Batch Predictions](how-to-run-batch-predictions.md) article.

### <a id="iotedge"></a> IoT Edge inference
Support for deploying to the edge is in preview. For more information, see the  [Deploy Azure Machine Learning as an IoT Edge module](https://docs.microsoft.com/azure/iot-edge/tutorial-deploy-machine-learning) article.


## <a id="update"></a> Update web services

When you create a new model, you must manually update each service that you want to use the new model. To update the web service, use the `update` method. The following code demonstrates how to update the web service to use a new model:

```python
from azureml.core.webservice import Webservice
from azureml.core.model import Model

# register new model
new_model = Model.register(model_path = "outputs/sklearn_mnist_model.pkl",
                       model_name = "sklearn_mnist",
                       tags = {"key": "0.1"},
                       description = "test",
                       workspace = ws)

service_name = 'myservice'
# Retrieve existing service
service = Webservice(name = service_name, workspace = ws)

# Update to new model(s)
service.update(models = [new_model])
print(service.state)
print(service.get_logs())
```

<a id="advanced-config"></a>

## Advanced settings 

**<a id="customimage"></a> Use a custom base image**

Internally, InferenceConfig creates a Docker image that contains the model and other assets needed by the service. If not specified, a default base image is used.

When creating an image to use with your inference configuration, the image must meet the following requirements:

* Ubuntu 16.04 or greater.
* Conda 4.5.# or greater.
* Python 3.5.# or 3.6.#.

To use a custom image, set the `base_image` property of the inference configuration to the address of the image. The following example demonstrates how to use an image from both a public and private Azure Container Registry:

```python
# use an image available in public Container Registry without authentication
inference_config.base_image = "mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda"

# or, use an image available in a private Container Registry
inference_config.base_image = "myregistry.azurecr.io/mycustomimage:1.0"
inference_config.base_image_registry.address = "myregistry.azurecr.io"
inference_config.base_image_registry.username = "username"
inference_config.base_image_registry.password = "password"
```

The following image URIs are for images provided by Microsoft, and can be used without providing a user name or password value:

* `mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda`
* `mcr.microsoft.com/azureml/onnxruntime:v0.4.0`
* `mcr.microsoft.com/azureml/onnxruntime:v0.4.0-cuda10.0-cudnn7`
* `mcr.microsoft.com/azureml/onnxruntime:v0.4.0-tensorrt19.03`

To use these images, set the `base_image` to the URI from the list above. Set `base_image_registry.address` to `mcr.microsoft.com`.

> [!IMPORTANT]
> Microsoft images that use CUDA or TensorRT must be used on Microsoft Azure Services only.

For more information on uploading your own images to an Azure Container Registry, see [Push your first image to a private Docker container registry](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-docker-cli).

If your model is trained on Azure Machine Learning Compute, using __version 1.0.22 or greater__ of the Azure Machine Learning SDK, an image is created during training. The following example demonstrates how to use this image:

```python
# Use an image built during training with SDK 1.0.22 or greater
image_config.base_image = run.properties["AzureML.DerivedImageName"]
```

## Clean up resources
To delete a deployed web service, use `service.delete()`.
To delete a registered model, use `model.delete()`.

For more information, see the reference documentation for [WebService.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#delete--), and [Model.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#delete--).

## Next steps
* [Deployment troubleshooting](how-to-troubleshoot-deployment.md)
* [Secure Azure Machine Learning web services with SSL](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)

