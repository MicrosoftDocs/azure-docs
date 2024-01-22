---
title: Understanding agent pools in Azure Operator Nexus Kubernetes service #Required; page title is displayed in search results. Include the brand.
description: Working with agent pools in Azure Operator Nexus Kubernetes clusters #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 06/27/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Working with agent pools in Nexus Kubernetes clusters

In this article, you learn how to work with agent pools in a Nexus Kubernetes cluster. Agent pools serve as groups of nodes with the same configuration and play a key role in managing your applications.

Nexus Kubernetes clusters offer two types of agent pools.
   * System agent pools are designed for hosting critical system pods like CoreDNS and metrics-server. 
   * User agent pools are designed for hosting your application pods.

Application pods can be scheduled on system node pools if you wish to only have one pool in your Kubernetes cluster. Nexus Kubernetes cluster must have an initial agent pool that includes at least one system node pool with at least one node.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

   * Refer to the Nexus Kubernetes cluster [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) for a comprehensive overview and steps involved.
   * Ensure that you meet the outlined prerequisites to ensure smooth implementation of the guide.

## Limitations
   * You can delete system node pools, provided you have another system node pool to take its place in the Nexus Kubernetes cluster.
   * System pools must contain at least one node.
   * You can't change the VM size of a node pool after you create it.
   * Each Nexus Kubernetes cluster requires at least one system node pool.
   * Don't run application workloads on Kubernetes control plane nodes, as they're designed only for managing the cluster, and doing so can harm its performance and stability.

## System pool
For a system node pool, Nexus Kubernetes automatically assigns the label `kubernetes.azure.com/mode: system` to its nodes. This label causes Nexus Kubernetes to prefer scheduling system pods on node pools that contain this label. This label doesn't prevent you from scheduling application pods on system node pools. However, we recommend you isolate critical system pods from your application pods to prevent misconfigured or rogue application pods from accidentally killing system pods.

You can enforce this behavior by creating a dedicated system node pool. Use the `CriticalAddonsOnly=true:NoSchedule` taint to prevent application pods from being scheduled on system node pools. If you intend to use the system pool for application pods (not dedicated), don't apply any application specific taints to the pool, as applying such taints can lead to cluster creation failures. 

> [!IMPORTANT]
> If you run a single system node pool for your Nexus Kubernetes cluster in a production environment, we recommend you use at least three nodes for the node pool.

## User pool

The user pool, on the other hand, is designed for your applications. This dedicated space allows you to run your applications separately from the system workloads. If you wish to ensure that your application PODs runs exclusively on the user pool, you can schedule your application PODs here.

## Next steps

Choosing how to utilize your system pool and user pool depends largely on your specific requirements and use case. Both dedicated and shared methods offer unique advantages. Dedicated pools can isolate workloads and provide guaranteed resources, while shared pools can optimize resource usage across the cluster.

Always consider your cluster's resource capacity, the nature of your workloads, and the required level of resiliency when making your decision. By managing and understanding these node pools effectively, you can optimize your Nexus Kubernetes cluster to best fit your operational needs.

Refer to the [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md#add-an-agent-pool) to add new agent pools and experiment with configurations in your Nexus Kubernetes cluster.
