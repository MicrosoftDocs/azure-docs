---
title: Train deep learning PyTorch models
titleSuffix: Azure Machine Learning
description: Learn how to run your PyTorch training scripts at enterprise scale using Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: minxia
author: mx-iao
ms.reviewer: peterlu
ms.date: 01/14/2020
ms.topic: conceptual
ms.custom: how-to

#Customer intent: As a Python PyTorch developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my deep learning models at scale. 
---

# Train PyTorch models at scale with Azure Machine Learning

In this article, learn how to run your [PyTorch](https://pytorch.org/) training scripts at enterprise scale using Azure Machine Learning.

The example scripts in this article are used to classify chicken and turkey images to build a deep learning neural network (DNN) based on PyTorch's transfer learning [tutorial](https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html). Transfer learning is a technique that applies knowledge gained from solving one problem to a different but related problem. This shortcuts the training  process by requiring less data, time, and compute resources than training from scratch. See the [deep learning vs machine learning](./concept-deep-learning-vs-machine-learning.md#what-is-transfer-learning) article to learn more about transfer learning.

Whether you're training a deep learning PyTorch model from the ground-up or you're bringing an existing model into the cloud, you can use Azure Machine Learning to scale out open-source training jobs using elastic cloud compute resources. You can build, deploy, version, and monitor production-grade models with Azure Machine Learning. 

## Prerequisites

Run this code on either of these environments:

- Azure Machine Learning compute instance - no downloads or installation necessary

    - Complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples deep learning folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > ml-frameworks > pytorch > train-hyperparameter-tune-deploy-with-pytorch** folder. 
 
 - Your own Jupyter Notebook server
    - [Install the Azure Machine Learning SDK](/python/api/overview/azure/ml/install) (>= 1.15.0).
    - [Create a workspace configuration file](how-to-configure-environment.md#workspace).
    - [Download the sample script files](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/pytorch/train-hyperparameter-tune-deploy-with-pytorch) `pytorch_train.py`
     
    You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/pytorch/train-hyperparameter-tune-deploy-with-pytorch/train-hyperparameter-tune-deploy-with-pytorch.ipynb) of this guide on the GitHub samples page. The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

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

The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](/python/api/azureml-core/azureml.core.workspace.workspace) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
ws = Workspace.from_config()
```

### Get the data

The dataset consists of about 120 training images each for turkeys and chickens, with 100 validation images for each class. We will download and extract the dataset as part of our training script `pytorch_train.py`. The images are a subset of the [Open Images v5 Dataset](https://storage.googleapis.com/openimages/web/index.html).

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

```Python
cluster_name = "gpu-cluster"

try:
    compute_target = ComputeTarget(workspace=ws, name=cluster_name)
    print('Found existing compute target')
except ComputeTargetException:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_NC6', 
                                                           max_nodes=4)

    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
```

[!INCLUDE [low-pri-note](../../includes/machine-learning-low-pri-vm.md)]

For more information on compute targets, see the [what is a compute target](concept-compute-target.md) article.

### Define your environment

To define the Azure ML [Environment](concept-environments.md) that encapsulates your training script's dependencies, you can either define a custom environment or use an Azure ML curated environment.

#### Use a curated environment
Azure ML provides prebuilt, curated environments if you don't want to define your own environment. Azure ML has several CPU and GPU curated environments for PyTorch corresponding to different versions of PyTorch. For more info, see [here](resource-curated-environments.md).

If you want to use a curated environment, you can run the following command instead:

```python
curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
```

To see the packages included in the curated environment, you can write out the conda dependencies to disk:
```python
pytorch_env.save_to_directory(path=curated_env_name)
```

Make sure the curated environment includes all the dependencies required by your training script. If not, you will have to modify the environment to include the missing dependencies. Note that if the environment is modified, you will have to give it a new name, as the 'AzureML' prefix is reserved for curated environments. If you modified the conda dependencies YAML file, you can create a new environment from it with a new name, e.g.:
```python
pytorch_env = Environment.from_conda_specification(name='pytorch-1.6-gpu', file_path='./conda_dependencies.yml')
```

If you had instead modified the curated environment object directly, you can clone that environment with a new name:
```python
pytorch_env = pytorch_env.clone(new_name='pytorch-1.6-gpu')
```

#### Create a custom environment

You can also create your own Azure ML environment that encapsulates your training script's dependencies.

First, define your conda dependencies in a YAML file; in this example the file is named `conda_dependencies.yml`.

```yaml
channels:
- conda-forge
dependencies:
- python=3.6.2
- pip:
  - azureml-defaults
  - torch==1.6.0
  - torchvision==0.7.0
  - future==0.17.1
  - pillow
