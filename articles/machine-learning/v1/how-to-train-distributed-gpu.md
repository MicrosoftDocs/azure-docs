---
title: Distributed GPU training guide (SDK v1)
titleSuffix: Azure Machine Learning
description: Learn the best practices for performing distributed training with Azure Machine Learning SDK (v1) supported frameworks, such as MPI, Horovod, DeepSpeed, PyTorch, PyTorch Lightning, Hugging Face Transformers, TensorFlow, and InfiniBand.
author: rtanase
ms.author: ratanase
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 10/21/2021
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022
---

# Distributed GPU training guide (SDK v1)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

Learn more about how to use distributed GPU training code in Azure Machine Learning (ML). This article will not teach you about distributed training.  It will help you run your existing distributed training code on Azure Machine Learning. It offers tips and examples for you to follow for each framework:

* Message Passing Interface (MPI)
    * Horovod
    * DeepSpeed
    * Environment variables from Open MPI
* PyTorch
    * Process group initialization
    * Launch options
    * DistributedDataParallel (per-process-launch)
    * Using `torch.distributed.launch` (per-node-launch)
    * PyTorch Lightning
    * Hugging Face Transformers
* TensorFlow
    * Environment variables for TensorFlow (TF_CONFIG)
* Accelerate GPU training with InfiniBand

## Prerequisites

Review these [basic concepts of distributed GPU training](../concept-distributed-training.md) such as _data parallelism_, _distributed data parallelism_, and _model parallelism_.

> [!TIP]
> If you don't know which type of parallelism to use, more than 90% of the time you should use __Distributed Data Parallelism__.

## MPI

