---
title: Vertical Pod Autoscaling (preview) in Azure Kubernetes Service (AKS)
description: Learn how to vertically autoscale your pod on an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 09/19/2022
---

# Vertical Pod Autoscaling (preview) in Azure Kubernetes Service (AKS)

This article provides an overview of Vertical Pod Autoscaler (VPA) (preview) in Azure Kubernetes Service (AKS), which is based on the open source [Kubernetes](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) version. When configured, it automatically sets resource requests and limits on containers per workload based on past usage. This ensures pods are scheduled onto nodes which have the required CPU and memory resources.  

## Benefits

Vertical Pod Autoscaler provides the following benefits:

* It analyzes and adjusts processor and memory resources to *right size* your applications. VPA is not only responsible for scaling up, but also for scaling down based on their resource use  over time.

* A Pod is evicted if it needs to change its resource requests based on if its scaling mode is set to *auto*

* Set CPU and memory constraints for individual containers by specifying a resource policy

* Ensures nodes have correct resources for pod scheduling

* Configurable logging of any adjustments to processor or memory resources made

* Improve cluster resource utilization and frees up CPU and memory for other pods.

## Before you begin

* You have an existing AKS cluster. If you don't, see [Getting started with Azure Kubernetes Service][get-started-with-aks].

* The Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

* `kubectl` should be connected to the cluster you want to install VPA.

## VPA configuration options

The following table describes the options and supported values to configure and use this feature for your pods.

|Value |Description |Default value |
|------|------------|--------------|
|`--vpa-controlled-values` |Specifies the behavior of VPA. Options are: **Requests**, **limits**, or **RequestsAndLimits** | None |
|`--vpa-update-mode` |Specifies the allowed modes. Options are:<br><br> <ul><li> **Off** - VPA does not automatically change the resource requirements of the pods. The recommendations are calculated and can be inspected in the VPA object.</ul></li> <ul><li>**Initial** - VPA only assigns resource requests on pod creation and never changes them later.</ul></li> <ul><li>**Recreate** - VPA assigns resource requests on pod creation as well as updates them on existing pods by evicting them when the requested resources differ significantly from the new recommendation (respecting the Pod Disruption Budget, if defined). This mode should be used rarely, only if you need to ensure that the pods are restarted whenever the resource request changes. Otherwise, prefer the "Auto" mode which may take advantage of restart-free updates once they are available. >[!NOTE] This feature of VPA is in preview and may cause downtime for your applications. </ul></li> <ul><li>**Auto** - VPA assigns resource requests during pod creation as well as updates them on existing pods using the preferred update mechanism. Currently, this is equivalent to **Recreate**. Once restart free, *in-place* update of pod requests is available. It may be used as the preferred update mechanism by the **Auto** mode. >[!NOTE] This feature of VPA is in preview and may cause downtime for your applications.</ul></li>| None |

## Deploy VPA on a new cluster

To enable VPA on a new cluster, use `--enable-vpa` parameter with the [az aks create][az-aks-create] command.

    ```azurecli
    az aks create -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Deploy VPA on an existing cluster

To enable VPA on an existing cluster, use `--enable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

<!-- INTERNAL LINKS -->
[get-started-with-aks]: /azure/architecture/reference-architectures/containers/aks-start-here
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create