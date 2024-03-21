---
title: Train scikit-learn machine learning models (SDK v1)
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning SDK (v1) enables you to scale out a scikit-learn training job using elastic cloud compute resources.
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.author: balapv
author: balapv
ms.reviewer: sgilley
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, sdkv1
#Customer intent: As a Python scikit-learn developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my machine learning models at scale.
---

# Train scikit-learn models at scale with Azure Machine Learning (SDK v1)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, learn how to run your scikit-learn training scripts with Azure Machine Learning.

The example scripts in this article are used to classify iris flower images to build a machine learning model based on scikit-learn's [iris dataset](https://archive.ics.uci.edu/ml/datasets/iris).

Whether you're training a machine learning scikit-learn model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning.

## Prerequisites

You can run this code in either an Azure Machine Learning compute instance, or your own Jupyter Notebook:

 - Azure Machine Learning compute instance
    - Complete the [Quickstart: Get started with Azure Machine Learning](../quickstart-create-resources.md) to create a compute instance. Every compute instance includes a dedicated notebook server pre-loaded with the SDK and the notebooks sample repository. 
    - Select the notebook tab in the Azure Machine Learning studio. In the samples training folder, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > ml-frameworks > scikit-learn > train-hyperparameter-tune-deploy-with-sklearn** folder.
    - You can use the pre-populated code in the sample training folder to complete this tutorial.

 - Create a Jupyter Notebook server and run the code in the following sections.

    - [Install the Azure Machine Learning SDK](/python/api/overview/azure/ml/install) (>= 1.13.0).
    - [Create a workspace configuration file](how-to-configure-environment.md).

## Set up the experiment

This section sets up the training experiment by loading the required Python packages, initializing a workspace, defining the training environment, and preparing the training script.

### Initialize a workspace

The [Azure Machine Learning workspace](../concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](/python/api/azureml-core/azureml.core.workspace.workspace) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
from azureml.core import Workspace

ws = Workspace.from_config()
```

### Prepare scripts

In this tutorial, the [training script **train_iris.py**](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train_iris.py) is already provided for you. In practice, you should be able to take any custom training script as is and run it with Azure Machine Learning without having to modify your code.

> [!NOTE]
> - The provided training script shows how to log some metrics to your Azure Machine Learning run using the `Run` object within the script.
> - The provided training script uses example data from the  `iris = datasets.load_iris()` function.  To use and access your own data, see [how to train with datasets](how-to-train-with-datasets.md) to make data available during training.

### Define your environment

To define the Azure Machine Learning [Environment](../concept-environments.md) that encapsulates your training script's dependencies, you can either define a custom environment or use and Azure Machine Learning curated environment.

#### Use a curated environment
Optionally, Azure Machine Learning provides prebuilt, [curated environments](../resource-curated-environments.md) if you don't want to define your own environment. 

If you want to use a curated environment, you can run the following command instead:

```python
from azureml.core import Environment

sklearn_env = Environment.get(workspace=ws, name='AzureML-Tutorial')
```

#### Create a custom environment

You can also create your own custom environment. Define your conda dependencies in a YAML file; in this example the file is named `conda_dependencies.yml`.

```yaml
dependencies:
  - python=3.7
  - scikit-learn
  - numpy
  - pip:
    - azureml-defaults
```

Create an Azure Machine Learning environment from this Conda environment specification. The environment will be packaged into a Docker container at runtime.
```python
from azureml.core import Environment

sklearn_env = Environment.from_conda_specification(name='sklearn-env', file_path='conda_dependencies.yml')
```

For more information on creating and using environments, see [Create and use software environments in Azure Machine Learning](how-to-use-environments.md).

## Configure and submit your training run

### Create a ScriptRunConfig
Create a ScriptRunConfig object to specify the configuration details of your training job, including your training script, environment to use, and the compute target to run on.
Any arguments to your training script will be passed via command line if specified in the `arguments` parameter.

The following code will configure a ScriptRunConfig object for submitting your job for execution on your local machine.

```python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory='.',
                      script='train_iris.py',
                      arguments=['--kernel', 'linear', '--penalty', 1.0],
                      environment=sklearn_env)
```

If you want to instead run your job on a remote cluster, you can specify the desired compute target to the `compute_target` parameter of ScriptRunConfig.

```python
from azureml.core import ScriptRunConfig

compute_target = ws.compute_targets['<my-cluster-name>']
src = ScriptRunConfig(source_directory='.',
                      script='train_iris.py',
                      arguments=['--kernel', 'linear', '--penalty', 1.0],
                      compute_target=compute_target,
                      environment=sklearn_env)
```

### Submit your run
```python
from azureml.core import Experiment

run = Experiment(ws,'Tutorial-TrainIRIS').submit(src)
run.wait_for_completion(show_output=True)
```

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using an Azure Machine Learning [dataset](how-to-train-with-datasets.md).

### What happens during run execution
As the run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the environment defined. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress. If a curated environment is specified instead, the cached image backing that curated environment will be used.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the `script` is executed. Outputs from stdout and the **./logs** folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The **./outputs** folder of the run is copied over to the run history.

## Save and register the model

Once you've trained the model, you can save and register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

Add the following code to your training script, train_iris.py, to save the model. 

``` Python
import joblib

joblib.dump(svm_model_linear, 'model.joblib')
```

Register the model to your workspace with the following code. By specifying the parameters `model_framework`, `model_framework_version`, and `resource_configuration`, no-code model deployment becomes available. No-code model deployment allows you to directly deploy your model as a web service from the registered model, and the [`ResourceConfiguration`](/python/api/azureml-core/azureml.core.resource_configuration.resourceconfiguration) object defines the compute resource for the web service.

```Python
from azureml.core import Model
from azureml.core.resource_configuration import ResourceConfiguration

model = run.register_model(model_name='sklearn-iris', 
                           model_path='outputs/model.joblib',
                           model_framework=Model.Framework.SCIKITLEARN,
                           model_framework_version='0.19.1',
                           resource_configuration=ResourceConfiguration(cpu=1, memory_in_gb=0.5))
```

## Deployment

The model you just registered can be deployed the exact same way as any other registered model in Azure Machine Learning. The deployment how-to
contains a section on registering models, but you can skip directly to [creating a compute targethow-to-deploy-and-where.md#choose-a-compute-target) for deployment, since you already have a registered model.

### (Preview) No-code model deployment

[!INCLUDE [machine-learning-preview-generic-disclaimer](../includes/machine-learning-preview-generic-disclaimer.md)]

Instead of the traditional deployment route, you can also use the no-code deployment feature (preview) for scikit-learn. No-code model deployment is supported for all built-in scikit-learn model types. By registering your model as shown above with the `model_framework`, `model_framework_version`, and `resource_configuration` parameters, you can simply use the [`deploy()`](/python/api/azureml-core/azureml.core.model%28class%29#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) static function to deploy your model.

```python
web_service = Model.deploy(ws, "scikit-learn-service", [model])
```

> [!NOTE]
> These dependencies are included in the pre-built scikit-learn inference container.

```yaml
    - azureml-defaults
    - inference-schema[numpy-support]
    - scikit-learn
    - numpy
```

The full [how-to](how-to-deploy-and-where.md) covers deployment in Azure Machine Learning in greater depth.


## Next steps

In this article, you trained and registered a scikit-learn model, and learned about deployment options. See these other articles to learn more about Azure Machine Learning.

* [Track run metrics during training](../how-to-log-view-metrics.md)
* [Tune hyperparameters](../how-to-tune-hyperparameters.md)
