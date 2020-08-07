---
author: gvashishtha
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: include
ms.date: 07/31/2020
ms.author: gopalv
---

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](../articles/machine-learning/how-to-manage-workspace.md).
- A model. If you don't have a trained model, you can use the model and dependency files provided in [this tutorial](https://aka.ms/azml-deploy-cloud).
- The [Azure Command Line Interface (CLI) extension for the Machine Learning service](../articles/machine-learning/reference-azure-machine-learning-cli.md)


## Connect to your workspace

Follow the directions in the Azure CLI documentation for [setting your subscription context](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription).

Then do:

```azurecli-interactive
az ml workspace list --resource-group=<my resource group>
```

to see the workspaces you have access to.

## <a id="registermodel"></a> Register your model

A registered model is a logical container for one or more files that make up your model. For example, if you have a model that's stored in multiple files, you can register them as a single model in the workspace. After you register the files, you can then download or deploy the registered model and receive all the files that you registered.

> [!TIP]
> When you register a model, you provide the path of either a cloud location (from a training run) or a local directory. This path is just to locate the files for upload as part of the registration process. It doesn't need to match the path used in the entry script. For more information, see [Locate model files in your entry script](../articles/machine-learning/how-to-deploy-advanced-entry-script.md#load-registered-models).

Machine learning models are registered in your Azure Machine Learning workspace. The model can come from Azure Machine Learning or from somewhere else. When registering a model, you can optionally provide metadata about the model. The `tags` and `properties` dictionaries that you apply to a model registration can then be used to filter models.

The following examples demonstrate how to register a model.

### Register a model from an Azure ML training run

```azurecli-interactive
az ml model register -n sklearn_mnist  --asset-path outputs/sklearn_mnist_model.pkl  --experiment-name myexperiment --run-id myrunid --tag area=mnist
```

[!INCLUDE [install extension](machine-learning-service-install-extension.md)]

The `--asset-path` parameter refers to the cloud location of the model. In this example, the path of a single file is used. To include multiple files in the model registration, set `--asset-path` to the path of a folder that contains the files.

### Register a model from a local file

```azurecli-interactive
az ml model register -n onnx_mnist -p mnist/model.onnx
```

To include multiple files in the model registration, set `-p` to the path of a folder that contains the files.

For more information on `az ml model register`, consult the [reference documentation](/cli/azure/ext/azure-cli-ml/ml/model).

## Define an entry script

[!INCLUDE [write entry script](machine-learning-entry-script.md)]

## Define an inference configuration

[!INCLUDE [inference config](machine-learning-service-inference-config.md)]

The following command demonstrates how to deploy a model by using the CLI:

```azurecli-interactive
az ml model deploy -n myservice -m mymodel:1 --ic inferenceconfig.json
```

In this example, the configuration specifies the following settings:

* That the model requires Python
* The [entry script](#define-an-entry-script), which is used to handle web requests sent to the deployed service
* The Conda file that describes the Python packages needed for inference

For information on using a custom Docker image with an inference configuration, see [How to deploy a model using a custom Docker image](../articles/machine-learning/how-to-deploy-custom-docker-image.md).

## Choose a compute target

[!INCLUDE [aml-compute-target-deploy](aml-compute-target-deploy.md)]

## Define a deployment configuration

The options available for a deployment configuration differ depending on the compute target you choose.

[!INCLUDE [aml-local-deploy-config](machine-learning-service-local-deploy-config.md)]

For more information, see the [az ml model deploy](/cli/azure/ext/azure-cli-ml/ml/model#ext-azure-cli-ml-az-ml-model-deploy) documentation.

## Deploy your model

You are now ready to deploy your model.

### Using a registered model

If you registered your model in your Azure Machine Learning workspace, replace "mymodel:1" with the name of your model and its version number.

```azurecli-interactive
az ml model deploy -m mymodel:1 --ic inferenceconfig.json --dc deploymentconfig.json
```

### Using a local model

If you would prefer not to register your model, you can pass the "sourceDirectory" parameter in your inferenceconfig.json to specify a local directory from which to serve your model.

```azurecli-interactive
az ml model deploy --ic inferenceconfig.json --dc deploymentconfig.json
```
## Delete resources

To delete a deployed webservice, use `az ml service <name of webservice>`.

To delete a registered model from your workspace, use `az ml model delete <model id>`

Read more about [deleting a webservice](/cli/azure/ext/azure-cli-ml/ml/service#ext-azure-cli-ml-az-ml-service-delete) and [deleting a model](/cli/azure/ext/azure-cli-ml/ml/model#ext-azure-cli-ml-az-ml-model-delete)