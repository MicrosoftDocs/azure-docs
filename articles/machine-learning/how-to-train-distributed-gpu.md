---
title: Distributed GPU training guide (SDK v2)
titleSuffix: Azure Machine Learning
description: Learn the best practices for performing distributed training with Azure Machine Learning SDK (v2) supported frameworks, such as MPI, Horovod, DeepSpeed, PyTorch, TensorFlow, and InfiniBand.
author: rtanase
ms.author: ratanase
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: training
ms.topic: conceptual
ms.date: 11/30/2022
ms.custom: sdkv2, event-tier1-build-2022
---

# Distributed GPU training guide (SDK v2)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Learn more about how to use distributed GPU training code in Azure Machine Learning (ML). This article will not teach you about distributed training.  It will help you run your existing distributed training code on Azure Machine Learning. It offers tips and examples for you to follow for each framework:

* Message Passing Interface (MPI)
    * Horovod
    * Environment variables from Open MPI
* PyTorch
* TensorFlow 
* Accelerate GPU training with InfiniBand

## Prerequisites

Review these [basic concepts of distributed GPU training](concept-distributed-training.md) such as _data parallelism_, _distributed data parallelism_, and _model parallelism_.

> [!TIP]
> If you don't know which type of parallelism to use, more than 90% of the time you should use __Distributed Data Parallelism__.

## MPI

