---
title: Train TensorFlow Models with Azure Machine Learning
description: Learn how to run single-node and distributed training of TensorFlow models with the AML TensorFlow Estimator
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How To Train TensorFlow Models

For deep neural network (DNN) training using TensorFlow, Azure ML provides a custom TensorFlow class of the Estimator. The AML SDK's TensorFlow Estimator (not to be conflated with the [`tf.estimator.Estimator`](https://www.tensorflow.org/api_docs/python/tf/estimator/Estimator) class) enables you to easily submit TensorFlow training jobs for both single-node and distributed runs on Azure compute.

## Single-node training
Training with the TensorFlow Estimator is similar to using the [base Estimator](), so first read through the how-to article and make sure you understand the concepts introduced there.
  
To run a TensorFlow job, instantiate a `TensorFlow` object. You should have already created your compute target object `compute_target`.

```Python
from azureml.train.dnn import TensorFlow

script_params = {
    '--batch-size': 50,
    '--learning-rate': 0.01,
}

tf_est = TensorFlow(folder='./my-tf-proj',
                script_params=script_params,
                compute_target=compute_target,
                entry_script='train.py',
                conda_packages=['scikit-learn'],
                use_gpu=True)
```

Here, we specify the following parameters to the TensorFlow constructor:
* `folder`: The local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute
* `script_params`: A dictionary specifying the command-line arguments to your training script `entry_script`, in the form of <command-line argument, value> pairs
* `compute_target`: The remote compute that your training script will run on, in this case a [Managed Compute]() cluster
* `entry_script`: The filepath (relative to the `folder` directory) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder
* `conda_packages`: The list of Python packages to be installed via conda needed by your training script. In this case training script uses `sklearn` for loading the data, so specify this package to be installed.  
The constructor has another parameter called `pip_packages` that you can use for any pip packages needed
* `use_gpu`: Set this flag to `True` to leverage the GPU for training. Defaults to `False`.

Since you are using the TensorFlow estimator, the container used for training will default include the TensorFlow package and related dependencies needed for training on CPUs and GPUs.

Then, submit the TensorFlow job:
```Python
run = exp.submit(method=tf_est)
```

**For a full example of training using TensorFlow, see [this tutorial]() on training a TensorFlow model on the MNIST dataset.**

## Distributed training
The TensorFlow Estimator also enables you to train your models at scale across CPU and GPU clusters of Azure VMs. You can easily run distributed TensorFlow training with a few API calls, while Azure ML will manage behind the scenes all the infrastructure and orchestration needed to carry out these workloads.

Azure ML supports two methods of distributed training in TensorFlow:
1. MPI-based distributed training using the [Horovod](https://github.com/uber/horovod) framework
2. native [distributed TensorFlow](https://www.tensorflow.org/deploy/distributed) via the parameter server method

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source ring-allreduce framework for distributed training developed by Uber.

To run distributed TensorFlow using the Horovod framework, create the TensorFlow object as follows:

```Python
from azureml.train.dnn import TensorFlow

tf_est = TensorFlow(folder='./my-tf-proj',
                script_params={},
                compute_target=compute_target,
                entry_script='train.py',
                node_count=2,
                process_count_per_node=1,
                backend='mpi')
```

The above code exposes the following new parameters to the TensorFlow constructor:
* `node_count`: The number of nodes to use for your training job. This argument defaults to `1`
* `backend`: The backend for launching distributed training. To train using Horovod, set `backend='mpi'`. For parallel and distributed runs, `backend` will default to `'mpi'`, and `None` for non data-parallel runs.
* `process_count_per_node`: The number of processes (or "workers") to run on each node. This argument defaults to `1`
* `backend`: The backend for launching distributed training. This argument defaults to `None`. If you want to carry out parallel or distributed training (e.g. `node_count`>1 or `process_count_per_node`>1 or both) with MPI (and Horovod), set `backend='mpi'`. The MPI implementation used by AML is [Open MPI](https://www.open-mpi.org/).

The above example will run distributed training with two workers, one worker per node.

Horovod and its dependencies will be installed for you, so you can simply import it in your training script `train.py` as follows:
```Python
import tensorflow as tf
import horovod
```

Finally, submit the TensorFlow job:
```Python
run = exp.submit(method=tf_est)
```

**For a full example of distributed TensorFlow training with Horovod, see [this tutorial]().**

### Parameter server
You can also run [native distributed TensorFlow](https://www.tensorflow.org/deploy/distributed), which uses the parameter server model. In this method, you train across a cluster of parameter servers and workers. The workers calculate the gradients during training, while the parameter servers aggregate the gradients.

Construct the TensorFlow object:
```Python
from azureml.train.dnn import TensorFlow

tf_est = TensorFlow(folder='./my-tf-proj',
                script_params={},
                compute_target=compute_target,
                entry_script='train.py',
                node_count=2,
                worker_count=2,
                parameter_server_count=1,   
                backend='ps')
```

Pay attention to the following parameters to the TensorFlow constructor in the above code:
* `worker_count`: The number of workers. This argument defaults to `1`
* `parameter_server_count`: The number of parameter servers. This argument defaults to `1`
* `backend`: The backend to use for distributed training. This argument defaults to `None`. In order to do distributed training via parameter server, you will need to set `backend='ps'`

#### Note on `TF_CONFIG`
You will also need the network addresses and ports of the cluster for the [`tf.train.ClusterSpec`](https://www.tensorflow.org/api_docs/python/tf/train/ClusterSpec), so Azure ML sets the `TF_CONFIG` environment variable for you.

The `TF_CONFIG` environment variable is a JSON string. Here is an example of the variable for a chief training worker:
```
TF_CONFIG='{
    "cluster": {
        "master": ["host0:2222"],
        "worker": ["host1:2222", "host2:2222", "host3:2222"],
        "ps": ["host4:2222", "host5:2222"]
    },
    "task": {"type": "master", "index": 0}
}'
```

If you are using TensorFlow's high-level [`tf.estimator`](https://www.tensorflow.org/api_docs/python/tf/estimator) API, TensorFlow will parse this `TF_CONFIG` variable and build the cluster spec for you. 

If you are instead using TensorFlow's lower-level core APIs for training, you need to parse the `TF_CONFIG` variable and build the `tf.train.ClusterSpec` yourself in your training code. In [this example](), you would do so in **your training script** as follows:

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
run = exp.submit(method=tf_est)
```

**For a full example of native distributed TensorFlow, see [this tutorial]().**

## Next steps
* [Track run metrics during training]()
* [Hyperparameter tuning]()
* [Deploy a trained model]()
