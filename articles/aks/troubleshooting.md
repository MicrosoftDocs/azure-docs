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

In the custom Azure Virtual Network option for networking during AKS creation, the Azure Container Network Interface (CNI) is used for IP Address Management (IPAM). The number of nodes in an AKS cluster can be anywhere between 1 and 100. Based on the preceding section, the subnet size should be greater than the product of the number of nodes and the maximum pods per node. The relationship can be expressed in this way: subnet size > number of nodes in the cluster * maximum pods per node.

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

## I can't get logs by using kubectl logs or I can't connect to the API server. I'm getting “Error from server: error dialing backend: dial tcp…” What should I do?

Make sure that the default network security group (NSG) isn't modified and that port 22 is open for connection to the API server. Check whether the `tunnelfront` pod is running in the `kube-system` namespace. If it isn't, force deletion of the pod and it will restart.

## I'm trying to upgrade or scale and am getting a "message: Changing property 'imageReference' is not allowed" error.  How do I fix this problem?

You might be getting this error because you've modified the tags in the agent nodes inside the AKS cluster. Modifying and deleting tags and other properties of resources in the MC_* resource group can lead to unexpected results. Modifying the resources under the MC_* group in the AKS cluster breaks the service-level objective (SLO).

## How do I renew the service principal secret on my AKS cluster?

By default, AKS clusters are created with a service principal that has a one-year expiration time. As you near the expiration date, you can reset the credentials to extend the service principal for an additional period of time.

The following example performs these steps:

1. Gets the service principal ID of your cluster by using the [az aks show](/cli/azure/aks#az-aks-show) command.
1. Lists the service principal client secret by using the [az ad sp credential list](/cli/azure/ad/sp/credential#az-ad-sp-credential-list).
1. Extends the service principal for another one year by using the [az ad sp credential-reset](/cli/azure/ad/sp/credential#az-ad-sp-credential-reset) command. The service principal client secret must remain the same for the AKS cluster to run correctly.

```azurecli
# Get the service principal ID of your AKS cluster.
sp_id=$(az aks show -g myResourceGroup -n myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)

# Get the existing service principal client secret.
key_secret=$(az ad sp credential list --id $sp_id --query [].keyId -o tsv)

# Reset the credentials for your AKS service principal and extend for one year.
az ad sp credential reset \
    --name $sp_id \
    --password $key_secret \
    --years 1
```
