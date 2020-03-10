---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 03/10/2020
---

# Azure Kubernetes Service (AKS) node auto-repair functionality

Periodically AKS cluster nodes will become unhealthy.  When AKS nodes are in an unhealthy state, they are automatically repaired. AKS continuously checks the health state of worker nodes and performs automatic repair if they become unhealthy.

## Region Availability

This feature is available in all regions where AKS is supported.

## Manually check your node's health

You can manually check the health state of your nodes at any time.  

```azurecli-interactive
# Check the state of your node
kubectl get nodes
```

## Auto-repair rules to determine an unhealthy node

Auto-repair for AKS nodes uses rules to determine if a node is an unhealthy state and needs repair. AKS uses the following rules to determine if auto-repair is needed.  AKS takes repair action on nodes with the user **aks-remediator**.  

* The node reports status of **NotReady** on consecutive checks within a 10-minute timeframe
* The node doesn't report a status within 10 minutes

## How auto-repair works

Auto-repair takes several steps to repair a broken node.  If a node is determined to be unhealthy, AKS uses the following remediation steps:

* The node is rebooted
* If a reboot doesn't fix the node, the node is replaced with a new node
* If multiple nodes are unhealthy, they are repaired one by one

## Next steps

Use [Availability Zones](availability-zones) to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md

