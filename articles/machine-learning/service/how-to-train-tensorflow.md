---
title: Train TensorFlow models with Azure Machine Learning
description: Learn how to run single-node and distributed training of TensorFlow models with the TensorFlow estimator
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to train TensorFlow models

For deep neural network (DNN) training using TensorFlow, Azure Machine Learning provides a custom `TensorFlow` class of the `Estimator`. The Azure SDK's `TensorFlow` estimator (not to be conflated with the [`tf.estimator.Estimator`](https://www.tensorflow.org/api_docs/python/tf/estimator/Estimator) class) enables you to easily submit TensorFlow training jobs for both single-node and distributed runs on Azure compute.

## Single-node training
Training with the `TensorFlow` estimator is similar to using the [base `Estimator`](how-to-train-ml-models.md), so first read through the how-to article and make sure you understand the concepts introduced there.
  
To run a TensorFlow job, instantiate a `TensorFlow` object. You should have already created your [compute target](how-to-set-up-training-targets.md#batch) object `compute_target`.

```Python
from azureml.train.dnn import TensorFlow

script_params = {
    '--batch-size': 50,
    '--learning-rate': 0.01,
}

tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params=script_params,
                    compute_target=compute_target,
                    entry_script='train.py',
                    conda_packages=['scikit-learn'],
                    use_gpu=True)
```

Here, we specify the following parameters to the TensorFlow constructor:

Parameter | Description
--|--
`source_directory` | Local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute
`script_params` | Dictionary specifying the command-line arguments to your training script `entry_script`, in the form of <command-line argument, value> pairs
`compute_target` | Remote compute that your training script will run on, in this case a [Batch AI](how-to-set-up-training-targets.md#batch) cluster
`entry_script` | Filepath (relative to the `source_directory`) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder
`conda_packages` | List of Python packages to be installed via conda needed by your training script. In this case training script uses `sklearn` for loading the data, so specify this package to be installed.  The constructor has another parameter called `pip_packages` that you can use for any pip packages needed
`use_gpu` | Set this flag to `True` to leverage the GPU for training. Defaults to `False`.

Since you are using the TensorFlow estimator, the container used for training will default include the TensorFlow package and related dependencies needed for training on CPUs and GPUs.

Then, submit the TensorFlow job:
```Python
run = exp.submit(tf_est)
```

## Distributed training
The TensorFlow Estimator also enables you to train your models at scale across CPU and GPU clusters of Azure VMs. You can easily run distributed TensorFlow training with a few API calls, while Azure Machine Learning will manage behind the scenes all the infrastructure and orchestration needed to carry out these workloads.

Azure Machine Learning supports two methods of distributed training in TensorFlow:
* MPI-based distributed training using the [Horovod](https://github.com/uber/horovod) framework
* Native [distributed TensorFlow](https://www.tensorflow.org/deploy/distributed) via the parameter server method

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source ring-allreduce framework for distributed training developed by Uber.

To run distributed TensorFlow using the Horovod framework, create the TensorFlow object as follows:

```Python
from azureml.train.dnn import TensorFlow

tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params={},
                    compute_target=compute_target,
                    entry_script='train.py',
                    node_count=2,
                    process_count_per_node=1,
                    distributed_backend='mpi',
                    use_gpu=True)
```

The above code exposes the following new parameters to the TensorFlow constructor:

Parameter | Description | Default
--|--|--
`node_count` | Number of nodes to use for your training job. | `1`
`process_count_per_node` | Number of processes (or "workers") to run on each node.|`1`
`distributed_backend` | Backend for launching distributed training, which the Estimator offers via MPI. If you want to carry out parallel or distributed training (e.g. `node_count`>1 or `process_count_per_node`>1 or both) with MPI (and Horovod), set `distributed_backend='mpi'`. The MPI implementation used by Azure Machine Learning is [Open MPI](https://www.open-mpi.org/). | `None`

The above example will run distributed training with two workers, one worker per node.

Horovod and its dependencies will be installed for you, so you can simply import it in your training script `train.py` as follows:

```Python
import tensorflow as tf
import horovod
```

Finally, submit the TensorFlow job:
```Python
run = exp.submit(tf_est)
```

### Parameter server
You can also run [native distributed TensorFlow](https://www.tensorflow.org/deploy/distributed), which uses the parameter server model. In this method, you train across a cluster of parameter servers and workers. The workers calculate the gradients during training, while the parameter servers aggregate the gradients.

Construct the TensorFlow object:

```Python
from azureml.train.dnn import TensorFlow

tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params={},
                    compute_target=compute_target,
                    entry_script='train.py',
                    node_count=2,
                    worker_count=2,
                    parameter_server_count=1,
                    distributed_backend='ps',
                    use_gpu=True)
```

Pay attention to the following parameters to the TensorFlow constructor in the above code:

Parameter | Description | Default
--|--|--
`worker_count` | Number of workers. | `1`
`parameter_server_count` | Number of parameter servers. | `1`
`distributed_backend` | Backend to use for distributed training. To do distributed training via parameter server, set `distributed_backend='ps'` | `None`

#### Note on `TF_CONFIG`
You will also need the network addresses and ports of the cluster for the [`tf.train.ClusterSpec`](https://www.tensorflow.org/api_docs/python/tf/train/ClusterSpec), so Azure Machine Learning sets the `TF_CONFIG` environment variable for you.

The `TF_CONFIG` environment variable is a JSON string. Here is an example of the variable for a parameter server:
```
TF_CONFIG='{
    "cluster": {
        "ps": ["host0:2222", "host1:2222"],
        "worker": ["host2:2222", "host3:2222", "host4:2222"],
    },
    "task": {"type": "ps", "index": 0},
    "environment": "cloud"
}'
```

If you are using TensorFlow's high-level [`tf.estimator`](https://www.tensorflow.org/api_docs/python/tf/estimator) API, TensorFlow will parse this `TF_CONFIG` variable and build the cluster spec for you. 

If you are instead using TensorFlow's lower-level core APIs for training, you need to parse the `TF_CONFIG` variable and build the `tf.train.ClusterSpec` yourself in your training code. In [this example](https://aka.ms/aml-notebook-tf-ps), you would do so in **your training script** as follows:

```Python
import os, json
import tensorflow as tf

tf_config = os.environ.get('TF_CONFIG')
if not tf_config or tf_config == "":
    raise ValueError("TF_CONFIG not found.")
tf_config_json = json.loads(tf_config)
cluster_spec = tf.train.ClusterSpec(cluster)

```

Once you've finished writing your training script and creating the TensorFlow object, you can submit your training job:
```Python
run = exp.submit(tf_est)
```

## Examples
For a tutorial on single-node TensorFlow training, see:
* [training/03.train-hyperparameter-tune-deploy-with-tensorflow](https://github.com/Azure/MachineLearningNotebooks/blob/master/training/03.train-hyperparameter-tune-deploy-with-tensorflow/03.train-hyperparameter-tune-deploy-with-tensorflow.ipynb)

For a tutorial on distributed TensorFlow with Horovod, see:
* [training/04.distributed-tensorflow-with-horovod](https://github.com/Azure/MachineLearningNotebooks/tree/master/training/04.distributed-tensorflow-with-horovod)

For a tutorial on native distributed TensorFlow, see:
* [training/05.distributed-tensorflow-with-parameter-server](https://github.com/Azure/MachineLearningNotebooks/blob/master/training/05.distributed-tensorflow-with-parameter-server)

Get these notebooks:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps
* [Track run metrics during training](how-to-track-experiments.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
