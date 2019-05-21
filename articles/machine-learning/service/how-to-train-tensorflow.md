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
ms.date: 05/06/2019
ms.custom: seodec18
---

# Train TensorFlow and Keras models with Azure Machine Learning service

You can easily run TensorFlow training jobs on Azure compute by using the [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) estimator class in the Azure Machine Learning SDK. The `TensorFlow` estimator directs Azure Machine Learning service to run your job on a TensorFlow-enabled container for Deep Neural Network (DNN) training.

The `TensorFlow` estimator also provides a layer of abstraction over execution, which means that you can easily configure parameterized runs on different compute targets without altering your training scripts.

## Get started

Since the `TensorFlow` estimator class is similar to the base [`Estimator`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py), we recommend you first read the [base Estimator how-to article](how-to-train-ml-models.md) to understand the overarching concepts.

To get started with Azure Machine Learning service, [complete the quickstart](quickstart-run-cloud-notebook.md). Once finished, you'll have an [Azure Machine Learning workspace](concept-workspace.md) and all of our [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml) including those for training DNNs with TensorFlow and Keras.

## Single-node training

To run a TensorFlow job, instantiate a [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) object and submit it as an experiment.

The following code instantiates a TensorFlow estimator and submits it as an experiment. The training script `train.py` will be run using the given script parameters. The job will be run on a GPU-enabled [compute target](how-to-set-up-training-targets.md), and scikit-learn will be installed as a dependency for `train.py`.

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
                    conda_packages=['scikit-learn'],
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

[Horovod](https://github.com/uber/horovod) is an open-source framework for distributed training developed by Uber. It offers an easy path to distributed GPU TensorFlow jobs.

The following sample runs a distributed training job using Horovod with two workers distributed across two nodes.

```Python
from azureml.train.dnn import TensorFlow

# Tensorflow constructor
tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params={},
                    compute_target=compute_target,
                    entry_script='train.py', # relative path to your TensorFlow job
                    node_count=2,
                    process_count_per_node=1,
                    distributed_backend='mpi', # specifies Horovod backend
                    use_gpu=True)

# submit the TensorFlow job
run = exp.submit(tf_est)
```

Horovod and its dependencies will be installed for you, so you can import it in your training script.

```Python
import tensorflow as tf
import horovod
```

### Parameter server

You can also run [native distributed TensorFlow](https://www.tensorflow.org/deploy/distributed), which uses the parameter server model. In this method, you train across a cluster of parameter servers and workers. The workers calculate the gradients during training, while the parameter servers aggregate the gradients.

The following sample runs a distributed training job using the parameter server method with four workers distributed across two nodes.

```Python
from azureml.train.dnn import TensorFlow

# Tensorflow constructor
tf_est = TensorFlow(source_directory='./my-tf-proj',
                    script_params={},
                    compute_target=compute_target,
                    entry_script='train.py', # relative path to your TensorFlow job
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

[Keras](https://keras.io/) is a popular, high-level DNN Python API that supports TensorFlow, CNTK, and Theano as backends. If you're using TensorFlow as backend, adding Keras is as simple as including a `pip_package` constructor parameter.

The following sample instantiates a [`TensorFlow`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py) estimator and submits it as an experiment. The estimator runs the Keras training script `keras_train.py`. The job will be run on a gpu-enabled [compute target](how-to-set-up-training-targets.md) with Keras installed as a dependency via pip.

```Python
from azureml.train.dnn import TensorFlow

keras_est = TensorFlow(source_directory='./my-keras-proj',
                       script_params=script_params,
                       compute_target=compute_target,
                       entry_script='keras_train.py', # relative path to your TensorFlow job
                       pip_packages=['keras'], # add keras through pip
                       use_gpu=True)
```

## Export to ONNX

To get optimized inferencing with the [ONNX Runtime](concept-onnx.md), you can convert your trained TensorFlow model to the ONNX format. See the [example](https://github.com/onnx/tensorflow-onnx/blob/master/examples/call_coverter_via_python.py).

## Examples

You can find working code samples for both single-node and distributed TensorFlow executions using various frameworks on [our GitHub page](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning).

## Next steps

* [Track run metrics during training](how-to-track-experiments.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
