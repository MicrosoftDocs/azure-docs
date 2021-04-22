---
title: How to deploy machine learning models 
titleSuffix: Azure Machine Learning
description: 'Learn how and where to deploy machine learning models. Deploy to Azure Container Instances, Azure Kubernetes Service, Azure IoT Edge, and FPGA.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.reviewer: larryfr
ms.date: 03/25/2021
ms.topic: conceptual
ms.custom: how-to, devx-track-python, deploy, devx-track-azurecli, contperf-fy21q2
adobe-target: true
---

# Deploy machine learning models to Azure

Learn how to deploy your machine learning or deep learning model as a web service in the Azure cloud. You can also deploy to Azure IoT Edge devices.

The workflow is similar no matter where you deploy your model:

1. Register the model (optional, see below).
1. Prepare an inference configuration (unless using [no-code deployment](./how-to-deploy-no-code-deployment.md)).
1. Prepare an entry script (unless using [no-code deployment](./how-to-deploy-no-code-deployment.md)).
1. Choose a compute target.
1. Deploy the model to the compute target.
1. Test the resulting web service.

For more information on the concepts involved in the machine learning deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning](concept-model-management-and-deployment.md).

## Prerequisites

# [Azure CLI](#tab/azcli)

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- A model. If you don't have a trained model, you can use the model and dependency files provided in [this tutorial](https://aka.ms/azml-deploy-cloud).
- The [Azure Command Line Interface (CLI) extension for the Machine Learning service](reference-azure-machine-learning-cli.md).

# [Python](#tab/python)

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- A model. If you don't have a trained model, you can use the model and dependency files provided in [this tutorial](https://aka.ms/azml-deploy-cloud).
- The [Azure Machine Learning software development kit (SDK) for Python](/python/api/overview/azure/ml/intro).

---

## Connect to your workspace

# [Azure CLI](#tab/azcli)

Follow the directions in the Azure CLI documentation for [setting your subscription context](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription).

Then do:

```azurecli-interactive
az ml workspace list --resource-group=<my resource group>
```

to see the workspaces you have access to.

# [Python](#tab/python)

```python
from azureml.core import Workspace
ws = Workspace.from_config(path=".file-path/ws_config.json")
```

For more information on using the SDK to connect to a workspace, see the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro#workspace) documentation.


---


## <a id="registermodel"></a> Register your model (optional)

A registered model is a logical container for one or more files that make up your model. For example, if you have a model that's stored in multiple files, you can register them as a single model in the workspace. After you register the files, you can then download or deploy the registered model and receive all the files that you registered.

