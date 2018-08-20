---
title: Set up compute targets for model training with Azure Machine Learning service | Microsoft Docs
description: This article explains how to configure compute targets on which you can train your machine learning models with Azure Machine Learning service
services: machine-learning
author: gokhanuluderya-msft
ms.author: gokhanu
manager: haining
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/24/2018
---
# How to select and use a compute target to train your model

With the Azure Machine Learning service, you can train your model in several different environments. These environments, called __compute targets__, can be local or in the cloud. In this document, you will learn about the supported compute targets and how to use them.

A compute target is the compute resource used to execute your training script or host your web service deployment. They can be created and managed by using Azure Machine Learning Python SDK or CLI. You can also attach existing compute targets to your workspace in Azure portal. You can start with local runs on your machine, but then follow an easy path for scaling up and out to other environments such as remote Data Science VMs with GPU or Batch AI clusters.

## Supported compute targets

The following is a list of supported compute targets:

* Your local computer
* A Linux virtual machine in Linux. For example, the Data Science Virtual Machine.
* Azure Batch AI
* Azure Container Instance

[TBD - why use one over the other This might be inline in the bulleted list, or it might be better formatted as a table.]
Key differentiators

|Compute target|Difference|
|----|-----|
|Local computer|Local|


## Workflow

The workflow for developing and deploying a model with Azure Machine Learning follows these steps:

1. Develop machine learning training scripts in Python.
1. Create and configure a compute target.
1. Submit the scripts to the compute target.
1. Inspect the run heitory to find the best model.
1. Register the model in the model registery.
1. Deploy the model.

Your training script isn't tied to a specific compute target. You can train initially on your local computer, then switch targets to a VM or Azure Batch AI without having to rewrite the training script.

## Local computer

More info on local computer and example of using local computer

## Azure Virtual Machine

more info on vm and example.

## Azure Batch AI

more info on batch ai.

The following example creates an Azure Batch AI compute target and display the status. The `compute_target` object can be used to submit your project for training:

```python
# Create a new compute target to train on Azure Batch AI
from azureml.core.compute import ComputeTarget, BatchAiCompute
from azureml.core.compute_target import ComputeTargetException

# Name the Batch AI cluster
batchai_cluster_name = "gpucluster2"

# Try to find an existing compute target in the workspace. If none exists,
#   create a new one.
try:
    compute_target = ComputeTarget(workspace = ws, name = batchai_cluster_name)
    print('found compute target. just use it.')
except ComputeTargetException:
    print('creating a new compute target...')
    provisioning_config = BatchAiCompute.provisioning_configuration(vm_size = "STANDARD_NC6", # NC6 is GPU-enabled
                                                                #vm_priority = 'lowpriority', # optional
                                                                autoscale_enabled = True,
                                                                cluster_min_nodes = 1, 
                                                                cluster_max_nodes = 4)
    # create the cluster
    compute_target = ComputeTarget.create(ws, batchai_cluster_name, provisioning_config)

    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_provisioning(show_output = True, min_node_count = None, timeout_in_minutes = 20)

     # For a more detailed view of current Batch AI cluster status, use the 'status' property    
    print(compute_target.status.serialize())
```

For more information on using the BatchAiCompute object, see [tbd]. 

## Azure Container Instance


## Next steps
* [What is Azure Machine Learning service](overview-what-is-azure-ml.md)
* [Quickstart: Create a workspace with Python](quickstart-get-started.md)
* [Quickstart: Create a workspace with Azure CLI](quickstart-get-started-with-cli.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)



## Next steps
* [What is Azure Machine Learning service](overview-what-is-azure-ml.md)
* [Quickstart: Create a workspace with Python](quickstart-get-started.md)
* [Quickstart: Create a workspace with Azure CLI](quickstart-get-started-with-cli.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
