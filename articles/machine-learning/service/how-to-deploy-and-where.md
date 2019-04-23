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
ms.date: 05/02/2019

ms.custom: seoapril2019
---

# Deploy models with the Azure Machine Learning service

Learn how to deploy your machine learning model as a web service in the Azure cloud, or to IoT Edge devices. The information in this document teaches you how to deploy to the following compute targets:

| Compute target | Deployment type | Description |
| ----- | ----- | ----- |
| [Local web service](#local) | Test/debug | Good for limited testing and troubleshooting.
| [Azure Kubernetes Service (AKS)](#aks) | Real-time inference | Good for high-scale production deployments. Provides autoscaling, and fast response times. |
| [Azure Container Instances (ACI)](#aci) | Testing | Good for development or testing. **Not suitable for production workloads.** |
| [Azure Machine Learning Compute](how-to-run-batch-predictions.md) | (Preview) Batch inference | Run batch prediction on serverless compute. Supports normal and low-priority VMs. |
| [Azure IoT Edge](#iotedge) | (Preview) IoT module | Deploy models on IoT devices. Inferencing happens on the device. |

## Deployment workflow

The process of deploying a model is similar for all compute targets:

1. Register model(s).
1. Deploy model(s).
1. Test the deployment.

For more information on the concepts involved in the deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning Service](concept-model-management-and-deployment.md).

## Prerequisites for deployment

[!INCLUDE [aml-prereq](../../../includes/aml-prereq.md)]

- To use the CLI commands, you must have the [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md).

- A trained model. If you do not have a trained model, use the steps in the [Train models](tutorial-train-models-with-aml.md) tutorial to train and register one with the Azure Machine Learning service.

    > [!NOTE]
    > While the Azure Machine Learning service can work with any generic model that can be loaded in Python 3, the examples in this document demonstrate using a model stored in Python pickle format.

## <a id="registermodel"></a> Register a machine learning model

The model registry is a way to store and organize your trained models in the Azure cloud. Models are registered in your Azure Machine Learning service workspace. The model can be trained using Azure Machine Learning, or imported from a model trained elsewhere. The following examples demonstrates how to register a model from file:

**Using the SDK**

**Scikit-learn example:**
```python
from azureml.core.model import Model

# Register the model.
# You can specify either a single file or a path to a folder which contains your model files here.
model = Model.register(model_path = "sklearn_mnist.pkl",
                       model_name = "sklearn_mnist",
                       tags = {"key": "0.1"},
                       description = "test",
                       workspace = ws)
```

**Using the CLI**

```azurecli
az ml model register -n sklearn_mnist -p sklearn_mnist_model.pkl
```

**Time estimate**: Approximately 10 seconds.

For an example of registering an ONNX model, see the [example ONNX notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/deployment/onnx).

For more information, see the reference documentation for the [Model class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

## How to deploy

To deploy as a web service, you must create an inference configuration (`InferenceConfig`) and a deployment configuration. The deployment configuration is specific to the compute target that you deploy to.


### <a id="script"></a> 1. Define your entry script & dependencies

The entry script receives data submitted to a deployed web service, and passes it to the model. It then takes the response returned by the model and returns that to the client. **The script is specific to your model**; it must understand the data that the model expects and returns.

The script contains two functions that load and run the model:

* `init()`: Typically this function loads the model into a global object. This function is run only once when the Docker container for your web service is started.

* `run(input_data)`: This function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON for serialization and de-serialization. You can also work with raw binary data. You can transform the data before sending to the model, or before returning to the client.

#### Automatic Swagger schema generation

To automatically generate a schema for your web service, provide a sample of the input and/or output in the constructor for one of the defined type objects, and the type and sample are used to automatically create the schema. This creates an [OpenAPI](https://swagger.io/docs/specification/about/) (Swagger) specification for the web service.

The following types are currently supported:

* `pandas`
* `numpy`
* `pyspark`
* standard Python object

To use schema generation, include the `inference-schema` package in your conda environment file. The following example uses `[numpy-support]` since the entry script uses a numpy parameter type: 

#### Example dependencies file
This is an example of a Conda dependencies file for inference.
```python
name: project_environment
dependencies:
  - python=3.6.2
  - pip:
    - azureml-defaults
    - scikit-learn
    - inference-schema[numpy-support]
```

The entry script **must** import the `inference-schema` packages. 

Define the input and output sample formats in the `input_sample` and `output_sample` variables, which represent the request and response formats for the web service. Use these samples in the input and output function decorators on the `run()` function. The scikit-learn example below uses schema generation.


> [!TIP]
> After deploying the service, use the `swagger_uri` property to retrieve the schema JSON document.

#### Example entry script
The following example script accepts and returns JSON data.

**Scikit-learn example with Swagger generation:**
```python
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
* Scoring against binary data: [how-to-consume-web-service.md)(click here)

### 2. Define your InferenceConfiguration

The inference configuration describes how to configure the model to make predictions. The following example demonstrates how to create an inference configuration:

```python
inference_config = InferenceConfig(source_directory="C:/abc",
                                   runtime= "python",
                                   entry_script="x/y/score.py",
                                   conda_file="env/myenv.yml")
```

In this example, the configuration contains the following items:

* A directory that contains assets needed to perform inferencing
* That this model requires Python
* The [entry script](#script), which is used to handle web requests sent to the deployed service
* The conda file that describes the Python packages needed to run inferencing

For information on advanced InferenceConfiguration functionality, please click <a href="#advanced-config">here</a>.

### 3. Define your DeploymentConfiguration

Before deploying, you must define the deployment configuration. The deployment configuration is specific to the compute target that will host the web service. For example, when deploying locally you must specify the port where the service accepts requests.

You may also need to create the compute resource. For example, if you do not already have an Azure Kubernetes Service associated with your workspace.

The following table provides an example of creating a deployment configuration for each compute target:

| Compute target | Deployment configuration example |
| ----- | ----- |
| Local | `deployment_config = LocalWebservice.deploy_configuration(port=8890)` |
| Azure Container Instance | `deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |
| Azure Kubernetes Service | `deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |

The following sections demonstrate how to create the deployment configuration, and then use it to deploy the web service.

## Where to deploy

### <a id="local"></a> Deploy locally

Local deployments are useful when testing or troubleshooting a web service.

**Using the SDK**

```python
deployment_config = LocalWebservice.deploy_configuration(port=8890)
service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output = True)
print(service.state)
```

**Using the CLI**

```azurecli
az ml model deploy -m mymodel:1 -ic inferenceconfig.json -dc deploymentconfig.json
```

### <a id="aci"></a> Deploy to Azure Container Instances (DEVTEST)

Use Azure Container Instances for deploying your models as a web service if one or more of the following conditions is true:

- You need to quickly deploy and validate your model. ACI deployment is finished in less than 5 minutes.
- You are testing a model that is under development. To see quota and region availability for ACI, see the [Quotas and region availability for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-quotas) document.

**Using the SDK**

```python
deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
service = Model.deploy(ws, "aciservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output = True)
print(service.state)
```

**Using the CLI**

```azurecli
az ml model deploy -m mymodel:1 -ic inferenceconfig.json -dc deploymentconfig.json
```

**Time estimate**: Approximately 5 minutes.

For more information, see the reference documentation for the [AciWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py) and [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice?view=azure-ml-py) classes.

### <a id="aks"></a> Deploy to Azure Kubernetes Service (PRODUCTION)

You can use an existing AKS cluster or create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.


> [!IMPORTANT]
> Creating an AKS cluster is a one time process for your workspace. You can reuse this cluster for multiple deployments.
> If you have NOT created or attached an AKS cluster go <a href="#create-attach-aks">here</a>.

#### Deploy to AKS <a id="deploy-aks"></a>

You can deploy to AKS with the Azure ML CLI:
```azurecli-interactive
az ml model deploy -ct myaks -ic inferenceconfig.json -dc deploymentconfig.json
```

You can also use the Python SDK:
```python
aks_target = AksCompute(ws,"myaks")
deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
service = Model.deploy(ws, "aksservice", [model], inference_config, deployment_config, aks_target)
service.wait_for_deployment(show_output = True)
print(service.state)
print(service.get_logs())
```

For more information on configuring your AKS deployment, including autoscale,see the [AksWebservice.deploy_configuration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice) reference.

**Time estimate:** Approximately 5 minutes.

#### Create or attach an AKS cluster <a id="create-attach-aks"></a>
Creating or attaching an AKS cluster is a **one time process** for your workspace. 
After a cluster has been associated with your workspace you can use it for multiple deployments. 

If you delete the cluster or the resource group that contains it, you must create a new cluster the next time you need to deploy.

##### Create a new AKS cluster
To create a new Azure Kubernetes Service cluster use the following code:

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (you can also provide parameters to customize this)
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


> [!IMPORTANT]
> For [`provisioning_configuration()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py), if you pick custom values for agent_count and vm_size, then you need to make sure agent_count multiplied by vm_size is greater than or equal to 12 virtual CPUs. For example, if you use a vm_size of "Standard_D3_v2", which has 4 virtual CPUs, then you should pick an agent_count of 3 or greater.

**Time estimate**: Approximately 20 minutes.

##### Attach an existing AKS cluster

If you already have AKS cluster in your Azure subscription, and it is version 1.12.## and has at least 12 virtual CPUs, you can use it to deploy your image. The following code demonstrates how to attach an existing AKS 1.12.## cluster to your workspace:

```python
from azureml.core.compute import AksCompute, ComputeTarget
# Set the resource group that contains the AKS cluster and the cluster name
resource_group = 'myresourcegroup'
cluster_name = 'mycluster'

# Attach the cluster to your workgroup
attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                         cluster_name = cluster_name)
aks_target = ComputeTarget.attach(ws, 'mycompute', attach_config)
```

## Consume web services
Every deployed web service provides a REST API, so you can create client applications in a variety of programming languages. 
If you have enabled authentication for your service, you need to provide a service key as a token in your request header.

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

## <a id="update"></a> Update the web service

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

## Clean up
To delete a deployed web service, use `service.delete()`.
To delete a registered model, use `model.delete()`.

For more information, see the reference documentation for [WebService.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#delete--), and [Model.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#delete--).

## Advanced configuration settings <a id="advanced-config"></a>

### <a id="customimage"></a> Use a custom base image

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

For more information on uploading images to an Azure Container Registry, see [Push your first image to a private Docker container registry](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-docker-cli).

If your model is trained on Azure Machine Learning Compute, using __version 1.0.22 or greater__ of the Azure Machine Learning SDK, an image is created during training. The following example demonstrates how to use this image:

```python
# Use an image built during training with SDK 1.0.22 or greater
image_config.base_image = run.properties["AzureML.DerivedImageName"]
```

## Other inference options

### <a id="azuremlcompute"></a> Batch inference
Azure Machine Learning Compute targets are created and managed by the Azure Machine Learning service. They can be used for batch prediction from Azure Machine Learning Pipelines.

For a walkthrough of batch inference with Azure Machine Learning Compute, read the [How to Run Batch Predictions](how-to-run-batch-predictions.md) document.

## <a id="iotedge"></a> Inference on IoT Edge
Support for deploying to the edge is in preview. For more info check out [this article](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-deploy-machine-learning).

## Next steps
* [Deployment troubleshooting](how-to-troubleshoot-deployment.md)
* [Secure Azure Machine Learning web services with SSL](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
