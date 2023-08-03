---
title: Share Elastic SAN volumes between compute clients
description: Understand planning for an Azure Elastic SAN deployment. Learn about storage capacity, performance, redundancy, and encryption.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 08/03/2023
ms.author: rogarana
ms.custom: ignite-2022
---

# Shared volumes

Azure Elastic SAN volumes can be simultaneously attached to multiple compute clients, allowing you to deploy or migrate cluster applications to Azure. You need to use a cluster manager to share an Elastic SAN volume, like Windows Server Failover Cluster (WSFC), or Pacemaker. The cluster manager handles cluster node communications and write locking. Elastic SAN doesn't natively offer a fully managed filesystem that can be accessed over SMB or NFS.

## How it works

## Persistent reservation flow

## Supported SCSI PR commands

The following commands are supported with Elastic SAN volumes:

To interact with the volume, start with the appropriate persistent reservation action:
PR_REGISTER_KEY
PR_REGISTER_AND_IGNORE
PR_GET_CONFIGURATION
PR_RESERVE
PR_PREEMPT_RESERVATION
PR_CLEAR_RESERVATION
PR_RELEASE_RESERVATION

When using PR_RESERVE, PR_PREEMPT_RESERVATION, or PR_RELEASE_RESERVATION, provide one of the following persistent reservation type:
PR_NONE
PR_WRITE_EXCLUSIVE
PR_EXCLUSIVE_ACCESS
PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY
PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY
PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS
PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS

Persistent reservation type will determine access to the volume from each node in the cluster.


|Persistent Reservation Type  |Reservation Holder  |Registered  |Others  |
|---------|---------|---------|---------|
|NO RESERVATION     |N/A         |Read-Write         |Read-Write         |
|WRITE EXCLUSIVE     |Read-Write         |Read-Only         |Read-Only         |
|EXCLUSIVE ACCESS     |Read-Write         |No Access         |No Access         |
|WRITE EXCLUSIVE - REGISTRANTS ONLY    |Read-Write         |Read-Write         |Read-Only         |
|EXCLUSIVE ACCESS - REGISTRANTS ONLY    |Read-Write         |Read-Write         |No Access         |
|WRITE EXCLUSIVE - ALL REGISTRANTS     |Read-Write         |Read-Write         |Read-Only         |
|EXCLUSIVE ACCESS - ALL REGISTRANTS     |Read-Write         |Read-Write         |No Access         |

You also need to provide a persistent-reservation-key when using PR_RESERVE, PR_REGISTER_AND_IGNORE, PR_REGISTER_KEY, PR_PREEMPT_RESERVATION, PR_CLEAR_RESERVATION, or PR_RELEASE-RESERVATION.