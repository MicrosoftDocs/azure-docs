---
title: Use clustered applications on Azure Elastic SAN Preview
description: Learn more about using clustered applications on an Elastic SAN Preview volume and sharing volumes between compute clients.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 10/19/2023
ms.author: rogarana
ms.custom: references_regions
---

# Use clustered applications on Azure Elastic SAN Preview

Azure Elastic SAN volumes can be simultaneously attached to multiple compute clients, allowing you to deploy or migrate cluster applications to Azure. You need to use a cluster manager to share an Elastic SAN volume, like Windows Server Failover Cluster (WSFC), or Pacemaker. The cluster manager handles cluster node communications and write locking. Elastic SAN doesn't natively offer a fully managed filesystem that can be accessed over SMB or NFS.

When used as a shared volume, elastic SAN volumes can be shared across availability zones or regions. If you share a volume across availability zones, you should select [zone-redundant storage (ZRS)](elastic-san-planning.md#redundancy) when deploying your SAN. Sharing a volume in a local-redundant storage SAN across zones reduces your performance due to increased latency between the volume and clients.

## Limitations

- Volumes in an Elastic SAN using [ZRS](elastic-san-planning.md#redundancy) can't be used as shared volumes.
- Elastic SAN connection scripts can be used to attach shared volumes to virtual machines in Virtual Machine Scale Sets or virtual machines in Availability Sets. Fault domain alignment isn't supported.
- The maximum number of sessions a shared volume supports is 128.
    - An individual client can create multiple sessions to an individual volume for increased performance. For example, if you create 32 sessions on each of your clients, only four clients could connect to a single volume.

See [Support for Azure Storage features](elastic-san-introduction.md#support-for-azure-storage-features) for other limitations of Elastic SAN.

## Regional availability

All regions that Elastic SAN is available in can use shared volumes.

## How it works

Elastic SAN shared volumes use [SCSI-3 Persistent Reservations](https://www.t10.org/members/w_spc3.htm) to allow initiators (clients) to control access to a shared elastic SAN volume. This protocol enables an initiator to reserve access to an elastic SAN volume, limit write (or read) access by other initiators, and persist the reservation on a volume beyond the lifetime of a session by default.

SCSI-3 PR has a pivotal role in maintaining data consistency and integrity within shared volumes in cluster scenarios. Compute nodes in a cluster can read or write to their attached elastic SAN volumes based on the reservation chosen by their cluster applications.

## Persistent reservation flow

The following diagram illustrates a sample 2-node clustered database application that uses SCSI-3 PR to enable failover from one node to the other.

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

The following commands are supported with Elastic SAN volumes:

To interact with the volume, start with the appropriate persistent reservation action:
- PR_REGISTER_KEY
- PR_REGISTER_AND_IGNORE
- PR_GET_CONFIGURATION
- PR_RESERVE
- PR_PREEMPT_RESERVATION
- PR_CLEAR_RESERVATION
- PR_RELEASE_RESERVATION

When using PR_RESERVE, PR_PREEMPT_RESERVATION, or PR_RELEASE_RESERVATION, provide one of the following persistent reservation type:
- PR_NONE
- PR_WRITE_EXCLUSIVE
- PR_EXCLUSIVE_ACCESS
- PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY
- PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY
- PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS
- PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS

Persistent reservation type determines access to the volume from each node in the cluster.

|Persistent Reservation Type  |Reservation Holder  |Registered  |Others  |
|---------|---------|---------|---------|
|NO RESERVATION     |N/A         |Read-Write         |Read-Write         |
|WRITE EXCLUSIVE     |Read-Write         |Read-Only         |Read-Only         |
|EXCLUSIVE ACCESS     |Read-Write         |No Access         |No Access         |
|WRITE EXCLUSIVE - REGISTRANTS ONLY    |Read-Write         |Read-Write         |Read-Only         |
|EXCLUSIVE ACCESS - REGISTRANTS ONLY    |Read-Write         |Read-Write         |No Access         |
|WRITE EXCLUSIVE - ALL REGISTRANTS     |Read-Write         |Read-Write         |Read-Only         |
|EXCLUSIVE ACCESS - ALL REGISTRANTS     |Read-Write         |Read-Write         |No Access         |

You also need to provide a persistent-reservation-key when using:
- PR_RESERVE
- PR_REGISTER_AND_IGNORE 
- PR_REGISTER_KEY 
- PR_PREEMPT_RESERVATION 
- PR_CLEAR_RESERVATION 
- PR_RELEASE-RESERVATION.
