---
title: Container Storage Interface (CSI) driver v2 (preview) for Azure Disk on Azure Kubernetes Service (AKS)
description: Learn how to use the Container Storage Interface (CSI) driver v2 (preview) for Azure disks in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 05/17/2022
author: palma21

---


# Azure disk Container Storage Interface (CSI) driver v2 (preview)

Azure disk CSI driver v2 (preview) improves scalability and reduces pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes, and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. This article provides an overview of the driver and how it supports Azure disk storage.

## Architecture and components

The following diagram shows the components in the Kubernetes control plane (CCP) and cluster nodes, and the Azure services the Azure disk CSI driver v2 (preview) uses.

:::image type="content" source="media/azure-disk-csi-v2/csi_driver_v2.png" alt-text="Architecture diagram of Azure disk CSI driver v2.":::

There are three important components in the driver v2 implementation:

* Controller plug-in - In addition to the CSI Controller API Server, this plug-in hosts several controllers for custom resources used to orchestrate persistent volume management and node placement. The controller plug-in is deployed as a [ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) through [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) with leader election.

* Node plug-in - In addition to the CSI Node API Server, this plug-in also provides feedback for pod placement used by the scheduler extender described below. The node plug-in is deployed on each node in the cluster as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

* Scheduler extender plug-in - Azure disk CSI driver v2 (preview) includes a [scheduler extender](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md) that is responsible for influencing pod placements. Like the controller plug-in, the scheduler extender is deployed as a [ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) through [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) with leader election.

## Implementation

This section describes the changes and high-level implementation details of the different components in the Azure disk CSI driver v2 (preview).

### StorageClass

In addition to the [existing][azure-disk-csi-dynamic-disk-params] StorageClass dynamic disk parameters, the Azure disk CSI driver v2 (preview) supports the following:

| Name | Meaning  | Available Value | Mandatory | Default value |
|------|----------|-----------------|-----------|---------------|
| `maxShares` | The total number of shared disk mounts allowed for the disk. Setting the value to 2 or higher enables attachment replicas. | Supported values depend on the disk size. See [Share an Azure managed disk][azure-disk-shared] for supported values. | No | 1 |
| `maxMountReplicaCount` | The number of replicas attachments to maintain. | This value must be in the range `[0..(maxShares - 1)]` | No | If `accessMode` is `ReadWriteMany`, the default is `0`. Otherwise, the default is `maxShares - 1` |

### Custom resources and controllers

The Azure disk CSI driver v2 (preview) uses three different custom resources defined in the `azure-disk-csi` namespace to orchestrate disk management and facilitate pod failover to nodes with attachment replica. A controller for each resource watches for and responds to changes to its custom resource instances.

#### AzDriverNode resource and controller

The `AzDriverNode` custom resource represents a node in the cluster where the v2 (preview) node plug-in runs. An instance of `AzDriverNode` is created when the node plug-in starts. The node plug-in periodically updates the heartbeat in the `Status` field.

The controller for `AzDriverNode` runs in the controller plug-in. It is responsible for deleting `AzDriverNode` instances that no longer have corresponding nodes in the cluster.

#### AzVolume resource and controller

The `AzVolume` custom resource represents the managed disk of a `PersistentVolume`. The controller for `AzVolume` runs in the controller plug-in. It watches for and reconciles changes in the `AzVolume` instances.

An `AzVolume` instance is created by the CreateVolume API to the CSI Controller plug-in. The `AzVolume` controller responds to the new instance by creating a managed disk using the parameters in the referenced `StorageClass`. When disk creation is complete, the controller sets the `.Status.State` field to `Created` or suitable error state on failure. The CreateVolume request completes when the `AzVolume` state is updated.

To delete a managed disk, the DeleteVolume API in the CSI Controller plug-in schedules the corresponding `AzVolume` instance for deletion. The controller responds by garbage collecting the managed disk. When the managed disk has been deleted, the controller deletes the `AzVolume` instance. The DeleteVolume request completes once the `AzVolume` instance has been removed from the object store.

#### AzVolumeAttachment resource and controller

The `AzVolumeAttachment` custom resource represents the attachment of a managed disk to a specific node. The controller for this custom resource runs in the controller plug-in and watches for changes in the `AzVolumeAttachment` instances.

An `AzVolumeAttachment` instance representing the primary node attachment is created by the ControllerPublishVolume API in the CSI Controller plug-in. If an instance for the current node already exists, it is updated to represent the primary node attachment. The `AzVolumeAttachment` controller then attaches the managed disk to the primary node if it was not already attached as an attachment replica. It then creates additional `AzVolumeAttachment` instances representing attachment replicas and attaches the shared managed disk to a number of backup nodes as specified by the `maxMountReplicaCount` parameter in the `StorageClass` instance of the `PersistentVolumeClaim` of the managed disk. The ControllerPublishVolume request is complete once the `AzVolumeAttachment` instance for primary node has been created. As each the attachment request completes, the controller sets the `.Status.State` field to `Attached`. When the NodeStageVolume API is called, the CSI Node plug-in will wait for the its `AzVolumeAttachment` instance's state to reach `Attached` before staging the mount point to the disk.

When the ControllerUnpublishVolume API in the CSI Controller plug-in is called, it schedules the `AzVolumeAttachment` instance of the primary node for deletion. The controller responds by detaching the managed disk from the primary node. The `AzVolumeAttachment` instance is deleted When the detach operation completes, and schedules garbage collection to detach and delete the attachment replicas if no subsequent `ControllerPublishVolume` request is made for the disk within 5 minutes. The ControllerUnpublishVolume request is complete when the detach operation has completed and corresponding `AzVolumeAttachment` has been removed from the object store.

### Scheduler extender

The Azure disk CSI driver v2 (preview) scheduler extender influences pod placement by prioritizing healthy nodes where attachment replicas for the required persistent volume(s) already exist (that is, for one or more nodes where one or more managed disks are already attached). It relies on the `AzVolumeAttachment` instance to determine which nodes have attachment replicas, and the heartbeat information in the `AzDriverNode` to determine health. If no attachment replicas for the specified persistent volume currently exist, the scheduler extender will weight all nodes equally.

### Provisioner library

The Provisioner Library is a common library to abstract the underlying platform for all the v2 (preview) driver plug-ins, services and controllers. It handles the platform-specific details of performing volume operations such as, but not necessarily limited to:

* Create or delete
* Attach or detach
* Snapshot
* Stage or unstage
* Mount or unmount

## Next steps

- To use the CSI driver for Azure disks, see [Use Azure disks with CSI drivers](azure-disk-csi.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][operator-best-practices-storage].

<!-- LINKS - internal -->
[azure-disk-csi-dynamic-disk-params]: azure-disk-csi.md#storage-class-driver-dynamic-disk-parameters
[azure-disk-shared]: ../virtual-machines/disks-shared.md
[operator-best-practices-storage]: operator-best-practices-storage.md