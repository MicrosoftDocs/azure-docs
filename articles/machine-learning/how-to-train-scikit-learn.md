---
title: Train scikit-learn machine learning models (v2)
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning enables you to scale out a scikit-learn training job using elastic cloud compute resources (v2).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: larryfr
author: blackmist
ms.date: 09/22/2022
ms.topic: how-to
ms.custom: devx-track-python, sdkv2, event-tier1-build-2022
#Customer intent: As a Python scikit-learn developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my machine learning models at scale.
---

# Train scikit-learn models at scale with Azure Machine Learning

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
> [!div class="op_single_selector" title1="Select the Azure Machine Learning SDK version you are using:"]
> * [v1](v1/how-to-train-scikit-learn.md)
> * [v2 (preview)](how-to-train-scikit-learn.md)

In this article, learn how to run your scikit-learn training scripts with Azure Machine Learning.

The example scripts in this article are used to classify iris flower images to build a machine learning model based on scikit-learn's [iris dataset](https://archive.ics.uci.edu/ml/datasets/iris).

Whether you're training a machine learning scikit-learn model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning.

## Prerequisites
<!-- M.A: update the prerequisites (path to the notebook) before sign-off -->

You can run this code in either an Azure Machine Learning compute instance, or your own Jupyter Notebook:

 - Azure Machine Learning compute instance
    - Complete the [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md) to create a compute instance. Every compute instance includes a dedicated notebook server pre-loaded with the SDK and the notebooks sample repository. 
    - Select the notebook tab in the Azure Machine Learning studio. In the samples training folder, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > ml-frameworks > scikit-learn > train-hyperparameter-tune-deploy-with-sklearn** folder.
    - You can use the pre-populated code in the sample training folder to complete this tutorial.

 - Create a Jupyter Notebook server and run the code in the following sections.

    - [Install the Azure Machine Learning SDK (v2)](https://aka.ms/sdk-v2-install).


## Set up the experiment

This section sets up the training experiment by loading the required Python packages, connecting to a workspace, creating a compute resource to run a training job, and creating an environment to run the job.

### Connect to the workspace

First, you'll need to connect to your Azure Machine Learning workspace. The [AzureML workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

We are using `DefaultAzureCredential` to get access to the workspace. `DefaultAzureCredential` should be capable of handling most Azure SDK authentication scenarios.

<!-- M.A: link to "configure credential example" is missing (broken in notebook) -->
If this credential does not work for you, see configure credential example and [`azure-identity reference documentation`](/python/api/azure-identity/azure.identity?view=azure-python) for more available credentials.

[!notebook-python[](~/azureml-examples-v2samplesreorg/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=credential)]

If you prefer to use a browser to sign in and authenticate, you can use the following code instead:

```python
# Handle to the workspace
from azure.ai.ml import MLClient

# Authentication package
from azure.identity import InteractiveBrowserCredential

credential = InteractiveBrowserCredential()
```

Next, get a handle to the workspace by providing your Subscription ID, Resource Group name, and Workspace name. To find your Subscription ID and Resource Group:

1. Select your workspace name from the upper-right corner of the Azure Machine Learning Studio toolbar.
2. Copy the value for Resource group and Subscription ID into the code.

[!notebook-python[](~/azureml-examples-v2samplesreorg/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=ml_client)]

The result of this example script is a workspace handle that you'll use to manage other resources and jobs.

Note:

- Creating `MLClient` will not connect the client to the workspace. The client initialization is lazy and will wait for the first time it needs to make a call. In this article, this will happen during compute creation.

### Create a Compute Resource to run the job

AzureML needs a compute resource to run a job. This resource can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

<!-- MA: find proper way to link to the marketing page (second link) -->
In the following example script, we provision a Linux [`compute cluster`](/azure/machine-learning/how-to-create-attach-compute-cluster?tabs=python). You can see the [`Azure Machine Learning pricing`](https://azure.microsoft.com/en-us/pricing/details/machine-learning/) page for the full list of VM sizes and prices. Also, we only need a basic cluster for this example. Let's pick a Standard_DS3_v2 model with 2 vCPU cores and 7 GB RAM to create an AzureML Compute.

[!notebook-python[](~/azureml-examples-v2samplesreorg/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=cpu_compute_target)]

### Create a job environment

To run an AzureML job, you'll need an environment. An AzureML [Environment](concept-environments.md) encapsulates the dependencies (such as software runtime and libraries) needed to run your machine learning training script on your compute resource. This environment is similar to a Python environment on your local machine.

AzureML allows you to use either a curated (or ready-made) environment or define a custom environment using a Docker image or a Conda configuration. This article uses a custom environment.

#### Create a custom environment

To create your custom environment, you'll define your Conda dependencies in a YAML file. First, create a directory for storing the file. In this example, we've named the directory `dependencies_dir.yml`.

[!notebook-python[](~/azureml-examples-v2samplesreorg/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=make_env_folder)]

Then, create the file in the dependencies directory. In this example, we've named the file `conda.yml`.

[!notebook-python[](~/azureml-examples-v2samplesreorg/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=make_conda_file)]

The specification contains some usual packages (such as numpy and pip) that you'll use in your job.

Next, use the YAML file to create and register this custom environment in your workspace.

[!notebook-python[](~/azureml-examples-v2samplesreorg/sdk/python/jobs/single-step/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train-hyperparameter-tune-with-sklearn.ipynb?name=custom_environment)]

For more information on creating and using environments, see [Create and use software environments in Azure Machine Learning](how-to-use-environments.md).

### Data for training

<!-- ### Prepare scripts

For this tutorial, we've provided the [training script **train_iris.py**](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/scikit-learn/train-hyperparameter-tune-deploy-with-sklearn/train_iris.py) for you. In practice, you should be able to take any custom training script as is and run it with AzureML without having to modify your code.

Notes:

The provided training script,
- Shows how to log some metrics to your AzureML run using the `Run` object .
- Uses example data from the  `iris = datasets.load_iris()` function.  To use and access your own data, see [how to train with datasets](v1/how-to-train-with-datasets.md) to make data available during training. -->


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
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using an Azure ML [dataset](v1/how-to-train-with-datasets.md).

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

The model you just registered can be deployed the exact same way as any other registered model in Azure ML. The deployment how-to
contains a section on registering models, but you can skip directly to [creating a compute target](./v1/how-to-deploy-and-where.md#choose-a-compute-target) for deployment, since you already have a registered model.

### (Preview) No-code model deployment

Instead of the traditional deployment route, you can also use the no-code deployment feature (preview) for scikit-learn. No-code model deployment is supported for all built-in scikit-learn model types. By registering your model as shown above with the `model_framework`, `model_framework_version`, and `resource_configuration` parameters, you can simply use the [`deploy()`](/python/api/azureml-core/azureml.core.model%28class%29#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) static function to deploy your model.

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

The full [how-to](./v1/how-to-deploy-and-where.md) covers deployment in Azure Machine Learning in greater depth.


## Next steps

In this article, you trained and registered a scikit-learn model, and learned about deployment options. See these other articles to learn more about Azure Machine Learning.

* [Track run metrics during training](how-to-log-view-metrics.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
