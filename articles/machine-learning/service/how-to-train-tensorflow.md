---
title: Train and register TensorFlow models
titleSuffix: Azure Machine Learning service
description: This article shows you how to train and register a TensorFlow model using Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: maxluk
author: maxluk
ms.date: 06/10/2019
ms.custom: seodec18
---

# Train and register TensorFlow models at scale with Azure Machine Learning service

This article shows you how to train and register a TensorFlow model using Azure Machine Learning service. It uses the popular [MNIST dataset](http://yann.lecun.com/exdb/mnist/) to classify handwritten digits using a deep neural network built using the [TensorFlow Python library](https://www.tensorflow.org/overview).

TensorFlow is an open-source computational framework commonly used to create deep neural networks (DNN). With Azure Machine Learning service, you can rapidly scale out open-source training jobs using elastic cloud compute resources. You can also track your training runs, version models, deploy models, and much more.

Whether you're developing a TensorFlow model from the ground-up or you're bringing an [existing model](how-to-deploy-existing-model.md) into the cloud, Azure Machine Learning service can help you build production-ready models.

## Prerequisites

Run this code on either of these environments:

 - Azure Machine Learning Notebook VM - no downloads or installation necessary

     - Complete the [cloud-based notebook quickstart](quickstart-run-cloud-notebook.md) to create a dedicated notebook server pre-loaded with the SDK and the sample repository.
    - In the samples folder on the notebook server, find a completed and expanded notebook by navigating to this directory: **how-to-use-azureml > training-with-deep-learning > train-hyperparameter-tune-deploy-with-tensorflow** folder. 
 
 - Your own Jupyter Notebook server

     - [Install the Azure Machine Learning SDK for Python](setup-create-workspace.md#sdk)
    - [Create a workspace configuration file](setup-create-workspace.md#write-a-configuration-file)
    - [Download the sample script files](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow) `mnist-tf.py` and `utils.py`
     
    You can also find a completed [Jupyter Notebook version](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-tensorflow/train-hyperparameter-tune-deploy-with-tensorflow.ipynb) of this guide on the GitHub samples page. The notebook includes expanded sections covering intelligent hyperparameter tuning, model deployment, and notebook widgets.

## Set up the experiment

This section sets up the training experiment by loading the required python packages, initializing a workspace, creating an experiment, and uploading the training data and training scripts.

### Import packages

First, import the necessary Python libraries.

```Python
import os
import urllib
import shutil
import azureml

from azureml.core import Experiment
from azureml.core import Workspace, Run

from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException
```

### Initialize a workspace

The [Azure Machine Learning service workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
ws = Workspace.from_config()
```

### Create an experiment

Create an experiment and a folder to hold your training scripts. In this example, create an experiment called "tf-mnist".

```Python
script_folder = './tf-mnist'
os.makedirs(script_folder, exist_ok=True)

exp = Experiment(workspace=ws, name='tf-mnist')
```

### Upload dataset and scripts

The [datastore](how-to-access-data.md) is a place where data can be stored and accessed by mounting or copying the data to the compute target. Each workspace provides a default datastore. Upload the data and training scripts to the datastore so that they can be easily accessed during training.

1. Download the MNIST dataset locally.

    ```Python
    os.makedirs('./data/mnist', exist_ok=True)

    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz', filename = './data/mnist/train-images.gz')
    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz', filename = './data/mnist/train-labels.gz')
    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz', filename = './data/mnist/test-images.gz')
    urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz', filename = './data/mnist/test-labels.gz')
    ```

1. Upload the MNIST dataset to the default datastore.

    ```Python
    ds = ws.get_default_datastore()
    ds.upload(src_dir='./data/mnist', target_path='mnist', overwrite=True, show_progress=True)
    ```

1. Upload the TensorFlow training script, `tf_mnist.py`, and the helper file, `utils.py`.

    ```Python
    shutil.copy('./tf_mnist.py', script_folder)
    shutil.copy('./utils.py', script_folder)
    ```

## Create a compute target

Create a compute target for your TensorFlow job to run on. In this example, create a GPU-enabled Azure Machine Learning compute cluster.

```Python
cluster_name = "gpucluster"

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

For more information on compute targets, see the [what is a compute target](concept-compute-target.md) article.

## Create a TensorFlow estimator

The [TensorFlow estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) provides a simple way of launching a TensorFlow training job on a compute target.

The TensorFlow estimator is implemented through the generic [`estimator`](https://docs.microsoft.com//python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) class, which can be used to support any framework. For more information about training models using the generic estimator, see [train models with Azure Machine Learning using estimator](how-to-train-ml-models.md)

If your training script needs additional pip or conda packages to run, you can have the packages installed on the resulting docker image by passing their names through the `pip_packages` and `conda_packages` arguments.

```Python
script_params = {
    '--data-folder': ws.get_default_datastore().as_mount(),
    '--batch-size': 50,
    '--first-layer-neurons': 300,
    '--second-layer-neurons': 100,
    '--learning-rate': 0.01
}

est = TensorFlow(source_directory=script_folder,
                 entry_script='tf_mnist.py',
                 script_params=script_params,
                 compute_target=compute_target,
                 use_gpu=True)
```

## Submit a run

The [Run object](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29?view=azure-ml-py) provides the interface to the run history while the job is running and after it has completed.

```Python
run = exp.submit(est)
run.wait_for_completion(show_output=True)
```

As the Run is executed, it goes through the following stages:

- **Preparing**: A docker image is created according to the TensorFlow estimator. The image is uploaded to the workspace's container registry and cached for later runs. Logs are also streamed to the run history and can be viewed to monitor progress.

- **Scaling**: The cluster attempts to scale up if the Batch AI cluster requires more nodes to execute the run than are currently available.

- **Running**: All scripts in the script folder are uploaded to the compute target, data stores are mounted or copied, and the entry_script is executed. Outputs from stdout and the ./logs folder are streamed to the run history and can be used to monitor the run.

- **Post-Processing**: The ./outputs folder of the run is copied over to the run history.

## Register or download a model

Once you've trained the model, you can register it to your workspace. Model registration lets you store and version your models in your workspace to simplify [model management and deployment](concept-model-management-and-deployment.md).

```Python
model = run.register_model(model_name='tf-dnn-mnist', model_path='outputs/model')
```

You can also download a local copy of the model by using the Run object. In the training script `mnist-tf.py`, a TensorFlow saver object persists the model to a local folder (local to the compute target). You can use the Run object to download a copy.

```Python
# Create a model folder in the current directory
os.makedirs('./model', exist_ok=True)

for f in run.get_file_names():
    if f.startswith('outputs/model'):
        output_file_path = os.path.join('./model', f.split('/')[-1])
        print('Downloading from {} to {} ...'.format(f, output_file_path))
        run.download_file(name=f, output_file_path=output_file_path)
```

## Distributed training

The [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) estimator also supports distributed training across CPU and GPU clusters. You can easily run distributed TensorFlow jobs and Azure Machine Learning service will manage the orchestration for you.

Azure Machine Learning service supports two methods of distributed training in TensorFlow:

- [MPI-based](https://www.open-mpi.org/) distributed training using the [Horovod](https://github.com/uber/horovod) framework
- Native [distributed TensorFlow](https://www.tensorflow.org/deploy/distributed) using the parameter server method

### Horovod

[Horovod](https://github.com/uber/horovod) is an open-source framework for distributed training developed by Uber. It offers an easy path to distributed GPU TensorFlow jobs.

To use Horovod, specify an [`MpiConfiguration`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration?view=azure-ml-py) object for the `distributed_training` parameter in the TensorFlow constructor. This  parameter ensures that Horovod library is installed for you to use in your training script.

```Python
from azureml.train.dnn import TensorFlow

# Tensorflow constructor
estimator= TensorFlow(source_directory=project_folder,
                      compute_target=compute_target,
                      script_params=script_params,
                      entry_script='script.py',
                      node_count=2,
                      process_count_per_node=1,
                      distributed_training=MpiConfiguration(),
                      framework_version='1.13',
                      use_gpu=True)
```

### Parameter server

You can also run [native distributed TensorFlow](https://www.tensorflow.org/deploy/distributed), which uses the parameter server model. In this method, you train across a cluster of parameter servers and workers. The workers calculate the gradients during training, while the parameter servers aggregate the gradients.

To use the parameter server method, specify a [`TensorflowConfiguration`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.tensorflowconfiguration?view=azure-ml-py) object for the `distributed_training` parameter in the TensorFlow constructor.

```Python
from azureml.train.dnn import TensorFlow

distributed_training = TensorflowConfiguration()
distributed_training.worker_count = 2

# Tensorflow constructor
estimator= TensorFlow(source_directory=project_folder,
                      compute_target=compute_target,
                      script_params=script_params,
                      entry_script='script.py',
                      node_count=2,
                      process_count_per_node=1,
                      distributed_training=distributed_training,
                      use_gpu=True)

# submit the TensorFlow job
run = exp.submit(tf_est)
```

#### Define cluster specifications in 'TF_CONFIG`

You also need the network addresses and ports of the cluster for the [`tf.train.ClusterSpec`](https://www.tensorflow.org/api_docs/python/tf/train/ClusterSpec), so Azure Machine Learning sets the `TF_CONFIG` environment variable for you.

The `TF_CONFIG` environment variable is a JSON string. Here is an example of the variable for a parameter server:

```JSON
TF_CONFIG='{
    "cluster": {
        "ps": ["host0:2222", "host1:2222"],
        "worker": ["host2:2222", "host3:2222", "host4:2222"],
    },
    "task": {"type": "ps", "index": 0},
    "environment": "cloud"
}'
```

For TensorFlow's high level [`tf.estimator`](https://www.tensorflow.org/api_docs/python/tf/estimator) API, TensorFlow parses the `TF_CONFIG` variable and builds the cluster spec for you.

For TensorFlow's lower-level core APIs for training, parse the `TF_CONFIG` variable and build the `tf.train.ClusterSpec` in your training code.

```Python
import os, json
import tensorflow as tf

tf_config = os.environ.get('TF_CONFIG')
if not tf_config or tf_config == "":
    raise ValueError("TF_CONFIG not found.")
tf_config_json = json.loads(tf_config)
cluster_spec = tf.train.ClusterSpec(cluster)

```

## Next steps

In this article, you trained and registered a TensorFlow model. To learn how to deploy a model to a GPU-enabled cluster, continue on to our GPU model deployment article.

[How to deploy for inferencing with GPUs](how-to-deploy-inferencing-gpus.md)
[How to monitor with Tensorboard](how-to-monitor-tensorboard.md)
