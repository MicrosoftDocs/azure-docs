---
title: Concepts - Storage
description: Learn about the key storage capabilities in Azure VMware Solution (AVS) Preview private clouds.
ms.topic: conceptual
ms.date: 05/04/2020
---

# Azure VMware Solution (AVS) Preview storage concepts

AVS private clouds provide native, cluster-wide storage with VMware vSAN. All local storage from each host in a cluster is used in a vSAN datastore, and data-at-rest encryption is available and enabled by default. You can use Azure Storage resources to extend storage capabilities of your private clouds.

## vSAN clusters

Local storage in each cluster host is used as part of a vSAN datastore. All diskgroups use an NVMe cache tier of 1.6 TB with the raw, per host, SSD-based capacity of 15.4 TB. The size of the raw capacity tier of a cluster is the per host capacity times the number of hosts. For example, a four host cluster will provide 61.6-TB raw capacity in the vSAN capacity tier.

Local storage in cluster hosts is used in cluster-wide vSAN datastore. All datastores are created as part of a private cloud deployment and are available for use immediately. The cloudadmin user and all users in the CloudAdmin group can manage datastores with these vSAN privileges:
- Datastore.AllocateSpace
- Datastore.Browse
- Datastore.Config
- Datastore.DeleteFile
- Datastore.FileManagement
- Datastore.UpdateVirtualMachineMetadata

## Data-at-rest encryption

vSAN datastores use data-at-rest encryption by default. The encryption solution is KMS-based and supports vCenter operations for key management. Keys are stored encrypted, wrapped by an HSM-based Azure Key Vault master key. When a host is removed from a cluster for any reason, data on SSDs is invalidated immediately.

## Scaling

Native cluster storage capacity is scaled by adding hosts to a cluster. For clusters that use HE hosts, the raw cluster-wide capacity is increased by 15.4 TB with each additional host. Clusters that are built with GP hosts have their raw capacity increased by 7.7 TB with each additional host. In both types of clusters, hosts take about 10 minutes to be added to a cluster. See the [scale private cloud tutorial][tutorial-scale-private-cloud] for instructions on scaling clusters.

## Azure storage integration

You can use Azure storage services on workloads running in your private cloud. The Azure storage services include Storage Accounts, Table Storage, and Blob Storage. The connection of workloads to Azure storage services doesn't traverse the internet. This connectivity provides additional security and enables you to use SLA-based Azure storage services in your private cloud workloads.

## Next steps

The next step is to learn about [private cloud identity concepts][concepts-identity].

<!-- LINKS - external-->

<!-- LINKS - internal -->
[tutorial-scale-private-cloud]: ./tutorial-scale-private-cloud.md
[concepts-identity]: ./concepts-identity.md
