---
title: Train PyTorch models with Azure Machine Learning
description: Learn how to run single-node and distributed training of PyTorch models with the PyTorch estimator
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to train PyTorch models

For deep neural network (DNN) training using PyTorch, Azure Machine Learning provides a custom `PyTorch` class of the `Estimator`. The Azure SDK's `PyTorch` estimator enables you to easily submit PyTorch training jobs for both single-node and distributed runs on Azure compute.

## Single-node training
Training with the `PyTorch` estimator is similar to using the [base `Estimator`](how-to-train-ml-models.md), so first read through the how-to article and make sure you understand the concepts introduced there.
  
To run a PyTorch job, instantiate a `PyTorch` object. You should have already created your [compute target](how-to-set-up-training-targets.md#batch) object `compute_target` and your [datastore](how-to-access-data.md) object `ds`.

```Python
from azureml.train.dnn import PyTorch

script_params = {
    '--data_dir': ds
}

pt_est = PyTorch(source_directory='./my-pytorch-proj',
                 script_params=script_params,
                 compute_target=compute_target,
                 entry_script='train.py',
                 use_gpu=True)
```

Here, we specify the following parameters to the PyTorch constructor:
Parameter | Description
--|--
`source_directory` |  Local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute
`script_params` |  Dictionary specifying the command-line arguments to your training script `entry_script`, in the form of <command-line argument, value> pairs
`compute_target` |  Remote compute that your training script will run on, in this case a [Batch AI](how-to-set-up-training-targets.md#batch) cluster
`entry_script` |  Filepath (relative to the `source_directory`) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder
`conda_packages` |  List of Python packages to be installed via conda needed by your training script. The constructor has another parameter called `pip_packages` that you can use for any pip packages needed
`use_gpu` |  Set this flag to `True` to leverage the GPU for training. Defaults to `False`

Since you are using the `PyTorch` estimator, the container used for training will include the PyTorch package and related dependencies needed for training on CPUs and GPUs.

Then, submit the PyTorch job:
```Python
run = exp.submit(pt_est)
```

## Distributed training
The `PyTorch` estimator also enables you to train your models at scale across CPU and GPU clusters of Azure VMs. You can easily run distributed PyTorch training with a few API calls, while Azure Machine Learning will manage behind the scenes all the infrastructure and orchestration needed to carry out these workloads.

Azure Machine Learning currently supports MPI-based distributed training of PyTorch using the Horovod framework.

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source ring-allreduce framework for distributed training developed by Uber.

To run distributed PyTorch using the Horovod framework, create the PyTorch object as follows:

```Python
from azureml.train.dnn import PyTorch

pt_est = PyTorch(source_directory='./my-pytorch-project',
                 script_params={},
                 compute_target=compute_target,
                 entry_script='train.py',
                 node_count=2,
                 process_count_per_node=1,
                 distributed_backend='mpi',
                 use_gpu=True)
```

This code exposes the following new parameters to the PyTorch constructor:
Parameter | Description | Default
--|--|--
`node_count` |  Number of nodes to use for your training job. | `1`
`process_count_per_node` |  Number of processes (or "workers") to run on each node. | `1`
`distributed_backend` |  Backend for launching distributed training, which the Estimator offers via MPI.  To carry out parallel or distributed training (e.g. `node_count`>1 or `process_count_per_node`>1 or both) with MPI (and Horovod), set `distributed_backend='mpi'`. The MPI implementation used by Azure Machine Learning is [Open MPI](https://www.open-mpi.org/). | `None`

The above example will run distributed training with two workers, one worker per node.

Horovod and its dependencies will be installed for you, so you can simply import it in your training script `train.py` as follows:
```Python
import torch
import horovod
```

Finally, submit your distributed PyTorch job:
```Python
run = exp.submit(pt_est)
```

## Examples
For a tutorial on single-node PyTorch training, see:
* [training/01.train-hyperparameter-tune-deploy-with-pytorch](https://github.com/Azure/MachineLearningNotebooks/tree/master/training/01.train-hyperparameter-tune-deploy-with-pytorch)

For a tutorial on distributed PyTorch with Horovod, see:
* [training/02.distributed-pytorch-with-horovod](https://github.com/Azure/MachineLearningNotebooks/blob/master/training/02.distributed-pytorch-with-horovod)

Get these notebooks:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps
* [Track run metrics during training](how-to-track-experiments.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