Azure Machine Learning offers an [MPI job](https://www.mcs.anl.gov/research/projects/mpi/) to launch a given number of processes in each node. Azure Machine Learning constructs the full MPI launch command (`mpirun`) behind the scenes.  You can't provide your own full head-node-launcher commands like `mpirun` or `DeepSpeed launcher`.

> [!TIP]
> The base Docker image used by an Azure Machine Learning MPI job needs to have an MPI library installed. [Open MPI](https://www.open-mpi.org/) is included in all the [Azure Machine Learning GPU base images](https://github.com/Azure/AzureML-Containers). When you use a custom Docker image, you are responsible for making sure the image includes an MPI library. Open MPI is recommended, but you can also use a different MPI implementation such as Intel MPI. Azure Machine Learning also provides [curated environments](resource-curated-environments.md) for popular frameworks. 

To run distributed training using MPI, follow these steps:

1. Use an Azure Machine Learning environment with the preferred deep learning framework and MPI. Azure Machine Learning provides [curated environment](resource-curated-environments.md) for popular frameworks. Or [create a custom environment](how-to-manage-environments-v2.md#create-an-environment) with the preferred deep learning framework and MPI.
1. Define  a `command` with `instance_count`. `instance_count` should be equal to the number of GPUs per node for per-process-launch, or set to 1 (the default) for per-node-launch if the user script will be responsible for launching the processes per node.
1. Use the `distribution` parameter of the `command` to specify settings for `MpiDistribution`.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/tensorflow/mnist-distributed-horovod/tensorflow-mnist-distributed-horovod.ipynb?name=job)]


### Horovod

Use the MPI job configuration when you use [Horovod](https://horovod.readthedocs.io/en/stable/index.html) for distributed training with the deep learning framework.

Make sure your code follows these tips:

* The training code is instrumented correctly with Horovod before adding the Azure Machine Learning parts
* Your Azure Machine Learning environment contains Horovod and MPI. The PyTorch and TensorFlow curated GPU environments come pre-configured with Horovod and its dependencies.
* Create a `command` with your desired distribution.

### Horovod example

* For the full notebook to run the above example, see [azureml-examples: Train a basic neural network with distributed MPI on the MNIST dataset using Horovod](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/single-step/tensorflow/mnist-distributed-horovod/tensorflow-mnist-distributed-horovod.ipynb)

### Environment variables from Open MPI

When running MPI jobs with Open MPI images, the following environment variables for each process launched:

1. `OMPI_COMM_WORLD_RANK` - the rank of the process
2. `OMPI_COMM_WORLD_SIZE` - the world size
3. `AZ_BATCH_MASTER_NODE` - primary address with port, `MASTER_ADDR:MASTER_PORT`
4. `OMPI_COMM_WORLD_LOCAL_RANK` - the local rank of the process on the node
5. `OMPI_COMM_WORLD_LOCAL_SIZE` - number of processes on the node

> [!TIP]
> Despite the name, environment variable `OMPI_COMM_WORLD_NODE_RANK` does not corresponds to the `NODE_RANK`. To use per-node-launcher, set `process_count_per_node=1` and use `OMPI_COMM_WORLD_RANK` as the `NODE_RANK`.

## PyTorch

Azure Machine Learning supports running distributed jobs using PyTorch's native distributed training capabilities (`torch.distributed`).

> [!TIP]
> For data parallelism, the [official PyTorch guidance](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html#comparison-between-dataparallel-and-distributeddataparallel) is to use DistributedDataParallel (DDP) over DataParallel for both single-node and multi-node distributed training. PyTorch also [recommends using DistributedDataParallel over the multiprocessing package](https://pytorch.org/docs/stable/notes/cuda.html#use-nn-parallel-distributeddataparallel-instead-of-multiprocessing-or-nn-dataparallel). Azure Machine Learning documentation and examples will therefore focus on DistributedDataParallel training.

### Process group initialization

The backbone of any distributed training is based on a group of processes that know each other and can communicate with each other using a backend. For PyTorch, the process group is created by calling [torch.distributed.init_process_group](https://pytorch.org/docs/stable/distributed.html#torch.distributed.init_process_group) in __all distributed processes__ to collectively form a process group.

```
torch.distributed.init_process_group(backend='nccl', init_method='env://', ...)
```

The most common communication backends used are `mpi`, `nccl`, and `gloo`. For GPU-based training `nccl` is recommended for best performance and should be used whenever possible. 

`init_method` tells how each process can discover each other, how they initialize and verify the process group using the communication backend. By default if `init_method` is not specified PyTorch will use the environment variable initialization method (`env://`). `init_method` is the recommended initialization method to use in your training code to run distributed PyTorch on Azure Machine Learning.  PyTorch will look for the following environment variables for initialization:

- **`MASTER_ADDR`** - IP address of the machine that will host the process with rank 0.
- **`MASTER_PORT`** - A free port on the machine that will host the process with rank 0.
- **`WORLD_SIZE`** - The total number of processes. Should be equal to the total number of devices (GPU) used for distributed training.
- **`RANK`** - The (global) rank of the current process. The possible values are 0 to (world size - 1).

For more information on process group initialization, see the [PyTorch documentation](https://pytorch.org/docs/stable/distributed.html#torch.distributed.init_process_group).

Beyond these, many applications will also need the following environment variables:
- **`LOCAL_RANK`** - The local (relative) rank of the process within the node. The possible values are 0 to (# of processes on the node - 1). This information is useful because many operations such as data preparation only should be performed once per node --- usually on local_rank = 0.
- **`NODE_RANK`** - The rank of the node for multi-node training. The possible values are 0 to (total # of nodes - 1).


You don't need to use a launcher utility like `torch.distributed.launch`. To run a distributed PyTorch job:

1. Specify the training script and arguments
1. Create a `command` and specify the type as `PyTorch` and the `process_count_per_instance` in the `distribution` parameter. The `process_count_per_instance` corresponds to the total number of processes you want to run for your job. `process_count_per_instance` should typically equal to `# of GPUs per node`. If `process_count_per_instance` isn't specified, Azure Machine Learning will by default launch one process per node.

Azure Machine Learning will set the `MASTER_ADDR`, `MASTER_PORT`, `WORLD_SIZE`, and `NODE_RANK` environment variables on each node, and set the process-level `RANK` and `LOCAL_RANK` environment variables.

[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/pytorch/distributed-training/distributed-cifar10.ipynb?name=job)]

### Pytorch example

- For the full notebook to run the above example, see [azureml-examples: Distributed training with PyTorch on CIFAR-10](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/single-step/pytorch/distributed-training/distributed-cifar10.ipynb)

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/tutorials/azure/) is supported as a first-class citizen within Azure Machine Learning to run distributed jobs with near linear scalability in terms of 

* Increase in model size
* Increase in number of GPUs

`DeepSpeed` can be enabled using either Pytorch distribution or MPI for running distributed training. Azure Machine Learning supports the `DeepSpeed` launcher to launch distributed training as well as autotuning to get optimal `ds` configuration.

You can use a [curated environment](resource-curated-environments.md#azure-container-for-pytorch-acpt) for an out of the box environment with the latest state of art technologies including `DeepSpeed`, `ORT`, `MSSCCL`, and `Pytorch` for your DeepSpeed training jobs.

### DeepSpeed example

- For DeepSpeed training and autotuning examples, see [these folders](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/deepspeed).

## TensorFlow

If you're using [native distributed TensorFlow](https://www.tensorflow.org/guide/distributed_training) in your training code, such as TensorFlow 2.x's `tf.distribute.Strategy` API, you can launch the distributed job via Azure Machine Learning using `distribution` parameters or the `TensorFlowDistribution` object.


[!notebook-python[](~/azureml-examples-main/sdk/python/jobs/single-step/tensorflow/mnist-distributed/tensorflow-mnist-distributed.ipynb?name=job)]

If your training script uses the parameter server strategy for distributed training, such as for legacy TensorFlow 1.x, you'll also need to specify the number of parameter servers to use in the job, inside the `distribution` parameter of the `command`. In the above, for example, `"parameter_server_count" : 1` and `"worker_count": 2,

### TF_CONFIG

In TensorFlow, the **TF_CONFIG** environment variable is required for training on multiple machines. For TensorFlow jobs, Azure Machine Learning will configure and set the TF_CONFIG variable appropriately for each worker before executing your training script.

You can access TF_CONFIG from your training script if you need to: `os.environ['TF_CONFIG']`.

Example TF_CONFIG set on a chief worker node:
```json
TF_CONFIG='{
    "cluster": {
        "worker": ["host0:2222", "host1:2222"]
    },
    "task": {"type": "worker", "index": 0},
    "environment": "cloud"
}'
```

### TensorFlow example

- For the full notebook to run the above example, see [azureml-examples: Train a basic neural network with distributed MPI on the MNIST dataset using Tensorflow with Horovod](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/single-step/tensorflow/mnist-distributed-horovod/tensorflow-mnist-distributed-horovod.ipynb)

## Accelerating distributed GPU training with InfiniBand

As the number of VMs training a model increases, the time required to train that model should decrease. The decrease in time, ideally, should be linearly proportional to the number of training VMs. For instance, if training a model on one VM takes 100 seconds, then training the same model on two VMs should ideally take 50 seconds. Training the model on four VMs should take 25 seconds, and so on.

InfiniBand can be an important factor in attaining this linear scaling. InfiniBand enables low-latency, GPU-to-GPU communication across nodes in a cluster. InfiniBand requires specialized hardware to operate. Certain Azure VM series, specifically the NC, ND, and H-series, now have RDMA-capable VMs with SR-IOV and InfiniBand support. These VMs communicate over the low latency and high-bandwidth InfiniBand network, which is much more performant than Ethernet-based connectivity. SR-IOV for InfiniBand enables near bare-metal performance for any MPI library (MPI is used by many distributed training frameworks and tooling, including NVIDIA's NCCL software.) These SKUs are intended to meet the needs of computationally intensive, GPU-acclerated machine learning workloads. For more information, see [Accelerating Distributed Training in Azure Machine Learning with SR-IOV](https://techcommunity.microsoft.com/t5/azure-ai/accelerating-distributed-training-in-azure-machine-learning/ba-p/1059050).

Typically, VM SKUs with an 'r' in their name contain the required InfiniBand hardware, and those without an 'r' typically do not. ('r' is a reference to RDMA, which stands for "remote direct memory access.") For instance, the VM SKU `Standard_NC24rs_v3` is InfiniBand-enabled, but the SKU  `Standard_NC24s_v3` is not.  Aside from the InfiniBand capabilities, the specs between these two SKUs are largely the same – both have 24 cores, 448 GB RAM, 4 GPUs of the same SKU, etc. [Learn more about RDMA- and InfiniBand-enabled machine SKUs](../virtual-machines/sizes-hpc.md#rdma-capable-instances).

>[!WARNING]
>The older-generation machine SKU `Standard_NC24r`  is RDMA-enabled, but it does not contain SR-IOV hardware required for InfiniBand.

If you create an `AmlCompute` cluster of one of these RDMA-capable, InfiniBand-enabled sizes, the OS image will come with the Mellanox OFED driver required to enable InfiniBand preinstalled and preconfigured.

## Next steps

* [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
* [Reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
* [Troubleshooting environment issues](how-to-troubleshoot-environments.md)

