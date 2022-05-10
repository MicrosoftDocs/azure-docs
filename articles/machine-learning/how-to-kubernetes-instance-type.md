---
title: How to create and select Kubernetes instance types (preview)
description: Create and select Azure Arc-enabled Kubernetes cluster instance types for training and inferencing workloads in Azure Machine Learning.
titleSuffix: Azure Machine Learning
author: ssalgadodev
ms.author: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 10/21/2021
ms.topic: how-to
ms.custom: ignite-fall-2021
---

# Create and select Kubernetes instance types (preview)

Learn how to create and select Kubernetes instances for Azure Machine Learning training and inferencing workloads on Azure Arc-enabled Kubernetes clusters.

## What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of compute nodes for training and inference workloads.  For an Azure VM, an example for an instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are defined by two elements:

* [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) - A `nodeSelector` lets you specify which node a pod should run on.  The node must have a corresponding label.
* [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) - The `resources` section defines the compute resources (CPU, memory and Nvidia GPU) for the pod.

## Create instance types

Instance types are represented in a custom resource definition (CRD) that is installed with the Azure Machine Learning extension.  

### Create a single instance type

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
> When you specify your CRD, consider make note of the following conventions:
> - Nvidia GPU resources are only specified in the `limits` section.  For more information, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins).
> - CPU and memory resources are string values.
> - CPU can be specified in millicores (`100m`) or in full numbers (`"1"` which is equivalent to `1000m`).
> - Memory can be specified as a full number + suffix (`1024Mi` for `1024 MiB`).

### Create multiple instance types

You can also use CRDs to create multiple instance types at once.

For example, given the CRD `my_instance_type.yaml`:

```yaml
apiVersion: amlarc.azureml.com/v1alpha1
kind: InstanceTypeList
items:
  - metadata:
      name: cpusmall
    spec:
      resources:
        limits:
          cpu: "100m"
          nvidia.com/gpu: 0
          memory: "1Gi"
        requests:
          cpu: "100m"
          memory: "10Mi"

  - metadata:
      name: defaultinstancetype
    spec:
      resources:
        limits:
          cpu: "1"
          nvidia.com/gpu: 0
          memory: "1Gi"
        requests:
          cpu: "1"
          memory: "1Gi" 
```

Use the `kubectl apply` command to create multiple instance types.

```bash
kubectl apply -f my_instance_type.yaml
``` 

This operation creates two instance types, one called `defaultinstancetype` and the other `cpusmall` with different resource specifications. For more information on default instance types, see the [default instance types](#default-instance-types) section of this document.

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
> The default instance type will not appear as an InstanceType custom resource in the cluster, but it will appear in all clients (Azure Machine Learning studio, Azure CLI, Python SDK).

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

In the example above, replace `<compute_target_name>` with the name of your Kubernetes compute target and `<instance_type_name>` with the name of the instance type you wish to select.

> [!TIP]
> The default instance type purposefully uses little resources. To ensure all machine learning workloads run successfully with the adequate resources, it is highly recommended to create custom instance types.

## Select an instance type for inferencing workloads

To select an instance type for inferencing workloads using the Azure Machine Learning 2.0 CLI, specify its name as part of the `deployments` section.  For example:

```yaml
type: online
auth_mode: key
target: azureml:<your compute target name>
traffic:
  blue: 100

deployments:
  - name: blue
    app_insights_enabled: true
    model: 
      name: sklearn_mnist_model
      version: 1
      local_path: ./model/sklearn_mnist_model.pkl
    code_configuration:
      code: 
        local_path: ./script/
      scoring_script: score.py
    instance_type: <instance_type_name>
    environment: 
      name: sklearn-mnist-env
      version: 1
      path: .
      conda_file: file:./model/conda.yml
      docker:
        image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1
```

In the example above, replace `<instance_type_name>` with the name of the instance type you wish to select.

## Next steps

- [Configure Azure Arc-enabled machine learning (preview)](how-to-attach-arc-kubernetes.md)
- [Train models (create jobs) with the CLI (v2)](how-to-train-cli.md)
- [Deploy and score a machine learning model by using an online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
