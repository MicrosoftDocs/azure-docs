---
title: Reference for configuring Kubernetes cluster for Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Reference for configuring Kubernetes cluster for Azure Machine Learning.
services: machine-learning
author: zhongj
ms.author: jinzhong
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.date: 06/06/2022
---

# Reference for configuring Kubernetes cluster for Azure Machine Learning

This article contains reference information that may be useful when [configuring Kubernetes with Azure Machine Learning](./how-to-attach-kubernetes-anywhere.md).

## Supported Kubernetes version and region


- Kubernetes clusters installing AzureML extension have a version support window of "N-2", that is aligned with [Azure Kubernetes Service (AKS) version support policy](../aks/supported-kubernetes-versions.md#kubernetes-version-support-policy), where 'N' is the latest GA minor version of Azure Kubernetes Service.

  - For example, if AKS introduces 1.20.a today, versions 1.20.a, 1.20.b, 1.19.c, 1.19.d, 1.18.e, and 1.18.f are supported.

  - If customers are running an unsupported Kubernetes version, they'll be asked to upgrade when requesting support for the cluster. Clusters running unsupported Kubernetes releases aren't covered by the AzureML extension support policies.
- AzureML extension region availability: 
  - AzureML extension can be deployed to AKS or Azure Arc-enabled Kubernetes in supported regions listed in [Azure Arc enabled Kubernetes region support](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc&regions=all).

## Prerequisites for ARO or OCP clusters
### Disable Security Enhanced Linux (SELinux) 

[AzureML dataset](./how-to-train-with-datasets.md) (used in AzureML training jobs) isn't supported on machines with SELinux enabled. Therefore, you need to disable `selinux`  on all workers in order to use AzureML dataset.

### Privileged setup for ARO and OCP

For AzureML extension deployment on ARO or OCP cluster, grant privileged access to AzureML service accounts, run ```oc edit scc privileged``` command, and add following service accounts under "users:":

* ```system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa```
* ```system:serviceaccount:azureml:{EXTENSION-NAME}-kube-state-metrics``` 
* ```system:serviceaccount:azureml:prom-admission```
* ```system:serviceaccount:azureml:default```
* ```system:serviceaccount:azureml:prom-operator```
* ```system:serviceaccount:azureml:load-amlarc-selinux-policy-sa```
* ```system:serviceaccount:azureml:azureml-fe-v2```
* ```system:serviceaccount:azureml:prom-prometheus```
* ```system:serviceaccount:{KUBERNETES-COMPUTE-NAMESPACE}:default```
* ```system:serviceaccount:azureml:azureml-ingress-nginx```
* ```system:serviceaccount:azureml:azureml-ingress-nginx-admission```

> [!NOTE]
> * `{EXTENSION-NAME}`: is the extension name specified with the `az k8s-extension create --name` CLI command. 
>* `{KUBERNETES-COMPUTE-NAMESPACE}`: is the namespace of the Kubernetes compute specified when attaching the compute to the Azure Machine Learning workspace. Skip configuring `system:serviceaccount:{KUBERNETES-COMPUTE-NAMESPACE}:default` if `KUBERNETES-COMPUTE-NAMESPACE` is `default`.

## AzureML extension components

For Arc-connected cluster, AzureML extension deployment will create [Azure Relay](../azure-relay/relay-what-is-it.md) in Azure cloud, used to route traffic between Azure services and the Kubernetes cluster. For AKS cluster without Arc connected, Azure Relay resource won't be created.

Upon AzureML extension deployment completes, it will create following resources in Kubernetes cluster, depending on each AzureML extension deployment scenario:

   |Resource name  |Resource type |Training |Inference |Training and Inference| Description | Communication with cloud|
   |--|--|--|--|--|--|--|
   |relayserver|Kubernetes deployment|**&check;**|**&check;**|**&check;**|relayserver is only needed in arc-connected cluster, and won't be installed in AKS cluster. Relayserver works with Azure Relay to communicate with the cloud services.|Receive the request of job creation, model deployment from cloud service; sync the job status with cloud service.|
   |gateway|Kubernetes deployment|**&check;**|**&check;**|**&check;**|The gateway is used to communicate and send data back and forth.|Send nodes and cluster resource information to cloud services.|
   |aml-operator|Kubernetes deployment|**&check;**|N/A|**&check;**|Manage the lifecycle of training jobs.| Token exchange with the cloud token service for authentication and authorization of Azure Container Registry.|
   |metrics-controller-manager|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Manage the configuration for Prometheus|N/A|
   |{EXTENSION-NAME}-kube-state-metrics|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Export the cluster-related metrics to Prometheus.|N/A|
   |{EXTENSION-NAME}-prometheus-operator|Kubernetes deployment|Optional|Optional|Optional| Provide Kubernetes native deployment and management of Prometheus and related monitoring components.|N/A|
   |amlarc-identity-controller|Kubernetes deployment|N/A|**&check;**|**&check;**|Request and renew Azure Blob/Azure Container Registry token through managed identity.|Token exchange with the cloud token service for authentication and authorization of Azure Container  Registry and Azure Blob used by inference/model deployment.|
   |amlarc-identity-proxy|Kubernetes deployment|N/A|**&check;**|**&check;**|Request and renew Azure Blob/Azure Container Registry token  through managed identity.|Token exchange with the cloud token service for authentication and authorization of Azure Container  Registry and Azure Blob used by inference/model deployment.|
   |azureml-fe-v2|Kubernetes deployment|N/A|**&check;**|**&check;**|The front-end component that routes incoming inference requests to deployed services.|Send service logs to Azure Blob.|
   |inference-operator-controller-manager|Kubernetes deployment|N/A|**&check;**|**&check;**|Manage the lifecycle of inference endpoints. |N/A|
   |volcano-admission|Kubernetes deployment|Optional|N/A|Optional|Volcano admission webhook.|N/A|
   |volcano-controllers|Kubernetes deployment|Optional|N/A|Optional|Manage the lifecycle of Azure Machine Learning training job pods.|N/A|
   |volcano-scheduler |Kubernetes deployment|Optional|N/A|Optional|Used to perform in-cluster job scheduling.|N/A|
   |fluent-bit|Kubernetes daemonset|**&check;**|**&check;**|**&check;**|Gather the components' system log.| Upload the components' system log to cloud.|
   |{EXTENSION-NAME}-dcgm-exporter|Kubernetes daemonset|Optional|Optional|Optional|dcgm-exporter exposes GPU metrics for Prometheus.|N/A|
   |nvidia-device-plugin-daemonset|Kubernetes daemonset|Optional|Optional|Optional|nvidia-device-plugin-daemonset exposes GPUs on each node of your cluster| N/A|
   |prometheus-prom-prometheus|Kubernetes statefulset|**&check;**|**&check;**|**&check;**|Gather and send job metrics to cloud.|Send job metrics like cpu/gpu/memory utilization to cloud.|

> [!IMPORTANT]
   > * Azure Relay resource  is under the same resource group as the Arc cluster resource. It is used to communicate with the Kubernetes cluster and modifying them will break attached compute targets.
   > * By default, the kubernetes deployment resources are randomly deployed to 1 or more nodes of the cluster, and daemonset resources are deployed to ALL nodes. If you want to restrict the extension deployment to specific nodes, use `nodeSelector` configuration setting described as below.

> [!NOTE]
   > * **{EXTENSION-NAME}:** is the extension name specified with ```az k8s-extension create --name``` CLI command. 


## Create and use instance types for efficient compute resource usage

### What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of
compute nodes for training and inference workloads.  For an Azure VM, an example for an 
instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are represented in a custom resource definition (CRD) that is installed with the AzureML extension. Instance types are represented by two elements in AzureML extension: 
[nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
and [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
In short, a `nodeSelector` lets us specify which node a pod should run on.  The node must have a
corresponding label.  In the `resources` section, we can set the compute resources (CPU, memory and
NVIDIA GPU) for the pod.

### Default instance type

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
> - The default instance type purposefully uses little resources.  To ensure all ML workloads
run with appropriate resources, for example GPU resource, it is highly recommended to create custom instance types.
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

If a training or inference workload is submitted without an instance type, it uses the default
instance type.  To specify a default instance type for a Kubernetes cluster, create an instance
type with name `defaultinstancetype`.  It will automatically be recognized as the default.

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

## AzureML jobs connect with on-premises data storage

[Persistent Volume (PV) and Persistent Volume Claim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) are Kubernetes concept, allowing user to provide and consume various storage resources. 

1. Create PV, take NFS as example,

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv 
spec:
  capacity:
    storage: 1Gi 
  accessModes:
    - ReadWriteMany 
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  nfs: 
    path: /share/nfs
    server: 20.98.110.84 
    readOnly: false
```
2. Create PVC in the same Kubernetes namespace with ML workloads. In `metadata`, you **must** add label `ml.azure.com/pvc: "true"` to be recognized by AzureML, and add annotation  `ml.azure.com/mountpath: <mount path>` to set the mount path. 

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc  
  namespace: default
  labels:
    ml.azure.com/pvc: "true"
  annotations:
    ml.azure.com/mountpath: "/mnt/nfs"
spec:
  storageClassName: ""
  accessModes:
  - ReadWriteMany      
  resources:
     requests:
       storage: 1Gi
```
> [!IMPORTANT]
> Only the job pods in the same Kubernetes namespace with the PVC(s) will be mounted the volume. Data scientist is able to access the `mount path` specified in the PVC annotation in the job.


## Sample YAML definition of Kubernetes secret for TLS/SSL

To enable HTTPS endpoint for real-time inference, you need to provide both PEM-encoded TLS/SSL certificate and key. The best practice is to save the certificate and key in a Kubernetes secret in the `azureml` namespace.

The sample YAML definition of the TLS/SSL secret is as follows,

```
apiVersion: v1
data:
  cert.pem: <PEM-encoded SSL certificate> 
  key.pem: <PEM-encoded SSL key>
kind: Secret
metadata:
  name: <secret name>
  namespace: azureml
type: Opaque
```

