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
ms.custom: devx-track-arm-template
ms.topic: reference
ms.date: 06/06/2022
---

# Reference for configuring Kubernetes cluster for Azure Machine Learning

This article contains reference information that may be useful when [configuring Kubernetes with Azure Machine Learning](./how-to-attach-kubernetes-anywhere.md).

## Supported Kubernetes version and region

- Kubernetes clusters installing Azure Machine Learning extension have a version support window of "N-2", that is aligned with [Azure Kubernetes Service (AKS) version support policy](../aks/supported-kubernetes-versions.md#kubernetes-version-support-policy), where 'N' is the latest GA minor version of Azure Kubernetes Service.

  - For example, if AKS introduces 1.20.a today, versions 1.20.a, 1.20.b, 1.19.c, 1.19.d, 1.18.e, and 1.18.f are supported.

  - If customers are running an unsupported Kubernetes version, they are asked to upgrade when requesting support for the cluster. Clusters running unsupported Kubernetes releases aren't covered by the Azure Machine Learning extension support policies.
- Azure Machine Learning extension region availability: 
  - Azure Machine Learning extension can be deployed to AKS or Azure Arc-enabled Kubernetes in supported regions listed in [Azure Arc enabled Kubernetes region support](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc&regions=all).

## Recommended resource planning

When you deploy the Azure Machine Learning extension, some related services are deployed to your Kubernetes cluster for Azure Machine Learning. The following table lists the **Related Services and their resource usage** in the cluster:

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


Excluding your own deployments/pods, the **total minimum system resources requirements** are as follows:

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
> * For **higher network bandwidth and better disk I/O performance**, we recommend a larger SKU. 
>     * Take [DV2/DSv2](../virtual-machines/dv2-dsv2-series.md#dsv2-series) as example, using the large SKU can reduce the time of pulling image for better network/storage performance. 
>     * More information about AKS reservation can be found in [AKS reservation](../aks/concepts-clusters-workloads.md#resource-reservations).
> * If you're using AKS cluster, you may need to consider about the **size limit on a container image** in AKS, more information you can found in [AKS container image size limit](../aks/faq.md#whats-the-size-limit-on-a-container-image-in-aks).

## Prerequisites for ARO or OCP clusters
### Disable Security Enhanced Linux (SELinux) 

[Azure Machine Learning dataset](v1/how-to-train-with-datasets.md) (an SDK v1 feature used in Azure Machine Learning training jobs) isn't supported on machines with SELinux enabled. Therefore, you need to disable `selinux`  on all workers in order to use Azure Machine Learning dataset.

### Privileged setup for ARO and OCP

For Azure Machine Learning extension deployment on ARO or OCP cluster, grant privileged access to Azure Machine Learning service accounts, run ```oc edit scc privileged``` command, and add following service accounts under "users:":

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

## Collected log details

Some logs about Azure Machine Learning workloads in the cluster will be collected through extension components, such as status, metrics, life cycle, etc. The following list shows all the log details collected, including the type of logs collected and where they were sent to or stored.

|Pod  |Resource description |Detail logging info |
|--|--|--|
|amlarc-identity-controller	|Request and renew Azure Blob/Azure Container Registry token through managed identity.	|Only used when `enableInference=true` is set when installing the extension. It has trace logs for status on getting identity for endpoints to authenticate with Azure Machine Learning service.|
|amlarc-identity-proxy	|Request and renew Azure Blob/Azure Container Registry token through managed identity.	|Only used when `enableInference=true` is set when installing the extension. It has trace logs for status on getting identity for the cluster to authenticate with Azure Machine Learning service.|
|aml-operator	| Manage the lifecycle of training jobs.	|The logs contain Azure Machine Learning training job pod status in the cluster.|
|azureml-fe-v2|	The front-end component that routes incoming inference requests to deployed services.	|Access logs at request level, including request ID, start time, response code, error details and durations for request latency. Trace logs for service metadata changes, service running healthy status, etc. for debugging purpose.|
| gateway	| The gateway is used to communicate and send data back and forth.	| Trace logs on requests from Azure Machine Learning services to the clusters.|
|healthcheck	|--| 	The logs contain `azureml` namespace resource (Azure Machine Learning extension) status to diagnose what make the extension not functional. |
|inference-operator-controller-manager|	Manage the lifecycle of inference endpoints.	|The logs contain Azure Machine Learning inference endpoint and deployment pod status in the cluster.|
| metrics-controller-manager	| Manage the configuration for Prometheus.|Trace logs for status of uploading training job and inference  deployment metrics on CPU utilization and memory utilization.|
| relay server	| relay server is only needed in arc-connected cluster and won't be installed in AKS cluster.| Relay server works with Azure Relay to communicate with the cloud services.	The logs contain request level info from Azure relay.  |
 	

## Azure Machine Learning jobs connect with custom data storage

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
2. Create PVC in the same Kubernetes namespace with ML workloads. In `metadata`, you **must** add label `ml.azure.com/pvc: "true"` to be recognized by Azure Machine Learning, and add annotation  `ml.azure.com/mountpath: <mount path>` to set the mount path. 

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
> * Only the command job/component, hyperdrive job/component, and batch-deployment support custom data storage from PVC(s). 
    > * The real-time online endpoint, AutoML job and PRS job do not support custom data storage from PVC(s).
> * In addition, only the pods in the same Kubernetes namespace with the PVC(s) will be mounted the volume. Data scientist is able to access the `mount path` specified in the PVC annotation in the job.
> AutoML job and Prs job will not have access to the PVC(s).


## Supported Azure Machine Learning taints and tolerations

[Taint and Toleration](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) are Kubernetes concepts that work together to ensure that pods aren't  scheduled onto inappropriate nodes. 

Kubernetes clusters integrated with Azure Machine Learning (including AKS and Arc Kubernetes clusters) now support specific Azure Machine Learning taints and tolerations, allowing users to add specific Azure Machine Learning taints on the Azure Machine Learning-dedicated nodes, to prevent non-Azure Machine Learning workloads from being scheduled onto these dedicated nodes.

We only support placing the amlarc-specific taints on your nodes, which are defined as follows: 

| Taint | Key | Value | Effect | Description |
|--|--|--|--|--|
| amlarc overall| ml.azure.com/amlarc	| true| `NoSchedule`, `NoExecute`  or `PreferNoSchedule`| All Azure Machine Learning workloads, including extension system service pods and machine learning workload pods would tolerate this `amlarc overall` taint.|
| amlarc system | ml.azure.com/amlarc-system |true	| `NoSchedule`, `NoExecute`  or `PreferNoSchedule`| Only Azure Machine Learning extension system services pods would tolerate this `amlarc system` taint.|
| amlarc workload| 	ml.azure.com/amlarc-workload |true| `NoSchedule`, `NoExecute`  or `PreferNoSchedule`| Only machine learning workload pods would tolerate this `amlarc workload` taint. |
| amlarc resource group| 	ml.azure.com/resource-group | \<resource group name> | `NoSchedule`, `NoExecute`  or `PreferNoSchedule`| Only machine learning workload pods created from the specific resource group would tolerate this `amlarc resource group` taint.|
| amlarc workspace | 	ml.azure.com/workspace |	\<workspace name>	| `NoSchedule`, `NoExecute`  or `PreferNoSchedule`|Only machine learning workload pods created from the specific workspace would tolerate this `amlarc workspace` taint. |
| amlarc compute| 	ml.azure.com/compute| \<compute name>	| `NoSchedule`, `NoExecute`  or `PreferNoSchedule`| Only machine learning workload pods created with the specific compute target would tolerate this `amlarc compute` taint.|

> [!TIP]
> 1. For Azure Kubernetes Service(AKS), you can follow the example in [Best practices for advanced scheduler features in Azure Kubernetes Service (AKS)](../aks/operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations) to apply taints to node pools.
> 1. For Arc Kubernetes clusters, such as on premises Kubernetes clusters, you can use `kubectl taint` command to add taints to nodes. For more examples,see the [Kubernetes Documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/).

### Best practices

According to your scheduling requirements of the Azure Machine Learning-dedicated nodes, you can add **multiple amlarc-specific taints** to restrict what Azure Machine Learning workloads can run on nodes. We list best practices for using amlarc taints:

- **To prevent non-Azure Machine Learning workloads from running on Azure Machine Learning-dedicated nodes/node pools**, you can just add the `aml overall` taint to these nodes.
- **To prevent non-system pods from running on Azure Machine Learning-dedicated nodes/node pools**, you have to add the following taints: 
  - `amlarc overall` taint
  - `amlarc system` taint
- **To prevent non-ml workloads from running on Azure Machine Learning-dedicated nodes/node pools**, you have to add the following taints: 
  - `amlarc overall` taint
  - `amlarc workloads` taint
- **To prevent workloads not created from *workspace X* from running on Azure Machine Learning-dedicated nodes/node pools**, you have to add the following taints: 
  - `amlarc overall` taint
  - `amlarc resource group (has this <workspace X>)` taint 
  - `amlarc <workspace X>` taint
- **To prevent workloads not created by *compute target X* from running on Azure Machine Learning-dedicated nodes/node pools**, you have to add the following taints: 
  - `amlarc overall` taint
  - `amlarc resource group (has this <workspace X>)` taint 
  - `amlarc workspace (has this <compute X>)` taint
  - `amlarc <compute X>` taint

  
## Integrate other ingress controller with Azure Machine Learning extension over HTTP or HTTPS

In addition to the default Azure Machine Learning inference load balancer [azureml-fe](../machine-learning/how-to-kubernetes-inference-routing-azureml-fe.md), you can also integrate other load balancers with Azure Machine Learning extension over HTTP or HTTPS. 

This tutorial helps illustrate how to integrate the [Nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx) or the [Azure Application Gateway](../application-gateway/overview.md).

### Prerequisites

- [Deploy the Azure Machine Learning extension](../machine-learning/how-to-deploy-kubernetes-extension.md) with `inferenceRouterServiceType=ClusterIP` and `allowInsecureConnections=True`, so that the Nginx Ingress Controller can handle TLS termination by itself instead of handing it over to [azureml-fe](../machine-learning/how-to-kubernetes-inference-routing-azureml-fe.md) when service is exposed over HTTPS.
- For integrating with **Nginx Ingress Controller**, you need a Kubernetes cluster setup with Nginx Ingress Controller.
  - [**Create a basic controller**](../aks/ingress-basic.md): If you're starting from scratch, refer to these instructions.
- For integrating with **Azure Application Gateway**, you need a Kubernetes cluster setup with Azure Application Gateway Ingress Controller.
  - [**Greenfield Deployment**](../application-gateway/tutorial-ingress-controller-add-on-new.md): If you're starting from scratch, refer to these instructions.
  - [**Brownfield Deployment**](../application-gateway/tutorial-ingress-controller-add-on-existing.md): If you have an existing AKS cluster and Application Gateway, refer to these instructions.
- If you want to use HTTPS on this application, you need a x509 certificate and its private key.

### Expose services over HTTP

In order to expose the azureml-fe, we will use the following ingress resource:

```yaml
# Nginx Ingress Controller example
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: azureml-fe
  namespace: azureml
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /
        backend:
          service:
            name: azureml-fe
            port:
              number: 80
        pathType: Prefix
```
This ingress exposes the `azureml-fe` service and the selected deployment as a default backend of the Nginx Ingress Controller.



```yaml
# Azure Application Gateway example
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: azureml-fe
  namespace: azureml
spec:
  ingressClassName: azure-application-gateway
  rules:
  - http:
      paths:
      - path: /
        backend:
          service:
            name: azureml-fe
            port:
              number: 80
        pathType: Prefix
```
This ingress exposes the `azureml-fe` service and the selected deployment as a default backend of the Application Gateway.

Save the above ingress resource as `ing-azureml-fe.yaml`.

1. Deploy `ing-azureml-fe.yaml` by running:

    ```bash
    kubectl apply -f ing-azureml-fe.yaml
    ```

2. Check the log of the ingress controller for deployment status.

3. Now the `azureml-fe` application should be available. You can check by visiting:
    - **Nginx Ingress Controller**: the public LoadBalancer address of Nginx Ingress Controller 
    - **Azure Application Gateway**: the public address of the Application Gateway.
4. [Create an inference job and invoke](https://github.com/Azure/AML-Kubernetes/blob/master/docs/simple-flow.md).

    >[!NOTE]
    >
    > Replace the ip in scoring_uri with public LoadBalancer address of the Nginx Ingress Controller before invoking.

### Expose services over HTTPS

1. Before deploying ingress, you need to create a kubernetes secret to host the certificate and private key. You can create a kubernetes secret by running

    ```bash
    kubectl create secret tls <ingress-secret-name> -n azureml --key <path-to-key> --cert <path-to-cert>
    ```

2. Define the following ingress. In the ingress, specify the name of the secret in the `secretName` section.

    ```yaml
    # Nginx Ingress Controller example
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: azureml-fe
      namespace: azureml
    spec:
      ingressClassName: nginx
      tls:
      - hosts:
        - <domain>
        secretName: <ingress-secret-name>
      rules:
      - host: <domain>
        http:
          paths:
          - path: /
            backend:
              service:
                name: azureml-fe
                port:
                  number: 80
            pathType: Prefix
    ```

    ```yaml
    # Azure Application Gateway example
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: azureml-fe
      namespace: azureml
    spec:
      ingressClassName: azure-application-gateway
      tls:
      - hosts:
        - <domain>
        secretName: <ingress-secret-name>
      rules:
      - host: <domain>
        http:
          paths:
          - path: /
            backend:
              service:
                name: azureml-fe
                port:
                  number: 80
            pathType: Prefix
    ```

    >[!NOTE] 
    >
    > Replace `<domain>` and `<ingress-secret-name>` in the above Ingress Resource with the domain pointing to LoadBalancer of the **Nginx ingress controller/Application Gateway** and name of your secret. Store the above Ingress Resource in a file name `ing-azureml-fe-tls.yaml`.

1. Deploy ing-azureml-fe-tls.yaml by running

    ```bash
    kubectl apply -f ing-azureml-fe-tls.yaml
    ```

2. Check the log of the ingress controller for deployment status.

3. Now the `azureml-fe` application is available on HTTPS. You can check this by visiting the public LoadBalancer address of the Nginx Ingress Controller.

4. [Create an inference job and invoke](../machine-learning/how-to-deploy-online-endpoints.md).

    >[!NOTE]
    >
    > Replace the protocol and IP in scoring_uri with https and domain pointing to LoadBalancer of the Nginx Ingress Controller  or the Application Gateway before invoking.

## Use ARM Template to Deploy Extension
Extension on managed cluster can be deployed with ARM template. A sample template can be found from [deployextension.json](https://github.com/Azure/AML-Kubernetes/blob/master/files/deployextension.json), with a demo parameter file [deployextension.parameters.json](https://github.com/Azure/AML-Kubernetes/blob/master/files/deployextension.parameters.json) 

To use the sample deployment template, edit the parameter file with correct value, then run the following command:

```azurecli
az deployment group create --name <ARM deployment name> --resource-group <resource group name> --template-file deployextension.json --parameters deployextension.parameters.json
```
More information about how to use ARM template can be found from [ARM template doc](../azure-resource-manager/templates/overview.md)


## AzuremML extension release note
> [!NOTE]
 >
 > New features are released at a biweekly calendar.

| Date | Version |Version description |
|---|---|---|
|Oct 11, 2023 | 1.1.35|  Fix vulnerable image. Bug fixes. |
|Aug 25, 2023 | 1.1.34|  Fix vulnerable image. Return more detailed identity error. Bug fixes. |
|July 18, 2023 | 1.1.29|  Add new identity operator errors. Bug fixes. |
|June 4, 2023 | 1.1.28 | Improve auto-scaler to handle multiple node pool. Bug fixes. |
| Apr 18 , 2023| 1.1.26 | Bug fixes and vulnerabilities fix. | 
| Mar 27, 2023| 1.1.25 | Add Azure machine learning job throttle. Fast fail for training job when SSH setup failed. Reduce Prometheus scrape interval to 30s. Improve error messages for inference. Fix vulnerable image. |
| Mar 7, 2023| 1.1.23 | Change default instance-type to use 2Gi memory. Update metrics configurations for scoring-fe that add 15s scrape_interval. Add resource specification for mdc sidecar. Fix vulnerable image. Bug fixes.|
| Feb 14, 2023 | 1.1.21 | Bug fixes.|
| Feb 7, 2023 | 1.1.19 | Improve error return message for inference. Update default instance type to use 2Gi memory limit. Do cluster health check for pod healthiness, resource quota, Kubernetes version and extension version. Bug fixes|
| Dec 27, 2022 | 1.1.17 | Move the Fluent-bit from DaemonSet to sidecars. Add MDC support. Refine error messages. Support cluster mode (windows, linux) jobs. Bug fixes|
| Nov 29, 2022 | 1.1.16 |Add instance type validation by new CRD. Support Tolerance. Shorten SVC Name. Workload Core hour. Multiple Bug fixes and improvements. |
| Sep 13, 2022 | 1.1.10 | Bug fixes.|
| Aug 29, 2022 | 1.1.9 | Improved health check logic. Bug fixes.|
| Jun 23, 2022 | 1.1.6 | Bug fixes. |
| Jun 15, 2022 | 1.1.5 | Updated training to use new common runtime to run jobs. Removed Azure Relay usage for AKS extension. Removed service bus usage from the extension. Updated security context usage. Updated inference azureml-fe to v2. Updated to use Volcano as training job scheduler. Bug fixes. |
| Oct 14, 2021 | 1.0.37 | PV/PVC volume mount support in AMLArc training job. |
| Sept 16, 2021 | 1.0.29 | New regions available, WestUS, CentralUS, NorthCentralUS, KoreaCentral. Job queue expandability. See job queue details in Azure Machine Learning Workspace Studio. Auto-killing policy. Support max_run_duration_seconds in ScriptRunConfig. The system attempts to automatically cancel the run if it took longer than the setting value. Performance improvement on cluster auto scaling support. Arc agent and ML extension deployment from on premises container registry.|
| August 24, 2021 | 1.0.28 | Compute instance type is supported in job YAML. Assign Managed Identity to AMLArc compute.|
| August 10, 2021 | 1.0.20 |New Kubernetes distribution support, K3S - Lightweight Kubernetes. Deploy Azure Machine Learning extension to your AKS cluster without connecting via Azure Arc. Automated Machine Learning (AutoML) via Python SDK. Use 2.0 CLI to attach the Kubernetes cluster to Azure Machine Learning Workspace. Optimize Azure Machine Learning extension components CPU/memory resources utilization.|
| July 2, 2021 | 1.0.13 | New Kubernetes distributions support, OpenShift Kubernetes and GKE (Google Kubernetes Engine). Auto-scale support. If the user-managed Kubernetes cluster enables the auto-scale, the cluster is automatically scaled out or scaled in according to the volume of active runs and deployments. Performance improvement on job launcher, which shortens the job execution time to a great deal.|
