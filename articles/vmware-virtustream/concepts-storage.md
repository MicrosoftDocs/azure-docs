---
title: Concepts - Storage in Azure VMware Solution by Virtustream (AVSV) Private Clouds
description: Learn about the key storage capabilities in Azure VMware Solution by Virtustream private cloud clusters.
services: avsv-service
author: v-jetome

ms.service: avsv-service
ms.topic: conceptual
ms.date: 7/8/2019
ms.author: v-jetome 
ms.custom: 

---

# VMware Solution on Azure by Virtustream Storage Concepts

AVSV private clouds provide native, cluster-wide storage with VMware vSAN. All local storage from each host in a cluster is used in a vSAN datastore, and data-at-rest encryption is available and enabled by default. Private cloud connectivity to Azure Storage resources over the Azure network backbone provides SLA-driven access to any type of Azure storage account and, along with scaling of clusters, enables on-demand or permanent storage capacity versatility.

## VSAN Clusters

All of the local storage in each cluster host is used as part of a vSAN datastore, two datastores per host. All datastores utilize an NVMe cache tier of 1.6TB with the raw, per host, SSD-based capacity shown in the table below. The size of the raw capacity tier of a cluster is the per host capacity times the number of hosts. For example, a four host cluster of High-End hosts will provide 61.6TB raw capacity in the vSAN capacity tier.

| Host type                   |  Raw SSD capacity |
| :---                        |       :---:       |
| High-end                    |      15.4TB       |
| General purpose             |       7.7TB       |

All of the local storage in cluster hosts is used in cluster-wide vSAN datastores. All datastores are created as part of a private cloud deployment and they are available for use immediately. The cloudadmin user and all users in the CloudAdmin group can manage datastores with these vSAN privileges:
- Datastore.AllocateSpace
- Datastore.Browse
- Datastore.Config
- Datastore.DeleteFile
- Datastore.FileManagement
- Datastore.UpdateVirtualMachineMetadata

## Data-at-Rest Encryption

All vSAN datastores implement data-at-rest encryption by default. The encryption solution is KMS-based and supports vCenter operations for key management. Keys are stored encrypted, wrapped by an HSM-based Azure Key Vault master key. Encrypted disks and encryption keys are a key part of host lifecycle management in that when a host is removed from a cluster for any reason, data on disks can be invalidated immediately by _____.

## Scaling

Native cluster storage capacity is scaled by adding hosts to a cluster. For clusters that use High-end hosts, the raw cluster-wide capacity tier storage capacity is increased by 15.4TB with each additional host. Clusters that are built with General Purpose hosts have their raw capacity increased by 7.7TB with each additional host. In both types of clusters, hosts take about 10 minutes to be added to a cluster. See the <create and scale private cloud cluster tutorials> for instructions on scaling clusters.

## Azure storage integration

Azure storage services such as Storage Accounts, Table Storage, and Blob Storage can be consumed by services running in a private cloud. Network connecivity to any Azure service travels over the Azure backbone network and never over the internet. This provides additional security and use of SLA-based Azure storage features in your private cloud workloads.

## Next steps <this is always called Next steps and a short statement and the following div puts it into a blue box that is an active link that can be selected>



> [!div class="nextstepaction"]
> [link description][relative link]

<!-- LINKS - external-->

<!-- LINKS - internal -->
