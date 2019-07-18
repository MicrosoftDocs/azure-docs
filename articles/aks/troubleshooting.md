---
title: Troubleshoot common Azure Kubernetes Service problems
description: Learn how to troubleshoot and resolve common problems when using Azure Kubernetes Service (AKS)
services: container-service
author: sauryadas

ms.service: container-service
ms.topic: troubleshooting
ms.date: 08/13/2018
ms.author: saudas
---

# AKS troubleshooting

When you create or manage Azure Kubernetes Service (AKS) clusters, you might occasionally encounter problems. This article details some common problems and troubleshooting steps.

## In general, where do I find information about debugging Kubernetes problems?

Try the [official guide to troubleshooting Kubernetes clusters](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/).
There's also a [troubleshooting guide](https://github.com/feiskyer/kubernetes-handbook/blob/master/en/troubleshooting/index.md), published by a Microsoft engineer for troubleshooting pods, nodes, clusters, and other features.

## I'm getting a "quota exceeded" error during creation or upgrade. What should I do? 

You need to [request cores](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request).

## What is the maximum pods-per-node setting for AKS?

The maximum pods-per-node setting is 30 by default if you deploy an AKS cluster in the Azure portal.
The maximum pods-per-node setting is 110 by default if you deploy an AKS cluster in the Azure CLI. (Make sure you're using the latest version of the Azure CLI). This default setting can be changed by using the `–-max-pods` flag in the `az aks create` command.

## I'm getting an insufficientSubnetSize error while deploying an AKS cluster with advanced networking. What should I do?

If Azure CNI (advanced networking) is used, AKS preallocates IP addressed based on the "max-pods" per node configured. The number of nodes in an AKS cluster can be anywhere between 1 and 110. Based upon the configured max pods per node, the subnet size should be greater than the "product of the number of nodes and the max pod per node". The following basic equation outlines this:

Subnet size > number of nodes in the cluster (taking into consideration the future scaling requirements) * max pods per node.

For more information, see [Plan IP addressing for your cluster](configure-azure-cni.md#plan-ip-addressing-for-your-cluster).

## My pod is stuck in CrashLoopBackOff mode. What should I do?

There might be various reasons for the pod being stuck in that mode. You might look into:

* The pod itself, by using `kubectl describe pod <pod-name>`.
* The logs, by using `kubectl log <pod-name>`.

For more information on how to troubleshoot pod problems, see [Debug applications](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/#debugging-pods).

## I'm trying to enable RBAC on an existing cluster. How can I do that?

Unfortunately, enabling role-based access control (RBAC) on existing clusters isn't supported at this time. You must explicitly create new clusters. If you use the CLI, RBAC is enabled by default. If you use the AKS portal, a toggle button to enable RBAC is available in the creation workflow.

## I created a cluster with RBAC enabled by using either the Azure CLI with defaults or the Azure portal, and now I see many warnings on the Kubernetes dashboard. The dashboard used to work without any warnings. What should I do?

The reason for the warnings on the dashboard is that the cluster is now enabled with RBAC and access to it has been disabled by default. In general, this approach is good practice because the default exposure of the dashboard to all users of the cluster can lead to security threats. If you still want to enable the dashboard, follow the steps in [this blog post](https://pascalnaber.wordpress.com/2018/06/17/access-dashboard-on-aks-with-rbac-enabled/).

## I can't connect to the dashboard. What should I do?

The easiest way to access your service outside the cluster is to run `kubectl proxy`, which proxies requests sent to your localhost port 8001 to the Kubernetes API server. From there, the API server can proxy to your service: `http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/#!/node?namespace=default`.

If you don’t see the Kubernetes dashboard, check whether the `kube-proxy` pod is running in the `kube-system` namespace. If it isn't in a running state, delete the pod and it will restart.

## I can't get logs by using kubectl logs or I can't connect to the API server. I'm getting "Error from server: error dialing backend: dial tcp…". What should I do?

Make sure that the default network security group isn't modified and that port 22 is open for connection to the API server. Check whether the `tunnelfront` pod is running in the *kube-system* namespace using the `kubectl get pods --namespace kube-system` command. If it isn't, force deletion of the pod and it will restart.

## I'm trying to upgrade or scale and am getting a "message: Changing property 'imageReference' is not allowed" error. How do I fix this problem?

You might be getting this error because you've modified the tags in the agent nodes inside the AKS cluster. Modifying and deleting tags and other properties of resources in the MC_* resource group can lead to unexpected results. Modifying the resources under the MC_* group in the AKS cluster breaks the service-level objective (SLO).

## I'm receiving errors that my cluster is in failed state and upgrading or scaling will not work until it is fixed

*This troubleshooting assistance is directed from https://aka.ms/aks-cluster-failed*

This error occurs when clusters enter a failed state for multiple reasons. Follow the steps below to resolve your cluster failed state before retrying the previously failed operation:

1. Until the cluster is out of `failed` state, `upgrade` and `scale` operations won't succeed. Common root issues and resolutions include:
    * Scaling with **insufficient compute (CRP) quota**. To resolve, first scale your cluster back to a stable goal state within quota. Then follow these [steps to request a compute quota increase](../azure-supportability/resource-manager-core-quotas-request.md) before trying to scale up again beyond initial quota limits.
    * Scaling a cluster with advanced networking and **insufficient subnet (networking) resources**. To resolve, first scale your cluster back to a stable goal state within quota. Then follow [these steps to request a resource quota increase](../azure-resource-manager/resource-manager-quota-errors.md#solution) before trying to scale up again beyond initial quota limits.
2. Once the underlying cause for upgrade failure is resolved, your cluster should be in a succeeded state. Once a succeeded state is verified, retry the original operation.

## I'm receiving errors when trying to upgrade or scale that state my cluster is being currently being upgraded or has failed upgrade

*This troubleshooting assistance is directed from https://aka.ms/aks-pending-upgrade*

Cluster operations are limited when active upgrade operations are occurring or an upgrade was attempted, but subsequently failed. To diagnose the issue run `az aks show -g myResourceGroup -n myAKSCluster -o table` to retrieve detailed status on your cluster. Based on the result:

* If cluster is actively upgrading, wait until the operation terminates. If it succeeded, try the previously failed operation again.
* If cluster has failed upgrade, follow steps outlined above

## Can I move my cluster to a different subscription or my subscription with my cluster to a new tenant?

If you have moved your AKS cluster to a different subscription or the cluster owning subscription to a new tenant, the cluster will lose functionality due to losing role assignments and service principals rights. **AKS does not support moving clusters across subscriptions or tenants** due to the this constraint.

## I'm receiving errors trying to use features that require virtual machine scale sets

*This troubleshooting assistance is directed from aka.ms/aks-vmss-enablement*

You may receive errors that indicate your AKS cluster is not on a virtual machine scale set, such as the following example:

**AgentPool 'agentpool' has set auto scaling as enabled but is not on Virtual Machine Scale Sets**

To use features such as the cluster autoscaler or multiple node pools, AKS clusters must be created that use virtual machine scale sets. Errors are returned if you try to use features that depend on virtual machine scale sets and you target a regular, non-virtual machine scale set AKS cluster. Virtual machine scale set support is currently in preview in AKS.

Follow the *Before you begin* steps in the appropriate doc to correctly register for the virtual machine scale set feature preview and create an AKS cluster:

* [Use the cluster autoscaler](cluster-autoscaler.md)
* [Create and use multiple node pools](use-multiple-node-pools.md)
 
## What naming restrictions are enforced for AKS resources and parameters?

*This troubleshooting assistance is directed from aka.ms/aks-naming-rules*

Naming restrictions are implemented by both the Azure platform and AKS. If a resource name or parameter breaks one of these restrictions, an error is returned that asks you provide a different input. The following common naming guidelines apply:

* The AKS *MC_* resource group name combines resource group name and resource name. The auto-generated syntax of `MC_resourceGroupName_resourceName_AzureRegion` must be no greater than 80 chars. If needed, reduce the length of your resource group name or AKS cluster name.
* The *dnsPrefix* must start and end with alphanumeric values. Valid characters include alphanumeric values and hyphens (-). The *dnsPrefix* can't include special characters such as a period (.).

## I’m receiving errors when trying to create, update, scale, delete or upgrade cluster, that operation is not allowed as another operation is in progress.

*This troubleshooting assistance is directed from aka.ms/aks-pending-operation*

Cluster operations are limited when a previous operation is still in progress. To retrieve a detailed status of your cluster, use the `az aks show -g myResourceGroup -n myAKSCluster -o table` command. Use your own resource group and AKS cluster name as needed.

Based on the output of the cluster status:

* If the cluster is in any provisioning state other than *Succeeded* or *Failed*, wait until the operation (*Upgrading / Updating / Creating / Scaling / Deleting / Migrating*) terminates. When the previous operation has completed, re-try your latest cluster operation.

* If the cluster has a failed upgrade, follow the steps outlined [I'm receiving errors that my cluster is in failed state and upgrading or scaling will not work until it is fixed](#im-receiving-errors-that-my-cluster-is-in-failed-state-and-upgrading-or-scaling-will-not-work-until-it-is-fixed).