---
title: How to train machine learning models on Kubernetes clusters
description: As a data scientist, I want to know how I can run training jobs on a Kubernetes cluster
author: luisquintanilla
ms.author: luquinta
ms.service: machine-learning
ms.topic: how-to 
ms.date: 03/09/2021
---

# Train machine learning models on Kubernetes clusters

This guide shows you how you can attach Kubernetes clusters as a compute to run training experiments on Azure Machine Learning.

## Prerequisites

- Azure account. If you don't have one, sign up
- Kubernetes cluster. If you don't have one, [create a Kubernetes cluster using Azure Kubernetes Service (AKS)](/aks/kubernetes-walkthrough).

> [!TIP]
> [Connect to your Kubernetes cluster using Azure Arc](/azure-arc/kubernetes/quickstart-connect-cluster) if your cluster is hosted outside of Azure.

## Attach Kubernetes cluster compute

To use your Kubernetes cluster for training, you need to attach it to your Azure Machine Learning workspace. 

# Studio (#tab/studio)

1. Navigate to the [portal](https://ml.azure.com).
1. Select the **Compute** tab.
1. Select **Attached compute**.
1. Select **New+ > Kubernetes service**.
1. Enter the name of your compute.

# Python SDK (#tab/sdk)

1. Install the SDK
1. Attach the cluster

    ```python
    from azureml.contrib.core.compute.kubernetescompute import KubernetesCompute
    
    k8s_config = {
    }
    
    attach_config = KubernetesCompute.attach_configuration(
        resource_id="<YOUR-RESOURCE-ID>",
        aml_k8s_config=k8s_config
    )
    
    compute_target = KubernetesCompute.attach(ws, "aks-compute", attach_config)
    compute_target.wait_for_completion(show_output=True)
    ```

---

## Submit training job (Kubernetes)

Given an experiment, use the Python SDK

```python
from azureml.core import ScriptRunConfig

script_rc = ScriptRunConfig(
    source_directory='.',
    script='train.py',
    compute_target=cmaks_target
)

script_rc.run_config.amlk8scompute.resource_configuration.gpu_count = 1
script_rc.run_config.amlk8scompute.resource_configuration.cpu_count = 1
script_rc.run_config.amlk8scompute.resource_configuration.memory_request_in_gb = 1
 
run = experiment.submit(script_rc)
```

## Detach Kubernetes cluster compute

# [Studio](#tab/studio)

1. Select your compute
1. Select the **Details** tab.
1. Select **Detach**.

# [Python SDK](#tab/sdk)

```python
compute_target.detach()
```

---


## Next steps

- [Train PyTorch models at scale with Azure Machine Learning](how-to-train-pytorch.md)