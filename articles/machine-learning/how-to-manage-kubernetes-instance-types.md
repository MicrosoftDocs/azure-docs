---
title: Create and manage instance types for efficient utilization of compute resources
description: Learn about what instance types are, how to create and manage them, and what the benefits of using them are.
titleSuffix: Azure Machine Learning
author: bozhong68
ms.author: bozhlin
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 11/09/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Create and manage instance types for efficient utilization of compute resources

Instance types are an Azure Machine Learning concept that allows targeting certain types of compute nodes for training and inference workloads. For an Azure virtual machine, an example of an instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are represented in a custom resource definition (CRD) that's installed with the Azure Machine Learning extension. Two elements in the Azure Machine Learning extension represent the instance types:

- Use [nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) to specify which node a pod should run on. The node must have a corresponding label.
- In the [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) section, you can set the compute resources (CPU, memory, and NVIDIA GPU) for the pod.

If you [specify a nodeSelector field when deploying the Azure Machine Learning extension](./how-to-deploy-kubernetes-extension.md#review-azure-machine-learning-extension-configuration-settings), the `nodeSelector` field will be applied to all instance types. This means that:

- For each instance type that you create, the specified `nodeSelector` field should be a subset of the extension-specified `nodeSelector` field.
- If you use an instance type with `nodeSelector`, the workload will run on any node that matches both the extension-specified `nodeSelector` field and the instance-type-specified `nodeSelector` field.
- If you use an instance type without a `nodeSelector` field, the workload will run on any node that matches the extension-specified `nodeSelector` field.

## Create a default instance type

By default, an instance type called `defaultinstancetype` is created when you attach a Kubernetes cluster to an Azure Machine Learning workspace. Here's the definition:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "2Gi"
  limits:
    cpu: "2"
    memory: "2Gi"
    nvidia.com/gpu: null
```

If you don't apply a `nodeSelector` field, the pod can be scheduled on any node. The workload's pods are assigned default resources with 0.1 CPU cores, 2 GB of memory, and 0 GPUs for the request. The resources that the workload's pods use are limited to 2 CPU cores and 8 GB of memory.

The default instance type purposefully uses few resources. To ensure that all machine learning workloads run with appropriate resources (for example, GPU resource), we highly recommend that you [create custom instance types](#create-a-custom-instance-type).

Keep in mind the following points about the default instance type:

- `defaultinstancetype` doesn't appear as an `InstanceType` custom resource in the cluster when you're running the command ```kubectl get instancetype```, but it does appear in all clients (UI, Azure CLI, SDK).
- `defaultinstancetype` can be overridden with the definition of a custom instance type that has the same name.

## Create a custom instance type

To create a new instance type, create a new custom resource for the instance type CRD. For example:

```bash
kubectl apply -f my_instance_type.yaml
```

Here are the contents of *my_instance_type.yaml*:

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

The preceding code creates an instance type with the labeled behavior:

- Pods are scheduled only on nodes that have the label `mylabel: mylabelvalue`.
- Pods are assigned resource requests of `700m` for CPU and `1500Mi` for memory.
- Pods are assigned resource limits of `1` for CPU, `2Gi` for memory, and `1` for NVIDIA GPU.

Creation of custom instance types must meet the following parameters and definition rules, or it will fail:

| Parameter | Required or optional | Description |
| --- | --- | --- |
| `name` | Required | String values, which must be unique in a cluster.|
| `CPU request` | Required | String values, which can't be zero or empty. <br>You can specify the CPU in millicores; for example, `100m`. You can also specify it as full numbers. For example, `"1"` is equivalent to `1000m`.|
| `Memory request` | Required | String values, which can't be zero or empty. <br>You can specify the memory as a full number + suffix; for example, `1024Mi` for 1,024 mebibytes (MiB).|
| `CPU limit` | Required | String values, which can't be zero or empty. <br>You can specify the CPU in millicores; for example, `100m`. You can also specify it as full numbers. For example, `"1"` is equivalent to `1000m`.|
| `Memory limit` | Required | String values, which can't be zero or empty. <br>You can specify the memory as a full number + suffix; for example, `1024Mi` for 1024 MiB.|
| `GPU` | Optional | Integer values, which can be specified only in the `limits` section. <br>For more information, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins). |
| `nodeSelector` | Optional | Map of string keys and values. |

It's also possible to create multiple instance types at once:

```bash
kubectl apply -f my_instance_type_list.yaml
```

Here are the contents of *my_instance_type_list.yaml*:

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

The preceding example creates two instance types: `cpusmall` and `defaultinstancetype`. This `defaultinstancetype` definition overrides the `defaultinstancetype` definition that was created when you attached the Kubernetes cluster to the Azure Machine Learning workspace.

If you submit a training or inference workload without an instance type, it uses `defaultinstancetype`. To specify a default instance type for a Kubernetes cluster, create an instance type with the name `defaultinstancetype`. It's automatically recognized as the default.

## Select an instance type to submit a training job

### [Azure CLI](#tab/select-instancetype-to-trainingjob-with-cli)

To select an instance type for a training job by using the Azure CLI (v2), specify its name as part of the
`resources` properties section in the job YAML. For example:

```yaml
command: python -c "print('Hello world!')"
environment:
  image: library/python:latest
compute: azureml:<Kubernetes-compute_target_name>
resources:
  instance_type: <instance type name>
```

### [Python SDK](#tab/select-instancetype-to-trainingjob-with-sdk)

To select an instance type for a training job by using the SDK (v2), specify its name for the `instance_type` property in the `command` class. For example:

```python
from azure.ai.ml import command

# define the command
command_job = command(
    command="python -c "print('Hello world!')"",
    environment="AzureML-lightgbm-3.2-ubuntu18.04-py37-cpu@latest",
    compute="<Kubernetes-compute_target_name>",
    instance_type="<instance type name>"
)
```

---

In the preceding example, replace `<Kubernetes-compute_target_name>` with the name of your Kubernetes compute target. Replace `<instance type name>` with the name of the instance type that you want to select. If you don't specify an `instance_type` property, the system uses `defaultinstancetype` to submit the job.

## Select an instance type to deploy a model

### [Azure CLI](#tab/select-instancetype-to-modeldeployment-with-cli)

To select an instance type for a model deployment by using the Azure CLI (v2), specify its name for the `instance_type` property in the deployment YAML. For example:

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
  image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest
```

### [Python SDK](#tab/select-instancetype-to-modeldeployment-with-sdk)

To select an instance type for a model deployment by using the SDK (v2), specify its name for the `instance_type` property in the `KubernetesOnlineDeployment` class. For example:

```python
from azure.ai.ml import KubernetesOnlineDeployment,Model,Environment,CodeConfiguration

model = Model(path="./model/sklearn_mnist_model.pkl")
env = Environment(
    conda_file="./model/conda.yml",
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest",
)

# define the deployment
blue_deployment = KubernetesOnlineDeployment(
    name="blue",
    endpoint_name="<endpoint name>",
    model=model,
    environment=env,
    code_configuration=CodeConfiguration(
        code="./script/", scoring_script="score.py"
    ),
    instance_count=1,
    instance_type="<instance type name>",
)
```

---

In the preceding example, replace `<instance type name>` with the name of the instance type that you want to select. If you don't specify an `instance_type` property, the system uses `defaultinstancetype` to deploy the model.

> [!IMPORTANT]
> For MLflow model deployment, the resource request requires at least 2 CPU cores and 4 GB of memory. Otherwise, the deployment will fail.

### Resource section validation

You can use the `resources` section to define the resource request and limit of your model deployments. For example:

#### [Azure CLI](#tab/define-resource-to-modeldeployment-with-cli)

```yaml
name: blue
app_insights_enabled: true
endpoint_name: <endpoint name>
model: 
  path: ./model/sklearn_mnist_model.pkl
code_configuration:
  code: ./script/
  scoring_script: score.py
environment: 
  conda_file: file:./model/conda.yml
  image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest
resources:
  requests:
    cpu: "0.1"
    memory: "0.2Gi"
  limits:
    cpu: "0.2"
    #nvidia.com/gpu: 0
    memory: "0.5Gi"
instance_type: <instance type name>
```

#### [Python SDK](#tab/define-resource-to-modeldeployment-with-sdk)

```python
from azure.ai.ml import (
    KubernetesOnlineDeployment,
    Model,
    Environment,
    CodeConfiguration,
    ResourceSettings,
    ResourceRequirementsSettings
)

model = Model(path="./model/sklearn_mnist_model.pkl")
env = Environment(
    conda_file="./model/conda.yml",
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:latest",
)

requests = ResourceSettings(cpu="0.1", memory="0.2G")
limits = ResourceSettings(cpu="0.2", memory="0.5G", nvidia_gpu="1")
resources = ResourceRequirementsSettings(requests=requests, limits=limits)

# define the deployment
blue_deployment = KubernetesOnlineDeployment(
    name="blue",
    endpoint_name="<endpoint name>",
    model=model,
    environment=env,
    code_configuration=CodeConfiguration(
        code="./script/", scoring_script="score.py"
    ),
    resources=resources,
    instance_count=1,
    instance_type="<instance type name>",
)
```

---

If you use the `resources` section, a valid resource definition needs to meet the following rules. An invalid resource definition will cause the model deployment to fail.

| Parameter | Required or optional | Description |
| --- | --- | --- |
| `requests:`<br>`cpu:`| Required | String values, which can't be zero or empty. <br>You can specify the CPU in millicores; for example, `100m`. You can also specify it in full numbers. For example, `"1"` is equivalent to `1000m`.|
| `requests:`<br>`memory:` | Required | String values, which can't be zero or empty. <br>You can specify the memory as a full number + suffix; for example, `1024Mi` for 1024 MiB. <br>Memory can't be less than 1 MB.|
| `limits:`<br>`cpu:` | Optional <br>(required only when you need GPU) | String values, which can't be zero or empty. <br>You can specify the CPU in millicores; for example `100m`. You can also specify it in full numbers. For example, `"1"` is equivalent to `1000m`. |
| `limits:`<br>`memory:` | Optional <br>(required only when you need GPU) | String values, which can't be zero or empty. <br>You can specify the memory as a full number + suffix; for example, `1024Mi` for 1,024 MiB.|
| `limits:`<br>`nvidia.com/gpu:` | Optional <br>(required only when you need GPU) | Integer values, which can't be empty and can be specified only in the `limits` section. <br>For more information, see the [Kubernetes documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins). <br>If you require CPU only, you can omit the entire `limits` section.|

The instance type is *required* for model deployment. If you defined the `resources` section, and it will be validated against the instance type, the rules are as follows:

- With a valid `resource` section definition, the resource limits must be less than the instance type limits. Otherwise, deployment will fail.
- If you don't define an instance type, the system uses `defaultinstancetype` for validation with the `resources` section.
- If you don't define the `resources` section, the system uses the instance type to create the deployment.

## Next steps

- [Azure Machine Learning inference router and connectivity requirements](./how-to-kubernetes-inference-routing-azureml-fe.md)
- [Secure Azure Kubernetes Service inferencing environment](./how-to-secure-kubernetes-inferencing-environment.md)
