---
title: Train machine learning models using an Estimator class with Azure Machine Learning
description: Learn how to perform single-node and distributed training of traditional machine learning and deep learning models using Azure Machine Learning services Estimator class
ms.author: minxia
author: mx-iao
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to train models with Azure Machine Learning

Training machine learning models, particularly deep neural networks, is often a time- and compute-intensive task. Once you've finished writing your training script and running on a small subset of data on your local machine, you will likely want to scale up your workload.

To facilitate training, the Azure Machine Learning Python SDK provides a high-level abstraction, the estimator class, which allows users to easily train their models in the Azure ecosystem. You can create and use an `Estimator` object to submit any training code you want to run on remote compute, whether it's a single-node run or distributed training across a GPU cluster. For PyTorch and TensorFlow jobs, Azure Machine Learning also provides respective custom `PyTorch` and `TensorFlow` estimators to simplify using these frameworks.

## Train with an estimator

Once you've created your [workspace](concept-azure-machine-learning-architecture.md#workspace) and set up your [development environment](how-to-configure-environment.md), training a model in Azure Machine Learning involves the following steps:  
1. Create a [remote compute target](how-to-set-up-training-targets.md)
2. Upload your [training data](how-to-access-data.md) (Optional)
3. Create your [training script](tutorial-train-models-with-aml.md#create-a-training-script)
4. Create an `Estimator` object
5. Submit your training job

This article focuses on steps 4-5. For steps 1-3, refer to the [train a model tutorial](tutorial-train-models-with-aml.md) for an example.

### Single-node training

Use an `Estimator` for a single-node training run on remote compute in Azure for a scikit-learn model. You should have already created your [compute target](how-to-set-up-training-targets.md#batch) object `compute_target` and your [datastore](how-to-access-data.md) object `ds`.

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

This code snippet specifies the following parameters to the `Estimator` constructor.

Parameter | Description
--|--
`source_directory`| Local directory that contains all of your code needed for the training job. This folder gets copied from your local machine to the remote compute 
`script_params`| Dictionary specifying the command-line arguments to your training script `entry_script`, in the form of <command-line argument, value> pairs
`compute_target`| Remote compute that your training script will run on, in this case a [Batch AI](how-to-set-up-training-targets.md#batch) cluster
`entry_script`| Filepath (relative to the `source_directory`) of the training script to be run on the remote compute. This file, and any additional files it depends on, should be located in this folder
`conda_packages`| List of Python packages to be installed via conda needed by your training script.  
The constructor has another parameter called `pip_packages` that you use for any pip packages needed

Now that you've created your `Estimator` object, submit the training job to be run on the remote compute with a call to the `submit` function on your [Experiment](concept-azure-machine-learning-architecture.md#experiment) object `experiment`. 

```Python
run = experiment.submit(sk_est)
print(run.get_details().status)
```

> [!IMPORTANT]
> **Special Folders**
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, when you write files to folders named *outputs* and *logs* that are relative to the root directory (`./outputs` and `./logs`, respectively), the files will automatically upload to your run history so that you have access to them once your run is finished.
>
> To create artifacts during training (such as model files, checkpoints, data files, or plotted images) write these to the `./outputs` folder.
>
> Similarly, you write any logs from your training run to the `./logs` folder. To utilize Azure Machine Learning's [TensorBoard integration](https://aka.ms/aml-notebook-tb) make sure you write your TensorBoard logs to this folder. While your run is in progress, you will be able to launch TensorBoard and stream these logs.  Later, you will also be able to restore the logs from any of your previous runs.
>
> For example, to download a file written to the *outputs* folder to your local machine after your remote training run: 
> `run.download_file(name='outputs/my_output_file', output_file_path='my_destination_path')`

### Distributed training and custom Docker images

There are two additional training scenarios you can carry out with the `Estimator`:
* Using a custom Docker image
* Distributed training on a multi-node cluster

The following code shows how to carry out distributed training for a CNTK model. In addition, instead of using the default Azure Machine Learning images, it assumes you are using your own custom docker image for training.

You should have already created your [compute target](how-to-set-up-training-targets.md#batch) object `compute_target`. You create the estimator as follows:

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

The above code exposes the following new parameters to the `Estimator` constructor:

Parameter | Description | Default
--|--|--
`custom_docker_base_image`| Name of the image you want to use. Only provide images available in public docker repositories (in this case Docker Hub). To use an image from a private docker repository, use the constructor's `environment_definition` parameter instead | `None`
`node_count`| Number of nodes to use for your training job. | `1`
`process_count_per_node`| Number of processes (or "workers") to run on each node. In this case, you use the `2` GPUs available on each node.| `1`
`distributed_backend`| Backend for launching distributed training, which the Estimator offers via MPI.  To carry out parallel or distributed training (e.g. `node_count`>1 or `process_count_per_node`>1 or both), set `distributed_backend='mpi'`. The MPI implementation used by AML is [Open MPI](https://www.open-mpi.org/).| `None`

Finally, submit the training job:
```Python
run = experiment.submit(cntk_est)
```

## Examples
For a tutorial on training a sklearn model, see:
* [tutorials/01.train-models.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/01.train-models.ipynb)

For a tutorial on distributed CNTK using custom docker, see:
* [training/06.distributed-cntk-with-custom-docker](https://github.com/Azure/MachineLearningNotebooks/blob/master/training/06.distributed-cntk-with-custom-docker)

Get these notebooks:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

* [Track run metrics during training](how-to-track-experiments.md)
* [Train PyTorch models](how-to-train-pytorch.md)
* [Train TensorFlow models](how-to-train-tensorflow.md)
* [Tune hyperparameters](how-to-tune-hyperparameters.md)
* [Deploy a trained model](how-to-deploy-and-where.md)
