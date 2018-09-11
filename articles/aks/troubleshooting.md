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
When you create or manager AKS clusters, you may occasionally encounter issues. This article details some common issues and troubleshooting steps.

### In general, where do I find information about debugging Kubernetes issues?

[Here] (https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/) is an official link to troubleshooting kubernetes clusters.
[Here](https://github.com/feiskyer/kubernetes-handbook/blob/master/en/troubleshooting/index.md) is a link to a troubleshooting guide published by a Microsoft engineer around troubleshooting pods, nodes, clusters, etc.

### I am getting a quota exceeded error during create or upgrade. What should I do? 

You will need to request cores [here](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request).

### What is the max pods per node setting for AKS?

The max pods per node are set to 30 by default if you deploy an AKS cluster in the Azure portal.
The max pods per node are set to 110 by default if you deploy an AKS cluster in the Azure CLI. (Ensure you are using the latest version of the Azure CLI). This default setting can be changed using the –max-nodes-per-pod flag in the az aks create command.

### I am getting “insufficientSubnetSize” error while deploying an AKS cluster with Advanced networking. What should I do?

In Custom VNET option selected for networking during AKS creates, the Azure CNI is used for IPAM. The number of nodes in an AKS cluster can be anywhere between 1 and 100. Based upon 2) above the subnet size should be greater than product of the number of nodes and the max pod per node 
Subnet size > no of nodes in the cluster * max pods per node.

### My pod is stuck in ‘CrashLoopBackOff’ mode. What should I do?

There might be various reasons for the pod being stuck in that mode. You might want to look into the 
* The pod itself using `kubectl describe pod <pod-name>`
* The logs using  `kubectl log <pod-name>`

### I am trying to enable RBAC on an existing cluster. Can you tell me how I can do that?

Unfortunately enabling RBAC on existing clusters is not supported at this time. You will need to explicitly create new clusters. If you use the CLI, RBAC is enabled by default whereas a toggle button to enable it is available in the AKS portal create workflow.

### I created a cluster using the Azure CLI with defaults or the Azure portal with RBAC enabled and numerous warnings in the kubernetes dashboard. The dashboard used to work before without any warnings. What should I do?

The reason for getting warnings on the dashboard is that now it is enabled with RBAC'ed and access to it has been disabled by default. In general, 
this approach is considered good practice since the default exposure of the dashboard to all users of the cluster can lead to security 
threats. If you still want to enable the dashboard, follow this [blog](https://pascalnaber.wordpress.com/2018/06/17/access-dashboard-on-aks-with-rbac-enabled/)
to enable it.

### I can’t seem to connect to the dashboard. What should I do?

The easiest way to access your service outside the cluster is to run kubectl proxy, which will proxy requests to your localhost port 8001 to the Kubernetes API server. From there, the apiserver can proxy to your service:
http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/#!/node?namespace=default

If you don’t see the kubernetes dashboard, then check if the kube-proxy pod is running in the kube-system namespace. If it is not in running state, delete the pod and it will restart.

### I could not get logs using Kubectl logs or cannot connect to the api server getting the “Error from server: error dialing backend: dial tcp…”. What should I do?

Make sure that the default NSG is not modified and port 22 is open for connection to the API server. Check if the tunnelfront pod is running in the kube-system namespace. If it is not, force delete it and it will restart.

### I am trying to upgrade or scale and am getting "message": "Changing property 'imageReference' is not allowed." Error.  How do I fix this issue?

It is possible that you are getting this error because you have modified the tags in the agent nodes inside the AKS cluster. Modifying and deleting tags and other properties of resources in the MC_* resource group can lead to unexpected results. Modifying the resources under the MC_* in the AKS cluster breaks the SLO.