Azure Machine Learning offers an [MPI job](https://www.mcs.anl.gov/research/projects/mpi/) to launch a given number of processes in each node. You can adopt this approach to run distributed training using either per-process-launcher or per-node-launcher, depending on whether `process_count_per_node` is set to 1 (the default) for per-node-launcher, or equal to the number of devices/GPUs for per-process-launcher. Azure Machine Learning constructs the full MPI launch command (`mpirun`) behind the scenes.  You can't provide your own full head-node-launcher commands like `mpirun` or `DeepSpeed launcher`.

> [!TIP]
> The base Docker image used by an Azure Machine Learning MPI job needs to have an MPI library installed. [Open MPI](https://www.open-mpi.org/) is included in all the [Azure Machine Learning GPU base images](https://github.com/Azure/AzureML-Containers). When you use a custom Docker image, you are responsible for making sure the image includes an MPI library. Open MPI is recommended, but you can also use a different MPI implementation such as Intel MPI. Azure Machine Learning also provides [curated environments](../resource-curated-environments.md) for popular frameworks. 

To run distributed training using MPI, follow these steps:

1. Use an Azure Machine Learning environment with the preferred deep learning framework and MPI. Azure Machine Learning provides [curated environment](../resource-curated-environments.md) for popular frameworks.
1. Define `MpiConfiguration` with `process_count_per_node` and `node_count`. `process_count_per_node` should be equal to the number of GPUs per node for per-process-launch, or set to 1 (the default) for per-node-launch if the user script will be responsible for launching the processes per node.
1. Pass the `MpiConfiguration` object to the `distributed_job_config` parameter of `ScriptRunConfig`.

```python
from azureml.core import Workspace, ScriptRunConfig, Environment, Experiment
from azureml.core.runconfig import MpiConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = MpiConfiguration(process_count_per_node=4, node_count=2)

run_config = ScriptRunConfig(
  source_directory= './src',
  script='train.py',
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

# submit the run configuration to start the job
run = Experiment(ws, "experiment_name").submit(run_config)
```

### Horovod

Use the MPI job configuration when you use [Horovod](https://horovod.readthedocs.io/en/stable/index.html) for distributed training with the deep learning framework.

Make sure your code follows these tips:

* The training code is instrumented correctly with Horovod before adding the Azure Machine Learning parts
* Your Azure Machine Learning environment contains Horovod and MPI. The PyTorch and TensorFlow curated GPU environments come pre-configured with Horovod and its dependencies.
* Create an `MpiConfiguration` with your desired distribution.

### Horovod example

* [azureml-examples: TensorFlow distributed training using Horovod](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/workflows/train/tensorflow/mnist-distributed-horovod)

### DeepSpeed

Don't use DeepSpeed's custom launcher to run distributed training with the [DeepSpeed](https://www.deepspeed.ai/) library on Azure Machine Learning. Instead, configure an MPI job to launch the training job [with MPI](https://www.deepspeed.ai/getting-started/#mpi-and-azureml-compatibility).

Make sure your code follows these tips:

* Your Azure Machine Learning environment contains DeepSpeed and its dependencies, Open MPI, and mpi4py.
* Create an `MpiConfiguration` with your distribution.

### DeepSpeed example

* [azureml-examples: Distributed training with DeepSpeed on CIFAR-10](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/workflows/train/deepspeed/cifar)

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

### PyTorch launch options

The Azure Machine Learning PyTorch job supports two types of options for launching distributed training:

- __Per-process-launcher__: The system will launch all distributed processes for you, with all the relevant information (such as environment variables) to set up the process group.
- __Per-node-launcher__: You provide Azure Machine Learning with the utility launcher that will get run on each node. The utility launcher will handle launching each of the processes on a given node. Locally within each node, `RANK` and `LOCAL_RANK` are set up by the launcher. The **torch.distributed.launch** utility and PyTorch Lightning both belong in this category.

There are no fundamental differences between these launch options. The choice is largely up to your preference or the conventions of the frameworks/libraries built on top of vanilla PyTorch (such as Lightning or Hugging Face).

The following sections go into more detail on how to configure Azure Machine Learning PyTorch jobs for each of the launch options.

### DistributedDataParallel (per-process-launch)

You don't need to use a launcher utility like `torch.distributed.launch`. To run a distributed PyTorch job:

1. Specify the training script and arguments
1. Create a `PyTorchConfiguration` and specify the `process_count` and `node_count`. The `process_count` corresponds to the total number of processes you want to run for your job. `process_count` should typically equal `# GPUs per node x # nodes`. If `process_count` isn't specified, Azure Machine Learning will by default launch one process per node.

Azure Machine Learning will set the `MASTER_ADDR`, `MASTER_PORT`, `WORLD_SIZE`, and `NODE_RANK` environment variables on each node, and set the process-level `RANK` and `LOCAL_RANK` environment variables.

To use this option for multi-process-per-node training, use Azure Machine Learning Python SDK `>= 1.22.0`. Process_count was introduced in 1.22.0.

```python
from azureml.core import ScriptRunConfig, Environment, Experiment
from azureml.core.runconfig import PyTorchConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = PyTorchConfiguration(process_count=8, node_count=2)

run_config = ScriptRunConfig(
  source_directory='./src',
  script='train.py',
  arguments=['--epochs', 50],
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

run = Experiment(ws, 'experiment_name').submit(run_config)
```

> [!TIP]
> If your training script passes information like local rank or rank as script arguments, you can reference the environment variable(s) in the arguments:
>
> ```python
> arguments=['--epochs', 50, '--local_rank', $LOCAL_RANK]
> ```

### Pytorch per-process-launch example

- [azureml-examples: Distributed training with PyTorch on CIFAR-10](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/workflows/train/pytorch/cifar-distributed)

### <a name="per-node-launch"></a> Using torch.distributed.launch (per-node-launch)

PyTorch provides a launch utility in [torch.distributed.launch](https://pytorch.org/docs/stable/distributed.html#launch-utility) that you can use to launch multiple processes per node. The `torch.distributed.launch` module spawns multiple training processes on each of the nodes.

The following steps demonstrate how to configure a PyTorch job with a per-node-launcher on Azure Machine Learning.  The job achieves the equivalent of running the following command:

```shell
python -m torch.distributed.launch --nproc_per_node <num processes per node> \
  --nnodes <num nodes> --node_rank $NODE_RANK --master_addr $MASTER_ADDR \
  --master_port $MASTER_PORT --use_env \
  <your training script> <your script arguments>
```

1. Provide the `torch.distributed.launch` command to the `command` parameter of the `ScriptRunConfig` constructor. Azure Machine Learning runs this command on each node of your training cluster. `--nproc_per_node` should be less than or equal to the number of GPUs available on each node. MASTER_ADDR, MASTER_PORT, and NODE_RANK are all set by Azure Machine Learning, so you can just reference the environment variables in the command. Azure Machine Learning sets MASTER_PORT to `6105`, but you can pass a different value to the `--master_port` argument of torch.distributed.launch command if you wish. (The launch utility will reset the environment variables.)
2. Create a `PyTorchConfiguration` and specify the `node_count`.

```python
from azureml.core import ScriptRunConfig, Environment, Experiment
from azureml.core.runconfig import PyTorchConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = PyTorchConfiguration(node_count=2)
launch_cmd = "python -m torch.distributed.launch --nproc_per_node 4 --nnodes 2 --node_rank $NODE_RANK --master_addr $MASTER_ADDR --master_port $MASTER_PORT --use_env train.py --epochs 50".split()

run_config = ScriptRunConfig(
  source_directory='./src',
  command=launch_cmd,
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

run = Experiment(ws, 'experiment_name').submit(run_config)
```

> [!TIP]
> **Single-node multi-GPU training:**
> If you are using the launch utility to run single-node multi-GPU PyTorch training, you do not need to specify the `distributed_job_config` parameter of ScriptRunConfig.
>
>```python
> launch_cmd = "python -m torch.distributed.launch --nproc_per_node 4 --use_env train.py --epochs 50".split()
>
> run_config = ScriptRunConfig(
>  source_directory='./src',
>  command=launch_cmd,
>  compute_target=compute_target,
>  environment=pytorch_env,
> )
> ```

### PyTorch per-node-launch example

- [azureml-examples: Distributed training with PyTorch on CIFAR-10](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/workflows/train/pytorch/cifar-distributed)

### PyTorch Lightning

[PyTorch Lightning](https://pytorch-lightning.readthedocs.io/en/stable/) is a lightweight open-source library that provides a high-level interface for PyTorch. Lightning abstracts away many of the lower-level distributed training configurations required for vanilla PyTorch. Lightning allows you to run your training scripts in single GPU, single-node multi-GPU, and multi-node multi-GPU settings. Behind the scene, it launches multiple processes for you similar to `torch.distributed.launch`.

For single-node training (including single-node multi-GPU), you can run your code on Azure Machine Learning without needing to specify a `distributed_job_config`. 
To run an experiment using multiple nodes with multiple GPUs, there are 2 options:

- Using PyTorch configuration (recommended): Define `PyTorchConfiguration` and specify `communication_backend="Nccl"`, `node_count`, and `process_count` (note that this is the total number of processes, ie, `num_nodes * process_count_per_node`). In Lightning Trainer module, specify both `num_nodes` and `gpus` to be consistent with `PyTorchConfiguration`. For example, `num_nodes = node_count` and `gpus = process_count_per_node`.

- Using MPI Configuration: 

   - Define `MpiConfiguration` and specify both `node_count` and `process_count_per_node`. In Lightning Trainer, specify both `num_nodes` and `gpus` to be respectively the same as `node_count` and `process_count_per_node` from `MpiConfiguration`. 
   - For multi-node training with MPI, Lightning requires the following environment variables to be set on each node of your training cluster:
      - MASTER_ADDR
      - MASTER_PORT
      - NODE_RANK
      - LOCAL_RANK
      
      Manually set these environment variables that Lightning requires in the main training scripts:

   ```python
   import os
   from argparse import ArgumentParser

   def set_environment_variables_for_mpi(num_nodes, gpus_per_node, master_port=54965):
       if num_nodes > 1:
           os.environ["MASTER_ADDR"], os.environ["MASTER_PORT"] = os.environ["AZ_BATCH_MASTER_NODE"].split(":")
       else:
           os.environ["MASTER_ADDR"] = os.environ["AZ_BATCHAI_MPI_MASTER_NODE"]
           os.environ["MASTER_PORT"] = str(master_port)

       try:
           os.environ["NODE_RANK"] = str(int(os.environ.get("OMPI_COMM_WORLD_RANK")) // gpus_per_node)
           # additional variables
           os.environ["MASTER_ADDRESS"] = os.environ["MASTER_ADDR"]
           os.environ["LOCAL_RANK"] = os.environ["OMPI_COMM_WORLD_LOCAL_RANK"]
           os.environ["WORLD_SIZE"] = os.environ["OMPI_COMM_WORLD_SIZE"]
       except:
           # fails when used with pytorch configuration instead of mpi
           pass
           
   if __name__ == "__main__":
       parser = ArgumentParser()
       parser.add_argument("--num_nodes", type=int, required=True)
       parser.add_argument("--gpus_per_node", type=int, required=True)
       args = parser.parse_args()
       set_environment_variables_for_mpi(args.num_nodes, args.gpus_per_node)
       
       trainer = Trainer(
        num_nodes=args.num_nodes,
        gpus=args.gpus_per_node
    )
   ```

     Lightning handles computing the world size from the Trainer flags `--gpus` and `--num_nodes`.

   ```python
   from azureml.core import ScriptRunConfig, Experiment
   from azureml.core.runconfig import MpiConfiguration

   nnodes = 2
   gpus_per_node = 4
   args = ['--max_epochs', 50, '--gpus_per_node', gpus_per_node, '--accelerator', 'ddp', '--num_nodes', nnodes]
   distr_config = MpiConfiguration(node_count=nnodes, process_count_per_node=gpus_per_node)

   run_config = ScriptRunConfig(
     source_directory='./src',
     script='train.py',
     arguments=args,
     compute_target=compute_target,
     environment=pytorch_env,
     distributed_job_config=distr_config,
   )

   run = Experiment(ws, 'experiment_name').submit(run_config)
   ```

### Hugging Face Transformers

Hugging Face provides many [examples](https://github.com/huggingface/transformers/tree/master/examples) for using its Transformers library with `torch.distributed.launch` to run distributed training. To run these examples and your own custom training scripts using the Transformers Trainer API, follow the [Using `torch.distributed.launch`](#distributeddataparallel-per-process-launch) section.

Sample job configuration code to fine-tune the BERT large model on the text classification MNLI task using the `run_glue.py` script on one node with 8 GPUs:

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import PyTorchConfiguration

distr_config = PyTorchConfiguration() # node_count defaults to 1
launch_cmd = "python -m torch.distributed.launch --nproc_per_node 8 text-classification/run_glue.py --model_name_or_path bert-large-uncased-whole-word-masking --task_name mnli --do_train --do_eval --max_seq_length 128 --per_device_train_batch_size 8 --learning_rate 2e-5 --num_train_epochs 3.0 --output_dir /tmp/mnli_output".split()

run_config = ScriptRunConfig(
  source_directory='./src',
  command=launch_cmd,
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)
```

You can also use the [per-process-launch](#distributeddataparallel-per-process-launch) option to run distributed training without using `torch.distributed.launch`. One thing to keep in mind if using this method is that the transformers [TrainingArguments](https://huggingface.co/docs/transformers/main_classes/trainer#transformers.TrainingArguments) expect the local rank to be passed in as an argument (`--local_rank`). `torch.distributed.launch` takes care of this when `--use_env=False`, but if you are using per-process-launch you'll need to explicitly pass the local rank in as an argument to the training script `--local_rank=$LOCAL_RANK` as Azure Machine Learning only sets the `LOCAL_RANK` environment variable.

## TensorFlow

If you're using [native distributed TensorFlow](https://www.tensorflow.org/guide/distributed_training) in your training code, such as TensorFlow 2.x's `tf.distribute.Strategy` API, you can launch the distributed job via Azure Machine Learning using the `TensorflowConfiguration`.

To do so, specify a `TensorflowConfiguration` object to the `distributed_job_config` parameter of the `ScriptRunConfig` constructor. If you're using `tf.distribute.experimental.MultiWorkerMirroredStrategy`, specify the `worker_count` in the `TensorflowConfiguration` corresponding to the number of nodes for your training job.

```python
from azureml.core import ScriptRunConfig, Environment, Experiment
from azureml.core.runconfig import TensorflowConfiguration

curated_env_name = 'AzureML-TensorFlow-2.3-GPU'
tf_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = TensorflowConfiguration(worker_count=2, parameter_server_count=0)

run_config = ScriptRunConfig(
  source_directory='./src',
  script='train.py',
  compute_target=compute_target,
  environment=tf_env,
  distributed_job_config=distr_config,
)

# submit the run configuration to start the job
run = Experiment(ws, "experiment_name").submit(run_config)
```

If your training script uses the parameter server strategy for distributed training, such as for legacy TensorFlow 1.x, you'll also need to specify the number of parameter servers to use in the job, for example, `tf_config = TensorflowConfiguration(worker_count=2, parameter_server_count=1)`.

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

- [azureml-examples: Distributed TensorFlow training with MultiWorkerMirroredStrategy](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/workflows/train/tensorflow/mnist-distributed)

## <a name="infiniband"></a> Accelerating distributed GPU training with InfiniBand

As the number of VMs training a model increases, the time required to train that model should decrease. The decrease in time, ideally, should be linearly proportional to the number of training VMs. For instance, if training a model on one VM takes 100 seconds, then training the same model on two VMs should ideally take 50 seconds. Training the model on four VMs should take 25 seconds, and so on.

InfiniBand can be an important factor in attaining this linear scaling. InfiniBand enables low-latency, GPU-to-GPU communication across nodes in a cluster. InfiniBand requires specialized hardware to operate. Certain Azure VM series, specifically the NC, ND, and H-series, now have RDMA-capable VMs with SR-IOV and InfiniBand support. These VMs communicate over the low latency and high-bandwidth InfiniBand network, which is much more performant than Ethernet-based connectivity. SR-IOV for InfiniBand enables near bare-metal performance for any MPI library (MPI is used by many distributed training frameworks and tooling, including NVIDIA's NCCL software.) These SKUs are intended to meet the needs of computationally intensive, GPU-acclerated machine learning workloads. For more information, see [Accelerating Distributed Training in Azure Machine Learning with SR-IOV](https://techcommunity.microsoft.com/t5/azure-ai/accelerating-distributed-training-in-azure-machine-learning/ba-p/1059050).

Typically, VM SKUs with an 'r' in their name contain the required InfiniBand hardware, and those without an 'r' typically do not. ('r' is a reference to RDMA, which stands for "remote direct memory access.") For instance, the VM SKU `Standard_NC24rs_v3` is InfiniBand-enabled, but the SKU  `Standard_NC24s_v3` is not.  Aside from the InfiniBand capabilities, the specs between these two SKUs are largely the same – both have 24 cores, 448 GB RAM, 4 GPUs of the same SKU, etc. [Learn more about RDMA- and InfiniBand-enabled machine SKUs](../../virtual-machines/sizes-hpc.md#rdma-capable-instances).

>[!WARNING]
>The older-generation machine SKU `Standard_NC24r`  is RDMA-enabled, but it does not contain SR-IOV hardware required for InfiniBand.

If you create an `AmlCompute` cluster of one of these RDMA-capable, InfiniBand-enabled sizes, the OS image will come with the Mellanox OFED driver required to enable InfiniBand preinstalled and preconfigured.

## Next steps

* [Deploy machine learning models to Azure](../how-to-deploy-online-endpoints.md)
* [Reference architecture for distributed deep learning training in Azure](/azure/architecture/reference-architectures/ai/training-deep-learning)