> [!TIP] 
> Registering a model for version tracking is recommended but not required. If you would rather proceed without registering a model, you will need to specify a source directory in your [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig) or [inferenceconfig.json](./reference-azure-machine-learning-cli.md#inference-configuration-schema) and ensure your model resides within that source directory.

> [!TIP]
> When you register a model, you provide the path of either a cloud location (from a training run) or a local directory. This path is just to locate the files for upload as part of the registration process. It doesn't need to match the path used in the entry script. For more information, see [Locate model files in your entry script](./how-to-deploy-advanced-entry-script.md#load-registered-models).

> [!IMPORTANT]
> When using Filter by `Tags` option on the Models page of Azure Machine Learning Studio, instead of using `TagName : TagValue` customers should use `TagName=TagValue` (without space)

The following examples demonstrate how to register a model.

# [Azure CLI](#tab/azcli)

### Register a model from an Azure ML training run

```azurecli-interactive
az ml model register -n sklearn_mnist  --asset-path outputs/sklearn_mnist_model.pkl  --experiment-name myexperiment --run-id myrunid --tag area=mnist
```

[!INCLUDE [install extension](../../includes/machine-learning-service-install-extension.md)]

The `--asset-path` parameter refers to the cloud location of the model. In this example, the path of a single file is used. To include multiple files in the model registration, set `--asset-path` to the path of a folder that contains the files.

### Register a model from a local file

```azurecli-interactive
az ml model register -n onnx_mnist -p mnist/model.onnx
```

To include multiple files in the model registration, set `-p` to the path of a folder that contains the files.

For more information on `az ml model register`, consult the [reference documentation](/cli/azure/ml/model).

# [Python](#tab/python)

### Register a model from an Azure ML training run

  When you use the SDK to train a model, you can receive either a [Run](/python/api/azureml-core/azureml.core.run.run) object or an [AutoMLRun](/python/api/azureml-train-automl-client/azureml.train.automl.run.automlrun) object, depending on how you trained the model. Each object can be used to register a model created by an experiment run.

  + Register a model from an `azureml.core.Run` object:
 
    ```python
    model = run.register_model(model_name='sklearn_mnist',
                               tags={'area': 'mnist'},
                               model_path='outputs/sklearn_mnist_model.pkl')
    print(model.name, model.id, model.version, sep='\t')
    ```

    The `model_path` parameter refers to the cloud location of the model. In this example, the path of a single file is used. To include multiple files in the model registration, set `model_path` to the path of a folder that contains the files. For more information, see the [Run.register_model](/python/api/azureml-core/azureml.core.run.run#register-model-model-name--model-path-none--tags-none--properties-none--model-framework-none--model-framework-version-none--description-none--datasets-none--sample-input-dataset-none--sample-output-dataset-none--resource-configuration-none----kwargs-) documentation.

  + Register a model from an `azureml.train.automl.run.AutoMLRun` object:

    ```python
        description = 'My AutoML Model'
        model = run.register_model(description = description,
                                   tags={'area': 'mnist'})

        print(run.model_id)
    ```

    In this example, the `metric` and `iteration` parameters aren't specified, so the iteration with the best primary metric will be registered. The `model_id` value returned from the run is used instead of a model name.

    For more information, see the [AutoMLRun.register_model](/python/api/azureml-train-automl-client/azureml.train.automl.run.automlrun#register-model-model-name-none--description-none--tags-none--iteration-none--metric-none-) documentation.

    To deploy a registered model from an `AutoMLRun`, we recommend doing so via the [one-click deploy button in Azure Machine learning studio](how-to-use-automated-ml-for-ml-models.md#deploy-your-model). 
### Register a model from a local file

You can register a model by providing the local path of the model. You can provide the path of either a folder or a single file. You can use this method to register models trained with Azure Machine Learning and then downloaded. You can also use this method to register models trained outside of Azure Machine Learning.

[!INCLUDE [trusted models](../../includes/machine-learning-service-trusted-model.md)]

+ **Using the SDK and ONNX**

    ```python
    import os
    import urllib.request
    from azureml.core.model import Model
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

  To include multiple files in the model registration, set `model_path` to the path of a folder that contains the files.

For more information, see the documentation for the [Model class](/python/api/azureml-core/azureml.core.model.model).

For more information on working with models trained outside Azure Machine Learning, see [How to deploy an existing model](how-to-deploy-existing-model.md).

---

## Define an entry script

[!INCLUDE [write entry script](../../includes/machine-learning-entry-script.md)]


## Define an inference configuration


An inference configuration describes how to set up the web-service containing your model. It's used later, when you deploy the model.

# [Azure CLI](#tab/azcli)

A minimal inference configuration can be written as:

```json
{
    "entryScript": "score.py",
    "sourceDirectory": "./working_dir",
    "environment": {
    "docker": {
        "arguments": [],
        "baseDockerfile": null,
        "baseImage": "mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04",
        "enabled": false,
        "sharedVolumes": true,
        "shmSize": null
    },
    "environmentVariables": {
        "EXAMPLE_ENV_VAR": "EXAMPLE_VALUE"
    },
    "name": "my-deploy-env",
    "python": {
        "baseCondaEnvironment": null,
        "condaDependencies": {
            "channels": [
                "conda-forge",
                "pytorch"
            ],
            "dependencies": [
                "python=3.6.2",
                "torchvision"
                {
                    "pip": [
                        "azureml-defaults",
                        "azureml-telemetry",
                        "scikit-learn==0.22.1",
                        "inference-schema[numpy-support]"
                    ]
                }
            ],
            "name": "project_environment"
        },
        "condaDependenciesFile": null,
        "interpreterPath": "python",
        "userManagedDependencies": false
    },
    "version": "1"
}
```

This specifies that the machine learning deployment will use the file `score.py` in the `./working_dir` directory to process incoming requests and that it will use the Docker image with the Python packages specified in the `project_environment` environment.

[See this article](./reference-azure-machine-learning-cli.md#inference-configuration-schema) for a more thorough discussion of inference configurations. 

# [Python](#tab/python)

The following example demonstrates:

1. loading a [curated environment](resource-curated-environments.md) from your workspace
1. Cloning the environment
1. Specifying `scikit-learn` as a dependency.
1. Using the environment to create an InferenceConfig

```python
from azureml.core.environment import Environment
from azureml.core.model import InferenceConfig


env = Environment.get(workspace, "AzureML-Minimal").clone(env_name)

for pip_package in ["scikit-learn"]:
    env.python.conda_dependencies.add_pip_package(pip_package)

inference_config = InferenceConfig(entry_script='path-to-score.py',
                                    environment=env)
```

For more information on environments, see [Create and manage environments for training and deployment](how-to-use-environments.md).

For more information on inference configuration, see the [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig) class documentation.

---

> [!TIP] 
> For information on using a custom Docker image with an inference configuration, see [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md).

## Choose a compute target

[!INCLUDE [aml-compute-target-deploy](../../includes/aml-compute-target-deploy.md)]

## Define a deployment configuration

# [Azure CLI](#tab/azcli)

The options available for a deployment configuration differ depending on the compute target you choose.

[!INCLUDE [aml-local-deploy-config](../../includes/machine-learning-service-local-deploy-config.md)]

For more information, see [this reference](./reference-azure-machine-learning-cli.md#deployment-configuration-schema).

# [Python](#tab/python)

Before deploying your model, you must define the deployment configuration. *The deployment configuration is specific to the compute target that will host the web service.* For example, when you deploy a model locally, you must specify the port where the service accepts requests. The deployment configuration isn't part of your entry script. It's used to define the characteristics of the compute target that will host the model and entry script.

You might also need to create the compute resource, if, for example, you don't already have an Azure Kubernetes Service (AKS) instance associated with your workspace.

The following table provides an example of creating a deployment configuration for each compute target:

| Compute target | Deployment configuration example |
| ----- | ----- |
| Local | `deployment_config = LocalWebservice.deploy_configuration(port=8890)` |
| Azure Container Instances | `deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |
| Azure Kubernetes Service | `deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)` |

The classes for local, Azure Container Instances, and AKS web services can be imported from `azureml.core.webservice`:

```python
from azureml.core.webservice import AciWebservice, AksWebservice, LocalWebservice
```

---

## Deploy your machine learning model

You are now ready to deploy your model. 

# [Azure CLI](#tab/azcli)

### Using a registered model

If you registered your model in your Azure Machine Learning workspace, replace "mymodel:1" with the name of your model and its version number.

```azurecli-interactive
az ml model deploy -n tutorial -m mymodel:1 --ic inferenceconfig.json --dc deploymentconfig.json
```

### Using a local model

If you would prefer not to register your model, you can pass the "sourceDirectory" parameter in your inferenceconfig.json to specify a local directory from which to serve your model.

```azurecli-interactive
az ml model deploy --ic inferenceconfig.json --dc deploymentconfig.json --name my_deploy
```

# [Python](#tab/python)

The example below demonstrates a local deployment. The syntax will vary depending on the compute target you chose in the previous step.

```python
from azureml.core.webservice import LocalWebservice, Webservice

deployment_config = LocalWebservice.deploy_configuration(port=8890)
service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output = True)
print(service.state)
```

For more information, see the documentation for [LocalWebservice](/python/api/azureml-core/azureml.core.webservice.local.localwebservice), [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-), and [Webservice](/python/api/azureml-core/azureml.core.webservice.webservice).

---

### Understanding service state

During model deployment, you may see the service state change while it fully deploys.

The following table describes the different service states:

| Webservice state | Description | Final state?
| ----- | ----- | ----- |
| Transitioning | The service is in the process of deployment. | No |
| Unhealthy | The service has deployed but is currently unreachable.  | No |
| Unschedulable | The service cannot be deployed at this time due to lack of resources. | No |
| Failed | The service has failed to deploy due to an error or crash. | Yes |
| Healthy | The service is healthy and the endpoint is available. | Yes |

> [!TIP]
> When deploying, Docker images for compute targets are built and loaded from Azure Container Registry (ACR). By default, Azure Machine Learning creates an ACR that uses the *basic* service tier. Changing the ACR for your workspace to standard or premium tier may reduce the time it takes to build and deploy images to your compute targets. For more information, see [Azure Container Registry service tiers](../container-registry/container-registry-skus.md).

> [!NOTE]
> If you are deploying a model to Azure Kubernetes Service (AKS), we advise you enable [Azure Monitor](../azure-monitor/containers/container-insights-enable-existing-clusters.md) for that cluster. This will help you understand overall cluster health and resource usage. You might also find the following resources useful:
>
> * [Check for Resource Health events impacting your AKS cluster](../aks/aks-resource-health.md)
> * [Azure Kubernetes Service Diagnostics](../aks/concepts-diagnostics.md)
>
> If you are trying to deploy a model to an unhealthy or overloaded cluster, it is expected to experience issues. If you need help troubleshooting AKS cluster problems please contact AKS Support.

### <a id="azuremlcompute"></a> Batch inference
Azure Machine Learning Compute targets are created and managed by Azure Machine Learning. They can be used for batch prediction from Azure Machine Learning pipelines.

For a walkthrough of batch inference with Azure Machine Learning Compute, see [How to run batch predictions](tutorial-pipeline-batch-scoring-classification.md).

### <a id="iotedge"></a> IoT Edge inference
Support for deploying to the edge is in preview. For more information, see [Deploy Azure Machine Learning as an IoT Edge module](../iot-edge/tutorial-deploy-machine-learning.md).

## Delete resources

# [Azure CLI](#tab/azcli)

To delete a deployed webservice, use `az ml service <name of webservice>`.

To delete a registered model from your workspace, use `az ml model delete <model id>`

Read more about [deleting a webservice](/cli/azure/ml/service#az_ml_service_delete) and [deleting a model](/cli/azure/ml/model#az_ml_model_delete).

# [Python](#tab/python)

To delete a deployed web service, use `service.delete()`.
To delete a registered model, use `model.delete()`.

For more information, see the documentation for [WebService.delete()](/python/api/azureml-core/azureml.core.webservice%28class%29#delete--) and [Model.delete()](/python/api/azureml-core/azureml.core.model.model#delete--).

---

## Next steps

* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md)
* [Create client applications to consume web services](how-to-consume-web-service.md)
* [Update web service](how-to-deploy-update-web-service.md)
* [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md)
* [One click deployment for automated ML runs in the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md#deploy-your-model)
* [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
* [Create event alerts and triggers for model deployments](how-to-use-event-grid.md)