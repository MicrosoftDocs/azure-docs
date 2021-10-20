---
title:  How to create and select Kubernetes instance types (preview)
description: Create and select Azure Arc-enabled Kubernetes cluster instance types for training and inferencing workloads in Azure Machine Learning.
titleSuffix: Azure Machine Learning
author: luisquintanilla
ms.author: luquinta
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/21/2021
ms.topic: how-to
---

# Kubernetes instance types (preview)

Learn how to create and select Kubernetes instances for Azure Machine Learning training and inferencing workloads.

## What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of compute nodes for training and inference workloads.  For an Azure VM, an example for an instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are defined by two elements:

* [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) - A `nodeSelector` lets you specify which node a pod should run on.  The node must have a corresponding label.
* [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) - The `resources` section defines the compute resources (CPU, memory and Nvidia GPU) for the pod.

## Create an instance type

Instance types are represented in a custom resource definition (CRD) that is installed with the Azure Machine Learning extension.  

To create a new instance type, create a new custom resource for the instance type CRD.  

For example, given the CRD `my_instance_type.yaml`:

```yaml
apiVersion: amlarc.azureml.com/v1alpha1
kind: InstanceType
metadata:
  name: myinstancetypename
spec:
  nodeSelector:
    mylabel: mylabelvalue
  resources:
    limits:
      cpu: "1"
      nvidia.com/gpu: 1
      memory: "2Gi"
    requests:
      cpu: "700m"
      memory: "1500Mi"
```

Use the `kubectl apply` command to create a new instance type.

```bash
kubectl apply -f my_instance_type.yaml
```

This operation creates an instance type with the following properties:

- Pods are scheduled only on nodes with label `mylabel: mylabelvalue`.
- Pods are assigned resource requests of `700m` CPU and `1500Mi` memory.
- Pods are assigned resource limits of `1` CPU, `2Gi` memory and `1` Nvidia GPU.

> [!NOTE]
> Nvidia GPU resources are only specified in the `limits` section.  For more information,
please refer to the Kubernetes [documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins).

## Default instance types

When a training or inference workload is submitted without an instance type, it uses the default instance type.  

To specify a default instance type for a Kubernetes cluster, create an instance type with name `defaultinstancetype` and define respective `nodeSelector` and `resources` properties like any other instance type.  The instance type is automatically recognized as the default.

If no default instance type is defined, the following default behavior applies:

* No nodeSelector is applied, meaning the pod can get scheduled on any node.
* The workload's pods are assigned the default resources:

    ```yaml
    resources:
        limits:
        cpu: "0.6"
        memory: "1536Mi"
        requests:
        cpu: "0.6"
        memory: "1536Mi"
    ```
    
> [!IMPORTANT]
> The default instance type will not appear as an InstanceType custom resource in the cluster,
but it will appear in all clients (UI, CLI, SDK).

## Select an instance type for training workloads

To select an instance type for a training job using Azure Machine Learning 2.0 CLI, specify its name as part of the `compute` section in the YAML specification file.  

```yaml
command: python -c "print('Hello world!')"
environment:
  docker:
    image: python
compute:
  target: azureml:<compute_target_name>
  instance_type: <instance_type_name>
```

In the above example, replace `<compute_target_name>` with the name of your Kubernetes compute
target and `<instance_type_name>` with the name of the instance type you wish to select.

## Select an instance type for inferencing workloads

<!-- TODO -->