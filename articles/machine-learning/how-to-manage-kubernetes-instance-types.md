---
title: Create and manage instance types for efficient compute resource utilization
description: Learn about what is instance types, and how to create and manage them, and what are benefits of using instance types
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

# Create and manage instance types for efficient compute resource utilization

## What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of compute nodes for training and inference workloads.  For an Azure VM, an example for an instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are represented in a custom resource definition (CRD) that is installed with the Azure Machine Learning extension. Two elements in Azure Machine Learning extension represent the instance types: 
[nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
and [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).

In short, a `nodeSelector` lets you specify which node a pod should run on.  The node must have a corresponding label.  In the `resources` section, you can set the compute resources (CPU, memory and NVIDIA GPU) for the pod.

>[!IMPORTANT]
> 
> If you have [specified a nodeSelector when deploying the Azure Machine Learning extension](./how-to-deploy-kubernetes-extension.md#review-azure-machine-learning-extension-configuration-settings), the nodeSelector will be applied to all instance types.  This means that:
> - For each instance type creating, the specified nodeSelector should be a subset of the extension-specified nodeSelector. 
> - If you use an instance type **with nodeSelector**, the workload will run on any node matching both the extension-specified nodeSelector and the instance type-specified nodeSelector.
> - If you use an instance type **without a nodeSelector**, the workload will run on any node mathcing the extension-specified nodeSelector.


## Default instance type

By default, a `defaultinstancetype` with the following definition is created when you attach a Kubernetes cluster to an Azure Machine Learning workspace:
- If you don't apply a `nodeSelector`, it means the pod can get scheduled on any node.
- The workload's pods are assigned default resources with 0.1 cpu cores, 2-GB memory and 0 GPU for request.
- The resources used by the workload's pods are limited to 2 cpu cores and 8-GB memory:

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

The following steps create an instance type with the labeled behavior:
- Pods are scheduled only on nodes with label `mylabel: mylabelvalue`.
- Pods are assigned resource requests of `700m` CPU and `1500Mi` memory.
- Pods are assigned resource limits of `1` CPU, `2Gi` memory and `1` NVIDIA GPU.

Creation of custom instance types must meet the following parameters and definition rules, otherwise the instance type creation fails:

| Parameter | Required | Description |
| --- | --- | --- |
| name | required | String values, which must be unique in cluster.|
| CPU request | required | String values, which cannot be 0 or empty. <br>You can specify the CPU in millicores; for example, `100m`. You can also specify it as full numbers; for example, `"1"` is equivalent to `1000m`.|
| Memory request | required | String values, which cannot be 0 or empty. <br>You can specify the memory as a full number + suffix; for example, `1024Mi` for 1024 MiB.|
| CPU limit | required | String values, which cannot be 0 or empty. <br>You can specify the CPU in millicores; for example, `100m`. You can also specify it as full numbers; for example, `"1"` is equivalent to `1000m`.|
| Memory limit | required | String values, which cannot be 0 or empty. <br>You can specify the memory as a full number + suffix; for example, `1024Mi` for 1024 MiB.|
| GPU | optional | Integer values, which can only be specified in the `limits` section. <br>For more information, see the Kubernetes [documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins). |
| nodeSelector | optional | Map of string keys and values. |


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

The above example creates two instance types: `cpusmall` and `defaultinstancetype`.  This `defaultinstancetype` definition overrides the `defaultinstancetype` definition created when Kubernetes cluster was attached to Azure Machine Learning workspace. 

If you submit a training or inference workload without an instance type, it uses the `defaultinstancetype`.  To specify a default instance type for a Kubernetes cluster, create an instance type with name `defaultinstancetype`.  It's automatically recognized as the default.


### Select instance type to submit training job

#### [Azure CLI](#tab/select-instancetype-to-trainingjob-with-cli)

To select an instance type for a training job using CLI (V2), specify its name as part of the
`resources` properties section in job YAML.  For example:

```yaml
command: python -c "print('Hello world!')"
environment:
  image: library/python:latest
compute: azureml:<Kubernetes-compute_target_name>
resources:
  instance_type: <instance_type_name>
```

#### [Python SDK](#tab/select-instancetype-to-trainingjob-with-sdk)

To select an instance type for a training job using SDK (V2), specify its name for `instance_type` property in `command` class.  For example:

```python
from azure.ai.ml import command

# define the command
command_job = command(
    command="python -c "print('Hello world!')"",
    environment="AzureML-lightgbm-3.2-ubuntu18.04-py37-cpu@latest",
    compute="<Kubernetes-compute_target_name>",
    instance_type="<instance_type_name>"
)
```
---

In the above example, replace `<Kubernetes-compute_target_name>` with the name of your Kubernetes compute
target and replace `<instance_type_name>` with the name of the instance type you wish to select. If there's no `instance_type` property specified, the system uses `defaultinstancetype` to submit the job.

### Select instance type to deploy model

#### [Azure CLI](#tab/select-instancetype-to-modeldeployment-with-cli)

To select an instance type for a model deployment using CLI (V2), specify its name for the `instance_type` property in the deployment YAML.  For example:

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

#### [Python SDK](#tab/select-instancetype-to-modeldeployment-with-sdk)

To select an instance type for a model deployment using SDK (V2), specify its name for the `instance_type` property in the `KubernetesOnlineDeployment` class.  For example:

```python
from azure.ai.ml import KubernetesOnlineDeployment,Model,Environment,CodeConfiguration

model = Model(path="./model/sklearn_mnist_model.pkl")
env = Environment(
    conda_file="./model/conda.yml",
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
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

In the above example, replace `<instance_type_name>` with the name of the instance type you wish to select. If there's no `instance_type` property specified, the system uses `defaultinstancetype` to deploy the model.

#### Resource section validation
If you're using the `resource section` to define the resource request and limit of your model deployments, for example:

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
  image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1
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
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
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

If you use the `resource section`, the valid resource definition need to meet the following rules, otherwise the model deployment fails due to the invalid resource definition:

|  Parameter | If necessary | Description |
| --- | --- | --- |
| `requests:`<br>`cpu:`| Required | String values, which can't be 0 or empty. <br>You can specify the CPU in millicores, for example `100m`, or in full numbers, for example `"1"` is equivalent to `1000m`.|
| `requests:`<br>`memory:` | Required | String values, which can't be 0 or empty. <br>You can specify the memory as a full number + suffix, for example `1024Mi` for 1024 MiB. <br>Memory can't be less than **1 MBytes**.|
| `limits:`<br>`cpu:` | Optional <br>(only required when need GPU) | String values, which can't be 0 or empty. <br>You can specify the CPU in millicores, for example `100m`, or in full numbers, for example `"1"` is equivalent to `1000m`. |
|  `limits:`<br>`memory:` | Optional <br>(only required when need GPU) | String values, which can't be 0 or empty. <br>You can specify the memory as a full number + suffix, for example `1024Mi` for 1024 MiB.|
| `limits:`<br>`nvidia.com/gpu:` | Optional <br>(only required when need GPU) | Integer values, which can't be empty and can only be specified in the `limits` section. <br>For more information, see the Kubernetes [documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins). <br>If require CPU only, you can omit the entire `limits` section.|

> [!NOTE]
>
>If the resource section definition is invalid, the deployment will fail.
>
> The `instance type` is **required** for model deployment. If you have defined the resource section, and it will be validated against the instance type, the rules are as follows:
  > * With a valid resource section definition, the resource limits must be less than instance type limits, otherwise deployment will fail. 
  > * If the user does not define instance type, the `defaultinstancetype` will be used to be validated with resource section.
  > * If the user does not define resource section, the instance type will be used to create deployment. 


## Next steps

- [Azure Machine Learning inference router and connectivity requirements](./how-to-kubernetes-inference-routing-azureml-fe.md)
- [Secure AKS inferencing environment](./how-to-secure-kubernetes-inferencing-environment.md)