```

Create an Azure ML environment from this conda environment specification. The environment will be packaged into a Docker container at runtime.

By default if no base image is specified, Azure ML will use a CPU image `azureml.core.environment.DEFAULT_CPU_IMAGE` as the base image. Since this example runs training on a GPU cluster, you will need to specify a GPU base image that has the necessary GPU drivers and dependencies. Azure ML maintains a set of base images published on Microsoft Container Registry (MCR) that you can use, see the [Azure/AzureML-Containers](https://github.com/Azure/AzureML-Containers) GitHub repo for more information.

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

Create a [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig) object to specify the configuration details of your training job, including your training script, environment to use, and the compute target to run on. Any arguments to your training script will be passed via command line if specified in the `arguments` parameter. 

```python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory=project_folder,
                      script='pytorch_train.py',
                      arguments=['--num_epochs', 30, '--output_dir', './outputs'],
                      compute_target=compute_target,
                      environment=pytorch_env)
```

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using an Azure ML [dataset](how-to-train-with-datasets.md).

For more information on configuring jobs with ScriptRunConfig, see [Configure and submit training runs](how-to-set-up-training-targets.md).

> [!WARNING]
> If you were previously using the PyTorch estimator to configure your PyTorch training jobs, please note that Estimators have been deprecated as of the 1.19.0 SDK release. With Azure ML SDK >= 1.15.0, ScriptRunConfig is the recommended way to configure training jobs, including those using deep learning frameworks. For common migration questions, see the [Estimator to ScriptRunConfig migration guide](how-to-migrate-from-estimators-to-scriptrunconfig.md).

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

Azure Machine Learning also supports multi-node distributed PyTorch jobs so that you can scale your training workloads. You can easily run distributed PyTorch jobs and Azure ML will manage the orchestration for you.

Azure ML supports running distributed PyTorch jobs with both Horovod and PyTorch's built-in DistributedDataParallel module.

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source, all reduce framework for distributed training developed by Uber. It offers an easy path to writing distributed PyTorch code for training.

Your training code will have to be instrumented with Horovod for distributed training. For more information using Horovod with PyTorch, see the [Horovod documentation](https://horovod.readthedocs.io/en/stable/pytorch.html).

Additionally, make sure your training environment includes the **horovod** package. If you are using a PyTorch curated environment, horovod is already included as one of the dependencies. If you are using your own environment, make sure the horovod dependency is included, for example:

```yaml
channels:
- conda-forge
dependencies:
- python=3.6.2
- pip:
  - azureml-defaults
  - torch==1.6.0
  - torchvision==0.7.0
  - horovod==0.19.5
```

In order to execute a distributed job using MPI/Horovod on Azure ML, you must specify an [MpiConfiguration](/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration) to the `distributed_job_config` parameter of the ScriptRunConfig constructor. The below code will configure a 2-node distributed job running one process per node. If you would also like to run multiple processes per node (i.e. if your cluster SKU has multiple GPUs), additionally specify the `process_count_per_node` parameter in MpiConfiguration (the default is `1`).

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import MpiConfiguration

src = ScriptRunConfig(source_directory=project_folder,
                      script='pytorch_horovod_mnist.py',
                      compute_target=compute_target,
                      environment=pytorch_env,
                      distributed_job_config=MpiConfiguration(node_count=2))
```

For a full tutorial on running distributed PyTorch with Horovod on Azure ML, see [Distributed PyTorch with Horovod](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/pytorch/distributed-pytorch-with-horovod).

### DistributedDataParallel
If you are using PyTorch's built-in [DistributedDataParallel](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html) module that is built using the **torch.distributed** package in your training code, you can also launch the distributed job via Azure ML.

To launch a distributed PyTorch job on Azure ML, you have two options:
1. Per-process launch: specify the total number of worker processes you want to run, and Azure ML will handle launching each process.
2. Per-node launch with `torch.distributed.launch`: provide the `torch.distributed.launch` command you want to run on each node. The torch launch utility will handle launching the worker processes on each node.

There are no fundamental differences between these launch options; it is largely up to the user's preference or the conventions of the frameworks/libraries built on top of vanilla PyTorch (such as Lightning or Hugging Face).

#### Per-process launch
To use this option to run a distributed PyTorch job, do the following:
1. Specify the training script and arguments
2. Create a [PyTorchConfiguration](/python/api/azureml-core/azureml.core.runconfig.pytorchconfiguration) and specify the `process_count` as well as `node_count`. The `process_count` corresponds to the total number of processes you want to run for your job. This should typically equal the number of GPUs per node multiplied by the number of nodes. If `process_count` is not specified, Azure ML will by default launch one process per node.

