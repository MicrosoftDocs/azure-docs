---
title: REMOVED from PyTorch 
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning enables you to scale out a TensorFlow training job using elastic cloud compute resources.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: minxia
author: mx-iao
ms.date: 09/28/2020
ms.topic: how-to

# Customer intent: As a TensorFlow developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my deep learning models at scale. 
---
# REMOVED from PyTorch 

This content was removed from the [Train PyTorch models at scale with Azure Machine Learning](azure-docs-sdg/articles/machine-learning/how-to-train-pytorch.md) article.  Is there anything here that should be moved to the new [Distributed training with Azure Machine Learning](azure-docs-sdg/articles/machine-learning/concept-distributed-training.md)?

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source, all reduce framework for distributed training developed by Uber. It offers an easy path to writing distributed PyTorch code for training.

Your training code will have to be instrumented with Horovod for distributed training. For more information using Horovod with PyTorch, see the [Horovod documentation](https://horovod.readthedocs.io/en/stable/pytorch.html).

Additionally, make sure your training environment includes the **horovod** package. If you are using a PyTorch curated environment, horovod is already included as one of the dependencies. If you are using your own environment, make sure the horovod dependency is included, for example:

```yaml
channels:
- conda-forge
dependencies:
- python=3.6.2
- pip:
  - azureml-defaults
  - torch==1.6.0
  - torchvision==0.7.0
  - horovod==0.19.5
```

In order to execute a distributed job using MPI/Horovod on Azure ML, you must specify an [MpiConfiguration](/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration) to the `distributed_job_config` parameter of the ScriptRunConfig constructor. The below code will configure a 2-node distributed job running one process per node. If you would also like to run multiple processes per node (i.e. if your cluster SKU has multiple GPUs), additionally specify the `process_count_per_node` parameter in MpiConfiguration (the default is `1`).

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import MpiConfiguration

src = ScriptRunConfig(source_directory=project_folder,
                      script='pytorch_horovod_mnist.py',
                      compute_target=compute_target,
                      environment=pytorch_env,
                      distributed_job_config=MpiConfiguration(node_count=2))
```

For a full tutorial on running distributed PyTorch with Horovod on Azure ML, see [Distributed PyTorch with Horovod](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/pytorch/distributed-pytorch-with-horovod).

### DistributedDataParallel
If you are using PyTorch's built-in [DistributedDataParallel](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html) module that is built using the **torch.distributed** package in your training code, you can also launch the distributed job via Azure ML.

To launch a distributed PyTorch job on Azure ML, you have two options:
1. Per-process launch: specify the total number of worker processes you want to run, and Azure ML will handle launching each process.
2. Per-node launch with `torch.distributed.launch`: provide the `torch.distributed.launch` command you want to run on each node. The torch launch utility will handle launching the worker processes on each node.

There are no fundamental differences between these launch options; it is largely up to the user's preference or the conventions of the frameworks/libraries built on top of vanilla PyTorch (such as Lightning or Hugging Face).

#### Per-process launch
To use this option to run a distributed PyTorch job, do the following:
1. Specify the training script and arguments
2. Create a [PyTorchConfiguration](/python/api/azureml-core/azureml.core.runconfig.pytorchconfiguration) and specify the `process_count` as well as `node_count`. The `process_count` corresponds to the total number of processes you want to run for your job. This should typically equal the number of GPUs per node multiplied by the number of nodes. If `process_count` is not specified, Azure ML will by default launch one process per node.

Azure ML will set the following environment variables:
* `MASTER_ADDR` - IP address of the machine that will host the process with rank 0.
* `MASTER_PORT` - A free port on the machine that will host the process with rank 0.
* `NODE_RANK` - The rank of the node for multi-node training. The possible values are 0 to (total # of nodes - 1).
* `WORLD_SIZE` - The total number of processes. This should be equal to the total number of devices (GPU) used for distributed training.
* `RANK` - The (global) rank of the current process. The possible values are 0 to (world size - 1).
* `LOCAL_RANK` - The local (relative) rank of the process within the node. The possible values are 0 to (# of processes on the node - 1).

Since the required environment variables will be set for you by Azure ML, you can use [the default environment variable initialization method](https://pytorch.org/docs/stable/distributed.html#environment-variable-initialization) to initialize the process group in your training code.

The following code snippet configures a 2-node, 2-process-per-node PyTorch job:
```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import PyTorchConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = PyTorchConfiguration(process_count=4, node_count=2)

src = ScriptRunConfig(
  source_directory='./src',
  script='train.py',
  arguments=['--epochs', 25],
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

run = Experiment(ws, 'experiment_name').submit(src)
```

> [!WARNING]
> In order to use this option for multi-process-per-node training, you will need to use Azure ML Python SDK >= 1.22.0, as `process_count` was introduced in 1.22.0.

> [!TIP]
> If your training script passes information like local rank or rank as script arguments, you can reference the environment variable(s) in the arguments: `arguments=['--epochs', 50, '--local_rank', $LOCAL_RANK]`.

#### Per-node launch with `torch.distributed.launch`
PyTorch provides a launch utility in [torch.distributed.launch](https://pytorch.org/docs/stable/distributed.html#launch-utility) that users can use to launch multiple processes per node. The `torch.distributed.launch` module will spawn multiple training processes on each of the nodes.

The following steps will demonstrate how to configure a PyTorch job with a per-node-launcher on Azure ML that will achieve the equivalent of running the following command:

```shell
python -m torch.distributed.launch --nproc_per_node <num processes per node> \
  --nnodes <num nodes> --node_rank $NODE_RANK --master_addr $MASTER_ADDR \
  --master_port $MASTER_PORT --use_env \
  <your training script> <your script arguments>
```

1. Provide the `torch.distributed.launch` command to the `command` parameter of the `ScriptRunConfig` constructor. Azure ML will run this command on each node of your training cluster. `--nproc_per_node` should be less than or equal to the number of GPUs available on each node. `MASTER_ADDR`, `MASTER_PORT`, and `NODE_RANK` are all set by Azure ML, so you can just reference the environment variables in the command. Azure ML sets `MASTER_PORT` to 6105, but you can pass a different value to the `--master_port` argument of `torch.distributed.launch` command if you wish. (The launch utility will reset the environment variables.)
2. Create a `PyTorchConfiguration` and specify the `node_count`. You do not need to set `process_count` as Azure ML will default to launching one process per node, which will run the launch command you specified.

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import PyTorchConfiguration

curated_env_name = 'AzureML-PyTorch-1.6-GPU'
pytorch_env = Environment.get(workspace=ws, name=curated_env_name)
distr_config = PyTorchConfiguration(node_count=2)
launch_cmd = "python -m torch.distributed.launch --nproc_per_node 2 --nnodes 2 --node_rank $NODE_RANK --master_addr $MASTER_ADDR --master_port $MASTER_PORT --use_env train.py --epochs 50".split()

src = ScriptRunConfig(
  source_directory='./src',
  command=launch_cmd,
  compute_target=compute_target,
  environment=pytorch_env,
  distributed_job_config=distr_config,
)

run = Experiment(ws, 'experiment_name').submit(src)
```

For a full tutorial on running distributed PyTorch on Azure ML, see [Distributed PyTorch with DistributedDataParallel](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/pytorch/distributed-pytorch-with-distributeddataparallel).

### Troubleshooting

* **Horovod has been shut down**: In most cases, if you encounter "AbortedError: Horovod has been shut down", there was an underlying exception in one of the processes that caused Horovod to shut down. Each rank in the MPI job gets it own dedicated log file in Azure ML. These logs are named `70_driver_logs`. In case of distributed training, the log names are suffixed with `_rank` to make it easier to differentiate the logs. To find the exact error that caused Horovod to shut down, go through all the log files and look for `Traceback` at the end of the driver_log files. One of these files will give you the actual underlying exception. 
