---
title: Train models with TensorFlow & Keras
titleSuffix: Azure Machine Learning service
description: Learn how to run single-node and distributed training of TensorFlow and Keras models with the TensorFlow and Keras estimators
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 04/19/2019
ms.custom: seodec18
---

# Train TensorFlow and Keras models with Azure Machine Learning service

You can easily run TensorFlow training jobs on Azure compute by using the [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) estimator class. The `TensorFlow` estimator directs Azure Machine Learning service to run your job in a TensorFlow-enabled container for both CPU and GPU-enabled jobs.

The `TensorFlow` estimator also provides a layer of abstraction over execution, which means that you can easily configure parameterized runs on different compute targets without altering your training scripts.

Submitting jobs with the `TensorFlow` estimator is similar to using the [base `Estimator`](https://docs.microsoft.com/en-us/python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py). So, read through the [base estimator how-to article](how-to-train-ml-models.md) and make sure you understand the concepts introduced there.

## Single-node training

The following sample instantiates a [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) estimator and submits it as an experiment. The estimator directs `train.py` to run on a gpu-enabled compute target using the given script parameters. The container will also install scikit-learn as a dependency for `train.py`.

```Python
from azureml.train.dnn import TensorFlow

# training script parameters passed as command-line arguments
script_params = {
    '--batch-size': 50,
    '--learning-rate': 0.01,
}

# TensorFlow constructor
tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params=script_params,
                    compute_target=compute_target,
                    entry_script='train.py', # relative path to your TensorFlow job
                    conda_packages=['scikit-learn'], # additional packages required by your training script
                    use_gpu=True)

# submit the TensorFlow job
run = exp.submit(tf_est)
```

## Distributed training

The [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) estimator also supports distributed training across CPU and GPU clusters. You can easily run distributed TensorFlow jobs and Azure Machine Learning service will manage the infrastructure and orchestration for you.

Azure Machine Learning service supports two methods of distributed training in TensorFlow:

* [MPI-based](https://www.open-mpi.org/) distributed training using the [Horovod](https://github.com/uber/horovod) framework
* Native [distributed TensorFlow](https://www.tensorflow.org/deploy/distributed) using the parameter server method

### Horovod

[Horovod](https://github.com/uber/horovod) is an open-source framework for distributed training developed by Uber.

The following sample runs a distributed training job using Horovod, with two workers distributed across two nodes.

```Python
from azureml.train.dnn import TensorFlow

# Tensorflow constructor
tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params={},
                    compute_target=compute_target,
                    entry_script='train.py',
                    node_count=2,
                    process_count_per_node=1,
                    distributed_backend='mpi', # specifies Horovod backend
                    use_gpu=True)

# submit the TensorFlow job
run = exp.submit(tf_est)
```

Horovod and its dependencies will be installed for you, so you can import it in your training script `train.py` as follows:

```Python
import tensorflow as tf
import horovod
```

### Parameter server

You can also run [native distributed TensorFlow](https://www.tensorflow.org/deploy/distributed), which uses the parameter server model. In this method, you train across a cluster of parameter servers and workers. The workers calculate the gradients during training, while the parameter servers aggregate the gradients.

The following sample runs a distributed training job using the parameter server method, with four workers distributed across two nodes.

```Python
from azureml.train.dnn import TensorFlow

# Tensorflow constructor
tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params={},
                    compute_target=compute_target,
                    entry_script='train.py',
                    node_count=2,
                    worker_count=2,
                    parameter_server_count=1,
                    distributed_backend='ps', # specifies parameter server backend
                    use_gpu=True)

# submit the TensorFlow job
run = exp.submit(tf_est)
```

#### Note on `TF_CONFIG`

You'll also need the network addresses and ports of the cluster for the [`tf.train.ClusterSpec`](https://www.tensorflow.org/api_docs/python/tf/train/ClusterSpec), so Azure Machine Learning sets the `TF_CONFIG` environment variable for you.

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

For TensorFlow's high level [`tf.estimator`](https://www.tensorflow.org/api_docs/python/tf/estimator) API, TensorFlow will parse this `TF_CONFIG` variable and build the cluster spec for you.

For TensorFlow's lower-level core APIs for training, parse the `TF_CONFIG` variable and build the `tf.train.ClusterSpec` in your training code. In [this example](https://aka.ms/aml-notebook-tf-ps), you would do so in **your training script** as follows:

```Python
import os, json
import tensorflow as tf

tf_config = os.environ.get('TF_CONFIG')
if not tf_config or tf_config == "":
    raise ValueError("TF_CONFIG not found.")
tf_config_json = json.loads(tf_config)
cluster_spec = tf.train.ClusterSpec(cluster)

```

## Keras support
[Keras](https://keras.io/) is a popular, high-level DNN Python API that supports TensorFlow, CNTK, and Theano as backends. Adding Keras is as simple as including a `pip_package` parameter, if you're using TensorFlow as backend.

```Python
from azureml.train.dnn import TensorFlow

keras_est = TensorFlow(source_directory='./my-keras-proj',
                       script_params=script_params,
                       compute_target=compute_target,
                       entry_script='keras_train.py',
                       pip_packages=['keras'], # add keras through pip
                       use_gpu=True)
```

The above TensorFlow estimator constructor instructs Azure Machine Learning service to install Keras through pip to the execution environment. As a result, your `keras_train.py` can then import Keras API to train a Keras model. For a complete example, explore [this Jupyter notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training-with-deep-learning/train-hyperparameter-tune-deploy-with-keras/train-hyperparameter-tune-deploy-with-keras.ipynb).

## Export to ONNX

To get optimized inferencing with the [ONNX Runtime](concept-onnx.md), you can convert your trained TensorFlow model to the ONNX format. See the [example](https://github.com/onnx/tensorflow-onnx/blob/master/examples/call_coverter_via_python.py).

## Examples

You can find working code samples for both single-node and distributed TensorFlow executions on [our GitHub page](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning).

If you want to get started quickly, [complete the quickstart](quickstart-run-cloud-notebook.md) and you'll have a working environment loaded with all of our sample notebooks.

## Next steps

* [Track run metrics during training](how-to-track-experiments.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)