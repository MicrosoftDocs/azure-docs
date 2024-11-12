---
title: Azure Operator Nexus cluster runtime upgrade overview
description: Get an overview of cluster runtime upgrade for Azure Operator Nexus.
author: matternst7258
ms.author: matthewernst
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 11/11/2024
ms.custom: template-concept
---

# Azure Operator Nexus runtime upgrades

The Nexus platform runtime upgrade is disruptive upgrade, managed by customers, to update the underlying software on the servers in an Operator Nexus instance. 

While runtime upgrades are produced monthly, there are different types of runtime releases.

* Major/Minor releases: Provides minor versions of kubernetes and new functionality
* Patch releases: Security focused and are optional to upgrade to customers

> [!Note]
> Microsoft may communicate patch releases customers need to take to resolve critical security or functional issues. 

## Scope of runtime releases

The runtime upgrade is designed to update foundational components of the platform for each server in the instance. Some examples of components updated during the runtime upgrade are the Operating System (OS), undercloud kubernetes cluster, compute firmware, the etcd cluster, and the CNI (Container Network Interface). Each server is reimaged to get the latest 

### Workflow overview

Starting a runtime upgrade is defined under [Upgrading cluster runtime via Azure CLI](howto-cluster-runtime-upgrade).

The runtime upgrade will start by upgrading the three management servers designated as the control plane nodes. These servers are updated serially and will not continue until each one completes. The remaining management servers are upgraded into 4 different groups and completed one at a time. 

Once all management servers are upgarded, the upgrade will progress to the compute servers. Each rack is upgraded in alphanumeric order, and there are various configurations customers can use to dictate how the computes are upgrade to best limit disruption, defined below. As each rack progresses, there are various health checks performed in order to ensure the release has properly updated and a sufficient number of computes in a rack have returned to operational status. When a rack completes, a customer defined wait time will start to provide additional time for workloads to come online.  Once each rack has been updated, the upgrade will complete and the cluster will return to `Running` status. 

## Release frequency

### Major/Minor releases

Minor runtime releases are produced for the compute infrastructure three times a year in February, June, and October. These releases are supported for approximately one year after released and customers cannot skip minor releases. 

### Patch releases

Patch runtime release are produced approximately monthly in between the minor releases. These releases are optional, unless directed by Microsoft for specific functionality or security concerns. 

## Runtime upgrade strategies

Each of the strategies explained provide users various controls for how and when compute racks are upgraded. Each strategy uses a `thresholdType` and `thresholdValue` to define the number or percent of successfully upgraded compute servers in a rack before proceeding to the next rack. 

The threshold values are a calculation performed during the upgrade to determine the number of compute servers available after completing the upgrade.

### Rack by rack

The default behavior for runtime upgrades will iterate across each rack one by one until the entire site as thresholds are met.

### Rack Paused

This strategy will pause the upgrade after the rack completes the upgrade. The next rack will not start until the customer executes the upgrade API.

## Impact on Nexus Kubernetes tenant workloads during cluster runtime upgrade

During a runtime upgrade, impacted Nexus Kubernetes Cluster nodes are cordoned and drained before the Bare Metal Hosts (BMH) are upgraded. Cordoning the Kubernetes Cluster node prevents new pods from being scheduled on it and draining the Kubernetes Cluster node allows pods that are running tenant workloads a chance to shift to another available Kubernetes Cluster node, which helps to reduce the impact on services. The draining mechanism's effectiveness is contingent on the available capacity within the Nexus Kubernetes Cluster. If the Kubernetes Cluster is nearing full capacity and lacks space for the pods to relocate, they transition into a Pending state following the draining process.

Once the cordon and drain process of the tenant cluster node is completed, the upgrade of the BMH proceeds. Each tenant cluster node is allowed up to 10 minutes for the draining process to complete, after which the BMH upgrade will begin. This guarantees the BMH upgrade will make progress. BMHs are upgraded one rack at a time, and upgrades are performed in parallel within the same rack. The BMH upgrade does not wait for tenant resources to come online before continuing with the runtime upgrade of BMHs in the rack being upgraded. The benefit of this is that the maximum overall wait time for a rack upgrade is kept at 10 minutes regardless of how many nodes are available. This maximum wait time is specific to the cordon and drain procedure and is not applied to the overall upgrade procedure. Upon completion of each BMH upgrade, the Nexus Kubernetes cluster node starts, rejoins the cluster, and is uncordoned, allowing pods to be scheduled on the node once again.

It's important to note that the Nexus Kubernetes cluster node won't be shut down after the cordon and drain process. The BMH is rebooted with the new image as soon as all the Nexus Kubernetes cluster nodes are cordoned and drained, after 10 minutes if the drain process isn't completed. Additionally, the cordon and drain is not initiated for power-off or restart actions of the BMH; it's exclusively activated only during a runtime upgrade.

It is important to note that following the runtime upgrade, there could be instance where a Nexus Kubernetes Cluster node remains cordoned. For such scenario, you can manually uncordon the node by executing the following command

```azurecli
az networkcloud baremetalmachine list -g $mrg --subscription $sub --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,powerState:powerState,tags:tags.Status,machineRoles:join(', ', machineRoles),cordonStatus:cordonStatus,createdAt:systemData.createdAt}, &name)" 
--output table

```
<!-- LINKS - External -->
[installation-instruction]: https://aka.ms/azcli