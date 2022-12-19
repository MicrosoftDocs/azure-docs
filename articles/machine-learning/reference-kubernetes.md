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

## Recommended resource planing

When you deploy the AzureML extension, some related services will be deployed to your Kubernetes cluster for Azure Machine Learning. The following table lists the **Related Services and their resource usage** in the cluster:

|Deploy/Daemonset |Replica # |Training |Inference|CPU Request(m) |CPU Limit(m)| Memory Request(Mi) | Memory Limit(Mi) |
|-- |--|--|--|--|--|--|--|
|metrics-controller-manager  |1 |**&check;**|**&check;**|10|100|20|300|
|prometheus-operator  |1 |**&check;**|**&check;**|100|400|128|512|
|prometheus |1 |**&check;**|**&check;**| 100|1000|512|4096|
|kube-state-metrics  |1 |**&check;**|**&check;**|10|100|32|256|
|gateway |1 |**&check;**|**&check;**|50 |500|256|2048|
|fluent-bit  |1 per Node |**&check;**|**&check;**|10|200|100|300|
|inference-operator-controller-manager |1 |**&check;**|N/A|100|1000|128|1024|
|amlarc-identity-controller |1 |**&check;**|N/A |200|1000|200|1024|
|amlarc-identity-proxy |1 |**&check;**|N/A |200|1000|200|1024|
|azureml-ingress-nginx-controller  |1 |**&check;**|N/A | 100|1000|64|512|
|azureml-fe-v2  |**1** (for Test purpose) <br>or <br>**3** (for Production purpose) |**&check;**|N/A |900|2000|800|1200|
|online-deployment |1 per Deployment | User-created|N/A |\<user-define> |\<user-define> |\<user-define> |\<user-define> |
|online-deployment/identity-sidecar |1 per Deployment |**&check;**|N/A |10|50|100|100|
|aml-operator |1  |N/A |**&check;**|20|1020|124|2168|
|volcano-admission |1  |N/A |**&check;**|10|100|64|256|
|volcano-controller |1  |N/A |**&check;**|50|500|128|512|
|volcano-schedular |1  |N/A |**&check;**|50|500|128|512|


Excluding the user deployments/pods, the **total minimum system resources requirements** are as follows:

|Scenario | Enabled Inference | Enabled Training | CPU Request(m) |CPU Limit(m)| Memory Request(Mi) | Memory Limit(Mi) | Node count | Recommended minimum VM size | Corresponding AKS VM SKU |
|-- |-- |--|--|--|--|--|--|--|--|
|For Test | **&check;** | N/A | **1780** |8300 |**2440** | 12296 |1 Node |2 vCPU, 7 GiB Memory, 6400 IOPS, 1500Mbps BW| DS2v2|
|For Test | N/A| **&check;**  | **410** | 4420 |**1492** | 10960 |1 Node |2 vCPU, 7 GiB Memory, 6400 IOPS, 1500Mbps BW|DS2v2|
|For Test | **&check;** | **&check;**  | **1910** | 10420 |**2884** | 15744 |1 Node |4 vCPU, 14 GiB Memory, 12800 IOPS, 1500Mbps BW|DS3v2|
|For Production |**&check;** | N/A | 3600 |**12700**|4240|**15296**|3 Node(s)|4 vCPU, 14 GiB Memory, 12800 IOPS, 1500Mbps BW|  DS3v2|
|For Production |N/A | **&check;**| 410 |**4420**|1492|**10960**|1 Node(s)|8 vCPU, 28GiB Memroy, 25600 IOPs, 6000Mbps BW|DS4v2|
|For Production |**&check;** | **&check;**  | 3730 |**14820**|4684|**18744**|3 Node(s)|4 vCPU, 14 GiB Memory, 12800 IOPS, 1500Mbps BW| DS4v2|

> [!NOTE]
> 
> * For **test purpose**, you should refer tp the resource **request**. 
> * For **production purpose**, you should refer to the resource **limit**.


> [!IMPORTANT]
>
> Here are some other considerations for reference:
> 1. For **higher network bandwidth and better disk I/O performance**, we recommend a larger SKU. 
>     1. Take [DV2/DSv2](../virtual-machines/dv2-dsv2-series.md#dsv2-series) as example, using the large SKU can reduce the time of pulling image for better network/storage performance. 
>     1. More information about AKS reservation can be found in [AKS reservation](../aks/concepts-clusters-workloads.md#resource-reservations).
> 1. If you are using AKS cluster, you may need to consider about the **size limit on a container image** in AKS, more information you can found in [AKS container image size limit](../aks/faq.md#what-is-the-size-limit-on-a-container-image-in-aks).

## Prerequisites for ARO or OCP clusters
### Disable Security Enhanced Linux (SELinux) 

[AzureML dataset](v1/how-to-train-with-datasets.md) (an SDK v1 feature used in AzureML training jobs) isn't supported on machines with SELinux enabled. Therefore, you need to disable `selinux`  on all workers in order to use AzureML dataset.

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

## AzureML jobs connect with custom data storage

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

