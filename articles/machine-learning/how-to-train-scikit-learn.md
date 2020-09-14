---
title: Train scikit-learn machine learning models 
titleSuffix: Azure Machine Learning
description: Learn how to run your scikit-learn training scripts on Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: jordane
author: jpe316
ms.date: 07/24/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python

#Customer intent: As a Python scikit-learn developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my machine learning models at scale.
---

# Build scikit-learn models at scale with Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, learn how to run your scikit-learn training scripts with Azure Machine Learning.

The example scripts in this article are used to classify iris flower images to build a machine learning model based on scikit-learn's [iris dataset](https://archive.ics.uci.edu/ml/datasets/iris).

Whether you're training a machine learning scikit-learn model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning.

## Prerequisites

Run this code on either of these environments:
 - Azure Machine Learning compute instance - no downloads or installation necessary

    - Complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md)  to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples training folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > ml-frameworks > scikit-learn > training > train-hyperparameter-tune-deploy-with-sklearn** folder.

 - Your own Jupyter Notebook server

    - [Install the Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true).
    - [Create a workspace configuration file](how-to-configure-environment.md#workspace).

## Set up the experiment

This section sets up the training experiment by loading the required python packages, initializing a workspace, creating an experiment, and uploading the training data and training scripts.

### Initialize a workspace

The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py&preserve-view=true) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
from azureml.core import Workspace

ws = Workspace.from_config()
```


### Prepare scripts

In this tutorial, the training script **train_iris.py** is already provided for you [here](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/scikit-learn/training/train-hyperparameter-tune-deploy-with-sklearn/train_iris.py). In practice, you should be able to take any custom training script as is and run it with Azure ML without having to modify your code.

Notes:
- The provided training script shows how to log some metrics to your Azure ML run using the `Run` object within the script.
- The provided training script uses example data from the  `iris = datasets.load_iris()` function.  For your own data, you may need to use steps such as [Upload dataset and scripts](how-to-train-keras.md#data-upload) to make data available during training.

### Define your Environment.

#### Create a custom environment.

Author your conda environment (sklearn-env.yml).
To write the conda environment from a notebook, you can add the line ```%%writefile sklearn-env.yml``` at the top of the cell.

```yaml
name: sklearn-training-env
dependencies:
  - python=3.6.2
  - scikit-learn
  - numpy
  - pip:
    - azureml-defaults
```

Create an Azure ML environment from this Conda environment specification. The Environment will be packaged into a docker container at runtime.
```python
from azureml.core import Environment

myenv = Environment.from_conda_specification(name = "myenv", file_path = "sklearn-env.yml")
myenv.docker.enabled = True
```

#### Use a curated environment
Azure ML provides prebuilt, curated container environments if you don't want to build your own image. For more info, see [here](resource-curated-environments.md).
If you want to use a curated environment, you can run the following command instead:

```python
env = Environment.get(workspace=ws, name="AzureML-Tutorial")
```

### Create a ScriptRunConfig

This ScriptRunConfig will submit your job for execution on the local compute target.

```python
from azureml.core import ScriptRunConfig

sklearnconfig = ScriptRunConfig(source_directory='.', script='train_iris.py')
sklearnconfig.run_config.environment = myenv
```

If you want to submit against a remote cluster, you can change run_config.target to the desired compute target.

### Submit your run
```python
from azureml.core import Experiment

run = Experiment(ws,'train-sklearn').submit(config=sklearnconfig)
run.wait_for_completion(show_output=True)

```

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using a [datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.data?view=azure-ml-py&preserve-view=true).

For more information on customizing your Python environment, see [Create and manage environments for training and deployment](how-to-use-environments.md). 

## What happens during run execution
As the run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the TensorFlow estimator. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the entry_script is executed. Outputs from stdout and the ./logs folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The ./outputs folder of the run is copied over to the run history.

## Save and register the model

Once you've trained the model, you can save and register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

Add the following code to your training script, train_iris.py, to save the model. 

``` Python
import joblib

joblib.dump(svm_model_linear, 'model.joblib')
```

Register the model to your workspace with the following code. By specifying the parameters `model_framework`, `model_framework_version`, and `resource_configuration`, no-code model deployment becomes available. No-code model deployment allows you to directly deploy your model as a web service from the registered model, and the [`ResourceConfiguration`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.resource_configuration.resourceconfiguration?view=azure-ml-py&preserve-view=true) object defines the compute resource for the web service.

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

The model you just registered can be deployed the exact same way as any other registered model in Azure Machine Learning, regardless of which estimator you used for training. The deployment how-to
contains a section on registering models, but you can skip directly to [creating a compute target](how-to-deploy-and-where.md#choose-a-compute-target) for deployment, since you already have a registered model.

### (Preview) No-code model deployment

Instead of the traditional deployment route, you can also use the no-code deployment feature (preview) for scikit-learn. No-code model deployment is supported for all built-in scikit-learn model types. By registering your model as shown above with the `model_framework`, `model_framework_version`, and `resource_configuration` parameters, you can simply use the [`deploy()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model%28class%29?view=azure-ml-py#&preserve-view=truedeploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) static function to deploy your model.

```python
web_service = Model.deploy(ws, "scikit-learn-service", [model])
```

NOTE: These dependencies are included in the pre-built scikit-learn inference container.

```yaml
    - azureml-defaults
    - inference-schema[numpy-support]
    - scikit-learn
    - numpy
```

The full [how-to](how-to-deploy-and-where.md) covers deployment in Azure Machine Learning in greater depth.


## Next steps

In this article, you trained and registered a scikit-learn model, and learned about deployment options. See these other articles to learn more about Azure Machine Learning.

* [Track run metrics during training](how-to-track-experiments.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