Azure ML will set the following environment variables:
* `MASTER_ADDR` - IP address of the machine that will host the process with rank 0.
* `MASTER_PORT` - A free port on the machine that will host the process with rank 0.
* `NODE_RANK` - The rank of the node for multi-node training. The possible values are 0 to (total # of nodes - 1).
* `WORLD_SIZE` - The total number of processes. This should be equal to the total number of devices (GPU) used for distributed training.
* `RANK` - The (global) rank of the current process. The possible values are 0 to (world size - 1).
* `LOCAL_RANK` - The local (relative) rank of the process within the node. The possible values are 0 to (# of processes on the node - 1).

Since the required environment variables will be set for you by Azure ML, you can use [the default environment variable initialization method](https://pytorch.org/docs/stable/distributed.html#environment-variable-initialization) to initialize the process group in your training code.

The following code snippet configures a 2-node, 2-process-per-node PyTorch job:
```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import PyTorchConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = PyTorchConfiguration(process_count=4, node_count=2)

src = ScriptRunConfig(
  source_directory='./src',
  script='train.py',
  arguments=['--epochs', 25],
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

run = Experiment(ws, 'experiment_name').submit(src)
```

> [!WARNING]
> In order to use this option for multi-process-per-node training, you will need to use Azure ML Python SDK >= 1.22.0, as `process_count` was introduced in 1.22.0.

> [!TIP]
> If your training script passes information like local rank or rank as script arguments, you can reference the environment variable(s) in the arguments: `arguments=['--epochs', 50, '--local_rank', $LOCAL_RANK]`.

#### Per-node launch with `torch.distributed.launch`
PyTorch provides a launch utility in [torch.distributed.launch](https://pytorch.org/docs/stable/distributed.html#launch-utility) that users can use to launch multiple processes per node. The `torch.distributed.launch` module will spawn multiple training processes on each of the nodes.

The following steps will demonstrate how to configure a PyTorch job with a per-node-launcher on Azure ML that will achieve the equivalent of running the following command:

```shell
python -m torch.distributed.launch --nproc_per_node <num processes per node> \
  --nnodes <num nodes> --node_rank $NODE_RANK --master_addr $MASTER_ADDR \
  --master_port $MASTER_PORT --use_env \
  <your training script> <your script arguments>
```

1. Provide the `torch.distributed.launch` command to the `command` parameter of the `ScriptRunConfig` constructor. Azure ML will run this command on each node of your training cluster. `--nproc_per_node` should be less than or equal to the number of GPUs available on each node. `MASTER_ADDR`, `MASTER_PORT`, and `NODE_RANK` are all set by Azure ML, so you can just reference the environment variables in the command. Azure ML sets `MASTER_PORT` to 6105, but you can pass a different value to the `--master_port` argument of `torch.distributed.launch` command if you wish. (The launch utility will reset the environment variables.)
2. Create a `PyTorchConfiguration` and specify the `node_count`. You do not need to set `process_count` as Azure ML will default to launching one process per node, which will run the launch command you specified.

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import PyTorchConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = PyTorchConfiguration(node_count=2)
launch_cmd = "python -m torch.distributed.launch --nproc_per_node 2 --nnodes 2 --node_rank $NODE_RANK --master_addr $MASTER_ADDR --master_port $MASTER_PORT --use_env train.py --epochs 50".split()

src = ScriptRunConfig(
  source_directory='./src',
  command=launch_cmd,
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

run = Experiment(ws, 'experiment_name').submit(src)
```

For a full tutorial on running distributed PyTorch on Azure ML, see [Distributed PyTorch with DistributedDataParallel](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/pytorch/distributed-pytorch-with-distributeddataparallel).

### Troubleshooting

* **Horovod has been shut down**: In most cases, if you encounter "AbortedError: Horovod has been shut down", there was an underlying exception in one of the processes that caused Horovod to shut down. Each rank in the MPI job gets it own dedicated log file in Azure ML. These logs are named `70_driver_logs`. In case of distributed training, the log names are suffixed with `_rank` to make it easier to differentiate the logs. To find the exact error that caused Horovod to shut down, go through all the log files and look for `Traceback` at the end of the driver_log files. One of these files will give you the actual underlying exception. 

## Export to ONNX

To optimize inference with the [ONNX Runtime](concept-onnx.md), convert your trained PyTorch model to the ONNX format. Inference, or model scoring, is the phase where the deployed model is used for prediction, most commonly on production data. See the [tutorial](https://github.com/onnx/tutorials/blob/master/tutorials/PytorchOnnxExport.ipynb) for an example.

## Next steps

In this article, you trained and registered a deep learning, neural network using PyTorch on Azure Machine Learning. To learn how to deploy a model, continue on to our model deployment article.

* [How and where to deploy models](how-to-deploy-and-where.md)
* [Track run metrics during training](how-to-log-view-metrics.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
* [Reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
