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

The Nexus platform runtime upgrade is disruptive upgrade, managed by customers, to update the underlying software on the servers in an Operator Nexus instance. The disruption occurs to the compute servers within a rack being upgraded. Management server upgrades are considered nondisruptive.

> [!Note]
> Microsoft may communicate patch releases customers need to take to resolve critical security or functional issues. 

## Scope of runtime releases

The runtime upgrade is designed to update foundational components of the platform for each server in the instance. Some examples of components updated during the runtime upgrade are the Operating System (OS), undercloud kubernetes cluster, compute firmware, the etcd cluster, and the CNI (Container Network Interface). Each server is reimaged to load the selected runtime version image. 

## Release frequency

### Major/Minor releases

Minor runtime releases are produced for the compute infrastructure three times a year in February, June, and October. These releases are supported for approximately one year after released and customers can't skip minor releases. 

### Patch releases

Patch runtime release is produced monthly in between the minor releases. These releases are optional, unless directed by Microsoft for specific functionality or security concerns. 

### Workflow overview

Starting a runtime upgrade is defined under [Upgrading cluster runtime via Azure CLI](./howto-cluster-runtime-upgrade.md).

The runtime upgrade starts by upgrading the three management servers designated as the control plane nodes. The spare control plane server is the first server to upgrade. The last control plane server deprovisions and transitions to `Available` state. These servers are updated serially and proceed only when each completes. The remaining management servers are upgraded into four different groups and completed one group at a time. 

> [!Note]
> Customers may observe the spare server with a different runtime version. This is expected.

Once all management servers are upgraded, the upgrade progresses to the compute servers. Each rack is upgraded in alphanumeric order, and there are various configurations customers can use to dictate how the computes are upgrade to best limit disruption. As each rack progresses, there are various health checks performed in order to ensure the release successfully upgrades and a sufficient number of computes in a rack returns to operational status. When a rack completes, a customer defined waits time starts to provide extra time for workloads to come online. Once each rack upgrades, the upgrade completes and the cluster returns to `Running` status. 

The steps to run a cluster runtime upgrade is located [here](./howto-cluster-runtime-upgrade.md).

## Runtime upgrade strategies

Each of the strategies explained provide users various controls for how and when compute racks are upgraded. These values are applicable only to the compute servers and not the management servers. Each strategy uses a `thresholdType` and `thresholdValue` to define the number or percent of successfully upgraded compute servers in a rack before proceeding to the next rack. 

The threshold values are a calculation performed during the upgrade to determine the number of compute servers available after completing the upgrade.

### Rack by rack

The default behavior for runtime upgrades iterates across each rack one by one until the entire site as thresholds are met.

### Rack Paused

This strategy will pause the upgrade after the rack completes the upgrade. The next rack won't start until the customer executes the upgrade API.

Details on how to run an upgrade with rack pause are located [here](./howto-cluster-runtime-upgrade-with-pauserack-strategy.md).

## Nexus Kubernetes tenant workloads during cluster runtime upgrade

During a runtime upgrade, impacted Nexus Kubernetes Cluster nodes are cordoned and drained before the servers are upgraded. Cordoning the Kubernetes Cluster node prevents new pods from being scheduled on it. Draining the Kubernetes Cluster node allows pods that are running tenant workloads a chance to shift to another available Kubernetes Cluster node, which helps to reduce the disruption on services. The draining mechanism's effectiveness is contingent on the available capacity within the Nexus Kubernetes Cluster. If the Kubernetes Cluster is nearing full capacity and lacks space for the pods to relocate, they transition into a Pending state following the draining process.

Once the cordon and drain process of the tenant cluster node is completed, the upgrade of the server proceeds. Each tenant cluster node is allowed up to 10 minutes for the draining process to complete, after which the server upgrade begins. This process guarantees the server upgrade makes progress. Servers are upgraded one rack at a time, and upgrades are performed in parallel within the same rack. The server upgrade doesn't wait for tenant resources to come online before continuing with the runtime upgrade of servers in the rack being upgraded. The benefit of this is that the maximum overall wait time for a rack upgrade is kept at 10 minutes regardless of how many nodes are available. This maximum wait time is specific to the cordon and drain procedure and isn't applied to the overall upgrade procedure. Upon completion of each server upgrade, the Nexus Kubernetes cluster node starts, rejoins the cluster, and is uncordoned, allowing pods to be scheduled on the node once again.

It's important to note that the Nexus Kubernetes cluster node won't be shut down after the cordon and drain process. The server is rebooted with the new image as soon as all the Nexus Kubernetes cluster nodes are cordoned and drained, after 10 minutes if the drain process isn't completed. Additionally, the cordon and drain isn't initiated for power-off or restart actions of the server; it exclusively activates only during a runtime upgrade.

It's important to note that following the runtime upgrade, there could be instance where a Nexus Kubernetes Cluster node remains cordoned. For such scenario, you locate uncordon nodes by executing the following command.

```azurecli
az networkcloud baremetalmachine list -g $mrg --subscription $sub --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,powerState:powerState,tags:tags.Status,machineRoles:join(', ', machineRoles),cordonStatus:cordonStatus,createdAt:systemData.createdAt}, &name)" 
--output table

```
## BareMetalMachine (BMM) keyset operations during cluster runtime upgrade

When a server is upgraded to utilize a new OS, the BMM keysets have to be re-established with the new software. This process starts once the runtime upgrade completes for the instance. Servers yet to undergo a runtime upgrade can still be accessed via the BMM keyset. If access to a machine is needed during the upgrade, the console user is available.

## Servers not upgraded successfully

A server remains unavailable if they fail upgrade or provisioning from possible hardware issue during reboot or issue with cloud-init (networking, chronyd, etc.). The underlying condition needs to be resolved and either baremetalmachine replace/reimage would need to be executed. Uncordoning the server manually won't resolve the issues.