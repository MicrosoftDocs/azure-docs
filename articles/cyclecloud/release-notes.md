---
title: Current Release Notes - Azure CycleCloud 8.1.x
description: Read the product release notes for the current Azure CycleCloud release. This article covers releases 8.1.x.
author: adriankjohnson
ms.date: 11/16/2020
ms.author: adjohnso
---

# Azure CycleCloud 8.1

The current release is 8.1.0.

## Azure CycleCloud 8.1 Release Highlights

CycleCloud 8.1 is the first GA release of the CycleCloud 8.x platform, and contains significant updates from the CycleCloud 7.x versions.

|  |  |
| --- | --- |
| [**Univa Grid Engine is a Supported Scheduler Type**](~/gridengine.md)<br/> A free, demo version of Univa Grid Engine is available in CycleCloud 8, with a simple path to full end-to-end enterprise support for Univa clusters running on Azure. [Learn more about Univa + Azure here](https://techcommunity.microsoft.com/t5/azure-compute/univa-grid-engine-cluster-arrives-in-azure-cyclecloud-8-1/ba-p/1863043) | ![Univa Logo](./images/release-notes/univa-logo.jpg) |
| [**Slurm Cluster Updates**](~/slurm.md)<br/> Slurm clusters deployed in CycleCloud 8 can now be configured to do [Slurm job accounting](https://slurm.schedmd.com/accounting.html). Additionally, GPU resources on nodes are now recognized automatically, with node partitions autoscaling based on GPU resource requests. |  |
| [**Autoscaling Library**](https://github.com/Azure/cyclecloud-scalelib)<br/> A new, open-source, autoscaling library is now implemented in CycleCloud 8, simplifying autoscaler development for any scheduler in Azure. This new autoscaling library drives the Univa Grid Engine scaling on Azure, and is also used in the open-source Grid Engine clusters. |  |
| [**NAS Options in Default Cluster Templates **](~/how-to/mount-fileserver.md)<br/> Default cluster templates shipped in CycleCloud 8 now include a section for configuring network filesystem mounts. With this, mounting NFS shares no longer requires changes to a cluster template. | [ ![NAS Options](./images/release-notes/nas-options-small.png) ](./images/release-notes/nas-options.png#lightbox) |
| [**Azure Event Grid Integration**](~/events.md)<br/>CycleCloud 8 generates events when certain node or cluster changes occur, and these events can now be published to Azure Event Grid. With this integration, you can create triggers to events like Spot VM evictions or node allocation failures. | ![Event Grid](./images/release-notes/event-grid-logo.png) |
| [**Cloud-Init Support**](~/how-to/cloud-init.md)<br/>CycleCloud now supports cloud-init as a way of customizing virtual machines as they boot up. Users can now specify a cloud-init config that will be processed before the CycleCloud configuration occurs. This allows users to baseline a VM by configuring volumes, mounts, networking, or OS before the scheduler stack is set up. | [ ![cloud-init example](./images/release-notes/cloud-init_small.png) ](./images/release-notes/cloud-init_large.png#lightbox)  |
| [**Improved Boot Time**](~/concepts/clusters.md)<br/>CycleCloud 8 also brings significant improvements to the node preparation stages that happen after a virtual machine is provisioned, decreasing the amount of time needed to fully configure a VM into a member of a HPC cluster.  |  |

## Release Notes

Comprehensive release notes for the individual 8.0.x releases are listed below

* [**8.1.0 Release Notes**](release-notes/8-1-0.md) - released on 11/16/20
* [**8.0.2 Release Notes**](release-notes/8-0-2.md) - released on 10/16/20
* [**8.0.1 Release Notes**](release-notes/8-0-1.md) - released on 07/02/20
* [**8.0.0 Release Notes**](release-notes/8-0-0.md) - released on 05/29/20

Release notes from the [previous major releases](release-notes-previous.md) and [older versions](release-notes-archive.md) are also available.
