---
title: Previous Release Notes
description: Product release notes for previous Azure CycleCloud major release
author: adriankjohnson
ms.date: 10/02/2019
ms.author: adjohnso
---

# Azure CycleCloud 7.8

The current release is 7.8.0.

## Azure CycleCloud 7.8 Release Highlights

|  |  |
| --- | --- |
| [**Improved User Management**](user-management.md)<br/>The major milestone in this release is the addition of an oft-requested feature -- supporting multiple user accounts per cluster.<br/><br/>  - User accounts are now dynamically added or removed from cluster nodes based on cluster privileges. <br/><br/>  - These user accounts are created locally on every node, with the option of delegating admin privileges. <br/><br/>  - User authentication is SSH-key based using a public key assigned to the user profile. <br/><br/>  - This user management is enabled via a site-wide setting. | [ ![User-Management sample](./images/release-notes/access_small.png) ](./images/release-notes/access_large.png#lightbox)  |
| [**Updated Slurm Integration**](https://github.com/Azure/cyclecloud-slurm)<br/>The integration between the Slurm scheduler and CycleCloud has been re-written to use the new autoscaling API. This brings the following autoscaling capabilities to Slurm clusters:<br/><br/>  - Slurm clusters can now autoscale across different VM families. <br/><br/>  - Autoscaling for MPI jobs in Slurm are now placement group aware. |![Slurm sample](./images/release-notes/slurm.png) |
| [**Larger Clusters**](custom-images.md)<br/>Improvements in the provisioning and orchestration layer in this release increases the size of clusters CycleCloud is able to manage. Cluster sizes of up to 5000 nodes and over 150,000 cores are now possible. | [ ![Larger Cluster sample](./images/release-notes/10k-cluster_small.png) ](./images/release-notes/10k-cluster_large.png#lightbox)|
| [**Availability Zones**](cluster-references/cluster-template-reference.md)<br/>CycleCloud now supports the use of [availability zones](https://docs.microsoft.com/azure/availability-zones/az-overview). This allows users to pin cluster nodes to specific AZs. By pinning cluster nodes to a single AZ, a user is able to specify that the VMs in the cluster nodes are started within the same zone to improve latency. | ![Availability Zone sample](./images/release-notes/availability-zone.png) |

## Release Notes

Comprehensive release notes for the individual 7.8.x releases are listed below

* [**7.8.0 Release Notes**](release-notes/7-8-0.md) - released on 7/18/19

Release notes from [older versions](release-notes-archive.md) are also available.