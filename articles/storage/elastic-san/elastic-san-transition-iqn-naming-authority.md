---
title: Update IQN Naming Authority on Azure Elastic SAN Volumes
description: Learn how to transition the iSCSI Qualified Name (IQN) naming authority for Azure Elastic SAN volumes that are already connected to clients.
ms.service: azure-elastic-san-storage
author: shaynasrag
ms.author: ssragovicz
ms.reviewer: rogarana
ms.date: 04/15/2026
ms.topic: how-to
ms.custom: references_regions
---

# Transition IQN naming authority

Elastic SAN volume groups issue a unique identifier called an iSCSI Qualified name (IQN) that your volumes use to connect. As of June 30, 2025, all new volume groups issue an IQN using the naming authority `net.azure.storage`. If you have volume groups that were created prior to June 30, 2025, you may be connected to volumes using the authority `net.windows.core` and we recommend you transition to the naming authority `net.azure.storage` using the steps outlined in this article.

## Regional availability

The `net.azure.storage` naming authority is currently available in East Asia, Canada Central, South Central US, and West Central US.

## Prerequisites

Before you transition IQN naming authorities, please ensure the following prerequisites are met:
-  An Elastic SAN volume in [one of the appropriate regions](#regional-availability) connected using the `net.windows.core` naming authority. 
    - You can verify your active connections by running the following commands depending on your operating system 
        - Linux:  `sudo iscsiadm -m session `
        - Windows:  `iscsicli SessionList   `  
- Verify that your Azure Elastic SAN's connection script for the volume in question is using the `net.azure.storage` naming authority. If it's not, you can't migrate yet.

## Transition naming authority 

1. Stop all applications and services that are accessing the affected volumes.  
1. Verify that your volume has active connections using the `iscsiadm` or `iscsicli` command
1. Copy the appropriate disconnect script into a file on each VM connected to your affected volumes and run the script with the `net.windows.storage` IQNs.  
    - [Linux](https://github.com/Azure-Samples/azure-elastic-san/blob/main/iqnMigrationCustomDisconnectScripts/disconnect_iqnv1_linux.py): 
        - `Example Command: python3 disconnect.py [IQN A], [IQN B] `
    - [Windows PowerShell](https://github.com/Azure-Samples/azure-elastic-san/blob/main/iqnMigrationCustomDisconnectScripts/disconnect_iqnv1_windows.ps1): 
        - `Example Command: .\disconnect.ps1 [IQN A], [IQN B], [IQN C]  `
1. Restart the VM. 
1. Once the VM restarts, verify that there are no active connections.  
1. Retrieve your connect script from portal for the disconnected volume(s) and run it on the VM(s) to reattach the volume(s).  
1. Restart the VM.  
1. Once the VM restarts, verify that your volume has active connections.  
1. Start your applications and services again, resuming your workloads.  
