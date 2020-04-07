---
title: Use reinforcement learning (preview) to create models
titleSuffix: Azure Machine Learning
description: Create, review, and deploy reinforcement machine learning models with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: peterlu
author: peterclu
ms.date: 04/06/2020

---

# Reinforcement learning with Azure Machine Learning (preview)
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-enterprise-sku.md)]

In this article, you learn how to train a reinforcement learning (RL) agent to play the video game, Pong, using the Python library, Ray rllib. Use Azure Machine Learning to perform computationally expensive RL tasks without having to worry about managing multiple compute resources.

This article is based on the [Rllib Pong example](https://github.com/Azure/azureml-rl-preview/blob/master/Rllib%20Pong.ipynb) that can found in the Azure Machine Learning reinforcement learning [GitHub repository](https://github.com/Azure/azureml-rl-preview).

In this article you will learn how to:
1. Setup an RL experiment
1. Define head and worker nodes.
1. Create an RL estimator.
1. Submit an experiment.
1. Monitor results.

## Prerequisites

Run this code in either of these environments:

 - Azure Machine Learning compute instance - no downloads or installation necessary

     - Complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md) to create a dedicated notebook server pre-loaded with the SDK.
 
 - Your own Jupyter Notebook server

    - [Install the Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).
        - Install the Azure Machine Learning RL SDK: `!pip install --upgrade azureml-contrib-reinforcementlearning`
    - Create a [workspace configuration file](how-to-configure-environment.md#workspace).
    - Run the [workspace setup notebook](https://github.com/Azure/azureml-rl-preview/blob/master/Workspace%20Setup.ipynb) to create a virtual network (vnet) that allows network ports used for distributed training.

## What is reinforcement learning

Reinforcement learning is 

### Reinforcement learning in Azure Machine Learning

Azure Machine Learning takes x, y x, 

## Set up the experiment

Set up the training experiment by loading the required Python packages, initializing your workspace, creating an experiment, and specifying a vnet.

### Import libraries

First, import the necessary Python libraries.

```python
# Azure ML Core imports
import azureml.core
from azureml.core import Workspace
from azureml.core import Experiment
from azureml.core.compute import AmlCompute
from azureml.core.compute import ComputeTarget
from azureml.core.runconfig import EnvironmentDefinition
from azureml.widgets import RunDetails
from azureml.tensorboard import Tensorboard

# Azure ML Reinforcement Learning imports
from azureml.contrib.train.rl import ReinforcementLearningEstimator, Ray
from azureml.contrib.train.rl import WorkerConfiguration
```

### Initialize a workspace

The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
ws = Workspace.from_config()
```

### Create a reinforcement learning experiment

Create an experiment to track your reinforcement learning run. In Azure Machine Learning, experiments are logical collections that let you easily find logs, run history, and outputs for related runs.

```python
experiment_name='rllib-pong'

exp = Experiment(workspace=ws, name=experiment_name)
```

### Specify a vnet

For RL jobs that use multiple compute targets, specify a vnet in your Azure Machine Learning resource group. The vnet must allow worker nodes to communicate with the head node. For more information on setting up your vnet, see the [workspace setup notebook](https://github.com/Azure/azureml-rl-preview/blob/master/Workspace%20Setup.ipynb) found in the prerequisites section.

```python
vnet = 'your_vnet'
```

## Define head and worker nodes

In this example, we show how to set up separate computing clusters for the Ray head and Ray workers. First we define the head cluster.

### Head computing cluster

```python
# choose a name for the Ray head cluster
compute_name = 'head-gpu'
compute_min_nodes = 0
compute_max_nodes = 2

# This example uses GPU VM. For using CPU VM, set SKU to STANDARD_D2_V2
vm_size = 'STANDARD_NC6'

if compute_name in ws.compute_targets:
    compute_target = ws.compute_targets[compute_name]
    if compute_target and type(compute_target) is AmlCompute:
        print(f'found compute target. just use it {compute_name}')
else:
    print('creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size = vm_size,
                                                                min_nodes = compute_min_nodes, 
                                                                max_nodes = compute_max_nodes,
                                                               vnet_resourcegroup_name = ws.resource_group,
                                                               vnet_name = vnet_name,
                                                               subnet_name = 'default')

    # create the cluster
    compute_target = ComputeTarget.create(ws, compute_name, provisioning_config)
    
    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
    
     # For a more detailed view of current AmlCompute status, use get_status()
    print(compute_target.get_status().serialize())
```

### Worker computing cluster

```python
# choose a name for your Ray worker cluster
worker_compute_name = 'worker-cpu'
worker_compute_min_nodes = 0 
worker_compute_max_nodes = 5

# This example uses CPU VM. For using GPU VM, set SKU to STANDARD_NC6
worker_vm_size = 'STANDARD_D2_V2'

# Create the compute target if it hasn't been created already
if worker_compute_name in ws.compute_targets:
    worker_compute_target = ws.compute_targets[worker_compute_name]
    if worker_compute_target and type(worker_compute_target) is AmlCompute:
        print('found compute target. just use it {worker_compute_name}')
else:
    print('creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size = worker_vm_size,
                                                                min_nodes = worker_compute_min_nodes, 
                                                                max_nodes = worker_compute_max_nodes,
                                                               vnet_resourcegroup_name = ws.resource_group,
                                                               vnet_name = vnet_name,
                                                               subnet_name = 'default')

    # create the cluster
    worker_compute_target = ComputeTarget.create(ws, worker_compute_name, provisioning_config)
    
    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    worker_compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
    
     # For a more detailed view of current AmlCompute status, use get_status()
    print(worker_compute_target.get_status().serialize())
```

## Create a reinforcement learning estimator

Use the ReinforcementLearningEstimator to specify how to submit your training job. Azure Machine Learning uses the estimator class to encapsulate run configuration information. This simplifies the process of specifying how a script is executed. In this case, the estimator specifies how the entry script, `rllib-pong.py` is run.

Currently, Azure Machine Learning reinforcement learning only supports the Ray framework.

### Define a worker configuration

In this estimator, you first define a worker configuration that specifies the following for your worker cluster:
    - A WorkerConfiguration object that points to your worker cluster
    - The number of virtual machines you want to use
    - Whether to use GPU or CPU
    - Any package dependencies the workers need


```python
# The pip packages we will use for both head and worker
pip_packages={}

# Specify the Ray worker configuration
worker_conf = WorkerConfiguration(
    
    # Azure ML compute cluster to run Ray workers
    compute_target=worker_compute_target, 
    
    # Number of worker nodes
    node_count = 4,
    
    # GPU
    use_gpu=False, 
    
    # PIP packages to use
    pip_packages=pip_packages
)
```

### Define the reinforcement learning estimator

The estimator takes the worker configuration along with additional information such as the location of the entry script and an RL framework to specify how to run the training job.

In this case, define the same PIP packages as dependencies for both head and worker notes. Since we have not defined a simulator configuration, the game simulations will run directly on the worker compute nodes.

```python

estimator = ReinforcementLearningEstimator(
    
    # Location of source files
    source_directory='files',
    
    # Python script file
    entry_script="rllib-pong.py",
    
    # Parameters to pass to the script file
    # Define above.
    script_params={},
    
    # The Azure ML compute target set up for Ray head nodes
    compute_target=compute_target,
    
    # Pip packages
    pip_packages=pip_packages,
    
    # GPU usage
    use_gpu=True,
    
    # RL framework. Currently must be Ray.
    rl_framework=Ray(),
    
    # Ray worker configuration defined above.
    worker_configuration=worker_conf,
    
    # Simulator configuration (future use)
    simulator_configuration=None,
    
    # How long to wait for whole cluster to start
    cluster_coordination_timeout_seconds=3600,
    
    # Maximum time for the whole Ray job to run
    # This will cut off the run after an hour
    max_run_duration_seconds=3600
)
```

### Entry script

The entry script 

## Submit a run

The [Run object](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py) provides the interface to the run history while the job is running and after it has completed.

```python
run = exp.submit(config=estimator)
```

## Next steps

* [Learn how to consume a web service](https://docs.microsoft.com/azure/machine-learning/how-to-consume-web-service).
* [Understand automated machine learning results](how-to-understand-automated-ml.md).
* [Learn more about automated machine learning](concept-automated-ml.md) and Azure Machine Learning.
