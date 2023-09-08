---
title: Train deep learning PyTorch models (SDK v1)
titleSuffix: Azure Machine Learning
description: Learn how to run your PyTorch training scripts at enterprise scale using Azure Machine Learning SDK (v1).
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.author: balapv
author: balapv
ms.reviewer: mopeakande
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022
#Customer intent: As a Python PyTorch developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my deep learning models at scale.
---

# Train PyTorch models at scale with Azure Machine Learning SDK (v1)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, learn how to run your [PyTorch](https://pytorch.org/) training scripts at enterprise scale using Azure Machine Learning.

The example scripts in this article are used to classify chicken and turkey images to build a deep learning neural network (DNN) based on [PyTorch's transfer learning tutorial](https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html). Transfer learning is a technique that applies knowledge gained from solving one problem to a different but related problem. Transfer learning shortens the training  process by requiring less data, time, and compute resources than training from scratch. To learn more about transfer learning, see the [deep learning vs machine learning](../concept-deep-learning-vs-machine-learning.md#what-is-transfer-learning) article.

Whether you're training a deep learning PyTorch model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning.

## Prerequisites

Run this code on either of these environments:

- Azure Machine Learning compute instance - no downloads or installation necessary

    - Complete the [Quickstart: Get started with Azure Machine Learning](../quickstart-create-resources.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples deep learning folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > ml-frameworks > pytorch > train-hyperparameter-tune-deploy-with-pytorch** folder.

 - Your own Jupyter Notebook server
    - [Install the Azure Machine Learning SDK](/python/api/overview/azure/ml/install) (>= 1.15.0).
    - [Create a workspace configuration file](how-to-configure-environment.md).
    - [Download the sample script files](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/pytorch/train-hyperparameter-tune-deploy-with-pytorch) `pytorch_train.py`
     
    You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/pytorch/train-hyperparameter-tune-deploy-with-pytorch/train-hyperparameter-tune-deploy-with-pytorch.ipynb) of this guide on the GitHub samples page. The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

[!INCLUDE [gpu quota](../includes/machine-learning-gpu-quota-prereq.md)]

## Set up the experiment

This section sets up the training experiment by loading the required Python packages, initializing a workspace, creating the compute target, and defining the training environment.

### Import packages

First, import the necessary Python libraries.

```Python
import os
import shutil

from azureml.core.workspace import Workspace
from azureml.core import Experiment
from azureml.core import Environment

from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException
```

### Initialize a workspace

The [Azure Machine Learning workspace](../concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](/python/api/azureml-core/azureml.core.workspace.workspace) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
ws = Workspace.from_config()
```

### Get the data

The dataset consists of about 120 training images each for turkeys and chickens, with 100 validation images for each class. We'll download and extract the dataset as part of our training script `pytorch_train.py`. The images are a subset of the [Open Images v5 Dataset](https://storage.googleapis.com/openimages/web/index.html). For more steps on creating a JSONL to train with your own data, see this [Jupyter notebook](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/image-classification-multiclass/auto-ml-image-classification-multiclass.ipynb).

### Prepare training script

In this tutorial, the training script, `pytorch_train.py`, is already provided. In practice, you can take any custom training script, as is, and run it with Azure Machine Learning.

Create a folder for your training script(s).

```python
project_folder = './pytorch-birds'
os.makedirs(project_folder, exist_ok=True)
shutil.copy('pytorch_train.py', project_folder)
```

### Create a compute target

Create a compute target for your PyTorch job to run on. In this example, create a GPU-enabled Azure Machine Learning compute cluster.

[!INCLUDE [gpu quota](../includes/machine-learning-gpu-quota.md)]

```Python

# Choose a name for your CPU cluster
cluster_name = "gpu-cluster"

# Verify that cluster does not exist already
try:
    compute_target = ComputeTarget(workspace=ws, name=cluster_name)
    print('Found existing compute target')
except ComputeTargetException:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_NC6', 
                                                           max_nodes=4)

    # Create the cluster with the specified name and configuration
    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

    # Wait for the cluster to complete, show the output log
    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
```

If you instead want to create a CPU cluster, provide a different VM size to the vm_size parameter, such as STANDARD_D2_V2.

[!INCLUDE [low-pri-note](../includes/machine-learning-low-pri-vm.md)]

For more information on compute targets, see the [what is a compute target](../concept-compute-target.md) article.

### Define your environment

To define the [Azure Machine Learning Environment](../concept-environments.md) that encapsulates your training script's dependencies, you can either define a custom environment or use an Azure Machine Learning curated environment.

#### Use a curated environment

Azure Machine Learning provides prebuilt, [curated environments](../resource-curated-environments.md) if you don't want to define your own environment. There are several CPU and GPU curated environments for PyTorch corresponding to different versions of PyTorch.

If you want to use a curated environment, you can run the following command instead:

```python
curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
```

To see the packages included in the curated environment, you can write out the conda dependencies to disk:

```python
pytorch_env.save_to_directory(path=curated_env_name)
```

Make sure the curated environment includes all the dependencies required by your training script. If not, you'll have to modify the environment to include the missing dependencies. If the environment is modified, you'll have to give it a new name, as the 'AzureML' prefix is reserved for curated environments. If you modified the conda dependencies YAML file, you can create a new environment from it with a new name, for example:

```python
pytorch_env = Environment.from_conda_specification(name='pytorch-1.6-gpu', file_path='./conda_dependencies.yml')
```

If you had instead modified the curated environment object directly, you can clone that environment with a new name:

```python
pytorch_env = pytorch_env.clone(new_name='pytorch-1.6-gpu')
```

#### Create a custom environment

You can also create your own Azure Machine Learning environment that encapsulates your training script's dependencies.

First, define your conda dependencies in a YAML file; in this example the file is named `conda_dependencies.yml`.

```yaml
channels:
- conda-forge
dependencies:
- python=3.7
- pip=21.3.1
- pip:
  - azureml-defaults
  - torch==1.6.0
  - torchvision==0.7.0
  - future==0.17.1
  - pillow
