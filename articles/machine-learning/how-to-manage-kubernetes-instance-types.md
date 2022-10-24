---
title: Create and manage instance types for efficient compute resource utilization
description: Learn about what is instance types, and how to create and manage them, and what are benefits of using instance types
titleSuffix: Azure Machine Learning
author: bozhong68
ms.author: bozhlin
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 08/31/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Create and manage instance types for efficient compute resource utilization

## What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of compute nodes for training and inference workloads.  For an Azure VM, an example for an instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are represented in a custom resource definition (CRD) that is installed with the AzureML extension. Instance types are represented by two elements in AzureML extension: 
[nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
and [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).

In short, a `nodeSelector` lets you specify which node a pod should run on.  The node must have a corresponding label.  In the `resources` section, you can set the compute resources (CPU, memory and NVIDIA GPU) for the pod.

## Default instance type

By default, a `defaultinstancetype` with following definition is created when you attach Kuberenetes cluster to AzureML workspace:
- No `nodeSelector` is applied, meaning the pod can get scheduled on any node.
- The workload's pods are assigned default resources with 0.6 cpu cores, 1536Mi memory and 0 GPU:
```yaml
resources:
  requests:
    cpu: "0.6"
    memory: "1536Mi"
  limits:
    cpu: "0.6"
    memory: "1536Mi"
    nvidia.com/gpu: null
```

> [!NOTE] 
> - The default instance type purposefully uses little resources.  To ensure all ML workloads run with appropriate resources, for example GPU resource, it is highly recommended to create custom instance types.
> - `defaultinstancetype` will not appear as an InstanceType custom resource in the cluster when running the command ```kubectl get instancetype```, but it will appear in all clients (UI, CLI, SDK).
> - `defaultinstancetype` can be overridden with a custom instance type definition having the same name as `defaultinstancetype` (see [Create custom instance types](#create-custom-instance-types) section)

### Create custom instance types

To create a new instance type, create a new custom resource for the instance type CRD.  For example:

```bash
kubectl apply -f my_instance_type.yaml
```

With `my_instance_type.yaml`:
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

The following steps will create an instance type with the labeled behavior:
- Pods will be scheduled only on nodes with label `mylabel: mylabelvalue`.
- Pods will be assigned resource requests of `700m` CPU and `1500Mi` memory.
- Pods will be assigned resource limits of `1` CPU, `2Gi` memory and `1` NVIDIA GPU.

> [!NOTE]
> - NVIDIA GPU resources are only specified in the `limits` section as integer values.  For more information,
  see the Kubernetes [documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins).
> - CPU and memory resources are string values.
> - CPU can be specified in millicores, for example `100m`, or in full numbers, for example `"1"`
  is equivalent to `1000m`.
> - Memory can be specified as a full number + suffix, for example `1024Mi` for 1024 MiB.

It's also possible to create multiple instance types at once:

```bash
kubectl apply -f my_instance_type_list.yaml
```

With `my_instance_type_list.yaml`:
```yaml
apiVersion: amlarc.azureml.com/v1alpha1
kind: InstanceTypeList
items:
  - metadata:
      name: cpusmall
    spec:
      resources:
        requests:
          cpu: "100m"
          memory: "100Mi"
        limits:
          cpu: "1"
          nvidia.com/gpu: 0
          memory: "1Gi"

  - metadata:
      name: defaultinstancetype
    spec:
      resources:
        requests:
          cpu: "1"
          memory: "1Gi" 
        limits:
          cpu: "1"
          nvidia.com/gpu: 0
          memory: "1Gi"
```

The above example creates two instance types: `cpusmall` and `defaultinstancetype`.  This `defaultinstancetype` definition will override the `defaultinstancetype` definition created when Kubernetes cluster was attached to AzureML workspace. 

If a training or inference workload is submitted without an instance type, it uses the `defaultinstancetype`.  To specify a default instance type for a Kubernetes cluster, create an instance type with name `defaultinstancetype`.  It will automatically be recognized as the default.


### Select instance type to submit training job

To select an instance type for a training job using CLI (V2), specify its name as part of the
`resources` properties section in job YAML.  For example:
```yaml
command: python -c "print('Hello world!')"
environment:
  image: library/python:latest
compute: azureml:<compute_target_name>
resources:
  instance_type: <instance_type_name>
```

In the above example, replace `<compute_target_name>` with the name of your Kubernetes compute
target and `<instance_type_name>` with the name of the instance type you wish to select. If there's no `instance_type` property specified, the system will use `defaultinstancetype` to submit job.

### Select instance type to deploy model

To select an instance type for a model deployment using CLI (V2), specify its name for `instance_type` property in deployment YAML.  For example:

```yaml
name: blue
app_insights_enabled: true
endpoint_name: <endpoint name>
model: 
  path: ./model/sklearn_mnist_model.pkl
code_configuration:
  code: ./script/
  scoring_script: score.py
instance_type: <instance type name>
environment: 
  conda_file: file:./model/conda.yml
  image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1
```

In the above example, replace `<instance_type_name>` with the name of the instance type you wish to select. If there's no `instance_type` property specified, the system will use `defaultinstancetype` to deploy model.

## Next steps

- [AzureML inference router and connectivity requirements](./how-to-kubernetes-inference-routing-azureml-fe.md)
- [Secure AKS inferencing environment](./how-to-secure-kubernetes-inferencing-environment.md)