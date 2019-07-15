---
title: Concepts - Storage in Azure VMware Solution by Virtustream (AVSV) Private Clouds
description: Learn about the key storage capabilities in Azure VMware Solution by Virtustream private clouds.
services: 
author: v-jetome

ms.service: vmware-virtustream
ms.topic: conceptual
ms.date: 7/22/2019
ms.author: v-jetome 
ms.custom: 

---

# Azure VMware Solution by Virtustream Storage Concepts

AVS by Virtustream private clouds provide native, cluster-wide storage with VMware vSAN. All local storage from each host in a cluster is used in a vSAN datastore, and data-at-rest encryption is available and enabled by default. Private cloud connectivity to Azure Storage resources provides SLA-driven access to any type of Azure storage account and, along with scaling of clusters, enables on-demand or permanent storage capacity versatility.

## vSAN Clusters

All of the local storage in each cluster host is used as part of a vSAN datastore, two diskgroups for High-end (HE) hosts and one diskgroup for General-purpose hosts. All diskgroups use an NVMe cache tier of 1.6TB with the raw, per host, SSD-based capacity shown in the table below. The size of the raw capacity tier of a cluster is the per host capacity times the number of hosts. For example, a four host cluster of HE hosts will provide 61.6TB raw capacity in the vSAN capacity tier.

| Host type                   |  Raw SSD capacity |
| :---                        |       :---:       |
| High-end                    |      15.4TB       |
| General-purpose             |       7.7TB       |

All of the local storage in cluster hosts is used in cluster-wide vSAN datastore. All datastores are created as part of a private cloud deployment and they are available for use immediately. The cloudadmin user and all users in the CloudAdmin group can manage datastores with these vSAN privileges:
- Datastore.AllocateSpace
- Datastore.Browse
- Datastore.Config
- Datastore.DeleteFile
- Datastore.FileManagement
- Datastore.UpdateVirtualMachineMetadata

## Data-at-Rest Encryption

All vSAN datastores implement data-at-rest encryption by default. The encryption solution is KMS-based and supports vCenter operations for key management. Keys are stored encrypted, wrapped by an HSM-based Azure Key Vault master key. Encrypted disks and encryption keys are a key part of host lifecycle management and when a host is removed from a cluster for any reason, data on SSDs is invalidated immediately.

## Scaling

Native cluster storage capacity is scaled by adding hosts to a cluster. For clusters that use HE hosts, the raw cluster-wide capacity tier storage capacity is increased by 15.4TB with each additional host. Clusters that are built with GP hosts have their raw capacity increased by 7.7TB with each additional host. In both types of clusters, hosts take about 10 minutes to be added to a cluster. See the [scale private cloud tutorial][tutorial-scale-private-cloud] for instructions on scaling clusters.

## Azure storage integration

Azure storage services such as Storage Accounts, Table Storage, and Blob Storage can be consumed by services running in a private cloud. This network connectivity to any Azure service does not traverse the internet, enabling additional security and the use of SLA-based Azure storage features in your private cloud workloads.

## Next steps

The next step is to learn about [private cloud identity concepts][concepts-identity].

<!-- LINKS - external-->

<!-- LINKS - internal -->
[tutorials-scale-private-cloud]: ./tutorials-scale-private-cloud.md
[concepts-identity]: ./concepts-identity.md