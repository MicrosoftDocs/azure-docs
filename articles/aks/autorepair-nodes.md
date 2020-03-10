---
title: Auto-repair Azure Kubernetes Service (AKS) nodes 
description: Learn about auto-repair functionality for how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 03/10/2020
---

# Azure Kubernetes Service (AKS) auto-repair

When AKS nodes are in an unhealthy state they can receive automatic repair with zero downtime. AKS continuously checks the health state of worker nodes, and performs automatic repair if they become unhealthy.

## Region Availability

This feature is supported in all regions where AKS is supported.

## Manually check your node's health

You can manually check the health state of your nodes at anytime.  

```azurecli-interactive
# Check the state of your node
kubectl get nodes
```

## Auto-repair rules to determine an unhealthy node

Auto-repair for AKS nodes uses rules to determine if a node is an unhealhty state and needs repair. The following rules are used to determine if auto-repair is needed.  If AKS takes action on nodes, you will see the user **aks-remediator** in the logs.  

* The node reports a status of **NotReady** on consecutive checks within a 10 minute timeframe
* The node doesn't report a status within 10 minutes

## How auto-repair works

Auto-repair takes several steps to repair a broken a node.  The following remediation steps are provided.

* The node is rebooted
* If reboot doesn't fix the node, the node is replaced with a new node
* If multiple nodes are unhealthy, they are repaired one by one

## Next steps

Use [Availability Zones](availability-zones) to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/linux/sizes.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[faq]: ./faq.md
[availability-zones]: ./availability-zones.md
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