```

Create an Azure Machine Learning environment from this conda environment specification. The environment will be packaged into a Docker container at runtime.

By default if no base image is specified, Azure Machine Learning will use a CPU image `azureml.core.environment.DEFAULT_CPU_IMAGE` as the base image. Since this example runs training on a GPU cluster, you'll need to specify a GPU base image that has the necessary GPU drivers and dependencies. Azure Machine Learning maintains a set of base images published on Microsoft Container Registry (MCR) that you can use. For more information, see [AzureML-Containers GitHub repo](https://github.com/Azure/AzureML-Containers).

```python
pytorch_env = Environment.from_conda_specification(name='pytorch-1.6-gpu', file_path='./conda_dependencies.yml')

# Specify a GPU base image
pytorch_env.docker.enabled = True
pytorch_env.docker.base_image = 'mcr.microsoft.com/azureml/openmpi3.1.2-cuda10.1-cudnn7-ubuntu18.04'
```

> [!TIP]
> Optionally, you can just capture all your dependencies directly in a custom Docker image or Dockerfile, and create your environment from that. For more information, see [Train with custom image](how-to-train-with-custom-image.md).

For more information on creating and using environments, see [Create and use software environments in Azure Machine Learning](how-to-use-environments.md).

## Configure and submit your training run

### Create a ScriptRunConfig

Create a [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig) object to specify the configuration details of your training job, including your training script, environment to use, and the compute target to run on. Any arguments to your training script will be passed via command line if specified in the `arguments` parameter. The following code will configure a single-node PyTorch job.

```python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory=project_folder,
                      script='pytorch_train.py',
                      arguments=['--num_epochs', 30, '--output_dir', './outputs'],
                      compute_target=compute_target,
                      environment=pytorch_env)
```

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using an Azure Machine Learning [dataset](how-to-train-with-datasets.md).

For more information on configuring jobs with ScriptRunConfig, see [Configure and submit training runs](how-to-set-up-training-targets.md).

> [!WARNING]
> If you were previously using the PyTorch estimator to configure your PyTorch training jobs, please note that Estimators have been deprecated as of the 1.19.0 SDK release. With Azure Machine Learning SDK >= 1.15.0, ScriptRunConfig is the recommended way to configure training jobs, including those using deep learning frameworks. For common migration questions, see the [Estimator to ScriptRunConfig migration guide](how-to-migrate-from-estimators-to-scriptrunconfig.md).

## Submit your run

The [Run object](/python/api/azureml-core/azureml.core.run%28class%29) provides the interface to the run history while the job is running and after it has completed.

```Python
run = Experiment(ws, name='Tutorial-pytorch-birds').submit(src)
run.wait_for_completion(show_output=True)
```

### What happens during run execution

As the run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the environment defined. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress. If a curated environment is specified instead, the cached image backing that curated environment will be used.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the `script` is executed. Outputs from stdout and the **./logs** folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The **./outputs** folder of the run is copied over to the run history.

## Register or download a model

Once you've trained the model, you can register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

```Python
model = run.register_model(model_name='pytorch-birds', model_path='outputs/model.pt')
```

> [!TIP]
> The deployment how-to
contains a section on registering models, but you can skip directly to [creating a compute target](how-to-deploy-and-where.md#choose-a-compute-target) for deployment, since you already have a registered model.

You can also download a local copy of the model by using the Run object. In the training script `pytorch_train.py`, a PyTorch save object persists the model to a local folder (local to the compute target). You can use the Run object to download a copy.

```Python
# Create a model folder in the current directory
os.makedirs('./model', exist_ok=True)

# Download the model from run history
run.download_file(name='outputs/model.pt', output_file_path='./model/model.pt'), 
```

## Distributed training

Azure Machine Learning also supports multi-node distributed PyTorch jobs so that you can scale your training workloads. You can easily run distributed PyTorch jobs and Azure Machine Learning will manage the orchestration for you.

Azure Machine Learning supports running distributed PyTorch jobs with both Horovod and PyTorch's built-in DistributedDataParallel module.

For more information about distributed training, see the [Distributed GPU training guide](how-to-train-distributed-gpu.md).

## Export to ONNX

To optimize inference with the [ONNX Runtime](../concept-onnx.md), convert your trained PyTorch model to the ONNX format. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data. For an example, see the [Exporting model from PyTorch to ONNX tutorial](https://github.com/onnx/tutorials/blob/master/tutorials/PytorchOnnxExport.ipynb).

## Next steps

In this article, you trained and registered a deep learning, neural network using PyTorch on Azure Machine Learning. To learn how to deploy a model, continue on to our model deployment article.

- [How and where to deploy models](how-to-deploy-and-where.md)
- [Track run metrics during training](../how-to-log-view-metrics.md)
- [Tune hyperparameters](../how-to-tune-hyperparameters.md)
- [Reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
