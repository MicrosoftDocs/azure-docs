---
title: Use clustered applications on Azure Elastic SAN
description: Learn how to deploy clustered applications on an Elastic SAN volumes and share Elastic SAN volumes between compute clients.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: concept-article
ms.date: 01/08/2026
ms.author: rogarana
ms.custom:
  - references_regions
  - ignite-2023-elastic-SAN
# Customer intent: As a cloud administrator, I want to deploy clustered applications on Azure Elastic SAN volumes, so that I can enhance data consistency and availability across multiple compute clients while managing reservations and access controls effectively.
---

# Deploy clustered applications on Azure Elastic SAN

You can attach Azure Elastic SAN volumes to multiple compute clients at the same time, so you can deploy or migrate cluster applications to Azure. To share an Elastic SAN volume, you need to use a cluster manager, such as Windows Server Failover Cluster (WSFC) or Pacemaker. The cluster manager handles cluster node communications and write locking. Elastic SAN doesn't natively offer a fully managed filesystem that can be accessed over SMB or NFS.

When used as a shared volume, Elastic SAN volumes can be shared across availability zones or regions. Sharing a volume in a local-redundant storage SAN across zones reduces your performance due to increased latency between the volume and clients.

## Limitations

- You can use Elastic SAN connection scripts to attach shared volumes to virtual machines in Virtual Machine Scale Sets or virtual machines in Availability Sets. Fault domain alignment isn't supported.
- A shared volume supports up to 128 sessions.
    - An individual client can create multiple sessions to an individual volume for increased performance. For example, if you create 32 sessions on each of your clients, only four clients could connect to a single volume.

For other limitations of Elastic SAN, see [Support for Azure Storage features](elastic-san-introduction.md#support-for-azure-storage-features).

## How it works

Elastic SAN shared volumes use [SCSI-3 Persistent Reservations](https://www.t10.org/members/w_spc3.htm) to allow initiators (clients) to control access to a shared Elastic SAN volume. This protocol enables an initiator to reserve access to an Elastic SAN volume, limit write (or read) access by other initiators, and persist the reservation on a volume beyond the lifetime of a session by default.

SCSI-3 PR plays a pivotal role in maintaining data consistency and integrity within shared volumes in cluster scenarios. Compute nodes in a cluster can read or write to their attached Elastic SAN volumes based on the reservation chosen by their cluster applications.

## Persistent reservation flow

The following diagram illustrates a sample two-node clustered database application that uses SCSI-3 PR to enable failover from one node to the other.

:::image type="content" source="media/elastic-san-shared-volumes/elastic-san-shared-volume-cluster.png" alt-text="Diagram that shows clustered application." lightbox="media/elastic-san-shared-volumes/elastic-san-shared-volume-cluster.png":::

The flow is as follows:

1. The clustered application running on both Azure VM1 and VM2 registers its intent to read or write to the elastic SAN volume.
1. The application instance on VM1 then takes an exclusive reservation to write to the volume.
1. This reservation is enforced on your volume and the database can now exclusively write to the volume. Any writes from the application instance on VM2 fail.
1. If the application instance on VM1 goes down, the instance on VM2 can initiate a database failover and take over control of the volume.
1. This reservation is now enforced on the volume, and it won't accept writes from VM1. It only accepts writes from VM2.
1. The clustered application can complete the database failover and serve requests from VM2.

The following diagram illustrates another common clustered workload consisting of multiple nodes reading data from an elastic SAN volume for running parallel processes, such as training of machine learning models.

:::image type="content" source="media/elastic-san-shared-volumes/elastic-san-shared-volume-machine-learning.png" alt-text="Diagram that shows a machine learning cluster." lightbox="media/elastic-san-shared-volumes/elastic-san-shared-volume-machine-learning.png":::

The flow is as follows:
1. The clustered application running on all VMs registers its intent to read or write to the elastic SAN volume.
1. The application instance on VM1 takes an exclusive reservation to write to the volume while opening up reads to the volume from other VMs.
1. This reservation is enforced on the volume.
1. All nodes in the cluster can now read from the volume. Only one node writes back results to the volume, on behalf of all nodes in the cluster.

## Supported SCSI PR commands

Elastic SAN volumes support the following commands:

To interact with the volume, start with the appropriate persistent reservation action:
- PR_REGISTER_KEY
- PR_REGISTER_AND_IGNORE
- PR_GET_CONFIGURATION
- PR_RESERVE
- PR_PREEMPT_RESERVATION
- PR_CLEAR_RESERVATION
- PR_RELEASE_RESERVATION

When you use PR_RESERVE, PR_PREEMPT_RESERVATION, or PR_RELEASE_RESERVATION, provide one of the following persistent reservation types:
- PR_NONE
- PR_WRITE_EXCLUSIVE
- PR_EXCLUSIVE_ACCESS
- PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY
- PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY
- PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS
- PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS

The persistent reservation type determines access to the volume from each node in the cluster.

|Persistent Reservation Type  |Reservation Holder  |Registered  |Others  |
|---------|---------|---------|---------|
|NO RESERVATION     |N/A         |Read-Write         |Read-Write         |
|WRITE EXCLUSIVE     |Read-Write         |Read-Only         |Read-Only         |
|EXCLUSIVE ACCESS     |Read-Write         |No Access         |No Access         |
|WRITE EXCLUSIVE - REGISTRANTS ONLY    |Read-Write         |Read-Write         |Read-Only         |
|EXCLUSIVE ACCESS - REGISTRANTS ONLY    |Read-Write         |Read-Write         |No Access         |
|WRITE EXCLUSIVE - ALL REGISTRANTS     |Read-Write         |Read-Write         |Read-Only         |
|EXCLUSIVE ACCESS - ALL REGISTRANTS     |Read-Write         |Read-Write         |No Access         |

Provide a persistent-reservation-key when you use:
- PR_RESERVE
- PR_REGISTER_AND_IGNORE 
- PR_REGISTER_KEY 
- PR_PREEMPT_RESERVATION 
- PR_CLEAR_RESERVATION 
- PR_RELEASE-RESERVATION.
