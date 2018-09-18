---
title: Train machine learning models with Azure Machine Learning
description: Learn how to perform single-node and distributed training of traditional machine learning and deep learning models with Azure Machine Learning services
ms.author: minxia
author: mx-iao
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to train Azure Machine Learning models 

Training machine learning models, particularly deep neural networks, is often a time- and compute-intensive task. Once you've finished writing your training script and running on a small subset of data on your local machine, you will likely want to scale up your workload.

To facilitate training, the Azure ML Python SDK provides a high-level abstraction, the Estimator class, which allows users to easily train their models in the Azure ecosystem. You can create and use an Estimator object to submit any training code you want to run on remote compute, whether it's a single-node run or distributed training across a GPU cluster. For PyTorch and TensorFlow jobs, Azure ML also provides respective custom PyTorch and TensorFlow Estimators that make it easy to use these frameworks.

## Train with an Estimator

Once you've created your [Workspace](https://docs.microsoft.com/azure/machine-learning/service/concept-azure-machine-learning-architecture#workspace) and set up your [development environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-configure-environment), training a model in Azure ML involves the following steps:  
1. [Create a remote compute target](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets)
2. [Upload your training data](https://docs.microsoft.com/azure/machine-learning/service/how-to-access-data) (Optional)
3. Create your training script
4. Create an Estimator object
5. Submit your training job

This article focuses on steps 4-5. For steps 1-3, refer to this [tutorial](https://docs.microsoft.com/azure/machine-learning/service/tutorial-train-models-with-aml) for an example.

### Single-node training

The following code walks through a single-node training run on remote compute in Azure for a scikit-learn model. You should have already created your [compute target](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets#batch) object `compute_target` and your [datastore](https://docs.microsoft.com/azure/machine-learning/service/how-to-access-data) object `ds`.

```Python
from azureml.train.estimator import Estimator

script_params = {
    '--data-folder': ds.as_mount(),
    '--regularization': 0.8
}

sk_est = Estimator(source_directory='./my-sklearn-proj',
                   script_params=script_params,
                   compute_target=compute_target,
                   entry_script='train.py',
                   conda_packages=['scikit-learn'])
```

The above code snippet specifies the following parameters to the Estimator constructor:
* `source_directory`: The local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute 
* `script_params`: A dictionary specifying the command-line arguments to your training script `entry_script`, in the form of <command-line argument, value> pairs
* `compute_target`: The remote compute that your training script will run on, in this case a [Batch AI](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets#batch) cluster
* `entry_script`: The filepath (relative to the `source_directory`) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder
* `conda_packages`: The list of Python packages to be installed via conda needed by your training script.  
The constructor has another parameter called `pip_packages` that you can use for any pip packages needed

Now that you've created your Estimator object, you can submit the training job to be run on the remote compute via a call to the `submit` function on your [Experiment](https://docs.microsoft.com/azure/machine-learning/service/concept-azure-machine-learning-architecture#experiment) object `experiment`. 

```Python
run = experiment.submit(sk_est)
print(run.get_details().status)
```

> [!IMPORTANT]
> **Special Folders**
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, if you write files to folders named *outputs* and *logs* that are relative to the root directory (`./outputs` and `./logs`, respectively), these files will get automatically uploaded to your run history so that you will have access to them once your run is finished. 
>
> To access artifacts created during training (such as model files, checkpoints, data files, or plotted images) write these to the `./outputs` folder.
>
> Similarly, you can write any logs from your training run to the `./logs` folder. To utilize Azure Machine Learning's [TensorBoard integration](https://aka.ms/aml-notebook-tb) make sure you write your TensorBoard logs to this folder. While your run is in progress, you will be able to launch TensorBoard and stream these logs.  Later, you will also be able to restore the logs from any of you previous AML runs.
>
> For example, to download a file written to the *outputs* folder to your local machine after your remote training run: 
> `run.download_file(name='outputs/my_output_file', output_file_path='my_destination_path')`

**For a full example of training with the Python SDK, see [this tutorial](https://aka.ms/aml-notebook-tut1) on training a scikit-learn model on the MNIST dataset.**

### Distributed training and custom Docker images

There are two additional training scenarios you can carry out with the Estimator:
1. Using a custom Docker image
2. Distributed training on a multi-node cluster

The following code shows how to carry out distributed training for a CNTK model. In addition, instead of using the default Azure Machine Learning images, it assumes you have your own custom docker image you want to use for training.

You should have already created your [compute target](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets#batch) object `compute_target`. You can create the estimator as follows:

```Python
from azureml.train.estimator import Estimator

estimator = Estimator(source_directory='./my-cntk-proj',
                      compute_target=compute_target,
                      entry_script='train.py',
                      node_count=2,
                      process_count_per_node=1,
                      distributed_backend='mpi',     
                      pip_packages=['cntk==2.5.1'],
                      custom_docker_base_image='microsoft/mmlspark:0.12')
```

The above code exposes the following new parameters to the Estimator constructor:
* `custom_docker_base_image`: The name of the image you want to use. You can only provide images available in public docker repositories (in this case Docker Hub)
* `node_count`: The number of nodes to use for your training job. This argument defaults to `1`
* `process_count_per_node`: The number of processes (or "workers") to run on each node. In this case, you use the `2` GPUs available on each node. This argument defaults to `1`
* `distributed_backend`: The backend for launching distributed training, which the Estimator offers via MPI. This argument defaults to `None`. If you want to carry out parallel or distributed training (e.g. `node_count`>1 or `process_count_per_node`>1 or both), set `backend='mpi'`. The MPI implementation used by AML is [Open MPI](https://www.open-mpi.org/).

Finally, submit the training job:
```Python
run = experiment.submit(cntk_est)
```
## Example

For a full example, see `training/06.distributed-cntk-with-custom-docker`.

Get this notebook:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

* [Track run metrics during training](how-to-track-experiments.md)
* [Train PyTorch models](how-to-train-pytorch.md)
* [Train TensorFlow models](how-to-train-tensorflow.md)
* [Tune hyperparameters](/how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
