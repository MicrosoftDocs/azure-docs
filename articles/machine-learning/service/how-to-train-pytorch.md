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

For deep neural network (DNN) training using PyTorch, Azure Machine Learning provides a custom PyTorch class of the Estimator. The Azure SDK's PyTorch Estimator enables you to easily submit PyTorch training jobs for both single-node and distributed runs on Azure compute.

## Single-node training
Training with the PyTorch Estimator is similar to using the [base Estimator](how-to-train-ml-models.md), so first read through the how-to article and make sure you understand the concepts introduced there.
  
To run a PyTorch job, instantiate a `PyTorch` object. You should have already created your [compute target](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets#batch) object `compute_target` and your [datastore](https://docs.microsoft.com/azure/machine-learning/service/how-to-access-data) object `ds`.

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
* `source_directory`: The local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute
* `script_params`: A dictionary specifying the command-line arguments to your training script `entry_script`, in the form of <command-line argument, value> pairs
* `compute_target`: The remote compute that your training script will run on, in this case a [Batch AI](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets#batch) cluster
* `entry_script`: The filepath (relative to the `source_directory`) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder
* `conda_packages`: The list of Python packages to be installed via conda needed by your training script.
The constructor has another parameter called `pip_packages` that you can use for any pip packages needed
* `use_gpu`: Set this flag to `True` to leverage the GPU for training. Defaults to `False`

Since you are using the PyTorch estimator, the container used for training will default include the PyTorch package and related dependencies needed for training on CPUs and GPUs.

Then, submit the PyTorch job:
```Python
run = exp.submit(pt_est)
```

## Distributed training
The PyTorch Estimator also enables you to train your models at scale across CPU and GPU clusters of Azure VMs. You can easily run distributed PyTorch training with a few API calls, while Azure Machine Learning will manage behind the scenes all the infrastructure and orchestration needed to carry out these workloads.

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
                 use_gpu=True,
                 node_count=2,
                 process_count_per_node=1,
                 backend='mpi')
```

The above code exposes the following new parameters to the PyTorch constructor:
* `node_count`: The number of nodes to use for your training job. This argument defaults to `1`
* `process_count_per_node`: The number of processes (or "workers") to run on each node. This argument defaults to `1`
* `backend`: The backend for launching distributed training, which the Estimator offers via MPI. This argument defaults to `None`. If you want to carry out parallel or distributed training (e.g. `node_count`>1 or `process_count_per_node`>1 or both) with MPI (and Horovod), set `backend='mpi'`. The MPI implementation used by Azure Machine Learning is [Open MPI](https://www.open-mpi.org/).

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
* `training/01.train-and-deploy-pytorch/01.train-and-deploy-pytorch.ipynb`

For a tutorial on distributed PyTorch with Horovod, see:
`training/02.distributed-pytorch-with-horovod/02.distributed-pytorch-with-horovod.ipynb`

Get these notebooks:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps
* [Track run metrics during training](how-to-track-experiments.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
