---
title: Back up Azure Kubernetes Service (AKS) cluster using Azure Backup 
description: This article explains how to back up Azure Kubernetes Service (AKS) cluster using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.date: 02/28/2023
author: jyothisuri
ms.author: jsuri
---

# Back up Azure Kubernetes Service cluster using Azure Backup (preview) 

This article describes how to configure and back up Azure Kubernetes Service (AKS) cluster.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Before you start

- AKS backup allows you to back up AKS cluster resources and Persistent Volumes attached to it. Currently, only Azure Disk based Persistent Volumes (enabled by CSI Driver) are supported for backups. The backups are stored in Operational datastore only (backup data is stored in your tenant only and isn’t moved to a vault).  The Backup vault and AKS cluster should be in the same region.

- AKS backup uses a blob container and a resource group to store the backups. The blob container has the AKS cluster resources stored in it, whereas the Persistent Volume Snapshots are stored in the resource group. The AKS cluster and the storage locations must reside in the same region. Learn how  to create a Blob Container  <Link to set of instructions>.
•	Currently, AKS Backup supports once a day backup as well as more frequent backups per day with options to back up in every 4-, 8-, and 12-hour intervals.  This solution allows you to retain your data for restore for up to 360 days.

You can create a backup policy to define the backup schedule (frequency to perform backup) and retention duration (duration to retain the backups). 
•	You must install the Backup Extension to configure backup and restore operations on an AKS cluster. The Backup Extension requires a Blob container in input where the cluster resources get backed up. You can use AKS backups to perform restores to the original AKS cluster that is backed up to alternate AKS cluster; however, the cluster should have the Backup Extension installed in it.
•	Ensure that the Microsoft.KubernetesConfiguration and Microsoft.DataProtection provider are registered for your subscription before initiating backup configuration and restore operations.
For more information on the supported scenarios, limitations, and availability, see the support matrix.





















## Next steps

- []()

