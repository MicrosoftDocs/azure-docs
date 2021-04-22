---
title: Train and deploy a TensorFlow model
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning enables you to scale out a TensorFlow training job using elastic cloud compute resources.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: minxia
author: mx-iao
ms.date: 09/28/2020
ms.topic: how-to

# Customer intent: As a TensorFlow developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my deep learning models at scale. 
---

# Train TensorFlow models at scale with Azure Machine Learning

In this article, learn how to run your [TensorFlow](https://www.tensorflow.org/overview) training scripts at scale using Azure Machine Learning.

This example trains and registers a TensorFlow model to classify handwritten digits using a deep neural network (DNN).

Whether you're developing a TensorFlow model from the ground-up or you're bringing an [existing model](how-to-deploy-existing-model.md) into the cloud, you can use Azure Machine Learning to scale out open-source training jobs to build, deploy, version, and monitor production-grade models.

## Prerequisites

Run this code on either of these environments:

 - Azure Machine Learning compute instance - no downloads or installation necessary

     - Complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples deep learning folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > ml-frameworks > tensorflow > train-hyperparameter-tune-deploy-with-tensorflow** folder. 
 
 - Your own Jupyter Notebook server

    - [Install the Azure Machine Learning SDK](/python/api/overview/azure/ml/install) (>= 1.15.0).
    - [Create a workspace configuration file](how-to-configure-environment.md#workspace).
    - [Download the sample script files](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/tensorflow/train-hyperparameter-tune-deploy-with-tensorflow) `tf_mnist.py` and `utils.py`
     
    You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/tensorflow/train-hyperparameter-tune-deploy-with-tensorflow/train-hyperparameter-tune-deploy-with-tensorflow.ipynb) of this guide on the GitHub samples page. The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

## Set up the experiment

This section sets up the training experiment by loading the required Python packages, initializing a workspace, creating the compute target, and defining the training environment.

### Import packages

First, import the necessary Python libraries.

```Python
import os
import urllib
import shutil
import azureml

from azureml.core import Experiment
from azureml.core import Workspace, Run
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

### Create a file dataset

A `FileDataset` object references one or multiple files in your workspace datastore or public urls. The files can be of any format, and the class provides you with the ability to download or mount the files to your compute. By creating a `FileDataset`, you create a reference to the data source location. If you applied any transformations to the data set, they will be stored in the data set as well. The data remains in its existing location, so no extra storage cost is incurred. See the [how-to](./how-to-create-register-datasets.md) guide on the `Dataset` package for more information.

```python
from azureml.core.dataset import Dataset

web_paths = [
            'http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz',
            'http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz',
            'http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz',
            'http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz'
            ]
dataset = Dataset.File.from_files(path=web_paths)
```

Use the `register()` method to register the data set to your workspace so they can be shared with others, reused across various experiments, and referred to by name in your training script.

```python
dataset = dataset.register(workspace=ws,
                           name='mnist-dataset',
                           description='training and test dataset',
                           create_new_version=True)

# list the files referenced by dataset
dataset.to_path()
```

### Create a compute target

Create a compute target for your TensorFlow job to run on. In this example, create a GPU-enabled Azure Machine Learning compute cluster.

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
Azure ML provides prebuilt, curated environments if you don't want to define your own environment. Azure ML has several CPU and GPU curated environments for TensorFlow corresponding to different versions of TensorFlow. For more info, see [here](resource-curated-environments.md).

If you want to use a curated environment, you can run the following command instead:

```python
curated_env_name = 'AzureML-TensorFlow-2.2-GPU'
tf_env = Environment.get(workspace=ws, name=curated_env_name)
```

To see the packages included in the curated environment, you can write out the conda dependencies to disk:
```python
tf_env.save_to_directory(path=curated_env_name)
```

Make sure the curated environment includes all the dependencies required by your training script. If not, you will have to modify the environment to include the missing dependencies. Note that if the environment is modified, you will have to give it a new name, as the 'AzureML' prefix is reserved for curated environments. If you modified the conda dependencies YAML file, you can create a new environment from it with a new name, e.g.:
```python
tf_env = Environment.from_conda_specification(name='tensorflow-2.2-gpu', file_path='./conda_dependencies.yml')
```

If you had instead modified the curated environment object directly, you can clone that environment with a new name:
```python
tf_env = tf_env.clone(new_name='tensorflow-2.2-gpu')
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
  - tensorflow-gpu==2.2.0
```

Create an Azure ML environment from this conda environment specification. The environment will be packaged into a Docker container at runtime.

By default if no base image is specified, Azure ML will use a CPU image `azureml.core.environment.DEFAULT_CPU_IMAGE` as the base image. Since this example runs training on a GPU cluster, you will need to specify a GPU base image that has the necessary GPU drivers and dependencies. Azure ML maintains a set of base images published on Microsoft Container Registry (MCR) that you can use, see the [Azure/AzureML-Containers](https://github.com/Azure/AzureML-Containers) GitHub repo for more information.

```python
tf_env = Environment.from_conda_specification(name='tensorflow-2.2-gpu', file_path='./conda_dependencies.yml')

# Specify a GPU base image
tf_env.docker.enabled = True
tf_env.docker.base_image = 'mcr.microsoft.com/azureml/openmpi3.1.2-cuda10.1-cudnn7-ubuntu18.04'
```

> [!TIP]
> Optionally, you can just capture all your dependencies directly in a custom Docker image or Dockerfile, and create your environment from that. For more information, see [Train with custom image](how-to-train-with-custom-image.md).

For more information on creating and using environments, see [Create and use software environments in Azure Machine Learning](how-to-use-environments.md).

## Configure and submit your training run

### Create a ScriptRunConfig

Create a [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig) object to specify the configuration details of your training job, including your training script, environment to use, and the compute target to run on. Any arguments to your training script will be passed via command line if specified in the `arguments` parameter.

```python
from azureml.core import ScriptRunConfig

args = ['--data-folder', dataset.as_mount(),
        '--batch-size', 64,
        '--first-layer-neurons', 256,
        '--second-layer-neurons', 128,
        '--learning-rate', 0.01]

src = ScriptRunConfig(source_directory=script_folder,
                      script='tf_mnist.py',
                      arguments=args,
                      compute_target=compute_target,
                      environment=tf_env)
```

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using an Azure ML [dataset](how-to-train-with-datasets.md).

For more information on configuring jobs with ScriptRunConfig, see [Configure and submit training runs](how-to-set-up-training-targets.md).

> [!WARNING]
> If you were previously using the TensorFlow estimator to configure your TensorFlow training jobs, please note that Estimators have been deprecated as of the 1.19.0 SDK release. With Azure ML SDK >= 1.15.0, ScriptRunConfig is the recommended way to configure training jobs, including those using deep learning frameworks. For common migration questions, see the [Estimator to ScriptRunConfig migration guide](how-to-migrate-from-estimators-to-scriptrunconfig.md).

### Submit a run

The [Run object](/python/api/azureml-core/azureml.core.run%28class%29) provides the interface to the run history while the job is running and after it has completed.

```Python
run = Experiment(workspace=ws, name='Tutorial-TF-Mnist').submit(src)
run.wait_for_completion(show_output=True)
```
### What happens during run execution
As the run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the environment defined. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress. If a curated environment is specified instead, the cached image backing that curated environment will be used.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the `script` is executed. Outputs from stdout and the **./logs** folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The **./outputs** folder of the run is copied over to the run history.

## Register or download a model

Once you've trained the model, you can register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md). Optional: by specifying the parameters `model_framework`, `model_framework_version`, and `resource_configuration`, no-code model deployment becomes available. This allows you to directly deploy your model as a web service from the registered model, and the `ResourceConfiguration` object defines the compute resource for the web service.

```Python
from azureml.core import Model
from azureml.core.resource_configuration import ResourceConfiguration

model = run.register_model(model_name='tf-mnist', 
                           model_path='outputs/model',
                           model_framework=Model.Framework.TENSORFLOW,
                           model_framework_version='2.0',
                           resource_configuration=ResourceConfiguration(cpu=1, memory_in_gb=0.5))
```

You can also download a local copy of the model by using the Run object. In the training script `tf_mnist.py`, a TensorFlow saver object persists the model to a local folder (local to the compute target). You can use the Run object to download a copy.

```Python
# Create a model folder in the current directory
os.makedirs('./model', exist_ok=True)
run.download_files(prefix='outputs/model', output_directory='./model', append_prefix=False)
```

## Distributed training

Azure Machine Learning also supports multi-node distributed TensorFlow jobs so that you can scale your training workloads. You can easily run distributed TensorFlow jobs and Azure ML will manage the orchestration for you.

Azure ML supports running distributed TensorFlow jobs with both Horovod and TensorFlow's built-in distributed training API.

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source, all reduce framework for distributed training developed by Uber. It offers an easy path to writing distributed TensorFlow code for training.

Your training code will have to be instrumented with Horovod for distributed training. For more information using Horovod with TensorFlow, refer to Horovod documentation:

For more information on using Horovod with TensorFlow, refer to Horovod documentation:

* [Horovod with TensorFlow](https://github.com/horovod/horovod/blob/master/docs/tensorflow.rst)
* [Horovod with TensorFlow's Keras API](https://github.com/horovod/horovod/blob/master/docs/keras.rst)

Additionally, make sure your training environment includes the **horovod** package. If you are using a TensorFlow curated environment, horovod is already included as one of the dependencies. If you are using your own environment, make sure the horovod dependency is included, for example:

```yaml
channels:
- conda-forge
dependencies:
- python=3.6.2
- pip:
  - azureml-defaults
  - tensorflow-gpu==2.2.0
  - horovod==0.19.5
```

In order to execute a distributed job using MPI/Horovod on Azure ML, you must specify an [MpiConfiguration](/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration) to the `distributed_job_config` parameter of the ScriptRunConfig constructor. The below code will configure a 2-node distributed job running one process per node. If you would also like to run multiple processes per node (i.e. if your cluster SKU has multiple GPUs), additionally specify the `process_count_per_node` parameter in MpiConfiguration (the default is `1`).

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import MpiConfiguration

src = ScriptRunConfig(source_directory=project_folder,
                      script='tf_horovod_word2vec.py',
                      arguments=['--input_data', dataset.as_mount()],
                      compute_target=compute_target,
                      environment=tf_env,
                      distributed_job_config=MpiConfiguration(node_count=2))
```

For a full tutorial on running distributed TensorFlow with Horovod on Azure ML, see [Distributed TensorFlow with Horovod](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/tensorflow/distributed-tensorflow-with-horovod).

### tf.distribute

If you are using [native distributed TensorFlow](https://www.tensorflow.org/guide/distributed_training) in your training code, e.g. TensorFlow 2.x's `tf.distribute.Strategy` API, you can also launch the distributed job via Azure ML. 

To do so, specify a [TensorflowConfiguration](/python/api/azureml-core/azureml.core.runconfig.tensorflowconfiguration) to the `distributed_job_config` parameter of the ScriptRunConfig constructor. If you are using `tf.distribute.experimental.MultiWorkerMirroredStrategy`, specify the `worker_count` in the TensorflowConfiguration corresponding to the number of nodes for your training job.

```python
import os
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import TensorflowConfiguration

distr_config = TensorflowConfiguration(worker_count=2, parameter_server_count=0)

model_path = os.path.join("./outputs", "keras-model")

src = ScriptRunConfig(source_directory=source_dir,
                      script='train.py',
                      arguments=["--epochs", 30, "--model-dir", model_path],
                      compute_target=compute_target,
                      environment=tf_env,
                      distributed_job_config=distr_config)
```

In TensorFlow, the `TF_CONFIG` environment variable is required for training on multiple machines. Azure ML will configure and set the `TF_CONFIG` variable appropriately for each worker before executing your training script. You can access `TF_CONFIG` from your training script if you need to via `os.environ['TF_CONFIG']`.

Example structure of `TF_CONFIG` set on a chief worker node:
```JSON
TF_CONFIG='{
    "cluster": {
        "worker": ["host0:2222", "host1:2222"]
    },
    "task": {"type": "worker", "index": 0},
    "environment": "cloud"
}'
```

If your training script uses the parameter server strategy for distributed training, i.e. for legacy TensorFlow 1.x, you will also need to specify the number of parameter servers to use in the job, e.g. `distr_config = TensorflowConfiguration(worker_count=2, parameter_server_count=1)`.

## Deploy a TensorFlow model

The deployment how-to contains a section on registering models, but you can skip directly to [creating a compute target](how-to-deploy-and-where.md#choose-a-compute-target) for deployment, since you already have a registered model.

### (Preview) No-code model deployment

Instead of the traditional deployment route, you can also use the no-code deployment feature (preview) for TensorFlow. By registering your model as shown above with the `model_framework`, `model_framework_version`, and `resource_configuration` parameters, you can simply use the `deploy()` static function to deploy your model.

```python
service = Model.deploy(ws, "tensorflow-web-service", [model])
```

The full [how-to](how-to-deploy-and-where.md) covers deployment in Azure Machine Learning in greater depth.

## Next steps

In this article, you trained and registered a TensorFlow model, and learned about options for deployment. See these other articles to learn more about Azure Machine Learning.

* [Track run metrics during training](how-to-log-view-metrics.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
